import { FC } from 'react'
import styles from './TabElement.module.css'

interface TabElementProps {
  description: string
  children?: JSX.Element[]
}

const TabElement: FC<TabElementProps> = ({ description, children }) => {
  return (
    <div className={styles.tabElement}>
      <header className={styles.header}>{description}</header>
      <div className={styles.children}>{children}</div>
    </div>
  )
}

export default TabElement
