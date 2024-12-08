import { gql } from '@apollo/client'

export const SEND_CODE = gql`
  mutation SendCode($email: String!) {
    sendCode(email: $email)
  }
`

export const REFRESH_TOKEN = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      accessToken
      refreshToken
    }
  }
`

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      _id
      email
      role
      accessToken
      refreshToken
    }
  }
`

export const VERIFY_CODE_AND_REGISTER = gql`
  mutation VerifyCodeAndRegister(
    $email: String!
    $code: String!
    $password: String!
  ) {
    verifyCodeAndRegister(email: $email, code: $code, password: $password) {
      _id
      email
      accessToken
      refreshToken
    }
  }
`

export const CHANGE_EMAIL = gql`
  mutation ChangeEmail($newEmail: String!) {
    changeEmail(newEmail: $newEmail) {
      success
    }
  }
`

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($oldPassword: String!, $newPassword: String!) {
    changePassword(oldPassword: $oldPassword, newPassword: $newPassword) {
      success
    }
  }
`

export const UPDATE_USER = gql`
  mutation UpdateUser($_id: ID!, $input: UpdateUserInput!) {
    updateUser(_id: $_id, input: $input) {
      _id
      role
    }
  }
`
