"use client"

import { useState } from "react"
import { storageService } from "../services/storage.js"
import { pomodoroTimer } from "../services/timer.js"

const Settings = ({ onClose }) => {
  const [settings, setSettings] = useState(storageService.getSettings())
  const [tempSettings, setTempSettings] = useState(settings)

  const handleSave = () => {
    storageService.saveSettings(tempSettings)
    setSettings(tempSettings)

    // Update timer durations
    pomodoroTimer.setDurations(tempSettings.workDuration, tempSettings.breakDuration)

    onClose()
  }

  const handleReset = () => {
    const defaultSettings = {
      workDuration: 25,
      breakDuration: 5,
      soundEnabled: true,
      vibrationEnabled: true,
    }
    setTempSettings(defaultSettings)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-text">Settings</h2>
            <button onClick={onClose} className="text-text-secondary hover:text-text transition-colors">
              ✕
            </button>
          </div>
        </div>

        {/* Settings Form */}
        <div className="p-6 space-y-6">
          {/* Timer Durations */}
          <div>
            <h3 className="text-lg font-semibold text-text mb-4">Timer Durations</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">Work Session (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={tempSettings.workDuration}
                  onChange={(e) =>
                    setTempSettings((prev) => ({
                      ...prev,
                      workDuration: Number.parseInt(e.target.value) || 25,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">Break Duration (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={tempSettings.breakDuration}
                  onChange={(e) =>
                    setTempSettings((prev) => ({
                      ...prev,
                      breakDuration: Number.parseInt(e.target.value) || 5,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div>
            <h3 className="text-lg font-semibold text-text mb-4">Notifications</h3>

            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={tempSettings.soundEnabled}
                  onChange={(e) =>
                    setTempSettings((prev) => ({
                      ...prev,
                      soundEnabled: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-text">Enable notification sounds</span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={tempSettings.vibrationEnabled}
                  onChange={(e) =>
                    setTempSettings((prev) => ({
                      ...prev,
                      vibrationEnabled: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-text">Enable vibration</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button onClick={handleReset} className="flex-1 btn btn-outline">
            Reset to Default
          </button>
          <button onClick={handleSave} className="flex-1 btn btn-primary">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings
