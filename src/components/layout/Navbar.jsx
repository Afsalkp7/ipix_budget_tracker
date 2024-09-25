import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './navbar.css';
import ipixLogo from '../../assets/logoIpix.svg';
import { FaBars } from "react-icons/fa6";
import { IoPersonOutline } from "react-icons/io5";


function Navbar() {
  return (
    <div className='navBarMain'>
        <div className="logo">
            <img src={ipixLogo} alt='logo ipix' />
        </div>
        <div className="navItem">
            <ul>
                <li><Link to="/">Dashboard</Link></li>
                <li><Link to="/income">Incomes</Link></li>
                <li><Link to="/expense">Expenses</Link></li>
                <li><Link to="/planning">Planning</Link></li>
            </ul>
        </div>
        <div className="userIcon">
            <div className="toggle"><FaBars /></div>
            <div><IoPersonOutline /></div>

        </div>
    </div>
  );
}

export default Navbar;
