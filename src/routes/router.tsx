import { createBrowserRouter } from 'react-router-dom'
import { Main } from '../layouts/Main'
import { Home } from '../pages/Home'
import SignIn from '../pages/auth/SignIn'
import SignUp from '../pages/auth/SignUp'
import { Search } from '../pages/dashboard/Search'
import { View } from '../pages/dashboard/View'
import Profile from '../pages/user/Profile'
import { Error } from '../pages/util/Error'

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
      },
      {
        path: 'isignin',
        element: <SignIn />
      },
      {
        path: 'isignup',
        element: <SignUp />
      }
    ]
  }
])

export default router
