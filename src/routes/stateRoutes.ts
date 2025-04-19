import { Router, Request, Response } from "express"
import { cachedEvents } from "../services/stateService"
import { filterRemovedEvents } from "../utils/event"

const router = Router()

router.get("/state", async (req: Request, res: Response) => {
  res.send(filterRemovedEvents(cachedEvents))
})

export default router
