import { useState, useEffect, useContext } from 'react'
import {
  MEMBER_PROFILE,
  MEMBER_ADDRESS_CITY_DISTRICT,
  MEMBER_PROFILE_PIC,
} from '@/configs/index'
import { useRouter } from 'next/router'
import styles from '@/styles/member/profile.module.css'
import dayjs from 'dayjs'
import AuthContext from '@/context/auth-context'
import Link from 'next/link'
import Image from 'next/image'
import defaultProfilePic from '@/public/member/empty-profile-pic.png'

export default function Profile() {
  const [memberProfile, setMemberProfile] = useState({
    username: '',
    password: '',
    // TODO: Remove?
    name: '',
    nickname: '',
    gender: '',
    birthday: '',
    email: '',
    mobile: '',
    address: '',
    height: '',
    weight: '',
    trainingFrequency: '',
    trainingIntensity: '',
  })
  const memberBirthday = dayjs(memberProfile.member_birthday)

  const { auth } = useContext(AuthContext)

  const router = useRouter()

  useEffect(() => {
    const memberID = +router.query.member_id
    // console.log({ memberID, raw: router.query.member_id })

    if (router.query.member_id !== undefined) {
      if (!memberID || memberID !== auth.id) {
        // NOTE: If a non-number comes after "/member/profile"
        // NOTE: Member ID needs to match
        router.push('/member/login')
      } else {
        fetch(`${MEMBER_PROFILE}/${memberID}`, {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + auth.token,
          },
          credentials: 'include',
        })
          .then((r) => r.json())
          .then((data) => {
            if (!data.success) {
              router.push('/member/login')
              // NOTE: Including unauthorized access
              // NOTE: When bugs occur in redirection, check slashes
            } else {
              setMemberProfile({ ...data.memberInfo })
            }
          })
          .catch((ex) => console.log(ex))
      }
    }
  }, [router.query.member_id])

  // TITLE: FETCHING CITY & DISTRICT
  const [memberCity, setMemberCity] = useState('')
  const [memberDistrict, setMemberDistrict] = useState('')

  // NOTE: Fetching city
  useEffect(() => {
    fetch(`${MEMBER_ADDRESS_CITY_DISTRICT}/${memberProfile.member_city_id}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setMemberCity(data.addressInfo[0].district)
        }
      })
      .catch((ex) => console.log(ex))
  }, [memberProfile.member_city_id])

  // NOTE: Fetching district
  useEffect(() => {
    fetch(
      `${MEMBER_ADDRESS_CITY_DISTRICT}/${memberProfile.member_district_id}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    )
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setMemberDistrict(data.addressInfo[0].district)
        }
      })
      .catch((ex) => console.log(ex))
  }, [memberProfile.member_district_id])

  function handleEditInfo() {
    router.push(`/member/profile/${auth.id}/edit`)
  }

  return (
    <div className={styles['profile']}>
      <div className={styles['profile__top']}>
        <p className={styles['profile__breadcrumbs']}>會員中心/會員資料</p>
        <Link href={`/member/${auth.id}`}>
          <button className={styles['profile__prev-page-button']}>
            上一頁
          </button>
        </Link>
      </div>
      <section className={styles['profile__heading']}>
        <div
          className={`${styles['container']} ${styles['profile__heading-container']}`}
        >
          <h3
            className={`${styles['section__title']} ${styles['profile__title']}`}
          >
            會員<span>資料</span>
          </h3>
        </div>
      </section>
      <section className={styles['profile__member-info']}>
        <div
          className={`${styles['container']} ${styles['profile__member-info-container']}`}
        >
          <div className={styles['profile__member-info-area']}>
            <button
              className={styles['profile__edit-button']}
              onClick={handleEditInfo}
            >
              編輯資料
            </button>
            <div className={styles['profile__subsection-wrapper2']}>
              <p className={styles['profile__subsection-title']}>基本資訊</p>
              <div className={styles['profile__subsection-wrapper']}>
                <div className={styles['profile__basic-info']}>
                  <div className={styles['profile__subsection-contents']}>
                    <div className={styles['profile__info-box']}>
                      <p className={styles['profile__item']}>姓名</p>
                      <p className={styles['profile__member-info']}>
                        {memberProfile.member_name}
                      </p>
                    </div>
                    <div className={styles['profile__info-box']}>
                      <p className={styles['profile__item']}>性別</p>
                      <p className={styles['profile__member-info']}>
                        {memberProfile.member_gender === 'M'
                          ? '男'
                          : memberProfile.member_gender === 'F'
                          ? '女'
                          : memberProfile.member_gender === 'N'
                          ? '其他'
                          : ''}
                      </p>
                    </div>
                    <div className={styles['profile__info-box']}>
                      <p className={styles['profile__item']}>生日</p>
                      <p className={styles['profile__member-info']}>
                        {memberProfile.member_birthday !== null
                          ? `${memberBirthday.year()} 年 ${
                              memberBirthday.month() + 1
                            } 月 ${memberBirthday.date()} 日`
                          : ''}
                        {/* NOTE: Months are zero-indexed in JS */}
                      </p>
                    </div>
                  </div>
                </div>
                <div className={styles['profile__pic-container']}>
                  <div className={styles['profile__pic-frame']}>
                    {memberProfile.member_pic ? (
                      <Image
                        loader={() =>
                          `http://localhost:3002/member/profile-img/${memberProfile.member_pic}`
                        }
                        src={`${MEMBER_PROFILE_PIC}/${memberProfile.member_pic}`}
                        alt="Member photo"
                        layout="fill"
                        className={styles['profile__pic']}
                      />
                    ) : memberProfile.google_pic ? (
                      <Image
                        src={memberProfile.google_pic}
                        alt="Google member photo"
                        layout="fill"
                        className={styles['profile__pic']}
                      />
                    ) : (
                      <Image
                        src={defaultProfilePic}
                        alt="Default Member photo"
                        layout="fill"
                        className={styles['profile__pic']}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles['profile__training-info']}>
              <p className={styles['profile__subsection-title']}>健身資訊</p>
              <div className={styles['profile__subsection-contents']}>
                <div className={styles['profile__info-box']}>
                  <p className={styles['profile__item']}>健身頻率</p>
                  <p className={styles['profile__member-info']}>
                    {memberProfile.member_frequency === 1
                      ? '每兩週 1 次以下'
                      : memberProfile.member_frequency === 2
                      ? '每週 1 次'
                      : memberProfile.member_frequency === 3
                      ? '每週 2 次'
                      : memberProfile.member_frequency === 4
                      ? '每週 3 次'
                      : memberProfile.member_frequency === 5
                      ? '每週 5 次以上'
                      : ''}
                  </p>
                </div>
                <div className={styles['profile__info-box']}>
                  {/* TODO: Add details about intensity and frequency */}
                  <p className={styles['profile__item']}>健身經驗</p>
                  <p className={styles['profile__member-info']}>
                    {memberProfile.member_intensity === 1
                      ? '無'
                      : memberProfile.member_intensity === 2
                      ? '初學 - 6 個月'
                      : memberProfile.member_intensity === 3
                      ? '普通 - 1 年'
                      : memberProfile.member_intensity === 4
                      ? '熟練 - 3 年'
                      : memberProfile.member_intensity === 5
                      ? '專業 - 5 年以上'
                      : ''}
                  </p>
                </div>
                <div className={styles['profile__info-box']}>
                  <p className={styles['profile__item']}>身高</p>
                  <p className={styles['profile__member-info']}>
                    {memberProfile.member_height
                      ? `${memberProfile.member_height} cm`
                      : ''}
                  </p>
                </div>
                <div className={styles['profile__info-box']}>
                  <p className={styles['profile__item']}>體重</p>
                  <p className={styles['profile__member-info']}>
                    {memberProfile.member_weight
                      ? `${memberProfile.member_weight} kg`
                      : ''}
                  </p>
                </div>
              </div>
            </div>

            <div className={styles['profile__contact-info']}>
              <p className={styles['profile__subsection-title']}>聯絡資訊</p>
              <div className={styles['profile__subsection-contents']}>
                <div className={styles['profile__info-box']}>
                  <p className={styles['profile__item']}>電子郵件</p>
                  <p className={styles['profile__member-info']}>
                    {memberProfile.member_email}
                  </p>
                </div>
                <div className={styles['profile__info-box']}>
                  <p className={styles['profile__item']}>手機</p>
                  <p className={styles['profile__member-info']}>
                    {memberProfile.member_mobile}
                  </p>
                </div>
                <div className={styles['profile__info-box']}>
                  <p className={styles['profile__item']}>地址</p>
                  <p className={styles['profile__member-info']}>
                    {memberCity &&
                    memberDistrict &&
                    memberProfile.member_address
                      ? `${memberCity}${memberDistrict}${memberProfile.member_address}`
                      : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* <div className={styles['profile__bio']}>
              <p className={styles['profile__subsection-title']}>自我介紹</p>
              <div className={styles['profile__subsection-contents']}>
                <div className={styles['profile__info-box']}>
                  <p className={styles['profile__member-info']}>
                    {memberProfile.member_bio}
                  </p>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </section>
      <section className={styles['profile__member-info']}>
        <div
          className={`${styles['container']} ${styles['profile__member-info-container']}`}
        >
          <div className={styles['profile__member-info-area']}>
            <div className={styles['profile__account-info']}>
              <p className={styles['profile__subsection-title']}>帳號資訊</p>
              <div className={styles['profile__subsection-wrapper']}>
                <div className={styles['profile__subsection-contents']}>
                  <div className={styles['profile__info-box']}>
                    <p className={styles['profile__item']}>帳號</p>
                    <p className={styles['profile__member-info']}>
                      {memberProfile.member_username
                        ? memberProfile.member_username
                        : 'N/A'}
                    </p>
                  </div>
                  <div className={styles['profile__info-box']}>
                    <p className={styles['profile__item']}>暱稱</p>
                    <p className={styles['profile__member-info']}>
                      {memberProfile.member_nickname}
                    </p>
                  </div>
                  <div className={styles['profile__info-box']}>
                    <p className={styles['profile__item']}>密碼</p>
                    <p className={styles['profile__member-info']}>
                      ************
                    </p>
                    {/* TODO: Vertically align */}
                  </div>
                </div>
                <div className={styles['profile__button-container']}>
                  <button className={styles['placeholder-button']} disabled>
                    變更
                  </button>
                  <button>變更</button>
                  <button>變更</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
