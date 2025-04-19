import { api } from "../utils/axios"
import { handleRemovedEvents, mapEvent } from "../utils/event"
import { MappedEvent } from "../utils/types"

export let cachedEvents: MappedEvent[] = []

export const pollAndMapEvents = async () => {
  try {
    const {
      data: { odds },
    } = await api.get("api/state")
    const {
      data: { mappings },
    } = await api.get("api/mappings")

    if (odds === "") {
      console.warn("Received empty odds. Retrying...")
      cachedEvents = []
      return
    } else {
      const mappedData = mappings.split(";").reduce((acc: Record<string, string>, cur: string) => {
        const [key, value] = cur.split(":")
        acc[key] = value
        return acc
      }, {})

      let events = odds.split("\n").map((item: string) => {
        const event = item.split(",")
        return mapEvent(event, mappedData)
      })

      console.log("Cached:", cachedEvents.length, "events")
      console.log("Polled:", events.length, "events")
      console.log("-------")

      events = handleRemovedEvents(cachedEvents, events)
      cachedEvents = events
    }
  } catch (err: any) {
    console.error("Polling error:", err.message)
  } finally {
    setTimeout(pollAndMapEvents, 1000)
  }
}
