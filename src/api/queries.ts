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
      bloodGroup
      birthDate
      gender
      medicalCategories {
        category
        visits {
          date
          diagnosis
          description
          files
        }
      }
    }
  }
`

export const GET_USERS = gql`
  query GetUsers(
    $role: String
    $position: String
    $search: String
    $page: Int
    $limit: Int
  ) {
    getUsers(
      role: $role
      position: $position
      search: $search
      page: $page
      limit: $limit
    ) {
      _id
      firstName
      lastName
      middleName
      phone
      role
      position
    }
  }
`
