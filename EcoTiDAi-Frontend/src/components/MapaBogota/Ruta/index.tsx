import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import { FC, useEffect } from 'react';
import { Punto } from "constant";


interface RutaProps {
    puntos: Punto[];
}

const Ruta: FC<RutaProps> = ({puntos}) => {

    const map = useMap();
    useEffect(() => {
        if (!map) return;
        const routingControl = L.Routing.control({
            
            waypoints: puntos.map((punto)=> L.latLng(punto.latitud, punto.longitud)),
            lineOptions: {
            styles: [{ color: "#2FAC66", weight: 4 }],
            extendToWaypoints: false,
            missingRouteTolerance: 0
            },
            collapsible: false,
            show: false,
            // draggableWaypoints: false,
            fitSelectedRoutes: true,
            showAlternatives: true,
            addWaypoints: false
        }).addTo(map);

        
    },[map, puntos])
      return null;
}


export default Ruta;