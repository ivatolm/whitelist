import { Router } from 'express'

import { getIPRanges } from '../resolve'

const router = Router()

router.get('/', async (req, res) => {
  if (!req.query.domain) {
    res.json({ success: false })
    return
  }

  const domain = req.query.domain
  const ranges = await getIPRanges(domain as string)
  console.log(ranges)
})

export default router
