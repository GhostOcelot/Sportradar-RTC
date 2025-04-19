import { Router } from "express"
import { getState } from "../controllers/stateController"

const router = Router()

router.get("/state", getState)

export default router
