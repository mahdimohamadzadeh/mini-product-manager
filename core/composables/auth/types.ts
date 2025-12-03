export interface AuthUser {
    id: string
    username: string
    email?: string
}

export interface AuthCredentials {
    username: string
    password: string
}

export interface AuthResponse {
    user: AuthUser
    token: string
}

export interface LoginError {
    message: string
    code?: string
}

export interface UseAuthReturn {
    token: Ref<string | null>
    login: (username: string, password: string) => Promise<AuthResponse>
    logout: () => void
    isLoggedIn: Ref<boolean>
}