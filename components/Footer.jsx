import Image from "next/image";
import { Tooltip } from "@nextui-org/react";
import Logo from "../public/lyobridge-logo.png";

const Footer = () => {


  return (
    <footer>
      <div className="container">
        <div className="footer-row">
          <div className="logo-wrp">
            <a href="#" className="logo"><Image src={Logo} width={175} height={31} /> </a>
            <br />

            <div>
              <p>Email:  <a href="mailto:support@bridge.lyotrade.com">support@bridge.lyotrade.com</a></p>
            </div>

            <p>
              LYOTRADE S.R.L<br />
              CRN: 3-102-876075<br />
              Plaza Florence, Local Ten,<br />
              Costa Rica
            </p>

          </div>

          <div>
            <h5>Help</h5>
            <a href="https://support.bridge.lyotrade.com/" target="_blank" rel="noreferrer">Contact Us</a><br />
            <a href="https://docs.bridge.lyotrade.com/introduction/what-is-lyobridge" target="_blank" rel="noreferrer">Docs</a>

            <div>
          <h5 className="mt-3">About Us</h5>
            <a href="https://docs.bridge.lyotrade.com/terms/terms-of-use" target="_blank" rel="noreferrer">Terms </a><br />
            <a href="https://docs.bridge.lyotrade.com/terms/privacy-policy-and-cookies-policy" target="_blank" rel="noreferrer">Privacy & Cookie Policy </a>
          </div>
          </div>         

        </div>
        <div className="copyright">
          <div>
            <div className="mb-2">Copyright © 2023 LYOTRADE. All rights reserved.</div>
           
            LYOTRADE users are subject to the <a href="https://docs.lyotrade.com/terms/terms-of-use" className="text-info" target="_blank" rel="noreferrer">Terms of Use </a>
             and  <a href="https://docs.lyotrade.com/terms/risk-statement" className="text-info" target="_blank" rel="noreferrer">Risk Disclosure</a>. Trading in Cryptocurrency is a high-risk activity and subject to market volatility.
            LYOTRADE does not offer personal, financial or investment advice in relation to our products or services; any decisions to use our products or services
            is solely made by the user.
          </div>         
        </div>
      </div>
    </footer>
  );
}

export default Footer;