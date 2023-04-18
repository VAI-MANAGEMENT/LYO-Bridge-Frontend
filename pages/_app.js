import "bootstrap/dist/css/bootstrap.css";
import "../styles/globals.css";
import "../styles/collateral.css";
import "../styles/light.css";
import { transitions, types, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import { WalletProvider } from "../context/WalletConnect";
import { ThemeContext, ThemeProvider } from "../context/theme";
import { QueryClient, QueryClientProvider } from "react-query";
import { useState } from "react";
import { TokenProvider } from "../context/TokenContext";


// import { NextUIProvider } from '@nextui-org/react';

// optional configuration
const options = {
  position: positions.TOP_RIGHT,
  timeout: 2000,
  offset: "100px",
  transition: transitions.SCALE,
  containerStyle: {
    fontSize: "13px",
    lineHeight: "18px",
    marginLeft: "0",
    //  backgroundColor: 'rgb(88 37 108)'
  },
};

function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <TokenProvider>        
          <ThemeProvider>
            <AlertProvider template={AlertTemplate} {...options}>
              <Component {...pageProps} />
            </AlertProvider>
          </ThemeProvider>     
        </TokenProvider>
      </WalletProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
