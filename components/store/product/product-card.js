import React from 'react'
import styles from '@/styles/store/product/product-style.module.css'
import Link from 'next/link'
import { useCart } from '@/hooks/use-cart'
import ProductFavIcon from './product-fav-icon'

export default function ProductCard({ products, imageUrl }) {
  const { items, addItem } = useCart()

  return (
    <>
      {products.map((v) => {
        return (
          <div className={styles['product-item']} key={v.sid}>
            <Link href={`/store/product/${v.sid}`}>
              <div className={styles['product-img']}>
                {imageUrl && <img src={imageUrl} />}
              </div>
              <div className={styles['product-name']}>{v.name}</div>
              <div className={styles['product-price']}>
                NT${v.product_price && v.product_price.toLocaleString()}
              </div>
              <div className={styles['product-info']}>
                <div>
                  <div className={styles['product-stock']}>
                    庫存量: {v.stock}
                  </div>
                  <div className={styles['product-purchase-qty']}>
                    累積購買數: {v.purchase_qty}
                  </div>
                </div>
              </div>
            </Link>
            <div className={styles['product-fav']}>
              <ProductFavIcon product_sid={v.sid} />
            </div>
            <div className={styles['cart-btn']}>
              <button
                className={styles['add-to-cart-btn']}
                onClick={() => addItem(v)}
              >
                + ADD TO CART
              </button>
            </div>
          </div>
        )
      })}
    </>
  )
}
