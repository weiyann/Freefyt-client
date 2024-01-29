import React from 'react'
import Link from 'next/link'
import { FaFacebook } from 'react-icons/fa'
import { FaInstagramSquare } from 'react-icons/fa'
import { FaYoutube } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div id="footertitle">FreeFYT</div>
        <div id="footercontain">
          <div className="ftc-1">
            <div className="ftc-title">ABOUT US</div>
            <p className="ftc-text1">
              相關研究證實運動及健身能有效促進人民健康，體育發展程度更是國家現代化及國民生活品質的重要指標。
              本網站宗旨以提供優質健身環境促進人民健康並宣導正確運動觀念做為設立宗旨，透過此平台可以了解及分享自己體能狀態，找尋教練或是購買相關產品，提升自己健康生活。
            </p>
          </div>
          <div className="ftc-2">
            <div className="ftc-title">SERVICE</div>
            <ul>
              <li>
                <Link href="/">健身追蹤</Link>
              </li>
              <li>
                <Link href="/">線上商城</Link>
              </li>
              <li>
                <Link href="/">課程專區</Link>
              </li>
              <li>
                <Link href="/">健身論壇</Link>
              </li>
            </ul>
          </div>
          <div className="ftc-3">
            <div className="ftc-title">SUBSCRIBE OUR NEWSLETTER</div>
            <div className="ftc-text3">
              <input
                id="ftemail"
                type="email"
                name="Email"
                placeholder="Email"
              />
              <input id="ftemailbtn" type="button" defaultValue="送出" />
            </div>
          </div>
        </div>
      </div>
      <div id="footercopyright">
        <span className="ft-icons__icon">Copyright @ 2024 FreeFYT</span>
        <span>
          <Link href="/">
            <FaFacebook className="ft-icons__icon" />
          </Link>
          <Link href="/">
            <FaInstagramSquare className="ft-icons__icon" />
          </Link>
          <Link href="/">
            <FaYoutube className="ft-icons__icon" />
          </Link>
          <Link href="/">
            <FaXTwitter className="ft-icons__icon" />
          </Link>
        </span>
      </div>
    </footer>
  )
}
