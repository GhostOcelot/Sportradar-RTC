import express from "express"
import clientRoutes from "./routes/clientRoutes"
import { pollAndMapEvents } from "./services/pollAndMapEvents"

const app = express()
const PORT = process.env.PORT || 4000

app.use(express.json())

app.use("/client", clientRoutes)

pollAndMapEvents()

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
