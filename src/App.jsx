import { useMemo, useRef, useState } from 'react'
import './App.css'

const MAX_VIDEOS = 3
const PASSWORD = 'hotdogs'
const AUTH_STORAGE_KEY = 'video-sync-auth'

function App() {
  const [durations, setDurations] = useState([])
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRefs = useRef([])
  const [passwordInput, setPasswordInput] = useState('')
  const [authError, setAuthError] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem(AUTH_STORAGE_KEY) === 'true'
    } catch {
      return false
    }
  })

  const videoSources = useMemo(
    () => [
      {
        name: '11_Bragg Rear Foot Pivot.mp4',
        url: '/videos/11_Bragg%20Rear%20Foot%20Pivot.mp4',
      },
      {
        name: '12_Bragg Rear Foot Pivot 1B Angle.mp4',
        url: '/videos/12_Bragg%20Rear%20Foot%20Pivot%201B%20Angle.mp4',
      },
      {
        name: '13_Bragg Rear Foot Pivot C Angle.mp4',
        url: '/videos/13_Bragg%20Rear%20Foot%20Pivot%20C%20Angle.mp4',
      },
    ],
    []
  )

  const minDuration = useMemo(() => {
    if (videoSources.length === 0) {
      return 0
    }
    const loaded = durations.filter(Boolean)
    if (loaded.length < videoSources.length) {
      return 0
    }
    return Math.min(...loaded)
  }, [durations, videoSources.length])

  const syncAllTo = (time) => {
    videoRefs.current.forEach((video) => {
      if (video && Math.abs(video.currentTime - time) > 0.03) {
        video.currentTime = time
      }
    })
  }

  const handlePlayPause = async () => {
    if (isPlaying) {
      videoRefs.current.forEach((video) => video?.pause())
      setIsPlaying(false)
      return
    }

    syncAllTo(currentTime)
    try {
      await Promise.all(
        videoRefs.current.map((video) => (video ? video.play() : null))
      )
      setIsPlaying(true)
    } catch {
      setIsPlaying(false)
    }
  }

  const handleScrub = (event) => {
    const nextTime = Number(event.target.value)
    setCurrentTime(nextTime)
    syncAllTo(nextTime)
  }

  const handleTimeUpdate = () => {
    const mainVideo = videoRefs.current[0]
    if (!mainVideo) {
      return
    }
    const time = mainVideo.currentTime
    setCurrentTime(time)
    videoRefs.current.forEach((video, index) => {
      if (!video || index === 0) {
        return
      }
      if (!video.seeking && Math.abs(video.currentTime - time) > 0.08) {
        video.currentTime = time
      }
    })
  }

  const handleEnded = () => {
    videoRefs.current.forEach((video) => video?.pause())
    setIsPlaying(false)
  }

  const formatTime = (time) => {
    if (!Number.isFinite(time)) {
      return '0:00'
    }
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const sections = [
    {
      title: 'General Movement Profile',
      content: (
        <ul>
          <li>
            Medical and S&amp;C profiling note Braxton struggles with pelvic
            control and IR on both sides
            <ul>
              <li>
                SL Squat (R) flagged as &apos;Abnormal&apos;, with both quads
                failing his last Thomas Test
              </li>
            </ul>
          </li>
          <li>Lacks scapular rhythm</li>
          <li>
            Needs to improve elbow flexion/extension (R) and upper-body
            strength
          </li>
        </ul>
      ),
    },
    {
      title: 'Rear Leg Compensation',
      content: (
        <ul>
          <li>
            Rear foot shifts/pivots/disconnects as he gets into PLL
            <ul>
              <li>
                Likely a commonly seen compensation used to free up rear hip IR
                as the pelvic counter-rotates
              </li>
            </ul>
          </li>
          <li>
            This shift realigns his direction to now be toward the 3B on-deck
            circle
            <ul>
              <li>
                This shift in directionality, coupled with limited hip mobility,
                likely influences his closed-stride cross-body delivery
              </li>
            </ul>
          </li>
        </ul>
      ),
    },
    {
      title: 'Pelvis, Trunk, & Spine',
      content: 'Content will be added here.',
    },
    {
      title: 'Arm Action',
      content: 'Content will be added here.',
    },
  ]

  const [activeSection, setActiveSection] = useState(0)

  const handlePasswordSubmit = (event) => {
    event.preventDefault()
    if (passwordInput === PASSWORD) {
      setIsAuthenticated(true)
      setAuthError('')
      setPasswordInput('')
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, 'true')
      } catch {
        // ignore storage failures
      }
      return
    }
    setAuthError('Incorrect password. Try again.')
  }

  if (!isAuthenticated) {
    return (
      <div className="password-gate">
        <form className="password-card" onSubmit={handlePasswordSubmit}>
          <h1>Enter password</h1>
          <p>This page is protected.</p>
          <label className="password-label" htmlFor="page-password">
            Password
          </label>
          <input
            id="page-password"
            className="password-input"
            type="password"
            value={passwordInput}
            onChange={(event) => setPasswordInput(event.target.value)}
            autoFocus
          />
          {authError ? <div className="password-error">{authError}</div> : null}
          <button className="primary password-button" type="submit">
            Unlock
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-row">
          <img
            className="header-logo"
            src="/Oriole%20Logo%20-%20No%20White%20Border.png"
            alt="Orioles logo"
          />
          <div className="title-block">
            <h1>Braxton Bragg Biomechanics Summary</h1>
            <div className="subtitle">
              Department of Medical, Athletic Training, &amp; Sports Performance
            </div>
            <div className="subtitle">January 30th, 2026</div>
          </div>
        </div>
        <div className="triple-divider" />
      </header>

      <div className="main-layout">
        <section className="video-column">
          <div className="video-grid">
            {Array.from({ length: MAX_VIDEOS }).map((_, index) => {
              const source = videoSources[index]
              return (
                <div className="video-card" key={index}>
                  {source ? (
                    <video
                      ref={(element) => {
                        videoRefs.current[index] = element
                      }}
                      src={source.url}
                      preload="metadata"
                      onLoadedMetadata={(event) => {
                        const nextDuration = event.currentTarget.duration || 0
                        setDurations((prev) => {
                          const updated = [...prev]
                          updated[index] = nextDuration
                          return updated
                        })
                      }}
                      onTimeUpdate={index === 0 ? handleTimeUpdate : undefined}
                      onPlay={index === 0 ? () => setIsPlaying(true) : undefined}
                      onPause={index === 0 ? () => setIsPlaying(false) : undefined}
                      onEnded={index === 0 ? handleEnded : undefined}
                      playsInline
                    />
                  ) : (
                    <div className="video-placeholder">No video loaded</div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="controls-section">
            <div className="controls">
              <button
                className="primary icon-button"
                type="button"
                onClick={handlePlayPause}
                disabled={!minDuration}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                <span className="icon-symbol">{isPlaying ? '⏸' : '▶'}</span>
              </button>
              <div className="scrubber">
                <span>{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max={minDuration || 0}
                  step="0.01"
                  value={Math.min(currentTime, minDuration || 0)}
                  onChange={handleScrub}
                  disabled={!minDuration}
                />
                <span>{formatTime(minDuration)}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="text-column">
          <div className="accordion">
            {sections.map((section, index) => {
              const isOpen = index === activeSection
              return (
                <div className="accordion-item" key={section.title}>
                  <button
                    className={`accordion-title${isOpen ? ' open' : ''}`}
                    type="button"
                    onClick={() => setActiveSection(index)}
                  >
                    <span className="accordion-icon" aria-hidden="true">
                      ▲
                    </span>
                    {section.title}
                  </button>
                  {isOpen && (
                    <div className="accordion-content">{section.content}</div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
