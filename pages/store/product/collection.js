import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from '@/styles/store/product/collection.module.css'
import Link from 'next/link'
import { BsBagHeart } from 'react-icons/bs'
import { useContext } from 'react'
import AuthContext from '@/context/auth-context'
import { PRODUCT_COLLECTION, PRODUCT_IMG } from '@/configs'
import { useCart } from '@/hooks/use-cart'
import ProductFavIconDelete from '@/components/store/product/product-fav-icon-delete'

export default function Collection() {
  const { auth, productFav } = useContext(AuthContext)
  const memberId = auth.id
  const [collectionProducts, setCollectionProducts] = useState([])
  const [productImages, setProductImages] = useState([])
  const { addItem } = useCart()
  const router = useRouter()
  const [sortBy, setSortBy] = useState('latest')
  const [queryString, setQueryString] = useState({
    page: +router.query.page || 1,
    main_category: +router.query.main_category || '',
    sortBy: router.query.sortBy || '',
  })

  // 取得我的商品收藏紀錄
  const getMyCollectionList = async () => {
    const usp = new URLSearchParams(router.query)

    let page = +router.query.page || 1
    if (page < 1) {
      page = 1
      setQueryString((prevParams) => ({ ...prevParams, page }))
    }

    // 主分類篩選
    let main_category = +router.query.main_category || ''
    if (main_category < 1) {
      main_category = ''
      setQueryString((prevParams) => ({ ...prevParams, main_category: '' }))
    }

    try {
      const r = await fetch(
        PRODUCT_COLLECTION + `/${memberId}` + `?${usp.toString()}`
      )
      const d = await r.json()
      // console.log(d)
      if (d.success) {
        setCollectionProducts(d)
      } else if (!d.totalRows) {
        setCollectionProducts([])
      }
    } catch (ex) {
      console.log(ex)
    }
  }

  // 取得商品圖片
  const getProductsImages = async () => {
    try {
      const filenames = collectionProducts.rows.map(
        (v) => v.imgs?.split(',')[0]
      )
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
  const mainCategory = [
    {
      label: '健身器材及裝備',
      value: 1,
    },
    {
      label: '健身服飾',
      value: 2,
    },
    {
      label: '健身食品',
      value: 3,
    },
  ]

  useEffect(() => {
    if (memberId) {
      getMyCollectionList()
    } else {
      // router.push('/member/login')
      // router.push('/store/product')
      console.log('no record')
    }
  }, [memberId, productFav, router.query])

  // 如果有拿到資料就去設定圖片
  useEffect(() => {
    if (collectionProducts.rows && collectionProducts.rows.length > 0) {
      getProductsImages()
    }
  }, [collectionProducts])

  useEffect(() => {
    setQueryString({
      page: +router.query.page || 1,
      main_category: +router.query.main_category || '',
      sortBy: router.query.sortBy || 'latest',
    })
  }, [router.query])

  return (
    <>
      {/* <pre>{JSON.stringify(collectionProducts, null, 4)}</pre> */}
      <section className={styles['breadcrumb-section']}>
        <div className="container">
          {/* breadcrumbs */}
          <p className={styles['breadcrumb']}>線上商城 / 按讚好物</p>
          {/* 本頁商品標題 */}
          <div className={styles['collection-title']}>
            {/* <FaHeart /> */}
            <BsBagHeart />
            <h4> 按讚好物</h4>
          </div>
          {/* 篩選主分類 */}
          <div className={styles['maincategory']}>
            <p className={styles['maincategory-title']}>分類</p>
            <button
              onClick={(e) => {
                e.preventDefault()
                const { page, main_category, ...q } = router.query
                router.push(
                  {
                    pathname: '/store/product/collection',
                    query: { ...q },
                  },
                  undefined,
                  { scroll: false }
                )
              }}
              className={
                !router.query.main_category
                  ? styles['btn-maincategory-active']
                  : styles['btn-maincategory']
              }
            >
              所有商品
            </button>
            {mainCategory.map((v, i) => {
              return (
                <button
                  key={i}
                  onClick={(e) => {
                    e.preventDefault()
                    delete router.query.page
                    router.push(
                      {
                        pathname: `/store/product/collection`,
                        query: { ...router.query, main_category: `${v.value}` },
                      },
                      undefined,
                      { scroll: false }
                    )
                  }}
                  className={
                    router.query.main_category === `${v.value}`
                      ? styles['btn-maincategory-active']
                      : styles['btn-maincategory']
                  }
                >
                  {v.label}
                </button>
              )
            })}
          </div>
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
                      pathname: '/store/product/collection',
                      query: { ...router.query, sortBy: e.target.value },
                    },
                    undefined,
                    { scroll: false }
                  )
                }}
              >
                <option value="latest">最新加入</option>
                <option value="priceFromHighToLow">價格由高到低</option>
                <option value="priceFromLowToHigh">價格由低到高</option>
              </select>
            </div>
          </div>

          {/* 商品筆數  */}
          <p className={styles['total-rows']}>
            共 {collectionProducts.rows ? collectionProducts.totalRows : '0'}{' '}
            筆符合，共{' '}
            {collectionProducts.rows ? collectionProducts.totalPages : '0'} 頁
          </p>
        </div>
      </section>

      {/* collection-list */}
      <section className={styles['collection-list-section']}>
        <div className="container">
          {/* 收藏卡片 */}
          <div className={styles['product-group']}>
            {collectionProducts.rows && collectionProducts.rows.length > 0 ? (
              collectionProducts.rows.map((v, i) => {
                const productImage = productImages.find(
                  (img) => img.fileName === v.imgs?.split(',')[0]
                )
                const imageUrl = productImage ? productImage.imageUrl : ''
                return (
                  <div key={i} className={styles['product-item']}>
                    <Link href={`/store/product/${v.sid}`}>
                      <div className={styles['product-img']}>
                        {imageUrl && <img src={imageUrl} />}
                      </div>
                      <div className={styles['product-name']}>{v.name}</div>
                      <div className={styles['product-price']}>
                        NT${v.product_price && v.product_price.toLocaleString()}
                      </div>
                      <div className={styles['product-info']}>
                        <div>
                          <div className={styles['product-stock']}>
                            庫存量: {v.stock}
                          </div>
                          <div className={styles['product-purchase-qty']}>
                            累積購買數: {v.purchase_qty}
                          </div>
                        </div>
                      </div>
                    </Link>
                    <div className={styles['cart-btn']}>
                      <button
                        className={styles['add-to-cart-btn']}
                        onClick={() => addItem(v)}
                      >
                        + ADD TO CART
                      </button>
                    </div>
                    <div className={styles['btn-delete']}></div>
                    <div className={styles['delete-icon']}>
                      <ProductFavIconDelete product_sid={v.sid} />
                    </div>
                  </div>
                )
              })
            ) : (
              <>
                <div className={styles['empty-info']}>
                  <p className={styles['empty-text']}>
                    &apos;沒有收藏紀錄&apos;
                  </p>
                  <Link
                    href={`/store/product?main_category=${queryString.main_category}`}
                    className={styles['btn-goToProduct']}
                  >
                    前往該分類商品列表
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* 分頁 */}
          {collectionProducts.rows && collectionProducts.rows.length > 0 && (
            <div>
              <ul className={styles['pagination']}>
                <li className={styles['pagination-item']}>
                  {collectionProducts.page === 1 ? (
                    <div
                      className={styles['page-disable']}
                      href={'/store/product'}
                    >
                      &lt;
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        router.push(
                          {
                            pathname: '/store/product/collection',
                            query: {
                              ...router.query,
                              page: collectionProducts.page - 1,
                            },
                          },
                          undefined,
                          { scroll: false }
                        )
                      }}
                      className={styles['pagination-prev']}
                    >
                      &lt;
                    </button>
                  )}
                </li>
                {collectionProducts.success && collectionProducts.totalPages
                  ? Array(7)
                      .fill(1)
                      .map((v, i) => {
                        const p = collectionProducts.page - 3 + i
                        if (p < 1 || p > collectionProducts.totalPages)
                          return null
                        return (
                          <li key={p}>
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                router.push(
                                  {
                                    pathname: '/store/product/collection',
                                    query: {
                                      ...router.query,
                                      page: p,
                                    },
                                  },
                                  undefined,
                                  { scroll: false }
                                )
                              }}
                              className={
                                p === collectionProducts.page
                                  ? styles['pagination-link-active']
                                  : styles['pagination-link']
                              }
                            >
                              {p}
                            </button>
                          </li>
                        )
                      })
                  : null}
                <li className={styles['pagination-item']}>
                  {collectionProducts.page === collectionProducts.totalPages ? (
                    <div
                      className={styles['page-disable']}
                      href={
                        '/store/product/collection' +
                        `?page=${collectionProducts.totalPages}`
                      }
                    >
                      &gt;
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        router.push(
                          {
                            pathname: '/store/product/collection',
                            query: {
                              ...router.query,
                              page: collectionProducts.page + 1,
                            },
                          },
                          undefined,
                          { scroll: false }
                        )
                      }}
                      className={styles['pagination-next']}
                    >
                      &gt;
                    </button>
                  )}
                </li>
              </ul>
            </div>
          )}

          {/* 按鈕 */}
          {collectionProducts.rows && collectionProducts.rows.length > 0 && (
            <div className={styles['btn-box']}>
              <Link
                href="/store/product"
                className={styles['btn-goToProductList']}
              >
                前往商品列表
              </Link>
              <Link href="/store/cart" className={styles['btn-goToCart']}>
                前往購物車
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
