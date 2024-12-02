import { gql } from '@apollo/client'

export const SEND_CODE = gql`
  mutation SendCode($email: String!) {
    sendCode(email: $email) {
      success
    }
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
      accessToken
      refreshToken
    }
  }
`

export const VERIFY_CODE = gql`
  mutation VerifyCode($email: String!, $code: String!) {
    verifyCode(email: $email, code: $code) {
      success
    }
  }
`

export const REGISTER = gql`
  mutation Register($email: String!, $password: String!, $name: String!) {
    register(email: $email, password: $password, name: $name) {
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
