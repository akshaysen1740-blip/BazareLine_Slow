import { createContext, useContext, useEffect, useState } from 'react'
import moment from 'moment'
import { api } from '../api'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [now, setNow] = useState(new Date())
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [cart, setCart] = useState([])
  const [theme, setTheme] = useState('light')
  const [user] = useState({
    name: 'Rohit Sharma',
    role: 'seller',
    email: 'rohit@bazaarline.example',
    shop: 'Malwa Weaves, Indore',
  })

  // live clock for the header
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  // everyone needs products eventually, so load them up front
  useEffect(() => {
    api.get('/api/products').then((res) => {
      setProducts(res.data)
      setLoading(false)
    })
  }, [])

  const addToCart = (product) => setCart([...cart, product])
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')

  const value = {
    now,
    formattedTime: moment(now).format('ddd, D MMM · h:mm:ss a'),
    products,
    loading,
    notifications,
    setNotifications,
    cart,
    addToCart,
    theme,
    toggleTheme,
    user,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => useContext(AppContext)
