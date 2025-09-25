"use client"

import { useState, useEffect } from "react"
import { storageService } from "../services/storage.js"

const SessionHistory = ({ onClose }) => {
  const [sessions, setSessions] = useState([])
  const [filter, setFilter] = useState("today") // 'today', 'week', 'all'
  const [stats, setStats] = useState(storageService.getStats())

  useEffect(() => {
    loadSessions()
  }, [filter])

  const loadSessions = () => {
    let filteredSessions = []
    const allSessions = storageService.getSessions()

    switch (filter) {
      case "today":
        filteredSessions = storageService.getTodaySessions()
        break
      case "week":
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        filteredSessions = allSessions.filter((session) => new Date(session.completedAt) >= weekAgo)
        break
      case "all":
      default:
        filteredSessions = allSessions
        break
    }

    // Sort by most recent first
    filteredSessions.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
    setSessions(filteredSessions)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return `Today ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    } else {
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    }
  }

  const getSessionIcon = (type) => {
    return type === "work" ? "🍅" : "☕"
  }

  const clearAllSessions = async () => {
    const shouldClear = window.confirm("Are you sure you want to clear all session history? This cannot be undone.")
    if (shouldClear) {
      storageService.clearAll()
      setSessions([])
      setStats(storageService.getStats())
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-2xl shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-text">Session History</h2>
            <button onClick={onClose} className="text-text-secondary hover:text-text transition-colors">
              ✕
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mt-4">
            {["today", "week", "all"].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filter === filterOption
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-text-secondary hover:bg-gray-200"
                }`}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="p-4 bg-gray-50">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-primary">
                {filter === "today"
                  ? stats.today.workSessions
                  : filter === "week"
                    ? sessions.filter((s) => s.type === "work").length
                    : stats.total.workSessions}
              </div>
              <div className="text-xs text-text-secondary">Work</div>
            </div>
            <div>
              <div className="text-lg font-bold text-secondary">
                {filter === "today"
                  ? stats.today.breakSessions
                  : filter === "week"
                    ? sessions.filter((s) => s.type === "break").length
                    : stats.total.breakSessions}
              </div>
              <div className="text-xs text-text-secondary">Break</div>
            </div>
            <div>
              <div className="text-lg font-bold text-accent">
                {filter === "today" ? stats.today.sessions : filter === "week" ? sessions.length : stats.total.sessions}
              </div>
              <div className="text-xs text-text-secondary">Total</div>
            </div>
          </div>
        </div>

        {/* Session List */}
        <div className="flex-1 overflow-y-auto max-h-96">
          {sessions.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-2">📝</div>
              <p className="text-text-secondary">No sessions found</p>
              <p className="text-sm text-text-secondary mt-1">Complete some Pomodoro sessions to see them here</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100"
                >
                  <div className="text-2xl">{getSessionIcon(session.type)}</div>
                  <div className="flex-1">
                    <div className="font-medium text-text">
                      {session.type === "work" ? "Work Session" : "Break Time"}
                    </div>
                    <div className="text-sm text-text-secondary">{Math.round(session.duration / 60)} minutes</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-text-secondary">{formatDate(session.completedAt)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {sessions.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={clearAllSessions}
              className="w-full text-sm text-red-500 hover:text-red-600 transition-colors"
            >
              Clear All History
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SessionHistory
