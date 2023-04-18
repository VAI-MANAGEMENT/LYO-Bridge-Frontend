import Logo from "../public/logo-small.png";
import Image from "next/image";

const Footer= () => {


    return (
        <footer>
        <div className="container">
          <div className="footer-row">
            <div className="logo-wrp">
              <a href="#" className="logo"><Image src={Logo} alt="LFI" /> LYOBRIDGE</a>
      
              <br/>
      
              <a href="mailto:info@lyobridge.io">info@lyobridge.io</a>
            </div>
      
      
            <div className="social-sec">
             
              <div className="icon-list">
                <a href="#" target="_blank" rel="noreferrer"><img src="https://lfi.io/assets/icons/social-twitter.svg" className="img-fluid"/></a>
                <a href="#" target="_blank" rel="noreferrer"><img src="https://lfi.io/assets/icons/social-linkedin.svg" className="img-fluid"/></a>
                <a href="#" target="_blank" rel="noreferrer"><img src="https://lfi.io/assets/icons/social-facebook.svg" className="img-fluid"/></a>
                <a href="#" target="_blank" rel="noreferrer"><img src="https://lfi.io/assets/icons/social-instagram.svg" className="img-fluid"/></a>
                <a href="#" target="_blank" rel="noreferrer"><img src="https://lfi.io/assets/icons/social-telegram.svg" className="img-fluid"/></a>
                 <a href="#" target="_blank" rel="noreferrer"><img src="https://lfi.io/assets/icons/social-yt.svg" className="img-fluid"/></a>
            </div>
            </div>
            <div className="contact-sec">
              <a href="#" target="_blank" rel="noreferrer">Terms </a><br/>
              <a href="#" target="_blank" rel="noreferrer">Privacy and Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    );
    }
    
    export default Footer;