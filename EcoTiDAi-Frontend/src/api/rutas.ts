import fetchApi from "./base";
import { APIRuta } from "./types/ruta";

export const obtenerRutas = async (
    
    ) : Promise<APIRuta[]> => {

        try{
            const response = await fetchApi.get(
                `/recoleccion/obtener_ruta/`,
            );

            return response.data;

        } catch (error) {
            console.error(error);
        }   
         
        return Promise.reject('Fallo al obtener puntos pendientes de recoleccion');
    }
