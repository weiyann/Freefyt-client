import { useState, useEffect } from 'react'
import styles from '@/styles/store/modal/modal-product-comment.module.css'
import Star from '@/components/store/star'
import { PRODUCT_COMMENT_ADD, PRODUCT_IMG } from '@/configs'
import Swal from 'sweetalert2'

export default function ModalProductComment({
  setOpenModal,
  poProduct,
  getdetailPO,
}) {
  // console.log(poProduct)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isComposing, setIsComposing] = useState(false)

  const maxLength = 100

  // 評分改變
  const handleRatingChange = (newRating) => {
    setRating(newRating)
  }

  // 評論內容改變
  const handleCommentChange = (e) => {
    // console.log('isComposing:', e.nativeEvent.isComposing)
    if (!e.nativeEvent.isComposing) {
      const newComment = e.target.value

      if (newComment !== '') {
        setComment(newComment)
      } else {
        setComment('')
      }
    }
  }

  // 新增商品評論
  const addProductComment = async () => {
    if (rating === 0 || comment.trim() === '') {
      Swal.fire({
        icon: 'warning',
        iconColor: '#ff804a',
        title: '請評分並填寫商品評價',
        confirmButtonText: 'OK',
        confirmButtonColor: '#4674a9',
      })
      return
    }
    const newPoProduct = {
      ...poProduct,
      score: rating,
      comment: comment,
    }
    // console.log(newPoProduct)

    try {
      const r = await fetch(PRODUCT_COMMENT_ADD, {
        method: 'POST',
        body: JSON.stringify(newPoProduct),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const d = await r.json()
      console.log(d)
      if (d.success) {
        setOpenModal(false)
        getdetailPO(poProduct.purchase_order_id)
        Swal.fire({
          icon: 'success',
          title: '已成功評論',
          confirmButtonText: 'OK',
          confirmButtonColor: '#4674a9',
        })
      } else {
        setOpenModal(false)
        Swal.fire({
          icon: 'warning',
          title: '評論失敗',
          confirmButtonText: 'OK',
          confirmButtonColor: '#4674a9',
        })
      }
    } catch (ex) {
      console.log(ex)
    }
  }

  return (
    <div className={styles['modalBackground']}>
      <div className={styles['modalContainer']}>
        <div className={styles['title']}>
          <h1>商品評價</h1>
        </div>
        <div className={styles['modal-body']}>
          <p className={styles['order-id']}>
            訂單編號: {poProduct.purchase_order_id.slice(0, 14)}
          </p>
          <div className={styles['comment-box']}>
            <div className={styles['cart-item-img']}>
              {poProduct.imgs && poProduct.imgs.split(',')[0] && (
                <img src={`${PRODUCT_IMG}/${poProduct.imgs.split(',')[0]}`} />
              )}
            </div>
            <p className={styles['cart-item-name']}>{poProduct.name}</p>
            <div className={styles['comment-detail']}>
              <p>評分</p>
              <div className={styles['score']}>
                <Star onRatingChange={handleRatingChange} initrating={rating} />{' '}
                <span>已評分: {rating} 分</span>
              </div>
              <p>評論</p>
              <div className={styles['comment-textarea']}>
                <textarea
                  name="comment"
                  id="comment"
                  cols="40"
                  rows="5"
                  defaultValue={comment}
                  // onChange={handleCommentChange}
                  onKeyUp={handleCommentChange}
                  maxLength={maxLength}
                ></textarea>
                <p>
                  字數: {comment.length}/{maxLength}
                </p>
              </div>
            </div>
          </div>
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
          <button
            className={styles['btn-continue']}
            onClick={() => {
              addProductComment()
            }}
          >
            完成評價
          </button>
        </div>
      </div>
    </div>
  )
}
