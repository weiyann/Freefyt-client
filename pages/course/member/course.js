import React from 'react'
import styles from '@/styles/course/course-management.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { MEMBER_ORDER_COURSE, COURSE_IMG, COURSE_COACH_IMG } from '@/configs'
import { useState, useEffect, useContext } from 'react'
import dayjs from 'dayjs'
import CourseCommentModal from '@/components/course/modal/course-comment-modal'
import TimeChangeModal from '@/components/course/modal/time-change-modal'
import Swal from 'sweetalert2'
import AuthContext from '@/context/auth-context'

export default function Course() {
  const [orderData, setOrderData] = useState([])
  const [courseImages, setCourseImages] = useState([])
  const [coachImages, setCoachImages] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [filter, setFilter] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  const { auth } = useContext(AuthContext)
  const memberId = auth.id

  // modal的狀態
  const [modalOpen, setModalOpen] = useState({})
  const [changeTimeModalOpen, setChangeTimeModalOpen] = useState({})
  // 獲得訂單資料
  const getOrderData = async () => {
    try {
      const r = await fetch(`${MEMBER_ORDER_COURSE}?member_id=${memberId}`)
      const d = await r.json()
      setOrderData(d)
    } catch (ex) {
      console.log(ex)
    }
  }
  useEffect(() => {
    getOrderData()
  }, [memberId])

  //取得課程圖片
  const getCourseImage = async () => {
    try {
      const filenames = filteredData.map((v, i) => v.course_img)

      const imagePromises = filenames.map(async (fileName) => {
        const imageUrl = `${COURSE_IMG}/${fileName}`
        return { fileName, imageUrl }
      })

      const imageData = await Promise.all(imagePromises)
      setCourseImages(imageData)
    } catch (ex) {
      console.log(ex)
    }
  }
  // 如果有拿到資料就去設定圖片
  useEffect(() => {
    if (orderData) {
      getCourseImage()
    }
  }, [orderData,filteredData])

  // 取得課程教練圖片
  const getCoachImages = async () => {
    try {
      const filenames = filteredData.map((v, i) => v.coach_img)
      console.log(filenames)

      const imagePromises = filenames.map(async (filenameMember) => {
        const imageUrl = `${COURSE_COACH_IMG}/${filenameMember}`
        return { filenameMember, imageUrl }
      })

      const imageData = await Promise.all(imagePromises)
      setCoachImages(imageData)
    } catch (ex) {
      console.log(ex)
    }
  }
  useEffect(() => {
    if (orderData && orderData.length > 0) {
      getCoachImages()
    }
  }, [orderData,filteredData])

  // 取得課程狀態的函式，給予不同的class
  function getButtonClass(status) {
    switch (status) {
      case '已預約':
        return styles['btn-reserved'] // 如果是已預約，返回對應的 class
      case '未確認預約':
        return styles['btn-unreserved'] // 如果是未確認預約，返回對應的 class
      case '已完成':
        return styles['btn-finished'] // 如果是已完成，返回對應的 class
      default:
        return '' // 其他情況返回空字符串或其他預設值
    }
  }

  // 當 orderData 或 filter 改變時，更新篩選後的資料
  useEffect(() => {
    // 根據 filter 條件進行篩選
    const filtered = orderData.filter((item) => {
      switch (filter) {
        case '已預約':
          return item.status === '已預約'
        case '未確認預約':
          return item.status === '未確認預約'
        case '已完成':
          return item.status === '已完成'
        default:
          return true // 若 filter 為空，表示不進行篩選
      }
    })

    setFilteredData(filtered)
  }, [orderData, filter])

  useEffect(() => {
    // 根據 filter 和 startDate、endDate 進行篩選
    const filtered = orderData.filter((item) => {
      const startDateMatch = startDate
        ? dayjs(item.course_datetime).isAfter(startDate, 'day') ||
          dayjs(item.course_datetime).isSame(startDate, 'day')
        : true
      const endDateMatch = endDate
        ? dayjs(item.course_datetime).isBefore(endDate, 'day') ||
          dayjs(item.course_datetime).isSame(endDate, 'day')
        : true

      switch (filter) {
        case '已預約':
          return startDateMatch && endDateMatch && item.status === '已預約'
        case '未確認預約':
          return startDateMatch && endDateMatch && item.status === '未確認預約'
        case '已完成':
          return startDateMatch && endDateMatch && item.status === '已完成'
        default:
          return startDateMatch && endDateMatch // 若 filter 為空，表示只考慮日期，不進行狀態篩選
      }
    })

    setFilteredData(filtered)
  }, [orderData, filter, startDate, endDate])

  return (
    <>
      {/* <pre>{JSON.stringify(orderData, null, 4)}</pre> */}
      <div className="container">
        <div className={styles['breadcrumb-box']}>
          <div className="breadcrumb">首頁 / 課程專區 / 課程管理(一般會員)</div>
        </div>
        <div className={styles['management-interface']}>
          <div className={styles['management-select-group']}>
            <Link href={'/course/member/timetable'}>
              <div className={styles['management-selection']}>我的課表</div>
            </Link>
            <Link href={'/course/member/course'}>
              <div
                className={`${styles['management-selection']} ${styles['management-selection-active']}`}
              >
                我的課程
              </div>
            </Link>
            <Link href={'/course/member/fav'}>
              <div className={styles['management-selection']}>我的收藏</div>
            </Link>
          </div>
          <div className={styles['management-content']}>
            {/* 篩選 */}
            <div className={styles['sort-group']}>
              <div className={styles['sort-title']}>課程狀態篩選：</div>
              <button
                type="button"
                className={
                  filter === '已預約'
                    ? styles['reserved-active']
                    : styles['reserved']
                }
                onClick={() => filter== '已預約'? setFilter(''):setFilter('已預約')}
              >
                已預約
              </button>
              <button
                type="button"
                className={
                  filter === '未確認預約'
                    ? styles['unreserved-active']
                    : styles['unreserved']
                }
                onClick={() => filter== '未確認預約'? setFilter(''):setFilter('未確認預約')}
              >
                未確認預約
              </button>
              <button
                type="button"
                className={
                  filter === '已完成'
                    ? styles['finished-active']
                    : styles['finished']
                }
                onClick={() => filter== '已完成'? setFilter(''):setFilter('已完成')}
              >
                已完成
              </button>
              {/* 篩選日期區間 */}
              <div className={styles['date-filter']}>
              {/* <div className={styles['sort-title']}>依時間搜尋：</div> */}
                <label className={styles['sort-title']}>課程日期區間：
                <input
                  className={styles['date-input']}
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                ~ 
                
                {/* <label className={styles['sort-title']}>結束日期：  */}
                <input
                  className={styles['date-input']}
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                {/* </label> */}
                </label>
              </div>

            </div>
            {/* 我的課程卡片 */}
            <div className={styles['course-box']}>
              {filteredData &&
                filteredData.map((v, i) => {
                  // 課程圖片
                  const courseImage = courseImages[i]
                  const imageUrl = courseImage ? courseImage.imageUrl : ''

                  // 教練圖片
                  const coachImage = coachImages[i]
                  const imageUrlCoach = coachImage ? coachImage.imageUrl : ''
                  return (
                    <div className={styles['course-card']} key={i}>
                      <div className={styles['course-img']}>
                        <Image
                          src={imageUrl}
                          alt=""
                          width={'250'}
                          height={'200'}
                        />
                      </div>
                      <div className={styles['card-body']}>
                        <div className={styles['course-title']}>
                          <div className={styles['course-name']}>
                            {v.course_name}
                          </div>
                          <div className={styles['course-price']}>
                            NT$ {v.price.toLocaleString()}
                          </div>
                          <div className={styles['coach']}>
                            <div className={styles['coach-img']}>
                              <Image
                                src={imageUrlCoach}
                                alt=""
                                width={'80'}
                                height={'80'}
                              />
                            </div>
                            <div className={styles['coach-name']}>
                              {v.coach_name}
                            </div>
                          </div>
                        </div>
                        <div className={styles['course-info']}>
                          <div className={styles['course-time']}>
                            上課時間：
                            {dayjs(v.course_datetime).format(
                              'YYYY-MM-DD HH:mm'
                            )}
                          </div>
                          <div className={styles['purchase-time']}>
                            購買時間：
                            {dayjs(v.purchase_time).format('YYYY-MM-DD HH:mm')}
                          </div>
                          <div className={styles['course-status']}>
                            課程狀態：
                            <div className={getButtonClass(v.status)}>
                              {v.status}
                            </div>
                          </div>
                          <div>
                            {v.status !== '已完成' && (
                              <button
                                className={styles['course-link']}
                                onClick={() => {
                                  // 顯示 SweetAlert 警告
                                  Swal.fire({
                                    icon: 'warning',
                                    title: '無法評論',
                                    text: '只有已完成的課程才能進行評論。',
                                    confirmButtonText: '確認',
                                  })
                                }}
                              >
                                訂單編號 / 評分
                              </button>
                            )}
                            {v.status === '已完成' && (
                              <button
                                className={styles['course-link']}
                                onClick={() => {
                                  setModalOpen((prev) => ({
                                    ...prev,
                                    [i]: true,
                                  }))
                                }}
                              >
                                訂單編號 / 評分
                              </button>
                            )}
                            {modalOpen[i] && (
                              <CourseCommentModal
                                setOpenModal={() => {
                                  setModalOpen((prev) => ({
                                    ...prev,
                                    [i]: false,
                                  }))
                                }}
                                orderData={v}
                                setOrderData={setOrderData}
                              />
                            )}
                          </div>
                          <div>
                            <button
                              className={styles['course-link']}
                              onClick={() => {
                                // 檢查當前時間是否在 v.course_datetime 之後
                                const beforeCourseTime = dayjs().isAfter(
                                  dayjs(v.course_datetime)
                                )

                                if (beforeCourseTime) {
                                  // 顯示 SweetAlert 或其他提示
                                  Swal.fire({
                                    icon: 'warning',
                                    title: '無法更改時間',
                                    text: '課程時間已過，無法更改預約時間。',
                                    confirmButtonText: '確認',
                                  })
                                } else {
                                  // 打開 modal
                                  setChangeTimeModalOpen((prev) => ({
                                    ...prev,
                                    [i]: true,
                                  }))
                                }
                              }}
                            >
                              點選更改時間
                            </button>
                            {changeTimeModalOpen[i] && (
                              <TimeChangeModal
                                setChangeTimeModalOpen={() => {
                                  setChangeTimeModalOpen((prev) => ({
                                    ...prev,
                                    [i]: false,
                                  }))
                                }}
                                orderData={v}
                                setOrderData={setOrderData}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
            {/* 卡片 end */}
          </div>
        </div>
      </div>
    </>
  )
}
