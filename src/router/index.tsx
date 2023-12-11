import React from 'react'
import { RouteObject } from 'react-router-dom'
import LazyWrapper from '@/components/lazyWrapper'

const ROUTER_CONFIG: RouteObject[] = [
  {
    path: '/',
    element: <LazyWrapper path='/home' />,
  },
  {
    path: '/home',
    element: <LazyWrapper path='/home' />,
  },

  {
    path: '/login',
    element: <LazyWrapper path='/login' />,
  },
]

export { ROUTER_CONFIG }
