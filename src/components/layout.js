import React from "react"
import { Link } from "gatsby"

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`
    let header

    if (location.pathname === rootPath) {
      header = (
        <h1 className="sticky text-2xl font-semibold mb-10 mt-0 font-body">
          <Link className="shadow-none" to={`/`}>
            {title}
          </Link>
        </h1>
      )
    } else {
      header = (
        <h3 className="sticky text-2xl font-semibold mt-0 font-body">
          <Link className="shadow-none" to={`/`}>
            {title}
          </Link>
        </h3>
      )
    }
    return (
      <div className="max-w-4xl mx-auto px-8 py-8 font-body">
        <header>{header}</header>
        <main>{children}</main>
        <footer className="text-center py-6">
          ©{new Date().getFullYear()},{` `}
          <a className="text-gray-800" href="https://twitter.com/oshanQQ">
            oshanQQ
          </a>
        </footer>
      </div>
    )
  }
}

export default Layout
