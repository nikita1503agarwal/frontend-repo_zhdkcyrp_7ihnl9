import React from 'react'

function ProductCard({ product, onAdd }) {
  return (
    <div className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl p-4 flex flex-col shadow-sm hover:shadow-md transition">
      {product.image && (
        <img src={product.image} alt={product.name} className="h-32 w-full object-cover rounded-lg mb-3" />
      )}
      <div className="flex-1">
        <h3 className="font-semibold text-slate-800">{product.name}</h3>
        <p className="text-sm text-slate-500">{product.unit}</p>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-lg font-bold text-slate-900">${product.price.toFixed(2)}</span>
        <button
          onClick={() => onAdd(product)}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          Add
        </button>
      </div>
    </div>
  )
}

export default ProductCard
