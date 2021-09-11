import React, { FC } from 'react'
import styled from 'styled-components'
import Player from './Player'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const App: FC = () => {
  return (
    <Wrapper>
      <Player />
    </Wrapper>
  )
}

export default App
