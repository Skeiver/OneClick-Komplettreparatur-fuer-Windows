# Beitragen zur OneClick-Komplettreparatur

Danke für das Interesse am Projekt. Beiträge sind willkommen, sofern sie nachvollziehbar, prüfbar und klar vom bereits veröffentlichten Release 1.0.0 getrennt bleiben.

## Schnellzugriff

- [🐞 Fehler melden](https://github.com/Skeiver/OneClick-Komplettreparatur-fuer-Windows/issues/new?template=bug_report.yml)
- [✨ Verbesserung vorschlagen](https://github.com/Skeiver/OneClick-Komplettreparatur-fuer-Windows/issues/new?template=feature_request.yml)
- [💬 Fragen und Austausch](https://github.com/Skeiver/OneClick-Komplettreparatur-fuer-Windows/discussions)
- [🔐 Sicherheitsrichtlinie](SECURITY.md)
- [⚖️ Apache License 2.0](../LICENSE)
- [🧾 Attribution / NOTICE](../NOTICE)
- [✅ Repository- und PowerShell-Prüfung](https://github.com/Skeiver/OneClick-Komplettreparatur-fuer-Windows/actions/workflows/powershell-ci.yml)

## Vor einem Beitrag

- Prüfen Sie zuerst, ob bereits ein passendes [Issue](https://github.com/Skeiver/OneClick-Komplettreparatur-fuer-Windows/issues) oder eine [Diskussion](https://github.com/Skeiver/OneClick-Komplettreparatur-fuer-Windows/discussions) existiert.
- Verwenden Sie für reproduzierbare Fehler das [Fehlerformular](https://github.com/Skeiver/OneClick-Komplettreparatur-fuer-Windows/issues/new?template=bug_report.yml) und für neue Ideen das [Formular für Verbesserungsvorschläge](https://github.com/Skeiver/OneClick-Komplettreparatur-fuer-Windows/issues/new?template=feature_request.yml).
- Veröffentlichen Sie keine Passwörter, Tokens, Schlüssel, vollständigen persönlichen Pfade oder andere vertrauliche Daten.
- Sicherheitslücken mit verwertbaren Details gehören nicht in öffentliche Issues oder Discussions. Beachten Sie dafür die [Sicherheitsrichtlinie](SECURITY.md).

## Zielbranch

Pull Requests sollen gegen den Standardbranch `OneClick-Komplettreparatur` gerichtet sein.

## Release 1.0.0 bleibt unverändert

Die Repository-Datei [`v1.0.0.ps1`](../v1.0.0.ps1) gehört zum veröffentlichten Stand der Version 1.0.0 und wird nach der Veröffentlichung nicht mehr verändert.

- Dokumentations-, GitHub-, CI- oder Supportänderungen dürfen `v1.0.0.ps1` nicht verändern.
- Fehlerkorrekturen oder neue Funktionen am Programmcode sollen in einer **neuen Versionsdatei** und einem **neuen Release** veröffentlicht werden.
- Reine Formatierungsänderungen am bereits veröffentlichten 1.0.0-Programmcode sind ebenfalls zu vermeiden.
- Die [Repository- und PowerShell-Prüfung](https://github.com/Skeiver/OneClick-Komplettreparatur-fuer-Windows/actions/workflows/powershell-ci.yml) kontrolliert den Git-Blob von `v1.0.0.ps1` und schlägt fehl, wenn dieser Snapshot verändert wurde.

### Repository-Datei und Release-Asset unterscheiden

Für Version 1.0.0 existieren zwei technisch getrennte GitHub-Dateien mit unterschiedlichen Aufgaben:

- [`v1.0.0.ps1`](../v1.0.0.ps1) ist der im Git-Repository einsehbare Quellcode-Snapshot. Seine Unverändertheit wird über den Git-Blob kontrolliert.
- `OneClick-Komplettreparatur-Release-v1.0.0.ps1` ist das separat hochgeladene Download-Asset des [GitHub-Releases 1.0.0](https://github.com/Skeiver/OneClick-Komplettreparatur-fuer-Windows/releases/tag/repair-tool-v.1.0.0).

Beide gehören zur Version 1.0.0, sind aber **separate GitHub-Artefakte** und dürfen nicht über Git-Blob und SHA-256 miteinander verwechselt werden. Für das heruntergeladene Release-Asset gilt der in der [README](../README.md#vor-der-ausfuehrung-pruefen) veröffentlichte SHA-256-Wert; für die Repository-Datei gilt der in der CI geprüfte Git-Blob.

Bereits veröffentlichte 1.0.0-Dateien werden nicht nachträglich ersetzt. Änderungen am Programm werden als neue Version veröffentlicht.

## Lizenz und Attribution

Das Projekt steht unter der [Apache License 2.0](../LICENSE). Sie erlaubt das Verwenden, Verändern, Weiterentwickeln und Weiterverbreiten des Programms unter Einhaltung ihrer Bedingungen.

Das Repository enthält außerdem eine [`NOTICE`](../NOTICE)-Datei. Bei der Weiterverbreitung abgeleiteter Arbeiten ist die darin enthaltene Attribution gemäß den Bedingungen der Apache License 2.0 zu berücksichtigen. Damit bleibt erkennbar, dass die ursprüngliche Implementierung und Inspiration aus der veröffentlichten Hauptdatei `v1.0.0.ps1` des Projekts `Skeiver/OneClick-Komplettreparatur-fuer-Windows` stammt.

Beiträge zu diesem Repository werden, sofern nicht ausdrücklich anders gekennzeichnet, unter denselben Lizenzbedingungen eingereicht.

## Empfohlener Ablauf

1. Erstellen Sie einen eigenen Branch oder Fork.
2. Nehmen Sie nur die für das jeweilige Thema erforderlichen Änderungen vor.
3. Prüfen Sie den Diff vor dem Commit auf unbeabsichtigte Änderungen und vertrauliche Daten.
4. Ändern Sie `v1.0.0.ps1` nicht; Programmänderungen gehören in eine neue Versionsdatei.
5. Lassen Sie die [GitHub-Actions-Prüfung](https://github.com/Skeiver/OneClick-Komplettreparatur-fuer-Windows/actions/workflows/powershell-ci.yml) vollständig durchlaufen.
6. Beschreiben Sie im Pull Request klar, was geändert wurde, warum die Änderung nötig ist und wie sie geprüft wurde.
7. Prüfen Sie bei einer Weiterverbreitung, dass [`LICENSE`](../LICENSE) und die Attribution aus [`NOTICE`](../NOTICE) korrekt berücksichtigt werden.

## Automatische Prüfung

Die vorhandene [Repository- und PowerShell-Prüfung](https://github.com/Skeiver/OneClick-Komplettreparatur-fuer-Windows/actions/workflows/powershell-ci.yml) prüft die PowerShell-Skripte rekursiv mit:

- Windows PowerShell 5.1
- PowerShell 7

Zusätzlich kontrolliert sie die erforderliche Repository-Struktur, Lizenz und Attribution, lokale README-Dateiverweise sowie den unveränderten Git-Blob der veröffentlichten Repository-Datei `v1.0.0.ps1`. Die eigentlichen Windows-Reparaturaktionen werden in der CI **nicht** ausgeführt.

## Pull-Request-Checkliste

Vor dem Absenden sollte gelten:

- [ ] Die Änderung hat einen klaren und nachvollziehbaren Zweck.
- [ ] Keine vertraulichen oder personenbezogenen Daten wurden eingecheckt.
- [ ] `v1.0.0.ps1` wurde nicht verändert.
- [ ] Änderungen am Programmcode befinden sich in einer neuen Versionsdatei.
- [ ] [`LICENSE`](../LICENSE) und [`NOTICE`](../NOTICE) wurden berücksichtigt und nicht unbeabsichtigt entfernt.
- [ ] Dokumentation und Links wurden bei Bedarf aktualisiert.
- [ ] Die GitHub-Actions-Prüfung ist erfolgreich oder eine Abweichung ist nachvollziehbar erklärt.
- [ ] Sicherheitsrelevante Details wurden nicht unnötig öffentlich gemacht.
