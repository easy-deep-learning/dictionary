import { List } from 'antd'

export type WordItemProps = {
  _id: string
  __v: number
  examples: {
    text: string
    source: string
  }[]
  synonyms: string[]
  translations: string[]
  word: string
}

const WordItem = (props: WordItemProps) => {
  const { examples, synonyms, translations, word } = props

  return (
    <div className="wordItem">
      <div className="wordSource">{word}</div>
      <div className="examples">
        <List
          itemLayout="horizontal"
          dataSource={examples}
          renderItem={(example) => <List.Item>{example.text}</List.Item>}
        />
      </div>
      <div className="synonyms">
        <List
          itemLayout="horizontal"
          dataSource={synonyms}
          renderItem={(synonym) => <List.Item>{synonym}</List.Item>}
        />
      </div>
      <div className="translations">
        <List
          itemLayout="horizontal"
          dataSource={translations}
          renderItem={(translation) => <List.Item>{translation}</List.Item>}
        />
      </div>
    </div>
  )
}

export { WordItem }
