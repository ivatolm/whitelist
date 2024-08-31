import deepEqual from 'deep-equal'

const isIPv4 = (ip: string): boolean => {
  return !ip.includes(':')
}

const filterIPv4Ips = (ips: string[]): string[] => {
  return ips.filter(x => isIPv4(x))
}

const filterSame = (arr: any[]): any[] => {
  const uniqueArr = []

  arr.forEach((item) => {
    if (!uniqueArr.some(existingItem => deepEqual(existingItem, item))) {
      uniqueArr.push(item)
    }
  })

  return uniqueArr
}

export { filterIPv4Ips, filterSame }
