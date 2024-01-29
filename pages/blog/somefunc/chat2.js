import React, {useState} from 'react'
import styles from '@/styles/blog/blogchat.module.css'
import { useSocket } from '@/hooks/use-socket'
export default function Chat() {
  const { messages, sendMessage } = useSocket('2')
  const [text, setText] = useState('')

  console.log(messages)

  const handleClick = ()=>{
    sendMessage('1', text)
  }

  return (
    <>
      <div className={styles['blog-headimgs']}>chat</div>
      <div className={styles['blog-headimg']}>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>

      <input
        type="text"
        className={styles['bgid-writecontent']}
        id="memberID"
        name="memberID"
        value={text}
        onChange={(e)=>setText(e.target.value)}
      />
      <button onClick={handleClick}>click</button>
    </>
  )
}
