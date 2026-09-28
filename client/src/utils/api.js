import { supabase } from '../supabase'

export async function fetchProducts(params = {}) {
  let query = supabase.from('products').select('*')
  
  if (params.category) query = query.eq('category', params.category)
  if (params.subcategory) query = query.eq('subcategory', params.subcategory)
  if (params.featured) query = query.eq('featured', true)
  
  // Sort by newest first
  query = query.order('created_at', { ascending: false })
  
  const { data, error } = await query
  if (error) {
    console.error('Supabase fetch error:', error)
    throw new Error('Failed to fetch products')
  }
  return data
}

export function getImageUrl(path) {
  if (!path) return null
  // If it's a URL or a local public folder image, return as is
  if (path.startsWith('http') || path.startsWith('/')) return path
  // Otherwise, it's in the Supabase 'products' bucket
  const { data } = supabase.storage.from('products').getPublicUrl(path)
  return data.publicUrl
}

export const ORDER_FORM_URL =
  'https://forms.gle/iXrCM1Jpr2SVCJYC6'
