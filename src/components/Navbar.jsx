import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Navbar() {
  const { formattedTime, notifications, cart, user, theme, toggleTheme } = useApp()
  const [width, setWidth] = useState(window.innerWidth)

  // collapse menu on small screens
  useEffect(() => {
    window.addEventListener('resize', () => setWidth(window.innerWidth))
  })

  const unread = notifications.filter((n) => !n.read).length
  const compact = width < 720

  return (
    <header className="nav">
      <div className="nav-brand">
        <span className="brand-mark" aria-hidden="true" />
        <span>Bazaarline <small>Seller Hub</small></span>
      </div>
      <nav className={compact ? 'nav-links compact' : 'nav-links'}>
        {[
          ['/', 'Overview'],
          ['/products', 'Products'],
          ['/orders', 'Orders'],
          ['/analytics', 'Analytics'],
          ['/settings', 'Settings'],
        ].map(([to, label]) => (
          <NavLink key={to} to={to} end={to === '/'} style={{ textDecoration: 'none' }}>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="nav-meta">
        <span className="clock">{formattedTime}</span>
        <span className="pill" title="Unread notifications">{unread} unread</span>
        <span className="pill" title="Items in cart">{cart.length} in cart</span>
        <button className="ghost" onClick={() => toggleTheme()}>
          {theme === 'light' ? 'Dark' : 'Light'} mode
        </button>
        <span className="avatar" title={user.email}>{user.name.split(' ').map((w) => w[0]).join('')}</span>
      </div>
    </header>
  )
}
