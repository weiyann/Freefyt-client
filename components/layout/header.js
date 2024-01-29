import React, { use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaSearch } from 'react-icons/fa'
import { FaBell } from 'react-icons/fa'
import { FaShoppingCart } from 'react-icons/fa'
import { useCart } from '@/hooks/use-cart'
import UserMenu from '@/components/layout/user-menu'
import { HiMenu } from 'react-icons/hi'
import { useState } from 'react'

export default function Header() {
  const { addItem, totalItems } = useCart()
  const [mobileNavVisible, setMobileNavVisible] = useState(false);
  const toggleMobileNav = () => {
    setMobileNavVisible(!mobileNavVisible);
  };


  return (
    <>
      <header>
        <div className="container flex space-between">
          <div className="logo">
            <Link href="/">
              <img src="/image/logo2.png" alt="" />
            </Link>
          </div>
          {/* link裡面不能放li */}
          <ul className="navbar">
            <li>
              <Link href="/fytrack" className="navbar__link">
                健身追蹤
              </Link>
            </li>
            <li>
              <Link href="/course" className="navbar__link">
                課程專區
              </Link>
            </li>
            <li>
              <Link href="/store/product" className="navbar__link">
                線上商城
              </Link>
            </li>
            <li>
              <Link href="/blog" className="navbar__link">
                健身論壇
              </Link>
            </li>
          </ul>
          {/* TODO: icon路徑和login路徑還沒放 */}
          <div className="navbar-icons">
            <Link href="/">
              <FaSearch size={30} className="navbar-icons__icon" />
            </Link>
            <Link href="/">
              <FaBell size={30} className="navbar-icons__icon" />
            </Link>
            <div className="cart-icon">
              <Link href="/store/cart">
                <FaShoppingCart size={30} className="navbar-icons__icon" />
              </Link>
              <div className="cart-badge">{totalItems}</div>
            </div>
            <UserMenu />
          </div>
          <div className="menu-icon">
            <HiMenu size={60} onClick={toggleMobileNav}/>
          </div>
        </div>
        <ul className={`mobile-nav ${mobileNavVisible ? 'visible' : ''}`}>
          <li className=">mobile-nav-link">
            <Link href={'/'}>會員中心</Link>
          </li>
          <li className=">mobile-nav-link">
            <Link href={'/'}>健身追蹤</Link>
          </li>{' '}
          <li className=">mobile-nav-link">
            <Link href={'/course'}>課程專區</Link>
          </li>{' '}
          <li className=">mobile-nav-link">
            <Link href={'/'}>線上商城</Link>
          </li>{' '}
          <li className=">mobile-nav-link">
            <Link href={'/'}>健身論壇</Link>
          </li>
        </ul>
      </header>
    </>
  )
}
