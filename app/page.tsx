import Header from '@/components/Header'
import Hero from '@/components/Hero'
import CatalogSection from '@/components/CatalogSection'
import Footer from '@/components/Footer'
import { getProducts, getCategories } from '@/lib/woocommerce'
import { staticProducts, staticCategories } from '@/lib/staticData'

export const revalidate = 300

export default async function HomePage() {
  let products = staticProducts
  let categories = staticCategories

  try {
    const [wcProducts, wcCategories] = await Promise.all([
      getProducts(),
      getCategories(),
    ])
    if (wcProducts.length > 0) products = wcProducts
    if (wcCategories.length > 0) categories = wcCategories
  } catch {
    // fallback to static data
  }

  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <CatalogSection products={products} categories={categories} />
      <Footer />
    </main>
  )
}
