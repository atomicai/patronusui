import { Toaster } from 'react-hot-toast'
import { Outlet } from 'react-router-dom'

export const Main: React.FC = () => {
  return (
    <main className="w-screen h-screen">
      <Toaster position="top-center" reverseOrder={true} />
      <Outlet />
    </main>
  )
}
