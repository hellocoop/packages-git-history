import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { unsealData, IronSessionOptions } from 'iron-session'
import { withIronSessionApiRoute } from 'iron-session/next'

import { consentCors } from '../lib/consent'
import * as config from '../lib/config'
import { fetchToken, parseToken } from '@hellocoop/utils'
// import type { HelloClaims, User } from '../lib/user'


const handleCallback = async (req: NextApiRequest, res: NextApiResponse) => {
    await consentCors(req, res)
    const {
        code,
        error,
        wildcard_domain
    } = req.query


    if (!req.session.oidc)
        return res.status(400).end('Session cookie lost')
    if (error)
        return res.status(400).end(error)
    if (!code)
        return res.status(400).end('Missing code parameter')
    if (Array.isArray(code))
        return res.status(400).end('Received more than one code.')

    const {code_verifier,nonce,redirect_uri,target_uri} = req.session.oidc

    if (!code_verifier) {
        res.status(400).end('Missing code_verifier from session')
        return
    }

    try {
        const token = await fetchToken({
            code: code.toString(),
            code_verifier,
            redirect_uri,
            client_id: config.clientId as string 
        })

        const { payload } = await parseToken(token)

        if (payload.aud != config.clientId) {
            return res.status(400).end('Wrong ID token audience.')
        }
        if (payload.nonce != nonce) {
            return res.status(400).end('Wrong nonce in ID token.')
        }
        
        const currentTimeInt = Math.floor(Date.now()/1000)
        if (payload.exp < currentTimeInt) {
            return res.status(400).end('The ID token has expired.')
        }
        if (payload.iat > currentTimeInt+5) { // 5 seconds of clock skew
            return res.status(400).end('The ID token is not yet valid.')
        }

        req.session.user = {
            ...payload,
            isLoggedIn: true 
        }
        // session saved below
    } catch (error: any) {
        return res.status(500).end(error.message)
    }

    if (wildcard_domain) {
        // TODO - put up interstitual page to prompt going to console
        console.log('wildcard_domain found')
        console.log(wildcard_domain)
    }

    res.redirect(target_uri 
                    || '/') // just in case
    // cleanup
    delete req.session.oidc
    await req.session.save()
}

// wrap handler
export default withIronSessionApiRoute( handleCallback, config.sessionOptions)


