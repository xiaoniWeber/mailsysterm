import React from 'react'
import { Button, Checkbox, Form, Input, message } from 'antd'
import styles from './index.module.less'

const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo)
}

type FieldType = {
  username?: string
  password?: string
  remember?: string
  intialValue?: string
}

const onFinish = (values) => {
  const { password } = values
  if (password !== 'CmftNuc@#2019#') {
    return message.error('密码错误')
  }
  window.location.href = '/home'
}

function LoginPage() {
  return (
    <div className={styles.box}>
      <div className={styles.loginContainer}>
        {/* <h2>智能邮件处理助手系统</h2> */}
        <h2 className={styles.title}>智能邮件处理助手系统</h2>
        <Form
          name='basic'
          labelCol={{ span: 8 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
        >
          <Form.Item<FieldType>
            name='username'
            rules={[{ required: true, message: '请输入用户名!' }]}
            initialValue='10063018'
          >
            <Input size='large' />
          </Form.Item>

          <Form.Item<FieldType>
            name='password'
            rules={[{ required: true, message: '请输入密码!' }]}
            initialValue='CmftNuc@#2019#'
          >
            <Input.Password size='large' />
          </Form.Item>

          <Form.Item<FieldType> name='remember' valuePropName='checked'>
            <Checkbox>记住密码</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit' size='large'>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default LoginPage
