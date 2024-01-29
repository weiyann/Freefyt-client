import React from 'react'
import styles from '@/styles/store/modal/modal-base.module.css'

export default function ModalBase({ setOpenModal }) {
  return (
    <div className={styles['modalBackground']}>
      <div className={styles['modalContainer']}>
        <div className={styles['title']}>
          <h1>Are You Sure You Want to Continue?</h1>
        </div>
        <div className={styles['modal-body']}>
          <p>The next page looks amazing. Hope you want to go there!</p>
        </div>
        <div className={styles['footer']}>
          <button
            onClick={() => {
              setOpenModal(false)
            }}
            className={styles['btn-cancel']}
          >
            Cancel
          </button>
          <button className={styles['btn-continue']}>Continue</button>
        </div>
      </div>
    </div>
  )
}
