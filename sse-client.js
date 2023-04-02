var EventSource = require('@harnessio/eventsource')
var es = new EventSource(`http://localhost:8080/sse`)


let messages = 0;

setInterval(() => {
  console.log(`message in the past second: ${messages}`)
  messages = 0;
}, 1000)


es.addEventListener('server-time', function (e) {
  messages++
})
