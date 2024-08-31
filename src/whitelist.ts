import { whitelistDest } from './configure'

const whitelistIP = (ip: string) => {
  whitelistDest(ip)
}

const whitelistIPs = (ips: string[]) => {
  for (const ip of ips) {
    whitelistIP(ip)
  }
}

export { whitelistIP, whitelistIPs }
