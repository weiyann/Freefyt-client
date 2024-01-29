import { createContext, useState, useContext } from 'react'

const OtpContext = createContext()

export const OtpContextProvider = ({ children }) => {
  const [email, setEmail] = useState()
  const [OTP, setOTP] = useState()
  const [otpPage, setOtpPage] = useState(1)
  const [otpInput, setOtpInput] = useState()
  const [timer, setTimer] = useState(60)
  const [disableBtn, setDisableBtn] = useState(true)

  return (
    <OtpContext.Provider
      value={{
        OTP,
        setOTP,
        email,
        setEmail,
        otpPage,
        setOtpPage,
        otpInput,
        setOtpInput,
        timer,
        setTimer,
        disableBtn,
        setDisableBtn,
      }}
    >
      {children}
    </OtpContext.Provider>
  )
}

export const useOtp = () => {
  const context = useContext(OtpContext)
  return context
}
