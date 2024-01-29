import { useState, useEffect, useContext } from 'react'
import {
  MEMBER_PROFILE,
  MEMBER_ADDRESS_CITY_DISTRICT,
  MEMBER_PROFILE_PIC,
} from '@/configs/index'
import { useRouter } from 'next/router'
import styles from '@/styles/member/profile.module.css'
import stylesEdit from '@/styles/member/profile-edit.module.css'
import dayjs from 'dayjs'
import AuthContext from '@/context/auth-context'
import Link from 'next/link'
import Image from 'next/image'
import defaultProfilePic from '@/public/member/empty-profile-pic.png'
import { FaCamera } from 'react-icons/fa'
import { MEMBER_SIGNUP } from '@/configs/index'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

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
  // const memberBirthday = dayjs(memberProfile.member_birthday)

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

  // TITLE: UPDATE MEMBER INFORMATION
  // console.log(memberProfile.member_birthday)

  const memberBirthday = dayjs(memberProfile.member_birthday).format(
    'YYYY-MM-DD'
  )

  const [updateForm, setUpdateForm] = useState({
    name: memberProfile.member_name,
    gender: memberProfile.member_gender,
    birthday: memberBirthday,
    trainingFrequency: memberProfile.member_frequency,
    trainingIntensity: memberProfile.member_Intensity,
    height: memberProfile.member_height,
    weight: memberProfile.member_weight,
    email: memberProfile.member_email,
    mobile: memberProfile.member_mobile,
  })
  console.log(updateForm)

  // NOTE: Displaying member info
  useEffect(() => {
    setUpdateForm({
      name: memberProfile.member_name,
      gender: memberProfile.member_gender,
      birthday: memberBirthday,
      trainingFrequency: memberProfile.member_frequency,
      trainingIntensity: memberProfile.member_Intensity,
      height: memberProfile.member_height,
      weight: memberProfile.member_weight,
      email: memberProfile.member_email,
      mobile: memberProfile.member_mobile,
    })
  }, [memberProfile])

  const handleChange = (e) => {
    const { name, id, value } = e.target

    setUpdateForm((prev) => ({
      ...prev,
      [name || id]: value,
    }))
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    const memberID = +router.query.member_id

    const resUpdate = await fetch(
      'http://localhost:3002/member/profile/update-info/api',
      {
        method: 'POST',
        body: JSON.stringify({ ...updateForm, memberID: memberID }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    const resUpdateData = await resUpdate.json()

    // NOTE: Profile img update
    const formdata = new FormData()
    formdata.append('image', profileImg)
    // NOTE: Field name set to 'image'
    formdata.append('memberID', memberID)

    const resUpdateImg = await fetch(
      'http://localhost:3002/member/profile/update-profile-pic/api',
      {
        method: 'POST',
        body: formdata,
      }
    )

    const resUpdateImgData = await resUpdateImg.json()

    if (resUpdateData.success && resUpdateImgData.success) {
      router.push(`/member/profile/${auth.id}`).then(() => {
        // NOTE: Reload the page "after" redirection
        window.location.reload()
      })
      // NOTE: Full page reload to sync user menu avatar
    }
  }

  const [startDate, setStartDate] = useState(new Date())

  // TITLE: IMG UPLOAD
  const [profileImg, setProfileImg] = useState('')
  const [selectedImg, setSelectedImg] = useState('')

  function handleImgUpload(e) {
    setProfileImg(e.target.files[0])
  }

  useEffect(() => {
    if (profileImg) {
      const tempImgUrl = URL.createObjectURL(profileImg)
      setSelectedImg(tempImgUrl)
    }
  }, [profileImg])

  return (
    <div className={`${styles['profile']} ${stylesEdit['profile']}`}>
      <div className={styles['profile__top']}>
        <p className={styles['profile__breadcrumbs']}>會員中心/會員資料</p>
        <Link href={`/member/profile/${auth.id}`}>
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
              className={`${styles['profile__edit-button']} ${stylesEdit['hide']}`}
            >
              編輯資料
            </button>
            <form onSubmit={handleUpdate}>
              <div className={styles['profile__subsection-wrapper2']}>
                <p className={styles['profile__subsection-title']}>基本資訊</p>
                <div className={styles['profile__subsection-wrapper']}>
                  <div className={styles['profile__basic-info']}>
                    <div className={styles['profile__subsection-contents']}>
                      <div className={styles['profile__info-box']}>
                        <p className={styles['profile__item']}>姓名</p>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={updateForm.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className={styles['profile__info-box']}>
                        <p className={styles['profile__item']}>性別</p>
                        <select
                          name="gender"
                          id="gender"
                          value={updateForm.gender}
                          onChange={handleChange}
                        >
                          <option value="">--請選擇性別--</option>
                          <option value="M">男</option>
                          <option value="F">女</option>
                          <option value="N">其他</option>
                        </select>
                      </div>
                      <div className={styles['profile__info-box']}>
                        <p className={styles['profile__item']}>生日</p>
                        <input
                          type="date"
                          name="birthday"
                          id="birthday"
                          value={updateForm.birthday}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles['profile__pic-container']}>
                    <div className={styles['profile__pic-frame']}>
                      {selectedImg ? (
                        <Image
                          src={selectedImg}
                          alt="Uploaded photo"
                          layout="fill"
                          className={styles['profile__pic']}
                        />
                      ) : memberProfile.member_pic ? (
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
                      <label
                        className={stylesEdit['profile-img-upload']}
                        htmlFor="img-upload"
                      >
                        <FaCamera
                          className={stylesEdit['profile-img-upload-icon']}
                        />
                      </label>
                      <input
                        type="file"
                        className={stylesEdit['profile-img-upload-input']}
                        id="img-upload"
                        onChange={handleImgUpload}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles['profile__training-info']}>
                <p className={styles['profile__subsection-title']}>健身資訊</p>
                <div className={styles['profile__subsection-contents']}>
                  <div className={styles['profile__info-box']}>
                    <p className={styles['profile__item']}>健身頻率</p>
                    <select
                      name="trainingFrequency"
                      id="trainingFrequency"
                      value={updateForm.trainingFrequency}
                      onChange={handleChange}
                    >
                      <option value="">--請選擇健身頻率--</option>
                      <option value={1}>每兩週 1 次以下</option>
                      <option value={2}>每週 1 次</option>
                      <option value={3}>每週 2 次</option>
                      <option value={4}>每週 3 次</option>
                      <option value={5}>每週 5 次以上</option>
                    </select>
                  </div>
                  <div className={styles['profile__info-box']}>
                    {/* TODO: Add details about intensity and frequency */}
                    <p className={styles['profile__item']}>健身經驗</p>
                    <select
                      name="trainingIntensity"
                      id="trainingIntensity"
                      value={updateForm.trainingIntensity}
                      onChange={handleChange}
                    >
                      <option value="">--請選擇健身經驗--</option>
                      <option value={1}>無</option>
                      <option value={2}>初學 - 6 個月</option>
                      <option value={3}>普通 - 1 年</option>
                      <option value={4}>熟練 - 3 年</option>
                      <option value={5}>專業 - 5 年以上</option>
                    </select>
                  </div>
                  <div className={styles['profile__info-box']}>
                    <p className={styles['profile__item']}>身高(cm)</p>
                    <input
                      type="number"
                      name="height"
                      id="height"
                      value={updateForm.height}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles['profile__info-box']}>
                    <p className={styles['profile__item']}>體重(kg)</p>
                    <input
                      type="number"
                      name="weight"
                      id="weight"
                      value={updateForm.weight}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className={styles['profile__contact-info']}>
                <p className={styles['profile__subsection-title']}>聯絡資訊</p>
                <div className={styles['profile__subsection-contents']}>
                  <div className={styles['profile__info-box']}>
                    <p className={styles['profile__item']}>電子郵件</p>
                    <input
                      type="text"
                      name="email"
                      id="email"
                      value={updateForm.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles['profile__info-box']}>
                    <p className={styles['profile__item']}>手機</p>
                    <input
                      type="text"
                      name="mobile"
                      id="mobile"
                      value={updateForm.mobile}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles['profile__info-box']}>
                    <p className={styles['profile__item']}>地址</p>
                    <input
                      value={
                        memberCity &&
                        memberDistrict &&
                        memberProfile.member_address
                          ? `${memberCity}${memberDistrict}${memberProfile.member_address}`
                          : ''
                      }
                    />
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

              <div className={stylesEdit['edit-button-container']}>
                <Link href={`/member/profile/${auth.id}`}>
                  <button className={stylesEdit['edit-button']}>取消</button>
                </Link>
                <button
                  className={stylesEdit['edit-button']}
                  type="submit"
                  onClick={handleUpdate}
                >
                  儲存
                </button>
              </div>
            </form>
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
                      {memberProfile.member_username}
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
