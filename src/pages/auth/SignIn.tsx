import { FirebaseError } from 'firebase/app'
import { signInWithEmailAndPassword } from 'firebase/auth'
import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { auth } from '../../firebase'
import GoogleIcon from './components/GoogleIcon'
import styles from './components/styles/Sign.module.css'

function SignIn() {
  const [message, setMessage] = useState<string>('')
  const navigate = useNavigate()

  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (emailRef.current) emailRef.current.focus()
  }, [])

  useEffect(() => {
    setMessage('')
  }, [emailRef.current?.value, passwordRef.current?.value])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (
      emailRef.current?.value === undefined ||
      passwordRef.current?.value === undefined
    )
      return

    signInWithEmailAndPassword(
      auth,
      emailRef.current?.value,
      passwordRef.current?.value
    )
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user
        navigate('/isearch')
        // ...
      })
      .catch((error: FirebaseError) => {
        setMessage(error.message)
      })
  }

  return (
    <section className={styles.section}>
      <h1 className={styles.header}>Sign in to Patronus</h1>

      {!!message.length && <p className={styles.message}>{message}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          <p className={styles.labelContent}>Email</p>
          <input type="text" ref={emailRef} className={styles.input} />
        </label>

        <label className={styles.label}>
          <p className={styles.labelContent}>Password</p>
          <input
            type="password"
            ref={passwordRef}
            autoComplete="true"
            className={styles.input}
          />
        </label>

        <button className={styles.enabledButton}>Sign in</button>
      </form>

      <p className={styles.p}>
        Need an account?{' '}
        <NavLink to={'/isignup'} className={styles.link}>
          <span>Sign up</span>
        </NavLink>
      </p>

      <GoogleIcon />
    </section>
  )
}

export default SignIn
