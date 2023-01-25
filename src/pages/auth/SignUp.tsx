import { FirebaseError } from 'firebase/app'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import React, { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { auth } from '../../firebase'
import GoogleIcon from './components/GoogleIcon'
import Message from './components/Message'
import styles from './components/styles/Sign.module.css'

const USERNAME_REGEX = /[A-z0-9]{4,20}$/
const PASSWORD_REGEX = /[A-z0-9]{4,20}$/

function SignUp() {
  const [messageContent, setMessageContent] = useState<string>('')

  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (emailRef.current) emailRef.current.focus()
  }, [])

  // useEffect(() => {
  //   setIsValidUsername(USERNAME_REGEX.test(username))
  // }, [username])

  // useEffect(() => {
  //   setIsValidPassword(PASSWORD_REGEX.test(password))
  // }, [password])

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

    if (!PASSWORD_REGEX.test(passwordRef.current?.value)) {
      setMessageContent(
        'Incorrect password. 4 to 20 characters. Letters and numbers allowed.'
      )
      return
    }

    /* Put auth job*/
    createUserWithEmailAndPassword(
      auth,
      emailRef.current.value,
      passwordRef.current.value
    )
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user
        window.location.href = '/isearch'
        // ...
      })
      .catch((error: FirebaseError) => {
        setMessageContent(error.message)
        // ..
      })
  }

  // if (isSignedUp) {
  //   return <Navigate replace to="/isignin" />
  // }

  return (
    <section className={styles.section}>
      <h1 className={styles.header}>Sign up for Patronum</h1>
      
      {!!messageContent.length && <Message content={messageContent} />}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          <p className={styles.labelContent}>Username</p>
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

        <button className={styles.enabledButton}>Sign up</button>
      </form>

      <p className={styles.p}>
        Already have an account?{' '}
        <NavLink to={'/isignin'} className={styles.link}>
          <span>Sign in</span>
        </NavLink>
      </p>
      <GoogleIcon />
    </section>
  )
}

export default SignUp
