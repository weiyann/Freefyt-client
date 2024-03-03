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

1. 前端使用 React.js 進行開發，並用 Next.js 框架實現了靜態生成、路由系統等功能
2. 後端使用 Node.js 和 Express搭建伺服器，實現 RESTful API
3. 使用useContext在全域管理收藏狀態
4. 使用dayjs套件處理時間邏輯，搭配lodash函式庫自製預約時間表和可滑鼠拖放課程的月曆課表
5. 自製彈出視窗元件，星星評分元件
6. 用nodemailer套件從伺服器寄送email

## 【demo 影片】
### 課程列表&搜尋排序
1. 串接後端伺服器及資料庫呈現課程列表
2. 關鍵字搜尋、標籤搜尋、價格排序


https://github.com/weiyann/Freefyt-client/assets/147689168/92654274-9de7-473b-9fec-54280f34f5bd


### 加入收藏
1. 使用 React Context 在會員登入時全域管理收藏狀態
2. 透過點擊 icon 改變收藏狀態，並渲染畫面


https://github.com/weiyann/Freefyt-client/assets/147689168/e5257021-dfb5-49af-8268-bcda3a086933


### 課程預約及購買
1. 自製預約課程的時間表
2. 判斷會有衝突的時間決定課程是否可預約已增加使用者體驗(過去的時間、24小時內的時間、已經被預約過的時間、同樣時段自己已預約其他課程，都無法預約)
3. 串接綠界金流支付實現付款功能


https://github.com/weiyann/Freefyt-client/assets/147689168/25bab10e-0184-4905-8251-8409f1024ac9


### 課表管理(更改時間)
1. 自製月曆呈現會員預約課表(當天日期格會呈現淺藍色，影片當天為3/3)，並根據課程狀態用不同顏色作區別(橘：已預約，藍：未確認預約，灰：已完成)
2. 滑鼠拖放更改課程日期(過去的日期、已完成的課程無法做拖放)
3. 自製時間表更改課程時段


https://github.com/weiyann/Freefyt-client/assets/147689168/d988b637-e0c2-4b8e-94bb-2b0d839ddb48


### 評分和評論
1. 自製星星評分元件


https://github.com/weiyann/Freefyt-client/assets/147689168/81060432-7d10-4fef-8e99-01e34bac6cb3

