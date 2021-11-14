import { List } from 'antd'

import { WordItem, WordItemProps } from '../../components'

export type WordListProps = {
  wordsListData: WordItemProps[]
}

const WordList = (props: WordListProps) => {
  return (
    <List
      size="large"
      bordered
      dataSource={props.wordsListData}
      renderItem={(wordItemData: WordItemProps) => (
        <WordItem {...wordItemData} />
      )}
    />
  )
}

export { WordList }
