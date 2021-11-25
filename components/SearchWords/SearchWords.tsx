import { useState, useEffect } from 'react'
import { Input } from 'antd'
const { Search } = Input

const SearchWords = () => {
  const onSearch = (query: string) => {
    fetch(`/api/search?word=${query}`)
      .then((result) => result.json())
      .then((data) => {
        console.log('data: ', data) // eslint-disable-line
      })
      .catch((error) => console.log(error))
  }
  const [searchResult, setSearchResult] = useState([])

  return (
    <Search
      placeholder="введите слово"
      enterButton="Найти!"
      size="large"
      onSearch={onSearch}
    />
  )
}

export { SearchWords }
