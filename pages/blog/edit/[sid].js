import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { BLOG_GET_ONE, BLOG_EDIT_ONE } from '@/configs'
import MyEditor from '../../../components/blog/MyEditor'
import styles from '@/styles/blog/blogedit.module.css'
import Swal from 'sweetalert2'

// 送出無法成功
// 送出想新增當下時間

export default function BlogEdit() {
  const [myForm, setMyForm] = useState({
    blogarticle_id: '',
    blogarticle_title: '',
    blogarticle_content: '',
  })

  const router = useRouter()

  useEffect(() => {
    const blogarticle_id = +router.query.sid || 1
    console.log({ blogarticle_id, raw: router.sid })

    //有抓到值 是NaN,就跳轉
    // 有抓到值時 (router.query.blogarticle_id !== undefined), 再判斷 blogarticle_id 是不是 NaN

    if (router.query.sid !== undefined) {
      // 有抓到值時
      //因為資料在server端 無法render
      //router.push("/blog-list")

      if (!blogarticle_id) {
        router.push('/blog') // blogarticle_id 是 NaN 就跳到列表頁
      } else {
        // 取得單筆資料
        fetch(BLOG_GET_ONE + '/' + blogarticle_id)
          .then((r) => r.json())
          .then((data) => {
            //如果data是true 就顯示  not就是沒拿到資料就跳轉
            if (!data.success) {
              router.push('/blog') // 沒拿到資料, 跳到列表頁
            } else {
              setMyForm({ ...data.row })
            }
          })
          .catch((ex) => console.log(ex))
      }
    }
  }, [router.query.sid])

  const [displayInfo, setDisplayInfo] = useState('') // "", "succ", "fail"

  const changeHandler = (e) => {
    const { name, id, value } = e.target
    console.log({ name, id, value })
    setDisplayInfo('')
    setMyForm({ ...myForm, [id]: value })
  }
  const onSubmit = async (e) => {
    e.preventDefault()

    // TODO: 檢查各個欄位的資料

    //展開複製 再刪除ｃ
    const mySend = { ...myForm }
    //delete mySend.created_at

    const r = await fetch(BLOG_EDIT_ONE + '/' + myForm.blogarticle_id, {
      method: 'PUT',
      body: JSON.stringify(mySend),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const responseData = await r.json()
    if (responseData.success) {
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: '已成功編輯完成',
        showConfirmButton: false,
        timer: 1500,
      })
      setTimeout(() => {
        router.push(`/blog/${myForm.blogarticle_id}`)
      }, 1500)
    } else {
      setDisplayInfo('fail')
    }
  }

  return (
    <>
      <div className="container">
      
        <h3 className={styles['card-title']}>編輯文章</h3>
        <div className={styles['bga-body']}>
          <div className={styles['bga-form']}>
            <form
              className={styles['bga-forms']}
              name="form1"
              onSubmit={onSubmit}
            >
            {/* 圖片 */}
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
                />
                <div className={styles['blog-headimg']}>
                   
                    <img
                      src={`http://localhost:3002/blog/img/${myForm.blogarticle_photo}`}
                      alt="Preview"
                      className={styles['uploaded-image-preview']}
                    />
                  
                </div>

                <div className={styles['form-text']}></div>
              </div>
              <br></br>
            {/* 標題 */}
              <div className={styles['mb-3']}>
                <label
                  htmlFor="blogarticle_title"
                  className={styles['form-label']}
                >
                  文章標題
                </label>
                <br />
                <input
                  type="text"
                  className={styles['form-control']}
                  id="blogarticle_title"
                  name="blogarticle_title"
                  value={myForm.blogarticle_title}
                  onChange={changeHandler}
                />
              </div>
              <br></br>
              {/* 分類 */}
              <div className={styles['mb-3']}>
                <label
                  htmlFor="blogclass_id"
                  className={styles['form-label']}
                >
                  文章分類
                </label>
                <br />

                <select
                  className={styles['form-control']}
                  id="blogclass_id"
                  name="blogclass_id"
                  value={myForm.blogclass_id}
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
              </div>
              <br></br>
              {/* 內容 */}
              <div className={styles['mb-3']}>
                <label
                  htmlFor="blogarticle_content"
                  className={styles['form-label']}
                >
                  文章內容
                </label>
                <textarea
                    className={styles["form-control"]}
                    id="blogarticle_content"
                    name="blogarticle_content"
                    cols="30"
                    rows="3"
                    value={myForm.blogarticle_content}
                    onChange={changeHandler}
                  ></textarea>
                {/* <MyEditor
                  className="form-control"
                  id="blogarticle_content"
                  name="blogarticle_content"
                  value={myForm.blogarticle_content}
                  onChange={(content) =>
                    setMyForm({ ...myForm, blogarticle_content: content })
                  }
                ></MyEditor> */}
              </div>
              
              {displayInfo ? (
                displayInfo === 'succ' ? (
                  <div class="alert alert-success" role="alert">
                    
                  </div>
                ) : (
                  <div class="alert alert-danger" role="alert">
                   
                  </div>
                )
              ) : null}
              {/* <Link href={`/blog/${myForm.blogarticle_id}`}> */}
              <button type="submit" className={styles['bga-btn']}>
                送出文章
              </button>
              {/* </Link> */}
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
