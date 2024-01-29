import { useState, useEffect, Fragment } from 'react'
import { useRouter } from 'next/router'
import styles from '@/styles/store/cart/cart.module.css'
import Link from 'next/link'
import { TiArrowSortedDown, TiArrowSortedUp } from 'react-icons/ti' // 收合的三角形
import {
  CART_GETPO,
  CART_GETPODETAIL,
  PRODUCT_IMG,
  CART_LINEPAY,
} from '@/configs'
import dayjs from 'dayjs'

export default function OrderConfirm() {
  // { "success": true, "row": { "sid": 79, "purchase_order_id": "2eee8dbd-fda6-4dea-9aa0-7dbc4deb76ac", "member_id": "3", "recipient": "Emily Brown", "recipient_mobile": "0983296444", "store_id": 111418, "shipping_method": "7-11店到店(運費$60)", "shipping_fee": 60, "total_amount": 7640, "payment_method": "LinePay", "payment_status": "未付款", "status": "訂單處理中", "created_at": "2024-01-05T03:24:48.000Z", "purchase_order_sid": "27", "product_id": "FYT-20231209-010", "product_price": 6200, "qty": 1, "amount": 6200 } }

  const router = useRouter()
  const [purchaseOrder, setPurchaseOrder] = useState([])
  const [products, setProducts] = useState([])
  const [itemImg, setItemImg] = useState([])
  const [showDetailedCart, setShowDetailedCart] = useState(false)

  // 取得訂單明細
  const getPurchaseOrder = async () => {
    const poid = router.query.poid || ''
    // console.log(poid)

    try {
      const r = await fetch(CART_GETPO + `?poid=${poid}`)
      const d = await r.json()
      setPurchaseOrder(d)
    } catch (ex) {
      console.log(ex)
    }
  }

  // 取得訂單詳細商品
  const getdetailPO = async () => {
    const poid = router.query.poid || ''
    // console.log(poid)

    try {
      const r = await fetch(CART_GETPODETAIL + `?poid=${poid}`)
      const d = await r.json()
      setProducts(d)
    } catch (ex) {
      console.log(ex)
    }
  }

  // 取得商品圖片
  const getProductsImage = async () => {
    try {
      if (products.rows) {
        const imagePromises = products.rows.map(async (v) => {
          const filename = v.imgs?.split(',')[0]
          const imageUrl = `${PRODUCT_IMG}/${filename}`

          try {
            const r = await fetch(imageUrl)
            if (r) {
              const blob = await r.blob()
              return { sid: v.sid, imageUrl: URL.createObjectURL(blob) }
            } else {
              return { sid: v.sid, imageUrl: null }
            }
          } catch (ex) {
            console.error(ex)
            return { sid: v.sid, imageUrl: null }
          }
        })

        const imageData = await Promise.all(imagePromises)
        setItemImg(imageData)
      }
    } catch (ex) {
      console.error(ex)
    }
  }

  // 購物車收合toggle
  const toggleDetailedCart = () => {
    setShowDetailedCart((prev) => !prev)
  }

  // --- 按下 LINE Pay 按鈕
  const sendPoToLine = async (e) => {
    e.preventDefault()
    try {
      const linePayOrder = await convertOrderForLinePay()

      const r = await fetch(CART_LINEPAY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: purchaseOrder.row ? purchaseOrder.row.purchase_order_id : '',
          total_amount: purchaseOrder.row.total_amount,
          linePayOrder: linePayOrder,
        }),
      })
      const d = await r.json()
      console.log('linpayresWeb:', d)
      window.location.replace(`${d}`)
    } catch (ex) {
      console.log(ex)
    }
  }

  // 將訂單資訊轉換成line要求的格式
  const convertOrderForLinePay = async () => {
    try {
      const linePayOrder = {
        orderId: '',
        currency: 'TWD',
        amount: 0,
        packages:
          products && products.rows
            ? products.rows.map((v, i) => {
                return {
                  id: `products_${i + 1}`,
                  amount: v.amount,
                  userFee: 0,
                  products: [
                    {
                      name: v.name,
                      quantity: v.qty,
                      price: v.product_price,
                    },
                  ],
                }
              })
            : [],
        // options: {
        //   shipping: {
        //     feeAmount: purchaseOrder.row.shipping_fee.toString(),
        //   },
        // },
      }
      // console.log('linePayOrder:', linePayOrder)
      return linePayOrder
    } catch (ex) {
      console.log(ex)
    }
  }

  useEffect(() => {
    getPurchaseOrder()
  }, [router.query.poid])

  useEffect(() => {
    getdetailPO()
  }, [router.query.poid])

  useEffect(() => {
    getProductsImage()
  }, [products])

  return (
    <>
      {/* {JSON.stringify(purchaseOrder, null, 4)} */}
      <hr />
      {/* {JSON.stringify(products, null, 4)} */}
      {/* cart-step */}
      <section id="cart-step" className={styles['cart-step-section']}>
        <div className="container">
          <div className={styles['cart-step']}>
            <div className={styles['step']}>
              <div className={`${styles['num']} ${styles['num-current']}`}>
                1
              </div>
              <div
                className={`${styles['step-text']} ${styles['step-text-current']}`}
              >
                購物車
              </div>
            </div>
            <div className={styles['step']}>
              <div className={`${styles['num']} ${styles['num-current']}`}>
                2
              </div>
              <div
                className={`${styles['step-text']} ${styles['step-text-current']}`}
              >
                填寫資料
              </div>
            </div>
            <div className={styles['step']}>
              <div className={`${styles['num']} ${styles['num-current']}`}>
                3
              </div>
              <div
                className={`${styles['step-text']} ${styles['step-text-current']}`}
              >
                確認訂單
              </div>
            </div>
            <div className={styles['step']}>
              <div className={styles['num']}>4</div>
              <div className={styles['step-text']}>完成訂單</div>
            </div>
            <div className={styles['step-line']} />
          </div>
        </div>
      </section>
      {/* 購物車詳情 */}
      <section>
        <div className="container">
          <section id="fyt-cart" className={styles['fyt-cart-section']}>
            <div className="container">
              <div className={styles['fyt-cart']}>
                <button
                  className={styles['checkout-title']}
                  onClick={toggleDetailedCart}
                >
                  {showDetailedCart ? (
                    <>
                      <h3 className={styles['checkout-title-fold']}>
                        購買清單 ({products?.rows?.length || 0} 件)&nbsp;
                        <TiArrowSortedUp
                          size={35}
                          style={{ cursor: 'pointer' }}
                        />
                      </h3>
                    </>
                  ) : (
                    <>
                      <h3 className={styles['checkout-title-fold']}>
                        購買清單 ({products?.rows?.length || 0} 件)&nbsp;
                        <TiArrowSortedDown
                          size={35}
                          style={{ cursor: 'pointer' }}
                        />
                      </h3>
                    </>
                  )}
                </button>

                {showDetailedCart && (
                  <>
                    <div className={styles['cart-item-confirm']}>
                      <div className={styles['cart-th']}>商品資料</div>
                      <div className={styles['cart-th']}>單件價格</div>
                      <div className={styles['cart-th']}>數量</div>
                      <div className={styles['cart-th']}>小計</div>
                    </div>
                    {products.rows ? (
                      products.rows.map((v) => {
                        const itemImageData = itemImg.find(
                          (item) => item.sid === v.sid
                        )

                        return (
                          <div
                            className={styles['cart-item-confirm']}
                            key={v.sid}
                          >
                            <div className={styles['cart-th']}>
                              <div className={styles['cart-item-img']}>
                                {itemImageData && itemImageData.imageUrl ? (
                                  <img src={itemImageData.imageUrl} />
                                ) : (
                                  <p>Error: no img</p>
                                )}
                                {/* <img src={v.image_url} alt={v.name} /> */}
                              </div>
                              <p className={styles['cart-item-name']}>
                                {v.name}
                              </p>
                            </div>
                            <div className={styles['cart-th']}>{`NT$${
                              v.product_price &&
                              v.product_price.toLocaleString()
                            }`}</div>
                            {/* 數量 */}
                            <div className={styles['cart-th']}>
                              <div className={styles['qty']}>
                                <div className={styles['input-group']}>
                                  <div>{v.qty}</div>
                                </div>
                              </div>
                            </div>
                            <div className={styles['cart-th']}>{`NT$${
                              v.amount && v.amount.toLocaleString()
                            }`}</div>
                          </div>
                        )
                      })
                    ) : (
                      <></>
                    )}
                  </>
                )}

                {/* 填寫資料 */}
              </div>
            </div>
          </section>
        </div>
      </section>
      {/* 訂單明細 */}
      <section className={styles['purchase-order-section']}>
        <div className="container">
          {/* 確認訂單 */}
          <div className={styles['purchase-order']}>
            <h3 className={styles['purchase-order-title']}>訂單確認</h3>
            {purchaseOrder && purchaseOrder.row ? (
              <>
                <div className={styles['po-detail']}>
                  <p className={styles['po-detail-text']}>
                    訂單編號: {purchaseOrder.row.purchase_order_id.slice(0, 14)}
                  </p>
                  <p className={styles['po-detail-text']}>
                    訂單金額: NT$
                    {purchaseOrder.row.total_amount &&
                      purchaseOrder.row.total_amount.toLocaleString()}
                  </p>
                  <p className={styles['po-detail-text']}>
                    訂單日期:{' '}
                    {dayjs(purchaseOrder.row.created_at).format(
                      'YYYY-MM-DD HH:mm'
                    )}
                  </p>
                  <p className={styles['po-detail-text']}>
                    訂單狀態: {purchaseOrder.row.status}
                  </p>
                  <p className={styles['po-detail-text']}>
                    物流方式: {purchaseOrder.row.shipping_method}
                  </p>
                  <p className={styles['po-detail-text']}>
                    收件人: {purchaseOrder.row.recipient}
                  </p>
                  <p className={styles['po-detail-text']}>
                    收件人手機: {purchaseOrder.row.recipient_mobile}
                  </p>
                  <p className={styles['po-detail-text']}>
                    付款方式: {purchaseOrder.row.payment_method}
                  </p>
                  <p className={styles['po-detail-text']}>
                    付款狀態: {purchaseOrder.row.payment_status}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className={styles['po-detail']}>
                  <p className={styles['no-po']}>查無此訂單</p>
                </div>
              </>
            )}
          </div>
          {/* 進行線上付款 */}
          <div className={styles['pay-online']}>
            <h3 className={styles['pay-online-title']}>進行線上付款</h3>
            <div className={styles['linepay-box']}>
              <button
                className={styles['btn-linepay']}
                onClick={(e) => {
                  sendPoToLine(e)
                }}
              >
                LINE Pay 付款
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
