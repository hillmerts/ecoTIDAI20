import {
    Model,
    model,
    prop,
  } from 'mobx-keystone';

import { Localidad, Posicion } from 'constant';

@model('ecotidai/PuntoPendiente')
export class PuntoPendiente extends Model({
    id: prop<number>(),
    fecha: prop<string>(),
    localidad: prop<Localidad>(),
    latitud: prop<number>(),
    longitud: prop<number>(),
    direccion: prop<string>(),
    bicicleta: prop<number>(),
    motocicleta: prop<number>(),
    automovil13: prop<number>(),
    automovil14: prop<number>(),
    automovil15: prop<number>(),
    camioneta16: prop<number>(),
    camioneta17: prop<number>(),
    camioneta18: prop<number>(),
    camioneta19: prop<number>(),
    especiales: prop<number>(),
    recoleccion: prop<boolean>(),
}) {
    
    get totalLlantas() {
      return this.bicicleta + this.motocicleta + this.automovil13 +
       this.automovil14 + this.automovil15 + this.camioneta16 +
       this.camioneta17 + this.camioneta18 + this.camioneta19 +
       this.especiales;
    }

    get Posicion() : Posicion {
        return {
            'direccion': this.direccion,
            'latitud': this.latitud,
            'longitud': this.longitud,
        }
    }
}

