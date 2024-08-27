import { Router } from 'express'

import { whitelistIP } from '../whitelist'
import { saveIPAddress } from '../db'

const router = Router()

router.get('/', async (req, res) => {
  if (!req.query.ip) {
    res.json({ success: false })
    return
  }

  const ip = req.query.ip as string
  try {
    await whitelistIP(ip)
    await saveIPAddress(ip)
    res.json({ success: true })
  }
  catch {
    res.json({ success: false })
  }
})

export default router
