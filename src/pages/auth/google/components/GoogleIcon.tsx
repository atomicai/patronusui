import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { addDoc, collection, doc, setDoc } from 'firebase/firestore'
import { db } from '../../../../firebase'

const GoogleIcon = () => {
  const provider = new GoogleAuthProvider()
  const auth = getAuth()

  const handleAuth = async () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user

        return user
        // ...
      })

      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code
        const errorMessage = error.message
        // The email of the user's account used.
        const email = error.customData.email
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error)
        // ...
      })
  }

  return (
    <div onClick={handleAuth}>
      <img src="images/google.svg" />
    </div>
  )
}

export default GoogleIcon
