import { loadDomainsAndIPs } from './../db'
import { whitelistIP, whitelistIPs } from './../whitelist'
import { domainToRanges } from './../resolve'
import Controller from '../controller'

/**
 * Role of the 'ChainController' is to manage traffic chain. At the moment
 * traffic is filtered via 'iptables'.
 * It has a few responsibilities:
 * 1. Create chain if it doesn't exist
 * 2. Load the initial configuration
 * 3. When request comes, update configuration and save change in database
 */
class ChainController {
  readonly chainName: string

  constructor() {
    this.chainName = 'WHITELIST'
  }

  async start(controller: Controller) {
    const iptablesCtrl = controller.getIptablesController()
    iptablesCtrl.setupChain(this.chainName)
    iptablesCtrl.resetChain(this.chainName)
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
  }

  async stop() {
    // nothing
  }
}

export default ChainController
