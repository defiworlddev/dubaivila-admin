import { createContext, ReactNode } from 'react'

const ContractContext = createContext<{ message: string } | undefined>(undefined)

export const ContractProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ContractContext.Provider value={{ message: 'Hello World' }}>
      {children}
    </ContractContext.Provider>
  )
}

