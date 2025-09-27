import React, { useState, useEffect, useRef } from "react";
import {
  FaPhone,
  FaVideo,
  FaEllipsisV,
  FaPaperPlane,
  FaSmile,
  FaMicrophone,
  FaBars,
} from "react-icons/fa";
import "./style.css";

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const initialContacts = [
  {
    id: 1,
    name: "TalkFlow Bot",
    initials: "TF",
    color: "#27ae60",
    messages: [
      { sender: "other", text: "Morning! Please check the repo.", time: timeNow() },
      { sender: "me", text: "On it, thanks!", time: timeNow() },
    ],
    unread: 0,
  },
  { id: 2, name: "Alice", initials: "AL", color: "#e67e22", messages: [], unread: 0 },
  { id: 3, name: "Bob", initials: "BO", color: "#2980b9", messages: [], unread: 0 },
];

export default function Message() {
  const [contacts, setContacts] = useState(initialContacts);
  const [activeId, setActiveId] = useState(null);
  const [query, setQuery] = useState("");
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [recording, setRecording] = useState(false);
  const [topNotice, setTopNotice] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const chatEndRef = useRef(null);
  const timersRef = useRef([]);

  const activeContact = contacts.find((c) => c.id === activeId);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeContact?.messages.length]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current = [];
    };
  }, []);

  const handleSelectContact = (id) => {
    setActiveId(id);
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
    setSidebarOpen(false);
  };

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  const handleSend = (e) => {
    e?.preventDefault();
    if (!input.trim() || !activeContact) return;

    const now = timeNow();
    setContacts((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, messages: [...c.messages, { sender: "me", text: input.trim(), time: now }] }
          : c
      )
    );
    setInput("");
    setShowEmoji(false);
    scheduleAutoReply(activeId);
  };

  const scheduleAutoReply = (contactId) => {
    const replies = ["Nice 👍", "Okay, will do.", "Sounds good!", "Got it — thanks!", "I'll check and get back."];
    const replyText = replies[Math.floor(Math.random() * replies.length)];
    const delay = 1200 + Math.floor(Math.random() * 2200);

    const timer = setTimeout(() => {
      setContacts((prev) =>
        prev.map((c) => {
          if (c.id !== contactId) return c;
          const updated = {
            ...c,
            messages: [...c.messages, { sender: "other", text: replyText, time: timeNow() }],
          };
          if (contactId !== activeId) updated.unread = (updated.unread || 0) + 1;
          return updated;
        })
      );

      if (contactId === activeId) {
        setTopNotice("New message");
        const t2 = setTimeout(() => setTopNotice(""), 2000);
        timersRef.current.push(t2);
      }
    }, delay);

    timersRef.current.push(timer);
  };

  const emojis = ["😀", "😂", "👍", "🔥", "🙏", "🎉", "😅", "🤝", "👏"];
  const addEmoji = (e) => setInput((prev) => prev + e);

  const handleMic = () => {
    if (!activeContact || recording) return;
    setRecording(true);
    const t = setTimeout(() => {
      setRecording(false);
      const now = timeNow();
      setContacts((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? { ...c, messages: [...c.messages, { sender: "me", text: "[Voice message]", time: now }] }
            : c
        )
      );
      scheduleAutoReply(activeId);
    }, 2000);
    timersRef.current.push(t);
  };

  const handleCall = () => activeContact && alert(`Calling ${activeContact.name}...`);
  const handleVideo = () => activeContact && alert(`Starting video call with ${activeContact.name}...`);
  const handleMore = () => alert("More options (placeholder)");

  const lastMsgSnippet = (c) => {
    const m = c.messages[c.messages.length - 1];
    return m ? (m.sender === "me" ? `You: ${m.text}` : m.text) : "";
  };

  return (
    <div className="chat-app">
      <div className="topbar">
        <button className="menu-btn" aria-label="Toggle contacts" onClick={() => setSidebarOpen((s) => !s)}>
          <FaBars />
        </button>
        <div style={{ marginLeft: 8 }}>TalkFlow</div>
      </div>

      <div className="main-area">
        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="search-wrap">
            <input
              placeholder="Search contacts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {filteredContacts.map((c) => (
            <div
              key={c.id}
              className={`contact-item ${c.id === activeId ? "active" : ""}`}
              onClick={() => handleSelectContact(c.id)}
            >
              <div className="avatar" style={{ backgroundColor: c.color }}>{c.initials}</div>
              <div className="contact-info">
                <div className="contact-name">{c.name}</div>
                <div className="contact-snippet">{lastMsgSnippet(c)}</div>
              </div>
              {c.unread > 0 && <div className="unread-badge">{c.unread}</div>}
            </div>
          ))}
        </aside>

        <section className="chat-section">
          {!activeContact ? (
            <div className="welcome-center">
              <h1 className="welcome-title">👋 Welcome to TalkFlow</h1>
            </div>
          ) : (
            <>
              <div className="chat-header">
                <div className="chat-header-left">
                  <div className="header-avatar" style={{ backgroundColor: activeContact.color }}>
                    {activeContact.initials}
                  </div>
                  <div className="header-meta">
                    <div className="header-name">{activeContact.name}</div>
                    <div className="header-status">Last seen recently</div>
                  </div>
                </div>
                <div className="chat-header-actions">
                  <button onClick={handleCall} aria-label="Call"><FaPhone /></button>
                  <button onClick={handleVideo} aria-label="Video"><FaVideo /></button>
                  <button onClick={handleMore} aria-label="More"><FaEllipsisV /></button>
                </div>
              </div>

              {topNotice && <div className="top-notice">{topNotice}</div>}

              <div className="chat-body">
                {activeContact.messages.map((m, idx) => (
                  <div key={idx} className={`msg-row ${m.sender}`}>
                    <div className="msg-bubble">
                      <div className="msg-text">{m.text}</div>
                      <div className="msg-time">{m.time}</div>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <form className="chat-input" onSubmit={handleSend}>
                <button type="button" onClick={() => setShowEmoji((s) => !s)} aria-label="Emoji">
                  <FaSmile />
                </button>
                {showEmoji && (
                  <div className="emoji-picker" role="dialog" aria-label="Emoji picker">
                    {emojis.map((e) => (
                      <button key={e} type="button" onClick={() => addEmoji(e)}>
                        {e}
                      </button>
                    ))}
                  </div>
                )}
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                />
                <button type="button" onClick={handleMic} aria-label="Record">
                  <FaMicrophone />
                </button>
                <button type="submit" aria-label="Send">
                  <FaPaperPlane />
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
}


















// import React, { useState, useEffect, useRef } from "react";
// import {
//   FaPhone,
//   FaVideo,
//   FaEllipsisV,
//   FaPaperPlane,
//   FaSmile,
//   FaMicrophone,
// } from "react-icons/fa";
// import "./message.css";

// function timeNow() {
//   return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// }

// const initialContacts = [
  
//   {
//     id: 1,
//     name: "TalkFlow Bot",
//     initials: "HN",
//     color: "#27ae60",
//     messages: [
//       { sender: "other", text: "Morning! Please check the repo.", time: timeNow() },
//       { sender: "me", text: "On it, thanks!", time: timeNow() },
//     ],
//     unread: 0,
//   }
  
// ];

// export default function Message() {
//   const [contacts, setContacts] = useState(initialContacts);
//   const [activeId, setActiveId] = useState(initialContacts[0].id);
//   const [query, setQuery] = useState("");
//   const [input, setInput] = useState("");
//   const [showEmoji, setShowEmoji] = useState(false);
//   const [recording, setRecording] = useState(false);
//   const [topNotice, setTopNotice] = useState("");
//   const chatEndRef = useRef(null);
//   const timersRef = useRef([]);

//   const activeContact = contacts.find((c) => c.id === activeId);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [activeContact?.messages.length]);

//   useEffect(() => {
//     return () => timersRef.current.forEach((t) => clearTimeout(t));
//   }, []);

//   const handleSelectContact = (id) => {
//     setActiveId(id);
//     setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
//   };

//   const filteredContacts = contacts.filter((c) =>
//     c.name.toLowerCase().includes(query.trim().toLowerCase())
//   );

//   const handleSend = (e) => {
//     e?.preventDefault();
//     const text = input.trim();
//     if (!text) return;
//     const now = timeNow();
//     setContacts((prev) =>
//       prev.map((c) =>
//         c.id === activeId ? { ...c, messages: [...c.messages, { sender: "me", text, time: now }] } : c
//       )
//     );
//     setInput("");
//     setShowEmoji(false);
//     scheduleAutoReply(activeId);
//   };

//   const scheduleAutoReply = (contactId) => {
//     const replies = ["Nice 👍", "Okay, will do.", "Sounds good!", "Got it — thanks!", "I'll check and get back."];
//     const replyText = replies[Math.floor(Math.random() * replies.length)];
//     const delay = 1200 + Math.floor(Math.random() * 2200);
//     const timer = setTimeout(() => {
//       setContacts((prev) =>
//         prev.map((c) => {
//           if (c.id !== contactId) return c;
//           const updated = { ...c, messages: [...c.messages, { sender: "other", text: replyText, time: timeNow() }] };
//           if (contactId !== activeId) updated.unread = (updated.unread || 0) + 1;
//           return updated;
//         })
//       );
//       if (contactId === activeId) {
//         setTopNotice("New message");
//         const t2 = setTimeout(() => setTopNotice(""), 2000);
//         timersRef.current.push(t2);
//       }
//     }, delay);
//     timersRef.current.push(timer);
//   };

//   const emojis = ["😀", "😂", "👍", "🔥", "🙏", "🎉", "😅", "🤝", "👏"];
//   const addEmoji = (e) => setInput((prev) => prev + e);

//   const handleMic = () => {
//     if (recording) return;
//     setRecording(true);
//     const t = setTimeout(() => {
//       setRecording(false);
//       const now = timeNow();
//       setContacts((prev) =>
//         prev.map((c) =>
//           c.id === activeId ? { ...c, messages: [...c.messages, { sender: "me", text: "[Voice message]", time: now }] } : c
//         )
//       );
//       scheduleAutoReply(activeId);
//     }, 2000);
//     timersRef.current.push(t);
//   };

//   const handleCall = () => alert(`Calling ${activeContact.name}...`);
//   const handleVideo = () => alert(`Starting video call with ${activeContact.name}...`);
//   const handleMore = () => alert("More options (placeholder)");

//   const lastMsgSnippet = (c) => {
//     const m = c.messages[c.messages.length - 1];
//     return m ? (m.sender === "me" ? `You: ${m.text}` : m.text) : "";
//   };

//   return (
//     <div className="chat-app">
//       <div className="topbar">TalkFlow</div>
//       <div className="main-area">
//         {/* LEFT */}
//         <aside className="sidebar">
//           <div className="search-wrap">
//             <input placeholder="Search contacts..." value={query} onChange={(e) => setQuery(e.target.value)} />
//           </div>
//           {filteredContacts.map((c) => (
//             <div key={c.id} className={`contact-item ${c.id === activeId ? "active" : ""}`} onClick={() => handleSelectContact(c.id)}>
//               <div className="avatar" style={{ backgroundColor: c.color }}>{c.initials}</div>
//               <div className="contact-info">
//                 <div className="contact-name">{c.name}</div>
//                 <div className="contact-snippet">{lastMsgSnippet(c)}</div>
//               </div>
//               {c.unread > 0 && <div className="unread-badge">{c.unread}</div>}
//             </div>
//           ))}
//         </aside>

//         {/* MIDDLE */}
//         <section className="chat-section">
//           <div className="chat-header">
//             <div className="chat-header-left">
//               <div className="header-avatar" style={{ backgroundColor: activeContact.color }}>{activeContact.initials}</div>
//               <div className="header-meta">
//                 <div className="header-name">{activeContact.name}</div>
//                 <div className="header-status">Last seen recently</div>
//               </div>
//             </div>
//             <div className="chat-header-actions">
//               <button onClick={handleCall}><FaPhone /></button>
//               <button onClick={handleVideo}><FaVideo /></button>
//               <button onClick={handleMore}><FaEllipsisV /></button>
//             </div>
//           </div>

//           {topNotice && <div className="top-notice">{topNotice}</div>}

//           <div className="chat-body">
//             {activeContact.messages.map((m, idx) => (
//               <div key={idx} className={`msg-row ${m.sender}`}>
//                 <div className="msg-bubble">
//                   <div className="msg-text">{m.text}</div>
//                   <div className="msg-time">{m.time}</div>
//                 </div>
//               </div>
//             ))}
//             <div ref={chatEndRef} />
//           </div>

//           <form className="chat-input" onSubmit={handleSend}>
//             <button type="button" onClick={() => setShowEmoji(!showEmoji)}><FaSmile /></button>
//             {showEmoji && <div className="emoji-picker">{emojis.map((e) => <button key={e} type="button" onClick={() => addEmoji(e)}>{e}</button>)}</div>}
//             <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." />
//             <button type="button" onClick={handleMic}><FaMicrophone /></button>
//             <button type="submit"><FaPaperPlane /></button>
//           </form>
//         </section>

//         {/* RIGHT */}
//         <aside className="rightbar">
//           <h3>Contacts Info</h3>
//           <ul>
//             <li>Name: {activeContact.name}</li>
//             <li>Initials: {activeContact.initials}</li>
//           </ul>
//         </aside>
//       </div>
//     </div>
//   );
// }
