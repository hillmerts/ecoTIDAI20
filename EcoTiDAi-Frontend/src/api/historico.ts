import fetchApi from "./base";
import { APIConsolidado, APIPuntoHistorico } from "./types/historico";

export const obtenerPuntos = async (
    fechaInicio: Date|null,    
    fechaFin: Date|null,
    ) : Promise<APIPuntoHistorico[]> => {

        try{
            let params : any = {"tipo": "historico"}
            if(fechaInicio != null) params = {...params, "fechaInicio": fechaInicio}
            if(fechaFin != null) params = {...params, "fechaFin": fechaFin}
            const response = await fetchApi.get(
                `/recoleccion/obtener_puntos/`,
                { params }
            );
            
            return response.data;

        } catch (error) {
            console.error(error);
        }   
         
        return Promise.reject('Fallo al obtener puntos pendientes de recoleccion');
    }

export const cargarConsolidados = async (
    fechaInicio: Date|null,
    fechaFin: Date|null,
    ): Promise<APIConsolidado> => {
        let params: any = {}
        if(fechaInicio != null) params = {"fechaInicio": fechaInicio}
        if(fechaFin != null) params = {...params, "fechaFin": fechaFin}
        try {
            const response = await fetchApi.get(
                `/recoleccion/obtener_consolidados/`,
                {params}
            );
            return response.data;
        }catch(error){
            console.error(error);
        }

        return Promise.reject('Fallo al obtener los datos historicos');
}