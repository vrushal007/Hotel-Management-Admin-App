import { NavLink } from 'react-router-dom'
import React from 'react'
import "./Header.css"

function Header() {
  return (

    <header className="header">
      <div className="logo">Room Booking Admin Panel</div>
      <nav className="nav">
        <ul>
          <li>
            <NavLink to='/' className={({ isActive }) => isActive ? "active" : undefined}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to='/admin' className={({ isActive }) => isActive ? "active" : undefined}>
              Admin View
            </NavLink>
          </li>
          <li>
            <NavLink to='/createRoom' className={({ isActive }) => isActive ? "active" : undefined}>
              Create Room
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header