import * as React from 'react'
import { graphql, PageProps } from 'gatsby'
import { Link, Trans } from 'gatsby-plugin-react-i18next'
import { MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowLeft } from 'react-icons/md'
import Layout from '../components/layout'
import Card from '../components/card'
import { PokemonPageProps, Pokemon, PokemonLocale, PageContext } from '../types/types'
import { usePokemonDataLanguage } from '../hooks/usePokemonData'
import { usePagination } from '../hooks/usePagination'
import * as style from '../pages/style/all-pokemon.module.scss'

const PokemonList: React.FC<PageProps<PokemonPageProps, PageContext>> = (props) => {
  const pokemons = props.data
  const userLanguage: string = pokemons.locales.edges[0].node.language
  const pokemonList: PokemonLocale[] = pokemons.allPokemon.nodes
  const pokemonData = usePokemonDataLanguage(userLanguage, pokemonList)
  const pageContext: PageContext = props.pageContext
  const { isFirst, isLast, prevPage, nextPage } = usePagination(pageContext)

  return (
    <Layout full>
      <>
        <div>
          <h1 className={style.title}>
            <Trans>Pokédex</Trans>
          </h1>
          <ul className={style.cardsGrid}>
            {pokemonData.map((el: Pokemon, index: number) => {
              return (
                <li key={index}>
                  <Card pokemon={el} />
                </li>
              )
            })}
          </ul>
        </div>
        <footer className={`${isLast ? style.lastPage : ''} ${style.pagination} ${isFirst ? style.firstPage : ''}`}>
          {!isFirst && (
            <Link to={`/page/${prevPage}`} rel='prev' className={style.paginationLink}>
              <MdOutlineKeyboardArrowLeft />
              <Trans>Previous Page</Trans>
            </Link>
          )}
          {!isLast && (
            <Link to={`/page/${nextPage}`} rel='next' className={style.paginationLink}>
              <Trans>Next Page</Trans>
              <MdOutlineKeyboardArrowRight />
            </Link>
          )}
        </footer>
      </>
    </Layout>
  )
}

export const query = graphql`
  query ($language: String!, $skip: Int!, $limit: Int!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
    allPokemon(limit: $limit, skip: $skip) {
      nodes {
        id
        imageUrl
        featuredImg {
          childImageSharp {
            gatsbyImageData(width: 200, placeholder: BLURRED)
          }
        }
        locale {
          language
          genus
          name
          details {
            x
            y
          }
        }
      }
    }
  }
`

export const Head = (): JSX.Element => (
  <title>
    <Trans>Pokédex</Trans>
  </title>
)

export default PokemonList
