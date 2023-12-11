// import { IMailData } from '@/App'
import { ChatContent, IMailData } from '../pages/home'
import clent from '@/client'
import { FieldType } from '@/pages/home/components/userPortrait/form'
export type HouseSimple = {
  id: number
  apartmentStructure: string
  area: string
  subscriptionPrice: number
  saleStatus: number
}
export type HouseData = {
  floor: string
  houseSimple: HouseSimple[]
}
export type IBuilds = {
  id: number
  name: string
  code: string
  parentCode: string
}
type IConfig = {
  auto_resp: number
}
export type IHouseInfo = {
  id: string
  name: string
  code: string
  floorCode: string
  unitCode: string
  buildingCode: string
  projectCode: string
  apartmentStructure: string
  innerArea: string
  area: string
  bonusArea: string
  subscriptionPrice: number
  totalSubscriptionPrice: number
  houseTypeName: string
  saleStatus: number
  floorInfo: null
  orientation: string
  doorModel: string
  basePrice: string
  unitPrice: string
}

export type ISchedule = {
  customerId: number
  isAllDay: number
  startDate: string
  endDate: string
  title: string
  location: string
  description: string
  name: string
  id: string
  attendees: string
}
export const getCustomers = (key: string) => {
  return clent.get<IMailData[]>(`/customer/customers?key=${key}`)
}
export function getChatList(id: string) {
  return clent.get(`/chat/chat/${id}`)
}
export function getChatLlm(question: string, prompt: number) {
  return clent.get<string>(`/llm/llm/${prompt}/${question}}`)
}
export function refreshAdvice(customerid: string, promptid: number) {
  return clent.get<string>(`/llm/manual/refresh/${customerid}/${promptid}`)
}
export function sendMessage(chat: ChatContent) {
  return clent.post(`/chat/message`, {
    ...chat,
  })
}

export function config() {
  return clent.get<IConfig>(`/config`)
}

export function setConfig(config: number) {
  return clent.post(`/config`, {
    auto_resp: config,
  })
}
export function getPermissionList(id: string) {
  return clent.post(`/ommc/upm/permission/roleList`, {
    tenantId: id,
  })
}

export function getInfo(id) {
  return clent.get<FieldType>(`/customer/customer/${id}`)
}

export function updateUserInfo(data) {
  return clent.put(`/customer/customer`, {
    ...data,
  })
}

export function getBuilding() {
  return clent.get<IBuilds[]>(`/building`)
}
// 查户型信息
export function getHouseUnit(buildingcode, unitcode) {
  return clent.get<string[]>(
    `/building/house/apartment/structure/uiur5e3wbxak5z8g/${buildingcode}/${unitcode}`,
  )
}
//查房子信息
export function getHouse(buildingcode, unitcode) {
  return clent.get<HouseData[]>(
    `/building/house/simplifyinfo/uiur5e3wbxak5z8g/${buildingcode}/${unitcode}`,
  )
}

// 按日期获取日程信息

export function getSchedule(customerid, date) {
  return clent.get<ISchedule[]>(
    `/schedule/${customerid}/date?day=${date.day}&month=${date.month}&year=${date.year}`,
  )
}
//新增日程信息
export function postScheduleInfo(data: ISchedule) {
  return clent.post(`/schedule`, {
    ...data,
  })
}
export function manualGetSuggestion(data) {
  return clent.post<string>(`/llm/manual/suggestion`, {
    ...data,
  })
}

export function getScheduleById(id) {
  return clent.get<ISchedule>(`/schedule/id/${id}`)
}
export function getBuildInfo(id) {
  return clent.get<IHouseInfo>(`/building/house/id/${id}`)
}
export function deleteSchedule(id) {
  return clent.delete(`/schedule/${id}`)
}
