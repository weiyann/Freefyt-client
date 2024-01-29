import { useState, useContext, useEffect } from 'react'
import { chunk } from 'lodash'
import styles from '@/styles/course/course-weekly-calendar.module.css'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'
import dayjs from 'dayjs'
import AuthContext from '@/context/auth-context'
import { MEMBER_ORDER_COURSE } from '@/configs'
import Swal from 'sweetalert2'


export default function WeeklyCalendar({ course, time, courseOrder }) {
  const [currentWeek, setCurrentWeek] = useState(0)
  const [selectedSchedule, setSelectedSchedule] = useState('')
  const [memberOrder, setMemberOrder] = useState([])
  const { auth } = useContext(AuthContext)
  const memberId = auth.id

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

  return (
    <>
      {/* <pre>{JSON.stringify(memberOrder, null, 4)}</pre> */}

      <div className={styles['calendar-title']}>
        <button onClick={handlePrevWeek} className={styles['preWeek']}>
          <FaAngleLeft />
        </button>
        <button onClick={handleNextWeek} className={styles['nextWeek']}>
          <FaAngleRight />
        </button>
        <div className={styles['yearAndMonth']}>
          {`${currentDate.startOf('week').format('YYYY/M/DD')} - ${currentDate
            .endOf('week')
            .format('YYYY/M/DD')}`}
        </div>
      </div>

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
                        `${date.format('YYYY-MM-DD')} ${schedule.split(' ')[1]}`
                      )
                      // 過去的時間
                      {
                        /* const isPastTime = scheduleTime.isBefore(now) */
                      }
                      // 選到的時間
                      const dateTime =
                        date.format('YYYY/M/DD') +
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
                            isTimeReserved(dateTime) ? styles['disabled'] : ''
                          }`}
                          onClick={() => {
                            // 如果不是預約過的時間或過去的時間就設定狀態
                            if (!isReserved && !hasConflict) {
                              time(dateTime)
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
    </>
  )
}
