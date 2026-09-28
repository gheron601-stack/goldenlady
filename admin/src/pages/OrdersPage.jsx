import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import AdminLayout from '../components/AdminLayout'

const STATUS_COLORS = {
  pending:     { bg: 'rgba(201,168,76,0.15)',  color: '#C9A84C' },
  confirmed:   { bg: 'rgba(59,130,246,0.15)',  color: '#60a5fa' },
  in_progress: { bg: 'rgba(168,85,247,0.15)',  color: '#c084fc' },
  completed:   { bg: 'rgba(34,197,94,0.15)',   color: '#4ade80' },
  cancelled:   { bg: 'rgba(239,68,68,0.15)',   color: '#f87171' },
}

const STATUS_OPTIONS = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const fetchOrders = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setOrders(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchOrders() }, [])

  const updateStatus = async (id, status) => {
    await supabase.from('orders').update({ status }).eq('id', id)
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
  }

  const deleteOrder = async (id) => {
    if (!confirm('Delete this order?')) return
    await supabase.from('orders').delete().eq('id', id)
    setOrders(prev => prev.filter(o => o.id !== id))
  }

  const filtered = orders.filter(o => {
    const matchStatus = filter === 'all' || o.status === filter
    const matchSearch = !search ||
      o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_phone?.includes(search) ||
      o.product_name?.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const counts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length
    return acc
  }, {})

  return (
    <AdminLayout title="Orders">
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total', value: orders.length, color: 'var(--gold)' },
          { label: 'Pending', value: counts.pending || 0, color: '#C9A84C' },
          { label: 'Confirmed', value: counts.confirmed || 0, color: '#60a5fa' },
          { label: 'Completed', value: counts.completed || 0, color: '#4ade80' },
          { label: 'Cancelled', value: counts.cancelled || 0, color: '#f87171' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, phone, product..."
          style={{ flex: 1, minWidth: 200, padding: '8px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13 }}
        />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['all', ...STATUS_OPTIONS].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: '6px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                textTransform: 'capitalize', cursor: 'pointer', border: 'none',
                background: filter === s ? 'var(--gold)' : 'var(--surface)',
                color: filter === s ? '#000' : 'var(--text-muted)',
                letterSpacing: '0.05em'
              }}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
        <button onClick={fetchOrders} style={{ padding: '8px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13 }}>
          ↻ Refresh
        </button>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>Loading orders...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
          {orders.length === 0 ? 'No orders yet. Orders will appear here when customers place them.' : 'No orders match your search.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(order => (
            <div key={order.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>

                {/* Customer Info */}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                      {order.customer_name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 14 }}>{order.customer_name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{order.customer_phone}</div>
                    </div>
                  </div>
                  {order.customer_email && (
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>✉ {order.customer_email}</div>
                  )}
                  <div style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 600 }}>
                    {order.product_name} × {order.quantity}
                  </div>
                  {order.notes && (
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, fontStyle: 'italic', background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: 6, borderLeft: '2px solid var(--gold)' }}>
                      "{order.notes}"
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
                    {new Date(order.created_at).toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                </div>

                {/* Status + Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                  <span style={{
                    padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                    textTransform: 'capitalize', letterSpacing: '0.05em',
                    background: STATUS_COLORS[order.status]?.bg || 'rgba(255,255,255,0.1)',
                    color: STATUS_COLORS[order.status]?.color || '#fff'
                  }}>
                    {order.status?.replace('_', ' ')}
                  </span>

                  <select
                    value={order.status}
                    onChange={e => updateStatus(order.id, e.target.value)}
                    style={{ padding: '6px 10px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text)', fontSize: 12, cursor: 'pointer' }}
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>{s.replace('_', ' ')}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => deleteOrder(order.id)}
                    style={{ padding: '5px 10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, color: '#f87171', fontSize: 11, cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
