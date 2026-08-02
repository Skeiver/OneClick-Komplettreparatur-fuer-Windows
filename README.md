# OneClick-Komplettreparatur für Windows 10/11
Ein OneClick Reparatur Programm das Windows Dateien und Installierte Dateien/Programme überprüft, beschädigte Programme repariert/neuinstalliert und Updatet.

Die erste Release Version ist jetzt erschienen, Version 1.0.0 wurde mehrfach getestet und auf Fehler überprüft. 

Wichtige vorabinfo: Nach Durchlauf des Programmes, werden Protokolle in OneClick-Komplettreparatur Ordner in Windows Dokumenten Ordner gespeichert (Siehe README). Sollte bei einem Neustartet des Programmes Fehler auftreten oder das Programm nicht sauber durchlaufen, löschen Sie die OneClick-Komplettreparatur Ordner in Windows Dokumente.

Für Programmierer: Programcode ist in "Programmcode-OneClick-Komplettreparatur-Release-v1.0.0.txt" gespeichert und kann heruntergeladen und weiterverwendende werden :)

An diesem Programm wird weitergearbeitet und neue verbesserte Versionen werden weiter erscheinen.

--------------------------

Windows kann heruntergeladene PowerShell-Dateien aus Sicherheitsgründen blockieren.

Gehen Sie vor dem ersten Start folgendermaßen vor:

Klicken Sie mit der rechten Maustaste auf
„OneClick-Komplettreparatur-Release-v1.0.0.ps1“.

Wählen Sie „Eigenschaften“.

Öffnen Sie den Reiter „Allgemein“.

Suchen Sie unten den Bereich „Sicherheit“.

Aktivieren Sie „Zulassen“.

Klicken Sie auf „Übernehmen“.

Klicken Sie anschließend auf „OK“.

Wird „Zulassen“ nicht angezeigt, ist die Datei bereits entsperrt oder wurde von
Windows nicht blockiert.
============================================================================================================

OneClick-Komplettreparatur – README
====================================

Produkt: OneClick-Komplettreparatur-Release-v1.0.0
Version: 1.0.0
Programmstand: 01.08.2026
Ausgangsdatei: OneClick-Komplettreparatur-Release-v1.0.0.ps1

1. PROGRAMMBESCHREIBUNG
-----------------------
OneClick-Komplettreparatur ist ein PowerShell-Programm für Microsoft Windows.
Es prüft die Windows-Systembasis, erfasst installierte Programme, sucht nach
Aktualisierungen und führt unterstützte Reparaturen oder abgesicherte
Neuinstallationen aus.

Benutzerbezogene Programme werden kontrolliert mit einem normalen Benutzertoken
bearbeitet. Computerweit installierte Programme und die Hauptsteuerung laufen
mit Administratorrechten.

2. HAUPTFUNKTIONEN
------------------
- Start durch Doppelklick auf die PS1-Datei.
- Sichere Übergabe von Windows PowerShell 5.1 an PowerShell 7.4 oder neuer.
- Automatische Anforderung und Prüfung der Administratorrechte.
- Verifizierte Prüfung und Aktualisierung von PowerShell 7.
- Prüfung, Reparatur oder Bereitstellung von WinGet.
- Prüfung und Reparatur der offiziellen WinGet-Standardquellen.
- Erstellung eines Windows-Wiederherstellungspunktes, sofern möglich.
- Bedarfsgesteuerte Prüfung des Windows-Komponentenspeichers mit DISM.
- DISM-Reparatur nur bei nachgewiesenem reparierbarem Schaden.
- SFC- und CHKDSK-Kontrolle nur nach erfolgreich bestätigter DISM-Reparatur.
- Inventarisierung installierter Programme aus Registry und WinGet.
- Aktualisierung installierter Programme über WinGet.
- Gezielte MSI-Reparatur bei erkanntem Beschädigungsverdacht.
- Optionale Tiefenreparatur unterstützter MSI- und WinGet-Pakete.
- Paketweise Fehlerisolierung, damit andere Programme weiter geprüft werden.
- Quarantäne fehlerhafter oder nicht sicher geprüfter WinGet-Pakete.
- Nachkontrolle ausgeführter Updates, Reparaturen und Neuinstallationen.
- Erkennung inaktiver oder hängender Installationsprozesse.
- Kontrollierter Abbruch zugehöriger Prozessbäume.
- Sichere Trennung von Benutzer- und Maschineninstallationen.
- Prüfung beziehungsweise Erstellung von Desktop-Verknüpfungen.
- Sichere Pause und automatische Fortsetzung nach einem Neustart.
- Abschlussbereinigung temporärer Daten.
- Erstellung von CSV-Ergebnisbericht und TXT-Zusammenfassung.
- Interner Selbsttest vor dem Reparaturlauf.

3. VORAUSSETZUNGEN
------------------
- Windows 10 ab Version 1809, Build 17763, oder Windows 11.
- Auf ARM64-Systemen mindestens Windows 11, Build 22000.
- Unterstützte Windows-Clientinstallation.
- Benutzerkonto mit Administratorberechtigung.
- Funktionierende Internetverbindung.
- Zugriff auf den persönlichen Windows-Dokumenteordner.
- Ausreichender freier Speicherplatz.
- Keine parallel gestarteten Installationen oder Windows-Reparaturen.

PowerShell 7 und WinGet werden durch das Programm geprüft und bei Bedarf über
die vorgesehenen verifizierten Quellen bereitgestellt oder repariert.

4. EMPFOHLENER START
--------------------
1. Speichern Sie die PS1-Datei auf einem lokalen Laufwerk.
2. Schließen Sie andere Installationsprogramme.
3. Doppelklicken Sie auf die PS1-Datei, um das Programm zu starten.
4. Bestätigen Sie die Windows-Benutzerkontensteuerung.
5. Lassen Sie das Programmfenster bis zum vollständigen Abschluss geöffnet.
6. Starten Sie Windows neu, wenn das Programm dazu auffordert.
7. Melden Sie sich danach wieder mit demselben Benutzerkonto an.

Alternativer Start aus einer PowerShell-Konsole:

  powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\OneClick-Komplettreparatur-Release-v1.0.0.ps1"

Unbeaufsichtigter Start ohne abschließende Tasteneingabe:

  powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\OneClick-Komplettreparatur-Release-v1.0.0.ps1" -KeinePause

Die Option "-ExecutionPolicy Bypass" gilt nur für den gestarteten
PowerShell-Prozess und verändert nicht dauerhaft die Windows-Richtlinie.

5. ABLAUF DES PROGRAMMS
-----------------------
1. Prüfung von Windows, Architektur, Skriptpfad und Startumgebung.
2. Anforderung und Nachkontrolle der Administratorrechte.
3. Prüfung beziehungsweise Bereitstellung von PowerShell 7.4 oder neuer.
4. Initialisierung der Protokollierung und Laufzeitordner.
5. Ausführung des internen Selbsttests.
6. Bereinigung alter Berichte und Prüfung von Neustartzuständen.
7. Erstellung eines Wiederherstellungspunktes, sofern möglich.
8. DISM-Prüfung und nur bei Bedarf DISM-Reparatur.
9. SFC- und CHKDSK-Kontrolle nach bestätigter DISM-Reparatur.
10. Sichere Pause und Fortsetzung bei notwendigem Neustart.
11. Inventarisierung installierter Programme.
12. Prüfung beziehungsweise Reparatur von WinGet und seinen Quellen.
13. Aktualisierung benutzerbezogener Programme.
14. Aktualisierung computerweit installierter Programme.
15. Integritätsprüfung und Reparatur registrierter Programme.
16. MSI- und WinGet-Reparaturen sowie abgesicherte Neuinstallationen.
17. Isolierung einzelner Paketfehler und gegebenenfalls Quarantäne.
18. Nachkontrolle aller ausgeführten Aktionen.
19. Bereinigung der Arbeitsdaten.
20. Erstellung der Abschlussberichte.

6. PROTOKOLLE UND BERICHTE
--------------------------
Das Programm verwendet den Windows-Dokumenteordner des aktuellen Benutzers.

Administrativer Laufzeitordner:
  Dokumente\OneClick-ProgrammReparatur-Laufzeit

Benutzerbezogener Laufzeitordner:
  Dokumente\OneClick-ProgrammReparatur-Benutzer-Laufzeit

Abschlussberichte des Hauptlaufs:
  Dokumente\OneClick-Reparaturberichte\Hauptlauf

Abschlussberichte des Benutzerlaufs:
  Dokumente\OneClick-Reparaturberichte\Benutzerlauf

WinGet-Sicherheitsquarantäne:
  Dokumente\OneClick-ProgrammReparatur-Quarantaene

Mögliche Abschlussberichte:
- Ergebnis-JJJJMMTT-HHMMSS.csv
- Zusammenfassung-JJJJMMTT-HHMMSS.txt

Berichte, die älter als drei Tage sind, können durch die eingerichtete
Aufbewahrungsfunktion in den Windows-Papierkorb verschoben werden.

7. LEERLAUF- UND TIMEOUT-SCHUTZ
-------------------------------
Das Programm überwacht Installations- und Reparaturprozesse, Kindprozesse,
Protokollaktivitäten und Downloads. Bei überschrittener Gesamtlaufzeit oder
längerer nachgewiesener Inaktivität wird der betroffene Vorgang kontrolliert
beendet und im Bericht erfasst.

Ein einzelner Paketfehler verhindert nicht automatisch die Prüfung der übrigen
Programme. Schwere Infrastruktur-, Phasen- oder Windows-Systemfehler können den
Gesamtlauf weiterhin sicher abbrechen.

8. NEUSTART UND AUTOMATISCHE FORTSETZUNG
-----------------------------------------
Erfordert eine System- oder Reparaturaktion einen Neustart, pausiert das
Programm weitere verändernde Aktionen. Es speichert einen geschützten
Fortsetzungsstatus und registriert eine geplante Aufgabe.

Die Fortsetzung wird nur akzeptiert, wenn der gespeicherte Status gültig ist
und tatsächlich ein neuer Windows-Start stattgefunden hat.

9. EXITCODES
------------
0
  Erfolgreich ohne erkannte Warnungen abgeschlossen.

1
  Schwerer Fehler oder nicht vollständig sicher abgeschlossener Lauf.

2
  Lauf abgeschlossen, jedoch mit Warnungen.

3010
  Windows-Neustart erforderlich. Eine sichere Fortsetzung kann registriert sein.

Weitere interne Fehlercodes können bei frühen Start- oder Infrastrukturfehlern
auftreten. Die genaue Ursache wird in der Konsole und in den Berichten erfasst.

10. SICHERHEITSHINWEISE
-----------------------
- Sichern Sie wichtige persönliche Daten vor einer umfassenden Reparatur.
- Das Programm verändert Windows-Komponenten und installierte Programme.
- Verwenden Sie Tiefenreparaturen nur bewusst.
- Schließen Sie das Programmfenster nicht während laufender Aktionen.
- Schalten Sie den Computer während DISM, SFC, CHKDSK oder Installationen
  nicht aus.
- Starten Sie nicht mehrere Programminstanzen gleichzeitig.
- Prüfen Sie die Abschlussberichte auf Warnungen und fehlgeschlagene Aktionen.
- Entfernen Sie Quarantänedaten nicht ungeprüft.
- Netzwerk-, Signatur-, Hash- oder Quellenfehler führen zu einer sicheren
  Auslassung, Quarantäne oder zum Abbruch der betroffenen Aktion.

11. FEHLERBEHEBUNG
------------------
Problem: Das Programm startet nach dem Doppelklick nicht sichtbar.
Lösung:
- Speichern Sie die PS1-Datei auf einem lokalen Laufwerk.
- Prüfen Sie in den Dateieigenschaften, ob Windows die Datei blockiert.
- Starten Sie die Datei testweise über:

  powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\OneClick-Komplettreparatur-Release-v1.0.0.ps1"

Problem: Eine Installation scheint zu hängen.
Lösung:
- Warten Sie auf die integrierte Leerlaufüberwachung.
- Starten Sie keinen zweiten Installer parallel.
- Prüfen Sie danach die TXT-Zusammenfassung und den CSV-Bericht.

Problem: WinGet kann nicht bereitgestellt oder repariert werden.
Lösung:
- Prüfen Sie Internetverbindung, Systemdatum und Systemzeit.
- Installieren Sie ausstehende Windows-Updates.
- Starten Sie Windows neu und führen Sie das Programm erneut aus.

Problem: Ein Programm kann nicht automatisch repariert werden.
Lösung:
- Prüfen Sie den Abschlussbericht und die Quarantäneangaben.
- Verwenden Sie ausschließlich offizielle Herstellerquellen.
- Deinstallieren Sie Programme mit wichtigen Benutzerdaten nicht unüberlegt.

Problem: Das Programm endet mit Exitcode 3010.
Lösung:
- Starten Sie Windows neu.
- Melden Sie sich mit demselben Benutzerkonto an.
- Lassen Sie die registrierte Fortsetzung vollständig abschließen.

12. QUELLCODE-INFORMATIONEN
---------------------------
Quelltextzeilen: 11432
Dateigröße des ursprünglichen Skripts: 728686 Bytes
SHA-256 des ursprünglichen Skripts:
  C6ED1392CC08D7757359725AE0ED29F9AC5C1AB37EC7D6244957C8AEC5B37D86

Die Datei "Programmcode-OneClick-Komplettreparatur-Release-v1.0.0.txt" ist eine bytegenaue Kopie des bereitgestellten
PowerShell-Skripts. Nur Dateiname und Dateiendung unterscheiden sich.

13. HAFTUNGSHINWEIS
-------------------
Die Ausführung erfolgt auf eigene Verantwortung. Trotz interner Sicherheits-,
Nachkontroll-, Isolierungs- und Abbruchmechanismen können beschädigte
Windows-Installationen, Drittanbieter-Installer, Sicherheitssoftware,
Netzwerkausfälle oder herstellerspezifische Besonderheiten zu unvollständigen
Reparaturen führen. Prüfen Sie immer die erzeugten Abschlussberichte.

------------------------------------------------------------------------------------------------------------

<img width="3839" height="2069" alt="Beispiel 1" src="https://github.com/user-attachments/assets/dc41a2c5-adfe-4481-930b-7217ddc518c4" />
