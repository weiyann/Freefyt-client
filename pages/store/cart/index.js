import { useState, useEffect, useContext } from 'react'
import { useCart } from '@/hooks/use-cart'
import AuthContext from '@/context/auth-context'
import { PRODUCT_IMG, CART_MEMBER_COUPON } from '@/configs'
import Link from 'next/link'
import styles from '@/styles/store/cart/cart.module.css'
import Swal from 'sweetalert2'
import { FaTrashCan } from 'react-icons/fa6'

export default function Cart() {
  const {
    items = [],
    increment,
    decrement,
    remove,
    removeMulti,
    calTotalItems,
    calTotalPrice,
    selectedCoupon,
    applyDiscount,
    removeDiscount,
    getDiscountAmount,
  } = useCart()
  const isCartEmpty = items.length === 0

  const [itemImg, setItemImg] = useState([])
  const [coupon, setCoupon] = useState([])
  const { auth } = useContext(AuthContext)
  const memberId = auth.id

  // 取得商品圖片
  const getProductsImage = async () => {
    try {
      const imagePromises = items.map(async (v) => {
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
    } catch (ex) {
      console.error(ex)
    }
  }

  // 取得會員折價卷紀錄
  const getMemberCoupon = async () => {
    const mid = memberId
    try {
      const r = await fetch(CART_MEMBER_COUPON + `/${mid}`)
      const d = await r.json()
      if (d.success) {
        setCoupon(d.rows)
      } else {
        console.log('no member coupon')
      }
    } catch (ex) {
      console.log(ex)
    }
  }

  useEffect(() => {
    getProductsImage()
    getMemberCoupon()
  }, [items])

  return (
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
              <div className={styles['num']}>2</div>
              <div className={styles['step-text']}>填寫資料</div>
            </div>
            <div className={styles['step']}>
              <div className={styles['num']}>3</div>
              <div className={styles['step-text']}>確認訂單</div>
            </div>
            <div className={styles['step']}>
              <div className={styles['num']}>4</div>
              <div className={styles['step-text']}>完成訂單</div>
            </div>
            <div className={styles['step-line']} />
          </div>
        </div>
      </section>
      {/* cart */}
      <section id="fyt-cart" className={styles['fyt-cart-section']}>
        <div className="container">
          <div className={styles['fyt-cart']}>
            <h3 className={styles['cart-title']}>
              購物車({calTotalItems()}件)
            </h3>
            <div className={styles['cart-item']}>
              <div className={styles['cart-th']}>商品資料</div>
              <div className={styles['cart-th']}>單件價格</div>
              <div className={styles['cart-th']}>數量</div>
              <div className={styles['cart-th']}>商品小計</div>
              <div className={styles['cart-th']}>
                <FaTrashCan
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    Swal.fire({
                      toast: false,
                      width: 400,
                      position: 'top',
                      icon: 'warning',
                      iconColor: '#ff804a',
                      title: '是否要刪除所有商品？',
                      allowOutsideClick: false,
                      showCancelButton: true,
                      confirmButtonColor: '#ff804a',
                      focusConfirm: false,
                      showConfirmButton: true,
                      cancelButtonColor: '#888888',
                    }).then((result) => {
                      // 如果點擊確認，刪除商品
                      if (result.isConfirmed) {
                        removeMulti()
                        Swal.fire({
                          toast: true,
                          width: 250,
                          position: 'top',
                          icon: 'success',
                          title: '已刪除所有商品',
                          timer: 1500,
                          showConfirmButton: false,
                        })
                      }
                    })
                  }}
                />
              </div>
            </div>
            {items.length === 0 ? (
              <>
                <div className={styles['empty-cart-info']}>
                  <p>&apos;購物車內沒有商品&apos;</p>
                  <Link
                    href="/store/product"
                    className={styles['btn-goToProduct']}
                  >
                    前往商品列表
                  </Link>
                </div>
              </>
            ) : (
              items.map((v) => {
                const itemImageData = itemImg.find((item) => item.sid === v.sid)
                return (
                  <div className={styles['cart-item']} key={v.sid}>
                    <div className={styles['cart-th']}>
                      <div className={styles['cart-item-img']}>
                        {itemImageData && itemImageData.imageUrl ? (
                          <img src={itemImageData.imageUrl} />
                        ) : (
                          <p>Error: no img</p>
                        )}
                      </div>
                      <p className={styles['cart-item-name']}>{v.name}</p>
                    </div>
                    <div className={styles['cart-th']}>
                      NT${v.product_price && v.product_price.toLocaleString()}
                    </div>
                    {/* 數量增減 */}
                    <div className={styles['cart-th']}>
                      <div className={styles['qty']}>
                        <div className={styles['input-group']}>
                          <button
                            className={styles['btn-subtract']}
                            onClick={() => {
                              // 商品數量1 按下減號跳出提示
                              if (v.qty === 1) {
                                // 跳出提示確認是否要刪除
                                Swal.fire({
                                  toast: false,
                                  width: 350,
                                  position: 'top',
                                  icon: 'warning',
                                  iconColor: '#ff804a',
                                  title: '是否要刪除商品？',
                                  allowOutsideClick: false,
                                  showCancelButton: true,
                                  confirmButtonColor: '#ff804a',
                                  focusConfirm: false,
                                  showConfirmButton: true,
                                  cancelButtonColor: '#888888',
                                }).then((result) => {
                                  // 如果點擊確認，刪除商品
                                  if (result.isConfirmed) {
                                    remove(items, v.sid)
                                    Swal.fire({
                                      toast: true,
                                      width: 250,
                                      position: 'top',
                                      icon: 'success',
                                      title: '已刪除商品',
                                      timer: 1500,
                                      showConfirmButton: false,
                                    })
                                  }
                                })
                                return
                              }
                              decrement(items, v.sid)
                            }}
                          >
                            -
                          </button>
                          <div className={styles['form-control']}>{v.qty}</div>
                          <button
                            className={styles['btn-add']}
                            onClick={() => {
                              increment(items, v.sid)
                            }}
                          >
                            +
                          </button>
                        </div>
                        <div className={styles['stock-remain']}>
                          庫存剩下{v.stock}件
                        </div>
                      </div>
                    </div>
                    <div className={styles['cart-th']}>
                      NT${v.subtotal && v.subtotal.toLocaleString()}
                    </div>
                    <div className={styles['cart-th']}>
                      <FaTrashCan
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          // 跳出提示確認是否要刪除
                          Swal.fire({
                            toast: false,
                            width: 350,
                            position: 'top',
                            icon: 'warning',
                            iconColor: '#ff804a',
                            title: '是否要刪除商品？',
                            allowOutsideClick: false,
                            showCancelButton: true,
                            confirmButtonColor: '#ff804a',
                            focusConfirm: false,
                            showConfirmButton: true,
                            cancelButtonColor: '#888888',
                          }).then((result) => {
                            // 如果點擊確認，刪除商品
                            if (result.isConfirmed) {
                              remove(items, v.sid)
                              Swal.fire({
                                toast: true,
                                width: 250,
                                position: 'top',
                                icon: 'success',
                                title: '已將商品刪除',
                                timer: 1500,
                                showConfirmButton: false,
                              })
                            }
                          })
                        }}
                      />
                    </div>
                  </div>
                )
              })
            )}

            {/* 折價卷 */}
            <div className={styles['cart-coupon']}>
              <p className={styles['coupon-text']}>折價卷</p>
              <div className={styles['coupon-select']}>
                <select
                  className={styles['form-select']}
                  name=""
                  id=""
                  value={selectedCoupon}
                  onChange={(e) => {
                    const selected = e.target.value
                    selected === '0'
                      ? removeDiscount()
                      : applyDiscount(selected)
                  }}
                >
                  <option value="0">請選擇折價卷</option>
                  {coupon &&
                    coupon.map((v) => (
                      <option key={v.sid} value={v.name}>
                        {v.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            {/* 訂單資訊 */}
            <div className={styles['cart-order-info']}>
              <h4 className={styles['order-info-text']}>訂單資訊</h4>
              <div className={styles['order-content']}>
                <div className={styles['discount']}>
                  <p>折扣</p>
                  <p>-NT${getDiscountAmount(selectedCoupon)}</p>
                </div>
                <div className={styles['divider']}></div>
                <div className={styles['total']}>
                  <p>合計</p>
                  <p>
                    NT$
                    {Math.max(
                      calTotalPrice() - getDiscountAmount(selectedCoupon),
                      0
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
              {/* 前往結帳btn */}
              <div className={styles['btn-center']}>
                <Link
                  href={isCartEmpty ? '/store/cart' : '/store/cart/checkout'}
                  className={
                    isCartEmpty
                      ? styles['btn-gotocheckout-disable']
                      : styles['btn-gotocheckout']
                  }
                >
                  前往結帳
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
