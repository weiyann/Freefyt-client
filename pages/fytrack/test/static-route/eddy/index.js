import React from 'react'
import styles from '@/styles/fytrack/fytrack-mainpage.module.css'

export default function Index() {
  return (
    <div id={styles['container']}>
      {/* 從style物件存取屬性 */}
      <div className={styles['image-container']} id="sport">
        <img src="/fytrack_img/sport-img.jpg" alt="運動圖" />
        <div className={styles['text-overlay']}>
          <span className="main-text">運動</span>
          <span className="hover-text">用 FreeFyt 記錄重訓數據</span>
        </div>
      </div>
      <div className={styles['image-container']} id="nutrition">
        <img src="/fytrack_img/nutrition-img.jpg" alt="營養圖" />
        <div className={styles['text-overlay']}>
          <span className="main-text">營養</span>
          <span className="hover-text">用 FreeFyt 記錄營養數據</span>
        </div>
      </div>
    </div>
  )
}
