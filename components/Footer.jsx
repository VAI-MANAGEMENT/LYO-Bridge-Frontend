import Image from "next/image";
import { Tooltip } from "@nextui-org/react";
import Logo from "../public/lyobridge-logo.png";

const Footer = () => {


  return (
    <footer>
      <div className="container">
        <div className="footer-row">
          <div className="logo-wrp">
            <a href="#" className="logo"><Image src={Logo} /> </a>
            <br />

            <div>
              <p>Email:   <a href="mailto:support@lyotrade.com">support@lyotrade.com</a></p>

            </div>

          </div>

          <div>
            <h5>Help</h5>
            <a href="https://support.lyotrade.com/" target="_blank" rel="noreferrer">Contact Us</a><br/>
            <a href="https://docs.bridge.lyotrade.com/introduction/what-is-lyobridge" target="_blank" rel="noreferrer">Docs</a>
          </div>

        </div>
        <div className="copyright">
          © 2023 LYOTRADE. All rights reserved.

          <div className="terms">
            <a href="https://docs.bridge.lyotrade.com/terms/terms-of-use" target="_blank" rel="noreferrer">Terms </a>
            <a href="https://docs.bridge.lyotrade.com/terms/privacy-policy-and-cookies-policy" target="_blank" rel="noreferrer">Privacy & Cookie Policy </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;