import type { NextApiRequest, NextApiResponse } from 'next'
import { Word, dbConnect } from '../../../backend-src/models'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query } = req

  try {
    await dbConnect()

    switch (method) {
      case 'GET':
        const wordsListData = await Word.find(query)
        res.status(200).send({ wordsListData })
        break
      default:
        res.setHeader('Allow', ['GET'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (err) {
    res.status(500).send({ error: 'failed to fetch data' })
  }
}
