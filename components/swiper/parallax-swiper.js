import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import styles from '@/styles/store/parallax-swiper.module.css'
import { Parallax, Pagination, Autoplay } from 'swiper/modules'
import Swal from 'sweetalert2'

export default function ParallaxSwiper({ slides }) {
  const [getCoupon, setGetCoupon] = useState(false)

  const handleGetCoupon = () => {
    if (!getCoupon) {
      setGetCoupon(true)
      Swal.fire({
        toast: true,
        width: 280,
        position: 'top',
        icon: 'success',
        title: '已獲得運費抵用卷*1',
        timer: 1500,
        showConfirmButton: false,
      })
    } else {
      Swal.fire({
        toast: true,
        width: 280,
        position: 'top',
        icon: 'warning',
        iconColor: '#ff804a',
        title: '您已領取過優惠卷！',
        timer: 1500,
        showConfirmButton: false,
      })
    }
  }
  return (
    <>
      <Swiper
        style={{
          '--swiper-pagination-color': '#fff',
        }}
        modules={[Parallax, Pagination, Autoplay]}
        speed={1000}
        parallax={true}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={true}
        className={styles['swiper']}
      >
        {slides.map((slide) => {
          return (
            <SwiperSlide key={slide.id}>
              <div
                slot="container-start"
                className={styles['parallax-bg']}
                style={{
                  backgroundImage: `url(${slide.image}`,
                }}
                data-swiper-parallax="-40%"
              ></div>
              <div className={styles['content-wrapper']}>
                <div className={styles['title']} data-swiper-parallax="-400">
                  {slide.title}
                </div>
                <div className={styles['text']} data-swiper-parallax="-150">
                  <p>{slide.subTitle}</p>
                  {slide.id === '1' ? (
                    <button
                      type="button"
                      className={styles['btn-get-coupon']}
                      onClick={handleGetCoupon}
                    >
                      立即領取優惠卷
                    </button>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </>
  )
}
