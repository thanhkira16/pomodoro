"use client"

import { useState, useEffect } from "react"
import { pomodoroTimer, PomodoroTimer } from "../services/timer.js"
import { notificationService } from "../services/notifications.js"
import { storageService } from "../services/storage.js"
import SessionHistory from "./SessionHistory.jsx"
import Settings from "./Settings.jsx"

const TimerComponent = () => {
  const [timerState, setTimerState] = useState(pomodoroTimer.getState())
  const [stats, setStats] = useState(storageService.getStats())
  const [showHistory, setShowHistory] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    // Set up timer callbacks
    pomodoroTimer.setCallbacks({
      onTick: (data) => {
        setTimerState((prev) => ({
          ...prev,
          timeRemaining: data.timeRemaining,
          formattedTime: PomodoroTimer.formatTime(data.timeRemaining),
        }))
      },
      onSessionComplete: (completedSession) => {
        // Save session to storage
        storageService.saveSession(completedSession)
        setStats(storageService.getStats())

        // Handle notification and user choice
        notificationService.handleSessionComplete(
          completedSession.type,
          () => {
            // Continue to next session
            pomodoroTimer.switchToNextSession()
            pomodoroTimer.start()
          },
          () => {
            // Stop timer
            pomodoroTimer.reset()
          },
        )
      },
      onStateChange: (state) => {
        setTimerState((prev) => ({
          ...prev,
          ...state,
          formattedTime: PomodoroTimer.formatTime(state.timeRemaining),
        }))
      },
    })

    // Cleanup on unmount
    return () => {
      pomodoroTimer.pause()
    }
  }, [])

  const handleStart = () => {
    pomodoroTimer.start()
  }

  const handlePause = () => {
    pomodoroTimer.pause()
  }

  const handleReset = async () => {
    const shouldReset = await notificationService.showDialog(
      "Reset Timer",
      "Are you sure you want to reset the current session?",
      ["Cancel", "Reset"],
    )

    if (shouldReset) {
      pomodoroTimer.reset()
    }
  }

  const getSessionTypeText = () => {
    return timerState.isWorkSession ? "Work Session" : "Break Time"
  }

  const getSessionTypeColor = () => {
    return timerState.isWorkSession ? "text-primary" : "text-secondary"
  }

  const getProgressPercentage = () => {
    const totalTime = timerState.isWorkSession ? 25 * 60 : 5 * 60
    const elapsed = totalTime - timerState.timeRemaining
    return (elapsed / totalTime) * 100
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-red-400/20 to-orange-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl"></div>

      <div className="w-full max-w-lg mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-4xl">⚡</span>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Super Pomodoro</h1>
          </div>
          <p className="text-muted-foreground text-lg">Stay focused, stay productive</p>

          {/* Navigation buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => setShowHistory(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/80 rounded-lg transition-all duration-200"
            >
              <span>📊</span> History
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/80 rounded-lg transition-all duration-200"
            >
              <span>⚙️</span> Settings
            </button>
          </div>
        </div>

        {/* Main Timer Card */}
        <div className="bg-card border border-border rounded-3xl shadow-2xl p-8 mb-6 backdrop-blur-sm bg-gradient-to-br from-background/80 to-background/60">
          {/* Session Type */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${timerState.isWorkSession
                ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
              }`}>
              <span>{timerState.isWorkSession ? '🎯' : '☕'}</span>
              {getSessionTypeText()}
            </div>
          </div>

          {/* Circular Progress */}
          <div className="relative w-56 h-56 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-muted/20 to-muted/40 backdrop-blur-sm"></div>
            <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-muted/30"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="url(#progressGradient)"
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - getProgressPercentage() / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={timerState.isWorkSession ? '#ef4444' : '#10b981'} />
                  <stop offset="100%" stopColor={timerState.isWorkSession ? '#f97316' : '#22c55e'} />
                </linearGradient>
              </defs>
            </svg>

            {/* Timer Display */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="text-center">
                <div className="text-5xl font-mono font-bold text-foreground tracking-tight">{timerState.formattedTime}</div>
                <div className={`text-sm font-medium mt-2 inline-flex items-center gap-1 ${timerState.isRunning
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-muted-foreground'
                  }`}>
                  <span className={`w-2 h-2 rounded-full ${timerState.isRunning ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'
                    }`}></span>
                  {timerState.isRunning ? "Running" : "Paused"}
                </div>
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center gap-4">
            {!timerState.isRunning ? (
              <button
                onClick={handleStart}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span>▶️</span> Start
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span>⏸️</span> Pause
              </button>
            )}

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-3 border-2 border-muted-foreground text-muted-foreground hover:bg-muted hover:text-foreground font-semibold rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              <span>🔄</span> Reset
            </button>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-card border border-border rounded-3xl shadow-xl p-6 backdrop-blur-sm bg-gradient-to-br from-background/80 to-background/60">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">📊</span>
            <h3 className="text-xl font-bold text-foreground">Today's Progress</h3>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl border border-red-200/50 dark:border-red-800/30">
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.today.workSessions}</div>
              <div className="text-sm font-medium text-red-700/80 dark:text-red-300/80 mt-1">Work Sessions</div>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200/50 dark:border-green-800/30">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.today.breakSessions}</div>
              <div className="text-sm font-medium text-green-700/80 dark:text-green-300/80 mt-1">Breaks Taken</div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{stats.today.sessions}</div>
              <div className="text-sm font-medium text-muted-foreground">Total Sessions</div>
              <div className="text-lg font-semibold text-primary mt-2">
                🔥 {Math.round(stats.today.workSessions * 25)} minutes focused today
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => {
              pomodoroTimer.switchToNextSession()
            }}
            disabled={timerState.isRunning}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${timerState.isRunning
                ? 'text-muted-foreground/50 cursor-not-allowed'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80 transform hover:scale-105'
              }`}
          >
            <span>🔄</span>
            Switch to {timerState.isWorkSession ? "Break" : "Work"}
          </button>
        </div>
      </div>

      {/* Modal components */}
      {showHistory && <SessionHistory onClose={() => setShowHistory(false)} />}

      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </div>
  )
}

export default TimerComponent
