import React from 'react'
import { useAtom } from 'jotai'
import { usernameAtom, isSignedInAtom } from '../contexts/User'
import {
  UserIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  PresentationChartBarIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { NavLink } from 'react-router-dom'
import styles from './Profile.module.css'

function Profile() {
  const [username, setUsername] = useAtom(usernameAtom)
  const [isSignedIn, setIsSignedIn] = useAtom(isSignedInAtom)

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
          <button className={styles.icon}>
            <ArrowRightOnRectangleIcon />
          </button>
        </div>
      </nav>
      <section className={styles.section}>
        <UserIcon className={styles.iconUser} />
        <p className={styles.p}>{username}</p>
      </section>
    </main>
  )
}

export default Profile
