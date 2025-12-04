export interface FormErrors {
    name?: string
    price?: string
    category?: string
    stock?: string
}

export interface ProductFormState {
    name: string
    price: string
    category: string
    stock: string
    image: File | null
}