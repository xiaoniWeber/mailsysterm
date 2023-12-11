import React, { useEffect, useState } from 'react'
import CalendarPanel from './calander/index'
import Header from '../header'
import { message } from 'antd'
import styles from './index.module.less'
import {
  ISchedule,
  deleteSchedule,
  getSchedule,
  getScheduleById,
  postScheduleInfo,
} from '@/api/app'
import dayjs from 'dayjs'
import FormBox from './form'

const current = {
  year: dayjs().year(),
  month: dayjs().month() + 1,
  day: '',
}
type IProps = {
  onhandleClose: () => void
  id: string | undefined
}
const ScheduleManage = (props: IProps) => {
  const { onhandleClose, id } = props
  const [step, setStep] = useState(1)
  const [meetingList, setMeetingList] = useState<ISchedule[]>([])
  const [editData, setEditData] = useState<ISchedule>()
  const [busyValue, setBusyValue] = useState<string[]>([])
  const [currentDate] = useState(current)
  const title = '日程管理'
  const handleOk = (data) => {
    if (editData?.id) {
      data.id = editData.id
    } else {
      data.id = ''
    }
    const othersData = {
      customerId: id,
      isAllDay: 0,
      startDate: dealTime(data.startDate),
      endDate: dealTime(data.endDate),
    }
    const newData = {
      ...data,
      ...othersData,
    }
    addSchedule(newData)
  }
  const addSchedule = (data) => {
    postScheduleInfo(data).then((res) => {
      console.log(res)
      message.success('新增成功')
      getScheduleList(id, currentDate, getDayTime(dayjs()))
      setStep(1)
    })
  }
  const dealTime = (date) => {
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
  }
  const handleDetail = (id) => {
    getScheduleById(id).then((res) => {
      setEditData(res)
      setStep(2)
    })
  }

  const onhandleAdd = () => {
    // 新增事项
    setStep(2)
  }
  const getDayTime = (date) => {
    return {
      year: dayjs(date).year(),
      month: dayjs(date).month() + 1,
      day: dayjs(date).date(),
    }
  }
  const getMonthTime = (date) => {
    return {
      year: dayjs(date).year(),
      month: dayjs(date).month() + 1,
      day: '',
    }
  }
  useEffect(() => {
    //获取当月所有日程
    getScheduleList(id, currentDate, getDayTime(dayjs()))
  }, [])
  const getScheduleList = (id, date, dayTime) => {
    getSchedule(id, date).then((res) => {
      getAllMeetingDay(res)
      dealTimeValue(res, dayTime)
    })
  }

  const dealTimeValue = (res, time) => {
    const arr: ISchedule[] = []
    // 遍历res 如果当天跟 res 的startDate 相同，就把这条数据放到数组里面
    res.forEach((item) => {
      if (dayjs(item.startDate).date() === time.day) {
        arr.push(item)
      }
    })
    setMeetingList(arr)
  }
  const dealBusyTime = (time) => {
    return (
      dayjs(time).year() +
      '-' +
      (dayjs(time).month() + 1) +
      '-' +
      dayjs(time).date()
    )
  }
  const getAllMeetingDay = (res) => {
    const arr: string[] = []
    res.forEach((item) => {
      arr.push(dealBusyTime(item.startDate))
    })
    setBusyValue(arr)
  }
  const changeTimeChoose = (time) => {
    getScheduleList(id, getMonthTime(time), getDayTime(time))
  }
  const getMettingTime = (time) => {
    return (
      dayjs(time).hour() +
      ':' +
      (dayjs(time).minute() < 10
        ? '0' + dayjs(time).minute()
        : dayjs(time).minute())
    )
  }
  const handleDelete = (id) => {
    deleteSchedule(id).then((res) => {
      console.log(res)
      message.success('删除成功')
      getScheduleList(id, currentDate, getDayTime(dayjs()))
      setStep(1)
    })
  }
  return (
    <div>
      {step === 1 && (
        <>
          <Header
            onhandleback={onhandleClose}
            title={title}
            onHandleAdd={onhandleAdd}
            type={'calendar'}
          />
          <CalendarPanel
            busyValue={busyValue}
            onChangeTime={changeTimeChoose}
          />
          <div className={styles.jobList}>
            <ul className={styles.list}>
              {meetingList.length > 0
                ? meetingList.map((item, index) => {
                    return (
                      <li key={index} onClick={() => handleDetail(item.id)}>
                        <div className={styles.left}>
                          {getMettingTime(item.startDate)} <br />{' '}
                          <span>{getMettingTime(item.endDate)} </span>
                        </div>
                        <div className={styles.point}></div>
                        <div>{item.title}</div>
                      </li>
                    )
                  })
                : null}
            </ul>
          </div>
        </>
      )}
      {step === 2 && (
        <>
          <Header
            onhandleback={() => setStep(1)}
            title={title}
            onhandleClose={onhandleClose}
          />
          <div className={styles.formBox}>
            <FormBox
              handleOk={handleOk}
              onHandleDelete={handleDelete}
              editData={editData}
            />
          </div>
        </>
      )}
    </div>
  )
}
export default ScheduleManage
