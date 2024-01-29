import React from 'react'
import { useEffect, useState, useContext } from 'react'
import styles from '@/styles/fytrack/fytrack-mainpage.module.css'
import Link from 'next/link'
import AuthContext from '@/context/auth-context'
import { useRouter } from 'next/router'
import { MEMBER_PROFILE, MEMBER_PROFILE_PIC } from '@/configs/index'

export default function FytrackMainPage() {
  // 可以⽤ auth 得到會員編號(auth.id)和令牌(auth.token)。
  const { auth } = useContext(AuthContext)
  const router = useRouter()
  const [memberProfile, setMemberProfile] = useState({
    member_username: '',
    member_name: '',
    member_nickname: '',
    member_bio: '',
    member_pic: '',
  })

  useEffect(() => {
    // 從路由得到會員編號
    const memberID = +router.query.member_id
    if (router.query.member_id !== undefined) {
      if (!memberID || memberID !== auth.id) {
        // 如果從路由獲得的會員編號和 auth.id 沒有吻合就跳轉登⼊⾴⾯
        router.push('/member/login')
      } else {
        // 若吻合則⽤令牌獲得個⼈資料
        fetch(`${MEMBER_PROFILE}/${memberID}`, {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + auth.token,
          },
        })
          .then((r) => r.json())
          .then((data) => {
            if (!data.success) {
              router.push('/member/login')
            } else {
              setMemberProfile({ ...data.memberInfo })
            }
          })
          .catch((ex) => console.log(ex))
      }
    }
  }, [router, router.query.member_id, auth.id, auth.token])

  return (
    <div id={styles['container']}>
      {/* 從style物件存取屬性 */}
      <div className={styles['image-container']} id="sport">
        <Link href={`/fytrack/track-training`}>
          <img src="/fytrack_img/sport-img.jpg" alt="運動圖" />
          <div className={styles['text-overlay']}>
            <span className={styles['main-text']}>運動</span>
            <span className={styles['hover-text']}>
              用 FreeFyt 記錄重訓數據
            </span>
          </div>
        </Link>
      </div>

      <div className={styles['image-container']} id={styles['nutrition']}>
        <Link href={`/fytrack/track-nutrition/${auth.id}`}>
          <img
            src="/fytrack_img/nutrition-img.jpg"
            alt="營養圖"
            style={{ cursor: 'pointer' }}
          />
          <div className={styles['text-overlay']}>
            <span className={styles['main-text']}>營養</span>
            <span className={styles['hover-text']}>
              用 FreeFyt 記錄營養數據
            </span>
          </div>
        </Link>
        {/* <p>{auth.username}</p> */}
      </div>
    </div>
  )
}
