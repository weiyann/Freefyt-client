// FoodData.js
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from '@/styles/fytrack/food-data.module.css'
import { BsFillPlusCircleFill } from 'react-icons/bs'
import Pagination from '@mui/material/Pagination'

// PlusButton 组件
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
    transform: isHovered ? 'scale(1.2)' : 'scale(1)',
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

// FoodData 组件
const FoodData = ({ onFoodSelect }) => {
  const router = useRouter()
  const itemsPerPage = 20
  const [foodCategories, setFoodCategories] = useState([])
  const [foods, setFoods] = useState([])
  const [searchParams, setSearchParams] = useState({
    category: '',
    keyword: '',
  })
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  // Fetch food categories
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

  // Fetch foods
  const fetchFoods = async () => {
    try {
      const queryParams = new URLSearchParams({
        ...searchParams,
        page: currentPage,
        limit: itemsPerPage,
      }).toString()

      const response = await fetch(
        `http://localhost:3002/fytrack-fooddata/search-foods?${queryParams}`
      )
      const data = await response.json()
      if (data.success) {
        setFoods(data.data || [])
        const totalItems =
          typeof data.totalItems === 'number' ? data.totalItems : 0
        setTotalItems(totalItems)
        setTotalPages(Math.ceil(totalItems / itemsPerPage))

        console.log(data.data.foods)
      } else {
        // 處理錯誤情況
        console.error('Failed to fetch foods')
      }
    } catch (error) {
      console.error('Error fetching foods:', error)
    }
  }

  useEffect(() => {
    fetchFoodCategories()
    fetchFoods()
  }, [currentPage, searchParams])

  const handleSearch = () => {
    setCurrentPage(1)
    fetchFoods()
  }

  const handleCategoryChange = (event) => {
    setSearchParams({ ...searchParams, category: event.target.value })
    setCurrentPage(1)
    fetchFoods()
  }

  const handleKeywordChange = (event) => {
    setSearchParams({ ...searchParams, keyword: event.target.value })
    setCurrentPage(1)
    fetchFoods()
  }

  const validTotalPages = totalPages > 0 ? totalPages : 0

  // 添加 handleSelectFood 函數
  const handleSelectFood = (foodName) => {
    onFoodSelect(foodName)
  }

  // ... 頁面的 JSX 代碼
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
            <tbody>
              {foods.map((food) => (
                <tr key={food.food_id}>
                  <td>
                    <div className="icon-container">
                      <PlusButton
                        onClick={() => handleSelectFood(food.food_name)}
                      />
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
    </div>
  )
}
export default FoodData
