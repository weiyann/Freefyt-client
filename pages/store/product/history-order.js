import { Fragment, useEffect, useState } from 'react'
import styles from '@/styles/store/product/history-order.module.css'
import Link from 'next/link'
import { FaList } from 'react-icons/fa6'
import ModalProductComment from '@/components/store/modal/modal-product-coment'
import {
  PRODUCT_MYONGOINGPO,
  PRODUCT_MYCOMPLETEDPO,
  CART_GETPODETAIL,
  PRODUCT_IMG,
} from '@/configs'
import dayjs from 'dayjs'
import { useContext } from 'react'
import AuthContext from '@/context/auth-context'
import { useRouter } from 'next/router'

export default function HistoryOrder() {
  const [ongoingPo, setOngoingPo] = useState([])
  const [completedPo, setCompletedPo] = useState([])
  const [products, setProducts] = useState([]) // 每個訂單裡面的detail product
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [itemImg, setItemImg] = useState([])
  const [modalProduct, setModalProduct] = useState(null)
  // 商品評論 modal
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const { auth } = useContext(AuthContext)
  const memberId = auth.id
  const router = useRouter()

  // 取得歷史訂單：訂單處理中
  const getOngoingPo = async () => {
    try {
      const r = await fetch(PRODUCT_MYONGOINGPO + `/${memberId}`)
      const d = await r.json()
      setOngoingPo(d)
    } catch (ex) {
      console.log(ex)
    }
  }

  // 取得歷史訂單：已完成
  const getCompletedPo = async () => {
    try {
      const r = await fetch(PRODUCT_MYCOMPLETEDPO + `/${memberId}`)
      const d = await r.json()
      setCompletedPo(d)
    } catch (ex) {
      console.log(ex)
    }
  }

  // 訂單詳細內容 toggle
  const showOrderDetails = (orderId) => {
    setSelectedOrderId(orderId === selectedOrderId ? null : orderId)
    if (orderId !== selectedOrderId) {
      getdetailPO(orderId)
    }
  }

  // 取得訂單詳細商品
  const getdetailPO = async (poid) => {
    try {
      const r = await fetch(CART_GETPODETAIL + `?poid=${poid}`)
      const d = await r.json()
      setProducts(d)
      if (d.rows) {
        const imageFilenames = d.rows
          .map((v) => v.imgs?.split(',')[0])
          .filter(Boolean)
        getProductsImage(imageFilenames)
      }
    } catch (ex) {
      console.log(ex)
    }
  }

  // 取得商品圖片
  const getProductsImage = async () => {
    try {
      if (products.rows) {
        const imagePromises = products.rows.map(async (v) => {
          const filename = v.imgs?.split(',')[0]
          const imageUrl = `${PRODUCT_IMG}/${filename}`

          try {
            const r = await fetch(imageUrl)
            if (r) {
              const blob = await r.blob()
              return { sid: v.sid, imageUrl: URL.createObjectURL(blob) }
            } else {
              return { sid: v.sid, imageUrl: null }
            }
          } catch (ex) {
            console.error(ex)
            return { sid: v.sid, imageUrl: null }
          }
        })

        const imageData = await Promise.all(imagePromises)
        setItemImg(imageData)
      }
    } catch (ex) {
      console.error(ex)
    }
  }

  // 每一筆訂單的詳細商品假資料
  // const historyOrders = [
  //   {
  //     orderId: '1',
  //     orderNumber: '00dda5125ws2',
  //     orderAmount: 'NT$1200',
  //     orderDate: '2023-11-22 18:56',
  //     orderStatus: '已完成',
  //     paymentStatus: '已付款',
  //   },
  //   {
  //     orderId: '2',
  //     orderNumber: '00dda51243e2',
  //     orderAmount: 'NT$2960',
  //     orderDate: '2023-11-29 20:36',
  //     orderStatus: '已完成',
  //     paymentStatus: '已付款',
  //   },
  //   {
  //     orderId: '3',
  //     orderNumber: '00dda51243e2',
  //     orderAmount: 'NT$2960',
  //     orderDate: '2023-12-09 20:36',
  //     orderStatus: '已完成',
  //     paymentStatus: '已付款',
  //   },
  // ]

  useEffect(() => {
    if (memberId) {
      getOngoingPo()
      getCompletedPo()
    } else {
      // router.push('/member/login')
      router.push('/store/product/history-order')
    }
  }, [memberId])

  return (
    <>
      {/* {JSON.stringify(ongoingPo, null, 4)} */}
      <hr />
      {/* {JSON.stringify(completedPo, null, 4)} */}
      {/* {JSON.stringify(products, null, 4)} */}
      <section className={styles['breadcrumb-section']}>
        <div className="container">
          {/* breadcrumbs */}
          <p className={styles['breadcrumb']}>線上商城 / 我的訂單</p>
          <div className={styles['my-order-list-title']}>
            <FaList size={35} /> <h4>&nbsp;我的訂單</h4>
          </div>
          <p className={styles['order-list-info']}>依訂單狀態分類</p>
        </div>
      </section>

      {/* 訂單區塊 */}
      <section className={styles['my-order-list-section']}>
        <div className="container">
          {/* 一、訂單進行中 */}
          <div className={styles['ongoing-po']}>
            {ongoingPo.rows && ongoingPo.rows.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <td colSpan={6} className={styles['ongoing-po-text']}>
                      未完成訂單
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr className={styles['po-item-field']}>
                    <td>流水號</td>
                    <td>訂單編號</td>
                    <td>訂單金額</td>
                    <td>付款狀態</td>
                    <td>訂單成立日期</td>
                    <td>訂單狀態</td>
                  </tr>
                  {/* 訂單處理中項目用map  */}
                  {/* 一樣做成收合按鈕 要去取得這筆訂單的詳細資料 */}
                  {ongoingPo.rows &&
                    ongoingPo.rows.map((v, i) => {
                      return (
                        <Fragment key={i}>
                          <tr
                            className={styles['po-item']}
                            onClick={() =>
                              showOrderDetails(v.purchase_order_id)
                            }
                          >
                            <td>{i + 1}</td>
                            <td>{v.purchase_order_id.slice(0, 14)}</td>
                            <td>
                              NT$
                              {v.total_amount &&
                                v.total_amount.toLocaleString()}
                            </td>
                            <td>{v.payment_status}</td>
                            <td>
                              {dayjs(v.created_at).format(
                                'YYYY-MM-DD HH:mm:ss'
                              )}
                            </td>
                            <td>{v.status}</td>
                          </tr>
                          {selectedOrderId === v.purchase_order_id && (
                            <tr>
                              <td
                                colSpan={4}
                                className={styles['histiry-order-detail']}
                              >
                                {/* 商品資訊 */}
                                {products.rows &&
                                  products.rows.map((v, i) => (
                                    <Fragment key={i}>
                                      <div
                                        className={
                                          styles['cart-item-checkout-ongoing']
                                        }
                                      >
                                        <div className={styles['cart-th']}>
                                          <div
                                            className={styles['cart-item-img']}
                                          >
                                            {v.imgs && v.imgs.split(',')[0] && (
                                              <img
                                                src={`${PRODUCT_IMG}/${
                                                  v.imgs.split(',')[0]
                                                }`}
                                              />
                                            )}
                                          </div>
                                          <p
                                            className={styles['cart-item-name']}
                                          >
                                            {v.name}
                                          </p>
                                        </div>
                                        <div className={styles['cart-th']}>
                                          NT$
                                          {v.product_price &&
                                            v.product_price.toLocaleString()}
                                        </div>
                                        <div className={styles['cart-th']}>
                                          <div className={styles['qty']}>
                                            <div
                                              className={styles['input-group']}
                                            >
                                              <div>{v.qty}</div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className={styles['cart-th']}>
                                          NT$
                                          {v.product_price &&
                                            (
                                              v.product_price * v.qty
                                            ).toLocaleString()}
                                        </div>
                                        <div
                                          className={styles['cart-th']}
                                        ></div>
                                      </div>
                                    </Fragment>
                                  ))}
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      )
                    })}
                </tbody>
              </table>
            ) : (
              <div className={styles['empty-info']}>
                <p>&apos;沒有處理中訂單紀錄&apos;</p>
              </div>
            )}
          </div>

          <div className={styles['divider']}></div>

          {/* 二、歷史清單 */}
          <div className={styles['history-po']}>
            {completedPo.rows && completedPo.rows.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <td colSpan={6} className={styles['history-po-text']}>
                      已完成訂單
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {/* 欄位標題 */}
                  <tr className={styles['po-item-field']}>
                    <td>流水號</td>
                    <td>訂單編號</td>
                    <td>訂單金額</td>
                    <td>付款狀態</td>
                    <td>訂單成立日期</td>
                    <td>訂單狀態</td>
                  </tr>
                  {/*  map 歷史訂單 */}
                  {completedPo.rows &&
                    completedPo.rows.map((v, i) => (
                      <Fragment key={i}>
                        <tr
                          className={styles['po-item']}
                          onClick={() => showOrderDetails(v.purchase_order_id)}
                        >
                          <td>{i + 1}</td>
                          <td>{v.purchase_order_id.slice(0, 14)}</td>
                          <td>
                            NT$
                            {v.total_amount && v.total_amount.toLocaleString()}
                          </td>
                          <td>{v.payment_status}</td>
                          <td>
                            {dayjs(v.created_at).format('YYYY-MM-DD HH:mm:ss')}
                          </td>
                          <td>{v.status}</td>
                        </tr>
                        {selectedOrderId === v.purchase_order_id && (
                          <tr>
                            <td
                              colSpan={4}
                              className={styles['histiry-order-detail']}
                            >
                              {/* 商品資訊 */}
                              {products.rows &&
                                products.rows.map((v, i) => {
                                  const isCommented = v.is_comment === 1

                                  return (
                                    <Fragment key={i}>
                                      <div
                                        className={styles['cart-item-checkout']}
                                      >
                                        <div className={styles['cart-th']}>
                                          <div
                                            className={styles['cart-item-img']}
                                          >
                                            {v.imgs && v.imgs.split(',')[0] && (
                                              <img
                                                src={`${PRODUCT_IMG}/${
                                                  v.imgs.split(',')[0]
                                                }`}
                                              />
                                            )}
                                          </div>
                                          <p
                                            className={styles['cart-item-name']}
                                          >
                                            {v.name}
                                          </p>
                                        </div>
                                        <div className={styles['cart-th']}>
                                          NT$
                                          {v.product_price &&
                                            v.product_price.toLocaleString()}
                                        </div>
                                        <div className={styles['cart-th']}>
                                          <div className={styles['qty']}>
                                            <div
                                              className={styles['input-group']}
                                            >
                                              <div>{v.qty}</div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className={styles['cart-th']}>
                                          NT$
                                          {v.product_price &&
                                            (
                                              v.product_price * v.qty
                                            ).toLocaleString()}
                                        </div>
                                        <div className={styles['cart-th']}>
                                          {isCommented ? (
                                            <button
                                              className={
                                                styles[
                                                  'btn-comment-product-disabled'
                                                ]
                                              }
                                            >
                                              已評價
                                            </button>
                                          ) : (
                                            <button
                                              className={
                                                styles['btn-comment-product']
                                              }
                                              onClick={() => {
                                                setModalOpen(true)
                                                setSelectedProduct(v)
                                              }}
                                            >
                                              評價商品
                                            </button>
                                          )}

                                          {modalOpen && selectedProduct && (
                                            <ModalProductComment
                                              setOpenModal={setModalOpen}
                                              poProduct={selectedProduct}
                                              getdetailPO={getdetailPO} // 看會不會用到
                                            />
                                          )}
                                        </div>
                                      </div>
                                    </Fragment>
                                  )
                                })}
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))}
                </tbody>
              </table>
            ) : (
              <div className={styles['empty-info']}>
                <p>&apos;沒有已完成訂單紀錄&apos;</p>
              </div>
            )}
          </div>

          {/* 分頁 */}

          {/* 按鈕 */}
          <div className={styles['btn-box']}>
            <Link
              href={'/store/product'}
              className={styles['btn-goToProductList']}
            >
              前往商品列表
            </Link>
            <Link href={'/store/cart'} className={styles['btn-goToCart']}>
              前往購物車
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
