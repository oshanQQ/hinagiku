import React from "react"
import { Link, graphql } from "gatsby"
import { Twemoji } from "react-emoji-render"

import Layout from "../components/layout"
import SEO from "../components/seo"

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="All posts" />
        {posts.map(({ node }) => {
          const title = node.frontmatter.title || node.fields.slug
          return (
            <article key={node.fields.slug}>
              <div className="p-1 md:p-4">
                <div className="flex items-center border-2 border-gray-200 bg-gray-200 rounded-lg pt-2 pb-4 px-4">
                  <div className="p-4 justify-center text-4xl md:text-6xl rounded-xl bg-gray-100">
                    <Twemoji svg text={node.frontmatter.emoji || "💻"} />
                  </div>
                  <header className="pl-4">
                    <h3 className="text-2xl md:text-4xl font-semibold mt-6 mb-6">
                      <Link
                        className="text-gray-800 shadow-none"
                        to={node.fields.slug}
                      >
                        {title}
                      </Link>
                    </h3>
                    <small>{node.frontmatter.date}</small>
                  </header>
                  {/* <section>
                    <p
                      className="mb-8"
                      dangerouslySetInnerHTML={{
                        __html: node.frontmatter.description || node.excerpt,
                      }}
                    />
                  </section> */}
                </div>
              </div>
            </article>
          )
        })}
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date
            title
            description
            emoji
          }
        }
      }
    }
  }
`
