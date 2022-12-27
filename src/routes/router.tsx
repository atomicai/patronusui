import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Home } from '../pages/Home'
import { Main } from '../layouts/Main'
import { Search } from '../pages/Search'
import { Error } from '../pages/util/Error'
import { View } from '../pages/View'
import Profile from '../pages/Profile'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    errorElement: <Error />,

    children: [
      {
        element: <Home />,
        index: true
      },
      {
        path: 'isearch',

        element: <Search />
      },
      {
        path: 'ichart',
        element: <View />
      },
      {
        path: 'iprofile',
        element: <Profile />
      }
    ]
  }
])

export default router
