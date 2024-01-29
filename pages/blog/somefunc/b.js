import { socket } from '@/hooks/use-socket'

import React, { useEffect } from 'react'

export default function OneToOne() {
  console.log(socket)

  useEffect(() => {
    // socket.on('test', (arg)=>{
    //     console.log('recieved: ', arg)
    //     socket.emit('client','hello  to server')
    // })
    // socket.join('room')
    // socket.on('room', (roomId, data)=>{
    //     console.log('in: ', roomId, '\n', data)
    // })
    socket.connect()
    socket.on('connection', (status) => {
      if (status) {
        socket.emit('user message', 'b', 'hello')
      }
    })
    socket.on('room', (user, message) => {
      console.log(`from ${user}: ${message}`)
    })
    // socket.emit('getUser', 'b')
  }, [])
  return <div>1to1</div>
}
