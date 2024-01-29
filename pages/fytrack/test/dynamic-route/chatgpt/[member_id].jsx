import React from 'react'
import { useRouter } from 'next/router'
import styles from '@/styles/fytrack/fytrack-mainpage.module.css'

export default function MemberPage() {
  // 使用 useRouter 鉤子獲取路由參數
  const router = useRouter()
  const { member_id } = router.query // 從路由查詢中提取 member_id

  // 可以根據 member_id 來決定渲染哪些內容
  // 例如，根據不同的 member_id 從後端獲取不同的數據

  return (
    <div id={styles['container']}>
      {/* 從style物件存取屬性 */}
      <div className={styles['image-container']} id="sport">
        <img src="/fytrack_img/sport-img.jpg" alt="運動圖" />
        <div className={styles['text-overlay']}>
          <span className={styles['main-text']}>運動</span>
          <span className={styles['hover-text']}>用 FreeFyt 記錄重訓數據</span>
        </div>
      </div>
      <div className={styles['image-container']} id={styles['nutrition']}>
        <img src="/fytrack_img/nutrition-img.jpg" alt="營養圖" />
        <div className={styles['text-overlay']}>
          <span className={styles['main-text']}>營養</span>
          <span className={styles['hover-text']}>用 FreeFyt 記錄營養數據</span>
        </div>
      </div>
    </div>
  )
}
