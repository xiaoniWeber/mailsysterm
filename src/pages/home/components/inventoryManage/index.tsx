import React, { useEffect, useState } from 'react'
import styles from './index.module.less'
import cls from 'classnames'
import Header from '../header'
import {
  HouseData,
  IBuilds,
  IHouseInfo,
  getBuildInfo,
  getBuilding,
  getHouse,
  getHouseUnit,
} from '@/api/app'
import { Spin, message } from 'antd'

type IProps = {
  height: number
  onhandleClose: () => void
}
const InventoryManage = (props: IProps) => {
  const { onhandleClose, height } = props
  const [step, setStep] = useState(1)
  const [activeUnit, setActiveUnit] = useState(0)
  const [programData, setProgramData] = useState<IBuilds[]>([])
  const [builds, setBuilds] = useState<IBuilds[]>([])
  const [unitData, setUnitData] = useState<IBuilds[]>([])
  const [currentBuild, setCurrentBuild] = useState<string>('')
  // const [unitWidth, setUnitWidth] = useState(0)
  const [unitArray, setUnitArray] = useState<string[]>([])
  const [housedata, setHouseData] = useState<HouseData[]>([])
  const [buildInfo, setBuildInfo] = useState<IHouseInfo>()
  const [loading, setLoading] = useState(false)
  const title = '库存管理'

  const handleNext = (code) => {
    const units = programData.filter((item) => item.parentCode === code)
    setCurrentBuild(code)
    if (units.length === 0) return message.info('暂无信息')
    setUnitData(units)
    // setUnitWidth(138 * units.length)
    getHouseInfo(code, units[0].code) // 获取房子信息
    getHouseUnits(code, units[0].code)
    setActiveUnit(0)
    setStep(2)
  }

  useEffect(() => {
    getBuildings()
  }, [])
  const getHouseUnits = (code, unit) => {
    setLoading(true)
    getHouseUnit(code, unit).then((res) => {
      setUnitArray(res)
      setLoading(false)
    })
  }
  const getBuildings = () => {
    getBuilding().then((res) => {
      setProgramData(res)
      filterBuilds(res)
    })
  }
  const filterBuilds = (data) => {
    // 过滤出 parentCode 相同的数据
    const code = 'uiur5e3wbxak5z8g'
    const builds = data.filter((item) => {
      return item.parentCode === code
    })
    setBuilds(builds)
  }
  const handleChangeUnit = (index, code) => {
    setActiveUnit(index)
    getHouseInfo(currentBuild, code)
  }

  const getHouseInfo = (currentBuild, currentUnit) => {
    getHouse(currentBuild, currentUnit).then((res) => {
      setHouseData(res)
    })
  }
  const handleGoNext = (id) => {
    getBuildInfo(id).then((res) => {
      console.log(res, 'res')
      setBuildInfo(res)
      handleInfo(res)
    })
    setStep(3)
  }
  const handleInfo = (res) => {
    //处理res 将里面的值转换成字符串
    //项目名称：招商雍珑府
    const str =
      '项目名称：招商雍珑府' +
      +'\n' +
      '产品类型：' +
      res.houseTypeName +
      '\n' +
      '房源信息：招商好房' +
      '\n' +
      '房屋结构：' +
      res.doorModel +
      '\n' +
      '房屋房型：' +
      res.apartmentStructure +
      '\n' +
      '房屋朝向：' +
      res.orientation +
      '\n' +
      '建筑面积：' +
      res.area +
      'm²' +
      '\n' +
      '套内面积：' +
      res.innerArea +
      'm²' +
      '\n' +
      '赠送面积：' +
      res.bonusArea +
      'm²' +
      '\n' +
      '建筑单价：' +
      res.subscriptionPrice +
      '元/m²' +
      '\n' +
      '套内单价：' +
      res.unitPrice +
      '元/m²' +
      '\n' +
      '标准总价：' +
      res.totalSubscriptionPrice +
      '元' +
      '\n' +
      '房源底价：' +
      res.basePrice +
      '元'
    console.log(str, 'str')
  }
  return (
    <>
      <div className={styles.wrapper}>
        {step === 1 && (
          <>
            <Header
              onhandleback={onhandleClose}
              title={title}
              onhandleClose={onhandleClose}
            />
            <div className={styles.inventoryWrapper}>
              {builds?.map((item) => {
                return (
                  <div
                    className={cls(styles.item)}
                    onClick={() => handleNext(item.code)}
                    key={item.id}
                  >
                    {item.name}
                  </div>
                )
              })}
            </div>
          </>
        )}
        <div>
          {step === 2 && (
            <div className={styles.secondStep}>
              <Header
                onhandleback={() => setStep(1)}
                title={title}
                onhandleClose={onhandleClose}
              />
              <div className={styles.titleWrapper}>
                <div
                  className={styles.title}
                  // style={{ width: unitWidth }}
                >
                  {unitData?.map((item, index) => {
                    return (
                      <div
                        className={cls(
                          styles.item,
                          activeUnit === index ? styles.active : '',
                        )}
                        key={item.code}
                        onClick={() => handleChangeUnit(index, item.code)}
                      >
                        {item.name}
                      </div>
                    )
                  })}
                </div>
              </div>
              {loading ? (
                <div className={styles.loading}>
                  <Spin size='large' />
                </div>
              ) : (
                <div className={styles.table}>
                  <div
                    className={styles.tableHeader}
                    // style={{ width: unitArray.length * 110 + 70 }}
                  >
                    <div className={styles.firstItem}>楼层</div>
                    {unitArray.map((item, index) => {
                      return (
                        <div className={styles.item} key={index}>
                          {index === 0
                            ? 'A1'
                            : index === 1
                            ? 'A2'
                            : index === 2
                            ? 'B1'
                            : 'B2'}{' '}
                          <br />
                          {item}
                        </div>
                      )
                    })}
                  </div>
                  <div
                    className={styles.houseWrapper}
                    style={{
                      height: height - 320,
                      // width: unitArray.length * 110 + 70,
                    }}
                  >
                    {housedata.map((item, index) => {
                      return (
                        <div className={styles.house} key={index}>
                          <div className={styles.firstItem}>
                            {index + 1 + '层'}
                          </div>
                          {item.houseSimple.map((item, index) => {
                            return (
                              <div
                                key={index}
                                className={cls(
                                  styles.areaBox,
                                  item.saleStatus !== 0 ? styles.active : '',
                                )}
                                onClick={() => handleGoNext(item.id)}
                              >
                                {item.area + 'm²'} <br />
                                {item.subscriptionPrice + '元/m²'}
                              </div>
                            )
                          })}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div>
          {step === 3 && (
            <div className={styles.thirdStep}>
              <Header
                onhandleback={() => setStep(2)}
                title={title}
                onhandleClose={onhandleClose}
              />
              <ul className={styles.list}>
                <li>
                  <span>项目名称：</span> {'招商雍珑府'}
                </li>
                <li>
                  <span>产品类型：</span> {buildInfo?.houseTypeName}
                </li>
                <li>
                  <span>房源信息：</span> 招商好房
                </li>
                <li>
                  <span>房屋结构：</span> {buildInfo?.doorModel}
                </li>
                <li>
                  <span>房屋房型：</span> {buildInfo?.apartmentStructure}
                </li>
                <li>
                  <span>房屋朝向：</span> {buildInfo?.orientation}
                </li>
                <li>
                  <span>建筑面积：</span> {buildInfo?.area + ' m²'}
                </li>
                <li>
                  <span>套内面积：</span> {buildInfo?.innerArea + ' m²'}
                </li>
                <li>
                  <span>赠送面积：</span> {buildInfo?.bonusArea + ' m²'}
                </li>
                <li>
                  <span>建筑单价：</span> {buildInfo?.subscriptionPrice + ' 元'}
                </li>
                <li>
                  <span>套内单价：</span> {buildInfo?.unitPrice + ' 元'}
                </li>
                <li>
                  <span>标准总价：</span>{' '}
                  {buildInfo?.totalSubscriptionPrice + ' 元'}
                </li>
                <li>
                  <span>房源底价：</span> {buildInfo?.basePrice + ' 元'}
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
export default InventoryManage
