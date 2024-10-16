import { setupChain, resetChain } from './configure'
import { loadDomainsAndIPs } from './db'
import { whitelistIP, whitelistIPs } from './whitelist'
import { domainToRanges } from './resolve'
import express, { json } from 'express'
import api_allow_domain from './api/allow_domain'
import api_allow_ip from './api/allow_ip'
import api_get_list from './api/get_list'
import config from './../config/config'

/**
 * Role of the 'Controller' is to manage an application.
 * It has a few responsabilities:
 * 1. Start all services at startup
 * 2. Support service communication
 * 3. Stop services at shutdown
 */
class Controller {
  async startServices() {
    // Chain controller
    setupChain()
    resetChain()
    const { domains, ips } = await loadDomainsAndIPs()
    try {
      ips.forEach(ip => whitelistIP(ip))
      domains.forEach(async (domain) => {
        const ranges = await domainToRanges(domain)
        whitelistIPs(ranges)
      })
    }
    catch (error) {
      console.error(`Cannot load entries from database: ${error}`)
    }
    // Api controller
    const app = express()
    app.use(json())
    app.use('/allow_domain', api_allow_domain)
    app.use('/allow_ip', api_allow_ip)
    app.use('/get_list', api_get_list)
    app.use((req, res) => {
      res.status(404).json({ error: 'Route not found' })
    })
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`)
    })
  }
}

export default Controller
