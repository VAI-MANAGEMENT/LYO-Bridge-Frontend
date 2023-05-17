import Image from "next/image";
import { Tooltip } from "@nextui-org/react";
import Logo from "../public/lyobridge-logo.png";

const Footer = () => {


  return (
    <footer>
      <div className="container">
        <div className="footer-row">
          <div className="logo-wrp">
            <a href="#" className="logo"><Image src={Logo}  /> </a>

            <br />

            <a href="mailto:info@lyobridge.io">info@lyobridge.io</a>
          </div>
          
          <div className="contact-sec">            
            <Tooltip  content="Coming Soon" trigger="hover" color="invert" placement="top"><a href="#" target="_blank" rel="noreferrer">Terms </a></Tooltip>
            <Tooltip  content="Coming Soon" trigger="hover" color="invert" placement="top"><a href="#" target="_blank" rel="noreferrer">Privacy & Cookie Policy </a></Tooltip>
          </div>
        </div>
        <div className="copyright text-center">
          Copyright © 2023 LYOPAY. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;