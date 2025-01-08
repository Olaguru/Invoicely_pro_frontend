import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    
    <div className='footer'>
        <footer className="main-footer">
                    <div className="container">
                            <div className="footer-item-left">
                                    <ul className="footer-list-1">
                                        <li>Resources</li>
                                        <li><a href="/guide">Invoicing Guide</a></li>
                                        <li><a href="/help">Help</a></li>
                                        <li><a href="/release-notes">Release Notes</a></li>
                                    </ul>
                                </div>


                            <div className="footer-item-right">
                                <ul className="footer-list-2">
                                    <li>© {new Date().getFullYear()} Invoicely-Pro.com</li>
                                    <li className='socials'>
                                        <a href="https://www.facebook.com/daposta.odedeyi" target="_blank">
                                            <img src="https://cdn.invoice-generator.com/img/icons/facebook.eb6421fe.svg" alt="Invoicely-pro.com on Facebook" height="30" />
                                        </a>
                                        <a href="https://x.com/deetechwiz" target="_blank">
                                            <img src="https://cdn.invoice-generator.com/img/icons/x.4d28e8fd.svg" alt="@invPro on X" height="30" />
                                        </a>
                                        <a href="https://youtube.com/@Cryptotechcoder" target="_blank">
                                            <img src="https://cdn.invoice-generator.com/img/icons/youtube.f9877bb1.svg" alt="Invoicely-pro.com on YouTube" height="30" />
                                        </a>
                                        <a href="https://www.linkedin.com/in/olaguru" target="_blank">
                                            <img src="https://cdn.invoice-generator.com/img/icons/linkedin.09eee87c.svg" alt="Invoicely_pro.com on LinkedIn" height="30" />
                                        </a>
                                        <a href="https://github.com/olaguru/" target="_blank">
                                            <img src="https://cdn.invoice-generator.com/img/icons/github.acdb3b76.svg" alt="Invoicely-pro.com on GitHub" height="30" />
                                        </a>
                                    </li>
                                    <li><a href="/terms">Terms of Service</a></li>
                                    <li><a href="/privacy">Privacy Policy</a></li>
                                </ul>
                            </div>
                    </div>
                </footer>
    </div>
  )
}

export default Footer;