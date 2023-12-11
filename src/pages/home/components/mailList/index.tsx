import React from 'react'
import styles from './index.module.less'
import { IMailData } from '../../../home'
import cls from 'classnames'
import { getTime } from '@/utils'
import one from '@/assets/images/1.png'
import two from '@/assets/images/2.png'
import three from '@/assets/images/3.png'
import four from '@/assets/images/4.png'
import five from '@/assets/images/5.png'
import six from '@/assets/images/6.png'
import seven from '@/assets/images/7.png'
import eight from '@/assets/images/8.png'

type IProps = {
  data: IMailData[]
  onHandleClick: (item: IMailData) => void
  currentPerson: IMailData
}
const imgList = [one, two, three, four, five, six, seven, eight]
// 随机分配头像 imgList
// const randomImg = () => {
//   const index = Math.floor(Math.random() * imgList.length)
//   return imgList[index]
// }
const MailList = (props: IProps) => {
  const { data, onHandleClick, currentPerson } = props
  return (
    <div className={styles.mailList}>
      <ul>
        {data?.map((item, index) => {
          return (
            <li
              key={index}
              className={cls(
                currentPerson?.id === item.id ? styles.active : '',
              )}
              onClick={() => onHandleClick(item)}
            >
              <div className={styles.nameBox}>
                <div className={styles.ava}>
                  <img
                    src={
                      imgList[index] === undefined ? imgList[0] : imgList[index]
                    }
                  />
                </div>
                <div className={styles.rightContent}>
                  <div className={styles.top}>
                    <div className={styles.name}>
                      {item.status === 0 && <span></span>}
                      {item.name}
                    </div>
                    <div className={styles.timeBox}>
                      <div
                        className={cls(
                          styles.status,
                          item.status === 1 ? styles.active : '',
                        )}
                      >
                        {item.status === 0 ? '未回复' : '已回复'}
                      </div>
                      <div className={styles.time}>{getTime(item.time)}</div>
                    </div>
                  </div>

                  <div className={styles.content}>
                    {item.content.length > 16
                      ? item.content.substring(0, 16) + '...'
                      : item.content}
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
export default MailList
