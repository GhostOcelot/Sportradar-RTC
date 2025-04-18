import { Router, Request, Response } from "express"
import { cachedEvents } from "../services/pollAndMapEvents"

const router = Router()

router.get("/state", async (req: Request, res: Response) => {
  res.send(cachedEvents)
})

export default router
