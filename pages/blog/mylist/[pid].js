import { useState, useEffect, useContext } from 'react'
import styles from '@/styles/blog/blogmy.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
// import ThemeContext from "@/contexts/ThemeContext";
import { BLOG_MYLIST, BLOG_MYONELIST, BLOG_ONE } from '@/configs'
import ReactReadMoreReadLess from 'react-read-more-read-less'
import MyPage from '@/components/blog/mypage/[pid]'
import MyPageCollect from '@/components/blog/mypagecollect/[pid]'

import dayjs from 'dayjs'
import { MdEditDocument } from 'react-icons/md'
import { MdEditSquare } from 'react-icons/md'
import { MdDeleteForever } from 'react-icons/md'

import AuthContext from '@/context/auth-context'
import MyPageCard from '@/components/blog/mypagecard/[pid]'
import FollowFavIcon from '@/components/blog/follow-fav-icon'

// 聊天室使用
import MySocket from '@/components/store/product/my-socket'

//抓login
//import useRequireAuth from '@/hooks/use-requireAuth'

export default function MyPageALL() {
  //抓login
  //const isLoggedIn = useRequireAuth()
  //連動會員
  const { auth, blogFav , followFav, setFollowFav } = useContext(AuthContext)
  const memberId = auth.id
  // 聊天室使用
  const memberName = auth.username || '路人甲'
  const [showChatRoom, setShowChatRoom] = useState(false)

  const toggleChatRoom = () => {
    setShowChatRoom((prev) => !prev)
    console.log(showChatRoom)
  }

  const router = useRouter()
  const [data, setData] = useState([])
  let member_id = +router.query.pid || 1

  const [selectedTab, setSelectedTab] = useState('mypage') // 預設選中 '我的文章'

  const handleTabClick = (tab) => {
    setSelectedTab(tab)
  }
  const closeModal = () => {
    setShowChatRoom(false)
  }

  const [blog, setBlog] = useState({})

  const getBlog = async () => {
    let member_id = +router.query.pid || 1
    if (member_id < 1) member_id = 1

    try {
      const r = await fetch(BLOG_MYONELIST + `/${member_id}`)
      const d = await r.json()
      setBlog(d)
    } catch (ex) {
      console.log(ex)
    }
  }

  useEffect(() => {
    getBlog()
  }, [router.query.pid, followFav])

  const [showFull, setShowFull] = useState(false)
  const initialDisplayedBio = blog.member_bio
    ? blog.member_bio.slice(0, 5) + '...'
    : ''
  const [displayedBio, setDisplayedBio] = useState(initialDisplayedBio)

  return (
    <>
      <div className={styles['bgm-cont']}>
        {/* 主頁 */}
        {blog.member_id && (
          <div className="container">
            <div className={styles['bgm-all']}>
              <div className={styles['bgm-head']}>
                <div className={styles['bgm-selfpro']} key={blog.member_id}>
                  <div className={styles['bgm-selfpro-a']}>
                    <div className={styles['bgm-selfpro-img']}>
                      <img
                        className={styles['bgm-selfpro-img-in']}
                        alt=""
                        src={`http://localhost:3002/member/profile-img/${blog.member_pic}`}
                      />
                    </div>
                    <div className={styles['bgm-selfpro-b']}>
                      <p>{blog.member_name}</p>
                      <h6>{blog.member_nickname}</h6>
                      <h5>{displayedBio}</h5>
                      <button
                        className={styles['bgm-selfpro-btm']}
                        onClick={() => {
                          setShowFull(!showFull)
                          setDisplayedBio(
                            showFull
                              ? blog.member_bio
                              : blog.member_bio.slice(0, 5) + '...'
                          )
                        }}
                      >
                        {showFull ? '...顯示全部' : '...顯示較少'}
                      </button>
                    </div>
                  </div>
                  <div className={styles['bgm-selfpro-d']}></div>
                </div>

                <div className={styles['bgm-follow']}>
                  <div className={styles['bgm-follow-a']}>
                    <div className={styles['bgm-follow-post']}>
                      <p>POST</p>
                      <h3>{blog.total_bloglist_members}</h3>
                    </div>
                    <div className={styles['bgm-follow-post']}>
                      <p>FANS</p>
                      <h3>{blog.followers_count}</h3>
                    </div>
                  </div>
                </div>
              </div>

              {memberId === +router.query.pid ? (
                <div className={styles['bgm-follow-fans']}>
                  <button className={styles['bgm-follow-btnfans']}>
                    編輯個人資料
                  </button>
                </div>
              ) : (
                <div className={styles['bgm-follow-b']}>
                  <FollowFavIcon follow_member={blog.member_id} />
                  <button className={styles['bgm-follow-btn']}
                  onClick={toggleChatRoom}
                  >Message</button>
                  <button className={styles['bgm-follow-btn']}>Email</button>
                </div>
              )}
            </div>
          </div>
        )}
        {/* 編輯 收藏 建立文章 */}
        <div className={styles['bgm-mid']}>
          <Link
            href="#"
            className={`${styles['bgm-mid-btn']} ${
              selectedTab === 'mypage' && styles['active']
            }`}
            onClick={() => handleTabClick('mypage')}
          >
            我的文章
          </Link>
          <Link
            href="#"
            className={`${styles['bgm-mid-btn']} ${
              selectedTab === 'collect' && styles['active']
            }`}
            onClick={() => handleTabClick('collect')}
          >
            收藏文章
          </Link>
          {memberId === +router.query.pid ? (
            <Link href="add" className={styles['bgm-mid-btn']}>
              建立文章
            </Link>
          ) : (
            ''
          )}
        </div>

        {/* 卡片區 */}
        <div className="container">
          {selectedTab === 'mypage' && <MyPageCard />}
          {selectedTab === 'collect' && <MyPageCollect />}
        </div>

        {/* 聊天室 */}
        <MySocket
          toggleChatRoom={toggleChatRoom}
          showChatRoom={showChatRoom}
          memberId={memberId}
          closeModal={closeModal}
          memberName={memberName}
        />
      </div>
    </>
  )
}
