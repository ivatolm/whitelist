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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prefixes = data.data.prefixes.map((prefixObj: { prefix: any }) => prefixObj.prefix)
  return new Set(prefixes)
}

const domainToRanges = async (domain: string) => {
  const ip = (await dns.lookup(domain)).address
  const asn = await ipToASN(ip)
  const ranges = await asnToRanges(asn)

  const FULL_RANGE = '0.0.0.0/0'
  if (ranges.has(FULL_RANGE)) {
    console.log(`WARNING: full range requested by domain: ${domain}. Filtering out...`)
    ranges.delete(FULL_RANGE)
  }
  return ranges
}

export { domainToRanges }
