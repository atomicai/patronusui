import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { currentUser } from './contexts/AuthContext'
import { auth, db } from './firebase'
import router from './routes/router'

const App: React.FC = () => {
  const setUserAtom = useSetAtom(currentUser)

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid)
        const docSnap = await getDoc(userRef)

        if (docSnap.exists()) {
          setUserAtom({ ...user, bookLover: docSnap.data().bookLover })
        } else {
          await setDoc(doc(db, 'users', user.uid), {
            bookLover: true,
            potterLover: true
          })
          setUserAtom({ ...user, bookLover: true })
        }
      } else {
        setUserAtom(null)
      }
    })
  }, [])

  return <RouterProvider router={router} />
}

export default App
