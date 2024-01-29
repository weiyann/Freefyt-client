import { useState, useEffect } from 'react'
import { PRODUCT_LIST, PRODUCT_IMG, PRODUCT_POPULAR } from '@/configs'
import { useRouter } from 'next/router'
import styles from '@/styles/store/product/product-style.module.css'
import ParallaxSwiper from '@/components/swiper/parallax-swiper'
import slides from '@/data/swiper.json'
import ProductCard from '@/components/store/product/product-card'
import ProductSwiper from '@/components/swiper/product-swiper'
import Pagination from '@/components/store/product/pagination'
import Swal from 'sweetalert2'

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [productImages, setProductImages] = useState([])
  const [keyword, setKeyword] = useState('')
  const [sortBy, setSortBy] = useState('latest')
  const router = useRouter()
  const [queryString, setQueryString] = useState({
    page: +router.query.page || 1,
    main_category: +router.query.main_category || '',
    category: +router.query.category || '',
    keyword: router.query.keyword || '',
    sortBy: router.query.sortBy || '',
    foodBrand: +router.query.foodBrand || '',
  })
  const [popularProducts, setpopularProducts] = useState([])
  const [selectedSubValue, setSelectedSubValue] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // 取得商品資訊
  const getProducts = async () => {
    const usp = new URLSearchParams(router.query)

    // console.log("router.query:", router.query); // 除錯用
    let page = +router.query.page || 1
    if (page < 1) {
      page = 1
      // router.replace('/store/product?page=1')
      setQueryString((prevParams) => ({ ...prevParams, page }))
    }

    // 主分類篩選
    let main_category = +router.query.main_category || ''
    if (main_category < 1) {
      main_category = ''
      // router.replace(`/store/product`)
      setQueryString((prevParams) => ({ ...prevParams, main_category: '' }))
    }

    // 分類篩選
    let category = +router.query.category || ''
    if (category < 1) {
      category = ''
      setQueryString((prevParams) => ({ ...prevParams, category: '' }))
    }

    // 食物品牌篩選
    let foodBrand = +router.query.foodBrand || ''
    if (foodBrand < 1) {
      foodBrand = ''
      setQueryString((prevParams) => ({ ...prevParams, foodBrand: '' }))
    }

    try {
      const r = await fetch(PRODUCT_LIST + `?${usp.toString()}`)
      const d = await r.json()
      if (d.success) {
        setProducts(d)
        setTimeout(() => {
          setIsLoading(false)
        }, 2000)
      }
    } catch (ex) {
      console.log(ex)
      setIsLoading(false)
    }
  }

  // 取得商品圖片
  const getProductsImages = async () => {
    try {
      const filenames = products.rows.map((v) => v.imgs?.split(',')[0])
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

  // 主分類
  const mainCate = [
    {
      label_en: 'EQUIPMENT',
      label: '健身器材及裝備',
      value: 1,
      style: 'category-equipment',
    },
    {
      label_en: 'CLOTHING',
      label: '健身服飾',
      value: 2,
      style: 'category-clothing',
    },
    {
      label_en: 'HEALTHY FOOD',
      label: '健身食品',
      value: 3,
      style: 'category-healthyfood',
    },
  ]
  // 次分類
  const equipSub = [
    { label: '重訓器材', value: 4 },
    { label: '有氧訓練', value: 5 },
    { label: '筋膜放鬆', value: 6 },
    { label: '其他器材及裝備', value: 7 },
  ]
  const clothingSub = [
    { label: '上身類', value: 8 },
    { label: '下身類', value: 9 },
  ]
  const foodSub = [
    { label: '乳清類', value: 10 },
    { label: '其他健身食品', value: 11 },
  ]
  const foodBrandTag = [
    { label: '戰神 Mars', value: 1 },
    { label: '果果堅果 Gopower', value: 2 },
    { label: '美國 ON', value: 3 },
    { label: 'Myprotien', value: 4 },
    { label: '台灣 Tryall', value: 5 },
    { label: 'ALLIN', value: 6 },
    { label: '樂維根 The Vegan', value: 7 },
  ]

  // 次分類toggle
  const handleSubToggle = (v) => {
    const q = { ...router.query }
    delete q.page

    const newSubValue = selectedSubValue === `${v}` ? '' : `${v}`
    setSelectedSubValue(newSubValue)

    if (newSubValue === '') {
      delete q.category
    } else {
      q.category = newSubValue
    }

    router.push(
      {
        pathname: '/store/product',
        query: q,
      },
      undefined,
      { scroll: false }
    )
  }

  const handleSubStyle = (value) => {
    return selectedSubValue === `${value}`
      ? styles['btn-subcategory-active']
      : styles['btn-subcategory']
  }

  // 取得 10 筆熱門商品
  const getPopularProduct = async () => {
    try {
      const r = await fetch(PRODUCT_POPULAR)
      const d = await r.json()
      setpopularProducts(d)
    } catch (ex) {
      console.log(ex)
    }
  }

  useEffect(() => {
    getProducts()
    getPopularProduct()
  }, [router.query])

  // 如果有拿到資料就去設定圖片
  useEffect(() => {
    if (products.rows && products.rows.length > 0) {
      getProductsImages()
    }
  }, [products.rows])

  useEffect(() => {
    setQueryString({
      page: +router.query.page || 1,
      main_category: +router.query.main_category || '',
      category: +router.query.category || '',
      keyword: router.query.keyword || '',
      sortBy: router.query.sortBy || 'latest',
      foodBrand: +router.query.foodBrand || '',
    })
  }, [router.query, router.isReady])

  return (
    <>
      {isLoading ? (
        <div className="container">
          <div className={styles['loading-box']}>
            <img src="/store/freefyt-loading.svg" />
          </div>
        </div>
      ) : (
        <>
          {/* <pre>{JSON.stringify(products, null, 4)}</pre> */}
          <section className={styles['ParallaxSwiper-section']}>
            {/* slider */}
            <ParallaxSwiper slides={slides} />
          </section>
          {/* product-list */}
          {/* breadcrumb + search */}
          <div id="breadcrumbAndSearch">
            <div className="container">
              {/* breadcrumbs + searchProduct */}
              <div className={styles['breadcrumbAndSearch']}>
                <p className={styles['breadcrumb']}>
                  線上商城 /{' '}
                  {router.query.main_category === '1'
                    ? '健身器材及裝備'
                    : router.query.main_category === '2'
                    ? '健身服飾'
                    : router.query.main_category === '3'
                    ? '健身食品'
                    : '所有商品'}
                </p>
                {/* 搜尋全站商品 */}
                <form
                  role="search"
                  onSubmit={(e) => {
                    e.preventDefault()
                    router.push(
                      {
                        pathname: '/store/product',
                        query: {
                          ...router.query,
                          keyword: e.currentTarget.keyword.value,
                        },
                      },
                      undefined,
                      { scroll: false }
                    )
                  }}
                >
                  <div className={styles['search-product']}>
                    <div className="input-group">
                      <input
                        type="search"
                        className={styles['search-input']}
                        placeholder="搜尋全站商品"
                        name="keyword"
                        onKeyUp={(e) => {
                          // console.log('isComposing:', e.nativeEvent.isComposing)
                          // 處理中文輸入法 onKeyUp ＋ isComposing
                          if (!e.nativeEvent.isComposing) {
                            const newKeyword = e.currentTarget.value.trim()

                            if (newKeyword !== '') {
                              setKeyword(newKeyword)
                              router.push(
                                {
                                  pathname: '/store/product',
                                  query: {
                                    sortBy: sortBy,
                                    keyword: newKeyword,
                                  },
                                },
                                undefined,
                                { scroll: false }
                              )
                            } else {
                              const { keyword, ...q } = router.query
                              router.push(
                                {
                                  pathname: '/store/product',
                                  query: { ...q, sortBy },
                                },
                                undefined,
                                { scroll: false }
                              )
                            }
                          }
                        }}
                      />
                    </div>
                    {/* <button className={styles['btn-search-product']}>搜尋</button> */}
                  </div>
                </form>
              </div>
            </div>
          </div>
          {/* category-card */}
          <div className={styles['category-card']}>
            <div className={styles['category-title']}>
              <span className={styles['select-text']}>SELECT</span>
              <span className={styles['category-text']}>CATEGORY</span>
            </div>
            <div className={styles['fyt-card']}>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  const { main_category, category, keyword, foodBrand, ...q } =
                    router.query
                  router.push(
                    {
                      pathname: '/store/product',
                      query: { ...q },
                    },
                    undefined,
                    { scroll: false }
                  )
                }}
                className={styles['category-all']}
              >
                ALL
                <span className={styles['category-name']}>所有商品</span>
              </button>
              {mainCate.map((v, i) => {
                return (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.preventDefault()
                      const { category, keyword, foodBrand, ...q } =
                        router.query
                      router.push(
                        {
                          pathname: '/store/product',
                          query: { ...q, main_category: `${v.value}` },
                        },
                        undefined,
                        { scroll: false }
                      )
                    }}
                    className={styles[`${v.style}`]}
                  >
                    {v.label_en}
                    <span className={styles['category-name']}>{v.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <section id="product-list">
            <div className="container">
              {/* 本頁商品類別 */}
              <h4 className={styles['main-category-text']}>
                {router.query.main_category === '1'
                  ? '健身器材及裝備'
                  : router.query.main_category === '2'
                  ? '健身服飾'
                  : router.query.main_category === '3'
                  ? '健身食品'
                  : '所有商品'}
              </h4>
              {/* 子分類按鈕 */}
              <div className={styles['subcategory']}>
                {router.query.main_category === '1' ||
                router.query.category === '4' ||
                router.query.category === '5' ||
                router.query.category === '6' ||
                router.query.category === '7' ? (
                  <>
                    <p className={styles['subcategory-title']}>次分類</p>
                    {equipSub.map((v, i) => {
                      return (
                        <button
                          key={i}
                          onClick={() => handleSubToggle(v.value)}
                          className={handleSubStyle(v.value)}
                        >
                          {v.label}
                        </button>
                      )
                    })}
                  </>
                ) : router.query.main_category === '2' ||
                  router.query.category === '8' ||
                  router.query.category === '9' ? (
                  <>
                    <p className={styles['subcategory-title']}>次分類</p>
                    {clothingSub.map((v, i) => {
                      return (
                        <button
                          key={i}
                          onClick={() => handleSubToggle(v.value)}
                          className={handleSubStyle(v.value)}
                        >
                          {v.label}
                        </button>
                      )
                    })}
                  </>
                ) : router.query.main_category === '3' ||
                  router.query.category === '10' ||
                  router.query.category === '11' ? (
                  <>
                    <p className={styles['subcategory-title']}>次分類</p>
                    {foodSub.map((v, i) => {
                      return (
                        <button
                          key={i}
                          onClick={(e) => {
                            e.preventDefault()
                            const q = { ...router.query }
                            delete q.page
                            delete q.foodBrand
                            router.push(
                              {
                                pathname: '/store/product',
                                query: { ...q, category: v.value },
                              },
                              undefined,
                              { scroll: false }
                            )
                          }}
                          className={
                            router.query.category === `${v.value}`
                              ? styles['btn-subcategory-active']
                              : styles['btn-subcategory']
                          }
                        >
                          {v.label}
                        </button>
                      )
                    })}
                  </>
                ) : (
                  <p
                    className={styles['subcategory-title']}
                    // style={{ height: '38.5px' }}
                  ></p>
                )}
              </div>
              {/* 食物品牌 */}
              {router.query.main_category === '3' ? (
                <div className={styles['food-brand']}>
                  <p className={styles['food-brand-title']}>食物品牌</p>
                  {foodBrandTag.map((v, i) => {
                    return (
                      <button
                        key={i}
                        onClick={(e) => {
                          e.preventDefault()
                          const q = { ...router.query }
                          delete q.page
                          delete q.category
                          router.push(
                            {
                              pathname: '/store/product',
                              query: { ...q, foodBrand: v.value },
                            },
                            undefined,
                            { scroll: false }
                          )
                        }}
                        className={
                          router.query.foodBrand === `${v.value}`
                            ? styles['btn-subcategory-active']
                            : styles['btn-subcategory']
                        }
                      >
                        {v.label}
                      </button>
                    )
                  })}
                </div>
              ) : (
                ''
              )}

              {/* sort */}
              <div className={styles['sort']}>
                <p className={styles['sort-title']}>排序</p>
                <div className={styles['sort-select-box']}>
                  <select
                    className={styles['sort-select']}
                    name="sortBy"
                    id="sortBy"
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value)
                      router.push(
                        {
                          pathname: '/store/product',
                          query: { ...router.query, sortBy: e.target.value },
                        },
                        undefined,
                        { scroll: false }
                      )
                    }}
                  >
                    <option value="latest">最新上架</option>
                    <option value="priceFromHighToLow">價格由高到低</option>
                    <option value="priceFromLowToHigh">價格由低到高</option>
                  </select>
                </div>
              </div>
              {/* 商品筆數  */}
              <p className={styles['total-rows']}>
                共 {products.totalRows} 筆符合，共 {products.totalPages} 頁
              </p>

              {/* product-list  */}
              <div className={styles['product-group']}>
                {products.rows &&
                  products.rows.map((v, i) => {
                    const productImage = productImages.find(
                      (img) => img.fileName === v.imgs?.split(',')[0]
                    )
                    const imageUrl = productImage ? productImage.imageUrl : ''
                    return (
                      <div key={i}>
                        {/* 卡片元件 + useCart */}
                        <ProductCard products={[v]} imageUrl={imageUrl} />
                      </div>
                    )
                  })}
              </div>
              {/* pagination */}
              <Pagination products={products} />
            </div>
          </section>

          {/* 第四區塊：熱門商品10筆，如果有空再換成 猜你喜歡區塊*/}
          <section className={styles['guesswhatyoulike-section']}>
            <div className="container">
              <div className={styles['category-title']}>
                <span className={styles['category-text']}>
                  - 猜你喜歡 GUESS WHAT YOU LIKE -
                </span>
              </div>
              <div className={styles['product-swiper']}>
                <ProductSwiper rows={popularProducts.rows} />
              </div>
            </div>
          </section>
        </>
      )}
    </>
  )
}
