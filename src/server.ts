import express from "express"
import { Request, Response } from "express"

const app = express()
const PORT = process.env.PORT || 4000

app.use(express.json())

app.get("/client/state", async (req: Request, res: Response) => {
  res.send({ events: [] })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
