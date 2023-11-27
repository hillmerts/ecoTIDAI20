import React, { FC, useEffect, useState } from "react";
import styles from './styles.module.scss';
import MapaBogota from "../../components/MapaBogota";
import { observer } from "mobx-react-lite";
import { useStore } from "stores";
import Cargando from "components/Cargando";

const ProximaRuta: FC = () => {

    const store = useStore();
    const [initialized, setInitialized] = useState<boolean>(false);

    useEffect(()=>{
      if (!initialized){
        store.ruta.cargarRuta()
      }
      setInitialized(true);
    },[initialized, store.ruta])

    return (
      
      <div className={styles.layout}>
        {store.ruta.puntos.length <= 0 ?
        <Cargando/>
        :
        <>
         <div className={styles.mapa}>
            <MapaBogota ruta={store.ruta.puntos}/>
        </div>
        <div className={styles.info}>

        </div>
        </>
        }
      </div>  
    
    );
}

export default observer(ProximaRuta);