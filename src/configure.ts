import { exec } from 'child_process'

const CHAIN_NAME = 'WHITELIST'

const setupChain = () => {
  exec(`iptables -N ${CHAIN_NAME}`)
  exec(`iptables -I FORWARD 1 -j ${CHAIN_NAME} -o eth0`)
}

const resetChain = () => {
  exec(`iptables -F ${CHAIN_NAME}`)
  exec(`iptables -A ${CHAIN_NAME} -j DROP`)
}

function whitelistRange(range) {
  exec(`iptables -I ${CHAIN_NAME} -d ${range} -j RETURN`)
}

export { setupChain, resetChain, whitelistRange }
