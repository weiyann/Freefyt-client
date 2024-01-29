import React from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from '@/styles/fytrack/nutrition-add.module.css'

// 到單一會員的網址(最後使用 id):
// https://my-json-server.typicode.com/eyesofkids/json-fake-data/members/1

/* 
定義 React 組件 FytrackNutrition：
使用 useRouter 鉤子獲取當前的路由。
從路由查詢中解構出 member_id 變量。
建立 FytrackNutrition 函數式組件：這是一個 React 組件，用於顯示單一會員的詳細訊息。 */
export default function Detail() {
  // 使用 useRouter 鉤子獲取路由參數（由router中獲得動態路由(屬性名稱member_id，即檔案[member_id].js)的值）
  // 執行(呼叫)useRouter，會回傳一個路由器
  const router = useRouter()
  
  // 從路由查詢中提取 member_id
  // 可以根據 member_id 來決定渲染哪些內容
  // 例如，根據不同的 member_id 從後端獲取不同的數據
  // router.query中會包含pid屬性
  // router.isReady(布林值)，true代表本元件已完成水合作用(hydration)，可以取得router.query的值

  // 設置會員營養資訊的狀態：使用 useState 創建一個狀態 memberNutrition，用於會員營養詳細資訊。
  const [memberNutrition, setMemberNutrition] = useState({
    ntdentry_sid: '',
    member_id: '',
    ntdentry_date_time: '',
    caloric_target: '',
    food_calorie: '',
    food_unit: '',
    food_protein: '',
    food_carb: '',
    food_fat: '',
    remainder: '',
  })

  // 向伺服器要求資料
  const getMemberNutrition = async (member_id) => {
    const res = await fetch(
      'https://my-json-server.typicode.com/eyesofkids/json-fake-data/members/' +
        member_id
    )

    // data會是物件值
    const data = await res.json()

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

  return <></>
}
