import styles from '@/styles/member/sweet-alert-check.module.scss'
import { useState, useEffect } from 'react'

import React from 'react'

export default function SweetAlertCheck() {
  const [iconStatus, setIconStatus] = useState(false)

  function handleAnimation() {
    setIconStatus(true)
  }

  useEffect(() => {
    handleAnimation()
  }, [])

  return (
    <>
      <div className={styles['success-checkmark']}>
        <div
          className={
            iconStatus
              ? `${styles['check-icon']} ${styles['show']}`
              : `${styles['check-icon']} ${styles['hide']}`
          }
        >
          <span
            className={`${styles['icon-line']} ${styles['line-tip']}`}
          ></span>
          <span
            className={`${styles['icon-line']} ${styles['line-long']}`}
          ></span>
          <div className={styles['icon-circle']}></div>
          <div className={styles['icon-fix']}></div>
        </div>
      </div>
    </>
  )
}
