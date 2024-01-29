import React from 'react'
import styles from '@/styles/course/course-payment.module.css'
import { useRouter } from 'next/router'
import { useState, useEffect, useContext } from 'react'
import { COURSE_DETAIL, COURSE_ORDER, COURSE_MAIL,COURSE_MEMBER_DATA } from '@/configs'
import WeeklyCalendar from '@/components/course/weekly-calendar'
import AuthContext from '@/context/auth-context'

export default function Appointment() {
  const [course, setCourse] = useState({})
  const [courseOrder, setCourseOrder] = useState([])
  const [time, setTime] = useState('')
  const { auth } = useContext(AuthContext)
  const [memberName,setMemberName]=useState('')
  const memberId = auth.id
  const router = useRouter()

  const getTime = (time) => {
    setTime(time)
  }

 // 取得會員姓名
const getMemberName = async () => {
  try {
    const r = await fetch(`${COURSE_MEMBER_DATA}?member_id=${memberId}`);
    const data = await r.json();
    // console.log(data);

    // 檢查 data 是否是陣列且有資料
    if (Array.isArray(data) && data.length > 0) {
      setMemberName(data[0].member_name);
      // console.log(data[0].member_name)
    } else {
      console.error('No member data found');
    }
  } catch (ex) {
    console.error(ex);
  }
};

useEffect(() => {
  getMemberName();
}, [router.query.cid]);

  // 取得課程資料
  const getCourse = async () => {
    const cid = +router.query.cid
    console.log(router.query.cid)
    if (router.query.cid !== undefined) {
      if (!cid) {
        router.push('/course')
      } else {
        try {
          const r = await fetch(COURSE_DETAIL + `/${cid}`)
          const d = await r.json()
          setCourse(d)
        } catch (ex) {
          console.log(ex)
        }
      }
    }
  }
  useEffect(() => {
    getCourse()
  }, [router.query.cid])

  // 取得課程訂單資料
  const getCourseOrder = async () => {
    const cid = +router.query.cid
    console.log(router.query.cid)
    if (router.query.cid !== undefined) {
      if (!cid) {
        router.push('/course')
      } else {
        try {
          const r = await fetch(COURSE_ORDER + `/${cid}`)
          const d = await r.json()
          setCourseOrder(d)
        } catch (ex) {
          console.log(ex)
        }
      }
    }
  }
  useEffect(() => {
    getCourseOrder()
  }, [router.query.cid])
  
  // 前往結賬時建立訂單
  const handleCheckoutClick = async () => {
    // 創建訂單，獲取訂單編號
    const orderData = {
      course_datetime: time + ':00',
      course_id: course.row && course.row.course_id,
      member_id: memberId,
      status: '未確認預約',
    }
    try {
      const r = await fetch('http://localhost:3002/course/add-purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })
      console.log('Order Response:', r)
      const orderJson = await r.json()
 
      // 提取訂單編號或其他相關信息
      const { tradeNo} = orderJson
      const course_datetime = orderJson.postData.course_datetime;
      const purchase_id =orderJson.purchase_id;
      console.log('Order Response:', orderJson)
      // console.log(purchase_id)

      // 在這裡添加發送給教練的請求
      const coachEmail=course.row&&course.row.coach_email
      const coachName =course.row&&course.row.coach_name
      const courseName=course.row&&course.row.name
      await fetch(COURSE_MAIL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // 傳遞給後端的相關數據，例如 tradeNo 或其他必要的信息
          tradeNo,
          coachEmail,
          coachName,
          memberName,
          courseName,
          course_datetime,
        }),
      })

      // 構建要傳遞給綠界的查詢參數
      const queryParams = {
        courseId: course.row && course.row.course_id,
        courseName: course.row && course.row.name,
        selectedTime: time,
        price: course.row && course.row.price,
        tradeNo: tradeNo,
        purchase_id:purchase_id,
        // 其他您需要傳遞的狀態
      }

      // 使用 URLSearchParams 將查詢參數轉換為 URL 字符串
      const queryString = new URLSearchParams(queryParams).toString()

      // 構建相對 URL
      const checkoutURL = `http://localhost:3002/ecpay?=${queryString}`

      // 將用戶導向到綠界支付頁面
      window.location.href = checkoutURL
    } catch (error) {
      console.error('創建訂單時發生錯誤：', error)
      // 處理錯誤，例如顯示錯誤消息給用戶
    }
  }

  return (
    <>
      {/* <pre>{JSON.stringify(memberName, null, 4)}</pre> */}
      {/* <pre>{JSON.stringify(time, null, 4)}</pre> */}

      {/* cart-step */}
      <section id="cart-step" className={styles['cart-step-section']}>
        <div className="container">
          <div className={styles['cart-step']}>
            <div className={styles['step']}>
              <div className={`${styles['num']} ${styles['num-current']}`}>
                1
              </div>
              <div
                className={`${styles['step-text']} ${styles['step-text-current']}`}
              >
                預約時間
              </div>
            </div>
            <div className={styles['step']}>
              <div className={styles['num']}>2</div>
              <div className={styles['step-text']}>線上付款</div>
            </div>
            <div className={styles['step']}>
              <div className={styles['num']}>3</div>
              <div className={styles['step-text']}>完成訂單</div>
            </div>
            <div className={styles['step-line']} />
          </div>
        </div>
      </section>
      {/* 預約時間 */}
      <section id="appointment">
        <div className="container">
          <div className={styles['choose-time']}>請選擇時間</div>
        </div>
        {/* TODO:預約時間表 */}
        <div className="container">
          <div className={styles['weeklyCalendar']}>
            <WeeklyCalendar
              course={course}
              time={getTime}
              courseOrder={courseOrder}
            />
          </div>
        </div>

        {/* 課程訂單 */}
        <section id="course-order">
          <div className="container">
            <div className={styles['orderContent']}>
              <div className={styles['course-order-title']}>課程訂單</div>
              <div className={styles['course-item']}>
                <div className={styles['course-th']}>課程名稱</div>
                <div className={styles['course-th']}>教練名稱</div>
                <div className={styles['course-th']}>
                  上課時間(上方選擇時間)
                </div>
                <div className={styles['course-th']}>價格</div>
              </div>
              <div className={styles['course-item']}>
                <div className={styles['course-td']}>
                  {course.row && course.row.name}
                </div>
                <div className={styles['course-td']}>
                  {course.row && course.row.coach_name}
                </div>
                <div className={styles['course-td']}>{time}</div>
                <div className={styles['course-td']}>
                  NT$ {course.row && course.row.price.toLocaleString()}
                </div>
              </div>
              <div className={styles['btn-container']}>
                <button
                  className={
                    !!time
                      ? styles['btn-to-checkout']
                      : styles['btn-to-checkout-disabled']
                  }
                  disabled={!time}
                  onClick={handleCheckoutClick}
                >
                  前往結賬
                </button>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  )
}
