import ws from 'ws'
import Queue from 'yocto-queue'

interface AudioChunk {
  ts: number
  data: Buffer
}

export interface RoomSettings {
  sampleRate: number
  chunkSize: number
  channels: number
  sampleByteSize: number
  maxQueueSize: number
}

export const chunckLengthMs = (settings: RoomSettings) =>
  settings.chunkSize / (settings.sampleRate * settings.channels)

export interface Room {
  clients: Set<ws>
  runTicket: number
  chunks: Queue<AudioChunk>
  partial_chunk?: Buffer
  settings: RoomSettings
}

const rooms = new Map<string, Room>()

const createRoom = (): Room => ({
  clients: new Set(),
  runTicket: 0,
  chunks: new Queue(),
  settings: {
    sampleRate: 44100,
    channels: 2,
    chunkSize: 44100 * 2 * 0.1 * 4, // 0.1 seconds
    sampleByteSize: 4,
    maxQueueSize: 10,
  },
})

export const getRoom = (id: string) => {
  let room = rooms.get(id)
  if (!room) {
    room = createRoom()
    rooms.set(id, room)
  }

  return room
}
