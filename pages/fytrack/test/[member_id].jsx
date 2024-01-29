import React from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from '@/styles/fytrack/fytrack-nutrition.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUtensils } from '@fortawesome/free-solid-svg-icons'
import { TbTarget } from 'react-icons/tb'

/* 
定義 React 組件 FytrackNutrition：
使用 useRouter 鉤子獲取當前的路由。
從路由查詢中解構出 member_id 變量。
建立 FytrackNutrition 函數式組件：這是一個 React 組件，用於顯示單一會員的詳細信息。 */
export default function FytrackNutrition() {
  // 第1步. 由router中獲得動態路由(屬性名稱member_id，即檔案[member_id].js)的值
  // 執行(呼叫)useRouter，會回傳一個路由器
  // router.query中會包含member_id屬性
  // router.isReady(布林值)，true代表本元件已完成水合作用(hydration)，可以取得router.query的值

  // 通過 useRouter 鉤子獲取當前路由的資訊，包括動態路由參數 member_id
  const router = useRouter()
  // 設置會員營養資訊的狀態：使用 useState 創建一個狀態 memberNutrition，用於存儲商品的詳細信息。
  const [memberNutrition, setMemberNutrition] = useState({
    caloric_target: '---',
    protein_target: '---',
    carb_target: '---',
    fat_target: '---',
  })

  /* 
  定義獲取會員營養資訊的異步函數 getMemberNutrition：
  使用 fetch 方法從指定的 API 端點獲取數據。
  將回應解析為 JSON 格式。
  接著，使用 console.log 打印獲取的數據（主要用於調試）。
  更新 memberNutrition 狀態。 
  https://my-json-server.typicode.com/eyesofkids/json-fake-data/products/
  這段網址要換成後端的網址Node(express )回應的那個網址先用引入(import) 在前端作範例 之後再接上*/

  const getMemberNutrition = async (member_id) => {
    const response = await fetch(
      'https://my-json-server.typicode.com/eyesofkids/json-fake-data/products/' +
        member_id
    )

    // data會是物件值
    const data = await response.json()

    console.log(data)
    // 設定到state中，觸發重新渲染(re-render)
    setMemberNutrition(data)
  }

  //console.log(router.query, ' isReady=', router.isReady)

  /* 
  使用 useEffect 鉤子監聽路由變化：
  當路由準備好後（router.isReady 為 true），從路由查詢中獲取 member_id，並調用 getMemberNutrition 函數獲取會員營養資訊。
  在組件加載和 member_id 變化時調用 getMemberNutrition 函數獲取會員營養資訊。 */
  useEffect(() => {
    // 如果isReady是true，確保能得到query的值
    if (router.isReady) {
      const { member_id } = router.query
      console.log(member_id)
      // 向伺服器要單一會員的資料
      getMemberNutrition(member_id)
    }
  }, [router.isReady])

  // 觀察render情況
  console.log('render')

  /* 
  UI 渲染：
  使用 JSX 返回 HTML 結構，包括面包屑導航、標籤按鈕、主要內容區等。
  在各個 UI 部分中使用從 memberNutrition 狀態中獲取的數據。*/
  return (
    <div className={styles['container']}>
      {/* UI 元件和佈局 */}
      <div className={styles['breadcrumbs']}>首頁 / 健身追蹤 / 營養追蹤</div>
      <div className={styles['tab-buttons']}>
        <button className={styles['tab-button']}>營養追蹤</button>
        <button className={styles['tab-button']}>飲水追蹤</button>
        <button className={styles['tab-button']}>斷食追蹤</button>
      </div>

      <div className={styles['main-content']}>
        <div className={styles['dashboard']}>
          <div className={styles['date-display']}>
            <span>今天日期：2023-12-31 星期日</span>
            <button className={styles['settings-button']}>設定</button>
          </div>

          <div className={styles['nutrition-container']}>
            <div className={styles['nutrition-info']}>
              {/* 替換原有的 <i> 標籤 */}
              <TbTarget style={{ color: '#536080', fontSize: '30px' }} />
              <div className={styles['target']}>
                <p>目標</p>
                <p>{memberNutrition.caloric_target} kcal</p>
              </div>
            </div>

            <div className={styles['circular-chart']}>
              <div className={styles['remainder']}>
                <p>還可以吃</p>
                <p>{memberNutrition.intake} kcal</p>
              </div>
            </div>

            <div className={styles['nutrition-info']}>
              <FontAwesomeIcon
                icon={faUtensils}
                style={{ color: '#536080', fontSize: '24px' }}
              />
              <div className={styles['intake']}>
                <p>已攝取</p>
                <p>{memberNutrition.intake} kcal</p>
              </div>
            </div>
          </div>

          <div className={styles['nutrition-bars']}>
            {/* 營養進度條 */}
            <div className={styles['nutrition-bar']}>
              <p>脂肪</p>
              <div className={styles['progress-bar']}>
                <div
                  className={styles['progress']}
                  style={{
                    width: `${memberNutrition.fats}%`,
                    backgroundColor: 'deepskyblue',
                  }}
                />
              </div>
              <p>還差 {memberNutrition.fats} 克</p>
            </div>
            <div className={styles['nutrition-bar']}>
              <p>蛋白質</p>
              <div className={styles['progress-bar']}>
                <div
                  className={styles['progress']}
                  style={{
                    width: `${memberNutrition.proteins}%`,
                    backgroundColor: 'deepskyblue',
                  }}
                />
              </div>
              <p>還差 {memberNutrition.proteins} 克</p>
            </div>
            <div className={styles['nutrition-bar']}>
              <p>碳水化合物</p>
              <div className={styles['progress-bar']}>
                <div
                  className={styles['progress']}
                  style={{
                    width: `${memberNutrition.carbs}%`,
                    backgroundColor: 'deepskyblue',
                  }}
                />
              </div>
              <p>還差 {memberNutrition.carbs} 克</p>
            </div>
          </div>

          <div className={styles['calorie-info']}>
            <div className={styles['calorie-burned']}>
              <img src="/fytrack_img/fire-solid.svg" />
              <span>今日熱量消耗 {memberNutrition.caloriesBurned} kcal</span>
            </div>
          </div>
        </div>

        <div className={styles['text-section']}>
          <div className={styles['intro-text']}>
            <span style={{ color: 'white' }}>你的 </span>
            <span style={{ color: '#ff804a' }}>營養管理小幫手</span>
          </div>

          <p className={styles['description']}>
            無論是減重瘦身、飲食保健，掌握以下五大功能，帶你輕鬆上手 FYTrack
          </p>

          <div className={styles['feature-buttons']}>
            <div className={styles['button-row']}>
              <button className={styles['feature-button']}>營養追蹤</button>
              <button className={styles['feature-button']}>食物日記</button>
            </div>
            <div className={styles['button-row']}>
              <button
                className={`${styles['feature-button']} ${styles['full-width']}`}
              >
                食品資料庫
              </button>
            </div>
            <div className={styles['button-row']}>
              <button className={styles['feature-button']}>歷史紀錄</button>
              <button className={styles['feature-button']}>收藏清單</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
