import Lottie from 'lottie-react'
import checkingAnimation from '@/assets/store/fail-icon.json'
import styles from '@/styles/store/cart/success-icon.module.css'

const FailIcon = () => {
  return (
    <>
      <div className={styles['fail-icon']}>
        <Lottie animationData={checkingAnimation} loop={false} />
      </div>
    </>
  )
}

export default FailIcon
