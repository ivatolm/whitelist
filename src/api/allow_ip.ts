import { Router } from 'express'
import { saveIP } from '../db'

const router = Router()

router.get('/', async (req, res) => {
  if (!req.query.ip) {
    res.json({ success: false })
    return
  }

  const ip = req.query.ip as string
  try {
    // await whitelistIP(ip)
    await saveIP(ip)
    res.json({ success: true })
  }
  catch {
    res.json({ success: false })
  }
})

export default router
