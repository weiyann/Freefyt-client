import Footer from './footer'
import Header from './header'

export default function DefaultLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}
