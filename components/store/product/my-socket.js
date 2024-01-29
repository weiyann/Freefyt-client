import { useState } from 'react'
import { useSocket } from '@/hooks/use-socket'
import { BsChatDotsFill } from 'react-icons/bs'
import styles from '@/styles/store/mysocket.module.css'

export default function MySocket({
  memberId,
  memberName,
  showChatRoom,
  toggleChatRoom,
  closeModal,
}) {
  const { messages, sendMessage } = useSocket(`${memberName}`)
  const [text, setText] = useState('')
  // const [showChatRoom, setShowChatRoom] = useState(false)

  const handleClick = () => {
    sendMessage(`${memberName}`, text)
    // 清空输入框文本
    setText('')
  }

  // 聊天室使用
  // const toggleChatRoom = () => {
  //   setShowChatRoom((prev) => !prev)
  // }

  // const openModal = () => {
  //   setShowChatRoom(true)
  // }

  return (
    <>
      {/* <div>chat</div>
      <div>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>

\      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          id=""
          name=""
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" onClick={handleClick}>
          click
        </button>
      </form> */}
      <button className={styles['chat-room-button']} onClick={toggleChatRoom}>
        <BsChatDotsFill size={35} color="#fff" />
      </button>
      {showChatRoom && (
        <div className={styles['modal']}>
          <div className={styles['modal-content']}>
            <div className={styles['modal-title']}>
              <h4>聊天室</h4>
              <button className={styles['close']} onClick={closeModal}>
                &times;
              </button>
            </div>

            {/* Chat content */}
            <div className={styles['chat-content']}>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={
                    message.sender === memberName
                      ? styles['my-message']
                      : styles['other-message']
                  }
                >
                  {message}
                  {/* {message.split(':')[1].trim()} */}
                </div>
              ))}
            </div>

            {/* Message input */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className={styles['my-form']}
            >
              <input
                type="text"
                id=""
                name=""
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button type="submit" onClick={handleClick}>
                送出
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
