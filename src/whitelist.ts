import { whitelistDest } from './configure'
import { domainToRanges } from './resolve'

const whitelistDomain = async (domain: string) => {
  const ranges = await domainToRanges(domain as string)
  for (const range of ranges) {
    whitelistDest(range)
  }
}

const whitelistIP = (ip: string) => {
  whitelistDest(ip)
}

export { whitelistDomain, whitelistIP }
