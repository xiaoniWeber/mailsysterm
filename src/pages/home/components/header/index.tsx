import React from 'react'
import backTitle from '@/assets/images/backTitle.png'
import homeIcon from '@/assets/images/home.png'
import calendar from '@/assets/images/calendar.png'
import styles from './index.module.less'

type IProps = {
  onhandleClose?: () => void
  onhandleback?: () => void
  title: string
  type?: string
  onHandleAdd?: () => void
}
const Header = (props: IProps) => {
  const { onhandleClose, onhandleback, title, type, onHandleAdd } = props
  return (
    <div className={styles.headerWrapper}>
      <div className={styles.header}>
        <img
          className={styles.back}
          onClick={onhandleback}
          src={backTitle}
          alt=''
        />
        <div>{title}</div>
        <img
          onClick={type === 'calendar' ? onHandleAdd : onhandleClose}
          className={styles.homeIcon}
          src={type === 'calendar' ? calendar : homeIcon}
          alt=''
        />
      </div>
    </div>
  )
}
export default Header
