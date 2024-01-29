import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, A11y, Autoplay } from 'swiper/modules'
import 'swiper/css'

import 'swiper/css/bundle'
import 'swiper/css/pagination'
import styles from '@/styles/store/base-swiper.module.css'

export default function BaseSwiper({ slides }) {
  return (
    <Swiper
      modules={[Pagination, A11y, Autoplay]}
      spaceBetween={50}
      slidesPerView={1}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{ clickable: true }}
      // onSlideChange={() => console.log('slide change')}
      // onSwiper={(swiper) => console.log(swiper)}
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <img
            src={slide.image}
            alt={slide.title}
            className={styles['swiper']}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
