import React, { FC } from "react";
import { Route, Routes } from "react-router-dom";
import Principal from "./Principal";
import Historico from "./Historico";
import PuntosPendientes from "./PuntosPendientes";
import AgregarPunto from "./AgregarPunto";
import ProximaRuta from "./ProximaRuta";
import { RootStore, StoreProvider } from "stores";

interface Props {
    store: RootStore;
  }
  
const App: FC<Props> = ({ store }: Props) => {
    return (
        <StoreProvider value={store}>
            <Routes>
                <Route path="/" element={<Principal />}>
                    <Route path="/Historico" element={<Historico />}/>
                    <Route path="/PuntosPendientes" element={<PuntosPendientes /> }/>
                    <Route path="/AgregarPunto" element={<AgregarPunto />}/>
                    <Route path="/ProximaRuta" element={<ProximaRuta/>}/>
                </Route>
            </Routes>
        </StoreProvider>
    );
}

export default App;