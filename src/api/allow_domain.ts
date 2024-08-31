import { Router } from 'express'

import { whitelistIPs } from '../whitelist'
import { saveDomain } from '../db'
import { domainToRanges } from '../resolve'
import { filterIPv4Ips } from '../filter'

const router = Router()

router.get('/', async (req, res) => {
  if (!req.query.domain) {
    res.json({ success: false })
    return
  }

  const domain = req.query.domain as string
  try {
    const ranges = await domainToRanges(domain)
    const filtered = await filterIPv4Ips(ranges)
    await whitelistIPs(filtered)

    await saveDomain(domain)
    res.json({ success: true })
  }
  catch {
    res.json({ success: false })
  }
})

export default router
