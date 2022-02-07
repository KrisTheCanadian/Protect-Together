import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <div>
      <Link to="/Login">Login</Link>
      <Link to="/Register">Register</Link>
    </div>
  );
};

export default Navbar;
