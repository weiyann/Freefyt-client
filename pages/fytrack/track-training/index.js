import styles from '@/styles/fytrack/traininghome.module.css'
import { useEffect, useContext, useState } from 'react'
import { WORKOUT_PLAN } from '@/configs/index'
import { useRouter } from 'next/router'
import AuthContext from '@/context/auth-context'
// import { CiLight } from 'react-icons/ci'
import { FaStar } from 'react-icons/fa'
import VariationCardContainer from '@/components/fytrack/track-training/variation-card-container'

export default function TrainingHome() {
  const { auth } = useContext(AuthContext)
  const [workoutPlans, setWorkoutPlans] = useState([])

  const router = useRouter()

  useEffect(() => {
    fetch(WORKOUT_PLAN, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + auth.token,
      },
      credentials: 'include',
    })
      .then((r) => r.json())
      .then((data) => {
        // console.log('success', data.workoutPlans)
        setWorkoutPlans(data.workoutPlans)
      })
      .catch((ex) => console.log(ex))
  }, [auth.id])

  const [selectedPlan, setSelectedPlan] = useState(null)
  const [clickedStyle, setClickedStyle] = useState(false)
  const [clickedIndex, setClickedIndex] = useState(null)
  const [showWorkoutPlan, setShowWorkoutPlan] = useState(true)

  const handleCardClick = (planID, index) => {
    setClickedStyle(index === clickedIndex ? !clickedStyle : true)
    // console.log(clickedStyle)
    setSelectedPlan(planID)
    // console.log(`Clicked ${planID}`)
    setClickedIndex(index)
  }

  const handlePlanSelect = () => {
    // console.log('clicked', selectedPlan, 'style', clickedStyle)
    setShowWorkoutPlan(false)
    // NOTE: Hiding workout plan cards
    router.push(`/fytrack/track-training?plan_id=${selectedPlan}`)
  }

  const [selectedVariation, setSelectedVariation] = useState(null)

  const handleVariationSelect = async () => {
    // console.log('member_id', auth.id, 'variation_id', selectedVariation)
    let logID

    try {
      const response = await fetch(
        'http://localhost:3002/fytrack/track-training/log-workout/create-log/api',
        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + auth.token,
            'Content-Type': 'application/json',
            // NOTE: Due to including the body
          },
          credentials: 'include',
          body: JSON.stringify({
            member_id: auth.id,
            variation_id: selectedVariation,
          }),
        }
      )
      const data = await response.json()

      if (!data.success) {
        console.log('here')
        router.push('/fytrack/track-training')
      } else {
        console.log('Created entry!', data.success)
        logID = data.logID
      }
    } catch (ex) {
      console.error(ex)
    }

    if (auth.id) {
      router.push(
        `/fytrack/track-training/log-workout/${logID}?variation_id=${selectedVariation}`
      )
    } else {
      router.push(`/member/login`)
    }
  }

  function toHistory() {
    if (auth.id) {
      router.push(`/fytrack/track-training/history`)
    } else {
      router.push(`/member/login`)
    }
  }

  return (
    <div className={styles['training-home']}>
      <section>
        <div className={styles['container']}>
          <h5 className={styles['breadcrumb']}>健身追蹤/重量訓練</h5>
          <h3 className={styles['section__title']}>
            請選擇<span>重訓計畫</span>
          </h3>
          <div className={styles['plan__tab-container']}>
            <button className={styles['plan__tab']}>教練推薦</button>
            <button className={styles['plan__tab']}>近期使用</button>
            <button className={styles['plan__tab']}>自創組合</button>
          </div>
          {showWorkoutPlan ? (
            <div className={styles['plan__card-container']}>
              {workoutPlans.map((plan, index) => {
                return (
                  <div
                    className={
                      clickedStyle && clickedIndex === index
                        ? styles['plan__card-clicked']
                        : styles['plan__card']
                    }
                    onClick={() => handleCardClick(plan.plan_id, index)}
                    key={index}
                  >
                    <h5 className={styles['plan__card-title']}>
                      {plan.plan_name}
                    </h5>
                    <h6 className={styles['plan__card-description']}>
                      {plan.plan_intro}
                    </h6>
                    <div className={styles['plan__card-box']}>
                      {/* <ul>
                        <li>難易度：</li>
                        <li>優　點：</li>
                        <li>缺　點：</li>
                      </ul> */}
                      <ul>
                        <li>
                          難易度：
                          {Array.from(
                            { length: plan.plan_difficulty },
                            (index) => (
                              <FaStar
                                key={index}
                                className={styles['plan__card-star-icon']}
                              />
                            )
                          )}
                          {/* NOTE: Creating stars for difficulty */}
                        </li>
                        <li>優　點：{plan.plan_pros}</li>
                        <li>缺　點：{plan.plan_cons}</li>
                      </ul>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <VariationCardContainer
              setSelectedVariation={setSelectedVariation}
            />
          )}
          <div className={styles['plan__button-container']}>
            {showWorkoutPlan ? (
              <button
                className={styles['plan__button']}
                onClick={handlePlanSelect}
              >
                選擇計畫
              </button>
            ) : (
              <button
                className={styles['plan__button']}
                onClick={handleVariationSelect}
              >
                選擇組合
              </button>
            )}
            <button className={styles['plan__button']} onClick={toHistory}>
              歷史紀錄
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
