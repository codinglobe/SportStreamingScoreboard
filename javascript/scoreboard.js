let timer;
let countUp = true;
let time = 0;
let maxTime = 20;
let period = 1;
let maxTimeEnabled = true;
let penaltyTimers = {
    1: { 1: { time: 0, display: '02:00' }, 2: { time: 0, display: '02:00' } },
    2: { 1: { time: 0, display: '02:00' }, 2: { time: 0, display: '02:00' } }
};
let penaltyInterval = {
    1: { 1: null, 2: null },
    2: { 1: null, 2: null }
};
let newMaxTime = 20; // Eine Variable, um die geänderte maximale Zeit temporär zu speichern
let scoreboardData = {
    team1: {
        teamName: "Team 1",
        score: 0,
        goalscored: false,
        penalty: false,  // Neue Variable für Strafzeiten
    },
    team2: {
        teamName: "Team 2",
        score: 0,
        goalscored: false,
        penalty: false,  // Neue Variable für Strafzeiten
    },
    championshipText: "N/A",
    period: "1st Period",
    minutes: "00",
    seconds: "00"
};

// Funktion, um den Teamnamen in Echtzeit zu aktualisieren
function updateTeamName(team) {
    const teamNameInput = document.getElementById(`teamNameInput${team}`);
    const teamNameElement = document.getElementById(`teamName${team}`);
    const updatedName = teamNameInput.value;
    teamNameElement.innerText = updatedName;

    // Wenn der aktualisierte Name leer ist, zeige den Platzhalter im Inputfeld an
    if (!updatedName) {
        teamNameInput.placeholder = "Teamname";
    } else {
        // Andernfalls entferne den Platzhalter
        teamNameInput.placeholder = "";
    }
}

// Funktion, um die Zeit zu stoppen, wenn ein Team ein Tor erzielt
function stopTimerOnGoal() {
    if (timer) {
        clearInterval(timer);
        timer = null;
        for (let team = 1; team <= 2; team++) {
            for (let num = 1; num <= 2; num++) {
                if (penaltyInterval[team][num]) {
                    clearInterval(penaltyInterval[team][num]);
                    penaltyInterval[team][num] = null;
                }
            }
        }
    }
}

// Event-Handler für das Inkrementieren des Scores
function incrementScore(team) {
    // Stoppen Sie den Timer, wenn ein Team ein Tor erzielt
    stopTimerOnGoal();

    const scoreElement = document.getElementById(`score${team}`);
    const currentScore = parseInt(scoreElement.innerText, 10);
    scoreElement.innerText = currentScore + 1
}

function decrementScore(team) {
    const scoreElement = document.getElementById(`score${team}`);
    const currentScore = parseInt(scoreElement.innerText, 10);
    if (currentScore > 0) {
        scoreElement.innerText = currentScore - 1;
    }
}

function toggleCountDirection() {
    const countDirectionUpInput = document.getElementById('countDirectionUp');
    countUp = countDirectionUpInput.checked;
    const countDirectionLabel = document.querySelector("label[for='countDirection']");

    if (timer) {
        clearInterval(timer);
        timer = null;
    }

    if (countUp) {
        countDirectionLabel.innerText = "Aufwärts zählen";
        timer = setInterval(updateTimer, 1000);
    } else {
        countDirectionLabel.innerText = "Abwärts zählen";
        if (time > 0) {
            timer = setInterval(updateTimer, 1000);
        }
    }
}

function startStopTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
        for (let team = 1; team <= 2; team++) {
            for (let num = 1; num <= 2; num++) {
                if (penaltyInterval[team][num]) {
                    clearInterval(penaltyInterval[team][num]);
                    penaltyInterval[team][num] = null;
                }
            }
        }
    } else {
        timer = setInterval(updateTimer, 1000);
        for (let team = 1; team <= 2; team++) {
            for (let num = 1; num <= 2; num++) {
                if (penaltyTimers[team][num].time > 0) {
                    penaltyInterval[team][num] = setInterval(updatePenaltyTimer, 1000, team, num);
                }
            }
        }
    }
}

function resetTimer() {
    clearInterval(timer);
    timer = null;
    time = 0;
    updateTimerDisplay();
    for (let team = 1; team <= 2; team++) {
        for (let num = 1; num <= 2; num++) {
            if (penaltyInterval[team][num]) {
                clearInterval(penaltyInterval[team][num]);
                penaltyInterval[team][num] = null;
            }
            penaltyTimers[team][num] = { time: 0, display: '02:00' };
            updatePenaltyTimeDisplay(team, num);
        }
    }
}

function updateTimer() {
    if (countUp) {
        if (!maxTimeEnabled || (maxTimeEnabled && time < maxTime * 60)) {
            time++;
        } else {
            // Haupttimer erreicht die maximale Zeit, stoppe den Timer und alle Penaltys
            clearInterval(timer);
            timer = null;
            for (let team = 1; team <= 2; team++) {
                for (let num = 1; num <= 2; num++) {
                    if (penaltyInterval[team][num]) {
                        clearInterval(penaltyInterval[team][num]);
                        penaltyInterval[team][num] = null;
                    }
                }
            }
        }
    } else {
        if (time > 0) {
            time--;
        } else {
            // Haupttimer erreicht 00:00, stoppe den Timer und alle Penaltys
            clearInterval(timer);
            timer = null;
            for (let team = 1; team <= 2; team++) {
                for (let num = 1; num <= 2; num++) {
                    if (penaltyInterval[team][num]) {
                        clearInterval(penaltyInterval[team][num]);
                        penaltyInterval[team][num] = null;
                    }
                }
            }
        }
    }
    updateTimerDisplay();
}

function updatePenaltyTimer(team, num) {
    if (penaltyTimers[team][num].time > 0) {
        penaltyTimers[team][num].time--;
        if (penaltyTimers[team][num].time === 0) {
            clearInterval(penaltyInterval[team][num]);
            penaltyInterval[team][num] = null;
        }
        updatePenaltyTimeDisplay(team, num);
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(time / 60);
    const seconds = Math.abs(time % 60);
    document.getElementById('minutes').innerText = `${minutes < 10 ? '0' : ''}${minutes}`;
    document.getElementById('seconds').innerText = `${seconds < 10 ? '0' : ''}${seconds}`;
}

function changePeriod(direction) {
    if (direction === '+' && period < 4) {
        period++;
    } else if (direction === '-' && period > 1) {
        period--;
    }
    const periodElement = document.getElementById('period');
    if (period === 1) {
        periodElement.innerText = '1st Period';
    } else if (period === 2) {
        periodElement.innerText = '2nd Period';
    } else if (period === 3) {
        periodElement.innerText = '3rd Period';
    } else {
        periodElement.innerText = 'OT';
    }
}

function adjustTime(type, value) {
    const isCountingUp = document.getElementById('countDirectionUp').checked;

    if (isCountingUp) {
        if (type === 'minutes+' && time < maxTime * 60) {
            time += 60;
        } else if (type === 'minutes-' && time >= 60) {
            time -= 60;
        } else if (type === 'seconds+' && (time < maxTime * 60 - 1)) {
            time += value;
        } else if (type === 'seconds-' && (time >= 1)) {
            time -= value;
        }
    } else {
        if (type === 'minutes+' && time < maxTime * 60) {
            time += 60;
        } else if (type === 'minutes-' && time >= 60) {
            time -= 60;
        } else if (type === 'seconds+' && (time >= 1)) {
            time += value;
        } else if (type === 'seconds-' && (time < maxTime * 60 - 1)) {
            time -= value;
        }
    }

    // Aktualisiere den Haupttimer
    updateTimerDisplay();

    // Berücksichtige die Zählrichtung für die Strafzeiten
    for (let team = 1; team <= 2; team++) {
        for (let num = 1; num <= 2; num++) {
            const penaltyTimer = penaltyTimers[team][num];
            if (penaltyTimer.time > 0) {
                if (isCountingUp) {
                    if (type === 'minutes+' && type !== 'seconds+') {
                        penaltyTimer.time -= 60;
                    } else if (type === 'minutes-' && type !== 'seconds-') {
                        penaltyTimer.time += 60;
                    } else if (type === 'seconds+' && type !== 'minutes+') {
                        penaltyTimer.time -= value;
                    } else if (type === 'seconds-' && type !== 'minutes-') {
                        penaltyTimer.time += value;
                    }
                } else {
                    if (type === 'minutes+' && type !== 'seconds+') {
                        penaltyTimer.time += 60;
                    } else if (type === 'minutes-' && type !== 'seconds-') {
                        penaltyTimer.time -= 60;
                    } else if (type === 'seconds+' && type !== 'minutes+') {
                        penaltyTimer.time += value;
                    } else if (type === 'seconds-' && type !== 'minutes-') {
                        penaltyTimer.time -= value;
                    }
                }
                // Stellen Sie sicher, dass die Strafzeiten nicht negativ werden.
                penaltyTimer.time = Math.max(penaltyTimer.time, 0);
            }
            updatePenaltyTimeDisplay(team, num);
        }
    }
}

function setMaxTime() {
    const newMaxTime = parseInt(document.getElementById('maxTime').value, 10);
    // Stelle sicher, dass die maximale Zeit im gültigen Bereich (z.B. 1 bis 99 Minuten) liegt.
    if (newMaxTime >= 1 && newMaxTime <= 99) {
        maxTime = newMaxTime;
        // Prüfe, ob die aktuelle Zeit die neue maximale Zeit überschreitet, und setze sie zurück, falls erforderlich.
        if (maxTimeEnabled && time > maxTime * 60) {
            time = maxTime * 60;
        }
        updateTimerDisplay();
    }
}

function startPenaltyTimer(team, num) {
    const penaltyTimeInput = document.getElementById(`penaltyTimeInput${team}-${num}`);
    const penaltyTime = penaltyTimeInput.value;
    const penaltyMinutes = parseInt(penaltyTime.split(':')[0], 10);
    const penaltySeconds = parseInt(penaltyTime.split(':')[1], 10);

    // Überprüfe, ob die Strafe bereits aktiv ist
    if (!penaltyTimers[team][num].isActive) {
        // Wenn nicht, starte die Strafe
        penaltyTimers[team][num].isActive = true;
        penaltyTimers[team][num].timer = setInterval(function () {
            updatePenaltyTimeDisplay(team, num);
        }, 1000);

        penaltyTimers[team][num].time = penaltyMinutes * 60 + penaltySeconds;

    } else {
        // Wenn bereits aktiv, stoppe die Strafe
        penaltyTimers[team][num].isActive = false;
        clearInterval(penaltyTimers[team][num].timer);
        penaltyTimers[team][num].time = initialPenaltyTime;
        updatePenaltyTimeDisplay(team, num);
    }
}

function deletePenaltyTime(team, num) {
    const selectedPenaltyTime = document.getElementById(`penaltyTimeInput${team}-${num}`).value;
    const currentPenaltyTime = penaltyTimers[team][num].display;
    
    if (currentPenaltyTime === '05:00') {
      // Bei einer ausgewählten Strafzeit von 05:00 wird nichts gelöscht.
      return;
    }
    
    if (currentPenaltyTime === '04:00') {
      if (selectedPenaltyTime === '04:00' && penaltyTimers[team][num].time >= 120) {
        // Wenn die aktuelle Strafzeit 04:00 ist, die ausgewählte Strafzeit 02:00 ist und die verbleibende Zeit in der Strafzeit von 04:00
        // kleiner als 120 Sekunden ist (was 02:00 entspricht), wird sie gelöscht.
        if (penaltyTimers[team][num].time < 120) {
          penaltyTimers[team][num].time = 0;
          penaltyTimers[team][num].display = '00:00';
        } else {
          penaltyTimers[team][num].time = 120;
          penaltyTimers[team][num].display = '02:00';
        }
      } else {
        // Andernfalls wird die Strafzeit auf 02:00 reduziert.
        penaltyTimers[team][num].time = 120; // 02:00 in Sekunden
        penaltyTimers[team][num].display = '02:00';
      }
    } else if (currentPenaltyTime === '02:00') {
      // Wenn die aktuelle Strafzeit 02:00 ist, wird sie gelöscht.
      penaltyTimers[team][num].time = 0;
      penaltyTimers[team][num].display = '00:00';
    }
    
    if (penaltyInterval[team][num]) {
      clearInterval(penaltyInterval[team][num]);
      penaltyInterval[team][num] = null;
    }
    
    updatePenaltyTimeDisplay(team, num);
  }   

function updatePenaltyTimeDisplay(team, num) {
    const penaltyTimeDisplayElement = document.getElementById(`penaltyTimeDisplay${team}-${num}`);
    const minutes = Math.floor(penaltyTimers[team][num].time / 60);
    const seconds = penaltyTimers[team][num].time % 60;
    if (penaltyTimers[team][num].time > 0) {
        penaltyTimeDisplayElement.innerText = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    } else {
        penaltyTimeDisplayElement.innerText = '';
    }
}

// Funktion, um die temporäre maximale Zeit zu setzen
function setTemporaryMaxTime() {
    const inputField = document.getElementById('maxTime');
    const temporaryValue = parseInt(inputField.value, 10);
    if (temporaryValue >= 1 && temporaryValue <= 99) {
        newMaxTime = temporaryValue;
    }
}

// Funktion, um die temporäre maximale Zeit zu bestätigen und anzuwenden
function confirmMaxTime() {
    maxTime = newMaxTime;
    // Prüfe, ob die aktuelle Zeit die neue maximale Zeit überschreitet und setze sie zurück, falls erforderlich
    if (maxTimeEnabled && time > maxTime * 60) {
        time = maxTime * 60;
    }
    updateTimerDisplay();
    // Starte den Timer, wenn die maximale Zeit geändert wurde
    startStopTimer();
}
// Funktion zum Verarbeiten von hochgeladenen Logo-Dateien
function handleLogoUpload(team) {
    const logoInput = document.getElementById(`teamLogoInput${team}`);
    const logoImage = document.getElementById(`teamLogo${team}`);
    const file = logoInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            logoImage.src = event.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        // Setzen Sie ein Standardlogo, wenn keine Datei ausgewählt wurde
        logoImage.src = "Bilder/default.jpg"; // Hier "default-logo.png" durch Ihren Standard-Logo-Pfad ersetzen
    }
}

// Funktion für den Tor-Button
function goalButtonClicked(team) {
    // Setze das Flag für goalscored in der JSON
    scoreboardData[`team${team}`].goalscored = true;
    // Aktualisiere die JSON-Daten und exportiere sie
    exportScoreboardData();
    setTimeout(function () {
        scoreboardData[`team${team}`].goalscored = false;
        // Aktualisiere die JSON-Daten und exportiere sie nach dem Zurücksetzen auf false
        exportScoreboardData();
    }, 1000);  // Setze nach 10 Sekunden zurück (1000 Millisekunden)
}

// Funktion für den Straf-Button
function penaltyButtonClicked(team, num) {
    // Setze das Flag für penalty in der JSON
    scoreboardData[`team${team}`].penalty = true;
    // Aktualisiere die JSON-Daten und exportiere sie
    exportScoreboardData();
    setTimeout(function () {
        scoreboardData[`team${team}`].penalty = false;
        // Aktualisiere die JSON-Daten und exportiere sie nach dem Zurücksetzen auf false
        exportScoreboardData();
    }, 1000);  // Setze nach 10 Sekunden zurück (1000 Millisekunden)
}

// Get the Championship input element
var championshipInput = document.getElementById("championship");

// Get the Championship text element in the Control Panel
var championshipText = document.getElementById("championshipText");

// Add an event listener to update the Championship text
championshipInput.addEventListener("input", function() {
    championshipText.innerText = championshipInput.value || "N/A";
});

    // Diese Funktion wird verwendet, um die JSON-Daten zu exportieren
    function exportScoreboardData() {
    const data = {
        team1: {
            teamName: document.getElementById("teamName1").innerText,
            teamLogo: document.getElementById("teamLogo1").src,
            score: document.getElementById("score1").innerText,
            goalscored: scoreboardData.team1.goalscored,
            penalty: scoreboardData.team1.penalty,  // Neue Variable für Strafzeiten
            penaltyTimeDisplay1_1: document.getElementById("penaltyTimeDisplay1-1").innerText,
            penaltyTimeDisplay1_2: document.getElementById("penaltyTimeDisplay1-2").innerText
        },
        team2: {
            teamName: document.getElementById("teamName2").innerText,
            teamLogo: document.getElementById("teamLogo2").src,
            score: document.getElementById("score2").innerText,
            goalscored: scoreboardData.team2.goalscored,
            penalty: scoreboardData.team2.penalty,  // Neue Variable für Strafzeiten
            penaltyTimeDisplay2_1: document.getElementById("penaltyTimeDisplay2-1").innerText,
            penaltyTimeDisplay2_2: document.getElementById("penaltyTimeDisplay2-2").innerText
        },
        championshipText: document.getElementById("championshipText").innerText,
        period: document.getElementById("period").innerText,
        minutes: document.getElementById("minutes").innerText,
        seconds: document.getElementById("seconds").innerText
    };

    // Beispiel: Annahme, dass die PHP-Datei im übergeordneten Verzeichnis liegt
    const phpFilePath = '../data.php';

    // Verwende den Pfad, wo immer die PHP-Datei benötigt wird
    fetch(phpFilePath, {
        method: 'POST',
        body: JSON.stringify(data)
    })
    .then(response => response.text())
    .then(responseText => console.log(responseText));
    }

    // Funktion, um das Spiel zurückzusetzen
    function resetGame() {
        // Zurücksetzen der Timer und Strafzeiten
        resetTimer();

        // Zurücksetzen der Punktestände
        document.getElementById('score1').innerText = '0';
        document.getElementById('score2').innerText = '0';

        // Zurücksetzen der Teamnamen-Inputfelder und Platzhalter
        resetTeamNameInput(1);
        resetTeamNameInput(2);

        // Zurücksetzen der Teamlogos zu den Standardlogos und Pfaden
        resetTeamLogo(1);
        resetTeamLogo(2);

        // Zurücksetzen der Championship-Eingabe und Anzeige
        const championshipInput = document.getElementById("championship");
        championshipInput.value = "";
        const championshipText = document.getElementById("championshipText");
        championshipText.innerText = "N/A";

        // Zurücksetzen der Periodenanzeige
        const periodElement = document.getElementById('period');
        periodElement.innerText = '1st Period';

        // Setzen der maximalen Zeit auf den Standardwert
        maxTime = 20;
        document.getElementById('maxTime').value = maxTime;

        // Zurücksetzen der Anzeige für Minuten und Sekunden
        document.getElementById('minutes').innerText = '00';
        document.getElementById('seconds').innerText = '00';
    }

    // Funktion zum Zurücksetzen des Teamnamen-Inputfelds und Platzhalters
    function resetTeamNameInput(team) {
        const teamNameInput = document.getElementById(`teamNameInput${team}`);
        teamNameInput.value = "";
        teamNameInput.placeholder = "Teamname";
    }

    // Funktion zum Zurücksetzen des Teamlogos zu Standardlogo und Pfad
    function resetTeamLogo(team) {
        const logoInput = document.getElementById(`teamLogoInput${team}`);
        logoInput.value = "";  // Lösche die ausgewählte Datei im Inputfeld
        const logoImage = document.getElementById(`teamLogo${team}`);
        logoImage.src = "Bilder/default.jpg"; // Hier "default-logo.png" durch deinen Standard-Logo-Pfad ersetzen
    }

    // Rufe die resetGame-Funktion auf, wenn das Spiel zurückgesetzt werden soll
    resetGame();
    
        // Setze die Anzeige der JSON-Daten zurück
        exportScoreboardData();

// Rufen Sie die Funktion alle Sekunde auf, um die Daten zu exportieren
setInterval(exportScoreboardData, 100);

// Initialer Aufruf der Funktion
exportScoreboardData();

// Event-Handler für die Funktionstasten
document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case 'F1':
            incrementScore(1);
            break;
        case 'F2':
            incrementScore(2);
            break;
        case 'F3':
            decrementScore(1);
            break;
        case 'F4':
            decrementScore(2);
            break;
        case 'F5':
            startStopTimer();
            break;
        case 'F6':
            resetTimer();
            break;
        case 'F7':
            changePeriod('-');
            break;
        case 'F8':
            changePeriod('+');
            break;
        case 'F9':
            break;
        case 'F10':
            break;
        case 'F11':
            break;
        case 'F12':
            break;
        default:
            break;
    }

    document.getElementById('resetButton').addEventListener('click', resetGame);

});

function convertExcelToJson() {
    var fileInput = document.getElementById('excel-file');
    var file = fileInput.files[0];

    if (file) {
        var formData = new FormData();
        formData.append('excel-file', file);

        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'convert.php', true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                document.getElementById('output').innerHTML = xhr.responseText;
            }
        };

        xhr.send(formData);
    } else {
        alert('Please select an Excel file.');
    }
}