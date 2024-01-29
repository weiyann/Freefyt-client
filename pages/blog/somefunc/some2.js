import React, { useState } from 'react';

const LongText = () => {
  const initialContent = "這是一個擁有300字的範例文字，第一行有20字，剩下的內容將會在按下'顯示全部'按鈕後呈現。這是一個擁有300字的範例文字，第一行有20字，剩下的內容將會在按下'顯示全部'按鈕後呈現。這是一個擁有300字的範例文字，第一行有20字，剩下的內容將會在按下'顯示全部'按鈕後呈現。";

  const [content, setContent] = useState(initialContent);
  const [showFull, setShowFull] = useState(false);

  const toggleContent = () => {
    
  };

  const divStyle = {
    height: '500px',
    backgroundColor: 'lightblue',
    border: '1px solid #ccc',
  };
  return (
    <>
     <div style={divStyle}>
      {/* 這裡可以放入 div 內的內容 */}
    </div>
    <div>
      <p>{content}</p>
      <button onClick={()=>{setShowFull(!showFull);
    if (showFull) {
      setContent(initialContent);
    } else {
      setContent(initialContent.slice(0, 20) + "...");
    }}}>{showFull ? '顯示全部' : '顯示較少'}</button>
    </div>
    </>
    
  );
};

export default LongText;
