import { loadDomainsAndIPs } from './../db'
import { domainToRanges } from './../resolve'
import Controller from '../controller'
import IptablesController from './iptables_controller'

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
  // TODO: Refactor and remove assertion
  private iptablesCtrlRef!: IptablesController
  private isBusy: boolean

  constructor() {
    this.chainName = 'WHITELIST'
    this.isBusy = true
  }

  async start(controller: Controller) {
    this.iptablesCtrlRef = controller.getIptablesController()
    this.iptablesCtrlRef.setupChain(this.chainName)
    this.iptablesCtrlRef.resetChain(this.chainName)
    const { ips, domains } = await loadDomainsAndIPs()
    ips.forEach(ip => this.whitelistIP(ip))
    domains.forEach(domain => this.whitelistDomain(domain))
    this.isBusy = false
  }

  async stop() {
    // nothing
  }

  #busyGuard(f: () => Promise<void>): () => Promise<boolean> {
    return async () => {
      if (this.isBusy) {
        return false
      }
      this.isBusy = true
      try {
        await f()
      }
      finally {
        this.isBusy = false
      }
      return true
    }
  }

  async whitelistIP(ip: string): Promise<boolean> {
    return this.#busyGuard(async () => {
      this.iptablesCtrlRef.extendChain(this.chainName, ip)
    })()
  }

  async whitelistDomain(domain: string) {
    return this.#busyGuard(async () => {
      const ips = await domainToRanges(domain)
      for (const ip of ips) {
        this.iptablesCtrlRef.extendChain(this.chainName, ip)
      }
    })()
  }
}

export default ChainController
