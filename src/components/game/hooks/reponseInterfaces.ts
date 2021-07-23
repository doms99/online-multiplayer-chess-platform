export interface AuthResponse {
  username: string,
  email: string,
  firstName: string,
  lastName: string,
  score: number
}

export interface ErrorResponse {
  error: string
}