import React from 'react'
import { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router'
import styles from '@/styles/fytrack/fytrack-nutrition.module.css'
import { ImSpoonKnife } from 'react-icons/im'
import { TbTarget } from 'react-icons/tb'
import localNutritionData from '@/data/fytrack_merge.json' // 先引入本地JSON數據，等後端寫好再換成用FETCH的方式來接上
import Link from 'next/link'
import dayjs from 'dayjs'
import ProgressBar from '@ramonak/react-progress-bar'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import AuthContext from '@/context/auth-context'
import { MEMBER_PROFILE, MEMBER_PROFILE_PIC } from '@/configs/index'

// 定義 FytrackNutrition 函數組件，用於展示單一會員的營養資訊。
export default function FytrackNutrition() {
  // 可以⽤ auth 得到會員編號(auth.id)和令牌(auth.token)。
  const { auth } = useContext(AuthContext)
  const [memberProfile, setMemberProfile] = useState({
    member_username: '',
    member_name: '',
    member_nickname: '',
    member_bio: '',
    member_pic: '',
  })

  // 使用 useRouter 鉤子獲取當前路由資訊，包括動態路由參數 member_id
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

  // 定義導航至不同路徑的函數。
  const handleNavigationToEdit = () => {
    router.push(`/fytrack/track-nutrition/edit/${router.query.member_id}`)
  }

  const handleNavigationToNutrition = () => {
    router.push(`/fytrack/track-nutrition/${router.query.member_id}`)
  }

  const handleNavigationToFoodDiary = () => {
    router.push(`/fytrack/track-nutrition/food-diary/${router.query.member_id}`)
  }

  const handleNavigationToFoodData = () => {
    router.push(`/fytrack/track-nutrition/food-data/${router.query.member_id}`)
  }

  const handleNavigationToHistory = () => {
    router.push(
      `/fytrack/track-nutrition/food-diary/history/${router.query.member_id}`
    )
  }

  const handleNavigationToFav = () => {
    router.push(
      `/fytrack/track-nutrition/food-diary/fav/${router.query.member_id}`
    )
  }
  // 使用 useState 鉤子設置會員營養資訊的初始狀態。
  const [memberNutrition, setMemberNutrition] = useState([
    {
      food_calorie: '',
    },
    {
      ntdentry_sid: '',
      member_id: '',
      caloric_target: '',
      fat_target: '',
      protein_target: '',
      carb_target: '',
    },
    {
      food_protein: '',
    },
    {
      food_carb: '',
    },
    {
      food_fat: '',
    },
  ])

  //定義 memberId 和 defaultDate 作為預設值。
  const memberId = 56
  // 創建一個新的 Date 對象，並將其賦值給變量 now。這個對象表示代碼執行時的當前日期和時間。
  const now = new Date()
  // 使用模板字符串來構建一個代表當前日期的字符串，並將其賦值給變量 defaultDate。
  // 獲取當前年份。
  const defaultDate = `${now.getFullYear()}-${
    // 獲取當前月份，如果月份小於 10，則在前面添加一個 0 以保持兩位數的格式。
    // 如果月份大於或等於 10，則直接使用月份。
    // 獲取當前日期中的日。如果日小於 10，則在前面添加一個 0。
    // 如果日大於或等於 10，則直接使用日。
    now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1
  }-${now.getDate() < 10 ? '0' + now.getDate() : now.getDate()}`

  console.log(defaultDate)

  // 從後端取得 fytrack_add 表格資訊的日期部分是透過設定一個名為 selectedDate 的狀態變數來管理的。 這個變數在元件的狀態中被初始化，並在非同步函數 getMemberNutrition 中被使用來從後端取得資料。
  // 使用 useState 設置 selectedDate 的初始值為 'defaultDate'。
  const [selectedDate, setSelectedDate] = useState(defaultDate)

  // 使用 dayjs 格式化 memberNutrition.ntdentry_date_time 為 'YYYY-MM-DD HH:mm' 格式。

  // const formattedDate =
  //   memberNutrition && memberNutrition.length > 1
  //     ? dayjs(memberNutrition[1].ntdentry_date_time).format('YYYY-MM-DD HH:mm')
  //     : '2024-01-26 00:00'

  // console.log(formattedDate)

  // 定義 getMemberNutrition 異步函數，從 API 端點獲取會員營養資訊。
  const getMemberNutrition = async (member_id) => {
    try {
      // 從遠端 API 獲取數據
      const response = await fetch(
        `http://localhost:3002/fytrack/nutrition?selected_date=${selectedDate}&member_id=${member_id}`
      )

      if (response.ok) {
        const data = await response.json()
        console.log('tzu', data)
        // 設定若回來的資料不是陣列，檢查是否為物件（預防沒抓到值）
        if (!Array.isArray(data)) {
          console.error('data is not array!')
          return
        }
        setMemberNutrition(data) // 如果請求成功，使用遠端數據
      } else {
        throw new Error('Data not found') // 如果遠端數據請求失敗，抛出異常
      }
    } catch (error) {
      // 請求失敗時的處理邏輯
      console.error('API fetching error:', error)
      // 回退到本地数据
      const nutritionInfo = localNutritionData.find(
        (entry) => entry.member_id === member_id
      )
      if (nutritionInfo) {
        setMemberNutrition(nutritionInfo) // 設置狀態為本地數據
      } else {
        console.error('Member not found in local data')
      }
    }
  }

  // 使用 useEffect 監聽路由變化，並在變化時執行相應操作。
  useEffect(() => {
    // 從 localNutritionData 中尋找符合條件的會員數據。
    const memberData = localNutritionData.find((v) => {
      // 檢查 memberId 和 v.member_id 是否相同，且 v.ntdentry_date_time 包含 selectedDate。
      return (
        String(memberId) === String(v.member_id) &&
        v.ntdentry_date_time.includes(selectedDate)
      )
    })
    // 如果路由已準備好，則從路由查詢中獲取 member_id。
    if (router.isReady) {
      const { member_id } = router.query
      console.log(member_id)
      // 調用 getMemberNutrition 函數向伺服器獲取會員營養資訊。
      getMemberNutrition(member_id)
    }
  }, [router.isReady, router.query, getMemberNutrition, selectedDate]) // 依賴於 router.isReady 和 router.query 的變化。

  // 如果 memberNutrition 沒有資料，則顯示載入中的提示。
  if (!memberNutrition) {
    return <div>Loading...</div>
  }

  // 觀察render情況
  console.log('render')

  // calculateProgressWidth 計算進度條的寬度。這個函數接受實際攝取量和目標量作為參數，然後返回對應的百分比寬度。此外，還確保了當目標量為零時，進度條的寬度被設置為0%，以避免除以零的錯誤。
  const calculateProgressWidth = (actual, target) => {
    // 如果目標值為 0，則進度條寬度為 0%。
    if (target === 0) {
      return {
        width: '0%',
        actualPercentage: 0,
        isOver: false,
      }
    }

    const percentage = (actual / target) * 100
    const isOver = percentage > 100 // 表示是否超過100%

    // 計算實際百分比，即使超過 100% 也顯示實際值
    return {
      width: `${percentage}%`,
      actualPercentage: percentage,
      isOver,
    }
  }

  // 熱量進度條
  const calorieProgress = calculateProgressWidth(
    memberNutrition[0]?.food_calorie || 0,
    memberNutrition[1]?.caloric_target || 0
  )

  // 熱量進度條的樣式，根據是否超過100%來動態設置
  // const calorieBarStyle = {
  //   width: calorieProgress.width,
  //   backgroundColor: calorieProgress.isOver ? 'orange' : 'deepskyblue',
  // }

  // 脂肪進度條
  const fatProgress = calculateProgressWidth(
    memberNutrition[4]?.food_fat || 0,
    memberNutrition[1]?.fat_target || 0
  )

  // 脂肪進度條的樣式，根據是否超過100%來動態設置
  // const fatBarStyle = {
  //   width: fatProgress.width,
  //   backgroundColor: fatProgress.isOver ? 'orange' : 'deepskyblue',
  // }

  // 蛋白質進度條
  const proteinProgress = calculateProgressWidth(
    memberNutrition[2]?.food_protein || 0,
    memberNutrition[1]?.protein_target || 0
  )

  // 蛋白質進度條的樣式，根據是否超過100%來動態設置
  // const proteinBarStyle = {
  //   width: proteinProgress.width,
  //   backgroundColor: proteinProgress.isOver ? 'orange' : 'deepskyblue',
  // }

  // 碳水化合物進度條
  const carbProgress = calculateProgressWidth(
    memberNutrition[3]?.food_carb || 0,
    memberNutrition[1]?.carb_target || 0
  )

  // 碳水化合物進度條的樣式，根據是否超過100%來動態設置
  // const carbBarStyle = {
  //   width: carbProgress.width,
  //   backgroundColor: carbProgress.isOver ? 'orange' : 'deepskyblue',
  // }

  // Math.max 用于比較兩個或多個數值並返回其中的最大值。0,: 是 Math.max 函數的第一個參數，表示要與另一個數值比較。在這個例子中，它將與計算出的脂肪差值比較，確保结果不會小於 0。
  const remainingFat = Math.max(
    0,
    Number(memberNutrition[1].fat_target) - Number(memberNutrition[4].food_fat)
  )

  const formattedRemainingFat = remainingFat.toFixed(1)

  const remainingProtein = Math.max(
    0,
    Number(memberNutrition[1].protein_target) -
      Number(memberNutrition[2].food_protein)
  )
  const formattedRemainingProtein = remainingProtein.toFixed(1)

  const remainingCarb = Math.max(
    0,
    Number(memberNutrition[1].carb_target) -
      Number(memberNutrition[3].food_carb)
  )
  const formattedRemainingCarb = remainingCarb.toFixed(1)

  // 新增的進度條寬度計算和輸出
  const fatProgressWidth = calculateProgressWidth(
    memberNutrition[4]?.food_fat || 0,
    memberNutrition[1]?.fat_target || 0
  )

  const proteinProgressWidth = calculateProgressWidth(
    memberNutrition[2]?.food_protein || 0,
    memberNutrition[1]?.protein_target || 0
  )

  const carbProgressWidth = calculateProgressWidth(
    memberNutrition[3]?.food_carb || 0,
    memberNutrition[1]?.carb_target || 0
  )

  console.log('Fat Progress Width:', fatProgressWidth)
  console.log('Protein Progress Width:', proteinProgressWidth)
  console.log('Carb Progress Width:', carbProgressWidth)

  // 計算熱量進度百分比
  const caloriePercentage =
    memberNutrition[0] && memberNutrition[1]
      ? (memberNutrition[0].food_calorie / memberNutrition[1].caloric_target) *
        100
      : 0

  // UI 渲染：在各個 UI 部分中使用從 memberNutrition 狀態中獲取的數據。
  return (
    <div className={styles['container']}>
      {/* UI 元件和佈局 */}
      <div className={styles['breadcrumbs']}>首頁 / 健身追蹤 / 營養追蹤</div>
      <div className={styles['tab-buttons']}>
        <Link href={`/fytrack/track-nutrition/${router.query.member_id}`}>
          <button className={styles['tab-button']}>營養追蹤</button>
        </Link>
        <button className={styles['tab-button']}>飲水追蹤</button>
        <button className={styles['tab-button']}>斷食追蹤</button>
      </div>

      <div className={styles['main-content']}>
        <div className={styles['dashboard']}>
          <div className={styles['date-display']}>
            <span>今天日期：{defaultDate}</span>
            <button
              className={styles['settings-button']}
              onClick={handleNavigationToEdit}
            >
              設定
            </button>
          </div>

          <div className={styles['nutrition-container']}>
            <div className={styles['nutrition-info']}>
              {/* 替換原有的 <i> 標籤 */}
              <TbTarget style={{ color: '#536080', fontSize: '30px' }} />
              <div className={styles['target']}>
                <p>目標</p>
                <p>{memberNutrition[1].caloric_target}</p>
                <p>kcal</p>
              </div>
            </div>

            <div className={styles['circular-chart']}>
              {/* 使用 CircularProgressbar 顯示熱量進度 */}
              <div style={{ width: 200, height: 200 }}>
                <CircularProgressbar
                  value={caloriePercentage}
                  styles={{
                    // 調整圓圈粗細
                    // 定義路徑（進度條）的樣式
                    path: {
                      stroke: `#ff804a`, // 進度條顏色
                      strokeWidth: '8', // 圓圈粗細
                      strokeLinecap: 'round', // 圓形進度條末端
                      transition: 'stroke-dashoffset 0.5s ease 0s', // 平滑過渡效果
                    },
                    // 定義路徑的背景（未填充部分）的樣式
                    trail: {
                      stroke: '#d6d6d6', // 路徑背景顏色
                      strokeWidth: '8', // 未填充部分的粗細
                      strokeLinecap: 'round',
                      transform: 'rotate(0.25turn)',
                      transformOrigin: 'center center', // 路徑背景顏色
                    },
                    // 定義文字樣式
                    text: {
                      fill: '#f88',
                      // 文字顏色
                      fontSize: '16px', // 文字大小
                      // text={`${caloriePercentage.toFixed(1)}%`}
                    },
                  }}
                />
              </div>
              {/* 文本內容 */}
              <div className={styles['circular-content']}>
                <p>還可吃</p>
                <p>
                  {memberNutrition[1].caloric_target -
                    memberNutrition[0].food_calorie}
                </p>
                <p>kcal</p>
              </div>
            </div>

            <div className={styles['nutrition-info']}>
              <ImSpoonKnife style={{ color: '#536080', fontSize: '30px' }} />

              <div className={styles['intake']}>
                <p>已攝取</p>
                <p>{memberNutrition[0].food_calorie}</p>
                <p>kcal</p>
              </div>
            </div>
          </div>

          {/* 這段代碼是用於顯示用戶脂肪攝取進度的一部分： */}
          {/* 外層 div，這是一個容器元素，用於包裹所有的營養進度條。 */}
          {/* 進度條樣式應用 */}
          <div className={styles['nutrition-bars']}>
            {/* 脂肪進度條。 */}
            <div className={styles['nutrition-bar']}>
              {/* 段落，顯示文字“脂肪”，指明這個進度條是用來顯示脂肪攝取情況。 */}
              <p className={styles['paragraph']}>脂肪</p>
              {/* 進度條，用於顯示進度的條形容器。 */}
              {/* 在這裡，completed 属性設置為從您的計算函數中獲取的百分比數值（去除了 % 字符）。maxCompleted 設置為 100，表示進度條的最大值是 100%。bgColor 属性則用於設置進度條的背景顏色，根據是否超過 100% 而改變顏色。 */}
              {/* 若要確保 calculateProgressWidth 函數正確傳回了一個包含 width 和 isOver 屬性的物件。這個函數應該在每次需要更新進度條時都被調用，並且返回值應該總是包含 width 屬性。應添加一些條件檢查來確保在嘗試存取 width 屬性之前，fatProgressWidth 物件及其 width 屬性確實已經定義。 */}
              <ProgressBar
                completed={
                  fatProgress && fatProgress.width
                    ? parseInt(fatProgress.width.replace('%', ''))
                    : 0
                }
                maxCompleted={100}
                bgColor={
                  fatProgress && fatProgress.isOver ? '#f44336' : '#008000'
                }
              />

              {/* 剩餘脂肪量的計算，這一行顯示用戶當天還能攝取多少克脂肪，計算方式是目標脂肪攝取量減去已攝取脂肪量。 */}
              <p>還差 {formattedRemainingFat} 克</p>
            </div>
            {/* 蛋白質進度條 */}
            <div className={styles['nutrition-bar']}>
              <p className={styles['paragraph']}>蛋白質</p>
              <ProgressBar
                completed={
                  proteinProgress && proteinProgress.width
                    ? parseInt(proteinProgress.width.replace('%', ''))
                    : 0
                }
                maxCompleted={100}
                bgColor={
                  proteinProgress && proteinProgress.isOver
                    ? '#f44336'
                    : '#2196f3'
                }
              />

              <p>還差 {formattedRemainingProtein} 克</p>
            </div>
            {/* 碳水化合物進度條 */}
            <div className={styles['nutrition-bar']}>
              <p className={styles['paragraph']}>碳水化合物</p>
              <ProgressBar
                completed={
                  carbProgress && carbProgress.width
                    ? parseInt(carbProgress.width.replace('%', ''))
                    : 0
                }
                maxCompleted={100}
                bgColor={
                  carbProgress && carbProgress.isOver ? '#f44336' : '#9c27b0'
                }
              />

              <p>還差 {formattedRemainingCarb} 克</p>
            </div>
          </div>

          <div className={styles['calorie-info']}>
            <div className={styles['calorie-burned']}>
              {/* <img src="/fytrack_img/fire-solid.svg" /> */}
              {/* <span>今日熱量消耗 350 kcal</span> */}
            </div>
          </div>
        </div>

        {/* 右側 */}
        <div className={styles['text-section']}>
          <div className={styles['intro-text']}>
            <span
              style={{ color: 'white' }}
              className={styles['highlight-text']}
            >
              你的{' '}
            </span>
            <br />
            <span
              style={{ color: '#ff804a' }}
              className={styles['highlight-text']}
            >
              營養管理小幫手
            </span>
          </div>

          <p className={styles['description']}>
            無論是減重瘦身、飲食保健，掌握以下五大功能，帶你輕鬆上手 FYTrack
          </p>

          <div className={styles['feature-buttons']}>
            <div className={styles['button-row']}>
              <button
                className={styles['feature-button']}
                onClick={handleNavigationToNutrition}
              >
                營養追蹤
              </button>
              <button
                className={styles['feature-button']}
                onClick={handleNavigationToFoodDiary}
              >
                食物日記
              </button>
            </div>
            <div className={styles['button-row']}>
              <button
                className={`${styles['feature-button']} ${styles['full-width']}`}
                onClick={handleNavigationToFoodData}
              >
                食品資料庫
              </button>
            </div>
            <div className={styles['button-row']}>
              <button
                className={styles['feature-button']}
                onClick={handleNavigationToHistory}
              >
                歷史紀錄
              </button>
              <button
                className={styles['feature-button']}
                onClick={handleNavigationToFav}
              >
                收藏清單
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
