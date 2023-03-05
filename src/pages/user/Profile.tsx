import {
  ArrowRightOnRectangleIcon,
  BookOpenIcon,
  Cog6ToothIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  PresentationChartBarIcon
} from '@heroicons/react/24/outline'
import { signOut } from 'firebase/auth'
import { useAtom } from 'jotai'
import { nanoid } from 'nanoid'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import ProfileIcon from '../../components/ProfileIcon'
import { currentUser } from '../../contexts/AuthContext'
import { auth } from '../../firebase'

import { Tab } from '../../@types/user'
import TabElement from './components/TabElement/TabElement'
import TabPanel from './components/TabPanel/TabPanel'

import styles from './components/styles/Profile.module.css'

const tabs: Tab[] = [
  { idx: 0, header: 'History', icon: <BookOpenIcon /> },
  { idx: 0, header: 'Settings', icon: <Cog6ToothIcon /> }
]

function Profile() {
  const [userAtom] = useAtom(currentUser)
  const [idxActive, setIdxActive] = useState<number>(0)

  const searchQueries = userAtom?.searchHistory || []

  const searchQueryElems = searchQueries.map(
    (searchQuery: string): JSX.Element => (
      <div className={styles.searchQuery} key={nanoid()}>
        {searchQuery}
      </div>
    )
  )

  const tabElements = [
    <TabElement description="Search History" children={searchQueryElems} />,
    <TabElement description="User Settings" />
  ]

  const pickTab = (e: React.MouseEvent<HTMLElement>, idx: number) => {
    setIdxActive(idx)
  }

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
      <TabPanel tabs={tabs} idxAtive={idxActive} handleClick={pickTab} />
      <section className={styles.section}>
        <div className={styles.sectionUser}>
          <ProfileIcon size={192} className={styles.iconUser} />
          <p className={styles.p}>{userAtom?.email ?? 'Sign in to view'}</p>
        </div>
        {tabElements[idxActive]}
      </section>
    </main>
  )
}

export default Profile
