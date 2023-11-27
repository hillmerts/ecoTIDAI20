import { registerRootStore } from 'mobx-keystone';
import React from 'react';
import { PuntosPendientesStore } from './puntosPendientesStore';
import RootStore from './rootStore';
import { HistoricoStore } from './historicoStore';
import { RutaStore } from './rutaStore';

const StoreContext = React.createContext<RootStore>({} as RootStore);

const useStore = () => React.useContext(StoreContext);
const { Provider: StoreProvider } = StoreContext;

function createRootStore() {
  const puntosPendientes = new PuntosPendientesStore({})
  const historico = new HistoricoStore({});
  const ruta = new RutaStore({});
  const rootStore = new RootStore({
    puntosPendientes,
    historico,
    ruta,
  });

  registerRootStore(rootStore);

  return rootStore;
}

export { RootStore, StoreProvider, createRootStore, useStore };
