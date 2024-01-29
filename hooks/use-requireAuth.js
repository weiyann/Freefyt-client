import { useRef, useMemo, useContext, useEffect } from 'react'
import AuthContext from '@/context/auth-context'
import { useRouter } from 'next/navigation'

const useRequireAuth = () => {
  const authContext = useContext(AuthContext)
  const executeOnce = useRef(false)

  const router = useRouter()

  const isLoggedIn = useMemo(() => authContext.auth?.token, [authContext])

  useEffect(() => {
    console.log(authContext)
    if (!executeOnce.current && !authContext.auth?.token) {
      window.alert('you should login!!!')
      router.push('/')
      executeOnce.current = true
    }
  }, [router, authContext])

  return {
    isLoggedIn,
  }
}

export default useRequireAuth
