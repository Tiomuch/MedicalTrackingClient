import { gql } from '@apollo/client'

export const GET_USER = gql`
  query GetUser($id: ID!) {
    getUser(_id: $id) {
      _id
      email
      firstName
      lastName
      middleName
      phone
      role
    }
  }
`
