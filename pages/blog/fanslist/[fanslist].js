import { useState, useEffect, useContext } from 'react'
import styles from '@/styles/blog/fanslist.module.css'
import { useRouter } from 'next/router'
import AuthContext from '@/context/auth-context'

import { BLOG_FANSLIST } from '@/configs'

// Xicon
import { HiCollection } from 'react-icons/hi'
import { IoCloseSharp } from 'react-icons/io5'

export default function FansList() {
  const { auth, followFav, setFollowFav } = useContext(AuthContext)
  const memberId = auth.id

  const [blog, setBlog] = useState({})
  const router = useRouter()

  const getBlog = async () => {
    let member_id = +router.query.fanslist || 1
    if (member_id < 1) member_id = 1

    try {
      const r = await fetch(BLOG_FANSLIST + `/${member_id}`)
      const d = await r.json()
      setBlog(d)
    } catch (ex) {
      console.log(ex)
    }
  }

  useEffect(() => {
    getBlog()
  }, [router.query.fanslist, followFav])

  return (
    <>
      <div className={styles['Lbox']}>
        <div className={styles['mbox']}>
          {/* 追蹤名單 */}
          <div className={styles['title']}>
            <div className={styles['title1']}>
              <HiCollection className={styles['icon1']} />
            </div>
            <div className={styles['title2']}> 追蹤名單</div>
            <div className={styles['title3']}>
              <IoCloseSharp className={styles['icon2']} />
            </div>
          </div>
          {/* 追蹤列表 */}
          {blog.member_id && blog.map((blog) => {
          <div className={styles['listbox']} key={blog.member_id}>
            <div className={styles['left']}>
              <div className={styles['bgm-selfpro-img']}>
                <img
                  alt=""
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe4hBSr2wK62ahqQYRmRvJY5uaLphANCr0RA&usqp=CAU"
                />
              </div>
              <div className={styles['name']}>
                <p>{blog.member_name}</p>
                <p>{blog.member_nickname}</p>
              </div>
             
            </div>
            <div className={styles['right']}>2</div>
          </div>
          })}
        </div>
      </div>
    </>
  )
}
