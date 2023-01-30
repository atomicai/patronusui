import styles from './Ownership.module.css'

function Ownership() {
  return (
    <div className={styles.div}>
      <p>Powered by</p>
      <a href="https://justatom.org/">
        <img className={styles.img} alt="Just Atom" src="images/justatom.svg" />
      </a>
    </div>
  )
}

export default Ownership
