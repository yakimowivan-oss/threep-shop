'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

export default function Header() {
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const header = headerRef.current
    const footer = document.querySelector('footer')
    if (!header || !footer) return

    header.style.transition = 'transform 0.3s ease-in-out, background-color 0.3s ease-in-out'

    const handleScroll = () => {
      const footerRect = footer.getBoundingClientRect()
      const footerVisible = footerRect.top < window.innerHeight && footerRect.bottom > 0

      if (footerVisible) {
        header.style.transform = 'translateY(-100%)'
      } else {
        header.style.transform = 'translateY(0)'
        if (window.scrollY > 50) {
          header.style.backgroundColor = '#A9342A'
        } else {
          header.style.backgroundColor = 'transparent'
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50"
      style={{ backgroundColor: 'transparent' }}
    >
      <div className="flex items-center justify-between px-8 py-5">
        <Image
          src="/images/logo threep T beige.png"
          alt="THREEP Logo"
          width={0}
          height={0}
          sizes="10vw"
          className="h-8 sm:h-12 w-auto"
          priority
        />
        <Image
          src="/images/logo threep font beige.png"
          alt="THREEP"
          width={0}
          height={0}
          sizes="20vw"
          className="h-4 sm:h-8 w-auto absolute left-1/2 -translate-x-1/2"
          priority
        />
        <div className="w-12 sm:w-16" />
      </div>
    </header>
  )
}
