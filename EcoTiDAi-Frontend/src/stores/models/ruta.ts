import {
    Model,
    model,
    prop,
  } from 'mobx-keystone';

import { PuntoCluster } from 'constant';

@model('ecotidai/Ruta')
export class Ruta extends Model({
    puntos: prop<PuntoCluster[]>(() => [])
}) {
    get posiciones(){
      return this.puntos.map((punto: PuntoCluster) => {return {latitud: punto.x, longitud: punto.y};});
    }
};