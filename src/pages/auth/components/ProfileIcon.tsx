import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut
} from '@firebase/auth'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import Avatar from 'boring-avatars'
import { useAtom } from 'jotai'
import { useNavigate } from 'react-router-dom'
import { currentUser } from '../../../contexts/AuthContext'

const ProfileIcon = () => {
  const [userAtom] = useAtom(currentUser)
  const navigate = useNavigate()

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
    <div className=" text-primary hover:cursor-pointer hover:text-white h-8 w-8">
      {userAtom === null ? (
        <UserCircleIcon onClick={handleAuth} />
      ) : (
        <div onClick={() => signOut(auth)}>
          <Avatar
            size={30}
            name={`${userAtom.profileImage}`}
            variant="bauhaus"
            colors={['#1B325F', '#9CC4E4', '#E9F2F9', '#3A89C9', '#F26C4F']}
          />
        </div>
      )}
    </div>
  )
}

export default ProfileIcon
