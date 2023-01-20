import { UserCircleIcon } from '@heroicons/react/24/outline'
import { signOut } from 'firebase/auth'
import { useAtom } from 'jotai'
import { useNavigate } from 'react-router-dom'
import { currentUser } from '../../../contexts/AuthContext'
import { auth } from '../../../firebase'

const ProfileIcon = () => {
  const [userAtom] = useAtom(currentUser)
  const navigate = useNavigate()
  return (
    <div className=" text-primary hover:cursor-pointer hover:text-white h-8 w-8">
      {userAtom === null ? (
        <UserCircleIcon onClick={() => navigate('/isignin')} />
      ) : (
        <UserCircleIcon onClick={() => signOut(auth)} />
      )}
    </div>
  )
}

export default ProfileIcon
