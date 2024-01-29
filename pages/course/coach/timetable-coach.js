import React from 'react'
import styles from '@/styles/course/course-coach-management.module.css'
import Link from 'next/link'
import CalendarCoach from '@/components/course/calendar-coach'

export default function TimetableCoach() {
  return (
    <>
      <div className="container">
        <div className={styles['breadcrumb-box']}>
          <div className="breadcrumb">首頁 / 課程專區 / 課程管理(教練)</div>
        </div>
        <div className={styles['management-interface']}>
          <div className={styles['management-select-group']}>
            <Link href={'/course/coach/timetable-coach'}>
              <div className={`${styles['management-selection']} ${styles['management-selection-active']}`}>我的課表</div>
            </Link>
            <Link href={'/course/coach/course-coach'}>
              <div
                className={styles['management-selection']}
              >
                我的課程
              </div>
            </Link>
            <Link href={'/course/coach/course-record'}>
              <div className={styles['management-selection']}>上課記錄</div>
            </Link>
          </div>
          <div className={styles['management-content']}>
          <CalendarCoach
              
            />
          </div>
        </div>
      </div>
    </>
  )
}
