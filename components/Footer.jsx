import Image from "next/image";
import { Tooltip } from "@nextui-org/react";
import Logo from "../public/lyobridge-logo.png";

const Footer = () => {


  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-6">
            <div className="logo-wrp">
              <a href="#" className="logo"><Image src={Logo} width={203} height={36} /> </a>
              <br />

              <p>
                LYOTRADE SOCIEDAD DE RESPONSABILIDAD LIMITADA<br />
                Service Company </p>

              <p>
                CRM: 3102876075,<br />
                San Jose-Escazu San Rafael,<br /> Del Centro Comercial La Paco,<br /> Trescientos Metros Norte,<br /> Plaza Florencia,<br />
                Local Diez, Costa Rica

              </p>

              <div>
                <p><a href="mailto:support@bridge.lyotrade.com">support@bridge.lyotrade.com</a></p>
              </div>

            </div>
          </div>
          <div className="col-lg-2 col-md-6">
            <h6>About Us</h6>

            <ul>
              <li><a href="https://blog.lyopay.com/category/lyotrade/" target="_blank" rel="noopener noreferrer">News</a></li>
              <li><a href="https://t.me/lyotrade" target="_blank" rel="noopener noreferrer">Announcements</a></li>
              <li><a href="https://docs.lyotrade.com/company/registered-entity" target="_blank" rel="noopener noreferrer">License</a></li>
              <li><a href="https://docs.lyotrade.com/lyotrade-exchange/product-deck" target="_blank" rel="noopener noreferrer">Product Deck</a></li>
              <li><a href="https://docs.lyotrade.com/lyotrade-exchange/fees" target="_blank" rel="noopener noreferrer">Prices</a></li>
              <li><a href="https://docs.lyotrade.com/terms/terms-of-use" target="_blank" rel="noopener noreferrer">List Your Token</a></li>
              <li><a href="https://docs.lyotrade.com/terms/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
              <li><a href="https://docs.lyotrade.com/terms/cookie-policy" target="_blank" rel="noopener noreferrer">Cookie Policy</a></li>
            </ul>
          </div>
          <div className="col-lg-2 col-md-6">
            <h6>Products</h6>

            <ul>
              <li><a href="https://buy-sell.lyotrade.com/" target="_blank" rel="noopener noreferrer">Buy & Sell with Card</a></li>
              <li><a href="https://www.lyotrade.com/en_US/trade/LYO_USDT?type=spot" target="_blank" rel="noopener noreferrer">Spot</a></li>
              <li><a href="https://www.lyotrade.com/en_US/v5/trade/BTC_USDT?type=isolated" target="_blank" rel="noopener noreferrer">Margin</a></li>
              <li><a href="https://www.lyotrade.com/en_US/trade/BTC3L_USDT" target="_blank" rel="noopener noreferrer">ETF</a></li>
              <li><a href="https://futures.lyotrade.com/en_US/trade/E-BCH-USDT" target="_blank" rel="noopener noreferrer">Futures</a></li>
              <li><a href="https://www.lyotrade.com/en_US/freeStaking" target="_blank" rel="noopener noreferrer">LYO & USDT Staking</a></li>
              <li><a href="https://swap.lyotrade.com/" target="_blank" rel="noopener noreferrer">DEX Swap</a></li>
              <li><a href="https://crypto-loan.lyotrade.com/" target="_blank" rel="noopener noreferrer">Crypto Loan</a></li>
              <li><a href="https://www.lyotrade.com/en_US/newAssets/brlPay" target="_blank" rel="noopener noreferrer">Pix</a></li>
            </ul>
          </div>
          <div className="col-lg-2 col-md-6">
            <h6>Learn</h6>

            <ul>
              <li><a href="https://blog.lyopay.com/category/lyotrade/" target="_blank" rel="noopener noreferrer">Help & Support</a></li>
              <li><a href="https://t.me/lyotrade" target="_blank" rel="noopener noreferrer">What is LYOTRADE?</a></li>
              <li><a href="https://docs.lyotrade.com/company/registered-entity" target="_blank" rel="noopener noreferrer">Get Started</a></li>
              <li><a href="https://docs.lyotrade.com/lyotrade-exchange/product-deck" target="_blank" rel="noopener noreferrer">LYO Token</a></li>
              <li><a href="https://docs.lyotrade.com/lyotrade-exchange/fees" target="_blank" rel="noopener noreferrer">Account Verification</a></li>
              <li><a href="https://docs.lyotrade.com/help-center/company-account-verification-kyb/how-to-do-kyb-verification" target="_blank" rel="noopener noreferrer">KYB</a></li>
              <li><a href="https://www.lyotrade.com/en_US/market" target="_blank" rel="noopener noreferrer">Available Trading Pairs</a></li>
              <li><a href="https://docs.lyotrade.com/api" target="_blank" rel="noopener noreferrer">API Integration</a></li>
              <li><a href="https://www.lyotrade.com/en_US/register" target="_blank" rel="noopener noreferrer">Create an Account</a></li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="buttons d-flex flex-column gap-3">
              <a className="btn" href="https://apps.apple.com/app/lyo-trade-crypto-btc-exchange/id1624895730" target="_blank" rel="noopener noreferrer">
                <img src="/assets/Apple_logo_grey 1.png" className="img-fluid" alt="app store" /> App Store
              </a>

              <a className="btn" href="https://play.google.com/store/apps/details?id=com.lyotrade&hl=en&gl=US" target="_blank" rel="noopener noreferrer">
                <img src="/assets/Google_Play_Prism 1.png" className="img-fluid" alt="play store" /> Play Store 
              </a>
            </div>
            <ul className="social-icons">
              <li><a href="https://linktr.ee/lyopay" target="_blank" rel="noopener noreferrer"><img src="/assets/treeMe.svg" /></a></li>
              <li><a href="https://t.me/lyotrade" target="_blank" rel="noopener noreferrer"><img src="/assets/telegram.svg" /></a></li>
              <li><a href="https://www.facebook.com/lyopayofficial" target="_blank" rel="noopener noreferrer"><img src="/assets/fb.svg" /></a></li>
              <li><a href="https://www.instagram.com/lyopayofficial/" target="_blank" rel="noopener noreferrer"><img src="/assets/instagram.svg" /></a></li>
              <li><a href="https://twitter.com/lyopayofficia" target="_blank" rel="noopener noreferrer"><img src="/assets/twitterX.svg" /></a></li>
              <li><a href="https://www.linkedin.com/showcase/lyopay-app/" target="_blank" rel="noopener noreferrer"><img src="/assets/linkedin.svg" /></a></li>
              <li><a href="https://www.youtube.com/lyopay" target="_blank" rel="noopener noreferrer"><img src="/assets/yt.svg" /></a></li>
              <li><a href="https://www.trustpilot.com/review/www.lyotrade.com" target="_blank" rel="noopener noreferrer"><img src="/assets/trustpilot.svg" /></a></li>
            </ul>
          </div>
        </div>
        <div className="copyright">
          <div>
            <div className="mb-2">Copyright © {new Date().getFullYear()} LYOTRADE. All rights reserved.</div>

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