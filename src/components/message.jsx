// src/components/Message.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  FaPhone,
  FaVideo,
  FaEllipsisV,
  FaPaperPlane,
  FaSmile,
  FaMicrophone,
} 
from "react-icons/fa";
import "./message.css";

const initialContacts = [
  {
    id: 1,
    name: "Akanksha Sinha",
    initials: "AS",
    color: "#f39c12",
    messages: [
      { sender: "other", text: "Hi! Are you free to work on TalkFlow?", time: timeNow() },
    ],
    unread: 0,
  },
  {
    id: 2,
    name: "Harshit Nagar",
    initials: "HN",
    color: "#27ae60",
    messages: [
      { sender: "other", text: "Morning! Please check the repo.", time: timeNow() },
      { sender: "me", text: "On it, thanks!", time: timeNow() },
    ],
    unread: 0,
  },
  {
    id: 3,
    name: "Kirti Yadav",
    initials: "KY",
    color: "#8e44ad",
    messages: [{ sender: "other", text: "Let's meet at 6 PM.", time: timeNow() }],
    unread: 0,
  },
];

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function Message() {
  const [contacts, setContacts] = useState(initialContacts);
  const [activeId, setActiveId] = useState(initialContacts[0].id);
  const [query, setQuery] = useState("");
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [recording, setRecording] = useState(false);
  const [topNotice, setTopNotice] = useState("");
  const chatEndRef = useRef(null);
  const timersRef = useRef([]);

  const activeContact = contacts.find((c) => c.id === activeId);

  // Scroll to bottom when active contact messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeContact?.messages.length]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  // Select contact: clear unread
  const handleSelectContact = (id) => {
    setActiveId(id);
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  };

  // Basic search
  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  // Send text message
  const handleSend = (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text) return;
    const now = timeNow();
    setContacts((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, messages: [...c.messages, { sender: "me", text, time: now }] }
          : c
      )
    );
    setInput("");
    setShowEmoji(false);
    scheduleAutoReply(activeId);
  };

  // Schedule a simulated reply for the contact (and mark unread if not active)
  const scheduleAutoReply = (contactId) => {
    const replies = [
      "Nice 👍",
      "Okay, will do.",
      "Sounds good!",
      "Got it — thanks!",
      "I'll check and get back.",
    ];
    const replyText = replies[Math.floor(Math.random() * replies.length)];
    const delay = 1200 + Math.floor(Math.random() * 2200); // 1200-3400ms
    const timer = setTimeout(() => {
      setContacts((prev) =>
        prev.map((c) => {
          if (c.id !== contactId) return c;
          const updated = {
            ...c,
            messages: [...c.messages, { sender: "other", text: replyText, time: timeNow() }],
          };
          // If recipient is not currently active, bump unread
          if (contactId !== activeId) updated.unread = (updated.unread || 0) + 1;
          return updated;
        })
      );
      // Show small top notice if reply is for active contact
      if (contactId === activeId) {
        setTopNotice("New message");
        const t2 = setTimeout(() => setTopNotice(""), 2000);
        timersRef.current.push(t2);
      }
    }, delay);
    timersRef.current.push(timer);
  };

  // Emoji handler
  const emojis = ["😀", "😂", "👍", "🔥", "🙏", "🎉", "😅", "🤝", "👏"];
  const addEmoji = (e) => {
    setInput((prev) => prev + e);
    setShowEmoji(false);
  };

  // Mic / voice message simulation
  const handleMic = () => {
    if (recording) {
      // already recording; ignore
      return;
    }
    setRecording(true);
    // simulate recording for 2s and then send a voice message
    const t = setTimeout(() => {
      setRecording(false);
      const now = timeNow();
      setContacts((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? {
                ...c,
                messages: [...c.messages, { sender: "me", text: "[Voice message]", time: now, type: "voice" }],
              }
            : c
        )
      );
      // schedule a reply
      scheduleAutoReply(activeId);
    }, 2000);
    timersRef.current.push(t);
  };

  // More options / call / video simple handlers
  const handleCall = () => alert(`Calling ${activeContact.name}...`);
  const handleVideo = () => alert(`Starting video call with ${activeContact.name}...`);
  const handleMore = () => alert("More options (placeholder)");

  // Helper to get last message snippet
  const lastMsgSnippet = (c) => {
    const m = c.messages[c.messages.length - 1];
    return m ? (m.sender === "me" ? `You: ${m.text}` : m.text) : "";
  };

  return (
    <div className="chat-app">
      {/* Top Navigation */}
      <div className="topbar">
        <div className="app-name">TalkFlow</div>
      </div>

      <div className="main-area">
        {/* LEFT: Contacts */}
        <aside className="sidebar">
          <div className="search-wrap">
            <input
              className="search-input"
              placeholder="Search contacts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="contacts-list">
            {filteredContacts.map((c) => (
              <div
                key={c.id}
                className={`contact-item ${c.id === activeId ? "active" : ""}`}
                onClick={() => handleSelectContact(c.id)}
              >
                <div className="avatar" style={{ backgroundColor: c.color }}>
                  {c.initials}
                </div>
                <div className="contact-info">
                  <div className="contact-name">{c.name}</div>
                  <div className="contact-snippet">{lastMsgSnippet(c)}</div>
                </div>
                <div className="contact-right">
                  {c.unread > 0 && <span className="unread-badge">{c.unread}</span>}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* MIDDLE: Chat */}
        <section className="chat-section">
          <header className="chat-header">
            <div className="chat-header-left">
              <div className="avatar header-avatar" style={{ backgroundColor: activeContact.color }}>
                {activeContact.initials}
              </div>
              <div className="header-meta">
                <div className="header-name">{activeContact.name}</div>
                <div className="header-status">Last seen recently</div>
              </div>
            </div>

            <div className="chat-header-actions">
              <button className="icon-btn" title="Call" onClick={handleCall}>
                <FaPhone />
              </button>
              <button className="icon-btn" title="Video" onClick={handleVideo}>
                <FaVideo />
              </button>
              <button className="icon-btn" title="More" onClick={handleMore}>
                <FaEllipsisV />
              </button>
            </div>
          </header>

          {/* optional top notice */}
          {topNotice && <div className="top-notice">{topNotice}</div>}

          <div className="chat-body">
            {activeContact.messages.map((m, idx) => (
              <div key={idx} className={`msg-row ${m.sender === "me" ? "me" : "other"}`}>
                <div className={`msg-bubble ${m.type === "voice" ? "voice" : ""}`}>
                  <div className="msg-text">{m.text}</div>
                  <div className="msg-time">{m.time}</div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input bar */}
          <form className="chat-input" onSubmit={handleSend}>
            <button
              type="button"
              className="icon-btn emoji-btn"
              onClick={() => setShowEmoji((s) => !s)}
              title="Emoji"
            >
              <FaSmile />
            </button>

            {showEmoji && (
              <div className="emoji-picker">
                {emojis.map((e) => (
                  <button
                    type="button"
                    key={e}
                    className="emoji"
                    onClick={() => addEmoji(e)}
                    aria-label={`emoji-${e}`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}

            <input
              type="text"
              className="input-field"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  handleSend(e);
                }
              }}
            />

            <button
              type="button"
              className={`icon-btn mic-btn ${recording ? "recording" : ""}`}
              onClick={handleMic}
              title={recording ? "Recording..." : "Voice message"}
            >
              <FaMicrophone />
            </button>

            <button
              type="submit"
              className={`send-btn ${input.trim() ? "active" : ""}`}
              title="Send"
            >
              <FaPaperPlane />
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
