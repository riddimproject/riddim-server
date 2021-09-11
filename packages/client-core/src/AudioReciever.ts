import { IAudioChunk, ServerMessage } from '@riddimproject/protocol'
import { numChannels } from './config'

type ChunkCallback = (audioData: Float32Array[]) => void

export default class AudioReceiver {
  url: string
  ws?: WebSocket
  runTicket: number = 0
  chunkCallback: ChunkCallback

  constructor(url: string, chunkCallback: ChunkCallback) {
    this.url = url
    this.chunkCallback = chunkCallback
  }

  start() {
    if (this.ws) {
      return
    }
    const ticket = ++this.runTicket

    console.log('Connecting', this.url)
    this.ws = new WebSocket(this.url)

    this.ws.addEventListener('error', (e) => {
      if (this.runTicket !== ticket) {
        return
      }
      console.log('error', e)

      // Reconnect
      this.stop()
      this.start()
    })

    this.ws.addEventListener('close', (e) => {
      if (this.runTicket !== ticket) {
        return
      }
      console.log('close', e)

      // Reconnect
      this.stop()
      this.start()
    })

    this.ws.addEventListener('open', (e) => {
      if (this.runTicket !== ticket) {
        return
      }
    })

    this.ws.addEventListener('message', async (e) => {
      if (this.runTicket !== ticket) {
        return
      }
      const message = ServerMessage.decode(
        new Uint8Array(await e.data.arrayBuffer())
      )

      if (message.audioChunk) {
        const chunk = message.audioChunk
        this.handleAudioChunk(message.audioChunk)
      }
    })
  }

  private handleAudioChunk({ chunk }: IAudioChunk) {
    if (!chunk) {
      throw new Error('Chunk undefined')
    }

    const channelByteLength = chunk.byteLength / 2

    const interleaved = new Float32Array(
      chunk.buffer,
      chunk.byteOffset,
      chunk.byteLength / 4
    )

    const channels: Float32Array[] = []

    for (let channelIndex = 0; channelIndex < numChannels; channelIndex++) {
      const channel = new Float32Array(channelByteLength / 4)

      for (let i = 0; i < channelByteLength / 4; i++) {
        channel[i] = interleaved[i * numChannels + channelIndex]
      }

      channels.push(channel)
    }

    this.chunkCallback(channels)
  }

  stop() {
    if (!this.ws) {
      return
    }
    this.ws.close()
    delete this.ws
    this.runTicket++
  }
}
