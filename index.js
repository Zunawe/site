const express = require('express')
const path = require('path')

const PORT = 8000

const app = express()

app.use('/', express.static(path.join(process.cwd(), 'dist')))

app.use('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
