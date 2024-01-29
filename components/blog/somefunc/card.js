import React, { useEffect } from "react";
import { motion } from "framer-motion";
import styles from '@/styles/blog/hey2.module.css';

function Card({ text, index }) {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // 啟動動畫
      // 你的原始程式碼這裡...
    }, 10000); // 5 秒延遲

    // 清除計時器以防止在元件卸載前仍然執行
    return () => clearTimeout(timeoutId);
  }, []); // 空的依賴陣列表示只在元件挂載時執行一次

  return (
    <motion.div
      className={styles['card']}
      initial={{
        opacity: 0,
        x: 90
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        transition: {
          duration: 1
        }
      }}
      viewport={{ once: true }}
    >
      <p className={styles['card-text']}>{text}</p>
    </motion.div>
  );
}

export default Card;
