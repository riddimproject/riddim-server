import ws from 'ws'
import { wsPort } from '../common/config'
import { startConsumingStream, stopConsumingStream } from '../common/streams'

const pathRegex = /^\/([^\/\?]*)/

export const createOutputServer = () => {
  const server = new ws.Server({ port: wsPort })
  console.log(`out server listening on port ${wsPort}`)

  server.on('connection', (socket, request) => {
    const match = request.url && pathRegex.exec(request.url)
    const id = match && match[1]

    if (!id) {
      socket.close()
      return
    }

    startConsumingStream(id, socket)

    socket.on('close', () => {
      stopConsumingStream(id, socket)
    })

    socket.on('error', () => {
      stopConsumingStream(id, socket)
      socket.close()
    })
  })
}
