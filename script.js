// ---------- 1. Our data (simple lists) ----------

var societies = [
  { id: 1, name: "PROCOM", icon: "💻", color: "#2b6cb0", about: "Coding nights, hackathons and tech talks." },
  { id: 2, name: "Debating Society CBS", icon: "🎤", color: "#c0392b", about: "Learn to argue well and speak with confidence." },
  { id: 3, name: "D.E.C.S", icon: "🎭", color: "#8e44ad", about: "Acting, stage design and the yearly play." },
  { id: 4, name: "Coders Cup Competition", icon: "📷", color: "#16a085", about: "Photo walks, editing workshops and exhibitions." },
  { id: 5, name: "Sports Society", icon: "⚽", color: "#e67e22", about: "Friendly matches, training and tournaments." },
  { id: 6, name: "Dev Day", icon: "🎵", color: "#d6336c", about: "Band practice, open mics and concerts." }
];

var events = [
  { id: 1, societyId: 1, name: "Hackathon Weekend", date: "5 December 2026", place: "Computer Lab 2" },
  { id: 2, societyId: 2, name: "MUNS Debate", date: "8 December 2026", place: "Main Hall" },
  { id: 3, societyId: 3, name: "Freshers Night Party", date: "10 December 2026", place: "Theatre Room" },
  { id: 4, societyId: 4, name: "Competitve Programming", date: "12 December 2026", place: "Front Gate" },
  { id: 5, societyId: 5, name: "Football Tournament", date: "15 December 2026", place: "Sports Ground" },
  { id: 6, societyId: 6, name: "Dark Protocol", date: "18 December 2026", place: "Student Cafe" }
];

// These two lists start empty and fill up when students submit the forms
var members = [];
var registrations = [];


// ---------- 2. Small helper functions ----------

// Find a society by its id number
function getSociety(id) {
  for (var i = 0; i < societies.length; i++) {
    if (societies[i].id == id) {
      return societies[i];
    }
  }
}

// Find an event by its id number
function getEvent(id) {
  for (var i = 0; i < events.length; i++) {
    if (events[i].id == id) {
      return events[i];
    }
  }
}

// Show a green or red message under a form
function showMessage(elementId, text, isGood) {
  var box = document.getElementById(elementId);
  box.innerHTML = text;
  if (isGood) {
    box.className = "message good";
  } else {
    box.className = "message bad";
  }
}


// ---------- 3. Show the societies ----------

function showSocieties() {
  var html = "";

  for (var i = 0; i < societies.length; i++) {
    var s = societies[i];
    html += '<div class="card" style="border-top-color:' + s.color + '">';
    html += '<div class="icon">' + s.icon + '</div>';
    html += '<h3>' + s.name + '</h3>';
    html += '<p>' + s.about + '</p>';
    html += '<button onclick="chooseSociety(' + s.id + ')">Join this society</button>';
    html += '</div>';
  }

  document.getElementById("societyList").innerHTML = html;
}

// When "Join this society" is clicked: pick it in the form and scroll down
function chooseSociety(id) {
  document.getElementById("mSociety").value = id;
  document.getElementById("membership").scrollIntoView();
}


// ---------- 4. Show the events ----------

function showEvents() {
  var chosen = document.getElementById("filter").value; // "all" or a society id
  var html = "";

  for (var i = 0; i < events.length; i++) {
    var e = events[i];

    // skip events that do not match the filter
    if (chosen != "all" && e.societyId != chosen) {
      continue;
    }

    var s = getSociety(e.societyId);
    html += '<div class="card" style="border-top-color:' + s.color + '">';
    html += '<h3>' + e.name + '</h3>';
    html += '<p class="small">' + s.name + '</p>';
    html += '<p>📅 ' + e.date + '<br>📍 ' + e.place + '</p>';
    html += '<button onclick="chooseEvent(' + e.id + ')">Register</button>';
    html += '</div>';
  }

  if (html == "") {
    html = "<p>No events found.</p>";
  }

  document.getElementById("eventList").innerHTML = html;
}

// When "Register" is clicked: pick the event in the form and scroll down
function chooseEvent(id) {
  document.getElementById("rEvent").value = id;
  document.getElementById("registration").scrollIntoView();
}


// ---------- 5. Fill the dropdown menus ----------

function fillDropdowns() {
  var societyOptions = "";
  var filterOptions = '<option value="all">All societies</option>';
  var eventOptions = "";

  for (var i = 0; i < societies.length; i++) {
    var s = societies[i];
    societyOptions += '<option value="' + s.id + '">' + s.name + '</option>';
    filterOptions += '<option value="' + s.id + '">' + s.name + '</option>';
  }

  for (var j = 0; j < events.length; j++) {
    var e = events[j];
    eventOptions += '<option value="' + e.id + '">' + e.name + ' (' + e.date + ')</option>';
  }

  document.getElementById("mSociety").innerHTML = societyOptions;
  document.getElementById("filter").innerHTML = filterOptions;
  document.getElementById("rEvent").innerHTML = eventOptions;
}


// ---------- 6. Membership form ----------

document.getElementById("memberForm").onsubmit = function (event) {
  event.preventDefault(); // stop the page from reloading

  var name = document.getElementById("mName").value;
  var studentId = document.getElementById("mId").value;
  var email = document.getElementById("mEmail").value;
  var societyId = document.getElementById("mSociety").value;

  // Check 1: nothing should be empty
  if (name == "" || studentId == "" || email == "") {
    showMessage("mMessage", "Please fill in all the boxes.", false);
    return;
  }

  // Check 2: the email must have an @
  if (email.indexOf("@") == -1) {
    showMessage("mMessage", "Please enter a valid email.", false);
    return;
  }

  // Check 3: the student must not join the same society twice
  for (var i = 0; i < members.length; i++) {
    if (members[i].studentId == studentId && members[i].societyId == societyId) {
      showMessage("mMessage", "You are already a member of this society.", false);
      return;
    }
  }

  // Everything is fine, so save the new member
  members.push({ name: name, studentId: studentId, email: email, societyId: societyId });

  showMessage("mMessage", "Welcome to the " + getSociety(societyId).name + ", " + name + "!", true);
  showMembers();
  document.getElementById("memberForm").reset();
};

function showMembers() {
  var html = "";

  for (var i = 0; i < members.length; i++) {
    var m = members[i];
    html += "<tr>";
    html += "<td>" + m.name + "</td>";
    html += "<td>" + m.studentId + "</td>";
    html += "<td>" + getSociety(m.societyId).name + "</td>";
    html += "</tr>";
  }

  if (html == "") {
    html = '<tr><td colspan="3">No members yet. Be the first!</td></tr>';
  }

  document.getElementById("memberTable").innerHTML = html;
}


// ---------- 7. Event registration form ----------

document.getElementById("eventForm").onsubmit = function (event) {
  event.preventDefault();

  var name = document.getElementById("rName").value;
  var studentId = document.getElementById("rId").value;
  var email = document.getElementById("rEmail").value;
  var eventId = document.getElementById("rEvent").value;

  if (name == "" || studentId == "" || email == "") {
    showMessage("rMessage", "Please fill in all the boxes.", false);
    return;
  }

  if (email.indexOf("@") == -1) {
    showMessage("rMessage", "Please enter a valid email.", false);
    return;
  }

  // The student must not register for the same event twice
  for (var i = 0; i < registrations.length; i++) {
    if (registrations[i].studentId == studentId && registrations[i].eventId == eventId) {
      showMessage("rMessage", "You have already registered for this event.", false);
      return;
    }
  }

  registrations.push({ name: name, studentId: studentId, email: email, eventId: eventId });

  showMessage("rMessage", "You are registered for " + getEvent(eventId).name + "!", true);
  showRegistrations();
  document.getElementById("eventForm").reset();
};

function showRegistrations() {
  var html = "";

  for (var i = 0; i < registrations.length; i++) {
    var r = registrations[i];
    html += "<tr>";
    html += "<td>" + r.name + "</td>";
    html += "<td>" + r.studentId + "</td>";
    html += "<td>" + getEvent(r.eventId).name + "</td>";
    html += "</tr>";
  }

  if (html == "") {
    html = '<tr><td colspan="3">No registrations yet.</td></tr>';
  }

  document.getElementById("registrationTable").innerHTML = html;
}


// ---------- 8. Run everything when the page opens ----------

fillDropdowns();
showSocieties();
showEvents();
showMembers();
showRegistrations();
