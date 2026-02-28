import { useState, createContext, useContext, useEffect } from "react";

// ── DATA ─────────────────────────────────────────────────────────────────────
const EVENTS = [
  { id: 1, title: "Community Yoga Session", type: "Fitness", date: "2025-08-20", location: "Bangalore", host: "Yoga with Anu", description: "Join us for a peaceful yoga session in Cubbon Park." },
  { id: 2, title: "Beginner Guitar Workshop", type: "Music", date: "2025-08-22", location: "Mumbai", host: "Strings Academy", description: "Learn the basics of guitar playing with hands-on guidance." },
  { id: 3, title: "Startup Networking Meetup", type: "Meetup", date: "2025-08-25", location: "Delhi", host: "Delhi Entrepreneurs Club", description: "Meet fellow entrepreneurs, pitch ideas, and network." },
  { id: 4, title: "Digital Marketing Seminar", type: "Workshop", date: "2025-08-28", location: "Hyderabad", host: "Marketing Gurus", description: "Learn the latest trends and strategies in digital marketing." },
  { id: 5, title: "Weekend Trek to Nandi Hills", type: "Sports", date: "2025-08-30", location: "Bangalore", host: "Adventure Trails", description: "An early morning trek to Nandi Hills followed by breakfast." },
  { id: 6, title: "Art & Craft for Kids", type: "Workshop", date: "2025-09-01", location: "Pune", host: "Creative Hands", description: "Fun and educational art activities for children aged 6–12." },
  { id: 7, title: "City Photography Walk", type: "Meetup", date: "2025-09-03", location: "Chennai", host: "Lens Lovers Club", description: "Explore the city while improving your photography skills." },
  { id: 8, title: "Cooking Masterclass: Italian Cuisine", type: "Workshop", date: "2025-09-05", location: "Kolkata", host: "Chef Maria", description: "Learn to cook authentic Italian dishes from scratch." },
  { id: 9, title: "Live Jazz Night", type: "Music", date: "2025-09-07", location: "Goa", host: "Goa Jazz Club", description: "An evening of live jazz performances by local musicians." },
  { id: 10, title: "Community Beach Cleanup", type: "Social", date: "2025-09-10", location: "Mumbai", host: "Eco Warriors", description: "Join us in cleaning up Juhu Beach and making a difference." },
  { id: 11, title: "Stand-up Comedy Night", type: "Entertainment", date: "2025-09-12", location: "Bangalore", host: "Laugh Out Loud", description: "A night full of laughter with top stand-up comedians." },
  { id: 12, title: "Chess Tournament", type: "Sports", date: "2025-09-14", location: "Delhi", host: "Delhi Chess Club", description: "Compete with fellow chess enthusiasts for exciting prizes." },
  { id: 13, title: "Mindfulness Meditation Retreat", type: "Fitness", date: "2025-09-16", location: "Rishikesh", host: "Peaceful Minds", description: "A weekend retreat to practice mindfulness and meditation." },
  { id: 14, title: "Blockchain for Beginners", type: "Workshop", date: "2025-09-18", location: "Pune", host: "TechLearn Hub", description: "Understand the basics of blockchain and its applications." },
  { id: 15, title: "Bird Watching Morning", type: "Meetup", date: "2025-09-20", location: "Jaipur", host: "Nature Explorers", description: "Join us to spot and learn about local bird species." },
  { id: 16, title: "Poetry Open Mic", type: "Entertainment", date: "2025-09-22", location: "Chandigarh", host: "Words & Verses", description: "An evening for poets to share their work with the community." },
  { id: 17, title: "DIY Home Gardening Workshop", type: "Workshop", date: "2025-09-24", location: "Ahmedabad", host: "Green Thumbs", description: "Learn how to start and maintain your own home garden." },
  { id: 18, title: "Marathon for Charity", type: "Sports", date: "2025-09-26", location: "Kochi", host: "Run for Cause", description: "Participate in a marathon to raise funds for charity." },
  { id: 19, title: "Language Exchange Meetup", type: "Meetup", date: "2025-09-28", location: "Bangalore", host: "Global Friends", description: "Practice languages and make friends from different cultures." },
  { id: 20, title: "Film Screening: Indie Shorts", type: "Entertainment", date: "2025-09-30", location: "Mumbai", host: "Cinephiles Club", description: "An evening of short films by independent filmmakers." },
];

const TYPE_EMOJI = { Fitness: "🧘", Music: "🎵", Meetup: "🤝", Workshop: "🛠️", Sports: "⚽", Social: "🌿", Entertainment: "🎭" };
const TYPE_COLORS = {
  Fitness: "#d4f5e9",
  Music: "#fde8f5",
  Meetup: "#e8f0fd",
  Workshop: "#fdf5e8",
  Sports: "#e8fde8",
  Social: "#d4f5d4",
  Entertainment: "#fde8e8",
};
const TYPE_TEXT = {
  Fitness: "#1a6b4a",
  Music: "#8b1a6b",
  Meetup: "#1a3d8b",
  Workshop: "#8b5a1a",
  Sports: "#1a6b1a",
  Social: "#2a7a2a",
  Entertainment: "#8b1a1a",
};

const LOCATIONS = ["All", ...Array.from(new Set(EVENTS.map((e) => e.location))).sort()];
const TYPES = ["All", ...Array.from(new Set(EVENTS.map((e) => e.type))).sort()];

// ── CONTEXT ───────────────────────────────────────────────────────────────────
const AppCtx = createContext(null);
function useApp() { return useContext(AppCtx); }

// ── FORMAT DATE ───────────────────────────────────────────────────────────────
function fmtDate(d) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}
function fmtDay(d) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short" });
}
function fmtDateShort(d) {
  const dt = new Date(d + "T00:00:00");
  return { day: dt.getDate(), month: dt.toLocaleString("en-IN", { month: "short" }), weekday: dt.toLocaleString("en-IN", { weekday: "short" }) };
}

// ── STYLES ────────────────────────────────────────────────────────────────────
const globalStyles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --cream: #faf7f2;
  --warm-white: #fffef9;
  --ink: #1a1410;
  --ink-light: #5a4e42;
  --ink-faint: #9a8e82;
  --rust: #c4541a;
  --rust-light: #f5d5c0;
  --paper: #f3ede3;
  --border: #e0d8cc;
  --shadow: rgba(26,20,16,0.08);
  --shadow-md: rgba(26,20,16,0.15);
}

body { background: var(--cream); font-family: 'DM Sans', sans-serif; color: var(--ink); min-height: 100vh; }

::selection { background: var(--rust); color: white; }

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--cream); }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

/* Header */
.site-header {
  background: var(--warm-white);
  border-bottom: 2px solid var(--ink);
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2.5rem;
  height: 64px;
}

.logo {
  font-family: 'Playfair Display', serif;
  font-weight: 900;
  font-size: 1.5rem;
  letter-spacing: -0.5px;
  color: var(--ink);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}
.logo span { color: var(--rust); font-style: italic; }

.nav-links {
  display: flex;
  gap: 0.25rem;
  list-style: none;
}
.nav-btn {
  background: none;
  border: none;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--ink-light);
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.15s;
  letter-spacing: 0.02em;
}
.nav-btn:hover, .nav-btn.active { background: var(--paper); color: var(--ink); }
.nav-btn.cta {
  background: var(--ink);
  color: white;
  margin-left: 0.5rem;
}
.nav-btn.cta:hover { background: var(--rust); }

/* Hero */
.hero {
  background: var(--ink);
  color: white;
  padding: 4rem 2.5rem 3rem;
  position: relative;
  overflow: hidden;
}
.hero::before {
  content: 'EVENTS';
  position: absolute;
  right: -2rem;
  top: 50%;
  transform: translateY(-50%);
  font-family: 'Playfair Display', serif;
  font-size: 12rem;
  font-weight: 900;
  color: rgba(255,255,255,0.04);
  letter-spacing: -0.05em;
  line-height: 1;
  pointer-events: none;
  white-space: nowrap;
}
.hero-eyebrow {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--rust-light);
  margin-bottom: 0.75rem;
}
.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  line-height: 1.05;
  max-width: 600px;
}
.hero-title em { color: #c4a87a; font-style: italic; }
.hero-sub {
  margin-top: 1rem;
  color: rgba(255,255,255,0.6);
  font-size: 1rem;
  max-width: 500px;
  line-height: 1.6;
}
.hero-stats {
  display: flex;
  gap: 3rem;
  margin-top: 2.5rem;
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 2rem;
}
.stat-num {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 700;
  color: white;
}
.stat-label {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.5);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-top: 0.2rem;
}

/* Filter bar */
.filter-bar {
  background: var(--warm-white);
  border-bottom: 1px solid var(--border);
  padding: 1rem 2.5rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}
.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.filter-label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-faint);
}
.filter-select {
  border: 1.5px solid var(--border);
  background: var(--warm-white);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.875rem;
  color: var(--ink);
  padding: 0.4rem 2rem 0.4rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235a4e42' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.6rem center;
  transition: border-color 0.15s;
}
.filter-select:focus { outline: none; border-color: var(--rust); }
.search-input {
  border: 1.5px solid var(--border);
  background: var(--warm-white);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.875rem;
  color: var(--ink);
  padding: 0.4rem 0.75rem;
  border-radius: 4px;
  width: 220px;
  transition: border-color 0.15s;
}
.search-input::placeholder { color: var(--ink-faint); }
.search-input:focus { outline: none; border-color: var(--rust); }
.filter-count {
  margin-left: auto;
  font-size: 0.8rem;
  color: var(--ink-faint);
}

/* Main layout */
.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 2.5rem;
}

/* Events grid */
.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

/* Event Card */
.event-card {
  background: var(--warm-white);
  border: 1.5px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  animation: fadeUp 0.4s ease both;
  display: flex;
  flex-direction: column;
}
.event-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px var(--shadow-md);
  border-color: var(--rust);
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.25rem 1.25rem 0;
}
.date-block {
  background: var(--ink);
  color: white;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  text-align: center;
  min-width: 52px;
}
.date-block .day-num {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
}
.date-block .month-label {
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.7;
  margin-top: 0.15rem;
}
.type-badge {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.3rem 0.7rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
.card-body { padding: 1rem 1.25rem; flex: 1; }
.card-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1.25;
  color: var(--ink);
  margin-bottom: 0.5rem;
}
.card-desc {
  font-size: 0.85rem;
  color: var(--ink-light);
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-footer {
  padding: 0.75rem 1.25rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--paper);
  margin-top: 0.75rem;
}
.card-meta {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.meta-row {
  font-size: 0.78rem;
  color: var(--ink-light);
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
.rsvp-btn {
  background: var(--ink);
  color: white;
  border: none;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  letter-spacing: 0.03em;
  transition: background 0.15s;
  white-space: nowrap;
}
.rsvp-btn:hover { background: var(--rust); }
.rsvp-btn.joined { background: #2a7a2a; }

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 3rem;
}
.page-btn {
  background: none;
  border: 1.5px solid var(--border);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.875rem;
  color: var(--ink-light);
  width: 38px;
  height: 38px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.page-btn:hover { border-color: var(--ink); color: var(--ink); }
.page-btn.active { background: var(--ink); color: white; border-color: var(--ink); }
.page-btn:disabled { opacity: 0.35; cursor: default; }

/* Modal overlay */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(26,20,16,0.6);
  backdrop-filter: blur(4px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: fadeIn 0.2s ease;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

/* Event Detail Modal */
.detail-modal {
  background: var(--warm-white);
  border-radius: 12px;
  max-width: 580px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.25s ease;
  position: relative;
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-top-banner {
  height: 180px;
  position: relative;
  display: flex;
  align-items: flex-end;
  padding: 1.5rem;
  overflow: hidden;
}
.modal-bg-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Playfair Display', serif;
  font-size: 8rem;
  font-weight: 900;
  letter-spacing: -0.05em;
  opacity: 0.12;
  white-space: nowrap;
  color: white;
  pointer-events: none;
}
.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255,255,255,0.2);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}
.modal-close:hover { background: rgba(255,255,255,0.35); }

.modal-body { padding: 2rem; }
.modal-type { margin-bottom: 0.75rem; }
.modal-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  font-weight: 900;
  line-height: 1.2;
  margin-bottom: 1rem;
}
.modal-divider {
  height: 2px;
  background: var(--border);
  margin: 1.25rem 0;
  position: relative;
}
.modal-divider::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 60px;
  background: var(--rust);
}
.modal-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.info-item { }
.info-label {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 0.25rem;
}
.info-value {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--ink);
}
.modal-desc {
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--ink-light);
  margin-bottom: 1.5rem;
}
.modal-rsvp-btn {
  width: 100%;
  background: var(--ink);
  color: white;
  border: none;
  font-family: 'DM Sans', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  padding: 1rem;
  border-radius: 6px;
  cursor: pointer;
  letter-spacing: 0.04em;
  transition: background 0.2s, transform 0.1s;
}
.modal-rsvp-btn:hover { background: var(--rust); }
.modal-rsvp-btn:active { transform: scale(0.99); }
.modal-rsvp-btn.joined { background: #2a7a2a; cursor: default; }

/* Confirmation modal */
.confirm-modal {
  background: var(--warm-white);
  border-radius: 12px;
  max-width: 420px;
  width: 100%;
  text-align: center;
  padding: 3rem 2.5rem;
  animation: slideUp 0.25s ease;
}
.confirm-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  display: block;
  animation: pop 0.4s cubic-bezier(0.175,0.885,0.32,1.275);
}
@keyframes pop {
  from { transform: scale(0); }
  to { transform: scale(1); }
}
.confirm-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.75rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
}
.confirm-event {
  font-size: 1rem;
  color: var(--rust);
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.confirm-msg {
  color: var(--ink-light);
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}
.confirm-close-btn {
  background: var(--ink);
  color: white;
  border: none;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.75rem 2rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.15s;
}
.confirm-close-btn:hover { background: var(--rust); }

/* Create Event Form */
.create-page {
  max-width: 680px;
  margin: 0 auto;
  padding: 2.5rem;
}
.create-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
}
.create-sub { color: var(--ink-light); margin-bottom: 2.5rem; }
.form-group { margin-bottom: 1.5rem; }
.form-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 0.5rem;
}
.form-input, .form-textarea, .form-select-full {
  width: 100%;
  border: 1.5px solid var(--border);
  background: var(--warm-white);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem;
  color: var(--ink);
  padding: 0.75rem 1rem;
  border-radius: 6px;
  transition: border-color 0.15s;
}
.form-input:focus, .form-textarea:focus, .form-select-full:focus {
  outline: none;
  border-color: var(--rust);
}
.form-input.error, .form-textarea.error, .form-select-full.error {
  border-color: #c43030;
}
.form-textarea { resize: vertical; min-height: 100px; }
.form-select-full {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235a4e42' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  cursor: pointer;
}
.form-error {
  font-size: 0.78rem;
  color: #c43030;
  margin-top: 0.35rem;
}
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
.submit-btn {
  background: var(--ink);
  color: white;
  border: none;
  font-family: 'DM Sans', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  padding: 1rem 2.5rem;
  border-radius: 6px;
  cursor: pointer;
  letter-spacing: 0.04em;
  transition: background 0.15s;
}
.submit-btn:hover { background: var(--rust); }

/* My Events page */
.my-events-page {
  padding: 2.5rem;
  max-width: 900px;
  margin: 0 auto;
}
.my-events-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
}
.my-events-sub { color: var(--ink-light); margin-bottom: 2.5rem; }
.empty-state {
  text-align: center;
  padding: 5rem 2rem;
  color: var(--ink-faint);
}
.empty-icon { font-size: 4rem; margin-bottom: 1rem; }
.empty-msg { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--ink-light); }

.my-event-row {
  background: var(--warm-white);
  border: 1.5px solid var(--border);
  border-radius: 8px;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 1rem;
  transition: border-color 0.15s;
}
.my-event-row:hover { border-color: var(--rust); }
.my-date-block {
  background: var(--ink);
  color: white;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  text-align: center;
  min-width: 52px;
  flex-shrink: 0;
}
.my-event-info { flex: 1; }
.my-event-title {
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}
.my-event-meta { font-size: 0.82rem; color: var(--ink-light); }
.cancel-btn {
  background: none;
  border: 1.5px solid var(--border);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.8rem;
  color: var(--ink-light);
  padding: 0.4rem 0.9rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s;
}
.cancel-btn:hover { border-color: #c43030; color: #c43030; }

/* Toast */
.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: var(--ink);
  color: white;
  padding: 0.875rem 1.5rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  z-index: 9999;
  animation: toastIn 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
@keyframes toastIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive */
@media (max-width: 768px) {
  .site-header { padding: 0 1rem; }
  .nav-btn:not(.cta) { display: none; }
  .hero { padding: 2.5rem 1rem 2rem; }
  .hero::before { display: none; }
  .filter-bar { padding: 0.75rem 1rem; }
  .main-content { padding: 1.5rem 1rem; }
  .events-grid { grid-template-columns: 1fr; }
  .modal-info-grid { grid-template-columns: 1fr; }
  .form-row { grid-template-columns: 1fr; }
  .create-page, .my-events-page { padding: 1.5rem 1rem; }
  .hero-stats { gap: 1.5rem; }
}
`;

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home"); // home | create | my-events
  const [joined, setJoined] = useState({}); // id -> bool
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [confirmEvent, setConfirmEvent] = useState(null);
  const [toast, setToast] = useState(null);
  const [createdEvents, setCreatedEvents] = useState([]);

  const allEvents = [...EVENTS, ...createdEvents];

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function handleRSVP(e, eventId) {
    e?.stopPropagation();
    const ev = allEvents.find((x) => x.id === eventId);
    if (joined[eventId]) {
      setJoined((p) => ({ ...p, [eventId]: false }));
      showToast("❌ RSVP cancelled");
    } else {
      setJoined((p) => ({ ...p, [eventId]: true }));
      setSelectedEvent(null);
      setConfirmEvent(ev);
    }
  }

  const ctx = { page, setPage, joined, handleRSVP, selectedEvent, setSelectedEvent, confirmEvent, setConfirmEvent, allEvents, createdEvents, setCreatedEvents, showToast };

  return (
    <AppCtx.Provider value={ctx}>
      <style>{globalStyles}</style>
      <Header />
      {page === "home" && <HomePage />}
      {page === "create" && <CreatePage />}
      {page === "my-events" && <MyEventsPage />}
      {selectedEvent && <DetailModal />}
      {confirmEvent && <ConfirmModal />}
      {toast && <div className="toast">✓ {toast}</div>}
    </AppCtx.Provider>
  );
}

// ── HEADER ────────────────────────────────────────────────────────────────────
function Header() {
  const { page, setPage, joined } = useApp();
  const joinedCount = Object.values(joined).filter(Boolean).length;
  return (
    <header className="site-header">
      <div className="logo" onClick={() => setPage("home")}>
        gather<span>.</span>
      </div>
      <nav>
        <ul className="nav-links">
          <li><button className={`nav-btn${page === "home" ? " active" : ""}`} onClick={() => setPage("home")}>Explore</button></li>
          <li>
            <button className={`nav-btn${page === "my-events" ? " active" : ""}`} onClick={() => setPage("my-events")}>
              My Events {joinedCount > 0 && `(${joinedCount})`}
            </button>
          </li>
          <li><button className={`nav-btn cta${page === "create" ? " active" : ""}`} onClick={() => setPage("create")}>+ Host Event</button></li>
        </ul>
      </nav>
    </header>
  );
}

// ── HOME PAGE ─────────────────────────────────────────────────────────────────
const PER_PAGE = 9;

function HomePage() {
  const { allEvents, joined, handleRSVP, setSelectedEvent } = useApp();
  const [typeFilter, setTypeFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = allEvents.filter((e) => {
    if (typeFilter !== "All" && e.type !== typeFilter) return false;
    if (locationFilter !== "All" && e.location !== locationFilter) return false;
    if (dateFilter && e.date !== dateFilter) return false;
    if (search && !e.title.toLowerCase().includes(search.toLowerCase()) && !e.location.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  useEffect(() => { setCurrentPage(1); }, [typeFilter, locationFilter, dateFilter, search]);

  const allLocations = ["All", ...Array.from(new Set(allEvents.map((e) => e.location))).sort()];
  const allTypes = ["All", ...Array.from(new Set(allEvents.map((e) => e.type))).sort()];

  return (
    <>
      <section className="hero">
        <p className="hero-eyebrow">Discover · Connect · Belong</p>
        <h1 className="hero-title">Find <em>local events</em><br />made for you.</h1>
        <p className="hero-sub">From sunrise treks to jazz nights — your community is doing amazing things. Join them.</p>
        <div className="hero-stats">
          <div><div className="stat-num">{allEvents.length}</div><div className="stat-label">Events</div></div>
          <div><div className="stat-num">{allLocations.length - 1}</div><div className="stat-label">Cities</div></div>
          <div><div className="stat-num">{allTypes.length - 1}</div><div className="stat-label">Categories</div></div>
        </div>
      </section>

      <div className="filter-bar">
        <input className="search-input" placeholder="Search events…" value={search} onChange={e => setSearch(e.target.value)} />
        <div className="filter-group">
          <span className="filter-label">Type</span>
          <select className="filter-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            {allTypes.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <span className="filter-label">City</span>
          <select className="filter-select" value={locationFilter} onChange={e => setLocationFilter(e.target.value)}>
            {allLocations.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <span className="filter-label">Date</span>
          <input type="date" className="filter-select" value={dateFilter} onChange={e => setDateFilter(e.target.value)} style={{paddingRight:"0.75rem"}}/>
        </div>
        {dateFilter && <button onClick={() => setDateFilter("")} style={{background:"none",border:"none",cursor:"pointer",color:"var(--rust)",fontSize:"0.8rem",fontWeight:600}}>Clear ✕</button>}
        <span className="filter-count">{filtered.length} event{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      <main className="main-content">
        {paginated.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-msg">No events found</div>
            <p>Try different filters or search terms.</p>
          </div>
        ) : (
          <div className="events-grid">
            {paginated.map((ev, i) => (
              <EventCard key={ev.id} event={ev} delay={i * 50} onClick={() => setSelectedEvent(ev)} onRSVP={handleRSVP} isJoined={!!joined[ev.id]} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button className="page-btn" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} className={`page-btn${p === currentPage ? " active" : ""}`} onClick={() => setCurrentPage(p)}>{p}</button>
            ))}
            <button className="page-btn" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>›</button>
          </div>
        )}
      </main>
    </>
  );
}

// ── EVENT CARD ────────────────────────────────────────────────────────────────
function EventCard({ event, delay, onClick, onRSVP, isJoined }) {
  const { day, month, weekday } = fmtDateShort(event.date);
  const bg = TYPE_COLORS[event.type] || "#f0f0f0";
  const tc = TYPE_TEXT[event.type] || "#333";
  return (
    <article className="event-card" style={{ animationDelay: `${delay}ms` }} onClick={onClick}>
      <div className="card-header">
        <div className="date-block">
          <div className="day-num">{day}</div>
          <div className="month-label">{month}</div>
        </div>
        <div className="type-badge" style={{ background: bg, color: tc }}>
          <span>{TYPE_EMOJI[event.type] || "📌"}</span>
          {event.type}
        </div>
      </div>
      <div className="card-body">
        <h2 className="card-title">{event.title}</h2>
        <p className="card-desc">{event.description}</p>
      </div>
      <div className="card-footer">
        <div className="card-meta">
          <div className="meta-row">📍 {event.location}</div>
          <div className="meta-row">👤 {event.host}</div>
        </div>
        <button className={`rsvp-btn${isJoined ? " joined" : ""}`} onClick={e => { e.stopPropagation(); onRSVP(e, event.id); }}>
          {isJoined ? "✓ Joined" : "RSVP"}
        </button>
      </div>
    </article>
  );
}

// ── DETAIL MODAL ──────────────────────────────────────────────────────────────
function DetailModal() {
  const { selectedEvent: ev, setSelectedEvent, joined, handleRSVP } = useApp();
  const bg = TYPE_COLORS[ev.type] || "#f0f0f0";
  const tc = TYPE_TEXT[ev.type] || "#333";
  const isJoined = !!joined[ev.id];

  return (
    <div className="overlay" onClick={() => setSelectedEvent(null)}>
      <div className="detail-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-top-banner" style={{ background: `linear-gradient(135deg, ${tc} 0%, ${tc}cc 100%)` }}>
          <span className="modal-bg-text">{TYPE_EMOJI[ev.type] || "📌"}</span>
          <button className="modal-close" onClick={() => setSelectedEvent(null)}>✕</button>
        </div>
        <div className="modal-body">
          <div className="modal-type">
            <span className="type-badge" style={{ background: bg, color: tc, display:"inline-flex" }}>
              {TYPE_EMOJI[ev.type]} {ev.type}
            </span>
          </div>
          <h2 className="modal-title">{ev.title}</h2>
          <div className="modal-divider" />
          <div className="modal-info-grid">
            <div className="info-item"><div className="info-label">Date</div><div className="info-value">📅 {fmtDate(ev.date)}</div></div>
            <div className="info-item"><div className="info-label">Day</div><div className="info-value">🗓 {fmtDay(ev.date)}</div></div>
            <div className="info-item"><div className="info-label">Location</div><div className="info-value">📍 {ev.location}</div></div>
            <div className="info-item"><div className="info-label">Host</div><div className="info-value">👤 {ev.host}</div></div>
          </div>
          <p className="modal-desc">{ev.description}</p>
          <button
            className={`modal-rsvp-btn${isJoined ? " joined" : ""}`}
            onClick={() => handleRSVP(null, ev.id)}
            disabled={isJoined}
          >
            {isJoined ? "✓ You're going!" : "Reserve My Spot"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── CONFIRM MODAL ─────────────────────────────────────────────────────────────
function ConfirmModal() {
  const { confirmEvent: ev, setConfirmEvent, setPage } = useApp();
  return (
    <div className="overlay" onClick={() => setConfirmEvent(null)}>
      <div className="confirm-modal" onClick={e => e.stopPropagation()}>
        <span className="confirm-icon">🎉</span>
        <h2 className="confirm-title">You're In!</h2>
        <p className="confirm-event">{ev.title}</p>
        <p className="confirm-msg">
          See you on <strong>{fmtDate(ev.date)}</strong> in <strong>{ev.location}</strong>.<br />
          Your RSVP has been confirmed.
        </p>
        <div style={{display:"flex",gap:"0.75rem",justifyContent:"center"}}>
          <button className="confirm-close-btn" onClick={() => setConfirmEvent(null)}>Continue Exploring</button>
          <button className="confirm-close-btn" style={{background:"var(--rust)"}} onClick={() => { setConfirmEvent(null); setPage("my-events"); }}>View My Events</button>
        </div>
      </div>
    </div>
  );
}

// ── CREATE EVENT PAGE ─────────────────────────────────────────────────────────
function CreatePage() {
  const { setPage, setCreatedEvents, showToast } = useApp();
  const [form, setForm] = useState({ title: "", type: "", date: "", location: "", host: "", description: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.type) e.type = "Please select a type";
    if (!form.date) e.date = "Date is required";
    if (!form.location.trim()) e.location = "Location is required";
    if (!form.host.trim()) e.host = "Host name is required";
    if (!form.description.trim()) e.description = "Description is required";
    return e;
  }

  function handleSubmit() {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const newEvent = { ...form, id: Date.now() };
    setCreatedEvents(p => [...p, newEvent]);
    showToast("Event created!");
    setSubmitted(true);
    setTimeout(() => { setPage("home"); }, 1500);
  }

  const field = (name) => ({
    value: form[name],
    onChange: e => { setForm(p => ({ ...p, [name]: e.target.value })); setErrors(p => ({ ...p, [name]: "" })); },
    className: `form-input${errors[name] ? " error" : ""}`,
  });

  if (submitted) return (
    <div className="create-page" style={{textAlign:"center",paddingTop:"5rem"}}>
      <div style={{fontSize:"4rem",marginBottom:"1rem"}}>✅</div>
      <h2 className="create-title">Event Created!</h2>
      <p className="create-sub">Redirecting to explore…</p>
    </div>
  );

  return (
    <div className="create-page">
      <h1 className="create-title">Host an Event</h1>
      <p className="create-sub">Share something amazing with your community.</p>

      <div className="form-group">
        <label className="form-label">Event Title</label>
        <input {...field("title")} placeholder="e.g. Sunday Morning Yoga" />
        {errors.title && <p className="form-error">{errors.title}</p>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Event Type</label>
          <select {...field("type")} className={`form-select-full${errors.type ? " error" : ""}`}>
            <option value="">Select type…</option>
            {["Fitness","Music","Meetup","Workshop","Sports","Social","Entertainment"].map(t => <option key={t}>{t}</option>)}
          </select>
          {errors.type && <p className="form-error">{errors.type}</p>}
        </div>
        <div className="form-group">
          <label className="form-label">Date</label>
          <input {...field("date")} type="date" />
          {errors.date && <p className="form-error">{errors.date}</p>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Location (City)</label>
          <input {...field("location")} placeholder="e.g. Bangalore" />
          {errors.location && <p className="form-error">{errors.location}</p>}
        </div>
        <div className="form-group">
          <label className="form-label">Host / Organiser</label>
          <input {...field("host")} placeholder="e.g. Your Name or Club" />
          {errors.host && <p className="form-error">{errors.host}</p>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea {...field("description")} className={`form-textarea${errors.description ? " error" : ""}`} placeholder="Tell people what to expect…" />
        {errors.description && <p className="form-error">{errors.description}</p>}
      </div>

      <div style={{display:"flex",gap:"1rem",alignItems:"center"}}>
        <button className="submit-btn" onClick={handleSubmit}>Publish Event</button>
        <button onClick={() => setPage("home")} style={{background:"none",border:"none",cursor:"pointer",color:"var(--ink-light)",fontSize:"0.875rem"}}>Cancel</button>
      </div>
    </div>
  );
}

// ── MY EVENTS PAGE ────────────────────────────────────────────────────────────
function MyEventsPage() {
  const { joined, handleRSVP, allEvents, setPage } = useApp();
  const myEvents = allEvents.filter(e => joined[e.id]);

  return (
    <div className="my-events-page">
      <h1 className="my-events-title">My Events</h1>
      <p className="my-events-sub">All the events you've RSVP'd to.</p>
      {myEvents.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🗓</div>
          <div className="empty-msg">No events yet</div>
          <p style={{marginBottom:"1.5rem"}}>Explore events and RSVP to see them here.</p>
          <button className="submit-btn" onClick={() => setPage("home")}>Explore Events</button>
        </div>
      ) : (
        myEvents.map(ev => {
          const { day, month } = fmtDateShort(ev.date);
          return (
            <div key={ev.id} className="my-event-row">
              <div className="my-date-block">
                <div className="day-num">{day}</div>
                <div className="month-label">{month}</div>
              </div>
              <div className="my-event-info">
                <div className="my-event-title">{ev.title}</div>
                <div className="my-event-meta">📍 {ev.location} · 👤 {ev.host} · <span style={{color:`${TYPE_TEXT[ev.type]||"#333"}`}}>{TYPE_EMOJI[ev.type]} {ev.type}</span></div>
              </div>
              <button className="cancel-btn" onClick={() => handleRSVP(null, ev.id)}>Cancel RSVP</button>
            </div>
          );
        })
      )}
    </div>
  );
}