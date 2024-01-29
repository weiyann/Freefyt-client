import React from 'react'
import { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router'
import AuthContext from '@/context/auth-context'
import { MEMBER_PROFILE, MEMBER_PROFILE_PIC } from '@/configs/index'
import { FaRegPlusSquare } from 'react-icons/fa'
import { LuCalendarClock } from 'react-icons/lu'
import { GrTarget } from 'react-icons/gr'
import { FaNutritionix } from 'react-icons/fa6'
import styles from '@/styles/fytrack/nutrition-edit.module.css'
import swal from 'sweetalert'

// 到單一會員的網址(最後使用 id):
// https://my-json-server.typicode.com/eyesofkids/json-fake-data/members/1

// 定義一個 React 函數組件 NutritionEdit
export default function NutritionEdit() {
  // 可以⽤ auth 得到會員編號(auth.id)和令牌(auth.token)。
  const { auth } = useContext(AuthContext)

  const [memberProfile, setMemberProfile] = useState({
    member_username: '',
    member_name: '',
    member_nickname: '',
    member_bio: '',
    member_pic: '',
  })

  // 使用 useRouter 鉤子從 Next.js 框架中獲取當前路由信息
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

  // 初始表單數據設置為空值或預期的目標值
  const initialFormState = {
    caloric_target: '',
    protein_target: '',
    carb_target: '',
    fat_target: '',
  }

  // 使用 useState 鉤子設置表單狀態
  const [formState, setFormState] = useState(initialFormState)

  // 使用 useEffect 鉤子在組件加載時執行操作，獲取會員的當前營養目標數據
  useEffect(() => {
    const fetchNutritionTargets = async () => {
      const member_id = router.query.member_id
      console.log(member_id)
      try {
        // 向後端 API 發送請求，獲取特定會員的營養目標數據
        const response = await fetch(
          `http://localhost:3002/fytrack/edit/${member_id}`
        )
        const data = await response.json()
        // 將獲取到的數據設置為表單的初始值
        if (data) {
          setFormState(data)
        }
      } catch (error) {
        console.error('獲取營養目標數據時出錯:', error)
      }
    }

    // 如果路由準備好，則執行獲取數據的函數
    if (router.isReady) {
      fetchNutritionTargets()
    }
  }, [router.isReady, router.query.member_id])

  // 處理表單輸入變化的函數
  const handleInputChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    })
  }

  // 處理表單提交的函數
  const handleSubmit = async (event) => {
    event.preventDefault() // 防止表單的預設提交行為
    const member_id = router.query.member_id // 獲取會員ID

    const data = {
      member_id,
      ...formState, // 包含表單中的所有輸入數據
    }

    // 向後端發送 POST 請求以更新營養目標數據
    try {
      const response = await fetch(
        'http://localhost:3002/fytrack/nutrition/targets',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      )

      const result = await response.json()
      if (result.success) {
        swal('成功', '目標數據更新成功', 'success').then(() => {
          router.back() // 返回到之前的頁面
        })
      } else {
        swal('失敗', '目標數據更新失敗: ' + result.message, 'error')
      }
    } catch (error) {
      swal('錯誤', '發送請求時出錯: ' + error.message, 'error')
    }
  }

  return (
    <div className={styles['container']}>
      {/* 麵包屑導航 */}
      <div className={styles['breadcrumbs']}>
        首頁 / 健身追蹤 / 營養追蹤 / 設定
      </div>
      {/* 主要內容區 */}
      <div className={styles['image-container']}>
        <img src="/fytrack_img/add-img.jpg" alt="新增營養數據頁面圖" />
        <FaRegPlusSquare className={styles.iconPlus} />
      </div>
      <form className={styles['nutrition-form']} onSubmit={handleSubmit}>
        <div className={styles['form-title']}>編輯設定目標</div>

        {/* 目標熱量表單項目 */}
        <div className={styles['form-item']}>
          <div className={styles['input-group']}>
            <GrTarget className={styles.icon} />
            <label htmlFor="caloric_target" className={styles['label']}>
              目標熱量
            </label>
          </div>
          <input
            type="text"
            name="caloric_target"
            id="caloric_target"
            value={formState.caloric_target}
            onChange={handleInputChange}
            placeholder="變更目標熱量"
            className={styles.input}
          />
        </div>
        {/* 目標脂肪表單項目 */}
        <div className={styles['form-item']}>
          <div className={styles['input-group']}>
            <FaNutritionix className={styles.icon} />
            <label htmlFor="fat_target" className={styles['label']}>
              目標脂肪
            </label>
          </div>
          <input
            type="text"
            name="fat_target"
            id="fat_target"
            value={formState.fat_target}
            onChange={handleInputChange}
            placeholder="變更目標脂肪"
            className={styles.input}
          />
        </div>
        {/* 目標蛋白表單項目 */}
        <div className={styles['form-item']}>
          <div className={styles['input-group']}>
            <FaNutritionix className={styles.icon} />
            <label htmlFor="protein_target" className={styles['label']}>
              目標蛋白質
            </label>
          </div>
          <input
            type="text"
            name="protein_target"
            id="protein_target"
            value={formState.protein_target}
            onChange={handleInputChange}
            placeholder="變更目標蛋白質"
            className={styles.input}
          />
        </div>
        {/* 目標碳水化合物表單項目 */}
        <div className={styles['form-item']}>
          <div className={styles['input-group']}>
            <FaNutritionix className={styles.icon} />

            <label htmlFor="carb_target" className={styles['label']}>
              目標碳水化合物
            </label>
          </div>
          <input
            type="text"
            name="carb_target"
            id="carb_target"
            value={formState.carb_target}
            onChange={handleInputChange}
            placeholder="變更目標碳水化合物"
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles['button']}>
          送出
        </button>
      </form>
    </div>
  )
}
