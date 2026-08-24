/**
 * Consultas GraphQL de la aplicación.
 *
 * Se declaran aparte de los componentes para poder reutilizarlas y para que el
 * contrato con la capa de datos quede en un solo lugar.
 */
import { gql } from '@apollo/client';

export const SEARCH_PRODUCTS = gql`
  query SearchProducts($keyword: String!, $page: Int!) {
    searchProducts(keyword: $keyword, page: $page) {
      keyword
      page
      maxPage
      items {
        id
        name
        price
        currency
        image
        description
      }
    }
  }
`;
