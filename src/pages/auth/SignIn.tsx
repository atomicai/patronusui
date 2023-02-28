import { FirebaseError } from 'firebase/app'
import { signInWithEmailAndPassword } from 'firebase/auth'
import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import FBMessage from '../../components/FBMessage/FBMessage'
import Ownership from '../../components/Ownership/Ownership'
import { auth } from '../../firebase'
import GoogleIcon from './components/GoogleIcon'
import styles from './components/styles/Sign.module.css'

function SignIn() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const [errorCode, setErrorCode] = useState<string>('')
  const navigate = useNavigate()

  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (emailRef.current) emailRef.current.focus()
  }, [])

  useEffect(() => {
    setErrorCode('')
  }, [email, password])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (email === undefined || password === undefined) return

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        navigate('/isearch')
      })
      .catch((error: FirebaseError) => {
        setErrorCode(error.code)
      })
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h1>Sign in to Patronus</h1>
        <Ownership />
      </div>

      {!!errorCode.length && <FBMessage errorCode={errorCode} />}

      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          <p className={styles.labelContent}>Email</p>
          <input
            type="text"
            ref={emailRef}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          <p className={styles.labelContent}>Password</p>
          <input
            type="password"
            ref={passwordRef}
            autoComplete="true"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
