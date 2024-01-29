import Lottie from 'lottie-react'
import checkingAnimation from '@/assets/store/success-icon.json'
import styles from '@/styles/store/cart/success-icon.module.css'

const SuccessIcon = () => {
  return (
    <>
      <div className={styles['success-icon']}>
        <Lottie animationData={checkingAnimation} loop={false} />
      </div>
    </>
  )
}

export default SuccessIcon
