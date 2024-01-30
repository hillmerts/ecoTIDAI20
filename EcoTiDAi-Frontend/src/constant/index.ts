export interface Posicion{
    direccion: string,
    longitud: number;
    latitud: number;
}

export type Localidad = "Usaquén" | "Chapinero" | "Santa Fe" | "San Cristóbal" |
"Usme" | "Tunjuelito" | "Bosa" | "Kennedy" | "Fontibón" |
"Engativá" | "Suba" | "Barrios Unidos" | "Teusaquillo" | "Los Mártires" |
"Antonio Nariño" | "Puente Aranda" | "La Candelaria" | "Rafael Uribe Uribe" |
"Ciudad Bolívar";

export interface PuntoPendienteForm {
    localidad: Localidad,
    direccion: string;
    bicicleta: number;
    motocicleta: number;
    automovil13: number;
    automovil14: number;
    automovil15: number;
    camioneta16: number;
    camioneta17: number;
    camioneta18: number;
    camioneta19: number;
    especiales: number; 
}

export interface PuntoCluster{
    points: number;
    x: number;
    y: number;
    cluster: number;
    tires: number;
    distance: number;
    case: number;
}

export interface Punto {
    latitud: number;
    longitud: number;
}