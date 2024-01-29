import { useState, useEffect } from 'react'
import styles from '@/styles/blog/blog.module.css'
import { useRouter } from 'next/router'
// import ThemeContext from "@/contexts/ThemeContext";
import Link from 'next/link'
import { BLOG_LIST, BLOG_ONE } from '@/configs'
import dayjs from 'dayjs'
import { FaRegHeart } from 'react-icons/fa'

export default function BlogList() {
  const [data, setData] = useState({})
  // const [keyword, setKeyword] = useState('')

  const router = useRouter()
  // const { theme, setTheme } = useContext(ThemeContext)

  // const [search, setSearch] = useState({
  //   page: +router.query.page || 1,
  //   category: +router.query.category || '',
  //   keyword: router.query.keyword || '',
  //   sortBy: router.query.sortBy || '',
  // })

  const getListData = async () => {
    const usp = new URLSearchParams(router.query)

    //console.log('router.query:', router.query)
    let page = +router.query.page || 1

    // 關鍵字搜尋
    let keyword = router.query.keyword || ''

    // tag
    let tag = router.query.tag || ''

    // 排序
    let sortBy = router.query.sortBy || ''

    if (page < 1) page = 1
    try {
      const r = await fetch(BLOG_LIST + `?${usp.toString()}`)
      //console.log(usp)
      const d = await r.json()
      console.log(d)
      setData(d)
    } catch (ex) {
      console.log(ex)
    }
  }

  useEffect(() => {
    getListData()
  }, [router.query.page, router.query.keyword, router.query.tag])

  //part2-1
  const removeItemAndReload = async (blogarticle_id) => {
    console.log({ blogarticle_id })

    const r = await fetch(BLOG_ONE + '/' + blogarticle_id, {
      method: 'DELETE',
    })
    const result = await r.json()
    if (result.success) {
      // alert("完成刪除")
      //router.reload();
      getListData()
    }
  }

//toggleCollected 可以收藏也可以取消收藏的功能
  function toggleCollected(){
    //1. 取得後端  這邊是firebase.firestore() 取得firestore的物件
    //2. collection 指定posts這個集合
    //3. 用doc呼叫哪一篇文章的id
    //4. 用update collectedby  紀錄這篇文章被哪一個使用者收藏
    //5. 使用const uid=firebae.auth().currentUeer.uid   取得當下使用者的id
    //目的：按下收藏icon後 會自動增加 collectedby 這個欄位 欄位內容是member_id


    //const uid=firebae.auth().currentUeer.uid

    //firebase.firestore().collection('posts').doc(blogarticle_id).update({
      //collectedBy:firebase.firestore.FieldValue.arrayUnion(uid),
    //})

  }
  return (
    <>
     

      {/* 搜尋匡 */}
      <div className="container">
        
        {/* 卡片區 */}
        <section>
          <div className={styles['blog-group']}>
            {data.rows &&
              data.rows.map((i) => {
                return (
                  <div className={styles['blog-item']} key={i.blogarticle_id}>
                    
                      <div className={styles['blog-img']}>
                        <img
                          src="https://www.worldgymtaiwan.com/files/club/101/2022gym/cardio-zone3.jpg"
                          alt="{v.name} "
                        />
                      </div>
                      <div className={styles['blog-aflex']}>
                        <div className={styles['blog-stock']}>
                          {i.member_nickname}
                        </div>
                        <div className={styles['blog-stock']}>
                          {dayjs(i.blogarticle_create).format(
                            'YYYY-MM-DD HH:mm'
                          )}
                        </div>
                      </div>
                      <div className={styles['blog-name']}>
                        {i.blogarticle_title}
                      </div>
                      {/* <div className={styles['blog-price']}>收藏</div> */}
                      <div className={styles['blog-info']}>
                        <div className={styles['blog-purchase-qty']}>
                          {i.blogarticle_content}
                        </div>
                        <div className={styles['blog-fav']}>
                          <FaRegHeart size={30} color="#1c3b5e" Link  
                            onClick={toggleCollected
                            }
                          />
                        </div>
                      </div>
                   
                    <div className={styles['cart-btn']}>
                      {/* <button
                        className={styles['add-to-cart-btn']}
                        // onClick={() => addItem(i)}
                        onClick={() => {}}
                      >
                        加入收藏
                      </button> */}
                      <Link href={`/blog/${i.blogarticle_id}`}>
                        <button className={styles['add-to-cart-btn1']}>
                          點選查看
                        </button>
                      </Link>
                    </div>
                  </div>
                )
              })}
          </div>
          
        </section>
      </div>
    </>
  )
}
