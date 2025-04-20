import React from 'react'
import './Footer.css'
import logo from '../../assets/logo.png'
import facebook from '../../assets/facebook_icon.png'
import twitter from '../../assets/twitter_icon.png'
import linkedin from '../../assets/linkedin_icon.png'
const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
             <img src={logo}></img>
             <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nulla voluptas quasi qui veniam, exercitationem error temporibus beatae recusandae, eveniet illum, nesciunt nisi. Optio sapiente numquam blanditiis placeat dignissimos earum minus.</p>
        <div className="footer-social-icons">
            <img src={facebook} alt="" />
            <img src={twitter} alt="" />
            <img src={linkedin} alt="" />
        </div>
        </div>
        <div className="footer-content-center">
            <h2>Company</h2>
            <ul>
              <li>Home</li>
              <li>About us</li>
              <li>Delivery</li>
              <li>Privacy Policy</li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>GET IN TOUCH</h2>
            <ul>
              <li>+91 1234567890</li>
              <li>contact@tomato.com</li>
            </ul>
        </div>
        
      </div>
      <hr/>
      <p className="footer-copyright">Copyright 2025 &copy; Tomato.com - All Rights Reserved</p>
    </div>
  )
}

export default Footer
