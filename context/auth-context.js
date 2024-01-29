import React, { createContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

const AuthContext = createContext({})
export default AuthContext
// Q: Why default?

export const initAuth = {
  id: 0,
  username: '',
  nickname: '',
  token: '',
}

export const AuthContextProvider = ({ children }) => {
  const [auth, setAuth] = useState(initAuth)

  // 課程收藏狀態
  const [courseFav, setCourseFav] = useState([])
  // 商品收藏狀態
  const [productFav, setProductFav] = useState([])
  // blog收藏狀態
  const [blogFav, setBlogFav] = useState([])
  // blog-follow收藏狀態
  const [followFav, setFollowFav] = useState([])
  // console.log(productFav)

  /*
  useEffect(() => {
    const str = localStorage.getItem('fyt-auth')
    if (str) {
      try {
        const data = JSON.parse(str)
        if (data.id && data.username) {
          const { id, username, nickname, token } = data
          setAuth({ id, username, nickname, token })
        }
      } catch (ex) {
        console.log(ex)
      }
    }
  }, [])
  */

  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop().split(';').shift()
    }

    const accessToken = getCookie('accessToken')
    console.log('access', accessToken)

    if (accessToken) {
      const decodedToken = jwtDecode(accessToken)
      const { id, username } = decodedToken
      setAuth({
        id,
        username,
        token: accessToken,
      })
    }
  }, [])

  // 得到課程最愛並加入狀態
  const handleGetCourseFav = async () => {
    try {
      const r = await fetch(
        `http://localhost:3002/course/get-course-fav?member_id=${auth.id}`
      )
      const d = await r.json()
      setCourseFav(d)
    } catch (ex) {
      console.log(ex)
    }
  }
  // 得到會員商品收藏紀錄並加入狀態
  const handleGetProductFav = async () => {
    try {
      const r = await fetch(
        `http://localhost:3002/product-list/my-product-collection/${auth.id}`
      )
      const d = await r.json()
      if (d.success) {
        setProductFav(d.rows)
      }
    } catch (ex) {
      console.log(ex)
    }
  }
  // 得到會員blog收藏紀錄並加入狀態
  const handleGetBlogFav = async () => {
    try {
      const r = await fetch(
        `http://localhost:3002/blog-list/get-blog-fav?member_id=${auth.id}`
      )
      const d = await r.json()
      console.log(d)
      //if (d.success) {
      setBlogFav(d)
      //}
    } catch (ex) {
      console.log(ex)
    }
  }
  // 得到會員follow收藏紀錄並加入狀態
  const handleGetFollowFav = async () => {
    try {
      const r = await fetch(
        `http://localhost:3002/blog-list/get-follow-fav?member_id=${auth.id}`
      )
      const d = await r.json()
      console.log(d)
      //if (d.success) {
      setFollowFav(d)
      //}
    } catch (ex) {
      console.log(ex)
    }
  }
  // 如果有登入就取得課程收藏的資料並觸發 handleGetCourseFav
  useEffect(() => {
    if (auth.id > 0) {
      handleGetCourseFav()
    } else {
      // 沒有或登出的情況下讓狀態返回初始值
      setCourseFav([])
    }
  }, [auth.id])

  useEffect(() => {
    if (auth.id > 0) {
      handleGetProductFav()
    } else {
      setProductFav([])
    }
  }, [auth.id])

  useEffect(() => {
    if (auth.id > 0) {
      handleGetBlogFav()
    } else {
      setBlogFav([])
    }
  }, [auth.id])

  useEffect(() => {
    if (auth.id > 0) {
      handleGetFollowFav()
    } else {
      setFollowFav([])
    }
  }, [auth.id])

  // NOTE: Sign out
  const signout = () => {
    // localStorage.removeItem('fyt-auth')
    // setAuth(initAuth)
    document.cookie =
      'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    setAuth(initAuth)
  }

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        signout,
        courseFav,
        setCourseFav,
        productFav,
        setProductFav,
        blogFav,
        setBlogFav,
        followFav,
        setFollowFav,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
