import { nanoid } from 'nanoid'
import { FC } from 'react'
import { Tab } from '../../../../@types/user'
import styles from './TabPanel.module.css'

interface TabPanelProps {
  tabs: Tab[]
  idxAtive: number
  handleClick: (e: React.MouseEvent<HTMLElement>, idx: number) => void
}

const TabPanel: FC<TabPanelProps> = ({ tabs, idxAtive, handleClick }) => {
  const tabPanelElems = tabs.map((tab, idx) => {
    const isActive = idx === idxAtive
    return (
      <div
        key={nanoid()}
        onClick={(e) => handleClick(e, idx)}
        className={`${styles.tabPanelElem} ${isActive && styles.active}`}
      >
        <div className={styles.icon}>{tab.icon}</div>
        <header className={styles.header}>{tab.header}</header>
      </div>
    )
  })

  return <div className={styles.tabPanel}>{tabPanelElems}</div>
}

export default TabPanel
