import styles from '@/styles/fytrack/traininghome.module.css'
import { useEffect, useContext, useState } from 'react'
import { WORKOUT_VARIATION } from '@/configs/index'
import AuthContext from '@/context/auth-context'
import { useRouter } from 'next/router'

export default function VariationCardContainer({ setSelectedVariation }) {
  const { auth } = useContext(AuthContext)

  const router = useRouter()

  const [workoutVariations, setWorkoutVariations] = useState([])

  useEffect(() => {
    const planID = +router.query.plan_id

    if (planID) {
      fetch(
        `http://localhost:3002/fytrack/track-training/workout-variation/api?plan_id=${planID}`,
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
          console.log('success', data)
          setWorkoutVariations(data.workoutVariations)
        })
        .catch((ex) => console.log(ex))
    }
  }, [auth.id, router.query.plan_id])

  // const [selectedVariation, setSelectedVariation] = useState(null)
  const [clickedStyle, setClickedStyle] = useState(false)
  const [clickedIndex, setClickedIndex] = useState(null)

  const handleCardClick = (variationID, index) => {
    setClickedStyle(index === clickedIndex ? !clickedStyle : true)
    setSelectedVariation(variationID)
    setClickedIndex(index)
  }

  return (
    <div className={styles['plan__card-container']}>
      {workoutVariations.map((variation, index) => {
        return (
          <div
            className={
              clickedStyle && clickedIndex === index
                ? styles['plan__card-clicked']
                : styles['plan__card']
            }
            onClick={() => handleCardClick(variation.variation_id, index)}
            key={index}
          >
            <h5 className={styles['plan__card-title']}>
              {variation.plan_name}
            </h5>
            <h6 className={styles['plan__card-description']}>
              {variation.variation_name}
            </h6>
            <p
              className={`$styles['plan__card-box'] $styles['plan__card-box']`}
            >
              {variation.variation_intro}
            </p>
          </div>
        )
      })}
    </div>
  )
}
