import React, { useState, useEffect } from 'react';
import { Bell, X, Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';

/**
 * Notification Center Component
 * Manages reminders and notifications for follow-ups
 */
export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    // Load notifications from localStorage
    const loadNotifications = () => {
      try {
        const saved = localStorage.getItem('homellm_notifications');
        if (saved) {
          const parsed = JSON.parse(saved);
          // Filter out past notifications
          const active = parsed.filter(n => new Date(n.dueDate) > new Date() || !n.completed);
          setNotifications(active);
        }
      } catch (error) {
        console.error('Failed to load notifications:', error);
      }
    };

    loadNotifications();

    // Check for due notifications every minute
    const interval = setInterval(loadNotifications, 60000);

    return () => clearInterval(interval);
  }, []);

  const saveNotifications = (notifs) => {
    try {
      localStorage.setItem('homellm_notifications', JSON.stringify(notifs));
      setNotifications(notifs);
    } catch (error) {
      console.error('Failed to save notifications:', error);
    }
  };

  const addNotification = (notification) => {
    const newNotif = {
      id: Date.now(),
      ...notification,
      createdAt: new Date().toISOString(),
      completed: false
    };
    saveNotifications([...notifications, newNotif]);
  };

  const markAsComplete = (id) => {
    const updated = notifications.map(n =>
      n.id === id ? { ...n, completed: true } : n
    );
    saveNotifications(updated);
  };

  const deleteNotification = (id) => {
    const filtered = notifications.filter(n => n.id !== id);
    saveNotifications(filtered);
  };

  const getDueNotifications = () => {
    return notifications.filter(n => {
      if (n.completed) return false;
      const dueDate = new Date(n.dueDate);
      const now = new Date();
      return dueDate <= now;
    });
  };

  const getUpcomingNotifications = () => {
    return notifications.filter(n => {
      if (n.completed) return false;
      const dueDate = new Date(n.dueDate);
      const now = new Date();
      return dueDate > now;
    });
  };

  const dueNotifs = getDueNotifications();
  const upcomingNotifs = getUpcomingNotifications();

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 hover:bg-white/20 rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6 text-white" />
        {dueNotifs.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {dueNotifs.length}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {showPanel && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-dark-bg-secondary rounded-xl shadow-2xl border border-gray-200 dark:border-dark-border overflow-hidden z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-dark-border bg-gradient-to-r from-headspace-orange to-headspace-orange-dark text-white">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </h3>
              <button
                onClick={() => setShowPanel(false)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-dark-text-secondary">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No notifications</p>
                <p className="text-sm mt-1">We'll remind you to follow up on your emails</p>
              </div>
            ) : (
              <>
                {/* Due Notifications */}
                {dueNotifs.length > 0 && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20">
                    <h4 className="font-semibold text-red-800 dark:text-red-400 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Action Required ({dueNotifs.length})
                    </h4>
                    <div className="space-y-2">
                      {dueNotifs.map(notif => (
                        <NotificationItem
                          key={notif.id}
                          notification={notif}
                          onComplete={() => markAsComplete(notif.id)}
                          onDelete={() => deleteNotification(notif.id)}
                          isDue
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Upcoming Notifications */}
                {upcomingNotifs.length > 0 && (
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Upcoming ({upcomingNotifs.length})
                    </h4>
                    <div className="space-y-2">
                      {upcomingNotifs.map(notif => (
                        <NotificationItem
                          key={notif.id}
                          notification={notif}
                          onComplete={() => markAsComplete(notif.id)}
                          onDelete={() => deleteNotification(notif.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg">
            <p className="text-xs text-gray-600 dark:text-dark-text-secondary text-center">
              Set reminders to follow up on your advocacy emails
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Individual Notification Item
 */
function NotificationItem({ notification, onComplete, onDelete, isDue = false }) {
  const dueDate = new Date(notification.dueDate);
  const isToday = dueDate.toDateString() === new Date().toDateString();

  const getRelativeTime = () => {
    const now = new Date();
    const diff = dueDate - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (days > 1) return `in ${days} days`;
    if (days === 1) return 'tomorrow';
    if (isToday) return 'today';
    if (hours > 0) return `in ${hours} hours`;
    if (diff > 0) return 'soon';
    return 'overdue';
  };

  return (
    <div
      className={`p-3 rounded-lg border-2 transition-colors ${
        isDue
          ? 'border-red-300 bg-red-100 dark:bg-red-900/30 dark:border-red-700'
          : 'border-gray-200 bg-white dark:bg-dark-bg-tertiary dark:border-dark-border'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-800 dark:text-white text-sm">
            {notification.title}
          </p>
          {notification.message && (
            <p className="text-xs text-gray-600 dark:text-dark-text-secondary mt-1">
              {notification.message}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <Calendar className="w-3 h-3 text-gray-500" />
            <span className="text-xs text-gray-600 dark:text-dark-text-secondary">
              {dueDate.toLocaleDateString()} - {getRelativeTime()}
            </span>
          </div>
        </div>

        <div className="flex gap-1">
          <button
            onClick={onComplete}
            className="p-1 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded transition-colors"
            title="Mark as complete"
          >
            <CheckCircle className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
            title="Delete"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook to create follow-up reminders
 */
export function useFollowUpReminder() {
  const createReminder = (emailData, days = 7) => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + days);

    const notification = {
      title: `Follow up: ${emailData.issueType}`,
      message: `Check if you received a response to your email about ${emailData.location}`,
      dueDate: dueDate.toISOString(),
      type: 'follow-up',
      relatedData: emailData
    };

    // Add to localStorage
    try {
      const saved = localStorage.getItem('homellm_notifications');
      const notifications = saved ? JSON.parse(saved) : [];
      notifications.push({
        ...notification,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        completed: false
      });
      localStorage.setItem('homellm_notifications', JSON.stringify(notifications));

      // Dispatch event for UI update
      window.dispatchEvent(new CustomEvent('notification-added'));

      return true;
    } catch (error) {
      console.error('Failed to create reminder:', error);
      return false;
    }
  };

  return { createReminder };
}
