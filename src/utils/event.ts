import { Score } from "./types"

export const getScoreInfo = (info: string, mappedData: Record<string, string>) => {
  const infoArray = info.split("|")
  const mappedPeriods = infoArray.reduce((acc, cur) => {
    const period = mappedData[cur.split("@")[0]]
    const score = cur.split("@")[1]
    acc[period] = score

    return acc
  }, {})

  return mappedPeriods
}

export const getDateFromTimestamp = (timestamp: number) => {
  const date = new Date(timestamp)

  return date.toISOString()
}

export const mapEvent = (eventInfo: any, mappedData: Record<string, string>) => {
  const mappedEvent = eventInfo.map((info: string, index: number) => {
    if (index === 0) {
      return info
    } else if (index === 3) {
      return getDateFromTimestamp(Number(info))
    } else if (index === 7) {
      return getScoreInfo(info, mappedData)
    } else {
      return mappedData[info]
    }
  })

  const scores = Object.entries(mappedEvent[7]).reduce((acc: Record<string, Score>, cur: any[]) => {
    acc[cur[0]] = {
      type: cur[0],
      home: cur[1].split(":")[0],
      away: cur[1].split(":")[1],
    }

    return acc
  }, {})

  return {
    [mappedEvent[0]]: {
      id: mappedEvent[0],
      status: mappedEvent[6],
      scores,
      startTime: mappedEvent[3],
      sport: mappedEvent[1],
      competitors: {
        HOME: {
          type: "HOME",
          name: mappedEvent[4],
        },
        AWAY: {
          type: "AWAY",
          name: mappedEvent[5],
        },
      },
      competition: mappedEvent[2],
    },
  }
}
