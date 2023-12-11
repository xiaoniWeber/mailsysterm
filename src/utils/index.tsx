/**
 *
 *  去除其他所有html标签
 * 删除空格换行
 * @param msg
 * @returns {XML|string|void}
 */

export function delHtmlTag(msg) {
  msg = msg.replace(/<\/?[^>]*>/g, '') //去除HTML Tag
  msg = msg.replace(/[|]*\n/, '') //去除行尾空格
  msg = msg.replace(/&npsp;/gi, '') //去掉npsp
  msg = msg.replace(/&amp;/gi, '') //去掉&
  msg = msg.replace(/&quot;/gi, '') //去掉"
  msg = msg.replace(/&lt;/gi, '') //去掉<
  msg = msg.replace(/&gt;/gi, '') //去掉>
  msg = msg.replace(/[\r\n]/g, '') //去掉换行符
  return msg
}

/**
 * 空判断
 * @param v
 * @returns {boolean}
 */

export function isEmpty(v) {
  return (
    v === undefined ||
    v === null ||
    v === '' ||
    (Array.isArray(v) && v.length === 0) ||
    (typeof v === 'object' && Object.keys(v).length === 0)
  )
}

// 截取字符串的第一个中文字或者英文第一个字母

export function getFirstLetter(str) {
  if (isEmpty(str)) {
    return ''
  }
  let result = ''
  const reg = /^[a-zA-Z]/
  if (reg.test(str)) {
    result = str.substr(0, 1).toUpperCase()
  } else {
    result = str.substr(0, 1)
  }
  return result
}
//获取指定字符串前面的字符

export const getString = (string, specialStr) => {
  const index = string.indexOf(specialStr)
  return string.substring(0, index)
}

//截取 2023-11-10 11:23:21

export const getTime = (time) => {
  return time.substring(10)
}
