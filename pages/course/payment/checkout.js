import React from 'react'
import styles from '@/styles/course/course-payment.module.css'
export default function Checkout() {
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
              <div className={styles['num']}>3</div>
              <div className={styles['step-text']}>完成訂單</div>
            </div>
            <div className={styles['step-line']} />
          </div>
        </div>
      </section>

      {/* 填寫付款資料 */}
      <section>
        <div
          className="container"
          style={{ justifyContent: 'center', display: 'flex' }}
        >
          <div className={styles['credit-card-container']}>
            <div className={styles['card-title']}>信用卡付款</div>
            <div className={styles['card-body']}>
              <div className={styles['credit-card-title']}>
                請輸入信用卡資訊
              </div>
              <div className={styles['card-text']}>持卡人姓名</div>
              <input type="text" />
              <div className={styles['card-text']}>信用卡號碼</div>
              <input type="text" />
              <div className={styles['card-text']}>{'有效期限(月/年)'}</div>
              <input type="text" />
              <div className={styles['card-text']}>背面末三碼</div>
              <input type="text" />
              <button type="button" className={styles['btn-pay-credit']}>
                信用卡結帳
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
