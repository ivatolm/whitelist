import { Router } from 'express'

import { whitelistDest } from '../configure'

const router = Router()

router.get('/', async (req, res) => {
  if (!req.query.ip) {
    res.json({ success: false })
    return
  }

  const ip = req.query.ip
  try {
    whitelistDest(ip)
  }
  catch {
    res.json({ success: false })
    return
  }

  res.json({ success: true })
})

export default router
