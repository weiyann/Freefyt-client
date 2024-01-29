import { FaHeart } from 'react-icons/fa6'
import { FaRegHeart } from 'react-icons/fa6'
import { PRODUCT_ADD_FAV, PRODUCT_REMOVE_FAV } from '@/configs'
import { useContext } from 'react'
import AuthContext from '@/context/auth-context'
import Swal from 'sweetalert2'
import styles from '@/styles/store/product/product-style.module.css'

export default function ProductFavIcon({ product_sid }) {
  const { auth, productFav, setProductFav } = useContext(AuthContext)

  const isFavorite =
    Array.isArray(productFav) &&
    productFav.some((fav) => fav.product_sid === product_sid)

  const handleToggleFav = () => {
    // 更新前端的收藏狀態
    setProductFav((prevFav) => {
      if (prevFav.some((v) => v.product_sid === product_sid)) {
        // 如果已經在收藏中，則移除
        return prevFav.filter((v) => v.product_sid !== product_sid)
      } else {
        // 否則添加
        return [...prevFav, { product_sid }]
      }
    })
  }

  //  新增收藏到資料庫
  const handleAddFav = async () => {
    try {
      const r = await fetch(PRODUCT_ADD_FAV, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          member_id: auth.id,
          product_sid: product_sid,
        }),
      })
      const data = await r.json()
      console.log(data)
      if (data) {
        // 伺服器成功後，更新context中favorites的狀態，頁面上的圖示才會對應更動
        handleToggleFav()
        Swal.fire({
          toast: true,
          width: 300,
          position: 'top',
          icon: 'success',
          iconColor: '#ff804a',
          title: '已將商品加入收藏',
          showConfirmButton: false,
          timer: 1500,
        })
      }
    } catch (ex) {
      console.log(ex)
    }
  }
  // 移除資料庫收藏
  const handleRemoveFav = async () => {
    try {
      const r = await fetch(PRODUCT_REMOVE_FAV, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          member_id: auth.id,
          product_sid: product_sid,
        }),
      })
      const data = await r.json()
      console.log(data)
      if (data) {
        // 伺服器成功後，更新context中favorites的狀態，頁面上的圖示才會對應更動
        handleToggleFav()
        Swal.fire({
          toast: true,
          width: 300,
          position: 'top',
          icon: 'success',
          iconColor: '#ff804a',
          title: '已將商品取消收藏',
          showConfirmButton: false,
          timer: 1500,
        })
      }
    } catch (ex) {
      console.log(ex)
    }
  }

  return (
    <>
      {auth.id > 0 && (
        <button
          className={styles['btn-fav']}
          onClick={(e) => (isFavorite ? handleRemoveFav(e) : handleAddFav(e))}
        >
          {isFavorite ? (
            <FaHeart size={35} color="red" style={{ cursor: 'pointer' }} />
          ) : (
            <FaRegHeart size={35} color="red" style={{ cursor: 'pointer' }} />
          )}
        </button>
      )}
    </>
  )
}
