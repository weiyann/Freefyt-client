import React, { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'

const LoadingAnimationWrapper = styled.div`
  font-size: 18px;
  font-weight: bold;
`

const ellipsisAnimation = keyframes`
  to {
    content: "   ";
  }
`

const Ellipsis = styled.span`
  animation: ${ellipsisAnimation} 1.5s infinite steps(3);
`

const LoadingAnimation = () => {
  const [dots, setDots] = useState('.')

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots((prevDots) => (prevDots === '...' ? '.' : prevDots + '.'))
    }, 500)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <LoadingAnimationWrapper>
      Loading
      <Ellipsis>{dots}</Ellipsis>
    </LoadingAnimationWrapper>
  )
}

export default LoadingAnimation
