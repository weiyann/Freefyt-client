import { useEffect, useState } from 'react';
import styles from '@/styles/store/star.module.css';
import { FaStar } from 'react-icons/fa';

const Star = ({ onRatingChange, initrating }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [iconValue, setIconValue] = useState(5);
  const size = 40;

  useEffect(() => {
    setRating(initrating);
  }, [initrating]);

  const handleMousemove = (e, i) => {
    if (rating === 0) {
      const svgDom = document.getElementsByClassName('star')[i];
      const pathDom = svgDom.children[0];
      const starLeft = svgDom.getBoundingClientRect().left;
      const mouseX = e.pageX - starLeft;

      // 計算相對位置
      const halfStar = mouseX <= size / 2;
      const hoverValue = i + (halfStar ? 0.5 : 1);

      // 設定評分和星星狀態
      setHover(hoverValue);
      pathDom.style.fill = halfStar ? 'url(#orange_red)' : '';
    }
  };

  const handleClick = (e, i) => {
    const svgDom = document.getElementsByClassName('star')[i];
    const pathDom = svgDom.children[0];
    const starLeft = svgDom.getBoundingClientRect().left;
    const mouseX = e.pageX - starLeft;

    // 計算相對位置
    const halfStar = mouseX <= size / 2;
    const ratingValue = i + (halfStar ? 0.5 : 1);

    // 設定評分和星星狀態
    setRating(ratingValue);
    pathDom.style.fill = halfStar ? 'url(#orange_red)' : '';

    // 將評分狀態通知給父元件
    onRatingChange(ratingValue);
  };

  const handleDoubleClick = () => {
    setRating(0);
  };

  useEffect(() => {
    setHover(0);
  }, [rating]);

  useEffect(() => {
    if (initrating) {
      const filledStars = Math.floor(initrating);
      const hasHalfStar = initrating - filledStars === 0.5;

      // 設定星星狀態
      for (let i = 0; i < iconValue; i++) {
        const svgDom = document.getElementsByClassName('star')[i];
        const pathDom = svgDom.children[0];

        if (i < filledStars) {
          // 整星
          pathDom.style.fill = '#ffc107';
        } else if (hasHalfStar && i === filledStars) {
          // 半星
          pathDom.style.fill = 'url(#orange_red)';
        } else {
          // 未選中星星
          pathDom.style.fill = 'rgb(228, 229, 233)';
        }
      }
    }
  }, [initrating, iconValue]);

  return (
    <>
      <div id="start-wrap">
        <svg className={styles['linear-gradient-template']}>
          <linearGradient id="orange_red" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="50%" style={{ stopColor: 'rgb(255, 193, 7)' }}></stop>
            <stop
              offset="50%"
              style={{ stopColor: 'rgb(228, 229, 233)' }}
            ></stop>
          </linearGradient>
        </svg>
        {[...Array(iconValue)].map((icon, i) => {
          const value = i + 1;
          return (
            <label
              key={i}
              style={{ cursor: 'pointer' }}
              onDoubleClick={handleDoubleClick}
            >
              <FaStar
                className="star"
                color={
                  rating === 0
                    ? value <= hover
                      ? '#ffc107'
                      : 'rgb(228, 229, 233)'
                    : value <= rating
                    ? '#ffc107'
                    : ''
                }
                size={size}
                onMouseEnter={(e) => handleMousemove(e, i)}
                onMouseLeave={() => {
                  if (rating === 0) {
                    let svgDom = document.getElementsByClassName('star')[i];
                    let pathDom = svgDom.children[0];
                    pathDom.style.fill = '';
                  }
                }}
                onMouseMove={(e) => {
                  handleMousemove(e, i);
                }}
                onClick={(e) => {
                  handleClick(e, i);
                }}
              />
            </label>
          );
        })}
      </div>
    </>
  );
};

export default Star;