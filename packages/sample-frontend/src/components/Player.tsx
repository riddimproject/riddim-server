import React, { FC, useCallback, useEffect } from 'react'
import { useAudioPlayer } from '@riddimproject/client-react'
import { Play, Stop } from '@styled-icons/boxicons-regular'
import styled, { css } from 'styled-components'
import { volumeAtom } from '../state/playerConfig'
import { useAtom } from 'jotai'

const buttonStyle = css`
  cursor: pointeR;

  &:hover {
    color: #ccc;
  }

  &:active {
    color: #aaa;
  }
`

const StyledPlay = styled(Play)`
  ${buttonStyle}
`
const StyledStop = styled(Stop)`
  ${buttonStyle}
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const Player: FC = () => {
  const url =
    window.location.hash.slice(1) || 'wss://riddim-out.henrik.ninja/test-tone'
  const { play, stop, playing, setVolume } = useAudioPlayer(url)
  const [volume, setSavedVolume] = useAtom(volumeAtom)

  const handleVolumeChange = useCallback(
    (e) => {
      const val = e.currentTarget.value
      setSavedVolume(val)
    },
    [setVolume, setSavedVolume]
  )

  useEffect(() => {
    setVolume(Math.pow(volume, 2))
  }, [volume])

  return (
    <Wrapper>
      <input
        type="range"
        step="any"
        min="0"
        max="1"
        onChange={handleVolumeChange}
        value={volume}
      />
      {playing ? (
        <StyledStop size={200} onClick={stop} />
      ) : (
        <StyledPlay size={200} onClick={play} />
      )}
    </Wrapper>
  )
}

export default Player
