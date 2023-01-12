import React, { useState, useRef, useEffect } from 'react'
import styles from './Sign.module.css'

function SignIn() {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [message, setMessage] = useState<string>('')

  const usernameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (usernameRef.current) usernameRef.current.focus()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('Incorrect username or password.')
    /* Put auth job*/
  }

  return (
    <section className={styles.section}>
      <h1 className={styles.header}>Sign in to Patronum</h1>

      {!!message.length && <p className={styles.message}>{message}</p>}

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

        <button className={styles.enabledButton}>Sign in</button>
      </form>

      {/*Put router link*/}
      <p className={styles.p}>
        Need an account? <span className={styles.link}>Sign up.</span>
      </p>
    </section>
  )
}

export default SignIn
