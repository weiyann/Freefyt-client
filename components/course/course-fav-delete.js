import React from 'react'
import { TiDelete } from 'react-icons/ti'
import AuthContext from '@/context/auth-context'
import { COURSE_FAV_REMOVE } from '@/configs'
import { useContext } from 'react'
import Swal from 'sweetalert2'


export default function CourseFavDelete({course_id}) {
  const { auth, courseFav, setCourseFav } = useContext(AuthContext)

  const handleToggleFav = () => {
    // 更新前端的收藏狀態
    setCourseFav((prevFav) => {
      if (prevFav.some((v) => v.course_id === course_id)) {
        // 如果已經在收藏中，則移除
        return prevFav.filter((v) => v.course_id !== course_id)
      } 
    })
  }

  // 移除資料庫收藏
  const handleRemoveFav = async () => {
    try {
      const r = await fetch(COURSE_FAV_REMOVE, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          member_id: auth.id,
          course_id: course_id,
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
          title: '已將課程取消收藏',
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
      <TiDelete size={40} onClick={handleRemoveFav}/>
    </>
  )
}
