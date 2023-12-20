import {
    Model,
    _async,
    _await,
    model,
    modelFlow,
    objectToMapTransform,
    prop,
  } from 'mobx-keystone';

import { Rutas } from 'api';
import { Ruta } from './models/ruta';
import { APIRuta } from 'api/types/ruta';



@model('ecotidai/RutaStore')
export class RutaStore extends Model({
    rutasMap: prop<Record<number, Ruta>>(() => []).withTransform(objectToMapTransform()),
    solicitado: prop<boolean>(false),
}){

    get rutas(): Ruta[]{
        const arr = Array.from(this.rutasMap.values());
        return arr;
    } 

    @modelFlow
    cargarRutas = _async (function*(this: RutaStore){
        if(!this.solicitado){
            this.solicitado = true;
            const data = yield* _await(
                Rutas.obtenerRutas()
            );
            this.rutasMap.clear();
            (data as APIRuta[]).forEach((ruta: APIRuta, index: number) => {
                this.rutasMap.set(index.toString(), new Ruta({puntos: ruta.puntos}));
            });
            this.solicitado = false;
        }
    })
}
