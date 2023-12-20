import React, { FC, useEffect, useState } from "react";
import styles from './styles.module.scss';
import MapaBogota from "../../components/MapaBogota";
import { observer } from "mobx-react-lite";
import { useStore } from "stores";
import Cargando from "components/Cargando";
import { Button } from "react-bootstrap";

const ProximaRuta: FC = () => {

    const store = useStore();
    const [initialized, setInitialized] = useState<boolean>(false);

    const [rutaActual, setRutaActual] = useState<number>(0);

    useEffect(()=>{
      if (!initialized){
        store.clusters.cargarRutas()
        setInitialized(true);
      }
    },[initialized, store.clusters])

    return (
      
      <div className={styles.layout}>
        {store.clusters.rutas.length <= 0 ?
        <Cargando/>
        :
        <>
         <div className={styles.mapa}>
            <MapaBogota ruta={store.clusters.rutas[rutaActual].posiciones}/>
            <Button 
              className={styles.anterior} 
              disabled={rutaActual<1} 
              variant="success" 
              onClick={() => setRutaActual(rutaActual - 1)}
            >
              Ruta anterior
            </Button>
            <Button 
              className={styles.siguiente} 
              disabled={rutaActual>store.clusters.rutas.length - 2} 
              variant="success" 
              onClick={() => setRutaActual(rutaActual - 1)}
            >
              Ruta siguiente
            </Button>
        </div>
        </>
        }
      </div>  
    
    );
}

export default observer(ProximaRuta);