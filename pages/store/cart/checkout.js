import { useState, useEffect, useContext } from 'react'
import styles from '@/styles/store/cart/cart.module.css'
import { TiArrowSortedDown, TiArrowSortedUp } from 'react-icons/ti' // 收合的三角形
import { useShip711StoreOpener } from '@/hooks/use-ship-711-store'
import { useCart } from '@/hooks/use-cart'
import { PRODUCT_IMG, CART_MEMBER_INFO, CART_CREATEPO } from '@/configs'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'
import AuthContext from '@/context/auth-context'
import debounce from 'lodash.debounce'

export default function Checkout() {
  const [showDetailedCart, setShowDetailedCart] = useState(false)
  const { store711, openWindow, closeWindow } = useShip711StoreOpener(
    'http://localhost:3002/cart/711',
    { autoCloseMins: 3 }
  )
  const [itemImg, setItemImg] = useState([])

  const {
    items = [],
    calTotalItems,
    calTotalPrice,
    selectedCoupon,
    getDiscountAmount,
  } = useCart()

  // 一鍵填入使用
  const [isSameAsMember, setIsSameAsMember] = useState(false)
  const [isSameAsBuyer, setIsSameAsBuyer] = useState(false)

  // 訂購人資料
  const [memberName, setMemberName] = useState('')
  const [memberEmail, setMemberEmail] = useState('')
  const [memberMobile, setMemberMobile] = useState(0)

  // 付款方式狀態
  const paymentOptions = ['LinePay', '信用卡', '取貨付款']
  const [paymentMethod, setPaymentMethod] = useState('')

  // 運送方式狀態
  const [storeid, setStoreid] = useState('')
  const shippingOptions = ['7-11店到店(運費$60)', '宅配(運費$100)']
  const [shippingMethod, setShippingMethod] = useState('')
  const [shippingFee, setShippingFee] = useState(0)

  // 收件人資料
  const [recipientName, setRecipient] = useState('')
  const [recipientMobile, setRecipientMobile] = useState(0)

  // 合計的狀態
  const [totalAmount, setTotalAmount] = useState(0)

  // 用於欄位驗證
  const [terms, setTerms] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)

  const router = useRouter()
  const { auth } = useContext(AuthContext)
  const memberId = auth.id

  // 回到購物車跳出提示
  const handleBackToCart = () => {
    Swal.fire({
      width: 400,
      position: 'center',
      icon: 'warning',
      iconColor: '#ff804a',
      title: '是否要返回到購物車?',
      text: '提醒您資料將不會保留',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: '#ff804a',
    }).then((r) => {
      if (r.isConfirmed) {
        localStorage.removeItem('shippingMethod')
        localStorage.removeItem('paymentMethod')
        localStorage.removeItem('fyt-store711')
        router.push('/store/cart')
      }
    })
  }

  // 購物清單收合 toggle
  const toggleDetailedCart = () => {
    setShowDetailedCart((prev) => !prev)
  }

  // 會員假資料
  // const member = {
  //   member_id: 56,
  //   member_name: '吳可芸',
  //   member_email: 'cocochanel630@gmail.com',
  //   member_mobile: '0928631136',
  // }

  // 取得會員資料
  const getMemberInfo = async () => {
    const mid = memberId
    try {
      const r = await fetch(CART_MEMBER_INFO + `/${mid}`)
      const d = await r.json()
      // console.log(d)
      if (d.success) {
        setMemberName(d.row.member_name)
        setMemberEmail(d.row.member_email)
        setMemberMobile(d.row.member_mobile)
      } else {
        console.log('no member info')
      }
    } catch (ex) {
      console.log(ex)
    }
  }

  const memberFromAuth = {
    member_id: memberId,
    member_name: memberName,
    member_email: memberEmail,
    member_mobile: memberMobile,
  }

  // 一鍵填入會員資料
  const handlecustomerInfo = (prev) => {
    // 如果沒有登入就跳出提示
    if (!memberId) {
      Swal.fire({
        toast: true,
        width: 230,
        position: 'top',
        icon: 'warning',
        iconColor: '#ff804a',
        title: '請先登入會員',
        showConfirmButton: false,
        timer: 2000,
      })
      return
    }
    setIsSameAsMember((prev) => !prev)
  }

  // 一鍵填入訂購人
  const handleRecipientInfo = (prev) => {
    if (!memberId) {
      Swal.fire({
        toast: true,
        width: 230,
        position: 'top',
        icon: 'warning',
        iconColor: '#ff804a',
        title: '請先登入會員',
        showConfirmButton: false,
        timer: 2000,
      })
      return
    }
    setIsSameAsBuyer((prev) => !prev)
    if (!isSameAsBuyer) {
      setRecipient(memberFromAuth.member_name)
      setRecipientMobile(memberFromAuth.member_mobile)
    } else {
      setRecipient('')
      setRecipientMobile(0)
    }
    // console.log(recipientName)
  }

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

  // 欄位驗證
  const validateForm = debounce(() => {
    const isValid =
      memberName.trim() !== '' &&
      memberEmail.trim() !== '' &&
      memberMobile !== 0 &&
      paymentMethod !== '' &&
      shippingMethod !== '' &&
      store711.storeid !== '' &&
      terms !== false

    // console.log('isValid', isValid)

    setIsFormValid(isValid)
  })

  // 送出訂單給後端
  const creactPO = async (e) => {
    e.preventDefault()
    const storeidValue = store711.storeid || ''

    // 總訂單資訊
    const orderData = {
      member_id: memberId,
      recipient: recipientName,
      recipient_mobile: recipientMobile,
      store_id: storeidValue,
      shipping_method: shippingMethod,
      shipping_fee: shippingFee,
      total_amount: totalAmount,
      payment_method: paymentMethod,
      products: items,
    }
    // console.log('orderDate:', orderData)

    try {
      const r = await fetch(CART_CREATEPO, {
        method: 'POST',
        body: JSON.stringify(orderData),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const d = await r.json()
      // console.log(d)
      if (d.success) {
        // console.log(d.purchase_order_id)
        const newOrderId = d.purchase_order_id

        router.push(
          `http://localhost:3000/store/cart/order-confirm?poid=${newOrderId}`
        )
      } else if (!d.success) {
        // 錯誤訊息:資料未填寫，導致無法新增訂單成功
        console.log('資料未填寫，導致無法新增訂單成功')
      }
    } catch (ex) {
      console.log(ex)
    }
  }

  useEffect(() => {
    getProductsImage()
    setStoreid('')
  }, [items])

  // 一進來先將 localstorage fyt-store711 刪除
  useEffect(() => {
    localStorage.removeItem('fyt-store711')
    setStoreid('')
    getMemberInfo()
  }, [memberId])

  // 用於欄位驗證
  useEffect(() => {
    validateForm()
  }, [
    memberName,
    memberEmail,
    memberMobile,
    paymentMethod,
    shippingMethod,
    store711.storeid,
    terms,
  ])

  // 重算合計
  useEffect(() => {
    if (shippingMethod === '7-11店到店(運費$60)') {
      setShippingFee(60)
    } else if (shippingMethod === '宅配(運費$100)') {
      setShippingFee(100)
    } else if (!shippingMethod) {
      setShippingFee(0)
    }

    const totalAmountFinal = Math.max(
      calTotalPrice() - getDiscountAmount(selectedCoupon) + shippingFee,
      0
    )

    setTotalAmount(totalAmountFinal)
  }, [
    calTotalPrice,
    getDiscountAmount,
    selectedCoupon,
    shippingMethod,
    shippingFee,
  ])

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
      {/* 回到購物車按鈕 */}
      <section>
        <div className="container">
          <button
            className={styles['btn-back-to-cart']}
            onClick={handleBackToCart}
          >
            &lt; 回到購物車
          </button>
        </div>
      </section>
      {/* 購物車項目(不可更改版) */}
      <section id="fyt-cart" className={styles['fyt-cart-section']}>
        <div className="container">
          {/* <h4 className={styles['checkout-total']}>
            合計: NT$
            {Math.max(calTotalPrice() - getDiscountAmount(selectedCoupon), 0)}
          </h4> */}
          <div className={styles['fyt-cart']}>
            <button
              className={styles['checkout-title']}
              onClick={toggleDetailedCart}
            >
              {showDetailedCart ? (
                <>
                  <h3 className={styles['checkout-title-fold']}>
                    購買清單 ({calTotalItems()} 件)&nbsp;
                    <TiArrowSortedUp size={35} style={{ cursor: 'pointer' }} />
                  </h3>
                </>
              ) : (
                <>
                  <h3 className={styles['checkout-title-fold']}>
                    購買清單 ({calTotalItems()} 件)&nbsp;
                    <TiArrowSortedDown
                      size={35}
                      style={{ cursor: 'pointer' }}
                    />
                  </h3>
                </>
              )}
            </button>
            {/* 購物車清單toggle */}
            {showDetailedCart && (
              <>
                <div className={styles['cart-item-checkout']}>
                  <div className={styles['cart-th']}>商品資料</div>
                  <div className={styles['cart-th']}>單件價格</div>
                  <div className={styles['cart-th']}>數量</div>
                  <div className={styles['cart-th']}>小計</div>
                </div>
                {items.map((v) => {
                  const itemImageData = itemImg.find(
                    (item) => item.sid === v.sid
                  )
                  return (
                    <div className={styles['cart-item-checkout']} key={v.sid}>
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
                            <div>{v.qty}</div>
                          </div>
                        </div>
                      </div>
                      <div className={styles['cart-th']}>
                        NT${v.subtotal && v.subtotal.toLocaleString()}
                      </div>
                    </div>
                  )
                })}
              </>
            )}
          </div>
        </div>
      </section>
      {/* 填寫資料 */}
      <section>
        <div className="container">
          <div className={styles['checkout-box']}>
            <div>
              {/* 訂購人資料 */}
              <div className={styles['customer-info']}>
                <h3 className={styles['checkout-title']}>訂購人資料</h3>
                <div className={styles['customer-info-detail']}>
                  <div className={styles['customer-info-box']}>
                    <input
                      type="checkbox"
                      name="sameAsMember"
                      id=""
                      checked={isSameAsMember}
                      onChange={handlecustomerInfo}
                    />{' '}
                    <span>同會員資料</span>
                  </div>
                  <div className={styles['customer-info-box']}>
                    <span className={styles['customer-info-text']}>
                      訂購人姓名:
                    </span>
                    <input
                      type="text"
                      name="member_name"
                      value={isSameAsMember ? memberFromAuth.member_name : ''}
                      onChange={(e) => {
                        setMemberName(e.target.value)
                      }}
                      // className={isSameAsMember ? '' : styles['red-border']}
                    />
                  </div>
                  <div className={styles['customer-info-box']}>
                    <span className={styles['customer-info-text']}>
                      電子信箱:
                    </span>
                    <input
                      type="email"
                      name="member_email"
                      id=""
                      value={isSameAsMember ? memberFromAuth.member_email : ''}
                      onChange={(e) => {
                        setMemberEmail(e.target.value)
                      }}
                      // className={isSameAsMember ? '' : styles['red-border']}
                    />
                  </div>
                  <div className={styles['customer-info-box']}>
                    <span className={styles['customer-info-text']}>
                      手機號碼:
                    </span>
                    <input
                      type="number"
                      name="member_mobile"
                      value={isSameAsMember ? memberFromAuth.member_mobile : ''}
                      onChange={(e) => {
                        setMemberMobile(e.target.value)
                      }}
                      // className={isSameAsMember ? '' : styles['red-border']}
                    />
                  </div>
                </div>
              </div>
              {/* 付款資料 */}
              <div className={styles['customer-info']}>
                <h3 className={styles['checkout-title']}>付款資料</h3>
                <div className={styles['customer-info-detail']}>
                  <div className={styles['shipping-method']}>
                    <h3 className={styles['select-shipping-method']}>
                      選擇付款方式
                    </h3>
                    <select
                      className={styles['payment-select-option']}
                      // className={`${styles['payment-select-option']} ${
                      //   paymentMethod ? '' : styles['red-border']
                      // }`}
                      name="payment"
                      id="payment"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="">請選擇付款方式</option>
                      {paymentOptions.map((v, i) => {
                        return (
                          <option value={v} key={v}>
                            {v}
                          </option>
                        )
                      })}
                    </select>
                    <p className={styles['warn-tip']}>
                      支援 LINE Pay、信用卡、貨到付款等支付方式
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* 運送方式 */}
            <div className={styles['customer-info']}>
              <div
                className={`${styles['checkout-title']} ${styles['shipping-info-title']}`}
              >
                <h3>運送資料</h3>
              </div>
              <div className={styles['customer-info-detail']}>
                <div className={styles['shipping-method']}>
                  <h3 className={styles['select-shipping-method']}>
                    選擇運送方式
                  </h3>
                  <select
                    className={styles['shipping-method-select-option']}
                    // className={`${styles['shipping-method-select-option']} ${
                    //   shippingMethod ? '' : styles['red-border']
                    // }`}
                    name="shipping"
                    id="shipping"
                    value={shippingMethod}
                    onChange={(e) => setShippingMethod(e.target.value)}
                  >
                    <option value="">請選擇運送方式</option>
                    {shippingOptions.map((v, i) => {
                      return (
                        <option value={v} key={v}>
                          {v}
                        </option>
                      )
                    })}
                  </select>
                </div>
                <div className={styles['customer-info-box']}>
                  <input
                    type="checkbox"
                    name=""
                    id=""
                    checked={isSameAsBuyer}
                    onChange={handleRecipientInfo}
                  />{' '}
                  <span>同訂購人資料</span>
                </div>
                <div className={styles['customer-info-box']}>
                  <span className={styles['customer-info-text']}>
                    收件人姓名:
                  </span>
                  <input
                    type="text"
                    name=""
                    value={isSameAsBuyer ? memberFromAuth.member_name : ''}
                    onChange={(e) => {
                      setRecipient(e.target.value)
                    }}
                    // className={isSameAsBuyer ? '' : styles['red-border']}
                  />
                </div>
                <div className={styles['customer-info-box']}>
                  <span className={styles['customer-info-text']}>
                    收件人手機:
                  </span>
                  <input
                    type="number"
                    name=""
                    value={isSameAsBuyer ? memberFromAuth.member_mobile : ''}
                    onChange={(e) => {
                      setRecipientMobile(e.target.value)
                    }}
                    // className={isSameAsBuyer ? '' : styles['red-border']}
                  />
                </div>
                <div>
                  {shippingMethod === '7-11店到店(運費$60)' && (
                    <>
                      {' '}
                      <div className={styles['ship-7-11-text']}>
                        <img src="/store/seven-eleven.png" alt="" />
                        <p>選擇門市:</p>
                      </div>
                      <button
                        className={styles['btn-select-7-11']}
                        onClick={() => {
                          openWindow()
                        }}
                      >
                        選擇門市
                      </button>
                      {store711.storeid && store711.storename ? (
                        <p className={styles['selected-store']}>
                          已選擇門市: {store711.storeid} {store711.storename}
                        </p>
                      ) : (
                        <p className={styles['selected-store']}></p>
                      )}
                    </>
                  )}
                </div>
              </div>
              <p className={styles['warn-tip-total']}>
                合計金額: NT$
                {(
                  Math.max(
                    calTotalPrice() - getDiscountAmount(selectedCoupon),
                    0
                  ) + shippingFee
                ).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles['submitPO-section']}>
        <div className="container">
          {/* submit PO */}
          <div className={styles['submitPO']}>
            <div>
              <input
                type="checkbox"
                name="terms"
                id="terms"
                value={terms}
                onChange={(e) => {
                  setTerms(e.target.checked)
                }}
              />
              &nbsp;
              <span>
                我同意網站
                <span className={styles['terms-text']}>服務條款</span>及
                <span className={styles['terms-text']}>隱私權政策</span>
              </span>
            </div>
            {isFormValid ? (
              <button className={styles['btn-submitPO']} onClick={creactPO}>
                提交訂單
              </button>
            ) : (
              <button type="button" className={styles['btn-submitPO-disabled']}>
                提交訂單
              </button>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
