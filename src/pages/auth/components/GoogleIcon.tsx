import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'

const GoogleIcon = () => {
  const provider = new GoogleAuthProvider()
  const auth = getAuth()

  const handleAuth = async () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user

        window.location.href = '/isearch'
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
    <div className="flex flex-col w-full items-center">
      <span className="w-1/6 border-primary border-b-2 mb-4"></span>
      <div onClick={handleAuth} className="w-12 h-12 hover:cursor-pointer">
        <img src="images/google.svg" />
      </div>
    </div>
  )
}

export default GoogleIcon
