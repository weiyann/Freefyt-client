import React, { useState } from 'react'
import styles from '@/styles/blog/blogfunc.module.css'

const ArticleList = () => {
  const [data, setData] = useState([
    { blogarticle_id: 1, title: '文章 1', blogarticle_content: '這是第一篇文章的內容' },
    { blogarticle_id: 2, title: '文章 2', blogarticle_content: '這是第二篇文章的內容' },
    { blogarticle_id: 3, title: '文章 3', blogarticle_content: '這是第三篇文章的內容' },
  ])

  const [aaa, setAaa] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [editedContent, setEditedContent] = useState('')

  const handleDropdown = (articleId) => {
    if (aaa === articleId) {
      setAaa(null)
      setEditMode(false)
    } else {
      setAaa(articleId)
      setEditMode(false)
    }
  }

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

  return (
    <div>
      {data.map((i) => (
        <div
          key={i.blogarticle_id}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <div className={styles['blog-info']} style={{ marginRight: '10px' }}>
            <h3>{i.title}</h3>
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
              <p className={styles['blog-purchase-qty']}>{i.blogarticle_content}</p>
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
                  onClick={() => handleEdit(i.blogarticle_id, i.blogarticle_content)}
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
      ))}
    </div>
  )
}

export default ArticleList
