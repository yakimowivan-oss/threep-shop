import type { Product, ProductCategory } from './types'

export const staticCategories: ProductCategory[] = [
  { id: 0, name: 'Все', slug: 'all' },
  { id: 1, name: 'AQUA+', slug: 'aqua' },
]

export const staticProducts: Product[] = [
  {
    id: 1,
    name: 'Dumbrush',
    slug: 'dumbrush',
    price: '5000',
    regular_price: '5000',
    description:
      'Представим, что мы на пенной вечеринке, выжженной хлоркой. Там есть динозавр, который плюется мыльными пузырями. Рядом тусит тип в костюме коробки и крабоид, который шарит за движ.',
    short_description: 'AQUA+ коллекция',
    images: [
      { id: 1, src: '/images/Test cart 1 cart.jpg', alt: 'Dumbrush' },
      { id: 2, src: '/images/Test cart 1 (2).jpg', alt: 'Dumbrush 2' },
      { id: 3, src: '/images/Test cart 1 (1).jpg', alt: 'Dumbrush 3' },
      { id: 4, src: '/images/Test cart 1 (5).jpg', alt: 'Dumbrush 4' },
      { id: 5, src: '/images/Test cart 1 (4).jpg', alt: 'Dumbrush 5' },
      { id: 6, src: '/images/Test cart 1 (3).jpg', alt: 'Dumbrush 6' },
    ],
    categories: [{ id: 1, name: 'AQUA+', slug: 'aqua' }],
    attributes: [
      { name: 'Размер', options: ['S', 'M', 'L', 'XL', '2XL'] },
    ],
    stock_status: 'instock',
  },
  {
    id: 2,
    name: 'Dredd Dolphin',
    slug: 'dredd-dolphin',
    price: '5000',
    regular_price: '5000',
    description:
      'Не нанесение. Это след от реакции хлорки которая лишила ткань красителя. Мы не рисуем, а воруем цвет, оставляя прожжённые пятна. Из этих пятен мы собрали историю.',
    short_description: 'AQUA+ коллекция',
    images: [
      { id: 1, src: '/images/Test cart 2 (1).png', alt: 'Dredd Dolphin' },
      { id: 2, src: '/images/Test cart 2 (2).png', alt: 'Dredd Dolphin 2' },
      { id: 3, src: '/images/Test cart 2 (3).png', alt: 'Dredd Dolphin 3' },
      { id: 4, src: '/images/Test cart 2 (4).png', alt: 'Dredd Dolphin 4' },
      { id: 5, src: '/images/Test cart 2 (5).png', alt: 'Dredd Dolphin 5' },
      { id: 6, src: '/images/Test cart 2 (6).png', alt: 'Dredd Dolphin 6' },
    ],
    categories: [{ id: 1, name: 'AQUA+', slug: 'aqua' }],
    attributes: [
      { name: 'Размер', options: ['S', 'M', 'L', 'XL', '2XL'] },
    ],
    stock_status: 'instock',
  },
  {
    id: 3,
    name: 'Mouse Deathtrap',
    slug: 'mouse-deathtrap',
    price: '5000',
    regular_price: '5000',
    description:
      'Хлор не красит ткань. Он её обесцвечивает, выжигая историю прямо из волокон. Так появился принт Mouse Deathtrap — мрачная сказка на ночь.',
    short_description: 'AQUA+ коллекция',
    images: [
      { id: 1, src: '/images/Test cart 2 (7).png', alt: 'Mouse Deathtrap' },
      { id: 2, src: '/images/Test cart 2 (8).png', alt: 'Mouse Deathtrap 2' },
      { id: 3, src: '/images/Test cart 1 (9).png', alt: 'Mouse Deathtrap 3' },
    ],
    categories: [{ id: 1, name: 'AQUA+', slug: 'aqua' }],
    attributes: [
      { name: 'Размер', options: ['S', 'M', 'L', 'XL', '2XL'] },
    ],
    stock_status: 'instock',
  },
]
