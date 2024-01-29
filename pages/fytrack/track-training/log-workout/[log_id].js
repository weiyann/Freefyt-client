import styles from '@/styles/fytrack/traininglog.module.css'
import { useEffect, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import AuthContext from '@/context/auth-context'
import DatePicker from 'react-datepicker'
// import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import 'react-datepicker/dist/react-datepicker.css'

export default function LogWorkout() {
  const router = useRouter()

  const { auth } = useContext(AuthContext)
  const [exercises, setExercises] = useState([])
  const [exerciseEntries, setExerciseEntries] = useState([])

  const [selectedWorkout, setSelectedWorkout] = useState([])

  // NOTE: Fetch plan name and variation name for a variation
  useEffect(() => {
    const variationID = +router.query.variation_id

    fetch(
      `http://localhost:3002/fytrack/track-training/get-plan/api?variation_id=${variationID}`,
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
        if (!data.success) {
          router.push('/fytrack/track-training')
        } else {
          console.log(
            data.selectedPlan[0].variation_name,
            data.selectedPlan[0].plan_name
          )
          setSelectedWorkout(data.selectedPlan[0])
        }
      })
      .catch((ex) => console.log(ex))
  }, [auth.id])

  // NOTE: Fetch exercise data for a variation
  useEffect(() => {
    const variationID = +router.query.variation_id

    fetch(
      `http://localhost:3002/fytrack/track-training/get-exercises/api?variation_id=${variationID}`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + auth.token,
        },
        credentials: 'include',
      }
    )
      .then((r) => r.json())
      // NOTE: MUST return (must not add curly brackets to r.json())
      .then((data) => {
        if (!data.success) {
          router.push('/fytrack/track-training')
        } else {
          console.log(data)
          setExercises([...data.exercises])
          setExerciseEntries(
            data.exercises.map(() => ({ entries: [{ load: 0, reps: 0 }] }))
          )
        }
      })
      .catch((ex) => console.log(ex))
  }, [auth.id])

  // NOTE: Fetch best performance
  const [bestPerformance, setBestPerformance] = useState([])

  useEffect(() => {
    fetch(
      `http://localhost:3002/fytrack/track-training/get-best/api?member_id=${auth.id}`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + auth.token,
        },
        credentials: 'include',
      }
    )
      .then((r) => r.json())
      // NOTE: MUST return (must not add curly brackets to r.json())
      .then((data) => {
        if (!data.success) {
          // router.push('/fytrack/track-training')
          console.log('no previous record')
        } else {
          console.log(data)
          setBestPerformance([...data.exercises])
        }
      })
      .catch((ex) => console.log(ex))
  }, [auth.id])

  // NOTE: Getting entry_load for a specific exercise_id
  const getEntryLoad = (exerciseID) => {
    const bestOfExercise = bestPerformance.find(
      (entry) => entry.exercise_id === exerciseID
    )
    return bestOfExercise ? bestOfExercise.entry_load : null
  }

  // NOTE: Getting entry_reps for a specific exercise_id
  const getEntryReps = (exerciseID) => {
    const bestOfExercise = bestPerformance.find(
      (entry) => entry.exercise_id === exerciseID
    )
    return bestOfExercise ? bestOfExercise.entry_reps : null
  }

  // NOTE: Submit workout log
  // const [logForm, setLogForm] = useState({
  //   load: 0,
  //   reps: 0,
  // })

  const handleChange = (e, exerciseIndex, entryIndex, fieldType) => {
    const { name, id, value } = e.target

    // setLogForm((prev) => ({
    //   ...prev,
    //   [name || id]: value,
    // }))

    setExerciseEntries((prev) => {
      const updatedExercises = [...prev]
      updatedExercises[exerciseIndex].entries[entryIndex] = {
        ...updatedExercises[exerciseIndex].entries[entryIndex],
        [fieldType]: value,
      }
      return updatedExercises
    })
  }

  async function handleLogSubmit(e) {
    e.preventDefault()

    console.log(exercises)

    const logID = +router.query.log_id
    // console.log(logID)

    const entriesToSubmit = exerciseEntries
      .map((entry, exerciseIndex) =>
        entry.entries.map(({ load, reps }) => ({
          exercise_id: exercises[exerciseIndex].exercise_id,
          load,
          reps,
        }))
      )
      .flat()

    console.log(entriesToSubmit)

    const resLog = await fetch(
      'http://localhost:3002/fytrack/track-training/log-workout/create-entries/api',
      {
        method: 'POST',
        body: JSON.stringify({
          entries: entriesToSubmit,
          logID: logID,
          date: startDate.toISOString().split('T')[0],
          memberID: auth.id,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    const resLogData = await resLog.json()

    if (resLogData.success) {
      router.push('/fytrack/track-training/history')
    } else {
      alert('記錄失敗')
    }
  }

  const [startDate, setStartDate] = useState(new Date())

  function handleLeave() {
    router.push('/fytrack/track-training')
  }

  return (
    <div className={styles['workout-log']}>
      <section>
        <div className={styles['container']}>
          <h5 className={styles['breadcrumb']}>健身追蹤/重量訓練/記錄表單</h5>
          <button
            className={styles['log__prev-page-button']}
            onClick={handleLeave}
          >
            上一頁
          </button>
          <div className={styles['log__container']}>
            <h3 className={styles['section__title']}>
              {selectedWorkout.plan_name}
            </h3>
            <h4 className={styles['section__subtitle']}>
              {selectedWorkout.variation_name}
            </h4>
            <form>
              <div className={styles['datepicker-container']}>
                <p>健身紀錄日期：</p>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  className={styles['datepicker']}
                />
              </div>
              <div className={styles['card__container']}>
                {exercises.map((exercise, exerciseIndex) => (
                  <div className={styles['card']} key={exerciseIndex}>
                    <table className={styles['card__table']}>
                      <tr className={styles['exercise']}>
                        <th className={styles['first-column']}>
                          {exercises[exerciseIndex].exercise_name_cn}
                        </th>
                        <th></th>
                        <th></th>
                        <th></th>
                        {/* <th className={styles['fifth-column']}>三</th> */}
                      </tr>
                      <tr>
                        <th className={styles['first-column']}>組數</th>
                        <th>前次最佳表現</th>
                        <th>重量</th>
                        <th>次數</th>
                        {/* <th className={styles['fifth-column']}>V</th> */}
                      </tr>
                      {/* TODO: Add entries functionality */}
                      {[1, 2, 3].map((entryIndex) => (
                        <tr key={entryIndex}>
                          <td className={styles['first-column']}>
                            {entryIndex}
                          </td>
                          <td className={styles['second-column']}>
                            {getEntryLoad(
                              exercises[exerciseIndex].exercise_id
                            ) &&
                            getEntryReps(exercises[exerciseIndex].exercise_id)
                              ? `${getEntryLoad(
                                  exercises[exerciseIndex].exercise_id
                                )}kg x ${getEntryReps(
                                  exercises[exerciseIndex].exercise_id
                                )}`
                              : `尚無紀錄`}
                          </td>
                          <td className={styles['third-column']}>
                            <input
                              type="number"
                              name={`load[${exerciseIndex}][${entryIndex}]`}
                              onChange={(e) =>
                                handleChange(
                                  e,
                                  exerciseIndex,
                                  entryIndex,
                                  'load'
                                )
                              }
                            />
                          </td>
                          <td className={styles['fourth-column']}>
                            <input
                              type="number"
                              name={`reps[${exerciseIndex}][${entryIndex}]`}
                              onChange={(e) =>
                                handleChange(
                                  e,
                                  exerciseIndex,
                                  entryIndex,
                                  'reps'
                                )
                              }
                            />
                          </td>
                          {/* <td className={styles['fifth-column']}>
                            <input />
                          </td> */}
                        </tr>
                      ))}
                    </table>
                  </div>
                ))}
              </div>
              <div className={styles['button-container']}>
                <button
                  onClick={handleLogSubmit}
                  className={styles['log__button2']}
                >
                  完成
                </button>
                <button
                  type="button"
                  className={styles['log__button']}
                  onClick={handleLeave}
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
