import { useEffect, useContext, useState } from 'react'
import AuthContext from '@/context/auth-context'
import { useRouter } from 'next/router'
import styles from '@/styles/fytrack/modal-results.module.css'
import { IoMdClose } from 'react-icons/io'

export default function ModalResults({ onClose, log_id }) {
  const router = useRouter()

  const { auth } = useContext(AuthContext)

  const [allPerformance, setAllPerformance] = useState([])
  const [uniqueExerciseNames, setUniqueExerciseNames] = useState([])

  useEffect(() => {
    fetch(
      `http://localhost:3002/fytrack/track-training/get-all-performance/api?member_id=${auth.id}&log_id=${log_id}`,
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
        console.log('success', data.exerciseResults)
        setAllPerformance([...data.exerciseResults])
        const uniqueNames = Array.from(
          new Set(
            data.exerciseResults.map(
              (performance) => performance.exercise_name_cn
            )
          )
        )
        setUniqueExerciseNames(uniqueNames)
      })
      .catch((ex) => console.log(ex))
  }, [auth.id])

  return (
    <>
      <div className={styles['result']}>
        <IoMdClose className={styles['close-button']} onClick={onClose} />
        <ul className={styles['result__exercise-list']}>
          {uniqueExerciseNames.map((exerciseName) => (
            <div key={exerciseName}>
              <li className={styles['result__exercise-list-entry']}>
                <div className={styles['result__exercise-name']}>
                  {exerciseName}
                </div>
                <div className={styles['result__exercise-stats']}>
                  {allPerformance
                    .filter(
                      (performance) =>
                        performance.exercise_name_cn === exerciseName
                    )
                    .map((filteredPerformance) => (
                      <div key={filteredPerformance.entry_id}>
                        {filteredPerformance.entry_load}kg x{' '}
                        {filteredPerformance.entry_reps}
                      </div>
                    ))}
                </div>
              </li>
            </div>
          ))}
        </ul>
      </div>
    </>
  )
}
