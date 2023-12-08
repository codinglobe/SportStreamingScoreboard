<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Pfad zur JSON-Datei
    $jsonFilePath = dirname(__FILE__) . '/scoreboard_data.json';

    try {
        // Speichern der empfangenen Daten in die JSON-Datei
        file_put_contents($jsonFilePath, json_encode($data));

        echo "Daten erfolgreich gespeichert.";
    } catch (Exception $e) {
        // Pfad zur Fehlerprotokoll-Datei
        $errorLogFilePath = dirname(__FILE__) . '/error.txt';

        // Schreibe die Fehlermeldung in das Fehlerprotokoll
        file_put_contents($errorLogFilePath, 'Fehler beim Speichern der Daten: ' . $e->getMessage(), FILE_APPEND);

        echo "Fehler beim Speichern der Daten.";
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['excel-file'])) {
    $file = $_FILES['excel-file'];

    if ($file['error'] === UPLOAD_ERR_OK) {
        // Hier können direkt die empfangenen Daten verwendet werden
        $excelData = json_decode(file_get_contents('php://input'), true);

        $jsonFilePath = 'team_aufstellung.json';

        // Save to JSON file
        file_put_contents($jsonFilePath, json_encode($excelData, JSON_PRETTY_PRINT));

        echo '<p>Conversion successful. <a href="' . $jsonFilePath . '">Download JSON</a></p>';
    } else {
        echo '<p>Error uploading file. Please try again.</p>';
    }
} else {
    echo '<p>Invalid request.</p>';
}
?>
