const io = require('./sockets/socket.config')
const app = require('./app')
require('./sockets/chat')

io.listen(8001, ()=>{
  console.log('Socket listening on port 8001')
})

app.listen(8000, () => {
  console.log("App listening on port 8000");
});


