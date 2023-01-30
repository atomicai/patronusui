import { FirebaseError } from 'firebase/app'
import { signInWithEmailAndPassword } from 'firebase/auth'
import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Ownership from '../../components/Ownership/Ownership'
import { auth } from '../../firebase'
import GoogleIcon from './components/GoogleIcon'
import Message from './components/Message'
import styles from './components/styles/Sign.module.css'

function SignIn() {
  const [messageContent, setMessageContent] = useState<string>('')
  const navigate = useNavigate()

  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (emailRef.current) emailRef.current.focus()
  }, [])

  useEffect(() => {
    setMessageContent('')
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
        setMessageContent(error.message)
      })
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h1>Sign in to Patronus</h1>
        <Ownership />
      </div>

      {!!messageContent.length && <Message content={messageContent} />}

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
