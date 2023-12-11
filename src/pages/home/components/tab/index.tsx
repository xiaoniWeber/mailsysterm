import React from 'react'
import cls from 'classnames'
import styles from './index.module.less'
type ITab = {
  title: string
  value: number
}
type IData = {
  data: ITab[]
  active: number
  handleChange: (index: number) => void
  className?: string
}

const Tab = (props: IData) => {
  const { active, data, handleChange, className } = props

  return (
    <div className={cls(styles.choose, className)}>
      {data.map((item, index) => {
        return (
          <div
            key={index}
            className={cls(
              styles.chooseItem,
              active == index ? styles.active : '',
            )}
            onClick={() => handleChange(index)}
          >
            {item.title}
          </div>
        )
      })}
    </div>
  )
}
export default Tab
