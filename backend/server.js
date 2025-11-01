import express from "express"
import cors from "cors"
import fs from "fs"

const app = express()
app.use(cors())
app.use(express.json())

const DATA_FILE = "./urls.json"

function readData() {
  if (!fs.existsSync(DATA_FILE)) return []
  const raw = fs.readFileSync(DATA_FILE)
  return JSON.parse(raw)
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}


app.post("/shorten", (req, res) => {
  const { url } = req.body
  if (!url) return res.status(400).json({ error: "Missing URL" })

  const data = readData()
  const code = Math.random().toString(36).substring(2, 8)
  const shortUrl = `http://localhost:3001/${code}`

  data.push({ code, original: url })
  writeData(data)

  res.json({ original: url, short: shortUrl })
})
app.get("/list", (req, res) => {
  const data = readData();
  res.json(data);
});

app.delete("/delete/:code", (req, res) => {
  const { code } = req.params;
  let data = readData();
  data = data.filter((item) => item.code !== code);
  writeData(data);
  res.json({ message: `URL with code ${code} deleted` });
});

app.get("/:code", (req, res) => {
  const { code } = req.params
  const data = readData()

  const found = data.find((item) => item.code === code)
  if (!found) return res.status(404).send("Short URL not found 😢")


  res.redirect(found.original)
})



app.listen(3001, () => console.log("✅ Server running on port 3001"))
