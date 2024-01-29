import { useState, useContext, useEffect } from 'react'
import { chunk } from 'lodash' // chunk([1, 2, 3, 4, 5], 2) -> [[1,2],[3,4],[5]]
import styles from '@/styles/course/course-management.module.css'
import { FaAngleLeft } from 'react-icons/fa6'
import { FaAngleRight } from 'react-icons/fa6'
import AuthContext from '@/context/auth-context'
import { COACH_ORDER } from '@/configs'
import dayjs from 'dayjs'
export default function CalendarCoach() {
  const [myDate, setMyDate] = useState(0)
  const [currentMonth, setCurrentMonth] = useState(new Date()) // 當前月份的狀態，可透過按鈕切換
  const [coachData, setCoachData] = useState([])
  const { auth } = useContext(AuthContext)
  const memberId = auth.id

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

  // 取得教練訂單資料
  const getCoachOrder = async () => {
    try {
      const r = await fetch(`${COACH_ORDER}?member_id=${memberId}`)
      const d = await r.json()
      setCoachData(d)
    } catch (ex) {
      console.log(ex)
    }
  }
  useEffect(() => {
    getCoachOrder()
  }, [auth.id])

  // 取得整點時間
  const formatTime = (datetime) => {
    return dayjs(datetime).format('HH:mm')
  }

  // 新增的物件，用來根據日期組織訂單
  const ordersByDate = {}

  // 遍歷所有訂單，將它們按日期分組
  coachData.forEach((order) => {
    const orderDate = new Date(order.course_datetime)
    const dateKey = `${orderDate.getFullYear()}-${
      orderDate.getMonth() + 1
    }-${orderDate.getDate()}`
    if (!ordersByDate[dateKey]) {
      ordersByDate[dateKey] = []
    }
    ordersByDate[dateKey].push(order)
  })

  return (
    <>
      {/* <pre>{JSON.stringify(coachData, null, 4)}</pre> */}
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
                      style={{ cursor: 'pointer', width: '153.11px' }}
                      // role="presentation"
                    >
                      {item}
                      <div className={styles['order-container']}>
                        {orders.map((order) => (
                          <div
                            key={order.purchase_id}
                            className={`${
                              order.status === '已預約'
                                ? styles['course-reserved'] // 已預約的樣式
                                : order.status === '未確認預約'
                                ? styles['course-unreserved'] // 未確認預約的樣式
                                : order.status === '已完成'
                                ? styles['course-finished'] // 已完成的樣式
                                : ''
                            }`}
                          >
                            {formatTime(order.course_datetime)}{' '}
                            {order.member_name}
                          </div>
                        ))}
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
          <div className={styles['currentDateList-td']}>學生姓名</div>
          <div className={styles['currentDateList-td']}>聯絡電話</div>
          {/* <div className={styles['currentDateList-td']}>上課地點</div> */}
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
                  {order.member_name}
                </div>
                <div className={styles['currentDateList-td']}>
                  {order.member_mobile}
                </div>
                {/* <div className={styles['currentDateList-td']}>
                  {order.gym_name}
                </div> */}
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
