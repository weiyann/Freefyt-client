import React from 'react'
import styles from '@/styles/member/member.module.css'

export default function MenuButton({ icon, text, url }) {
  return (
    <div className={styles['menu__icon-text-pair']}>
      <div className={styles['menu__icon']}>{icon}</div>
      <p className={styles['menu__text']}>{text}</p>
    </div>
  )
}
