import React from 'react'

function Cart({ items, onInc, onDec, onRemove, onCheckout }) {
  const total = items.reduce((sum, it) => sum + it.price * it.qty, 0)
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-4 sticky top-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-3">Your Cart</h3>
      {items.length === 0 ? (
        <p className="text-slate-500 text-sm">No items yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((it) => (
            <div key={it.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">{it.name}</p>
                <p className="text-xs text-slate-500">${it.price.toFixed(2)} · {it.unit}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-2 py-1 bg-slate-200 rounded" onClick={() => onDec(it.id)}>-</button>
                <span className="w-6 text-center">{it.qty}</span>
                <button className="px-2 py-1 bg-slate-200 rounded" onClick={() => onInc(it.id)}>+</button>
                <button className="px-2 py-1 bg-rose-500 text-white rounded" onClick={() => onRemove(it.id)}>x</button>
              </div>
            </div>
          ))}
          <div className="border-t pt-3 flex items-center justify-between">
            <span className="font-semibold text-slate-800">Total</span>
            <span className="font-bold text-slate-900">${total.toFixed(2)}</span>
          </div>
          <button onClick={onCheckout} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg">Checkout</button>
        </div>
      )}
    </div>
  )
}

export default Cart
