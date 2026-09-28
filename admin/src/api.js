import { supabase } from './supabase'

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const api = {
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)
    return { user: data.user }
  },

  logout: async () => {
    await supabase.auth.signOut()
  },

  me: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not logged in')
    return { user }
  },

  // ─── Products ───────────────────────────────────────────────────────────────
  getProducts: async (params = {}) => {
    let query = supabase.from('products').select('*')
    if (params.category) query = query.eq('category', params.category)
    query = query.order('created_at', { ascending: false })
    const { data, error } = await query
    if (error) throw error
    return data
  },

  createProduct: async (formData) => {
    let imagePath = null
    const imageFile = formData.get('image')
    if (imageFile && imageFile.name) {
      const fileName = Date.now() + '_' + imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const { data, error } = await supabase.storage.from('products').upload(fileName, imageFile)
      if (error) throw error
      imagePath = data.path
    }

    const payload = {
      name: formData.get('name'),
      category: formData.get('category'),
      subcategory: formData.get('subcategory'),
      price: Number(formData.get('price')),
      description: formData.get('description'),
      featured: formData.get('featured') === 'true',
      image: imagePath
    }

    const { data, error } = await supabase.from('products').insert([payload]).select()
    if (error) throw error
    return data[0]
  },

  updateProduct: async (id, formData) => {
    let imagePath = formData.get('image')
    if (imagePath instanceof File && imagePath.name) {
      const fileName = Date.now() + '_' + imagePath.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const { data, error } = await supabase.storage.from('products').upload(fileName, imagePath)
      if (error) throw error
      imagePath = data.path
    } else if (!imagePath || imagePath === 'null') {
      imagePath = null
    }

    const payload = {
      name: formData.get('name'),
      category: formData.get('category'),
      subcategory: formData.get('subcategory'),
      price: Number(formData.get('price')),
      description: formData.get('description'),
      featured: formData.get('featured') === 'true',
    }
    if (formData.has('image') && imagePath !== 'null') payload.image = imagePath

    const { data, error } = await supabase.from('products').update(payload).eq('id', id).select()
    if (error) throw error
    return data[0]
  },

  deleteProduct: async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw error
    return { success: true }
  },
}

export function getImageUrl(path) {
  if (!path || path === 'null') return null
  if (path.startsWith('http') || path.startsWith('/')) return path
  const { data } = supabase.storage.from('products').getPublicUrl(path)
  return data.publicUrl
}
