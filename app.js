function getMatches() {
  let stored = localStorage.getItem("matches");
  if (stored) {
    return JSON.parse(stored);
  } else {
    return [];
  }
}

function saveMatches(matches) {
  localStorage.setItem("matches", JSON.stringify(matches));
}

let form = document.getElementById("addMatchForm");
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let teamA = document.getElementById("teamA").value.trim();
    let teamB = document.getElementById("teamB").value.trim();
    let date = document.getElementById("date").value;
    let time = document.getElementById("time").value;
    let venue = document.getElementById("venue").value.trim();
    let status = document.getElementById("status").value;
    let score = document.getElementById("score").value.trim();

    let message = document.getElementById("formMessage");

    if (!teamA || !teamB || !date || !time || !venue || !status) {
      message.textContent = "Please fill in all required fields.";
      message.style.color = "red";
      return;
    }

    let matches = getMatches();
    let newMatch = {
      id: Date.now(),
      teamA: teamA,
      teamB: teamB,
      date: date,
      time: time,
      venue: venue,
      status: status,
      score: score,
    };

    matches.push(newMatch);
    saveMatches(matches);

    message.textContent = "Match added successfully!";
    message.style.color = "green";

    form.reset();

    renderMatches("upcomingMatches", true);
    renderMatches("allMatches");
  });
}

function renderMatches(containerId, showUpcomingOnly) {
  let container = document.getElementById(containerId);
  if (!container) return;

  let matches = getMatches();
  container.innerHTML = "";

  matches.map(function (match) {
    if (showUpcomingOnly) {
      if (match.status !== "Upcoming") {
        return;
      }
    }

    let matchDiv = document.createElement("div");

    if (match.status === "Upcoming") {
      matchDiv.className = "match-card upcoming";
    } else {
      matchDiv.className = "match-card played";
    }

    let htmlContent = "<h3>" + match.teamA + " vs " + match.teamB + "</h3>";
    htmlContent += "<p>" + match.date + " | " + match.time + "</p>";
    htmlContent += "<p>Venue: " + match.venue + "</p>";
    htmlContent += "<p>Status: " + match.status + "</p>";
    if (match.score) {
      htmlContent += "<p>Score: " + match.score + "</p>";
    }
    matchDiv.innerHTML = htmlContent;

    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";

    matchDiv.appendChild(deleteBtn);

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

renderMatches("upcomingMatches", true);
renderMatches("allMatches");

let count = document.getElementById("matchCount");
if (count) {
  count.textContent = "Total matches recorded: " + getMatches().length;
}

(function () {
  console.log("Welcome to ScrumTime Rugby!");
})();
