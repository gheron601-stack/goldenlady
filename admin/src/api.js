import { supabase } from './supabase'

// Helper: upload one image file, return path
async function uploadImage(file) {
  if (!file || !file.name) return null
  const fileName = Date.now() + '_' + Math.random().toString(36).slice(2) + '_' + file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
  const { data, error } = await supabase.storage.from('products').upload(fileName, file)
  if (error) throw error
  return data.path
}

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

  createProduct: async (formData, imageFiles = []) => {
    // Upload up to 3 images
    const paths = []
    for (const file of imageFiles) {
      if (file) {
        const path = await uploadImage(file)
        if (path) paths.push(path)
      }
    }

    const payload = {
      name: formData.get('name'),
      category: formData.get('category'),
      subcategory: formData.get('subcategory'),
      price: Number(formData.get('price')),
      description: formData.get('description'),
      featured: formData.get('featured') === 'true',
      image: paths[0] || null,
      images: paths
    }

    const { data, error } = await supabase.from('products').insert([payload]).select()
    if (error) throw error
    return data[0]
  },

  updateProduct: async (id, formData, imageFiles = [], existingImages = []) => {
    // Start with existing images
    const paths = [...existingImages]

    // Upload new files (only where a new file was provided)
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i]
      if (file && file.name) {
        const path = await uploadImage(file)
        if (path) paths[i] = path
      }
    }

    // Remove nulls/undefined
    const cleanPaths = paths.filter(Boolean)

    const payload = {
      name: formData.get('name'),
      category: formData.get('category'),
      subcategory: formData.get('subcategory'),
      price: Number(formData.get('price')),
      description: formData.get('description'),
      featured: formData.get('featured') === 'true',
      image: cleanPaths[0] || null,
      images: cleanPaths
    }

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
