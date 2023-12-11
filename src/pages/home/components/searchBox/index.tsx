import React, { useState } from 'react'

import { Select } from 'antd'
import type { SelectProps } from 'antd'

let timeout: ReturnType<typeof setTimeout> | null
// let currentValue: string

const fetch = (value: string, callback) => {
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
  //   currentValue = value

  const data = [
    {
      value: 'ddd',
      label: '测试1',
    },
    {
      value: 'eeee',
      label: '测试2',
    },
    {
      value: 'ffff',
      label: '测试3',
    },
  ]
  callback(data)

  if (value) {
    // timeout = setTimeout(fake, 300)
  } else {
    callback([])
  }
}

const SearchInput: React.FC<{
  placeholder: string
  style: React.CSSProperties
}> = (props) => {
  const [data, setData] = useState<SelectProps['options']>([])
  const [value, setValue] = useState<string>()

  const handleSearch = (newValue: string) => {
    fetch(newValue, setData)
  }

  const handleChange = (newValue: string) => {
    setValue(newValue)
  }

  return (
    <Select
      showSearch
      value={value}
      placeholder={props.placeholder}
      style={props.style}
      defaultActiveFirstOption={false}
      suffixIcon={null}
      filterOption={false}
      onSearch={handleSearch}
      onChange={handleChange}
      notFoundContent={null}
      options={(data || []).map((d) => ({
        value: d.value,
        label: d.text,
      }))}
    />
  )
}

const SearchBox: React.FC = () => (
  <SearchInput placeholder='input search text' style={{ width: 200 }} />
)

export default SearchBox
