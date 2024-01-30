import {
    Model,
    _async,
    _await,
    model,
    modelFlow,
    objectToMapTransform,
    prop,
  } from 'mobx-keystone';

import { PuntoRecoleccion } from '../api';
import { PuntoPendiente } from './models/puntoPendiente';
import { Posicion, PuntoPendienteForm } from 'constant';

@model('ecotidai/PuntosPendientesStore')
export class PuntosPendientesStore extends Model({
    puntosMap: prop<Record<number, PuntoPendiente>>(() => []).withTransform(objectToMapTransform()),
}) {
    get puntos(): PuntoPendiente[] {
        return Array.from(this.puntosMap.values())
    }
    get length(){
        return this.puntos.length
    }

    get posiciones(): Posicion[]{
        return Array.from(
            this.puntos.map(
                (punto: PuntoPendiente) => {
                    return {
                        'direccion': punto.direccion,
                        'latitud': punto.latitud,
                        'longitud': punto.longitud,
                    }     
                }))
    }

    @modelFlow
    cargarPuntosPendientes = _async (function*(this: PuntosPendientesStore){

        this.puntos.length = 0;
        const data = yield* _await(
            PuntoRecoleccion.obtenerPuntos()
          );

          data.forEach((punto) => this.puntosMap.set(punto.id.toString(), new PuntoPendiente({...punto })))

    })

    @modelFlow
    agregar = _async(function*(this: PuntosPendientesStore, nuevoPunto: PuntoPendienteForm){
        
        const data = yield* _await(
            PuntoRecoleccion.agregarPunto(nuevoPunto)
        );

        this.puntos.push(new PuntoPendiente({...data}))
    })

    @modelFlow
    recolectar = _async(function*(this: PuntosPendientesStore, id: number){
        const puntoPendiente = this.puntos.find((punto) => id === punto.id)
        const recoleccion = yield* _await(
            PuntoRecoleccion.recolectar(puntoPendiente!.id)
        );
        puntoPendiente!.recoleccion = recoleccion
    })
}