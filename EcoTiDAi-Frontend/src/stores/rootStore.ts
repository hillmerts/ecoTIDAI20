import { Model, model, prop } from 'mobx-keystone';

import { PuntosPendientesStore } from './puntosPendientesStore';
import { HistoricoStore } from './historicoStore';
import { RutaStore } from './rutaStore';


@model('ecotidai/RootStore')
export default class RootStore extends Model({
    puntosPendientes: prop<PuntosPendientesStore>(),
    historico: prop<HistoricoStore>(),
    ruta: prop<RutaStore>(),
}){}