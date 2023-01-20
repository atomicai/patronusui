import React, { useState, useRef, useEffect } from 'react'
import styles from './Sign.module.css'
import { NavLink, Navigate } from 'react-router-dom'

const USERNAME_REGEX = /[A-z0-9]{4,20}$/
const PASSWORD_REGEX = /[A-z0-9]{4,20}$/

function SignUp() {
  const [username, setUsername] = useState<string>('')
  const [isValidUsername, setIsValidUsername] = useState<boolean>(false)

  const [password, setPassword] = useState<string>('')
  const [isValidPassword, setIsValidPassword] = useState<boolean>(false)

  const [isSignedUp, setIsSignedUp] = useState<boolean>()

  const [message, setMessage] = useState<string>('')

  const usernameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (usernameRef.current) usernameRef.current.focus()
  }, [])

  useEffect(() => {
    setIsValidUsername(USERNAME_REGEX.test(username))
  }, [username])

  useEffect(() => {
    setIsValidPassword(PASSWORD_REGEX.test(password))
  }, [password])

  useEffect(() => {
    setMessage('')
  }, [username, password])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidUsername) {
      setMessage(
        'Incorrect username. 4 to 20 characters. Letters and numbers allowed.'
      )
      return
    } else if (!isValidPassword) {
      setMessage(
        'Incorrect password. 4 to 20 characters. Letters and numbers allowed.'
      )
      return
    }
    setIsSignedUp(true)
    /* Put auth job*/
  }

  if (isSignedUp) {
    return <Navigate replace to="/isignin" />
  }

  return (
    <section className={styles.section}>
      <h1 className={styles.header}>Sign up for Patronum</h1>
      {!!message.length && <div className={styles.message}>{message}</div>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          <p className={styles.labelContent}>Username</p>
          <input
            type="text"
            ref={usernameRef}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          <p className={styles.labelContent}>Password</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="true"
            className={styles.input}
          />
        </label>

        <button className={styles.enabledButton}>Sign up</button>
      </form>

      <p className={styles.p}>
        Already have an account?{' '}
        <NavLink to={'/isignin'} className={styles.link}>
          <span>Sign in</span>
        </NavLink>
      </p>
    </section>
  )
}

export default SignUp
