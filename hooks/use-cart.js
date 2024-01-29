import { useContext, useState, useEffect } from 'react'
import Swal from 'sweetalert2'

// 宣告要使用的 context
import { createContext } from 'react'
const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [selectedCoupon, setSelectedCoupon] = useState('')

  useEffect(() => {
    // 在組件掛載時，從 localStorage 中讀取購物車資料
    const storedCart = localStorage.getItem('fyt-cart')
    if (storedCart) {
      setItems(JSON.parse(storedCart))
    }
  }, [])

  const saveToLocalStorage = (cartItems) => {
    // 將購物車資料存入 localStorage
    localStorage.setItem('fyt-cart', JSON.stringify(cartItems))
  }

  // 刪除商品，回傳新的陣列，符合id的商品不要
  const remove = (items, sid) => {
    const newItems = items.filter((v, i) => {
      return v.sid !== sid
    })
    setItems(newItems)
    saveToLocalStorage(newItems)
  }

  // 刪除商品，回傳新的陣列，符合id的商品不要
  const removeMulti = () => {
    setItems([])
    saveToLocalStorage([])
  }

  // 增加數量，回傳新的陣列，符合id的商品數量+1
  const increment = (items, sid) => {
    const newItems = items.map((v, i) => {
      if (v.sid === sid) {
        // 如果 數量qty 超過 庫存量stock 就 跳出提示說商品庫存量不夠
        if (v.qty + 1 > v.stock) {
          Swal.fire({
            toast: true,
            width: 250,
            position: 'top',
            icon: 'warning',
            iconColor: '#ff804a',
            title: '商品庫存量不足',
            showConfirmButton: false,
            timer: 1500,
          })
          return v
        }
        return {
          ...v,
          qty: v.qty + 1,
          subtotal: v.product_price * (v.qty + 1),
        }
      } else {
        return v
      }
    })

    setItems(newItems)
    saveToLocalStorage(newItems)
  }

  // 減少數量，回傳新的陣列，符合sid的商品數量-1
  const decrement = (items, sid) => {
    const newItems = items.map((v, i) => {
      if (v.sid === sid)
        return { ...v, qty: v.qty - 1, subtotal: v.product_price * (v.qty - 1) }
      else return v
    })

    setItems(newItems)
    saveToLocalStorage(newItems)
  }

  // 加入購物車後要將item設定進去items
  const addItem = (item) => {
    // 檢查是否存在: 用 findIndex，沒找到會回傳-1
    const index = items.findIndex((v, i) => {
      return v.sid === item.sid
    })

    // 如果有找到，如果沒找到就會往下跑
    if (index > -1) {
      // 數量+1
      increment(items, item.sid)
      Swal.fire({
        toast: true,
        width: 280,
        position: 'top',
        icon: 'success',
        title: '商品已添加到購物車',
        showConfirmButton: false,
        timer: 1500,
      })
      return // 跳出函式
    }

    // 擴充: 原本商品資料物件中沒有數量(qty)
    const newItem = { ...item, qty: 1, subtotal: item.product_price }

    Swal.fire({
      toast: true,
      width: 280,
      position: 'top',
      icon: 'success',
      title: '商品已添加到購物車',
      showConfirmButton: false,
      timer: 1500,
    })

    // 通用三步驟: 展開後值接設定進去
    setItems([...items, newItem])
    saveToLocalStorage([...items, newItem])
  }

  const addMutiItem = (item) => {
    const { qty, ...remain } = item
    console.log(item)
    const index = items.findIndex((v, i) => v.sid === item.sid)

    if (index > -1) {
      const newQty = items[index].qty + qty
      if (newQty > item.stock) {
        Swal.fire({
          toast: true,
          width: 350,
          position: 'top',
          icon: 'warning',
          iconColor: '#ff804a',
          title: '您已將所有庫存加入購物車',
          showConfirmButton: false,
          timer: 1500,
        })
        return
      }

      setItems((prevItems) => {
        const newItems = prevItems.map((v, i) =>
          v.sid === item.sid
            ? { ...v, qty: newQty, subtotal: item.product_price * newQty }
            : v
        )
        saveToLocalStorage(newItems)
        return newItems
      })

      Swal.fire({
        toast: true,
        width: 280,
        position: 'top',
        icon: 'success',
        title: '商品已添加到購物車',
        showConfirmButton: false,
        timer: 1500,
      })
      return
    }

    const newItem = { ...item, qty: qty, subtotal: item.product_price * qty }

    Swal.fire({
      toast: true,
      width: 280,
      position: 'top',
      icon: 'success',
      title: '商品已添加到購物車',
      showConfirmButton: false,
      timer: 1500,
    })

    setItems([...items, newItem])
    saveToLocalStorage([...items, newItem])
  }

  // 計算數量
  const calTotalItems = () => {
    let total = 0
    for (let i = 0; i < items.length; i++) {
      // 將每一項商品的小計加總
      total += items[i].qty
    }
    return total
  }

  // 計算總金額
  const calTotalPrice = () => {
    let total = 0

    for (let i = 0; i < items.length; i++) {
      total += items[i].subtotal
    }

    return total
  }

  // 可利用 陣列的方法：reduce (累加、歸納) 2 -> 1 ,累加總數量及總金額
  const totalItems = items.reduce((acc, v) => acc + v.qty, 0)
  // const totalPrice = items.reduce((acc, v) => acc + v.subtotal, 0)
  // const totalPrice = items.reduce((acc, v) => acc + v.qty * v.price, 0)

  const totalPrice = calTotalPrice()

  const applyDiscount = (coupon) => {
    setSelectedCoupon(coupon)
  }

  const removeDiscount = () => {
    setSelectedCoupon(null)
  }

  // 算出折扣的價格顯示
  const getDiscountAmount = (coupon) => {
    switch (coupon) {
      case '60元運費抵用卷':
        return 60
      case '器材類商品85折優惠卷':
        return Math.ceil(calTotalPrice() * 0.15)
      default:
        return 0
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        addMutiItem,
        increment,
        decrement,
        remove,
        removeMulti,
        calTotalItems,
        calTotalPrice,
        totalItems,
        totalPrice,
        selectedCoupon,
        applyDiscount,
        removeDiscount,
        getDiscountAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
