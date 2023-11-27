import React, { FC } from "react";
import styles from "./styles.module.scss";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";

const Menu: FC = () => {
    return (
        <div className={styles.menu}>
            <nav>
                <ul>
                    <li style={{float: 'left', fontSize: '14pt'}}>
                        <Link to="/">EcoTiDAI</Link>
                    </li>
                    <li>
                        <Link to="/ProximaRuta">Proxima Ruta</Link>
                    </li>
                    <li>
                        <Link to="/AgregarPunto">Agregar Punto</Link>
                    </li>
                    <li>
                        <Link to="/PuntosPendientes">Puntos Pendientes</Link>
                    </li>
                    <li>
                        <Link to="/Historico">Historico</Link>
                    </li>     
                </ul>
            </nav>         
        </div>
    );
}

export default observer(Menu);