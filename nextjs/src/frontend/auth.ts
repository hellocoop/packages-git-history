import useSWR from 'swr'
import config from '../lib/config'
const { authApiRoute } = config
import { Auth } from '../lib/auth'

const fetcher = async (url: string): Promise<Auth> => {
    const response = await fetch(url)
    const auth = response.json()
    return auth
}

export type UseUser = {
    auth: Auth | undefined
    isLoggedIn: boolean | undefined
    isLoading: boolean
}

export const useUser = (): UseUser => {
    const { data: auth, isLoading } = useSWR(authApiRoute, fetcher)
    return {
        auth,
        isLoggedIn: auth?.isLoggedIn,
        isLoading
    }
}

