import React, { useCallback, useEffect, useState } from 'react'
import throttle from 'lodash.throttle'

import { Background } from './birds'
import { Button } from './components/Button'

export const App = () => {
  const [pointerCoords, setPointerCoords] = useState([0, 0])
  const pointerMoveHandler = useCallback(throttle((e) => setPointerCoords({
    x: (e.clientX / window.innerWidth) * 2 - 1,
    y: (e.clientY / window.innerHeight) * (-2) + 1
  }), 300), [])

  return (
    <>
      <Background pointerCoords={pointerCoords} />
      <div id="page" onPointerMove={pointerMoveHandler}>
        <h1 id="name">Bryce Wilson</h1>
        <div id="button-bar">
          <Button as="a" href="https://github.com/Zunawe">GitHub</Button>
          {/* <Button as="a">Demos</Button> */}
          <Button as="a" href="https://www.linkedin.com/in/bryce-d-wilson/">LinkedIn</Button>
        </div>
      </div>
    </>
  )
}
