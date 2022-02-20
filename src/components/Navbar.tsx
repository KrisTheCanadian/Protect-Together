import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <div>
      <Link to="/Login">Login</Link>
      <Link to="/register">Register</Link>
    </div>
  );
};

export default Navbar;
