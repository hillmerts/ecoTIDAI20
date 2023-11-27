import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import styles from './styles.module.scss';
import { Button, Col, Form, Row } from "react-bootstrap";
import { Localidad, PuntoPendienteForm } from "constant";
import { observer } from "mobx-react-lite";
import { useStore } from "stores";
import MensajeModal from "components/MensajeModal";

const localidades: Array<Localidad> = ["Usaquén", "Chapinero", "Santa Fe", "San Cristóbal", "Usme", "Tunjuelito", "Bosa", "Kennedy", "Fontibón",
"Engativá", "Suba", "Barrios Unidos", "Teusaquillo", "Los Mártires", "Antonio Nariño", "Puente Aranda",
"La Candelaria", "Rafael Uribe Uribe", "Ciudad Bolívar"];

interface CampoNumericoProps{
  id: string;
  label: string;
  setter: (value: number) => void;
}

const CampoNumerico: FC<CampoNumericoProps> = ({
  id,
  label,
  setter,
}) => {

  const controlId = "form-input-"+id.replace(/\s/g, '-').toLowerCase();
  const [value, setValue] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  useEffect(()=>{
    if(!(value === "")){
      try {
          const numericValue = parseInt(value);
          if (isNaN(numericValue)){
            setValue("");
            setter(0);
            setError(true);
          }else {
            setter(numericValue);
            setError(false);
          }
        
      } catch(e){
        setValue("");
      } 
    }
  }, [value, setValue, setter]);

  return (
    <Form.Group className="sm-3" controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
      type="input"
      placeholder={"Ingrese la cantidad..."}
      value={value}
      onChange={
        (e) => {setValue(e.target.value);}
      }
      />
      {error && 
      <Form.Text style={{color: "red"}}>
          Por favor ingrese un valor numérico
      </Form.Text>
      }
    </Form.Group>
  )

}

const AgregarPunto: FC = () => {

    const store = useStore();

    const [showModal, setShowModal] = useState<boolean>(false);
    const [globalError, setGlobalError] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [localidad, setLocalidad] = useState<Localidad>("Usaquén");
    const [direccion, setDireccion] = useState<string>(""); 
    const [bicicleta, setBicicleta] = useState<number>(0);
    const [motocicleta, setMotocicleta] = useState<number>(0);
    const [automovil13, setAutomovil13] = useState<number>(0);
    const [automovil14, setAutomovil14] = useState<number>(0);
    const [automovil15, setAutomovil15] = useState<number>(0);
    const [camioneta16, setCamioneta16] = useState<number>(0);
    const [camioneta17, setCamioneta17] = useState<number>(0);
    const [camioneta18, setCamioneta18] = useState<number>(0);
    const [camioneta19, setCamioneta19] = useState<number>(0);
    const [especiales, setEspeciales] = useState<number>(0);

    const sumaLlantas = useMemo(()=>{
      return bicicleta+motocicleta+automovil13+
      automovil14+automovil15+camioneta16+
      camioneta17+camioneta18+camioneta19+especiales;
    } , [
      localidad,
      direccion,
      bicicleta,
      motocicleta,
      automovil13,
      automovil14,
      automovil15,
      camioneta16,
      camioneta17,
      camioneta18,
      camioneta19,
      especiales,
    ])

    const limpiarForm = useCallback(()=> {
      setLocalidad("Usaquén");
      setDireccion("");
      setBicicleta(0);
      setMotocicleta(0);
      setAutomovil13(0);
      setAutomovil14(0);
      setAutomovil15(0);
      setCamioneta16(0);
      setCamioneta17(0);
      setCamioneta18(0);
      setCamioneta19(0);
      setEspeciales(0);
    },[
      setLocalidad,
      setDireccion,
      setBicicleta,
      setMotocicleta,
      setAutomovil13,
      setAutomovil14,
      setAutomovil15,
      setCamioneta16,
      setCamioneta17,
      setCamioneta18,
      setCamioneta19,
      setEspeciales,
    ])  
    const enviarPunto = useCallback(()=> {

      if (direccion === ""){
        setGlobalError(true);
        setMessage("La dirección del punto de recoleccion no puede estar vacía")      
      }else if (sumaLlantas <= 0){
        setGlobalError(true);
        setMessage("El numero total de neumáticos a recoger no puede ser cero")
      }else {

        const puntoForm: PuntoPendienteForm = {
          localidad: localidad,
          direccion: direccion,
          bicicleta: bicicleta,
          motocicleta: motocicleta,
          automovil13: automovil13,
          automovil14: automovil14,
          automovil15: automovil15,
          camioneta16: camioneta16,
          camioneta17: camioneta17,
          camioneta18: camioneta18,
          camioneta19: camioneta19,
          especiales: especiales,
        }

        try{
          store.puntosPendientes.agregar(puntoForm);
          limpiarForm();
          setGlobalError(false);
          setMessage("El punto a recoger ha sido agregado exitosamente")
        }catch(error){
          setGlobalError(true);
          setMessage(error as string);
          console.error(error);
        }
      }

      setShowModal(true);

    },[
      localidad,
      direccion,
      bicicleta,
      motocicleta,
      automovil13,
      automovil14,
      automovil15,
      camioneta16,
      camioneta17,
      camioneta18,
      camioneta19,
      especiales,
      store.puntosPendientes,
      limpiarForm,
      setGlobalError,
      setMessage,
      setShowModal,
    ])

    return (
      <>
        <MensajeModal
          error={globalError}
          show={showModal}
          handleClose={() => {setShowModal(false); setGlobalError(false); setMessage("");}}
          encabezado="Agregar Punto"
          mensaje={message}
        />
        <div className={styles.layout}>
          <h1>Recepción de Rutas</h1>
          <Form>
          <Form.Group className="sm-3" controlId="punto-recoleccion-localidad">
              <Form.Label>Localidad</Form.Label>
              <Form.Select
                aria-label="punto-recoleccion-localidad-valor"
                placeholder="Seleccione su localidad" 
                onChange={
                (e) => {setLocalidad(e.target.value as Localidad);}
                }
              >
                {localidades.map((localidad) => {
                  return (
                  <option value={localidad}>
                    {localidad}
                  </option>
                  )
                })}
              </Form.Select>
            </Form.Group>

            <Form.Group className="sm-3" controlId="form-input-direccion">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
              type="address"
              placeholder="Ingrese la dirección"
              onChange={
                (e) => {setDireccion(e.target.value);}
              }
              />
            </Form.Group>

            <h2> Cantidad de Neumáticos</h2>
            <Row>
              <Col>
                <CampoNumerico
                id={"Bicicleta"}
                label={"Bicicleta"}
                setter={setBicicleta}
                />
              </Col>
              <Col>
              <CampoNumerico
                id={"camioneta-16"}
                label={"Camioneta 16 pulgadas"}
                setter={setCamioneta16}
                />
            </Col>
            </Row>
            <Row>
              <Col>
              <CampoNumerico
                id={"Motocicleta"}
                label={"Motocicleta"}
                setter={setMotocicleta}
                />
              </Col>
              <Col>
              <CampoNumerico
                id={"camioneta-17"}
                label={"Camioneta 17 pulgadas"}
                setter={setCamioneta17}
                />
              </Col>
            </Row>
            <Row>
              <Col>
              <CampoNumerico
                id={"automovil-13"}
                label={"Automovil 13 pulgadas"}
                setter={setAutomovil13}
                />
              </Col>
              <Col>
              <CampoNumerico
                id={"camioneta-18"}
                label={"Camioneta 18 pulgadas"}
                setter={setCamioneta18}
                />
              </Col>
            </Row>
            <Row>
              <Col>
              <CampoNumerico
                id={"automovil-14"}
                label={"Automovil 14 pulgadas"}
                setter={setAutomovil14}
                />
              </Col>
              <Col>
              <CampoNumerico
                id={"camioneta-19"}
                label={"Camioneta 19 a 22.5 pulgadas"}
                setter={setCamioneta19}
                />  
              </Col>
            </Row>
            <Row>
              <Col>
              <CampoNumerico
                id={"automovil-15"}
                label={"Automovil 15 pulgadas"}
                setter={setAutomovil15}
                />
              </Col>
              <Col>
              <CampoNumerico
                id={"maquinaria"}
                label={"Especiales y/o Maquinaria"}
                setter={setEspeciales}
                />
              </Col>
            </Row>
            <Button variant="primary" onClick={enviarPunto}>
              Enviar
            </Button>
          </Form>
        </div>
      </>  
    );
}

export default observer(AgregarPunto);