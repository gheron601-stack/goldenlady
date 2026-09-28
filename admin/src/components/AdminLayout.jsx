import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../App'

const NAV = [
  {
    path: '/',
    label: 'Dashboard',
    exact: true,
    icon: (
      <svg viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    )
  },
  {
    path: '/products',
    label: 'Products',
    exact: false,
    icon: (
      <svg viewBox="0 0 16 16" fill="none">
        <path d="M2 3h12M2 8h12M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    path: '/orders',
    label: 'Orders',
    exact: false,
    icon: (
      <svg viewBox="0 0 16 16" fill="none">
        <path d="M2 2h12v2H2zM2 7h12v2H2zM2 12h7v2H2z" fill="currentColor" opacity="0.8"/>
        <circle cx="12" cy="13" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M11 13l.8.8 1.5-1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    )
  },
]

export default function AdminLayout({ children, title }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">Golden Lady</div>
          <div className="sidebar-sub">Admin Panel</div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Navigation</div>
          {NAV.map(n => {
            const active = n.exact
              ? location.pathname === n.path
              : location.pathname.startsWith(n.path)
            return (
              <button
                key={n.path}
                className={`sidebar-link${active ? ' active' : ''}`}
                onClick={() => navigate(n.path)}
              >
                {n.icon}
                {n.label}
              </button>
            )
          })}

          <div className="nav-section-label" style={{marginTop:16}}>Store</div>
          <a
            href="https://goldenlady-client.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar-link"
            style={{display:'flex'}}
          >
            <svg viewBox="0 0 16 16" fill="none" style={{width:16,height:16}}>
              <path d="M8 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M10 2h4v4M14 2L8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            View Store ↗
          </a>
        </nav>

        <div className="sidebar-footer">
          <div style={{marginBottom:8,opacity:0.7}}>{user?.email}</div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={logout}
            style={{width:'100%',justifyContent:'center'}}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="admin-main">
        <div className="admin-topbar">
          <div className="topbar-title">{title}</div>
          <div className="topbar-user">Welcome, {user?.email}</div>
        </div>
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  )
}
