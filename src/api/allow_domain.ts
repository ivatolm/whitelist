import { Router } from 'express'

import { whitelistDomain } from '../whitelist'
import { saveDomain } from '../db'

const router = Router()

router.get('/', async (req, res) => {
  if (!req.query.domain) {
    res.json({ success: false })
    return
  }

  const domain = req.query.domain as string
  try {
    await whitelistDomain(domain)
    await saveDomain(domain)
    res.json({ success: true })
  }
  catch {
    res.json({ success: false })
  }
})

export default router
