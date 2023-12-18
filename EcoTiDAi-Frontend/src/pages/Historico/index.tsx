import React, { FC, forwardRef, useCallback, useEffect, useRef, useState } from "react";
import styles from './styles.module.scss';
import MapaBogota from "components/MapaBogota";
import Cargando from "components/Cargando"
import { useStore } from "stores";
import { observer } from "mobx-react-lite";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import InputGroup from 'react-bootstrap/InputGroup';
import { Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";

interface DataProps
{
  titulo: string,
  cantidad: number,
  fechaInicio: string,
  fechaFin: string
}

const HistoricoData : FC<DataProps> = observer(({
  titulo,
  cantidad,
  fechaInicio,
  fechaFin,
}) => {
  return (
  <div className={styles.data}>
    <div className={styles.title}>{titulo}</div>
    <div className={styles.number}>{cantidad}</div>
    <div className={styles.date}>desde {fechaInicio} hasta {fechaFin}</div>
  </div>
  );
})

const CustomInput = forwardRef(({value, onClick}: {value?: string, onClick?: ()=> void}, ref: React.Ref<HTMLInputElement>) => (
  <InputGroup onClick={onClick} className="mb-3">
    <Form.Control readOnly value={value} ref={ref}/>
    <InputGroup.Text>
      <FontAwesomeIcon icon={faCalendar} />
    </InputGroup.Text>
  </InputGroup>
));

const Historico: FC = () => {

    const store = useStore();

    const [forceMapRender, setForceMapRender] = useState<number>(1);
    const [fechaInicio, setFechaInicio] = useState<Date|null>(null);
    const [fechaFin, setFechaFin] = useState<Date|null>(null);

    const cargarHistorico = useCallback(()=> {
      const fetchData = async () => {
        await store.historico.cargarPuntosHistorico(fechaInicio,fechaFin);
        await store.historico.cargarConsolidados(fechaInicio,fechaFin);  
      }
        fetchData().then().catch(console.error)
    },[fechaInicio, fechaFin])

    useEffect(()=>{
      cargarHistorico();  
      setForceMapRender(forceMapRender+1);     
    },[fechaInicio,fechaFin])   

    return ( 
        <div className={styles.layout}>
          {!(store.historico.initialized) ?
            <Cargando/>
            :
            <>
            <div className={styles.mapa}>
              {(store.historico.posiciones && forceMapRender) &&
                <MapaBogota
                  ubicaciones={store.historico.posicionesArray}
                  random={forceMapRender}
                />
              }
            </div>
            <div className={styles.info}>
              <div className={styles.dateFlex}>
                <div className={styles.datePick}>
                  <h3>Desde: </h3>
                  <DatePicker
                  selected={fechaInicio}
                  onChange={date => setFechaInicio(date)}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Seleccione desde donde filtrar"
                  minDate={new Date(store.historico.primeraFecha)}
                  customInput={<CustomInput />}
                />
                </div>
                <div className={styles.datePick}>
                  <h3>Hasta: </h3>
                  <DatePicker
                  selected={fechaFin}
                  onChange={date => setFechaFin(date)}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Seleccione hasta donde filtrar"
                  maxDate={new Date()}
                  customInput={<CustomInput />}
                />
                </div> 
              </div>
              <div className={styles.block}>
                <div className={styles.row}>
                  <hr/>
                  <HistoricoData
                    titulo="Neumáticos recogidos"
                    cantidad={store.historico.totalLlantas}
                    fechaInicio={fechaInicio ? fechaInicio.toLocaleDateString("es-CO") :
                     (new Date(store.historico.primeraFecha)).toLocaleDateString("es-CO")}
                    fechaFin={fechaFin ? fechaFin!.toLocaleDateString("es-CO") : (new Date()).toLocaleDateString("es-CO")}
                    />
                    <HistoricoData
                    titulo="PQRS por atender"
                    cantidad={store.historico.pqrsPendientes}
                    fechaInicio={fechaInicio ? fechaInicio.toLocaleDateString("es-CO") :
                     (new Date(store.historico.primeraFecha)).toLocaleDateString("es-CO")}
                    fechaFin={fechaFin ? fechaFin!.toLocaleDateString("es-CO") : (new Date()).toLocaleDateString("es-CO")}
                    />
                </div>
                <div className={styles.row}>
                  <hr/>
                  <HistoricoData
                    titulo="Ubicaciones Atendidas"
                    cantidad={store.historico.ubicacionesAtendidas}
                    fechaInicio={fechaInicio ? fechaInicio.toLocaleDateString("es-CO") :
                     (new Date(store.historico.primeraFecha)).toLocaleDateString("es-CO")}
                    fechaFin={fechaFin ? fechaFin!.toLocaleDateString("es-CO") : (new Date()).toLocaleDateString("es-CO")}
                    />
                  <HistoricoData
                    titulo="Kilómetros Recorridos"
                    cantidad={store.historico.kilometrosRecorridos}
                    fechaInicio={fechaInicio ? fechaInicio.toLocaleDateString("es-CO") :
                     (new Date(store.historico.primeraFecha)).toLocaleDateString("es-CO")}
                    fechaFin={fechaFin ? fechaFin!.toLocaleDateString("es-CO") : (new Date()).toLocaleDateString("es-CO")}
                    />
                </div>
            </div>
            </div>
            </>
          }
        </div>
         
    );
}

export default observer(Historico);