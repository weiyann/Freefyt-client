import React from 'react'
import styles from '@/styles/course/course-modal-timechange.module.css'
import { chunk } from 'lodash'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'
import dayjs from 'dayjs'
import { useState, useEffect, useContext } from 'react'
import {
  COURSE_DETAIL,
  COURSE_ORDER,
  COURSE_TIME_CHANGE,
  MEMBER_ORDER_COURSE,
  TIME_CHANGE_EMAIL,
  COURSE_MEMBER_DATA
} from '@/configs'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'
import AuthContext from '@/context/auth-context'

export default function TimeChangeModal({
  setChangeTimeModalOpen,
  orderData,
  setOrderData,
}) {
  const [currentWeek, setCurrentWeek] = useState(0)
  const [selectedSchedule, setSelectedSchedule] = useState('')
  const [course, setCourse] = useState({})
  const [courseOrder, setCourseOrder] = useState([])
  const [time, setTime] = useState('')
  const [initTime, setInitTime] = useState(
    orderData.course_datetime.slice(0, 16)
  )
  const [memberOrder, setMemberOrder] = useState([])
  const router = useRouter()
  const { auth } = useContext(AuthContext)
  const memberId = auth.id
  const [memberName, setMemberName] = useState('')

  // 取得會員姓名
  const getMemberName = async () => {
    try {
      const r = await fetch(`${COURSE_MEMBER_DATA}?member_id=${memberId}`)
      const data = await r.json()
      // console.log(data);

      // 檢查 data 是否是陣列且有資料
      if (Array.isArray(data) && data.length > 0) {
        setMemberName(data[0].member_name)
        // console.log(data[0].member_name)
      } else {
        console.error('No member data found')
      }
    } catch (ex) {
      console.error(ex)
    }
  }

  useEffect(() => {
    getMemberName()
  }, [router.query])

  // dayjs找當天日期，添加week, 用startOf找到當週的第一天, currentWeek=0 代表當前的週數,currentWeek為正代表未來的週數,負代表過去的週數
  const currentDate = dayjs().add(currentWeek, 'week').startOf('week')
  const weekDayList = ['日', '一', '二', '三', '四', '五', '六']

  const allData = chunk([...Array(7).keys()], 7)
  // const now = dayjs()
  const now = dayjs().add(24, 'hours') // 今天+24小時

  const handlePrevWeek = () => {
    setCurrentWeek((prevWeek) => prevWeek - 1)
  }

  const handleNextWeek = () => {
    setCurrentWeek((prevWeek) => prevWeek + 1)
  }
  // 檢查過去的時間及是否被預約
  const isTimeReserved = (dateTime) => {
    const reservationTime = dayjs(dateTime)
    const isPastTime = reservationTime.isBefore(now) // 過去的時間會得到true

    return (
      // 如果是過去就直接回傳 true,使用 some 方法來檢查 courseOrder 陣列中是否有任何一個元素滿足指定的條件,使用 isSame 方法比較兩個 dayjs 物件是否表示相同的日期和時間
      isPastTime ||
      courseOrder.some((order) => {
        const orderTime = dayjs(order.course_datetime)
        return reservationTime.isSame(orderTime)
      })
    )
  }

  // 取得課程資料
  const getCourse = async () => {
    const cid = orderData.course_id
    if (orderData.course_id !== undefined) {
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
  }, [orderData.course_id])

  // 取得課程訂單資料
  const getCourseOrder = async () => {
    const cid = orderData.course_id
    if (orderData.course_id !== undefined) {
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
  }, [orderData.course_id])

  // 送出更改時間
  const timeChangeSubmit = () => {
    console.log('test')
    fetch(COURSE_TIME_CHANGE, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        purchase_id: orderData.purchase_id,
        time: time + ':00',
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        console.log('更改時間回應:', data)

        if (data.success) {
          // 更新 orderData 狀態
          setOrderData((prevOrderData) => {
            const updatedOrderData = [...prevOrderData]
            const index = updatedOrderData.findIndex(
              (item) => item.purchase_id === orderData.purchase_id
            )
            if (index !== -1) {
              // 更新課程時間的邏輯
              updatedOrderData[index].course_datetime = dayjs(
                time,
                'HH:mm'
              ).format('YYYY-MM-DD HH:mm')

              // 更新狀態的邏輯
              updatedOrderData[index].status = '未確認預約'
            }
            return updatedOrderData
          })

          // 如果成功
          Swal.fire({
            icon: 'success',
            title: '更改時間成功',
            confirmButtonText: '確認',
          }).then(() => {
            sendNotificationToCoach();
            setChangeTimeModalOpen(false)
            // router.reload() // 重整頁面
          })
        } else {
          // 如果不成功
          Swal.fire({
            icon: 'warning',
            title: '時間沒有更改',
          })
        }
      })
      .catch((error) => {
        console.error('更改時間失敗:', error)
        Swal.fire({
          icon: 'error',
          title: '更改時間失敗',
        })
      })
  }
  // 取得會員已有的上課時間
  const getMemberOrder = async () => {
    try {
      const r = await fetch(`${MEMBER_ORDER_COURSE}?member_id=${memberId}`)
      const d = await r.json()
      setMemberOrder(d)
    } catch (ex) {
      console.log(ex)
    }
  }
  useEffect(() => {
    getMemberOrder()
  }, [memberId])

  // 更改時間寄信通知教練
  const sendNotificationToCoach = () => {
    fetch(TIME_CHANGE_EMAIL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        coachEmail: orderData.coach_email,
        coachName: orderData.coach_name, 
        courseName: orderData.course_name, 
        originalTime: initTime + ':00', 
        newTime: time + ':00', 
        memberName: memberName, 
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        console.log('通知教練回應:', data);
  
      })
      .catch((error) => {
        console.error('發送通知給教練失敗:', error);
      });
  };

  return (
    <>
      <div className={styles['modalBackground']}>
        <div className={styles['modalContainer']}>
          {/* <pre>{JSON.stringify(orderData, null, 4)}</pre> */}
          <div className={styles['title']}>
            <h5>更改預約時間</h5>
          </div>
          {/* calendar */}
          <div className={styles['modal-body']}>
            {/* calendar-title */}

            <div className={styles['calendar-title']}>
              <button onClick={handlePrevWeek} className={styles['preWeek']}>
                <FaAngleLeft />
              </button>
              <button onClick={handleNextWeek} className={styles['nextWeek']}>
                <FaAngleRight />
              </button>
              <div className={styles['yearAndMonth']}>
                {`${currentDate
                  .startOf('week')
                  .format('YYYY/M/DD')} - ${currentDate
                  .endOf('week')
                  .format('YYYY/M/DD')}`}
              </div>
              <div className={styles['selected-time-box']}>
                <div className={styles['init-time']}>原本時間：{initTime}</div>
                <div className={styles['selected-time']}>
                  更改時間：<span>{time}</span>
                </div>
              </div>
            </div>
            {/* <pre>{JSON.stringify(orderData, null, 4)}</pre> */}

            <table className={styles['calendar']}>
              <thead id="title">
                <tr className={styles['tr']}>
                  {weekDayList.map((day, index) => (
                    <th key={index} className={styles['th']}>
                      {day}
                      <br /> {currentDate.add(index, 'day').format('M/DD')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody id="data">
                {allData.map((week, weekIndex) => (
                  <tr key={weekIndex} className={styles['day-box']}>
                    {week.map((day, dayIndex) => {
                      const date = currentDate.add(day, 'day')

                      // 解析 schedule 字串為時間段陣列
                      const scheduleArray =
                        course.row && course.row.schedule.split(',')

                      // 找到當天對應的時間段
                      const todaySchedules = Array.isArray(scheduleArray)
                        ? scheduleArray.filter((item) => {
                            const [dayOfWeek, time] = item.split(' ')
                            return dayOfWeek === date.format('dddd')
                          })
                        : []

                      return (
                        <td
                          key={dayIndex}
                          className={styles['td']}
                          style={{ width: '153.11px' }}
                        >
                          {todaySchedules.map((schedule, index) => {
                            const scheduleTime = dayjs(
                              `${date.format('YYYY-MM-DD')} ${
                                schedule.split(' ')[1]
                              }`
                            )
                            // 過去的時間
                            {
                              /* const isPastTime = scheduleTime.isBefore(now) */
                            }
                            // 選到的時間
                            const dateTime =
                              date.format('YYYY-MM-DD') +
                              ' ' +
                              schedule.split(' ')[1].slice(0, 5)
                            // 課程已經預約的時間
                            const isReserved = isTimeReserved(dateTime)
                            // 會員已經預約的時間會衝突
                            const hasConflict = memberOrder.some((order) => {
                              const orderTime = dayjs(order.course_datetime)
                              return orderTime.isSame(scheduleTime)
                            })

                            return (
                              <div
                                key={index}
                                className={`${styles['time-period']} ${
                                  dateTime === selectedSchedule
                                    ? styles['active']
                                    : ''
                                } ${
                                  isTimeReserved(dateTime)
                                    ? styles['disabled']
                                    : ''
                                } ${
                                  dateTime == initTime
                                    ? styles['initselect-time']
                                    : ''
                                }`}
                                onClick={() => {
                                  // 如果不是預約過的時間或過去的時間就設定狀態
                                  if (!isReserved && !hasConflict) {
                                    setTime(dateTime)
                                    setSelectedSchedule(dateTime)
                                  } else if (isReserved) {
                                    return
                                  } else {
                                    Swal.fire({
                                      icon: 'warning',
                                      title: `${dateTime}
                                已經有其他預約的課程，請選擇其他時間
                                `,
                                      // text: '請選擇其他時間。',
                                      confirmButtonText: '確認',
                                    })
                                  }
                                }}
                              >
                                {schedule.split(' ')[1].slice(0, 5)}
                              </div>
                            )
                          })}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles['footer']}>
            <button
              onClick={() => {
                setChangeTimeModalOpen(false)
              }}
              className={styles['btn-cancel']}
            >
              取消
            </button>
            <button
              className={styles['btn-continue']}
              onClick={timeChangeSubmit}
            >
              確認更改
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
