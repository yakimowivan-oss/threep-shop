export interface ProductImage {
  id: number
  src: string
  alt: string
}

export interface ProductCategory {
  id: number
  name: string
  slug: string
}

export interface ProductAttribute {
  name: string
  options: string[]
}

export interface Product {
  id: number
  name: string
  slug: string
  price: string
  regular_price: string
  description: string
  short_description: string
  images: ProductImage[]
  categories: ProductCategory[]
  attributes: ProductAttribute[]
  stock_status: 'instock' | 'outofstock'
}
