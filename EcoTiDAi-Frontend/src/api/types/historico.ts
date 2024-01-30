export interface APIPuntoHistorico {
    direccion: string,
    latitud: number,
    longitud: number,
}

export interface APIConsolidado {
    totalLlantas: number,
    pqrsPendientes: number,
    ubicacionesAtendidas: number,
    kilometrosRecorridos: number,
    primeraFecha: string,
}