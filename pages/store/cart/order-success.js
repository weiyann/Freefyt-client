import { useState, useEffect } from 'react'
import styles from '@/styles/store/cart/cart.module.css'
import payLoadingStyles from '@/styles/store/cart/pay-loading.module.css'
import SuccessIcon from '@/components/store/cart/success-icon'
import Link from 'next/link'
import Swal from 'sweetalert2'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import {
  CART_LINEPAYCONFIRM,
  CART_GETPO,
  CART_GETPODETAIL,
  PRODUCT_IMG,
  PRODUCT_POPULAR,
} from '@/configs'
import { TiArrowSortedDown, TiArrowSortedUp } from 'react-icons/ti' // 收合的三角形

import ProductSwiper from '@/components/swiper/product-swiper'
import { useCart } from '@/hooks/use-cart'
import FailIcon from '@/components/store/cart/fail-icon'

export default function Checkout() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [purchaseOrder, setPurchaseOrder] = useState([])
  const [products, setProducts] = useState([])
  const [itemImg, setItemImg] = useState([])
  const [showDetailedCart, setShowDetailedCart] = useState(false)
  const [popularProducts, setpopularProducts] = useState([])
  const { removeMulti } = useCart()
  const [paidSuccess, setPaidSuccess] = useState(false)

  // Line Pay: 確認交易，處理伺服器通知 line pay 已確認付款
  const handleConfirm = async (transactionId, orderId) => {
    try {
      const r = await fetch(
        CART_LINEPAYCONFIRM +
          `?transactionId=${transactionId}&orderId=${orderId}`
      )
      const d = await r.json()

      if (d.success) {
        setPaidSuccess(true)
        localStorage.removeItem('fyt-cart')
        localStorage.removeItem('fyt-store711')
        removeMulti()
        setTimeout(() => {
          setIsLoading(false)
        }, 5000)
      } else {
        setPaidSuccess(false)
        // 處理完畢，關閉載入狀態
        setTimeout(() => {
          setIsLoading(false)
        }, 5000)
        // 跳出錯誤提示
        console.log('付款失敗')
      }
    } catch (ex) {
      console.log(ex)
    }
  }

  //取得訂單
  const getPurchaseOrder = async () => {
    const orderId = router.query.orderId || ''

    try {
      const r = await fetch(CART_GETPO + `?poid=${orderId}`)
      const d = await r.json()
      setPurchaseOrder(d)
    } catch (ex) {
      console.log(ex)
    }
  }

  // 取得訂單詳細商品
  const getdetailPO = async () => {
    const orderId = router.query.orderId || ''

    try {
      const r = await fetch(CART_GETPODETAIL + `?poid=${orderId}`)
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

  // 取得 10 筆熱門商品
  const getPopularProduct = async () => {
    try {
      const r = await fetch(PRODUCT_POPULAR)
      const d = await r.json()
      setpopularProducts(d)
    } catch (ex) {
      console.log(ex)
    }
  }

  // Line Pay: confirm 回來使用
  useEffect(() => {
    if (router.isReady) {
      // console.log(router.query)
      const { transactionId, orderId } = router.query

      // 如果沒有帶transactionId或orderId時，導向至首頁(或其它頁)或跳出錯誤訊息
      if (!transactionId || !orderId) {
        console.log('qs 參數錯誤')
        // router.push('/store/cart')
        // 關閉載入狀態
        setIsLoading(false)
        // 不繼續處理
        return
      }

      // 向server發送確認交易api
      handleConfirm(transactionId, orderId)
    }

    // eslint-disable-next-line
  }, [router.isReady])

  useEffect(() => {
    getPurchaseOrder()
  }, [router.query.orderId, isLoading])

  useEffect(() => {
    getdetailPO()
  }, [router.query.orderId])

  useEffect(() => {
    getProductsImage()
  }, [products])

  useEffect(() => {
    getPopularProduct()
  }, [])

  return (
    <>
      {isLoading ? (
        <div className={payLoadingStyles['loading-container']}>
          <div
            className={
              payLoadingStyles['loadingio-spinner-ellipsis-e16fy4ujj7e']
            }
          >
            <div className={payLoadingStyles['loading-text']}>付款中</div>
            <div className={payLoadingStyles['ldio-f6f6kj9mk4n']}>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      ) : (
        <>
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
                  <div className={`${styles['num']} ${styles['num-current']}`}>
                    4
                  </div>
                  <div
                    className={`${styles['step-text']} ${styles['step-text-current']}`}
                  >
                    完成訂單
                  </div>
                </div>
                <div className={styles['step-line']} />
              </div>
            </div>
          </section>
          <section>
            <div className="container">
              {paidSuccess ? (
                <>
                  <SuccessIcon />
                  <h4 className={styles['success-text']}>
                    付款成功，您的訂單已成立！
                  </h4>
                </>
              ) : (
                <>
                  <FailIcon />
                  <h4 className={styles['fail-text']}>付款失敗</h4>
                </>
              )}
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
                                <div
                                  className={styles['cart-th']}
                                >{`NT$${v.amount}`}</div>
                              </div>
                            )
                          })
                        ) : (
                          <></>
                        )}
                      </>
                    )}
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
                <h3 className={styles['purchase-order-title']}>訂單明細</h3>
                {purchaseOrder && purchaseOrder.row ? (
                  <>
                    <div className={styles['po-detail']}>
                      <p className={styles['po-detail-text']}>
                        訂單編號:{' '}
                        {purchaseOrder.row.purchase_order_id.slice(0, 14)}
                      </p>
                      <p className={styles['po-detail-text']}>
                        訂單金額: NT$
                        {purchaseOrder.row.total_amount &&
                          purchaseOrder.row.total_amount.toLocaleString()}
                      </p>
                      <p className={styles['po-detail-text']}>
                        訂單日期:{' '}
                        {dayjs(purchaseOrder.row.created_at).format(
                          'YYYY-MM-DD HH:mm:ss'
                        )}
                      </p>
                      <p className={styles['po-detail-text']}>
                        訂單狀態: {purchaseOrder.row.status}
                      </p>
                      <p className={styles['po-detail-text']}>
                        付款方式: {purchaseOrder.row.payment_method}
                      </p>
                      <p className={styles['po-detail-text']}>
                        付款狀態: {purchaseOrder.row.payment_status}{' '}
                        {/*不知道如何同步改成已付款*/}
                      </p>
                      {/* <p className={styles['po-detail-text']}>
                訂單確認電郵已發送至您的電子郵箱！
              </p> */}
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles['po-detail']}>
                      <p className={styles['no-po']}>無此訂單資訊</p>
                    </div>
                  </>
                )}
                <div className={styles['btn-box']}>
                  <Link
                    href={'/store/product'}
                    className={styles['btn-goToProductList']}
                  >
                    商品列表
                  </Link>
                  <Link
                    href={'/store/product/history-order'}
                    className={styles['btn-goToMyOrder']}
                  >
                    查看訂單
                  </Link>
                </div>
              </div>
            </div>
          </section>
          {/* 最近瀏覽:先用熱門商品替代 */}
          <section className={styles['guesswhatyoulike-section']}>
            <div className="container">
              <div className={styles['category-title']}>
                <span className={styles['category-text']}>
                  - 猜你喜歡 GUESS WHAT YOU LIKE -
                </span>
              </div>
              <div className={styles['product-swiper']}>
                <ProductSwiper rows={popularProducts.rows} />
              </div>
            </div>
          </section>
        </>
      )}
    </>
  )
}
