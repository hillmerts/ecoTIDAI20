import { PuntoCluster } from "constant";
import fetchApi from "./base";

export const obtenerRuta = async (
    
    ) : Promise<PuntoCluster[]> => {

        try{
            const response = await fetchApi.get(
                `/recoleccion/obtener_ruta/`,
            );
            
            console.log(response.data)

            return response.data;


        } catch (error) {
            console.error(error);
        }   
         
        return Promise.reject('Fallo al obtener puntos pendientes de recoleccion');
    }
