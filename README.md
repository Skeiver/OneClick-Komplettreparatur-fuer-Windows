<a id="oneclick-komplettreparatur"></a>

<div align="center">

# 🛠️ OneClick-Komplettreparatur

### Automatisierte Prüfung, Aktualisierung und Reparatur von Windows und installierten Programmen

<img width="100%" alt="OneClick-Komplettreparatur – Programmoberfläche" src="https://github.com/user-attachments/assets/b49f55b5-7575-46d1-b446-495dcf38fb0d" />

[📖 Beschreibung](#programmbeschreibung) · [✨ Funktionen](#hauptfunktionen) · [▶️ Start](#empfohlener-start) · [🧰 Fehlerbehebung](#fehlerbehebung)

</div>

---

> [!IMPORTANT]
> **Release 1.0.0 ist verfügbar.** Diese Version wurde mehrfach getestet und auf Fehler überprüft. Das Programm wird weiterhin gepflegt und zukünftige Versionen können zusätzliche Verbesserungen enthalten.

> [!WARNING]
> Das Programm verändert Windows-Komponenten und installierte Programme. Sichern Sie wichtige persönliche Daten und lesen Sie vor der Ausführung die [Sicherheitshinweise](#sicherheitshinweise).

> [!NOTE]
> Nach dem Programmlauf werden Protokolle und Berichte im Windows-Dokumenteordner gespeichert. Weitere Informationen finden Sie unter [Protokolle und Berichte](#protokolle-und-berichte).
>
> Falls nach einem Neustart Fortsetzungsfehler auftreten oder das Programm nicht sauber durchläuft, können die von OneClick-Komplettreparatur angelegten Laufzeitordner im Windows-Dokumenteordner gelöscht werden. Starten Sie das Programm anschließend erneut.

> [!TIP]
> **Für Programmierer:** Der vollständige Programmcode ist in der Datei `Programmcode-OneClick-Komplettreparatur-Release-v1.0.0.txt` enthalten und kann heruntergeladen sowie weiterverwendet werden.

<div align="center">

</div>

---

<a id="projektinformationen"></a>

## 📋 Projektinformationen

| Eigenschaft | Wert |
|:---|:---|
| **Produkt** | `OneClick-Komplettreparatur-Release-v1.0.0` |
| **Version** | `1.0.0` |
| **Programmstand** | `01.08.2026` |
| **Ausgangsdatei** | `OneClick-Komplettreparatur-Release-v1.0.0.ps1` |

---

<a id="inhaltsverzeichnis"></a>

## 📑 Inhaltsverzeichnis

1. [Programmbeschreibung](#programmbeschreibung)
2. [Hauptfunktionen](#hauptfunktionen)
3. [Voraussetzungen](#voraussetzungen)
4. [Datei vor dem ersten Start entsperren](#datei-vor-dem-ersten-start-entsperren)
5. [Empfohlener Start](#empfohlener-start)
6. [Ablauf des Programms](#ablauf-des-programms)
7. [Protokolle und Berichte](#protokolle-und-berichte)
8. [Leerlauf- und Timeout-Schutz](#leerlauf-und-timeout-schutz)
9. [Neustart und automatische Fortsetzung](#neustart-und-automatische-fortsetzung)
10. [Exitcodes](#exitcodes)
11. [Sicherheitshinweise](#sicherheitshinweise)
12. [Fehlerbehebung](#fehlerbehebung)
13. [Quellcode-Informationen](#quellcode-informationen)
14. [Haftungshinweis](#haftungshinweis)

---

<a id="programmbeschreibung"></a>

## 🔎 Programmbeschreibung

**OneClick-Komplettreparatur** ist ein PowerShell-Programm für Microsoft Windows. Es prüft die Windows-Systembasis, erfasst installierte Programme, sucht nach Aktualisierungen und führt unterstützte Reparaturen oder abgesicherte Neuinstallationen aus.

Benutzerbezogene Programme werden kontrolliert mit einem normalen Benutzertoken bearbeitet. Computerweit installierte Programme und die Hauptsteuerung laufen mit Administratorrechten.

<div align="right">

[⬆️ Nach oben](#oneclick-komplettreparatur)

</div>

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

<div align="right">

[⬆️ Nach oben](#oneclick-komplettreparatur)

</div>

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

<div align="right">

[⬆️ Nach oben](#oneclick-komplettreparatur)

</div>

---

<a id="datei-vor-dem-ersten-start-entsperren"></a>

## 🔓 Datei vor dem ersten Start entsperren

Windows kann eine aus dem Internet heruntergeladene PowerShell-Datei blockieren. Führen Sie deshalb vor dem ersten Start folgende Schritte aus:

1. Klicken Sie mit der rechten Maustaste auf `OneClick-Komplettreparatur-Release-v1.0.0.ps1`.
2. Wählen Sie **Eigenschaften**.
3. Öffnen Sie den Reiter **Allgemein**.
4. Suchen Sie unten im Fenster den Bereich **Sicherheit**.
5. Aktivieren Sie das Kontrollkästchen **Zulassen**.
6. Klicken Sie auf **Übernehmen**.
7. Klicken Sie anschließend auf **OK**.

> [!NOTE]
> Wird der Bereich **Sicherheit** oder das Kontrollkästchen **Zulassen** nicht angezeigt, ist die Datei bereits entsperrt oder wurde von Windows nicht blockiert.

> [!CAUTION]
> Aktivieren Sie **Zulassen** nur, wenn Sie der Herkunft der Datei vertrauen.

<div align="right">

[⬆️ Nach oben](#oneclick-komplettreparatur)

</div>

---

<a id="empfohlener-start"></a>

## ▶️ Empfohlener Start

1. Speichern Sie die PS1-Datei auf einem lokalen Laufwerk.
2. Schließen Sie andere Installationsprogramme.
3. Doppelklicken Sie auf die PS1-Datei, um das Programm zu starten.
4. Bestätigen Sie die Windows-Benutzerkontensteuerung.
5. Lassen Sie das Programmfenster bis zum vollständigen Abschluss geöffnet.
6. Starten Sie Windows neu, wenn das Programm dazu auffordert.
7. Melden Sie sich danach wieder mit demselben Benutzerkonto an.

### Alternativer Start über PowerShell

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\OneClick-Komplettreparatur-Release-v1.0.0.ps1"
```

### Unbeaufsichtigter Start

Start ohne abschließende Tasteneingabe:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\OneClick-Komplettreparatur-Release-v1.0.0.ps1" -KeinePause
```

> [!NOTE]
> Die Option `-ExecutionPolicy Bypass` gilt nur für den gestarteten PowerShell-Prozess und verändert die Windows-Richtlinie nicht dauerhaft.

<div align="right">

[⬆️ Nach oben](#oneclick-komplettreparatur)

</div>

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

<div align="right">

[⬆️ Nach oben](#oneclick-komplettreparatur)

</div>

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

<div align="right">

[⬆️ Nach oben](#oneclick-komplettreparatur)

</div>

---

<a id="leerlauf-und-timeout-schutz"></a>

## ⏱️ Leerlauf- und Timeout-Schutz

Das Programm überwacht:

- Installations- und Reparaturprozesse,
- zugehörige Kindprozesse,
- Protokollaktivitäten,
- laufende Downloads.

Bei überschrittener Gesamtlaufzeit oder längerer nachgewiesener Inaktivität wird der betroffene Vorgang kontrolliert beendet und im Bericht erfasst.

> [!NOTE]
> Ein einzelner Paketfehler verhindert nicht automatisch die Prüfung der übrigen Programme. Schwere Infrastruktur-, Phasen- oder Windows-Systemfehler können den Gesamtlauf weiterhin sicher abbrechen.

<div align="right">

[⬆️ Nach oben](#oneclick-komplettreparatur)

</div>

---

<a id="neustart-und-automatische-fortsetzung"></a>

## 🔄 Neustart und automatische Fortsetzung

Erfordert eine System- oder Reparaturaktion einen Neustart, pausiert das Programm weitere verändernde Aktionen. Es speichert einen geschützten Fortsetzungsstatus und registriert eine geplante Aufgabe.

Die Fortsetzung wird nur akzeptiert, wenn:

- der gespeicherte Status gültig ist und
- tatsächlich ein neuer Windows-Start stattgefunden hat.

<div align="right">

[⬆️ Nach oben](#oneclick-komplettreparatur)

</div>

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

<div align="right">

[⬆️ Nach oben](#oneclick-komplettreparatur)

</div>

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

<div align="right">

[⬆️ Nach oben](#oneclick-komplettreparatur)

</div>

---

<a id="fehlerbehebung"></a>

## 🧰 Fehlerbehebung

<details>
<summary><strong>❓ Das Programm startet nach dem Doppelklick nicht sichtbar</strong></summary>

<br>

- Speichern Sie die PS1-Datei auf einem lokalen Laufwerk.
- Prüfen Sie in den Dateieigenschaften, ob Windows die Datei blockiert.
- Starten Sie die Datei testweise über:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\OneClick-Komplettreparatur-Release-v1.0.0.ps1"
```

</details>

<details>
<summary><strong>⏳ Eine Installation scheint zu hängen</strong></summary>

<br>

- Warten Sie auf die integrierte Leerlaufüberwachung.
- Starten Sie keinen zweiten Installer parallel.
- Prüfen Sie danach die TXT-Zusammenfassung und den CSV-Bericht.

</details>

<details>
<summary><strong>📦 WinGet kann nicht bereitgestellt oder repariert werden</strong></summary>

<br>

- Prüfen Sie Internetverbindung, Systemdatum und Systemzeit.
- Installieren Sie ausstehende Windows-Updates.
- Starten Sie Windows neu und führen Sie das Programm erneut aus.

</details>

<details>
<summary><strong>🛠️ Ein Programm kann nicht automatisch repariert werden</strong></summary>

<br>

- Prüfen Sie den Abschlussbericht und die Quarantäneangaben.
- Verwenden Sie ausschließlich offizielle Herstellerquellen.
- Deinstallieren Sie Programme mit wichtigen Benutzerdaten nicht unüberlegt.

</details>

<details>
<summary><strong>🔄 Das Programm endet mit Exitcode 3010</strong></summary>

<br>

- Starten Sie Windows neu.
- Melden Sie sich mit demselben Benutzerkonto an.
- Lassen Sie die registrierte Fortsetzung vollständig abschließen.

</details>

<div align="right">

[⬆️ Nach oben](#oneclick-komplettreparatur)

</div>

---

<a id="quellcode-informationen"></a>

## 🧾 Quellcode-Informationen

| Eigenschaft | Wert |
|:---|---:|
| **Quelltextzeilen** | `11.432` |
| **Dateigröße des ursprünglichen Skripts** | `728.686 Bytes` |

### 🔏 SHA-256-Prüfsumme

```text
C6ED1392CC08D7757359725AE0ED29F9AC5C1AB37EC7D6244957C8AEC5B37D86
```

Die Datei `Programmcode-OneClick-Komplettreparatur-Release-v1.0.0.txt` ist eine bytegenaue Kopie des bereitgestellten PowerShell-Skripts. Nur Dateiname und Dateiendung unterscheiden sich.

<div align="right">

[⬆️ Nach oben](#oneclick-komplettreparatur)

</div>

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

[⬆️ Zurück zum Anfang](#oneclick-komplettreparatur)

</div>
