// MyComponent.jsx

import React, { useState } from 'react';
import styles from '@/styles/blog/func.module.css';

const MyBlogIcon = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    
      <div
        className={styles.box}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={`${styles.hello} ${isHovered ? styles.helloHovered : ''}`}>
          <img src="/image/blog-indexbtn.png" />
          </div>
          {isHovered && (
            <ul className={styles.options}>
              <li className={styles.option}>a</li>
              <li className={styles.option}>b</li>
              <li className={styles.option}>c</li>
            </ul>
          )}
        
      </div>
    
  );
};

export default MyBlogIcon;
