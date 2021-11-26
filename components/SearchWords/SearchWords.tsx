import { useState } from 'react'
import { Input } from 'antd'

import { WordList } from '../../components'

const { Search } = Input

const SearchWords = () => {
  const onSearch = (query: string) => {
    fetch(`/api/search?word=${query}`)
      .then((result) => result.json())
      .then((data) => {
        setSearchResult(data.wordsListData)
      })
      .catch((error) => console.log(error))
  }
  const [searchResult, setSearchResult] = useState([])

  return (
    <div>
      <Search
        placeholder="введите слово"
        enterButton="Найти!"
        size="large"
        onSearch={onSearch}
      />
      <div>
        {searchResult.length > 0 && <WordList wordsListData={searchResult} />}
      </div>
    </div>
  )
}

export { SearchWords }
