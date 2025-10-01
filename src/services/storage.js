// Storage service for session history using localStorage
export class StorageService {
  constructor() {
    this.storageKey = "pomodoro-sessions"
    this.settingsKey = "pomodoro-settings"
  }

  // Check if localStorage is available (browser environment)
  isStorageAvailable() {
    try {
      return typeof window !== 'undefined' && typeof localStorage !== 'undefined'
    } catch (error) {
      return false
    }
  }

  // Save completed session
  saveSession(session) {
    if (!this.isStorageAvailable()) {
      console.warn("localStorage is not available")
      return false
    }

    try {
      const sessions = this.getSessions()
      sessions.push({
        ...session,
        id: Date.now().toString(),
      })

      // Keep only last 100 sessions
      const recentSessions = sessions.slice(-100)
      localStorage.setItem(this.storageKey, JSON.stringify(recentSessions))

      return true
    } catch (error) {
      console.error("Error saving session:", error)
      return false
    }
  }

  // Get all sessions
  getSessions() {
    if (!this.isStorageAvailable()) {
      return []
    }

    try {
      const sessions = localStorage.getItem(this.storageKey)
      return sessions ? JSON.parse(sessions) : []
    } catch (error) {
      console.error("Error loading sessions:", error)
      return []
    }
  }

  // Get sessions for today
  getTodaySessions() {
    const sessions = this.getSessions()
    const today = new Date().toDateString()

    return sessions.filter((session) => {
      const sessionDate = new Date(session.completedAt).toDateString()
      return sessionDate === today
    })
  }

  // Get session statistics
  getStats() {
    const sessions = this.getSessions()
    const todaySessions = this.getTodaySessions()

    const totalSessions = sessions.length
    const totalWorkSessions = sessions.filter((s) => s.type === "work").length
    const totalBreakSessions = sessions.filter((s) => s.type === "break").length

    const todayWorkSessions = todaySessions.filter((s) => s.type === "work").length
    const todayBreakSessions = todaySessions.filter((s) => s.type === "break").length

    return {
      total: {
        sessions: totalSessions,
        workSessions: totalWorkSessions,
        breakSessions: totalBreakSessions,
      },
      today: {
        sessions: todaySessions.length,
        workSessions: todayWorkSessions,
        breakSessions: todayBreakSessions,
      },
    }
  }

  // Save user settings
  saveSettings(settings) {
    if (!this.isStorageAvailable()) {
      console.warn("localStorage is not available")
      return false
    }

    try {
      localStorage.setItem(this.settingsKey, JSON.stringify(settings))
      return true
    } catch (error) {
      console.error("Error saving settings:", error)
      return false
    }
  }

  // Get user settings
  getSettings() {
    const defaultSettings = {
      workDuration: 25,
      breakDuration: 5,
      soundEnabled: true,
      vibrationEnabled: true,
    }

    if (!this.isStorageAvailable()) {
      return defaultSettings
    }

    try {
      const settings = localStorage.getItem(this.settingsKey)
      return settings ? JSON.parse(settings) : defaultSettings
    } catch (error) {
      console.error("Error loading settings:", error)
      return defaultSettings
    }
  }

  // Clear all data
  clearAll() {
    if (!this.isStorageAvailable()) {
      console.warn("localStorage is not available")
      return false
    }

    try {
      localStorage.removeItem(this.storageKey)
      localStorage.removeItem(this.settingsKey)
      return true
    } catch (error) {
      console.error("Error clearing data:", error)
      return false
    }
  }
}

// Create singleton instance
export const storageService = new StorageService()
