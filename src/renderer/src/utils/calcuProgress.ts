import formatUnit from './formatUnit'

interface ItrafficInfo {
  today: string
  last: string
  left: string
}

export default function calcuProgress(trafficInfo: ItrafficInfo): ItrafficInfo {
  const todayVal = formatUnit(trafficInfo.today)
  const lastVal = formatUnit(trafficInfo.last)
  const leftVal = formatUnit(trafficInfo.left)

  const totalVal = lastVal + leftVal

  const today = Math.round((todayVal / totalVal) * 100).toString() + '%'
  const last = Math.round((lastVal / totalVal) * 100).toString() + '%'
  const left = Math.round((leftVal / totalVal) * 100).toString() + '%'

  return {
    today,
    last,
    left
  }
}
