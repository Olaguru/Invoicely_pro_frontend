import React from 'react';
import './TopBar.css';
import toggle_light from '../../assets/night.png';
import toggle_dark from '../../assets/day.png';
import logo from '../../assets/logo.png'

const TopBar = () => {

    // const toggle_mode = ()=>{
    //     theme == 'light' ? setTheme('dark') : setTheme('light');
    // }
    return (
        <div className="top-bar">
            <img src={logo} alt="logo" className='logo'/>
            <ul>
                <li>My Invoices</li>
                <li>Settings</li>
                <li className='button'>Upgrade</li>
            </ul>

            <img src={toggle_light} alt='night/day' className='top-bar-toggle'/>

            {/* <div className='top-bar-account'>
                <ul>
                    <li>
                        <a>My Account</a>
                        <ul className='dropdown'>
                            <li>Account</li>
                            <li>Sign out</li>
                        </ul>
                    </li>
                </ul>
            </div> */}

            <div className="top-bar-account">
            <ul>
                <li className="dropdown">
                <a href="#">My Account</a>
                <ul className="dropdown-menu">
                    <li><a href="/account">Account</a></li>
                    <li><a href="/signout">Sign out</a></li>
                </ul>
                </li>
            </ul>
            </div>



        </div>
    );
};

export default TopBar;
