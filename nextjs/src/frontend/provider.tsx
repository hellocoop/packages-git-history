import React, { createContext, useContext } from 'react'
import { useUser } from './auth'
import { NotLoggedIn } from '../lib/auth'

const HelloContext = createContext(NotLoggedIn);

const HelloProvider = ({ children, auth: passedAuth  } : any) => { //TBD any
  const auth = passedAuth || useUser()?.auth
  return (
      <HelloContext.Provider value={auth}>
          {children}
      </HelloContext.Provider>
    )
}

const useHelloProviderContext = () => {
    return useContext(HelloContext)
};

export { HelloProvider, useHelloProviderContext }