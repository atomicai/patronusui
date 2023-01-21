import {
  ArrowRightOnRectangleIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  PresentationChartBarIcon
} from '@heroicons/react/24/outline'
import { signOut } from 'firebase/auth'
import { useAtom } from 'jotai'
import { NavLink } from 'react-router-dom'
import ProfileIcon from '../../components/ProfileIcon'
import { currentUser } from '../../contexts/AuthContext'
import { auth } from '../../firebase'
import styles from './components/styles/Profile.module.css'

function Profile() {
  const [userAtom] = useAtom(currentUser)
  // if (!isSignedIn) {
  //   return <Navigate replace to="/isignin" />
  // }

  return (
    <main className={styles.main}>
      <nav className={styles.nav}>
        <div className={styles.navSide}>
          <NavLink to={'/'} className={styles.icon}>
            <HomeIcon />
          </NavLink>
          <NavLink to={'/ichart'} className={styles.icon}>
            <PresentationChartBarIcon />
          </NavLink>
        </div>
        <div className={styles.navGap}></div>
        <div className={styles.navSide}>
          <NavLink to={'/isearch'} className={styles.icon}>
            <MagnifyingGlassIcon />
          </NavLink>
          <button onClick={() => signOut(auth)} className={styles.icon}>
            <ArrowRightOnRectangleIcon />
          </button>
        </div>
      </nav>
      <section className={styles.section}>
        <div className="w-1/6 h-1/6 flex flex-col items-center justify-evenly">
          <ProfileIcon size={50} className="h-12 w-12" />
          <p className={styles.p}>{userAtom?.email ?? 'signin to view'}</p>
        </div>
      </section>
    </main>
  )
}

export default Profile
