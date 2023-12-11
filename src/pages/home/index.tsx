import React, { useEffect, useRef, useState } from 'react'
import styles from '@/app.module.less'
import { Input, Switch, message } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import cls from 'classnames'

import sending from '@/assets/images/sending.png'
import success from '@/assets/images/success.png'
import fail from '@/assets/images/fail.png'
import resent from '@/assets/images/resent.png'
import recall from '@/assets/images/back.png'
import smart from '@/assets/images/smart.png'
import mail from '@/assets/images/mail.png'
import logo from '@/assets/images/logo.png'

import MarktingPlugin from './components/markingPlugin'
import SmartAssistance from './components/smart'
import Tab from './components/tab'
import { delHtmlTag, isEmpty } from '../../utils'
import SendBox from './components/sendBox'
import MailList from './components/mailList'
import {
  config,
  getChatList,
  // getChatLlm,
  getCustomers,
  getInfo,
  sendMessage,
  setConfig,
} from '../../api/app'

export type ISmartContent = {
  reply1: string
  reply2: string
  advice: string
  portrait: string
}

export type IMailData = {
  name: string
  content: string
  time: string
  status: number
  id: string
  email: string
  count?: number
  llmSuggest: string
  question: string
}
export type IMessageList = {
  content: string
  time: string
  type: number
  fromName: string
  status: number
}
export type ChatContent = {
  content: string
  toId: string
}
const chooseList = [
  {
    title: '智能辅助',
    value: 0,
  },
  {
    title: '营销插件',
    value: 1,
  },
]

function Home() {
  const [height, setHeight] = useState(0)
  const [active, setActive] = useState(0)
  const [sendContent, setSendContent] = useState('')
  const [mailData, setMailData] = useState<IMailData[]>()
  const [searchContent, setSearchContent] = useState('')
  const [currentMail, setCurrentMail] = useState<IMailData | null>(null)
  const [checkBtn, setCheckBtn] = useState(false)
  const messagesEnd = useRef<HTMLDivElement>(null)
  const [messageList, setMessageList] = useState<IMessageList[]>([])
  const [smartReply, setSmartReply] = useState<ISmartContent>()
  const [showSearch, setShowSearch] = useState(true)
  const [timerId, setTimerId] = useState<NodeJS.Timer>()
  const [custimerId, setCusTimerId] = useState<NodeJS.Timer>()

  const scrollToBottom = () => {
    if (messagesEnd && messagesEnd.current) {
      messagesEnd.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      })
    }
  }
  useEffect(() => {
    if (messageList.length) {
      scrollToBottom()
    }
  }, [messageList.length])
  const resizeUpdate = (e) => {
    const h = e.innerHeight
    setHeight(h)
  }
  useEffect(() => {
    const h = window.innerHeight
    setHeight(h)
    window.addEventListener('resize', resizeUpdate)
    // 调用接口 获取mailData 数据
    return () => {
      window.removeEventListener('resize', resizeUpdate)
    }
  })
  useEffect(() => {
    getCustomersList('')
  }, [])

  const getConfig = () => {
    config().then((res) => {
      const config = JSON.parse(res as unknown as string)
      const { auto_resp } = config
      setCheckBtn(auto_resp === 1 ? true : false)
      // setCheckBtn(true)
    })
  }
  const updateCustomerData = () => {
    getCustomers('').then((res) => {
      //用获取的列表第一个人的id去调用聊天记录

      if (res.length === 0) {
        setShowSearch(false)
        return
      }
      setMailData(res)
    })
  }
  const getCustomersList = (key) => {
    //获取客户列表
    getCustomers(key).then((res) => {
      //用获取的列表第一个人的id去调用聊天记录

      if (res.length === 0) {
        setShowSearch(false)
        return
      }
      setMailData(res)
      initMessageData(res[0])
      // 设置当前显示人
      setCurrentMail(res[0])
      if (res[0].id) {
        //获取聊天记录
        getChatLists(res[0].id)
        getConfig()
      }
    })
  }
  const initMessageData = (data) => {
    setReplyContent(data)
  }
  useEffect(() => {
    if (checkBtn && currentMail?.id) {
      const id = setInterval(() => {
        getChatLists(currentMail.id)
      }, 5000)
      setTimerId(id)
    }
    return () => {
      clearInterval(timerId)
    }
  }, [checkBtn, currentMail?.id])

  useEffect(() => {
    if (currentMail?.id) {
      const custimerId = setInterval(() => {
        getUserInfoById(currentMail?.id)
      }, 5000)
      setCusTimerId(custimerId)
    }
    return () => {
      clearInterval(custimerId)
    }
  }, [currentMail?.id])
  const getUserInfoById = (id) => {
    getInfo(id).then((res) => {
      console.log(res)
      initMessageData(res)
    })
  }

  const getChatLists = (id) => {
    getChatList(id).then((res) => {
      setMessageList(res as unknown as IMessageList[])
      // scrollToBottom()
    })
  }
  const onChange = (checked: boolean) => {
    const checkValue = checked ? 1 : 0
    setConfig(checkValue).then((res) => {
      console.log(res)
      setCheckBtn(checked)
    })
    if (!checked) {
      clearInterval(timerId)
    }
  }
  const handleChangeTab = (index) => {
    setActive(index)
  }
  const handleUseContent = (content) => {
    setSendContent(content)
  }

  const handleSend = () => {
    // 发送给到接口
    handleSendBack(sendContent)
  }
  const handleSendBack = (content: string) => {
    const text = delHtmlTag(content)
    if (isEmpty(text)) {
      message.error('请输入内容')
      return
    }
    const chat = {
      content: text,
      toId: currentMail?.id as string,
    }
    sendMessage(chat).then((res) => {
      console.log(res)
      //刷新记录接口
      getChatLists(currentMail?.id)
      updateCustomerData()
      setSendContent('')
    })
  }
  const handleChangeInput = (text) => {
    setSendContent(text)
  }
  const handleEnterSend = (text) => {
    handleSendBack(text)
  }
  // 左侧列表切换
  const handleClick = (item) => {
    setSendContent('')
    setCurrentMail(item)
    //调用聊天记录
    getChatLists(item.id)
    //设置智能回复12建议的内容
    setReplyContent(item)
    //切换的时候暂停下定时器
    clearInterval(timerId)
    clearInterval(custimerId)
    //右侧界面切换为默认
    setActive(0)
  }
  const setReplyContent = (item) => {
    const smartContent: ISmartContent = {
      reply1: item.llmSuggest1,
      reply2: item.llmSuggest2,
      advice: item.llmSuggest3,
      portrait: item.llmSuggest4,
    }
    setSmartReply(smartContent)
  }
  const handleChangeSearch = (e) => {
    const { value } = e.target
    if (!value && e.type !== 'change') {
      // 删除事件
      getCustomersList('')
      setShowSearch(true)
      setSearchContent('')
    } else if (!value && e.type === 'change') {
      getCustomersList('')
      setShowSearch(true)
      setSearchContent('')
    } else {
      setSearchContent(value)
    }
  }
  const getSearchList = (value) => {
    // 调用接口返回搜索内容 替换list
    getCustomersList(value)
  }
  const handleSearchKeyDown = (e) => {
    // console.log(e, "搜索");
    const value = e.target.value
    if (isEmpty(value)) {
      message.error('请输入内容')
      return
    }
    setSearchContent(value)
    getSearchList(value)
    // 调用接口返回搜索内容 替换list
  }
  const handleInputKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleEnterSend(e.target.innerText)
    }
  }
  const handleRefresh = () => {
    getUserInfoById(currentMail?.id)
  }

  return (
    <div className={styles.container}>
      <div className={styles.leftBox}>
        <div className={styles.leftTop}>
          <img className={styles.img} src={mail} alt='' />
          <div className={styles.text}>智能邮件处理助手</div>
        </div>
        <div className={styles.leftBottom}>
          <div className={styles.searchBox}>
            <Input
              placeholder='搜索'
              prefix={<SearchOutlined />}
              onChange={handleChangeSearch}
              value={searchContent}
              onPressEnter={handleSearchKeyDown}
              allowClear
            />
          </div>
          {showSearch ? (
            <MailList
              data={mailData as IMailData[]}
              onHandleClick={handleClick}
              currentPerson={currentMail as IMailData}
            />
          ) : (
            <div className={styles.noData}>暂无数据</div>
          )}
        </div>
      </div>
      <div className={styles.middle}>
        <div className={styles.topTitle}>
          <div className={styles.left}>
            <div>
              <span>{currentMail?.email}</span>
            </div>
            <div>意向楼盘：招商雍珑府</div>
          </div>
          <div className={styles.right}>
            <div>首次联系时间： {currentMail?.time}</div>
            <div>
              来往邮件数量：<span>{currentMail?.count}</span>
            </div>
          </div>
        </div>
        <div className={styles.content} style={{ height: height - 280 }}>
          <div className={styles.itemsBox}>
            {messageList?.map((item, index) => {
              return (
                <div
                  key={index}
                  className={cls(
                    styles.items,
                    item.type === 0 ? styles.leftContent : styles.rightContent,
                  )}
                >
                  <div className={styles.itemContent}>
                    <div className={styles.name}>{item.fromName}</div>

                    <div
                      className={styles.talkContent}
                      dangerouslySetInnerHTML={{ __html: item.content }}
                      style={{ whiteSpace: 'pre-line' }}
                    ></div>
                    {item.type === 1 && (
                      <div className={styles.statusBox}>
                        <div className={styles.left}>
                          <img
                            src={
                              item.status === 1
                                ? success
                                : item?.status === 0
                                ? fail
                                : sending
                            }
                            alt=''
                          />
                          <span
                            className={cls(
                              item.status === 1
                                ? styles.success
                                : item.status === 0
                                ? styles.fail
                                : styles.sending,
                            )}
                          >
                            {item.status === 1
                              ? '发送成功'
                              : item.status === 0
                              ? '发送失败'
                              : '发送中'}
                          </span>
                        </div>
                        <div className={styles.right}>
                          <div className={styles.resent}>
                            <img src={resent} alt='' /> 重新发送
                          </div>
                          <div>
                            <img src={recall} alt='' /> 召回
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
            <div
              style={{ clear: 'both', height: '1px', width: '100%' }}
              ref={messagesEnd}
            ></div>
          </div>
        </div>

        <div className={styles.bottom}>
          <SendBox
            onHandleContent={handleChangeInput}
            smartContent={sendContent}
            onHandleKeyDown={handleInputKeyDown}
          />
          <div className={styles.sentBtn} onClick={handleSend}>
            发送
          </div>
        </div>
      </div>
      <div className={styles.rightBox}>
        <div className={styles.rightTitle}>
          <div className={styles.nameBox}>
            <img src={smart} className={styles.img} alt='' />
            智慧助理
          </div>

          <div className={styles.autoSwitch}>
            <span className={styles.auto}>自动回复</span>
            <Switch checked={checkBtn} onChange={onChange} />
          </div>
        </div>
        <div className={styles.choose}>
          <Tab
            data={chooseList}
            active={active}
            handleChange={handleChangeTab}
          />
        </div>
        <div className={styles.chooseContent} style={{ height: height - 133 }}>
          {active === 0 ? (
            <div className={styles.smartwrapper}>
              <SmartAssistance
                smartReply={smartReply as ISmartContent}
                height={height}
                onUseContent={handleUseContent}
                userQuestion={currentMail?.question}
                id={currentMail?.id as string}
                onhandleRefresh={handleRefresh}
              />
            </div>
          ) : (
            <MarktingPlugin
              portrait={smartReply?.portrait}
              id={currentMail?.id}
              height={height}
            />
          )}
        </div>
      </div>
      <div className={styles.bg}>
        <img src={logo} alt='' />
      </div>
    </div>
  )
}

export default Home
