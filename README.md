# OneClick-Komplettreparatur für Windows 10/11
Ein OneClick Reparatur Programm das Windows Dateien und Installierte Dateien Überprüft und repariert/Updatet.

An diesem Programm wird weitergearbeitet und neue verbesserte Versionen werden weiter erscheinen.

README – OneClick-Komplettreparatur
==========================================================

Programmversion: 5.9.0
Hauptdatei: OneClick-Komplettreparatur-v5.9.ps1
Stand: 31. Juli 2026
Quellcodezeilen: 3627
SHA-256 der PowerShell-Datei:
326C5A1CB6CB23D8375ABEE65AAE1BB17B2F7F898E16CFD51514AD13CD7F2E94


1. BESCHREIBUNG
---------------

Die OneClick-Komplettreparatur ist ein PowerShell-Skript für Windows, das zentrale
Windows-Komponenten sowie unterstützte installierte Programme prüft, aktualisiert
und repariert.

Das Skript ist mit Windows PowerShell 5.1 startbar. Die eigentliche Reparaturphase
wird anschließend mit PowerShell 7 und Administratorrechten ausgeführt. Ist
PowerShell 7 nicht vorhanden, versucht das Programm, PowerShell 7 aus offiziellen
Quellen bereitzustellen und startet sich danach automatisch unter PowerShell 7 neu.


2. ENTHALTENE FUNKTIONEN
------------------------

Die Version 5.9.0 enthält – abhängig von der jeweiligen Windows-Konfiguration –
unter anderem folgende Funktionen:

- Prüfung des Betriebssystems und der Administratorrechte
- Suche nach einer vorhandenen PowerShell-7-Installation
- Bereitstellung von PowerShell 7 aus offiziellen Quellen, falls erforderlich
- automatischer Neustart des Skripts unter PowerShell 7
- interner Laufzeit-Selbsttest
- Anforderung eines Windows-Wiederherstellungspunktes
- Inventarisierung installierter Programme
- Prüfung und gegebenenfalls Reparatur von WinGet
- Verifizierung der offiziellen WinGet- und Microsoft-Store-Quellen
- automatische Suche nach verfügbaren Programmaktualisierungen
- automatische Installation unterstützter Programmaktualisierungen
- Reparatur unterstützter Programme über WinGet
- abgesicherter Download benötigter Installationsdateien nach einer
  fehlgeschlagenen oder nicht unterstützten Reparatur
- abgesicherter Neuinstallationsversuch über die exakte WinGet-Paketkennung
- Reparatur des Windows-Komponentenspeichers mit DISM
- Prüfung und Reparatur geschützter Windows-Systemdateien mit SFC
- Onlineprüfung des Dateisystems mit CHKDSK
- Erstellung von Protokollen, Inventarlisten und Abschlussberichten
- Anzeige eines Gesamtfortschritts von 0 bis 100 Prozent


3. SYSTEMVORAUSSETZUNGEN
------------------------

- Windows 10 oder Windows 11
- Administratorrechte
- funktionierende Internetverbindung
- ausreichend freier Speicherplatz
- aktivierte Windows-Dienste für Installationen und Aktualisierungen
- möglichst keine gleichzeitig laufenden Installationsprogramme
- gespeicherte Dokumente und nach Möglichkeit geschlossene Anwendungen

PowerShell 7 muss nicht zwingend bereits installiert sein. Das Skript versucht,
PowerShell 7 bei Bedarf aus einer offiziellen Quelle bereitzustellen.


4. DATEI VOR DEM ERSTEN START ENTSPERREN
----------------------------------------

Windows kann eine aus dem Internet heruntergeladene PowerShell-Datei blockieren.
Gehen Sie deshalb vor dem ersten Start folgendermaßen vor:

1. Klicken Sie mit der rechten Maustaste auf
   „OneClick-Komplettreparatur-v5.9.ps1“.

2. Wählen Sie „Eigenschaften“.

3. Öffnen Sie den Reiter „Allgemein“.

4. Suchen Sie unten im Fenster den Bereich „Sicherheit“.

5. Aktivieren Sie das Kontrollkästchen „Zulassen“.

6. Klicken Sie auf „Übernehmen“.

7. Klicken Sie anschließend auf „OK“.

Wird der Bereich „Sicherheit“ oder das Kontrollkästchen „Zulassen“ nicht angezeigt,
ist die Datei bereits entsperrt oder wurde von Windows nicht blockiert.

Aktivieren Sie „Zulassen“ nur, wenn Sie der Herkunft der Datei vertrauen.


5. PROGRAMM KORREKT STARTEN
---------------------------

Empfohlene Startmethode:

1. Speichern Sie alle geöffneten Dokumente.

2. Schließen Sie möglichst alle Programme, die aktualisiert oder repariert werden
   könnten.

3. Stellen Sie eine stabile Internetverbindung sicher.

4. Klicken Sie mit der rechten Maustaste auf
   „OneClick-Komplettreparatur-v5.9.ps1“.

5. Wählen Sie „Mit PowerShell ausführen“.

6. Bestätigen Sie die Windows-Benutzerkontensteuerung mit „Ja“.

7. Lassen Sie das PowerShell-Fenster geöffnet, bis die Abschlussmeldung erscheint.

Windows kann die Datei zunächst kurz mit Windows PowerShell 5.1 öffnen. Das ist bei
diesem Skript beabsichtigt und kein Fehler. Dieser erste Lauf prüft PowerShell 7 und
startet die eigentliche Reparatur anschließend automatisch unter PowerShell 7.

Im PowerShell-7-Hauptlauf sollte sinngemäß Folgendes angezeigt werden:

- PowerShell-Version 7.x
- Edition „Core“
- Administratorstatus „True“
- Skriptversion 5.9.0
- Fenstertitel „OneClick Komplettreparatur – PowerShell 7“


6. DIREKTER START ÜBER POWERSHELL 7
-----------------------------------

Falls der Menüpunkt „Mit PowerShell ausführen“ nicht verfügbar ist:

1. Öffnen Sie Windows Terminal oder PowerShell 7 als Administrator.

2. Führen Sie folgenden Befehl aus:

pwsh.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "C:\Pfad\OneClick-Komplettreparatur-v5.9.ps1"

Ersetzen Sie „C:\Pfad“ durch den tatsächlichen Speicherort der Datei.

Sie können die PS1-Datei auch in das geöffnete Terminalfenster ziehen. Dadurch wird
der vollständige Dateipfad eingefügt. Setzen Sie den Pfad anschließend in
Anführungszeichen.


7. AUTOMATISCHE PROGRAMMAKTUALISIERUNGEN
----------------------------------------

Das Skript ermittelt verfügbare Aktualisierungen aus verifizierten offiziellen
WinGet- und Microsoft-Store-Quellen.

Erkannte Aktualisierungen werden nach Möglichkeit automatisch und ohne Rückfragen
installiert. Vorübergehende Netzwerk-, Dienst- oder Quellenfehler können einmal
erneut versucht werden.

Nicht jedes Programm lässt sich vollständig automatisch aktualisieren. Gründe
können unter anderem sein:

- Das Programm ist nicht eindeutig über WinGet erkennbar.
- Das Programm unterstützt keine stille Installation.
- Eine Benutzeraktion ist erforderlich.
- Ein Neustart ist vor der Aktualisierung erforderlich.
- Das Programm ist geöffnet.
- Eine Hersteller- oder Sicherheitsrichtlinie verhindert die Aktualisierung.


8. REPARATUR, DOWNLOAD UND NEUINSTALLATION
------------------------------------------

Für geeignete Programme gilt folgender Ablauf:

1. WinGet versucht eine unterstützte Programmreparatur.

2. Schlägt die Reparatur fehl oder wird sie nicht unterstützt, prüft das Skript,
   ob ein sicherer Neuinstallationsfallback zulässig ist.

3. Paketkennung, Quelle, Installationsbereich und Installationsstatus werden
   überprüft.

4. Die benötigten Installationsdateien werden über WinGet heruntergeladen.

5. Downloadordner, Dateipfade, Dateitypen und Dateigrößen werden kontrolliert.

6. Für heruntergeladene Dateien werden SHA-256-Prüfsummen erstellt.

7. Die heruntergeladene Installationsdatei wird nicht direkt vom Skript gestartet.

8. Die Neuinstallation wird erneut über WinGet mit exakter Paketkennung,
   verifizierter Quelle und dem ermittelten Installationsbereich ausgeführt.

9. Nach einem gemeldeten Erfolg kontrolliert das Skript erneut, ob das Paket
   installiert ist.

Es findet keine automatische Deinstallation statt. Die Neuinstallation ist ein
abgesicherter Installationsversuch über WinGet. Das tatsächliche Verhalten hängt vom
jeweiligen Hersteller-Installer ab.


9. SICHERHEITSAUSSCHLÜSSE
-------------------------

Bestimmte sicherheitskritische oder systemnahe Pakete werden nicht automatisch
repariert oder neu installiert. Dazu können unter anderem gehören:

- Treiber, Firmware und BIOS
- Antiviren- und Endpoint-Sicherheitssoftware
- VPN-Software und Sicherheitsagenten
- NVIDIA-, AMD-, Intel- und Realtek-Treiberpakete
- VirtualBox, VMware, Hyper-V, Docker Desktop und WSL
- PowerShell
- Microsoft App Installer
- Windows Terminal

Diese Ausschlüsse sollen Startprobleme, Netzwerkausfälle, Datenverlust oder
Beschädigungen systemnaher Komponenten vermeiden.


10. FORTSCHRITTSANZEIGE
-----------------------

Das Programm zeigt einen textbasierten Gesamtfortschritt von 0 bis 100 Prozent an.

Der Prozentwert beschreibt den Fortschritt des gesamten Ablaufs. Er ist keine genaue
Zeitangabe. DISM, SFC, CHKDSK und einzelne Hersteller-Installer können längere Zeit
bei demselben Prozentwert stehen bleiben, obwohl sie weiterhin arbeiten.


11. PROTOKOLLE UND ERGEBNISSE
-----------------------------

Die Protokolle und Berichte werden standardmäßig in folgendem Ordner gespeichert:

C:\ProgramData\OneClick-ProgrammReparatur

Dort können unter anderem folgende Dateien oder Ordner entstehen:

- Reparatur-<Laufkennung>.log
- Transcript-<Laufkennung>.txt
- Installierte-Programme-<Zeitstempel>.csv
- WinGet-Inventar-<Zeitstempel>.json
- Ergebnis-<Zeitstempel>.csv
- Zusammenfassung-<Zeitstempel>.txt
- Installationsdateien-<Laufkennung>
- SHA256SUMS.txt

Der Ordner „ProgramData“ ist standardmäßig ausgeblendet. Geben Sie den vollständigen
Pfad direkt in die Adressleiste des Windows-Explorers ein.


12. VERHALTEN WÄHREND DES LAUFS
-------------------------------

- Schließen Sie das PowerShell-Fenster nicht.
- Schalten Sie den Computer nicht aus.
- Trennen Sie die Internetverbindung nicht.
- Starten Sie keine weitere Installation gleichzeitig.
- Unterbrechen Sie DISM oder SFC nicht gewaltsam.
- Einzelne Reparatur- oder Updatevorgänge können mehrere Minuten dauern.
- Das Skript startet Windows nicht automatisch neu.
- Starten Sie Windows nach Abschluss neu, wenn dies empfohlen wird.


13. ABSCHLUSSMELDUNGEN
----------------------

„Erfolgreich abgeschlossen“
Der Lauf wurde ohne erkannte Warnungen beendet.

„Mit Warnungen abgeschlossen“
Der Lauf wurde beendet, aber mindestens ein Update, eine Reparatur, ein Download
oder eine Neuinstallation konnte nicht vollständig ausgeführt werden. Prüfen Sie
die Protokolle und die Zusammenfassung.

„Mit einem Fehler beendet“
Ein für den weiteren Ablauf notwendiger Schritt ist fehlgeschlagen. Öffnen Sie die
neueste Protokolldatei im Protokollordner.


14. HÄUFIGE PROBLEME
--------------------

Problem:
Die Datei wird nur im Texteditor geöffnet.

Lösung:
Verwenden Sie den Rechtsklick und „Mit PowerShell ausführen“ oder starten Sie die
Datei mit dem Befehl aus Abschnitt 6.


Problem:
Windows meldet, dass Skripts nicht ausgeführt werden dürfen.

Lösung:
Entsperren Sie die Datei wie in Abschnitt 4 beschrieben und verwenden Sie den
Startbefehl mit „-ExecutionPolicy Bypass“.


Problem:
Das Fenster schließt sich sofort.

Lösung:
Öffnen Sie PowerShell 7 oder Windows Terminal als Administrator und starten Sie das
Skript mit dem vollständigen Befehl aus Abschnitt 6. Dadurch bleibt die
Fehlermeldung sichtbar.


Problem:
PowerShell 7 oder WinGet kann nicht bereitgestellt werden.

Lösung:
Prüfen Sie Internetverbindung, Windows-Dienste, Datum, Uhrzeit und
Administratorrechte. Starten Sie das Skript anschließend erneut.


Problem:
Der interne Selbsttest schlägt fehl.

Lösung:
Verwenden Sie ausschließlich die aktuelle, unveränderte Version 5.9. Prüfen Sie den
angezeigten Skriptpfad und die Versionsnummer. Löschen Sie ältere Kopien aus dem
Downloadordner, damit nicht versehentlich eine frühere Datei gestartet wird.


Problem:
Ein Programm konnte nicht aktualisiert, repariert oder neu installiert werden.

Lösung:
Schließen Sie das betreffende Programm und prüfen Sie die neueste Zusammenfassung
sowie die Protokolldatei. Manche Hersteller-Installer unterstützen keinen vollständig
unbeaufsichtigten Ablauf.


15. SICHERHEITSHINWEISE
-----------------------

- Erstellen Sie zusätzlich eine eigene Datensicherung wichtiger Dateien.
- Verwenden Sie das Skript nur auf einem Windows-System, für das Sie
  Administratorrechte besitzen.
- Verwenden Sie keine veränderten Kopien aus unbekannten Quellen.
- Deaktivieren Sie Windows Defender oder andere Schutzprogramme nicht dauerhaft.
- Prüfen Sie Warnungen und fehlgeschlagene Vorgänge anhand der Protokolle.
- Eine automatische Reparatur oder Neuinstallation kann nicht garantieren, dass
  jedes Drittanbieterprogramm auf jeder Windows-Konfiguration vollständig
  wiederhergestellt wird.


16. EMPFOHLENER ABLAUF
----------------------

1. PS1-Datei herunterladen.
2. Dateieigenschaften öffnen.
3. „Zulassen“ aktivieren.
4. „Übernehmen“ und „OK“ anklicken.
5. Wichtige Daten sichern.
6. Geöffnete Programme schließen.
7. Datei mit „Mit PowerShell ausführen“ starten.
8. Administratorabfrage bestätigen.
9. Den vollständigen Lauf abwarten.
10. Abschlussmeldung und Protokolle prüfen.
11. Windows neu starten, wenn das Programm einen Neustart empfiehlt.


Ende der README
****
