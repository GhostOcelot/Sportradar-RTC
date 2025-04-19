import { MappedEvent } from "../types"
import { api } from "../utils/axios"
import { handleRemovedEvents, mapEvents } from "../utils/event"

export let cachedEvents: MappedEvent[] = []

export const pollAndMapEvents = async () => {
  try {
    const { data: state } = await api.get("api/state")

    if (state.odds === "") {
      console.warn("Received empty odds. Retrying...")
    } else {
      const events = await mapEvents(state.odds)
      cachedEvents = handleRemovedEvents(cachedEvents, events)

      console.info("Cached:", cachedEvents.length, "events |", "Polled:", events.length, "events")
    }
  } catch (err: any) {
    console.error("Polling error:", err.message)
  } finally {
    setTimeout(pollAndMapEvents, 1000)
  }
}
