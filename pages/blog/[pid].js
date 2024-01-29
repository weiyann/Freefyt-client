import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import styles from '@/styles/blog/blogpid.module.css'
import Link from 'next/link'
import { GiSelfLove } from 'react-icons/gi'
import { BLOG_ONE, BLOG_REPLY, BLOGREPLY_ADD } from '@/configs'
import dayjs from 'dayjs'
import AuthContext from '@/context/auth-context'
import FollowFavIcon2 from '@/components/blog/follow-fav-icon2'
import BlogFavIcon2 from '@/components/blog/blog-fav-icon2'
import Swal from 'sweetalert2'


export default function BlogDetail() {
  const [blog, setBlog] = useState({})
  //const [blogImages, setBlogImages] = useState([])
  const router = useRouter()

  const { auth } = useContext(AuthContext)
  const memberId = auth.id

  const getBlog = async () => {
    // console.log('router.query:', router.query.pid) // 除錯用
    let blogarticle_id = +router.query.pid || 1
    if (blogarticle_id < 1) blogarticle_id = 1

    try {
      const r = await fetch(BLOG_ONE + `/${blogarticle_id}`)
      const d = await r.json()
      //console.log({ d })
      setBlog(d)
    } catch (ex) {
      console.log(ex)
    }
  }

  useEffect(() => {
    getBlog()
  }, [router.query.pid])

  const [data, setData] = useState([])
  const [allData, setAllData] = useState(false)
  const getData = async () => {
    // console.log('router.query:', router.query.pid) // 除錯用
    let blogarticle_id = +router.query.pid || 1
    if (blogarticle_id < 1) blogarticle_id = 1

    try {
      const r = await fetch(BLOG_REPLY + `/${blogarticle_id}`)
      const d = await r.json()
      console.log({ d })
      setData(d)
    } catch (ex) {
      console.log(ex)
    }
  }
  const showAllData = () => {
    setAllData(true)
  }

  useEffect(() => {
    getData()
  }, [router.query.pid])

  //撰寫留言功能 連接後端api
  const [myForm, setMyForm] = useState({
    // blogarticle_id: +router.query.pid || 1,
    blogcomment_content: '',
  })

  // 表單送出通知
  const [displayInfo, setDisplayInfo] = useState('') // "", "succ", "fail"

  const changeHandler = (e) => {
    const { name, id, value } = e.target
    console.log({ name, id, value })
    setDisplayInfo('')

    //寫法1：把舊的值展開來 變成新的物件 把name換成新的值
    //setMyForm({...myForm,name: e.target.value}) ;
    //寫法2:
    //    setMyForm((old)=>{
    //     return{...old, name: e.target.value};
    //    });

    setMyForm({ ...myForm, [id]: value })
  }

  const onSubmit = async (e) => {
    // Prevent the form from submitting the traditional way
    e.preventDefault();
  
    // Send data
    let sendData = { ...myForm, blogarticle_id: +router.query.pid || 1 };
    const r = await fetch(BLOGREPLY_ADD, {
      method: 'POST',
      body: JSON.stringify(sendData),
      headers: {
        Authorization: 'Bearer ' + auth.token,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
  
    const responseData = await r.json();
    if (responseData.success) {
      // Clear the textarea value in the state
      setMyForm({ ...myForm, blogcomment_content: '' });
  
      // Set the displayInfo state to indicate success
      setDisplayInfo('succ');
      getData(); // Refresh the comments
    } else {
      // Set the displayInfo state to indicate failure
      setDisplayInfo('fail');
    }
  };

  return (
    <>
      <div className="container">
        <section className={styles['bgid']}>
          <div className={styles['bgid-page']}>
            {/* 作者 追蹤  */}
            <div className={styles['bgid-member']}>
              <Link href={`/blog/mylist/${blog.member_id}`}>
                <div className={styles['bgid-mem-in']}>
                  <div className={styles['bgid-mem-imgs']}>
                    <img
                      className={styles['bgid-mem-img-ins']}
                      alt=""
                      src={`http://localhost:3002/member/profile-img/${blog.member_pic}`}
                    />
                  </div>
                  <div className={styles['bgid-mem-men']}>
                    {blog.blogarticle_id && <p>作者：{blog.member_nickname}</p>}
                  </div>
                </div>
              </Link>
              {/* <button className={styles['bgid-mem-trac']}>追蹤</button> */}
              <FollowFavIcon2 follow_member={blog.member_id} />
            </div>

            {/* 標題 時間 內文  */}
            <div className={styles['bgid-pagedetaila']}>
              {blog.blogarticle_id && (
                <div className={styles['bgid-pagedetail']}>
                  <div className={styles['bgid-prepagedetail']}>
                    <p className={styles['bgid-timedetale']}>
                      {dayjs(blog.blogcomment_time).format('YYYY-MM-DD HH:mm')}
                    </p>
                    <div className={styles['bgid-class']}>
                      <p>全站分類：</p>
                      <p>{blog.blogclass_content}</p>
                    </div>
                  </div>

                  <div className={styles['bgid-title']}>
                    {blog.blogarticle_title}
                  </div>
                  <img
                    className={styles['bgid-img']}
                    src={`http://localhost:3002/blog/img/${blog.blogarticle_photo}`}
                  ></img>
                  <div className={styles['bgid-content']}>
                    {blog.blogarticle_content}
                  </div>
                </div>
              )}
            </div>

            {/* 收藏 按讚 分享  */}
            <div className={styles['bgid-collecting']}>
              <div className={styles['add-to-collect-word']}>
                <GiSelfLove />
                <p>喜歡這篇文章嗎？ 加入收藏吧</p>
                <GiSelfLove />
              </div>
              <BlogFavIcon2 blogarticle_id={blog.blogarticle_id} />
            </div>

            {/* 分類 原生文章 連結  */}
            <div className={styles['bgid-nextad']}>
              <div className={styles['bgid-nextblog']}>
                <div className={styles['bgid-upnextblog']}>
                  <div className={styles['bgid-mem-img']}>
                    <img
                      className={styles['bgid-mem-img-in']}
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-wsvYr9PX1-i9QXK2WjUT4ZBH0sX6UR81pQ&usqp=CAU"
                    ></img>
                  </div>
                  <div className={styles['bgid-nextblog-a']}>
                    <h3>咖啡廳的狗</h3>
                    <p>13篇文章</p>
                  </div>
                </div>
                <div className={styles['bgid-nextblog-b']}>
                  <p>
                    台中新開的健身房，超豪華設施搭配專業健身教練，開幕價九折
                  </p>
                </div>

                <button className={styles['bgid-nextblogbtn']}>
                  查看推薦文章
                </button>
              </div>
              <div className={styles['bgid-nextblog']}>
                <div className={styles['bgid-upnextblog']}>
                  <div className={styles['bgid-mem-img']}>
                    <img
                      className={styles['bgid-mem-img-in']}
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTv69a8o6szRoPfHQthOIfOOhmmpNrozBfMGA&usqp=CAU"
                    ></img>
                  </div>
                  <div className={styles['bgid-nextblog-a']}>
                    <h3>哈士奇愛上健身</h3>
                    <p>31篇文章</p>
                  </div>
                </div>
                <div className={styles['bgid-nextblog-b']}>
                  <p>
                    你還在為飲食煩惱嗎？為什麼吃這麼少卻瘦不下來？討厭的肚肚該怎麼樣才能消？
                    吃這個就對了
                  </p>
                </div>
                <button className={styles['bgid-nextblogbtn']}>
                  查看推薦文章
                </button>
              </div>
            </div>

            {/* 留言  */}

            <div className={styles['bgid-response']}>
              {/* 撰寫留言  */}
              <form
                className={styles['bg-writereplyform']}
                name="form1"
                onSubmit={onSubmit}
              >
                {/* <input type="text" value='' name='' /> */}
                <p>留下你的評論</p>
                <div className={styles['bg-writereply-a']}>
                  {/* <input
                    type="text"
                    className={styles['bgid-writecontent']}
                    id="memberID"
                    name="memberID"
                    value={memberId}
                    onChange={changeHandler}
                  />
                  <input
                    type="text"
                    className={styles['bgid-writecontent']}
                    id="blogarticle_id"
                    name="blogarticle_id"
                    value={myForm.blogarticle_id}
                    onChange={changeHandler}
                  /> */}
                  <div className="form-text"></div>
                </div>
                <div className={styles['bg-writereply-a']}>
                  <textarea
                    className={styles['bgid-writecontent']}
                    id="blogcomment_content"
                    name="blogcomment_content"
                    cols="30"
                    rows="3"
                    value={myForm.blogcomment_content}
                    onChange={changeHandler}
                  ></textarea>
                  <button type="submit" className={styles['bgid-enterbtn']}>
                    送出留言
                  </button>
                </div>

                {/* 如果有值 displayInfo ?  ( 如果displayIndo成功 ? 資料新增成功 ： 新增失敗） ：null */}
                {displayInfo ? (
                  displayInfo === 'succ' ? (
                    <div class="alert alert-success" role="alert">
                      
                    </div>
                  ) : (
                    <div class="alert alert-danger" role="alert">
                      
                    </div>
                  )
                ) : null}
              </form>
              {/* 留言板查看全部  */}
              <div className={styles['bgidre-titel']}>
                <h5>看看大家怎麼說</h5>
              </div>

              {/* 查看留言  */}
              {Array.isArray(data) &&
                (allData ? data : data.slice(0, 1)).map((i) => (
                  <section
                    className={styles['bgid-cards']}
                    key={i.blogarticle_id}
                  >
                    <div className={styles['bgid-item']}>
                      <div className={styles['bgid-flex']}>
                      <Link href={`/blog/mylist/${i.member_id}`}>
                        <div className={styles['bgid-img-a']}>
                          <img
                            src={`http://localhost:3002/member/profile-img/${i.member_pic}`}
                            alt="{v.name} "
                          />
                        </div>
                        </Link>
                        {/* <div className={styles['bgid-name']}>name</div>
                <div className={styles['bgid-price']}>price</div> */}
                        <div className={styles['bgid-info']}>
                          <div>
                            <div className={styles['bgid-stock']}>
                              {i.member_nickname}
                            </div>
                            <div className={styles['blog-fav']}>
                              {dayjs(i.blogcomment_time).format(
                                'YYYY-MM-DD HH:mm'
                              )}
                            </div>
                            <div className={styles['bgid-purchase-qty']}>
                              {i.blogcomment_content}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                ))}

              <button className={styles['bgid-showall']} onClick={showAllData}>
                --查看全部--
              </button>
            </div>
          </div>
          {/* <div className={styles['bgid-suggest']}>123</div> */}
        </section>
      </div>
    </>
  )
}
