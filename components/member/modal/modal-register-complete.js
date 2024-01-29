import styles from '@/styles/member/login.module.css'
import SweetAlertCheck from '@/components/member/sweet-alert-check'

export default function ModalRegisterComplete() {
  return (
    <div className={styles['modal__register-complete']}>
      <h4>註冊成功！</h4>
      <SweetAlertCheck />
      <p>
        請稍後<span className={styles['dot-animation']}></span>
      </p>
    </div>
  )
}
