import { MappedEvent, Score } from "../types"
import { api } from "./axios"

export const getMappings = async () => {
  const {
    data: { mappings },
  } = await api.get("api/mappings")

  return mappings.split(";").reduce((acc: Record<string, string>, cur: string) => {
    const [key, value] = cur.split(":")
    if (key && value) acc[key] = value

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

  return info.split("|").reduce((acc: Score, cur: string) => {
    const [rawPeriod, rawScore] = cur.split("@")
    const period = mappings[rawPeriod]

    if (period && rawScore) {
      const [home, away] = rawScore.split(":")
      acc[period] = { type: period, home, away }
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

  const currentEventIds = new Set(currentEvents.map((event) => Object.keys(event)[0]))

  const prevEventsMap = new Map(
    prevEvents.map((event) => {
      const id = Object.keys(event)[0]
      return [id, event]
    }),
  )

  for (const [eventId, event] of prevEventsMap.entries()) {
    if (!currentEventIds.has(eventId)) {
      const removedEvent = { ...event }
      removedEvent[eventId] = { ...event[eventId], status: "REMOVED" }
      newEvents.push(removedEvent)
    }
  }

  return newEvents
}

export const filterRemovedEvents = (events: MappedEvent[]) => {
  return events.filter((eventObj) => {
    const event = Object.values(eventObj)[0]
    return event.status !== "REMOVED"
  })
}

export const mapEventsStatus = (events: MappedEvent[]) => {
  return events.map((event) => {
    const eventId = Object.keys(event)[0]
    const eventData = Object.values(event)[0]

    const score = eventData.scores?.CURRENT
      ? `${eventData.scores.CURRENT.home} - ${eventData.scores.CURRENT.away}`
      : null

    return {
      id: eventId,
      status: eventData.status,
      score,
    }
  })
}

export const eventsChangeLogger = (prevEvents: MappedEvent[], currentEvents: MappedEvent[]) => {
  const previousStatus = mapEventsStatus(prevEvents)
  const currentStatus = mapEventsStatus(currentEvents)

  const currentEventMap = new Map(currentStatus.map((event) => [event.id, event]))

  previousStatus.forEach((prevEvent) => {
    const currentEvent = currentEventMap.get(prevEvent.id)
    if (currentEvent) {
      if (prevEvent.status !== currentEvent.status) {
        console.log(
          `Status changed for event ${prevEvent.id}: ${prevEvent.status} -> ${currentEvent.status}`,
        )
      }
      if (prevEvent.score !== currentEvent.score) {
        console.log(
          `Score changed for event ${prevEvent.id}: ${prevEvent.score} -> ${currentEvent.score}`,
        )
      }
    }
  })
}
