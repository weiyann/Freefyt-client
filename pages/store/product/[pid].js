import { useState, useEffect, Fragment } from 'react'
import { useRouter } from 'next/router'
import styles from '@/styles/store/product/product-detail.module.css'
import { useCart } from '@/hooks/use-cart'
import {
  PRODUCT_ONE,
  PRODUCT_IMG,
  PRODUCT_RELATED,
  PRODUCT_ONE_COMMENT,
  PRODUCT_ONE_COMMENT_IMG,
} from '@/configs'
import ProductFavIcon from '@/components/store/product/product-fav-icon'
import ProductDetailSwiper from '@/components/swiper/product-detail-swiper'
import ProductSwiper from '@/components/swiper/product-swiper'
import {
  FacebookIcon,
  FacebookShareButton,
  LineIcon,
  LineShareButton,
} from 'react-share'
import dayjs from 'dayjs'

export default function ProductDetail() {
  //   拿到單一商品的物件
  //   {
  //     "success": true,
  //     "row": {
  //         "sid": 2,
  //         "product_id": "FYT-20231209-001",
  //         "name": "瑜珈墊 yoga mat - 咖",
  //         "main_category": 1,
  //         "sub_category": 7,
  //         "product_price": 1580,
  //         "stock": 36,
  //         "descriptions": "我們的瑜珈墊採用高品質的材料，提供您瑜珈練習所需的完美支持和舒適。提供出色的防滑性和緩衝效果，確保您在每個動作中都感到穩定和安心。瑜珈墊的良好選擇，幫助您實現更深入的冥想和伸展。",
  //         "imgs": "bae45b08-7ded-4886-8007-cc4206fe20b8.webp",
  //         "purchase_qty": 42,
  //         "create_at": "2023-12-09T11:49:33.000Z",
  //         "size": null,
  //         "brand_id": null
  //     }
  // }
  const [product, setProduct] = useState({ row: [] })
  const [productImages, setProductImages] = useState([])
  const [comments, setComments] = useState([])
  const [qty, setQty] = useState(1)
  const { addMutiItem } = useCart()
  const [sortBy, setSortBy] = useState('latest')
  const [tab, setTab] = useState('comments')
  // 一載入頁面顯示幾筆評論
  const [visibleComments, setVisibleComments] = useState(3)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  // 取得單一商品資訊
  const getProduct = async () => {
    // console.log('router.query:', router.query.pid) // 除錯用
    let sid = +router.query.pid || 1
    if (sid < 1) sid = 1

    try {
      const r = await fetch(PRODUCT_ONE + `/${sid}`)
      const d = await r.json()
      setProduct(d)
    } catch (ex) {
      console.log(ex)
    }
  }

  // 取得商品圖片
  const getProductImages = async () => {
    try {
      const filenames = product.row.imgs?.split(',') || []
      // console.log('Filenames:', filenames)

      const imagePromises = filenames.map(async (fileName) => {
        const imageUrl = `${PRODUCT_IMG}/${fileName.trim()}`
        return { fileName, imageUrl }
      })

      const imageData = await Promise.all(imagePromises)
      setProductImages(imageData)
    } catch (ex) {
      console.error(ex)
    }
  }

  // 取得商品評論
  const getComments = async () => {
    try {
      const pid = +router.query.pid || 1
      if (isNaN(pid) || pid < 1) {
        console.log
        'Invalid pid:', pid
        return
      }
      const r = await fetch(PRODUCT_ONE_COMMENT + `/${pid}`)
      const d = await r.json()

      if (d.success) {
        const commentsWithImgs = d.rows.map(async (comment) => {
          const memberPicUrl = await getMemberImage(comment.member_pic)
          return { ...comment, memberPicUrl }
        })

        const commentsWithData = await Promise.all(commentsWithImgs)
        setComments({ ...d, rows: commentsWithData })
      }
    } catch (ex) {
      console.log(ex)
    }
  }

  // 取得評論會員圖片
  const getMemberImage = async (fileName) => {
    try {
      // console.log(fileName)
      const imageUrl = `${PRODUCT_ONE_COMMENT_IMG}/${fileName}`
      return imageUrl
    } catch (ex) {
      console.log(ex)
    }
  }

  // 取得相關商品
  const getRelatedProduct = async () => {
    try {
      const r = await fetch(
        PRODUCT_RELATED +
          `?sub_category=${product.row.sub_category}&pid=${product.row.sid}`
      )
      const d = await r.json()
      setRelatedProducts(d)
    } catch (ex) {
      console.log(ex)
    }
  }

  const demoComments = [
    {
      img: '/store/user01.jpeg',
      username: '林傑森',
      create_at: '2023-01-04 17:06',
      score: '4.5',
      comment: '出貨速度快，品質良好~',
    },
    {
      img: '/store/user02.jpeg',
      username: '黃提姆',
      create_at: '2023-01-05 23:43',
      score: '5.0',
      comment: '服務態度良好，下次會再回購。',
    },
    {
      img: '/store/user03.jpeg',
      username: '李珊妮',
      create_at: '2023-01-07 10:18',
      score: '5.0',
      comment: '每次買每次滿意 > <',
    },
    // {
    //   img: '/store/501.jpg',
    //   username: '周阿達',
    //   create_at: '2023-01-08 17:22',
    //   score: '5.0',
    //   comment: '買到賺到，趕快揪朋友一起買',
    // },
    // {
    //   img: '/store/505.jpg',
    //   username: '劉曉明',
    //   create_at: '2023-01-09 16:10',
    //   score: '5.0',
    //   comment: 'CP值非常高',
    // },
    // {
    //   img: '/store/509.jpg',
    //   username: '張凱文',
    //   create_at: '2023-01-07 10:18',
    //   score: '5.0',
    //   comment: 'Great!!',
    // },
  ]

  // 顯示更多評論一次增加幾筆
  const handleLoadMore = () => {
    setIsLoading(true)
    setTimeout(() => {
      setVisibleComments(visibleComments + 3)
      setIsLoading(false)
    }, 500)
  }

  useEffect(() => {
    getProduct()
    getComments()
  }, [router.query.pid])

  // 如果有拿到資料就去設定圖片
  useEffect(() => {
    // 檢查有拿到資料且 Object.keys 返回一個物件的所有屬性組成的陣列
    if (product.row && Object.keys(product.row).length > 0) {
      getProductImages()
    }
  }, [product.row])

  useEffect(() => {
    getRelatedProduct()
  }, [product.row])

  // 分享商品(搭配react-share)
  let url = ''
  if (typeof window === 'object') {
    url = String(window.location)
    // console.log(url)
  }

  //測試必須要使用 "127.0.0.1:3000/store/product/pid"
  const currentPageUrl = `127.0.0.1:3000/store/product/${router.query.pid}`

  // 計算評分佔多少百分比
  const score = `${(product.row && +product.row.score / 5) * 100}%`

  return (
    <>
      {/* <pre>{JSON.stringify(product, null, 4)}</pre> */}
      {/* <pre>{JSON.stringify(comments, null, 4)}</pre> */}

      {/* 區塊一：麵包屑 */}
      <section>
        <div className="container">
          {/* breadcrumbs */}
          <div className={styles['breadcrumbinfo']}>
            <p className={styles['breadcrumb']}>
              線上商城 / 器材及裝備 / 其他器材及裝備
            </p>
          </div>
        </div>
      </section>
      {/* 區塊二：商品詳細資訊 */}
      <section>
        <div className="container">
          {product.row && (
            <div className={styles['product-detail']}>
              <div className={styles['product-imgs']}>
                <ProductDetailSwiper productImages={productImages} />
              </div>
              <div className={styles['product-info']}>
                <h4 className={styles['product-name']}>{product.row.name}</h4>
                <p className={styles['product-descriptions-top']}>
                  {product.row.descriptions}
                </p>
                <p className={styles['product-price']}>
                  NT$
                  {product.row.product_price &&
                    product.row.product_price.toLocaleString()}
                </p>
                <div className={styles['scoreAndShare']}>
                  <div className={styles['product-score']}>
                    <div className={styles['star-rating']}>
                      <div
                        className={styles['back-stars']}
                        style={{ width: score }}
                      >
                        <div className={styles['front-stars']}>
                          <svg
                            width="150"
                            height="31"
                            viewBox="0 0 420 84"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M420 0H0V84H420V0ZM52.815 28.91L42 7L31.185 28.91L7.00001 32.445L24.5 49.49L20.37 73.57L42 62.195L63.63 73.57L59.5 49.49L77 32.445L52.815 28.91ZM136.815 28.91L126 7L118.685 28.91L91 32.445L108.5 49.49L104.37 73.57L126 62.195L147.63 73.57L143.5 49.49L161 32.445L136.815 28.91ZM210 7L220.815 28.91L245 32.445L227.5 49.49L231.63 73.57L210 62.195L188.37 73.57L192.5 49.49L175 32.445L202.685 28.91L210 7ZM304.815 28.91L294 7L286.685 28.91L259 32.445L276.5 49.49L272.37 73.57L294 62.195L315.63 73.57L311.5 49.49L329 32.445L304.815 28.91ZM378 7L388.815 28.91L413 32.445L395.5 49.49L399.63 73.57L378 62.195L356.37 73.57L360.5 49.49L343 32.445L370.685 28.91L378 7Z"
                              fill="white"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className={styles['score-info']}>
                      {' '}
                      {`(${product.row && product.row.score})`}{' '}
                    </div>
                  </div>
                  <div className={styles['product-share']}>
                    <div className={styles['share-icon']}>
                      <FacebookShareButton url={currentPageUrl}>
                        <FacebookIcon size={35} round />
                      </FacebookShareButton>
                    </div>
                    <div className={styles['share-icon']}>
                      <LineShareButton url={currentPageUrl}>
                        <LineIcon size={35} round />
                      </LineShareButton>
                    </div>
                  </div>
                </div>
                {/* 尺寸(服裝才有) */}
                {/* <div className={styles['size']}>
                  <p className={styles['size-title']}>尺寸</p>
                  <div className={styles['size-select']}>
                    <select className="select" name="" id="">
                      <option value="">S</option>
                      <option value="">M</option>
                      <option value="">L</option>
                    </select>
                  </div>
                </div> */}
                {/* 數量 */}
                <div className={styles['qty']}>
                  <p className={styles['qty-title']}>數量</p>
                  <div className={styles['input-group']}>
                    <button
                      className={styles['btn-subtract']}
                      onClick={() => setQty(Math.max(qty - 1, 1))}
                    >
                      -
                    </button>
                    <div className={styles['form-control']}>{qty}</div>
                    <button
                      className={styles['btn-add']}
                      onClick={() => {
                        if (qty < product.row.stock) {
                          setQty(qty + 1)
                        }
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
                <p className={styles['product-stock']}>
                  庫存剩下 {product.row.stock} 件
                </p>
                <p className={styles['purchase-qty']}>
                  累積購買數: {product.row.purchase_qty}
                </p>
                {/* 加入購物車、購買、收藏按鈕 */}
                <div className={styles['product-btn']}>
                  <button
                    className={styles['btn-addToCart']}
                    onClick={() => {
                      addMutiItem({ ...product.row, qty: +qty })
                    }}
                  >
                    加入購物車
                  </button>
                  <button
                    className={styles['btn-buyNow']}
                    onClick={() => {
                      console.log('qty', qty)
                      addMutiItem({ ...product.row, qty: qty })
                      router.push('/store/cart')
                    }}
                  >
                    立即購買
                  </button>
                  <div className={styles['product-fav']}>
                    <ProductFavIcon product_sid={product.row.sid} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      {/* 區塊三：商品描述及顧客評價 */}
      <section className={styles['descriptionsAndComment-section']}>
        <div className="container">
          <div className={styles['descriptionsAndComment']}>
            <div className={styles['detail-tab']}>
              <button
                className={`${styles['tab-text']} ${
                  tab === 'description' && styles['active-tab']
                }`}
                onClick={() => setTab('description')}
              >
                商品描述
              </button>
              <button
                className={`${styles['tab-text']} ${
                  tab === 'comments' && styles['active-tab']
                }`}
                onClick={() => setTab('comments')}
              >
                顧客評價(
                {comments.totalRows ? comments.totalRows : '3'}則)
              </button>
            </div>
            {/* sort */}
            {comments.rows && comments.rows.length > 0
              ? tab === 'comments' && (
                  <div className={styles['sort']}>
                    <div className={styles['sort-select-box']}>
                      <select
                        className={styles['sort-select']}
                        name="sortBy"
                        id="sortBy"
                        value={sortBy}
                        onChange={(e) => {
                          setSortBy(e.target.value)
                        }}
                      >
                        <option value="latest">最新</option>
                        <option value="starFromHighToLow">評分由高到低</option>
                        <option value="starFromLowToHigh">評分由低到高</option>
                      </select>
                    </div>
                  </div>
                )
              : ''}

            {/* 顧客評論 */}
            {tab === 'description' && (
              <div className={styles['product-description']}>
                <p className={styles['product-descriptions']}>
                  {product.row.descriptions}
                </p>
              </div>
            )}
            {tab === 'comments' && (
              <div className={styles['product-comments']}>
                {comments.rows &&
                comments.rows.length > 0 &&
                comments.rows.sort((a, b) => {
                  if (sortBy === 'starFromHighToLow') {
                    return b.score - a.score
                  } else if (sortBy === 'starFromLowToHigh') {
                    return a.score - b.score
                  } else {
                    // Date 換算成毫秒再比較
                    return new Date(b.create_at) - new Date(a.create_at)
                  }
                })
                  ? comments.rows.slice(0, visibleComments).map((v, i) => {
                      {
                        return (
                          <div key={i} className={styles['comment']}>
                            <div
                              className={styles['member-img']}
                              style={{
                                backgroundImage: `url(${
                                  v.memberPicUrl || '/empty-profile-pic.jpg'
                                })`,
                                backgroundPosition: 'center',
                                backgroundSize: 'cover',
                              }}
                            />
                            <div className={styles['midAndTime']}>
                              <p className={styles['midAndTime-text']}>
                                {v.member_username}
                              </p>
                              <p className={styles['midAndTime-text']}>
                                {dayjs(v.create_at).format('YYYY-MM-DD HH:mm')}
                              </p>
                            </div>
                            <div className={styles['scoreAndcontent']}>
                              <div className={styles['product-score']}>
                                <div className={styles['star-rating']}>
                                  <div
                                    className={styles['back-stars']}
                                    style={{
                                      width: `${(+v.score / 5) * 100}%`,
                                    }}
                                  >
                                    <div className={styles['front-stars']}>
                                      <svg
                                        width="150"
                                        height="31"
                                        viewBox="0 0 420 84"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                          d="M420 0H0V84H420V0ZM52.815 28.91L42 7L31.185 28.91L7.00001 32.445L24.5 49.49L20.37 73.57L42 62.195L63.63 73.57L59.5 49.49L77 32.445L52.815 28.91ZM136.815 28.91L126 7L118.685 28.91L91 32.445L108.5 49.49L104.37 73.57L126 62.195L147.63 73.57L143.5 49.49L161 32.445L136.815 28.91ZM210 7L220.815 28.91L245 32.445L227.5 49.49L231.63 73.57L210 62.195L188.37 73.57L192.5 49.49L175 32.445L202.685 28.91L210 7ZM304.815 28.91L294 7L286.685 28.91L259 32.445L276.5 49.49L272.37 73.57L294 62.195L315.63 73.57L311.5 49.49L329 32.445L304.815 28.91ZM378 7L388.815 28.91L413 32.445L395.5 49.49L399.63 73.57L378 62.195L356.37 73.57L360.5 49.49L343 32.445L370.685 28.91L378 7Z"
                                          fill="#1f436c"
                                        />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                                <p className={styles['score-text']}>
                                  {v.score}
                                </p>
                              </div>
                              <div className={styles['content']}>
                                <p>{v.comment}</p>
                              </div>
                            </div>
                          </div>
                        )
                      }
                    })
                  : demoComments.map((v, i) => (
                      <div key={i} className={styles['comment']}>
                        <img
                          className={styles['member-img']}
                          src={`${v.img}`}
                        />
                        <div className={styles['midAndTime']}>
                          <p className={styles['midAndTime-text']}>
                            {v.username}
                          </p>
                          <p className={styles['midAndTime-text']}>
                            {dayjs(v.create_at).format('YYYY-MM-DD HH:mm')}
                          </p>
                        </div>
                        <div className={styles['scoreAndcontent']}>
                          <div className={styles['product-score']}>
                            <div className={styles['star-rating']}>
                              <div
                                className={styles['back-stars']}
                                style={{
                                  width: `${(+v.score / 5) * 100}%`,
                                }}
                              >
                                <div className={styles['front-stars']}>
                                  <svg
                                    width="150"
                                    height="31"
                                    viewBox="0 0 420 84"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M420 0H0V84H420V0ZM52.815 28.91L42 7L31.185 28.91L7.00001 32.445L24.5 49.49L20.37 73.57L42 62.195L63.63 73.57L59.5 49.49L77 32.445L52.815 28.91ZM136.815 28.91L126 7L118.685 28.91L91 32.445L108.5 49.49L104.37 73.57L126 62.195L147.63 73.57L143.5 49.49L161 32.445L136.815 28.91ZM210 7L220.815 28.91L245 32.445L227.5 49.49L231.63 73.57L210 62.195L188.37 73.57L192.5 49.49L175 32.445L202.685 28.91L210 7ZM304.815 28.91L294 7L286.685 28.91L259 32.445L276.5 49.49L272.37 73.57L294 62.195L315.63 73.57L311.5 49.49L329 32.445L304.815 28.91ZM378 7L388.815 28.91L413 32.445L395.5 49.49L399.63 73.57L378 62.195L356.37 73.57L360.5 49.49L343 32.445L370.685 28.91L378 7Z"
                                      fill="#1f436c"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <p className={styles['score-text']}>{v.score}</p>
                          </div>
                          <div className={styles['content']}>
                            <p>{v.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                {visibleComments && visibleComments < comments.totalRows && (
                  <div className={styles['load-more']}>
                    {isLoading ? (
                      <div className={styles['lds-ring']}>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                    ) : (
                      <button
                        className={styles['btn-load-more']}
                        onClick={handleLoadMore}
                      >
                        顯示更多評論
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
      {/* 區塊四：相關商品 */}
      <section className={styles['relatedProducts-section']}>
        <div className="container">
          <div className={styles['category-title']}>
            <span className={styles['category-text']}>
              - 相關商品 RELATED PRODUCTS -
            </span>
          </div>
          <div className={styles['product-swiper']}>
            <ProductSwiper rows={relatedProducts.rows} />
          </div>
        </div>
      </section>
    </>
  )
}
