import React from 'react'
import styles from '@/styles/course/course-detail.module.css'
import Image from 'next/image'
import {
  COURSE_IMG,
  COURSE_DETAIL,
  COURSE_COMMENT,
  COURSE_COACH_IMG,
} from '@/configs'
import moment from 'moment-timezone'
import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import CourseFavIcon from '@/components/course/course-fav-icon'
import AuthContext from '@/context/auth-context'
import Swal from 'sweetalert2'
import { LiaDumbbellSolid } from 'react-icons/lia'
import {
  FacebookIcon,
  FacebookShareButton,
  LineIcon,
  LineShareButton,
} from 'react-share'
import GoogleMap from '@/components/course/google-map'

export default function CourseDetail() {
  const [course, setCourse] = useState({})
  const [courseComment, setCourseComment] = useState({})
  const [courseImage, setCourseImage] = useState([])
  const [coachImage, setCoachImage] = useState([])
  const [commentMemberImages, setcommentMemberImages] = useState([])
  const { auth } = useContext(AuthContext)
  const memberId = auth.id

  const router = useRouter()
  moment.tz.setDefault('Asia/Taipei')

  // 取得課程資料
  const getCourse = async () => {
    const cid = +router.query.cid
    console.log(router.query.cid)
    if (router.query.cid !== undefined) {
      if (!cid) {
        router.push('/course')
      } else {
        try {
          const r = await fetch(COURSE_DETAIL + `/${cid}`)
          const d = await r.json()
          setCourse(d)
        } catch (ex) {
          console.log(ex)
        }
      }
    }
  }
  useEffect(() => {
    getCourse()
  }, [router.query.cid])

  // 取得課程圖片
  const getCourseImage = async () => {
    try {
      const filename = course.row.course_img
      const imageUrl = `${COURSE_IMG}/${filename}`
      const imageData = [{ fileName: filename, imageUrl }]
      setCourseImage(imageData)
    } catch (ex) {
      console.log(ex)
    }
  }

  useEffect(() => {
    if (course.row) {
      getCourseImage()
    }
  }, [course.row])

  // 取得教練圖片
  const getCoachImage = async () => {
    try {
      const filenameMember = course.row.coach_img
      const imageUrl = `${COURSE_COACH_IMG}/${filenameMember}`
      const imageData = [{ filenameMember: filenameMember, imageUrl }]
      setCoachImage(imageData)
    } catch (ex) {
      console.log(ex)
    }
  }
  useEffect(() => {
    if (course.row) {
      getCoachImage()
    }
  }, [course.row])

  // 取得評論會員圖片
  const getcommentMemberImages = async () => {
    try {
      const filenames = courseComment.map((v, i) => v.member_pic)

      const imagePromises = filenames.map(async (filenameMember) => {
        const imageUrl = `${COURSE_COACH_IMG}/${filenameMember}`
        return { filenameMember, imageUrl }
      })

      const imageData = await Promise.all(imagePromises)
      setcommentMemberImages(imageData)
    } catch (ex) {
      console.log(ex)
    }
  }
  useEffect(() => {
    if (courseComment && courseComment.length > 0) {
      getcommentMemberImages()
    }
  }, [courseComment])

  // 取得課程評論
  const getCourseComment = async () => {
    const cid = +router.query.cid

    if (router.query.cid !== undefined) {
      if (!cid) {
        router.push('/course')
      } else {
        try {
          const r = await fetch(COURSE_COMMENT + `/${cid}`)
          const d = await r.json()
          setCourseComment(d)
        } catch (ex) {
          console.log(ex)
        }
      }
    }
  }
  useEffect(() => {
    getCourseComment()
  }, [router.query.cid])

  // // 過濾已完成的評論
  // const completedComments = courseComment.filter(
  //   (courseComment) => courseComment.comment_time >0
  // )

  // 顯示有效評論數量
  // console.log('有效評論數量：', completedComments.length)

  // 前往購買的按鈕
  const handlePurchaseClick = async (e) => {
    e.preventDefault()

    // 檢查 memberId 是否存在
    if (memberId > 0) {
      // memberId 存在，直接進行購買
      const courseId = +router.query.cid
      router.push(`/course/payment/${courseId}`)
    } else {
      // memberId 不存在，顯示 SweetAlert 並導向登入頁面
      const result = await Swal.fire({
        title: '請先登入',
        text: '您需要登入會員帳號才能進行購買。',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '前往登入',
        cancelButtonText: '取消',
      })

      if (result.isConfirmed) {
        router.push('/member/login')
      }
    }
  }
  // line 分享url
  const currentPageUrl = `http://127.0.0.1:3000/course/${router.query.cid}`

  // 計算評分佔多少百分比
  const score = `${(course.row && +course.row.score / 5) * 100}%`
  return (
    <>
      {/* <pre>{JSON.stringify(courseComment, null, 4)}</pre> */}
      {/* <pre>{JSON.stringify(coachImage, null, 4)}</pre> */}

      <div className="container">
        {/* breadcrumbs  */}
        <div className={styles['breadcrumb-box']}>
          <p className="breadcrumb">
            首頁 / 課程專區 / {course.row && course.row.name}
          </p>
        </div>
        {/* 課程圖片+課程相關資訊 */}
        <div className={styles['course-title']}>
          <div className={styles['course-img']}>
            <img
              src={courseImage[0] && courseImage[0].imageUrl}
              alt=""
              // width={'600'}
              // height={'400'}
            />
          </div>
          <div className={styles['course-info']}>
            <div className={styles['course-name']}>
              {course.row && course.row.name}
            </div>
            <div className={styles['course-intro']}>
              {course.row && course.row.intro}
            </div>
            <div className={styles['course-price']}>
              NT$ {course.row && course.row.price.toLocaleString()}
            </div>
            <div className={styles['scoreAndShare']}>
              <div className={styles['star-rating']}>
                <div className={styles['back-stars']} style={{ width: score }}>
                  <div className={styles['front-stars']}>
                    <svg
                      width="150"
                      height="30"
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
              <div className={styles['score']}>
                {' '}
                {course.row && course.row.score
                  ? `(${course.row.score})`
                  : ''}{' '}
              </div>
              <div className={styles['share']}>
                <div className={styles['share-icon']}>
                  <FacebookShareButton>
                    <FacebookIcon size={40} round />
                  </FacebookShareButton>
                </div>
                <div className={styles['share-icon']}>
                  <LineShareButton
                    url={currentPageUrl}
                    title={course.row && course.row.name}
                  >
                    <LineIcon size={40} round />
                  </LineShareButton>
                </div>
              </div>
            </div>
            <div className={styles['purchaseAndShare']}>
              <button
                type="button"
                className={styles['purchase-btn']}
                onClick={(e) => handlePurchaseClick(e)}
              >
                直接購買
              </button>
              <div className={styles['heart-icon']}>
                <CourseFavIcon course_id={course.row && course.row.course_id} />
              </div>
            </div>
          </div>
        </div>
        <div className={styles['coachAndLocation']}>
          {/* 教練資訊 */}
          <div className={styles['coach-box']}>
            <div className={styles['coach-top']}>
              <div className={styles['coach-img']}>
                <Image
                  src={coachImage[0] && coachImage[0].imageUrl}
                  alt=""
                  width={'100'}
                  height={'100'}
                />
              </div>
              <div className={styles['coach-name']}>
                {course.row && course.row.coach_name}
              </div>
            </div>
            {/* 介紹 */}
            <div className={styles['coach-info']}>
              <div className={styles['coach-title']}>介紹</div>
              <div className={styles['coach-intro']}>
                {course.row && course.row.coach_intro}
              </div>
            </div>
            {/* 證照 */}
            <div className={styles['coach-cert']}>
              <div className={styles['coach-title']}>證照</div>
              <ul>
                {course.row &&
                  course.row.coach_certs.split(',').map((v, i) => (
                    <li key={i}>
                      <LiaDumbbellSolid size={30} color="#4674A9" width={'20px'} height={'20px'}/>
                      <p>{v.trim()}</p>
                    </li>
                  ))}
              </ul>
            </div>
            {/* 工作/教學經歷 */}
            <div className={styles['coach-exp']}>
              <div className={styles['coach-title']}>工作/教學經歷</div>
              <div className={styles['exp-text']}>
                {course.row && course.row.coach_experience}
              </div>
            </div>
          </div>
          {/* 上課地點 */}
          <div className={styles['course-location']}>
            <div className={styles['location-title']}>上課地點</div>
            <div className={styles['gym-name']}>
              {course.row && course.row.gym_name}
            </div>
            <div className={styles['gym-address']}>
              {course.row && course.row.gym_address}
            </div>
            <div className={styles['map']}>
            <GoogleMap course={course}/>
              {/* <iframe
                title="google-map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3614.378824266586!2d121.51453197578348!3d25.055146337438927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442a96b09e39c45%3A0x2f8f1c7fb6044236!2z5qGR5a-M5aOr!5e0!3m2!1szh-TW!2stw!4v1704770440583!5m2!1szh-TW!2stw"
                width={700}
                height={500}
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe> */}
            </div>
          </div>
        </div>

        {/* 課程評論 */}
        <div className={styles['course-comment']}>
          <div className={styles['comment-title']}>課程評論</div>
          {courseComment &&
          Array.isArray(courseComment) &&
          courseComment.length > 0 ? (
            courseComment
              .filter((v) => v.comment_time)
              .map((v, i) => {
                const commentMemberImage = commentMemberImages[i]
                const imageUrl = commentMemberImage
                  ? commentMemberImage.imageUrl
                  : ''
                return (
                  <div className={styles['comment-box']} key={i}>
                    <div className={styles['comment']}>
                      <div className={styles['member-info']}>
                        <div className={styles['member-img']}>
                          <Image
                            src={imageUrl}
                            alt=""
                            width={'80'}
                            height={'80'}
                          />
                        </div>
                        <div className={styles['nameAndTime']}>
                          <div className={styles['member-name']}>
                            {courseComment &&
                              (v.member_nickname || v.member_name)}
                          </div>
                          <div className={styles['comment-time']}>
                            {courseComment &&
                              moment(v.comment_time).format(
                                'YYYY/MM/DD-HH:mm:ss'
                              )}
                          </div>
                        </div>
                      </div>
                      <div className={styles['scoreAndText']}>
                        <div className={styles['score']}>
                          <div className={styles['star-rating-comment']}>
                            <div
                              className={styles['back-stars-comment']}
                              style={{ width: `${(v.score / 5) * 100}%` }}
                            >
                              <div className={styles['front-stars-comment']}>
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
                        </div>
                        <div className={styles['comment-text']}>
                          {v.course_comment}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
          ) : (
            <div className={styles['comment-none']}>-目前沒有評論-</div>
          )}
        </div>
        {/* 相關課程 */}
      </div>
    </>
  )
}
