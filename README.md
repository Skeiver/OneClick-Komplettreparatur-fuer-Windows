<a id="oneclick-komplettreparatur"></a>

<div align="center">

# 🛠️ OneClick-Komplettreparatur

### Automatisierte Prüfung, Aktualisierung und Reparatur von Windows und installierten Programmen

[![Repository- und PowerShell-Prüfung](https://github.com/Skeiver/OneClick-Komplettreparatur-fuer-Windows/actions/workflows/powershell-ci.yml/badge.svg?branch=OneClick-Komplettreparatur)](https://github.com/Skeiver/OneClick-Komplettreparatur-fuer-Windows/actions/workflows/powershell-ci.yml) [![License: Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](LICENSE)

<img width="100%" alt="OneClick-Komplettreparatur – Programmoberfläche" src="https://github.com/user-attachments/assets/b49f55b5-7575-46d1-b446-495dcf38fb0d" />

[⬇️ **Version 1.0.0 herunterladen**](https://github.com/Skeiver/OneClick-Komplettreparatur-fuer-Windows/releases/download/repair-tool-v.1.0.0/OneClick-Komplettreparatur-Release-v1.0.0.ps1) · [📦 Releases](https://github.com/Skeiver/OneClick-Komplettreparatur-fuer-Windows/releases) · [🔎 Quellcode](https://github.com/Skeiver/OneClick-Komplettreparatur-fuer-Windows/blob/OneClick-Komplettreparatur/v1.0.0.ps1) · [🐞 Issues](https://github.com/Skeiver/OneClick-Komplettreparatur-fuer-Windows/issues/new/choose) · [💬 Discussions](https://github.com/Skeiver/OneClick-Komplettreparatur-fuer-Windows/discussions) · [🔐 Security](https://github.com/Skeiver/OneClick-Komplettreparatur-fuer-Windows/security/policy)

[📖 Beschreibung](#programmbeschreibung) · [✨ Funktionen](#hauptfunktionen) · [▶️ Start](#empfohlener-start) · [🧰 Fehlerbehebung](#fehlerbehebung) · [📝 Changelog](CHANGELOG.md) · [⚖️ Lizenz](LICENSE) · [🧾 Attribution](NOTICE) · [🤝 Mitwirken](.github/CONTRIBUTING.md) · [🆘 Support](.github/SUPPORT.md)

</div>

---

> [!IMPORTANT]
> **Release 1.0.0 ist ein unveränderlicher Release-Snapshot.** Der vollständige PowerShell-Quellcode ist öffentlich einsehbar und darf gemäß Apache License 2.0 untersucht, geforkt, verändert und weiterentwickelt werden. Änderungen am offiziellen Projekt erscheinen als neue Version, damit der zu Release 1.0.0 gehörende Quellstand jederzeit nachvollziehbar bleibt.

> [!WARNING]
> Das Programm verändert Windows-Komponenten und installierte Programme. Sichern Sie wichtige persönliche Daten und lesen Sie vor der Ausführung die [Sicherheitshinweise](#sicherheitshinweise).

> [!NOTE]
> Nach dem Programmlauf werden Protokolle und Berichte im Windows-Dokumenteordner gespeichert. Weitere Informationen finden Sie unter [Protokolle und Berichte](#protokolle-und-berichte).

> [!TIP]
> **Keine EXE/Blackbox:** OneClick-Komplettreparatur ist ein offen einsehbares PowerShell-Skript. Der vollständige Repository-Quellcode der veröffentlichten Version liegt in [`v1.0.0.ps1`](v1.0.0.ps1) und kann vor der Ausführung direkt auf GitHub geprüft werden. Die CI prüft den Code statisch und schützt ausschließlich den veröffentlichten 1.0.0-Snapshot vor unbeabsichtigten Änderungen; sie verhindert keine Forks oder Weiterentwicklungen.

> [!NOTE]
> Das Abzeichen **Repository- und PowerShell-Prüfung** zeigt den Status der automatischen GitHub-Prüfungen. Es kontrolliert Release-Schutz, Repository-Struktur, Lizenz/Attribution und PowerShell-Syntax. Es startet **keine** Reparaturen auf einem Benutzer-PC.

---

<a id="vor-der-ausfuehrung-pruefen"></a>

## 🔍 Vor der Ausführung prüfen

Da das Skript mit Administratorrechten arbeitet, wird empfohlen, **Herkunft, Quellcode und Dateihash vor dem Start selbst zu prüfen**.

1. Lesen Sie den vollständigen Quellcode direkt auf GitHub: [`v1.0.0.ps1`](v1.0.0.ps1).
2. Laden Sie Version 1.0.0 ausschließlich über den [offiziellen GitHub-Release](https://github.com/Skeiver/OneClick-Komplettreparatur-fuer-Windows/releases/tag/repair-tool-v.1.0.0) oder den oben angegebenen Direktlink herunter.
3. Prüfen Sie anschließend den SHA-256-Hash der heruntergeladenen **Release-Datei**:

```powershell
Get-FileHash ".\OneClick-Komplettreparatur-Release-v1.0.0.ps1" -Algorithm SHA256
```

Erwarteter SHA-256 für das veröffentlichte Release-Asset:

```text
c6ed1392cc08d7757359725ae0ed29f9ac5c1ab37ec7d6244957c8aec5b37d86
```

4. Führen Sie das Skript erst aus, wenn der Hash übereinstimmt und Sie den Quellcode beziehungsweise seine Herkunft ausreichend geprüft haben.

> [!IMPORTANT]
> Der SHA-256-Vergleich bestätigt, dass die heruntergeladene Datei dem veröffentlichten Release-Asset entspricht. Er ersetzt **keine** eigene Prüfung des PowerShell-Codes und ist keine allgemeine Sicherheitsgarantie.

<div align="right">[⬆️ Nach oben](#oneclick-komplettreparatur)</div>

---

## 📋 Projektinformationen

| Eigenschaft | Wert |
|:---|:---|
| **Produkt** | OneClick-Komplettreparatur-Release-v1.0.0 |
| **Version** | `1.0.0` |
| **Programmstand** | `01.08.2026` |
| **Hauptdatei im Repository** | `v1.0.0.ps1` |
| **Standardbranch** | `OneClick-Komplettreparatur` |
| **Automatische Prüfung** | Release-Schutz + Repository-Struktur + Apache-2.0/NOTICE + Windows PowerShell 5.1 + PowerShell 7 |
| **Betriebssystem** | Windows 10 / Windows 11 |
| **Lizenz** | Apache License 2.0 |
| **Release-Datei** | OneClick-Komplettreparatur-Release-v1.0.0.ps1 |
| **SHA-256 des Release-Assets** | `c6ed1392cc08d7757359725ae0ed29f9ac5c1ab37ec7d6244957c8aec5b37d86` |

### 🔗 GitHub-Projektbereiche

| Bereich | Link |
|:---|:---|
| **Aktuelle Veröffentlichung** | [Release 1.0.0](https://github.com/Skeiver/OneClick-Komplettreparatur-fuer-Windows/releases/tag/repair-tool-v.1.0.0) |
| **Direkter Download** | [Version 1.0.0 herunterladen](https://github.com/Skeiver/OneClick-Komplettreparatur-fuer-Windows/releases/download/repair-tool-v.1.0.0/OneClick-Komplettreparatur-Release-v1.0.0.ps1) |
| **Quellcode** | [`v1.0.0.ps1`](v1.0.0.ps1) |
| **Änderungsverlauf** | [CHANGELOG.md](CHANGELOG.md) |
| **Lizenz** | [Apache License 2.0](LICENSE) |
| **Attribution / Herkunft** | [NOTICE](NOTICE) |
| **Fehler melden / Vorschläge** | [Issues](https://github.com/Skeiver/OneClick-Komplettreparatur-fuer-Windows/issues/new/choose) |
| **Fragen / Austausch** | [Discussions](https://github.com/Skeiver/OneClick-Komplettreparatur-fuer-Windows/discussions) |
| **Sicherheitsmeldungen** | [SECURITY.md](.github/SECURITY.md) |
| **Support** | [SUPPORT.md](.github/SUPPORT.md) |
| **Mitwirken** | [CONTRIBUTING.md](.github/CONTRIBUTING.md) |
| **Verhaltensregeln** | [CODE_OF_CONDUCT.md](.github/CODE_OF_CONDUCT.md) |
| **Automatische Prüfungen** | [Repository- und PowerShell-Prüfung](https://github.com/Skeiver/OneClick-Komplettreparatur-fuer-Windows/actions/workflows/powershell-ci.yml) |

---

## 📑 Inhaltsverzeichnis

1. [Programmbeschreibung](#programmbeschreibung)
2. [Hauptfunktionen](#hauptfunktionen)
3. [Voraussetzungen](#voraussetzungen)
4. [Vor der Ausführung prüfen](#vor-der-ausfuehrung-pruefen)
5. [Datei vor dem ersten Start entsperren](#datei-vor-dem-ersten-start-entsperren)
6. [Empfohlener Start](#empfohlener-start)
7. [Ablauf des Programms](#ablauf-des-programms)
8. [Protokolle und Berichte](#protokolle-und-berichte)
9. [Leerlauf- und Timeout-Schutz](#leerlauf-und-timeout-schutz)
10. [Neustart und automatische Fortsetzung](#neustart-und-automatische-fortsetzung)
11. [Exitcodes](#exitcodes)
12. [Sicherheitshinweise](#sicherheitshinweise)
13. [Fehlerbehebung](#fehlerbehebung)
14. [Quellcode- und Release-Informationen](#quellcode-und-release-informationen)
15. [Lizenz und Weiterverwendung](#lizenz-und-weiterverwendung)
16. [Haftungshinweis](#haftungshinweis)

---

<a id="programmbeschreibung"></a>

## 🔎 Programmbeschreibung

**OneClick-Komplettreparatur** ist ein PowerShell-Programm für Microsoft Windows. Es prüft die Windows-Systembasis, erfasst installierte Programme, sucht nach Aktualisierungen und führt unterstützte Reparaturen oder abgesicherte Neuinstallationen aus.

Benutzerbezogene Programme werden kontrolliert mit einem normalen Benutzertoken bearbeitet. Computerweit installierte Programme und die Hauptsteuerung laufen mit Administratorrechten.

<div align="right">[⬆️ Nach oben](#oneclick-komplettreparatur)</div>

---

<a id="hauptfunktionen"></a>

## ✨ Hauptfunktionen

### 🖥️ System und Laufzeit

- Start durch Doppelklick auf die PS1-Datei.
- Sichere Übergabe von Windows PowerShell 5.1 an PowerShell 7.4 oder neuer.
- Automatische Anforderung und Prüfung der Administratorrechte.
- Verifizierte Prüfung und Aktualisierung von PowerShell 7.
- Interner Selbsttest vor dem Reparaturlauf.
- Sichere Pause und automatische Fortsetzung nach einem Neustart.

### 🪟 Windows-Reparatur

- Prüfung, Reparatur oder Bereitstellung von WinGet.
- Prüfung und Reparatur der offiziellen WinGet-Standardquellen.
- Erstellung eines Windows-Wiederherstellungspunktes, sofern möglich.
- Bedarfsgesteuerte Prüfung des Windows-Komponentenspeichers mit DISM.
- DISM-Reparatur nur bei nachgewiesenem reparierbarem Schaden.
- SFC- und CHKDSK-Kontrolle nur nach erfolgreich bestätigter DISM-Reparatur.

### 📦 Programme und Pakete

- Inventarisierung installierter Programme aus Registry und WinGet.
- Aktualisierung installierter Programme über WinGet.
- Gezielte MSI-Reparatur bei erkanntem Beschädigungsverdacht.
- Optionale Tiefenreparatur unterstützter MSI- und WinGet-Pakete.
- Paketweise Fehlerisolierung, damit andere Programme weiter geprüft werden.
- Quarantäne fehlerhafter oder nicht sicher geprüfter WinGet-Pakete.
- Nachkontrolle ausgeführter Updates, Reparaturen und Neuinstallationen.
- Sichere Trennung von Benutzer- und Maschineninstallationen.
- Prüfung beziehungsweise Erstellung von Desktop-Verknüpfungen.

### 📊 Überwachung und Berichte

- Erkennung inaktiver oder hängender Installationsprozesse.
- Kontrollierter Abbruch zugehöriger Prozessbäume.
- Abschlussbereinigung temporärer Daten.
- Erstellung eines CSV-Ergebnisberichts und einer TXT-Zusammenfassung.

<div align="right">[⬆️ Nach oben](#oneclick-komplettreparatur)</div>

---

<a id="voraussetzungen"></a>

## ✅ Voraussetzungen

| Voraussetzung | Beschreibung |
|:---|:---|
| **Betriebssystem** | Windows 10 ab Version 1809, Build 17763, oder Windows 11 |
| **ARM64-Systeme** | Mindestens Windows 11, Build 22000 |
| **Windows-Ausgabe** | Unterstützte Windows-Clientinstallation |
| **Benutzerkonto** | Administratorberechtigung erforderlich |
| **Internet** | Funktionierende Internetverbindung |
| **Dateizugriff** | Zugriff auf den persönlichen Windows-Dokumenteordner |
| **Speicherplatz** | Ausreichender freier Speicherplatz |
| **Parallele Vorgänge** | Keine gleichzeitig laufenden Installationen oder Windows-Reparaturen |

PowerShell 7 und WinGet werden durch das Programm geprüft und bei Bedarf über die vorgesehenen verifizierten Quellen bereitgestellt oder repariert.

<div align="right">[⬆️ Nach oben](#oneclick-komplettreparatur)</div>

---

<a id="datei-vor-dem-ersten-start-entsperren"></a>

## 🔓 Datei vor dem ersten Start entsperren

Windows kann eine aus dem Internet heruntergeladene PowerShell-Datei blockieren. Vor dem ersten Start:

1. Rechtsklick auf die heruntergeladene PS1-Datei.
2. **Eigenschaften** öffnen.
3. Im Reiter **Allgemein** unten den Bereich **Sicherheit** prüfen.
4. Falls vorhanden, **Zulassen** aktivieren.
5. **Übernehmen** und anschließend **OK** wählen.

> [!NOTE]
> Wird **Zulassen** nicht angezeigt, ist die Datei bereits entsperrt oder wurde von Windows nicht blockiert.

> [!CAUTION]
> Aktivieren Sie **Zulassen** nur, wenn Sie der Herkunft der Datei vertrauen.

<div align="right">[⬆️ Nach oben](#oneclick-komplettreparatur)</div>

---

<a id="empfohlener-start"></a>

## ▶️ Empfohlener Start

1. Laden Sie Version 1.0.0 über den oben verlinkten offiziellen GitHub-Release herunter.
2. Prüfen Sie den Quellcode und den SHA-256-Hash wie unter [Vor der Ausführung prüfen](#vor-der-ausfuehrung-pruefen) beschrieben.
3. Speichern Sie die PS1-Datei auf einem lokalen Laufwerk.
4. Schließen Sie andere Installationsprogramme.
5. Entsperren Sie die Datei bei Bedarf wie oben beschrieben.
6. Doppelklicken Sie auf die PS1-Datei.
7. Bestätigen Sie die Windows-Benutzerkontensteuerung.
8. Lassen Sie das Programmfenster bis zum vollständigen Abschluss geöffnet.
9. Starten Sie Windows neu, wenn das Programm dazu auffordert.
10. Melden Sie sich danach wieder mit demselben Benutzerkonto an.

### Alternativer Start über PowerShell

Wenn Sie die Repository-Datei `v1.0.0.ps1` verwenden:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\v1.0.0.ps1"
```

### Unbeaufsichtigter Start

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\v1.0.0.ps1" -KeinePause
```

> [!NOTE]
> `-ExecutionPolicy Bypass` gilt nur für den gestarteten PowerShell-Prozess und verändert die Windows-Richtlinie nicht dauerhaft.

<div align="right">[⬆️ Nach oben](#oneclick-komplettreparatur)</div>

---

<a id="ablauf-des-programms"></a>

## ⚙️ Ablauf des Programms

```text
Start
  │
  ├─ 1.  Windows, Architektur, Skriptpfad und Startumgebung prüfen
  ├─ 2.  Administratorrechte anfordern und kontrollieren
  ├─ 3.  PowerShell 7.4 oder neuer prüfen beziehungsweise bereitstellen
  ├─ 4.  Protokollierung und Laufzeitordner initialisieren
  ├─ 5.  Internen Selbsttest ausführen
  ├─ 6.  Alte Berichte bereinigen und Neustartzustände prüfen
  ├─ 7.  Wiederherstellungspunkt erstellen, sofern möglich
  ├─ 8.  DISM-Prüfung und nur bei Bedarf DISM-Reparatur durchführen
  ├─ 9.  SFC und CHKDSK nach bestätigter DISM-Reparatur kontrollieren
  ├─ 10. Bei notwendigem Neustart sicher pausieren und fortsetzen
  ├─ 11. Installierte Programme inventarisieren
  ├─ 12. WinGet und seine Quellen prüfen beziehungsweise reparieren
  ├─ 13. Benutzerbezogene Programme aktualisieren
  ├─ 14. Computerweit installierte Programme aktualisieren
  ├─ 15. Registrierte Programme auf Integrität prüfen und reparieren
  ├─ 16. MSI- und WinGet-Reparaturen sowie Neuinstallationen ausführen
  ├─ 17. Einzelne Paketfehler isolieren und gegebenenfalls quarantänisieren
  ├─ 18. Alle ausgeführten Aktionen nachkontrollieren
  ├─ 19. Arbeitsdaten bereinigen
  └─ 20. Abschlussberichte erstellen
```

<div align="right">[⬆️ Nach oben](#oneclick-komplettreparatur)</div>

---

<a id="protokolle-und-berichte"></a>

## 📁 Protokolle und Berichte

Das Programm verwendet den Windows-Dokumenteordner des aktuellen Benutzers.

| Bereich | Pfad |
|:---|:---|
| **Administrativer Laufzeitordner** | `Dokumente\OneClick-ProgrammReparatur-Laufzeit` |
| **Benutzerbezogener Laufzeitordner** | `Dokumente\OneClick-ProgrammReparatur-Benutzer-Laufzeit` |
| **Abschlussberichte des Hauptlaufs** | `Dokumente\OneClick-Reparaturberichte\Hauptlauf` |
| **Abschlussberichte des Benutzerlaufs** | `Dokumente\OneClick-Reparaturberichte\Benutzerlauf` |
| **WinGet-Sicherheitsquarantäne** | `Dokumente\OneClick-ProgrammReparatur-Quarantaene` |

### Mögliche Abschlussberichte

```text
Ergebnis-JJJJMMTT-HHMMSS.csv
Zusammenfassung-JJJJMMTT-HHMMSS.txt
```

Berichte, die älter als drei Tage sind, können durch die eingerichtete Aufbewahrungsfunktion in den Windows-Papierkorb verschoben werden.

<div align="right">[⬆️ Nach oben](#oneclick-komplettreparatur)</div>

---

<a id="leerlauf-und-timeout-schutz"></a>

## ⏱️ Leerlauf- und Timeout-Schutz

Das Programm überwacht Installations- und Reparaturprozesse, zugehörige Kindprozesse, Protokollaktivitäten und laufende Downloads. Bei überschrittener Gesamtlaufzeit oder längerer nachgewiesener Inaktivität wird der betroffene Vorgang kontrolliert beendet und im Bericht erfasst.

> [!NOTE]
> Ein einzelner Paketfehler verhindert nicht automatisch die Prüfung der übrigen Programme. Schwere Infrastruktur-, Phasen- oder Windows-Systemfehler können den Gesamtlauf weiterhin sicher abbrechen.

<div align="right">[⬆️ Nach oben](#oneclick-komplettreparatur)</div>

---

<a id="neustart-und-automatische-fortsetzung"></a>

## 🔄 Neustart und automatische Fortsetzung

Erfordert eine System- oder Reparaturaktion einen Neustart, pausiert das Programm weitere verändernde Aktionen. Es speichert einen geschützten Fortsetzungsstatus und registriert eine geplante Aufgabe.

Die Fortsetzung wird nur akzeptiert, wenn der gespeicherte Status gültig ist und tatsächlich ein neuer Windows-Start stattgefunden hat.

<div align="right">[⬆️ Nach oben](#oneclick-komplettreparatur)</div>

---

<a id="exitcodes"></a>

## 🚦 Exitcodes

| Exitcode | Status | Bedeutung |
|---:|:---:|:---|
| `0` | ✅ Erfolgreich | Ohne erkannte Warnungen abgeschlossen. |
| `1` | ❌ Fehler | Schwerer Fehler oder nicht vollständig sicher abgeschlossener Lauf. |
| `2` | ⚠️ Warnung | Lauf abgeschlossen, jedoch mit Warnungen. |
| `3010` | 🔄 Neustart | Windows-Neustart erforderlich. Eine sichere Fortsetzung kann registriert sein. |

Weitere interne Fehlercodes können bei frühen Start- oder Infrastrukturfehlern auftreten. Die genaue Ursache wird in der Konsole und in den Berichten erfasst.

<div align="right">[⬆️ Nach oben](#oneclick-komplettreparatur)</div>

---

<a id="sicherheitshinweise"></a>

## 🔐 Sicherheitshinweise

> [!WARNING]
> Sichern Sie wichtige persönliche Daten, bevor Sie eine umfassende Reparatur starten.

- Das Programm verändert Windows-Komponenten und installierte Programme.
- Verwenden Sie Tiefenreparaturen nur bewusst.
- Schließen Sie das Programmfenster nicht während laufender Aktionen.
- Schalten Sie den Computer während DISM, SFC, CHKDSK oder Installationen nicht aus.
- Starten Sie nicht mehrere Programminstanzen gleichzeitig.
- Prüfen Sie die Abschlussberichte auf Warnungen und fehlgeschlagene Aktionen.
- Entfernen Sie Quarantänedaten nicht ungeprüft.
- Netzwerk-, Signatur-, Hash- oder Quellenfehler führen zu einer sicheren Auslassung, Quarantäne oder zum Abbruch der betroffenen Aktion.

Für die vertrauliche Meldung möglicher Sicherheitslücken beachten Sie die [Sicherheitsrichtlinie](.github/SECURITY.md).

<div align="right">[⬆️ Nach oben](#oneclick-komplettreparatur)</div>

---

<a id="fehlerbehebung"></a>

## 🧰 Fehlerbehebung

<details>
<summary><strong>❓ Das Programm startet nach dem Doppelklick nicht sichtbar</strong></summary>

- Speichern Sie die PS1-Datei auf einem lokalen Laufwerk.
- Prüfen Sie in den Dateieigenschaften, ob Windows die Datei blockiert.
- Starten Sie die Repository-Datei testweise über:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\v1.0.0.ps1"
```

</details>

<details>
<summary><strong>⏳ Eine Installation scheint zu hängen</strong></summary>

- Warten Sie auf die integrierte Leerlaufüberwachung.
- Starten Sie keinen zweiten Installer parallel.
- Prüfen Sie danach die TXT-Zusammenfassung und den CSV-Bericht.

</details>

<details>
<summary><strong>📦 WinGet kann nicht bereitgestellt oder repariert werden</strong></summary>

- Prüfen Sie Internetverbindung, Systemdatum und Systemzeit.
- Installieren Sie ausstehende Windows-Updates.
- Starten Sie Windows neu und führen Sie das Programm erneut aus.

</details>

<details>
<summary><strong>🛠️ Ein Programm kann nicht automatisch repariert werden</strong></summary>

- Prüfen Sie den Abschlussbericht und die Quarantäneangaben.
- Verwenden Sie ausschließlich offizielle Herstellerquellen.
- Deinstallieren Sie Programme mit wichtigen Benutzerdaten nicht unüberlegt.

</details>

<details>
<summary><strong>🔄 Das Programm endet mit Exitcode 3010</strong></summary>

- Starten Sie Windows neu.
- Melden Sie sich mit demselben Benutzerkonto an.
- Lassen Sie die registrierte Fortsetzung vollständig abschließen.

</details>

### Weitere Hilfe

- [🐞 Fehler oder Funktionswunsch melden](https://github.com/Skeiver/OneClick-Komplettreparatur-fuer-Windows/issues/new/choose)
- [💬 Fragen in Discussions stellen](https://github.com/Skeiver/OneClick-Komplettreparatur-fuer-Windows/discussions)
- [🆘 Support-Hinweise lesen](.github/SUPPORT.md)

<div align="right">[⬆️ Nach oben](#oneclick-komplettreparatur)</div>

---

<a id="quellcode-und-release-informationen"></a>

## 🧾 Quellcode- und Release-Informationen

| Eigenschaft | Wert |
|:---|---:|
| **Quelltextzeilen der Repository-Datei** | `11.432` |
| **Dateigröße der Repository-Datei** | `724.142 Bytes` |

Der vollständige Repository-Quellcode der Version 1.0.0 liegt in [`v1.0.0.ps1`](v1.0.0.ps1). Der für Anwender empfohlene Download erfolgt über das unveränderte Asset des [GitHub-Releases 1.0.0](https://github.com/Skeiver/OneClick-Komplettreparatur-fuer-Windows/releases/tag/repair-tool-v.1.0.0).

Die Repository-Datei `v1.0.0.ps1` ist in der CI zusätzlich über ihren Git-Blob geschützt. Änderungen am Programmcode sollen nicht in Version 1.0.0 zurückgeschrieben, sondern als neue Version veröffentlicht werden.


### 🔏 Zukünftige Releases und Codesignatur

Für zukünftige Versionen kann zusätzlich eine **Authenticode-Codesignatur** mit einem geeigneten Code-Signing-Zertifikat verwendet werden. Eine bereits veröffentlichte Datei wie Version 1.0.0 wird dafür **nicht nachträglich verändert oder signiert**, weil dies den veröffentlichten Dateihash und den unveränderlichen Release-Snapshot ändern würde.

Eine Codesignatur wäre eine zusätzliche Herkunfts- und Integritätsprüfung; sie ersetzt weder die Einsicht in den Quellcode noch die SHA-256-Prüfung des jeweiligen Release-Assets.

<div align="right">[⬆️ Nach oben](#oneclick-komplettreparatur)</div>

---

<a id="lizenz-und-weiterverwendung"></a>

## ⚖️ Lizenz und Weiterverwendung

Dieses Projekt steht unter der [Apache License 2.0](LICENSE). Andere dürfen den Quellcode verwenden, bearbeiten, weiterentwickeln und unter Einhaltung der Lizenzbedingungen weiterverbreiten.

Die Datei [NOTICE](NOTICE) enthält die Attribution zur ursprünglichen Arbeit. Bei der Weiterverbreitung abgeleiteter Arbeiten muss diese Attribution gemäß Abschnitt 4(d) der Apache License 2.0 erhalten bleiben. Damit bleibt sichtbar, dass die ursprüngliche Implementierung und Inspiration aus der veröffentlichten Hauptdatei [`v1.0.0.ps1`](v1.0.0.ps1) des Projekts `Skeiver/OneClick-Komplettreparatur-fuer-Windows` stammt.

> [!IMPORTANT]
> Eigene Weiterentwicklungen sollen als eigene Änderungen gekennzeichnet werden. Die bereits veröffentlichte `v1.0.0.ps1` bleibt unverändert; neue Programmstände sollen als neue Versionsdateien veröffentlicht werden.

<div align="right">[⬆️ Nach oben](#oneclick-komplettreparatur)</div>

---

<a id="haftungshinweis"></a>

## ⚠️ Haftungshinweis

Die Ausführung erfolgt auf eigene Verantwortung. Trotz interner Sicherheits-, Nachkontroll-, Isolierungs- und Abbruchmechanismen können beschädigte Windows-Installationen, Drittanbieter-Installer, Sicherheitssoftware, Netzwerkausfälle oder herstellerspezifische Besonderheiten zu unvollständigen Reparaturen führen.

> [!IMPORTANT]
> **Prüfen Sie nach jedem Programmlauf die erzeugten Abschlussberichte.**

---

<div align="center">

### 🛠️ OneClick-Komplettreparatur

**Version 1.0.0 · Programmstand 01.08.2026**

[📦 Releases](https://github.com/Skeiver/OneClick-Komplettreparatur-fuer-Windows/releases) · [🐞 Issues](https://github.com/Skeiver/OneClick-Komplettreparatur-fuer-Windows/issues/new/choose) · [💬 Discussions](https://github.com/Skeiver/OneClick-Komplettreparatur-fuer-Windows/discussions) · [🔐 Security](.github/SECURITY.md) · [⚖️ Lizenz](LICENSE) · [🧾 Attribution](NOTICE)

[⬆️ Zurück zum Anfang](#oneclick-komplettreparatur)

</div>
