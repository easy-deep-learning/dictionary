import { Input } from 'antd'
const { Search } = Input

const SearchWords = () => {
  const onSearch = (query) => {
    console.log('query: ', query) // eslint-disable-line
  }

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
