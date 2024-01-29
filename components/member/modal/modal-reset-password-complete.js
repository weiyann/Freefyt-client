import styles from '@/styles/member/login.module.css'
import SweetAlertCheck from '@/components/member/sweet-alert-check'

export default function ModalResetPasswordComplete({ onClose }) {
  return (
    <div className={styles['modal__reset-password-complete']}>
      <h4>完成更新密碼</h4>
      <SweetAlertCheck />
      <p onClick={onClose}>立即前往登入</p>
    </div>
  )
}
