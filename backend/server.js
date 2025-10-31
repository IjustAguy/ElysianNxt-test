import express from "express"
import cors from "cors"

const app = express()
app.use(cors())
app.use(express.json())

// POST /shorten → รับ URL แล้วส่ง short URL กลับ
app.post("/shorten", (req, res) => {
  const { url } = req.body
  if (!url) return res.status(400).json({ error: "Missing URL" })

  // จำลองการสร้างลิงก์สั้น
  const shortUrl = `https://sho.rt/${Math.random().toString(36).substring(2, 8)}`
  res.json({ original: url, short: shortUrl })
})

// เริ่มรัน server
app.listen(3001, () => console.log("✅ Express server running on port 3001"))
