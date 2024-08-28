import { Router } from 'express'

import { writeFile } from 'fs/promises'
import { loadDomainsAndIPs } from '../db'
import path from 'path'
import { domainToRanges } from '../resolve'

const router = Router()

router.get('/', async (req, res) => {
  const filePath = path.join(process.cwd(), 'ranges.json')

  try {
    const content = []
    const { domains } = await loadDomainsAndIPs()
    for (const domain of domains) {
      const ranges = await domainToRanges(domain)
      for (const range of ranges) {
        content.push({
          hostname: range,
          ip: '',
        })
      }
    }
    await writeFile(filePath, JSON.stringify(content, null, 2))
  }
  catch (error) {
    res.status(500).send('Failed to generate a domains file')
    console.error('Failed to create file:', error)
  }

  res.download(filePath)
})

export default router
