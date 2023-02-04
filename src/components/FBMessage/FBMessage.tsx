import { FC } from 'react'
import styles from './FBMessage.module.css'

interface FBMessageProps {
  content: string
}

const FBMessage: FC<FBMessageProps> = ({ content }) => {
  return <div className={styles.content}>{content}</div>
}

export default FBMessage
