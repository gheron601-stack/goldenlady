import { useEffect, useState, useRef } from 'react'
import AdminLayout from '../components/AdminLayout'
import { api, getImageUrl } from '../api'

const CATEGORIES = {
  jewelry: ['necklaces', 'rings', 'earrings', 'pendants', 'bracelets'],
  accessories: ['bracelets', 'pins', 'rings', 'other'],
}

const EMPTY_FORM = {
  name: '', category: 'jewelry', subcategory: 'necklaces',
  price: '', description: '', featured: false
}

function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t) }, [])
  return <div className="toast">{msg}</div>
}

function ProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState(product ? { ...product, price: String(product.price) } : EMPTY_FORM)
  // Up to 3 image slots
  const [imageFiles, setImageFiles] = useState([null, null, null])
  const [previews, setPreviews] = useState(() => {
    const imgs = product?.images?.length ? product.images : (product?.image ? [product.image] : [])
    return [
      imgs[0] ? getImageUrl(imgs[0]) : null,
      imgs[1] ? getImageUrl(imgs[1]) : null,
      imgs[2] ? getImageUrl(imgs[2]) : null,
    ]
  })
  const [saving, setSaving] = useState(false)
  const fileRefs = [useRef(), useRef(), useRef()]

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleImage = (index, e) => {
    const file = e.target.files[0]
    if (!file) return
    const newFiles = [...imageFiles]
    newFiles[index] = file
    setImageFiles(newFiles)
    const newPreviews = [...previews]
    newPreviews[index] = URL.createObjectURL(file)
    setPreviews(newPreviews)
  }

  const removeImage = (index, e) => {
    e.stopPropagation()
    const newFiles = [...imageFiles]
    newFiles[index] = null
    setImageFiles(newFiles)
    const newPreviews = [...previews]
    newPreviews[index] = null
    setPreviews(newPreviews)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      // Existing image paths (for update)
      const existingImages = product?.images?.length ? product.images : (product?.image ? [product.image] : [])
      if (product) {
        await api.updateProduct(product.id, fd, imageFiles, existingImages)
      } else {
        await api.createProduct(fd, imageFiles)
      }
      onSave()
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleCategoryChange = (v) => {
    set('category', v)
    set('subcategory', CATEGORIES[v][0])
  }

  const slotLabels = ['Image 1 (Main) *', 'Image 2 (optional)', 'Image 3 (optional)']

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{product ? 'Edit Product' : 'Add Product'}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field full">
              <label>Product Name</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} required placeholder="e.g. Gold Filigree Necklace" />
            </div>

            <div className="form-field">
              <label>Category</label>
              <select value={form.category} onChange={e => handleCategoryChange(e.target.value)}>
                <option value="jewelry">Jewelry</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>

            <div className="form-field">
              <label>Subcategory</label>
              <select value={form.subcategory} onChange={e => set('subcategory', e.target.value)}>
                {CATEGORIES[form.category].map(s => (
                  <option key={s} value={s} style={{textTransform:'capitalize'}}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label>Price (₱)</label>
              <input type="number" min="0" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} required placeholder="0.00" />
            </div>

            <div className="form-field" style={{alignItems:'flex-start',justifyContent:'center'}}>
              <label>&nbsp;</label>
              <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',textTransform:'none',letterSpacing:'normal',fontSize:'0.82rem',marginTop:10}}>
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={e => set('featured', e.target.checked)}
                  style={{width:16,height:16}}
                />
                Mark as Featured (shows on homepage)
              </label>
            </div>

            <div className="form-field full">
              <label>Description</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Brief product description..." rows={3} />
            </div>

            {/* 3 Image Upload Slots */}
            <div className="form-field full">
              <label>Product Images (up to 3)</label>
              <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12}}>
                {[0,1,2].map(i => (
                  <div key={i}>
                    <div style={{fontSize:'0.68rem',color:'var(--text-muted)',marginBottom:6,textAlign:'center'}}>{slotLabels[i]}</div>
                    <div
                      className="img-upload"
                      onClick={() => fileRefs[i].current.click()}
                      style={{position:'relative', minHeight: 100}}
                    >
                      <input ref={fileRefs[i]} type="file" accept="image/*" onChange={e => handleImage(i, e)} />
                      {previews[i] ? (
                        <>
                          <img src={previews[i]} alt={`preview ${i+1}`} className="img-preview" style={{height:90}} />
                          <button
                            type="button"
                            onClick={e => removeImage(i, e)}
                            style={{position:'absolute',top:4,right:4,background:'rgba(0,0,0,0.6)',border:'none',color:'#fff',borderRadius:'50%',width:20,height:20,cursor:'pointer',fontSize:10,display:'flex',alignItems:'center',justifyContent:'center'}}
                          >✕</button>
                        </>
                      ) : (
                        <div>
                          <div style={{fontSize:'1.5rem',marginBottom:4,opacity:0.4}}>📷</div>
                          <div style={{fontSize:'0.68rem',color:'var(--text-muted)'}}>Click to upload</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-gold" disabled={saving}>
              {saving ? 'Saving…' : (product ? 'Update Product' : 'Add Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ category: '', subcategory: '' })
  const [modal, setModal] = useState(null) // null | 'add' | product
  const [toast, setToast] = useState('')

  const load = () => {
    setLoading(true)
    const params = {}
    if (filter.category) params.category = filter.category
    if (filter.subcategory) params.subcategory = filter.subcategory
    api.getProducts(params)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(load, [filter])

  const handleSave = () => {
    setModal(null)
    setToast(modal === 'add' ? '✓ Product added' : '✓ Product updated')
    load()
  }

  const handleDelete = async (p) => {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return
    try {
      await api.deleteProduct(p.id)
      setToast('✓ Product deleted')
      load()
    } catch (err) {
      alert(err.message)
    }
  }

  const availableSubcategories = filter.category
    ? (CATEGORIES[filter.category] || [])
    : Array.from(new Set(Object.values(CATEGORIES).flat()))

  return (
    <AdminLayout title="Products">
      {toast && <Toast msg={toast} onDone={() => setToast('')} />}
      {modal && (
        <ProductModal
          product={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {/* Header & Subcategory Filters */}
      <div style={{marginBottom:24}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,flexWrap:'wrap',marginBottom:14}}>
          <div style={{display:'flex',gap:12,flexWrap:'wrap',alignItems:'center'}}>
            <select
              value={filter.category}
              onChange={e => setFilter({category:e.target.value,subcategory:''})}
              style={{width:'auto',padding:'8px 14px',borderRadius:8,fontSize:'0.82rem'}}
            >
              <option value="">All Categories</option>
              <option value="jewelry">Jewelry</option>
              <option value="accessories">Accessories</option>
            </select>

            <select
              value={filter.subcategory}
              onChange={e => setFilter(f=>({...f,subcategory:e.target.value}))}
              style={{width:'auto',padding:'8px 14px',borderRadius:8,fontSize:'0.82rem'}}
            >
              <option value="">All Subcategories</option>
              {availableSubcategories.map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>
              ))}
            </select>

            {(filter.category || filter.subcategory) && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setFilter({category:'',subcategory:''})}
                style={{color:'var(--gold)',fontSize:'0.75rem'}}
              >
                ✕ Reset Filters
              </button>
            )}
          </div>

          <button className="btn btn-gold" onClick={() => setModal('add')}>
            + Add Product
          </button>
        </div>

        {/* Quick Subcategory Pills for Instant Separation */}
        <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
          <span style={{fontSize:'0.72rem',color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.08em',marginRight:4}}>
            Subcategory:
          </span>
          <button
            type="button"
            className={`btn btn-sm ${!filter.subcategory ? 'btn-gold' : 'btn-ghost'}`}
            style={{padding:'4px 12px',fontSize:'0.75rem',height:'auto'}}
            onClick={() => setFilter(f => ({ ...f, subcategory: '' }))}
          >
            All
          </button>
          {availableSubcategories.map(s => (
            <button
              key={s}
              type="button"
              className={`btn btn-sm ${filter.subcategory === s ? 'btn-gold' : 'btn-ghost'}`}
              style={{padding:'4px 12px',fontSize:'0.75rem',height:'auto',textTransform:'capitalize'}}
              onClick={() => setFilter(f => ({ ...f, subcategory: f.subcategory === s ? '' : s }))}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{marginBottom:0}}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category / Subcategory</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{textAlign:'center',padding:'40px',color:'var(--text-muted)'}}>Loading…</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={6} style={{textAlign:'center',padding:'40px',color:'var(--text-muted)'}}>
                  No products found in this subcategory.
                  <button className="btn btn-gold btn-sm" onClick={() => setModal('add')} style={{marginLeft:12}}>Add one</button>
                </td></tr>
              ) : products.map(p => (
                <tr key={p.id}>
                  <td>
                    {getImageUrl(p.image) ? (
                      <img src={getImageUrl(p.image)} alt={p.name} className="td-img" />
                    ) : (
                      <div className="td-img-placeholder">◆</div>
                    )}
                  </td>
                  <td style={{fontWeight:500,maxWidth:200}}>{p.name}</td>
                  <td>
                    <div style={{display:'flex',flexDirection:'column',gap:4}}>
                      <span style={{fontWeight:600,color:'var(--gold)',fontSize:'0.82rem',textTransform:'capitalize'}}>
                        {p.category}
                      </span>
                      <span style={{fontSize:'0.72rem',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.08)',padding:'2px 8px',borderRadius:4,color:'var(--text-muted)',width:'fit-content',textTransform:'capitalize'}}>
                        {p.subcategory || 'General'}
                      </span>
                    </div>
                  </td>
                  <td>₱{Number(p.price).toLocaleString()}</td>
                  <td>
                    <span className={`badge ${p.featured ? 'badge-gold' : 'badge-dark'}`}>
                      {p.featured ? '★ Featured' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <div style={{display:'flex',gap:8}}>
                      <button className="btn btn-ghost btn-sm" onClick={() => setModal(p)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
