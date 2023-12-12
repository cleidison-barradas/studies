import React from "react";
import { HashRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { GlobalStyle } from "./styles/GlobalStyle";
import AppContainer from "./containers/AppContainer";
import Routes from "./navigation/routes";
import { AuthProvider } from "./contexts/auth.context";
import { OrderProvider } from "./contexts/order.context";

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <OrderProvider>
          <RecoilRoot>
            <GlobalStyle />
            <AppContainer>
              <Routes />
            </AppContainer>
          </RecoilRoot>
        </OrderProvider>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
