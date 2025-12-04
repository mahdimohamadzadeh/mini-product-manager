export interface Product {
  id: number
  name: string
  price: number
  category: string
  description: string
  stock: number
  image?: string
}

export interface Category {
  id: number
  name: string
}

export interface CreateProductPayload {
  name: string
  price: number
  category: string
  description?: string
  stock?: number
  image?: string
}

export interface UpdateProductPayload {
  name?: string
  price?: number
  category?: string
  description?: string
  stock?: number
  image?: string
}