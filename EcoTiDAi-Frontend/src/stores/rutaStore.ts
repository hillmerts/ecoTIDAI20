import {
    Model,
    _async,
    _await,
    model,
    modelFlow,
    objectToMapTransform,
    prop,
  } from 'mobx-keystone';

import { Ruta } from 'api';
import {Punto, PuntoCluster} from 'constant'




@model('ecotidai/RutaStore')
export class RutaStore extends Model({
    puntosMap: prop<Record<number, PuntoCluster>>(() => []).withTransform(objectToMapTransform())
}){

    get puntos(): Punto[]{
        const arr = Array.from(this.puntosMap.values()) 
        return arr.map((cluster: PuntoCluster) => {return {latitud: cluster.x, longitud: cluster.y}})
    } 

    @modelFlow
    cargarRuta = _async (function*(this: RutaStore){
        const data = yield* _await(
            Ruta.obtenerRuta()
        );
        data.forEach((cluster: PuntoCluster) => this.puntosMap.set(cluster.cluster.toString(), {...cluster }))
        console.log(data);
    })
}