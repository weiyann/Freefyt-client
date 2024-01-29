import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, A11y, Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/bundle'
import 'swiper/css/pagination'
import styles from '@/styles/store/product/product-style.module.css'
import { PRODUCT_IMG } from '@/configs'
import ProductCardSingle from '../store/product/product-card-single'

export default function ProductSwiper({ rows }) {
  const [productImages, setProductImages] = useState([])

  // 取得商品圖片
  const getProductsImages = async () => {
    try {
      const filenames = rows.map((v) => v.imgs?.split(',')[0])
      // console.log('Filenames:', filenames)

      const imagePromises = filenames.map(async (fileName) => {
        const imageUrl = `${PRODUCT_IMG}/${fileName}`
        return { fileName, imageUrl }
      })

      const imageData = await Promise.all(imagePromises)
      setProductImages(imageData)
    } catch (ex) {
      console.error(ex)
    }
  }

  // 如果有拿到資料就去設定圖片
  useEffect(() => {
    if (rows && rows.length > 0) {
      getProductsImages()
    }
  }, [rows])

  return (
    <Swiper
      modules={[FreeMode, A11y, Navigation, Autoplay]}
      navigation
      spaceBetween={200}
      slidesPerView={5}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
    >
      {rows &&
        rows.map((v) => {
          const productImage = productImages.find(
            (img) => img.fileName === v.imgs?.split(',')[0]
          )
          const imageUrl = productImage ? productImage.imageUrl : ''
          return (
            <SwiperSlide key={v.sid}>
              <ProductCardSingle product={v} imageUrl={imageUrl} />
            </SwiperSlide>
          )
        })}
    </Swiper>
  )
}
