import { FC } from 'react'
import styles from './styles/Message.module.css'

interface MessageProps {
  content: string
}

const Message: FC<MessageProps> = ({ content }) => {
  return <div className={styles.message}>{content}</div>
}

export default Message
