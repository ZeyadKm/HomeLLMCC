import React, { useState } from 'react';
import { Clock, Plus, Trash2, Calendar } from 'lucide-react';

export default function Timeline({ onTimelineChange }) {
  const [events, setEvents] = useState([
    { id: 1, date: '', description: '', time: '' }
  ]);

  const addEvent = () => {
    const newEvent = {
      id: Date.now(),
      date: '',
      description: '',
      time: ''
    };
    const newEvents = [...events, newEvent];
    setEvents(newEvents);
    if (onTimelineChange) {
      onTimelineChange(newEvents);
    }
  };

  const updateEvent = (id, field, value) => {
    const newEvents = events.map(event =>
      event.id === id ? { ...event, [field]: value } : event
    );
    setEvents(newEvents);
    if (onTimelineChange) {
      onTimelineChange(newEvents);
    }
  };

  const deleteEvent = (id) => {
    const newEvents = events.filter(event => event.id !== id);
    setEvents(newEvents);
    if (onTimelineChange) {
      onTimelineChange(newEvents);
    }
  };

  const exportTimeline = () => {
    const sorted = [...events]
      .filter(e => e.date && e.description)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    let text = '=== INCIDENT TIMELINE ===\n\n';
    sorted.forEach(event => {
      const dateStr = new Date(event.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const timeStr = event.time ? ` at ${event.time}` : '';
      text += `${dateStr}${timeStr}\n`;
      text += `${event.description}\n\n`;
    });

    return text;
  };

  return (
    <div className="space-y-6 dark:text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-6 h-6 text-headspace-orange dark:text-headspace-orange" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Incident Timeline</h2>
        </div>
        <button
          onClick={addEvent}
          className="flex items-center gap-2 px-4 py-2 bg-headspace-orange text-white rounded-lg hover:bg-headspace-orange-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      <div className="space-y-4">
        {events.map((event, index) => (
          <div
            key={event.id}
            className="bg-white dark:bg-dark-bg-secondary rounded-xl p-6 shadow-lg border border-gray-200 dark:border-dark-border"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-headspace-orange/10 rounded-full flex items-center justify-center">
                  <span className="text-headspace-orange font-bold">{index + 1}</span>
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Date
                    </label>
                    <input
                      type="date"
                      value={event.date}
                      onChange={(e) => updateEvent(event.id, 'date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-headspace-orange focus:border-transparent dark:bg-dark-bg-tertiary dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Time (optional)
                    </label>
                    <input
                      type="time"
                      value={event.time}
                      onChange={(e) => updateEvent(event.id, 'time', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-headspace-orange focus:border-transparent dark:bg-dark-bg-tertiary dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                    Event Description
                  </label>
                  <textarea
                    value={event.description}
                    onChange={(e) => updateEvent(event.id, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-headspace-orange focus:border-transparent dark:bg-dark-bg-tertiary dark:text-white"
                    rows="3"
                    placeholder="Describe what happened..."
                  />
                </div>
              </div>

              <button
                onClick={() => deleteEvent(event.id)}
                className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Delete event"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {events.filter(e => e.date && e.description).length > 0 && (
        <div className="bg-gray-50 dark:bg-dark-bg rounded-xl p-6">
          <h3 className="font-bold text-gray-800 dark:text-white mb-3">Timeline Summary</h3>
          <div className="text-sm text-gray-600 dark:text-dark-text-secondary whitespace-pre-wrap">
            {exportTimeline()}
          </div>
        </div>
      )}

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex gap-2">
          <div className="text-blue-600 dark:text-blue-400 mt-0.5">ℹ️</div>
          <div className="text-sm text-blue-800 dark:text-blue-300">
            <p className="font-medium mb-1">Timeline Best Practices:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Document events chronologically as they occurred</li>
              <li>Include specific dates and times when possible</li>
              <li>Note any witnesses, photos taken, or evidence collected</li>
              <li>Record all communication attempts and responses</li>
              <li>This timeline can be included in your advocacy emails</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
