import { io } from 'socket.io-client'
import { useState, useEffect } from 'react'

const URL = 'http://localhost:3002'

export const socket = io(URL, { autoConnect: false })

export const useSocket = (userId) => {
  //是否connect
  const [ready, setReady] = useState(false)

  const [messages, setMessages] = useState([])

  //傳送訊息
  const sendMessage = (receiverId, message) => {
    // ...

    //考量到後端
    socket.emit('user message', userId, receiverId, message)
    setMessages((messages) => [...messages, `${userId}: ${message}`])
  }

  //連接成功true
  useEffect(() => {
    socket.connect()
    // check connection
    socket.on('connection', (status) => {
      // setState?
      if (status === 'success') {
        setReady(true)
      }
    })
  }, [])

  // useEffect(() => {
  //   if (ready) {
  //     // get history messages
  //     // set to messages
  //     setMessages(['1: hello', '2: bye'])
  //   }
  // }, [ready])

  useEffect(() => {
    // recieve room message
    socket.on('room', (userId, message) => {
      // (styling according to userId) add to messages
      setMessages((messages) => [...messages, `${userId}: ${message}`])
      // store to db
    })
  }, [])

  return {
    messages,
    sendMessage,
  }
}
