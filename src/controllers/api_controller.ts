import express, { Express, json } from 'express'
import Controller from '../controller'
import { saveDomain, saveIP } from '../db'
import ChainController, { WhitelistResult } from './chain_controller'
import { writeFile } from 'fs/promises'
import path from 'path'
import config from '../../config/config'
import { wait } from '../utils'

/**
 * Role of the 'ApiController' is to manage API requests.
 * It has to:
 * 1. Register endpoints
 * 2. When new request comes, use internal services (other controllers)
 * to satisfy it
 */
class ApiController {
  readonly api: Express

  constructor() {
    this.api = express()
    this.api.use(json())
  }

  async start(controller: Controller) {
    const chainCtrlRef = controller.getChainController()
    this.registerAllowIP(chainCtrlRef)
    this.registerAllowDomain(chainCtrlRef)
    this.registerGetList(chainCtrlRef)
    this.registerGetIPs(chainCtrlRef)
    this.registerGetDomains(chainCtrlRef)
    this.api.use((req, res) => {
      res.status(404).json({ error: 'Route not found' })
    })
    this.api.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`)
    })
  }

  async stop() {
    // nothing
  }

  registerAllowIP(controller: ChainController) {
    this.api.get('/allow_ip', async (req, res) => {
      if (!req.query.ip) {
        res.json({ success: false })
        return
      }

      const ip = req.query.ip as string

      let result: WhitelistResult
      do {
        result = await controller.whitelistIP(ip)
        if (result === WhitelistResult.ERROR) {
          res.json({ success: false })
          return
        }
        if (result === WhitelistResult.OK) {
          break
        }
        await wait(1000)
      } while (result === WhitelistResult.BUSY)

      await saveIP(ip)
      res.json({ success: true })
    })
  }

  registerAllowDomain(controller: ChainController) {
    this.api.get('/allow_domain', async (req, res) => {
      if (!req.query.domain) {
        res.json({ success: false })
        return
      }

      const domain = req.query.domain as string

      let result: WhitelistResult
      do {
        result = await controller.whitelistDomain(domain)
        if (result === WhitelistResult.ERROR) {
          res.json({ success: false })
          return
        }
        if (result === WhitelistResult.OK) {
          break
        }
        await wait(1000)
      } while (result === WhitelistResult.BUSY)

      await saveDomain(domain)
      res.json({ success: true })
    })
  }

  registerGetList(controller: ChainController) {
    this.api.get('/get_list', async (req, res) => {
      const filePath = path.join(process.cwd(), 'ranges.json')

      const whitelistedIPs = [...controller.getWhitelistRanges()]
      const entries = whitelistedIPs.map(range => ({
        hostname: range,
        ip: range,
      }))

      try {
        await writeFile(filePath, JSON.stringify(entries, null, 2))
      }
      catch (error) {
        res.status(500).send('Failed to generate a domains file')
        console.error('Failed to create file:', error)
      }

      res.download(filePath)
    })
  }

  registerGetIPs(controller: ChainController) {
    this.api.get('/get_ips', async (req, res) => {
      const ips = controller.getWhitelistedIPs()
      res.json({ success: true, ips: [...ips] })
    })
  }

  registerGetDomains(controller: ChainController) {
    this.api.get('/get_domains', async (req, res) => {
      const domains = controller.getWhitelistedDomains()
      res.json({ success: true, domains: [...domains] })
    })
  }
}

export default ApiController
