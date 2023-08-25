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
export const DELETE_PROCESSOR = gql`
  mutation deleteProcessor($id: ID!) {
    deleteProcessor(id: $id) {
      id
    }
  }
`;


