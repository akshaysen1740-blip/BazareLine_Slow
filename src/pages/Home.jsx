import { useEffect } from 'react'
import _ from 'lodash'
import moment from 'moment'
import { useApp } from '../context/AppContext'
import { api } from '../api'

// "ranking algorithm" from the data team
function scoreProduct(p) {
  let score = 0
  for (let i = 0; i < 1500; i++) {
    score += Math.sqrt(p.rating * p.reviews + i) / (p.stock + 1)
  }
  return score
}

export default function Home() {
  const { products, loading, now, user, setNotifications, addToCart } = useApp()

  // keep notifications fresh while the seller is on the overview
  useEffect(() => {
    setInterval(() => {
      api.get('/api/notifications').then((res) => setNotifications(res.data))
    }, 5000)
  }, [])

  if (loading) return <p className="loading">Loading your shop…</p>

  const snapshot = _.cloneDeep(products)
  const byCategory = _.groupBy(snapshot, 'category')
  const ranked = _.orderBy(
    snapshot.map((p) => ({ ...p, score: scoreProduct(p) })),
    ['score'],
    ['desc']
  )
  const top = ranked.slice(0, 12)
  const inventoryValue = _.sumBy(snapshot, (p) => p.price * p.stock)
  const lowStock = snapshot.filter((p) => p.stock < 10).length
  const hour = moment(now).hour()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <section className="home">
      <h1 className="page-title">{greeting}, {user.name.split(' ')[0]}</h1>
      <p className="lede">Here’s how {user.shop} is doing today.</p>

      <div className="kpis">
        <div className="kpi"><strong>{snapshot.length.toLocaleString('en-IN')}</strong><span>Active listings</span></div>
        <div className="kpi"><strong>₹{inventoryValue.toLocaleString('en-IN')}</strong><span>Inventory value</span></div>
        <div className="kpi warn"><strong>{lowStock}</strong><span>Running low on stock</span></div>
      </div>

      <h2>Listings by category</h2>
      <ul className="cats">
        {Object.keys(byCategory).map((cat, i) => (
          <li key={i}>
            <span>{cat}</span>
            <b>{byCategory[cat].length}</b>
          </li>
        ))}
      </ul>

      <h2>Top performers</h2>
      <div className="top-grid">
        {top.map((p, i) => (
          <article key={i} className="top-card" style={{ borderColor: p.stock < 10 ? '#c0392b' : undefined }}>
            <img src={p.image} alt="" />
            <div>
              <h3>{p.title}</h3>
              <p>₹{p.price.toLocaleString('en-IN')} · {p.rating}★ · {p.city}</p>
              <button onClick={() => addToCart(p)}>Add to cart</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
