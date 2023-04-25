import Header from "../components/Header";
import Footer from "../components/Footer";
import { useContext } from "react";
import { WalletContext } from "../context/WalletConnect";
import { ThemeContext } from "../context/theme";
import BridgeComponent from "../components/Bridge";

export default function Home() {
  const { theme } = useContext(ThemeContext);
  const { currencyBalance } = useContext(WalletContext);
  return (
    <>
      <title>LYOBRIDGE</title>
      <link
        href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
<link href="https://fonts.googleapis.com/css2?family=Archivo+Narrow:wght@400;700&family=Archivo:wght@300;400;700&display=swap" rel="stylesheet"></link>
    <link rel="stylesheet" type="text/css" charSet="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" /> 
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />

      <div className={`${theme}`}>
        <Header/>
        <div className="mainContainer">
          <BridgeComponent />
        </div>
        <Footer/>

      </div>
    </>
  );
}
