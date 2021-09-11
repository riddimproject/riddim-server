import { useCallback, useEffect, useMemo, useState } from 'react'
import { RiddimAudioPlayer } from '@riddimproject/client-core'

export const useAudioPlayer = (url: string) => {
  const [audioPlayer, setAudioPlayer] = useState<RiddimAudioPlayer>()
  const [playing, setPlaying] = useState(false)
  const [volume, doSetVolume] = useState(1)

  useMemo(() => {
    const audioPlayer = new RiddimAudioPlayer(url)

    setAudioPlayer(audioPlayer)
  }, [url])

  const play = useCallback(() => {
    audioPlayer?.play()
    setPlaying(true)
  }, [audioPlayer])

  const stop = useCallback(() => {
    audioPlayer?.stop()
    setPlaying(false)
  }, [audioPlayer])

  const setVolume = useCallback(
    (volume: number) => {
      doSetVolume(volume)
      audioPlayer?.setVolume(volume)
    },
    [audioPlayer]
  )

  useEffect(() => {
    return () => {
      audioPlayer?.destroy()
    }
  }, [audioPlayer])

  return { playing, play, stop, volume, setVolume }
}
