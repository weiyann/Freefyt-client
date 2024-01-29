import React from 'react'
import styles from '@/styles/store/product/pagination.module.css'
import { useRouter } from 'next/router'
useRouter

export default function Pagination({ products }) {
  const router = useRouter()
  return (
    <div>
      <ul className={styles['pagination']}>
        <li className={styles['pagination-item']}>
          {products.page === 1 ? (
            <div className={styles['page-disable']} href={'/store/product'}>
              &lt;
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault()
                router.push(
                  {
                    pathname: '/store/product',
                    query: { ...router.query, page: products.page - 1 },
                  },
                  undefined,
                  { scroll: false }
                )
              }}
              className={styles['pagination-prev']}
            >
              &lt;
            </button>
          )}
        </li>
        {products.success && products.totalPages
          ? Array(7)
              .fill(1)
              .map((v, i) => {
                const p = products.page - 3 + i
                if (p < 1 || p > products.totalPages) return null
                return (
                  <li key={p}>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        router.push(
                          {
                            pathname: '/store/product',
                            query: {
                              ...router.query,
                              page: p,
                            },
                          },
                          undefined,
                          { scroll: false }
                        )
                      }}
                      className={
                        p === products.page
                          ? styles['pagination-link-active']
                          : styles['pagination-link']
                      }
                    >
                      {p}
                    </button>
                  </li>
                )
              })
          : null}
        <li className={styles['pagination-item']}>
          {products.page === products.totalPages ? (
            <div
              className={styles['page-disable']}
              href={'/store/product' + `?page=${products.totalPages}`}
            >
              &gt;
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault()
                router.push(
                  {
                    pathname: '/store/product',
                    query: { ...router.query, page: products.page + 1 },
                  },
                  undefined,
                  { scroll: false }
                )
              }}
              className={styles['pagination-next']}
            >
              &gt;
            </button>
          )}
        </li>
      </ul>
    </div>
  )
}
