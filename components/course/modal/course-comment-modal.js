import React from 'react'
import Star from '@/components/common/star'
import styles from '@/styles/course/course-modal-comment.module.css'
import { useState, useEffect } from 'react'
import { COURSE_COMMENT_EDIT } from '@/configs'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'

export default function CourseCommentModal({ setOpenModal, orderData,setOrderData }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [unchangedMessage, setUnchangedMessage] = useState(false)
  const [commentChanged, setCommentChanged] = useState(null)
  const router = useRouter()

  const ratingChange = (newRating) => {
    setRating(newRating)
    // 評分變動時隱藏提示訊息
    setUnchangedMessage(false)
    setCommentChanged(true)
  }

  const commentChange = (e) => {
    setComment(e.target.value)
    // 評論變動時隱藏提示訊息
    setUnchangedMessage(false)
    setCommentChanged(true)
  }

  // 送出評論
  const commentSubmit = () => {
    // 先檢查是否有變動
    if(!rating&&!comment){
      Swal.fire({
        icon: 'warning',
        title: '請填寫評分或評論',
      })
      return
    }

    fetch(COURSE_COMMENT_EDIT, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        purchase_id: orderData.purchase_id,
        score: rating,
        course_comment: comment,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        console.log('評論回應:', data)

        if (data.success) {
          // 更新 orderData 狀態
          setOrderData((prevOrderData) => {
            const updatedOrderData = [...prevOrderData]
            const index = updatedOrderData.findIndex(
              (item) => item.purchase_id === orderData.purchase_id
            )
            if (index !== -1) {
              updatedOrderData[index].score = rating
              updatedOrderData[index].course_comment = comment
            }
            return updatedOrderData
          })

          Swal.fire({
            icon: 'success',
            title: '評論已成功提交',
            confirmButtonText: '確認',
          }).then(() => {
            setOpenModal(false)
            // router.reload() // 重整頁面
          })
        } else {
          Swal.fire({
            icon: 'warning',
            title: '評論或評分沒有更改',
          })
        }
      })
      .catch((error) => {
        console.error('評論失敗:', error)
        Swal.fire({
          icon: 'error',
          title: '評論提交失敗',
        })
      })
  }

  useEffect(() => {
    // 如果 orderData 有值，表示有既有的評論，則設定評分到 rating 狀態中
    if (orderData && orderData.score) {
      setRating(orderData.score)
    }
    // 確保在 orderData 改變時設定 comment 的值
    if (orderData && orderData.course_comment) {
      setComment(orderData.course_comment)
    }
  }, [orderData]) // 當 orderData 改變時重新運行

  // // 未改變評論時顯示提示文字
  // useEffect(() => {
  //   if (!commentChanged) {
  //     setUnchangedMessage(true)
  //   }
  // }, [commentChanged])

  return (
    <>
      <div className={styles['modalBackground']}>
        <div className={styles['modalContainer']}>
          <div className={styles['title']}>
            <h1>課程評價</h1>
          </div>
          <div className={styles['modal-body']}>
            <p className={styles['order-id']}>訂單編號:{orderData.order_id}</p>

            <p className={styles['cart-item-name']}>{orderData.course_name}</p>
            <div className={styles['comment-detail']}>
              <p>評分</p>
              <div className={styles['score']}>
                <Star onRatingChange={ratingChange} initrating={rating} />{' '}
                <span>已評分: {rating} 分</span>
              </div>
              <p>評論</p>
              <div className={styles['comment-textarea']}>
                <textarea
                  name=""
                  id=""
                  cols="40"
                  rows="5"
                  onChange={commentChange}
                  value={comment}
                >
                  {orderData.course_comment}
                </textarea>
              </div>
            </div>
            {unchangedMessage && (
              <div className={styles['unchanged-message']}>
                評論未更改，請修改評論後再提交。
              </div>
            )}
          </div>
          <div className={styles['footer']}>
            <button
              onClick={() => {
                setOpenModal(false)
              }}
              className={styles['btn-cancel']}
            >
              取消評價
            </button>

            <button className={styles['btn-continue']} onClick={commentSubmit}>
              完成評價
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
