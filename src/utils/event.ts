import { MappedEvent } from "../types"
import { api } from "./axios"

export const getMappings = async () => {
  const {
    data: { mappings },
  } = await api.get("api/mappings")

  return mappings.split(";").reduce((acc: Record<string, string>, cur: string) => {
    const [key, value] = cur.split(":")
    acc[key] = value
    return acc
  }, {})
}

export const getDateFromTimestamp = (timestamp: number) => {
  const date = new Date(timestamp)

  return date.toISOString()
}

export const getScoreInfo = async (info: string) => {
  if (!info) return null

  const mappings = await getMappings()

  return info.split("|").reduce((acc, cur) => {
    const period = mappings[cur.split("@")[0]]
    const score = cur.split("@")[1]

    acc[period] = {
      type: period,
      home: score.split(":")[0],
      away: score.split(":")[1],
    }

    return acc
  }, {})
}

export const mapEvents = async (odds: string): Promise<MappedEvent[]> => {
  const mappings = await getMappings()

  return Promise.all(
    odds.split("\n").map(async (item: string) => {
      const event = item.split(",")
      return {
        [event[0]]: {
          id: event[0],
          status: mappings[event[6]],
          scores: await getScoreInfo(event[7]),
          startTime: getDateFromTimestamp(Number(event[3])),
          sport: mappings[event[1]],
          competitors: {
            HOME: {
              type: "HOME",
              name: mappings[event[4]],
            },
            AWAY: {
              type: "AWAY",
              name: mappings[event[5]],
            },
          },
          competition: mappings[event[2]],
        },
      }
    }),
  )
}

export const handleRemovedEvents = (prevEvents: MappedEvent[], currentEvents: MappedEvent[]) => {
  const newEvents = [...currentEvents]
  const prevEventsKeys = prevEvents.map((event) => Object.keys(event)[0])
  const currentEventsKeys = currentEvents.map((event) => Object.keys(event)[0])

  const currentEventsKeysSet = new Set(currentEventsKeys)

  prevEventsKeys.forEach((eventId) => {
    if (!currentEventsKeysSet.has(eventId)) {
      const removedEvent = prevEvents.find((event) => event[eventId])

      removedEvent![eventId].status = "REMOVED"

      newEvents.push(removedEvent!)
    }
  })

  return newEvents
}

export const filterRemovedEvents = (events: MappedEvent[]) => {
  return events.filter((eventObj) => {
    const event = Object.values(eventObj)[0]
    return event.status !== "REMOVED"
  })
}
