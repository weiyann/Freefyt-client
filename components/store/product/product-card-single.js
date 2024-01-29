import React from 'react'
import styles from '@/styles/store/product/product-style.module.css'
import Link from 'next/link'
import { useCart } from '@/hooks/use-cart'
import ProductFavIcon from './product-fav-icon'

export default function ProductCardSingle({ product, imageUrl }) {
  const { addItem } = useCart()

  return (
    <div className={styles['product-item']} key={product.sid}>
      <Link href={`/store/product/${product.sid}`}>
        <div className={styles['product-img']}>
          {imageUrl && <img src={imageUrl} alt={product.name} />}
        </div>
        <div className={styles['product-name']}>{product.name}</div>
        <div className={styles['product-price']}>
          NT${product.product_price && product.product_price.toLocaleString()}
        </div>
        <div className={styles['product-info']}>
          <div>
            <div className={styles['product-stock']}>
              庫存量: {product.stock}
            </div>
            <div className={styles['product-purchase-qty']}>
              累積購買數: {product.purchase_qty}
            </div>
          </div>
        </div>
      </Link>
      <div className={styles['product-fav']}>
        <ProductFavIcon product_sid={product.sid} />
      </div>
      <div className={styles['cart-btn']}>
        <button
          className={styles['add-to-cart-btn']}
          onClick={() => addItem(product)}
        >
          + ADD TO CART
        </button>
      </div>
    </div>
  )
}
