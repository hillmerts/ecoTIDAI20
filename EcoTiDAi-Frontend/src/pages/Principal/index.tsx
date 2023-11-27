import React, { FC } from "react";
import styles from "./styles.module.scss";
import { Outlet, useLocation } from "react-router-dom";
import Menu from "../../components/Menu";
import { observer } from "mobx-react-lite";

const Principal: FC = () => {
    const location = useLocation();
    return (
        <div className={styles.main}>
            <div className={styles.menu}>
                <Menu />
            </div>
            {location.pathname === "/" &&
                <div className={styles.center}>
                    <h1>Bienvenido a <br/> EcoTiDAI</h1>
                </div>
            }
            <Outlet />
             
        </div>
    );
}

export default observer(Principal);