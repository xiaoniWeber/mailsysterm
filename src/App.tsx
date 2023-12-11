import React from 'react'
import { useRoutes } from 'react-router-dom'
import { ROUTER_CONFIG } from './router'

const App: React.FC = () => {
  return useRoutes(ROUTER_CONFIG)
}

export default App
