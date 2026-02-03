function getMatches() {
  let stored = localStorage.getItem("matches");
  if (stored) {
    return JSON.parse(stored);
  } else {
    return [];
  }
}

// Save matches array to localStorage
function saveMatches(matches) {
  localStorage.setItem("matches", JSON.stringify(matches));
}

// Handle Add Match form submission
let form = document.getElementById("addMatchForm");
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form input values
    let teamA = document.getElementById("teamA").value.trim();
    let teamB = document.getElementById("teamB").value.trim();
    let date = document.getElementById("date").value;
    let time = document.getElementById("time").value;
    let venue = document.getElementById("venue").value.trim();
    let status = document.getElementById("status").value;
    let score = document.getElementById("score").value.trim();

    let message = document.getElementById("formMessage");

    // Simple validation to check required fields
    if (!teamA || !teamB || !date || !time || !venue || !status) {
      message.textContent = "Please fill in all required fields.";
      message.style.color = "red";
      return;
    }

    // Create a new match object
    let matches = getMatches();
    let newMatch = {
      id: Date.now(), // Unique identifier
      teamA: teamA,
      teamB: teamB,
      date: date,
      time: time,
      venue: venue,
      status: status,
      score: score,
    };

    // Add new match to the list and save
    matches.push(newMatch);
    saveMatches(matches);

    // Feedback to user
    message.textContent = "Match added successfully!";
    message.style.color = "green";
    form.reset();
    renderMatches("upcomingMatches", true);
    renderMatches("allMatches");
  });
}

// Render matches in the specified container
function renderMatches(containerId, showUpcomingOnly) {
  let container = document.getElementById(containerId);
  if (!container) return;

  let matches = getMatches();
  container.innerHTML = "";

  matches.map(function (match) {
    // Skip non-upcoming matches if showing only upcoming
    if (showUpcomingOnly) {
      if (match.status !== "Upcoming") {
        return;
      }
    }

    // Create match card div
    let matchDiv = document.createElement("div");

    if (match.status === "Upcoming") {
      matchDiv.className = "match-card upcoming";
    } else {
      matchDiv.className = "match-card played";
    }

    // Build match HTML content
    let htmlContent = "<h3>" + match.teamA + " vs " + match.teamB + "</h3>";
    htmlContent += "<p>" + match.date + " | " + match.time + "</p>";
    htmlContent += "<p>Venue: " + match.venue + "</p>";
    htmlContent += "<p>Status: " + match.status + "</p>";
    if (match.score) {
      htmlContent += "<p>Score: " + match.score + "</p>";
    }
    matchDiv.innerHTML = htmlContent;

    // Create delete button
    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";

    matchDiv.appendChild(deleteBtn);

    // Delete match when button clicked
    deleteBtn.addEventListener("click", function () {
      let updatedMatches = getMatches().filter(function (m) {
        return m.id !== match.id;
      });
      saveMatches(updatedMatches);
      renderMatches(containerId, showUpcomingOnly);
    });

    container.appendChild(matchDiv);
  });
}

// Initial rendering of matches
renderMatches("upcomingMatches", true);
renderMatches("allMatches");

// Display total match count
let count = document.getElementById("matchCount");
if (count) {
  count.textContent = "Total matches recorded: " + getMatches().length;
}

//Welcome message in console
(function () {
  console.log("Welcome to ScrumTime Rugby!");
})();
