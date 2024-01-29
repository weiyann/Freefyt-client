import React, { useState } from 'react';
import styles from '@/styles/blog/func.module.css';
import BlogEdit from '../edit/[sid]';

export default function Editbtn() {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleButtonClick = () => {
    setShowDropdown(!showDropdown);
  };

  const [editingShow, setEditingShow] = useState(false);

  const handleDeleteClick = () => {
    // 在這裡處理刪除按鈕被點擊的邏輯
    console.log('刪除按鈕被點擊');
  };

  return (
    <>
      <div className={styles['blogedit']} onClick={handleButtonClick}>
        <div className={styles['blogedit1']}>123</div>
        <div className={styles['blogedit2']}>hello</div>
      </div>

      {showDropdown && (
        <div className={styles['dropdown']}>
          <button onClick={() => setEditingShow(true)} >編輯</button>
          <button onClick={handleDeleteClick}>刪除</button>
          {editingShow &&
        <BlogEdit /** 編輯視窗 */
          show={editingShow}
          onHide={() => setEditingShow(false)}
          state="editing"
        />}
        </div>
      )}
    </>
  );
}
