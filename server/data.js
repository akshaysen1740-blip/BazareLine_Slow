// Deterministic fake data so everyone's profiler numbers are comparable.
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rand = mulberry32(42)
const pick = (arr) => arr[Math.floor(rand() * arr.length)]

export const categories = [
  'Handloom Sarees', 'Brass & Copper', 'Spices', 'Ayurveda', 'Pottery',
  'Block Prints', 'Jewellery', 'Home Decor', 'Tea & Coffee', 'Footwear',
]
const adjectives = ['Classic', 'Hand-crafted', 'Royal', 'Organic', 'Vintage', 'Festive', 'Everyday', 'Premium']
const nouns = ['Set', 'Collection', 'Pack', 'Edition', 'Bundle', 'Piece']
const cities = ['Indore', 'Jaipur', 'Varanasi', 'Kochi', 'Bhopal', 'Surat', 'Mysuru', 'Kolkata']

const paragraph =
  'Sourced directly from artisan clusters and checked by our quality team before dispatch. ' +
  'Each piece varies slightly in colour and finish, which is a mark of handwork rather than a defect. ' +
  'Store in a cool, dry place and keep away from direct sunlight to preserve the finish for years. '

export const products = Array.from({ length: 5000 }, (_, i) => {
  const id = i + 1
  const category = pick(categories)
  const price = Math.round(199 + rand() * 9800)
  return {
    id,
    title: `${pick(adjectives)} ${category} ${pick(nouns)} #${id}`,
    category,
    price,
    costPrice: Math.round(price * (0.35 + rand() * 0.3)), // internal: supplier cost
    stock: Math.floor(rand() * 400),
    rating: Math.round((2.5 + rand() * 2.5) * 10) / 10,
    reviews: Math.floor(rand() * 2000),
    city: pick(cities),
    supplierPhone: `+91 9${Math.floor(100000000 + rand() * 899999999)}`,
    image: `https://picsum.photos/seed/bz${id}/1600/1200`,
    description: paragraph.repeat(8),
    createdAt: new Date(Date.now() - Math.floor(rand() * 365) * 86400000).toISOString(),
  }
})

export const notifications = Array.from({ length: 60 }, (_, i) => ({
  id: i + 1,
  text: pick([
    'New order received', 'Payout processed', 'Low stock alert',
    'Return requested', 'New review posted', 'Listing approved',
  ]),
  read: rand() > 0.4,
  at: new Date(Date.now() - i * 3600000).toISOString(),
}))
