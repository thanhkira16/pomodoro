import { LocalNotifications } from "@capacitor/local-notifications"
import { Haptics, ImpactStyle } from "@capacitor/haptics"
import { Dialog } from "@capacitor/dialog"
import { Capacitor } from "@capacitor/core"

export class NotificationService {
  constructor() {
    this.isInitialized = false
    this.init()
  }

  // Initialize notification permissions
  async init() {
    if (!Capacitor.isNativePlatform()) {
      console.log("Running in browser - notifications limited")
      this.isInitialized = true
      return
    }

    try {
      // Request notification permissions
      const permission = await LocalNotifications.requestPermissions()

      if (permission.display === "granted") {
        this.isInitialized = true
        console.log("Notification permissions granted")
      } else {
        console.warn("Notification permissions denied")
      }
    } catch (error) {
      console.error("Error initializing notifications:", error)
    }
  }

  // Send local notification
  async sendNotification(title, body, sessionType = "work") {
    try {
      if (Capacitor.isNativePlatform() && this.isInitialized) {
        await LocalNotifications.schedule({
          notifications: [
            {
              title,
              body,
              id: Date.now(),
              schedule: { at: new Date(Date.now() + 100) }, // Schedule immediately
              sound: "beep.wav",
              attachments: null,
              actionTypeId: "",
              extra: {
                sessionType,
              },
            },
          ],
        })
      } else {
        // Fallback for browser - use browser notifications
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(title, {
            body,
            icon: "/icon-192.png",
            badge: "/icon-192.png",
          })
        } else if ("Notification" in window && Notification.permission !== "denied") {
          const permission = await Notification.requestPermission()
          if (permission === "granted") {
            new Notification(title, {
              body,
              icon: "/icon-192.png",
              badge: "/icon-192.png",
            })
          }
        }
      }
    } catch (error) {
      console.error("Error sending notification:", error)
    }
  }

  // Trigger haptic feedback
  async triggerHaptics(intensity = "medium") {
    try {
      if (Capacitor.isNativePlatform()) {
        let impactStyle
        switch (intensity) {
          case "light":
            impactStyle = ImpactStyle.Light
            break
          case "heavy":
            impactStyle = ImpactStyle.Heavy
            break
          default:
            impactStyle = ImpactStyle.Medium
        }

        await Haptics.impact({ style: impactStyle })
      } else {
        // Fallback for browser - use vibration API
        if ("vibrate" in navigator) {
          const pattern = intensity === "light" ? [100] : intensity === "heavy" ? [200, 100, 200] : [150]
          navigator.vibrate(pattern)
        }
      }
    } catch (error) {
      console.error("Error triggering haptics:", error)
    }
  }

  // Show confirmation dialog
  async showDialog(title, message, buttons = ["Cancel", "OK"]) {
    try {
      if (Capacitor.isNativePlatform()) {
        const result = await Dialog.confirm({
          title,
          message,
          okButtonTitle: buttons[1] || "OK",
          cancelButtonTitle: buttons[0] || "Cancel",
        })

        return result.value
      } else {
        // Fallback for browser
        return window.confirm(`${title}\n\n${message}`)
      }
    } catch (error) {
      console.error("Error showing dialog:", error)
      return false
    }
  }

  // Show session complete notification and dialog
  async handleSessionComplete(sessionType, onContinue, onStop) {
    const isWork = sessionType === "work"
    const title = isWork ? "Work Session Complete!" : "Break Time Over!"
    const body = isWork
      ? "Great job! Time for a 5-minute break."
      : "Break time is over. Ready for another work session?"

    // Send notification
    await this.sendNotification(title, body, sessionType)

    // Trigger haptics
    await this.triggerHaptics("medium")

    // Show dialog with options
    const nextAction = isWork ? "Start Break" : "Start Work"
    const shouldContinue = await this.showDialog(title, `${body}\n\nWhat would you like to do?`, [
      "Stop Timer",
      nextAction,
    ])

    if (shouldContinue) {
      onContinue?.()
    } else {
      onStop?.()
    }
  }

  // Send reminder notification (for background timer)
  async sendReminderNotification(timeRemaining, sessionType) {
    const isWork = sessionType === "work"
    const minutes = Math.ceil(timeRemaining / 60)

    const title = isWork ? "Work Session in Progress" : "Break Time"
    const body = `${minutes} minute${minutes !== 1 ? "s" : ""} remaining`

    await this.sendNotification(title, body, sessionType)
  }

  // Clear all notifications
  async clearNotifications() {
    try {
      if (Capacitor.isNativePlatform()) {
        await LocalNotifications.cancel({
          notifications: [{ id: 0 }], // Cancel all
        })
      }
    } catch (error) {
      console.error("Error clearing notifications:", error)
    }
  }

  // Play notification sound (web fallback)
  playNotificationSound() {
    if (!Capacitor.isNativePlatform()) {
      try {
        // Create audio context for web
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.value = 800
        oscillator.type = "sine"

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.5)
      } catch (error) {
        console.error("Error playing notification sound:", error)
      }
    }
  }
}

// Create singleton instance
export const notificationService = new NotificationService()
