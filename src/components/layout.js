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
        <h3 className="text-2xl font-semibold mt-0 font-body">
          <Link className="shadow-none" to={`/`}>
            {title}
          </Link>
        </h3>
      )
    }
    return (
      <div className="max-w-4xl mx-auto px-2 py-8 font-body">
        <header>{header}</header>
        <main>{children}</main>
        <footer className="text-center">
          © {new Date().getFullYear()}, Built with
          {` `}
          <a className="text-gray-800" href="https://www.gatsbyjs.org">
            Gatsby
          </a>
        </footer>
      </div>
    )
  }
}

export default Layout
