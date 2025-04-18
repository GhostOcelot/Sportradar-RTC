import express from "express"
import clientRoutes from "./routes/clientRoutes"

const app = express()
const PORT = process.env.PORT || 4000

app.use(express.json())

app.use("/client", clientRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
