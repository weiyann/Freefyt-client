import React from 'react'
import styles from '@/styles/course/course-payment.module.css'
import SuccessIcon from '@/components/store/cart/success-icon'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'

export default function Success() {
  const [orderData, setOrderData] = useState([])
  const router = useRouter()
  const getOrderData = async () => {
    try {
      const { pid } = router.query
      console.log(router.query)
      console.log('purchase_id:', pid)

      const r = await fetch(
        `http://localhost:3002/course/course-purchase-order/${pid}`
      )
      const d = await r.json()
      setOrderData(d)
    } catch (ex) {
      console.log(ex)
    }
  }
  useEffect(() => {
    getOrderData()
  }, [router.query])

  return (
    <>
      {/* <pre>{JSON.stringify(orderData, null, 4)}</pre> */}
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
                預約時間
              </div>
            </div>
            <div className={styles['step']}>
              <div className={`${styles['num']} ${styles['num-current']}`}>
                2
              </div>
              <div
                className={`${styles['step-text']} ${styles['step-text-current']}`}
              >
                線上付款
              </div>
            </div>
            <div className={styles['step']}>
              <div className={`${styles['num']} ${styles['num-current']}`}>
                3
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
          <SuccessIcon />
          <h4 className={styles['success-text']}>謝謝您，您的訂單已成立！</h4>
        </div>
      </section>

      {/* 訂單表 */}
      <section>
        <div
          className="container"
          style={{ justifyContent: 'center', display: 'flex' }}
        >
          <div className={styles['credit-card-container']}>
            <div className={styles['card-title']}>訂單明細</div>
            <div className={styles['card-body']}>
              <div className={styles['order-line']}>
                <div className={styles['order-text']}>訂單編號:</div>
                <div className={styles['order-text']}>
                  {orderData[0] && orderData[0].order_id}
                </div>
              </div>
              <div className={styles['order-line']}>
                <div className={styles['order-text']}>課程名稱:</div>
                <div className={styles['order-text']}>
                  {orderData[0] && orderData[0].name}
                </div>
              </div>
              <div className={styles['order-line']}>
                <div className={styles['order-text']}>上課時間:</div>
                <div className={styles['order-text']}>
                  {orderData[0] &&
                    dayjs(
                      orderData[0].course_datetime).format('YYYY-MM-DD HH:mm:ss')
                    }
                </div>
              </div>
              <div className={styles['order-line']}>
                <div className={styles['order-text']}>訂單金額:</div>
                <div className={styles['order-text']}>
                  NT${orderData[0] && orderData[0].price.toLocaleString()}
                </div>
              </div>
              <div className={styles['order-line']}>
                <div className={styles['order-text']}>訂單日期:</div>
                <div className={styles['order-text']}>
                  {orderData[0] &&
                    dayjs(orderData[0].purchase_time).format(
                      'YYYY-MM-DD HH:mm:ss'
                    )}
                </div>
              </div>
              <div className={styles['order-line']}>
                <div className={styles['order-text']}>付款方式:</div>
                <div className={styles['order-text']}>信用卡</div>
              </div>

              <Link href={'/course/member/timetable'}>
                <button type="button" className={styles['btn-pay-credit']}>
                  查看我的課程
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
