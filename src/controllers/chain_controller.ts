import { loadDomainsAndIPs } from './../db'
import { domainToRanges } from './../resolve'
import Controller from '../controller'
import IptablesController from './iptables_controller'
import { wait } from '../utils'

enum WhitelistResult {
  OK = 0,
  BUSY,
  ERROR,
}

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
  readonly whitelisted: Set<string>
  readonly whitelistedIPs: Set<string>
  readonly whitelistedDomains: Set<string>
  // TODO: Refactor and remove assertion
  private iptablesCtrlRef!: IptablesController
  private isBusy: boolean

  constructor() {
    this.chainName = 'WHITELIST'
    this.whitelisted = new Set()
    this.whitelistedIPs = new Set()
    this.whitelistedDomains = new Set()
    this.isBusy = false
  }

  async start(controller: Controller) {
    this.iptablesCtrlRef = controller.getIptablesController()
    this.iptablesCtrlRef.setupChain(this.chainName)
    this.iptablesCtrlRef.resetChain(this.chainName)
    console.log('Importing configuration from the database...')
    const { ips, domains } = await loadDomainsAndIPs()
    ips.forEach(async (ip) => {
      let ok
      do {
        ok = await this.whitelistIP(ip)
        await wait(1000)
      } while (!ok)
    })
    domains.forEach(async (domain) => {
      let ok
      do {
        ok = await this.whitelistDomain(domain)
        await wait(1000)
      } while (!ok)
    })
    console.log('Importing configuration from the database done')
  }

  async stop() {
    // nothing
  }

  #busyGuard(f: () => Promise<void>): () => Promise<WhitelistResult> {
    return async () => {
      let res = WhitelistResult.OK
      if (this.isBusy) {
        return WhitelistResult.BUSY
      }
      this.isBusy = true
      try {
        await f()
      }
      catch {
        res = WhitelistResult.ERROR
      }
      this.isBusy = false
      return res
    }
  }

  async whitelistIP(ip: string): Promise<WhitelistResult> {
    return this.#busyGuard(async () => {
      this.iptablesCtrlRef.extendChain(this.chainName, ip)
      this.whitelisted.add(ip)
      this.whitelistedIPs.add(ip)
    })()
  }

  async whitelistDomain(domain: string): Promise<WhitelistResult> {
    return this.#busyGuard(async () => {
      const ips = await domainToRanges(domain)
      for (const ip of ips) {
        this.iptablesCtrlRef.extendChain(this.chainName, ip)
        this.whitelisted.add(ip)
      }
      this.whitelistedDomains.add(domain)
    })()
  }

  getWhitelistRanges(): Set<string> {
    return this.whitelisted
  }

  getWhitelistedIPs(): Set<string> {
    return this.whitelistedIPs
  }

  getWhitelistedDomains(): Set<string> {
    return this.whitelistedDomains
  }
}

export default ChainController
export { WhitelistResult }
