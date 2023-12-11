import { Button, Form, Input, Radio, message } from 'antd'
import advice from '@/assets/images/advice.png'
import styles from './index.module.less'
import { useEffect, useState } from 'react'
const { TextArea } = Input
type IProps = {
  onHandleBack: (data) => void
  data: unknown
  portrait: string
}
export type FieldType = {
  age: number
  email: string
  familyMembers: string
  gender: number
  intentEstate: string
  maritalStatus: number
  name: string
  occupation: string
  phone: string
  purchaseMotivation: string
}

const UserForm = (props: IProps) => {
  const { onHandleBack, data, portrait } = props
  const [textValue, setTextValue] = useState<string>('')

  const [form] = Form.useForm()
  const handleOk = (data) => {
    // 提交数据 去到下一步
    onHandleBack(data)
  }
  useEffect(() => {
    //判断portrait是一个json对象
    if (checkJson(portrait)) {
      // 复制portrait
      const copyPortrait = JSON.parse(portrait)
      const data = handleProtrait(copyPortrait)
      setTextValue(data)
    }
  }, [portrait])
  const checkJson = (str) => {
    if (typeof str === 'string') {
      try {
        const obj = JSON.parse(str)
        if (typeof obj === 'object' && obj) {
          return true
        } else {
          return false
        }
      } catch (e) {
        console.log('error：' + str + '!!!' + e)
        return false
      }
    }
    console.log('It is not a string!')
  }
  const handleProtrait = (data) => {
    // 过滤掉data中的空值

    let textAreaValue = ''
    for (const key in data) {
      if (!data[key]) {
        continue
      }
      //将data[key]拼成字符串
      textAreaValue += `${data[key]};`
    }
    return textAreaValue
  }
  const handleForm = (data) => {
    const newData = { ...data }
    for (const key in newData) {
      //如果key是age，那么就把data[key]的值里面的岁字去掉
      //如果data[key]是空值，就删掉
      if (newData[key] === null || newData[key] === undefined) {
        delete newData[key]
      }
      if (key === 'age' && newData[key]) {
        const age = newData[key].replace('岁', '')
        form.setFieldsValue({
          [key]: age,
        })
      }
      console.log(newData[key], 'newData[key]')
      if (key === 'gender') {
        newData[key] = newData[key] === '男' ? 0 : 1
      }
      if (key === 'maritalStatus') {
        newData[key] =
          newData[key] === '已婚'
            ? 0
            : newData[key] === '单身'
            ? 1
            : newData[key] === '离婚'
            ? 2
            : ''
      }
    }
    return newData
  }
  useEffect(() => {
    form.setFieldsValue(data)
    form.setFieldsValue({
      intentEstate: '招商雍珑府',
    })
  }, [data])

  const handleClick = () => {
    // 处理数据一键填写表单
    if (!textValue) {
      message.error('AI建议为空')
      return
    }
    const data = handleForm(JSON.parse(portrait))
    form.setFieldsValue(data)
  }
  return (
    <>
      <div className={styles.formWrapper}>
        <Form form={form} labelCol={{ span: 5 }} onFinish={handleOk}>
          <Form.Item<FieldType> label='姓名：' name='name'>
            <Input />
          </Form.Item>
          <Form.Item label='性别：' name='gender'>
            <Radio.Group>
              <Radio value={0}> 男 </Radio>
              <Radio value={1}> 女 </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item<FieldType> label='年龄：' name='age'>
            <Input placeholder='请输入' />
          </Form.Item>
          <Form.Item<FieldType> label='职业：' name='occupation'>
            <Input />
          </Form.Item>
          <Form.Item<FieldType> label='手机：' name='phone'>
            <Input />
          </Form.Item>
          <Form.Item<FieldType> label='邮箱：' name='email'>
            <Input />
          </Form.Item>
          <Form.Item<FieldType> label='婚姻状况：' name='maritalStatus'>
            <Radio.Group>
              <Radio value={0}> 已婚 </Radio>
              <Radio value={1}> 单身 </Radio>
              <Radio value={2}>离婚 </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item<FieldType> label='家庭成员：' name='familyMembers'>
            <Input />
          </Form.Item>
          <Form.Item<FieldType> label='意向楼盘：' name='intentEstate'>
            <Input disabled />
          </Form.Item>
          <Form.Item<FieldType> label='购房动机：' name='purchaseMotivation'>
            <Input />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type='primary'
              htmlType='submit'
              style={{ margin: '0 auto', display: 'block' }}
            >
              提交
            </Button>
          </Form.Item>
        </Form>
      </div>

      <div className={styles.advice}>
        <div className={styles.adTitle}>
          <img src={advice} alt='' />
          <span>AI建议</span>
        </div>
        <div className={styles.bottom}>
          <TextArea rows={4} value={textValue} disabled />
          <div className={styles.auto} onClick={handleClick}>
            一键填写
          </div>
        </div>
      </div>
    </>
  )
}
export default UserForm
