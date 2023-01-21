import { UserCircleIcon } from '@heroicons/react/24/outline'
import Avatar from 'boring-avatars'
import { useAtom } from 'jotai'
import { useNavigate } from 'react-router-dom'
import { currentUser } from '../contexts/AuthContext'

interface ProfileIconProps {
  size?: number
  className?: string
}

const ProfileIcon: React.FC<ProfileIconProps> = ({
  size = 30,
  className = 'h-8 w-8'
}) => {
  const [userAtom] = useAtom(currentUser)
  const navigate = useNavigate()

  return (
    <div className={`text-primary hover:cursor-pointer hover:text-white `}>
      {userAtom === null ? (
        <UserCircleIcon
          className={className}
          onClick={() => navigate('/isignin')}
        />
      ) : (
        <div onClick={() => navigate('/iprofile')}>
          <Avatar
            size={size}
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
