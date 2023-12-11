import React, { useState } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import type { Dayjs } from 'dayjs'
import dayLocaleData from 'dayjs/plugin/localeData'
import { Calendar, Col, Row, Select, theme } from 'antd'
import type { CalendarProps } from 'antd'
import type { CellRenderInfo } from 'rc-picker/es/interface'
import cls from 'classnames'
import styles from './index.module.less'
dayjs.extend(dayLocaleData)

type IProps = {
  onChangeTime: (time) => void
  busyValue: string[]
}

const CalendarPanel = (props: IProps) => {
  const { onChangeTime, busyValue } = props
  const { token } = theme.useToken()
  const [calenderValue, setCalenderValue] = useState<Dayjs>()
  const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
    console.log(value.format('YYYY-MM-DD'), mode)
  }
  const wrapperStyle: React.CSSProperties = {
    // width: "100%",
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  }
  const handleSetToday = () => {
    //设置为当前的日期
    const value = dayjs()
    onChangeTime(value.format('YYYY-MM-DD'))
    setCalenderValue(value)
  }
  const handleChange = (day: Dayjs) => {
    onChangeTime(day.format('YYYY-MM-DD'))
    setCalenderValue(day)
  }

  const getTime = (time) => {
    const year = time.get('year')
    const month = time.get('month') + 1
    const day = time.date()
    return `${year}-${month}-${day}`
  }
  const handleFullCell = React.useCallback(
    (current: number | Dayjs, info: CellRenderInfo<Dayjs>) => {
      if (info.type !== 'date') {
        return info.originNode
      }
      if (typeof current === 'number') {
        return <div className='ant-picker-cell-inner'>{current}</div>
      }
      return (
        <div
          className={cls(
            'ant-picker-cell-inner',
            busyValue?.includes(getTime(current)) ? styles.active : '',
          )}
        >
          {current.date()}
        </div>
      )
    },
    [busyValue],
  )
  return (
    <div style={wrapperStyle} className={styles.calendarWrapper}>
      <Calendar
        value={calenderValue}
        fullscreen={false}
        headerRender={({ value, onChange }) => {
          const start = 0
          const end = 12
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const monthOptions: any = []

          const months: number[] = []
          for (let i = 0; i < 12; i++) {
            months.push(i + 1)
          }

          for (let i = start; i < end; i++) {
            monthOptions.push(
              <Select.Option key={i} value={i} className='month-item'>
                {months[i] + '月'}
              </Select.Option>,
            )
          }

          const year = value.year()
          const month = value.month()
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const options: any = []
          for (let i = year - 10; i < year + 10; i += 1) {
            options.push(
              <Select.Option key={i} value={i} className='year-item'>
                {i + '年'}
              </Select.Option>,
            )
          }
          return (
            <div style={{ padding: 8 }}>
              <Row gutter={20}>
                <Col>
                  <Select
                    size='large'
                    popupMatchSelectWidth={false}
                    className='my-year-select'
                    value={year}
                    onChange={(newYear) => {
                      const now = value.clone().year(newYear)
                      onChange(now)
                    }}
                  >
                    {options}
                  </Select>
                </Col>
                <Col>
                  <Select
                    size='small'
                    popupMatchSelectWidth={false}
                    value={month}
                    onChange={(newMonth) => {
                      const now = value.clone().month(newMonth)
                      onChange(now)
                    }}
                  >
                    {monthOptions}
                  </Select>
                </Col>
                <Col>
                  <div className={styles.today} onClick={handleSetToday}>
                    今天
                  </div>
                </Col>
              </Row>
            </div>
          )
        }}
        onPanelChange={onPanelChange}
        onChange={handleChange}
        fullCellRender={(current, info) => handleFullCell(current, info)}
      />
    </div>
  )
}

export default CalendarPanel
