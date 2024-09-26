import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
import ipixLogo from '../../assets/logoIpix.svg';
import { FaBars } from "react-icons/fa6";
import { IoPersonOutline } from "react-icons/io5";

function Navbar() {
  // State to manage dropdown visibility
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  // Function to toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

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
        {/* Toggle button */}
        <div className="toggle" onClick={toggleDropdown}>
          <FaBars />
        </div>
        <div>
          <IoPersonOutline />
        </div>
        
        {/* Dropdown menu (conditionally rendered) */}
        {isDropdownVisible && (
          <div className="dropdownMenu">
            <ul>
              <li><Link to="/">Dashboard</Link></li>
              <li><Link to="/income">Incomes</Link></li>
              <li><Link to="/expense">Expenses</Link></li>
              <li><Link to="/planning">Planning</Link></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
