import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, A11y, Thumbs } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/bundle'
import 'swiper/css/pagination'
import styles from '@/styles/store/product-detail-swiper.module.css'

export default function ProductDetailSwiper({ productImages }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null)

  return (
    <>
      <Swiper
        modules={[FreeMode, A11y, Thumbs]}
        spaceBetween={10}
        slidesPerView={1}
        thumbs={{ swiper: thumbsSwiper }}
      >
        {productImages.map((v, i) => (
          <SwiperSlide key={i}>
            <img src={v.imageUrl} className={styles['swiper']} />
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        // loop={true}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, A11y, Thumbs]}
        // className={styles['myThumbs']}
      >
        {productImages.map((v, i) => (
          <SwiperSlide key={i}>
            <img src={v.imageUrl} className={styles['myThumbs']} />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}
