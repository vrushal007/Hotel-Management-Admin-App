import { Link, NavLink } from 'react-router-dom'
import React from 'react'
import classes from './Header.module.css'

function Header () {
  return (
    <header className={classes.header}>
      <Link to='/'><div className={classes.logo}>Room Booking Admin Panel</div></Link>
      <nav className={classes.nav}>
        <ul>
          <li>
            <NavLink
              to='/'
              className={({ isActive }) => (isActive ? classes.active : undefined)}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/admin'
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              Admin View
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/createRoom'
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              Create Room
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
