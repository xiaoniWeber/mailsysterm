import React from 'react'
import reply from '@/assets/images/reply.png'
import reply1 from '@/assets/images/reply1.png'
import refresh from '@/assets/images/refresh.png'
import styles from './index.module.less'
import { Spin } from 'antd'
interface IProps {
  type: number
  content: string
  onHandleRefresh: (type: number) => void
  onCopy: (content: string) => void
  loading: boolean
}
export enum replyType {
  One = 1,
  Two = 2,
  Three = 3,
  Four = 4,
}
const Replay = (props: IProps) => {
  const { type, content, onHandleRefresh, onCopy, loading } = props
  return (
    <div className={styles.smartContentItem}>
      <div className={styles.smartContentItemTitle}>
        <div>
          <img
            src={type === replyType.One || replyType.Two ? reply : reply1}
            className={styles.img}
            alt=''
          />
          {type === replyType.Three
            ? '进一步建议'
            : type === replyType.Two
            ? '基础回复2'
            : type === replyType.One
            ? '基础回复1'
            : '为您匹配以下内容'}
        </div>
        <div>
          <img
            src={refresh}
            className={styles.refreshImg}
            onClick={() => onHandleRefresh(type)}
            alt=''
          />
        </div>
      </div>
      {loading ? (
        <div className={styles.loading}>
          <Spin size='large' />
        </div>
      ) : (
        <div className={styles.smartContentItemContent}>
          <div
            dangerouslySetInnerHTML={{ __html: content }}
            style={{ whiteSpace: 'pre-line' }}
            className={styles.text}
          ></div>
          {type !== replyType.Three && (
            <div className={styles.use} onClick={() => onCopy(content)}>
              使用
            </div>
          )}
        </div>
      )}
    </div>
  )
}
export default Replay
