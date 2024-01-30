import { Localidad } from "constant";

export interface APIPuntoRecoleccion {
    id: number,
    fecha: string,
    localidad: Localidad,
    direccion: string,
    bicicleta: number,
    motocicleta: number,
    automovil13: number,
    automovil14: number,
    automovil15: number,
    camioneta16: number,
    camioneta17: number,
    camioneta18: number,
    camioneta19: number,
    especiales: number,
    latitud: number,
    longitud: number,
    recoleccion: boolean,
}

export interface APIAgregarPuntoRecoleccion {
    localidad: Localidad,
    direccion: string,
    bicicleta: number,
    motocicleta: number,
    automovil13: number,
    automovil14: number,
    automovil15: number,
    camioneta16: number,
    camioneta17: number,
    camioneta18: number,
    camioneta19: number,
    especiales: number,
}