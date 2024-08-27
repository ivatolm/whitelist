import { Router } from 'express'

import { getIPRanges } from '../resolve'
import { whitelistDest } from '../configure'

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
      whitelistDest(range)
    }
  }
  catch {
    res.json({ success: false })
    return
  }

  res.json({ success: true })
})

export default router
