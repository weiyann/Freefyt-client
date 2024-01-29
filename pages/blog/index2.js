import { useState, useEffect, useContext } from 'react'
import styles from '@/styles/blog/blog.module.css'
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

//動畫
import { motion } from 'framer-motion'

//這邊去串後端 從後端撈到tags的十個資料

export default function BlogList() {
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
    } catch (ex) {
      console.log(ex)
    }
  }

  useEffect(() => {
    getListData()
  }, [router.query.page, router.query.keyword, router.query.tag])

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

  //新版首圖icon
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  //舊版首圖icon
  // const [isHelloHovered, setIsHelloHovered] = useState(false)
  // const [liHovered, setLiHovered] = useState(null)

  // const handleHelloMouseEnter = () => {
  //   setIsHelloHovered(true)
  // }

  // const handleHelloMouseLeave = () => {
  //   setIsHelloHovered(false)
  //   setLiHovered(null)
  // }

  // const handleLiMouseEnter = (index) => {
  //   setLiHovered(index)
  // }

  // const handleLiMouseLeave = () => {
  //   setLiHovered(null)
  // }

  //使用動畫 做出create your time
  const [isCreateAnimated, setIsCreateAnimated] = useState(false);
  const [isYourAnimated, setIsYourAnimated] = useState(false);

  useEffect(() => {
    const createTimeout = setTimeout(() => {
      setIsCreateAnimated(true);
    }, 10000); // CREATE 動畫延遲 10 秒

    return () => clearTimeout(createTimeout);
  }, []);

  useEffect(() => {
    if (isCreateAnimated) {
      const yourTimeout = setTimeout(() => {
        setIsYourAnimated(true);
      }, 1000); // YOUR 動畫延遲 1 秒

      return () => clearTimeout(yourTimeout);
    }
  }, [isCreateAnimated]);

  return (
    <>
      {/* 首頁圖 */}

      {/* 首頁圖 */}
      <div className={styles['blog-first']}>
        <div className={styles['blog-headimg']}>
          <img
            src="/image/blog-02.png"
            // alt="{v.name} "
          />
          {/* <Image src="/image/blog-01.png" width={'300'} height={'800'} style={{width:'100%',height:'80vh'}} alt="" /> */}
        </div>
        {isCreateAnimated && (
          <motion.div
            className={styles["blog-word0"]}
            initial={{
              opacity: 0,
              x: 90,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
              transition: {
                duration: 1,
              },
            }}
            viewport={{ once: true }}
          >
            <p>CREATE</p>
          </motion.div>
        )}
        {isYourAnimated && (
          <motion.div
            className={styles["blog-word1"]}
            initial={{
              opacity: 0,
              x: 90,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
              transition: {
                duration: 1,
              },
            }}
            viewport={{ once: true }}
          >
            <p>YOUR</p>
          </motion.div>
        )}
       
        <div
          className={styles.box}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className={`${styles.hellos} ${
              isHovered ? styles.helloHovered : ''
            }`}
          >
            <img src="/image/blog-indexbtn.png" />
          </div>
          {isHovered && (
            <ul className={styles.options}>
              <li className={styles.option}>查看文章</li>
              <li className={styles.option}>我的首頁</li>
              <li className={styles.option}>建立文章</li>
            </ul>
          )}
        </div>
        {/* 舊版 */}
        {/* <div
          className={`${styles.hello} ${
            isHelloHovered ? styles.helloHovered : ''
          }`}
          onMouseEnter={handleHelloMouseEnter}
          onMouseLeave={handleHelloMouseLeave}
        >
          <div className={styles['blog-hello']}>
            {' '}
            <img src="/image/blog-indexbtn.png" />
          </div>

          {isHelloHovered && (
            <ul className={styles.menu}>
              <li
                className={`${styles.menuItem} ${
                  liHovered === 0 ? styles.itemHovered : ''
                }`}
                onMouseEnter={() => handleLiMouseEnter(0)}
                onMouseLeave={handleLiMouseLeave}
              >
                查看文章
              </li>
              <li
                className={`${styles.menuItem} ${
                  liHovered === 1 ? styles.itemHovered : ''
                }`}
                onMouseEnter={() => handleLiMouseEnter(1)}
                onMouseLeave={handleLiMouseLeave}
              >
                我的首頁
              </li>
              <li
                className={`${styles.menuItem} ${
                  liHovered === 2 ? styles.itemHovered : ''
                }`}
                onMouseEnter={() => handleLiMouseEnter(2)}
                onMouseLeave={handleLiMouseLeave}
              >
                創建文章
              </li>
            </ul>
          )}
        </div> */}
      </div>

      {/* 搜尋匡 */}
      <div className="container">
        <section>
          <div className={styles['bg-class']}>
            <ul className={styles['bg-class-ul']}>
              <li>
                <a href="#">熱門文章</a>
              </li>
              <li>
                <a href="#">最新文章</a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    router.push(
                      {
                        pathname: '/blog',
                        query: { ...router.query, tag },
                      },
                      undefined,
                      { scroll: false }
                    )
                  }}
                >
                  所有文章
                </a>
              </li>
            </ul>
          </div>
          <div className={styles['bg-searchbox']}>
            <div className={styles['bg-search']}>
              <span className={styles['bg-icon']}>
                <i
                  className={styles['fa fa-search']}
                  style={{ color: '#000' }}
                />
              </span>
              <form
                role="search"
                onSubmit={(e) => {
                  e.preventDefault()
                  router.push({
                    pathname: '/blog-list',
                    query: {
                      ...router.query,
                      keyword: e.currentTarget.keyword.value,
                    },
                  })
                }}
              >
                <div className={styles['search-product']}>
                  <div className="input-group">
                    <input
                      type="search"
                      className={styles['bg-search']}
                      id="bg-search"
                      placeholder="請輸入搜尋關鍵字"
                      name="keyword"
                      onChange={(e) => {
                        // setKeyword(e.currentTarget.value)

                        router.push(
                          {
                            pathname: '/blog',
                            query: { ...router.query, keyword: e.target.value },
                          },
                          undefined,
                          { scroll: false }
                        )
                      }}
                    />
                  </div>
                  {/* <button className={styles['btn-search-product']}>搜尋</button> */}
                </div>
              </form>
            </div>
            <div className={styles['bg-tag']}>
              <ul className={styles['bg-tagul']}>
                <li>
                  {/* <button
                    className={styles['bg-taga']}
                    onClick={(e) => {
                      router.push(
                        {
                          pathname: '/blog',
                          query: { ...router.query, tag: undefined },
                        },
                        undefined,
                        { scroll: false }
                      )
                    }}
                  >
                    所有文章
                  </button> */}
                </li>
                <Swiper
                  modules={[Pagination, A11y, Autoplay, Navigation]}
                  spaceBetween={5}
                  slidesPerView={5}
                  navigation
                  autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                  }}
                  pagination={{ clickable: true }}
                  // onSlideChange={() => console.log('slide change')}
                  // onSwiper={(swiper) => console.log(swiper)}
                  style={{ color: 'red' }}
                >
                  {tags.map((tag) => {
                    return (
                      <SwiperSlide key={tag}>
                        <button
                          className={styles['bg-taga']}
                          onClick={(e) => {
                            router.push(
                              {
                                pathname: '/blog',
                                query: { ...router.query, tag },
                              },
                              undefined,
                              { scroll: false }
                            )
                          }}
                        >
                          {tag}
                        </button>
                      </SwiperSlide>
                    )
                  })}{' '}
                </Swiper>
                {/* <li>
                  <button
                    className={styles['bg-taga']}
                    onClick={(e) => {
               

                      router.push(
                        {
                          pathname: '/blog',
                          query: { ...router.query, tag: '飲食美學' },
                        },
                        undefined,
                        { scroll: false }
                      )
                    }}
                  >
                    飲食美學
                  </button>
                </li>

                <li>
                  <button
                    className={styles['bg-taga']}
                    onClick={(e) => {
                     

                      router.push(
                        {
                          pathname: '/blog',
                          query: { ...router.query, tag: '飲食美學' },
                        },
                        undefined,
                        { scroll: false }
                      )
                    }}
                  >
                    飲食美學
                  </button>
                </li>
                <li>
                  <button className={styles['bg-taga']}
                  onClick={(e) => {
                    

                      router.push(
                        {
                          pathname: '/blog',
                          query: { ...router.query, tag: '拓點展示' },
                        },
                        undefined,
                        { scroll: false }
                      )
                    }}>拓點展示</button>
                </li>
                <li>
                  <button className={styles['bg-taga']}>健身攻略</button>
                </li>
                <li>
                  <button className={styles['bg-taga']}>健康之旅 </button>
                </li> */}
              </ul>
            </div>
          </div>
        </section>
        {/* 卡片區 */}
        <section>
          <div className={styles['blog-group']}>
            {data.rows &&
              data.rows.map((i) => {
                return (
                  <div className={styles['blog-item']} key={i.blogarticle_id}>
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
                        {dayjs(i.blogarticle_create).format('YYYY-MM-DD HH:mm')}
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
          {/* page 頁區*/}
          <div className={styles['col']}>
            <nav aria-label="Page navigation example">
              <ul className={styles['pagination']}>
                {data.success && data.totalPages
                  ? Array(11)
                      .fill(1)
                      .map((v, i) => {
                        const p = data.page - 6 + i
                        //先判斷 p的值有沒有在頁碼範圍
                        if (p < 1 || p > data.totalPages) return null
                        return (
                          <li
                            key={p}
                            className={
                              p === data.page
                                ? styles['page-item']
                                : styles['page-item']
                            }
                          >
                            <Link
                              className={styles['page-link']}
                              href={'?page=' + p}
                            >
                              {p}
                            </Link>
                          </li>
                        )

                        //p的值要在頁碼範圍

                        /* 方法一
                        if (p >= 1 && p <= data.totalPages) {
                          return (
                            <li key={i} className="page-item">
                              <Link className="page-link" href="?">
                                {i + 1}
                              </Link>
                            </li>
                          );
                        } else {
                          return null;
                        } 
                        */
                      })
                  : null}

                {/*}
          <% for(let i=page-5; i<=page+5; i++) if(i>=1 && i<=totalPages) { %>
          <li className="page-item <%= i===page ? 'active' : '' %>">
            <a
              className="page-link"
              href="?<%= new URLSearchParams({...qs, page: i}).toString() %>"
              ><%= i %></a
            >
          </li>
          <% } %>
*/}
              </ul>
            </nav>
          </div>
        </section>
      </div>
    </>
  )
}
