## NextJS API
https://nextjs.org/docs/api-routes/introduction

Any file inside the folder `pages/api` is mapped to `/api/*` and will be treated as an API endpoint instead of a page. They are server-side only bundles and won't increase your client-side bundle size.

For example, the following API route `pages/api/user.ts` returns a json response with a status code of 200:

```ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query } = req
  res.status(200).json({ name: 'John Doe' })
}
```
