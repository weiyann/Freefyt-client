import React from 'react'
import { MdEditSquare } from 'react-icons/md'
import { MdDeleteForever } from 'react-icons/md'
import styles from '@/styles/blog/blogfunc.module.css'

export default function Selectfunc() {
  return (
    <>
      <div className={styles['blogsl']}>
        <button className={styles['blogslbtn']}>
          <MdEditSquare />
          編輯
        </button>
        <button className={styles['blogslbtn']}>
          <MdDeleteForever />
          刪除
        </button>
      </div>
    </>
  )
}
