import { describe, expect, it } from "vitest"
import { filterRemovedEvents, getDateFromTimestamp, mapEventsStatus } from "../utils/events"

describe("get date from timestamp", () => {
  it("input correct timestamp", () => {
    const date = getDateFromTimestamp(1745222390773)
    expect(date).toBe("2025-04-21T07:59:50.773Z")
  })

  it("input 0 as timestamp", () => {
    const date = getDateFromTimestamp(0)
    expect(date).toBe("1970-01-01T00:00:00.000Z")
  })
})

describe("get map event to score", () => {
  it("map single event", () => {
    const scores = mapEventsStatus([
      {
        "5c1dfb37-6350-4638-8a49-6eae4c584a46": {
          id: "5c1dfb37-6350-4638-8a49-6eae4c584a46",
          status: "LIVE",
          scores: { CURRENT: { type: "CURRENT", home: "5", away: "2" } },
          startTime: "2025-04-21T08:14:26.560Z",
          sport: "BASKETBALL",
          competitors: {
            HOME: { type: "HOME", name: "Dallas Mavericks" },
            AWAY: { type: "AWAY", name: "Toronto Raptors" },
          },
          competition: "NBA",
        },
      },
    ])
    expect(scores).toEqual([
      {
        id: "5c1dfb37-6350-4638-8a49-6eae4c584a46",
        status: "LIVE",
        score: "5 - 2",
      },
    ])
  })
})

describe("filter removed events", () => {
  it("filter empty array", () => {
    const filteredEvents = filterRemovedEvents([])
    expect(filteredEvents).toEqual([])
  })

  it("filter 1 removed element array", () => {
    const filteredEvents = filterRemovedEvents([
      {
        "f68c58a3-bc32-4a63-b117-40d2a6dda7aa": {
          id: "f68c58a3-bc32-4a63-b117-40d2a6dda7aa",
          status: "LIVE",
          scores: { CURRENT: { type: "CURRENT", home: "4", away: "4" } },
          startTime: "2025-04-21T08:25:23.895Z",
          sport: "BASKETBALL",
          competitors: {
            HOME: { type: "HOME", name: "Toronto Raptors" },
            AWAY: { type: "AWAY", name: "Chicago Bulls" },
          },
          competition: "NBA",
        },
      },
      {
        "4bb2cb0a-e54d-4738-8b31-ad8a63e34da5": {
          id: "4bb2cb0a-e54d-4738-8b31-ad8a63e34da5",
          status: "REMOVED",
          scores: { CURRENT: { type: "CURRENT", home: "5", away: "5" } },
          startTime: "2025-04-21T08:24:49.821Z",
          sport: "BASKETBALL",
          competitors: {
            HOME: { type: "HOME", name: "Los Angeles Lakers" },
            AWAY: { type: "AWAY", name: "Boston Celtics" },
          },
          competition: "NBA",
        },
      },
    ])
    expect(filteredEvents.length).toEqual(1)
  })
})
