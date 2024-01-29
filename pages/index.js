import styles from '@/styles/home.module.css'
import HomeCounter from '@/components/member/home-counter'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import ProductSwiper from '@/components/swiper/product-swiper'
import { PRODUCT_POPULAR } from '@/configs'
import HomepageCourse from '@/components/course/homepage-course'
import BlogCardForIndex from '@/components/blog/cards/blogcardforindex'
import Link from 'next/link'
import Image from 'next/image'
import homeImage from '@/public/member/home-img.jpg'

export default function Home() {
  const dynamicTextArr = [
    '重量訓練',
    '營養管理',
    '雕塑身材',
    '維持體態',
    '飲食控制',
    '健美健體',
    '復健運動',
    '肌肉塑造',
  ]

  const [dynamicText, setDynamicText] = useState(dynamicTextArr[0])
  const [currentIndex, setCurrentIndex] = useState(1)

  useEffect(() => {
    const switchTextInterval = setInterval(() => {
      // setSlideUp((slideUp) => !slideUp)
      setDynamicText(dynamicTextArr[currentIndex])
      setCurrentIndex((prev) => (prev + 1) % dynamicTextArr.length)
      // NOTE: Cycle through the array
    }, 3000)
    // TODO: Check if desync issue still persists (text vs animation)

    return () => {
      clearInterval(switchTextInterval)
    }
  }, [dynamicText, currentIndex])

  const router = useRouter()

  function redirectJoin() {
    router.push('/member/login')
  }

  function redirectStore() {
    router.push('/store/product')
  }

  // 熱門商品
  const [products, setProducts] = useState([])

  const getPopularProduct = async () => {
    try {
      const r = await fetch(PRODUCT_POPULAR)
      const d = await r.json()
      setProducts(d)
    } catch (ex) {
      console.log(ex)
    }
  }

  useEffect(() => {
    getPopularProduct()
  }, [])

  return (
    <>
      <section className={styles['hero']}>
        <div className={`${styles['container']} ${styles['hero__container']}`}>
          <h1 className={styles['hero__name']}>FreeFYT</h1>
          <div className={styles['hero__title']}>
            <div className={styles['hero__title-dynamic']}>
              <p className={`${styles['hero__title-dynamic-text']}`}>
                {dynamicText}
              </p>
            </div>
            <p>的最佳夥伴</p>
          </div>
          <div className={styles['hero__count']}>
            <div className={styles['hero__count-box']}>
              {/* <h6 className={styles['hero__count-num']}></h6> */}
              <HomeCounter startNum={0} endNum={1158} duration={1000} />
              <h6 className={styles['hero__count-item']}>會員註冊</h6>
            </div>
            <div className={styles['hero__count-box']}>
              {/* <h6 className={styles['hero__count-num']}></h6> */}
              <HomeCounter startNum={0} endNum={637} duration={2000} />
              <h6 className={styles['hero__count-item']}>教練媒合</h6>
            </div>
            <div className={styles['hero__count-box']}>
              {/* <h6 className={styles['hero__count-num']}></h6> */}
              <HomeCounter startNum={0} endNum={1813} duration={3000} />
              <h6 className={styles['hero__count-item']}>商品售出</h6>
            </div>
            <div className={styles['hero__count-box']}>
              {/* <h6 className={styles['hero__count-num']}></h6> */}
              <HomeCounter startNum={0} endNum={1102} duration={4000} />
              <h6 className={styles['hero__count-item']}>文章發布</h6>
            </div>
          </div>
        </div>
      </section>

      <section className={styles['join']}>
        <div className={`${styles['container']} ${styles['join__container']}`}>
          <div className={styles['join__info-box']}>
            <h5 className={styles['join__subtitle']}>JOIN US</h5>
            <h3 className={styles['section__title']}>
              <span>立即加入 FreeFYT</span>
            </h3>
            <h5 className={styles['join__description']}>
              加入FreeFYT健身網，開啟您健康生活的新篇章！我們為您打造了一個全面而獨特的健身平台，不僅提供豐富的健身資源，更提供教練媒合、商城、論壇以及各種追蹤工具，助您輕鬆實現個人健身目標。無論您的目標是增肌、減脂或提升整體體能，FreeFYT都能滿足您的需求。立即註冊，迎接健身挑戰，成就更好的自己！
            </h5>
            <button className={styles['join__button']} onClick={redirectJoin}>
              加入會員
            </button>
          </div>
          <div className={styles['join__outer-shape']}>
            <div className={styles['join__inner-shape']}></div>
            <Image
              src={homeImage}
              className={styles['join__image']}
              width={576}
              height={558}
            />
          </div>
        </div>
      </section>

      {/* <section className={styles['track']}>
        <div className={`${styles['container']} ${styles['track__container']}`}>
          <h3
            className={`${styles['section__title']} ${styles['track__title']}`}
          >
            健身<span>追蹤系統</span>
          </h3>
          <button className={styles['track__button']}>馬上體驗</button>
          <div className={styles['track__info-box']}></div>
        </div>
      </section> */}

      <section className={styles['course']}>
        <div
          className={`${styles['container']} ${styles['course__container']}`}
        >
          <h3
            className={`${styles['section__title']} ${styles['course__title']}`}
          >
            <span>人氣課程</span>推薦
          </h3>
          <button className={styles['course__button']}>尋找課程</button>
          <div className={styles['course__info-box']}>
            {/* <div className={styles['course__card']}></div>
            <div className={styles['course__card']}></div>
            <div className={styles['course__card']}></div>
            <div className={styles['course__card']}></div> */}
            <HomepageCourse />
          </div>
        </div>
      </section>

      <section className={styles['product']}>
        <div
          className={`${styles['container']} ${styles['product__container']}`}
        >
          <h3
            className={`${styles['section__title']} ${styles['product__title']}`}
          >
            熱門<span>健身商品</span>
          </h3>
          <button className={styles['product__button']} onClick={redirectStore}>
            更多商品
          </button>
          <div className={styles['product__info-box']}>
            <ProductSwiper rows={products.rows} />
            {/* <div className={styles['product__card']}></div>
            <div className={styles['product__card']}></div>
            <div className={styles['product__card']}></div>
            <div className={styles['product__card']}></div> */}
          </div>
        </div>
      </section>

      <section className={styles['forum']}>
        <div className={`${styles['container']} ${styles['forum__container']}`}>
          <h3
            className={`${styles['section__title']} ${styles['forum__title']}`}
          >
            論壇<span>精選好文</span>
          </h3>
        

            <button className={styles['forum__button']}>探索文章</button>
     

          <div className={styles['forum__info-box']}>
            <BlogCardForIndex></BlogCardForIndex>
          </div>
        </div>
      </section>
    </>
  )
}
