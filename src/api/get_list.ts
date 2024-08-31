import { Router } from 'express'

import { writeFile } from 'fs/promises'
import { loadDomainsAndIPs } from '../db'
import path from 'path'
import { domainToRanges } from '../resolve'
import { filterIPv4Ips, filterSame } from '../filter'

const router = Router()

router.get('/', async (req, res) => {
  const filePath = path.join(process.cwd(), 'ranges.json')

  try {
    const content = []
    const { domains } = await loadDomainsAndIPs()
    for (const domain of domains) {
      const ranges = await domainToRanges(domain)
      const filtered = filterIPv4Ips(ranges)
      for (const range of filtered) {
        content.push({
          hostname: range,
          ip: '',
        })
      }
    }
    const uniqueContent = filterSame(content)
    await writeFile(filePath, JSON.stringify(uniqueContent, null, 2))
  }
  catch (error) {
    res.status(500).send('Failed to generate a domains file')
    console.error('Failed to create file:', error)
  }

  res.download(filePath)
})

export default router
