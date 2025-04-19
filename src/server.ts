import express from "express"
import clientRoutes from "./routes/stateRoutes"
import { pollAndMapEvents } from "./services/stateService"

const app = express()
const PORT = 4000

app.use(express.json())

app.use("/client", clientRoutes)

pollAndMapEvents()

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
