import { Layout, PageHeader } from 'antd'
import Head from 'next/head'

import { Footer as CustomFooter, WordList } from '../../components'
import type { WordListProps } from '../../components'

export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`http://localhost:3001/api/words`)
  const { wordsListData }: WordListProps = await res.json()

  // Pass data to the page via props
  return { props: { wordsListData } }
}

export default function WordsPage(props: WordListProps) {
  return (
    <>
      <Head>
        <title>Словарь: все слова</title>
      </Head>
      <Layout>
        <PageHeader title="Словарь: все слова" />

        <Layout.Content>
          <WordList wordsListData={props.wordsListData} />
        </Layout.Content>

        <Layout.Footer>
          <CustomFooter />
        </Layout.Footer>
      </Layout>
    </>
  )
}
