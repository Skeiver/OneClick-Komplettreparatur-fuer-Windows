# OneClick-Komplettreparatur für Windows 10/11
Ein OneClick Reparatur Programm das Windows Dateien und Installierte Dateien/Programme überprüft, beschädigte Programme repariert/neuinstalliert und Updatet.

An diesem Programm wird weitergearbeitet und neue verbesserte Versionen werden weiter erscheinen.

README – OneClick-Komplettreparatur
==========================================================

Programmversion: 6.2.0
Hauptdatei: OneClick-Komplettreparatur-v6.2.ps1
Stand: 31. Juli 2026
Quellcodezeilen: 4619
Funktionen: 91
SHA-256 der PowerShell-Datei:
26C5B5340F3388FAE270540C0DEE23A5517F3B2CC61DC77A9FBF13B0A3F71A82


1. PROGRAMMBESCHREIBUNG
-----------------------

Die OneClick-Komplettreparatur ist ein PowerShell-Skript für Windows, das
Windows-Komponenten sowie sicher erkennbare installierte Programme inventarisiert,
prüft, aktualisiert und – soweit technisch unterstützt – repariert oder erneut
installiert.

Das Skript kann zunächst unter Windows PowerShell 5.1 gestartet werden. Die
eigentliche Reparaturphase wird anschließend mit PowerShell 7 und
Administratorrechten ausgeführt. Ist PowerShell 7 nicht vorhanden, versucht das
Skript, PowerShell 7 aus offiziellen Quellen bereitzustellen und startet sich danach
automatisch erneut.


2. WICHTIGE FUNKTIONEN
----------------------

Die Version 6.2.0 enthält unter anderem folgende Funktionen:

- Prüfung von Windows und Administratorrechten
- Suche nach PowerShell 7
- Bereitstellung von PowerShell 7 aus offiziellen Quellen
- automatischer Neustart unter PowerShell 7
- interner Laufzeit-Selbsttest
- Anforderung eines Windows-Wiederherstellungspunktes
- Inventarisierung installierter Programme aus mehreren Registry-Bereichen
- Erfassung von 32-Bit-, 64-Bit- und Benutzerprogrammen
- Erkennung von MSI-Produktcodes
- Prüfung und gegebenenfalls Reparatur von WinGet
- Verifizierung der offiziellen Quellen „winget“ und „msstore“
- getrennte Updateprüfung für Benutzer- und Computerinstallationen
- automatische Einzelaktualisierung eindeutig erkannter Pakete
- Integritätsprüfung registrierter Programmdateien und Installationspfade
- MSI-Reparatur über den Windows Installer
- WinGet-Reparatur mit exakter Paket-ID, Quelle und Installationsbereich
- Download benötigter Installationsdateien nach fehlgeschlagener Reparatur
- Prüfung von Downloadpfad, Dateityp, Dateigröße und SHA-256-Prüfsummen
- abgesicherte In-Place-Neuinstallation über WinGet
- Online-Neuinstallation geeigneter Microsoft-Store-Pakete
- Reparatur des Windows-Komponentenspeichers mit DISM
- Prüfung und Reparatur geschützter Windows-Dateien mit SFC
- Dateisystemprüfung mit CHKDSK
- Erstellung von Protokollen, Inventaren und Abschlussberichten
- textbasierte Fortschrittsanzeige von 0 bis 100 Prozent


3. SYSTEMVORAUSSETZUNGEN
------------------------

- Windows 10 oder Windows 11
- Administratorrechte
- funktionierende Internetverbindung
- ausreichend freier Speicherplatz
- funktionierende Windows-Dienste für Installationen und Aktualisierungen
- möglichst keine gleichzeitig laufenden Installationsprogramme
- gespeicherte Dokumente
- nach Möglichkeit geschlossene Programme

PowerShell 7 muss nicht zwingend bereits installiert sein.


4. DATEI VOR DEM ERSTEN START ENTSPERREN
----------------------------------------

Windows kann heruntergeladene PowerShell-Dateien aus Sicherheitsgründen blockieren.

Gehen Sie vor dem ersten Start folgendermaßen vor:

1. Klicken Sie mit der rechten Maustaste auf
   „OneClick-Komplettreparatur-v6.2.ps1“.

2. Wählen Sie „Eigenschaften“.

3. Öffnen Sie den Reiter „Allgemein“.

4. Suchen Sie unten den Bereich „Sicherheit“.

5. Aktivieren Sie „Zulassen“.

6. Klicken Sie auf „Übernehmen“.

7. Klicken Sie anschließend auf „OK“.

Wird „Zulassen“ nicht angezeigt, ist die Datei bereits entsperrt oder wurde von
Windows nicht blockiert.


5. PROGRAMM KORREKT STARTEN
---------------------------

Empfohlene Startmethode:

1. Speichern Sie alle geöffneten Dokumente.

2. Schließen Sie Programme, die aktualisiert oder repariert werden könnten.

3. Stellen Sie eine stabile Internetverbindung sicher.

4. Klicken Sie mit der rechten Maustaste auf
   „OneClick-Komplettreparatur-v6.2.ps1“.

5. Wählen Sie „Mit PowerShell ausführen“.

6. Bestätigen Sie die Windows-Benutzerkontensteuerung mit „Ja“.

7. Lassen Sie das PowerShell-Fenster geöffnet, bis die Abschlussmeldung erscheint.

Windows kann das Skript zunächst kurz mit Windows PowerShell 5.1 öffnen. Das ist
beabsichtigt. Dieser erste Lauf prüft PowerShell 7 und startet anschließend den
eigentlichen Hauptlauf unter PowerShell 7.

Im Hauptlauf sollte sinngemäß Folgendes angezeigt werden:

- PowerShell-Version 7.x
- Edition „Core“
- Administratorstatus „True“
- Skriptversion 6.2.0
- Fenstertitel „OneClick Komplettreparatur – PowerShell 7“


6. DIREKTER START ÜBER POWERSHELL 7
-----------------------------------

Falls „Mit PowerShell ausführen“ nicht angezeigt wird:

1. Öffnen Sie Windows Terminal oder PowerShell 7 als Administrator.

2. Führen Sie folgenden Befehl aus:

pwsh.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "C:\Pfad\OneClick-Komplettreparatur-v6.2.ps1"

Ersetzen Sie „C:\Pfad“ durch den tatsächlichen Speicherort der Datei.

Sie können die PS1-Datei auch in das Terminalfenster ziehen. Dadurch wird der
vollständige Pfad eingefügt. Setzen Sie den Pfad anschließend in Anführungszeichen.


7. PROGRAMMINVENTAR UND INTEGRITÄTSPRÜFUNG
------------------------------------------

Das Skript erfasst sicher erkennbare Programme aus folgenden Bereichen:

- computerweite 64-Bit-Installationen
- computerweite 32-Bit-Installationen
- Installationen des aktuell angemeldeten Benutzers
- MSI-Pakete mit eindeutigem Produktcode
- WinGet-Communitypakete
- Microsoft-Store-Pakete

Bei registrierten Programmen können – soweit vorhanden – folgende Angaben geprüft
werden:

- Installationsordner
- registrierte Programmdatei oder Symboldatei
- Dateigröße
- grundlegende Struktur von EXE-, DLL-, CPL- und SCR-Dateien
- Deinstallationspfad
- MSI-Kennzeichnung
- Produktcode
- Hersteller
- Benutzer- oder Computerinstallationsbereich


8. AUTOMATISCHE PROGRAMMAKTUALISIERUNGEN
----------------------------------------

Verfügbare Aktualisierungen werden getrennt nach Quelle und Installationsbereich
ermittelt.

Unterstützt werden:

- Quelle „winget“
- Quelle „msstore“
- Bereich „user“
- Bereich „machine“

Nur eindeutig erkannte Paket-IDs werden einzeln aktualisiert. Ein automatischer
Sammelaufruf über „winget upgrade --all“ wird nicht verwendet.

Nicht eindeutig erkennbare oder nicht sicher auswertbare Update-Kontexte werden
ausgelassen und protokolliert. Dadurch wird verhindert, dass ein fehlerhaftes
Ausgabeformat zu einer unkontrollierten Massenaktualisierung führt.


9. REPARATUR UND NEUINSTALLATION
--------------------------------

Für geeignete Programme verwendet das Skript unterschiedliche Reparaturwege.

MSI-Programme:
Geeignete MSI-Pakete werden über den Windows Installer repariert. Dabei können je
nach Herstellerpaket fehlende oder beschädigte Dateien, Registry-Einträge und
Verknüpfungen wiederhergestellt werden.

WinGet-Pakete:
Zunächst wird eine Reparatur mit exakter Paket-ID, verifizierter Quelle und
ermitteltem Installationsbereich versucht.

Schlägt die Reparatur fehl oder wird sie nicht unterstützt:

1. Paket-ID, Quelle und Installationsbereich werden geprüft.
2. Der Installationsstatus wird nachkontrolliert.
3. Benötigte Installationsdateien werden über WinGet heruntergeladen.
4. Downloadordner und Dateien werden auf sichere Pfade geprüft.
5. Dateitypen und Dateigrößen werden kontrolliert.
6. Für heruntergeladene Dateien werden SHA-256-Prüfsummen erstellt.
7. Die offizielle Quelle wird erneut verifiziert.
8. Das Programm wird über WinGet mit exakter Paket-ID erneut installiert.
9. Der Installationsstatus wird danach erneut geprüft.

Die heruntergeladene Datei wird nicht direkt vom Skript gestartet. Dadurch bleiben
die Manifest-, Quellen- und Sicherheitsprüfungen von WinGet aktiv.

Microsoft-Store-Pakete:
Geeignete Microsoft-Store-Pakete können nach einer fehlgeschlagenen Reparatur über
die verifizierte Quelle „msstore“ erneut installiert werden. Die notwendigen Dateien
werden dabei durch WinGet beziehungsweise den Microsoft Store bezogen.


10. SICHERHEITSAUSSCHLÜSSE
--------------------------

Bestimmte systemnahe oder sicherheitskritische Pakete werden nicht automatisch
neu installiert. Dazu können unter anderem gehören:

- BIOS, Firmware und Bootloader
- Gerätetreiber und Grafiktreiber
- Antiviren-, Endpoint- und EDR-Software
- VPN- und sicherheitskritische Netzwerkprogramme
- Virtualisierungssoftware und WSL-Komponenten
- PowerShell
- Microsoft App Installer
- Windows Terminal
- Windows-Systemkomponenten und Windows-Updates
- Pakete mit ungültiger oder mehrdeutiger Kennung
- Pakete aus nicht verifizierten Quellen

Es findet keine automatische Deinstallation statt.


11. WINGET-AUSGABEFORMAT UND SICHERES AUSLASSEN
-----------------------------------------------

WinGet stellt viele Ergebnisse als lokalisierte Konsolentabelle bereit. Abstände,
Spaltennamen, Versionszusätze und Formatierungen können sich je nach WinGet-Version,
Windows-Sprache und Paket unterscheiden.

Version 6.2 unterstützt unter anderem:

- deutsche und englische Tabellenüberschriften
- mehrteilige Versionsangaben
- Architekturzusätze
- Benutzer- und Computerbereiche
- Paket-IDs, die zusätzlich im Programmnamen vorkommen

Kann ein Ausgabeformat trotzdem nicht sicher erkannt werden, wird der betroffene
Kontext protokolliert und ausgelassen. Das ist ein Sicherheitsmechanismus und kein
Absturz des gesamten Programms. Windows-Reparatur und andere eindeutig ausführbare
Schritte werden fortgesetzt.


12. FORTSCHRITTSANZEIGE
-----------------------

Das Programm zeigt einen textbasierten Gesamtfortschritt von 0 bis 100 Prozent an.

Der Prozentwert beschreibt den Gesamtfortschritt und ist keine genaue Zeitangabe.
DISM, SFC, CHKDSK und einzelne Installer können längere Zeit beim gleichen
Prozentwert stehen bleiben.


13. PROTOKOLLE UND DATEIEN
--------------------------

Die Protokolle und Berichte werden standardmäßig gespeichert unter:

C:\ProgramData\OneClick-ProgrammReparatur

Dort können unter anderem entstehen:

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


14. VERHALTEN WÄHREND DES LAUFS
-------------------------------

- Schließen Sie das PowerShell-Fenster nicht.
- Schalten Sie den Computer nicht aus.
- Trennen Sie die Internetverbindung nicht.
- Starten Sie keine weitere Installation gleichzeitig.
- Unterbrechen Sie DISM oder SFC nicht gewaltsam.
- Einzelne Reparaturen oder Installationen können länger dauern.
- Das Skript startet Windows nicht automatisch neu.
- Starten Sie Windows nach Abschluss neu, wenn dies empfohlen wird.


15. ABSCHLUSSMELDUNGEN
----------------------

„Erfolgreich abgeschlossen“
Der Lauf wurde ohne erkannte Warnungen beendet.

„Mit Warnungen abgeschlossen“
Der Lauf wurde beendet, aber mindestens ein Update, eine Reparatur, ein Download,
eine Neuinstallation oder ein Ausgabeformat konnte nicht vollständig verarbeitet
werden. Prüfen Sie die Zusammenfassung und das Protokoll.

„Mit einem Fehler beendet“
Ein für den weiteren Ablauf notwendiger Schritt ist fehlgeschlagen. Prüfen Sie die
neueste Protokolldatei.


16. HÄUFIGE PROBLEME
--------------------

Problem:
Die Datei wird im Texteditor geöffnet.

Lösung:
Verwenden Sie „Mit PowerShell ausführen“ oder den Startbefehl aus Abschnitt 6.


Problem:
Windows blockiert die Skriptausführung.

Lösung:
Entsperren Sie die Datei wie in Abschnitt 4 beschrieben und verwenden Sie den
Startbefehl mit „-ExecutionPolicy Bypass“.


Problem:
Das Fenster schließt sich sofort.

Lösung:
Öffnen Sie PowerShell 7 oder Windows Terminal als Administrator und führen Sie den
Befehl aus Abschnitt 6 aus.


Problem:
Ein WinGet-Ausgabeformat wurde nicht erkannt.

Lösung:
Prüfen Sie zunächst, ob die aktuelle WinGet-Version installiert ist. Der betroffene
Kontext wird aus Sicherheitsgründen ausgelassen. Einzelheiten stehen im Protokoll.


Problem:
Ein Programm konnte nicht repariert oder neu installiert werden.

Lösung:
Schließen Sie das betreffende Programm. Prüfen Sie anschließend die Zusammenfassung
und die Protokolldatei. Manche Hersteller-Installer unterstützen keinen vollständig
unbeaufsichtigten Ablauf.


17. TECHNISCHE GRENZEN
----------------------

Kein allgemeines Skript kann zweifelsfrei feststellen, ob jedes beliebige
Drittanbieterprogramm intern vollständig fehlerfrei ist.

Nur Programme mit einer zuverlässig ermittelbaren Registry-, MSI-, WinGet- oder
Microsoft-Store-Zuordnung können automatisiert verarbeitet werden.

Nicht vollständig automatisch erfassbar sind unter anderem:

- portable Programme ohne Installationseintrag
- Programme ohne Registry-, MSI-, WinGet- oder Store-Zuordnung
- Programme anderer Benutzer, deren Profile nicht geladen sind
- herstellerspezifische Datenbank-, Konto- oder Lizenzfehler
- Installer, die zwingend Benutzereingaben verlangen
- Store-Pakete, die eine Anmeldung oder Lizenzbestätigung erfordern


18. SICHERHEITSHINWEISE
-----------------------

- Erstellen Sie eine eigene Datensicherung wichtiger Dateien.
- Verwenden Sie das Skript nur mit Administratorrechten auf Ihrem eigenen System.
- Verwenden Sie keine veränderten Kopien aus unbekannten Quellen.
- Deaktivieren Sie Sicherheitsprogramme nicht dauerhaft.
- Prüfen Sie Warnungen anhand der erzeugten Protokolle.
- Eine automatische Reparatur oder Neuinstallation kann nicht garantieren, dass
  jedes Drittanbieterprogramm auf jeder Windows-Konfiguration vollständig
  wiederhergestellt wird.


19. EMPFOHLENER ABLAUF
----------------------

1. PS1-Datei herunterladen.
2. Dateieigenschaften öffnen.
3. „Zulassen“ aktivieren.
4. „Übernehmen“ und „OK“ anklicken.
5. Wichtige Dateien sichern.
6. Geöffnete Programme schließen.
7. Datei mit „Mit PowerShell ausführen“ starten.
8. Administratorabfrage bestätigen.
9. Den vollständigen Lauf abwarten.
10. Abschlussmeldung und Protokolle prüfen.
11. Windows neu starten, wenn dies empfohlen wird.


Ende der README
