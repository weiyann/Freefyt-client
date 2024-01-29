import { useState, useEffect, useContext } from 'react';
import styles from '@/styles/blog/blogmy.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BLOG_MYONELIST } from '@/configs';
import FollowFavIcon from '@/components/blog/follow-fav-icon';
import AuthContext from '@/context/auth-context';

export default function MyPage() {
  const { auth, followFav, setFollowFav } = useContext(AuthContext);
  const memberId = auth.id;

  const [blog, setBlog] = useState({});
  const router = useRouter();

  const getBlog = async () => {
    let member_id = +router.query.pid || 1;
    if (member_id < 1) member_id = 1;

    try {
      const r = await fetch(BLOG_MYONELIST + `/${member_id}`);
      const d = await r.json();
      setBlog(d);
    } catch (ex) {
      console.log(ex);
    }
  };

  useEffect(() => {
    getBlog();
  }, [router.query.pid, followFav]);

  const [showFull, setShowFull] = useState(false);
  const initialDisplayedBio = blog.member_bio ? blog.member_bio.slice(0, 5) + '...' : '';
  const [displayedBio, setDisplayedBio] = useState(initialDisplayedBio);

  return (
    <>
      {blog.member_id && (
        <div className="container">
          <div className={styles['bgm-all']}>
            <div className={styles['bgm-head']}>
              <div className={styles['bgm-selfpro']} key={blog.member_id}>
                <div className={styles['bgm-selfpro-a']}>
                  <div className={styles['bgm-selfpro-img']}>
                    <img
                      className={styles['bgm-selfpro-img-in']}
                      alt=""
                      src={`http://localhost:3002/member/profile-img/${blog.member_pic}`}
                    />
                  </div>
                  <div className={styles['bgm-selfpro-b']}>
                    <p>{blog.member_name}</p>
                    <h6>{blog.member_nickname}</h6>
                    <h5>{displayedBio}</h5>
                    <button
                    className={styles['bgm-selfpro-btm']}
                      onClick={() => {
                        setShowFull(!showFull);
                        setDisplayedBio(
                          showFull ? blog.member_bio : blog.member_bio.slice(0, 5) + '...'
                        );
                      }}
                    >
                      {showFull ? '...顯示全部' : '...顯示較少'}
                    </button>
                  </div>
                </div>
                <div className={styles['bgm-selfpro-d']}></div>
              </div>

              <div className={styles['bgm-follow']}>
                <div className={styles['bgm-follow-a']}>
                  <div className={styles['bgm-follow-post']}>
                    <p>POST</p>
                    <h3>{blog.total_bloglist_members}</h3>
                  </div>
                  <div className={styles['bgm-follow-post']}>
                    <p>FANS</p>
                    <h3>{blog.followers_count}</h3>
                  </div>
                </div>
              </div>
            </div>

            {memberId === +router.query.pid ? (
              <div className={styles['bgm-follow-fans']}>
                <button className={styles['bgm-follow-btnfans']}>
                  編輯個人資料
                </button>
              </div>
            ) : (
              <div className={styles['bgm-follow-b']}>
                <FollowFavIcon follow_member={blog.member_id} />
                <button className={styles['bgm-follow-btn']}>Message</button>
                <button className={styles['bgm-follow-btn']}>Email</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
