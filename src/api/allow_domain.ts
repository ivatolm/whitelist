import { Router } from 'express'

import { getIPRanges } from '../resolve'
import { whitelistRange } from '../configure'

const router = Router()

router.get('/', async (req, res) => {
  if (!req.query.domain) {
    res.json({ success: false })
    return
  }

  const domain = req.query.domain
  try {
    const ranges = await getIPRanges(domain as string)
    for (const range of ranges) {
      whitelistRange(range)
    }
  }
  catch {
    res.json({ success: false })
    return
  }

  res.json({ success: true })
})

export default router
