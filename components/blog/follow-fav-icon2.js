import React, { useEffect } from 'react'
// import { FaHeart } from 'react-icons/fa6'
// import { FaRegHeart } from 'react-icons/fa6'
import Follow2 from './follow/follow2'
import Following2 from './follow/following2'
import AuthContext from '@/context/auth-context'
import { FOLLOW_FAV_ADD, FOLLOW_FAV_REMOVE } from '@/configs'
import { useContext } from 'react'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'

export default function FollowFavIcon2({ follow_member }) {
  const { auth, followFav, setFollowFav } = useContext(AuthContext)
  const router = useRouter()
  let member_id = +router.query.pid || 1
  if (member_id < 1) member_id = 1

  // console.log({ followFav })
  const isFavorited =
    Array.isArray(followFav) &&
    followFav.some((fav) => fav.follow_member === follow_member)
  const handleToggleFav = () => {
    // 更新前端的收藏狀態
    setFollowFav((prevFav) => {
      if (prevFav.some((v) => v.follow_member === follow_member)) {
        // 如果已經在收藏中，則移除
        return prevFav.filter((v) => v.follow_member !== follow_member)
      } else {
        // 否則添加
        return [...prevFav, { follow_member }]
      }
    })
  }

  useEffect(() => {
    console.log({
      id: auth.id,
      pid: router.query.pid,
    })
    // setIsFavorited(() => {})
  }, [router.query.pid, auth.id])
  //  新增收藏到資料庫
  const handleAddFav = async () => {
    try {
      const r = await fetch(FOLLOW_FAV_ADD, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          member_id: auth.id,
          follow_member: follow_member,
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
          title: 'Follow成功',
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
      const r = await fetch(FOLLOW_FAV_REMOVE, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          member_id: auth.id,
          follow_member: follow_member,
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
          title: '已取消Follow',
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
          {isFavorited ? (
            <Following2 size={30} color="red" />
          ) : (
            <Follow2 size={30} color="red" />
          )}
        </div>
      )}
    </>
  )
}
