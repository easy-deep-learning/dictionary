// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Word, User, dbConnect } from '../../backend-src/models'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  try {
    await dbConnect()

    switch (method) {
      case 'GET':
        const result = await Word.find()
        res.status(200).send({ result })
        break
      case 'POST':
        const word = new Word({ ...req.body })
        const savedDocument = await word.save()
        res.status(200).json(savedDocument)
        break
      default:
        res.setHeader('Allow', ['GET', 'POST'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (err) {
    res.status(500).send({ error: 'failed to fetch data' })
  }
}
