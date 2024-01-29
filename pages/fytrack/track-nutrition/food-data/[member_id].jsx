import React from 'react'
import { useEffect, useState, useCallback, useContext } from 'react'
import { useRouter } from 'next/router'
import AuthContext from '@/context/auth-context'
import { MEMBER_PROFILE, MEMBER_PROFILE_PIC } from '@/configs/index'
import styles from '@/styles/fytrack/food-data.module.css'
import { BsFillPlusCircleFill } from 'react-icons/bs'
import Pagination from '@mui/material/Pagination'
import swal from 'sweetalert'

// plus按鈕
function PlusButton({ onClick }) {
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => setIsHovered(false)
  const handleClick = () => {
    onClick() // 傳入的 onClick 函數
  }

  const dynamicStyle = {
    padding: '1px 2px',
    marginLeft: 'auto',
    color: isHovered ? '#1c3b5e' : '#536080',
    fontSize: '2rem',
    cursor: 'pointer',
    transition: 'color 0.3s ease, transform 0.3s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2), 0 -1px 0 rgba(0, 0, 0, 0.1)inset',
    borderRadius: '50px',
    transform: isHovered ? 'scale(1.2)' : 'scale(1)', // 滑鼠懸停時放大
  }

  return (
    <BsFillPlusCircleFill
      style={dynamicStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    />
  )
}

// 組件定義:定義一個名為FoodData的函數組件，並將其導出供其他文件使用。
export default function FoodData() {
  // 可以⽤ auth 得到會員編號(auth.id)和令牌(auth.token)。
  const { auth } = useContext(AuthContext)

  const [memberProfile, setMemberProfile] = useState({
    member_username: '',
    member_name: '',
    member_nickname: '',
    member_bio: '',
    member_pic: '',
  })

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

  // 控制彈跳視窗顯示的狀態
  // const [openModal, setOpenModal] = useState(false)

  // const handleOpenModal = () => {
  //   setOpenModal(true)
  // }

  // const handleCloseModal = () => {
  //   setOpenModal(false)
  // }

  // 定義一個常數itemsPerPage，表示每頁顯示的項目數，這裡設置為20。
  const itemsPerPage = 20

  // 在元件中定義一個狀態變數來儲存totalItems。
  const [totalItems, setTotalItems] = useState(0) // 初始化為0或其他預設值

  // 狀態管理:使用useState鉤子創建三個狀態：foodCategories用於存儲食品種類，foods用於存儲搜尋到的食品，searchParams用於管理搜尋參數。
  // 使用useState鉤子創建一個狀態變數foodCategories，並初始化為一個空數組。
  const [foodCategories, setFoodCategories] = useState([])

  // 使用useState鉤子創建一個狀態變數foods，並初始化為一個空數組。
  const [foods, setFoods] = useState([])

  // 使用useState鉤子創建一個狀態變數searchParams，並初始化為一個對象，該對象包含兩個屬性category和keyword，它們分別用於管理食品類別和搜索關鍵字。
  const [searchParams, setSearchParams] = useState({
    category: '',
    keyword: '',
  })

  // 使用useState鉤子創建一個狀態變數totalPages，並初始化為0，用於存儲總頁數。
  const [totalPages, setTotalPages] = useState(0)

  // 使用useState鉤子創建一個狀態變數currentPage，並初始化為1，表示當前頁碼。
  const [currentPage, setCurrentPage] = useState(1)

  // 加載食品種類:定義一個異步函數fetchFoodCategories，用於從後端API獲取食品種類數據。
  const fetchFoodCategories = async () => {
    try {
      const response = await fetch(
        `http://localhost:3002/fytrack-fooddata/food-categories`
      )
      const data = await response.json()

      console.log(data)

      if (data.success) {
        setFoodCategories(data.data)
      }
    } catch (error) {
      console.error('Error fetching food categories:', error)
    }
  }

  // 加載食品數據:定義一個異步函數fetchFoods，用於根據搜索參數從後端API獲取食品數據。
  // fetchFoods 函數通過 fetch API 調用後端 API。當請求成功時，後端 API 返回一個 JSON 對象，這個對象通常包含一個標示請求成功與否的 success 屬性，以及實際數據的 data 屬性，這個data屬性是一個對象，包含了食品數據（foods）和總項目數（totalItems）。
  // 從後端接收 totalItems 並計算 totalPages 的邏輯
  // 在這個函數中，先向後端發送了一個請求，然後從回應中提取 data.data 和 data.data.totalItems。 正確地檢查了 totalItems 是否為數字，如果不是，則將其設為0。 使用 Math.ceil(totalItems / itemsPerPage) 來計算 totalPages 並使用 setTotalPages 更新狀態。
  const fetchFoods = useCallback(async () => {
    try {
      // searchParams 包含 category 和 keyword，同時還添加了 page 和 limit 作為查詢參數。
      const queryParams = new URLSearchParams({
        ...searchParams,
        page: currentPage,
        limit: itemsPerPage,
      }).toString()
      const response = await fetch(
        `http://localhost:3002/fytrack-fooddata/search-foods?${queryParams}`
      )
      const data = await response.json()

      console.log(data)

      // 在這裡加入 console.log 來查看從後端接收的數據
      console.log(data)

      if (data.success) {
        // 這裡的data.data.foods 是指從後端 API 返回的 JSON 響應中獲取的食品數據數組。這裡，data 是 fetch API 調用後得到的 JSON 響應對象，而 data.data 是這個響應中包含實際數據的屬性。data.data.foods 則是存放所有食品數據的數組。
        // 將食品數據數組設置到狀態中
        // 如果 data.data.foods 存在並且是一個數組，則將其設置為 foods 狀態。如果不存在，則設置為一個空數組。
        setFoods(data.data || [])
        // 確保 totalItems 是一個有效的數字
        // 檢查 data.data.totalItems 是否為有效數字，如果是，則使用它的值；如果不是，則將 totalItems 設置為 0。
        const totalItems =
          typeof data.totalItems === 'number' ? data.totalItems : 0
        // 根據總項目數和每頁的項目數計算總頁數，並將其設置為 totalPages 狀態。
        setTotalItems(totalItems)
        setTotalPages(Math.ceil(totalItems / itemsPerPage)) // 計算並設置總頁數
      }
    } catch (error) {
      console.error('Error fetching foods:', error)
    }
  }, [currentPage, itemsPerPage, searchParams])

  // 計算有效的總頁數:創建一個變數validTotalPages，用於確保總頁數大於0。
  const validTotalPages = totalPages > 0 ? totalPages : 0

  // 副作用處理:useEffect鉤子在組件首次渲染後執行，用於加載食品種類和食品數據。
  // 使用useEffect鉤子來執行副作用操作，當currentPage或searchParams變化時執行。
  useEffect(() => {
    fetchFoodCategories()
    fetchFoods()
  }, [fetchFoods])

  // 處理搜索事件:定義handleSearch函數，當用戶點擊搜索按鈕時調用，用於觸發食品數據的加載。
  const handleSearch = () => {
    setCurrentPage(1) // 重置為第一頁
    fetchFoods()
  }

  // 處理表單輸入變更:這兩個函數處理下拉選單和關鍵字輸入框的變化，並更新searchParams狀態。定義一個函數handleKeywordChange，用於處理關鍵字輸入框的變化，並更新searchParams狀態。
  const handleCategoryChange = (event) => {
    setSearchParams({ ...searchParams, category: event.target.value })
    setCurrentPage(1) // 重置為第一頁
    fetchFoods() // 重新加載食品數據
  }

  // 定義一個函數handleKeywordChange，用於處理關鍵字輸入框的變化，並更新searchParams狀態。
  const handleKeywordChange = (event) => {
    setSearchParams({ ...searchParams, keyword: event.target.value })
    setCurrentPage(1) // 重置為第一頁
    fetchFoods() // 重新加載食品數據
  }

  const [showAddSuccess, setShowAddSuccess] = useState(false)

  const addFoodToDiary = async (food) => {
    // 獲取當前用戶所在時區的日期和時間
    const currentDate = new Date()
    const localDate = currentDate.toLocaleDateString('en-CA') // 格式為 YYYY-MM-DD
    const localTime = currentDate.toTimeString().split(' ')[0] // 格式為 HH:MM:SS

    const entryData = {
      member_id: auth.id,
      ntdentry_date: localDate, // 使用本地日期
      ntdentry_time: localTime.substring(0, 5), // 使用本地時間並格式化
      food_name: food.food_name,
      serving_size: food.serving_size,
      // 可以添加其他需要的數據字段
    }

    try {
      const response = await fetch(
        `http://localhost:3002/fytrack/nutrition/add`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + auth.token,
          },
          body: JSON.stringify(entryData),
        }
      )

      if (response.ok) {
        swal({
          title: '成功',
          text: '已成功加入餐點',
          icon: 'success',
          button: {
            text: 'OK',
            value: true,
            visible: true,
            className: 'blue-btn',
            closeModal: true,
          },
          className: 'orange-icon',
        })
      } else {
        swal('錯誤', '添加食物失敗', 'error')
      }
    } catch (error) {
      console.error('添加食物時出現錯誤', error)
      swal('錯誤', '添加食物時出現錯誤', 'error')
    }
  }

  // 組件的最後一部分包括了渲染組件的主要內容，包括麵包屑導航、搜索塊、表格和分頁。分頁功能根據從後端API獲取的總數據量動態生成頁面鏈接，並在表格中顯示搜索結果。
  // 這個組件的主要功能是允許用戶搜索食品數據，並顯示在表格中，同時提供分頁功能以瀏覽多頁的搜索結果。
  return (
    <div className={styles['container']}>
      {/* 麵包屑導航 */}
      <div className={styles['breadcrumbs']}>
        首頁 / 健身追蹤 / 營養追蹤 / 食品資料庫
      </div>
      {/* 主要內容區 */}
      <div className={styles['main-content']}>
        <div className={styles['search-block']}>
          <h2 style={{ color: 'white', textAlign: 'center' }}>食品資料庫</h2>
          <div className={styles['search-inputs']}>
            <label htmlFor="food-type" className={styles['input-label']}>
              食品種類：
            </label>

            {/* 渲染下拉選單:渲染一個下拉選單，用於選擇食品種類。它使用handleCategoryChange函數來處理選項的變更。 */}
            {/* 顯示"食品種類："標籤，並設定標籤的for屬性為"food-type"，以便與下拉選單關聯。 */}
            {/* 渲染一個下拉選單，設定onChange事件處理函數為handleCategoryChange，以處理選項變更。下拉選單的值根據searchParams.category來決定，並根據foodCategories中的數據動態生成選項。 */}
            <select
              id={styles['food-type']}
              onChange={handleCategoryChange}
              value={searchParams.category}
            >
              <option value="">全部</option>
              {foodCategories.map((category) => (
                <option
                  key={category.food_category_id}
                  value={category.food_category_id}
                >
                  {category.food_category_name}
                </option>
              ))}
            </select>

            {/* 顯示"關鍵字搜尋："標籤，並設定標籤的for屬性為"keyword"，以便與文本輸入框關聯。 */}
            <label htmlFor="keyword" className={styles['input-label']}>
              關鍵字搜尋：
            </label>

            {/* 渲染一個文本輸入框，其type設定為"text"，id屬性設定為CSS模組化的樣式keyword，設定了預置文字"找食物"，並設定onChange事件處理函數為handleKeywordChange，以處理文本變更。文本輸入框的值根據searchParams.keyword來決定。 */}
            <input
              style={{ fontSize: '16px' }}
              type="text"
              id={styles['keyword']}
              placeholder="找食物"
              onChange={handleKeywordChange}
              value={searchParams.keyword}
            />
          </div>
          <div className={styles['search-buttons']}>
            {/* 渲染一個"清除"按鈕，並設定按鈕的點擊事件處理函數，當點擊時將searchParams重置為空。 */}
            <button
              className={styles['clear-btn']}
              onClick={() => setSearchParams({ category: '', keyword: '' })}
            >
              清除
            </button>
            {/* 渲染一個"搜尋"按鈕，並設定按鈕的點擊事件處理函數為handleSearch，用於觸發食品數據的加載。 */}
            <button className={styles['search-btn']} onClick={handleSearch}>
              搜尋
            </button>
          </div>
        </div>

        {/* 顯示搜索結果的項目數，這裡使用foods.length獲取搜索到的食品數據的數量。 */}
        <div className={styles['search-results']}>
          {/* 這部分文字顯示目前頁的資料範圍，使用 (currentPage - 1) * itemsPerPage + 1 計算目前頁的第一項，Math.min(currentPage * itemsPerPage, totalItems) 計算目前頁的最後一項。 這樣就能顯示出目前頁資料的範圍。 */}
          <p style={{ color: '#6a6a6a' }}>
            顯示 {(currentPage - 1) * itemsPerPage + 1} -{' '}
            {Math.min(currentPage * itemsPerPage, totalItems)} 筆，共{' '}
            {totalItems} 筆
          </p>
          <p style={{ color: '#6a6a6a', marginBottom: '10px' }}>
            目前在第 {currentPage} 頁，共 {validTotalPages} 頁
          </p>
          {/* 渲染表格:渲染一個表格，用於顯示搜索到的食品數據。 */}
          <table className={styles['data-table']}>
            {/* 表格頭部 */}
            <thead>
              <tr>
                <th className={styles['data-th']}>加入餐點</th>
                <th className={styles['data-th']}>食品</th>
                <th className={styles['data-th']}>份量</th>
                <th className={styles['data-th']}>份量單位</th>
                <th className={styles['data-th']}>熱量</th>
                <th className={styles['data-th']}>蛋白質</th>
                <th className={styles['data-th']}>醣類</th>
                <th className={styles['data-th']}>脂質</th>
              </tr>
            </thead>

            {/* 表格的體部分，包含實際的數據行，使用foods.map方法來動態生成數據行。 */}
            {/* foods.map((food) => (...))中，food代表從foods數組中遍歷出來的單個食品對象。在这里，food 是一个局部變量，代表數組中的每個元素（即單個食品） */}
            {/* foods: 用作一個狀態變量。它是通過useState鉤子定義的，初始值為一個空數組。foods用於存儲從後端API搜索到的食品數據。代碼中有這樣的邏輯：當從API獲取到食品數據後，會更新foods的狀態，將其設置為包含搜索到的所有食品的數組。在渲染时，foods數組會被遍歷，以在表格中顯示每個食品的相關訊息。 */}
            <tbody>
              {foods.map((food) => (
                <tr key={food.food_id}>
                  <td>
                    <div className="icon-container">
                      <PlusButton onClick={() => addFoodToDiary(food)} />
                    </div>
                  </td>
                  <td className={styles['food-name-cell']}>{food.food_name}</td>
                  <td>{food.serving_size}</td>
                  <td>{food.serving_size_unit}</td>
                  <td>{food.food_calorie}</td>
                  <td>{food.food_protein}</td>
                  <td>{food.food_carb}</td>
                  <td>{food.food_fat}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* 分頁 */}
          {/* 根據 validTotalPages 來渲染分頁連結，使用CSS模組化的方式定義一個pagination樣式的<div>元素，用於包裹分頁功能。分頁功能根據validTotalPages的值來動態生成頁面鏈接，並使用setCurrentPage函數來處理頁面切換的點擊事件。 */}
          <div className={styles['pagination-container']}>
            <Pagination
              count={validTotalPages}
              page={currentPage}
              onChange={(event, page) => setCurrentPage(page)}
              color="primary"
              sx={{
                '.MuiPaginationItem-root': {
                  fontSize: '1.2rem',
                },
              }}
            />
          </div>
        </div>
      </div>
      {/* 新增的 Modal 組件 */}
      {/* <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Box>
          <h2 id="simple-modal-title">新增食物日記</h2>
          <p id="simple-modal-description">在這裡放置您的表單或其他內容。</p>
          <button onClick={handleCloseModal}>關閉</button>
        </Box>
      </Modal> */}
    </div>
  )
}
