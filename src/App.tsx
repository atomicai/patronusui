import { QueryClientProvider, QueryClient } from 'react-query'
import router from './routes/router'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'jotai'

const App: React.FC = () => {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <Provider>
        <RouterProvider router={router} />
      </Provider>
    </QueryClientProvider>
  )
}

export default App
