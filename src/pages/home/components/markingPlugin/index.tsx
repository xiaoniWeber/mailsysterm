import React, { useState } from 'react'
import userP from '@/assets/images/userp.png'
import schedule from '@/assets/images/schedule.png'
import inventory from '@/assets/images/inventory.png'
import UserProtrait from '../userPortrait'
import InventoryManage from '../inventoryManage'
import ScheduleManage from '../scheduleManage'
import styles from './index.module.less'
import cls from 'classnames'

type IProps = {
  id: string | undefined
  portrait: string | undefined
  height: number
}
const MarktingPlugin = (props: IProps) => {
  const { id, portrait, height } = props
  const [showBase, setShowBase] = useState(true)
  const [showUser, setShowUser] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)
  const [showInventory, setShowInventory] = useState(false)
  const handleCLoseUser = () => {
    setShowUser(false)
    setShowBase(true)
  }
  const handleCLoseInven = () => {
    setShowInventory(false)
    setShowBase(true)
  }
  const handleCloseSchedule = () => {
    setShowSchedule(false)
    setShowBase(true)
  }
  return (
    <div>
      {showBase && (
        <div className={styles.firstWrapper}>
          <div className={styles.top}>
            <div
              className={styles.item}
              onClick={() => {
                setShowBase(false)
                setShowUser(true)
              }}
            >
              <img src={userP} alt='' />
              <div className={styles.text}>用户画像</div>
            </div>
            <div
              className={styles.item}
              onClick={() => {
                setShowBase(false)
                setShowInventory(true)
              }}
            >
              <img src={inventory} alt='' />
              <div className={styles.text}>库存管理</div>
            </div>
          </div>
          <div className={styles.top}>
            <div
              className={styles.item}
              onClick={() => {
                setShowBase(false)
                setShowSchedule(true)
              }}
            >
              <img src={schedule} alt='' />
              <div className={styles.text}>日程管理</div>
            </div>
            <div className={cls(styles.item, styles.last)}></div>
          </div>
        </div>
      )}
      {showUser && (
        <UserProtrait
          portrait={portrait}
          id={id}
          onhandleClose={handleCLoseUser}
        />
      )}
      {showInventory && (
        <InventoryManage height={height} onhandleClose={handleCLoseInven} />
      )}
      {showSchedule && (
        <ScheduleManage id={id} onhandleClose={handleCloseSchedule} />
      )}
    </div>
  )
}
export default MarktingPlugin
