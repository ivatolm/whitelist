import { exec } from 'child_process'

const CHAIN_NAME = 'WHITELIST'

const rules = new Set()

const isIPv6Rule = (rule: string): boolean => {
  return rule.includes(':')
}

const addRule = (rule: string) => {
  if (isIPv6Rule(rule)) {
    return
  }

  if (!rules.has(rule)) {
    exec(rule)
    rules.add(rule)
  }
}

const setupChain = () => {
  addRule(`iptables -N ${CHAIN_NAME}`)
  addRule(`iptables -I FORWARD 1 -j ${CHAIN_NAME} -o eth0`)
}

const resetChain = () => {
  addRule(`iptables -F ${CHAIN_NAME}`)
  addRule(`iptables -A ${CHAIN_NAME} -j DROP`)
  addRule(`iptables -I ${CHAIN_NAME} -p udp --sport 39475 -j RETURN`)
}

function whitelistDest(range: string) {
  addRule(`iptables -I ${CHAIN_NAME} -d ${range} -j RETURN`)
}

export { setupChain, resetChain, whitelistDest }
