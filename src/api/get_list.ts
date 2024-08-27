import { Router } from 'express'

import { writeFile } from 'fs/promises'
import { loadDomainsAndIPs } from '../db'
import path from 'path'

const router = Router()

router.get('/', async (req, res) => {
  const filePath = path.join(process.cwd(), 'domains.json')

  try {
    const { domains } = await loadDomainsAndIPs()
    const content = domains.map(domain => ({
      hostname: domain,
      ip: '',
    }))
    await writeFile(filePath, JSON.stringify(content, null, 2))
  }
  catch (error) {
    res.status(500).send('Failed to generate a domains file')
    console.error('Failed to create file:', error)
  }

  res.download(filePath)
})

export default router
