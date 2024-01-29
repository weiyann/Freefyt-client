import styles from '@/styles/member/login.module.css'
import { useOtp } from '@/context/otp-context'

export default function ModalOtpPage() {
  const { OTP, setOTP, email, setEmail } = useOtp()

  return (
    <div className={styles['modal__reset-pass']}>
      <h4>忘記密碼OTP葉</h4>
      <input
        type="number"
        onChange={(e) => {
          setEmail(e.target.value)
        }}
      />
    </div>
  )
}
