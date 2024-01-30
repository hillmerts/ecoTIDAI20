import React, { FC } from "react";
import * as leaflet from 'leaflet';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-cluster'
import "leaflet/dist/leaflet.css"
import styles from './styles.module.scss';
import { Posicion } from "constant";
import { observer } from "mobx-react-lite";

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import Ruta  from "./Ruta";

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

interface PuntoRuta {
    latitud: number;
    longitud: number;
}

interface MapProps{
    ubicaciones?: Posicion[];
    ruta?: PuntoRuta[];
}

const MapaBogota: FC<MapProps> = ({
    ubicaciones,
    ruta,
}) => {

    const posicionBogota : Posicion = {
        direccion: "centro",
        latitud: 4.6097100,
        longitud: -74.0817500,
    };
    return (
        <div id="map">
            <MapContainer center={[posicionBogota.latitud, posicionBogota.longitud]} zoom={13} scrollWheelZoom={true} className={styles.leaflet}>
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MarkerClusterGroup
                    chunkedLoading
                >
                {ubicaciones?.length &&
                ubicaciones?.map((posicion, index) => {
                    return (
                    <Marker position={[posicion.latitud, posicion.longitud]} key={index}>
                    <Popup>
                        {posicion.direccion}
                    </Popup>
                    </Marker>
                    );    
                
                })}
                </MarkerClusterGroup>
                {ruta && 
                <Ruta puntos={ruta}/>
                }
            </MapContainer>
        </div>
    );
}

export default observer(MapaBogota);