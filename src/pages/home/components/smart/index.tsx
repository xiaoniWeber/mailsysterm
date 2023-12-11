import React, { useEffect, useState } from 'react'
import cls from 'classnames'
import styles from './index.module.less'
// import { message } from 'antd'
import Reply, { replyType } from '../reply'
import TextArea from 'antd/es/input/TextArea'
import { manualGetSuggestion, refreshAdvice } from '@/api/app'
import { isEmpty } from '@/utils'
import { message } from 'antd'
import { ISmartContent } from '../../../home'
const smartTitle = [
  {
    title: '智能生成',
    value: 0,
  },
  {
    title: '手动生成',
    value: 1,
  },
]
type IProps = {
  onUseContent: (content: string) => void
  height: number
  smartReply: ISmartContent
  userQuestion: string | undefined
  id: string
  onhandleRefresh: () => void
}
const SmartAssistance = (props: IProps) => {
  const { onUseContent, height, smartReply, onhandleRefresh, id } = props
  const [active, setActive] = useState(0)
  const [replyOne, setReplayOne] = useState('')
  const [replyTwo, setReplayTwo] = useState('')
  const [replyThree, setReplayThree] = useState('')
  const [loadingOne, setLoadingOne] = useState(false)
  const [loadingTwo, setLoadingTwo] = useState(false)
  const [loadingThree, setLoadingThree] = useState(false)
  const [loadingFour, setLoadingFour] = useState(false)
  useEffect(() => {
    setReplayOne(smartReply?.reply1)
    setReplayTwo(smartReply?.reply2)
    setReplayThree(smartReply?.advice)
  }, [smartReply])

  const [replyFour, setReplayFour] = useState('')
  const [question, setQuestion] = useState('')

  const handleChange = (index: number) => {
    setActive(index)
  }
  const copy = (content) => {
    onUseContent(content)
  }
  const handleRefresh = (type: number) => {
    //有四种类型
    //id 1 2 3 4
    //调用大模型接口生成话术
    switch (type) {
      case replyType.One:
        setLoadingOne(true)
        break
      case replyType.Two:
        setLoadingTwo(true)
        break
      case replyType.Three:
        setLoadingThree(true)
        break
      case replyType.Four:
        setLoadingFour(true)
        break
    }
    getAnswer(type)
  }
  const getFourSuggestion = () => {
    const data = {
      question,
    }
    manualGetSuggestion(data).then((res) => {
      setLoadingFour(false)
      setReplayFour(res)
    })
  }
  const getAnswer = (type) => {
    if (type === replyType.Four) {
      getFourSuggestion()
    } else {
      refreshAdvice(id, type).then((res) => {
        console.log(res)

        switch (type) {
          case replyType.One:
            setLoadingOne(false)
            //刷新cus接口
            // setReplayOne(res)
            break
          case replyType.Two:
            setLoadingTwo(false)
            // setReplayTwo(res)
            break
          case replyType.Three:
            setLoadingThree(false)
            // setReplayThree(res)
            break
        }
        onhandleRefresh()
      })
    }
  }
  const handleSpeech = () => {
    //请求接口 传递 quesstion给到后端
    //后端返回数据
    if (isEmpty(question)) {
      return message.error('请输入内容')
    }
    setLoadingFour(true)
    getAnswer(replyType.Four)
  }
  const handleChangeQuestion = (e) => {
    setQuestion(e.target.value)
  }

  return (
    <div>
      <div className={styles.smartTitle}>
        {smartTitle.map((item, index) => {
          return (
            <div
              key={index}
              className={cls(
                styles.chooseItem,
                active === index ? styles.active : '',
              )}
              onClick={() => handleChange(index)}
            >
              {item.title}
            </div>
          )
        })}
      </div>
      {active === 0 && (
        <div className={styles.smartContent} style={{ height: height - 228 }}>
          <Reply
            type={replyType.One}
            content={replyOne}
            onHandleRefresh={handleRefresh}
            onCopy={copy}
            loading={loadingOne}
          />

          <Reply
            type={replyType.Two}
            content={replyTwo}
            onHandleRefresh={handleRefresh}
            onCopy={copy}
            loading={loadingTwo}
          />
          <Reply
            type={replyType.Three}
            content={replyThree}
            onHandleRefresh={handleRefresh}
            onCopy={copy}
            loading={loadingThree}
          />
        </div>
      )}
      {active === 1 && (
        <div className={styles.smartContent}>
          <div className={styles.handleContent}>
            <TextArea
              rows={6}
              value={question}
              onChange={handleChangeQuestion}
            />
            <div className={styles.use} onClick={handleSpeech}>
              生成话术
            </div>
          </div>

          <Reply
            type={replyType.Four}
            content={replyFour}
            onHandleRefresh={handleRefresh}
            onCopy={copy}
            loading={loadingFour}
          />
        </div>
      )}
      {/* {contextHolder} */}
    </div>
  )
}
export default SmartAssistance
