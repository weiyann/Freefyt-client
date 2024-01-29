import { PRODUCT_REMOVE_FAV } from '@/configs'
import { useContext } from 'react'
import AuthContext from '@/context/auth-context'
import { TiDelete } from 'react-icons/ti'
import Swal from 'sweetalert2'

export default function ProductFavIconDelete({ product_sid }) {
  const { auth, setProductFav } = useContext(AuthContext)

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
      <TiDelete size={40} onClick={handleRemoveFav} />
    </>
  )
}
