# OneClick-Komplettreparatur-PowerShell7-v5.1
Ein OneClick Reparatur Programm das Windows Dateien und Installierte Dateien Überprüft und repariert/Updatet. 

README – OneClick-Komplettreparatur für PowerShell 7
==========================================================

Programmversion: 5.1
Dateiname:
OneClick-Komplettreparatur-PowerShell7-v5.1.ps1

Stand: 31. Juli 2026


1. PROGRAMMBESCHREIBUNG
-----------------------

Die OneClick-Komplettreparatur ist eine einzelne PowerShell-Datei zur automatischen
Prüfung, Aktualisierung und Reparatur von Windows sowie unterstützten installierten
Programmen.

Das Skript führt – abhängig von der jeweiligen Windows-Konfiguration – unter anderem
folgende Schritte aus:

- Prüfung der Startvoraussetzungen und Administratorrechte
- Suche nach PowerShell 7
- Installation von PowerShell 7 aus offiziellen Quellen, falls PowerShell 7 fehlt
- automatischer Neustart des Hauptprogramms unter PowerShell 7
- interner Laufzeit-Selbsttest
- Anforderung eines Windows-Wiederherstellungspunktes
- Inventarisierung installierter Programme aus der Windows-Registry
- Prüfung und gegebenenfalls Reparatur von WinGet
- Verifizierung der offiziellen WinGet- und Microsoft-Store-Quellen
- Aktualisierung unterstützter Programme
- Reparatur von Programmen, deren Installationspaket eine Reparaturfunktion unterstützt
- Reparatur des Windows-Komponentenspeichers mit DISM
- Prüfung und Reparatur geschützter Windows-Systemdateien mit SFC
- Onlineprüfung des Dateisystems mit CHKDSK
- Erstellung von Protokollen, Inventarlisten und Abschlussberichten
- Anzeige eines prozentualen Gesamtfortschritts von 0 bis 100 Prozent

Wichtig:
Nicht jedes installierte Programm unterstützt eine vollautomatische Aktualisierung
oder Reparatur. Einige Programme können eine Benutzereingabe, das Schließen laufender
Anwendungen oder einen Windows-Neustart verlangen.


2. SYSTEMVORAUSSETZUNGEN
------------------------

- Windows 10 oder Windows 11
- funktionierende Internetverbindung
- Administratorrechte
- ausreichend freier Speicherplatz
- aktivierte Windows-Systemdienste für Installationen und Updates
- möglichst keine gleichzeitig laufenden Installationsprogramme
- geöffnete Dokumente und Arbeiten müssen vorher gespeichert werden

PowerShell 7 muss nicht zwingend bereits installiert sein. Das Skript versucht,
PowerShell 7 bei Bedarf aus einer offiziellen Quelle bereitzustellen und startet
anschließend automatisch erneut unter PowerShell 7.


3. WICHTIG: HERUNTERGELADENE DATEI ZULASSEN
-------------------------------------------

Windows kann eine aus dem Internet heruntergeladene PS1-Datei aus Sicherheitsgründen
blockieren. Die beigefügten Screenshots zeigen den entsprechenden Hinweis in den
Dateieigenschaften.

Gehen Sie vor dem ersten Start wie folgt vor:

1. Klicken Sie mit der rechten Maustaste auf
   „OneClick-Komplettreparatur-PowerShell7-v5.1.ps1“.

2. Wählen Sie „Eigenschaften“.

3. Öffnen Sie den Reiter „Allgemein“.

4. Suchen Sie unten im Fenster den Bereich „Sicherheit“.

5. Aktivieren Sie das Kontrollkästchen „Zulassen“.

6. Klicken Sie zuerst auf „Übernehmen“.

7. Klicken Sie anschließend auf „OK“.

Damit wird die Windows-Downloadblockierung für diese Datei aufgehoben.

Hinweis:
Wird der Bereich „Sicherheit“ beziehungsweise das Kontrollkästchen „Zulassen“ nicht
angezeigt, ist die Datei bereits freigegeben oder wurde von Windows nicht blockiert.

Aktivieren Sie „Zulassen“ nur, wenn Sie die Datei aus einer Quelle bezogen haben, der
Sie vertrauen.


4. PROGRAMM KORREKT STARTEN
---------------------------

Empfohlene Startmethode:

1. Speichern Sie alle geöffneten Dokumente.

2. Schließen Sie möglichst alle laufenden Programme, insbesondere Programme, die
   aktualisiert oder repariert werden sollen.

3. Stellen Sie eine stabile Internetverbindung sicher.

4. Klicken Sie mit der rechten Maustaste auf
   „OneClick-Komplettreparatur-PowerShell7-v5.1.ps1“.

5. Wählen Sie „Mit PowerShell ausführen“.

6. Bestätigen Sie die Windows-Benutzerkontensteuerung mit „Ja“.

7. Lassen Sie das PowerShell-Fenster geöffnet, bis der Abschlussbericht angezeigt
   wird.

Wichtiger Hinweis zum Startfenster:

Windows kann die Datei zunächst kurz mit „Windows PowerShell 5.1“ öffnen. Das ist
bei diesem Skript beabsichtigt und kein Fehler. Dieser erste Start dient nur dazu,
PowerShell 7 zu finden oder bei Bedarf zu installieren.

Anschließend startet sich das Reparaturprogramm automatisch erneut unter PowerShell 7.
Im Hauptfenster sollte dann sinngemäß Folgendes angezeigt werden:

- „PowerShell: 7.x“
- „Edition: Core“
- Fenstertitel: „OneClick Komplettreparatur – PowerShell 7“

Die eigentliche Reparatur wird erst in diesem PowerShell-7-Hauptlauf ausgeführt.


5. DIREKTER START ÜBER POWERSHELL 7
-----------------------------------

Falls „Mit PowerShell ausführen“ nicht angezeigt wird oder die Dateizuordnung
ungeeignet ist, kann das Skript direkt über PowerShell 7 gestartet werden.

1. Öffnen Sie Windows Terminal oder PowerShell 7 als Administrator.

2. Führen Sie folgenden Befehl aus und passen Sie den Pfad bei Bedarf an:

pwsh.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "C:\Users\BENUTZERNAME\Downloads\OneClick-Komplettreparatur-PowerShell7-v5.1.ps1"

Ersetzen Sie „BENUTZERNAME“ durch den Namen Ihres Windows-Benutzerkontos.

Alternativ können Sie die PS1-Datei in das geöffnete Terminalfenster ziehen. Dadurch
wird der vollständige Dateipfad eingefügt. Setzen Sie den Pfad anschließend in
Anführungszeichen.


6. VERHALTEN WÄHREND DER REPARATUR
----------------------------------

- Das Programm darf während des Laufs nicht geschlossen werden.
- Der Computer sollte nicht ausgeschaltet werden.
- Die Internetverbindung sollte nicht getrennt werden.
- DISM und SFC können längere Zeit bei derselben Anzeige stehen bleiben.
- Auch einzelne Programmaktualisierungen können mehrere Minuten dauern.
- Der Fortschrittsbalken zeigt den Gesamtfortschritt des Skripts an. Er ist keine
  minutengenaue Zeitangabe.
- Bei geöffneten Programmen können einzelne Updates übersprungen werden.
- Ein Neustart kann nach Abschluss erforderlich sein.
- Das Skript startet Windows nicht automatisch neu.


7. PROTOKOLLE UND ERGEBNISSE
----------------------------

Die Protokolle und Berichte werden standardmäßig in folgendem Ordner gespeichert:

C:\ProgramData\OneClick-ProgrammReparatur

Dort können unter anderem folgende Dateien erstellt werden:

- Reparatur-<Zeitstempel>.log
- Transcript-<Zeitstempel>.txt
- Installierte-Programme-<Zeitstempel>.csv
- WinGet-Inventar-<Zeitstempel>.json
- Ergebnis-<Zeitstempel>.csv
- Zusammenfassung-<Zeitstempel>.txt

Der Ordner „ProgramData“ ist standardmäßig ausgeblendet. Sie können den vollständigen
Pfad direkt in die Adressleiste des Windows-Explorers eingeben.


8. BEDEUTUNG DER ABSCHLUSSMELDUNGEN
-----------------------------------

Erfolgreich abgeschlossen:
Der Gesamtlauf wurde ohne erkannte Warnungen beendet.

Mit Warnungen abgeschlossen:
Der Hauptlauf wurde beendet, aber mindestens ein Update, eine Programmreparatur oder
ein Windows-Schritt konnte nicht vollständig ausgeführt werden. Einzelheiten stehen
im Protokoll und in der Zusammenfassung.

Mit einem Fehler beendet:
Ein für den weiteren Ablauf notwendiger Schritt ist fehlgeschlagen. Prüfen Sie in
diesem Fall zuerst die neueste Protokolldatei im oben genannten Protokollordner.


9. HÄUFIGE STARTPROBLEME
------------------------

Problem:
Die Datei wird nur im Editor geöffnet.

Lösung:
Starten Sie die Datei nicht per Doppelklick. Verwenden Sie den Rechtsklick und
„Mit PowerShell ausführen“ oder den direkten Startbefehl aus Abschnitt 5.


Problem:
Windows meldet, dass die Ausführung von Skripts deaktiviert ist.

Lösung:
Entsperren Sie die Datei wie in Abschnitt 3 beschrieben und starten Sie sie über den
Befehl aus Abschnitt 5 mit „-ExecutionPolicy Bypass“. Die globale Windows-
Ausführungsrichtlinie muss dafür nicht dauerhaft geändert werden.


Problem:
Das Fenster verschwindet sofort.

Lösung:
Starten Sie PowerShell 7 beziehungsweise Windows Terminal als Administrator und führen
Sie den Befehl aus Abschnitt 5 aus. Dadurch bleibt die Fehlermeldung sichtbar.


Problem:
PowerShell 7 wird nicht gefunden.

Lösung:
Prüfen Sie die Internetverbindung und starten Sie das Skript erneut als Administrator.
Das Skript versucht, PowerShell 7 aus offiziellen Quellen zu installieren.


Problem:
Ein Programm konnte nicht aktualisiert oder repariert werden.

Lösung:
Schließen Sie das betreffende Programm und starten Sie die OneClick-Komplettreparatur
erneut. Manche Programme unterstützen keine stille Aktualisierung oder automatische
Reparatur. Prüfen Sie zusätzlich die Abschlusszusammenfassung.


Problem:
WinGet meldet, dass kein passendes Paket gefunden wurde.

Lösung:
Dies kann bei Programmen vorkommen, die nicht über WinGet installiert wurden oder
deren Paketkennung nicht mehr mit der installierten Version übereinstimmt. Windows-
Reparatur, Inventarisierung und andere verfügbare Programmschritte können trotzdem
fortgesetzt werden.


10. SICHERHEITSHINWEISE
-----------------------

- Erstellen Sie vor umfangreichen Systemänderungen zusätzlich eine eigene
  Datensicherung wichtiger Dateien.
- Unterbrechen Sie DISM oder SFC nicht gewaltsam.
- Verwenden Sie das Skript nur auf einem Windows-System, für das Sie
  Administratorrechte besitzen.
- Laden Sie veränderte Versionen des Skripts nicht aus unbekannten Quellen herunter.
- Deaktivieren Sie Windows Defender oder andere Sicherheitsprogramme nicht dauerhaft.
- Warnungen sollten anhand der erzeugten Protokolle geprüft werden.
- Eine automatische Reparatur kann nicht garantieren, dass jedes Drittanbieterprogramm
  auf jeder Windows-Konfiguration vollständig repariert werden kann.


11. EMPFOHLENER ABLAUF
----------------------

1. Datei herunterladen.
2. Dateieigenschaften öffnen.
3. „Zulassen“ aktivieren.
4. „Übernehmen“ und danach „OK“ anklicken.
5. Geöffnete Programme schließen.
6. Datei mit „Mit PowerShell ausführen“ starten.
7. Administratorabfrage bestätigen.
8. Den vollständigen Lauf abwarten.
9. Abschlussmeldung und Protokolle prüfen.
10. Windows neu starten, wenn das Programm einen Neustart empfiehlt.


Ende der README
