import { Router } from 'express'

import { getIPRanges } from '../resolve'
import { addReturnRule } from '../configure'

const router = Router()

router.get('/', async (req, res) => {
  if (!req.query.domain) {
    res.json({ success: false })
    return
  }

  const domain = req.query.domain
  const ranges = await getIPRanges(domain as string)
  for (const range of ranges) {
    addReturnRule(range)
  }

  res.json({ success: true })
})

export default router
