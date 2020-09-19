import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import useLocalStorage from './use-local-storage'

const BIRTH_TIME = '16:30:00 GMT+0200 (Central European Summer Time'
const BIRTHDAY_TIME = new Date(`Wed Sep 21 ${new Date().getFullYear()} ${BIRTH_TIME}`).getTime()
const GOAL = new Date().getFullYear() - 1959
const VOLUME = 0.1
// const toDays = ms => ms / 1000 / 60 / 60 / 24
const toYears = ms => ms / 1000 / 60 / 60 / 24 / 365.254

const round = num =>
  `${num.toFixed(GOAL - 13)}${
    Number(num.toFixed(13).split('.')[1]) === 0
      ? '0'.repeat(13)
      : (Math.random() / 10 ** 60).toString().substr(2, 13)
  }`

function App() {
  const [muted, setMuted] = useLocalStorage(false)
  const { time } = useTime()
  // const [p, setP] = useState('')
  const current = time - BIRTHDAY_TIME
  const currentInYears = GOAL + toYears(current)
  const timeToGoalInYears = GOAL - currentInYears
  const isPartyTime = current >= 0
  // const daysTillGifts = toDays(time - GIFTS_TIME)
  // const isTimeForGifts = daysTillGifts >= 0
  const audioRef = useRef()

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = muted ? 0 : VOLUME
  }, [muted])
  return (
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
            {round(Math.min(currentInYears, GOAL))} yr + <br /> 0
            {round(Math.max(timeToGoalInYears, 0))} yr =
          </p>
        )}
        <div className="App-logo">{isPartyTime ? `🎈${GOAL}🎂` : '?'}</div>
      </header>
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
