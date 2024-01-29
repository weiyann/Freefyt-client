import { useEffect, useState } from 'react'
import styles from '@/styles/home.module.css'

export default function HomeCounter({ id, startNum, endNum, duration }) {
  const [currentNum, setCurrentNum] = useState(startNum)
  useEffect(() => {
    const range = endNum - startNum
    const increment = endNum > startNum ? 1 : -1
    const step = Math.abs(Math.floor(duration / range))

    const timer = setInterval(() => {
      setCurrentNum((prev) => {
        const nextNum = prev + increment
        // NOTE: Ensure counter stops
        return increment > 0
          ? Math.min(nextNum, endNum)
          : Math.max(nextNum, endNum)
      })
    }, step)

    return () => clearInterval(timer)
  }, [startNum, endNum, duration])

  return (
    <p id={id} className={styles['hero__count-num']}>
      {currentNum.toLocaleString()}
    </p>
  )
}
