import ws from 'ws'
import { chunckLengthMs, getRoom, Room } from './rooms'
import { promisify } from 'util'
import { AudioChunk } from '@riddimproject/protocol'

const sleep = promisify(setTimeout)

const runStreamConsumer = async (room: Room) => {
  const ticket = ++room.runTicket
  const chunkDuration = chunckLengthMs(room.settings)

  let nextChunkTime = Date.now()
  while (ticket === room.runTicket) {
    const waitMs = nextChunkTime - Date.now()

    if (waitMs > 0) {
      // Wait the remaining time to ensure a constant rate of chunks
      await sleep(waitMs)
    }
    nextChunkTime += chunkDuration

    const chunk = room.chunks.dequeue()

    if (!chunk) {
      // No chunks available - we have to skip one chunk
      continue
    }

    for (const client of room.clients) {
      client.send(AudioChunk.encode({ chunk: chunk.data }).finish())
    }
  }
}

export const startConsumingStream = (id: string, socket: ws) => {
  const room = getRoom(id)
  room.clients.add(socket)

  if (room.clients.size === 1) {
    // Intentionally run in background (no await)
    runStreamConsumer(room)
  }
}

export const stopConsumingStream = (id: string, socket: ws) => {
  const room = getRoom(id)
  room.clients.delete(socket)

  if (room.clients.size === 0) {
    room.runTicket++
  }
}
