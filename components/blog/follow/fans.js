import { useState, useEffect } from 'react'
import styles from '@/styles/blog/blogmy.module.css'
import { useRouter } from 'next/router'

import { BLOG_FANS } from '@/configs'

export default function FansTotal() {
  const [fans, setFans] = useState({})
  //const [blogImages, setFansImages] = useState([])
  const router = useRouter()

  const getBlog = async () => {
    // console.log('router.query:', router.query.pid) // 除錯用
    let member_id = +router.query.pid || 1
    if (member_id < 1) member_id = 1

    try {
      const r = await fetch(BLOG_FANS + `/${member_id}`)
      const d = await r.json()
      //console.log({ d })
      setFans(d)
    } catch (ex) {
      console.log(ex)
    }
  }

  useEffect(() => {
    getBlog()
  }, [router.query.pid])

  return (
    <>
      {fans.member_id && (
        <div className={styles['bg-fans1']}>
          {/* 頭版 */}

          <div className={styles['bg-fans2']} key={fans.member_id}>
            {fans.member_id}
          </div>
        </div>
      )}
    </>
  )
}
