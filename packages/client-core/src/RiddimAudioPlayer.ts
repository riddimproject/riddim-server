import AudioFeeder from 'audio-feeder'
import AudioReceiver from './AudioReciever'
import { numChannels, sampleRate } from './config'

export default class AudioPlayer {
  private feeder: any
  private receiver?: AudioReceiver
  private url: string
  private volume: number = 1
  private playing: boolean = false

  constructor(url: string) {
    this.url = url
  }

  private ensureFeeder() {
    if (this.feeder) {
      return
    }

    this.feeder = new AudioFeeder()

    this.receiver = new AudioReceiver(this.url, (chunk) => {
      this.feeder.bufferData(chunk)
    })
  }

  setVolume(volume: number) {
    this.volume = volume

    if (this.playing) {
      this.feeder.volume = volume
    }
  }

  play() {
    this.ensureFeeder()

    this.feeder.init(numChannels, sampleRate)
    this.feeder.volume = this.volume
    this.feeder.start()

    this.receiver?.start()

    this.playing = true
  }

  stop() {
    if (this.feeder) {
      this.feeder.stop()
      this.feeder.close()
      delete this.feeder
    }

    if (this.receiver) {
      this.receiver.stop()
      delete this.receiver
    }

    this.playing = false
  }

  destroy() {
    this.stop()
  }
}
