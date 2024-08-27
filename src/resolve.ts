import * as dns from 'dns/promises'

const ipToASN = async (ip: string) => {
  const whoisURL = `https://stat.ripe.net/data/prefix-overview/data.json?resource=${ip}`
  const response = await fetch(whoisURL)
  const data = await response.json()
  const asn = data.data.asns[0]
  return asn.asn
}

const asnToRanges = async (asn: number) => {
  const url = `https://stat.ripe.net/data/announced-prefixes/data.json?resource=AS${asn}`
  const response = await fetch(url)
  const data = await response.json()
  const prefixes = data.data.prefixes.map(prefixObj => prefixObj.prefix)
  return prefixes
}

const domainToRanges = async (domain: string) => {
  const ip = (await dns.lookup(domain)).address
  const asn = await ipToASN(ip)
  const ranges = await asnToRanges(asn)
  return ranges
}

export { domainToRanges }
