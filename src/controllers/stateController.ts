import { Request, Response } from "express"
import { cachedEvents } from "../services/stateService"
import { filterRemovedEvents } from "../utils/event"

export const getState = async (req: Request, res: Response) => {
  res.send(filterRemovedEvents(cachedEvents))
}
