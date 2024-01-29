import { useState, useEffect } from 'react'
import styles from '@/styles/member/login.module.css'
import ModalOtpPage from '@/components/member/modal/modal-otp-page'
import { useOtp } from '@/context/otp-context'
import VerificationInput from 'react-verification-input'
import { z } from 'zod'
import ModalResetPasswordComplete from '@/components/member/modal/modal-reset-password-complete'

export default function ModalResetPass({ onClose }) {
  const {
    OTP,
    setOTP,
    email,
    setEmail,
    otpPage,
    setOtpPage,
    otpInput,
    setOtpInput,
    timer,
    setTimer,
    disableBtn,
    setDisableBtn,
  } = useOtp()

  async function sendOTP(e) {
    e.preventDefault()

    setOtpPage(2)

    const r = await fetch('http://localhost:3002/member/send-recovery-email', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await r.json()
    if (data.success) {
      console.log('success, message sent!')
      setOTP(data.otp)
    } else {
      console.log('fail, not a member!')
    }
  }

  async function resendOTP(e) {
    e.preventDefault()

    if (disableBtn) return

    const r = await fetch('http://localhost:3002/member/send-recovery-email', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await r.json()
    if (data.success) {
      console.log('success!')
      setOTP(data.otp)
      setDisableBtn(true)
      setTimer(60)
    } else {
      console.log('fail!')
    }
  }

  useEffect(() => {
    let interval = setInterval(() => {
      setTimer((lastTimerCount) => {
        lastTimerCount <= 1 && clearInterval(interval)
        if (lastTimerCount <= 1) setDisableBtn(false)
        if (lastTimerCount <= 0) return lastTimerCount
        return lastTimerCount - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [disableBtn])

  const [displayIncorrectOTP, setDisplayIncorrectOTP] = useState(false)

  function verifyOTP() {
    if (otpInput == OTP) {
      // NOTE: Loose equality because one is a string
      console.log('move to reset password page')
      setOtpPage(3)
      setDisplayIncorrectOTP(false)
    } else {
      console.log('incorrect OTP', otpInput, OTP)
      setDisplayIncorrectOTP(true)
    }
  }

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // NOTE: Password zod schemas
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

  // NOTE: Password validation
  const passLengthValidation = passLengthSchema.safeParse(newPassword)
  const passEnglishValidation = passEnglishSchema.safeParse(newPassword)
  const passNumValidation = passNumSchema.safeParse(newPassword)
  const passSpecialValidation = passSpecialSchema.safeParse(newPassword)

  const [displayPassIncorrect, setDisplayPassIncorrect] = useState(false)
  const [displayConfirmIncorrect, setDisplayConfirmIncorrect] = useState(false)

  async function resetPassword() {
    if (
      passLengthValidation.success &&
      passEnglishValidation.success &&
      passNumValidation.success &&
      passSpecialValidation.success &&
      newPassword === confirmPassword
    ) {
      const r = await fetch('http://localhost:3002/member/reset-password', {
        method: 'POST',
        body: JSON.stringify({ newPassword, email }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await r.json()
      if (data.success) {
        // console.log('Password updated successfully!')
        setResetPassComplete(true)
      } else {
        console.log('Failed to update password!')
      }
    } else if (
      !(
        passLengthValidation.success &&
        passEnglishValidation.success &&
        passNumValidation.success &&
        passSpecialValidation.success
      )
    ) {
      console.log('Password validation failed!')
      setDisplayPassIncorrect(true)
    } else if (
      passLengthValidation.success &&
      passEnglishValidation.success &&
      passNumValidation.success &&
      passSpecialValidation.success &&
      newPassword !== confirmPassword
    ) {
      setDisplayPassIncorrect(false)
      setDisplayConfirmIncorrect(true)
    }
  }

  const [resetPassComplete, setResetPassComplete] = useState(false)

  // TODO: Generate OTP (not by random number)
  // TODO: Verify OTP on last keystroke

  return otpPage === 1 ? (
    <div className={styles['modal__reset-pass']}>
      <h4>忘記密碼</h4>
      <div className={styles['modal__input-wrapper']}>
        <label htmlFor="recover-email">電子信箱：</label>
        <input
          type="text"
          onChange={(e) => {
            setEmail(e.target.value)
          }}
          id="recover-email"
        />
        <button onClick={sendOTP} className={styles['modal__button']}>
          送出驗證信
        </button>
        <button
          onClick={() => {
            onClose()
            // NOTE: Execute function that setModalOpened(false) in parent container
          }}
          className={styles['modal__button2']}
        >
          取消
        </button>
      </div>
    </div>
  ) : otpPage === 2 ? (
    <div
      className={`${styles['modal__reset-pass']} ${styles['hide-original-input']}`}
    >
      <h4>忘記密碼</h4>
      <VerificationInput
        length={6}
        autoFocus={true}
        classNames={{
          container: styles['verify-container'],
          character: styles['verify-character'],
          characterInactive: styles['verify-character-inactive'],
          characterSelected: styles['verify-character-selected'],
          characterFilled: styles['verify-character-filled'],
        }}
        onChange={(value) => {
          setOtpInput(value)
        }}
      />
      {displayIncorrectOTP && (
        <small className={styles['otp-incorrect']}>驗證碼輸入錯誤！</small>
      )}
      <p>驗證碼已傳送至{email}</p>
      <p>請在 60 秒內輸入驗證碼</p>
      <button onClick={verifyOTP} className={styles['modal__button']}>
        驗證
      </button>
      {timer ? (
        <button disabled className={styles['modal__button-disabled']}>
          {timer}秒後可再傳送一次驗證碼
        </button>
      ) : (
        <button onClick={resendOTP} className={styles['modal__button2']}>
          再傳送一次驗證碼
        </button>
      )}
      <button
        className={styles['modal__button2']}
        onClick={() => {
          onClose()
        }}
      >
        取消
      </button>
    </div>
  ) : otpPage === 3 ? (
    <div className={styles['modal__reset-pass']}>
      {resetPassComplete && <ModalResetPasswordComplete onClose={onClose} />}
      <h4>忘記密碼</h4>
      <div className={styles['modal__input-wrapper2']}>
        <label htmlFor="new-pass">更改密碼：</label>
        <input
          type="password"
          onChange={(e) => {
            setNewPassword(e.target.value)
          }}
          id="new-pass"
        />
        {displayPassIncorrect && (
          <small className={styles['pass-incorrect']}>密碼格式不符</small>
        )}
      </div>
      <div className={styles['modal__input-wrapper2']}>
        <label htmlFor="new-pass-confirm">確認密碼：</label>
        <input
          type="password"
          onChange={(e) => {
            setConfirmPassword(e.target.value)
          }}
          id="new-pass-confirm"
        />
        {displayConfirmIncorrect && (
          <small className={styles['confirm-incorrect']}>確認密碼錯誤</small>
        )}
        <button onClick={resetPassword} className={styles['modal__button']}>
          確認
        </button>
        <button
          className={styles['modal__button2']}
          onClick={() => {
            onClose()
          }}
        >
          取消
        </button>
      </div>
    </div>
  ) : (
    ''
  )
}
