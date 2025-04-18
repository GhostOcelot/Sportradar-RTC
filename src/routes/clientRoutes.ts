import { Router, Request, Response } from "express"
import { api } from "../utils/axios"
import { mapEvent } from "../utils/event"

const router = Router()

router.get("/state", async (req: Request, res: Response) => {
  const {
    data: { odds },
  } = await api.get("api/state")
  const {
    data: { mappings },
  } = await api.get("api/mappings")

  const mappedData = mappings.split(";").reduce((acc: Record<string, string>, cur: string) => {
    const currentItemArray = cur.split(":")
    acc[currentItemArray[0]] = currentItemArray[1]

    return acc
  }, {})

  const events = odds.split("\n").map((item: string) => {
    const event = item.split(",")
    const mappedEvent = mapEvent(event, mappedData)

    return mappedEvent
  })

  res.send(events)
})

export default router
