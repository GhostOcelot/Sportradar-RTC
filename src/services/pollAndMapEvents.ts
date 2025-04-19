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
      // cachedEvents = handleRemovedEvents(cachedEvents, events)
      cachedEvents = []
      return
    } else {
      const mappedData = mappings.split(";").reduce((acc: Record<string, string>, cur: string) => {
        const [key, value] = cur.split(":")
        acc[key] = value
        return acc
      }, {})

      const events = odds.split("\n").map((item: string) => {
        const event = item.split(",")
        return mapEvent(event, mappedData)
      })

      cachedEvents = handleRemovedEvents(cachedEvents, events)
      cachedEvents = events

      console.log("Polled:", events.length, "events")
    }
  } catch (err: any) {
    console.error("Polling error:", err.message)
  } finally {
    setTimeout(pollAndMapEvents, 1000)
  }
}
