import React from 'react'
import { FaHeart } from 'react-icons/fa6'
import { FaRegHeart } from 'react-icons/fa6'
import AuthContext from '@/context/auth-context'
import { BLOG_FAV_ADD, BLOG_FAV_REMOVE } from '@/configs'
import { useContext } from 'react'
import Swal from 'sweetalert2'

export default function BlogFavIcon({ blogarticle_id }) {
  const { auth, blogFav, setBlogFav } = useContext(AuthContext)


  const isFavorited =
    Array.isArray(blogFav) &&
    blogFav.some((fav) => fav.blogarticle_id === blogarticle_id)
  const handleToggleFav = () => {
    // 更新前端的收藏狀態
    setBlogFav((prevFav) => {
      if (prevFav.some((v) => v.blogarticle_id === blogarticle_id)) {
        // 如果已經在收藏中，則移除
        return prevFav.filter((v) => v.blogarticle_id !== blogarticle_id)
      } else {
        // 否則添加
        return [...prevFav, { blogarticle_id }]
      }
    })
  }

  //  新增收藏到資料庫
  const handleAddFav = async () => {
    try {
      const r = await fetch(BLOG_FAV_ADD, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          member_id: auth.id,
          blogarticle_id: blogarticle_id,
        }),
      })
      const data = await r.json()
      if (data.success) {
        // 伺服器成功後，更新context中favorites的狀態，頁面上的圖示才會對應更動
        handleToggleFav()
        Swal.fire({
          toast: true,
          width: 300,
          position: 'top',
          icon: 'success',
          iconColor: '#ff804a',
          title: '加入收藏成功',
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
      const r = await fetch(BLOG_FAV_REMOVE, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          member_id: auth.id,
          blogarticle_id: blogarticle_id,
        }),
      })
      const data = await r.json()
      if (data.success) {
        // 伺服器成功後，更新context中favorites的狀態，頁面上的圖示才會對應更動
        handleToggleFav()
        Swal.fire({
          toast: true,
          width: 300,
          position: 'top',
          icon: 'success',
          iconColor: '#ff804a',
          title: '已將文章取消收藏',
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
        <div
          onClick={(event) =>
            isFavorited ? handleRemoveFav(event) : handleAddFav(event)
          }
        >
          {isFavorited ? <FaHeart   size={30}
                          color="red"/> : <FaRegHeart  size={30}
                          color="red"/>}
        </div>
      )}
    </>
  )
}
