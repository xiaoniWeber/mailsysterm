import { useEffect, useState } from 'react'
import UserForm, { FieldType } from './form'
import styles from './index.module.less'
import submitSucc from '@/assets/images/submitSuccess.png'
import Header from '../header'
import { getInfo, updateUserInfo } from '@/api/app'

type IProps = {
  onhandleClose: () => void
  id: string | undefined
  portrait: string | undefined
}
const UserProtrait = (props: IProps) => {
  const { onhandleClose, id, portrait } = props
  const [stepOne, setStepOne] = useState(1)
  const [formData, setFormData] = useState<FieldType>()
  const submitData = (data) => {
    console.log(data, 'data')
    const newData = {
      id,
      ...data,
    }
    updateUserInfo(newData).then((res) => {
      console.log(res)
      setStepOne(2)
    })
  }
  const handleUpdata = () => {
    getUserInfo(id)
    setStepOne(1)
  }
  const title = '用户画像'
  useEffect(() => {
    getUserInfo(id)
  }, [id])
  const getUserInfo = (id) => {
    getInfo(id).then((res) => {
      setFormData(res)
    })
  }
  return (
    <>
      {stepOne === 1 ? (
        <>
          <Header
            onhandleback={onhandleClose}
            title={title}
            onhandleClose={onhandleClose}
          />
          <div className={styles.userForm}>
            <UserForm
              portrait={portrait as string}
              data={formData}
              onHandleBack={submitData}
            />
          </div>
        </>
      ) : (
        <>
          <Header
            onhandleback={() => setStepOne(1)}
            onhandleClose={onhandleClose}
            title={title}
          />
          <div className={styles.subwrapper}>
            <img className={styles.success} src={submitSucc} alt='' />
            <div className={styles.text}>提交成功</div>
            <div className={styles.update} onClick={handleUpdata}>
              继续更新
            </div>
          </div>
        </>
      )}
    </>
  )
}
export default UserProtrait
