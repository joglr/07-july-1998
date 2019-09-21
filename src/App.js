import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import useLocalStorage from './use-local-storage'
import sha1 from 'sha1'

const BIRTH_TIME = '16:15:00 GMT+0200 (Central European Summer Time'
const SIXTY_YEARS_TIME = new Date(`Wed Sep 21 2019 ${BIRTH_TIME}`).getTime()
const GIFTS_TIME = new Date(
  'Sat Sep 21 2019 16:20:00 GMT+0200 (Central European Summer Time'
).getTime()
const GOAL = 60
const VOLUME = 0.1
const toDays = ms => ms / 1000 / 60 / 60 / 24
const toYears = ms => ms / 1000 / 60 / 60 / 24 / 365.254

const round = num =>
  `${num.toFixed(60 - 13)}${
    Number(num.toFixed(13).split('.')[1]) === 0
      ? '0'.repeat(13)
      : (Math.random() / 10 ** 60).toString().substr(2, 13)
  }`

function App() {
  const [muted, setMuted] = useLocalStorage(false)
  const { time } = useTime()
  const [p, setP] = useState('')
  const current = time - SIXTY_YEARS_TIME
  const currentInYears = 60 + toYears(current)
  const timeToGoalInYears = GOAL - currentInYears
  const isPartyTime = current >= 0
  const daysTillGifts = toDays(time - GIFTS_TIME)
  const isTimeForGifts = daysTillGifts >= 0
  const audioRef = useRef()
  const isBirthdayChild = () =>
    window.location.hash.length &&
    window.location.hash.startsWith('#e6') &&
    window.location.hash.endsWith('a4')

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = muted ? 0 : VOLUME
  }, [muted])
  return sha1(p.trim()) === 'b686ff235fa058912bac94a211fb38f2a0a23611' ? (
    (window.location = `${window.location.hash.replace('#', '')}.pdf`)
  ) : isBirthdayChild() || isPartyTime ? (
    <div
      className="App"
      onClick={() => audioRef.current && audioRef.current.play()}>
      <header className="App-header">
        {isPartyTime ? (
          <>
            {muted ? '😶' : '😀'}🎺
            <button
              className="App-button"
              onClick={() => setMuted(muted => !muted)}>
              {muted ? '🎶' : '🔇'}
            </button>
            <audio src="secret.flac" autoPlay loop ref={audioRef} />
          </>
        ) : (
          <p>
            {round(Math.min(currentInYears, 60))} yr + <br /> 0
            {round(Math.max(timeToGoalInYears, 0))} yr =
          </p>
        )}
        <div className="App-logo">{isPartyTime ? `🎈${GOAL}🎂` : '?'}</div>
        {isBirthdayChild() ? (
          <div>
            <br />
            <br />
            {isPartyTime ? (
              isTimeForGifts ? (
                <>
                  <p>To open gift,</p>
                  <input
                    value={p}
                    onChange={e => setP(e.target.value)}
                    autoFocus
                    title="Det sædvanlige..."
                    className="App-input"
                    placeholder="Input password..."
                    type="password"
                  />
                </>
              ) : (
                'wait until later today!'
              )
            ) : (
              'soon!'
            )}
          </div>
        ) : (
          ''
        )}
      </header>
    </div>
  ) : (
    <div className="App-header">
      <div className="App-logo" style={{ color: 'red', width: 'min-content' }}>
        access denied
      </div>
      wait until {new Date(SIXTY_YEARS_TIME).toLocaleTimeString()}
    </div>
  )
}

function useTime() {
  const [time, setTime] = useState(new Date().getTime())
  useEffect(() => {
    let canceled = false
    requestAnimationFrame(() => {
      if (!canceled) setTime(new Date().getTime())
    })
    return () => (canceled = true)
  }, [time])
  return {
    time: new Date().getTime()
  }
}

export default App
