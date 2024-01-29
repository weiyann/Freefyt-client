import React from 'react'
import { useState, useEffect } from 'react'
import { COURSE_LIST, COURSE_IMG, COURSE_COACH_IMG } from '@/configs'
import styles from '@/styles/course/course-homepage.module.css'
import Link from 'next/link'
import CourseFavIcon from './course-fav-icon'
import Image from 'next/image'

export default function HomepageCourse() {
  const [courseData, setCourseData] = useState([])
  const [courseImages, setCourseImages] = useState([])
  const [coachImages, setCoachImages] = useState([])

  // 獲得課程資料
  const getCourseData = async () => {
    try {
      const r = await fetch(COURSE_LIST)
      const data = await r.json()
      setCourseData(data)
    } catch (ex) {
      console.log(ex)
    }
  }
  useEffect(() => {
    getCourseData()
  }, [])

  // 取得課程圖片
  const getCourseImage = async () => {
    try {
      const filenames = courseData.rows.slice(4, 8).map((v, i) => v.course_img)
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
      const filenames = courseData.rows.slice(4, 8).map((v, i) => v.coach_img)
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

  return (
    <>
      {/* <pre>{JSON.stringify(courseData, null, 4)}</pre> */}
      {/* 課程卡片區塊 */}
      <div className={styles['card-box']}>
        {courseData.rows &&
          courseData.rows.slice(4, 8).map((v, i) => {
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
                        <div key={index} className={styles['tag-box__tag']}>
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
                              width="130"
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
                        {'$' + v.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </Link>
                {/* <div className={styles['heart-icon']}>
                  <CourseFavIcon course_id={v.course_id} />
                </div> */}
              </div>
            )
          })}
      </div>
    </>
  )
}
