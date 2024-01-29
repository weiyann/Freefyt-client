import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styles from '@/styles/blog/blogpid.module.css'
import Link from 'next/link'
import { GiSelfLove } from 'react-icons/gi'
import { BLOG_ONE, BLOG_REPLY } from '@/configs'
import dayjs from 'dayjs'

const ArticleList = () => {
  const router = useRouter()

  const [data, setData] = useState([])
  const getData = async () => {
    // console.log('router.query:', router.query.pid) // 除錯用
    let blogarticle_id = +router.query.pid || 1
    if (blogarticle_id < 1) blogarticle_id = 1

    try {
      const r = await fetch(BLOG_REPLY + `/${blogarticle_id}`)
      const d = await r.json()
      console.log({ d })
      setData(d)
    } catch (ex) {
      console.log(ex)
    }
  }

  useEffect(() => {
    getData()
  }, [router.query.pid])

  const [aaa, setAaa] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [editedContent, setEditedContent] = useState('')
  const [lastEditedTime, setLastEditedTime] = useState(null)

  const handleDropdown = (articleId) => {
    if (aaa === articleId) {
      setAaa(null)
      setEditMode(false)
    } else {
      setAaa(articleId)
      setEditMode(false)
    }
  }

  const handleEdit = (articleId, blogcomment_content, lastEdited) => {
    setAaa(articleId)
    setEditMode(true)
    setEditedContent(blogcomment_content)
    setLastEditedTime(lastEdited)
  }

  const handleSave = (articleId) => {
    const currentDate = new Date().toLocaleString()
    const updatedArticles = data.map((article) =>
      article.blogarticle_id === articleId
        ? {
            ...article,
            blogcomment_content: editedContent,
            lastEdited: currentDate,
          }
        : article
    )
    setData(updatedArticles)
    setAaa(null)
    setEditMode(false)
    setLastEditedTime(currentDate)
  }

  const handleDelete = (articleId) => {
    const updatedArticles = data.filter(
      (article) => article.blogarticle_id !== articleId
    )
    setData(updatedArticles)
    setAaa(null)
    setEditMode(false)
    setLastEditedTime(null)
  }

  return (
    <>
      <div>
      {data.length &&
                data.map((i,index) => {
                  return (
          <div
            key={i.blogarticle_id}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '10px',
            }}
          >
            <div
              className={styles['blog-info']}
              style={{ marginRight: '10px' }}
            >
            
              {aaa === i.blogarticle_id && editMode ? (
                <div>
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                  />
                  <button onClick={() => handleSave(i.blogarticle_id)}>
                    儲存
                  </button>
                </div>
              ) : (
                <div>
                  {/* <div className={styles['blog-fav']}>
                    {i.lastEdited
                      ? `最後更新時間: ${i.lastEdited}`
                      : `發表時間: ${i.blogcomment_time}`}
                  </div> */}
                  <div className={styles['blog-purchase-qty']}>
                    {i.blogcomment_content}
                  </div>
                </div>
              )}
            </div>
            <div className={styles['blogsls']}>
              <button
                className={styles['blogslbtn']}
                onClick={() => handleDropdown(i.blogarticle_id)}
              >
                ...
              </button>
              {aaa === i.blogarticle_id && (
                <div className={styles['blogsl']}>
                  <button
                    className={styles['blogslbtnin']}
                    onClick={() =>
                      handleEdit(
                        i.blogarticle_id,
                        i.blogcomment_content,
                        // i.lastEdited
                      )
                    }
                  >
                    編輯
                  </button>
                  <button
                    className={styles['blogslbtnin']}
                    onClick={() => handleDelete(i.blogarticle_id)}
                  >
                    刪除
                  </button>
                </div>
              )}
            </div>
          </div>
          )
                })}
      </div>
    </>
  )
}

export default ArticleList
