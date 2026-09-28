import { useState } from 'react'
import { supabase } from '../supabase'
import { getImageUrl } from '../utils/api'

export default function OrderModal({ product, onClose }) {
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    quantity: 1,
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [activeImg, setActiveImg] = useState(0)

  // Collect all images
  const allImages = (() => {
    const imgs = product?.images?.length ? product.images : (product?.image ? [product.image] : [])
    return imgs.map(getImageUrl).filter(Boolean)
  })()

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error: err } = await supabase.from('orders').insert([{
        customer_name: form.customer_name,
        customer_phone: form.customer_phone,
        customer_email: form.customer_email || null,
        product_name: product?.name || 'Custom Order',
        quantity: Number(form.quantity),
        notes: form.notes || null,
        status: 'pending'
      }])
      if (err) throw err
      setSuccess(true)
    } catch (err) {
      setError('Failed to submit order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="order-modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        {success ? (
          <div className="modal-success">
            <div className="modal-success-icon">✦</div>
            <h2 className="modal-success-title">Order Received!</h2>
            <p className="modal-success-text">
              Thank you, <strong>{form.customer_name}</strong>! We'll contact you shortly via phone or email to confirm your order.
            </p>
            <button className="btn-primary" style={{ marginTop: 24 }} onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="order-modal-grid">

            {/* LEFT — Product Gallery */}
            <div className="order-modal-left">
              {/* Main image */}
              <div className="order-gallery-main">
                {allImages.length > 0 ? (
                  <img src={allImages[activeImg]} alt={product?.name} />
                ) : (
                  <div className="order-gallery-placeholder">
                    <svg viewBox="0 0 48 48" fill="none">
                      <path d="M24 8L32 18H16L24 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                      <path d="M16 18L20 38H28L32 18" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="order-gallery-thumbs">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      className={`order-thumb${activeImg === i ? ' active' : ''}`}
                      onClick={() => setActiveImg(i)}
                      aria-label={`View image ${i + 1}`}
                    >
                      <img src={img} alt={`${product?.name} ${i + 1}`} />
                    </button>
                  ))}
                </div>
              )}

              {/* Product info */}
              <div className="order-product-info">
                <div className="overline" style={{ fontSize: 9, letterSpacing: '0.3em' }}>
                  {product?.subcategory || product?.category}
                </div>
                <h2 className="order-product-name">{product?.name}</h2>
                <div className="order-product-price">₱{Number(product?.price || 0).toLocaleString()}</div>
                {product?.description && (
                  <p className="order-product-desc">{product.description}</p>
                )}
              </div>
            </div>

            {/* RIGHT — Order Form */}
            <div className="order-modal-right">
              <div className="order-form-header">
                <div className="overline" style={{ fontSize: 10, letterSpacing: '0.3em' }}>Place Your Order</div>
                <h3 style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontSize: 18, marginTop: 4 }}>Your Details</h3>
              </div>

              <form onSubmit={handleSubmit} className="modal-form">
                {error && <div className="modal-error">{error}</div>}

                <div className="modal-field">
                  <label>Full Name *</label>
                  <input
                    name="customer_name"
                    value={form.customer_name}
                    onChange={handle}
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div className="modal-field">
                  <label>Phone Number *</label>
                  <input
                    name="customer_phone"
                    value={form.customer_phone}
                    onChange={handle}
                    placeholder="+63 9XX XXX XXXX"
                    required
                  />
                </div>

                <div className="modal-field">
                  <label>Email (optional)</label>
                  <input
                    name="customer_email"
                    type="email"
                    value={form.customer_email}
                    onChange={handle}
                    placeholder="your@email.com"
                  />
                </div>

                <div className="modal-field">
                  <label>Quantity</label>
                  <input
                    name="quantity"
                    type="number"
                    min="1"
                    value={form.quantity}
                    onChange={handle}
                  />
                </div>

                <div className="modal-field">
                  <label>Notes / Special Requests (optional)</label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handle}
                    placeholder="Ring size, engraving, custom details..."
                    rows={3}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Order'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
