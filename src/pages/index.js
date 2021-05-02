// import * as React from "react"
import React, {useState} from "react"
import { Link, graphql } from "gatsby"

// import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes

  const [search, setSearch] = useState({
    query: ``,
    filteredPosts: posts
  })

  const getSearch = (event) => {
    const queryStr = event.target.value
    const postsAr = posts.filter(post => 
      post.frontmatter.title.toUpperCase().includes(queryStr.toUpperCase()) || 
      post.frontmatter.originalBlog.toUpperCase().includes(queryStr.toUpperCase())
    )

    setSearch({
      query: queryStr,
      filteredPosts: postsAr
    })
  }

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Seo title="All posts" />
        <p>
          No blog posts found. Add markdown posts to "content/blog" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Home" />

      <input type="search" className="search-posts" placeholder="Search by Title and Blog..." onChange={getSearch} value={search.query} />

      <ol style={{ listStyle: `none` }}>
        {search.filteredPosts.map(post => {
          const title = post.frontmatter.title || post.fields.slug

          return (
            <Link to={post.fields.slug} itemProp="url" style={{ textDecoration: `none` }}>
            <li key={post.fields.slug}>
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <div className="banner-img" style={{
                    backgroundImage: "url(" + post.frontmatter.bannerImg + ")",
                  }}></div>
                  <h4>
                      <span itemProp="headline">{title}</span>
                  </h4>
                  <div className="cont-info">
                    <small>{post.frontmatter.originalBlog}</small> -                     
                    <small>{post.frontmatter.date}</small>
                  </div>
                </header>
                <section>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: post.frontmatter.description || post.excerpt,
                    }}
                    itemProp="description"
                  />
                </section>
              </article>
            </li>
            </Link>
          )
        })}
      </ol>
    </Layout>
  )
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
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          editor
          originalBlog
          bannerImg
          description
        }
      }
    }
  }
`
