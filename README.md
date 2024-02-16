# Freefyt-client

## 【網站簡介】

FreeFYT 健身網是一個有別於傳統健身網站的全方位健身平台，透過課程、商城、論壇以及各種和健身相關的計算機和追蹤工具，幫助人們實現自己訂下的健身訓練目標。 
[後端連結](https://github.com/weiyann/FreeFyt-server)
[專案企劃書連結](https://drive.google.com/file/d/12C3EMI37sLOJJcCcxD2vsG7DfTdVlUNM/view?usp=sharing)

## 【課程專區功能簡介】

1. 可進行課程排序、關鍵字搜尋、標籤搜尋方便找到適合使用者的課程
2. 會員可對喜歡的課程進行收藏
3. 以自製的時間表實現課程預約功能
4. 串接綠界金流api實現課程付款功能
5. 以月曆的形式管理個人課表
6. 可進行課程時間更改，課程評論
7. 訂單成立伺服器寄發通知信到會員信箱


## 【使用技術】

1. 前端使用 React.js 進行開發，並用 Next.js 框架實現了 SSR、靜態生成、路由系統等功能
2. 後端使用 Node.js 和 Express搭建伺服器，實現 RESTful API
3. 使用useContext在全域管理收藏狀態
4. 使用dayjs套件處理時間邏輯，搭配lodash函式庫自製預約時間表和可滑鼠拖放課程的月曆課表
5. 自製彈出視窗元件，星星評分元件
6. 用nodemailer套件從伺服器寄送email