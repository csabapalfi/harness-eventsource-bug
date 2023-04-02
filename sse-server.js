const express = require('express')
const SseStream = require('ssestream').default

let connection = 0;

setInterval(() => {
  console.log(`server connections: ${connection}`)
}, 1000)

const app = express()
app.get('/sse', (req, res) => {
  console.log('new connection')
  connection++;
  let counter = 0;
  const sseStream = new SseStream(req)
  sseStream.pipe(res)
  const pusher = setInterval(() => {
    sseStream.write({
      event: 'server-time',
      data: `# ${counter} ${Date.now()}`
    })
    counter++
    if (Date.now() % 100 == 0) {
      console.log('dropping connection')
      res.status(500);
      connection--;
      clearInterval(pusher)
      sseStream.unpipe(res)
    }
  }, 100)


  res.on('close', () => {
    // console.log('lost connection')
    clearInterval(pusher)
    sseStream.unpipe(res)
  })
})

app.listen(8080, (err) => {
  if (err) throw err
  console.log('server ready on http://localhost:8080')
})
