import styles from '@/styles/member/login.module.css'
import { useState, useRef, useEffect, useContext } from 'react'
import Image from 'next/image'
import googleIcon from '@/public/member/google-login.svg'
// TODO: Capital letters
// NOTE: Only works when imported
import emptyProfilePic from '@/public/member/empty-profile-pic.png'
// NOTE: Again, only works when IMPORTED!
import { MEMBER_SIGNUP } from '@/configs/index'
// TODO: Adjust naming
import { z } from 'zod'
import { useRouter } from 'next/router'
import Select from 'react-select'
import { FaCheck } from 'react-icons/fa'
import { ImCross } from 'react-icons/im'
import { FaCamera } from 'react-icons/fa'
import { MEMBER_ADDRESS_CITY } from '@/configs/index'
import AuthContext from '@/context/auth-context'
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  signInWithPopup,
} from 'firebase/auth'
// Q: Learn more
import Link from 'next/link'
import ModalResetPass from '@/components/member/modal/modal-reset-pass'
import { OtpContextProvider } from '@/context/otp-context'
import ModalRegisterComplete from '@/components/member/modal/modal-register-complete'
import ModalLoginComplete from '@/components/member/modal/modal-login-complete'
import { FaDumbbell } from 'react-icons/fa'

export default function LoginArea() {
  // TITLE: GENDER SELECT
  const genderOptions = [
    { value: 'M', label: '男' },
    { value: 'F', label: '女' },
    { value: 'N', label: '其他' },
  ]

  const selectStyles = {
    control: (styles) => ({
      ...styles,
      ':hover': { border: '3px solid var(--white-color)' },
      // ':focus': { border: '3px solid var(--white-color)' },
      boxShadow: 'none',
      // NOTE: Found answer on Stack Overflow
      // NOTE: See "Inner Components" in documentation
      backgroundColor: 'var(--black-color)',
      width: '80%',
      margin: 'auto',
      border: '3px solid var(--g2-color)',
      height: '40px',
    }),
    menu: (styles) => ({
      ...styles,
      width: '80%',
      margin: '0.25rem 0 0 2.25rem',
      backgroundColor: 'var(--black-color)',
    }),
    option: (styles) => ({
      ...styles,
      backgroundColor: 'var(--black-color)',
      color: 'var(--g2-color)',
      height: '40px',
      textAlign: 'center',
      ':hover': {
        backgroundColor: 'var(--g2-color)',
        color: 'var(--g4-color)',
      },
    }),
    indicatorSeparator: (styles) => ({
      ...styles,
      backgroundColor: 'var(--black-color)',
    }),

    indicatorsContainer: (styles) => ({
      ...styles,
      height: '40px',
    }),

    placeholder: (styles) => ({
      ...styles,
      color: 'var(--g2-color)',
      height: '30px',
    }),

    singleValue: (styles) => ({
      ...styles,
      color: 'var(--g2-color)',
      height: '30px',
    }),

    dropdownIndicator: (styles) => ({
      ...styles,
      color: 'var(--g2-color)',
      ':hover': { color: 'var(--g2-color)' },
    }),
  }

  // TITLE: CITY AND DISTRICT SELECT

  const [cityOptions, setCityOptions] = useState([])

  useEffect(() => {
    fetch(MEMBER_ADDRESS_CITY)
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) {
          router.push('/member/login')
          // TODO: Error handling
        } else {
          const newCityOptions = data.addressInfo.map((address) => ({
            value: +address.sid,
            label: address.district,
          }))
          setCityOptions(newCityOptions)
          console.log([...cityOptions])
        }
      })
      .catch((ex) => console.log(ex))
  }, [])

  // TITLE: DROPDOWN MENU OPTION STATES
  const [selectedGenderOption, setSelectedGenderOption] = useState(null)
  const [selectedCityOption, setSelectedCityOption] = useState(null)
  const [selectedDistrictOption, setSelectedDistrictOption] = useState(null)
  const [districtOptions, setDistrictOptions] = useState([])

  useEffect(() => {
    if (selectedCityOption) {
      fetch(`${MEMBER_ADDRESS_CITY}/${selectedCityOption.value}`)
        .then((r) => r.json())
        .then((data) => {
          if (!data.success) {
            router.push('/member/login')
            // TODO: Error handling
          } else {
            const newDistrictOptions = data.addressInfo.map((address) => ({
              value: +address.sid,
              label: address.district,
            }))
            setDistrictOptions(newDistrictOptions)
          }
        })
        .catch((ex) => console.log(ex))
    }
  }, [selectedCityOption])

  const selectStylesShort = {
    container: (styles) => ({
      ...styles,
      width: '48%',
    }),

    control: (styles) => ({
      ...styles,
      ':hover': { border: '3px solid var(--white-color)' },
      ':focus': { border: 'none', outline: 'none' },
      boxShadow: 'none',
      backgroundColor: 'var(--black-color)',
      width: '100%',
      margin: 'auto',
      border: '3px solid var(--g2-color)',
      // height: '40px',
    }),
    menu: (styles) => ({
      ...styles,
      width: '100%',
      margin: '0.25rem 0 0 0rem',
      backgroundColor: 'var(--black-color)',
    }),
    menuPortal: (styles) => ({
      ...styles,
      zIndex: 999,
      // NOTE: Dropdown menu
    }),
    option: (styles) => ({
      ...styles,
      backgroundColor: 'var(--black-color)',
      color: 'var(--g2-color)',
      // height: '40px',
      textAlign: 'center',
      ':hover': {
        backgroundColor: 'var(--g2-color)',
        color: 'var(--g4-color)',
      },
    }),
    indicatorSeparator: (styles) => ({
      ...styles,
      backgroundColor: 'var(--black-color)',
    }),

    indicatorsContainer: (styles) => ({
      ...styles,
      // height: '40px',
    }),

    placeholder: (styles) => ({
      ...styles,
      color: 'var(--g2-color)',
      // height: '30px',
    }),

    singleValue: (styles) => ({
      ...styles,
      color: 'var(--g2-color)',
      // height: '30px',
    }),

    dropdownIndicator: (styles) => ({
      ...styles,
      color: 'var(--g2-color)',
      ':hover': { color: 'var(--g2-color)' },
    }),

    input: (styles) => ({
      ...styles,
      height: '40px',
      padding: '0',
      color: 'white',
    }),
  }

  // NOTE: Getting menuPortal (react-select) to work
  const menuPortalRef = useRef(null)

  useEffect(() => {
    if (menuPortalRef.current && document.body) {
      menuPortalRef.current = document.body
    }
  }, [])

  // TITLE: IMG UPLOAD
  const [profileImg, setProfileImg] = useState('')
  const [selectedImg, setSelectedImg] = useState('')

  function handleImgUpload(e) {
    setProfileImg(e.target.files[0])
    // NOTE: The first file in an array
  }

  useEffect(() => {
    if (profileImg) {
      const tempImgUrl = URL.createObjectURL(profileImg)
      // NOTE: Temporary URL that represents the uploaded img
      // NOTE: Can't be null when using next/image
      setSelectedImg(tempImgUrl)
    } else {
      setSelectedImg('/public/member/empty-profile-pic.png')
      // NOTE: Default image
    }
  }, [profileImg])
  // NOTE: Prevents image upload delay due to asynchronous nature

  // TITLE: SIGN IN
  const router = useRouter()

  const usernameValDisplay = useRef(null)
  const passValDisplay = useRef(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { setAuth } = useContext(AuthContext)

  const sendLoginForm = async (e) => {
    e.preventDefault()
    console.log('begin sign in process')
    const r = await fetch('http://localhost:3002/member/signin', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await r.json()
    if (data.success) {
      console.log('fetch success')
      const { id, username, nickname, token } = data
      // localStorage.setItem(
      //   'fyt-auth',
      //   JSON.stringify({ id, username, nickname, token })
      // )
      document.cookie = `accessToken=${token}; path=/`
      setAuth({ id, username, nickname, token })
      // alert('登入成功')
      setLoginComplete(true)
      setTimeout(() => {
        router.push(`/member/${id}`)
      }, 2000)
    } else {
      usernameValDisplay.current.innerText = data.accountMessage
      passValDisplay.current.innerText = data.passMessage
    }
  }

  // TITLE: LOGIN AUTOFILL
  function handleAutofill() {
    setUsername('cocochanel630')
    setPassword('Cocochanel630!')
  }

  // TITLE: GOOGLE LOGIN
  const firebaseConfig = {
    apiKey: 'AIzaSyBZj9ODw7R69eWEexX40syAZskj_VW0D0o',
    authDomain: 'freefyt-react.firebaseapp.com',
    projectId: 'freefyt-react',
    storageBucket: 'freefyt-react.appspot.com',
    messagingSenderId: '181249328555',
    appId: '1:181249328555:web:99a6a0dbe3803490b03eee',
  }

  const handleGoogleLogin = async () => {
    try {
      const app = initializeApp(firebaseConfig)
      const auth = getAuth(app)
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)

      // NOTE: Access user info
      const { uid, displayName, email, photoURL } = result.user

      const response = await fetch(
        'http://localhost:3002/member/signin/google',
        {
          method: 'POST',
          body: JSON.stringify({
            providerData: {
              uid,
              displayName,
              email,
              photoURL,
              providerId: 'google.com',
            },
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      const data = await response.json()

      if (data.status === 'success') {
        const { id, username, token } = data.data
        // localStorage.setItem(
        //   'fyt-auth',
        //   JSON.stringify({ id, username, token })
        // )
        document.cookie = `accessToken=${token}; path=/`
        setAuth({ id, username, token })
        // alert('登入成功')
        setLoginComplete(true)
        setTimeout(() => {
          router.push(`/member/${id}`)
        }, 2000)
      } else {
        alert('登入失敗')
        console.error(data.message)
      }
    } catch (ex) {
      console.error(ex)
    }
  }

  const [rightActive, setRightActive] = useState(false)
  // const [rightActive2, setRightActive2] = useState(false)
  const [scrollLength, setScrollLength] = useState(26.6)
  // NOTE: 1.33 * ( 100 / panes )
  const [scrollLength2, setScrollLength2] = useState(0)
  // TODO: Clear up naming!
  // NOTE: scrollLength is for register panels, scrollLength2 is for the login panel
  const [signUpOpacity, setSignUpOpacity] = useState(1)
  const [signUpOpacity2, setSignUpOpacity2] = useState(1)
  const [signUpOpacity3, setSignUpOpacity3] = useState(1)
  const [signUpOpacity4, setSignUpOpacity4] = useState(1)

  const [signUpForm, setSignUpForm] = useState({
    username: '',
    password: '',
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
    profileImg: '',
  })

  const handleChange = (e, selectFieldName) => {
    const { name, id, value, label } = e.target || {
      name: selectFieldName,
      value: e.value,
      label: e.label,
    }
    // NOTE: "name" of target is not the same as signUpForm.name

    setSignUpForm((prev) => ({
      ...prev,
      [id || name]: value,
    }))

    if (selectFieldName === 'gender') {
      setSelectedGenderOption({ value, label })
      genderValDisplay.current.innerText = ''
    } else if (selectFieldName === 'city') {
      setSelectedCityOption({ value, label })
    } else if (selectFieldName === 'district') {
      setSelectedDistrictOption({ value, label })
    } else if (e.target.name === 'name') {
      console.log('yay')
      nameValDisplay.current.innerText = ''
    } else if (e.target.name === 'birthday') {
      birthdayValDisplay.current.innerText = ''
    } else if (e.target.name === 'email') {
      emailValDisplay.current.innerText = ''
    }

    // setSignUpForm({ ...signUpForm, [id]: value })
    // NOTE: Update inserted value

    // console.log(signUpForm)
    // NOTE: Does not keep up because setSignUpForm is asynchronous
  }

  const [confirmPass, setConfirmPass] = useState('')

  const confirmPassChange = (e) => {
    setConfirmPass(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const resSignUp = await fetch(MEMBER_SIGNUP, {
      method: 'POST',
      body: JSON.stringify(signUpForm),
      headers: {
        'Content-Type': 'application/json',
        // NOTE: JSON vs JSON-formatted string
      },
    })

    const resSignUpData = await resSignUp.json()

    // NOTE: Profile img upload
    const formdata = new FormData()
    formdata.append('image', profileImg)
    // NOTE: Field name set to 'image'

    console.log('profileImg:', profileImg)

    const resImg = await fetch(`${MEMBER_SIGNUP}/profileimg`, {
      method: 'POST',
      body: formdata,
    })

    const resImgData = await resImg.json()

    console.log('resImgData:', resImgData)

    if (
      resSignUpData.success &&
      (!profileImg || (profileImg && resImgData.success))
      // NOTE: No profile pic was uploaded OR a profile pic was uploaded and was successfully processed
    ) {
      // alert('註冊成功')
      // TODO: Set display info
      const r = await fetch('http://localhost:3002/member/signin', {
        method: 'POST',
        body: JSON.stringify({
          username: signUpForm.username,
          password: signUpForm.password,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await r.json()

      console.log('signin response data:', data)

      if (data.success) {
        const { id, username, nickname, token } = data
        // localStorage.setItem(
        //   'fyt-auth',
        //   JSON.stringify({ id, username, nickname, token })
        // )
        document.cookie = `accessToken=${token}; path=/`
        setAuth({ id, username, nickname, token })
        const memberID = resSignUpData.memberID
        setTimeout(() => {
          router.push(`/member/${memberID}`)
        }, 2000)
        // NOTE: At least 2 seconds for the success animation to finish
      }
    } else {
      alert('註冊失敗')
      // TODO: Error handling
    }
  }

  // NOTE: For toggling rightActive state
  function handleRightActive() {
    setRightActive((prev) => !prev)
    setScrollLength(scrollLength === 26.6 ? 20 : 26.6)
    setScrollLength2(scrollLength2 ? 0 : 30)
    setTimeout(resetSignUpOpacity, 500)
    // NOTE: Still not sure why it works the other way around
  }

  // NOTE: Resetting opacity of all sign up panels
  function resetSignUpOpacity() {
    setSignUpOpacity(1)
    setSignUpOpacity2(1)
    setSignUpOpacity3(1)
    setSignUpOpacity4(1)
  }

  // NOTE: Schemas for zod validation
  const nameSchema = z.coerce.string().refine((v) => v.trim() !== '', {
    message: '姓名為必填欄位',
  })
  const nameValidation = nameSchema.safeParse(signUpForm.name)
  const nameValDisplay = useRef(null)
  // NOTE: refine() means custom check
  // NOTE: trim() means trim whitespace
  // TODO: Check spaces between first and last name for English names

  const genderSchema = z.coerce.string().refine((v) => v !== '', {
    message: '性別為必填欄位',
  })
  const genderValidation = genderSchema.safeParse(signUpForm.gender)
  const genderValDisplay = useRef(null)

  const birthdaySchema = z.date()
  const birthdayValidation = birthdaySchema.safeParse(
    new Date(signUpForm.birthday)
  )
  const birthdayValDisplay = useRef(null)

  // TODO: Overlay sliding should erase all filled form data and error messages
  function handleRightActive2() {
    if (nameValidation.success) {
      nameValDisplay.current.innerText = ''
      // genderValDisplay.current.innerText = ''
      // birthdayValDisplay.current.innerText = ''
      setScrollLength(0)
      setSignUpOpacity(signUpOpacity ? 0 : 1)
    } else {
      if (!nameValidation.success) {
        const nameErrorMsg = nameValidation.error.errors[0].message
        // NOTE: Acquiring the error message
        nameValDisplay.current.innerText = nameErrorMsg
        // NOTE: Current property
      } else {
        nameValDisplay.current.innerText = ''
      }

      // if (!genderValidation.success) {
      //   const genderErrorMsg = genderValidation.error.errors[0].message
      //   genderValDisplay.current.innerText = genderErrorMsg
      // } else {
      //   genderValDisplay.current.innerText = ''
      // }

      // if (!birthdayValidation.success) {
      //   const birthdayErrorMsg = birthdayValidation.error.errors[0].message
      //   birthdayValDisplay.current.innerText = `${
      //     birthdayErrorMsg === 'Invalid date' ? '生日為必填欄位' : ''
      //   }`
      // } else {
      //   birthdayValDisplay.current.innerText = ''
      // }
    }
  }

  const emailSchema = z.coerce.string().email({
    message: '格式不符，請重新輸入E-mail！',
  })
  const emailValidation = emailSchema.safeParse(signUpForm.email)
  const emailValDisplay = useRef(null)

  const mobileSchema = z.coerce.string().refine(
    (v) => {
      return v === '' || /^09\d{8}$/.test(v)
      // NOTE: Regular expression returns boolean
    },
    {
      message: '格式不符，請重新輸入或留空！',
    }
  )
  const mobileValidation = mobileSchema.safeParse(signUpForm.mobile)
  const mobileValDisplay = useRef(null)

  // TODO: Change opacity to display:none?
  function handleRightActive3() {
    if (emailValidation.success && mobileValidation.success) {
      emailValDisplay.current.innerText = ''
      mobileValDisplay.current.innerText = ''
      setScrollLength(-20)
      setSignUpOpacity2(signUpOpacity2 ? 0 : 1)
    } else {
      if (!emailValidation.success && signUpForm.email !== '') {
        const emailErrorMsg = emailValidation.error.errors[0].message
        emailValDisplay.current.innerText = emailErrorMsg
      } else if (!emailValidation.success && signUpForm.email === '') {
        emailValDisplay.current.innerText = '此欄為必填欄位'
      } else {
        emailValDisplay.current.innerText = ''
      }
      if (!mobileValidation.success) {
        const mobileErrorMsg = mobileValidation.error.errors[0].message
        mobileValDisplay.current.innerText = mobileErrorMsg
      } else {
        mobileValDisplay.current.innerText = ''
      }
    }
  }
  // TODO: Address validation?

  // TITLE: ZOD SCHEMAS FOR USERNAME VALIDATION
  const usernameLengthSchema = z.coerce.string().refine((v) => {
    return /^.{8,16}$/.test(v)
  })
  const usernameEnglishSchema = z.coerce.string().refine((v) => {
    return /[a-zA-Z]/.test(v)
  })
  const usernameNumSchema = z.coerce.string().refine((v) => {
    return /[0-9]+/.test(v)
  })
  const usernameSpecialSchema = z.coerce.string().refine((v) => {
    return /[^a-zA-Z0-9]+/.test(v)
  })

  // TITLE: ZOD SCHEMAS FOR PASSWORD VALIDATION
  const passLengthSchema = z.coerce.string().refine((v) => {
    return /^.{8,20}$/.test(v)
  })
  const passEnglishSchema = z.coerce.string().refine((v) => {
    return /[a-z]/.test(v) && /[A-Z]/.test(v)
    // NOTE: Must have both uppercase and lowercase letters
  })
  const passNumSchema = z.coerce.string().refine((v) => {
    return /[0-9]+/.test(v)
  })
  const passSpecialSchema = z.coerce.string().refine((v) => {
    return /[^a-zA-Z0-9]+/.test(v)
  })

  // TITLE: USERNAME INDIVIDUAL CRITERIA VALIDATION
  const usernameLengthValidation = usernameLengthSchema.safeParse(
    signUpForm.username
  )
  const usernameEnglishValidation = usernameEnglishSchema.safeParse(
    signUpForm.username
  )
  const usernameNumValidation = usernameNumSchema.safeParse(signUpForm.username)
  const usernameSpecialValidation = usernameSpecialSchema.safeParse(
    signUpForm.username
  )

  // TITLE: PASSWORD INDIVIDUAL CRITERIA VALIDATION
  const passLengthValidation = passLengthSchema.safeParse(signUpForm.password)
  const passEnglishValidation = passEnglishSchema.safeParse(signUpForm.password)
  const passNumValidation = passNumSchema.safeParse(signUpForm.password)
  const passSpecialValidation = passSpecialSchema.safeParse(signUpForm.password)

  // TITLE: VALIDATION RESULTS
  const [usernameRules, setUsernameRules] = useState({
    ruleA: false,
    ruleB: false,
    ruleC: false,
    ruleD: false,
  })
  const [passRules, setPassRules] = useState({
    ruleA: false,
    ruleB: false,
    ruleC: false,
    ruleD: false,
  })

  useEffect(() => {
    if (usernameLengthValidation.success) {
      setUsernameRules((prev) => ({ ...prev, ruleA: true }))
    } else {
      setUsernameRules((prev) => ({ ...prev, ruleA: false }))
      // NOTE: Also false after 20 characters
    }
    if (usernameEnglishValidation.success) {
      setUsernameRules((prev) => ({ ...prev, ruleB: true }))
    } else {
      setUsernameRules((prev) => ({ ...prev, ruleB: false }))
    }
    if (usernameNumValidation.success) {
      setUsernameRules((prev) => ({ ...prev, ruleC: true }))
    } else {
      setUsernameRules((prev) => ({ ...prev, ruleC: false }))
    }
    if (usernameSpecialValidation.success) {
      setUsernameRules((prev) => ({ ...prev, ruleD: true }))
    } else {
      setUsernameRules((prev) => ({ ...prev, ruleD: false }))
    }

    if (
      (usernameLengthValidation.success &&
        usernameEnglishValidation.success &&
        usernameNumValidation.success &&
        !usernameSpecialValidation.success) ||
      (signUpForm.password &&
        !passLengthValidation.success &&
        !passEnglishValidation.success &&
        !passNumValidation.success &&
        !passSpecialValidation.success) ||
      passRulesBox === `${styles['validation-rules']}`
    ) {
      setUsernameRulesBox(`${styles['validation-rules-hide']}`)
      setUsernameRulesWrapper(` ${styles['validation-rules-wrapper-hide']}`)
    } else {
      setUsernameRulesBox(`${styles['validation-rules']}`)
      setUsernameRulesWrapper(`${styles['validation-rules-wrapper']}`)
    }

    // TODO: Set maximum length instead of validating
    if (passLengthValidation.success) {
      setPassRules((prev) => ({ ...prev, ruleA: true }))
    } else {
      setPassRules((prev) => ({ ...prev, ruleA: false }))
    }
    if (passEnglishValidation.success) {
      setPassRules((prev) => ({ ...prev, ruleB: true }))
    } else {
      setPassRules((prev) => ({ ...prev, ruleB: false }))
    }
    if (passNumValidation.success) {
      setPassRules((prev) => ({ ...prev, ruleC: true }))
    } else {
      setPassRules((prev) => ({ ...prev, ruleC: false }))
    }
    if (passSpecialValidation.success) {
      setPassRules((prev) => ({ ...prev, ruleD: true }))
    } else {
      setPassRules((prev) => ({ ...prev, ruleD: false }))
    }

    if (
      (passLengthValidation.success &&
        passEnglishValidation.success &&
        passNumValidation.success &&
        passSpecialValidation.success) ||
      (signUpForm.username &&
        !usernameLengthValidation.success &&
        !usernameEnglishValidation.success &&
        !usernameNumValidation.success &&
        usernameSpecialValidation.success) ||
      usernameRulesBox === `${styles['validation-rules']}`
      // NOTE: Hide password rules display box when typing username while it hasn't passed validation or when username rules display box is showing
    ) {
      setPassRulesBox(`${styles['validation-rules-hide']}`)
      setPassRulesWrapper(` ${styles['validation-rules-wrapper-hide']}`)
    } else {
      setPassRulesBox(`${styles['validation-rules']}`)
      setPassRulesWrapper(`${styles['validation-rules-wrapper']}`)
    }
    // TODO: Refactor code
  }, [signUpForm.username, signUpForm.password])
  // NOTE: useEffect as solution to validation "one-keystroke-behind" delay

  // TODO: Password shouldn't match username

  function handleRightActive4() {
    if (
      usernameLengthValidation.success &&
      usernameEnglishValidation.success &&
      usernameNumValidation.success &&
      !usernameSpecialValidation.success &&
      passLengthValidation.success &&
      passEnglishValidation.success &&
      passNumValidation.success &&
      passSpecialValidation.success
    ) {
      setScrollLength(-40)
      setSignUpOpacity3(signUpOpacity3 ? 0 : 1)
    }
    // NOTE: usernameSpecialValidation.success operates differently on account of the way the regular expression is written
  }

  const [usernameRulesBox, setUsernameRulesBox] = useState(
    `${styles['validation-rules']}`
  )
  const [usernameRulesWrapper, setUsernameRulesWrapper] = useState(
    `${styles['validation-rules-wrapper']}`
  )
  const [passRulesBox, setPassRulesBox] = useState(
    `${styles['validation-rules-hide']}`
  )
  const [passRulesWrapper, setPassRulesWrapper] = useState(
    `${styles['validation-rules-wrapper-hide']}`
  )

  const usernameInput = useRef(null)
  const passwordInput = useRef(null)
  const passwordInput2 = useRef(null)

  useEffect(() => {
    function hideRules(e) {
      // TITLE: HIDES ONE BOX AND SHOWS ANOTHER
      if (
        !usernameInput.current.contains(e.target) &&
        (!passLengthValidation.success ||
          !passEnglishValidation.success ||
          !passNumValidation.success ||
          !passSpecialValidation.success)
      ) {
        setUsernameRulesBox(`${styles['validation-rules-hide']}`)
        setUsernameRulesWrapper(`${styles['validation-rules-wrapper-hide']}`)
        setPassRulesBox(`${styles['validation-rules']}`)
        setPassRulesWrapper(`${styles['validation-rules-wrapper']}`)
      } else {
        setPassRulesBox(`${styles['validation-rules-hide']}`)
        setPassRulesWrapper(`${styles['validation-rules-wrapper-hide']}`)
        setUsernameRulesBox(`${styles['validation-rules']}`)
        setUsernameRulesWrapper(`${styles['validation-rules-wrapper']}`)
      }
    }

    if (passwordInput.current) {
      passwordInput.current.addEventListener('click', hideRules)
    }
    // if (passwordInput2.current) {
    //   passwordInput2.current.addEventListener('click', hideRules)
    // }

    return () => {
      if (passwordInput.current) {
        passwordInput.current.removeEventListener('click', hideRules)
      }
      // if (passwordInput2.current) {
      //   passwordInput2.current.removeEventListener('click', hideRules)
      // }
    }
  }, [passwordInput, usernameInput])
  // TODO: Clean up! Understand why

  function showUsernameRules() {
    setUsernameRulesBox(`${styles['validation-rules']}`)
    setUsernameRulesWrapper(`${styles['validation-rules-wrapper']}`)
    setPassRulesBox(`${styles['validation-rules-hide']}`)
    setPassRulesWrapper(`${styles['validation-rules-wrapper-hide']}`)
  }

  function handleRightActive5() {
    setScrollLength(-60)
    setSignUpOpacity4(signUpOpacity4 ? 0 : 1)
  }

  // NOTE: CSS classes based on rightActive state
  const loginAreaClass = `${styles['login__area']} ${
    rightActive && styles['right-active']
  }`

  /*
  const signUpClass = `${styles['login__panel']} ${styles['sign-up']} ${
    rightActive2 && styles['scroll-right']
  }`
  */

  const scrollStyle = {
    transform: `translateX(${scrollLength}%)`,
    opacity: `${scrollLength === 26.6 ? 0 : 1}`,
  }

  const scrollStyle2 = {
    transform: `translateX(${scrollLength2}%)`,
    opacity: `${scrollLength2 ? 0 : 1}`,
    pointerEvents: `${scrollLength2 ? 'none' : 'auto'}`,
    /* NOTE: Allow clicks to pass through this element */
  }

  // NOTE: Prevent form from being sent out on pressing enter
  const handleEnterPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
  }

  // NOTE: RECOVER PASSWORD
  const [modalOpened, setModalOpened] = useState(false)

  function handleModalClicked(e) {
    e.preventDefault()
    setModalOpened(true)
  }

  const [registerComplete, setRegisterComplete] = useState(false)

  function handleRegisterComplete() {
    setRegisterComplete(true)
  }

  const [loginComplete, setLoginComplete] = useState(false)

  // function handleLoginComplete() {
  //   setLoginComplete(true)
  // }

  const closeModal = () => {
    setModalOpened(false)
  }

  return (
    <div className={styles['login__section']}>
      <div className={styles['testing-area']}>
        {/* <button type="button" onClick={handleAutofill}>
          一鍵輸入
        </button> */}
      </div>
      <div className={styles['container']}>
        <div className={styles['login__container']}>
          {/* NOTE: rightActive state controls overlay slider */}
          <div className={loginAreaClass}>
            {/* <div className={styles['progress-bar']}>
              <div className={styles['progress-bar-node1']}></div>
              <div className={styles['progress-bar-node2']}></div>
              <div className={styles['progress-bar-node3']}></div>
              <div className={styles['progress-bar-node4']}></div>
              <div className={styles['progress-bar-node5']}></div>
            </div> */}
            <OtpContextProvider>
              {modalOpened && <ModalResetPass onClose={closeModal} />}
              {registerComplete && <ModalRegisterComplete />}
              {/* <ModalRegisterComplete /> */}
              {loginComplete && <ModalLoginComplete />}
              {/* {<ModalLoginComplete />} */}
            </OtpContextProvider>
            <div
              className={`${styles['login__panel']} ${styles['sign-in']}`}
              style={scrollStyle2}
            >
              <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                <FaDumbbell
                  size={30}
                  color="#fff"
                  cursor={'pointer'}
                  onClick={handleAutofill}
                />
              </div>
              <h4>登入</h4>
              <form
                className={styles['login__wrapper2']}
                onSubmit={sendLoginForm}
              >
                <div className={styles['login__username']}>
                  <div className={styles['login__label-wrapper']}>
                    <label htmlFor="username">帳號</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <p
                      ref={usernameValDisplay}
                      className={styles['display-msg']}
                    ></p>
                  </div>
                </div>
                <div className={styles['login__password']}>
                  <div className={styles['login__label-wrapper']}>
                    <label htmlFor="password">密碼</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <p
                      ref={passValDisplay}
                      className={styles['display-msg']}
                    ></p>
                  </div>
                  {/* TODO: Max characters? */}
                </div>
                {/* TODO: Remain logged in? */}
                <div className={styles['login__wrapper3']}>
                  <button
                    type="submit"
                    className={styles['login__login-button']}
                  >
                    登入
                  </button>
                  {/* TODO: Decide position */}
                  <button
                    className={styles['login__google-button']}
                    onClick={handleGoogleLogin}
                    type="button"
                  >
                    <div>使用</div>
                    <Image
                      src={googleIcon}
                      width={18}
                      height={26}
                      alt={'Google icon'}
                    />
                    <div>oogle帳戶登入</div>
                  </button>
                  <Link
                    href="#"
                    className={styles['login__forgot-pass']}
                    onClick={handleModalClicked}
                  >
                    忘記密碼
                  </Link>
                </div>
              </form>
            </div>
            <form
              className={`${styles['login__panel']} ${styles['sign-up']}`}
              style={scrollStyle}
              onSubmit={handleSubmit}
              onKeyPress={handleEnterPress}
            >
              <div
                className={styles['sign-up-wrapper']}
                style={{ opacity: signUpOpacity }}
              >
                <h4>註冊</h4>
                <div className={styles['login__wrapper']}>
                  {/* TODO: Outline and text turn white when focused */}
                  <div className={styles['login__name']}>
                    <div className={styles['login__label-wrapper']}>
                      <label htmlFor="name">
                        姓名*
                        {/* TODO: Fix area background color when selecting from previous inserted values */}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={signUpForm.name}
                        onChange={handleChange}
                      />
                      <p
                        ref={nameValDisplay}
                        className={styles['display-msg']}
                      ></p>
                    </div>
                  </div>
                  <div className={styles['login__nickname']}>
                    <div className={styles['login__label-wrapper']}>
                      <label htmlFor="nickname">暱稱</label>
                      <input
                        type="text"
                        id="nickname"
                        name="nickname"
                        value={signUpForm.nickname}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className={styles['login__gender']}>
                    <div className={styles['login__label-wrapper']}>
                      <label htmlFor="gender">性別*</label>
                      <Select
                        id="gender"
                        name="gender"
                        options={genderOptions}
                        defaultValue={selectedGenderOption}
                        value={selectedGenderOption}
                        onChange={(selectFieldName) =>
                          handleChange(selectFieldName, 'gender')
                        }
                        placeholder={
                          !selectedGenderOption
                            ? '請選擇性別'
                            : selectedGenderOption === 'M'
                            ? '男'
                            : selectedGenderOption === 'F'
                            ? '女'
                            : selectedGenderOption === 'N'
                            ? '其他'
                            : '--請選擇性別--'
                        }
                        styles={selectStyles}
                        isSearchable={false}
                      />
                      <p
                        ref={genderValDisplay}
                        className={styles['display-msg']}
                      ></p>
                    </div>
                  </div>
                  <div className={styles['login__birthday']}>
                    <div className={styles['login__label-wrapper']}>
                      <label htmlFor="birthday">生日*</label>
                      <input
                        type="date"
                        id="birthday"
                        name="birthday"
                        value={signUpForm.birthday}
                        onChange={handleChange}
                      />
                      <p
                        ref={birthdayValDisplay}
                        className={styles['display-msg']}
                      ></p>
                    </div>
                  </div>
                  <button
                    className={styles['login__next-button']}
                    onClick={handleRightActive2}
                    type="button"
                  >
                    下一步
                  </button>
                </div>
              </div>
              <div
                className={styles['sign-up-wrapper']}
                style={{ opacity: signUpOpacity2 }}
              >
                <h4>註冊</h4>
                <div className={styles['login__wrapper2']}>
                  {/* TODO: Outline and text turn white when focused */}
                  <div className={styles['login__email']}>
                    <div className={styles['login__label-wrapper']}>
                      <label htmlFor="email">E-mail*</label>
                      <input
                        type="text"
                        id="email"
                        name="email"
                        value={signUpForm.email}
                        onChange={handleChange}
                      />
                      <p
                        ref={emailValDisplay}
                        className={styles['display-msg']}
                      ></p>
                    </div>
                  </div>
                  <div className={styles['login__mobile']}>
                    <div className={styles['login__label-wrapper']}>
                      <label htmlFor="mobile">手機號碼</label>
                      <input
                        type="tel"
                        id="mobile"
                        name="mobile"
                        value={signUpForm.mobile}
                        onChange={handleChange}
                      />
                    </div>
                    <p ref={mobileValDisplay}></p>
                  </div>
                  <div className={styles['remove']}>
                    <div className={styles['login__address']}>
                      <div className={styles['login__label-wrapper']}>
                        <label htmlFor="address">地址</label>
                        <div className={styles['address-select-wrapper2']}>
                          <div
                            className={styles['address-select-wrapper']}
                            ref={menuPortalRef}
                          >
                            <Select
                              id="city"
                              name="city"
                              options={[...cityOptions]}
                              // defaultValue={selectedCityOption}
                              value={selectedCityOption}
                              styles={selectStylesShort}
                              // NOTE: Scrollable menu
                              menuPortalTarget={menuPortalRef.current}
                              // Q: How does this work?
                              menuPosition={'fixed'}
                              maxMenuHeight={120}
                              // isSearchable={false}
                              onChange={(selectFieldName) =>
                                handleChange(selectFieldName, 'city')
                              }
                              placeholder={'縣市'}
                            />
                            <Select
                              id="district"
                              name="district"
                              options={
                                selectedCityOption
                                  ? [...districtOptions]
                                  : [{ label: '請先選擇縣市', value: null }]
                              }
                              // defaultValue={selectedDistrictOption}
                              value={selectedDistrictOption}
                              styles={selectStylesShort}
                              menuPortalTarget={menuPortalRef.current}
                              menuPosition={'fixed'}
                              maxMenuHeight={120}
                              // isSearchable={false}
                              onChange={(selectFieldName) =>
                                handleChange(selectFieldName, 'district')
                              }
                              placeholder={'鄉鎮市區'}
                            />
                          </div>
                          <input
                            type="text"
                            id="address"
                            name="address"
                            value={signUpForm.address}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    className={styles['login__next-button']}
                    onClick={handleRightActive3}
                    type="button"
                  >
                    下一步
                  </button>
                </div>
              </div>
              <div
                className={styles['sign-up-wrapper']}
                style={{ opacity: signUpOpacity3 }}
              >
                <h4>註冊</h4>
                <div className={styles['login__wrapper']}>
                  {/* TODO: Outline and text turn white when focused */}
                  <div className={styles['login__username']}>
                    <div className={styles['login__label-wrapper']}>
                      <label htmlFor="username">帳號*</label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={signUpForm.username}
                        onChange={handleChange}
                        onFocus={
                          !usernameLengthValidation.success ||
                          !usernameEnglishValidation.success ||
                          !usernameNumValidation.success ||
                          usernameSpecialValidation.success
                            ? showUsernameRules
                            : null
                        }
                        // NOTE: Can only show validation rules by focusing on the input if at least one criteria is not met
                        ref={usernameInput}
                      />
                    </div>
                    <div className={usernameRulesBox}>
                      <ul className={usernameRulesWrapper}>
                        <li
                          className={
                            usernameRules.ruleA
                              ? styles['validation-rules-valid']
                              : styles['validation-rules-invalid']
                          }
                        >
                          <div>
                            {usernameRules.ruleA ? <FaCheck /> : <ImCross />}
                          </div>
                          <p>必須長度為 8 ~ 16 字元</p>
                        </li>
                        <li
                          className={
                            usernameRules.ruleB
                              ? styles['validation-rules-valid']
                              : styles['validation-rules-invalid']
                          }
                        >
                          <div>
                            {usernameRules.ruleB ? <FaCheck /> : <ImCross />}
                          </div>
                          <p>必須包含英文字母(大小寫皆可)</p>
                        </li>
                        <li
                          className={
                            usernameRules.ruleC
                              ? styles['validation-rules-valid']
                              : styles['validation-rules-invalid']
                          }
                        >
                          <div>
                            {usernameRules.ruleC ? <FaCheck /> : <ImCross />}
                          </div>
                          <p>必須包含數字</p>
                        </li>
                        <li
                          className={
                            usernameRules.ruleD
                              ? styles['validation-rules-invalid']
                              : styles['validation-rules-valid']
                          }
                        >
                          <div>
                            {!usernameRules.ruleD ? <FaCheck /> : <ImCross />}
                          </div>
                          <p>不可包含特殊字元(！、@、#...等)</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className={styles['login__password']}>
                    <div className={styles['login__label-wrapper']}>
                      <label htmlFor="password">密碼*</label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={signUpForm.password}
                        onChange={handleChange}
                        ref={passwordInput}
                        onFocus={
                          !passLengthValidation.success ||
                          !passEnglishValidation.success ||
                          !passNumValidation.success ||
                          !passSpecialValidation.success
                            ? showUsernameRules
                            : null
                        }
                      />
                    </div>
                    <div className={passRulesBox}>
                      <ul className={passRulesWrapper}>
                        <li
                          className={
                            passRules.ruleA
                              ? styles['validation-rules-valid']
                              : styles['validation-rules-invalid']
                          }
                        >
                          <div>
                            {passRules.ruleA ? <FaCheck /> : <ImCross />}
                          </div>
                          <p>必須長度為 8 ~ 20 字元</p>
                        </li>
                        <li
                          className={
                            passRules.ruleB
                              ? styles['validation-rules-valid']
                              : styles['validation-rules-invalid']
                          }
                        >
                          <div>
                            {passRules.ruleB ? <FaCheck /> : <ImCross />}
                          </div>
                          <p>必須包含大小寫英文字母</p>
                        </li>
                        <li
                          className={
                            passRules.ruleC
                              ? styles['validation-rules-valid']
                              : styles['validation-rules-invalid']
                          }
                        >
                          <div>
                            {passRules.ruleC ? <FaCheck /> : <ImCross />}
                          </div>
                          <p>必須包含數字</p>
                        </li>
                        <li
                          className={
                            passRules.ruleD
                              ? styles['validation-rules-valid']
                              : styles['validation-rules-invalid']
                          }
                        >
                          <div>
                            {passRules.ruleD ? <FaCheck /> : <ImCross />}
                          </div>
                          <p>必須包含特殊字元(！、@、#...等)</p>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className={styles['login__password-confirm']}>
                    <div className={styles['login__label-wrapper']}>
                      <label htmlFor="password">確認密碼*</label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        ref={passwordInput2}
                        value={confirmPass}
                        onChange={confirmPassChange}
                      />
                      {/* TODO: Prevent copy and pasting password */}
                    </div>
                    <li
                      className={
                        !passLengthValidation.success ||
                        !passEnglishValidation.success ||
                        !passNumValidation.success ||
                        !passSpecialValidation.success
                          ? `${styles['validation-rules-invalid']} ${styles['confirm-pass-display-hide']}`
                          : confirmPass === signUpForm.password
                          ? `${styles['validation-rules-valid']} ${styles['confirm-pass-display']}`
                          : `${styles['validation-rules-invalid']} ${styles['confirm-pass-display']}`
                      }
                    >
                      <div>
                        {confirmPass === signUpForm.password ? (
                          <FaCheck />
                        ) : (
                          <ImCross />
                        )}
                      </div>
                      <p>與密碼吻合</p>
                    </li>
                  </div>
                  <button
                    className={styles['login__next-button5']}
                    onClick={handleRightActive4}
                    type="button"
                  >
                    下一步
                  </button>
                </div>
              </div>
              <div
                className={styles['sign-up-wrapper']}
                style={{ opacity: signUpOpacity4 }}
              >
                <h4>註冊</h4>
                <div className={styles['login__wrapper']}>
                  {/* TODO: Outline and text turn white when focused */}
                  <div className={styles['login__height']}>
                    <div className={styles['login__label-wrapper']}>
                      <label htmlFor="height">身高(cm)</label>
                      <input
                        type="number"
                        id="height"
                        name="height"
                        value={signUpForm.height}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className={styles['login__weight']}>
                    <div className={styles['login__label-wrapper']}>
                      <label htmlFor="weight">體重(kg)</label>
                      <input
                        type="number"
                        id="weight"
                        name="weight"
                        value={signUpForm.weight}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className={styles['login__training-frequency']}>
                    <div className={styles['login__label-wrapper']}>
                      <label htmlFor="training-frequency">健身頻率</label>
                      <select
                        id="trainingFrequency"
                        name="trainingFrequency"
                        value={signUpForm.trainingFrequency}
                        onChange={handleChange}
                      >
                        <option value="1">每兩週一次以下</option>
                        <option value="2">每週一次</option>
                        <option value="3">每週兩次</option>
                        <option value="4">每週三次</option>
                        <option value="5">每週五次以上</option>
                      </select>
                    </div>
                  </div>
                  <div className={styles['login__training-intensity']}>
                    <div className={styles['login__label-wrapper']}>
                      <label htmlFor="training-intensity">健身強度</label>
                      <select
                        id="trainingIntensity"
                        name="trainingIntensity"
                        value={signUpForm.trainingIntensity}
                        onChange={handleChange}
                      >
                        <option value="1">無</option>
                        <option value="2">初學 - 6個月</option>
                        <option value="3">普通 - 1年</option>
                        <option value="4">熟練 - 3年</option>
                        <option value="5">專業 - 5年以上</option>
                      </select>
                      {/* TODO: Customize element as a react component (or with Bootstrap) */}
                    </div>
                  </div>
                  <div className={styles['login__button-container']}>
                    <button
                      type="button"
                      className={styles['login__skip-button']}
                      onClick={handleRightActive5}
                    >
                      先跳過
                    </button>
                    <button
                      className={styles['login__next-button3']}
                      onClick={handleRightActive5}
                      type="button"
                    >
                      下一步
                    </button>
                  </div>
                </div>
              </div>
              <div className={styles['sign-up-wrapper']}>
                <h4>註冊</h4>
                <div className={styles['login__wrapper']}>
                  <div className={styles['login__profile-img-container']}>
                    <Image
                      src={profileImg ? selectedImg : emptyProfilePic}
                      alt="Selected image"
                      layout="fill"
                      className={styles['login__profile-img']}
                    />
                    <label
                      className={styles['login__profile-img-upload']}
                      htmlFor="img-upload"
                    >
                      <FaCamera
                        className={styles['login__profile-img-upload-icon']}
                      />
                    </label>
                    {/* NOTE: Use label as the button and hide input */}
                    <input
                      type="file"
                      id="img-upload"
                      onChange={handleImgUpload}
                    />
                  </div>
                  <div className={styles['login__button-container']}>
                    <button
                      className={styles['login__skip-button']}
                      onClick={handleRegisterComplete}
                      type="submit"
                    >
                      先跳過
                    </button>
                    {/* BUG: Blocked by invisible div */}
                    <button
                      className={styles['login__next-button3']}
                      onClick={handleRegisterComplete}
                      type="submit"
                    >
                      完成註冊
                    </button>
                  </div>
                </div>
              </div>
            </form>
            <div className={styles['login__overlay']}>
              <div className={styles['login__overlay-contents']}>
                <div
                  className={`${styles['login__overlay-panel']} ${styles['overlay-left']}`}
                >
                  <h4>已經是會員？</h4>
                  <p>立即登入，迎接健康新挑戰！</p>
                  <button
                    className={styles['login__overlay-button']}
                    onClick={handleRightActive}
                  >
                    登入
                  </button>
                </div>
                <div
                  className={`${styles['login__overlay-panel']} ${styles['overlay-right']}`}
                >
                  <h4>還沒成為會員？</h4>
                  <p>立即加入 FreeFYT，開啟您的健身之旅！</p>
                  <button
                    className={styles['login__overlay-button']}
                    onClick={handleRightActive}
                  >
                    註冊
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
