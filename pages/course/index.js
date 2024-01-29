import React from 'react'
import styles from '@/styles/course/course-mainpage.module.css'
import CourseFavIcon from '@/components/course/course-fav-icon'
import Image from 'next/image'
import {
  COURSE_TAGS,
  COURSE_LIST,
  COURSE_IMG,
  COURSE_COACH_IMG,
  COURSE_MEMBER_DATA,
} from '@/configs'
import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AuthContext from '@/context/auth-context'

export default function CourseMainPage() {
  const [courseTags, setCourseTags] = useState([])
  const [courseData, setCourseData] = useState([])
  const [courseImages, setCourseImages] = useState([])
  const [coachImages, setCoachImages] = useState([])
  const [isCoach, setIsCoach] = useState(false) // 辨別教練身份
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { auth, courseFav } = useContext(AuthContext)
  const memberId = auth.id

  // 各篩選的state
  const [nameLike, setNameLike] = useState('')
  const [tagIds, setTagIds] = useState([]) // 數字陣列
  const [orderby, setOrderby] = useState('newest')
  const [page, setPage] = useState(1)

  // 辨別是否有教練身份
  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const r = await fetch(`${COURSE_MEMBER_DATA}?member_id=${memberId}`)
        const d = await r.json()
        console.log(d)
        // 在這裡進行教練身份的辨識
        const coachStatus = !!d[0].iscoach
        console.log(coachStatus)

        // 更新狀態
        setIsCoach(coachStatus)
      } catch (ex) {
        console.log(ex)
      }
    }

    fetchMemberData()
  }, [memberId])

  // 取得標籤資料
  const getCourseTags = async () => {
    try {
      const res = await fetch(COURSE_TAGS)
      const data = await res.json()
      console.log(data)
      setCourseTags(data)
    } catch (ex) {
      console.log(ex)
    }
  }
  useEffect(() => {
    getCourseTags()
  }, [])

  const getCourseData = async (params) => {
    try {
      // 構建搜尋條件
      const searchParams = new URLSearchParams(params)

      const res = await fetch(`${COURSE_LIST}?${searchParams.toString()}`)
      const data = await res.json()
      setCourseData(data)
      setTimeout(() => {
        setIsLoading(false)
      }, 3000)
    } catch (ex) {
      console.error(ex)
    }
  }
  useEffect(() => {
    if (router.isReady) {
      const { page, name_like: myNameLike, sort, tag_ids } = router.query

      console.log(router.query)

      // 設定回所有狀態(注意所有從查詢字串來都是字串類型)，都要給預設值

      setPage(Number(page) || 1)
      setNameLike(myNameLike || '')
      setOrderby(sort || 'newest')
      setTagIds(tag_ids ? tag_ids.split(',').map((v) => Number(v)) : [])
      getCourseData(router.query)
    }
  }, [router.query, router.isReady])

  const handleLoadData = async () => {
    // 要送至伺服器的query string參數
    // 註: 重新載入資料需要跳至第一頁
    const params = {
      page: 1, // 跳至第一頁
      name_like: nameLike,
      sort: orderby,
      tag_ids: tagIds.join(','),
    }

    router.push({
      pathname: router.pathname,
      query: params,
    })
  }

  // 輸入框事件
  const handleComposition = (e) => {
    if (e.type === 'compositionstart') {
      e.preventDefault() // 中文輸入法開始時阻止事件
    } else if (e.type === 'compositionend') {
      e.preventDefault() // 中文輸入法結束時阻止事件
      // 組合結束時執行載入資料
      handleLoadData()
    }
  }

  // 選擇標籤控制狀態
  const handleTagClick = (fitnessId) => {
    console.log('eddie', fitnessId)
    // 檢查是否已經包含
    if (tagIds.includes(fitnessId)) {
      // 移除
      setTagIds(tagIds.filter((id) => id !== fitnessId))
    } else {
      // 添加
      setTagIds([...tagIds, fitnessId])
    }
    // 在選擇標籤時觸發重新載入資料
    // handleLoadData()
    // 直接使用 router.push 更新 URL 中的查询参数
  }

  // 取得課程圖片
  const getCourseImage = async () => {
    try {
      const filenames = courseData.rows.map((v, i) => v.course_img)
      console.log(filenames)

      const imagePromises = filenames.map(async (fileName) => {
        const imageUrl = `${COURSE_IMG}/${fileName}`
        return { fileName, imageUrl }
      })

      const imageData = await Promise.all(imagePromises)
      setCourseImages(imageData)
    } catch (ex) {
      console.log(ex)
    }
  }
  // 如果有拿到資料就去設定圖片
  useEffect(() => {
    if (courseData.rows && courseData.rows.length > 0) {
      getCourseImage()
    }
  }, [courseData.rows])

  // 取得課程教練圖片
  const getCoachImages = async () => {
    try {
      const filenames = courseData.rows.map((v, i) => v.coach_img)
      console.log(filenames)

      const imagePromises = filenames.map(async (filenameMember) => {
        const imageUrl = `${COURSE_COACH_IMG}/${filenameMember}`
        return { filenameMember, imageUrl }
      })

      const imageData = await Promise.all(imagePromises)
      setCoachImages(imageData)
    } catch (ex) {
      console.log(ex)
    }
  }
  useEffect(() => {
    if (courseData.rows && courseData.rows.length > 0) {
      getCoachImages()
    }
  }, [courseData.rows])

  useEffect(() => {
    handleLoadData()
  }, [orderby])

  // 表單
  const handleFormSubmit = (e) => {
    e.preventDefault() // 防止表單的預設提交行為
    handleLoadData()
  }

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
          {/* <pre>{JSON.stringify(courseFav, null, 4)}</pre> */}
          {/* <pre>{JSON.stringify(courseTags, null, 4)}</pre> */}
          <div className="container">
            {/* 到課程管理的按鈕 */}
            {memberId > 1 && (
              <div className={styles['to-course-management']}>
                <Link href={'/course/member/timetable'}>
                  <button
                    type="button"
                    className={styles['to-course-management__member']}
                  >
                    課程管理(一般會員)
                  </button>
                </Link>

                <button
                  type="button"
                  className={
                    isCoach
                      ? styles['to-course-management__coach']
                      : styles['to-course-management-disabled']
                  }
                  disabled={!isCoach}
                  onClick={() => {
                    router.push('/course/coach/course-record')
                  }}
                >
                  課程管理(教練)
                </button>
              </div>
            )}

            {/* TODO:分類篩選搜尋的區塊 */}
            <div className={styles['sort-container']}>
              {/* breadcrumbs  */}
              <div className={styles['breadcrumb-box']}>
                <p className="breadcrumb">首頁 / 課程專區</p>
              </div>
              {/* 熱門標籤 */}
              <div className={styles['tags']}>
                <div className={styles['tags-title']}>熱門標籤：</div>
                {courseTags &&
                Array.isArray(courseTags) &&
                courseTags.length > 0 ? (
                  courseTags.map((v, i) => (
                    <button
                      key={i}
                      className={`${styles['btn-tag']} ${
                        tagIds.includes(v.fitness_id)
                          ? styles['btn-tag-active']
                          : ''
                      }`}
                      value={v.fitness_id}
                      onClick={(e) => handleTagClick(v.fitness_id)}
                    >
                      {v.tag_name}
                    </button>
                  ))
                ) : (
                  <p>Loading tags...</p>
                )}
                {/* <div className={styles['tags']}>
            <p className={styles['tags-title']}>熱門標籤</p>
            {courseTags &&
              courseTags[0].map((v, i) => (
                <button key={i} className={styles['btn-tag']}>
                  {v.tag_name}
                </button>
              ))}
          </div> */}
                <button
                  type="button"
                  className={styles['btn-search-tags']}
                  onClick={handleLoadData}
                >
                  標籤搜尋
                </button>
              </div>

              {/* 篩選 */}
              <div className={styles['sort']}>
                <form onSubmit={handleFormSubmit} id="search-form">
                  <div className={styles['search-course']}>
                    <label className={styles['search-title']}>
                      關鍵字搜尋：
                    </label>
                    <input
                      type="text"
                      className={styles['search-input']}
                      placeholder="搜尋課程"
                      value={nameLike}
                      onInput={(e) => {
                        setNameLike(e.target.value)
                      }}
                      onCompositionStart={handleComposition}
                      onCompositionUpdate={handleComposition}
                      onCompositionEnd={handleComposition}
                    />

                    <button
                      type="button"
                      className={styles['btn-search-course']}
                      onClick={handleLoadData}
                    >
                      搜尋
                    </button>
                    {/* 隱藏的提交按鈕 */}
                    <button type="submit" style={{ display: 'none' }}>
                      Submit
                    </button>
                  </div>
                </form>
                <p className={styles['sort-title']}>排序</p>
                <div className={styles['sort-select-box']}>
                  <select
                    className={styles['sort-select']}
                    value={orderby}
                    onChange={(e) => {
                      const selected = e.target.value
                      setOrderby(selected)
                    }}
                  >
                    <option value="newest">最新上架</option>
                    <option value="price_high">價格由高到低</option>
                    <option value="price_low">價格由低到高</option>
                  </select>
                </div>
              </div>
            </div>
            {/* 課程卡片區塊 */}
            <div className={styles['card-box']}>
              {courseData.rows &&
                courseData.rows.map((v, i) => {
                  // 課程圖片
                  const courseImage = courseImages[i]
                  const imageUrl = courseImage ? courseImage.imageUrl : ''
                  // 教練圖片
                  const coachImage = coachImages[i]
                  const imageUrlCoach = coachImage ? coachImage.imageUrl : ''

                  // 計算評分佔多少百分比
                  const score = `${(+v.score / 5) * 100}%`
                  // 尋找對應的標籤資訊
                  const courseTags = courseData.rows2.filter(
                    (tag) => tag.course_id === v.course_id
                  )
                  return (
                    <div className={styles['card-box__card']} key={i}>
                      <Link href={`/course/${v.course_id}`}>
                        <div className={styles['card-img']}>
                          <img
                            src={imageUrl}
                            alt={v.name}
                            width={'350'}
                            height={'400'}
                          />
                        </div>
                        <div className={styles['card-body']}>
                          <div className={styles['card__course-name']}>
                            <div>{v.name}</div>
                            {/* <div className={styles['heart-icon']}>
                          <CourseFavIcon course_id={v.course_id} />
                        </div> */}
                          </div>
                          {/* 卡片標籤 */}
                          <div className={styles['tag-box']}>
                            {courseTags.map((tag, index) => (
                              <div
                                key={index}
                                className={styles['tag-box__tag']}
                              >
                                #{tag.tag_name.trim()}
                              </div>
                            ))}
                          </div>
                          <div className={styles['coach-info']}>
                            <div className={styles['coach-info__img']}>
                              <Image
                                src={imageUrlCoach}
                                alt=""
                                width={'60'}
                                height={'60'}
                              />
                            </div>
                            <div className={styles['coach-info__name']}>
                              {v.coach_name}
                            </div>
                            {/* <button
                        type="button"
                        className={styles['coach-info__applybtn']}
                      >
                        我要報名
                      </button> */}
                          </div>
                          <div className={styles['card-footer']}>
                            <div className={styles['star-rating']}>
                              <div
                                className={styles['back-stars']}
                                style={{ width: score }}
                              >
                                <div className={styles['front-stars']}>
                                  <svg
                                    width="131"
                                    height="28"
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

                            <div className={styles['card-footer__score']}>
                              {`(${v.score ? v.score : '0'})`}
                            </div>
                            <div className={styles['card-footer__price']}>
                              {'$ ' + v.price.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </Link>
                      <div className={styles['heart-icon']}>
                        <CourseFavIcon course_id={v.course_id} />
                      </div>
                    </div>
                  )
                })}
            </div>
            {/* pagination */}
            <div>
              <ul className="pagination">
                <li className="pagination-item">
                  {courseData.page === 1 ? (
                    <div className="page-disable" href={'/course'}>
                      &lt;
                    </div>
                  ) : (
                    <Link
                      href={{
                        pathname: '/course',
                        query: { ...router.query, page: courseData.page - 1 },
                      }}
                      className="pagination-prev"
                    >
                      &lt;
                    </Link>
                  )}
                </li>

                {courseData.success && courseData.totalPages
                  ? Array(7)
                      .fill(1)
                      .map((v, i) => {
                        const p = courseData.page - 3 + i
                        if (p < 1 || p > courseData.totalPages) return null
                        return (
                          <li key={p}>
                            <Link
                              href={{
                                pathname: '/course',
                                query: { ...router.query, page: p },
                              }}
                              className={
                                p === courseData.page
                                  ? 'pagination-link-active'
                                  : 'pagination-link'
                              }
                            >
                              {p}
                            </Link>
                          </li>
                        )
                      })
                  : null}

                <li className="pagination-item">
                  {courseData.page === courseData.totalPages ? (
                    <div
                      className="page-disable"
                      href={'/course' + `?page=${courseData.totalPages}`}
                    >
                      &gt;
                    </div>
                  ) : (
                    <Link
                      href={{
                        pathname: '/course',
                        query: { ...router.query, page: courseData.page + 1 },
                      }}
                      className="pagination-next"
                    >
                      &gt;
                    </Link>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
    </>
  )
}
