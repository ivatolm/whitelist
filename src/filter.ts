const isIPv4 = (ip: string): boolean => {
  return !ip.includes(':')
}

const filterIPv4Ips = (ips: string[]): string[] => {
  return ips.filter(x => isIPv4(x))
}

export { filterIPv4Ips }
