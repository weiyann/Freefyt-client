import React from 'react'
import { useEffect, useState, useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import AuthContext from '@/context/auth-context'
import { MEMBER_PROFILE, MEMBER_PROFILE_PIC } from '@/configs/index'
import styles from '@/styles/fytrack/fooddiary-fav.module.css'
import { IoMdTime } from 'react-icons/io'
import { GoHeart } from 'react-icons/go'
import { GoHeartFill } from 'react-icons/go'
import { BsFillPlusCircleFill } from 'react-icons/bs'
import localNutritionData from '@/data/fytrack_nutrition.json' // 先引入本地JSON數據，等後端寫好再換成用FETCH的方式來接上
import Link from 'next/link'
import dayjs from 'dayjs'
import ProgressBar from '@ramonak/react-progress-bar'
import { BiSolidLeftArrow } from 'react-icons/bi'
import { BiSolidRightArrow } from 'react-icons/bi'
import Select from 'react-select'

export default function FoodDiaryFav() {
  // 可以⽤ auth 得到會員編號(auth.id)和令牌(auth.token)。
  const { auth } = useContext(AuthContext)

  const [memberProfile, setMemberProfile] = useState({
    member_username: '',
    member_name: '',
    member_nickname: '',
    member_bio: '',
    member_pic: '',
  })

  // 通過 useRouter 鉤子獲取當前路由的資訊，包括動態路由參數 member_id
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

  //定義 memberId 和 defaultDate 作為預設值。
  // const memberId = 56
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
  // 使用 useState 設置 selectedDate 的初始值為 '當下日期'。
  const [selectedDate, setSelectedDate] = useState(defaultDate)

  // 使用 dayjs 格式化 memberNutrition.ntdentry_date_time 為 'YYYY-MM-DD HH:mm' 格式。
  // const formattedDate = dayjs(memberNutrition[1].ntdentry_date_time).format(
  //   'YYYY-MM-DD HH:mm'
  // )

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

  // 從後端獲取的食品數據
  const [foods, setFoods] = useState([
    {
      ntdentry_date: '',
      ntdentry_time: '',
      intake_timing_id: '',
    },
    {
      food_name: '',
      serving_size: '',
      food_calorie: '',
      food_carb: '',
      food_protein: '',
      food_fat: '',
    },
  ])

  // 添加一個新的狀態來跟踪選擇的餐點類型(早餐、午餐、晚餐、點心)
  const [selectedMealType, setSelectedMealType] = useState('all')
  // 增加一個狀態來追蹤是否只顯示收藏的卡片
  const [showFavorites, setShowFavorites] = useState(false)
  // 添加排序狀態，預設為 'newToOld'
  const [sortOrder, setSortOrder] = useState('newToOld')

  // 定義 getMemberNutrition 異步函數，從 API 端點獲取會員營養資訊。
  /*
  您的問題涉及到函數參數和函數作用域的概念。
  在原始代碼中，getMemberNutrition 函數使用了外部作用域中的 selectedDate 變量。這意味著該函數直接依賴於其外部作用域的狀態，這在某些情況下可能導致預期外的行為或使代碼難以理解和維護。
  調整為 const getMemberNutrition = async (member_id, date = selectedDate) 的形式後，我們將 date 作為一個可選參數傳遞給函數。這樣做的好處是：
  增強函數的靈活性和可重用性：函數現在可以用於不同的日期，而不僅僅是當前選定的日期。這在未來的擴展或重用中非常有用。
  減少對外部狀態的依賴：通過將 date 作為參數傳遞，函數現在更加獨立，不那麼依賴外部的狀態（即 selectedDate 變量）。這使得函數的行為更加明確，測試和維護也更加容易。
  預設參數提供方便的默認行為：通過設置 date = selectedDate，我們為 date 參數提供了一個預設值，這意味著如果調用時沒有指定 date，它將自動使用 selectedDate 的值。這提供了方便的默認行為，同時仍然保留了覆蓋這個默認值的能力。
  總的來說，這種調整使函數更加靈活、獨立和可測試，同時也保留了與現有代碼的兼容性。
  */
  const getMemberNutrition = useCallback(async () => {
    try {
      // 從遠端 API 獲取數據
      const response = await fetch(
        `http://localhost:3002/fytrack/nutrition?selected_date=${selectedDate}&member_id=${router.query.member_id}`
      )

      if (response.ok) {
        const data = await response.json()
        setMemberNutrition(data)
      } else {
        console.error('Data not found')
      }
    } catch (error) {
      console.error('API fetching error:', error)
    }
  }, [selectedDate, router.query.member_id])

  // 從後端抓取會員新增食物的資料表數據
  const fetchFoods = useCallback(async () => {
    try {
      // 構建帶有查詢參數的 URL
      // const queryParam = `?member_id=${router.query.member_id}&selected_date=${selectedDate}`
      const url = `http://localhost:3002/fytrack/nutrition/add?selected_date=${selectedDate}&member_id=${router.query.member_id}`
      // fetch 函式來向指定的 URL 發送 GET 請求，並等待伺服器回應
      const response = await fetch(url)
      // 處理響應
      if (response.ok) {
        let data = await response.json()

        // 根據 sortOrder 對同一天的數據進行排序
        if (sortOrder === 'newToOld') {
          data.sort(
            (a, b) =>
              new Date('1970/01/01 ' + b.ntdentry_time) -
              new Date('1970/01/01 ' + a.ntdentry_time)
          )
        } else if (sortOrder === 'oldToNew') {
          data.sort(
            (a, b) =>
              new Date('1970/01/01 ' + a.ntdentry_time) -
              new Date('1970/01/01 ' + b.ntdentry_time)
          )
        }

        // 從 localStorage 獲取收藏列表
        const favFoods = JSON.parse(localStorage.getItem('favFoods')) || []

        // 根據 selectedMealType 過濾食物數據
        const filteredData = data.filter((food) => {
          if (selectedMealType === 'all') return true
          return food.intake_timing_id.toString() === selectedMealType
        })

        // 更新 fav 屬性以匹配 localStorage 的收藏狀態
        const foodsWithFav = filteredData.map((food) => ({
          ...food,
          fav: favFoods.includes(food.food_name),
        }))

        setFoods(foodsWithFav)
      } else {
        throw new Error('Unable to fetch data')
      }
    } catch (error) {
      console.error('Error fetching foods:', error)
    }
  }, [selectedDate, router.query.member_id, selectedMealType, sortOrder])

  // 新增 filteredFoods 狀態
  const [filteredFoods, setFilteredFoods] = useState([])

  // 處理餐點類型選擇的函數
  const handleMealTypeSelection = async (mealTypeId) => {
    const mealType = mealTypeId.toString()
    setSelectedMealType(mealType)
    await fetchFoods() // 立即根據新的時段類型更新食物列表
  }

  // 根據選擇的餐點類型過濾卡片
  useEffect(() => {
    console.log('Selected meal type (inside useEffect):', selectedMealType)
    const filteredFoods = foods.filter((food) => {
      // 如果沒有選擇特定的餐點類型（全時段），則顯示所有食物
      if (selectedMealType === 'all') {
        return true
      }
      // 根據 intake_timing_id 過濾
      // 確保 food.intake_timing_id 也是字符串類型
      console.log('food.intake_timing_id:', food.intake_timing_id)
      return food.intake_timing_id.toString() === selectedMealType
    })

    // 假設你有一個狀態來保存過濾後的食品列表
    setFilteredFoods(filteredFoods)
  }, [selectedMealType, foods])

  // 合併過濾條件篩選和渲染食品卡片
  const renderedFoods = filteredFoods.filter((food) => {
    if (showFavorites && !food.fav) {
      return false
    }
    return true
  })

  // 處理點擊愛心按鈕的事件
  const handleToggleShowFavorites = () => {
    setShowFavorites(!showFavorites)
  }

  // 處理排序方式更改
  const handleSortChange = (selectedOption) => {
    setSortOrder(selectedOption.value)
    fetchFoods()
  }

  const handleDateChange = (change) => {
    setSelectedDate(dayjs(selectedDate).add(change, 'day').format('YYYY-MM-DD'))
  }

  // 導航
  // 點擊icon跳轉頁面
  const handleNavigationToHistory = () => {
    setShowFavorites(false)
  }

  // const handleNavigationToFav = () => {
  //   router.push(
  //     `/fytrack/track-nutrition/food-diary/fav/${router.query.member_id}`
  //   )
  // }

  // 切換收藏狀態的函數
  const toggleFav = (foodName) => {
    const updatedFoods = foods.map((food) => {
      if (food.food_name === foodName) return { ...food, fav: !food.fav }
      else return food
    })

    setFoods(updatedFoods)

    // 更新 localStorage 中的收藏列表，將收藏的食物保存到 localStorage
    const favFoods = updatedFoods
      .filter((food) => food.fav)
      .map((food) => food.food_name)
    localStorage.setItem('favFoods', JSON.stringify(favFoods))
  }

  // 卡片渲染部分
  // const renderedFoods = showFavorites ? foods.filter((food) => food.fav) : foods

  // 使用 useEffect 監聽路由變化，並在變化時執行相應操作。
  useEffect(() => {
    if (router.isReady) {
      getMemberNutrition(router.query.member_id)
      fetchFoods()
    }
  }, [
    router.isReady,
    router.query.member_id,
    selectedDate,
    getMemberNutrition,
    fetchFoods,
  ])
  // 打印foods狀態變量的當前值
  console.log('Current foods state:', foods)
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

    // 使用 Math.round 方法將百分比四捨五入到最接近的整數
    const percentage = Math.round((actual / target) * 100)
    const isOver = percentage > 100

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

  // const formattedRemainingFat = remainingFat.toFixed(1)

  const remainingProtein = Math.max(
    0,
    Number(memberNutrition[1].protein_target) -
      Number(memberNutrition[2].food_protein)
  )
  // const formattedRemainingProtein = remainingProtein.toFixed(1)

  const remainingCarb = Math.max(
    0,
    Number(memberNutrition[1].carb_target) -
      Number(memberNutrition[3].food_carb)
  )
  // const formattedRemainingCarb = remainingCarb.toFixed(1)

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

  // 調整營養數據維持小數後一位
  const formatNumber = (number) => {
    // 如果是整數，直接返回
    if (Number.isInteger(number)) {
      return number
    }
    // 如果是浮點數，保留一位小数
    return Number(number).toFixed(1)
  }

  // 使用react select定義下拉選單
  const recordsPerPageOptions = [
    { value: 24, label: '每頁顯示 24 個' },
    { value: 48, label: '每頁顯示 48 個' },
    { value: 72, label: '每頁顯示 72 個' },
  ]

  const sortOrderOptions = [
    { value: 'oldToNew', label: '新增時間：由舊到新' },
    { value: 'newToOld', label: '新增時間：由新到舊' },
  ]

  // 設置狀態
  const [selectedRecordsPerPage, setSelectedRecordsPerPage] = useState(
    recordsPerPageOptions[0]
  )
  const [selectedSortOrder, setSelectedSortOrder] = useState(
    sortOrderOptions[0]
  )

  // 處理器
  const handleRecordsPerPageChange = (selectedOption) => {
    setSelectedRecordsPerPage(selectedOption)
  }

  const handleSortOrderChange = (selectedOption) => {
    setSelectedSortOrder(selectedOption)
  }

  const selectStyles = {
    container: (provided) => ({
      ...provided,
      width: '100%',
    }),
    control: (provided) => ({
      ...provided,
    }),
    option: (provided) => ({
      ...provided,
      whiteSpace: 'nowrap',
      overflow: 'visible',
      // textOverflow: 'ellipsis',
      maxWidth: '100%',
      padding: 10,
    }),
  }

  /* 
  UI 渲染：
  使用 JSX 返回 HTML 結構，在各個 UI 部分中使用狀態獲取的數據。
  */
  return (
    <div className={styles['container']}>
      {/* 麵包屑導航 */}
      <div className={styles['breadcrumbs']}>
        首頁 / 健身追蹤 / 營養追蹤 / 食物日記 / 收藏清單
      </div>
      {/* 分頁切換餐點類型按鈕 */}
      <div className={styles['tab-buttons']}>
        <button
          className={styles['tab-button-allTime']}
          onClick={() => handleMealTypeSelection('all')}
        >
          全時段
        </button>
        <button
          className={styles['tab-button-breakfast']}
          onClick={() => handleMealTypeSelection(1)}
        >
          早餐
        </button>
        <button
          className={styles['tab-button-lunch']}
          onClick={() => handleMealTypeSelection(2)}
        >
          午餐
        </button>
        <button
          className={styles['tab-button-dinner']}
          onClick={() => handleMealTypeSelection(3)}
        >
          晚餐
        </button>
        <button
          className={styles['tab-button-dessert']}
          onClick={() => handleMealTypeSelection(4)}
        >
          點心
        </button>
      </div>
      {/* 主要內容區 */}
      <div className={styles['main-content']}>
        {/* 上面區塊 */}
        <div className={styles['content-upper']}>
          <div className={styles['title']}>收藏清單</div>
        </div>
        {/* 下面區塊 */}
        <div className={styles['content-lower']}>
          {/* 日期顯示和切換 */}
          <div className={styles['date-switcher']}>
            <BiSolidLeftArrow
              className={styles['date-btn']}
              onClick={() => handleDateChange(-1)}
            />

            <span className="date-display">{selectedDate}</span>
            <BiSolidRightArrow
              className={styles['date-btn']}
              onClick={() => handleDateChange(1)}
            />
          </div>
          <div className={styles['dashboard']}>
            {/* 營養進度條區塊 */}
            <div className={styles['calorie-bar']}>
              <div className={styles['intake-title']}>
                <p>每日攝取</p>
                {/* 使用占位符，在 JavaScript 中使用這些類別來動態更新數據 */}
                <p>
                  <span className="current-intake-calorie">
                    {formatNumber(memberNutrition[0].food_calorie)}
                  </span>{' '}
                  /
                  <span className="total-intake-calorie">
                    {' '}
                    {formatNumber(memberNutrition[1].caloric_target)}
                  </span>{' '}
                  克
                </p>
              </div>
              {/* <div className={styles['progress-bar']}>
                <div className={styles['progress']} style={calorieBarStyle} />
              </div> */}
              <ProgressBar
                completed={calorieProgress.actualPercentage}
                maxCompleted={100}
                bgColor={calorieProgress.isOver ? '#f44336' : '#ff804a'}
              />
            </div>
            <div className={styles['nutrition-bars']}>
              {/* 脂肪進度條 */}
              <div className={styles['nutrition-bar']}>
                <p className={styles['paragraph']}>脂肪</p>
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
                {/* <div className={styles['progress-bar']}>
                  <div className={styles['progress']} style={fatBarStyle} />
                </div> */}
                {/* 使用占位符，在 JavaScript 中使用這些類別來動態更新數據 */}
                {/* 目前攝取/目標脂肪 */}
                <p>
                  <span className="current-intake-fat">
                    {formatNumber(memberNutrition[4].food_fat)}
                  </span>{' '}
                  /
                  <span className="total-intake-fat">
                    {' '}
                    {formatNumber(memberNutrition[1].fat_target)}
                  </span>{' '}
                  克
                </p>
              </div>
              {/* 蛋白質 */}
              <div className={styles['nutrition-bar']}>
                <p className={styles['paragraph']}>蛋白質</p>
                {/* <div className={styles['progress-bar']}>
                  <div className={styles['progress']} style={proteinBarStyle} />
                </div> */}
                {/* 使用占位符，在 JavaScript 中使用這些類別來動態更新數據 */}
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
                {/* 目前攝取/目標蛋白質 */}
                <p>
                  <span className="current-intake-protein">
                    {formatNumber(memberNutrition[2].food_protein)}
                  </span>{' '}
                  /
                  <span className="total-intake-protein">
                    {' '}
                    {formatNumber(memberNutrition[1].protein_target)}
                  </span>{' '}
                  克
                </p>
              </div>
              {/* 碳水化合物 */}
              <div className={styles['nutrition-bar']}>
                <p className={styles['paragraph']}>碳水化合物</p>
                {/* <div className={styles['progress-bar']}>
                  <div className={styles['progress']} style={carbBarStyle} />
                </div> */}
                {/* 使用占位符，在 JavaScript 中使用這些類別來動態更新數據 */}
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
                {/* 目前攝取/目標碳水化合物 */}
                <p>
                  <span className="current-intake-carbs">
                    {formatNumber(memberNutrition[3].food_carb)}
                  </span>{' '}
                  /
                  <span className="total-intake-carbs">
                    {' '}
                    {formatNumber(memberNutrition[1].carb_target)}
                  </span>{' '}
                  克
                </p>
              </div>
            </div>
          </div>
          {/* icon按鈕切換歷史紀錄、收藏清單區塊 */}
          <div className={styles['button-block']}>
            {/* 兩顆相連的按鈕 */}
            <button className={styles['icon-button']}>
              <IoMdTime
                onClick={handleNavigationToHistory}
                style={{
                  color: 'white',
                  verticalAlign: 'middle',
                  fontSize: '27px',
                }}
              />
            </button>
            <button className={styles['icon-button']}>
              <GoHeart
                onClick={handleToggleShowFavorites}
                style={{
                  color: 'white',
                  verticalAlign: 'middle',
                  fontSize: '24px',
                }}
              />
            </button>
            <div className={styles['underline']} />
          </div>
          {/* ALL RECENTS 區塊 */}
          <div className={styles['all-recents-and-controls']}>
            <div className={styles['all-recents']}>ALL RECENTS</div>
            <div className={styles['fav-controls']}>
              <div className={styles['dropdowns']}>
                <div className={`dropdownStyle ${styles.yourExistingClass}`}>
                  <Select
                    value={selectedRecordsPerPage}
                    onChange={handleRecordsPerPageChange}
                    options={recordsPerPageOptions}
                    // styles={selectStyles}
                    style={{
                      width: '100%',
                      overflow: 'visible',
                      margin: '0 10px 0 0',
                    }}
                  />
                </div>

                <Select
                  value={sortOrderOptions.find(
                    (option) => option.value === sortOrder
                  )}
                  onChange={handleSortChange}
                  options={sortOrderOptions}
                  // styles={selectStyles}
                  style={{
                    width: '100%',
                    overflow: 'visible',
                  }}
                />
              </div>
            </div>
            {/* 卡片渲染 */}
            <div className={styles['cards']}>
              {foods
                .filter((food) => {
                  if (showFavorites) return food.fav
                  return true
                })
                .map((food, index) => {
                  // 格式化日期、時間
                  const formattedDate = food.ntdentry_date
                    ? dayjs(food.ntdentry_date).format('YYYY-MM-DD')
                    : '未知日期'

                  // 增加一個條件檢查來確認 food.ntdentry_time 不是 undefined 或空字串。
                  const formattedTime = food.ntdentry_time
                    ? food.ntdentry_time.split(':').slice(0, 2).join(':')
                    : '未知時間'

                  return (
                    <div key={index} className={styles['card']}>
                      {/* 日期、時間 */}
                      <div className={styles['card-header']}>
                        攝取時間：
                        {formattedDate} {formattedTime}
                      </div>

                      {/* 愛心圖標、食物名稱 */}
                      <div className={styles['card-title']}>
                        {/* 切換愛心圖標 */}
                        {food.fav ? (
                          <GoHeartFill
                            className={styles['favorite-icon']}
                            onClick={() => toggleFav(food.food_name)}
                          />
                        ) : (
                          <GoHeart
                            className={styles['favorite-icon']}
                            onClick={() => toggleFav(food.food_name)}
                          />
                        )}
                        <div className={styles['food-name']}>
                          {food.food_name}
                        </div>
                      </div>

                      {/* 分隔線 */}
                      <div className={styles['card-divider']}></div>

                      {/* 份量和營養信息 */}
                      <div className={styles['card-body']}>
                        <div className={styles['food-nutrition']}>
                          <div>份量：{food.serving_size}</div>
                          <div>熱量：{formatNumber(food.food_calorie)}卡</div>
                          <div>
                            碳水化合物：{formatNumber(food.food_carb)}克
                          </div>
                          <div>蛋白質：{formatNumber(food.food_protein)}克</div>
                          <div>脂質：{formatNumber(food.food_fat)}克</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
