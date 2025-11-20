import React from 'react'

function SlotPicker({ slots, selected, onSelect }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">Pick a pickup time</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {slots.map((s) => (
          <button
            key={s.id}
            disabled={s.available === 0}
            onClick={() => onSelect(s.id)}
            className={`text-left p-3 rounded-lg border transition ${
              selected === s.id ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white'
            } ${s.available === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <p className="font-medium text-slate-800">{s.label}</p>
            <p className="text-xs text-slate-500">{s.available} spots left</p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default SlotPicker
