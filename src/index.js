import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.jsx";
import { ThirdwebWeb3Provider } from '@3rdweb/hooks';
import { DAOProvider } from "./context";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

// Include what chains you wanna support.
// 4 = Rinkeby.
const supportedChainIds = [4];

// Include what type of wallet you want to support.
// In this case, we support Metamask which is an "injected wallet".
const connectors = {
  injected: {},
};

const BrbMusicDaoTheme = extendTheme({
  colors: {
    proposalStatus: {
      0: '#677e8d',
      1: '#5f9971',
      2: '#c92c18',
      3: '#af1400',
      4: '#148b28',
      5: '#9a9e9b',
      6: '#dd7c0c',
      7: '#7c2178',
      genre: '#cfc8c8'
    },
  }
});
// Render the App component to the DOM
ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={ BrbMusicDaoTheme }>
      <ThirdwebWeb3Provider
        connectors={ connectors }
        supportedChainIds={ supportedChainIds }
      >
        <DAOProvider>
          <App />
        </DAOProvider>
      </ThirdwebWeb3Provider>
    </ChakraProvider>
  </React.StrictMode >,
  document.getElementById("root")
);
