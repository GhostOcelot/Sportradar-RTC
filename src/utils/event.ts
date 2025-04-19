import { MappedEvent } from "./types"

export const getDateFromTimestamp = (timestamp: number) => {
  const date = new Date(timestamp)

  return date.toISOString()
}

export const getScoreInfo = (info: string, mappedData: Record<string, string>) => {
  if (!info) return null

  return info.split("|").reduce((acc, cur) => {
    const period = mappedData[cur.split("@")[0]]
    const score = cur.split("@")[1]

    acc[period] = {
      type: period,
      home: score.split(":")[0],
      away: score.split(":")[1],
    }

    return acc
  }, {})
}

export const mapEvent = (eventInfo: any, mappedData: Record<string, string>) => {
  return {
    [eventInfo[0]]: {
      id: eventInfo[0],
      status: mappedData[eventInfo[6]],
      scores: getScoreInfo(eventInfo[7], mappedData),
      startTime: getDateFromTimestamp(Number(eventInfo[3])),
      sport: mappedData[eventInfo[1]],
      competitors: {
        HOME: {
          type: "HOME",
          name: mappedData[eventInfo[4]],
        },
        AWAY: {
          type: "AWAY",
          name: mappedData[eventInfo[5]],
        },
      },
      competition: mappedData[eventInfo[2]],
    },
  }
}

export const handleRemovedEvents = (prevEvents: MappedEvent[], currentEvents: MappedEvent[]) => {
  const prevEventsKeys = prevEvents.map((event) => Object.keys(event)[0])
  const currentEventsKeys = currentEvents.map((event) => Object.keys(event)[0])

  const currentEventsKeysSet = new Set(currentEventsKeys)

  prevEventsKeys.forEach((eventId) => {
    if (!currentEventsKeysSet.has(eventId)) {
      const removedEvent = prevEvents.find((event) => event[eventId])

      removedEvent![eventId].status = "REMOVED"

      currentEvents.push(removedEvent!)
    }
  })

  return currentEvents
}

export const filterRemovedEvents = (events: MappedEvent[]) => {
  return events.filter((eventObj) => {
    const event = Object.values(eventObj)[0]
    return event.status !== "REMOVED"
  })
}
