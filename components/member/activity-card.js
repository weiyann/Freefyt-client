import React from 'react'
import styles from '@/styles/member/member.module.css'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FaDumbbell } from 'react-icons/fa'
import { FaCartShopping } from 'react-icons/fa6'
import { MdArticle } from 'react-icons/md'
import { GiWhistle } from 'react-icons/gi'

export default function ActivityCard({ activity }) {
  const logDate = new Date(activity.log_date)
  const purchaseDate = new Date(activity.created_at)
  const blogDate = new Date(activity.blogarticle_create)
  const courseDate = new Date(activity.course_datetime)
  const currentDate = new Date()
  const timeDifference = currentDate - logDate
  const timeDifference2 = currentDate - purchaseDate
  const timeDifference3 = currentDate - blogDate
  const timeDifference4 = currentDate - courseDate

  const daysAgo = Math.floor(timeDifference / (24 * 60 * 60 * 1000))
  const daysAgo2 = Math.floor(timeDifference2 / (24 * 60 * 60 * 1000))
  const daysAgo3 = Math.floor(timeDifference3 / (24 * 60 * 60 * 1000))
  const daysAgo4 = Math.floor(timeDifference4 / (24 * 60 * 60 * 1000))

  return activity.log_id ? (
    <div className={styles['activity__card']}>
      <div className={styles['activity__card-heading']}>
        <div className={styles['activity__wrapper']}>
          <div className={styles['activity__card-icon-container']}>
            <FaDumbbell className={styles['activity__card-icon']} />
          </div>
          <div className={styles['activity__card-title']}>
            最新 <span>重訓數據</span> 出爐！
          </div>
        </div>
        <div className={styles['activity__card-time']}>{daysAgo}天前</div>
      </div>
      <div className={styles['activity__card-contents']}>
        <p>
          <li>
            您選用了 <span>{activity.plan_name}</span> 的健身計畫，順利完成
            <span> {activity.variation_name} </span>
            運動組合！
          </li>
        </p>
        {activity.active ? (
          <li>
            您過去七天內運動了<span> 三次以上 </span>，請繼續保持！
          </li>
        ) : (
          ''
        )}
      </div>
      <div className={styles['activity__card-link']}>
        <Link href="/fytrack/track-training/history">詳細資料</Link>
      </div>
    </div>
  ) : activity.sid ? (
    <div className={styles['activity__card']}>
      <div className={styles['activity__card-heading']}>
        <div className={styles['activity__wrapper']}>
          <div className={styles['activity__card-icon-container']}>
            <FaCartShopping className={styles['activity__card-icon']} />
          </div>
          <div className={styles['activity__card-title']}>
            線上商城 <span>消費記錄</span>
          </div>
        </div>
        <div className={styles['activity__card-time']}>{daysAgo2}天前</div>
      </div>
      <div className={styles['activity__card-contents']}>
        <p>
          <li>
            您購買了<span> {activity.name} </span>，消費了
            <span> ${activity.product_price.toLocaleString()} </span>
          </li>
        </p>
      </div>
      <div className={styles['activity__card-link']}>
        <Link href="/store/product">再去購物</Link>
      </div>
    </div>
  ) : activity.blogarticle_title ? (
    <div className={styles['activity__card']}>
      <div className={styles['activity__card-heading']}>
        <div className={styles['activity__wrapper']}>
          <div className={styles['activity__card-icon-container']}>
            <MdArticle className={styles['activity__card-icon']} />
          </div>
          <div className={styles['activity__card-title']}>
            健身論壇 <span>發文紀錄</span>
          </div>
        </div>
        <div className={styles['activity__card-time']}>{daysAgo3}天前</div>
      </div>
      <div className={styles['activity__card-contents']}>
        <p>
          <li>
            您發了一篇有關<span> {activity.blogclass_content} </span>
            的文章，標題為
            <span> &laquo;{activity.blogarticle_title}&raquo; </span>
          </li>
        </p>
      </div>
      <div className={styles['activity__card-link']}>
        <Link href={`/blog/${activity.blogarticle_id}`}>前往閱讀</Link>
      </div>
    </div>
  ) : activity.status === '已完成' ? (
    <div className={styles['activity__card']}>
      <div className={styles['activity__card-heading']}>
        <div className={styles['activity__wrapper']}>
          <div className={styles['activity__card-icon-container']}>
            <GiWhistle className={styles['activity__card-icon']} />
          </div>
          <div className={styles['activity__card-title']}>
            教練媒合<span> 上課紀錄</span>
          </div>
        </div>
        <div className={styles['activity__card-time']}>{daysAgo4}天前</div>
      </div>
      <div className={styles['activity__card-contents']}>
        <p>
          <li>
            您完成了&nbsp;
            <span>
              {activity.member_nickname
                ? activity.member_nickname
                : activity.member_name}
            </span>
            &nbsp;教練的
            <span> {activity.name} </span>課程！
          </li>
        </p>
      </div>
      <div className={styles['activity__card-link']}>
        <Link href="/course">更多課程</Link>
      </div>
    </div>
  ) : (
    ''
  )
}
