import { Button, DatePicker, Form, Input } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React, { useEffect } from 'react'
import dayjs from 'dayjs'
import { ISchedule } from '@/api/app'
import styles from './index.module.less'

type FieldType = {
  attendees: string
  description: string
  location: string
  title: string
  startDate: string
  endDate: string
}
type IProps = {
  handleOk: (data) => void
  editData: ISchedule | undefined
  onHandleDelete: (id) => void
}
const FormBox = (props: IProps) => {
  const [form] = Form.useForm()
  const { handleOk, editData, onHandleDelete } = props
  useEffect(() => {
    if (editData) {
      const { attendees, description, location, title, startDate, endDate } =
        editData
      form.setFieldsValue({
        attendees,
        description,
        location,
        title,
      })
      form.setFieldsValue({
        startDate: dayjs(startDate),
        endDate: dayjs(endDate),
      })
    }
    return () => {
      form.resetFields()
    }
  }, [editData])
  const handleDelete = (id) => {
    onHandleDelete(id)
  }

  return (
    <Form form={form} labelCol={{ span: 5 }} onFinish={handleOk}>
      <Form.Item<FieldType> label='参与人：' name='attendees'>
        <Input placeholder='请输入' />
      </Form.Item>
      <Form.Item<FieldType> label='主题：' name='title'>
        <Input placeholder='请输入' />
      </Form.Item>
      <Form.Item<FieldType> label='开始时间：' name='startDate'>
        <DatePicker showTime placeholder='请输入' />
      </Form.Item>
      <Form.Item<FieldType> label='结束时间：' name='endDate'>
        <DatePicker showTime placeholder='请输入' />
      </Form.Item>
      <Form.Item<FieldType> label='地点：' name='location'>
        <Input placeholder='添加地点' />
      </Form.Item>
      <Form.Item<FieldType> label='描述：' name='description'>
        <TextArea rows={4} placeholder='请输入' />
      </Form.Item>
      <Form.Item style={{ marginBottom: 0 }}>
        <Button
          type='primary'
          htmlType='submit'
          style={{ margin: '0 auto', display: 'block' }}
        >
          提交
        </Button>
        {editData?.id && (
          <Button
            onClick={() => handleDelete(editData?.id)}
            className={styles.deleteBtn}
          >
            删除
          </Button>
        )}
      </Form.Item>
    </Form>
  )
}
export default FormBox
