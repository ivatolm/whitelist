import { exec } from 'child_process'
import Controller from '../controller'

/**
 * Role of 'IptablesController' is to manage rules in system iptables.
 */
class IptablesController {
  readonly rules: Set<string>

  constructor() {
    this.rules = new Set()
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async start(controller: Controller) {
  }

  async stop() {
    // nothing
  }

  #addRule(rule: string) {
    if (this.rules.has(rule))
      return

    exec(rule)
    this.rules.add(rule)
  }

  setupChain(name: string) {
    this.#addRule(`iptables -N ${name}`)
    // TODO: Remove assumption that default interface is 'eth0'
    this.#addRule(`iptables -I FORWARD 1 -j ${name} -o eth0`)
  }

  resetChain(name: string) {
    this.#addRule(`iptables -F ${name}`)
    this.#addRule(`iptables -A ${name} -j DROP`)
    // TODO: Remove assumption that port is '39745'
    this.#addRule(`iptables -I ${name} -p udp --sport 39475 -j RETURN`)
  }

  extendChain(name: string, range: string) {
    this.#addRule(`iptables -I ${name} -d ${range} -j RETURN`)
  }
}

export default IptablesController
