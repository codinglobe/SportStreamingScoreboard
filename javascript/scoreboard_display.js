// Diese Funktion wird verwendet, um die Daten abzurufen und die Anzeige zu aktualisieren
function updateScoreboard() {
    fetch("scoreboard_data.json")
        .then(response => response.json())
        .then(data => {
            updateScoreboardDisplay(data);
            showGlobalAnimationBox(data);
        });
}

// Funktion zur Aktualisierung der Anzeige mit den erhaltenen Daten
function updateScoreboardDisplay(data) {
    document.getElementById("teamLogo1").src = data.team1.teamLogo;
    document.getElementById("teamLogo2").src = data.team2.teamLogo;
    document.getElementById("teamName1").textContent = data.team1.teamName;
    document.getElementById("teamName2").textContent = data.team2.teamName;
    document.getElementById("score1").textContent = data.team1.score;
    document.getElementById("score2").textContent = data.team2.score;
    document.getElementById("championshipText").textContent = data.championshipText;
    document.getElementById("period").textContent = data.period;
    document.getElementById("time-input").textContent = `${data.minutes}:${data.seconds}`;
    document.getElementById("penaltyTimeDisplay1-1").textContent = data.team1.penaltyTimeDisplay1_1 || '';
    document.getElementById("penaltyTimeDisplay1-2").textContent = data.team1.penaltyTimeDisplay1_2 || '';
    document.getElementById("penaltyTimeDisplay2-1").textContent = data.team2.penaltyTimeDisplay2_1 || '';
    document.getElementById("penaltyTimeDisplay2-2").textContent = data.team2.penaltyTimeDisplay2_2 || '';

    // Überprüfe, ob die Zeit für Penalty 1-1 vorhanden ist
    toggleElementVisibility("penaltyTimeDisplay1-1", data.team1.penaltyTimeDisplay1_1);
    // Überprüfe, ob die Zeit für Penalty 1-2 vorhanden ist
    toggleElementVisibility("penaltyTimeDisplay1-2", data.team1.penaltyTimeDisplay1_2);
    // Überprüfe, ob die Zeit für Penalty 2-1 vorhanden ist
    toggleElementVisibility("penaltyTimeDisplay2-1", data.team2.penaltyTimeDisplay2_1);
    // Überprüfe, ob die Zeit für Penalty 2-2 vorhanden ist
    toggleElementVisibility("penaltyTimeDisplay2-2", data.team2.penaltyTimeDisplay2_2);
}

// Funktion zum Ein- oder Ausblenden eines Elements basierend auf der Sichtbarkeitsbedingung
function toggleElementVisibility(elementId, condition) {
    const element = document.getElementById(elementId);
    if (condition) {
        element.classList.add("show");
    } else {
        element.classList.remove("show");
    }
}

// Funktion zur Überprüfung und Anzeige der Animation-Box basierend auf goalscored und penalty
function showGlobalAnimationBox(data) {
    const globalAnimationBox = document.getElementById("globalAnimationBox");

    // Überprüfe, ob Team 1 ein Tor erzielt hat
    if (data.team1.goalscored) {
        displayTeamAnimation(data.team1, globalAnimationBox, "TOR");
    }

    // Überprüfe, ob Team 2 ein Tor erzielt hat
    if (data.team2.goalscored) {
        displayTeamAnimation(data.team2, globalAnimationBox, "TOR");
    }

    // Überprüfe, ob Team 1 eine Strafe hat
    if (data.team1.penalty) {
        displayTeamAnimation(data.team1, globalAnimationBox, "STRAFE");
    }

    // Überprüfe, ob Team 2 eine Strafe hat
    if (data.team2.penalty) {
        displayTeamAnimation(data.team2, globalAnimationBox, "STRAFE");
    }
}

// Funktion zur Anzeige der Animation-Box für ein Team
function displayTeamAnimation(teamData, animationBox, text) {
    const teamLogoAnimation = document.getElementById("teamLogoAnimation");
    const teamNameAnimation = document.getElementById("teamNameAnimation");
    const animationText = document.getElementById("animationText");

    // Setze das Teamlogo und den Teamnamen in die Animation-Box
    teamLogoAnimation.src = teamData.teamLogo;
    teamNameAnimation.textContent = teamData.teamName;

    // Setze den Text (GOAL oder PENALTY) in die Animation-Box
    animationText.textContent = text;

    // Füge die Klasse "show" hinzu, um die Animation-Box anzuzeigen
    animationBox.classList.add("show");

    // Verstecke die Animation-Box nach 10 Sekunden
    setTimeout(() => {
        animationBox.classList.remove("show");
    }, 10000);
}

// Rufen Sie die Funktion alle Sekunde auf, um die Anzeige zu aktualisieren
setInterval(updateScoreboard, 500);

// Rufen Sie die Funktion alle Sekunde auf, um die Animation-Box zu überprüfen
setInterval(() => {
    fetch("scoreboard_data.json")
        .then(response => response.json())
        .then(data => {
            showGlobalAnimationBox(data);
        });
}, 1000);

// Initialer Aufruf der Funktionen
updateScoreboard();
showGlobalAnimationBox();