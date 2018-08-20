import React from 'react';
import './Header.css';
import { NavLink } from 'react-router-dom';

export default () => (
  <header className="App-header">
    <h1 className="App-title">Splitwise analizer</h1>
    <div className="Header-LinksBar">
      <NavLink exact to='/' className="App-NavLink" activeClassName="App-activeNavLink">Main</NavLink>
    </div>
  </header>
);

