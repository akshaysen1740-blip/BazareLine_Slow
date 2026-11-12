import express from 'express'
import cors from 'cors'
import { products, notifications, categories } from './data.js'

const app = express()
app.use(cors())
app.use(express.json({ limit: '50mb' }))

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
// Real APIs are slow and inconsistent; this one is both.
const jitter = (base) => sleep(base + Math.random() * base)

app.get('/api/products', async (req, res) => {
  await jitter(800)
  res.json(products) // all 5000, every field
})

app.get('/api/categories', async (req, res) => {
  await jitter(200)
  res.json(categories)
})

app.get('/api/notifications', async (req, res) => {
  await jitter(300)
  res.json(notifications)
})

app.get('/api/products/:id', async (req, res, next) => {
  try {
    await jitter(300)
    const p = products.find((x) => x.id === Number(req.params.id))
    if (!p) throw new Error(`Product lookup failed for id=${req.params.id} in products[] (size ${products.length})`)
    res.json(p)
  } catch (err) {
    next(err)
  }
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message, stack: err.stack })
})

app.listen(4000, () => console.log('API on http://localhost:4000'))
