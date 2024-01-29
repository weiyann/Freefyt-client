import AuthContext from '@/context/auth-context'
import { useContext, useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { MEMBER_PROFILE } from '@/configs/index'
import Image from 'next/image'
import Link from 'next/link'
import { MEMBER_PROFILE_PIC } from '@/configs/index'
import { RiLogoutBoxLine } from 'react-icons/ri'
import { MdOutlineArticle } from 'react-icons/md'
import defaultProfilePic from '@/public/member/empty-profile-pic.png'
import { LiaFileInvoiceDollarSolid } from 'react-icons/lia'
import { AiOutlineSchedule } from 'react-icons/ai'
import { CiCalendarDate } from 'react-icons/ci'
import { TfiStatsUp } from 'react-icons/tfi'
import { IoIosInformationCircleOutline } from 'react-icons/io'
import { CiUser } from 'react-icons/ci'

export default function UserMenu() {
  const { auth, signout } = useContext(AuthContext)
  const router = useRouter()

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [memberProfile, setMemberProfile] = useState({
    member_username: '',
    member_name: '',
    member_nickname: '',
    member_pic: '',
  })

  useEffect(() => {
    // const memberID = +router.query.member_id
    // console.log(memberID)

    fetch(`${MEMBER_PROFILE}/${auth.id}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + auth.token,
      },
      credentials: 'include',
    })
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) {
          setIsLoggedIn(false)
        } else {
          setIsLoggedIn(true)
          setMemberProfile({ ...data.memberInfo })
        }
      })
      .catch((ex) => console.log(ex))
  }, [auth.id])

  // User Menu
  const [isClicked, setIsClicked] = useState(false)

  function handleMenu(e) {
    e.stopPropagation()
    // NOTE: Hide user menu when clicking on anywhere else

    setIsClicked((isClicked) => !isClicked)
  }

  // Sign out
  function handleSignOut(event) {
    event.preventDefault()
    // NOTE: Fixing Next.js error "cancel rendering route"
    //stackoverflow.com/questions/74330483/how-to-fix-next-js-error-cancel-rendering-route
    setIsClicked(false)
    signout()
    router.push('/')
  }

  const userMenu = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenu.current && !userMenu.current.contains(e.target)) {
        setIsClicked(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <>
      {isLoggedIn ? (
        <div className="avatar-login" onClick={handleMenu}>
          {memberProfile.member_pic ? (
            <Image
              loader={() =>
                `http://localhost:3002/member/profile-img/${memberProfile.member_pic}`
              }
              src={`${MEMBER_PROFILE_PIC}/${memberProfile.member_pic}`}
              layout="fill"
              className="avatar-login-img"
            />
          ) : memberProfile.google_pic ? (
            <Image
              src={memberProfile.google_pic}
              layout="fill"
              className="avatar-login-img"
            />
          ) : (
            <Image
              src={defaultProfilePic}
              layout="fill"
              className="avatar-login-img"
            />
          )}
        </div>
      ) : (
        <Link href="/member/login">
          <div className="btn-login">登入</div>
        </Link>
      )}
      <div
        className={isClicked ? 'user-menu user-menu-show' : 'user-menu'}
        ref={userMenu}
      >
        <div className="user-menu-shape"></div>
        <ul>
          <h6>
            {memberProfile.google_name
              ? memberProfile.google_name
              : memberProfile.member_nickname
              ? memberProfile.member_nickname
              : memberProfile.member_name}
          </h6>
          <p>
            {memberProfile.google_name
              ? memberProfile.member_nickname
              : memberProfile.member_username}
          </p>
          {/* NOTE: Setting up names, nicknames, and usernames for users who log in with Google */}
          <li>
            <Link href={`/member/${auth.id}`} className="user-menu-link">
              <CiUser />
              會員中心
            </Link>
          </li>
          <li>
            <Link
              href={`/member/profile/${auth.id}`}
              className="user-menu-link"
            >
              <IoIosInformationCircleOutline />
              會員資料
            </Link>
          </li>
          <li>
            <Link
              href="/fytrack/track-training/history"
              className="user-menu-link"
            >
              <TfiStatsUp />
              健身數據
            </Link>
          </li>
          <li>
            <Link href="/course/member/timetable" className="user-menu-link">
              <CiCalendarDate />
              學員課表
            </Link>
          </li>
          {/* <Link href="#">
            <li>
              <AiOutlineSchedule />
              教練課表
            </li>
          </Link> */}
          <li>
            <Link
              href="/store/product/history-order"
              className="user-menu-link"
            >
              <LiaFileInvoiceDollarSolid />
              我的訂單
            </Link>
          </li>
          <li>
            <Link
              href={`/blog/mylist/${memberProfile.member_id}`}
              className="user-menu-link"
            >
              <MdOutlineArticle />
              我的文章
            </Link>
          </li>
          <li>
            <Link href="#" onClick={handleSignOut} className="user-menu-link">
              <RiLogoutBoxLine />
              登出
            </Link>
          </li>
        </ul>
      </div>
    </>
  )
}
