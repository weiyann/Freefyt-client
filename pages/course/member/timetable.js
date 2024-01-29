import styles from '@/styles/course/course-management.module.css'
import Calendar from '@/components/course/calendar'
import { useState, useEffect, useContext } from 'react'
import { MEMBER_ORDER, COURSE_MEMBER_DATA } from '@/configs'
import Link from 'next/link'
import AuthContext from '@/context/auth-context'
import { useRouter } from 'next/router'

export default function MemberTimetable() {
  const [orderData, setOrderData] = useState([])
  const { auth } = useContext(AuthContext)
  const router = useRouter()
  const memberId = auth.id
  const [memberName, setMemberName] = useState('')
  const [dropTargetDate, setDropTargetDate] = useState('')

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

  // 獲得訂單資料
  const getOrderData = async () => {
    try {
      const r = await fetch(`${MEMBER_ORDER}?member_id=${memberId}`)
      const d = await r.json()
      setOrderData(d)
    } catch (ex) {
      console.log(ex)
    }
  }
  useEffect(() => {
    getOrderData()
  }, [memberId, router.query,dropTargetDate])

  return (
    <>
      <div className="container">
        <div className={styles['breadcrumb-box']}>
          <div className="breadcrumb">首頁 / 課程專區 / 課程管理(一般會員)</div>
        </div>
        <div className={styles['management-interface']}>
          <div className={styles['management-select-group']}>
            <Link href={'/course/member/timetable'}>
              <div
                className={`${styles['management-selection']} ${styles['management-selection-active']}`}
              >
                我的課表
              </div>
            </Link>
            <Link href={'/course/member/course'}>
              <div className={styles['management-selection']}>我的課程</div>
            </Link>
            <Link href={'/course/member/fav'}>
              <div className={styles['management-selection']}>我的收藏</div>
            </Link>
          </div>
          <div className={styles['management-content']}>
            <Calendar
              orderData={orderData}
              memberName={memberName}
              dropTargetDate={dropTargetDate}
              setDropTargetDate={setDropTargetDate}
            />
          </div>
        </div>
      </div>
    </>
  )
}
