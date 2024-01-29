import React from 'react'
import { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router'
import styles from '@/styles/fytrack/fooddiary-add.module.css'
import { FaRegPlusSquare } from 'react-icons/fa'
import { LuCalendarClock } from 'react-icons/lu'
import { FaNutritionix } from 'react-icons/fa6'
import { FaChartPie } from 'react-icons/fa'
import ReactModal from 'react-modal'
import FoodData from '@/components/fytrack/food-data/FoodData'
import AuthContext from '@/context/auth-context'
import { MEMBER_PROFILE, MEMBER_PROFILE_PIC } from '@/configs/index'
import swal from 'sweetalert'

// 到單一會員的網址(最後使用 id):
// https://my-json-server.typicode.com/eyesofkids/json-fake-data/members/1

/* 
定義 React 組件 FytrackNutrition：
使用 useRouter 鉤子獲取當前的路由。
從路由查詢中解構出 member_id 變量。
建立 FytrackNutrition 函數式組件：這是一個 React 組件，用於顯示單一會員的詳細訊息。 */
export default function NutritionAdd() {
  // 可以⽤ auth 得到會員編號(auth.id)和令牌(auth.token)。
  const { auth } = useContext(AuthContext)

  const [memberProfile, setMemberProfile] = useState({
    member_username: '',
    member_name: '',
    member_nickname: '',
    member_bio: '',
    member_pic: '',
  })

  // 使用 useRouter 鉤子獲取路由參數（由router中獲得動態路由(屬性名稱member_id，即檔案[member_id].js)的值）
  // 執行(呼叫)useRouter，會回傳一個路由器
  const router = useRouter()

  useEffect(() => {
    console.log('Router query:', router.query) // 首先打印整個查詢對象

    // 從路由得到會員編號
    const memberID = +router.query.member_id
    console.log('Extracted member_id:', memberID) // 打印獲取的 member_id

    if (router.query.member_id !== undefined) {
      if (!memberID || memberID !== auth.id) {
        // 如果從路由獲得的會員編號和 auth.id 沒有吻合就跳轉登⼊⾴⾯
        router.push('/member/login')
      } else {
        // 若吻合則⽤令牌獲得個⼈資料
        fetch(`${MEMBER_PROFILE}/${memberID}`, {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + auth.token,
          },
        })
          .then((r) => r.json())
          .then((data) => {
            if (!data.success) {
              router.push('/member/login')
            } else {
              setMemberProfile({ ...data.memberInfo })
            }
          })
          .catch((ex) => console.log(ex))
      }
    }
  }, [router, router.query.member_id, auth.id, auth.token])

  // 從路由查詢中獲取 member_id
  const { member_id } = router.query

  const [nutritionData, setNutritionData] = useState({
    ntdentry_date: '',
    ntdentry_time: '',
    food_name: '',
    serving_size: '',
  })

  // 設置當前的日期和時間
  useEffect(() => {
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, '0') // 月份是從 0 開始的
    const day = String(currentDate.getDate()).padStart(2, '0')
    const formattedDate = `${year}-${month}-${day}` // 格式化日期為 YYYY-MM-DD

    const formattedTime = currentDate
      .toTimeString()
      .split(' ')[0]
      .substring(0, 5) // 格式化時間為 HH:MM

    // 這段代碼是 React 的 useEffect 鉤子中的一部分
    // 這段代碼的作用是在組件首次渲染時，將當前日期和時間設置為表單的初始值。這樣當用戶看到表單時，日期和時間輸入框就已經填充了當前的日期和時間，並且用戶可以修改這些值。
    // 展開運算符 (...)：...nutritionData 使用展開運算符來保留 nutritionData 狀態對象的現有值。這樣可以確保更新狀態時不會丟失已有的數據。
    // 更新特定字段：在這裡，將 ntdentry_date 和 ntdentry_time 字段設置為新的值，即 formattedDate 和 formattedTime。這將覆蓋 nutritionData 中這兩個字段的原始值。

    setNutritionData((currentData) => ({
      ...currentData,
      ntdentry_date: formattedDate,
      ntdentry_time: formattedTime,
    }))
  }, [])

  // handleChange 函數是一個用於處理表單輸入變化的事件處理器，它用於更新 React 組件中的狀態。這個函數的作用是在用戶輸入或更改表單字段時，將新的值保存到組件的狀態中。
  // 使用展開運算符(...)來複製當前的nutritionData狀態對象
  // e.target.name 是觸發事件的表單元素的名稱（例如 'ntdentry_date', 'ntdentry_time', 等）
  // e.target.value 是觸發事件的表單元素的當前值
  // [e.target.name]: e.target.value 是使用計算屬性名來更新對應的狀態
  const handleChange = (e) => {
    console.log(e.target.name, e.target.value, e.target.type)
    setNutritionData({ ...nutritionData, [e.target.name]: e.target.value })
  }

  // 處理表單提交
  // 整個 handleSubmit 函數的目的是處理表單的提交事件，並通過異步請求（使用 fetch API）將表單數據發送到後端服務器。它首先防止了表單的預設提交行為，然後發送一個 POST 請求到指定的 API 端點。該函數還處理回應，判斷是否成功提交，並根據回應結果向用戶顯示相應的提示訊息。如果在請求過程中發生錯誤，例如網絡問題或服務器錯誤，它會捕獲這些異常並向用戶顯示一個錯誤提示。
  // 阻止表單預設提交行為：e.preventDefault() 阻止了表單的預設提交行為，這是為了使用自定義的提交邏輯（通過 JavaScript）而不是標準的瀏覽器提交行為。
  // 發送異步請求：fetch('/api/nutrition/add', {...}) 向服務器發送一個異步請求。'/api/nutrition/add' 是處理這個請求的服務器端 API 的路徑。
  // 設置請求方法為 POST：method: 'POST' 指定了 HTTP 請求的方法為 POST，用於向服務器發送數據。
  // 設置請求頭部：headers: { 'Content-Type': 'application/json' } 設置了 HTTP 請求的頭部，表明發送的數據格式是 JSON。
  // 發送請求主體：body: JSON.stringify(nutritionData) 發送的數據是 nutritionData 對象轉換成的 JSON 字符串。
  const handleSubmit = async (e) => {
    e.preventDefault()
    const submitData = {
      ...nutritionData,
      member_id: member_id, // 確保這裡的 member_id 不是 undefined
      ntdentry_time: nutritionData.ntdentry_time + ':00', // 添加秒，成為 HH:MM:SS
    }
    // 打印提交數據
    console.log('Submit Data:', submitData)

    try {
      const response = await fetch(
        `http://localhost:3002/fytrack/nutrition/add`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitData),
        }
      )
      /* 
      檢查回應狀態：if (response.ok) 檢查 HTTP 回應的狀態。如果請求成功（狀態碼在 200-299 之間），response.ok 將為 true。
      捕獲異常：catch (error) 用於捕獲在請求過程中發生的任何異常（例如網絡問題，服務器錯誤等）。
       */
      if (response.ok) {
        swal('成功', '食物日記新增成功', 'success').then(() => {
          router.back() // 返回到之前的頁面
        })
      } else {
        const errorData = await response.json()
        swal('失敗', errorData.message || '提交失敗', 'error')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      swal('錯誤', '提交失敗', 'error')
    }
  }

  const [isModalOpen, setIsModalOpen] = useState(false) // 控制模態開關的狀態

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  // 定義一個函數來處理從 FoodData 組件接收到的食物名稱
  const handleFoodSelect = (selectedFoodName) => {
    setNutritionData({ ...nutritionData, food_name: selectedFoodName })
    closeModal() // 關閉模態框
  }

  return (
    <div className={styles['container']}>
      {/* 麵包屑導航 */}
      <div className={styles['breadcrumbs']}>
        首頁 / 健身追蹤 / 營養追蹤 / 食物日記 / 新增
      </div>
      {/* 主要內容區 */}
      <div className={styles['image-container']}>
        <img src="/fytrack_img/add-img.jpg" alt="新增營養數據頁面圖" />
        <FaRegPlusSquare
          // className={styles.iconPlus}
          style={{
            position: 'absolute',
            left: '10px',
            bottom: '10px',
            color: '#536080',
            fontSize: '24px',
          }}
        />
      </div>
      <form className={styles['nutrition-form']} onSubmit={handleSubmit}>
        {/* 表單元素 */}
        <div className={styles['form-title']}>新增食物日記</div>
        {/* 日期表單項目 */}
        <div className={styles['form-item']}>
          <div className={styles['input-group']}>
            <LuCalendarClock className={styles.icon} />

            <label htmlFor="date" className={styles['label']}>
              日期
            </label>
          </div>
          <input
            type="date"
            name="ntdentry_date"
            id="date"
            className={styles.input}
            placeholder="請輸入日期"
            value={nutritionData.ntdentry_date}
            onChange={handleChange}
          />
        </div>
        {/* 時間表單項目 */}
        <div className={styles['form-item']}>
          <div className={styles['input-group']}>
            <LuCalendarClock className={styles.icon} />

            <label htmlFor="time" className={styles['label']}>
              時間
            </label>
          </div>
          <input
            type="time"
            name="ntdentry_time"
            id="time"
            className={styles.input}
            placeholder="請輸入時間"
            value={nutritionData.ntdentry_time}
            onChange={handleChange}
          />
        </div>
        {/* 食物名稱表單項目 */}
        <div className={styles['form-item']}>
          <div className={styles['input-group']}>
            <FaNutritionix className={styles.icon} />
            <label htmlFor="food-name" className={styles['label']}>
              食物名稱
            </label>
          </div>
          <input
            type="text"
            name="food_name"
            id="food-name"
            className={styles.input}
            placeholder="請輸入食物名稱"
            value={nutritionData.food_name}
            onChange={handleChange}
          />
          <button
            type="button"
            className={styles['link-button']}
            onClick={openModal}
          >
            查詢食品資料庫
          </button>

          {/* Modal彈窗 */}
          <ReactModal
            appElement={
              typeof window !== 'undefined'
                ? document.getElementById('root')
                : undefined
            }
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            style={{
              overlay: {
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
              },
              content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)',
                width: '90vw', // 調整寬度為視窗的90%
                height: '80vh', // 調整高度為視窗的80%
                overflow: 'auto', // 允許內部滾動
                padding: '20px',
                borderRadius: '10px',
              },
            }}
          >
            <FoodData onFoodSelect={handleFoodSelect} />
          </ReactModal>
        </div>
        {/* 份量表單項目 */}
        <div className={styles['form-item']}>
          <div className={styles['input-group']}>
            <FaChartPie
              className={styles.icon}
              style={{
                marginRight: '10px',
              }}
            />
            <label htmlFor="portion" className={styles['label']}>
              份量
            </label>
          </div>
          <input
            type="text"
            name="serving_size"
            id="portion"
            className={styles.input}
            placeholder="請輸入份量"
            value={nutritionData.serving_size}
            onChange={handleChange}
          />
        </div>
        {/* 份量單位表單項目
        <div className={styles['form-item']}>
          <div className={styles['input-group']}>
            <FaChartPie
              style={{
                marginRight: '10px',
              }}
            />
            <label htmlFor="portion-unit" className={styles['label']}>
              份量單位
            </label>
          </div>
          <input
            type="text"
            name="serving_size_unit"
            id="portion-unit"
            placeholder="請輸入份量單位"
            value={nutritionData.serving_size_unit}
            onChange={handleChange}
          />
        </div> */}
        <button type="submit" className={styles['button']}>
          送出
        </button>
      </form>
    </div>
  )
}
