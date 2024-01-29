import styles from '@/styles/member/login.module.css'
import SweetAlertCheck from '@/components/member/sweet-alert-check'

export default function ModalLoginComplete() {
  return (
    <div className={styles['modal__login-complete']}>
      <h4>登入成功！</h4>
      <SweetAlertCheck />
      <p>
        請稍後<span className={styles['dot-animation']}></span>
      </p>
    </div>
  )
}
