import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import styles from './styles.module.scss';
import MapaBogota from "components/MapaBogota";
import { observer } from 'mobx-react-lite'
import { useStore } from "stores";
import { PuntoPendiente } from "stores/models/puntoPendiente";
import { Form } from "react-bootstrap";
import ConfirmacionModal from "components/ConfirmacionModal";
import MensajeModal from "components/MensajeModal";
import { Posicion } from "constant";

interface PuntoARecolectarProps {
  puntoPendiente: PuntoPendiente;
  focusPunto: (id: number) => void;
  recolectarPunto: (id: number) => void;
  reRender: () => void;
}

interface TablaPendientesProps {
  puntosPendientes: PuntoPendiente[];
  focusPunto: (id: number) => void;
  puntoSeleccionado?: PuntoPendiente;
  recolectarPunto: (id: number) => void;
  reRender: () => void;
}

const TablaPendientes = observer(React.forwardRef<HTMLTableRowElement,TablaPendientesProps>((
  {
  puntosPendientes,
  focusPunto,
  puntoSeleccionado,
  recolectarPunto,
  reRender,
},
puntoRef,
) => {

  return (
    <>
    {puntosPendientes.length > 0 &&
    <> 
      <table>
        <thead>
          <tr>
            <td className={styles.td}>Localidad</td>
            <td className={styles.td}>Dirección</td>
            <td className={styles.td}>Cantidad</td>
            <td className={styles.tdRecoleccion}>Recogida</td>
          </tr>
        </thead>
        <tbody>
          {puntosPendientes.map((punto: PuntoPendiente) => {
            return (
            <PuntoARecolectar
              key={punto.id}
              puntoPendiente={punto}
              focusPunto={focusPunto}
              ref={puntoRef}
              recolectarPunto={recolectarPunto}
              reRender={reRender}
              />
            )
          })}
        </tbody>
      </table>
      {puntoSeleccionado &&
        <div className={styles.resumenLlantas}>

            <h3>Neumáticos: </h3>

            {puntoSeleccionado.bicicleta > 0 &&
            <p>Bicicleta: {puntoSeleccionado.bicicleta} </p>
            }

            {puntoSeleccionado.motocicleta > 0 &&
            <p>Motocicleta: {puntoSeleccionado.motocicleta} </p>
            }

            {puntoSeleccionado.automovil13 > 0 &&
            <p>Automovil 13": {puntoSeleccionado.automovil13} </p>
            }

            {puntoSeleccionado.automovil14 > 0 &&
            <p>Automovil 14": {puntoSeleccionado.automovil13} </p>
            }

            {puntoSeleccionado.automovil15 > 0 &&
            <p>Automovil 15": {puntoSeleccionado.automovil15} </p>
            }

            {puntoSeleccionado.camioneta16 > 0 &&
            <p>Camioneta 16": {puntoSeleccionado.camioneta16} </p>
            }

            {puntoSeleccionado.camioneta17 > 0 &&
            <p>Camioneta 17": {puntoSeleccionado.camioneta17} </p>
            }

            {puntoSeleccionado.camioneta18 > 0 &&
            <p>Camioneta 18": {puntoSeleccionado.camioneta18} </p>
            }

            {puntoSeleccionado.camioneta19 > 0 &&
            <p>Camioneta 19" a 22.5": {puntoSeleccionado.camioneta19} </p>
            }

            {puntoSeleccionado.especiales > 0 &&
            <p>Especiales y/o Maquinaria: {puntoSeleccionado.especiales} </p>
            }
        </div>
      }
    </>
    }
    </>
  );
}))


const PuntoARecolectar = observer(React.forwardRef<HTMLTableRowElement,PuntoARecolectarProps>((
  {
  puntoPendiente,
  focusPunto,
  recolectarPunto,
  reRender,
}, puntoRef
) => {
  const [checked, setChecked] = useState<boolean>(puntoPendiente.recoleccion);
  const [error, setError] = useState<boolean>(false);
  const [showConfirmacion, setShowConfirmacion] = useState<boolean>(false);
  const [mensaje, setMensaje] = useState<string>("");
  const [showMensaje, setShowMensaje] = useState<boolean>(false);

  const handleConfirm = useCallback(()=>{
    try{
      recolectarPunto(puntoPendiente.id);
    }catch{
      setError(true);
    }
    setShowMensaje(true);
    setShowConfirmacion(false);
  }, [recolectarPunto, puntoPendiente.id])

  const handleCancel = useCallback(()=>{
    setChecked(false);
    setMensaje("");
    setShowConfirmacion(false);
  },[])


  const handleRecoleccion = useCallback(()=>{
    setChecked(!checked);
    setMensaje(`Desea recolectar las llantas en la dirección ${puntoPendiente.direccion}?`);
    setShowConfirmacion(true);
  }, [puntoPendiente.direccion])


  return (
    <>
      <ConfirmacionModal
            show={showConfirmacion}
            encabezado={'Puntos Pendientes'}
            mensaje={mensaje}
            handleConfirm={handleConfirm}
            handleCancel={handleCancel}
          />
          <MensajeModal
            error={error}
            show={showMensaje}
            encabezado="Puntos Pendientes"
            mensaje={!error ? "El punto ha sido recolectado exitosamente" : "Error en el servidor"}
            handleClose={()=> { setShowMensaje(false); setError(false); if(!error) reRender();}}
          />
      <tr
        tabIndex={0}
        onClick={()=> focusPunto(puntoPendiente.id)}
        className={styles.focused}
        ref={puntoRef}
      >
        <td className={styles.td}>{puntoPendiente.localidad}</td>
        <td className={styles.td}>{puntoPendiente.direccion}</td>
        <td className={styles.td}>{puntoPendiente.totalLlantas}</td>

        <td className={styles.tdRecoleccion}>
          <Form.Check
          checked={checked}
          disabled={puntoPendiente.recoleccion}
          onChange={handleRecoleccion}
          />
          </td>
      </tr>
    </>
  );
}))


const PuntosPendientes: FC = () => {

    const store = useStore();


    const [reRender, setReRender] = useState<boolean>(true);
    const puntoRef = useRef<HTMLTableRowElement>(null);
    const puntoSeleccionado = useRef<PuntoPendiente>();
    const [ubicacionesMapa, setUbicacionesMapa] = useState<Posicion[]>([]);

    const focusPunto = useCallback((id: number)=>{
      const punto = store.puntosPendientes.puntos.find((punto) => punto.id === id);
      puntoRef.current?.focus()
      puntoSeleccionado.current = punto;
      
      if (punto) setUbicacionesMapa([punto.Posicion]);
    }, [])

    const clearFocus = useCallback(() => {
      puntoRef.current?.blur();
      setUbicacionesMapa(store.puntosPendientes.posiciones)
      puntoSeleccionado.current = undefined;
    }, [])

    const recolectarPunto = useCallback((id: number) => {
      try{
        store.puntosPendientes.recolectar(id);
      }catch(e){
        console.error(e);
        throw e;
      }
    },[store.puntosPendientes])

    useEffect(()=>{
      if (reRender) {
        const fetchData = async () => {
          await store.puntosPendientes.cargarPuntosPendientes();
          setUbicacionesMapa(store.puntosPendientes.posiciones);  
        }
        fetchData().catch(console.error)
        setReRender(false);
      }
    },[reRender])

    useEffect(() => {
      console.log(ubicacionesMapa);
    },[ubicacionesMapa]);

    return (
      <>
        
        <div className={styles.layout}>
          <div className={styles.mapa}>
              <MapaBogota
                ubicaciones={ubicacionesMapa}
              />
          </div>
          <div className={styles.info} onClick={() => clearFocus()}>
              <h1>Puntos Pendientes</h1>
              <p>Los siguientes puntos se encuentran pendientes de Recolección</p>
              <TablaPendientes
                puntosPendientes={store.puntosPendientes.puntos}
                focusPunto={focusPunto}
                puntoSeleccionado={puntoSeleccionado.current}
                recolectarPunto={recolectarPunto}
                reRender={() => setReRender(true)}
              />
          </div>
        </div>
      </>  
    );
}

export default observer(PuntosPendientes);