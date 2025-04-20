import { MappedEvent } from "../types"
import { api } from "../utils/axios"
import { eventsChangeLogger, handleRemovedEvents, mapEvents } from "../utils/events"

export let cachedEvents: MappedEvent[] = []

export const pollAndMapEvents = async () => {
  try {
    const { data: state } = await api.get("api/state")

    if (state.odds === "") {
      console.warn("Received empty odds. Retrying...")
    } else {
      const events = await mapEvents(state.odds)
      eventsChangeLogger(cachedEvents, events)
      cachedEvents = handleRemovedEvents(cachedEvents, events)
    }
  } catch (err: any) {
    console.error("Polling error:", err.message)
  } finally {
    setTimeout(pollAndMapEvents, 1000)
  }
}
