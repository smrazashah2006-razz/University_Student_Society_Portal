/* ============================================================
   University Society Portal  (simple version)

   1. DATA      - societies and events (edit these lists freely)
   2. STORAGE   - save and read things in the browser (localStorage)
   3. SHOW      - functions that draw each section on the page
   4. ACTIONS   - join, leave, register for an event
   ============================================================ */


/* ---------- 1. DATA ---------- */

const societies = [
  { id: "cs", name: "Computer Science Society", day: "Mondays, 4 PM",
    desc: "Coding contests, hackathons and tech talks for curious programmers.",
    activities: ["Weekly coding practice", "Hackathons", "Talks by alumni"] },

  { id: "debate", name: "Debating Society", day: "Tuesdays, 3 PM",
    desc: "Practise public speaking and argue both sides of big questions.",
    activities: ["Practice debates", "Public speaking drills", "Inter-university contests"] },

  { id: "drama", name: "Drama Society", day: "Wednesdays, 5 PM",
    desc: "Rehearse and perform plays, from comedy sketches to full stage shows.",
    activities: ["Script reading", "Acting workshops", "Stage performances"] },

  { id: "sports", name: "Sports Society", day: "Thursdays, 4 PM",
    desc: "Cricket, football and badminton practice, plus matches between departments.",
    activities: ["Team practice", "Fitness sessions", "Department matches"] },

  { id: "photo", name: "Photography Society", day: "Fridays, 2 PM",
    desc: "Photo walks, editing workshops and an end-of-semester exhibition.",
    activities: ["Photo walks", "Editing workshops", "Semester exhibition"] }
];

const events = [
  { id: "e1",  societyId: "cs",     title: "24-Hour Hackathon",        date: "Nov 28, 2026", place: "Computer Lab 2" },
  { id: "e2",  societyId: "cs",     title: "Intro to Web Development", date: "Dec 5, 2026",  place: "Room B-12" },
  { id: "e3",  societyId: "debate", title: "Inter-Department Debate",  date: "Nov 25, 2026", place: "Main Auditorium" },
  { id: "e4",  societyId: "debate", title: "Public Speaking Workshop", date: "Dec 2, 2026",  place: "Room A-04" },
  { id: "e5",  societyId: "drama",  title: "Open Auditions",           date: "Nov 23, 2026", place: "Student Theatre" },
  { id: "e6",  societyId: "drama",  title: "Winter Play Night",        date: "Dec 12, 2026", place: "Main Auditorium" },
  { id: "e7",  societyId: "sports", title: "Friendly Cricket Match",   date: "Nov 24, 2026", place: "University Ground" },
  { id: "e8",  societyId: "sports", title: "Badminton Tournament",     date: "Dec 9, 2026",  place: "Sports Complex" },
  { id: "e9",  societyId: "photo",  title: "Campus Photo Walk",        date: "Nov 27, 2026", place: "Main Gate" },
  { id: "e10", societyId: "photo",  title: "Editing Workshop",         date: "Dec 4, 2026",  place: "Media Room" }
];


/* ---------- 2. STORAGE ---------- */

// The student's enrolment: an object, or null if not enrolled
function getEnrolment() {
  return JSON.parse(localStorage.getItem("enrolment"));
}

// The ids of events the student registered for: a list like ["e1", "e2"]
function getRegistrations() {
  return JSON.parse(localStorage.getItem("eventRegs")) || [];
}

function findSociety(id) {
  return societies.find(function (s) { return s.id === id; });
}


/* ---------- 3. SHOW (draw each section) ---------- */

// Section 1: Societies
function showSocieties() {
  const enrolment = getEnrolment();
  let html = "";

  for (const s of societies) {
    let action;

    if (enrolment && enrolment.societyId === s.id) {
      action = `<span class="badge">Your society (${enrolment.role})</span>`;
    } else if (enrolment) {
      action = `<button class="btn" disabled>Join</button>`;       // already in another society
    } else {
      action = `<button class="btn" onclick="openForm('${s.id}')">Join</button>`;
    }

    const mine = enrolment && enrolment.societyId === s.id ? "mine" : "";

    html += `
      <article class="card ${mine}">
        <h3>${s.name}</h3>
        <p class="meta">Meets ${s.day}</p>
        <p class="desc">${s.desc}</p>
        ${action}
      </article>`;
  }

  document.getElementById("societyList").innerHTML = html;
}

// Section 2: Membership
function showMembership() {
  const e = getEnrolment();

  document.getElementById("memberEmpty").hidden = e !== null;
  document.getElementById("memberInfo").hidden = e === null;
  if (e === null) return;

  setText("mSociety", findSociety(e.societyId).name);
  setText("mRole", e.role);
  setText("mName", e.name);
  setText("mRoll", e.roll);
  setText("mEmail", e.email);
  setText("mDate", e.date);
  setText("mEvents", getRegistrations().length);
}

function setText(id, text) {
  document.getElementById(id).textContent = text;
}

// Section 3: Activities
function showActivities() {
  let html = "";

  for (const s of societies) {
    let items = "";
    for (const a of s.activities) {
      items += `<li>${a}</li>`;
    }
    html += `
      <article class="card">
        <h3>${s.name}</h3>
        <ul>${items}</ul>
      </article>`;
  }

  document.getElementById("activityList").innerHTML = html;
}

// Section 4: Event registration
function showEvents() {
  const enrolment = getEnrolment();
  const registered = getRegistrations();
  let html = "";

  for (const ev of events) {
    const society = findSociety(ev.societyId);
    let button;

    if (registered.includes(ev.id)) {
      button = `<button class="btn" disabled>Registered</button>`;
    } else if (enrolment && enrolment.societyId === ev.societyId) {
      button = `<button class="btn" onclick="registerEvent('${ev.id}')">Register</button>`;
    } else if (enrolment) {
      button = `<button class="btn" disabled>Not your society</button>`;
    } else {
      button = `<button class="btn" disabled>Join a society first</button>`;
    }

    html += `
      <article class="card">
        <h3>${ev.title}</h3>
        <p class="meta">${society.name}</p>
        <p class="desc">${ev.date} at ${ev.place}</p>
        ${button}
      </article>`;
  }

  document.getElementById("eventList").innerHTML = html;
}

// Redraw everything (used after any change)
function refresh() {
  showSocieties();
  showMembership();
  showActivities();
  showEvents();
}

// Menu: show one section, hide the others
function showTab(name) {
  for (const panel of document.querySelectorAll(".tab-panel")) {
    panel.hidden = panel.id !== name;
  }
  for (const btn of document.querySelectorAll(".tab-btn")) {
    btn.classList.toggle("active", btn.dataset.tab === name);
  }
}

// Small message at the bottom of the screen
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.hidden = false;
  setTimeout(function () { toast.hidden = true; }, 2500);
}


/* ---------- 4. ACTIONS ---------- */

const dialog = document.getElementById("joinDialog");
const form = document.getElementById("joinForm");
let chosenSocietyId = null;

// Open the join form for one society
function openForm(societyId) {
  // The one-society rule: stop if the student is already enrolled
  if (getEnrolment() !== null) {
    showToast("You are already in a society. Leave it first.");
    return;
  }
  chosenSocietyId = societyId;
  document.getElementById("dialogTitle").textContent = "Join " + findSociety(societyId).name;
  document.getElementById("formError").textContent = "";
  form.reset();
  dialog.showModal();
}

function closeForm() {
  dialog.close();
}

// When the form is submitted: check the answers, then save
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const roll = document.getElementById("roll").value.trim();
  const email = document.getElementById("email").value.trim();
  const role = form.querySelector('input[name="role"]:checked');
  const error = document.getElementById("formError");

  if (name === "" || roll === "" || email === "") {
    error.textContent = "Please fill in your name, roll number and email.";
    return;
  }
  if (!email.includes("@") || !email.includes(".")) {
    error.textContent = "Enter a valid email, like name@university.edu.";
    return;
  }
  if (role === null) {
    error.textContent = "Choose Member or Attendee.";
    return;
  }

  const enrolment = {
    societyId: chosenSocietyId,
    name: name,
    roll: roll,
    email: email,
    role: role.value,
    date: new Date().toLocaleDateString()
  };
  localStorage.setItem("enrolment", JSON.stringify(enrolment));

  dialog.close();
  refresh();
  showToast("Enrolled in " + findSociety(chosenSocietyId).name + " as " + role.value + ".");
});

// Leave the society (this also cancels the event registrations)
function leaveSociety() {
  if (confirm("Leave your society? Your event registrations will be removed too.")) {
    localStorage.removeItem("enrolment");
    localStorage.removeItem("eventRegs");
    refresh();
    showToast("You have left the society.");
  }
}

// Register for an event of your own society
function registerEvent(eventId) {
  const registered = getRegistrations();
  registered.push(eventId);
  localStorage.setItem("eventRegs", JSON.stringify(registered));
  refresh();
  showToast("You are registered for the event.");
}


/* ---------- START ---------- */
refresh();
