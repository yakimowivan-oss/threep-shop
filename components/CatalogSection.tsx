'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import type { Product, ProductCategory } from '@/lib/types'

interface Props {
  products: Product[]
  categories: ProductCategory[]
}

const TELEGRAM = 'https://t.me/Arasuka2H'

function buildTelegramUrl(product: Product, size: string) {
  const text = `Хочу заказать: ${product.name}, размер ${size}, цена ${product.price} ₽`
  return `${TELEGRAM}?text=${encodeURIComponent(text)}`
}

function formatPrice(price: string) {
  const num = parseInt(price, 10)
  if (isNaN(num)) return price
  return num.toLocaleString('ru-RU') + ' ₽'
}

export default function CatalogSection({ products, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [openProduct, setOpenProduct] = useState<Product | null>(null)
  const [activeImg, setActiveImg] = useState(0)
  const [selectedSize, setSelectedSize] = useState('S')
  const [modalVisible, setModalVisible] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchDelta, setTouchDelta] = useState(0)

  const filtered =
    activeCategory === 'all'
      ? products
      : products.filter((p) => p.categories.some((c) => c.slug === activeCategory))

  const sizes =
    openProduct?.attributes.find((a) => a.name === 'Размер')?.options || ['S', 'M', 'L', 'XL', '2XL']

  const openModal = useCallback((product: Product) => {
    setOpenProduct(product)
    setActiveImg(0)
    setSelectedSize(
      product.attributes.find((a) => a.name === 'Размер')?.options[0] || 'S'
    )
    requestAnimationFrame(() => setModalVisible(true))
    document.body.style.overflow = 'hidden'
  }, [])

  const closeModal = useCallback(() => {
    setModalVisible(false)
    setTimeout(() => {
      setOpenProduct(null)
      document.body.style.overflow = ''
    }, 300)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!openProduct) return
      if (e.key === 'Escape') closeModal()
      if (e.key === 'ArrowLeft') setActiveImg((i) => Math.max(0, i - 1))
      if (e.key === 'ArrowRight') setActiveImg((i) => Math.min((openProduct.images.length || 1) - 1, i + 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openProduct, closeModal])

  const handleImgTouch = {
    onTouchStart: (e: React.TouchEvent) => {
      setTouchStart(e.changedTouches[0].clientX)
      setTouchDelta(0)
    },
    onTouchMove: (e: React.TouchEvent) => {
      if (touchStart === null) return
      setTouchDelta(e.changedTouches[0].clientX - touchStart)
    },
    onTouchEnd: () => {
      if (Math.abs(touchDelta) > 50 && openProduct) {
        if (touchDelta < 0) setActiveImg((i) => Math.min(openProduct.images.length - 1, i + 1))
        else setActiveImg((i) => Math.max(0, i - 1))
      }
      setTouchStart(null)
      setTouchDelta(0)
    },
  }

  return (
    <>
      {/* Collection header */}
      <div className="flex justify-center py-10">
        <Image
          src="/images/aqua+ collection logo V2.png"
          alt="AQUA+ Collection"
          width={0}
          height={0}
          sizes="30vw"
          className="h-20 sm:h-28 lg:h-36 w-auto"
        />
      </div>

      {/* Category filter */}
      <div id="catalog" className="w-full overflow-x-auto pb-2 px-6">
        <div className="flex gap-3 min-w-max mx-auto justify-center">
          {[{ id: 0, name: 'Все', slug: 'all' }, ...categories.filter(c => c.slug !== 'all')].map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className="px-6 py-2 uppercase tracking-widest transition-all duration-200"
              style={{
                fontFamily: "'ONDER', sans-serif",
                fontSize: '0.75rem',
                borderRadius: '5px',
                border: '2px solid #F29774',
                background: activeCategory === cat.slug ? '#F29774' : 'transparent',
                color: activeCategory === cat.slug ? '#A9342A' : '#F29774',
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      <section className="w-full px-6 sm:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-20 gap-x-8 max-w-6xl mx-auto">
          {filtered.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} onOpen={openModal} />
          ))}
        </div>
      </section>

      {/* Product Modal */}
      {openProduct && (
        <div
          className="fixed inset-0 z-50"
          style={{
            background: 'rgba(0,0,0,0.6)',
            opacity: modalVisible ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div
            className="absolute inset-0 overflow-y-auto"
            style={{ background: '#A9342A' }}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="fixed top-5 right-5 z-50 flex items-center justify-center w-9 h-9 rounded"
              style={{ background: '#F29774', color: '#A9342A', borderRadius: '5px' }}
              aria-label="Закрыть"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 2L14 14M14 2L2 14" stroke="#A9342A" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>

            <div
              className="w-full max-w-6xl mx-auto px-6 py-20 sm:py-16"
              style={{
                transform: modalVisible ? 'translateY(0)' : 'translateY(30px)',
                opacity: modalVisible ? 1 : 0,
                transition: 'transform 0.3s ease, opacity 0.3s ease',
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
                {/* Gallery */}
                <div className="flex flex-col gap-4">
                  <div
                    className="w-full rounded-lg overflow-hidden"
                    style={{ aspectRatio: '1/1', position: 'relative', background: '#000' }}
                    {...handleImgTouch}
                  >
                    <Image
                      src={openProduct.images[activeImg]?.src || openProduct.images[0]?.src}
                      alt={openProduct.images[activeImg]?.alt || openProduct.name}
                      fill
                      className="object-cover select-none"
                      draggable={false}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {openProduct.images.length > 1 && (
                      <>
                        <button
                          className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded"
                          style={{ background: 'rgba(0,0,0,0.5)', color: '#F29774' }}
                          onClick={() => setActiveImg((i) => Math.max(0, i - 1))}
                        >
                          ‹
                        </button>
                        <button
                          className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded"
                          style={{ background: 'rgba(0,0,0,0.5)', color: '#F29774' }}
                          onClick={() => setActiveImg((i) => Math.min(openProduct.images.length - 1, i + 1))}
                        >
                          ›
                        </button>
                      </>
                    )}
                  </div>

                  {/* Thumbnails */}
                  {openProduct.images.length > 1 && (
                    <div className="grid grid-cols-5 gap-2">
                      {openProduct.images.map((img, i) => (
                        <button
                          key={img.id}
                          onClick={() => setActiveImg(i)}
                          className="relative rounded overflow-hidden"
                          style={{
                            aspectRatio: '1/1',
                            outline: i === activeImg ? '2px solid #F29774' : '2px solid transparent',
                            outlineOffset: '-2px',
                          }}
                        >
                          <Image
                            src={img.src}
                            alt={img.alt}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product info */}
                <div className="flex flex-col gap-6 lg:pt-0 pt-2 pb-24 lg:pb-0">
                  {/* Collection logo */}
                  <div className="flex justify-center lg:justify-start">
                    <Image
                      src="/images/aqua+.png"
                      alt="AQUA+"
                      width={0}
                      height={0}
                      sizes="15vw"
                      className="h-16 w-auto"
                    />
                  </div>

                  {/* Category label */}
                  <p
                    className="uppercase tracking-widest text-sm"
                    style={{ color: '#F29774', fontFamily: "'Involve', sans-serif" }}
                  >
                    T-SHIRT
                  </p>

                  {/* Title + price */}
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                    <h2
                      className="text-3xl sm:text-4xl leading-tight"
                      style={{ color: '#F29774', fontFamily: "'ONDER', sans-serif" }}
                    >
                      {openProduct.name}
                    </h2>
                    <p
                      className="text-2xl sm:text-3xl price whitespace-nowrap"
                      style={{ color: '#F29774' }}
                    >
                      {formatPrice(openProduct.price)}
                    </p>
                  </div>

                  {/* Description */}
                  <p
                    className="text-sm sm:text-base leading-relaxed"
                    style={{ color: '#F29774', fontFamily: "'Involve', sans-serif" }}
                  >
                    {openProduct.description}
                  </p>

                  {/* Composition + size select */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm" style={{ color: '#F29774', fontFamily: "'Involve', sans-serif" }}>
                        <span style={{ opacity: 0.8 }}>Состав:</span> хлопок 100%
                      </p>
                      <p className="text-sm" style={{ color: '#F29774', fontFamily: "'Involve', sans-serif" }}>
                        <span style={{ opacity: 0.8 }}>Посадка:</span> oversize
                      </p>
                    </div>
                    <div className="flex gap-2 flex-wrap justify-end">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          className="size-btn text-xs"
                          style={{ width: '40px', height: '40px', fontSize: '0.7rem' }}
                          onClick={() => setSelectedSize(size)}
                          data-selected={selectedSize === size ? 'true' : undefined}
                        >
                          <span
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: selectedSize === size ? '#F29774' : 'transparent',
                              color: selectedSize === size ? '#A9342A' : '#F29774',
                              border: '2px solid #F29774',
                              borderRadius: '4px',
                              width: '100%',
                              height: '100%',
                            }}
                          >
                            {size}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Order button */}
                  <a
                    href={buildTelegramUrl(openProduct, selectedSize)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-4 uppercase tracking-widest transition-opacity hover:opacity-90 active:opacity-75"
                    style={{
                      background: '#F29774',
                      color: '#A9342A',
                      fontFamily: "'ONDER', sans-serif",
                      fontSize: '0.8rem',
                      borderRadius: '5px',
                      textDecoration: 'none',
                    }}
                  >
                    Заказать в Telegram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function ProductCard({
  product,
  index,
  onOpen,
}: {
  product: Product
  index: number
  onOpen: (p: Product) => void
}) {
  const [currentImg, setCurrentImg] = useState(0)
  const [btnText, setBtnText] = useState('Посмотреть')
  const [btnFade, setBtnFade] = useState(false)

  const TEXTS = ['Посмотреть', 'чекнуть', 'чё, по чём?', 'скок стоит?', 'сколько денег?', 'чё по цене?']

  useEffect(() => {
    let cur = 'Посмотреть'
    const offset = index * 500
    const id = setInterval(() => {
      setBtnFade(true)
      setTimeout(() => {
        let next: string
        do { next = TEXTS[Math.floor(Math.random() * TEXTS.length)] } while (next === cur)
        cur = next
        setBtnText(next)
        setBtnFade(false)
      }, 200)
    }, 2000 + offset)
    return () => clearInterval(id)
  }, [index])

  useEffect(() => {
    if (product.images.length <= 1) return
    const id = setInterval(() => {
      setCurrentImg((i) => (i + 1) % product.images.length)
    }, 3000)
    return () => clearInterval(id)
  }, [product.images.length])

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Image carousel */}
      <div
        className="w-full max-w-md cursor-pointer relative rounded-lg overflow-hidden"
        style={{ aspectRatio: '1/1' }}
        onClick={() => onOpen(product)}
      >
        {product.images.map((img, i) => (
          <Image
            key={img.id}
            src={img.src}
            alt={img.alt}
            fill
            className="object-cover select-none"
            draggable={false}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={{
              opacity: i === currentImg ? 1 : 0,
              transition: 'opacity 0.6s cubic-bezier(0.4,0,0.2,1)',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          />
        ))}
        {/* Dot indicators */}
        {product.images.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {product.images.map((_, i) => (
              <span
                key={i}
                className="rounded-full transition-all"
                style={{
                  width: i === currentImg ? '16px' : '6px',
                  height: '6px',
                  background: i === currentImg ? '#F29774' : 'rgba(242,151,116,0.4)',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="w-full max-w-md text-center">
        <p
          className="text-xs uppercase tracking-widest mb-1"
          style={{ color: '#F29774', fontFamily: "'Involve', sans-serif" }}
        >
          T-SHIRT
        </p>
        <h3
          className="text-lg mb-4"
          style={{ color: '#F29774', fontFamily: "'ONDER', sans-serif" }}
        >
          {product.name}
        </h3>
        <button
          onClick={() => onOpen(product)}
          className="w-full py-3 uppercase tracking-widest transition-all duration-200"
          style={{
            background: '#F29774',
            color: '#A9342A',
            fontFamily: "'ONDER', sans-serif",
            fontSize: '0.65rem',
            borderRadius: '5px',
            opacity: btnFade ? 0.3 : 1,
            transform: btnFade ? 'scale(0.97)' : 'scale(1)',
            transition: 'opacity 0.2s, transform 0.2s',
          }}
        >
          {btnText}
        </button>
      </div>
    </div>
  )
}
