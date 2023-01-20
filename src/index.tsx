import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import 'rsuite/dist/rsuite.min.css'
import App from './App'

import { QueryClientProvider, QueryClient } from 'react-query'
import { Provider } from 'jotai'

const queryClient = new QueryClient()

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <QueryClientProvider client={queryClient}>
    <Provider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Provider>{' '}
  </QueryClientProvider>
)
