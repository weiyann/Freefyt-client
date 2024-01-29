import { useState, useEffect, useContext, useRef } from 'react'
import styles from '@/styles/blog/blogforindexcard.module.css'
import { useRouter } from 'next/router'
// import ThemeContext from "@/contexts/ThemeContext";
import Link from 'next/link'
import { BLOG_LIST, BLOG_ONE, BLOG_CLASS } from '@/configs'
import dayjs from 'dayjs'
import { IoIosAddCircle } from 'react-icons/io'
import { FaRegHeart } from 'react-icons/fa'
import AuthContext from '@/context/auth-context'
//輪播牆
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, A11y, Autoplay, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/bundle'
import 'swiper/css/pagination'

//收藏
import BlogFavIcon from '@/components/blog/blog-fav-icon'

//這邊去串後端 從後端撈到tags的十個資料

export default function BlogCardForIndex() {
  //連動會員
  const { auth, blogFav } = useContext(AuthContext)
  const memberId = auth.id

  const [tags, setTags] = useState([])
  const getTagsData = async () => {
    try {
      const response = await fetch(BLOG_CLASS)
      const data = await response.json()
      setTags(data.map((item) => item.blogclass_content))
    } catch (ex) {
      console.log(ex)
    }
  }

  //loading
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getTagsData()
  }, []) // 在組件載入時執行

  const [data, setData] = useState({})
  // const [keyword, setKeyword] = useState('')

  const router = useRouter()
  // const { theme, setTheme } = useContext(ThemeContext)

  // const [search, setSearch] = useState({
  //   page: +router.query.page || 1,
  //   category: +router.query.category || '',
  //   keyword: router.query.keyword || '',
  //   sortBy: router.query.sortBy || '',
  // })

  const getListData = async () => {
    const usp = new URLSearchParams(router.query)

    //console.log('router.query:', router.query)
    let page = +router.query.page || 1

    // 關鍵字搜尋
    let keyword = router.query.keyword || ''

    // tag
    let tag = router.query.tag || ''

    // 排序
    let sortBy = router.query.sortBy || ''

    if (page < 1) page = 1
    try {
      //const r = await fetch(BLOG_LIST + `?${usp.toString()}`)
      const r = await fetch(
        `${BLOG_LIST}?${usp.toString()}`
        //?member_id=${memberId}
        // + `
      )
      //console.log(usp)
      const d = await r.json()
      console.log(d)
      setData(d)
      setTimeout(() => {
        setIsLoading(false)
      }, 2000)
    } catch (ex) {
      console.log(ex)
    }
  }

  useEffect(() => {
    getListData()
  }, [
    router.query.page,
    router.query.keyword,
    router.query.tag,
    router.query.sortBy,
  ])

  //part2-1
  const removeItemAndReload = async (blogarticle_id) => {
    console.log({ blogarticle_id })

    const r = await fetch(BLOG_ONE + '/' + blogarticle_id, {
      method: 'DELETE',
    })
    const result = await r.json()
    if (result.success) {
      // alert("完成刪除")
      //router.reload();
      getListData()
    }
  }
  return (
    <>
         <div className={styles['blog-group']}>
                {data.rows &&
                  data.rows.slice(0, 4).map((i) => {
                    return (
                      <div
                        className={styles['blog-item']}
                        key={i.blogarticle_id}
                      >
                        <div className={styles['blog-img']}>
                          <img
                            src={`http://localhost:3002/blog/img/${i.blogarticle_photo}`}
                            alt="{v.name} "
                          />
                        </div>
                        <div className={styles['blog-aflex']}>
                          <div className={styles['blog-stock']}>
                            {i.member_nickname}
                          </div>
                          <div className={styles['blog-stock']}>
                            {dayjs(i.blogarticle_create).format(
                              'YYYY-MM-DD HH:mm'
                            )}
                          </div>
                        </div>
                        <div className={styles['blog-name']}>
                          {i.blogarticle_title}
                        </div>
                        {/* <div className={styles['blog-price']}>收藏</div> */}
                        <div className={styles['blog-info']}>
                          <div className={styles['blog-purchase-qty']}>
                            {i.blogarticle_content}
                          </div>
                          <div className={styles['blog-fav']}>
                            <BlogFavIcon blogarticle_id={i.blogarticle_id} />
                          </div>
                        </div>

                        <div className={styles['cart-btn']}>
                          {/* <button
                        className={styles['add-to-cart-btn']}
                        // onClick={() => addItem(i)}
                        onClick={() => {}}
                      >
                        加入收藏
                      </button> */}
                          <Link href={`/blog/${i.blogarticle_id}`}>
                            <button className={styles['add-to-cart-btn1']}>
                              點選查看
                            </button>
                          </Link>
                        </div>
                      </div>
                    )
                  })}
              </div>
    </>
  )
}
