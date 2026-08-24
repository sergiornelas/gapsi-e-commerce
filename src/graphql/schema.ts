/**
 * Schema de GraphQL ejecutable en el navegador.
 *
 * El examen es un desarrollo exclusivamente de front-end, así que no hay un
 * servidor GraphQL al que apuntar. En lugar de renunciar al requisito, el schema
 * se ejecuta del lado del cliente: Apollo resuelve las consultas contra estos
 * resolvers mediante `SchemaLink`, y los resolvers consultan el servicio REST a
 * través del repositorio.
 *
 * La ventaja no es cosmética: la aplicación consume una única consulta tipada y
 * declarativa, y la caché normalizada de Apollo se encarga de la paginación.
 * El día que exista un backend real, basta cambiar `SchemaLink` por `HttpLink`
 * sin tocar los componentes.
 */
import { makeExecutableSchema } from '@graphql-tools/schema';

import { resolvers } from '@/graphql/resolvers';

const typeDefs = /* GraphQL */ `
  "Producto listo para mostrarse en la interfaz."
  type Product {
    id: ID!
    name: String!
    "Precio en la moneda indicada. Nulo cuando el servicio no lo informa."
    price: Float
    currency: String!
    image: String!
    description: String!
  }

  "Una página de resultados para un criterio de búsqueda."
  type ProductPage {
    keyword: String!
    page: Int!
    "Última página disponible para este criterio."
    maxPage: Int!
    items: [Product!]!
  }

  type Query {
    "Busca productos por palabra clave. La paginación es 1-based."
    searchProducts(keyword: String!, page: Int! = 1): ProductPage!
  }
`;

export const schema = makeExecutableSchema({ typeDefs, resolvers });
