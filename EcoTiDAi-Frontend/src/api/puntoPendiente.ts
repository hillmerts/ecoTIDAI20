import fetchApi from "./base";
import { APIAgregarPuntoRecoleccion, APIPuntoRecoleccion } from "./types/puntoPendiente";

export const obtenerPuntos = async (    
    ) : Promise<APIPuntoRecoleccion[]> => {

        try{
        const params : any = {"tipo": "pendiente"}
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

export const agregarPunto = async (
    datosPunto: APIAgregarPuntoRecoleccion
    ) : Promise<APIPuntoRecoleccion> => {
        const formData = new FormData();

        if ('localidad' in datosPunto && datosPunto.localidad) {
            formData.append('localidad', `${datosPunto.localidad}`);
        }

        if ('direccion' in datosPunto && datosPunto.direccion) {
            formData.append('direccion', `${datosPunto.direccion}`);
        }

        if ('bicicleta' in datosPunto && datosPunto.bicicleta) {
            formData.append('bicicleta', `${datosPunto.bicicleta}`);
        }

        if ('motocicleta' in datosPunto && datosPunto.motocicleta) {
            formData.append('motocicleta', `${datosPunto.motocicleta}`);
        }

        if ('automovil13' in datosPunto && datosPunto.automovil13) {
            formData.append('automovil13', `${datosPunto.automovil13}`);
        }

        if ('automovil14' in datosPunto && datosPunto.automovil14) {
            formData.append('automovil14', `${datosPunto.automovil14}`);
        }

        if ('automovil15' in datosPunto && datosPunto.automovil15) {
            formData.append('automovil15', `${datosPunto.automovil15}`);
        }

        if ('camioneta16' in datosPunto && datosPunto.camioneta16) {
            formData.append('camioneta16', `${datosPunto.camioneta16}`);
        }

        if ('camioneta17' in datosPunto && datosPunto.camioneta17) {
            formData.append('camioneta17', `${datosPunto.camioneta17}`);
        }

        if ('camioneta18' in datosPunto && datosPunto.camioneta18) {
            formData.append('camioneta18', `${datosPunto.camioneta18}`);
        }

        if ('camioneta19' in datosPunto && datosPunto.camioneta19) {
            formData.append('camioneta19', `${datosPunto.camioneta19}`);
        }

        if ('especiales' in datosPunto && datosPunto.especiales) {
            formData.append('especiales', `${datosPunto.especiales}`);
        }
        try{
            const response = await fetchApi.post('/recoleccion/agregar_punto/', formData);
            return response.data;
        } catch (error) {
          console.log(error);
          return Promise.reject(error);
        }
        
    }

export const recolectar = async (
        idPunto: number
    ) : Promise<boolean> => {
        try{
        const response = await fetchApi.post(`/recoleccion/${idPunto}/recolectar/`);
          return response.data['recoleccion'];
        } catch (error) {
          console.error(error);
        }
        return Promise.reject('Fallo al recolectar punto de recoleccion');
    }