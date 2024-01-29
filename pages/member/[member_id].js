import MenuButton from '@/components/member/menu-button'
import ActivityCard from '@/components/member/activity-card'
import styles from '@/styles/member/member.module.css'
import { useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import { MEMBER_PROFILE, MEMBER_PROFILE_PIC } from '@/configs/index'
import { useState } from 'react'
import { FaRegCalendar } from 'react-icons/fa6'
import { GiWhistle } from 'react-icons/gi'
import { FaBookmark } from 'react-icons/fa'
import { MdArticle } from 'react-icons/md'
import { FaCartShopping } from 'react-icons/fa6'
import { FaFileInvoiceDollar } from 'react-icons/fa6'
import { FaDumbbell } from 'react-icons/fa'
import { GiForkKnifeSpoon } from 'react-icons/gi'
import { GiMeat } from 'react-icons/gi'
import { MdExpandMore } from 'react-icons/md'
import { FaUser } from 'react-icons/fa'
import { BsBagHeart } from 'react-icons/bs'
import AuthContext from '@/context/auth-context'
import Link from 'next/link'
import Image from 'next/image'
import defaultProfilePic from '@/public/member/empty-profile-pic.png'
import { GoArrowUp } from 'react-icons/go'

export default function MemberHub() {
  // TITLE: ACQUIRE MEMBER DATA
  const [memberProfile, setMemberProfile] = useState({
    member_username: '',
    member_name: '',
    member_nickname: '',
    member_bio: '',
    member_pic: '',
  })

  const router = useRouter()

  const { auth } = useContext(AuthContext)

  useEffect(() => {
    const memberID = +router.query.member_id
    console.log(auth.id)

    if (router.query.member_id !== undefined) {
      if (!memberID || memberID !== auth.id) {
        router.push('/member/login')
      } else {
        console.log(auth.id, auth.username, auth.token)
        fetch(`${MEMBER_PROFILE}/${memberID}`, {
          // mode: 'no-cors',
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + auth.token,
          },
          credentials: 'include',
          // withCredentials: true,
        })
          .then((r) => r.json())
          // NOTE: MUST return (must not add curly brackets to r.json())
          .then((data) => {
            if (!data.success) {
              router.push('/member/login')
            } else {
              console.log(data.memberInfo)
              setMemberProfile({ ...data.memberInfo })
              // console.log(memberProfile.member_pic)
            }
          })
          .catch((ex) => console.log(ex))
      }
    }
  }, [router.query.member_id])

  // TITLE: EXPANDABLE SHORTCUT MENU
  const [menuHidden, setMenuHidden] = useState(false)
  const [rotateIcon, setRotateIcon] = useState(false)

  const handleExpand = () => {
    setMenuHidden((prev) => !prev)
    setRotateIcon((prev) => !prev)
  }

  const [workoutData, setWorkoutData] = useState([])
  const [purchaseData, setPurchaseData] = useState([])
  const [combinedData, setCombinedData] = useState([])
  const [totalData, setTotalData] = useState([])
  const [workoutCount, setWorkoutCount] = useState()
  const [purchaseCount, setPurchaseCount] = useState()
  const [courseCount, setCourseCount] = useState()
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  // const [isLoading, setIsLoading] = useState(false)
  // const [showScrollTop, setShowScrollTop] = useState(false)

  // NOTE: Fetch workout log data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // setIsLoading(true)
        console.log(auth.id, 'Page:', page)

        console.log(auth.id)

        const response = await fetch(
          `http://localhost:3002/fytrack/track-training/get-workout-logs/api?member_id=${auth.id}&page=${page}`
        )

        const data = await response.json()

        if (!data.success) {
          console.log('no data')
        } else {
          console.log(data)
          setCombinedData((prevData) => [...prevData, ...data.pageData])
          setTotalData([...data.combinedData])
          setWorkoutCount(data.workoutCount)
          setPurchaseCount(data.purchaseCount)
          setCourseCount(data.courseCount)
          setHasMore(data.pageData.length === 5)
          console.log(combinedData)
        }
      } catch (ex) {
        console.log(ex)
      }
    }

    fetchData()
  }, [auth.id, page])

  const handleScroll = () => {
    const scrollY = window.scrollY
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.offsetHeight

    if (scrollY + windowHeight >= documentHeight - 10 && hasMore) {
      setPage((prevPage) => prevPage + 1)
    }
  }
  // NOTE: Rewriting this part fixed the infinte scroll, though I still don't know why

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  // useEffect(() => {
  //   const handleScrollTop = () => {
  //     const scrollY = window.scrollY
  //     const threshold = 100

  //     if (scrollY > threshold) {
  //       setShowScrollTop(true)
  //     } else {
  //       setShowScrollTop(false)
  //     }
  //   }

  //   window.addEventListener('scroll', handleScrollTop)

  //   return () => {
  //     window.removeEventListener('scroll', handleScrollTop)
  //   }
  // }, [])

  // const scrollTopClassName = showScrollTop
  //   ? styles['scroll-top']
  //   : styles['scroll-top-hidden']

  // NOTE: Time since joined
  const [secsSinceJoined, setSecsSinceJoined] = useState(0)

  function calculateTimeDifference() {
    const timeSinceJoined =
      new Date() - new Date(memberProfile.member_join_date)
    const secsSinceJoined = Math.round(timeSinceJoined / 1000)
    setSecsSinceJoined(secsSinceJoined)
  }

  useEffect(() => {
    const intervalID = setInterval(calculateTimeDifference, 1000)
    calculateTimeDifference()

    return () => clearInterval(intervalID)
  }, [memberProfile.member_join_date])

  // NOTE: CHECKING IF MEMBER IS COACH

  const [isCoach, setIsCoach] = useState(false)

  useEffect(() => {
    const checkCoach = async () => {
      try {
        const response = await fetch(
          `http://localhost:3002/member/search-coach-id/api?member_id=${auth.id}`
        )

        const data = await response.json()

        if (!data.success) {
          console.log('no data for coach', data)
        } else {
          console.log('iscoach', data)
          setIsCoach(true)
        }
      } catch (ex) {
        console.log(ex)
      }
    }

    checkCoach()
  }, [auth.id])

  function handleDisabledLink(e) {
    e.preventdefault()
  }

  return (
    <div className={styles['member']}>
      {/* <div
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={scrollTopClassName}
      >
        <GoArrowUp />
      </div> */}
      <section className={styles['heading']}>
        <div
          className={`${styles['container']} ${styles['heading__container']}`}
        >
          {/* <h3
            className={`${styles['section__title']} ${styles['heading__title']}`}
          >
            會員<span>中心</span>
          </h3> */}
          <div className={styles['heading__contents']}>
            <div className={styles['heading__profile-img-container']}>
              {memberProfile.member_pic ? (
                <Image
                  loader={() =>
                    `http://localhost:3002/member/profile-img/${memberProfile.member_pic}`
                  }
                  // NOTE: Use a loader function + absolute path
                  src={`${MEMBER_PROFILE_PIC}/${memberProfile.member_pic}`}
                  // Q: Still getting 404 error despite successful render. Next/Image behavior? memberProfile.member_pic initial state empty?
                  alt="Member photo"
                  layout="fill"
                  className={styles['heading__profile-img']}
                />
              ) : memberProfile.google_pic ? (
                <Image
                  src={memberProfile.google_pic}
                  alt="Google member photo"
                  layout="fill"
                  className={styles['heading__profile-img']}
                />
              ) : (
                <Image
                  src={defaultProfilePic}
                  alt="Default Member photo"
                  layout="fill"
                  className={styles['heading__profile-img']}
                />
              )}
            </div>
            <div className={styles['heading__info-box']}>
              <h3>
                歡迎回來，
                {memberProfile.member_nickname
                  ? memberProfile.member_nickname
                  : memberProfile.member_name}
                {/* NOTE: Renders name if user has no nickname */}！
              </h3>
              <p className={styles['welcome-message']}>
                自從您加入了 FreeFYT， 已經過了
                <span> {Math.floor(secsSinceJoined / (24 * 60 * 60))} </span> 天
                <span>
                  &nbsp;
                  {Math.floor((secsSinceJoined % (24 * 60 * 60)) / (60 * 60))}
                  &nbsp;
                </span>
                小時
                <span> {Math.floor((secsSinceJoined % (60 * 60)) / 60)} </span>
                分鐘
                <span> {Math.floor(secsSinceJoined % 60)} </span> 秒。
              </p>
              <p className={styles['welcome-message']}>
                過程中，您健身了<span> {workoutCount} </span>
                次，並受了<span> {courseCount} </span>
                次的專業教練的指導。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles['menu']}>
        <div
          className={`${styles['container']} ${styles['menu__container']} ${
            menuHidden ? styles['menu__container-hide'] : ''
          }`}
        >
          <h6>捷徑選單</h6>
          <MdExpandMore
            className={`${styles['menu__container-expand']} ${
              rotateIcon ? styles['rotate-icon'] : ''
            }`}
            onClick={handleExpand}
          />
          <div
            className={`${
              menuHidden
                ? styles['menu__wrapper-hide']
                : styles['menu__wrapper']
            }`}
          >
            <div className={styles['menu__all-shortcuts']}>
              <div className={styles['menu__row']}>
                <div className={styles['menu__group']}>
                  <Link
                    href={`/course/member/timetable`}
                    className={styles['menu__button']}
                  >
                    <MenuButton
                      text="課程管理"
                      icon={
                        <FaRegCalendar
                          className={`${styles['menu__icon-img']} ${styles['menu__icon-img-short']}`}
                        />
                      }
                    />
                  </Link>
                  {isCoach ? (
                    <Link
                      href={`/course/coach/timetable-coach`}
                      className={styles['menu__button']}
                    >
                      <MenuButton
                        text="教練專區"
                        icon={
                          <GiWhistle className={styles['menu__icon-img']} />
                        }
                      />
                    </Link>
                  ) : (
                    <div className={styles['menu__button-disabled']}>
                      <MenuButton
                        text="教練專區"
                        icon={
                          <GiWhistle className={styles['menu__icon-img']} />
                        }
                      />
                    </div>
                  )}
                </div>
                <div className={styles['menu__group']}>
                  <Link
                    href={`/blog/mylist/${memberProfile.member_id}`}
                    className={styles['menu__button']}
                  >
                    <MenuButton
                      text="文章收藏"
                      icon={
                        <FaBookmark
                          className={`${styles['menu__icon-img']} ${styles['menu__icon-img-shorter']}`}
                        />
                      }
                    />
                  </Link>
                  <Link
                    href={`/blog/mylist/${memberProfile.member_id}`}
                    className={styles['menu__button']}
                  >
                    <MenuButton
                      text="我的文章"
                      icon={
                        <MdArticle
                          className={`${styles['menu__icon-img']} ${styles['menu__icon-img-wide']} ${styles['menu__icon-img-long']}`}
                        />
                      }
                    />
                  </Link>
                </div>
                <div className={styles['menu__group']}>
                  <Link
                    href={`/store/product/collection`}
                    className={styles['menu__button']}
                  >
                    <MenuButton
                      text="商品收藏"
                      icon={
                        <BsBagHeart
                          className={`${styles['menu__icon-img']} ${styles['menu__icon-img-short']}`}
                        />
                      }
                    />
                  </Link>
                  <Link
                    href={`/store/product/history-order`}
                    className={styles['menu__button']}
                  >
                    <MenuButton
                      text="我的訂單"
                      icon={
                        <FaFileInvoiceDollar
                          className={`${styles['menu__icon-img']} ${styles['menu__icon-img-short']}`}
                        />
                      }
                    />
                  </Link>
                </div>
              </div>
              <div className={styles['menu__row']}>
                <div className={styles['menu__group']}>
                  <Link
                    href={`/member/profile/${auth.id}`}
                    className={styles['menu__button']}
                  >
                    <MenuButton
                      text="會員資料"
                      icon={
                        <FaUser
                          className={`${styles['menu__icon-img']} ${styles['menu__icon-img-shorter']}`}
                        />
                      }
                    />
                  </Link>
                  <Link
                    href={`/fytrack/track-training`}
                    className={styles['menu__button']}
                  >
                    <MenuButton
                      text="重訓追蹤"
                      icon={
                        <FaDumbbell
                          className={`${styles['menu__icon-img']} ${styles['menu__icon-img-short']}`}
                        />
                      }
                    />
                  </Link>
                  {/* <Link href={`/`} className={styles['menu__button']}>
                    <MenuButton
                      text="食物清單"
                      icon={
                        <GiForkKnifeSpoon
                          className={`${styles['menu__icon-img']} ${styles['menu__icon-img-short']}`}
                        />
                      }
                    />
                  </Link> */}
                  <Link
                    href={`/fytrack/track-nutrition/${memberProfile.member_id}`}
                    className={styles['menu__button']}
                  >
                    <MenuButton
                      text="營養管理"
                      icon={
                        <GiMeat
                          className={`${styles['menu__icon-img']} ${styles['menu__icon-img-short']} ${styles['menu__icon-img-narrow']}`}
                        />
                      }
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className={styles['activity']}>
        <div
          className={`${styles['container']} ${styles['activity__container']}`}
        >
          {/* {workoutData.map((workout, index) => (
            <ActivityCard key={index} workout={workout} />
          ))} */}
          {combinedData.map((activity, index) => (
            <ActivityCard key={index} activity={activity} />
          ))}
          {/* {purchaseData.map((purchase, index) => (
            <ActivityCard key={index} purchase={purchase} />
          ))} */}
        </div>
      </section>
    </div>
  )
}
