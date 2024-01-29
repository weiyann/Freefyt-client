import { useState, useContext } from 'react'
import styles from '@/styles/blog/blogadd.module.css'
import { useRouter } from 'next/router'
// import { z } from "zod";
// import { AB_ADD } from "@/components/my-const";
import MyEditor from '../../../components/blog/MyEditor'
import { BLOG_ADD } from '@/configs'
import AuthContext from '@/context/auth-context'
import Swal from 'sweetalert2'

export default function ABAdd() {
  const { auth } = useContext(AuthContext)
  const memberId = auth.id

  const router = useRouter()

  const [myForm, setMyForm] = useState({
    blogread_sum: '0',
    blogclass_id: '',
    blogarticle_public: '0',
    blogarticle_title: '',
    blogarticle_content: '',
    // avatar: 'hey',
  })
  // 表單送出通知
  const [displayInfo, setDisplayInfo] = useState('') // "", "succ", "fail"

  const changeHandler = (e) => {
    console.log(e)
    const { name, id, value } = e.target
    //e.target.file
    console.log({ name, id, value })
    setDisplayInfo('')
    setMyForm({ ...myForm, [id]: value })
  }

  const [imageFile, setImageFile] = useState()
  const [imagePreview, setImagePreview] = useState(null)
  const onUploadImage = (e) => {
    const file = e.target.files?.[0]

    if (file) {
      // set to some react state
      setImageFile(file)
      // preview image
      const previewURL = URL.createObjectURL(file)
      // render to page
      setImagePreview(previewURL)
    }

    changeHandler(e)
  }

  const onSubmit = async (e) => {
    //沒有讓表單送出
    e.preventDefault()

    //TODO: 檢查各欄位的資料

    const formData = new FormData()

    Object.entries(myForm).forEach(([key, value]) => {
      formData.append(key, value)
    })

    formData.append('avatar', imageFile)

    // 嚴謹的檢查方式

    //送出資料
    const r = await fetch(BLOG_ADD, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: 'Bearer ' + auth.token,
      },
      credentials: 'include',
    })

    const responseData = await r.json()
    if (responseData.success) {
      setDisplayInfo('succ')
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: '已成功編輯完成',
        showConfirmButton: false,
        timer: 1500,
      })
      setTimeout(() => {
        router.push(`/blog/mylist/${memberId}`)
      }, 1500)
    } else {
      setDisplayInfo('fail')
      // alert("新增發生錯誤!!!");
    }
  }
  // console.log("re-render---", new Date());

  return (
    <>
      <div className="container">
        <h3 className={styles['card-title']}>新增文章</h3>
        <div className={styles['bga-body']}>
          <div className={styles['bga-form']}>
            <form
              className={styles['bga-forms']}
              name="form1"
              onSubmit={onSubmit}
            >
              {/* 標題 */}
              <div className={styles['mb-3']}>
                <label htmlFor="name" className={styles['form-label']}>
                  文章標題
                </label>
                <br />
                <input
                  type="text"
                  className={styles['form-control']}
                  id="blogarticle_title"
                  name="blogarticle_title"
                  //綁住changeHandler 當作事件處理器 ()=>{} 變成 綁住changeHandler

                  value={myForm.blogarticle_title}
                  onChange={changeHandler}
                />
                <div className={styles['form-text']}></div>
              </div>

              {/* 分類 */}
              <div className={styles['mb-3']}>
                <label htmlFor="name" className={styles['form-label']}>
                  文章分類
                </label>
                <br />
                {/* <input
                  type="select"
                  className={styles['form-control']}
                  id="blogclass_id"
                  name="blogclass_id"
                  //綁住changeHandler 當作事件處理器 ()=>{} 變成 綁住changeHandler

                  value={myForm.blogarticle_title}
                  onChange={changeHandler}
                /> */}
                <select
                  className={styles['form-control']}
                  id="blogclass_id"
                  name="blogclass_id"
                  onChange={(e) => changeHandler(e)}
                >
                  <option>--請選擇--</option>
                  <option value="1">飲食營養</option>
                  <option value="2">拓點展示</option>
                  <option value="3">健身攻略</option>
                  <option value="4">健康之旅</option>
                  <option value="5">飲食美學</option>
                  <option value="6">心情分享</option>
                  <option value="7">運動日誌</option>
                  <option value="8">生活淺談</option>
                  <option value="9">保險健康</option>
                  <option value="10">重訓訓練</option>
                </select>
                <div className={styles['form-text']}></div>
              </div>

              {/* 內文 */}
              <div className={styles['mb-3']}>
                <label htmlFor="name" className={styles['form-label']}>
                  文章內容
                </label>
                <br />
                <textarea
                  className={styles['form-control']}
                  id="blogarticle_content"
                  name="blogarticle_content"
                  cols="30"
                  rows="3"
                  value={myForm.blogarticle_content}
                  onChange={changeHandler}
                ></textarea>
                {/* <MyEditor
                  className={styles['form-control']}
                  id="blogarticle_content"
                  name="blogarticle_content"
                  cols="30"
                  rows="3"
                 value={myForm.blogarticle_content}
                  onChange={changeHandler}
                ></MyEditor> */}
              </div>

              {/* 首圖 */}
              <div className={styles['mb-3']}>
                <label htmlFor="name" className={styles['form-label']}>
                  上傳首圖
                </label>
                <br />
                <input
                  type="file"
                  className={styles['form-control']}
                  id="blogarticle_photo"
                  name="blogarticle_photo"
                  //綁住changeHandler 當作事件處理器 ()=>{} 變成 綁住changeHandler

                  //value={myForm.blogarticle_photo}
                  onChange={onUploadImage}
                />
                <div className={styles['blog-headimg']}>
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className={styles['uploaded-image-preview']}
                    />
                  )}
                </div>

                <div className={styles['form-text']}></div>
              </div>

              {/* 如果有值 displayInfo ?  ( 如果displayIndo成功 ? 資料新增成功 ： 新增失敗） ：null */}
              {displayInfo ? (
                displayInfo === 'succ' ? (
                  <div class="alert alert-success" role="alert">
                    {/* 文章新增成功 */}
                  </div>
                ) : (
                  <div class="alert alert-danger" role="alert">
                    您有欄位尚未填寫
                  </div>
                )
              ) : null}

              <button type="submit" className={styles['bga-btn']}>
                送出文章
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
