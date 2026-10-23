import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { getDemoStock, getProductById } from './catalog'

const STORAGE_KEY = 'hakiman-demo-cart-v1'
const CartContext = createContext(null)

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(raw) ? raw.filter((l) => getProductById(l.productId)) : []
  } catch {
    return []
  }
}

const clampQty = (productId, qty) => Math.max(0, Math.min(qty, getDemoStock(productId)))

function reducer(lines, action) {
  switch (action.type) {
    case 'add': {
      const existing = lines.find((l) => l.variantId === action.variantId)
      if (existing) {
        return lines.map((l) =>
          l === existing ? { ...l, qty: clampQty(l.productId, l.qty + action.qty) } : l,
        )
      }
      return [...lines, { productId: action.productId, variantId: action.variantId, qty: clampQty(action.productId, action.qty) }]
    }
    case 'set':
      return lines
        .map((l) => (l.variantId === action.variantId ? { ...l, qty: clampQty(l.productId, action.qty) } : l))
        .filter((l) => l.qty > 0)
    case 'remove':
      return lines.filter((l) => l.variantId !== action.variantId)
    case 'clear':
      return []
    default:
      return lines
  }
}

export function CartProvider({ children }) {
  const [lines, dispatch] = useReducer(reducer, undefined, load)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      // storage unavailable (private mode) — cart still works for this session
    }
  }, [lines])

  const add = useCallback((product, qty = 1, { openDrawer = true } = {}) => {
    const variant = product.variants[0]
    dispatch({ type: 'add', productId: product.id, variantId: variant.id, qty })
    if (openDrawer) setOpen(true)
  }, [])

  const value = useMemo(() => {
    const items = lines.map((l) => {
      const product = getProductById(l.productId)
      const variant = product.variants.find((v) => v.id === l.variantId) || product.variants[0]
      return { ...l, product, variant, lineTotal: variant.price * l.qty, stock: getDemoStock(l.productId) }
    })
    return {
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: items.reduce((n, i) => n + i.lineTotal, 0),
      mrpTotal: items.reduce((n, i) => n + (i.variant.compareAtPrice || i.variant.price) * i.qty, 0),
      open,
      setOpen,
      add,
      setQty: (variantId, qty) => dispatch({ type: 'set', variantId, qty }),
      remove: (variantId) => dispatch({ type: 'remove', variantId }),
      clear: () => dispatch({ type: 'clear' }),
    }
  }, [lines, open, add])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  return useContext(CartContext)
}
