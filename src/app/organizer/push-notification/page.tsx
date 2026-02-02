"use client"
import React, { useState } from 'react';
import { Send, Sparkles, Users, History, Bell, Search, Info } from 'lucide-react';

const Notifications: React.FC = () => {
  const [message, setMessage] = useState('');
  const [targetEvent, setTargetEvent] = useState('all');

  const history = [
    { title: 'Promo Alert', text: 'Early bird ends in 2 hours!', sentTo: '850 users', time: 'Yesterday' },
    { title: 'Venue Change', text: 'Important: Venue updated for Tech Meetup.', sentTo: '120 users', time: '3 days ago' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Campaign Center</h2>
          <p className="text-gray-400 text-sm italic">Direct push alerts to your hive community</p>
        </div>
        <div className="bg-amber-100 px-4 py-2 rounded-xl flex items-center gap-2">
          <Users className="w-4 h-4 text-amber-700" />
          <span className="text-xs font-bold text-amber-800">3,450 Registered Reach</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-50 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" />
                New Push Campaign
              </h3>
              <button className="text-amber-600 text-xs font-bold flex items-center gap-1 hover:bg-amber-50 px-3 py-1.5 rounded-lg">
                <Sparkles size={14} className="fill-amber-600" />
                AI Content Suggestions
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Target Audience</label>
                <select 
                  value={targetEvent}
                  onChange={(e) => setTargetEvent(e.target.value)}
                  className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="all">All Registered Users</option>
                  <option value="1">Sun & Bass Festival Attendees</option>
                  <option value="2">AI Builders Meetup Members</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message Body</label>
                <textarea 
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell your attendees something important..."
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all resize-none"
                ></textarea>
                <p className="text-right text-[10px] text-gray-400 mt-1 uppercase font-bold">{message.length} / 160 Characters</p>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <button className="flex-1 py-4 bg-amber-400 text-black font-black rounded-2xl shadow-xl shadow-amber-100 hover:bg-amber-500 transition-all flex items-center justify-center gap-3">
                <Send className="w-5 h-5" />
                Launch Notification
              </button>
              <button className="p-4 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 transition-colors">
                <History className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0">
               <Info className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <h4 className="font-bold text-amber-900 text-sm">Best Practices</h4>
              <p className="text-sm text-amber-800/70">Avoid sending more than 2 notifications per week to prevent user fatigue and opt-outs. Use AI to personalize the tone based on your event category.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <History className="w-4 h-4 text-gray-400" />
              Recent Alerts
            </h4>
            <div className="space-y-4">
              {history.map((h, i) => (
                <div key={i} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs font-bold text-amber-600 uppercase">{h.title}</span>
                    <span className="text-[10px] text-gray-400">{h.time}</span>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2">{h.text}</p>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                    <Users size={10} />
                    <span>Sent to {h.sentTo}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-sm font-bold text-gray-400 hover:text-amber-500 transition-colors py-2">View Full Logs</button>
          </div>

          <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-8 rounded-3xl text-white shadow-xl">
             <h4 className="text-xl font-bold mb-2">Campaign Pro</h4>
             <p className="text-white/80 text-sm mb-6">Schedule notifications in advance and track open rates for better engagement.</p>
             <button className="bg-black text-white px-6 py-2.5 rounded-xl text-sm font-bold">Unlock Scheduling</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
