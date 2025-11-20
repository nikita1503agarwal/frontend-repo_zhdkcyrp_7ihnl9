import { useEffect, useMemo, useState } from 'react'
import ProductCard from './components/ProductCard'
import Cart from './components/Cart'
import SlotPicker from './components/SlotPicker'

function App() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [products, setProducts] = useState([])
  const [slots, setSlots] = useState([])
  const [cart, setCart] = useState([]) // {id, name, price, unit, qty}
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [customer, setCustomer] = useState({ name: '', phone: '' })
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      try {
        // Ensure seed data exists
        await fetch(`${baseUrl}/seed`, { method: 'POST' })
      } catch (e) {}
      try {
        const [pRes, sRes] = await Promise.all([
          fetch(`${baseUrl}/products`),
          fetch(`${baseUrl}/slots`),
        ])
        const p = await pRes.json()
        const s = await sRes.json()
        setProducts(Array.isArray(p) ? p : [])
        setSlots(Array.isArray(s) ? s : [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i))
      }
      return [
        ...prev,
        { id: product.id, name: product.name, price: product.price, unit: product.unit, qty: 1 },
      ]
    })
  }

  const inc = (id) => setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)))
  const dec = (id) => setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i)))
  const remove = (id) => setCart((prev) => prev.filter((i) => i.id !== id))

  const total = useMemo(() => cart.reduce((sum, i) => sum + i.price * i.qty, 0), [cart])

  const checkout = async () => {
    setMessage('')
    if (!customer.name || !customer.phone) return setMessage('Please enter your name and phone number.')
    if (!selectedSlot) return setMessage('Please select a pickup time slot.')
    if (cart.length === 0) return setMessage('Your cart is empty.')

    const payload = {
      customer_name: customer.name,
      phone: customer.phone,
      slot_id: selectedSlot,
      items: cart.map((c) => ({ product_id: c.id, qty: c.qty })),
      note: null,
    }

    try {
      const res = await fetch(`${baseUrl}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || 'Checkout failed')
      }
      const data = await res.json()
      setMessage(`Order confirmed! #${data.order_id.slice(-6)} · Total $${data.total.toFixed(2)}`)
      setCart([])
      // refresh slots to reflect booking count
      const sRes = await fetch(`${baseUrl}/slots`)
      setSlots(await sRes.json())
    } catch (e) {
      setMessage(e.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.06),transparent_50%)]" />

      <header className="relative z-10 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">G</span>
            <div>
              <h1 className="text-white font-semibold leading-5">Grocery Pickup</h1>
              <p className="text-xs text-blue-200/80">Shop online, pick up in a quiet time slot</p>
            </div>
          </div>
          <div className="text-blue-200/80 text-sm">Total: <span className="text-white font-semibold">${total.toFixed(2)}</span></div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/10 border border-white/10 rounded-2xl p-5">
            <h2 className="text-white text-lg font-semibold mb-4">Browse items</h2>
            {loading ? (
              <p className="text-blue-200">Loading...</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} onAdd={addToCart} />
                ))}
              </div>
            )}
          </div>

          <div className="bg-white/10 border border-white/10 rounded-2xl p-5">
            <SlotPicker slots={slots} selected={selectedSlot} onSelect={setSelectedSlot} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white/10 border border-white/10 rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-2">Your details</h3>
              <div className="grid grid-cols-1 gap-2">
                <input value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} placeholder="Full name" className="w-full px-3 py-2 rounded-lg bg-slate-900/40 border border-white/10 text-white placeholder:text-slate-400" />
                <input value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} placeholder="Phone number" className="w-full px-3 py-2 rounded-lg bg-slate-900/40 border border-white/10 text-white placeholder:text-slate-400" />
              </div>
            </div>

            <Cart items={cart} onInc={inc} onDec={dec} onRemove={remove} onCheckout={checkout} />

            {message && (
              <div className="text-sm px-3 py-2 rounded-lg bg-slate-900/60 border border-white/10 text-blue-200">{message}</div>
            )}
          </div>
        </div>
      </main>

      <footer className="relative z-10 max-w-6xl mx-auto px-6 pb-10 text-center text-blue-200/70 text-sm">
        Reserve a pickup time to reduce crowds. Your order will be ready when you arrive.
      </footer>
    </div>
  )
}

export default App
