import { useState, useContext, useEffect } from 'react'
import styles from '@/styles/course/course-coach-management.module.css'
import Link from 'next/link'
import AuthContext from '@/context/auth-context'
import { COURSE_RECORD,COURSE_STATUS_CHANGE } from '@/configs'
import dayjs from 'dayjs'
import Swal from 'sweetalert2'

export default function CourseRecord() {
  const [recordData, setRecordData] = useState([])
  const { auth } = useContext(AuthContext)
  const memberId = auth.id
  const statusOptions = ['已預約', '未確認預約', '已完成']

  const getRecordData = async () => {
    try {
      const r = await fetch(`${COURSE_RECORD}?member_id=${memberId}`)
      const d = await r.json()
      setRecordData(d)
    } catch (ex) {
      console.log(ex)
    }
  }
  useEffect(() => {
    getRecordData()
  }, [auth.id])

// 更新課程狀態的函式
const handleStatusChange = async (newStatus, purchaseId, i) => {
  try {
    // 發送 PUT 請求到後端，更新課程狀態
    const response = await fetch(COURSE_STATUS_CHANGE, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus, purchase_id: purchaseId }),
    });

    if (response.ok) {
      // 如果請求成功，繼續處理前端的狀態更新
      const newRecordData = [...recordData];
      newRecordData[i].status = newStatus;
      setRecordData(newRecordData);
      Swal.fire({
        icon: 'success',
        title: '更改狀態成功',
      })
    } else {
      // 如果請求失敗，可以進一步處理錯誤，例如顯示錯誤訊息給用戶
      console.error('課程狀態更新失敗');
    }
  } catch (error) {
    console.error('發送 PUT 請求時發生錯誤：', error);
  }
};

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
  return (
    <>
      {/* <pre>{JSON.stringify(recordData, null, 4)}</pre> */}

      <div className="container">
        <div className={styles['breadcrumb-box']}>
          <div className="breadcrumb">首頁 / 課程專區 / 課程管理(教練)</div>
        </div>
        <div className={styles['management-interface']}>
          <div className={styles['management-select-group']}>
            <Link href={'/course/coach/timetable-coach'}>
              <div className={styles['management-selection']}>我的課表</div>
            </Link>
            <Link href={'/course/coach/course-coach'}>
              <div className={styles['management-selection']}>我的課程</div>
            </Link>
            <Link href={'/course/coach/course-record'}>
              <div
                className={`${styles['management-selection']} ${styles['management-selection-active']}`}
              >
                上課記錄
              </div>
            </Link>
          </div>
          <div className={styles['management-content']}>
            <div className={styles['recordList']}>
              <div className={styles['recordList-th']}>
                <div className={styles['recordList-td']}>課程時間</div>
                <div className={styles['recordList-td']}>課程名稱</div>
                <div className={styles['recordList-td']}>學生姓名</div>
                <div className={styles['recordList-td']}>評分</div>
                <div className={styles['recordList-td']}>評論</div>
                <div className={styles['recordList-td']}>課程狀態</div>
              </div>
              {recordData &&
                recordData.map((v, i) => {
                  return (
                    <div className={styles['recordList-tr']} key={v.purchase_id}>
                      <div className={styles['recordList-td']}>
                        {dayjs(v.course_datetime).format('YYYY-MM-DD HH:mm')}
                      </div>
                      <div className={styles['recordList-td']}>
                        {v.course_name}
                      </div>
                      <div className={styles['recordList-td']}>
                        {v.member_name}
                      </div>
                      <div className={styles['recordList-td']}>
                        {v.score ? v.score : '未評分'}
                      </div>
                      <div
                        className={`${styles['recordList-td']} ${styles['comment-td']}`}
                      >
                        {v.course_comment ? v.course_comment : '未評論'}
                      </div>
                      <div className={styles['recordList-td']}>
                        <select
                          value={v.status}
                          onChange={(e) =>
                            handleStatusChange(e.target.value, v.purchase_id, i)
                          }
                          className={getButtonClass(v.status)}
                        >
                          {statusOptions.map((option, j) => (
                            <option
                              key={j}
                              value={option}
                              
                            >
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
