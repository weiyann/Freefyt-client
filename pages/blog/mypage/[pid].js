import { useState, useEffect, useContext } from 'react'
import styles from '@/styles/blog/blogmy.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
// import ThemeContext from "@/contexts/ThemeContext";
import { BLOG_MYLIST, BLOG_MYONELIST, BLOG_ONE } from '@/configs'
import ReactReadMoreReadLess from 'react-read-more-read-less'
import MyPage from '@/components/blog/mypage/[pid]'
import dayjs from 'dayjs'
import { MdEditDocument } from 'react-icons/md'
import { MdEditSquare } from 'react-icons/md'
import { MdDeleteForever } from 'react-icons/md'

import AuthContext from '@/context/auth-context'



//抓login
//import useRequireAuth from '@/hooks/use-requireAuth'

export default function MyPageALL() {
  //抓login
  //const isLoggedIn = useRequireAuth()
  //連動會員
  const { auth, blogFav } = useContext(AuthContext)
  const memberId = auth.id

  const router = useRouter()
  const [data, setData] = useState([])
  let member_id = +router.query.pid || 1

  const getData = async () => {
    // console.log('router.query:', router.query.pid) // 除錯用

    if (member_id < 1) member_id = 1

    try {
      const r = await fetch(BLOG_MYLIST + `/${member_id}`)

      const d = await r.json()
      console.log({ d })
      setData(d)
    } catch (ex) {
      console.log(ex)
    }
  }

  const [aaa, setAaa] = useState(null)
  const [editModeT, setEditModeT] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editedContent, setEditedContent] = useState('')
  const [editedTitle, setEditedTitle] = useState('')

  useEffect(() => {
    getData()
  }, [router.query.pid])

  const handleDropdown = (articleId) => {
    console.log(123)
    if (aaa === articleId) {
      setAaa(null)
      setEditMode(false)
      setEditModeT(false)
    } else {
      setAaa(articleId)
      setEditMode(false)
      setEditModeT(false)
    }
  }
  //標題
  const handleTEdit = (articleId, blogarticle_title) => {
    setAaa(articleId)
    setEditModeT(true)
    setEditedTitle(blogarticle_title)
  }

  const handleTSave = (articleId) => {
    const updatedArticlesT = data.map((article) =>
      article.blogarticle_id === articleId
        ? { ...article, blogarticle_title: editedTitle }
        : article
    )
    setData(updatedArticlesT)
    setAaa(null)
    setEditModeT(false)
  }

  //內容
  const handleEdit = (articleId, blogarticle_content) => {
    setAaa(articleId)
    setEditMode(true)
    setEditedContent(blogarticle_content)
  }

  const handleSave = (articleId) => {
    const updatedArticles = data.map((article) =>
      article.blogarticle_id === articleId
        ? { ...article, blogarticle_content: editedContent }
        : article
    )
    setData(updatedArticles)
    setAaa(null)
    setEditMode(false)
  }

  const handleDelete = (articleId) => {
    const updatedArticles = data.filter(
      (article) => article.blogarticle_id !== articleId
    )
    setData(updatedArticles)
    setAaa(null)
    setEditMode(false)
  }

  // if (loading&&isLoggedIn){
  //   return <div>loading</div>
  // }
  return (
    <>
      <MyPage></MyPage>
      {/* 編輯 收藏 建立文章 */}
      <div className={styles['bgm-mid']}>
        <Link href="#" className={styles['bgm-mid-btn']}>
          我的文章
        </Link>
        <Link href="#" className={styles['bgm-mid-btn']}>
          收藏文章
        </Link>
        <Link href="add" className={styles['bgm-mid-btn']}>
          建立文章
        </Link>
      </div>

      {/* 卡片區 */}

      <div className="container">
        {data.length &&
          data.map((i) => {
            return (
              <div className="container-a" key={i.blogarticle_id}>
                <div className={styles['blog-item']}>
                  <div className={styles['blog-item-b']}>
                    <div className={styles['blog-item-b1']}>
                      <div className={styles['blog-img']}>
                        <img
                          src="https://www.worldgymtaiwan.com/files/club/101/2022gym/cardio-zone3.jpg"
                          alt="{v.name} "
                        />
                      </div>
                      <div className={styles['blog-item-c']}>
                        <div className={styles['blog-stock']}>
                          {dayjs(i.blogarticle_time).format('YYYY-MM-DD HH:mm')}
                        </div>
                        {/* <div className={styles['blog-name']}>
                          {i.blogarticle_title}
                        </div> */}
                        {aaa === i.blogarticle_id && editModeT ? (
                          <div>
                            <textarea
                              className={styles['blog-editt']}
                              value={editedTitle}
                              onChange={(e) => setEditedTitle(e.target.value)}
                            />
                            <button
                              className={styles['blog-editbtn']}
                              onClick={() => handleTSave(i.blogarticle_id)}
                            >
                              儲存
                            </button>
                          </div>
                        ) : (
                          <p className={styles['blog-name']}>
                            {i.blogarticle_title}
                          </p>
                        )}
                        {/* <div className={styles['blog-price']}>收藏</div> */}
                        {aaa === i.blogarticle_id && editMode ? (
                          <div>
                            <textarea
                              className={styles['blog-editc']}
                              value={editedContent}
                              onChange={(e) => setEditedContent(e.target.value)}
                            />
                            <button
                              className={styles['blog-editbtn']}
                              onClick={() => handleSave(i.blogarticle_id)}
                            >
                              儲存
                            </button>
                          </div>
                        ) : (
                          <p className={styles['blog-purchase-qty']}>
                            {i.blogarticle_content}
                          </p>
                        )}
                        <Link
                          href={`/blog/${i.blogarticle_id}`}
                          className={styles['blog-more']}
                        >
                          ...查看更多
                        </Link>
                      </div>
                    </div>
                    {memberId === member_id ? (
                      <div className={styles['blogsls']}>
                        <button
                          className={styles['blogslbtn']}
                          onClick={() => handleDropdown(i.blogarticle_id)}
                        >
                          ...
                        </button>
                        {aaa === i.blogarticle_id && (
                          <div
                            className={styles['blogsl']}
                            style={{
                              position: 'absolute',
                              top: '30%',
                              right: '0',
                            }}
                          >
                            <Link href={`/blog/edit/${i.blogarticle_id}`}>
                              <button>編輯標題</button>
                            </Link>

                            <button
                              className={styles['blogslbtnin']}
                              onClick={() =>
                                handleEdit(
                                  i.blogarticle_id,
                                  i.blogarticle_content
                                )
                              }
                            >
                              <MdEditSquare />
                              編輯貼文
                            </button>
                            <button
                              className={styles['blogslbtnin']}
                              onClick={() => handleDelete(i.blogarticle_id)}
                            >
                              <MdDeleteForever />
                              刪除文章
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
            )
          })}
      </div>
    </>
  )
}
