import {
    Model,
    _async,
    _await,
    model,
    modelFlow,
    objectToMapTransform,
    prop,
  } from 'mobx-keystone';

import { Historico } from '../api';
import { Posicion } from '../constant';


@model('ecotidai/HistoricoStore')
export class HistoricoStore extends Model({
    totalLlantas: prop<number>(() => 0),
    pqrsPendientes: prop<number>(() => 0),
    ubicacionesAtendidas: prop<number>(() => 0),
    kilometrosRecorridos: prop<number>(() => 0),
    primeraFecha: prop<string>(() => ""),
    posiciones: prop<Record<number, Posicion>>(() => []).withTransform(objectToMapTransform()),
    initialized: prop<boolean>(false),

}){

  get posicionesArray() : Posicion[] {
    return Array.from(this.posiciones.values())
  }

  @modelFlow
    cargarPuntosHistorico = _async (function*(this: HistoricoStore, fechaInicio: Date|null, fechaFin: Date|null){
        if(!this.initialized){
          const data = yield* _await(
              Historico.obtenerPuntos(fechaInicio, fechaFin)
            );
          
            data.forEach((punto: Posicion, index: number) => {
              this.posiciones.set(index.toString(), punto)
            });

          this.initialized = true;
        }
    })
  
  @modelFlow
    cargarConsolidados = _async (function*(this: HistoricoStore, fechaInicio: Date|null, fechaFin: Date|null){
        const data = yield* _await(
          Historico.cargarConsolidados(fechaInicio, fechaFin)
        )
        this.totalLlantas = data.totalLlantas
        this.pqrsPendientes = data.pqrsPendientes
        this.ubicacionesAtendidas = data.ubicacionesAtendidas
        this.kilometrosRecorridos = data.kilometrosRecorridos
        this.primeraFecha = data.primeraFecha

    })
}