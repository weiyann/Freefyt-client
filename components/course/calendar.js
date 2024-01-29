import { useState } from 'react'
import { chunk } from 'lodash' // chunk([1, 2, 3, 4, 5], 2) -> [[1,2],[3,4],[5]]
import styles from '@/styles/course/course-management.module.css'
import { FaAngleLeft } from 'react-icons/fa6'
import { FaAngleRight } from 'react-icons/fa6'
import dayjs from 'dayjs'
import { COURSE_TIME_CHANGE, TIME_CHANGE_EMAIL } from '@/configs'
import Swal from 'sweetalert2'
export default function Calendar({
  orderData,
  memberName,
  dropTargetDate,
  setDropTargetDate,
}) {
  const [myDate, setMyDate] = useState(0)
  const [currentMonth, setCurrentMonth] = useState(new Date()) // 當前月份的狀態，可透過按鈕切換
  const [draggedOrder, setDraggedOrder] = useState([])
  // const [dropTargetDate, setDropTargetDate] = useState('')

  const today = new Date()
  const currentDate = {
    y: currentMonth.getFullYear(),
    m: currentMonth.getMonth() + 1, //注意回傳為 0~11
    d: currentMonth.getDate(),
  }
  const weekDayList = ['日', '一', '二', '三', '四', '五', '六']
  const days = new Date(currentDate.y, currentDate.m, 0).getDate() // 得到當前月的天數
  const firstDay = new Date(currentDate.y, currentDate.m - 1, 1).getDay() // 得到當前月的第一天是星期幾

  // 使用 chunk 函數將陣列分組
  const allData = chunk(
    [
      ...Array(firstDay).fill(''),
      ...Array(days)
        .fill('')
        .map((v, i) => i + 1),
    ],
    7
  )
  // 往前一個月
  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    )
  }
  // 往下一個月
  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    )
  }
  // 取得整點時間
  const formatTime = (datetime) => {
    return dayjs(datetime).format('HH:mm')
  }

  // 新增的物件，用來根據日期組織訂單
  const ordersByDate = {}

  // 遍歷所有訂單，將它們按日期分組,getMonth() 方法回傳的月份是從 0 開始，需要加 1
  orderData.forEach((order) => {
    const orderDate = new Date(order.course_datetime)
    const dateKey = `${orderDate.getFullYear()}-${
      orderDate.getMonth() + 1
    }-${orderDate.getDate()}`
    if (!ordersByDate[dateKey]) {
      ordersByDate[dateKey] = []
    }
    ordersByDate[dateKey].push(order)
  })

  // 日期拖拉
  const handleDragStart = (e, order) => {
    // 判斷課程狀態是否為已完成
    if (order.status !== '已完成') {
      setDraggedOrder(order)
      console.log('dropstart')
    } else {
      // 如果狀態為已完成，不允許拖動
      e.preventDefault()
    }
  }

  const handleDrop = async (day,orders) => {
    // 在這裡處理拖放後的邏輯，你可以更新課程的時間等信息
    if (draggedOrder && dropTargetDate !== null) {
      const date = dayjs(dropTargetDate).format('YYYY/MM/DD')
      const time = dayjs(draggedOrder.course_datetime).format('HH:mm')
      const purchase_id = draggedOrder.purchase_id

      // 判斷是否移動到相同的一天
      const isSameDay =
        date === dayjs(draggedOrder.course_datetime).format('YYYY/MM/DD')

      // 判斷是否拖動到過期的日期
      const isPastDate = dayjs(date).isBefore(dayjs(), 'time')

      // 判斷時間衝突
      const hasConflict = orders.some((order) => {
        if (order.purchase_id !== draggedOrder.purchase_id) {
          const orderStartTime = dayjs(order.course_datetime).format('HH:mm');
          return time === orderStartTime
        }
        return false;
      });
      if(hasConflict){
        Swal.fire({
          icon: 'error',
          title: '所選時間與其他課程時間衝突，請選擇其他時間',
        });
      }

      if (!isSameDay && !isPastDate && !hasConflict) {
        
        const alert = await Swal.fire({
          title: `您確定要將「${draggedOrder.course_name}」從${dayjs(
            draggedOrder.course_datetime
          ).format('YYYY/MM/DD')}更改為${date}嗎？`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: '確認',
          cancelButtonText: '取消',
        })

        if (alert.isConfirmed) {
          try {
            // 向後端發送請求
            const r = await fetch(COURSE_TIME_CHANGE, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                time: `${date} ${time}`, // 合併日期和時間
                purchase_id: purchase_id,
              }),
            })

            const result = await r.json()
            console.log(result)
            if (result.success) {
              Swal.fire({
                icon: 'success',
                title: '更改日期成功',
                confirmButtonText: '確認',
              })
              // 在這裡處理成功後發送通知
              sendNotificationToCoach(draggedOrder, date)
            } else {
              Swal.fire({
                icon: 'error',
                title: '更改日期失敗',
              })
            }
            // 在這裡處理後端返回的結果

            setDraggedOrder(null)
            setDropTargetDate(null)
          } catch (error) {
            // 處理錯誤
            console.error('Error updating course time:', error)
          }
        }
      }
    }
  }

  const handleDragOver = (e, day) => {
    e.preventDefault()
    setDropTargetDate(`${currentDate.y}-${currentDate.m}-${day}`)
  }

  // 更改時間寄信通知教練
  const sendNotificationToCoach = (order, newDate) => {
    const originalTime = dayjs(order.course_datetime).format('HH:mm') + ':00'

    // 在新的日期(newDate)中加入原來的時間(originalTime)
    const updatedTime = `${newDate} ${originalTime}`
    console.log(originalTime)
    console.log(updatedTime)
    fetch(TIME_CHANGE_EMAIL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        coachEmail: order.coach_email,
        coachName: order.coach_name,
        courseName: order.course_name,
        originalTime: order.course_datetime,
        newTime: updatedTime,
        memberName: memberName,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        console.log('通知教練回應:', data)

      })
      .catch((error) => {
        console.error('發送通知給教練失敗:', error)
      })
  }

  return (
    <>
      {/* <pre>{JSON.stringify(orderData, null, 4)}</pre> */}
      <div className={styles['calendar-title']}>
        <button onClick={handlePrevMonth} className={styles['preMonth']}>
          <FaAngleLeft />
        </button>
        <button onClick={handleNextMonth} className={styles['nextMonth']}>
          <FaAngleRight />
        </button>

        <div
          className={styles['yearAndMonth']}
        >{`${currentDate.m}月-${currentDate.y}年`}</div>
        <div className={styles['reserved-dot']}></div>
        <div className={styles['status-text']}>已預約</div>
        <div className={styles['unreserved-dot']}></div>
        <div className={styles['status-text']}>未確認預約</div>
        <div className={styles['finished-dot']}></div>
        <div className={styles['status-text']}>已完成</div>
      </div>

      <table className={styles['calendar']}>
        <thead id="title">
          <tr className={styles['tr']}>
            {weekDayList.map(function (v, i) {
              return (
                <th key={i} className={styles['th']}>
                  {v}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody id="data">
          {allData.map((v, i) => {
            return (
              <tr key={i} className={styles['day-box']}>
                {v.map((item, idx) => {
                  // 用當前年、月份和每一天的日期 item 來建立 datekey
                  const dateKey = `${currentDate.y}-${currentDate.m}-${item}`
                  const orders = ordersByDate[dateKey] || []

                  return (
                    <td
                      key={idx}
                      onClick={() => {
                        if (item) setMyDate(item)
                      }}
                      className={`td ${
                        today.getFullYear() === currentDate.y &&
                        today.getMonth() + 1 === currentDate.m &&
                        today.getDate() === item
                          ? 'today'
                          : ''
                      } ${myDate === item ? 'chosen-date' : ''}`}
                      style={{ width: '153.11px' }}
                    >
                      {item}
                      <div
                        className={styles['order-container']}
                        onDrop={() => handleDrop(item,orders)}
                        onDragOver={(e) => handleDragOver(e, item)}
                      >
                        {orders.map((order) => {
                          return (
                            <div
                              key={order.purchase_id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, order)}
                              className={`${
                                order.status === '已預約'
                                  ? styles['course-reserved']
                                  : order.status === '未確認預約'
                                  ? styles['course-unreserved']
                                  : order.status === '已完成'
                                  ? styles['course-finished']
                                  : ''
                              }`}
                            >
                              {dayjs(order.course_datetime).format('HH:mm')}{' '}
                              {order.course_name}
                            </div>
                          )
                        })}
                      </div>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      {/* 當天課程清單 */}
      <div className={styles['currentDate-title']}>{`${currentDate.y}/${
        currentDate.m
      }/${myDate ? myDate : ''} 星期${
        myDate !== 0
          ? weekDayList[
              new Date(currentDate.y, currentDate.m - 1, myDate).getDay()
            ]
          : '日'
      } 課程清單`}</div>
      <div className={styles['currentDateList']}>
        <div className={styles['currentDateList-th']}>
          <div className={styles['currentDateList-td']}>時間</div>
          <div className={styles['currentDateList-td']}>課程名稱</div>
          <div className={styles['currentDateList-td']}>教練姓名</div>
          <div className={styles['currentDateList-td']}>聯絡電話</div>
          <div className={styles['currentDateList-td']}>上課地點</div>
          <div className={styles['currentDateList-td']}>課程狀態</div>
        </div>

        {myDate !== 0 &&
        ordersByDate[`${currentDate.y}-${currentDate.m}-${myDate}`] ? (
          ordersByDate[`${currentDate.y}-${currentDate.m}-${myDate}`].map(
            (order) => (
              <div
                key={order.purchase_id}
                className={styles['currentDateList-tr']}
              >
                <div className={styles['currentDateList-td']}>
                  {formatTime(order.course_datetime)}
                </div>
                <div className={styles['currentDateList-td']}>
                  {order.course_name}
                </div>
                <div className={styles['currentDateList-td']}>
                  {order.coach_name}
                </div>
                <div className={styles['currentDateList-td']}>
                  {order.mobile}
                </div>
                <div className={styles['currentDateList-td']}>
                  {order.gym_name}
                </div>
                <div className={styles['currentDateList-td']}>
                  <div
                    className={`${
                      styles[
                        order.status === '已預約'
                          ? 'course-reserved'
                          : order.status === '未確認預約'
                          ? 'course-unreserved'
                          : order.status === '已完成'
                          ? 'course-finished'
                          : ''
                      ]
                    }`}
                  >
                    {order.status}
                  </div>
                </div>
              </div>
            )
          )
        ) : (
          <p>當天無課程</p>
        )}
      </div>
      <style jsx>
        {`
          .today {
            background-color: var(--b3-color);
          }

          .chosen-date {
            background-color: var(--o2-color);
          }

          .td {
            border: 1px solid var(--g2-color);
            vertical-align: top;
            padding: 2px;
          }
        `}
      </style>
    </>
  )
}
