export const PORT = 6005
export const DEV = true

// express 的位置
export const apiBaseUrl = 'http://localhost:3005/api'
export const avatarBaseUrl = 'http://localhost:3005/avatar'

// server
export const API_SERVER = 'http://localhost:3002'

// 會員註冊
export const MEMBER_SIGNUP = API_SERVER + '/member/signup'

// 會員註冊地址資料
export const MEMBER_ADDRESS_CITY = API_SERVER + '/member/signup/city/api'

// 會員詳細資料地址資料
export const MEMBER_ADDRESS_CITY_DISTRICT =
  API_SERVER + '/member/signup/city-district/api'

// 會員詳細資料
export const MEMBER_PROFILE = API_SERVER + '/member/profile/api'
export const MEMBER_PROFILE_PIC = API_SERVER + '/member/profile-img'

// 重訓計畫 & 組合
export const WORKOUT_PLAN =
  API_SERVER + '/fytrack/track-training/workout-plan/api'
export const WORKOUT_VARIATION =
  API_SERVER + '/fytrack/track-training/workout-variation/api'

// 商品總列表
export const PRODUCT_LIST = API_SERVER + '/product-list/api'

// 商品圖片
export const PRODUCT_IMG = API_SERVER + '/product-list/api/getImage'

// 單一商品
export const PRODUCT_ONE = API_SERVER + '/product-list/api/getProduct'

// 單一商品所有商品評論
export const PRODUCT_ONE_COMMENT =
  API_SERVER + '/product-list/api/getProductComment'

// 商品評論會員圖片
export const PRODUCT_ONE_COMMENT_IMG =
  API_SERVER + '/product-list/api/getMemberImage'

// 熱門商品10筆
export const PRODUCT_POPULAR = API_SERVER + '/product-list/api/popularProducts'

// 相關商品10筆
export const PRODUCT_RELATED = API_SERVER + '/product-list/api/relatedProducts'

// 歷史訂單 - status:訂單處理中
export const PRODUCT_MYONGOINGPO = API_SERVER + '/product-list/api/GetOngoingPo'

// 歷史訂單 - status:已完成
export const PRODUCT_MYCOMPLETEDPO =
  API_SERVER + '/product-list/api/GetCompletedPo'

// 新增商品評論
export const PRODUCT_COMMENT_ADD = API_SERVER + '/product-list/product-comment'

// 商品收藏紀錄
export const PRODUCT_COLLECTION =
  API_SERVER + '/product-list/my-product-collection'

// 商品加入收藏
export const PRODUCT_ADD_FAV = API_SERVER + '/product-list/add-product-fav' // POST

// 商品移除收藏
export const PRODUCT_REMOVE_FAV =
  API_SERVER + '/product-list/remove-product-fav' // POST

// 購物車 - 取得會員資料
export const CART_MEMBER_INFO = API_SERVER + '/cart/member-info'

// 購物車 - 取得會員折價卷
export const CART_MEMBER_COUPON = API_SERVER + '/cart/member-coupon'

// 購物車 - 建立訂單
export const CART_CREATEPO = API_SERVER + '/cart/add-purchase-order'

// 購物車 - 取得訂單資料
export const CART_GETPO = API_SERVER + '/cart/api/purchase-order'

// 購物車 - 取得訂單商品明細
export const CART_GETPODETAIL = API_SERVER + '/cart/api/order-detail'

// 購物車 - 與 LINE Pay 串接
export const CART_LINEPAY = API_SERVER + '/cart/createLinePayOrder' // POST

// 購物車 - 與 LINE Pay 確認訂單
export const CART_LINEPAYCONFIRM = API_SERVER + '/cart/linePay/confirm'

// 課程標籤
export const COURSE_TAGS = API_SERVER + '/course/course-tags' // get

// 課程總表
export const COURSE_LIST = API_SERVER + '/course' // get

// BLOG-健身論壇總表
export const BLOG_LIST = API_SERVER + '/blog-list/api' // get

// BLOG-單一文章
export const BLOG_ONE = API_SERVER + '/blog-list/api/detail'

// BLOG-該文章留言
export const BLOG_REPLY = API_SERVER + '/blog-list/api/reply'

// BLOG-個人文章總表
export const BLOG_MYLIST = API_SERVER + '/blog-list/mypage'

// BLOG-個人收藏的文章總表
export const BLOG_MYLISTCOLLECT = API_SERVER + '/blog-list/mypagecollect'

// BLOG-個人文章總表個人頁
export const BLOG_MYONELIST = API_SERVER + '/blog-list/myonepage'

// BLOG- 個人文章編輯 得到原本內容
export const BLOG_GET_ONE = API_SERVER + '/blog-list/api/edit' // method: GET

//  BLOG-個人文章編輯 更新
export const BLOG_EDIT_ONE = API_SERVER + '/blog-list/edit' // method: PUT

//  BLOG-個人文章新增
export const BLOG_ADD = API_SERVER + '/blog-add/addblog'

//  BLOG-個人文章刪除
export const BLOG_DELETE = API_SERVER + '/blog-list/delete'

//  BLOG-文章留言新增
export const BLOGREPLY_ADD = API_SERVER + '/blog-add/addreply' 

//  BLOG-文章分類
export const BLOG_CLASS = API_SERVER + '/blog-list/myclass'

//  BLOG-加入收藏
export const BLOG_FAV_ADD = API_SERVER + '/blog-list/add-blog-fav' // post

//  BLOG-移除收藏
export const BLOG_FAV_REMOVE = API_SERVER + '/blog-list/delete-blog-fav' // delete

//  BLOG-收藏列表
export const BLOG_FAV = API_SERVER + '/blog-list/get-blog-fav' // get

//  BLOG-Follow-加入Follow-
export const FOLLOW_FAV_ADD = API_SERVER + '/blog-list/add-follow-fav' // post

//  BLOG-Follow-移除Follow-
export const FOLLOW_FAV_REMOVE = API_SERVER + '/blog-list/delete-follow-fav' // delete

//  BLOG-Follow-收藏Follow
export const FOLLOW_FAV = API_SERVER + '/blog-list/get-follow-fav' // get

//  BLOG-Follow-算多少FANS
export const BLOG_FANS = API_SERVER + '/blog-list/fans' // get

//  BLOG-Follow-算多少FANS
export const BLOG_FANSLIST = API_SERVER + '/blog-list/fanslist' // get

// 課程圖片
export const COURSE_IMG = API_SERVER + '/course/get-course-img' // get

// 課程詳細頁
export const COURSE_DETAIL = API_SERVER + '/course/detail' // get

// 會員課程訂單
export const MEMBER_ORDER = API_SERVER + '/course/member/member-order' // get

// 課程訂單
export const COURSE_ORDER = API_SERVER + '/course/course-order' // get

// 修改課程評論
export const COURSE_COMMENT_EDIT = API_SERVER + '/course/member/course-comment' // put

// 課程評論表
export const COURSE_COMMENT = API_SERVER + '/course/comment-list' // get

// 更改課程時間
export const COURSE_TIME_CHANGE = API_SERVER + '/course/member/change-time' // put

// 課程教練圖片
export const COURSE_COACH_IMG = API_SERVER + '/course/get-coach-img' // get

// 課程寄信
export const COURSE_MAIL = API_SERVER + '/course/send-course-mail' // post

// 課程教練身份
export const COURSE_MEMBER_DATA = API_SERVER + '/course/get-course-member-data' // post

// 課程加入收藏
export const COURSE_FAV_ADD = API_SERVER + '/course/add-course-fav' // post

// 課程移除收藏
export const COURSE_FAV_REMOVE = API_SERVER + '/course/delete-course-fav' // delete

// 課程收藏列表
export const COURSE_FAV = API_SERVER + '/course/get-course-fav' // get

// 課程上課記錄
export const COURSE_RECORD = API_SERVER + '/course/coach/coach-record' // get

// 更改上課狀態
export const COURSE_STATUS_CHANGE = API_SERVER + '/course/coach/record-status-changed' // put

// 會員課程訂單(我的課程用)
export const MEMBER_ORDER_COURSE = API_SERVER + '/course/member/member-order-course' // get

// 更改時間的email
export const TIME_CHANGE_EMAIL = API_SERVER +'/course/change-time-mail' // post

// 課程上課記錄
export const COACH_ORDER = API_SERVER + '/course/coach/coach-order' // get

