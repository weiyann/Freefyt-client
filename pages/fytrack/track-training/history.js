import AuthContext from '@/context/auth-context'
import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from '@/styles/fytrack/traininghome.module.css'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-tw'
import localeData from 'dayjs/plugin/localeData'
import { FaRegCalendar } from 'react-icons/fa'
import ModalResults from '@/components/fytrack/track-training/modal/modal-results'

export default function History() {
  const { auth } = useContext(AuthContext)

  const router = useRouter()

  const [workoutDetails, setWorkoutDetails] = useState([])
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    fetch(
      `http://localhost:3002/fytrack/track-training/get-workout-detail/api?member_id=${auth.id}`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + auth.token,
        },
        credentials: 'include',
      }
    )
      .then((r) => r.json())
      .then((data) => {
        console.log('success', data.workoutDetailData)
        const sortedWorkoutDetails = [...data.workoutDetailData].sort(
          (a, b) => new Date(b.log_date) - new Date(a.log_date)
        )
        setWorkoutDetails(sortedWorkoutDetails)
        console.log(workoutDetails)
      })
      .catch((ex) => console.log(ex))
  }, [auth.id])

  dayjs.extend(localeData)
  dayjs.locale('zh-tw')

  const [logID, setLogID] = useState()

  function showResultCard(logID) {
    router.push(`/fytrack/track-training/history?log_id=${logID}`)
    setShowResults(true)
    setLogID(logID)
  }

  function closeResultModal() {
    setShowResults(false)
  }

  return (
    <div className={styles['training-home']}>
      <section>
        <div className={styles['history__container']}>
          <h5 className={styles['breadcrumb']}>健身追蹤/重量訓練</h5>
          <h3 className={styles['section__title']}>
            歷史<span>紀錄</span>
          </h3>
          {showResults && (
            <ModalResults log_id={logID} onClose={closeResultModal} />
          )}
          <div className={styles['history__card-container']}>
            {workoutDetails.map((details, index) => (
              <div
                className={styles['history__card']}
                key={index}
                onClick={() => showResultCard(details.log_id)}
              >
                <p className={styles['history__card-title']}>
                  {details.plan_name}
                </p>
                <p className={styles['history__card-subtitle']}>
                  {details.variation_name}
                </p>
                <p className={styles['history__card-subtitle']}>
                  <div>
                    <FaRegCalendar />
                    {dayjs(details.log_date).format('YYYY/MM/DD dddd')}
                  </div>
                </p>
                <div className={styles['history__card-item-box']}>
                  {workoutDetails[index].set_data.map(
                    (setDetails, setIndex) => (
                      <p key={setIndex}>
                        {setDetails.exercise_name_cn} x {setDetails.entry_count}
                      </p>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
