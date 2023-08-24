import { gql } from '@apollo/client';

export const GET_PROCESSORS = gql`
   query {
    processors {
      id
      processor
      merchantid
      ucc
      adress
      clients {
        name
      }
    }
  }
`;
