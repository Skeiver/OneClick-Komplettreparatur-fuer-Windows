#requires -Version 5.1
<#
.SYNOPSIS
    Eine einzige One-Click-Datei fuer PowerShell 7, WinGet, Programm-Updates,
    Pruefung aller ermittelbaren registrierten Programme, MSI- und WinGet-Reparaturen,
    abgesicherte Community- und Store-Neuinstallationen, Desktop-Verknuepfungen
    fuer den aktuellen Benutzer, verifizierte Abschlussbereinigung sowie
    DISM/SFC/CHKDSK.

.DESCRIPTION
    Ein in diese Datei eingebetteter Startbereich uebergibt einen Doppelklick
    aus Windows PowerShell 5.1 sicher und sichtbar an eine verifizierte
    PowerShell 7.4 oder neuer und fordert dabei Administratorrechte an.
    Der oeffentliche Hauptlauf und saemtliche Reparaturfunktionen werden
    ausschliesslich mit PowerShell 7.4 oder neuer und erhoeht ausgefuehrt und
    verifiziert die neueste stabile PowerShell-7-Version. Eine verfuegbare
    Aktualisierung wird zuerst signatur- und hashgeprueft installiert; danach
    startet der eigentliche Hauptlauf mit dem nachkontrollierten neuen Host.
    Nur fuer Pakete, die einen erhoehten Token technisch verbieten, startet
    der administrative Hauptlauf einen eng begrenzten user-scope Broker mit
    normalem Benutzertoken; die Orchestrierung bleibt administrativ.
    Der vorhandene Installationsscope wird nie auf einen anderen Benutzer oder
    zwischen Benutzer- und Maschinenscope umgeleitet.

.NOTES
    Produkt: OneClick-Komplettreparatur-Release-v1.0.0
    Version: 1.0.0
    Stand:   01.08.2026
    Quellen: Microsoft WinGet-Standardquellen, Microsoft PowerShell Gallery
             sowie das offizielle GitHub-Repository Microsoft/PowerShell.
#>

[Diagnostics.CodeAnalysis.SuppressMessageAttribute(
    'PSAvoidUsingWriteHost', '',
    Justification = 'Die interne Konsolenausgabe benoetigt Farben und besitzt einen Console.WriteLine-Fallback fuer Hosts ohne Write-Host.'
)]
[Diagnostics.CodeAnalysis.SuppressMessageAttribute(
    'PSUseApprovedVerbs', '',
    Justification = 'Die betroffenen Funktionen sind skriptintern und verwenden absichtlich eindeutige deutsche Aktionsnamen.'
)]
[Diagnostics.CodeAnalysis.SuppressMessageAttribute(
    'PSUseShouldProcessForStateChangingFunctions', '',
    Justification = 'Der ausdruecklich unbeaufsichtigte OneClick-Orchestrator bestaetigt Aktionen durch seinen Aufruf; mehrere gemeldete New-Funktionen erstellen nur Argumentlisten oder Ergebnisobjekte.'
)]
[Diagnostics.CodeAnalysis.SuppressMessageAttribute(
    'PSUseSingularNouns', '',
    Justification = 'Der interne Name beschreibt bewusst eine Liste mehrerer verfuegbarer WinGet-Updates.'
)]
[Diagnostics.CodeAnalysis.SuppressMessageAttribute(
    'PSReviewUnusedParameter', '',
    Justification = 'Skriptparameter werden absichtlich in verschachtelten Orchestrator- und Brokerfunktionen ausgewertet; die statische Regel verfolgt diese Skriptscope-Verwendung nicht vollstaendig.'
)]
[CmdletBinding()]
param(
    [switch]$KeinePause,

    # Standardmaessig werden MSI-Pakete nur repariert, wenn die
    # Integritaetspruefung einen belastbaren Beschaedigungsverdacht meldet.
    # Dieser Schalter erzwingt die fruehere Vollpruefung aller reparierbaren
    # MSI-Pakete und sollte nur fuer eine bewusst gewuenschte Tiefenreparatur
    # verwendet werden.
    [switch]$AlleMSIReparieren,

    # Erzwingt auch fuer unveraenderte Pakete eine erneute mutierende
    # WinGet-Tiefenreparatur. Ohne diesen Schalter werden alle Pakete bei
    # jedem Lauf inventarisiert, auf Updates und eindeutigen Scope geprueft;
    # eine bereits erfolgreich nachkontrollierte Reparatur derselben Version
    # wird innerhalb desselben noch nicht abgeschlossenen Gesamtlaufs nicht
    # unnoetig wiederholt. Nach einem Gesamterfolg wird der Pruefstatus geloescht.
    [switch]$AlleWinGetReparieren,

    # Kompatibilitaetsschalter: Schwere Phasen-, Infrastruktur- und Windows-
    # Fehler bleiben standardmaessig abbrechend. Fehler eines einzelnen
    # Programmpakets werden dagegen immer isoliert beziehungsweise bei einer
    # Hashabweichung quarantiniert, damit alle weiteren Programme geprueft und
    # repariert werden koennen.
    [switch]$BeiFehlerAbbrechen,

    # Erlaubt zusaetzlich das Fortsetzen nach voneinander unabhaengigen
    # Phasenfehlern. Die paketweise Fortsetzung ist in beiden Modi aktiv.
    [switch]$FehlerFortsetzen,

    # Registriert die automatische Fortsetzung, zeigt aber keinen interaktiven
    # Neustartdialog. Der Benutzer kann Windows spaeter selbst neu starten.
    # Diese Option ist insbesondere fuer unbeaufsichtigte Aufrufe geeignet.
    [switch]$NeustartSpaeter,

    # Interne, nicht fuer den manuellen Aufruf bestimmte Parameter. Der
    # erhoehte Hauptlauf verwendet sie fuer einen kontrollierten Teilprozess
    # mit normalem Benutzertoken. Dadurch werden user-scope Installer niemals
    # versehentlich im Administratorkontext gestartet.
    [switch]$NurBenutzerProgramme,
    [string]$BenutzerErgebnisPfad = '',
    [ValidateSet('Komplett', 'Update', 'Reparatur')]
    [string]$BenutzerPhasenmodus = 'Komplett',
    [switch]$FortsetzenNachNeustart,
    [string]$FortsetzungsStatusPfad = ''
)

if ($BeiFehlerAbbrechen -and $FehlerFortsetzen) {
    throw 'Die Schalter -BeiFehlerAbbrechen und -FehlerFortsetzen duerfen nicht gemeinsam verwendet werden.'
}
$BeiFehlerAbbrechen = -not [bool]$FehlerFortsetzen

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
try {
    [Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12
}
catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }

# -----------------------------
# Globale Laufzeitdaten
# -----------------------------
$script:Version = '1.0.0'
$script:SelfPath = [string]$PSCommandPath
if ([string]::IsNullOrWhiteSpace($script:SelfPath)) {
    $script:SelfPath = [string]$MyInvocation.MyCommand.Path
}
if ([string]::IsNullOrWhiteSpace($script:SelfPath)) {
    throw 'Der eigene Skriptpfad konnte nicht ermittelt werden. Speichern Sie die Datei lokal und starten Sie sie erneut.'
}
$script:SelfPath = [IO.Path]::GetFullPath($script:SelfPath)
$script:ExitCode = 0
$script:BootstrapExitCode = 20
try { Unblock-File -LiteralPath $script:SelfPath -ErrorAction SilentlyContinue } catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }
$script:Warnungen = New-Object 'System.Collections.Generic.List[string]'
$script:Resultate = New-Object 'System.Collections.Generic.List[object]'
$script:TranscriptGestartet = $false
$script:TempOrdner = $null
$script:LogOrdner = $null
$script:LogDatei = $null
$script:BerichtOrdner = $null
$script:WinGetQuarantaeneOrdner = $null
$script:WinGetQuarantaeneDatei = $null
$script:InstallationsOrdner = $null
$script:PaketPruefstatusDatei = $null
$script:PaketPruefstatus = @{}
$script:PaketPruefprofilVersion = 1
$script:RepariertePakete = 0
$script:NichtUnterstuetzteReparaturen = 0
$script:FehlgeschlageneReparaturen = 0
$script:NachkontrollierteReparaturen = 0
$script:FehlgeschlageneReparaturNachkontrollen = 0
$script:AktualisiertePakete = 0
$script:BereitsAktuellePakete = 0
$script:FehlgeschlageneUpdates = 0
$script:UebersprungeneUpdates = 0
$script:UnsichereUpdateZeilen = 0
$script:AusgelasseneUpdateKontexte = 0
$script:NachkontrollierteUpdates = 0
$script:FehlgeschlageneUpdateNachkontrollen = 0
$script:HeruntergeladeneInstallationspakete = 0
$script:FehlgeschlageneInstallerDownloads = 0
$script:ErfolgreicheNeuinstallationen = 0
$script:FehlgeschlageneNeuinstallationen = 0
$script:UebersprungeneNeuinstallationen = 0
$script:UnbehobeneProgrammfehler = 0
$script:GepruefteRegistryProgramme = 0
$script:ProgrammeMitBeschaedigungsverdacht = 0
$script:NichtVollstaendigPruefbareProgramme = 0
$script:SicherAusgeschlosseneRegistryProgramme = 0
$script:MSIPruefungen = 0
$script:ErfolgreicheMSIReparaturen = 0
$script:FehlgeschlageneMSIReparaturen = 0
$script:NachkontrollierteMSIReparaturen = 0
$script:FehlgeschlageneMSINachkontrollen = 0
$script:MSIOhneReparaturbedarf = 0
$script:GepruefteWinGetPakete = 0
$script:ProgrammeMitManuellerPruefung = 0
$script:RegistryRoutenGesamt = 0
$script:RegistryPruefungenAusgefuehrt = 0
$script:RegistryAutomatischeAktionen = 0
$script:RegistryManuelleRouten = 0
$script:WinGetReparaturRoutenGesamt = 0
$script:WinGetReparaturRoutenAusgefuehrt = 0
$script:WinGetReparaturRoutenAusgelassen = 0
$script:InstallationsLeerlaufAbbrueche = 0
$script:FremdeInstallerIgnoriert = 0
$script:AktuelleReparaturPruefungenWiederverwendet = 0
$script:VorabDownloadsWiederverwendet = 0
$script:UnaufgeloesteRegistryProgramme = 0
$script:DesktopVerknuepfungenErstellt = 0
$script:DesktopVerknuepfungenVorhanden = 0
$script:DesktopVerknuepfungenNichtAnwendbar = 0
$script:DesktopVerknuepfungenFehlgeschlagen = 0
$script:BereinigteRestdateien = 0
$script:BereinigteRestordner = 0
$script:BereinigteRestbytes = [int64]0
$script:Bereinigungsfehler = 0
$script:AbschlussbereinigungAusgefuehrt = $false
$script:AbschlussbereinigungVerifiziert = $false
$script:NeustartErforderlich = $false
$script:NeustartNachweise = New-Object 'System.Collections.Generic.List[object]'
$script:WindowsNeustartstatusBeimStart = $null
$script:FortschrittId = 1
$script:FortschrittProzent = -1
$script:FortschrittStatus = ''
$script:KategorieFortschrittName = ''
$script:KategorieFortschrittProzent = -1
$script:HauptlaufAbbruchwaechter = $null
$script:FortsetzungsPhase = 'WindowsSystem'
$script:FortsetzungsAbschnitt = 'WindowsSystem'
$script:FortsetzungsStatus = $null
$script:NeustartPauseAktiv = $false
$script:NeustartGrund = ''
$script:NeustartDialogNachAbschluss = $false
$script:FortsetzungsAufgabenName = ''
$script:FortsetzungsStatusDatei = ''
$script:FortsetzungsSkriptDatei = ''

try {
    [Console]::OutputEncoding = New-Object Text.UTF8Encoding($false)
    [Console]::InputEncoding = New-Object Text.UTF8Encoding($false)
}
catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }

try {
    $Host.UI.RawUI.WindowTitle = 'OneClick-Komplettreparatur-Release-v1.0.0 - Vorbereitung'
}
catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }

# -----------------------------
# Allgemeine Hilfsfunktionen
# -----------------------------
function Get-KonsolenbreiteSicher {
    param([ValidateRange(40, 500)][int]$FallbackBreite = 120)

    $breite = 0
    try { $breite = [int]$Host.UI.RawUI.WindowSize.Width }
    catch { $breite = 0 }
    if ($breite -le 0) {
        try { $breite = [int][Console]::WindowWidth }
        catch { $breite = 0 }
    }
    if ($breite -le 0) { $breite = $FallbackBreite }

    # Eine Spalte Reserve verhindert, dass ConsoleHost beim exakten Treffen des
    # rechten Fensterrands eine zusaetzliche leere Zeile erzeugt. Die Breite wird
    # bei jeder Ausgabe neu gelesen und folgt damit auch einer Fensteraenderung.
    return [Math]::Max(40, [Math]::Min(500, $breite - 1))
}

function Split-KonsolentextFuerFenster {
    param(
        [Parameter(Mandatory = $true)][AllowEmptyString()][string]$Text,
        [ValidateRange(0, 500)][int]$Breite = 0
    )

    if ($Breite -le 0) { $Breite = Get-KonsolenbreiteSicher }
    $ausgabeZeilen = New-Object 'System.Collections.Generic.List[string]'
    foreach ($ursprungsZeile in @($Text -split "`r?`n")) {
        $rest = [string]$ursprungsZeile
        if ($rest.Length -eq 0) {
            $ausgabeZeilen.Add('') | Out-Null
            continue
        }
        while ($rest.Length -gt $Breite) {
            $trennstelle = $Breite
            $fenster = $rest.Substring(0, $Breite)
            $leerzeichen = $fenster.LastIndexOfAny([char[]]@(' ', "`t"))
            if ($leerzeichen -ge [Math]::Max(10, [int][Math]::Floor($Breite * 0.4))) {
                $trennstelle = $leerzeichen
            }
            $ausgabeZeilen.Add($rest.Substring(0, $trennstelle).TrimEnd()) | Out-Null
            $rest = $rest.Substring($trennstelle).TrimStart()
        }
        $ausgabeZeilen.Add($rest) | Out-Null
    }
    return @($ausgabeZeilen.ToArray())
}

function Write-KonsolentextSicher {
    param(
        [Parameter(Mandatory = $true)][AllowEmptyString()][string]$Text,
        [string]$Farbe = ''
    )

    $fensterZeilen = @(Split-KonsolentextFuerFenster -Text $Text)
    try {
        foreach ($fensterZeile in $fensterZeilen) {
            if ([string]::IsNullOrWhiteSpace($Farbe)) {
                Write-Host $fensterZeile -ErrorAction Stop
            }
            else {
                Write-Host $fensterZeile -ForegroundColor $Farbe -ErrorAction Stop
            }
        }
        return
    }
    catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }

    try {
        foreach ($fensterZeile in $fensterZeilen) { [Console]::WriteLine($fensterZeile) }
    }
    catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }
}

function Write-Status {
    param(
        [Parameter(Mandatory = $true)][string]$Text,
        [ValidateSet('INFO', 'OK', 'WARNUNG', 'FEHLER', 'SCHRITT')]
        [string]$Stufe = 'INFO'
    )

    $zeit = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    $zeile = '[{0}] [{1}] {2}' -f $zeit, $Stufe, $Text

    switch ($Stufe) {
        'OK'      { Write-KonsolentextSicher -Text $zeile -Farbe 'Green' }
        'WARNUNG' { Write-KonsolentextSicher -Text $zeile -Farbe 'Yellow' }
        'FEHLER'  { Write-KonsolentextSicher -Text $zeile -Farbe 'Red' }
        'SCHRITT' { Write-KonsolentextSicher -Text ''; Write-KonsolentextSicher -Text $zeile -Farbe 'Cyan' }
        default   { Write-KonsolentextSicher -Text $zeile }
    }

    if (-not [string]::IsNullOrWhiteSpace($script:LogDatei)) {
        try {
            Add-Content -LiteralPath $script:LogDatei -Value $zeile -Encoding UTF8
        }
        catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }
    }
}

function Get-FortschrittsbalkenText {
    param(
        [int]$Prozent,
        [ValidateRange(10, 60)][int]$Breite = 30
    )

    $sichererProzentwert = [Math]::Max(0, [Math]::Min(100, $Prozent))
    $gefuellt = [int][Math]::Floor(($sichererProzentwert / 100.0) * $Breite)
    $leer = $Breite - $gefuellt
    $fuellText = -join ('#' * $gefuellt)
    $leerText = -join ('-' * $leer)
    return ('[' + $fuellText + $leerText + ']')
}

function Get-Fortschrittszeile {
    param(
        [int]$Prozent,
        [Parameter(Mandatory = $true)][string]$Status,
        [ValidateRange(10, 60)][int]$Breite = 30
    )

    $sichererProzentwert = [Math]::Max(0, [Math]::Min(100, $Prozent))
    $sichererStatus = $Status.Replace("`r", ' ').Replace("`n", ' ').Trim()

    $balken = Get-FortschrittsbalkenText -Prozent $sichererProzentwert -Breite $Breite
    return ('{0} {1,3}%  {2}' -f $balken, $sichererProzentwert, $sichererStatus)
}

function Write-FortschrittszeileSicher {
    param([Parameter(Mandatory = $true)][string]$Text)

    # Keine integrierte Progress-UI und keine Cursor-Manipulation: Der Classic-Renderer von
    # ConsoleHost/Windows Terminal kann bei kleinen oder veraenderten Fensterhoehen
    # mit "bottom cannot be greater than or equal to top" abbrechen. Eine normale
    # Textzeile ist hostunabhaengig und funktioniert auch bei Umleitung/Transcript.
    Write-KonsolentextSicher -Text $Text -Farbe 'Magenta'
}

function Get-ZweistufigeFortschrittszeile {
    param(
        [int]$GesamtProzent,
        [Parameter(Mandatory = $true)][string]$Status,
        [AllowEmptyString()][string]$Kategorie = '',
        [int]$KategorieProzent = -1
    )

    $gesamt = [Math]::Max(0, [Math]::Min(100, $GesamtProzent))
    $sichererStatus = $Status.Replace("`r", ' ').Replace("`n", ' ').Trim()
    $gesamtBalken = Get-FortschrittsbalkenText -Prozent $gesamt -Breite 18
    if ([string]::IsNullOrWhiteSpace($Kategorie) -or $KategorieProzent -lt 0) {
        return ('Gesamt {0} {1,3}% | {2}' -f $gesamtBalken, $gesamt, $sichererStatus)
    }

    $kategorieWert = [Math]::Max(0, [Math]::Min(100, $KategorieProzent))
    $sichereKategorie = $Kategorie.Replace("`r", ' ').Replace("`n", ' ').Trim()
    if ($sichereKategorie.Length -gt 32) { $sichereKategorie = $sichereKategorie.Substring(0, 29) + '...' }
    $kategorieBalken = Get-FortschrittsbalkenText -Prozent $kategorieWert -Breite 14
    return ('Gesamt {0} {1,3}% | {2} {3} {4,3}% | {5}' -f $gesamtBalken, $gesamt, $sichereKategorie, $kategorieBalken, $kategorieWert, $sichererStatus)
}

function Set-Gesamtfortschritt {
    param(
        [int]$Prozent,
        [Parameter(Mandatory = $true)][string]$Status,
        [AllowEmptyString()][string]$Kategorie = '',
        [ValidateRange(-1, 100)][int]$KategorieProzent = -1,
        [switch]$Abgeschlossen,
        [switch]$Dauerhaft
    )

    $sichererProzentwert = [Math]::Max(0, [Math]::Min(100, $Prozent))
    if ($Abgeschlossen) {
        $sichererProzentwert = 100
    }

    $kategorieVariable = Get-Variable -Name 'KategorieFortschrittName' -Scope Script -ErrorAction SilentlyContinue
    $kategorieProzentVariable = Get-Variable -Name 'KategorieFortschrittProzent' -Scope Script -ErrorAction SilentlyContinue
    $bisherigeKategorie = if ($null -eq $kategorieVariable) { '' } else { [string]$kategorieVariable.Value }
    $bisherigerKategorieProzent = if ($null -eq $kategorieProzentVariable) { -1 } else { [int]$kategorieProzentVariable.Value }
    $neueKategorie = if ([string]::IsNullOrWhiteSpace($Kategorie)) { $bisherigeKategorie } else { $Kategorie }
    $neuerKategorieProzent = if ($KategorieProzent -lt 0) { $bisherigerKategorieProzent } else { $KategorieProzent }

    $statusGeaendert = ($script:FortschrittStatus -ne $Status)
    $prozentGeaendert = ($script:FortschrittProzent -ne $sichererProzentwert)
    $kategorieGeaendert = ($bisherigeKategorie -ne $neueKategorie -or $bisherigerKategorieProzent -ne $neuerKategorieProzent)
    $sollAusgeben = $Abgeschlossen -or $prozentGeaendert -or $kategorieGeaendert -or ($Dauerhaft -and $statusGeaendert)

    if ($sollAusgeben) {
        $zeile = Get-ZweistufigeFortschrittszeile -GesamtProzent $sichererProzentwert -Status $Status -Kategorie $neueKategorie -KategorieProzent $neuerKategorieProzent
        Write-FortschrittszeileSicher -Text $zeile

        if (-not [string]::IsNullOrWhiteSpace($script:LogDatei)) {
            try {
                Add-Content -LiteralPath $script:LogDatei -Value ('[{0}] [FORTSCHRITT] {1}' -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $zeile) -Encoding UTF8
            }
            catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }
        }
    }

    $script:FortschrittProzent = $sichererProzentwert
    $script:FortschrittStatus = $Status
    $script:KategorieFortschrittName = $neueKategorie
    $script:KategorieFortschrittProzent = $neuerKategorieProzent
}

function Add-Warnung {
    param([Parameter(Mandatory = $true)][string]$Text)

    $script:Warnungen.Add($Text) | Out-Null
    Write-Status -Text $Text -Stufe 'WARNUNG'
}

function Add-Resultat {
    param(
        [Parameter(Mandatory = $true)][string]$Bereich,
        [Parameter(Mandatory = $true)][string]$Aktion,
        [Parameter(Mandatory = $true)][string]$Status,
        [int]$ExitCode = 0,
        [string]$Details = ''
    )

    $script:Resultate.Add([pscustomobject]@{
        Zeitpunkt = Get-Date
        Bereich    = $Bereich
        Aktion     = $Aktion
        Status     = $Status
        ExitCode   = $ExitCode
        Details    = $Details
    }) | Out-Null
}

function Get-SichereEigenschaft {
    param(
        [AllowNull()][object]$Objekt,
        [Parameter(Mandatory = $true)][string]$Name,
        [AllowNull()][object]$Standardwert = $null
    )

    if ($null -eq $Objekt) {
        return $Standardwert
    }

    try {
        $eigenschaft = $Objekt.PSObject.Properties[$Name]
        if ($null -eq $eigenschaft) {
            return $Standardwert
        }
        return $eigenschaft.Value
    }
    catch {
        return $Standardwert
    }
}

function Get-SichererText {
    param(
        [AllowNull()][object]$Objekt,
        [Parameter(Mandatory = $true)][string]$Name,
        [string]$Standardwert = ''
    )

    $wert = Get-SichereEigenschaft -Objekt $Objekt -Name $Name -Standardwert $Standardwert
    if ($null -eq $wert) {
        return $Standardwert
    }
    return [string]$wert
}

function Get-JsonObjektAusText {
    param([AllowNull()][string]$Text)

    if ([string]::IsNullOrWhiteSpace($Text)) {
        return $null
    }

    $kandidat = $Text.Trim()
    try {
        return ($kandidat | ConvertFrom-Json -ErrorAction Stop)
    }
    catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }

    # WinGet kann lokalisierte Hinweise vor oder nach dem eigentlichen JSON ausgeben.
    # Deshalb wird ein vollstaendiger Objekt- oder Arraybereich sicher extrahiert.
    $objektStart = $kandidat.IndexOf('{')
    $objektEnde = $kandidat.LastIndexOf('}')
    if ($objektStart -ge 0 -and $objektEnde -gt $objektStart) {
        try {
            return ($kandidat.Substring($objektStart, ($objektEnde - $objektStart + 1)) | ConvertFrom-Json -ErrorAction Stop)
        }
        catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }
    }

    $arrayStart = $kandidat.IndexOf('[')
    $arrayEnde = $kandidat.LastIndexOf(']')
    if ($arrayStart -ge 0 -and $arrayEnde -gt $arrayStart) {
        try {
            return ($kandidat.Substring($arrayStart, ($arrayEnde - $arrayStart + 1)) | ConvertFrom-Json -ErrorAction Stop)
        }
        catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }
    }

    return $null
}

function Invoke-Phase {
    param(
        [Parameter(Mandatory = $true)][string]$Name,
        [Parameter(Mandatory = $true)][string]$Bereich,
        [Parameter(Mandatory = $true)][scriptblock]$Aktion,
        [switch]$Fatal
    )

    try {
        return (& $Aktion)
    }
    catch {
        $details = ($_ | Out-String).Trim()
        Add-Resultat -Bereich $Bereich -Aktion $Name -Status 'Ausnahme' -ExitCode -1 -Details $details
        if ($Fatal -or $BeiFehlerAbbrechen) {
            throw
        }
        Add-Warnung -Text ("Phase '{0}' ist fehlgeschlagen und wurde sicher uebersprungen: {1}" -f $Name, $_.Exception.Message)
        return $null
    }
}

function Assert-Selbsttest {
    param(
        [Parameter(Mandatory = $true)][bool]$Bedingung,
        [Parameter(Mandatory = $true)][string]$Meldung
    )

    if (-not $Bedingung) {
        throw "Interner Selbsttest fehlgeschlagen: $Meldung"
    }
}

function Get-AbschlussExitCode {
    param(
        [ValidateRange(0, [int]::MaxValue)][int]$WarnungsAnzahl,
        [bool]$NeustartErforderlich
    )

    # Der standardisierte Neustartcode muss fuer aufrufende Automatisierungen
    # erhalten bleiben. Warnungen werden weiterhin vollstaendig protokolliert.
    if ($NeustartErforderlich) { return 3010 }
    if ($WarnungsAnzahl -gt 0) { return 2 }
    return 0
}

function Add-OneClickNeustartnachweis {
    param(
        [Parameter(Mandatory = $true)][string]$Quelle,
        [int]$ExitCode = 0,
        [AllowEmptyString()][string]$Details = ''
    )

    $schluessel = "{0}|{1}|{2}" -f $Quelle, $ExitCode, $Details
    $vorhanden = @($script:NeustartNachweise.ToArray() | Where-Object {
            (Get-SichererText -Objekt $_ -Name 'Schluessel') -eq $schluessel
        }).Count -gt 0
    if (-not $vorhanden) {
        $script:NeustartNachweise.Add([pscustomobject]@{
                Schluessel = $schluessel
                Quelle = $Quelle
                ExitCode = $ExitCode
                Details = $Details
                Zeit = (Get-Date).ToString('o')
            }) | Out-Null
    }
    $script:NeustartErforderlich = $true
}

function Test-OneClickNeustartnachweisVorhanden {
    param(
        [AllowEmptyCollection()][object[]]$Nachweise = @(),
        [bool]$WindowsMarkerAusstehend = $false
    )

    if ($WindowsMarkerAusstehend) { return $true }
    $dokumentierteCodes = @(1641, 3010, -1978334967, -1978334966, -1978334965)
    $gueltigeNachweise = @($Nachweise | Where-Object {
            $quelle = Get-SichererText -Objekt $_ -Name 'Quelle'
            $code = [int](Get-SichereEigenschaft -Objekt $_ -Name 'ExitCode' -Standardwert 0)
            -not [string]::IsNullOrWhiteSpace($quelle) -and $code -in $dokumentierteCodes
        })
    return ($gueltigeNachweise.Count -gt 0)
}

function Confirm-OneClickNeustartbedarf {
    if (-not $script:NeustartErforderlich) { return $false }
    if (Test-OneClickNeustartnachweisVorhanden -Nachweise @($script:NeustartNachweise.ToArray())) { return $true }

    $windowsStatus = $null
    try { $windowsStatus = Get-WindowsNeustartstatus }
    catch { Write-Verbose ("Neustart-Gegenpruefung fehlgeschlagen: {0}" -f $_.Exception.Message) }
    $windowsAusstehend = [bool](Get-SichereEigenschaft -Objekt $windowsStatus -Name 'Ausstehend' -Standardwert $false)
    if ($windowsAusstehend) {
        Add-OneClickNeustartnachweis -Quelle 'Windows-Neustartmarker' -ExitCode 3010 -Details (Get-SichererText -Objekt $windowsStatus -Name 'Details')
        return $true
    }

    $script:NeustartErforderlich = $false
    Add-Resultat -Bereich 'Neustart' -Aktion 'Unbelegten Neustartzustand gegenpruefen' -Status 'Kein aktueller Nachweis; Weiterarbeit freigegeben' -ExitCode 0 -Details 'Weder ein aktuelles Prozessresultat noch ein Windows-Neustartmarker bestaetigt den geerbten Neustartzustand.'
    Write-Status -Text 'Ein unbelegter oder veralteter Neustartzustand wurde nach Gegenpruefung verworfen; der Lauf wird fortgesetzt.' -Stufe 'INFO'
    return $false
}

function Stop-MitPause {
    param([int]$Code = 0)

    if (-not $KeinePause) {
        Write-KonsolentextSicher -Text ''
        Write-KonsolentextSicher -Text 'Druecken Sie eine beliebige Taste zum Schliessen ...' -Farbe 'DarkGray'
        try {
            $null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
        }
        catch {
            try { Read-Host 'Enter druecken' | Out-Null } catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }
        }
    }
    exit $Code
}

function Test-IstWindows {
    return ([Environment]::OSVersion.Platform -eq [PlatformID]::Win32NT)
}

function Get-WindowsSystemdateiPfad {
    param([Parameter(Mandatory = $true)][ValidatePattern('^[A-Za-z0-9._-]+\.exe$')][string]$Dateiname)

    try {
        $systemOrdner = [IO.Path]::GetFullPath([Environment]::SystemDirectory)
        if ([string]::IsNullOrWhiteSpace($systemOrdner) -or
            -not (Test-Path -LiteralPath $systemOrdner -PathType Container)) {
            return ''
        }
        $kandidat = [IO.Path]::GetFullPath((Join-Path -Path $systemOrdner -ChildPath $Dateiname))
        $basis = $systemOrdner.TrimEnd([char]92) + [char]92
        if (-not $kandidat.StartsWith($basis, [StringComparison]::OrdinalIgnoreCase) -or
            -not (Test-Path -LiteralPath $kandidat -PathType Leaf)) {
            return ''
        }
        return $kandidat
    }
    catch {
        return ''
    }
}

function Test-IstAdministrator {
    try {
        $identitaet = [Security.Principal.WindowsIdentity]::GetCurrent()
        $principal = New-Object Security.Principal.WindowsPrincipal($identitaet)
        return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    }
    catch {
        return $false
    }
}

function ConvertTo-SingleQuotedLiteral {
    param([Parameter(Mandatory = $true)][AllowEmptyString()][string]$Wert)
    return "'{0}'" -f $Wert.Replace("'", "''")
}

function Get-AktuellerHostPfad {
    $dateiname = if ($PSVersionTable.PSEdition -eq 'Core') { 'pwsh.exe' } else { 'powershell.exe' }
    $kandidat = Join-Path -Path $PSHOME -ChildPath $dateiname
    if (Test-Path -LiteralPath $kandidat -PathType Leaf) {
        return $kandidat
    }

    try {
        $prozessPfad = (Get-Process -Id $PID -ErrorAction Stop).Path
        if (-not [string]::IsNullOrWhiteSpace([string]$prozessPfad)) {
            return [string]$prozessPfad
        }
    }
    catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }

    return $dateiname
}

function Start-SelbstAlsAdministrator {
    if (Test-IstAdministrator) {
        return 0
    }

    Write-Status -Text 'Administratorrechte werden angefordert.' -Stufe 'SCHRITT'

    $befehl = '& ' + (ConvertTo-SingleQuotedLiteral -Wert $script:SelfPath)
    if ($KeinePause) {
        $befehl += ' -KeinePause'
    }
    if ($AlleMSIReparieren) {
        $befehl += ' -AlleMSIReparieren'
    }
    if ($AlleWinGetReparieren) {
        $befehl += ' -AlleWinGetReparieren'
    }
    if ($FehlerFortsetzen) {
        $befehl += ' -FehlerFortsetzen'
    }
    if ($NeustartSpaeter) {
        $befehl += ' -NeustartSpaeter'
    }
    if ($FortsetzenNachNeustart) {
        $befehl += ' -FortsetzenNachNeustart'
        $befehl += ' -FortsetzungsStatusPfad ' + (ConvertTo-SingleQuotedLiteral -Wert $FortsetzungsStatusPfad)
    }
    $befehl += '; exit $LASTEXITCODE'

    $encoded = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($befehl))
    $hostPfad = Get-AktuellerHostPfad
    $argumentZeile = '-NoLogo -NoProfile -ExecutionPolicy Bypass -EncodedCommand ' + $encoded

    try {
        $prozess = Start-Process -FilePath $hostPfad -Verb RunAs -ArgumentList $argumentZeile -WindowStyle Normal -PassThru -Wait -ErrorAction Stop
        return [int]$prozess.ExitCode
    }
    catch {
        Write-Status -Text ('Administratorstart fehlgeschlagen oder abgebrochen: {0}' -f $_.Exception.Message) -Stufe 'FEHLER'
        return 1223
    }
}

function Get-Systemarchitektur {
    $architektur = ''
    try {
        $architektur = [string](Get-ItemPropertyValue -LiteralPath 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Environment' -Name 'PROCESSOR_ARCHITECTURE' -ErrorAction Stop)
    }
    catch { $architektur = '' }
    if ([string]::IsNullOrWhiteSpace($architektur)) {
        $architektur = [string]$env:PROCESSOR_ARCHITEW6432
    }
    if ([string]::IsNullOrWhiteSpace($architektur)) {
        $architektur = [string]$env:PROCESSOR_ARCHITECTURE
    }

    switch -Regex ($architektur.ToUpperInvariant()) {
        'ARM64' { return 'arm64' }
        'AMD64' { return 'x64' }
        'X86'   { return 'x86' }
        default { throw "Nicht unterstuetzte Windows-Architektur: $architektur" }
    }
}

function Refresh-PathUmgebung {
    try {
        $pfade = New-Object 'System.Collections.Generic.List[string]'
        $werte = New-Object 'System.Collections.Generic.List[string]'

        foreach ($bereich in @('Machine', 'User')) {
            $wert = [Environment]::GetEnvironmentVariable('Path', $bereich)
            if (-not [string]::IsNullOrWhiteSpace([string]$wert)) {
                $werte.Add([string]$wert) | Out-Null
            }
        }
        if (-not [string]::IsNullOrWhiteSpace([string]$env:Path)) {
            $werte.Add([string]$env:Path) | Out-Null
        }

        foreach ($wert in $werte.ToArray()) {
            foreach ($teil in @([string]$wert -split ';')) {
                $bereinigt = ([string]$teil).Trim()
                if (-not [string]::IsNullOrWhiteSpace($bereinigt) -and $pfade -notcontains $bereinigt) {
                    $pfade.Add($bereinigt) | Out-Null
                }
            }
        }

        if ($pfade.Count -gt 0) {
            $env:Path = $pfade.ToArray() -join ';'
        }
    }
    catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }
}

function ConvertTo-WindowsArgument {
    param([Parameter(Mandatory = $true)][AllowEmptyString()][string]$Wert)

    if ($Wert.Length -eq 0) {
        return '""'
    }
    if ($Wert -notmatch '[\s"]') {
        return $Wert
    }

    $builder = New-Object Text.StringBuilder
    [void]$builder.Append('"')
    $backslashes = 0

    foreach ($zeichen in $Wert.ToCharArray()) {
        if ($zeichen -eq '\') {
            $backslashes++
            continue
        }

        if ($zeichen -eq '"') {
            [void]$builder.Append(((('\' * (($backslashes * 2) + 1))) -join ''))
            [void]$builder.Append('"')
            $backslashes = 0
            continue
        }

        if ($backslashes -gt 0) {
            [void]$builder.Append(((('\' * $backslashes)) -join ''))
            $backslashes = 0
        }
        [void]$builder.Append($zeichen)
    }

    if ($backslashes -gt 0) {
        [void]$builder.Append(((('\' * ($backslashes * 2))) -join ''))
    }
    [void]$builder.Append('"')
    return $builder.ToString()
}

function ConvertTo-BereinigteAusgabe {
    param(
        [AllowNull()][string]$Text,
        [ValidateRange(1000, 500000)][int]$MaxZeichen = 50000
    )

    if ([string]::IsNullOrEmpty($Text)) {
        return ''
    }

    $bereinigt = $Text.Replace(([string][char]0), '')
    try {
        $bereinigt = [regex]::Replace($bereinigt, "`e\[[0-9;?]*[ -/]*[@-~]", '')
        # Weitere nicht druckbare Steuerzeichen werden entfernt. Tabulatoren und
        # normale Zeilenumbrueche bleiben fuer lesbare Protokolle erhalten.
        $bereinigt = [regex]::Replace($bereinigt, '[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]', '')
    }
    catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }

    $clixmlMarker = $bereinigt.IndexOf('#< CLIXML', [StringComparison]::OrdinalIgnoreCase)
    $objMarker = $bereinigt.IndexOf('<Objs', [StringComparison]::OrdinalIgnoreCase)
    $istClixmlObjekt = ($objMarker -ge 0 -and (
        $bereinigt.IndexOf('schemas.microsoft.com/powershell/2004/04', [StringComparison]::OrdinalIgnoreCase) -ge 0 -or
        $bereinigt.IndexOf('S="progress"', [StringComparison]::OrdinalIgnoreCase) -ge 0
    ))

    $schnitt = -1
    if ($clixmlMarker -ge 0) {
        $schnitt = $clixmlMarker
    }
    elseif ($istClixmlObjekt) {
        $schnitt = $objMarker
    }

    if ($schnitt -ge 0) {
        $vorText = $bereinigt.Substring(0, $schnitt).TrimEnd()
        if ([string]::IsNullOrWhiteSpace($vorText)) {
            $bereinigt = '[Serialisierte PowerShell-Fortschrittsdaten wurden unterdrueckt.]'
        }
        else {
            $bereinigt = $vorText + [Environment]::NewLine + '[Serialisierte PowerShell-Fortschrittsdaten wurden unterdrueckt.]'
        }
    }

    $bereinigt = $bereinigt.Trim()
    if ($bereinigt.Length -gt $MaxZeichen) {
        $bereinigt = '[Ausgabe gekuerzt; die letzten Zeichen folgen.]' + [Environment]::NewLine + $bereinigt.Substring($bereinigt.Length - $MaxZeichen)
    }
    return $bereinigt
}

function Get-WinGetDiagnoseOrdner {
    if ([string]::IsNullOrWhiteSpace([string]$env:LOCALAPPDATA)) { return '' }
    try {
        $pfad = Join-Path -Path $env:LOCALAPPDATA -ChildPath 'Packages\Microsoft.DesktopAppInstaller_8wekyb3d8bbwe\LocalState\DiagOutputDir'
        if (Test-Path -LiteralPath $pfad -PathType Container) {
            return [IO.Path]::GetFullPath($pfad)
        }
    }
    catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }
    return ''
}

function Get-ProzessbaumMomentaufnahme {
    param(
        [Parameter(Mandatory = $true)][int]$RootProcessId,
        [AllowEmptyCollection()][int[]]$BekannteProzessIds = @(),
        [DateTime]$StartZeitUtc = [DateTime]::MinValue
    )

    try {
        $alle = @(Get-CimInstance -ClassName Win32_Process -Property ProcessId, ParentProcessId, Name, CommandLine, CreationDate, KernelModeTime, UserModeTime, ReadTransferCount, WriteTransferCount -ErrorAction Stop)
        $ids = New-Object 'System.Collections.Generic.HashSet[int]'
        [void]$ids.Add($RootProcessId)
        foreach ($bekannteId in @($BekannteProzessIds)) {
            if ([int]$bekannteId -gt 0) { [void]$ids.Add([int]$bekannteId) }
        }

        $geaendert = $true
        while ($geaendert) {
            $geaendert = $false
            foreach ($eintrag in $alle) {
                $prozessId = [int](Get-SichereEigenschaft -Objekt $eintrag -Name 'ProcessId' -Standardwert 0)
                $elternId = [int](Get-SichereEigenschaft -Objekt $eintrag -Name 'ParentProcessId' -Standardwert 0)
                if ($prozessId -le 0 -or -not $ids.Contains($elternId) -or $ids.Contains($prozessId)) {
                    continue
                }

                $nachStart = $true
                if ($StartZeitUtc -ne [DateTime]::MinValue) {
                    $creationDate = Get-SichereEigenschaft -Objekt $eintrag -Name 'CreationDate' -Standardwert $null
                    if ($null -ne $creationDate) {
                        try { $nachStart = ([DateTime]$creationDate).ToUniversalTime() -ge $StartZeitUtc.AddSeconds(-5) } catch { $nachStart = $true }
                    }
                }
                if ($nachStart) {
                    [void]$ids.Add($prozessId)
                    $geaendert = $true
                }
            }
        }

        $prozesse = New-Object 'System.Collections.Generic.List[object]'
        [decimal]$aktivitaetswert = 0
        foreach ($eintrag in $alle) {
            $prozessId = [int](Get-SichereEigenschaft -Objekt $eintrag -Name 'ProcessId' -Standardwert 0)
            if (-not $ids.Contains($prozessId)) { continue }

            $creationDate = Get-SichereEigenschaft -Objekt $eintrag -Name 'CreationDate' -Standardwert $null
            if ($prozessId -ne $RootProcessId -and $StartZeitUtc -ne [DateTime]::MinValue -and $null -ne $creationDate) {
                try {
                    if (([DateTime]$creationDate).ToUniversalTime() -lt $StartZeitUtc.AddSeconds(-5)) { continue }
                }
                catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }
            }

            [decimal]$kernel = [decimal](Get-SichereEigenschaft -Objekt $eintrag -Name 'KernelModeTime' -Standardwert 0)
            [decimal]$user = [decimal](Get-SichereEigenschaft -Objekt $eintrag -Name 'UserModeTime' -Standardwert 0)
            [decimal]$lesen = [decimal](Get-SichereEigenschaft -Objekt $eintrag -Name 'ReadTransferCount' -Standardwert 0)
            [decimal]$schreiben = [decimal](Get-SichereEigenschaft -Objekt $eintrag -Name 'WriteTransferCount' -Standardwert 0)
            $aktivitaetswert += $kernel + $user + $lesen + $schreiben

            $prozesse.Add([pscustomobject]@{
                ProcessId = $prozessId
                ParentProcessId = [int](Get-SichereEigenschaft -Objekt $eintrag -Name 'ParentProcessId' -Standardwert 0)
                Name = [string](Get-SichereEigenschaft -Objekt $eintrag -Name 'Name' -Standardwert '')
                CommandLine = [string](Get-SichereEigenschaft -Objekt $eintrag -Name 'CommandLine' -Standardwert '')
                CreationDate = $creationDate
                Aktivitaetswert = ($kernel + $user + $lesen + $schreiben)
            }) | Out-Null
        }

        $prozessArray = @($prozesse.ToArray())
        $signatur = (($prozessArray | Sort-Object ProcessId | ForEach-Object { '{0}:{1}' -f $_.ProcessId, $_.Name }) -join '|')
        return [pscustomobject]@{
            Verfuegbar = $true
            Prozesse = $prozessArray
            ProzessIds = [int[]]@($prozessArray | ForEach-Object { [int]$_.ProcessId })
            Aktivitaetswert = $aktivitaetswert
            Signatur = $signatur
            Fehler = ''
        }
    }
    catch {
        return [pscustomobject]@{
            Verfuegbar = $false
            Prozesse = @()
            ProzessIds = [int[]]@()
            Aktivitaetswert = [decimal]0
            Signatur = ''
            Fehler = $_.Exception.Message
        }
    }
}

function Test-IstRelevanterInstallerprozess {
    param([Parameter(Mandatory = $true)][object]$Prozess)

    $name = (Get-SichererText -Objekt $Prozess -Name 'Name').Trim().ToLowerInvariant()
    $kommando = Get-SichererText -Objekt $Prozess -Name 'CommandLine'
    if ([string]::IsNullOrWhiteSpace($name)) { return $false }

    if ($name -in @(
        'appinstaller.exe', 'windowspackagemanagerserver.exe', 'runtimebroker.exe',
        'backgroundtaskhost.exe', 'explorer.exe', 'searchhost.exe',
        'shellexperiencehost.exe', 'startmenuexperiencehost.exe'
    )) {
        return $false
    }

    # Squirrel/Electron startet nach einer erfolgreichen Installation oft die
    # eigentliche Anwendung. Dieser dauerhafte Programmprozess ist kein Installer.
    if ($name -in @('update.exe', 'updater.exe') -and
        $kommando -match '(?i)(--processStart|--process-start-args|--squirrel-firstrun|--autostart|--background|--system-startup)') {
        return $false
    }

    if ($name -in @('msiexec.exe', 'winget.exe')) { return $true }
    if ($name -match '^(?:setup|install|installer|uninstall|unins|bootstrapper|burn|update|updater)(?:[-_.0-9A-Za-z]*)\.exe$') {
        return $true
    }
    if ($name -eq 'rundll32.exe' -and $kommando -match '(?i)(setupapi|advpack|InstallHinfSection|LaunchINFSection|DllInstall)') {
        return $true
    }
    if ($name -in @('cmd.exe', 'powershell.exe', 'pwsh.exe', 'wscript.exe', 'cscript.exe') -and
        $kommando -match '(?i)(msiexec(?:\.exe)?|winget(?:\.exe)?|\bsetup(?:\.exe)?\b|\binstaller(?:\.exe)?\b|\binstall(?:\.ps1|\.cmd|\.bat|\.exe)\b)') {
        return $true
    }
    return $false
}

function Get-InstallerProzessMomentaufnahme {
    try {
        $prozesse = New-Object 'System.Collections.Generic.List[object]'
        $alle = @(Get-CimInstance -ClassName Win32_Process -Property ProcessId, ParentProcessId, Name, CommandLine, CreationDate, KernelModeTime, UserModeTime, ReadTransferCount, WriteTransferCount -ErrorAction Stop)
        foreach ($eintrag in $alle) {
            $prozessObjekt = [pscustomobject]@{
                ProcessId = [int](Get-SichereEigenschaft -Objekt $eintrag -Name 'ProcessId' -Standardwert 0)
                ParentProcessId = [int](Get-SichereEigenschaft -Objekt $eintrag -Name 'ParentProcessId' -Standardwert 0)
                Name = [string](Get-SichereEigenschaft -Objekt $eintrag -Name 'Name' -Standardwert '')
                CommandLine = [string](Get-SichereEigenschaft -Objekt $eintrag -Name 'CommandLine' -Standardwert '')
                CreationDate = Get-SichereEigenschaft -Objekt $eintrag -Name 'CreationDate' -Standardwert $null
                Aktivitaetswert = (
                    [decimal](Get-SichereEigenschaft -Objekt $eintrag -Name 'KernelModeTime' -Standardwert 0) +
                    [decimal](Get-SichereEigenschaft -Objekt $eintrag -Name 'UserModeTime' -Standardwert 0) +
                    [decimal](Get-SichereEigenschaft -Objekt $eintrag -Name 'ReadTransferCount' -Standardwert 0) +
                    [decimal](Get-SichereEigenschaft -Objekt $eintrag -Name 'WriteTransferCount' -Standardwert 0)
                )
            }
            if ($prozessObjekt.ProcessId -gt 0 -and (Test-IstRelevanterInstallerprozess -Prozess $prozessObjekt)) {
                $prozesse.Add($prozessObjekt) | Out-Null
            }
        }
        return [pscustomobject]@{ Verfuegbar = $true; Prozesse = @($prozesse.ToArray()); Fehler = '' }
    }
    catch {
        return [pscustomobject]@{ Verfuegbar = $false; Prozesse = @(); Fehler = $_.Exception.Message }
    }
}

function Get-ZugeordneteZusaetzlicheInstallerProzesse {
    param(
        [AllowEmptyCollection()][object[]]$Kandidaten = @(),
        [AllowEmptyCollection()][int[]]$BekannteProzessIds = @(),
        [Parameter(Mandatory = $true)][int]$RootProcessId
    )

    $zugeordneteIds = New-Object 'System.Collections.Generic.HashSet[int]'
    if ($RootProcessId -gt 0) { [void]$zugeordneteIds.Add($RootProcessId) }
    foreach ($bekannteId in @($BekannteProzessIds)) {
        if ([int]$bekannteId -gt 0) { [void]$zugeordneteIds.Add([int]$bekannteId) }
    }

    $ergebnisNachId = @{}
    $geaendert = $true
    while ($geaendert) {
        $geaendert = $false
        foreach ($kandidat in @($Kandidaten)) {
            $kandidatId = [int](Get-SichereEigenschaft -Objekt $kandidat -Name 'ProcessId' -Standardwert 0)
            $elternId = [int](Get-SichereEigenschaft -Objekt $kandidat -Name 'ParentProcessId' -Standardwert 0)
            if ($kandidatId -le 0 -or $kandidatId -eq $RootProcessId) { continue }
            if (-not (Test-IstRelevanterInstallerprozess -Prozess $kandidat)) { continue }
            if ($ergebnisNachId.ContainsKey([string]$kandidatId)) { continue }

            # Ein nach dem Start sichtbar gewordener Installer wird nur dann dem
            # aktuellen Vorgang zugeordnet, wenn er selbst bereits zum bekannten
            # Prozessbaum gehoert oder sein Elternprozess zum bekannten Baum gehoert.
            # Dadurch werden gleichzeitig gestartete fremde Setup-Prozesse weder
            # abgewartet noch im Timeout-Fall beendet.
            if ($zugeordneteIds.Contains($kandidatId) -or $zugeordneteIds.Contains($elternId)) {
                $ergebnisNachId[[string]$kandidatId] = $kandidat
                if ($zugeordneteIds.Add($kandidatId)) { $geaendert = $true }
            }
        }
    }

    return @($ergebnisNachId.Values | Sort-Object ProcessId)
}


function Get-RelevanteInstallationsNachlaufProzesse {
    param(
        [Parameter(Mandatory = $true)][object]$Momentaufnahme,
        [Parameter(Mandatory = $true)][int]$RootProcessId,
        [AllowEmptyCollection()][object[]]$ZusaetzlicheInstallerProzesse = @()
    )

    $nachId = @{}
    foreach ($prozess in @((Get-SichereEigenschaft -Objekt $Momentaufnahme -Name 'Prozesse' -Standardwert @())) + @($ZusaetzlicheInstallerProzesse)) {
        $prozessId = [int](Get-SichereEigenschaft -Objekt $prozess -Name 'ProcessId' -Standardwert 0)
        if ($prozessId -le 0 -or $prozessId -eq $RootProcessId) { continue }
        if (-not (Test-IstRelevanterInstallerprozess -Prozess $prozess)) { continue }
        $nachId[[string]$prozessId] = $prozess
    }
    return @($nachId.Values | Sort-Object ProcessId)
}

function Get-AktivitaetsPfadSignatur {
    param([AllowEmptyCollection()][string[]]$Pfade = @())

    $teile = New-Object 'System.Collections.Generic.List[string]'
    foreach ($pfad in @($Pfade)) {
        if ([string]::IsNullOrWhiteSpace([string]$pfad)) { continue }
        try {
            if (Test-Path -LiteralPath $pfad -PathType Leaf) {
                $datei = Get-Item -LiteralPath $pfad -Force -ErrorAction Stop
                $teile.Add(('{0}|{1}|{2}' -f $datei.FullName, $datei.Length, $datei.LastWriteTimeUtc.Ticks)) | Out-Null
            }
            elseif (Test-Path -LiteralPath $pfad -PathType Container) {
                $neueste = @(Get-ChildItem -LiteralPath $pfad -File -Force -ErrorAction SilentlyContinue | Sort-Object LastWriteTimeUtc -Descending | Select-Object -First 3)
                foreach ($datei in $neueste) {
                    $teile.Add(('{0}|{1}|{2}' -f $datei.FullName, $datei.Length, $datei.LastWriteTimeUtc.Ticks)) | Out-Null
                }
            }
        }
        catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }
    }
    return (($teile.ToArray() | Sort-Object) -join ';')
}

function ConvertTo-LesbareDauer {
    param([ValidateRange(0, 31536000)][double]$Sekunden)

    return ('{0:N2} Minuten' -f ([Math]::Max(0, $Sekunden) / 60.0))
}

function ConvertTo-LesbareBytemenge {
    param([ValidateRange(0, [double]::MaxValue)][double]$Bytes)

    return ('{0:N2} MB' -f ($Bytes / 1000000))
}

function Get-WindowsUpdateDownloadMomentaufnahme {
    # DISM selbst legt nicht fuer jede Reparaturquelle eine Byteanzeige offen.
    # Delivery Optimization und BITS liefern, wenn Windows Update sie nutzt,
    # direkte Transferwerte. Als abgesicherter Fallback wird gleichzeitiger
    # Netzwerkempfang und E/A-Aktivitaet der Windows-Update-Dienste gemessen.
    # CBS protokolliert bei einer Windows-Update-Reparaturquelle zusaetzlich
    # DownloadProgress-Werte. Diese liefern auch dann einen sichtbaren Prozentwert,
    # wenn Delivery Optimization seine Bytezaehler auf dem System nicht offenlegt.
    param(
        [AllowEmptyString()][string]$CbsLogPfad = '',
        [DateTime]$StartZeitUtc = [DateTime]::MinValue
    )

    [decimal]$downloadBytes = 0
    [decimal]$gesamtBytes = 0
    [decimal]$dienstAktivitaetswert = 0
    [decimal]$netzwerkEmpfangenBytes = 0
    $aktiveUebertragungen = 0
    $quellen = New-Object 'System.Collections.Generic.List[string]'
    $direkteWerteVerfuegbar = $false
    $cbsDownloadAktiv = $false
    $cbsDownloadProzent = -1
    $cbsDownloadAktuell = 0
    $cbsDownloadGesamt = 0
    $cbsDownloadSignatur = ''

    try {
        if (Get-Command -Name 'Get-DeliveryOptimizationStatus' -ErrorAction SilentlyContinue) {
            $doEintraege = @(Get-DeliveryOptimizationStatus -AsObject -ErrorAction Stop)
            foreach ($eintrag in $doEintraege) {
                $status = Get-SichererText -Objekt $eintrag -Name 'Status'
                $aufrufer = ((Get-SichererText -Objekt $eintrag -Name 'PredefinedCallerApplication') + ' ' + (Get-SichererText -Objekt $eintrag -Name 'CallerApplicationId')).Trim()
                if ($status -notmatch '(?i)(download|transfer|connect|queued)' -or $aufrufer -notmatch '(?i)(Windows|Update|Servicing|DISM|CBS|Uso)') { continue }

                $aktiveUebertragungen++
                $direkteWerteVerfuegbar = $true
                [decimal]$geladen = [decimal](Get-SichereEigenschaft -Objekt $eintrag -Name 'TotalBytesDownloaded' -Standardwert 0)
                if ($geladen -le 0) {
                    $geladen = [decimal](Get-SichereEigenschaft -Objekt $eintrag -Name 'BytesFromHttp' -Standardwert 0) +
                        [decimal](Get-SichereEigenschaft -Objekt $eintrag -Name 'BytesFromPeers' -Standardwert 0) +
                        [decimal](Get-SichereEigenschaft -Objekt $eintrag -Name 'BytesFromCacheServer' -Standardwert 0)
                }
                $downloadBytes += [Math]::Max([decimal]0, $geladen)
                $gesamtBytes += [Math]::Max([decimal]0, [decimal](Get-SichereEigenschaft -Objekt $eintrag -Name 'FileSize' -Standardwert 0))
            }
            if ($aktiveUebertragungen -gt 0) { $quellen.Add('Delivery Optimization') | Out-Null }
        }
    }
    catch { Write-Verbose ("Delivery-Optimization-Messung nicht verfuegbar: {0}" -f $_.Exception.Message) }

    if ($aktiveUebertragungen -eq 0) {
        try {
            if (Get-Command -Name 'Get-BitsTransfer' -ErrorAction SilentlyContinue) {
                $bitsEintraege = @(Get-BitsTransfer -AllUsers -ErrorAction Stop)
                foreach ($eintrag in $bitsEintraege) {
                    $status = Get-SichererText -Objekt $eintrag -Name 'JobState'
                    $identitaet = ((Get-SichererText -Objekt $eintrag -Name 'DisplayName') + ' ' + (Get-SichererText -Objekt $eintrag -Name 'Description')).Trim()
                    if ($status -notmatch '(?i)(transferring|connecting|queued)' -or $identitaet -notmatch '(?i)(Windows|Update|Servicing|DISM|CBS|Uso)') { continue }

                    $aktiveUebertragungen++
                    $direkteWerteVerfuegbar = $true
                    $downloadBytes += [Math]::Max([decimal]0, [decimal](Get-SichereEigenschaft -Objekt $eintrag -Name 'BytesTransferred' -Standardwert 0))
                    $gesamtBytes += [Math]::Max([decimal]0, [decimal](Get-SichereEigenschaft -Objekt $eintrag -Name 'BytesTotal' -Standardwert 0))
                }
                if ($aktiveUebertragungen -gt 0) { $quellen.Add('BITS') | Out-Null }
            }
        }
        catch { Write-Verbose ("BITS-Messung nicht verfuegbar: {0}" -f $_.Exception.Message) }
    }

    try {
        $dienste = @(Get-CimInstance -ClassName Win32_Service -Filter "Name='wuauserv' OR Name='BITS' OR Name='DoSvc' OR Name='UsoSvc'" -Property Name, State, ProcessId -ErrorAction Stop | Where-Object { $_.State -eq 'Running' -and [int]$_.ProcessId -gt 0 })
        $dienstIds = New-Object 'System.Collections.Generic.HashSet[int]'
        foreach ($dienst in $dienste) { [void]$dienstIds.Add([int]$dienst.ProcessId) }
        if ($dienstIds.Count -gt 0) {
            $prozesse = @(Get-CimInstance -ClassName Win32_Process -Property ProcessId, KernelModeTime, UserModeTime, ReadTransferCount, WriteTransferCount -ErrorAction Stop)
            foreach ($prozess in $prozesse) {
                if (-not $dienstIds.Contains([int]$prozess.ProcessId)) { continue }
                $dienstAktivitaetswert += [decimal](Get-SichereEigenschaft -Objekt $prozess -Name 'KernelModeTime' -Standardwert 0) +
                    [decimal](Get-SichereEigenschaft -Objekt $prozess -Name 'UserModeTime' -Standardwert 0) +
                    [decimal](Get-SichereEigenschaft -Objekt $prozess -Name 'ReadTransferCount' -Standardwert 0) +
                    [decimal](Get-SichereEigenschaft -Objekt $prozess -Name 'WriteTransferCount' -Standardwert 0)
            }
        }
    }
    catch { Write-Verbose ("Windows-Update-Dienstmessung nicht verfuegbar: {0}" -f $_.Exception.Message) }

    try {
        if (Get-Command -Name 'Get-NetAdapterStatistics' -ErrorAction SilentlyContinue) {
            foreach ($adapter in @(Get-NetAdapterStatistics -ErrorAction Stop)) {
                $netzwerkEmpfangenBytes += [decimal](Get-SichereEigenschaft -Objekt $adapter -Name 'ReceivedBytes' -Standardwert 0)
            }
        }
    }
    catch { Write-Verbose ("Netzwerk-Empfangsmessung nicht verfuegbar: {0}" -f $_.Exception.Message) }

    try {
        if ([string]::IsNullOrWhiteSpace($CbsLogPfad)) {
            $CbsLogPfad = Join-Path -Path $env:SystemRoot -ChildPath 'Logs\CBS\CBS.log'
        }
        if (Test-Path -LiteralPath $CbsLogPfad -PathType Leaf) {
            $cbsDatei = Get-Item -LiteralPath $CbsLogPfad -Force -ErrorAction Stop
            $logIstFuerDiesenLaufRelevant = ($StartZeitUtc -eq [DateTime]::MinValue -or $cbsDatei.LastWriteTimeUtc -ge $StartZeitUtc.AddSeconds(-15))
            if ($logIstFuerDiesenLaufRelevant) {
                $downloadZeilen = @(Get-Content -LiteralPath $CbsLogPfad -Tail 300 -ErrorAction Stop | Where-Object { $_ -match '(?i)DownloadProgress:\s*\[\s*\d+\s*/\s*\d+\s*\]' })
                for ($zeilenIndex = $downloadZeilen.Count - 1; $zeilenIndex -ge 0; $zeilenIndex--) {
                    $zeile = [string]$downloadZeilen[$zeilenIndex]
                    $treffer = [regex]::Match($zeile, '(?i)DownloadProgress:\s*\[\s*(\d+)\s*/\s*(\d+)\s*\]')
                    if (-not $treffer.Success) { continue }

                    $zeilenZeitUtc = $null
                    $zeitTreffer = [regex]::Match($zeile, '^\s*(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})')
                    if ($zeitTreffer.Success) {
                        try {
                            $zeilenZeitLokal = [DateTime]::ParseExact($zeitTreffer.Groups[1].Value, 'yyyy-MM-dd HH:mm:ss', [Globalization.CultureInfo]::InvariantCulture, [Globalization.DateTimeStyles]::AssumeLocal)
                            $zeilenZeitUtc = $zeilenZeitLokal.ToUniversalTime()
                        }
                        catch { $zeilenZeitUtc = $null }
                    }
                    if ($StartZeitUtc -ne [DateTime]::MinValue -and $null -ne $zeilenZeitUtc -and $zeilenZeitUtc -lt $StartZeitUtc.AddSeconds(-15)) { continue }

                    $cbsDownloadAktuell = [int]$treffer.Groups[1].Value
                    $cbsDownloadGesamt = [int]$treffer.Groups[2].Value
                    if ($cbsDownloadGesamt -le 0) { continue }
                    $cbsDownloadProzent = [Math]::Min(100, [Math]::Max(0, [int][Math]::Floor(([double]$cbsDownloadAktuell / [double]$cbsDownloadGesamt) * 100)))
                    $downloadMeldungIstFrisch = if ($null -ne $zeilenZeitUtc) { $zeilenZeitUtc -ge [DateTime]::UtcNow.AddSeconds(-120) } else { $cbsDatei.LastWriteTimeUtc -ge [DateTime]::UtcNow.AddSeconds(-120) }
                    $cbsDownloadAktiv = ($cbsDownloadAktuell -lt $cbsDownloadGesamt -and $downloadMeldungIstFrisch)
                    $cbsDownloadSignatur = $zeile.Trim()
                    if (-not $quellen.Contains('CBS/Windows Update')) { $quellen.Add('CBS/Windows Update') | Out-Null }
                    break
                }
            }
        }
    }
    catch { Write-Verbose ("CBS-Downloadfortschritt nicht verfuegbar: {0}" -f $_.Exception.Message) }

    return [pscustomobject]@{
        AktiveUebertragungen = $aktiveUebertragungen
        DirekteWerteVerfuegbar = $direkteWerteVerfuegbar
        DownloadBytes = $downloadBytes
        GesamtBytes = $gesamtBytes
        DienstAktivitaetswert = $dienstAktivitaetswert
        NetzwerkEmpfangenBytes = $netzwerkEmpfangenBytes
        CbsDownloadAktiv = $cbsDownloadAktiv
        CbsDownloadProzent = $cbsDownloadProzent
        CbsDownloadAktuell = $cbsDownloadAktuell
        CbsDownloadGesamt = $cbsDownloadGesamt
        CbsDownloadSignatur = $cbsDownloadSignatur
        Quelle = ($quellen.ToArray() -join ', ')
    }
}

function Get-WindowsClientKompatibilitaet {
    $ergebnis = [ordered]@{
        Unterstuetzt = $false
        Windows = ''
        Build = 0
        Revision = 0
        Version = ''
        Architektur = ''
        Installationstyp = ''
        Grund = ''
    }
    if (-not (Test-IstWindows)) {
        $ergebnis.Grund = 'Das Betriebssystem ist kein Windows-Client.'
        return [pscustomobject]$ergebnis
    }

    try {
        $cv = Get-ItemProperty -LiteralPath 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion' -ErrorAction Stop
        $buildText = [string](Get-SichereEigenschaft -Objekt $cv -Name 'CurrentBuildNumber' -Standardwert '')
        if ([string]::IsNullOrWhiteSpace($buildText)) { $buildText = [string](Get-SichereEigenschaft -Objekt $cv -Name 'CurrentBuild' -Standardwert '') }
        $build = 0
        if (-not [int]::TryParse($buildText, [ref]$build)) { throw "Windows-Build ist nicht lesbar: $buildText" }
        $ergebnis.Build = $build
        $ergebnis.Revision = [int](Get-SichereEigenschaft -Objekt $cv -Name 'UBR' -Standardwert 0)
        $ergebnis.Version = Get-SichererText -Objekt $cv -Name 'DisplayVersion'
        if ([string]::IsNullOrWhiteSpace($ergebnis.Version)) { $ergebnis.Version = Get-SichererText -Objekt $cv -Name 'ReleaseId' }
        $ergebnis.Installationstyp = Get-SichererText -Objekt $cv -Name 'InstallationType'
        $ergebnis.Architektur = Get-Systemarchitektur
        $ergebnis.Windows = if ($build -ge 22000) { 'Windows 11' } else { 'Windows 10' }

        if (-not [string]::Equals($ergebnis.Installationstyp, 'Client', [StringComparison]::OrdinalIgnoreCase)) {
            $ergebnis.Grund = "Nur Windows-Clientinstallationen werden unterstuetzt; erkannt: $($ergebnis.Installationstyp)."
        }
        elseif ($build -lt 17763) {
            $ergebnis.Grund = 'Fuer vollstaendige Programmupdates wird mindestens Windows 10 Version 1809 (Build 17763) benoetigt.'
        }
        elseif ($ergebnis.Architektur -eq 'arm64' -and $build -lt 22000) {
            $ergebnis.Grund = 'PowerShell 7 fuer ARM64 wird von Microsoft erst ab Windows 11 Build 22000 unterstuetzt.'
        }
        else {
            $ergebnis.Unterstuetzt = $true
            $ergebnis.Grund = 'Unterstuetzter Windows-10/11-Client und unterstuetzte Prozessorarchitektur erkannt.'
        }
    }
    catch {
        $ergebnis.Grund = "Windows-Kompatibilitaet konnte nicht sicher bestimmt werden: $($_.Exception.Message)"
    }
    return [pscustomobject]$ergebnis
}

function Get-NativeProzessAusgabeEncoding {
    param([Parameter(Mandatory = $true)][string]$Datei)

    # Diese drei Windows-Systemwerkzeuge verwenden trotz umgeleiteter Ausgabe
    # unterschiedliche historische Zeichencodierungen. Die gezielte Zuordnung
    # verhindert fehlerhafte Umlaute, ohne die UTF-8-Ausgabe von WinGet oder
    # PowerShell umzudeuten.
    $dateiname = [IO.Path]::GetFileName($Datei).ToLowerInvariant()
    try {
        switch ($dateiname) {
            'dism.exe' {
                return [Text.Encoding]::GetEncoding([Globalization.CultureInfo]::CurrentUICulture.TextInfo.OEMCodePage)
            }
            'sfc.exe' {
                return [Text.Encoding]::Unicode
            }
            'chkdsk.exe' {
                return [Text.Encoding]::GetEncoding([Globalization.CultureInfo]::CurrentUICulture.TextInfo.ANSICodePage)
            }
        }
    }
    catch {
        Write-Verbose ("Ausgabecodierung fuer {0} konnte nicht bestimmt werden: {1}" -f $dateiname, $_.Exception.Message)
    }
    return $null
}

function Stop-ProzessbaumSicher {
    param(
        [Parameter(Mandatory = $true)][int]$RootProcessId,
        [AllowEmptyCollection()][int[]]$ZusaetzlicheProzessIds = @(),
        [AllowEmptyCollection()][object[]]$ZusaetzlicheProzesse = @()
    )

    $ids = @($RootProcessId) + @($ZusaetzlicheProzessIds)
    foreach ($erwarteterProzess in @($ZusaetzlicheProzesse)) {
        $erwarteteId = [int](Get-SichereEigenschaft -Objekt $erwarteterProzess -Name 'ProcessId' -Standardwert 0)
        if ($erwarteteId -le 0) { continue }

        try {
            $aktuelleTreffer = @(Get-CimInstance -ClassName Win32_Process -Filter ("ProcessId = {0}" -f $erwarteteId) -Property ProcessId, Name, CommandLine, CreationDate -ErrorAction Stop)
            if ($aktuelleTreffer.Count -ne 1) { continue }
            $aktuellerProzess = $aktuelleTreffer[0]
            $erwarteterName = Get-SichererText -Objekt $erwarteterProzess -Name 'Name'
            $aktuellerName = Get-SichererText -Objekt $aktuellerProzess -Name 'Name'
            $erwarteteErstellung = Get-SichereEigenschaft -Objekt $erwarteterProzess -Name 'CreationDate' -Standardwert $null
            $aktuelleErstellung = Get-SichereEigenschaft -Objekt $aktuellerProzess -Name 'CreationDate' -Standardwert $null
            if ([string]::IsNullOrWhiteSpace($erwarteterName) -or
                -not [string]::Equals($erwarteterName, $aktuellerName, [StringComparison]::OrdinalIgnoreCase) -or
                $null -eq $erwarteteErstellung -or $null -eq $aktuelleErstellung) {
                continue
            }

            $zeitDifferenz = [Math]::Abs((([DateTime]$aktuelleErstellung).ToUniversalTime() - ([DateTime]$erwarteteErstellung).ToUniversalTime()).TotalSeconds)
            if ($zeitDifferenz -gt 1.0 -or -not (Test-IstRelevanterInstallerprozess -Prozess $aktuellerProzess)) {
                continue
            }
            $ids += $erwarteteId
        }
        catch {
            # Ohne erneute Identitaetsbestaetigung wird eine moeglicherweise
            # wiederverwendete PID absichtlich nicht beendet.
            Write-Verbose ("Prozessidentitaet konnte nicht bestaetigt werden; PID wird sicher ausgelassen: {0}" -f $_.Exception.Message)
        }
    }
    $ids = @($ids | Where-Object { [int]$_ -gt 0 } | Sort-Object -Unique -Descending)
    $taskkill = Get-WindowsSystemdateiPfad -Dateiname 'taskkill.exe'

    foreach ($prozessId in $ids) {
        if (-not [string]::IsNullOrWhiteSpace($taskkill) -and (Test-Path -LiteralPath $taskkill -PathType Leaf)) {
            try {
                $startInfo = New-Object Diagnostics.ProcessStartInfo
                $startInfo.FileName = $taskkill
                $startInfo.UseShellExecute = $false
                $startInfo.CreateNoWindow = $true
                $startInfo.Arguments = ('/PID {0} /T /F' -f [int]$prozessId)
                $abbruchProzess = New-Object Diagnostics.Process
                try {
                    $abbruchProzess.StartInfo = $startInfo
                    if ($abbruchProzess.Start()) {
                        if (-not $abbruchProzess.WaitForExit(15000)) {
                            try { $abbruchProzess.Kill() } catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }
                        }
                    }
                }
                finally {
                    $abbruchProzess.Dispose()
                }
            }
            catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }
        }

        try { Stop-Process -Id ([int]$prozessId) -Force -ErrorAction SilentlyContinue } catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }
    }
}

function New-AbbruchgekoppeltesProzessJob {
    param([Parameter(Mandatory = $true)][Diagnostics.Process]$Prozess)

    try {
        if ($null -eq ('OneClickKomplettreparatur.ProzessJob' -as [type])) {
            Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;

namespace OneClickKomplettreparatur
{
    public static class ProzessJob
    {
        [StructLayout(LayoutKind.Sequential)]
        private struct IO_COUNTERS
        {
            public UInt64 ReadOperationCount;
            public UInt64 WriteOperationCount;
            public UInt64 OtherOperationCount;
            public UInt64 ReadTransferCount;
            public UInt64 WriteTransferCount;
            public UInt64 OtherTransferCount;
        }

        [StructLayout(LayoutKind.Sequential)]
        private struct JOBOBJECT_BASIC_LIMIT_INFORMATION
        {
            public Int64 PerProcessUserTimeLimit;
            public Int64 PerJobUserTimeLimit;
            public UInt32 LimitFlags;
            public UIntPtr MinimumWorkingSetSize;
            public UIntPtr MaximumWorkingSetSize;
            public UInt32 ActiveProcessLimit;
            public UIntPtr Affinity;
            public UInt32 PriorityClass;
            public UInt32 SchedulingClass;
        }

        [StructLayout(LayoutKind.Sequential)]
        private struct JOBOBJECT_EXTENDED_LIMIT_INFORMATION
        {
            public JOBOBJECT_BASIC_LIMIT_INFORMATION BasicLimitInformation;
            public IO_COUNTERS IoInfo;
            public UIntPtr ProcessMemoryLimit;
            public UIntPtr JobMemoryLimit;
            public UIntPtr PeakProcessMemoryUsed;
            public UIntPtr PeakJobMemoryUsed;
        }

        [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
        private static extern IntPtr CreateJobObject(IntPtr securityAttributes, string name);

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern bool SetInformationJobObject(IntPtr job, int informationClass, IntPtr information, UInt32 informationLength);

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern bool AssignProcessToJobObject(IntPtr job, IntPtr process);

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern bool CloseHandle(IntPtr handle);

        public static IntPtr CreateKillOnCloseJob()
        {
            IntPtr job = CreateJobObject(IntPtr.Zero, null);
            if (job == IntPtr.Zero) return IntPtr.Zero;

            JOBOBJECT_EXTENDED_LIMIT_INFORMATION info = new JOBOBJECT_EXTENDED_LIMIT_INFORMATION();
            info.BasicLimitInformation.LimitFlags = 0x00002000;
            int length = Marshal.SizeOf(typeof(JOBOBJECT_EXTENDED_LIMIT_INFORMATION));
            IntPtr pointer = Marshal.AllocHGlobal(length);
            try
            {
                Marshal.StructureToPtr(info, pointer, false);
                if (!SetInformationJobObject(job, 9, pointer, (UInt32)length))
                {
                    CloseHandle(job);
                    return IntPtr.Zero;
                }
            }
            finally
            {
                Marshal.FreeHGlobal(pointer);
            }
            return job;
        }

        public static bool Assign(IntPtr job, IntPtr process)
        {
            return job != IntPtr.Zero && process != IntPtr.Zero && AssignProcessToJobObject(job, process);
        }

        public static void Close(IntPtr job)
        {
            if (job != IntPtr.Zero) CloseHandle(job);
        }
    }
}
'@ -Language CSharp -ErrorAction Stop
        }

        $job = [OneClickKomplettreparatur.ProzessJob]::CreateKillOnCloseJob()
        if ($job -eq [IntPtr]::Zero) { return [IntPtr]::Zero }
        if (-not [OneClickKomplettreparatur.ProzessJob]::Assign($job, $Prozess.Handle)) {
            [OneClickKomplettreparatur.ProzessJob]::Close($job)
            return [IntPtr]::Zero
        }
        return $job
    }
    catch {
        Write-Verbose ("Der Installationsprozess konnte nicht an ein Abbruch-Jobobjekt gekoppelt werden: {0}" -f $_.Exception.Message)
        return [IntPtr]::Zero
    }
}

function Close-AbbruchgekoppeltesProzessJob {
    param([IntPtr]$Job = [IntPtr]::Zero)

    if ($Job -eq [IntPtr]::Zero) { return }
    try { [OneClickKomplettreparatur.ProzessJob]::Close($Job) }
    catch { Write-Verbose ("Abbruch-Jobobjekt konnte nicht geschlossen werden: {0}" -f $_.Exception.Message) }
}

function Start-UnabhaengigenProzessAbbruchwaechter {
    param(
        [AllowNull()][Diagnostics.Process]$RootProzess = $null,
        [AllowEmptyString()][string]$ErwarteterProzessPfad = '',
        [switch]$AlleDirektenKindprozesse
    )

    $waechter = $null
    $stopDatei = ''
    $bereitDatei = ''
    $diagnoseDatei = ''
    try {
        $hostPfad = Get-AktuellerHostPfad
        if (-not (Test-Pwsh7 -Pfad $hostPfad)) {
            throw 'Der aktuelle PowerShell-7-Host konnte fuer den Abbruchwaechter nicht verifiziert werden.'
        }
        $installationsVariable = Get-Variable -Name 'InstallationsOrdner' -Scope Script -ErrorAction SilentlyContinue
        $installationsBasis = if ($null -eq $installationsVariable) { '' } else { [string]$installationsVariable.Value }
        $basis = if (-not [string]::IsNullOrWhiteSpace($installationsBasis) -and (Test-Path -LiteralPath $installationsBasis -PathType Container)) {
            $installationsBasis
        }
        else { [IO.Path]::GetTempPath() }
        $stopDatei = Join-Path -Path $basis -ChildPath ('Prozesswaechter-' + [Guid]::NewGuid().ToString('N') + '.stop')
        $bereitDatei = $stopDatei + '.ready'
        $diagnoseDatei = $stopDatei + '.abbruch.txt'
        $besitzer = Get-Process -Id $PID -ErrorAction Stop
        $rootId = 0
        $rootStartTicks = 0L
        $erwarteterPfad = if ([string]::IsNullOrWhiteSpace($ErwarteterProzessPfad)) { '' } else {
            try { [IO.Path]::GetFullPath($ErwarteterProzessPfad) } catch { [string]$ErwarteterProzessPfad }
        }
        $erwarteterName = if ([string]::IsNullOrWhiteSpace($erwarteterPfad)) { '' } else { [IO.Path]::GetFileName($erwarteterPfad) }
        if (-not $AlleDirektenKindprozesse -and [string]::IsNullOrWhiteSpace($erwarteterName)) {
            throw 'Der erwartete Prozessname fuer den Abbruchwaechter ist leer.'
        }
        if ($null -ne $RootProzess) {
            $RootProzess.Refresh()
            $rootId = [int]$RootProzess.Id
            $rootStartTicks = [int64]$RootProzess.StartTime.ToUniversalTime().Ticks
        }
        $konfiguration = [pscustomobject]@{
            OwnerId = [int]$PID
            OwnerStartTicks = [int64]$besitzer.StartTime.ToUniversalTime().Ticks
            MonitorStartTicks = [int64][DateTime]::UtcNow.AddSeconds(-2).Ticks
            RootId = $rootId
            RootStartTicks = $rootStartTicks
            TargetPath = $erwarteterPfad
            TargetName = $erwarteterName
            TrackAllDirectChildren = [bool]$AlleDirektenKindprozesse
            StopFile = $stopDatei
            ReadyFile = $bereitDatei
            DiagnoseFile = $diagnoseDatei
        } | ConvertTo-Json -Compress
        $konfiguration64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($konfiguration))
        $waechterCode = @'
$ErrorActionPreference = 'SilentlyContinue'
$config = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('__CONFIG__')) | ConvertFrom-Json
$known = @{}
if ([int]$config.RootId -gt 0) {
    $known[[string][int]$config.RootId] = [int64]$config.RootStartTicks
}
$selfId = [int]$PID
try {
    Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
public static class OneClickGuardianNative
{
    [StructLayout(LayoutKind.Sequential)]
    public struct FILETIME { public UInt32 Low; public UInt32 High; }
    [DllImport("kernel32.dll", SetLastError = true)]
    public static extern IntPtr OpenProcess(UInt32 access, bool inheritHandle, UInt32 processId);
    [DllImport("kernel32.dll", SetLastError = true)]
    public static extern bool TerminateProcess(IntPtr process, UInt32 exitCode);
    [DllImport("kernel32.dll", SetLastError = true)]
    public static extern bool GetProcessTimes(IntPtr process, out FILETIME creation, out FILETIME exit, out FILETIME kernel, out FILETIME user);
    [DllImport("kernel32.dll", SetLastError = true)]
    public static extern bool CloseHandle(IntPtr handle);
    [DllImport("kernel32.dll")]
    public static extern void ExitProcess(UInt32 exitCode);
    public static Int64 GetCreationUtcTicks(IntPtr process)
    {
        FILETIME creation, exit, kernel, user;
        if (!GetProcessTimes(process, out creation, out exit, out kernel, out user)) return 0;
        Int64 value = ((Int64)creation.High << 32) | creation.Low;
        return DateTime.FromFileTimeUtc(value).Ticks;
    }
}
"@ -Language CSharp -ErrorAction Stop
}
catch { exit 2 }

function Update-KnownTree {
    $all = @(Get-CimInstance -ClassName Win32_Process -Property ProcessId, ParentProcessId, CreationDate, Name, ExecutablePath -ErrorAction SilentlyContinue)
    $changed = $true
    while ($changed) {
        $changed = $false
        foreach ($item in $all) {
            # $PID ist in PowerShell eine schreibgeschuetzte automatische
            # Variable; Variablennamen sind nicht gross-/kleinschreibungs-
            # sensitiv. Deshalb darf hier niemals die Kurzform $id stehen.
            $prozessId = [int]$item.ProcessId
            $parentId = [int]$item.ParentProcessId
            if ($prozessId -le 0 -or $prozessId -eq $selfId -or $known.ContainsKey([string]$prozessId)) { continue }
            try {
                $creationTicks = [int64]([DateTime]$item.CreationDate).ToUniversalTime().Ticks
                $direktesNeuesKind = ($parentId -eq [int]$config.OwnerId -and $creationTicks -ge [int64]$config.MonitorStartTicks)
                $bekanntesKind = $known.ContainsKey([string]$parentId)
                if ($direktesNeuesKind) {
                    if ([bool]$config.TrackAllDirectChildren) {
                        if ([string]$item.Name -in @('conhost.exe', 'OpenConsole.exe', 'WindowsTerminal.exe')) { continue }
                    }
                    else {
                        $namePasst = [string]::Equals([string]$item.Name, [string]$config.TargetName, [StringComparison]::OrdinalIgnoreCase)
                        $itemPfad = [string]$item.ExecutablePath
                        $pfadPasst = ([string]::IsNullOrWhiteSpace($itemPfad) -or
                            [string]::Equals($itemPfad, [string]$config.TargetPath, [StringComparison]::OrdinalIgnoreCase))
                        if (-not $namePasst -or -not $pfadPasst) { continue }
                    }
                }
                if (-not $direktesNeuesKind -and -not $bekanntesKind) { continue }
                $known[[string]$prozessId] = $creationTicks
                $changed = $true
            }
            catch {}
        }
    }
}

Update-KnownTree
try { Set-Content -LiteralPath ([string]$config.ReadyFile) -Value $PID -Encoding ascii -Force -ErrorAction Stop }
catch { exit 2 }

while ($true) {
    if (Test-Path -LiteralPath ([string]$config.StopFile) -PathType Leaf) { exit 0 }
    Update-KnownTree
    $ownerAlive = $false
    try {
        $owner = Get-Process -Id ([int]$config.OwnerId) -ErrorAction Stop
        $ownerAlive = ([int64]$owner.StartTime.ToUniversalTime().Ticks -eq [int64]$config.OwnerStartTicks)
    }
    catch { $ownerAlive = $false }
    if (-not $ownerAlive) {
        # Beim sehr schnellen Schliessen des Konsolenfensters kann ein gerade
        # gestarteter Kind- oder Enkelprozess erst wenige Millisekunden spaeter
        # in CIM sichtbar werden. Mehrere kurze Schlussaufnahmen schliessen
        # dieses Rennen, bevor irgendeine PID beendet wird.
        for ($schlussRunde = 0; $schlussRunde -lt 4; $schlussRunde++) {
            Update-KnownTree
            if ($schlussRunde -lt 3) { Start-Sleep -Milliseconds 100 }
        }
        $taskkill = Join-Path -Path $env:SystemRoot -ChildPath 'System32\taskkill.exe'
        try { Set-Content -LiteralPath ([string]$config.DiagnoseFile) -Value ("Owner beendet; bekannte Prozesse: {0}" -f (($known.Keys | Sort-Object) -join ',')) -Encoding utf8 -Force }
        catch {}
        foreach ($idText in @($known.Keys | Sort-Object { [int]$_ } -Descending)) {
            $prozessId = [int]$idText
            try {
                # Verwaltete Kill-/Baumaufrufe und taskkill koennen bei einem
                # gleichzeitig zerfallenden Prozessbaum blockieren. Die bereits
                # einzeln identifizierte PID wird deshalb unmittelbar ueber den
                # nativen PROCESS_TERMINATE-Zugriff beendet. Derselbe Handle
                # bestaetigt davor die Erstellungszeit gegen PID-Wiederverwendung.
                $handle = [OneClickGuardianNative]::OpenProcess(0x1001, $false, [uint32]$prozessId)
                if ($handle -eq [IntPtr]::Zero) { throw 'OpenProcess(PROCESS_TERMINATE) ist fehlgeschlagen.' }
                try {
                    $creationTicks = [OneClickGuardianNative]::GetCreationUtcTicks($handle)
                    $tickAbweichung = [Math]::Abs([decimal]$creationTicks - [decimal][int64]$known[$idText])
                    if ($creationTicks -le 0 -or $tickAbweichung -gt [decimal][TimeSpan]::FromSeconds(2).Ticks) {
                        try { Add-Content -LiteralPath ([string]$config.DiagnoseFile) -Value ("PID {0} wegen abweichender Erstellungszeit ausgelassen: {1} Ticks" -f $prozessId, $tickAbweichung) -Encoding utf8 }
                        catch {}
                        continue
                    }
                    $beendet = [OneClickGuardianNative]::TerminateProcess($handle, 1)
                }
                finally { [void][OneClickGuardianNative]::CloseHandle($handle) }
                try { Add-Content -LiteralPath ([string]$config.DiagnoseFile) -Value ("TerminateProcess PID {0}; ausgeloest: {1}" -f $prozessId, $beendet) -Encoding utf8 }
                catch {}
                if (-not $beendet) {
                    $fallback = Start-Process -FilePath $taskkill -ArgumentList @('/PID', [string]$prozessId, '/F') -PassThru -WindowStyle Hidden -ErrorAction SilentlyContinue
                    if ($null -ne $fallback -and -not $fallback.WaitForExit(5000)) {
                        try { $fallback.Kill() } catch {}
                    }
                    if ($null -ne $fallback) { $fallback.Dispose() }
                }
            }
            catch {
                try { Add-Content -LiteralPath ([string]$config.DiagnoseFile) -Value ("PID {0} nicht beendet: {1}" -f $prozessId, $_.Exception.Message) -Encoding utf8 }
                catch {}
            }
        }
        foreach ($kontrolldatei in @([string]$config.ReadyFile, [string]$config.StopFile, [string]$config.DiagnoseFile)) {
            try {
                if (-not [string]::IsNullOrWhiteSpace($kontrolldatei) -and (Test-Path -LiteralPath $kontrolldatei -PathType Leaf)) {
                    Remove-Item -LiteralPath $kontrolldatei -Force -ErrorAction SilentlyContinue
                }
            }
            catch {}
        }
        # Nach dem harten Eigentuemertod sind Pipeline-, Host- und Console-
        # Aufraeumarbeiten nicht mehr relevant und koennen unter extremer
        # Parallelbelastung den bereits arbeitslosen Waechter verzoegern.
        # ExitProcess beendet ausschliesslich diesen Waechter unmittelbar.
        [OneClickGuardianNative]::ExitProcess(0)
        exit 0
    }
    Start-Sleep -Milliseconds 500
}
'@.Replace('__CONFIG__', $konfiguration64)
        $encoded = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($waechterCode))
        $startInfo = New-Object Diagnostics.ProcessStartInfo
        $startInfo.FileName = $hostPfad
        $startInfo.UseShellExecute = $false
        $startInfo.CreateNoWindow = $true
        if ($startInfo.PSObject.Properties.Name -contains 'ArgumentList') {
            foreach ($argument in @('-NoLogo', '-NoProfile', '-NonInteractive', '-EncodedCommand', $encoded)) {
                [void]$startInfo.ArgumentList.Add($argument)
            }
        }
        else {
            $startInfo.Arguments = ((@('-NoLogo', '-NoProfile', '-NonInteractive', '-EncodedCommand', $encoded) | ForEach-Object { ConvertTo-WindowsArgument -Wert $_ }) -join ' ')
        }
        $waechter = New-Object Diagnostics.Process
        $waechter.StartInfo = $startInfo
        if (-not $waechter.Start()) { throw 'Der unabhaengige Abbruchwaechter konnte nicht gestartet werden.' }
        $bereitBis = [DateTime]::UtcNow.AddSeconds(10)
        while (-not (Test-Path -LiteralPath $bereitDatei -PathType Leaf) -and [DateTime]::UtcNow -lt $bereitBis) {
            if ($waechter.HasExited) { break }
            Start-Sleep -Milliseconds 50
        }
        if (-not (Test-Path -LiteralPath $bereitDatei -PathType Leaf) -or $waechter.HasExited) {
            throw 'Der unabhaengige Abbruchwaechter meldete innerhalb des Zeitlimits keine Bereitschaft.'
        }
        return [pscustomobject]@{ Prozess = $waechter; StopDatei = $stopDatei; BereitDatei = $bereitDatei; DiagnoseDatei = $diagnoseDatei }
    }
    catch {
        if ($null -ne $waechter) {
            try { if (-not $waechter.HasExited) { $waechter.Kill() } } catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }
            $waechter.Dispose()
        }
        foreach ($datei in @($stopDatei, $bereitDatei, $diagnoseDatei)) {
            if (-not [string]::IsNullOrWhiteSpace([string]$datei) -and (Test-Path -LiteralPath $datei -PathType Leaf)) {
                Remove-Item -LiteralPath $datei -Force -ErrorAction SilentlyContinue
            }
        }
        Write-Verbose ("Der unabhaengige Prozessabbruchwaechter konnte nicht gestartet werden: {0}" -f $_.Exception.Message)
        return $null
    }
}

function Stop-UnabhaengigenProzessAbbruchwaechter {
    param([AllowNull()][object]$Waechter)

    if ($null -eq $Waechter) { return }
    $prozess = Get-SichereEigenschaft -Objekt $Waechter -Name 'Prozess' -Standardwert $null
    $stopDatei = Get-SichererText -Objekt $Waechter -Name 'StopDatei'
    $bereitDatei = Get-SichererText -Objekt $Waechter -Name 'BereitDatei'
    $diagnoseDatei = Get-SichererText -Objekt $Waechter -Name 'DiagnoseDatei'
    $probleme = New-Object 'System.Collections.Generic.List[string]'
    $entfernteDateien = 0
    $entfernteBytes = [int64]0
    try {
        if (-not [string]::IsNullOrWhiteSpace($stopDatei)) {
            New-Item -ItemType File -Path $stopDatei -Force -ErrorAction Stop | Out-Null
        }
        if ($null -ne $prozess -and -not $prozess.WaitForExit(5000)) {
            try { $prozess.Kill() }
            catch { $probleme.Add(("Abbruchwaechterprozess konnte nicht beendet werden: {0}" -f $_.Exception.Message)) | Out-Null }
            try {
                if (-not $prozess.WaitForExit(5000)) {
                    $probleme.Add('Abbruchwaechterprozess ist nach dem erzwungenen Beenden noch aktiv.') | Out-Null
                }
            }
            catch { $probleme.Add(("Endstatus des Abbruchwaechterprozesses konnte nicht verifiziert werden: {0}" -f $_.Exception.Message)) | Out-Null }
        }
    }
    catch { $probleme.Add(("Abbruchwaechter konnte nicht kontrolliert beendet werden: {0}" -f $_.Exception.Message)) | Out-Null }
    finally {
        if ($null -ne $prozess) { $prozess.Dispose() }
        foreach ($kontrollDatei in @($stopDatei, $bereitDatei, $diagnoseDatei)) {
            if ([string]::IsNullOrWhiteSpace($kontrollDatei)) { continue }
            if (Test-Path -LiteralPath $kontrollDatei -PathType Leaf) {
                try {
                    $info = Get-Item -LiteralPath $kontrollDatei -Force -ErrorAction Stop
                    if ($info.Attributes -band [IO.FileAttributes]::ReparsePoint) {
                        throw 'Kontrolldatei ist eine unerwartete Pfadumleitung.'
                    }
                    $laenge = [int64]$info.Length
                    Remove-Item -LiteralPath $kontrollDatei -Force -ErrorAction Stop
                    if (Test-Path -LiteralPath $kontrollDatei) {
                        throw 'Kontrolldatei ist nach der Entfernung noch vorhanden.'
                    }
                    $entfernteDateien++
                    $entfernteBytes += $laenge
                }
                catch { $probleme.Add(("Kontrolldatei des Abbruchwaechters konnte nicht verifiziert bereinigt werden ({0}): {1}" -f $kontrollDatei, $_.Exception.Message)) | Out-Null }
            }
        }
    }
    if ($null -ne (Get-Variable -Name 'BereinigteRestdateien' -Scope Script -ErrorAction SilentlyContinue)) {
        $script:BereinigteRestdateien += $entfernteDateien
    }
    if ($null -ne (Get-Variable -Name 'BereinigteRestbytes' -Scope Script -ErrorAction SilentlyContinue)) {
        $script:BereinigteRestbytes += $entfernteBytes
    }
    if ($probleme.Count -gt 0) {
        if ($null -ne (Get-Variable -Name 'Bereinigungsfehler' -Scope Script -ErrorAction SilentlyContinue)) {
            $script:Bereinigungsfehler += $probleme.Count
        }
        throw ($probleme -join ' ')
    }
}

function Invoke-ProzessMitTimeout {
    param(
        [Parameter(Mandatory = $true)][string]$Datei,
        [Parameter(Mandatory = $true)][AllowEmptyCollection()][string[]]$Argumente,
        [ValidateRange(1, 86400)][int]$TimeoutSekunden = 7200,
        [ValidateRange(0, 86400)][int]$LeerlaufTimeoutSekunden = 0,
        [switch]$InstallationsVorgang,
        [switch]$AlleKindprozesseAlsAktivitaet,
        [switch]$WindowsUpdateDownloadUeberwachen,
        [AllowEmptyCollection()][string[]]$AktivitaetsPfade = @(),
        [string]$FortschrittsText = ''
    )

    if ($InstallationsVorgang -and $LeerlaufTimeoutSekunden -le 0) {
        $LeerlaufTimeoutSekunden = 600
    }
    if ($InstallationsVorgang -and [IO.Path]::GetFileName($Datei).Equals('winget.exe', [StringComparison]::OrdinalIgnoreCase)) {
        $wingetDiagnoseOrdner = Get-WinGetDiagnoseOrdner
        if (-not [string]::IsNullOrWhiteSpace($wingetDiagnoseOrdner)) {
            $AktivitaetsPfade = @($AktivitaetsPfade) + @($wingetDiagnoseOrdner)
        }
    }
    $AktivitaetsPfade = @($AktivitaetsPfade | Where-Object { -not [string]::IsNullOrWhiteSpace([string]$_) } | Select-Object -Unique)
    if ($LeerlaufTimeoutSekunden -gt 0 -and $LeerlaufTimeoutSekunden -ge $TimeoutSekunden) {
        $LeerlaufTimeoutSekunden = [Math]::Max(1, $TimeoutSekunden - 30)
    }

    $startInfo = New-Object Diagnostics.ProcessStartInfo
    $startInfo.FileName = $Datei
    $startInfo.UseShellExecute = $false
    $startInfo.CreateNoWindow = $true
    $startInfo.RedirectStandardOutput = $true
    $startInfo.RedirectStandardError = $true
    $nativeAusgabeEncoding = Get-NativeProzessAusgabeEncoding -Datei $Datei
    if ($null -ne $nativeAusgabeEncoding) {
        if ($startInfo.PSObject.Properties.Name -contains 'StandardOutputEncoding') {
            $startInfo.StandardOutputEncoding = $nativeAusgabeEncoding
        }
        if ($startInfo.PSObject.Properties.Name -contains 'StandardErrorEncoding') {
            $startInfo.StandardErrorEncoding = $nativeAusgabeEncoding
        }
    }
    try {
        $arbeitsordner = [Environment]::CurrentDirectory
        if (-not [string]::IsNullOrWhiteSpace([string]$arbeitsordner) -and (Test-Path -LiteralPath $arbeitsordner -PathType Container)) {
            $startInfo.WorkingDirectory = $arbeitsordner
        }
    }
    catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }

    if ($startInfo.PSObject.Properties.Name -contains 'ArgumentList') {
        foreach ($argument in $Argumente) { [void]$startInfo.ArgumentList.Add([string]$argument) }
    }
    else {
        $startInfo.Arguments = (($Argumente | ForEach-Object { ConvertTo-WindowsArgument -Wert ([string]$_) }) -join ' ')
    }

    $prozess = New-Object Diagnostics.Process
    $prozess.StartInfo = $startInfo
    $gestartet = $false
    $abbruchJob = [IntPtr]::Zero
    $abbruchWaechter = $null
    $installerVorher = if ($InstallationsVorgang) { Get-InstallerProzessMomentaufnahme } else { $null }
    $vorherIds = New-Object 'System.Collections.Generic.HashSet[int]'
    if ($null -ne $installerVorher -and [bool](Get-SichereEigenschaft -Objekt $installerVorher -Name 'Verfuegbar' -Standardwert $false)) {
        foreach ($vorher in @((Get-SichereEigenschaft -Objekt $installerVorher -Name 'Prozesse' -Standardwert @()))) {
            $vorherId = [int](Get-SichereEigenschaft -Objekt $vorher -Name 'ProcessId' -Standardwert 0)
            if ($vorherId -gt 0) { [void]$vorherIds.Add($vorherId) }
        }
    }
    $startZeitUtc = [DateTime]::UtcNow

    try {
        if ($InstallationsVorgang) {
            # Der unabhaengige Waechter muss vollstaendig bereit sein, bevor
            # der erste Installerprozess startet. So existiert auch bei einem
            # sofortigen Hostabbruch kein unbeaufsichtigtes Startzeitfenster.
            $abbruchWaechter = Start-UnabhaengigenProzessAbbruchwaechter -ErwarteterProzessPfad $Datei
            if ($null -eq $abbruchWaechter) {
                Write-Verbose 'Der unabhaengige Abbruchwaechter ist nicht verfuegbar; Jobobjekt und expliziter Prozessbaum-Abbruch bleiben aktiv.'
            }
        }
        $gestartet = $prozess.Start()
        if (-not $gestartet) { throw "Prozess konnte nicht gestartet werden: $Datei" }

        if ($InstallationsVorgang) {
            # Das Windows-Jobobjekt beendet den gesamten zugeordneten Baum auch
            # dann, wenn dieser PowerShell-Prozess durch Strg+C, einen Hostabbruch
            # oder einen unerwarteten Fehler verschwindet. Damit bleiben keine
            # unbeaufsichtigten winget-/Installer-Prozesse zurueck.
            $abbruchJob = New-AbbruchgekoppeltesProzessJob -Prozess $prozess
            if ($abbruchJob -eq [IntPtr]::Zero) {
                Write-Verbose 'Installationsprozess laeuft ohne Jobobjekt; der explizite Prozessbaum-Abbruch bleibt aktiv.'
            }
        }

        $rootProzessId = [int]$prozess.Id
        $bekannteProzessIds = New-Object 'System.Collections.Generic.HashSet[int]'
        $ignorierteInstallerIds = New-Object 'System.Collections.Generic.HashSet[int]'
        [void]$bekannteProzessIds.Add($rootProzessId)
        $stdoutTask = $prozess.StandardOutput.ReadToEndAsync()
        $stderrTask = $prozess.StandardError.ReadToEndAsync()
        $stoppuhr = [Diagnostics.Stopwatch]::StartNew()
        $naechsteMeldung = 30
        $naechsteBaumPruefung = 0
        $rootBeendet = $false
        $vollstaendigBeendet = $false
        $absolutesTimeout = $false
        $leerlaufTimeout = $false
        $nachlaufTimeout = $false
        $monitorVerfuegbar = (-not $InstallationsVorgang)
        $monitorFehlerGemeldet = $false
        [decimal]$letzterAktivitaetswert = -1
        [decimal]$letzterFallbackAktivitaetswert = -1
        $letzteProzessSignatur = ''
        $letztePfadSignatur = Get-AktivitaetsPfadSignatur -Pfade $AktivitaetsPfade
        $letztePfadEinzelsignaturen = @{}
        foreach ($aktivitaetsPfad in $AktivitaetsPfade) {
            $letztePfadEinzelsignaturen[[string]$aktivitaetsPfad] = Get-AktivitaetsPfadSignatur -Pfade @([string]$aktivitaetsPfad)
        }
        $letzteAktivitaetSekunden = 0.0
        $letzteAktivitaetsProzessNamen = @()
        $letzteAktiveProtokollNamen = @()
        $letzteProtokollAktivitaetSekunden = $null
        $letzteNachlaufNamen = @()
        $letzteRelevanteProzesse = @()
        $nachlaufFreiSeitSekunden = $null
        $naechsteDownloadPruefung = 0.0
        $letzteDownloadMomentaufnahme = $null
        $downloadErkannt = $false
        $downloadAktiv = $false
        $downloadStartSekunden = $null
        $downloadLetzterFortschrittSekunden = $null
        $downloadEndeSekunden = $null
        [decimal]$downloadGeladenBytes = 0
        [decimal]$downloadGesamtBytes = 0
        [decimal]$downloadGeschaetzteBytes = 0
        $downloadBytesGeschaetzt = $false
        $direkteDownloadWerteJeErkannt = $false
        $downloadCbsProzent = -1
        $downloadQuelle = ''
        $cbsDownloadLogTreffer = @($AktivitaetsPfade | Where-Object { [IO.Path]::GetFileName([string]$_).Equals('CBS.log', [StringComparison]::OrdinalIgnoreCase) } | Select-Object -First 1)
        $cbsDownloadLogPfad = if ($cbsDownloadLogTreffer.Count -gt 0) { [string]$cbsDownloadLogTreffer[0] } else { '' }

        while (-not $vollstaendigBeendet) {
            if ($stoppuhr.Elapsed.TotalSeconds -ge $TimeoutSekunden) {
                $absolutesTimeout = $true
                if ($rootBeendet) { $nachlaufTimeout = $true }
                break
            }

            if (-not $rootBeendet) { $rootBeendet = $prozess.WaitForExit(1000) }
            else { Start-Sleep -Milliseconds 1000 }

            if ($InstallationsVorgang -and $stoppuhr.Elapsed.TotalSeconds -ge $naechsteBaumPruefung) {
                $momentaufnahme = Get-ProzessbaumMomentaufnahme -RootProcessId $rootProzessId -BekannteProzessIds ([int[]]@($bekannteProzessIds)) -StartZeitUtc $startZeitUtc
                if ([bool](Get-SichereEigenschaft -Objekt $momentaufnahme -Name 'Verfuegbar' -Standardwert $false)) {
                    $monitorVerfuegbar = $true
                    foreach ($prozessId in @((Get-SichereEigenschaft -Objekt $momentaufnahme -Name 'ProzessIds' -Standardwert @()))) {
                        if ([int]$prozessId -gt 0) { [void]$bekannteProzessIds.Add([int]$prozessId) }
                    }

                    $neueInstallerKandidaten = New-Object 'System.Collections.Generic.List[object]'
                    $installerJetzt = Get-InstallerProzessMomentaufnahme
                    if ([bool](Get-SichereEigenschaft -Objekt $installerJetzt -Name 'Verfuegbar' -Standardwert $false)) {
                        foreach ($kandidat in @((Get-SichereEigenschaft -Objekt $installerJetzt -Name 'Prozesse' -Standardwert @()))) {
                            $kandidatId = [int](Get-SichereEigenschaft -Objekt $kandidat -Name 'ProcessId' -Standardwert 0)
                            if ($kandidatId -le 0 -or $kandidatId -eq $rootProzessId -or $vorherIds.Contains($kandidatId)) { continue }
                            $creationDate = Get-SichereEigenschaft -Objekt $kandidat -Name 'CreationDate' -Standardwert $null
                            $nachStart = $true
                            if ($null -ne $creationDate) {
                                try { $nachStart = ([DateTime]$creationDate).ToUniversalTime() -ge $startZeitUtc.AddSeconds(-5) } catch { $nachStart = $true }
                            }
                            if ($nachStart) { $neueInstallerKandidaten.Add($kandidat) | Out-Null }
                        }
                    }

                    $zusaetzlicheInstaller = @(Get-ZugeordneteZusaetzlicheInstallerProzesse -Kandidaten $neueInstallerKandidaten.ToArray() -BekannteProzessIds ([int[]]@($bekannteProzessIds)) -RootProcessId $rootProzessId)
                    $zugeordneteExtraIds = New-Object 'System.Collections.Generic.HashSet[int]'
                    foreach ($extra in $zusaetzlicheInstaller) {
                        $extraId = [int](Get-SichereEigenschaft -Objekt $extra -Name 'ProcessId' -Standardwert 0)
                        if ($extraId -gt 0) {
                            [void]$zugeordneteExtraIds.Add($extraId)
                            [void]$bekannteProzessIds.Add($extraId)
                        }
                    }
                    foreach ($kandidat in $neueInstallerKandidaten.ToArray()) {
                        $kandidatId = [int](Get-SichereEigenschaft -Objekt $kandidat -Name 'ProcessId' -Standardwert 0)
                        if ($kandidatId -gt 0 -and -not $zugeordneteExtraIds.Contains($kandidatId) -and $ignorierteInstallerIds.Add($kandidatId)) {
                            $script:FremdeInstallerIgnoriert++
                        }
                    }

                    $baumProzesse = @((Get-SichereEigenschaft -Objekt $momentaufnahme -Name 'Prozesse' -Standardwert @()))
                    $aktivitaetsProzesse = New-Object 'System.Collections.Generic.List[object]'
                    $aktivitaetsIds = New-Object 'System.Collections.Generic.HashSet[int]'
                    foreach ($baumProzess in $baumProzesse) {
                        $prozessId = [int](Get-SichereEigenschaft -Objekt $baumProzess -Name 'ProcessId' -Standardwert 0)
                        if ($prozessId -eq $rootProzessId -or $AlleKindprozesseAlsAktivitaet -or (Test-IstRelevanterInstallerprozess -Prozess $baumProzess)) {
                            if ($prozessId -gt 0 -and $aktivitaetsIds.Add($prozessId)) { $aktivitaetsProzesse.Add($baumProzess) | Out-Null }
                        }
                    }
                    foreach ($extra in $zusaetzlicheInstaller) {
                        $prozessId = [int](Get-SichereEigenschaft -Objekt $extra -Name 'ProcessId' -Standardwert 0)
                        if ($prozessId -gt 0 -and $aktivitaetsIds.Add($prozessId)) { $aktivitaetsProzesse.Add($extra) | Out-Null }
                    }

                    [decimal]$aktuellerAktivitaetswert = 0
                    foreach ($aktiv in $aktivitaetsProzesse.ToArray()) {
                        $aktuellerAktivitaetswert += [decimal](Get-SichereEigenschaft -Objekt $aktiv -Name 'Aktivitaetswert' -Standardwert 0)
                    }
                    $letzteAktivitaetsProzessNamen = @($aktivitaetsProzesse.ToArray() | Sort-Object ProcessId | ForEach-Object {
                        $prozessName = Get-SichererText -Objekt $_ -Name 'Name'
                        $prozessId = [int](Get-SichereEigenschaft -Objekt $_ -Name 'ProcessId' -Standardwert 0)
                        if (-not [string]::IsNullOrWhiteSpace($prozessName) -and $prozessId -gt 0) { '{0} (PID {1})' -f $prozessName, $prozessId }
                    })
                    $aktuelleProzessSignatur = (($aktivitaetsProzesse.ToArray() | Sort-Object ProcessId | ForEach-Object { '{0}:{1}' -f $_.ProcessId, $_.Name }) -join '|')
                    $aktuellePfadSignatur = Get-AktivitaetsPfadSignatur -Pfade $AktivitaetsPfade
                    $geaenderteProtokolle = New-Object 'System.Collections.Generic.List[string]'
                    foreach ($aktivitaetsPfad in $AktivitaetsPfade) {
                        $pfadText = [string]$aktivitaetsPfad
                        $aktuelleEinzelsignatur = Get-AktivitaetsPfadSignatur -Pfade @($pfadText)
                        $vorherigeEinzelsignatur = if ($letztePfadEinzelsignaturen.ContainsKey($pfadText)) { [string]$letztePfadEinzelsignaturen[$pfadText] } else { '' }
                        if ($aktuelleEinzelsignatur -ne $vorherigeEinzelsignatur) {
                            $protokollName = [IO.Path]::GetFileName($pfadText)
                            if ([string]::IsNullOrWhiteSpace($protokollName)) { $protokollName = $pfadText }
                            $geaenderteProtokolle.Add($protokollName) | Out-Null
                        }
                        $letztePfadEinzelsignaturen[$pfadText] = $aktuelleEinzelsignatur
                    }
                    if ($geaenderteProtokolle.Count -gt 0) {
                        $letzteAktiveProtokollNamen = @($geaenderteProtokolle.ToArray() | Select-Object -Unique)
                        $letzteProtokollAktivitaetSekunden = $stoppuhr.Elapsed.TotalSeconds
                    }
                    if ($letzterAktivitaetswert -lt 0 -or $aktuellerAktivitaetswert -gt $letzterAktivitaetswert -or $aktuelleProzessSignatur -ne $letzteProzessSignatur -or $aktuellePfadSignatur -ne $letztePfadSignatur) {
                        $letzteAktivitaetSekunden = $stoppuhr.Elapsed.TotalSeconds
                    }
                    $letzterAktivitaetswert = $aktuellerAktivitaetswert
                    $letzteProzessSignatur = $aktuelleProzessSignatur
                    $letztePfadSignatur = $aktuellePfadSignatur

                    if ($rootBeendet) {
                        $nachlauf = @(Get-RelevanteInstallationsNachlaufProzesse -Momentaufnahme $momentaufnahme -RootProcessId $rootProzessId -ZusaetzlicheInstallerProzesse $zusaetzlicheInstaller)
                        $letzteNachlaufNamen = @($nachlauf | ForEach-Object { '{0} (PID {1})' -f $_.Name, $_.ProcessId })
                        $letzteRelevanteProzesse = @($nachlauf)
                        if ($nachlauf.Count -eq 0) {
                            if ($null -eq $nachlaufFreiSeitSekunden) { $nachlaufFreiSeitSekunden = $stoppuhr.Elapsed.TotalSeconds }
                            elseif (($stoppuhr.Elapsed.TotalSeconds - [double]$nachlaufFreiSeitSekunden) -ge 8) { $vollstaendigBeendet = $true }
                        }
                        else { $nachlaufFreiSeitSekunden = $null }
                    }
                }
                else {
                    if (-not $monitorFehlerGemeldet) {
                        $monitorFehlerGemeldet = $true
                        Write-Status -Text ("Der Installations-Prozessbaum konnte nicht ueber CIM ueberwacht werden: {0}. Die lokale Prozess- und Protokollueberwachung bleibt aktiv." -f (Get-SichererText -Objekt $momentaufnahme -Name 'Fehler')) -Stufe 'WARNUNG'
                    }

                    # Fallback, damit ein defekter CIM/WMI-Dienst den Leerlaufschutz
                    # nicht fuer die gesamte maximale Laufzeit deaktiviert.
                    if (-not $rootBeendet) {
                        try {
                            $prozess.Refresh()
                            [decimal]$fallbackAktivitaetswert = [decimal]$prozess.TotalProcessorTime.Ticks + [decimal]$prozess.WorkingSet64 + [decimal]$prozess.PagedMemorySize64
                            if ($letzterFallbackAktivitaetswert -lt 0 -or $fallbackAktivitaetswert -gt $letzterFallbackAktivitaetswert) {
                                $letzteAktivitaetSekunden = $stoppuhr.Elapsed.TotalSeconds
                            }
                            $letzterFallbackAktivitaetswert = $fallbackAktivitaetswert
                            $monitorVerfuegbar = $true
                        }
                        catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }
                    }

                    $aktuellePfadSignatur = Get-AktivitaetsPfadSignatur -Pfade $AktivitaetsPfade
                    if ($aktuellePfadSignatur -ne $letztePfadSignatur) {
                        $letzteAktivitaetSekunden = $stoppuhr.Elapsed.TotalSeconds
                        $letzteAktiveProtokollNamen = @($AktivitaetsPfade | ForEach-Object {
                            $protokollName = [IO.Path]::GetFileName([string]$_)
                            if ([string]::IsNullOrWhiteSpace($protokollName)) { [string]$_ } else { $protokollName }
                        } | Select-Object -Unique)
                        $letzteProtokollAktivitaetSekunden = $stoppuhr.Elapsed.TotalSeconds
                        $letztePfadSignatur = $aktuellePfadSignatur
                    }
                    if ($AktivitaetsPfade.Count -gt 0) { $monitorVerfuegbar = $true }
                }
                $naechsteBaumPruefung = $stoppuhr.Elapsed.TotalSeconds + 5
            }

            if ($WindowsUpdateDownloadUeberwachen -and $stoppuhr.Elapsed.TotalSeconds -ge $naechsteDownloadPruefung) {
                $downloadMomentaufnahme = Get-WindowsUpdateDownloadMomentaufnahme -CbsLogPfad $cbsDownloadLogPfad -StartZeitUtc $startZeitUtc
                $direktAktiv = [int](Get-SichereEigenschaft -Objekt $downloadMomentaufnahme -Name 'AktiveUebertragungen' -Standardwert 0) -gt 0
                $direkteWerteAktuell = [bool](Get-SichereEigenschaft -Objekt $downloadMomentaufnahme -Name 'DirekteWerteVerfuegbar' -Standardwert $false)
                $cbsDownloadAktiv = [bool](Get-SichereEigenschaft -Objekt $downloadMomentaufnahme -Name 'CbsDownloadAktiv' -Standardwert $false)
                $cbsDownloadProzentAktuell = [int](Get-SichereEigenschaft -Objekt $downloadMomentaufnahme -Name 'CbsDownloadProzent' -Standardwert -1)
                $direkterFortschritt = $false
                $dienstUndNetzwerkFortschritt = $false
                $cbsDownloadFortschritt = $false
                [decimal]$netzwerkDeltaBytes = 0
                if ($null -ne $letzteDownloadMomentaufnahme) {
                    $direkterFortschritt = [decimal](Get-SichereEigenschaft -Objekt $downloadMomentaufnahme -Name 'DownloadBytes' -Standardwert 0) -gt [decimal](Get-SichereEigenschaft -Objekt $letzteDownloadMomentaufnahme -Name 'DownloadBytes' -Standardwert 0)
                    $dienstFortschritt = [decimal](Get-SichereEigenschaft -Objekt $downloadMomentaufnahme -Name 'DienstAktivitaetswert' -Standardwert 0) -gt [decimal](Get-SichereEigenschaft -Objekt $letzteDownloadMomentaufnahme -Name 'DienstAktivitaetswert' -Standardwert 0)
                    $netzwerkJetzt = [decimal](Get-SichereEigenschaft -Objekt $downloadMomentaufnahme -Name 'NetzwerkEmpfangenBytes' -Standardwert 0)
                    $netzwerkVorher = [decimal](Get-SichereEigenschaft -Objekt $letzteDownloadMomentaufnahme -Name 'NetzwerkEmpfangenBytes' -Standardwert 0)
                    $netzwerkDeltaBytes = [Math]::Max([decimal]0, $netzwerkJetzt - $netzwerkVorher)
                    $netzwerkFortschritt = $netzwerkDeltaBytes -gt 0
                    $dienstUndNetzwerkFortschritt = $dienstFortschritt -and $netzwerkFortschritt
                    $cbsSignaturJetzt = Get-SichererText -Objekt $downloadMomentaufnahme -Name 'CbsDownloadSignatur'
                    $cbsSignaturVorher = Get-SichererText -Objekt $letzteDownloadMomentaufnahme -Name 'CbsDownloadSignatur'
                    $cbsProzentVorher = [int](Get-SichereEigenschaft -Objekt $letzteDownloadMomentaufnahme -Name 'CbsDownloadProzent' -Standardwert -1)
                    $cbsDownloadFortschritt = (-not [string]::IsNullOrWhiteSpace($cbsSignaturJetzt) -and $cbsSignaturJetzt -ne $cbsSignaturVorher) -or ($cbsDownloadProzentAktuell -ge 0 -and $cbsDownloadProzentAktuell -ne $cbsProzentVorher)
                }

                $downloadSignalAktiv = ($direktAktiv -or $dienstUndNetzwerkFortschritt -or $cbsDownloadAktiv -or $cbsDownloadFortschritt)
                $downloadFortschrittMessbar = ($direkterFortschritt -or $dienstUndNetzwerkFortschritt -or $cbsDownloadFortschritt)
                if ($downloadSignalAktiv) {
                    if (-not $downloadErkannt) {
                        $downloadErkannt = $true
                        $downloadStartSekunden = $stoppuhr.Elapsed.TotalSeconds
                        Write-Status -Text 'Windows-Update-Download fuer die DISM-Reparatur erkannt; Laufzeit, Megabytes sowie verfuegbare Gesamtgroessen und Prozentwerte werden angezeigt.' -Stufe 'INFO'
                    }
                    $downloadAktiv = $true
                    if ($downloadFortschrittMessbar -or $null -eq $downloadLetzterFortschrittSekunden) {
                        $downloadLetzterFortschrittSekunden = $stoppuhr.Elapsed.TotalSeconds
                        $downloadEndeSekunden = $stoppuhr.Elapsed.TotalSeconds
                        $letzteAktivitaetSekunden = $stoppuhr.Elapsed.TotalSeconds
                        $monitorVerfuegbar = $true
                    }

                    $aktuellGeladen = [decimal](Get-SichereEigenschaft -Objekt $downloadMomentaufnahme -Name 'DownloadBytes' -Standardwert 0)
                    $aktuellGesamt = [decimal](Get-SichereEigenschaft -Objekt $downloadMomentaufnahme -Name 'GesamtBytes' -Standardwert 0)
                    if ($direkteWerteAktuell) {
                        $direkteDownloadWerteJeErkannt = $true
                        $downloadBytesGeschaetzt = $false
                        if ($aktuellGeladen -gt $downloadGeladenBytes) { $downloadGeladenBytes = $aktuellGeladen }
                        if ($aktuellGesamt -gt $downloadGesamtBytes) { $downloadGesamtBytes = $aktuellGesamt }
                    }
                    elseif ($dienstUndNetzwerkFortschritt -and $netzwerkDeltaBytes -gt 0 -and -not $direkteDownloadWerteJeErkannt) {
                        # Der Adapterzaehler umfasst den Empfang des Systems. Er wird
                        # deshalb nur bei gleichzeitig wachsender E/A der Update-Dienste
                        # verwendet und in der Anzeige ausdruecklich als Schaetzung markiert.
                        $downloadGeschaetzteBytes += $netzwerkDeltaBytes
                        $downloadGeladenBytes = $downloadGeschaetzteBytes
                        $downloadBytesGeschaetzt = $true
                    }
                    if ($cbsDownloadProzentAktuell -ge 0) { $downloadCbsProzent = $cbsDownloadProzentAktuell }
                    $direkteQuelle = Get-SichererText -Objekt $downloadMomentaufnahme -Name 'Quelle'
                    if (-not [string]::IsNullOrWhiteSpace($direkteQuelle)) { $downloadQuelle = $direkteQuelle }
                    elseif ([string]::IsNullOrWhiteSpace($downloadQuelle)) { $downloadQuelle = 'Windows-Update-Dienste und Netzwerkempfang' }
                }
                elseif ($downloadAktiv -and $null -ne $downloadLetzterFortschrittSekunden -and ($stoppuhr.Elapsed.TotalSeconds - [double]$downloadLetzterFortschrittSekunden) -ge 30) {
                    $downloadAktiv = $false
                    $downloadEndeSekunden = [double]$downloadLetzterFortschrittSekunden
                }

                $letzteDownloadMomentaufnahme = $downloadMomentaufnahme
                $naechsteDownloadPruefung = $stoppuhr.Elapsed.TotalSeconds + 10
            }

            if (-not $InstallationsVorgang -and $rootBeendet) { $vollstaendigBeendet = $true }
            elseif ($InstallationsVorgang -and $rootBeendet -and -not $monitorVerfuegbar) { $vollstaendigBeendet = $true }
            elseif ($InstallationsVorgang -and $rootBeendet -and $monitorFehlerGemeldet -and $letzteRelevanteProzesse.Count -eq 0) {
                # Ohne CIM kann kein fremder Prozess sicher dem Vorgang zugeordnet
                # werden. Der Rootprozess ist beendet; die anschliessende Paket-
                # Nachkontrolle bestaetigt den wirklichen Installationszustand.
                $vollstaendigBeendet = $true
            }

            if (-not $vollstaendigBeendet -and $LeerlaufTimeoutSekunden -gt 0 -and $monitorVerfuegbar) {
                $leerlaufSekunden = $stoppuhr.Elapsed.TotalSeconds - $letzteAktivitaetSekunden
                if ($leerlaufSekunden -ge $LeerlaufTimeoutSekunden) {
                    $leerlaufTimeout = $true
                    if ($rootBeendet) { $nachlaufTimeout = $true }
                    break
                }
            }

            if (-not $vollstaendigBeendet -and -not [string]::IsNullOrWhiteSpace($FortschrittsText) -and $stoppuhr.Elapsed.TotalSeconds -ge $naechsteMeldung) {
                $zusatz = ''
                if ($InstallationsVorgang -and $monitorVerfuegbar) {
                    $leerlaufSeit = [Math]::Max(0, [int][Math]::Floor($stoppuhr.Elapsed.TotalSeconds - $letzteAktivitaetSekunden))
                    $leerlaufSeitText = ConvertTo-LesbareDauer -Sekunden $leerlaufSeit
                    if ($rootBeendet -and $letzteNachlaufNamen.Count -gt 0) {
                        $zusatz = ('; nachgelagerter Prozess aktiv: {0}; letzte Aktivitaet vor {1}' -f (($letzteNachlaufNamen | Select-Object -First 4) -join ', '), $leerlaufSeitText)
                    }
                    else { $zusatz = ('; letzte messbare Prozess- oder Protokollaktivitaet vor {0}' -f $leerlaufSeitText) }
                    if ($letzteAktivitaetsProzessNamen.Count -gt 0) {
                        $zusatz += ('; Prozesskette: {0}' -f (($letzteAktivitaetsProzessNamen | Select-Object -First 5) -join ', '))
                    }
                    if ($null -ne $letzteProtokollAktivitaetSekunden -and $letzteAktiveProtokollNamen.Count -gt 0) {
                        $protokollLeerlaufSeit = [Math]::Max(0, [int][Math]::Floor($stoppuhr.Elapsed.TotalSeconds - [double]$letzteProtokollAktivitaetSekunden))
                        $zusatz += ('; Protokollaktivitaet: {0} zuletzt vor {1}' -f (($letzteAktiveProtokollNamen | Select-Object -First 4) -join ', '), (ConvertTo-LesbareDauer -Sekunden $protokollLeerlaufSeit))
                    }
                    elseif ($AktivitaetsPfade.Count -gt 0) {
                        $ueberwachteProtokollNamen = @($AktivitaetsPfade | ForEach-Object {
                            $protokollName = [IO.Path]::GetFileName([string]$_)
                            if ([string]::IsNullOrWhiteSpace($protokollName)) { [string]$_ } else { $protokollName }
                        } | Select-Object -Unique)
                        $zusatz += ('; Protokollwaechter aktiv: {0}' -f (($ueberwachteProtokollNamen | Select-Object -First 4) -join ', '))
                    }
                }
                if ($WindowsUpdateDownloadUeberwachen -and $downloadErkannt) {
                    $downloadBis = if ($downloadAktiv) { $stoppuhr.Elapsed.TotalSeconds } elseif ($null -ne $downloadEndeSekunden) { [double]$downloadEndeSekunden } else { $stoppuhr.Elapsed.TotalSeconds }
                    $downloadDauerText = ConvertTo-LesbareDauer -Sekunden ([Math]::Max(0, $downloadBis - [double]$downloadStartSekunden))
                    $downloadMengenText = ''
                    if ($downloadGeladenBytes -gt 0) {
                        $mengenPraefix = if ($downloadBytesGeschaetzt) { '; ca. empfangen ' } else { '; uebertragen ' }
                        $downloadMengenText = $mengenPraefix + (ConvertTo-LesbareBytemenge -Bytes ([double]$downloadGeladenBytes))
                        if ($downloadGesamtBytes -gt 0) {
                            $downloadMengenText += ' von ' + (ConvertTo-LesbareBytemenge -Bytes ([double]$downloadGesamtBytes))
                            $downloadProzent = [Math]::Min(100, [Math]::Max(0, [int][Math]::Floor(([double]$downloadGeladenBytes / [double]$downloadGesamtBytes) * 100)))
                            $downloadMengenText += (' ({0}%)' -f $downloadProzent)
                        }
                    }
                    if ($downloadCbsProzent -ge 0) { $downloadMengenText += ('; CBS-/Windows-Update-Fortschritt {0}%' -f $downloadCbsProzent) }
                    $downloadStatus = if ($downloadAktiv) { 'aktiv' } else { 'zuletzt aktiv' }
                    $zusatz += ('; Windows-Update-Download {0}, Dauer {1}{2}' -f $downloadStatus, $downloadDauerText, $downloadMengenText)
                }
                Write-Status -Text ("{0} laeuft weiter ({1}){2}." -f $FortschrittsText, (ConvertTo-LesbareDauer -Sekunden $stoppuhr.Elapsed.TotalSeconds), $zusatz) -Stufe 'INFO'
                $aktuellerProzentwert = [Math]::Max(0, [int]$script:FortschrittProzent)
                $fortschrittsStatus = ("{0} - seit {1} aktiv" -f $FortschrittsText, (ConvertTo-LesbareDauer -Sekunden $stoppuhr.Elapsed.TotalSeconds))
                if ($letzteAktivitaetsProzessNamen.Count -gt 0) {
                    $fortschrittsStatus += ' | Prozesse: ' + (($letzteAktivitaetsProzessNamen | Select-Object -First 3) -join ', ')
                }
                if ($WindowsUpdateDownloadUeberwachen -and $downloadErkannt) {
                    $downloadBis = if ($downloadAktiv) { $stoppuhr.Elapsed.TotalSeconds } elseif ($null -ne $downloadEndeSekunden) { [double]$downloadEndeSekunden } else { $stoppuhr.Elapsed.TotalSeconds }
                    $fortschrittsStatus += ' | WU-Download ' + (ConvertTo-LesbareDauer -Sekunden ([Math]::Max(0, $downloadBis - [double]$downloadStartSekunden)))
                    if ($downloadGeladenBytes -gt 0) {
                        if ($downloadBytesGeschaetzt) { $fortschrittsStatus += ', ca.' } else { $fortschrittsStatus += ',' }
                        $fortschrittsStatus += ' ' + (ConvertTo-LesbareBytemenge -Bytes ([double]$downloadGeladenBytes))
                    }
                    if ($downloadCbsProzent -ge 0) { $fortschrittsStatus += (', {0}%' -f $downloadCbsProzent) }
                }
                Set-Gesamtfortschritt -Prozent $aktuellerProzentwert -Status $fortschrittsStatus -Dauerhaft
                $naechsteMeldung += 30
            }
        }
        $stoppuhr.Stop()

        $timeout = ($absolutesTimeout -or $leerlaufTimeout -or $nachlaufTimeout)
        if ($timeout) {
            if ($leerlaufTimeout) { $script:InstallationsLeerlaufAbbrueche++ }
            try {
                $prozess.Refresh()
                if ($prozess.HasExited) { $rootBeendet = $true }
            }
            catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }
            # Ist der Hauptprozess bereits beendet, darf seine inzwischen moeglicherweise
            # wiederverwendete PID nicht an taskkill uebergeben werden. In diesem Fall
            # werden ausschliesslich die zuletzt bestaetigten Installer-Nachlaufprozesse beendet.
            $abbruchRootProzessId = if ($rootBeendet) { 0 } else { $rootProzessId }
            Stop-ProzessbaumSicher -RootProcessId $abbruchRootProzessId -ZusaetzlicheProzesse @($letzteRelevanteProzesse)
            if (-not $rootBeendet) {
                try { $rootBeendet = $prozess.WaitForExit(10000) } catch { $rootBeendet = $false }
            }
        }

        $stdout = ''
        $stderr = ''
        if ($rootBeendet) {
            try {
                if ($stdoutTask.Wait(10000)) { $stdout = [string]$stdoutTask.Result }
                else { $stderr = 'Die Standardausgabe konnte nach Prozessende nicht vollstaendig gelesen werden.' }
            }
            catch { $stderr = 'Die Standardausgabe konnte nicht gelesen werden: ' + $_.Exception.Message }
            try {
                if ($stderrTask.Wait(10000)) {
                    $stderrGelesen = [string]$stderrTask.Result
                    if (-not [string]::IsNullOrWhiteSpace($stderrGelesen)) {
                        if ([string]::IsNullOrWhiteSpace($stderr)) { $stderr = $stderrGelesen }
                        else { $stderr += [Environment]::NewLine + $stderrGelesen }
                    }
                }
                elseif ([string]::IsNullOrWhiteSpace($stderr)) { $stderr = 'Die Standardfehlerausgabe konnte nach Prozessende nicht vollstaendig gelesen werden.' }
            }
            catch { if ([string]::IsNullOrWhiteSpace($stderr)) { $stderr = 'Die Standardfehlerausgabe konnte nicht gelesen werden: ' + $_.Exception.Message } }
        }
        else { $stderr = 'Der Prozess oder ein nachgelagerter Installer reagierte nicht auf den Abbruchbefehl.' }

        $ausgabeTeile = New-Object 'System.Collections.Generic.List[string]'
        if (-not [string]::IsNullOrWhiteSpace($stdout)) { $ausgabeTeile.Add($stdout.TrimEnd()) | Out-Null }
        if (-not [string]::IsNullOrWhiteSpace($stderr)) { $ausgabeTeile.Add($stderr.TrimEnd()) | Out-Null }
        $bereinigteAusgabe = ConvertTo-BereinigteAusgabe -Text ($ausgabeTeile -join [Environment]::NewLine)

        $abbruchGrund = ''
        if ($leerlaufTimeout -and $nachlaufTimeout) { $abbruchGrund = 'Nachgelagerter Prozess ohne messbaren Fortschritt' }
        elseif ($leerlaufTimeout) { $abbruchGrund = 'Prozess ohne messbaren Fortschritt' }
        elseif ($nachlaufTimeout) { $abbruchGrund = 'Nachgelagerter Prozess ueberschritt das Gesamtzeitlimit' }
        elseif ($absolutesTimeout) { $abbruchGrund = 'Gesamtzeitlimit ueberschritten' }

        if ($downloadErkannt -and $null -eq $downloadEndeSekunden) { $downloadEndeSekunden = $stoppuhr.Elapsed.TotalSeconds }
        $downloadDauerSekunden = if ($downloadErkannt) { [Math]::Max(0, [double]$downloadEndeSekunden - [double]$downloadStartSekunden) } else { 0 }

        return [pscustomobject]@{
            Gestartet = $gestartet; Beendet = (-not $timeout -and $vollstaendigBeendet); Timeout = $timeout
            LeerlaufTimeout = $leerlaufTimeout; NachlaufTimeout = $nachlaufTimeout; AbbruchGrund = $abbruchGrund
            NachlaufProzesse = ($letzteNachlaufNamen -join ', ')
            DownloadErkannt = $downloadErkannt; DownloadDauerSekunden = $downloadDauerSekunden
            DownloadBytes = $downloadGeladenBytes; DownloadGesamtBytes = $downloadGesamtBytes
            DownloadBytesGeschaetzt = $downloadBytesGeschaetzt; DownloadCbsProzent = $downloadCbsProzent; DownloadQuelle = $downloadQuelle
            ExitCode = $(if (-not $timeout -and $rootBeendet) { [int]$prozess.ExitCode } else { 1460 })
            Ausgabe = $bereinigteAusgabe
        }
    }
    finally {
        if ($gestartet -and $null -ne $prozess) {
            try {
                $prozess.Refresh()
                if (-not $prozess.HasExited) {
                    Stop-ProzessbaumSicher -RootProcessId ([int]$prozess.Id)
                    [void]$prozess.WaitForExit(10000)
                }
            }
            catch { Write-Verbose ("Best-effort-Prozessabbruch im Abschlussblock: {0}" -f $_.Exception.Message) }
        }
        Stop-UnabhaengigenProzessAbbruchwaechter -Waechter $abbruchWaechter
        Close-AbbruchgekoppeltesProzessJob -Job $abbruchJob
        if ($null -ne $prozess) { $prozess.Dispose() }
    }
}

function Invoke-Native {
    param(
        [Parameter(Mandatory = $true)][string]$Datei,
        [Parameter(Mandatory = $true)][string[]]$Argumente,
        [Parameter(Mandatory = $true)][string]$Beschreibung,
        [int[]]$ErfolgsCodes = @(0),
        [int[]]$NeustartCodes = @(1641, 3010),
        [ValidateRange(1, 86400)][int]$TimeoutSekunden = 7200,
        [ValidateRange(0, 86400)][int]$LeerlaufTimeoutSekunden = 0,
        [switch]$InstallationsVorgang,
        [switch]$AlleKindprozesseAlsAktivitaet,
        [switch]$WindowsUpdateDownloadUeberwachen,
        [AllowEmptyCollection()][string[]]$AktivitaetsPfade = @(),
        [switch]$FehlerNichtFatal,
        [switch]$FehlerNurResultat,
        [switch]$AusgabeUnterdruecken
    )

    $anzeige = ($Argumente | ForEach-Object {
        if ($_ -match '\s') { '"{0}"' -f $_ } else { $_ }
    }) -join ' '
    Write-Status -Text ("Starte: {0} {1}" -f $Datei, $anzeige) -Stufe 'INFO'

    try {
        $prozessErgebnis = Invoke-ProzessMitTimeout -Datei $Datei -Argumente $Argumente -TimeoutSekunden $TimeoutSekunden -LeerlaufTimeoutSekunden $LeerlaufTimeoutSekunden -InstallationsVorgang:$InstallationsVorgang -AlleKindprozesseAlsAktivitaet:$AlleKindprozesseAlsAktivitaet -WindowsUpdateDownloadUeberwachen:$WindowsUpdateDownloadUeberwachen -AktivitaetsPfade $AktivitaetsPfade -FortschrittsText $Beschreibung
        $code = [int]$prozessErgebnis.ExitCode
        $ausgabeText = [string]$prozessErgebnis.Ausgabe
        $downloadErkannt = [bool](Get-SichereEigenschaft -Objekt $prozessErgebnis -Name 'DownloadErkannt' -Standardwert $false)
        $downloadDauerSekunden = [double](Get-SichereEigenschaft -Objekt $prozessErgebnis -Name 'DownloadDauerSekunden' -Standardwert 0)
        $downloadBytes = [double](Get-SichereEigenschaft -Objekt $prozessErgebnis -Name 'DownloadBytes' -Standardwert 0)
        $downloadGesamtBytes = [double](Get-SichereEigenschaft -Objekt $prozessErgebnis -Name 'DownloadGesamtBytes' -Standardwert 0)
        $downloadBytesGeschaetzt = [bool](Get-SichereEigenschaft -Objekt $prozessErgebnis -Name 'DownloadBytesGeschaetzt' -Standardwert $false)
        $downloadCbsProzent = [int](Get-SichereEigenschaft -Objekt $prozessErgebnis -Name 'DownloadCbsProzent' -Standardwert -1)
        $downloadQuelle = Get-SichererText -Objekt $prozessErgebnis -Name 'DownloadQuelle'

        if ($downloadErkannt) {
            $downloadDauerText = ConvertTo-LesbareDauer -Sekunden $downloadDauerSekunden
            $downloadHinweis = "Windows-Update-Download beobachtet: Dauer $downloadDauerText"
            if ($downloadBytes -gt 0) {
                $downloadHinweis += $(if ($downloadBytesGeschaetzt) { '; ca. empfangen ' } else { '; uebertragen ' }) + (ConvertTo-LesbareBytemenge -Bytes $downloadBytes)
                if ($downloadGesamtBytes -gt 0) {
                    $downloadHinweis += ' von ' + (ConvertTo-LesbareBytemenge -Bytes $downloadGesamtBytes)
                    $downloadProzent = [Math]::Min(100, [Math]::Max(0, [int][Math]::Floor(($downloadBytes / $downloadGesamtBytes) * 100)))
                    $downloadHinweis += (' ({0}%)' -f $downloadProzent)
                }
            }
            if ($downloadCbsProzent -ge 0) { $downloadHinweis += "; CBS-/Windows-Update-Fortschritt $downloadCbsProzent%" }
            if (-not [string]::IsNullOrWhiteSpace($downloadQuelle)) { $downloadHinweis += "; Messquelle: $downloadQuelle" }
            $downloadHinweis += '.'
            Write-Status -Text $downloadHinweis -Stufe 'INFO'
            if ([string]::IsNullOrWhiteSpace($ausgabeText)) { $ausgabeText = $downloadHinweis }
            else { $ausgabeText = $ausgabeText.TrimEnd() + [Environment]::NewLine + $downloadHinweis }
        }

        if (-not $AusgabeUnterdruecken -and -not [string]::IsNullOrWhiteSpace($ausgabeText)) {
            Write-KonsolentextSicher -Text $ausgabeText
            if (-not [string]::IsNullOrWhiteSpace($script:LogDatei)) {
                try { Add-Content -LiteralPath $script:LogDatei -Value $ausgabeText -Encoding UTF8 } catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }
            }
        }

        if ($prozessErgebnis.Timeout) {
            $abbruchGrund = Get-SichererText -Objekt $prozessErgebnis -Name 'AbbruchGrund' -Standardwert 'Zeitlimit ueberschritten'
            $nachlaufProzesse = Get-SichererText -Objekt $prozessErgebnis -Name 'NachlaufProzesse'
            $meldung = if ([bool](Get-SichereEigenschaft -Objekt $prozessErgebnis -Name 'LeerlaufTimeout' -Standardwert $false)) {
                ("{0} wurde beendet, weil fuer {1} kein messbarer Prozess- oder Protokollfortschritt mehr erkannt wurde. Grund: {2}." -f $Beschreibung, (ConvertTo-LesbareDauer -Sekunden $LeerlaufTimeoutSekunden), $abbruchGrund)
            }
            else {
                ("{0} wurde nach dem Gesamtzeitlimit von {1} beendet. Grund: {2}." -f $Beschreibung, (ConvertTo-LesbareDauer -Sekunden $TimeoutSekunden), $abbruchGrund)
            }
            if (-not [string]::IsNullOrWhiteSpace($nachlaufProzesse)) {
                $meldung += " Betroffene nachgelagerte Prozesse: $nachlaufProzesse."
            }
            Add-Resultat -Bereich 'Befehl' -Aktion $Beschreibung -Status 'Zeitueberschreitung oder Leerlauf erkannt' -ExitCode 1460 -Details ($meldung + [Environment]::NewLine + $ausgabeText)
            if ($FehlerNichtFatal -or $FehlerNurResultat) {
                if ($FehlerNichtFatal) { Add-Warnung -Text $meldung }
            }
            else {
                Write-Status -Text $meldung -Stufe 'FEHLER'
            }
            return [pscustomobject]@{ Erfolgreich = $false; ExitCode = 1460; Ausgabe = $ausgabeText; Neustart = $false; Timeout = $true; LeerlaufTimeout = [bool](Get-SichereEigenschaft -Objekt $prozessErgebnis -Name 'LeerlaufTimeout' -Standardwert $false); NachlaufTimeout = [bool](Get-SichereEigenschaft -Objekt $prozessErgebnis -Name 'NachlaufTimeout' -Standardwert $false); AbbruchGrund = $abbruchGrund; DownloadErkannt = $downloadErkannt; DownloadDauerSekunden = $downloadDauerSekunden; DownloadBytes = $downloadBytes; DownloadGesamtBytes = $downloadGesamtBytes; DownloadBytesGeschaetzt = $downloadBytesGeschaetzt; DownloadCbsProzent = $downloadCbsProzent; DownloadQuelle = $downloadQuelle }
        }

        $neustart = $NeustartCodes -contains $code
        $erfolg = ($ErfolgsCodes -contains $code) -or $neustart
        if ($neustart) { Add-OneClickNeustartnachweis -Quelle $Beschreibung -ExitCode $code -Details 'Dokumentierter Neustart-Exitcode des aktuellen nativen Prozesses.' }

        if ($erfolg) {
            $status = if ($neustart) { 'Erfolgreich; Neustart erforderlich' } else { 'Erfolgreich' }
            Add-Resultat -Bereich 'Befehl' -Aktion $Beschreibung -Status $status -ExitCode $code -Details $ausgabeText
            Write-Status -Text ("{0}: erfolgreich (Exitcode {1})." -f $Beschreibung, $code) -Stufe 'OK'
        }
        else {
            Add-Resultat -Bereich 'Befehl' -Aktion $Beschreibung -Status 'Fehlgeschlagen' -ExitCode $code -Details $ausgabeText
            if ($FehlerNurResultat) {
                # Der Aufrufer klassifiziert den Fehler selbst.
            }
            elseif ($FehlerNichtFatal) {
                Add-Warnung -Text ("{0} ist fehlgeschlagen (Exitcode {1})." -f $Beschreibung, $code)
            }
            else {
                Write-Status -Text ("{0} ist fehlgeschlagen (Exitcode {1})." -f $Beschreibung, $code) -Stufe 'FEHLER'
            }
        }

        return [pscustomobject]@{
            Erfolgreich = $erfolg
            ExitCode = $code
            Ausgabe = $ausgabeText
            Neustart = $neustart
            Timeout = $false
            DownloadErkannt = $downloadErkannt
            DownloadDauerSekunden = $downloadDauerSekunden
            DownloadBytes = $downloadBytes
            DownloadGesamtBytes = $downloadGesamtBytes
            DownloadBytesGeschaetzt = $downloadBytesGeschaetzt
            DownloadCbsProzent = $downloadCbsProzent
            DownloadQuelle = $downloadQuelle
        }
    }
    catch {
        $meldung = $_.Exception.Message
        Add-Resultat -Bereich 'Befehl' -Aktion $Beschreibung -Status 'Ausnahme' -ExitCode -1 -Details $meldung
        if ($FehlerNurResultat) {
            # Der Aufrufer klassifiziert die Ausnahme selbst.
        }
        elseif ($FehlerNichtFatal) {
            Add-Warnung -Text ("{0}: {1}" -f $Beschreibung, $meldung)
        }
        else {
            Write-Status -Text ("{0}: {1}" -f $Beschreibung, $meldung) -Stufe 'FEHLER'
        }
        return [pscustomobject]@{
            Erfolgreich = $false
            ExitCode = -1
            Ausgabe = $meldung
            Neustart = $false
            Timeout = $false
            DownloadErkannt = $false
            DownloadDauerSekunden = 0.0
            DownloadBytes = 0.0
            DownloadGesamtBytes = 0.0
            DownloadBytesGeschaetzt = $false
            DownloadCbsProzent = -1
            DownloadQuelle = ''
        }
    }
}

# -----------------------------
# PowerShell-7-Bootstrap
# -----------------------------
function Get-Pwsh7Version {
    param([Parameter(Mandatory = $true)][string]$Pfad)

    if (-not (Test-Path -LiteralPath $Pfad -PathType Leaf)) {
        return $null
    }

    # Auch App-Ausfuehrungsalias-Dateien liegen in einem benutzerschreibbaren
    # Verzeichnis. Ohne gueltige Microsoft-Signatur duerfen sie niemals in den
    # erhoehten Hauptlauf uebernommen werden.
    if (-not (Test-MicrosoftSignatur -Pfad $Pfad) -or
        -not (Test-MicrosoftProgrammIdentitaet -Pfad $Pfad -Programm 'PowerShell')) {
        return $null
    }

    try {
        $ergebnis = Invoke-ProzessMitTimeout -Datei $Pfad -Argumente @('-NoLogo', '-NoProfile', '-NonInteractive', '-Command', '$PSVersionTable.PSVersion.ToString()') -TimeoutSekunden 20
        if ($ergebnis.Timeout -or [int]$ergebnis.ExitCode -ne 0) {
            return $null
        }
        $zeilen = @(([string]$ergebnis.Ausgabe) -split "`r?`n" | Where-Object { -not [string]::IsNullOrWhiteSpace([string]$_) })
        if ($zeilen.Count -eq 0) {
            return $null
        }
        $version = [Version]'0.0'
        if ([Version]::TryParse(([string]$zeilen[-1]).Trim(), [ref]$version) -and $version -ge [Version]'7.4.0') {
            return $version
        }
        return $null
    }
    catch {
        return $null
    }
}

function Test-Pwsh7 {
    param([Parameter(Mandatory = $true)][string]$Pfad)

    return ($null -ne (Get-Pwsh7Version -Pfad $Pfad))
}

function Find-Pwsh7 {
    param([Version]$Mindestversion = [Version]'7.4.0')

    $kandidaten = New-Object 'System.Collections.Generic.List[string]'

    try {
        $befehl = Get-Command 'pwsh.exe' -ErrorAction SilentlyContinue
        if ($null -ne $befehl -and -not [string]::IsNullOrWhiteSpace([string]$befehl.Source)) {
            $kandidaten.Add([string]$befehl.Source) | Out-Null
        }
    }
    catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }

    # Ein Doppelklick auf eine .ps1-Datei kann ueber die 32-Bit-Windows-
    # PowerShell erfolgen. ProgramW6432 zeigt in diesem Fall weiterhin auf den
    # nativen 64-Bit-Programme-Ordner mit der regulaeren PowerShell-7-Installation.
    if (-not [string]::IsNullOrWhiteSpace($env:ProgramW6432)) {
        $kandidaten.Add((Join-Path -Path $env:ProgramW6432 -ChildPath 'PowerShell\7\pwsh.exe')) | Out-Null
    }
    if (-not [string]::IsNullOrWhiteSpace($env:ProgramFiles)) {
        $kandidaten.Add((Join-Path -Path $env:ProgramFiles -ChildPath 'PowerShell\7\pwsh.exe')) | Out-Null
    }
    if (-not [string]::IsNullOrWhiteSpace(${env:ProgramFiles(x86)})) {
        $kandidaten.Add((Join-Path -Path ${env:ProgramFiles(x86)} -ChildPath 'PowerShell\7\pwsh.exe')) | Out-Null
    }
    if (-not [string]::IsNullOrWhiteSpace($env:LOCALAPPDATA)) {
        $kandidaten.Add((Join-Path -Path $env:LOCALAPPDATA -ChildPath 'Microsoft\WindowsApps\pwsh.exe')) | Out-Null
        $kandidaten.Add((Join-Path -Path $env:LOCALAPPDATA -ChildPath 'Programs\PowerShell\7\pwsh.exe')) | Out-Null
    }


    $gueltige = New-Object 'System.Collections.Generic.List[object]'
    foreach ($kandidat in @($kandidaten.ToArray() | Where-Object { -not [string]::IsNullOrWhiteSpace($_) } | Select-Object -Unique)) {
        $version = Get-Pwsh7Version -Pfad $kandidat
        if ($null -ne $version -and $version -ge $Mindestversion) {
            $gueltige.Add([pscustomobject]@{ Pfad = [string]$kandidat; Version = [Version]$version }) | Out-Null
        }
    }
    $neueste = $gueltige.ToArray() | Sort-Object Version -Descending | Select-Object -First 1
    if ($null -eq $neueste) { return $null }
    return [string]$neueste.Pfad
}

function Start-EingebettetePowerShell7Startdatei {
    # Dieser eng begrenzte Startbereich ist die in dieselbe .ps1 integrierte
    # zweite Startdatei: Unter Windows PowerShell sucht und verifiziert er nur
    # den PowerShell-7-Host, fordert UAC an und wartet auf dessen Exitcode. Keine
    # System- oder Programmreparatur darf in diesem Kompatibilitaetshost laufen.
    if ($NurBenutzerProgramme) {
        Write-Status -Text 'Der interne Benutzerteilprozess darf nicht ueber Windows PowerShell gestartet werden.' -Stufe 'FEHLER'
        return 11
    }

    Write-Status -Text 'Eingebettete Startdatei: verifizierte PowerShell 7 wird gesucht.' -Stufe 'SCHRITT'
    $pwsh = Find-Pwsh7 -Mindestversion ([Version]'7.4.0')
    if ([string]::IsNullOrWhiteSpace([string]$pwsh)) {
        Write-Status -Text 'Keine installierte, signierte Microsoft PowerShell 7.4 oder neuer wurde gefunden. Der Reparaturteil wurde nicht gestartet.' -Stufe 'FEHLER'
        return 11
    }

    $version = Get-Pwsh7Version -Pfad $pwsh
    if ($null -eq $version -or [Version]$version -lt [Version]'7.4.0') {
        Write-Status -Text 'Die gefundene PowerShell 7 hat die abschliessende Signatur-, Produkt- oder Versionspruefung nicht bestanden.' -Stufe 'FEHLER'
        return 11
    }

    $argumente = New-Object 'System.Collections.Generic.List[string]'
    foreach ($wert in @('-NoLogo', '-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', $script:SelfPath)) {
        $argumente.Add($wert) | Out-Null
    }
    if ($KeinePause) { $argumente.Add('-KeinePause') | Out-Null }
    if ($AlleMSIReparieren) { $argumente.Add('-AlleMSIReparieren') | Out-Null }
    if ($AlleWinGetReparieren) { $argumente.Add('-AlleWinGetReparieren') | Out-Null }
    if ($FehlerFortsetzen) { $argumente.Add('-FehlerFortsetzen') | Out-Null }
    if ($NeustartSpaeter) { $argumente.Add('-NeustartSpaeter') | Out-Null }
    if ($FortsetzenNachNeustart) {
        $argumente.Add('-FortsetzenNachNeustart') | Out-Null
        $argumente.Add('-FortsetzungsStatusPfad') | Out-Null
        $argumente.Add($FortsetzungsStatusPfad) | Out-Null
    }
    $argumentZeile = (@($argumente.ToArray() | ForEach-Object { ConvertTo-WindowsArgument -Wert ([string]$_) }) -join ' ')

    try {
        Write-Status -Text ("PowerShell {0} wurde verifiziert. Der sichtbare Administratorstart wird angefordert." -f $version) -Stufe 'SCHRITT'
        $prozess = Start-Process -FilePath $pwsh -Verb RunAs -ArgumentList $argumentZeile -WindowStyle Normal -PassThru -Wait -ErrorAction Stop
        return [int]$prozess.ExitCode
    }
    catch {
        Write-Status -Text ('PowerShell-7-Administratorstart fehlgeschlagen oder durch den Benutzer abgebrochen: {0}' -f $_.Exception.Message) -Stufe 'FEHLER'
        return 1223
    }
}

function Wait-Pwsh7Verfuegbar {
    param(
        [ValidateRange(1, 180)][int]$TimeoutSekunden = 60,
        [Version]$Mindestversion = [Version]'7.4.0'
    )

    $stoppuhr = [Diagnostics.Stopwatch]::StartNew()
    do {
        Refresh-PathUmgebung
        $pwsh = Find-Pwsh7 -Mindestversion $Mindestversion
        if (-not [string]::IsNullOrWhiteSpace([string]$pwsh)) {
            return $pwsh
        }

        if ($stoppuhr.Elapsed.TotalSeconds -ge $TimeoutSekunden) {
            break
        }
        Start-Sleep -Seconds 2
    } while ($true)

    return $null
}

function Invoke-BenutzerProgrammeNichtErhoeht {
    param([ValidateSet('Update', 'Reparatur')][string]$Modus = 'Update')

    if (-not (Test-IstAdministrator)) {
        throw 'Der kontrollierte Benutzerteilprozess darf nur vom erhoehten Hauptlauf vorbereitet werden.'
    }

    $ergebnisOrdner = ''
    $pwsh = Find-Pwsh7
    if ([string]::IsNullOrWhiteSpace([string]$pwsh)) {
        throw 'PowerShell 7 ist fuer den kontrollierten Benutzerteilprozess nicht verfuegbar.'
    }

    $lokal = Get-OneClickDokumenteBasis
    $ergebnisOrdner = Join-Path -Path $lokal -ChildPath 'OneClick-ProgrammReparatur-Benutzer-Laufzeit'
    New-Item -ItemType Directory -Path $ergebnisOrdner -Force -ErrorAction Stop | Out-Null
    if (-not (Test-VerzeichnisketteOhneReparsePoint -Basis $lokal -Kandidat $ergebnisOrdner)) {
        throw 'Der Ergebnisordner des Benutzerteilprozesses ist eine unsichere Pfadumleitung.'
    }

    $kennung = [Guid]::NewGuid().ToString('N')
    $ergebnisPfad = Join-Path -Path $ergebnisOrdner -ChildPath ("Benutzerprogramm-Ergebnis-{0}.json" -f $kennung)
    $aufgabenName = 'OneClick-Benutzerprogramme-' + $kennung
    $identitaet = [Security.Principal.WindowsIdentity]::GetCurrent()
    $benutzerName = [string]$identitaet.Name
    if ([string]::IsNullOrWhiteSpace($benutzerName)) {
        throw 'Der interaktive Benutzer fuer den nicht erhoehten Teilprozess konnte nicht ermittelt werden.'
    }

    $argumente = New-Object 'System.Collections.Generic.List[string]'
    foreach ($wert in @('-NoLogo', '-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', $script:SelfPath, '-KeinePause', '-NurBenutzerProgramme', '-BenutzerErgebnisPfad', $ergebnisPfad)) {
        $argumente.Add($wert) | Out-Null
    }
    $argumente.Add('-BenutzerPhasenmodus') | Out-Null
    $argumente.Add($Modus) | Out-Null
    if ($FehlerFortsetzen) { $argumente.Add('-FehlerFortsetzen') | Out-Null }
    if ($AlleWinGetReparieren) { $argumente.Add('-AlleWinGetReparieren') | Out-Null }
    $argumentZeile = (@($argumente.ToArray() | ForEach-Object { ConvertTo-WindowsArgument -Wert $_ }) -join ' ')

    $dienst = $null
    $wurzel = $null
    $registriert = $false
    try {
        $dienst = New-Object -ComObject 'Schedule.Service'
        $dienst.Connect()
        $wurzel = $dienst.GetFolder('\')
        $definition = $dienst.NewTask(0)
        $definition.RegistrationInfo.Description = 'Einmaliger, nicht erhoehter OneClick-Teilprozess fuer user-scope Programme.'
        $definition.Principal.UserId = $benutzerName
        $definition.Principal.LogonType = 3 # TASK_LOGON_INTERACTIVE_TOKEN
        $definition.Principal.RunLevel = 0  # TASK_RUNLEVEL_LUA
        $definition.Settings.Enabled = $true
        $definition.Settings.Hidden = $true
        $definition.Settings.AllowDemandStart = $true
        $definition.Settings.StartWhenAvailable = $false
        $definition.Settings.DisallowStartIfOnBatteries = $false
        $definition.Settings.StopIfGoingOnBatteries = $false
        $definition.Settings.ExecutionTimeLimit = 'PT2H'
        $aktion = $definition.Actions.Create(0)
        $aktion.Path = $pwsh
        $aktion.Arguments = $argumentZeile
        $aktion.WorkingDirectory = Split-Path -Path $script:SelfPath -Parent

        $aufgabe = $wurzel.RegisterTaskDefinition($aufgabenName, $definition, 6, $benutzerName, $null, 3, $null)
        $registriert = $true
        $laufend = $aufgabe.Run($null)
        $stoppuhr = [Diagnostics.Stopwatch]::StartNew()
        $naechsteMeldung = 30
        do {
            Start-Sleep -Seconds 1
            $aufgabe = $wurzel.GetTask($aufgabenName)
            $zustand = [int]$aufgabe.State
            if ($stoppuhr.Elapsed.TotalSeconds -ge $naechsteMeldung) {
                Write-Status -Text ("Nicht erhoehter Benutzerteilprozess laeuft weiter ({0})." -f (ConvertTo-LesbareDauer -Sekunden $stoppuhr.Elapsed.TotalSeconds)) -Stufe 'INFO'
                $naechsteMeldung += 30
            }
            if ($stoppuhr.Elapsed.TotalSeconds -ge 7200) {
                try { $laufend.Stop() } catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }
                throw 'Der nicht erhoehte Benutzerteilprozess hat das Zeitlimit von zwei Stunden ueberschritten.'
            }
        } while ($zustand -in @(2, 4)) # queued oder running

        $aufgabe = $wurzel.GetTask($aufgabenName)
        $taskCode = [int]$aufgabe.LastTaskResult
        if (-not (Test-Path -LiteralPath $ergebnisPfad -PathType Leaf)) {
            throw ("Der Benutzerteilprozess endete mit Taskcode {0}, schrieb aber kein verifizierbares Ergebnis." -f $taskCode)
        }
        $ergebnisInfo = Get-Item -LiteralPath $ergebnisPfad -Force -ErrorAction Stop
        if (($ergebnisInfo.Attributes -band [IO.FileAttributes]::ReparsePoint) -or $ergebnisInfo.Length -le 0 -or $ergebnisInfo.Length -gt 1048576) {
            throw 'Die Ergebnisdatei des Benutzerteilprozesses ist leer, zu gross oder eine Pfadumleitung.'
        }
        $ergebnis = Get-JsonObjektAusText -Text (Get-Content -LiteralPath $ergebnisPfad -Raw -Encoding UTF8 -ErrorAction Stop)
        if ($null -eq $ergebnis) {
            throw 'Die Ergebnisdatei des Benutzerteilprozesses enthaelt kein gueltiges JSON-Objekt.'
        }
        $kindExitCode = [int](Get-SichereEigenschaft -Objekt $ergebnis -Name 'ExitCode' -Standardwert -1)
        $kindAdministrator = [bool](Get-SichereEigenschaft -Objekt $ergebnis -Name 'Administrator' -Standardwert $true)
        if ($kindAdministrator) {
            throw 'Der Benutzerteilprozess lief unerwartet erhoeht; seine Programmaktionen werden nicht als gueltig gewertet.'
        }
        if ($taskCode -ne $kindExitCode) {
            throw ("Task-Rueckgabecode ({0}) und Ergebnis-Rueckgabecode ({1}) des Benutzerteilprozesses stimmen nicht ueberein." -f $taskCode, $kindExitCode)
        }
        return $ergebnis
    }
    finally {
        $bereinigungsProbleme = New-Object 'System.Collections.Generic.List[string]'
        if ($registriert -and $null -ne $wurzel -and $aufgabenName -match '^OneClick-Benutzerprogramme-[0-9a-f]{32}$') {
            try { $wurzel.DeleteTask($aufgabenName, 0) }
            catch { $bereinigungsProbleme.Add(("Einmalige Benutzeraufgabe konnte nicht entfernt werden: {0}" -f $_.Exception.Message)) | Out-Null }
            $restAufgabe = $null
            try { $restAufgabe = $wurzel.GetTask($aufgabenName) } catch { $restAufgabe = $null }
            if ($null -ne $restAufgabe) {
                $bereinigungsProbleme.Add(("Die einmalige Benutzeraufgabe ist nach der Bereinigung noch registriert: {0}" -f $aufgabenName)) | Out-Null
            }
        }
        if (-not [string]::IsNullOrWhiteSpace($ergebnisPfad) -and (Test-Path -LiteralPath $ergebnisPfad)) {
            try {
                $null = Remove-OneClickKontrolliertenLaufpfad -Pfad $ergebnisPfad -Basis $ergebnisOrdner -ErlaubtesNamensmuster '^Benutzerprogramm-Ergebnis-[0-9a-f]{32}\.json$'
            }
            catch { $bereinigungsProbleme.Add(("Benutzerprogramm-Ergebnisdatei konnte nicht verifiziert bereinigt werden: {0}" -f $_.Exception.Message)) | Out-Null }
        }
        if (-not [string]::IsNullOrWhiteSpace($ergebnisOrdner) -and (Test-Path -LiteralPath $ergebnisOrdner -PathType Container)) {
            try {
                $restEintraege = @(Get-ChildItem -LiteralPath $ergebnisOrdner -Force -ErrorAction Stop)
                if ($restEintraege.Count -eq 0) {
                    $dokumente = Get-OneClickDokumenteBasis
                    $erwarteterOrdner = [IO.Path]::GetFullPath((Join-Path $dokumente 'OneClick-ProgrammReparatur-Benutzer-Laufzeit')).TrimEnd([char]92)
                    if (-not [string]::Equals([IO.Path]::GetFullPath($ergebnisOrdner).TrimEnd([char]92), $erwarteterOrdner, [StringComparison]::OrdinalIgnoreCase)) {
                        throw 'Der leere Benutzer-Laufzeitordner entspricht nicht dem erwarteten Dokumente-Pfad.'
                    }
                    $null = Remove-OneClickKontrolliertenLaufpfad -Pfad $ergebnisOrdner -Basis $dokumente -ErlaubtesNamensmuster '^OneClick-ProgrammReparatur-Benutzer-Laufzeit$'
                }
            }
            catch { $bereinigungsProbleme.Add(("Leerer Benutzer-Laufzeitordner konnte nicht verifiziert bereinigt werden: {0}" -f $_.Exception.Message)) | Out-Null }
        }
        if ($bereinigungsProbleme.Count -gt 0) {
            $script:Bereinigungsfehler += $bereinigungsProbleme.Count
            throw ($bereinigungsProbleme -join ' ')
        }
    }
}


function Merge-BenutzerProgrammErgebnis {
    param(
        [Parameter(Mandatory = $true)][object]$Ergebnis,
        [Parameter(Mandatory = $true)][ValidateSet('Update', 'Reparatur')][string]$Phase
    )

    $exitCode = [int](Get-SichereEigenschaft -Objekt $Ergebnis -Name 'ExitCode' -Standardwert -1)
    if ($exitCode -notin @(0, 2, 3010)) {
        throw ("Der nicht erhoehte Benutzerprogramm-{0}lauf ist fehlgeschlagen (Exitcode {1})." -f $Phase, $exitCode)
    }
    if (-not [bool](Get-SichereEigenschaft -Objekt $Ergebnis -Name 'AbschlussbereinigungVerifiziert' -Standardwert $false)) {
        throw ("Der nicht erhoehte Benutzerprogramm-{0}lauf hat seine laufbezogenen Restdaten nicht nachweislich bereinigt." -f $Phase)
    }
    if ($exitCode -eq 3010) { Add-OneClickNeustartnachweis -Quelle ("Benutzerprogramm-{0}lauf" -f $Phase) -ExitCode 3010 -Details 'Der kontrollierte Benutzer-Scope-Teilprozess meldete einen bestaetigten Neustartbedarf.' }
    foreach ($zaehlerName in @(
            'AktualisiertePakete', 'BereitsAktuellePakete', 'UebersprungeneUpdates',
            'FehlgeschlageneUpdates', 'NachkontrollierteUpdates', 'RepariertePakete',
            'FehlgeschlageneReparaturen', 'NachkontrollierteReparaturen',
            'ErfolgreicheNeuinstallationen', 'FehlgeschlageneNeuinstallationen',
            'UnbehobeneProgrammfehler', 'AktuelleReparaturPruefungenWiederverwendet',
            'VorabDownloadsWiederverwendet', 'BereinigteRestdateien',
            'BereinigteRestordner', 'BereinigteRestbytes', 'Bereinigungsfehler')) {
        $wert = if ($zaehlerName -eq 'BereinigteRestbytes') {
            [int64](Get-SichereEigenschaft -Objekt $Ergebnis -Name $zaehlerName -Standardwert 0)
        }
        else {
            [int](Get-SichereEigenschaft -Objekt $Ergebnis -Name $zaehlerName -Standardwert 0)
        }
        Set-Variable -Name $zaehlerName -Scope Script -Value ((Get-Variable -Name $zaehlerName -Scope Script -ValueOnly) + $wert)
    }
    foreach ($warnung in @(Get-SichereEigenschaft -Objekt $Ergebnis -Name 'Warnungen' -Standardwert @())) {
        if (-not [string]::IsNullOrWhiteSpace([string]$warnung)) {
            Add-Warnung -Text ("Benutzerprogramm-{0}lauf: {1}" -f $Phase, [string]$warnung)
        }
    }
    Add-Resultat -Bereich 'Programme' -Aktion ("Nicht erhoehter Benutzerprogramm-{0}lauf" -f $Phase) -Status 'Abgeschlossen und Rueckgabedaten validiert' -ExitCode $exitCode -Details (Get-SichererText -Objekt $Ergebnis -Name 'LogDatei')
    return $exitCode
}

function ConvertFrom-WinGetVersionsausgabe {
    param([AllowNull()][AllowEmptyString()][string]$Text)

    if ([string]::IsNullOrWhiteSpace($Text)) { return $null }
    $muster = '(?im)^\s*(?:Windows\s+Package\s+Manager\s+)?v?(?<Version>[0-9]+\.[0-9]+(?:\.[0-9]+){0,2})(?:[-+][0-9A-Za-z.-]+)?\s*$'
    foreach ($treffer in [regex]::Matches($Text, $muster)) {
        $version = [Version]'0.0'
        if ([Version]::TryParse([string]$treffer.Groups['Version'].Value, [ref]$version)) {
            return $version
        }
    }
    return $null
}

function Get-WinGetVersion {
    param([Parameter(Mandatory = $true)][string]$Pfad)

    if (-not (Test-Path -LiteralPath $Pfad -PathType Leaf)) {
        return $null
    }

    # Ein benutzerschreibbarer App-Ausfuehrungsalias ist kein Vertrauensanker.
    # Jeder auszufuehrende Kandidat muss selbst Microsoft-signiert sein.
    if (-not (Test-MicrosoftSignatur -Pfad $Pfad) -or
        -not (Test-MicrosoftProgrammIdentitaet -Pfad $Pfad -Programm 'WinGet')) {
        return $null
    }

    try {
        $ergebnis = Invoke-ProzessMitTimeout -Datei $Pfad -Argumente @('--version') -TimeoutSekunden 20
        if ($ergebnis.Timeout -or [int]$ergebnis.ExitCode -ne 0) { return $null }
        return (ConvertFrom-WinGetVersionsausgabe -Text ([string]$ergebnis.Ausgabe))
    }
    catch {
        return $null
    }
}

function Test-WinGet {
    param([Parameter(Mandatory = $true)][string]$Pfad)

    return ($null -ne (Get-WinGetVersion -Pfad $Pfad))
}

function Select-NeuesteWinGetKandidat {
    param([AllowEmptyCollection()][object[]]$Kandidaten = @())

    $gueltige = @($Kandidaten | Where-Object {
        $null -ne $_ -and
        -not [string]::IsNullOrWhiteSpace((Get-SichererText -Objekt $_ -Name 'Pfad')) -and
        $null -ne (Get-SichereEigenschaft -Objekt $_ -Name 'Version' -Standardwert $null)
    })
    if ($gueltige.Count -eq 0) { return $null }
    return $gueltige |
        Sort-Object -Property @(
            @{ Expression = { [Version](Get-SichereEigenschaft -Objekt $_ -Name 'Version' -Standardwert ([Version]'0.0')) }; Descending = $true },
            @{ Expression = { [bool](Get-SichereEigenschaft -Objekt $_ -Name 'IstBenutzerAlias' -Standardwert $false) }; Ascending = $true },
            @{ Expression = { Get-SichererText -Objekt $_ -Name 'Pfad' }; Ascending = $true }
        ) |
        Select-Object -First 1
}


function Find-WinGet {
    $kandidaten = New-Object 'System.Collections.Generic.List[string]'

    try {
        $befehl = Get-Command 'winget.exe' -ErrorAction SilentlyContinue
        if ($null -ne $befehl -and -not [string]::IsNullOrWhiteSpace([string]$befehl.Source)) {
            $kandidaten.Add([string]$befehl.Source) | Out-Null
        }
    }
    catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }

    if (-not [string]::IsNullOrWhiteSpace($env:LOCALAPPDATA)) {
        $kandidaten.Add((Join-Path -Path $env:LOCALAPPDATA -ChildPath 'Microsoft\WindowsApps\winget.exe')) | Out-Null
    }

    # Den echten, paketgeschuetzten App-Installer-Pfad bevorzugen. Der Aliasordner
    # unter LOCALAPPDATA ist benutzerschreibbar und wird nur akzeptiert, wenn die
    # Aliasdatei selbst die Signaturpruefung besteht.
    try {
        $appInstallerPakete = New-Object 'System.Collections.Generic.List[object]'
        foreach ($paket in @(Get-AppxPackage -Name 'Microsoft.DesktopAppInstaller' -ErrorAction Stop)) {
            if ($null -ne $paket) { $appInstallerPakete.Add($paket) | Out-Null }
        }
        try {
            foreach ($paket in @(Get-AppxPackage -Name 'Microsoft.DesktopAppInstaller' -AllUsers -ErrorAction Stop)) {
                if ($null -ne $paket) { $appInstallerPakete.Add($paket) | Out-Null }
            }
        }
        catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }

        $gueltigeAppInstallerPakete = @($appInstallerPakete.ToArray() |
            Where-Object {
                -not [string]::IsNullOrWhiteSpace([string]$_.InstallLocation) -and
                ([string]$_.Publisher -match '^CN=Microsoft Corporation(?:,|$)')
            } |
            Sort-Object InstallLocation -Unique |
            Sort-Object Version -Descending)
        foreach ($paket in $gueltigeAppInstallerPakete) {
            $kandidaten.Add((Join-Path -Path ([string]$paket.InstallLocation) -ChildPath 'winget.exe')) | Out-Null
        }
    }
    catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }

    # Falls der App-Ausfuehrungsalias deaktiviert ist, wird auch der echte,
    # Microsoft-signierte Paketpfad geprueft. Zugriffsfehler werden ignoriert.
    $programmOrdnerKandidaten = @(
        @($env:ProgramW6432, $env:ProgramFiles, ${env:ProgramFiles(x86)}) |
            Where-Object { -not [string]::IsNullOrWhiteSpace([string]$_) } |
            Select-Object -Unique
    )
    foreach ($programmOrdner in $programmOrdnerKandidaten) {
        $windowsApps = Join-Path -Path $programmOrdner -ChildPath 'WindowsApps'
        try {
            $paketOrdner = @(Get-ChildItem -LiteralPath $windowsApps -Directory -Filter 'Microsoft.DesktopAppInstaller_*' -ErrorAction SilentlyContinue |
                Sort-Object LastWriteTimeUtc -Descending)
            foreach ($ordner in $paketOrdner) {
                $kandidaten.Add((Join-Path -Path $ordner.FullName -ChildPath 'winget.exe')) | Out-Null
            }
        }
        catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }
    }

    $gueltigeKandidaten = New-Object 'System.Collections.Generic.List[object]'
    $benutzerAliasPfad = if (-not [string]::IsNullOrWhiteSpace($env:LOCALAPPDATA)) {
        Join-Path -Path $env:LOCALAPPDATA -ChildPath 'Microsoft\WindowsApps\winget.exe'
    }
    else { '' }
    foreach ($kandidat in @($kandidaten.ToArray() | Where-Object { -not [string]::IsNullOrWhiteSpace([string]$_) } | Select-Object -Unique)) {
        $kandidatPfad = [string]$kandidat
        $version = Get-WinGetVersion -Pfad $kandidatPfad
        if ($null -ne $version) {
            $gueltigeKandidaten.Add([pscustomobject]@{
                Pfad = $kandidatPfad
                Version = [Version]$version
                IstBenutzerAlias = (-not [string]::IsNullOrWhiteSpace($benutzerAliasPfad) -and
                    [string]::Equals($kandidatPfad, $benutzerAliasPfad, [StringComparison]::OrdinalIgnoreCase))
            }) | Out-Null
        }
    }
    $auswahl = Select-NeuesteWinGetKandidat -Kandidaten @($gueltigeKandidaten.ToArray())
    if ($null -eq $auswahl) { return $null }
    Write-Verbose ("Neuester verifizierter WinGet-Kandidat: Version {0}; Pfad {1}" -f $auswahl.Version, $auswahl.Pfad)
    return [string]$auswahl.Pfad
}


function Wait-WinGetVerfuegbar {
    param([ValidateRange(1, 120)][int]$TimeoutSekunden = 30)

    $stoppuhr = [Diagnostics.Stopwatch]::StartNew()
    do {
        Refresh-PathUmgebung
        $winget = Find-WinGet
        if (-not [string]::IsNullOrWhiteSpace([string]$winget)) {
            $stoppuhr.Stop()
            return $winget
        }
        Start-Sleep -Seconds 2
    } while ($stoppuhr.Elapsed.TotalSeconds -lt $TimeoutSekunden)

    $stoppuhr.Stop()
    return $null
}

function Test-DownloadAdresse {
    param([Parameter(Mandatory = $true)][string]$Adresse)

    try {
        $uri = [Uri]$Adresse
        if ($uri.Scheme -ne 'https' -or -not $uri.IsDefaultPort -or -not [string]::IsNullOrWhiteSpace($uri.UserInfo)) {
            return $false
        }
        $hostName = $uri.Host.ToLowerInvariant()
        return @(
            'github.com',
            'objects.githubusercontent.com',
            'github-releases.githubusercontent.com',
            'release-assets.githubusercontent.com'
        ) -contains $hostName
    }
    catch {
        return $false
    }
}

function Get-OffiziellePowerShellReleaseInformation {
    $apiAdresse = 'https://api.github.com/repos/PowerShell/PowerShell/releases/latest'
    $header = @{
        'User-Agent' = 'OneClick-Komplettreparatur-Release/1.0.0'
        'Accept' = 'application/vnd.github+json'
    }
    $release = Invoke-RestMethod -Uri $apiAdresse -Headers $header -Method Get -TimeoutSec 120 -MaximumRedirection 5 -ErrorAction Stop
    $istEntwurf = [bool](Get-SichereEigenschaft -Objekt $release -Name 'draft' -Standardwert $false)
    $istVorab = [bool](Get-SichereEigenschaft -Objekt $release -Name 'prerelease' -Standardwert $false)
    $tag = Get-SichererText -Objekt $release -Name 'tag_name'
    if ($null -eq $release -or $istEntwurf -or $istVorab -or $tag -notmatch '^v(?<Version>7\.[0-9]+\.[0-9]+)$') {
        throw 'Die neueste offizielle stabile PowerShell-7-Version konnte nicht eindeutig ermittelt werden.'
    }
    $version = [Version]'0.0'
    if (-not [Version]::TryParse([string]$Matches['Version'], [ref]$version)) {
        throw "Die offizielle PowerShell-Releaseversion ist ungueltig: $tag"
    }
    $assets = @(Get-SichereEigenschaft -Objekt $release -Name 'assets' -Standardwert @())
    if ($assets.Count -eq 0) {
        throw 'Die neueste offizielle PowerShell-Release enthaelt keine Installationsdateien.'
    }
    return [pscustomobject]@{
        Release = $release
        Version = $version
        Header = $header
    }
}

function Test-MicrosoftSignatur {
    param([Parameter(Mandatory = $true)][string]$Pfad)

    try {
        $signatur = Get-AuthenticodeSignature -LiteralPath $Pfad -ErrorAction Stop
        if ($signatur.Status -ne [System.Management.Automation.SignatureStatus]::Valid) {
            return $false
        }
        if ($null -eq $signatur.SignerCertificate) {
            return $false
        }
        return ([string]$signatur.SignerCertificate.Subject -match 'Microsoft Corporation')
    }
    catch {
        return $false
    }
}

function Get-OffiziellePowerShellAssetPruefsumme {
    param(
        [Parameter(Mandatory = $true)][object]$Asset,
        [Parameter(Mandatory = $true)][object[]]$Assets,
        [Parameter(Mandatory = $true)][string]$AssetName,
        [Parameter(Mandatory = $true)][hashtable]$Header,
        [Parameter(Mandatory = $true)][string]$Arbeitsordner
    )

    # Neuere GitHub-Antworten enthalten die Pruefsumme direkt am Asset.
    $digest = Get-SichererText -Objekt $Asset -Name 'digest'
    if ($digest -match '^sha256:([0-9a-fA-F]{64})$') {
        return $Matches[1].ToUpperInvariant()
    }

    # Die Asset-Eigenschaft "digest" ist nicht auf allen GitHub-/Proxy-
    # Konstellationen garantiert. In diesem Fall wird die zur gleichen
    # offiziellen Release gehoerende Datei hashes.sha256 verwendet.
    $hashAsset = $Assets |
        Where-Object { (Get-SichererText -Objekt $_ -Name 'name') -eq 'hashes.sha256' } |
        Select-Object -First 1
    if ($null -eq $hashAsset) {
        throw 'Die offizielle PowerShell-Release enthaelt weder eine Asset-Pruefsumme noch hashes.sha256.'
    }

    $hashAdresse = Get-SichererText -Objekt $hashAsset -Name 'browser_download_url'
    if (-not (Test-DownloadAdresse -Adresse $hashAdresse)) {
        throw "Die Adresse der offiziellen PowerShell-Pruefsummendatei ist nicht erlaubt: $hashAdresse"
    }

    $hashPfad = Join-Path -Path $Arbeitsordner -ChildPath 'hashes.sha256'
    Invoke-WebRequest -Uri $hashAdresse -Headers $Header -OutFile $hashPfad -UseBasicParsing -TimeoutSec 120 -MaximumRedirection 10 -ErrorAction Stop

    foreach ($rohZeile in @(Get-Content -LiteralPath $hashPfad -Encoding UTF8 -ErrorAction Stop)) {
        $zeile = ([string]$rohZeile).Trim()
        if ([string]::IsNullOrWhiteSpace($zeile)) { continue }

        $hash = ''
        $dateiname = ''
        if ($zeile -match '^(?<Hash>[0-9A-Fa-f]{64})\s+\*?(?<Name>.+?)\s*$') {
            $hash = [string]$Matches['Hash']
            $dateiname = [string]$Matches['Name']
        }
        elseif ($zeile -match '^(?<Name>.+?)\s*[:=]\s*(?<Hash>[0-9A-Fa-f]{64})\s*$') {
            $hash = [string]$Matches['Hash']
            $dateiname = [string]$Matches['Name']
        }

        if (-not [string]::IsNullOrWhiteSpace($hash) -and
            [string]::Equals([IO.Path]::GetFileName($dateiname.Trim()), $AssetName, [StringComparison]::OrdinalIgnoreCase)) {
            return $hash.ToUpperInvariant()
        }
    }

    throw "Die offizielle Pruefsummendatei enthaelt keinen eindeutigen SHA-256-Eintrag fuer $AssetName."
}

function Install-PowerShell7Direkt {
    param([AllowNull()][object]$ReleaseInformation = $null)

    Write-Status -Text 'PowerShell 7 wird aus dem offiziellen PowerShell-GitHub-Repository bezogen.' -Stufe 'SCHRITT'

    if ($null -eq $ReleaseInformation) {
        $ReleaseInformation = Get-OffiziellePowerShellReleaseInformation
    }
    $release = Get-SichereEigenschaft -Objekt $ReleaseInformation -Name 'Release' -Standardwert $null
    $header = Get-SichereEigenschaft -Objekt $ReleaseInformation -Name 'Header' -Standardwert $null
    if ($null -eq $release -or $header -isnot [System.Collections.IDictionary]) {
        throw 'Die verifizierten PowerShell-Releaseinformationen sind unvollstaendig.'
    }

    $arch = Get-Systemarchitektur
    $msiMuster = '^PowerShell-[0-9]+\.[0-9]+\.[0-9]+-win-' + [regex]::Escape($arch) + '\.msi$'
    $zipMuster = '^PowerShell-[0-9]+\.[0-9]+\.[0-9]+-win-' + [regex]::Escape($arch) + '\.zip$'

    $assets = @(Get-SichereEigenschaft -Objekt $release -Name 'assets' -Standardwert @())
    $asset = $assets | Where-Object { (Get-SichererText -Objekt $_ -Name 'name') -match $msiMuster } | Select-Object -First 1
    $istZip = $false
    if ($null -eq $asset) {
        $asset = $assets | Where-Object { (Get-SichererText -Objekt $_ -Name 'name') -match $zipMuster } | Select-Object -First 1
        $istZip = $true
    }
    if ($null -eq $asset) {
        throw "Kein passendes offizielles PowerShell-7-Paket fuer $arch gefunden."
    }

    $assetName = Get-SichererText -Objekt $asset -Name 'name'
    $downloadAdresse = Get-SichererText -Objekt $asset -Name 'browser_download_url'
    $assetDateiname = if ([string]::IsNullOrWhiteSpace($assetName)) { '' } else { [IO.Path]::GetFileName($assetName) }
    if ([string]::IsNullOrWhiteSpace($assetName) -or $assetDateiname -ne $assetName -or
        $assetName.IndexOfAny([IO.Path]::GetInvalidFileNameChars()) -ge 0 -or
        -not (Test-DownloadAdresse -Adresse $downloadAdresse)) {
        throw "Nicht erlaubte oder unvollstaendige Downloadinformation: $downloadAdresse"
    }

    $arbeitsordner = Join-Path -Path ([IO.Path]::GetTempPath()) -ChildPath ('OneClick-PS7-' + [Guid]::NewGuid().ToString('N'))
    New-Item -ItemType Directory -Path $arbeitsordner -Force | Out-Null
    $paketPfad = Join-Path -Path $arbeitsordner -ChildPath $assetName

    try {
        Invoke-WebRequest -Uri $downloadAdresse -Headers $header -OutFile $paketPfad -UseBasicParsing -TimeoutSec 900 -MaximumRedirection 10 -ErrorAction Stop

        $erwartet = Get-OffiziellePowerShellAssetPruefsumme -Asset $asset -Assets $assets -AssetName $assetName -Header $header -Arbeitsordner $arbeitsordner
        $tatsaechlich = (Get-FileHash -LiteralPath $paketPfad -Algorithm SHA256 -ErrorAction Stop).Hash.ToUpperInvariant()
        if ($tatsaechlich -ne $erwartet) {
            throw 'Die SHA-256-Pruefsumme des PowerShell-Pakets stimmt nicht.'
        }
        Write-Status -Text 'SHA-256-Pruefsumme des PowerShell-Pakets ist gueltig.' -Stufe 'OK'

        if (-not $istZip) {
            if (-not (Test-MicrosoftSignatur -Pfad $paketPfad)) {
                throw 'Das PowerShell-MSI besitzt keine gueltige Microsoft-Signatur.'
            }
            Write-Status -Text 'Microsoft-Signatur des PowerShell-MSI ist gueltig.' -Stufe 'OK'

            $powerShellMsiLog = Join-Path -Path $arbeitsordner -ChildPath 'PowerShell-7-Installation.log'
            $msiArgumente = @(
                '/i', $paketPfad,
                '/qn',
                '/norestart',
                '/l*v', $powerShellMsiLog,
                'ADD_PATH=1',
                'USE_MU=1',
                'ENABLE_MU=1',
                'REGISTER_MANIFEST=1'
            )
            $msiexec = Get-WindowsSystemdateiPfad -Dateiname 'msiexec.exe'
            if ([string]::IsNullOrWhiteSpace($msiexec)) {
                throw "Der vertrauenswuerdige Windows-Installer wurde nicht gefunden: $msiexec"
            }
            $ergebnis = Invoke-Native -Datei $msiexec -Argumente $msiArgumente -Beschreibung 'PowerShell 7 installieren' -TimeoutSekunden 1800 -LeerlaufTimeoutSekunden 600 -InstallationsVorgang -AktivitaetsPfade @($powerShellMsiLog) -ErfolgsCodes @(0) -NeustartCodes @(1641, 3010)
            if (-not $ergebnis.Erfolgreich) {
                throw "PowerShell-7-Installation ist fehlgeschlagen (Exitcode $($ergebnis.ExitCode))."
            }
        }
        else {
            $entpackt = Join-Path -Path $arbeitsordner -ChildPath 'entpackt'
            Expand-Archive -LiteralPath $paketPfad -DestinationPath $entpackt -Force
            $pwshQuelle = Join-Path -Path $entpackt -ChildPath 'pwsh.exe'
            if (-not (Test-Path -LiteralPath $pwshQuelle -PathType Leaf)) {
                throw 'Das offizielle ZIP-Paket enthaelt keine pwsh.exe.'
            }
            if (-not (Test-MicrosoftSignatur -Pfad $pwshQuelle)) {
                throw 'Die pwsh.exe aus dem ZIP-Paket besitzt keine gueltige Microsoft-Signatur.'
            }

            $nativerProgrammeOrdner = if (-not [string]::IsNullOrWhiteSpace($env:ProgramW6432)) { $env:ProgramW6432 } else { $env:ProgramFiles }
            if ([string]::IsNullOrWhiteSpace($nativerProgrammeOrdner)) { throw 'Der native Windows-Programmeordner konnte nicht ermittelt werden.' }
            $zielBasis = Join-Path -Path $nativerProgrammeOrdner -ChildPath 'PowerShell'
            $ziel = Join-Path -Path $zielBasis -ChildPath '7'
            $sicherung = $null
            New-Item -ItemType Directory -Path $zielBasis -Force -ErrorAction Stop | Out-Null
            try {
                if (Test-Path -LiteralPath $ziel) {
                    $sicherung = $ziel + '.defekt-' + (Get-Date -Format 'yyyyMMdd-HHmmssfff')
                    Move-Item -LiteralPath $ziel -Destination $sicherung -Force -ErrorAction Stop
                }
                New-Item -ItemType Directory -Path $ziel -Force -ErrorAction Stop | Out-Null
                Copy-Item -Path (Join-Path -Path $entpackt -ChildPath '*') -Destination $ziel -Recurse -Force -ErrorAction Stop
                $installiertePwsh = Join-Path -Path $ziel -ChildPath 'pwsh.exe'
                if (-not (Test-Pwsh7 -Pfad $installiertePwsh)) {
                    throw 'Die aus dem ZIP-Paket installierte pwsh.exe bestand die Signatur- und Versionpruefung nicht.'
                }

                $maschinenPfad = [Environment]::GetEnvironmentVariable('Path', 'Machine')
                $teile = @($maschinenPfad -split ';' | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
                if ($teile -notcontains $ziel) {
                    [Environment]::SetEnvironmentVariable('Path', (($teile + $ziel) -join ';'), 'Machine')
                }
                if (-not [string]::IsNullOrWhiteSpace([string]$sicherung) -and (Test-Path -LiteralPath $sicherung)) {
                    Remove-Item -LiteralPath $sicherung -Recurse -Force -ErrorAction Stop
                    $sicherung = $null
                }
                Write-Status -Text 'PowerShell 7 wurde aus dem offiziellen ZIP-Paket installiert.' -Stufe 'OK'
            }
            catch {
                try { if (Test-Path -LiteralPath $ziel) { Remove-Item -LiteralPath $ziel -Recurse -Force -ErrorAction SilentlyContinue } } catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }
                if (-not [string]::IsNullOrWhiteSpace([string]$sicherung) -and (Test-Path -LiteralPath $sicherung)) {
                    try { Move-Item -LiteralPath $sicherung -Destination $ziel -Force -ErrorAction Stop } catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }
                }
                throw
            }
        }
    }
    finally {
        $tempBasis = [IO.Path]::GetFullPath([IO.Path]::GetTempPath()).TrimEnd([char]92)
        $null = Remove-OneClickKontrolliertenLaufpfad -Pfad $arbeitsordner -Basis $tempBasis -ErlaubtesNamensmuster '^OneClick-PS7-[0-9a-f]{32}$'
    }
}

function New-OneClickNeustartAusnahme {
    param([Parameter(Mandatory = $true)][string]$Meldung)

    $script:BootstrapExitCode = 3010
    $ausnahme = [System.InvalidOperationException]::new($Meldung)
    $ausnahme.Data['OneClickExitCode'] = 3010
    return $ausnahme
}

function Install-PowerShell7 {
    Write-Status -Text 'PowerShell 7 wurde nicht gefunden. Installation wird vorbereitet.' -Stufe 'SCHRITT'

    $winget = Find-WinGet
    if (-not [string]::IsNullOrWhiteSpace([string]$winget) -and (Test-WinGetQuelle -WinGet $winget -Name 'winget')) {
        Write-Status -Text 'PowerShell 7 wird zuerst ueber die verifizierte offizielle WinGet-Quelle installiert.' -Stufe 'INFO'
        $argumente = @(
            'install', '--id', 'Microsoft.PowerShell', '--exact',
            '--source', 'winget', '--silent',
            '--accept-source-agreements', '--accept-package-agreements',
            '--disable-interactivity'
        )
        $ergebnis = Invoke-Native -Datei $winget -Argumente $argumente -Beschreibung 'PowerShell 7 ueber WinGet installieren' -TimeoutSekunden 1800 -LeerlaufTimeoutSekunden 600 -InstallationsVorgang -ErfolgsCodes @(0) -NeustartCodes @(1641, 3010) -FehlerNichtFatal

        $pwsh = Wait-Pwsh7Verfuegbar -TimeoutSekunden 60
        if (-not [string]::IsNullOrWhiteSpace([string]$pwsh)) {
            return $pwsh
        }

        if ($ergebnis.Erfolgreich -and $ergebnis.Neustart) {
            throw (New-OneClickNeustartAusnahme -Meldung 'PowerShell 7 wurde erfolgreich installiert. Windows muss neu gestartet werden, bevor das Reparaturprogramm mit PowerShell 7 fortgesetzt werden kann.')
        }

        if ($ergebnis.Erfolgreich) {
            Add-Warnung -Text 'WinGet meldete die PowerShell-7-Installation als erfolgreich, PowerShell 7 war nach 1,00 Minute jedoch noch nicht auffindbar. Der verifizierte Direktinstallationsweg wird einmalig versucht.'
        }
    }

    Install-PowerShell7Direkt
    $pwsh = Wait-Pwsh7Verfuegbar -TimeoutSekunden 60
    if ([string]::IsNullOrWhiteSpace([string]$pwsh)) {
        if ($script:NeustartErforderlich) {
            throw (New-OneClickNeustartAusnahme -Meldung 'PowerShell 7 wurde erfolgreich installiert. Windows muss neu gestartet werden, bevor das Reparaturprogramm mit PowerShell 7 fortgesetzt werden kann.')
        }
        throw 'PowerShell 7 wurde installiert, konnte innerhalb von 1,00 Minute danach aber nicht gestartet werden.'
    }
    return $pwsh
}

function Ensure-NeuestePowerShell7 {
    if (-not (Test-IstAdministrator)) {
        throw 'Die Aktualitaetspruefung von PowerShell 7 erfordert Administratorrechte.'
    }

    Write-Status -Text 'Neueste stabile PowerShell-7-Version wird ueber das offizielle Microsoft-Repository ermittelt.' -Stufe 'SCHRITT'
    $releaseInformation = Get-OffiziellePowerShellReleaseInformation
    $neuesteVersion = [Version](Get-SichereEigenschaft -Objekt $releaseInformation -Name 'Version' -Standardwert ([Version]'0.0'))
    if ($neuesteVersion.Major -ne 7 -or $neuesteVersion -lt [Version]'7.4.0') {
        throw "Die ermittelte offizielle PowerShell-7-Version ist nicht plausibel: $neuesteVersion"
    }

    $hostPfad = Get-AktuellerHostPfad
    $hostVersion = Get-Pwsh7Version -Pfad $hostPfad
    if ($null -eq $hostVersion) {
        throw 'Der laufende PowerShell-7-Host hat die Microsoft-Signatur-, Produkt- oder Versionspruefung nicht bestanden.'
    }
    if ([Version]$hostVersion -ge $neuesteVersion) {
        Write-Status -Text ("PowerShell 7 ist aktuell und verifiziert: {0} (offiziell neueste stabile Version: {1})." -f $hostVersion, $neuesteVersion) -Stufe 'OK'
        Add-Resultat -Bereich 'PowerShell 7' -Aktion 'Aktualitaetspruefung' -Status 'Neueste stabile Version aktiv' -ExitCode 0 -Details ("Host: {0}; Pfad: {1}" -f $hostVersion, $hostPfad)
        return [pscustomobject]@{ Aktualisiert = $false; Pfad = $hostPfad; Version = [Version]$hostVersion; NeuesteVersion = $neuesteVersion }
    }

    Write-Status -Text ("PowerShell 7 wird vor allen Reparaturen von {0} auf die neueste stabile Version {1} aktualisiert." -f $hostVersion, $neuesteVersion) -Stufe 'SCHRITT'
    Install-PowerShell7Direkt -ReleaseInformation $releaseInformation
    $neuerPfad = Wait-Pwsh7Verfuegbar -TimeoutSekunden 120 -Mindestversion $neuesteVersion
    if ([string]::IsNullOrWhiteSpace([string]$neuerPfad)) {
        if ($script:NeustartErforderlich) {
            throw (New-OneClickNeustartAusnahme -Meldung ("PowerShell {0} wurde installiert, kann aber erst nach einem Windows-Neustart verwendet werden." -f $neuesteVersion))
        }
        throw ("PowerShell {0} wurde installiert, ein entsprechend neuer signierter Host war danach jedoch nicht verfuegbar." -f $neuesteVersion)
    }
    $installierteVersion = Get-Pwsh7Version -Pfad $neuerPfad
    if ($null -eq $installierteVersion -or [Version]$installierteVersion -lt $neuesteVersion) {
        throw ("Der aktualisierte PowerShell-7-Host bestand die Nachkontrolle nicht. Erwartet: mindestens {0}; erkannt: {1}." -f $neuesteVersion, $installierteVersion)
    }
    Write-Status -Text ("PowerShell {0} wurde installiert und vollstaendig nachkontrolliert. Der Reparaturlauf wird mit diesem Host neu gestartet." -f $installierteVersion) -Stufe 'OK'
    Add-Resultat -Bereich 'PowerShell 7' -Aktion 'Aktualisierung und Nachkontrolle' -Status 'Erfolgreich; Neustart des Reparaturlaufs erforderlich' -ExitCode 0 -Details $neuerPfad
    return [pscustomobject]@{ Aktualisiert = $true; Pfad = $neuerPfad; Version = [Version]$installierteVersion; NeuesteVersion = $neuesteVersion }
}

function Start-SelbstMitAktuellerPowerShell7 {
    param([Parameter(Mandatory = $true)][string]$Pwsh)

    if (-not (Test-IstAdministrator)) {
        throw 'Der Neustart mit der aktualisierten PowerShell darf nur aus dem administrativen Hauptlauf erfolgen.'
    }
    $version = Get-Pwsh7Version -Pfad $Pwsh
    if ($null -eq $version) {
        throw 'Der fuer den Neustart vorgesehene PowerShell-7-Host ist nicht verifiziert.'
    }
    $argumente = New-Object 'System.Collections.Generic.List[string]'
    foreach ($wert in @('-NoLogo', '-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', $script:SelfPath)) {
        $argumente.Add($wert) | Out-Null
    }
    if ($KeinePause) { $argumente.Add('-KeinePause') | Out-Null }
    if ($AlleMSIReparieren) { $argumente.Add('-AlleMSIReparieren') | Out-Null }
    if ($AlleWinGetReparieren) { $argumente.Add('-AlleWinGetReparieren') | Out-Null }
    if ($FehlerFortsetzen) { $argumente.Add('-FehlerFortsetzen') | Out-Null }
    if ($NeustartSpaeter) { $argumente.Add('-NeustartSpaeter') | Out-Null }
    if ($FortsetzenNachNeustart) {
        $argumente.Add('-FortsetzenNachNeustart') | Out-Null
        $argumente.Add('-FortsetzungsStatusPfad') | Out-Null
        $argumente.Add($FortsetzungsStatusPfad) | Out-Null
    }

    Write-Status -Text ("Hauptlauf wird mit der verifizierten PowerShell-Version {0} neu gestartet." -f $version) -Stufe 'SCHRITT'
    [string[]]$startArgumente = $argumente.ToArray()
    & $Pwsh @startArgumente
    if ($null -eq $LASTEXITCODE) { return 1 }
    return [int]$LASTEXITCODE
}

# -----------------------------
# WinGet-Bereitstellung
# -----------------------------
function Invoke-PowerShell7Code {
    param(
        [Parameter(Mandatory = $true)][string]$Code,
        [Parameter(Mandatory = $true)][string]$Beschreibung,
        [ValidateRange(1, 1800)][int]$TimeoutSekunden = 600,
        [switch]$AusgabeUnterdruecken
    )

    $wrapper = @"
`$ErrorActionPreference = 'Stop'
`$ProgressPreference = 'SilentlyContinue'
`$InformationPreference = 'SilentlyContinue'
`$VerbosePreference = 'SilentlyContinue'
`$DebugPreference = 'SilentlyContinue'
try {
$Code
    exit 0
}
catch {
    [Console]::Error.WriteLine((`$_ | Out-String).Trim())
    exit 1
}
"@
    $encoded = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($wrapper))
    $argumente = @(
        '-NoLogo', '-NoProfile', '-NonInteractive',
        '-InputFormat', 'Text', '-OutputFormat', 'Text',
        '-ExecutionPolicy', 'Bypass', '-EncodedCommand', $encoded
    )
    $pwsh = Get-AktuellerHostPfad
    Write-Status -Text ("Starte isolierten PowerShell-7-Schritt: {0}" -f $Beschreibung) -Stufe 'INFO'

    try {
        $prozessErgebnis = Invoke-ProzessMitTimeout -Datei $pwsh -Argumente $argumente -TimeoutSekunden $TimeoutSekunden -FortschrittsText $Beschreibung
        $codeWert = [int]$prozessErgebnis.ExitCode
        $text = ConvertTo-BereinigteAusgabe -Text ([string]$prozessErgebnis.Ausgabe)
        $erfolg = (-not $prozessErgebnis.Timeout -and $codeWert -eq 0)

        if (-not $AusgabeUnterdruecken -and -not [string]::IsNullOrWhiteSpace($text)) {
            Write-KonsolentextSicher -Text $text
        }
        if (-not [string]::IsNullOrWhiteSpace($script:LogDatei) -and -not [string]::IsNullOrWhiteSpace($text)) {
            try { Add-Content -LiteralPath $script:LogDatei -Value $text -Encoding UTF8 } catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }
        }

        $status = if ($prozessErgebnis.Timeout) { 'Zeitueberschreitung' } elseif ($erfolg) { 'Erfolgreich' } else { 'Fehlgeschlagen' }
        Add-Resultat -Bereich 'PowerShell 7' -Aktion $Beschreibung -Status $status -ExitCode $codeWert -Details $text

        if ($erfolg) {
            Write-Status -Text ("{0}: erfolgreich." -f $Beschreibung) -Stufe 'OK'
        }
        elseif ($prozessErgebnis.Timeout) {
            Add-Warnung -Text ("{0} wurde nach {1} beendet. Der Hauptlauf wird fortgesetzt." -f $Beschreibung, (ConvertTo-LesbareDauer -Sekunden $TimeoutSekunden))
        }
        else {
            Add-Warnung -Text ("{0} ist fehlgeschlagen (Exitcode {1})." -f $Beschreibung, $codeWert)
        }

        return [pscustomobject]@{
            Erfolgreich = $erfolg
            ExitCode = $codeWert
            Ausgabe = $text
            Timeout = [bool]$prozessErgebnis.Timeout
        }
    }
    catch {
        $meldung = $_.Exception.Message
        Add-Resultat -Bereich 'PowerShell 7' -Aktion $Beschreibung -Status 'Ausnahme' -ExitCode -1 -Details $meldung
        Add-Warnung -Text ("{0}: {1}" -f $Beschreibung, $meldung)
        return [pscustomobject]@{ Erfolgreich = $false; ExitCode = -1; Ausgabe = $meldung; Timeout = $false }
    }
}

function Repair-WinGetMitMicrosoftModul {
    Write-Status -Text 'WinGet wird mit dem offiziellen Microsoft.WinGet.Client-Modul repariert.' -Stufe 'SCHRITT'

    $code = @'
[Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$modulName = 'Microsoft.WinGet.Client'

function Invoke-WinGetRepairLokal {
    Remove-Module $modulName -Force -ErrorAction SilentlyContinue
    $modul = Get-Module -ListAvailable -Name $modulName | Sort-Object Version -Descending | Select-Object -First 1
    if ($null -eq $modul) {
        throw "$modulName wurde nicht gefunden."
    }
    Import-Module $modul.Path -Force -ErrorAction Stop
    $reparatur = Get-Command Repair-WinGetPackageManager -ErrorAction Stop
    & $reparatur -Force -Latest -ErrorAction Stop | Out-Null
}

try {
    Invoke-WinGetRepairLokal
    [Console]::Out.WriteLine('WINGET_REPAIR_OK_LOCAL')
    exit 0
}
catch {
    [Console]::Error.WriteLine(('Lokale WinGet-Reparatur nicht moeglich: ' + $_.Exception.Message))
}

$psResourceModul = Get-Module -ListAvailable -Name Microsoft.PowerShell.PSResourceGet |
    Sort-Object Version -Descending | Select-Object -First 1
if ($null -eq $psResourceModul) {
    throw 'Microsoft.PowerShell.PSResourceGet ist nicht vorhanden. Die alte PackageManagement-/NuGet-Methode wird absichtlich nicht verwendet.'
}

Import-Module $psResourceModul.Path -Force -ErrorAction Stop
$repository = Get-PSResourceRepository -Name PSGallery -ErrorAction SilentlyContinue
if ($null -eq $repository) {
    Register-PSResourceRepository -PSGallery -ErrorAction Stop
    $repository = Get-PSResourceRepository -Name PSGallery -ErrorAction Stop
}

$repositoryUri = [string]$repository.Uri
if ([string]::IsNullOrWhiteSpace($repositoryUri)) {
    $repositoryUri = [string]$repository.SourceLocation
}
if ([string]::IsNullOrWhiteSpace($repositoryUri)) {
    throw 'Die Adresse der registrierten PSGallery konnte nicht verifiziert werden.'
}
$uri = [Uri]$repositoryUri
if ($uri.Scheme -ne 'https' -or -not $uri.IsDefaultPort -or
    -not [string]::IsNullOrWhiteSpace($uri.UserInfo) -or
    -not [string]::IsNullOrWhiteSpace($uri.Query) -or
    -not [string]::IsNullOrWhiteSpace($uri.Fragment) -or
    $uri.Host.ToLowerInvariant() -notin @('www.powershellgallery.com', 'powershellgallery.com') -or
    $uri.AbsolutePath.TrimEnd('/') -ne '/api/v2') {
    throw "PSGallery verweist nicht auf die offizielle PowerShell Gallery: $repositoryUri"
}

$parameter = @{
    Name = $modulName
    Repository = 'PSGallery'
    Scope = 'CurrentUser'
    TrustRepository = $true
    Quiet = $true
    AcceptLicense = $true
    AuthenticodeCheck = $true
    ErrorAction = 'Stop'
}
if (Get-Module -ListAvailable -Name $modulName) {
    $parameter['Reinstall'] = $true
}

Install-PSResource @parameter
Invoke-WinGetRepairLokal
[Console]::Out.WriteLine('WINGET_REPAIR_OK')
'@

    $ergebnis = Invoke-PowerShell7Code -Code $code -Beschreibung 'Microsoft.WinGet.Client mit PSResourceGet bereitstellen und WinGet reparieren' -TimeoutSekunden 300 -AusgabeUnterdruecken
    if (-not $ergebnis.Erfolgreich) {
        return $false
    }

    $winget = Wait-WinGetVerfuegbar -TimeoutSekunden 30
    return (-not [string]::IsNullOrWhiteSpace([string]$winget))
}

function Install-OderRepariereWinGet {
    Write-Status -Text 'WinGet wird mit der offiziellen Microsoft-Reparaturmethode bereitgestellt.' -Stufe 'SCHRITT'

    try {
        if (Repair-WinGetMitMicrosoftModul) {
            Write-Status -Text 'WinGet wurde erfolgreich bereitgestellt oder repariert.' -Stufe 'OK'
            return $true
        }
    }
    catch {
        Add-Warnung -Text ("WinGet-Reparatur konnte nicht abgeschlossen werden: {0}" -f $_.Exception.Message)
    }
    return $false
}

function Ensure-WinGet {
    $winget = Find-WinGet
    if (-not [string]::IsNullOrWhiteSpace([string]$winget)) {
        $wingetVersion = Get-WinGetVersion -Pfad $winget
        Write-Status -Text ("Neueste verifizierte WinGet-Version gefunden und ausgewaehlt: {0} ({1})." -f $wingetVersion, $winget) -Stufe 'OK'
        return $winget
    }

    $null = Install-OderRepariereWinGet
    $winget = Wait-WinGetVerfuegbar -TimeoutSekunden 30
    if ([string]::IsNullOrWhiteSpace([string]$winget)) {
        Add-Warnung -Text 'WinGet ist weiterhin nicht verfuegbar. Programm-Updates und WinGet-Reparaturen werden ausgelassen; DISM, SFC, CHKDSK und die Registry-Inventarisierung laufen trotzdem weiter.'
        return $null
    }

    $wingetVersion = Get-WinGetVersion -Pfad $winget
    Write-Status -Text ("WinGet ist jetzt verfuegbar und verifiziert: {0} ({1})." -f $wingetVersion, $winget) -Stufe 'OK'
    return $winget
}

function Test-WinGetQuelle {
    param(
        [Parameter(Mandatory = $true)][string]$WinGet,
        [Parameter(Mandatory = $true)][ValidateSet('winget', 'msstore')][string]$Name
    )

    $ergebnis = Invoke-Native -Datei $WinGet -Argumente @('source', 'export', $Name, '--disable-interactivity') -Beschreibung ("WinGet-Quelle $Name pruefen") -TimeoutSekunden 60 -FehlerNurResultat -AusgabeUnterdruecken
    if (-not $ergebnis.Erfolgreich -or [string]::IsNullOrWhiteSpace([string]$ergebnis.Ausgabe)) {
        return $false
    }

    try {
        $daten = Get-JsonObjektAusText -Text ([string]$ergebnis.Ausgabe)
        if ($null -eq $daten) {
            return $false
        }

        $quellenName = Get-SichererText -Objekt $daten -Name 'Name'
        $arg = Get-SichererText -Objekt $daten -Name 'Arg'
        if ([string]::IsNullOrWhiteSpace($arg)) {
            $arg = Get-SichererText -Objekt $daten -Name 'Argument'
        }
        if ($quellenName -ne $Name -or [string]::IsNullOrWhiteSpace($arg)) {
            return $false
        }

        $vertrauen = @((Get-SichereEigenschaft -Objekt $daten -Name 'TrustLevel' -Standardwert @()) | ForEach-Object { [string]$_ })
        $vertrauensText = ($vertrauen -join '|')
        if ([string]::IsNullOrWhiteSpace($vertrauensText) -or $vertrauensText -notmatch '(?i)(^|\|)Trusted(\||$)') {
            return $false
        }

        $uri = [Uri]$arg
        if ($uri.Scheme -ne 'https' -or -not $uri.IsDefaultPort -or -not [string]::IsNullOrWhiteSpace($uri.UserInfo) -or -not [string]::IsNullOrWhiteSpace($uri.Query) -or -not [string]::IsNullOrWhiteSpace($uri.Fragment)) {
            return $false
        }

        if ($Name -eq 'winget') {
            return ($uri.Host.ToLowerInvariant() -eq 'cdn.winget.microsoft.com' -and $uri.AbsolutePath.TrimEnd('/') -eq '/cache')
        }
        return ($uri.Host.ToLowerInvariant() -eq 'storeedgefd.dsx.mp.microsoft.com' -and $uri.AbsolutePath.TrimEnd('/') -eq '/v9.0')
    }
    catch {
        return $false
    }
}

function Repair-WinGetQuellen {
    param([Parameter(Mandatory = $true)][string]$WinGet)

    Write-Status -Text 'WinGet-Standardquellen werden getrennt verifiziert.' -Stufe 'SCHRITT'
    $wingetGueltig = Test-WinGetQuelle -WinGet $WinGet -Name 'winget'
    $storeGueltig = Test-WinGetQuelle -WinGet $WinGet -Name 'msstore'

    $ungueltigeQuellen = New-Object 'System.Collections.Generic.List[string]'
    if (-not $wingetGueltig) { $ungueltigeQuellen.Add('winget') | Out-Null }
    if (-not $storeGueltig) { $ungueltigeQuellen.Add('msstore') | Out-Null }

    if ($ungueltigeQuellen.Count -gt 0) {
        Add-Warnung -Text 'Mindestens eine WinGet-Standardquelle fehlt oder besitzt eine unerwartete Adresse. Nur die betroffene offizielle Standardquelle wird zurueckgesetzt; benutzerdefinierte Quellen bleiben erhalten.'
        foreach ($quellenName in $ungueltigeQuellen.ToArray()) {
            $reset = Invoke-Native -Datei $WinGet -Argumente @('source', 'reset', '--name', $quellenName, '--force', '--disable-interactivity') -Beschreibung ("WinGet-Standardquelle {0} zuruecksetzen" -f $quellenName) -TimeoutSekunden 180 -FehlerNurResultat -AusgabeUnterdruecken
            if (-not $reset.Erfolgreich) {
                Add-Warnung -Text ("Die WinGet-Standardquelle '{0}' konnte nicht sicher wiederhergestellt werden." -f $quellenName)
            }
        }

        $wingetGueltig = Test-WinGetQuelle -WinGet $WinGet -Name 'winget'
        $storeGueltig = Test-WinGetQuelle -WinGet $WinGet -Name 'msstore'
    }

    foreach ($quelleInfo in @(
        [pscustomobject]@{ Name = 'winget'; Gueltig = [bool]$wingetGueltig },
        [pscustomobject]@{ Name = 'msstore'; Gueltig = [bool]$storeGueltig }
    )) {
        $quellenName = Get-SichererText -Objekt $quelleInfo -Name 'Name'
        $istGueltig = [bool](Get-SichereEigenschaft -Objekt $quelleInfo -Name 'Gueltig' -Standardwert $false)
        if (-not $istGueltig) {
            Add-Warnung -Text ("Die offizielle WinGet-Quelle '{0}' ist nicht verifiziert und wird fuer diesen Lauf ausgelassen." -f $quellenName)
            Add-Resultat -Bereich 'Programme' -Aktion ("WinGet-Quelle {0}" -f $quellenName) -Status 'Nicht verifiziert; ausgelassen' -ExitCode 0
            continue
        }

        # Nur die verifizierte offizielle Quelle aktualisieren. Benutzerdefinierte Quellen werden nicht kontaktiert.
        $update = Invoke-Native -Datei $WinGet -Argumente @('source', 'update', '--name', $quellenName, '--disable-interactivity') -Beschreibung ("WinGet-Quelle {0} aktualisieren" -f $quellenName) -TimeoutSekunden 300 -FehlerNurResultat -AusgabeUnterdruecken
        if (-not $update.Erfolgreich) {
            Add-Warnung -Text ("Die verifizierte WinGet-Quelle '{0}' konnte nicht aktualisiert werden. Der Lauf verwendet deren vorhandene lokale Quelldaten." -f $quellenName)
        }
    }

    return [pscustomobject]@{
        Winget = [bool]$wingetGueltig
        MsStore = [bool]$storeGueltig
        MindestensEine = [bool]($wingetGueltig -or $storeGueltig)
    }
}

# -----------------------------
# Inventar und Reparaturfunktionen
# -----------------------------
function Get-PaketPruefstatusSchluessel {
    param(
        [Parameter(Mandatory = $true)][string]$Id,
        [Parameter(Mandatory = $true)][ValidateSet('winget', 'msstore')][string]$Quelle,
        [Parameter(Mandatory = $true)][ValidateSet('user', 'machine')][string]$Scope
    )

    return ('{0}|{1}|{2}' -f $Quelle.ToLowerInvariant(), $Scope.ToLowerInvariant(), $Id.ToLowerInvariant())
}

function Initialize-PaketPruefstatus {
    if ([string]::IsNullOrWhiteSpace([string]$script:LogOrdner) -or
        -not (Test-Path -LiteralPath $script:LogOrdner -PathType Container)) {
        throw 'Der Paket-Pruefstatus kann ohne sicheren Laufzeitordner nicht initialisiert werden.'
    }

    $script:PaketPruefstatus = @{}
    $script:PaketPruefstatusDatei = Join-Path -Path $script:LogOrdner -ChildPath 'Paket-Pruefstatus-v1.json'
    if (-not (Test-Path -LiteralPath $script:PaketPruefstatusDatei -PathType Leaf)) { return }

    try {
        $datei = Get-Item -LiteralPath $script:PaketPruefstatusDatei -Force -ErrorAction Stop
        if (($datei.Attributes -band [IO.FileAttributes]::ReparsePoint) -or $datei.Length -gt 4194304) {
            throw 'Die Statusdatei ist eine Pfadumleitung oder unerwartet gross.'
        }
        $daten = Get-Content -LiteralPath $datei.FullName -Raw -Encoding UTF8 -ErrorAction Stop | ConvertFrom-Json -ErrorAction Stop
        if ([int](Get-SichereEigenschaft -Objekt $daten -Name 'Schema' -Standardwert 0) -ne 1) {
            throw 'Die Statusdatei besitzt kein unterstuetztes Schema.'
        }
        foreach ($eintrag in @(Get-SichereEigenschaft -Objekt $daten -Name 'Eintraege' -Standardwert @())) {
            $id = Get-SichererText -Objekt $eintrag -Name 'Id'
            $quelle = Get-SichererText -Objekt $eintrag -Name 'Quelle'
            $scope = Get-SichererText -Objekt $eintrag -Name 'Scope'
            if ($quelle -notin @('winget', 'msstore') -or $scope -notin @('user', 'machine')) { continue }
            if (-not (Test-SichereWinGetPaketIdFuerQuelle -Id $id -Quelle $quelle)) { continue }
            $schluessel = Get-PaketPruefstatusSchluessel -Id $id -Quelle $quelle -Scope $scope
            $script:PaketPruefstatus[$schluessel] = $eintrag
        }
    }
    catch {
        # Ein unlesbarer oder manipulierter Status darf nie zu einer Auslassung
        # fuehren. Er wird ignoriert und durch echte neue Nachkontrollen ersetzt.
        $script:PaketPruefstatus = @{}
        Write-Status -Text ("Vorhandener Paket-Pruefstatus wird sicher ignoriert und neu aufgebaut: {0}" -f $_.Exception.Message) -Stufe 'INFO'
    }
}

function Save-PaketPruefstatus {
    if ([string]::IsNullOrWhiteSpace([string]$script:PaketPruefstatusDatei) -or
        [string]::IsNullOrWhiteSpace([string]$script:LogOrdner)) {
        throw 'Der Paket-Pruefstatus wurde nicht initialisiert.'
    }
    if (-not (Test-VerzeichnisketteOhneReparsePoint -Basis $script:LogOrdner -Kandidat $script:PaketPruefstatusDatei)) {
        throw 'Der Pfad fuer den Paket-Pruefstatus ist nicht sicher.'
    }

    $tempPfad = Join-Path -Path $script:LogOrdner -ChildPath ('Paket-Pruefstatus-' + [Guid]::NewGuid().ToString('N') + '.tmp')
    try {
        [pscustomobject]@{
            Schema = 1
            PruefprofilVersion = [int]$script:PaketPruefprofilVersion
            Gespeichert = (Get-Date).ToUniversalTime().ToString('o')
            Eintraege = @($script:PaketPruefstatus.Values | Sort-Object Quelle, Scope, Id)
        } | ConvertTo-Json -Depth 7 | Set-Content -LiteralPath $tempPfad -Encoding UTF8 -ErrorAction Stop
        $tempInfo = Get-Item -LiteralPath $tempPfad -Force -ErrorAction Stop
        if (($tempInfo.Attributes -band [IO.FileAttributes]::ReparsePoint) -or $tempInfo.Length -le 0 -or $tempInfo.Length -gt 4194304) {
            throw 'Die neu erstellte Paket-Statusdatei ist ungueltig.'
        }
        Move-Item -LiteralPath $tempPfad -Destination $script:PaketPruefstatusDatei -Force -ErrorAction Stop
    }
    finally {
        if (Test-Path -LiteralPath $tempPfad -PathType Leaf) {
            Remove-Item -LiteralPath $tempPfad -Force -ErrorAction SilentlyContinue
        }
    }
}

function Test-PaketPruefstatusAktuell {
    param(
        [Parameter(Mandatory = $true)][string]$Id,
        [Parameter(Mandatory = $true)][ValidateSet('winget', 'msstore')][string]$Quelle,
        [Parameter(Mandatory = $true)][ValidateSet('user', 'machine')][string]$Scope,
        [AllowEmptyCollection()][string[]]$Versionen = @()
    )

    if ($AlleWinGetReparieren) { return $false }
    $schluessel = Get-PaketPruefstatusSchluessel -Id $Id -Quelle $Quelle -Scope $Scope
    if (-not $script:PaketPruefstatus.ContainsKey($schluessel)) { return $false }
    $eintrag = $script:PaketPruefstatus[$schluessel]
    if ([int](Get-SichereEigenschaft -Objekt $eintrag -Name 'PruefprofilVersion' -Standardwert 0) -ne [int]$script:PaketPruefprofilVersion) { return $false }

    $gespeicherteVersionen = @((Get-SichereEigenschaft -Objekt $eintrag -Name 'Versionen' -Standardwert @()) | ForEach-Object { ([string]$_).Trim() } | Where-Object { -not [string]::IsNullOrWhiteSpace($_) } | Sort-Object -Unique)
    $aktuelleVersionen = @($Versionen | ForEach-Object { ([string]$_).Trim() } | Where-Object { -not [string]::IsNullOrWhiteSpace($_) } | Sort-Object -Unique)
    if ($aktuelleVersionen.Count -eq 0 -or ($gespeicherteVersionen -join '|') -ne ($aktuelleVersionen -join '|')) { return $false }

    $zeitText = Get-SichererText -Objekt $eintrag -Name 'ZeitUtc'
    $zeit = [DateTimeOffset]::MinValue
    if (-not [DateTimeOffset]::TryParse($zeitText, [Globalization.CultureInfo]::InvariantCulture, [Globalization.DateTimeStyles]::RoundtripKind, [ref]$zeit)) { return $false }
    $alter = [DateTimeOffset]::UtcNow - $zeit.ToUniversalTime()
    # Der Pruefstatus ist kein zeitbasiertes Sieben-Tage-Archiv mehr. Er wird
    # ausschliesslich innerhalb eines noch nicht vollstaendig erfolgreichen
    # Gesamtlaufs bzw. dessen Wiederaufnahme verwendet und danach geloescht.
    return ($alter.TotalSeconds -ge 0)
}

function Set-PaketPruefstatusErfolgreich {
    param(
        [Parameter(Mandatory = $true)][string]$Id,
        [Parameter(Mandatory = $true)][ValidateSet('winget', 'msstore')][string]$Quelle,
        [Parameter(Mandatory = $true)][ValidateSet('user', 'machine')][string]$Scope,
        [AllowEmptyCollection()][string[]]$Versionen = @(),
        [Parameter(Mandatory = $true)][ValidateSet('Reparatur', 'Neuinstallation')][string]$Methode
    )

    $normalisierteVersionen = @($Versionen | ForEach-Object { ([string]$_).Trim() } | Where-Object { -not [string]::IsNullOrWhiteSpace($_) } | Sort-Object -Unique)
    if ($normalisierteVersionen.Count -eq 0) {
        throw ("Ein erfolgreicher Paket-Pruefstatus fuer '{0}' kann ohne installierte Version nicht gespeichert werden." -f $Id)
    }
    $schluessel = Get-PaketPruefstatusSchluessel -Id $Id -Quelle $Quelle -Scope $Scope
    $script:PaketPruefstatus[$schluessel] = [pscustomobject]@{
        Id = $Id
        Quelle = $Quelle
        Scope = $Scope
        Versionen = $normalisierteVersionen
        ZeitUtc = [DateTimeOffset]::UtcNow.ToString('o')
        PruefprofilVersion = [int]$script:PaketPruefprofilVersion
        Methode = $Methode
    }
    Save-PaketPruefstatus
}

function Get-OneClickDokumenteBasis {
    $dokumente = [Environment]::GetFolderPath([Environment+SpecialFolder]::MyDocuments)
    if ([string]::IsNullOrWhiteSpace([string]$dokumente) -or -not (Test-Path -LiteralPath $dokumente -PathType Container)) {
        throw 'Der Windows-Dokumenteordner des aktuellen Benutzers ist nicht verfuegbar.'
    }
    $vollPfad = [IO.Path]::GetFullPath($dokumente).TrimEnd([char]92)
    $info = Get-Item -LiteralPath $vollPfad -Force -ErrorAction Stop
    if ($info.Attributes -band [IO.FileAttributes]::ReparsePoint) {
        throw 'Der Windows-Dokumenteordner ist eine unerwartete Pfadumleitung.'
    }
    return $vollPfad
}

function Initialize-Protokollierung {
    param([switch]$BenutzerKontext)

    $basis = Get-OneClickDokumenteBasis

    $script:LogOrdner = Join-Path -Path $basis -ChildPath $(if ($BenutzerKontext) { 'OneClick-ProgrammReparatur-Benutzer-Laufzeit' } else { 'OneClick-ProgrammReparatur-Laufzeit' })
    New-Item -ItemType Directory -Path $script:LogOrdner -Force -ErrorAction Stop | Out-Null
    if (-not (Test-VerzeichnisketteOhneReparsePoint -Basis $basis -Kandidat $script:LogOrdner)) {
        throw 'Der zentrale Laufzeitordner oder seine Verzeichniskette ist nicht sicher.'
    }
    $berichteBasis = Join-Path -Path $basis -ChildPath 'OneClick-Reparaturberichte'
    New-Item -ItemType Directory -Path $berichteBasis -Force -ErrorAction Stop | Out-Null
    if (-not (Test-VerzeichnisketteOhneReparsePoint -Basis $basis -Kandidat $berichteBasis)) {
        throw 'Der OneClick-Berichtsordner oder seine Verzeichniskette ist nicht sicher.'
    }
    $script:BerichtOrdner = Join-Path -Path $berichteBasis -ChildPath $(if ($BenutzerKontext) { 'Benutzerlauf' } else { 'Hauptlauf' })
    New-Item -ItemType Directory -Path $script:BerichtOrdner -Force -ErrorAction Stop | Out-Null
    if (-not (Test-VerzeichnisketteOhneReparsePoint -Basis $basis -Kandidat $script:BerichtOrdner)) {
        throw 'Der getrennte Berichtsordner oder seine Verzeichniskette ist nicht sicher.'
    }
    # Sicherheitsquarantaene ist absichtlich kein Laufzeitrest. Sie bleibt
    # getrennt von Downloads, Logs und Temporaerdaten erhalten, damit dieselbe
    # fehlerhafte Manifestversion im naechsten Lauf nicht erneut ausgefuehrt wird.
    $script:WinGetQuarantaeneOrdner = Join-Path -Path $basis -ChildPath 'OneClick-ProgrammReparatur-Quarantaene'
    New-Item -ItemType Directory -Path $script:WinGetQuarantaeneOrdner -Force -ErrorAction Stop | Out-Null
    if (-not (Test-VerzeichnisketteOhneReparsePoint -Basis $basis -Kandidat $script:WinGetQuarantaeneOrdner)) {
        throw 'Der getrennte WinGet-Quarantaeneordner oder seine Verzeichniskette ist nicht sicher.'
    }
    $script:WinGetQuarantaeneDatei = Join-Path -Path $script:WinGetQuarantaeneOrdner -ChildPath $(if ($BenutzerKontext) { 'Benutzerlauf-WinGet-Update-Quarantaene.json' } else { 'Hauptlauf-WinGet-Update-Quarantaene.json' })
    Initialize-PaketPruefstatus

    $laufKennung = ('{0}-{1}' -f (Get-Date -Format 'yyyyMMdd-HHmmss'), [Guid]::NewGuid().ToString('N').Substring(0, 12))
    $script:LogDatei = Join-Path -Path $script:LogOrdner -ChildPath ("Reparatur-$laufKennung.log")
    New-Item -ItemType File -Path $script:LogDatei -ErrorAction Stop | Out-Null
    $logDateiInfo = Get-Item -LiteralPath $script:LogDatei -Force -ErrorAction Stop
    if ($logDateiInfo.Attributes -band [IO.FileAttributes]::ReparsePoint) {
        throw 'Die neu erstellte Protokolldatei ist unerwartet eine Pfadumleitung.'
    }

    $script:InstallationsOrdner = Join-Path -Path $script:LogOrdner -ChildPath ("Installationsdateien-$laufKennung")
    New-Item -ItemType Directory -Path $script:InstallationsOrdner -ErrorAction Stop | Out-Null
    if (-not (Test-VerzeichnisketteOhneReparsePoint -Basis $script:LogOrdner -Kandidat $script:InstallationsOrdner)) {
        throw 'Der neu erstellte Installationsordner oder seine Verzeichniskette ist nicht sicher.'
    }

    try {
        Start-Transcript -Path (Join-Path -Path $script:LogOrdner -ChildPath ("Transcript-$laufKennung.txt")) -Force | Out-Null
        $script:TranscriptGestartet = $true
    }
    catch {
        Write-Status -Text ('Transcript konnte nicht gestartet werden: {0}' -f $_.Exception.Message) -Stufe 'WARNUNG'
    }
}

function Get-SichererGanzzahlwert {
    param(
        [AllowNull()][object]$Objekt,
        [Parameter(Mandatory = $true)][string]$Name,
        [int]$Standardwert = 0
    )

    $wert = Get-SichereEigenschaft -Objekt $Objekt -Name $Name -Standardwert $Standardwert
    try {
        return [Convert]::ToInt32($wert, [Globalization.CultureInfo]::InvariantCulture)
    }
    catch {
        return $Standardwert
    }
}

function Test-RegistryWahr {
    param([AllowNull()][object]$Wert)

    if ($null -eq $Wert) { return $false }
    $text = ([string]$Wert).Trim()
    if ($text -match '^(?i:true|yes|ja)$') { return $true }

    $zahl = 0
    if ([int]::TryParse($text, [ref]$zahl)) {
        return ($zahl -ne 0)
    }
    return $false
}

function ConvertTo-RegistryProgramm {
    param(
        [AllowNull()][object]$Eintrag,
        [string]$RegistryPfad = ''
    )

    $name = Get-SichererText -Objekt $Eintrag -Name 'DisplayName'
    if ([string]::IsNullOrWhiteSpace($name)) {
        return $null
    }

    $registrySchluessel = ''
    try { $registrySchluessel = Split-Path -Path $RegistryPfad -Leaf } catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }
    $windowsInstaller = Get-SichererGanzzahlwert -Objekt $Eintrag -Name 'WindowsInstaller' -Standardwert 0
    $productCode = ''
    $registryProductCode = ''
    if ($registrySchluessel -match '^\{[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}\}$') {
        $registryProductCode = $registrySchluessel.ToUpperInvariant()
    }

    # Ein GUID-foermiger Uninstall-Schluessel ist allein kein MSI-Nachweis:
    # Auch Burn-Bundles und herstellerspezifische Bootstrapper verwenden GUIDs.
    # Deshalb wird der Schluesselcode nur bei gesetztem WindowsInstaller-Marker
    # oder bei einem eindeutig registrierten msiexec-Aufruf uebernommen.
    $befehlsProductCode = ''
    foreach ($wertName in @('UninstallString', 'QuietUninstallString', 'ModifyPath')) {
        $msiText = Get-SichererText -Objekt $Eintrag -Name $wertName
        if ($msiText -match '(?i)(^|[\\/])msiexec(?:\.exe)?(?:\s|$)' -and
            $msiText -match '(?i)(?<code>\{[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}\})') {
            $befehlsProductCode = ([string]$Matches['code']).ToUpperInvariant()
            break
        }
    }
    if ($windowsInstaller -ne 0 -and -not [string]::IsNullOrWhiteSpace($registryProductCode)) {
        # Bei widerspruechlichen Registry- und Befehlsangaben wird bewusst kein
        # Produktcode fuer eine automatische Reparatur freigegeben.
        if ([string]::IsNullOrWhiteSpace($befehlsProductCode) -or $befehlsProductCode -eq $registryProductCode) {
            $productCode = $registryProductCode
        }
    }
    elseif (-not [string]::IsNullOrWhiteSpace($befehlsProductCode)) {
        $productCode = $befehlsProductCode
    }
    $scope = if ($RegistryPfad -match '(?i)(HKEY_CURRENT_USER|HKCU:)') { 'user' } else { 'machine' }
    $architektur = if ($RegistryPfad -match '(?i)WOW6432Node') { 'x86' } else { 'native' }

    return [pscustomobject]@{
        DisplayName          = $name.Trim()
        DisplayVersion       = Get-SichererText -Objekt $Eintrag -Name 'DisplayVersion'
        Publisher            = Get-SichererText -Objekt $Eintrag -Name 'Publisher'
        InstallLocation      = Get-SichererText -Objekt $Eintrag -Name 'InstallLocation'
        InstallSource        = Get-SichererText -Objekt $Eintrag -Name 'InstallSource'
        DisplayIcon          = Get-SichererText -Objekt $Eintrag -Name 'DisplayIcon'
        ModifyPath           = Get-SichererText -Objekt $Eintrag -Name 'ModifyPath'
        UninstallString      = Get-SichererText -Objekt $Eintrag -Name 'UninstallString'
        QuietUninstallString = Get-SichererText -Objekt $Eintrag -Name 'QuietUninstallString'
        InstallDate          = Get-SichererText -Objekt $Eintrag -Name 'InstallDate'
        EstimatedSize        = Get-SichererGanzzahlwert -Objekt $Eintrag -Name 'EstimatedSize' -Standardwert 0
        WindowsInstaller     = $windowsInstaller
        ProductCode          = $productCode
        Scope                = $scope
        Architektur          = $architektur
        SystemComponent      = Get-SichererGanzzahlwert -Objekt $Eintrag -Name 'SystemComponent' -Standardwert 0
        NoRepair             = Get-SichererGanzzahlwert -Objekt $Eintrag -Name 'NoRepair' -Standardwert 0
        ReleaseType          = Get-SichererText -Objekt $Eintrag -Name 'ReleaseType'
        ParentKeyName        = Get-SichererText -Objekt $Eintrag -Name 'ParentKeyName'
        RegistryPfad         = $RegistryPfad
    }
}

function Get-RegistryProgramme {
    param([switch]$MitMetadaten)

    $basispfade = @(
        'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall',
        'HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall',
        'HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall'
    )

    $programme = New-Object 'System.Collections.Generic.List[object]'
    $lesefehler = 0

    foreach ($basis in $basispfade) {
        if (-not (Test-Path -LiteralPath $basis)) {
            continue
        }

        $schluessel = @()
        try {
            $schluessel = @(Get-ChildItem -LiteralPath $basis -ErrorAction Stop)
        }
        catch {
            $lesefehler++
            continue
        }

        foreach ($eintragSchluessel in $schluessel) {
            try {
                $psPfad = Get-SichererText -Objekt $eintragSchluessel -Name 'PSPath'
                $registryName = Get-SichererText -Objekt $eintragSchluessel -Name 'Name'
                if ([string]::IsNullOrWhiteSpace($psPfad)) {
                    $lesefehler++
                    continue
                }

                $roh = Get-ItemProperty -LiteralPath $psPfad -ErrorAction Stop
                $programm = ConvertTo-RegistryProgramm -Eintrag $roh -RegistryPfad $registryName
                if ($null -ne $programm) {
                    $programme.Add($programm) | Out-Null
                }
            }
            catch {
                $lesefehler++
            }
        }
    }

    $sortiert = @($programme.ToArray() | Sort-Object RegistryPfad -Unique)
    if ($MitMetadaten) {
        return [pscustomobject]@{
            Programme  = $sortiert
            Lesefehler = $lesefehler
        }
    }

    return $sortiert
}

function Export-RegistryInventar {
    Write-Status -Text 'Alle registrierten installierten Programme werden aus der Registry inventarisiert.' -Stufe 'SCHRITT'

    $registryErgebnis = Get-RegistryProgramme -MitMetadaten
    $sortiert = @($registryErgebnis.Programme)
    $lesefehler = [int]$registryErgebnis.Lesefehler

    $ziel = Join-Path -Path $script:LogOrdner -ChildPath ('Installierte-Programme-' + (Get-Date -Format 'yyyyMMdd-HHmmss') + '.csv')
    if ($sortiert.Count -gt 0) {
        $sortiert | Export-Csv -LiteralPath $ziel -NoTypeInformation -Encoding UTF8
    }
    else {
        '"DisplayName","DisplayVersion","Publisher","InstallLocation","InstallSource","DisplayIcon","ModifyPath","UninstallString","QuietUninstallString","InstallDate","EstimatedSize","WindowsInstaller","ProductCode","Scope","Architektur","SystemComponent","NoRepair","ReleaseType","ParentKeyName","RegistryPfad"' | Set-Content -LiteralPath $ziel -Encoding UTF8
    }

    $details = '{0} registrierte Programme inventarisiert; {1} nicht lesbare Registry-Eintraege.' -f $sortiert.Count, $lesefehler
    Add-Resultat -Bereich 'Inventar' -Aktion 'Registry-Inventar' -Status 'Erfolgreich' -ExitCode 0 -Details $details
    if ($lesefehler -gt 0) {
        Add-Warnung -Text ("{0} einzelne Registry-Eintraege konnten nicht gelesen werden; das restliche Inventar wurde trotzdem gespeichert." -f $lesefehler)
    }
    Write-Status -Text ("Registry-Inventar gespeichert: {0}" -f $ziel) -Stufe 'OK'
    return $ziel
}

function Export-WinGetInventar {
    param(
        [Parameter(Mandatory = $true)][string]$WinGet,
        [Parameter(Mandatory = $true)][ValidateSet('winget', 'msstore')][string]$Quelle
    )

    Write-Status -Text ("WinGet-Inventar fuer die verifizierte Quelle '{0}' wird exportiert." -f $Quelle) -Stufe 'SCHRITT'
    $ziel = Join-Path -Path $script:LogOrdner -ChildPath ('WinGet-Inventar-' + $Quelle + '-' + (Get-Date -Format 'yyyyMMdd-HHmmss') + '.json')
    $argumente = @(
        'export', '--output', $ziel, '--source', $Quelle,
        '--accept-source-agreements', '--disable-interactivity'
    )
    $ergebnis = Invoke-Native -Datei $WinGet -Argumente $argumente -Beschreibung ("WinGet-Inventar aus {0} exportieren" -f $Quelle) -TimeoutSekunden 300 -FehlerNichtFatal

    if ($ergebnis.Erfolgreich -and (Test-Path -LiteralPath $ziel -PathType Leaf)) {
        try {
            $daten = Get-Content -LiteralPath $ziel -Raw -Encoding UTF8 | ConvertFrom-Json -ErrorAction Stop
            $quellen = @(Get-SichereEigenschaft -Objekt $daten -Name 'Sources' -Standardwert @())
            $fremdeQuelle = $false
            foreach ($eintrag in $quellen) {
                $details = Get-SichereEigenschaft -Objekt $eintrag -Name 'SourceDetails' -Standardwert $null
                $name = Get-SichererText -Objekt $details -Name 'Name'
                if (-not [string]::IsNullOrWhiteSpace($name) -and $name -ne $Quelle) {
                    $fremdeQuelle = $true
                }
            }
            if ($fremdeQuelle) {
                Remove-Item -LiteralPath $ziel -Force -ErrorAction SilentlyContinue
                Add-Warnung -Text ("Der Quellenfilter des WinGet-Exports fuer '{0}' wurde nicht eindeutig eingehalten. Das Inventar wurde verworfen." -f $Quelle)
                return $null
            }

            Write-Status -Text ("WinGet-Inventar fuer '{0}' gespeichert: {1}" -f $Quelle, $ziel) -Stufe 'OK'
            return $ziel
        }
        catch {
            Add-Warnung -Text ('Das WinGet-Inventar wurde erstellt, ist aber nicht lesbar: {0}' -f $_.Exception.Message)
        }
    }
    return $null
}

function New-Wiederherstellungspunkt {
    Write-Status -Text 'Windows-Wiederherstellungspunkt wird angefordert.' -Stufe 'SCHRITT'
    try {
        $beschreibung = 'Vor OneClick-Programmreparatur ' + (Get-Date -Format 'yyyy-MM-dd HH:mm')
        $arguments = @{
            Description = $beschreibung
            RestorePointType = [uint32]12
            EventType = [uint32]100
        }
        $ergebnis = Invoke-CimMethod -Namespace 'root/default' -ClassName 'SystemRestore' -MethodName 'CreateRestorePoint' -Arguments $arguments -ErrorAction Stop
        $returnRaw = Get-SichereEigenschaft -Objekt $ergebnis -Name 'ReturnValue' -Standardwert -1
        $returnValue = [int]$returnRaw
        if ($returnValue -eq 0) {
            Write-Status -Text 'Wiederherstellungspunkt wurde erstellt oder von Windows angenommen.' -Stufe 'OK'
            Add-Resultat -Bereich 'Windows' -Aktion 'Wiederherstellungspunkt' -Status 'Erfolgreich' -ExitCode 0
        }
        else {
            Add-Warnung -Text ("Windows hat den Wiederherstellungspunkt nicht erstellt (ReturnValue {0}). Systemschutz ist moeglicherweise deaktiviert." -f $returnValue)
            Add-Resultat -Bereich 'Windows' -Aktion 'Wiederherstellungspunkt' -Status 'Nicht erstellt' -ExitCode $returnValue
        }
    }
    catch {
        Add-Warnung -Text ('Wiederherstellungspunkt nicht verfuegbar: {0}' -f $_.Exception.Message)
        Add-Resultat -Bereich 'Windows' -Aktion 'Wiederherstellungspunkt' -Status 'Nicht verfuegbar' -ExitCode -1 -Details $_.Exception.Message
    }
}

function Resolve-OneClickPendingFilePfad {
    param([AllowNull()][AllowEmptyString()][string]$Pfad)

    $rohwert = if ($null -eq $Pfad) { '' } else { [string]$Pfad }
    $bereinigt = $rohwert.TrimEnd([char]0).Trim()
    if ([string]::IsNullOrWhiteSpace($bereinigt)) {
        return [pscustomobject]@{
            Rohwert = $rohwert
            Pfad = ''
            Pruefbar = $true
            Vorhanden = $false
        }
    }

    # MoveFileEx/Session Manager kann Ersatzflags ('!') und interne
    # Operationsflags ('*<Zahl>') vor den eigentlichen NT-Pfad schreiben.
    while ($bereinigt.StartsWith('!', [StringComparison]::Ordinal)) {
        $bereinigt = $bereinigt.Substring(1)
    }
    if ($bereinigt -match '^\*\d+') {
        $bereinigt = $bereinigt.Substring($Matches[0].Length)
    }
    $bereinigt = [Environment]::ExpandEnvironmentVariables($bereinigt)

    if ($bereinigt.StartsWith('\??\', [StringComparison]::Ordinal)) {
        $bereinigt = $bereinigt.Substring(4)
    }
    elseif ($bereinigt.StartsWith('\DosDevices\', [StringComparison]::OrdinalIgnoreCase)) {
        $bereinigt = $bereinigt.Substring(12)
    }

    if ($bereinigt.StartsWith('UNC\', [StringComparison]::OrdinalIgnoreCase)) {
        $bereinigt = '\\' + $bereinigt.Substring(4)
    }
    elseif ($bereinigt.StartsWith('\SystemRoot\', [StringComparison]::OrdinalIgnoreCase)) {
        $bereinigt = Join-Path -Path $env:SystemRoot -ChildPath $bereinigt.Substring(12)
    }
    elseif ($bereinigt.StartsWith('SystemRoot\', [StringComparison]::OrdinalIgnoreCase)) {
        $bereinigt = Join-Path -Path $env:SystemRoot -ChildPath $bereinigt.Substring(11)
    }

    # Path.IsPathFullyQualified ist unter der eingebetteten Windows PowerShell
    # 5.1/.NET-Framework-Laufzeit nicht durchgaengig vorhanden. Pending-
    # Operationen enthalten Windows-Pfade; deshalb werden vollqualifizierte
    # Laufwerks- und UNC-Pfade hier ohne laufzeitabhaengige API erkannt.
    $pruefbar = ($bereinigt -match '^(?:[A-Za-z]:[\\/]|[\\/]{2}[^\\/]+[\\/][^\\/]+(?:[\\/]|$))') -and
        -not $bereinigt.StartsWith('\Device\', [StringComparison]::OrdinalIgnoreCase) -and
        -not $bereinigt.StartsWith('\GLOBALROOT\', [StringComparison]::OrdinalIgnoreCase)

    $vorhanden = $false
    if ($pruefbar) {
        try { $vorhanden = Test-Path -LiteralPath $bereinigt -ErrorAction Stop }
        catch { $pruefbar = $false }
    }

    return [pscustomobject]@{
        Rohwert = $rohwert
        Pfad = $bereinigt
        Pruefbar = $pruefbar
        Vorhanden = $vorhanden
    }
}

function Remove-OneClickVeralteteBerichte {
    param([ValidateRange(1, 3650)][int]$Aufbewahrungstage = 3)

    $dokumente = Get-OneClickDokumenteBasis
    $berichteBasis = [IO.Path]::GetFullPath((Join-Path $dokumente 'OneClick-Reparaturberichte')).TrimEnd([char]92)
    if (-not (Test-Path -LiteralPath $berichteBasis -PathType Container)) {
        return [pscustomobject]@{ InPapierkorb = 0; Verblieben = 0; Basis = $berichteBasis }
    }
    if (-not (Test-VerzeichnisketteOhneReparsePoint -Basis $dokumente -Kandidat $berichteBasis)) {
        throw 'Der Berichtsordner ist fuer die Papierkorbbereinigung nicht sicher.'
    }

    Add-Type -AssemblyName Microsoft.VisualBasic -ErrorAction Stop
    $grenzeUtc = [DateTime]::UtcNow.AddDays(-$Aufbewahrungstage)
    $muster = '^(?:Ergebnis-[0-9]{8}-[0-9]{6}\.csv|Zusammenfassung-[0-9]{8}-[0-9]{6}\.txt)$'
    $kandidaten = @(Get-ChildItem -LiteralPath $berichteBasis -Recurse -Force -File -ErrorAction Stop | Where-Object {
        $_.Name -match $muster -and $_.LastWriteTimeUtc -le $grenzeUtc
    })
    $entfernt = 0
    foreach ($datei in $kandidaten) {
        if ($datei.Attributes -band [IO.FileAttributes]::ReparsePoint) {
            throw ("Ein Bericht ist eine unerwartete Pfadumleitung: {0}" -f $datei.FullName)
        }
        [Microsoft.VisualBasic.FileIO.FileSystem]::DeleteFile(
            $datei.FullName,
            [Microsoft.VisualBasic.FileIO.UIOption]::OnlyErrorDialogs,
            [Microsoft.VisualBasic.FileIO.RecycleOption]::SendToRecycleBin,
            [Microsoft.VisualBasic.FileIO.UICancelOption]::ThrowException
        )
        if (Test-Path -LiteralPath $datei.FullName) {
            throw ("Der alte Bericht ist nach der Papierkorbuebergabe noch vorhanden: {0}" -f $datei.FullName)
        }
        $entfernt++
    }
    $verblieben = @(Get-ChildItem -LiteralPath $berichteBasis -Recurse -Force -File -ErrorAction Stop | Where-Object {
        $_.Name -match $muster -and $_.LastWriteTimeUtc -le $grenzeUtc
    })
    if ($verblieben.Count -gt 0) {
        throw ("{0} Berichte aelter als {1} Tage wurden nicht in den Papierkorb verschoben." -f $verblieben.Count, $Aufbewahrungstage)
    }
    if ($entfernt -gt 0) {
        Add-Resultat -Bereich 'Abschluss' -Aktion 'Alte Berichte in den Windows-Papierkorb verschieben' -Status 'Erfolgreich und nachkontrolliert' -ExitCode 0 -Details ("Berichte: {0}; Aufbewahrung: {1} Tage; Ordner: {2}" -f $entfernt, $Aufbewahrungstage, $berichteBasis)
        Write-Status -Text ("{0} Berichte aelter als {1} Tage wurden in den Windows-Papierkorb verschoben." -f $entfernt, $Aufbewahrungstage) -Stufe 'OK'
    }
    return [pscustomobject]@{ InPapierkorb = $entfernt; Verblieben = $verblieben.Count; Basis = $berichteBasis }
}

function Register-OneClickBerichtsaufbewahrungsaufgabe {
    if (-not (Test-IstAdministrator)) { return $null }
    $pwsh = Find-Pwsh7
    if ([string]::IsNullOrWhiteSpace([string]$pwsh) -or -not (Test-Pwsh7 -Pfad $pwsh)) {
        throw 'PowerShell 7 ist fuer die automatische Berichtsaufbewahrung nicht verifiziert.'
    }
    $dokumente = Get-OneClickDokumenteBasis
    $berichteBasis = [IO.Path]::GetFullPath((Join-Path $dokumente 'OneClick-Reparaturberichte')).TrimEnd([char]92)
    $bereinigungsCode = @'
$ErrorActionPreference = 'Stop'
$basis = '__BERICHTSBASIS__'
if (Test-Path -LiteralPath $basis -PathType Container) {
    Add-Type -AssemblyName Microsoft.VisualBasic
    $grenzeUtc = [DateTime]::UtcNow.AddDays(-3)
    $muster = '^(?:Ergebnis-[0-9]{8}-[0-9]{6}\.csv|Zusammenfassung-[0-9]{8}-[0-9]{6}\.txt)$'
    foreach ($datei in @(Get-ChildItem -LiteralPath $basis -Recurse -Force -File | Where-Object { $_.Name -match $muster -and $_.LastWriteTimeUtc -le $grenzeUtc })) {
        if (-not ($datei.Attributes -band [IO.FileAttributes]::ReparsePoint)) {
            [Microsoft.VisualBasic.FileIO.FileSystem]::DeleteFile($datei.FullName, [Microsoft.VisualBasic.FileIO.UIOption]::OnlyErrorDialogs, [Microsoft.VisualBasic.FileIO.RecycleOption]::SendToRecycleBin, [Microsoft.VisualBasic.FileIO.UICancelOption]::DoNothing)
        }
    }
}
'@
    $bereinigungsCode = $bereinigungsCode.Replace('__BERICHTSBASIS__', $berichteBasis.Replace("'", "''"))
    $kodiert = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($bereinigungsCode))
    $argumente = "-NoLogo -NoProfile -NonInteractive -ExecutionPolicy Bypass -EncodedCommand $kodiert"
    $sid = Get-OneClickBenutzerSid
    $benutzerName = [string][Security.Principal.WindowsIdentity]::GetCurrent().Name
    if ([string]::IsNullOrWhiteSpace($benutzerName)) {
        throw 'Der Benutzer fuer die automatische Berichtsaufbewahrung konnte nicht ermittelt werden.'
    }
    $kennung = ([Convert]::ToHexString([Security.Cryptography.SHA256]::HashData([Text.Encoding]::UTF8.GetBytes(("{0}|{1}" -f $env:COMPUTERNAME, $sid)))).Substring(0, 16).ToLowerInvariant())
    $aufgabenName = "OneClick-Reparaturberichte-Aufbewahrung-$kennung"

    $dienst = New-Object -ComObject 'Schedule.Service'
    $dienst.Connect()
    $wurzel = $dienst.GetFolder('\')
    $definition = $dienst.NewTask(0)
    $definition.RegistrationInfo.Description = 'Verschiebt OneClick-Reparaturberichte nach drei Tagen automatisch in den Windows-Papierkorb.'
    $definition.Principal.UserId = $sid
    $definition.Principal.LogonType = 3
    $definition.Principal.RunLevel = 0
    $definition.Settings.Enabled = $true
    $definition.Settings.Hidden = $false
    $definition.Settings.StartWhenAvailable = $true
    $definition.Settings.AllowDemandStart = $true
    $definition.Settings.ExecutionTimeLimit = 'PT10M'
    $taeglich = $definition.Triggers.Create(2)
    $taeglich.StartBoundary = (Get-Date).Date.AddDays(1).AddHours(3).ToString('s')
    $taeglich.DaysInterval = 1
    $taeglich.Repetition.Interval = 'PT1H'
    $taeglich.Repetition.Duration = 'P1D'
    $taeglich.Repetition.StopAtDurationEnd = $false
    $taeglich.Enabled = $true
    $anmeldung = $definition.Triggers.Create(9)
    $anmeldung.UserId = $sid
    $anmeldung.Enabled = $true
    $aktion = $definition.Actions.Create(0)
    $aktion.Path = $pwsh
    $aktion.Arguments = $argumente
    $aktion.WorkingDirectory = $dokumente
    $null = $wurzel.RegisterTaskDefinition($aufgabenName, $definition, 6, $benutzerName, $null, 3, $null)
    $kontrolle = $wurzel.GetTask($aufgabenName)
    $kontrollTaeglich = $false
    $kontrollAnmeldung = $false
    if ($null -ne $kontrolle) {
        for ($triggerIndex = 1; $triggerIndex -le [int]$kontrolle.Definition.Triggers.Count; $triggerIndex++) {
            $kontrollTrigger = $kontrolle.Definition.Triggers.Item($triggerIndex)
            if ([int]$kontrollTrigger.Type -eq 2 -and
                [string]$kontrollTrigger.Repetition.Interval -eq 'PT1H' -and
                [string]$kontrollTrigger.Repetition.Duration -eq 'P1D') {
                $kontrollTaeglich = $true
            }
            elseif ([int]$kontrollTrigger.Type -eq 9) {
                $kontrollAnmeldung = $true
            }
        }
    }
    if ($null -eq $kontrolle -or -not [bool]$kontrolle.Enabled -or
        -not $kontrollTaeglich -or -not $kontrollAnmeldung -or
        -not [string]::Equals([string]$kontrolle.Definition.Actions.Item(1).Path, $pwsh, [StringComparison]::OrdinalIgnoreCase) -or
        -not [string]::Equals([string]$kontrolle.Definition.Actions.Item(1).Arguments, $argumente, [StringComparison]::Ordinal)) {
        throw 'Die automatische Drei-Tage-Berichtsaufbewahrung bestand ihre Nachkontrolle nicht.'
    }
    Add-Resultat -Bereich 'Abschluss' -Aktion 'Automatische Drei-Tage-Berichtsaufbewahrung registrieren' -Status 'Stuendlich und bei Anmeldung aktiv; nachkontrolliert' -ExitCode 0 -Details ("Aufgabe: {0}; Ordner: {1}" -f $aufgabenName, $berichteBasis)
    return [pscustomobject]@{ Name = $aufgabenName; Berichte = $berichteBasis; PowerShell = $pwsh }
}

function Move-OneClickLegacyBerichteUndBereinigeDaten {
    if (-not (Test-IstAdministrator)) { return $null }

    $dokumente = Get-OneClickDokumenteBasis
    $berichteBasis = Join-Path $dokumente 'OneClick-Reparaturberichte'
    $legacyWurzeln = New-Object 'System.Collections.Generic.List[object]'
    if (-not [string]::IsNullOrWhiteSpace([string]$env:ProgramData)) {
        $legacyWurzeln.Add([pscustomobject]@{
            Pfad = Join-Path $env:ProgramData 'OneClick-ProgrammReparatur'
            Name = 'OneClick-ProgrammReparatur'
            BerichtKontext = 'Legacy-Hauptlauf'
        }) | Out-Null
    }
    if (-not [string]::IsNullOrWhiteSpace([string]$env:LOCALAPPDATA)) {
        $legacyWurzeln.Add([pscustomobject]@{
            Pfad = Join-Path $env:LOCALAPPDATA 'OneClick-ProgrammReparatur-Benutzer'
            Name = 'OneClick-ProgrammReparatur-Benutzer'
            BerichtKontext = 'Legacy-Benutzerlauf'
        }) | Out-Null
    }

    $verschobeneBerichte = 0
    $entfernteWurzeln = 0
    $berichtMuster = '^(?:Ergebnis-[0-9]{8}-[0-9]{6}\.csv|Zusammenfassung-[0-9]{8}-[0-9]{6}\.txt)$'
    foreach ($legacy in $legacyWurzeln.ToArray()) {
        $legacyPfad = [IO.Path]::GetFullPath([string]$legacy.Pfad).TrimEnd([char]92)
        $legacyBasis = [IO.Path]::GetDirectoryName($legacyPfad)
        if (-not [string]::Equals([IO.Path]::GetFileName($legacyPfad), [string]$legacy.Name, [StringComparison]::Ordinal) -or
            -not (Test-PfadUnterBasis -Basis $legacyBasis -Kandidat $legacyPfad)) {
            throw ("Ein alter OneClick-Datenpfad ist nicht eindeutig begrenzt: {0}" -f $legacyPfad)
        }
        if (-not (Test-Path -LiteralPath $legacyPfad -PathType Container)) { continue }
        if (-not (Test-VerzeichnisketteOhneReparsePoint -Basis $legacyBasis -Kandidat $legacyPfad)) {
            throw ("Der alte OneClick-Datenordner ist eine unsichere Pfadumleitung: {0}" -f $legacyPfad)
        }

        $berichtZiel = Join-Path $berichteBasis ([string]$legacy.BerichtKontext)
        New-Item -ItemType Directory -Path $berichtZiel -Force -ErrorAction Stop | Out-Null
        if (-not (Test-VerzeichnisketteOhneReparsePoint -Basis $dokumente -Kandidat $berichtZiel)) {
            throw ("Das Ziel fuer alte OneClick-Berichte ist unsicher: {0}" -f $berichtZiel)
        }
        foreach ($bericht in @(Get-ChildItem -LiteralPath $legacyPfad -Recurse -Force -File -ErrorAction Stop | Where-Object { $_.Name -match $berichtMuster })) {
            if ($bericht.Attributes -band [IO.FileAttributes]::ReparsePoint) {
                throw ("Ein alter OneClick-Bericht ist eine unerwartete Pfadumleitung: {0}" -f $bericht.FullName)
            }
            $zielDatei = Join-Path $berichtZiel $bericht.Name
            if (Test-Path -LiteralPath $zielDatei -PathType Leaf) {
                $quelleHash = (Get-FileHash -LiteralPath $bericht.FullName -Algorithm SHA256 -ErrorAction Stop).Hash
                $zielHash = (Get-FileHash -LiteralPath $zielDatei -Algorithm SHA256 -ErrorAction Stop).Hash
                if (-not [string]::Equals($quelleHash, $zielHash, [StringComparison]::OrdinalIgnoreCase)) {
                    throw ("Ein alter Bericht kann wegen einer abweichenden Zieldatei nicht sicher migriert werden: {0}" -f $zielDatei)
                }
                $null = Remove-OneClickKontrolliertenLaufpfad -Pfad $bericht.FullName -Basis $legacyPfad -ErlaubtesNamensmuster $berichtMuster
            }
            else {
                Move-Item -LiteralPath $bericht.FullName -Destination $zielDatei -ErrorAction Stop
            }
            if ((Test-Path -LiteralPath $bericht.FullName) -or -not (Test-Path -LiteralPath $zielDatei -PathType Leaf)) {
                throw ("Ein alter Bericht wurde nicht nachweislich in Windows-Dokumente verschoben: {0}" -f $bericht.Name)
            }
            $verschobeneBerichte++
        }

        $entfernung = Remove-OneClickKontrolliertenLaufpfad -Pfad $legacyPfad -Basis $legacyBasis -ErlaubtesNamensmuster ('^' + [regex]::Escape([string]$legacy.Name) + '$')
        if (-not [bool]$entfernung.Entfernt) {
            throw ("Der alte OneClick-Datenordner wurde nicht vollstaendig entfernt: {0}" -f $legacyPfad)
        }
        $entfernteWurzeln++
    }

    if ($verschobeneBerichte -gt 0 -or $entfernteWurzeln -gt 0) {
        Add-Resultat -Bereich 'Abschluss' -Aktion 'Alte OneClick-Daten aus ProgramData und LocalAppData migrieren' -Status 'Berichte in Dokumente verschoben; Laufzeitreste entfernt und nachkontrolliert' -ExitCode 0 -Details ("Berichte: {0}; entfernte Altordner: {1}; Ziel: {2}" -f $verschobeneBerichte, $entfernteWurzeln, $berichteBasis)
        Write-Status -Text ("Alte OneClick-Daten bereinigt: {0} Berichte nach Dokumente verschoben, {1} Altordner restlos entfernt." -f $verschobeneBerichte, $entfernteWurzeln) -Stufe 'OK'
    }
    return [pscustomobject]@{ BerichteVerschoben = $verschobeneBerichte; AltordnerEntfernt = $entfernteWurzeln; Ziel = $berichteBasis }
}

function Get-OneClickPendingFileOperationen {
    param([AllowNull()][AllowEmptyCollection()][object[]]$Eintraege)

    $werte = @($Eintraege)
    $operationen = New-Object 'System.Collections.Generic.List[object]'
    for ($index = 0; $index -lt $werte.Count; $index += 2) {
        $quelleRoh = if ($index -lt $werte.Count) { [string]$werte[$index] } else { '' }
        $zielRoh = if (($index + 1) -lt $werte.Count) { [string]$werte[$index + 1] } else { '' }
        $quelle = Resolve-OneClickPendingFilePfad -Pfad $quelleRoh
        $ziel = Resolve-OneClickPendingFilePfad -Pfad $zielRoh
        $typ = if ([string]::IsNullOrWhiteSpace([string]$ziel.Pfad)) { 'Loeschen' } else { 'UmbenennenOderErsetzen' }

        # Ein normalisierter lokaler/UNC-Quellpfad ist nur anwendbar, wenn er
        # noch existiert. Nicht sicher in Win32 aufloesbare NT-Geraetepfade
        # bleiben konservativ relevant, damit kein echter Neustart verloren geht.
        $anwendbar = if ([bool]$quelle.Pruefbar) {
            [bool]$quelle.Vorhanden
        }
        else {
            -not [string]::IsNullOrWhiteSpace([string]$quelle.Pfad)
        }

        $operationen.Add([pscustomobject]@{
            Index = [int]($index / 2)
            Typ = $typ
            Quelle = [string]$quelle.Pfad
            Ziel = [string]$ziel.Pfad
            QuellePruefbar = [bool]$quelle.Pruefbar
            QuelleVorhanden = [bool]$quelle.Vorhanden
            Anwendbar = [bool]$anwendbar
        }) | Out-Null
    }
    return @($operationen.ToArray())
}

function Get-WindowsNeustartstatus {
    $gruende = New-Object 'System.Collections.Generic.List[string]'
    $marker = @(
        @{ Pfad = 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Component Based Servicing\RebootPending'; Text = 'CBS-RebootPending' },
        @{ Pfad = 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Component Based Servicing\RebootInProgress'; Text = 'CBS-RebootInProgress' },
        @{ Pfad = 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Component Based Servicing\PackagesPending'; Text = 'CBS-PackagesPending' },
        @{ Pfad = 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\WindowsUpdate\Auto Update\RebootRequired'; Text = 'WindowsUpdate-RebootRequired' }
    )
    foreach ($eintrag in $marker) {
        try {
            if (Test-Path -LiteralPath ([string]$eintrag.Pfad) -PathType Container) {
                $gruende.Add([string]$eintrag.Text) | Out-Null
            }
        }
        catch { Write-Verbose ("Neustartmarker konnte nicht gelesen werden: {0}" -f $_.Exception.Message) }
    }

    try {
        $sessionManager = Get-ItemProperty -LiteralPath 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager' -Name 'PendingFileRenameOperations' -ErrorAction SilentlyContinue
        $umbenennungswerte = @((Get-SichereEigenschaft -Objekt $sessionManager -Name 'PendingFileRenameOperations' -Standardwert @()))
        $dateioperationen = @(Get-OneClickPendingFileOperationen -Eintraege $umbenennungswerte)
        $anwendbareDateioperationen = @($dateioperationen | Where-Object { [bool]$_.Anwendbar })
        $veralteteDateioperationen = @($dateioperationen | Where-Object { -not [bool]$_.Anwendbar })
        if ($anwendbareDateioperationen.Count -gt 0) {
            $gruende.Add(("Ausstehende anwendbare Dateioperationen ({0})" -f $anwendbareDateioperationen.Count)) | Out-Null
        }
        if ($veralteteDateioperationen.Count -gt 0) {
            Write-Verbose ("{0} nicht mehr anwendbare PendingFileRenameOperations-Eintraege werden nicht als Neustartbedarf gewertet." -f $veralteteDateioperationen.Count)
        }
    }
    catch { Write-Verbose ("Ausstehende Dateiumbenennungen konnten nicht gelesen werden: {0}" -f $_.Exception.Message) }

    try {
        $updateExeVolatile = Get-ItemPropertyValue -LiteralPath 'HKLM:\SOFTWARE\Microsoft\Updates' -Name 'UpdateExeVolatile' -ErrorAction SilentlyContinue
        if ($null -ne $updateExeVolatile -and [int]$updateExeVolatile -ne 0) {
            $gruende.Add(("UpdateExeVolatile={0}" -f [int]$updateExeVolatile)) | Out-Null
        }
    }
    catch { Write-Verbose ("UpdateExeVolatile konnte nicht gelesen werden: {0}" -f $_.Exception.Message) }

    try {
        $aktiverName = [string](Get-ItemPropertyValue -LiteralPath 'HKLM:\SYSTEM\CurrentControlSet\Control\ComputerName\ActiveComputerName' -Name 'ComputerName' -ErrorAction SilentlyContinue)
        $vorgesehenerName = [string](Get-ItemPropertyValue -LiteralPath 'HKLM:\SYSTEM\CurrentControlSet\Control\ComputerName\ComputerName' -Name 'ComputerName' -ErrorAction SilentlyContinue)
        if (-not [string]::IsNullOrWhiteSpace($aktiverName) -and -not [string]::IsNullOrWhiteSpace($vorgesehenerName) -and
            -not [string]::Equals($aktiverName, $vorgesehenerName, [StringComparison]::OrdinalIgnoreCase)) {
            $gruende.Add('Ausstehende Computernamensaenderung') | Out-Null
        }
    }
    catch { Write-Verbose ("Computernamen-Neustartstatus konnte nicht gelesen werden: {0}" -f $_.Exception.Message) }

    return [pscustomobject]@{
        Ausstehend = ($gruende.Count -gt 0)
        Gruende = @($gruende.ToArray())
        Details = ($gruende.ToArray() -join '; ')
    }
}

function Get-OneClickBenutzerSid {
    $identitaet = [Security.Principal.WindowsIdentity]::GetCurrent()
    if ($null -eq $identitaet -or $null -eq $identitaet.User -or [string]::IsNullOrWhiteSpace([string]$identitaet.User.Value)) {
        throw 'Die SID des aktuellen Benutzers konnte fuer die Neustartfortsetzung nicht ermittelt werden.'
    }
    return [string]$identitaet.User.Value
}

function Resolve-OneClickKontenSid {
    param([Parameter(Mandatory = $true)][string]$Kontenkennung)

    if ($Kontenkennung -match '^S-\d(?:-\d+)+$') {
        return [string]([Security.Principal.SecurityIdentifier]::new($Kontenkennung).Value)
    }
    try {
        $konto = [Security.Principal.NTAccount]::new($Kontenkennung)
        return [string](($konto.Translate([Security.Principal.SecurityIdentifier])).Value)
    }
    catch {
        return ''
    }
}

function Get-OneClickWindowsStartTicks {
    $betriebssystem = Get-CimInstance -ClassName Win32_OperatingSystem -Property LastBootUpTime -ErrorAction Stop
    $start = [DateTime](Get-SichereEigenschaft -Objekt $betriebssystem -Name 'LastBootUpTime' -Standardwert ([DateTime]::MinValue))
    if ($start -eq [DateTime]::MinValue) {
        throw 'Die Windows-Startzeit konnte fuer die Neustartfortsetzung nicht ermittelt werden.'
    }
    return [int64]$start.ToUniversalTime().Ticks
}

function Test-OneClickNeustartErfolgt {
    param(
        [Parameter(Mandatory = $true)][int64]$GespeicherteWindowsStartTicks,
        [Parameter(Mandatory = $true)][int64]$AktuelleWindowsStartTicks
    )

    return ($GespeicherteWindowsStartTicks -gt 0 -and $AktuelleWindowsStartTicks -gt $GespeicherteWindowsStartTicks)
}

function Get-OneClickFortsetzungsabschnittRang {
    param([Parameter(Mandatory = $true)][string]$Abschnitt)

    $reihenfolge = @(
        'WindowsSystem',
        'BenutzerUpdates',
        'MaschinenUpdates',
        'RegistryPruefung',
        'BenutzerReparatur',
        'MaschinenReparatur',
        'Abschluss'
    )
    $rang = [Array]::IndexOf($reihenfolge, $Abschnitt)
    if ($rang -lt 0) { throw ("Unbekannter Fortsetzungsabschnitt: {0}" -f $Abschnitt) }
    return $rang
}

function Get-OneClickFortsetzungsKennung {
    $sid = Get-OneClickBenutzerSid
    $hash = [Security.Cryptography.SHA256]::HashData([Text.Encoding]::UTF8.GetBytes(("{0}|{1}|{2}" -f $env:COMPUTERNAME, $sid, $script:Version)))
    return ([Convert]::ToHexString($hash).Substring(0, 16).ToLowerInvariant())
}

function Initialize-OneClickFortsetzungsablage {
    if ([string]::IsNullOrWhiteSpace([string]$script:LogOrdner) -or -not (Test-Path -LiteralPath $script:LogOrdner -PathType Container)) {
        throw 'Die geschuetzte Protokollbasis ist fuer die Neustartfortsetzung nicht initialisiert.'
    }
    $basis = Join-Path -Path $script:LogOrdner -ChildPath 'Fortsetzung'
    New-Item -ItemType Directory -Path $basis -Force -ErrorAction Stop | Out-Null
    if (-not (Test-VerzeichnisketteOhneReparsePoint -Basis $script:LogOrdner -Kandidat $basis)) {
        throw 'Die Ablage fuer die Neustartfortsetzung ist eine unsichere Pfadumleitung.'
    }

    $sid = [Security.Principal.SecurityIdentifier]::new((Get-OneClickBenutzerSid))
    $systemSid = [Security.Principal.SecurityIdentifier]::new('S-1-5-18')
    $adminSid = [Security.Principal.SecurityIdentifier]::new('S-1-5-32-544')
    $acl = [Security.AccessControl.DirectorySecurity]::new()
    $acl.SetAccessRuleProtection($true, $false)
    $vererbung = [Security.AccessControl.InheritanceFlags]::ContainerInherit -bor [Security.AccessControl.InheritanceFlags]::ObjectInherit
    foreach ($regelSid in @($systemSid, $adminSid)) {
        $regel = [Security.AccessControl.FileSystemAccessRule]::new(
            $regelSid,
            [Security.AccessControl.FileSystemRights]::FullControl,
            $vererbung,
            [Security.AccessControl.PropagationFlags]::None,
            [Security.AccessControl.AccessControlType]::Allow
        )
        [void]$acl.AddAccessRule($regel)
    }
    $benutzerRegel = [Security.AccessControl.FileSystemAccessRule]::new(
        $sid,
        [Security.AccessControl.FileSystemRights]::ReadAndExecute,
        $vererbung,
        [Security.AccessControl.PropagationFlags]::None,
        [Security.AccessControl.AccessControlType]::Allow
    )
    [void]$acl.AddAccessRule($benutzerRegel)
    $acl.SetOwner($adminSid)
    Set-Acl -LiteralPath $basis -AclObject $acl -ErrorAction Stop
    return [IO.Path]::GetFullPath($basis)
}

function Get-OneClickFortsetzungsPfade {
    $basis = Initialize-OneClickFortsetzungsablage
    $kennung = Get-OneClickFortsetzungsKennung
    return [pscustomobject]@{
        Basis = $basis
        StatusDatei = Join-Path -Path $basis -ChildPath ("Fortsetzungsstatus-{0}.dpapi" -f $kennung)
        SkriptDatei = Join-Path -Path $basis -ChildPath ("OneClick-Komplettreparatur-Fortsetzung-{0}.ps1" -f $kennung)
        AufgabenName = "OneClick-Komplettreparatur-Fortsetzen-$kennung"
    }
}

function Set-OneClickFortsetzungsDateischutz {
    param([Parameter(Mandatory = $true)][string]$Pfad)

    $vollPfad = [IO.Path]::GetFullPath($Pfad)
    if (-not (Test-Path -LiteralPath $vollPfad -PathType Leaf)) {
        throw 'Die zu schuetzende Fortsetzungsdatei fehlt.'
    }
    $sid = [Security.Principal.SecurityIdentifier]::new((Get-OneClickBenutzerSid))
    $systemSid = [Security.Principal.SecurityIdentifier]::new('S-1-5-18')
    $adminSid = [Security.Principal.SecurityIdentifier]::new('S-1-5-32-544')
    $acl = [Security.AccessControl.FileSecurity]::new()
    $acl.SetAccessRuleProtection($true, $false)
    foreach ($regelSid in @($systemSid, $adminSid)) {
        $regel = [Security.AccessControl.FileSystemAccessRule]::new(
            $regelSid,
            [Security.AccessControl.FileSystemRights]::FullControl,
            [Security.AccessControl.InheritanceFlags]::None,
            [Security.AccessControl.PropagationFlags]::None,
            [Security.AccessControl.AccessControlType]::Allow
        )
        [void]$acl.AddAccessRule($regel)
    }
    $benutzerRegel = [Security.AccessControl.FileSystemAccessRule]::new(
        $sid,
        [Security.AccessControl.FileSystemRights]::ReadAndExecute,
        [Security.AccessControl.InheritanceFlags]::None,
        [Security.AccessControl.PropagationFlags]::None,
        [Security.AccessControl.AccessControlType]::Allow
    )
    [void]$acl.AddAccessRule($benutzerRegel)
    $acl.SetOwner($adminSid)
    Set-Acl -LiteralPath $vollPfad -AclObject $acl -ErrorAction Stop

    $kontrolle = Get-Acl -LiteralPath $vollPfad -ErrorAction Stop
    $besitzerSid = Resolve-OneClickKontenSid -Kontenkennung ([string]$kontrolle.Owner)
    $zusaetzlicheSchreibMaske = [Security.AccessControl.FileSystemRights]::Delete -bor
        [Security.AccessControl.FileSystemRights]::DeleteSubdirectoriesAndFiles -bor
        [Security.AccessControl.FileSystemRights]::ChangePermissions -bor
        [Security.AccessControl.FileSystemRights]::TakeOwnership
    $benutzerSchreibrecht = @($kontrolle.Access | Where-Object {
        $_.AccessControlType -eq [Security.AccessControl.AccessControlType]::Allow -and
        (Resolve-OneClickKontenSid -Kontenkennung ([string]$_.IdentityReference)) -eq [string]$sid.Value -and
        (([int64]$_.FileSystemRights -band [int64][Security.AccessControl.FileSystemRights]::Write) -ne 0 -or
         ([int64]$_.FileSystemRights -band [int64]$zusaetzlicheSchreibMaske) -ne 0)
    })
    if ($besitzerSid -ne [string]$adminSid.Value -or $benutzerSchreibrecht.Count -gt 0) {
        throw 'Die Fortsetzungsdatei blieb fuer den normalen Benutzer veraenderbar.'
    }
}

function New-OneClickGeschuetztesFortsetzungsskript {
    param([Parameter(Mandatory = $true)][object]$Pfade)

    if (-not (Test-IstAdministrator)) {
        throw 'Die geschuetzte Fortsetzungskopie darf nur vom administrativen Hauptlauf erzeugt werden.'
    }
    $quelle = [IO.Path]::GetFullPath([string]$script:SelfPath)
    $ziel = [IO.Path]::GetFullPath((Get-SichererText -Objekt $Pfade -Name 'SkriptDatei'))
    if (-not (Test-Path -LiteralPath $quelle -PathType Leaf) -or
        -not (Test-VerzeichnisketteOhneReparsePoint -Basis ([string]$Pfade.Basis) -Kandidat $ziel)) {
        throw 'Quell- oder Zielpfad der geschuetzten Fortsetzungskopie ist ungueltig.'
    }

    if ([string]::Equals($quelle, $ziel, [StringComparison]::OrdinalIgnoreCase)) {
        Set-OneClickFortsetzungsDateischutz -Pfad $ziel
        return $ziel
    }

    $tempPfad = Join-Path -Path ([string]$Pfade.Basis) -ChildPath ("Fortsetzungsskript-{0}.tmp" -f [Guid]::NewGuid().ToString('N'))
    try {
        Copy-Item -LiteralPath $quelle -Destination $tempPfad -Force -ErrorAction Stop
        $quellHash = (Get-FileHash -LiteralPath $quelle -Algorithm SHA256 -ErrorAction Stop).Hash
        $tempHash = (Get-FileHash -LiteralPath $tempPfad -Algorithm SHA256 -ErrorAction Stop).Hash
        if (-not [string]::Equals($quellHash, $tempHash, [StringComparison]::OrdinalIgnoreCase)) {
            throw 'Die geschuetzte Fortsetzungskopie stimmt nicht mit dem laufenden Release ueberein.'
        }
        Move-Item -LiteralPath $tempPfad -Destination $ziel -Force -ErrorAction Stop
        Set-OneClickFortsetzungsDateischutz -Pfad $ziel
        $zielInfo = Get-Item -LiteralPath $ziel -Force -ErrorAction Stop
        if (($zielInfo.Attributes -band [IO.FileAttributes]::ReparsePoint) -or $zielInfo.Length -le 0) {
            throw 'Die geschuetzte Fortsetzungskopie ist leer oder eine Pfadumleitung.'
        }
        return $ziel
    }
    finally {
        if (Test-Path -LiteralPath $tempPfad -PathType Leaf) {
            Remove-Item -LiteralPath $tempPfad -Force -ErrorAction SilentlyContinue
        }
    }
}

function Get-OneClickFortsetzungsEntropie {
    $sid = Get-OneClickBenutzerSid
    return [Security.Cryptography.SHA256]::HashData([Text.Encoding]::UTF8.GetBytes(("OneClick-Fortsetzung|{0}|{1}" -f $script:Version, $sid)))
}

function Save-OneClickFortsetzungsstatus {
    param(
        [Parameter(Mandatory = $true)][ValidateSet('WindowsSystem', 'Programme')][string]$Phase,
        [Parameter(Mandatory = $true)][ValidateSet('WindowsSystem', 'BenutzerUpdates', 'MaschinenUpdates', 'RegistryPruefung', 'BenutzerReparatur', 'MaschinenReparatur', 'Abschluss')][string]$Abschnitt,
        [Parameter(Mandatory = $true)][string]$Grund
    )

    if (-not (Test-IstAdministrator)) {
        throw 'Der Neustart-Fortsetzungsstatus darf nur vom administrativen Hauptlauf gespeichert werden.'
    }
    $pfade = Get-OneClickFortsetzungsPfade
    $fortsetzungsSkript = New-OneClickGeschuetztesFortsetzungsskript -Pfade $pfade
    $skriptHash = (Get-FileHash -LiteralPath $fortsetzungsSkript -Algorithm SHA256 -ErrorAction Stop).Hash.ToUpperInvariant()
    $identitaet = [Security.Principal.WindowsIdentity]::GetCurrent()
    $status = [pscustomobject]@{
        Schema = 2
        Version = $script:Version
        Computer = [string]$env:COMPUTERNAME
        BenutzerSid = Get-OneClickBenutzerSid
        BenutzerName = [string]$identitaet.Name
        SkriptPfad = [string]$fortsetzungsSkript
        SkriptSHA256 = $skriptHash
        Phase = $Phase
        Abschnitt = $Abschnitt
        Grund = $Grund
        WindowsStartTicks = Get-OneClickWindowsStartTicks
        ErstelltUtc = [DateTimeOffset]::UtcNow.ToString('o')
        Nonce = [Guid]::NewGuid().ToString('N')
        AufgabenName = [string]$pfade.AufgabenName
        Optionen = [pscustomobject]@{
            AlleMSIReparieren = [bool]$AlleMSIReparieren
            AlleWinGetReparieren = [bool]$AlleWinGetReparieren
            FehlerFortsetzen = [bool]$FehlerFortsetzen
        }
    }
    $klartext = [Text.Encoding]::UTF8.GetBytes(($status | ConvertTo-Json -Depth 6 -Compress))
    $geschuetzt = [Security.Cryptography.ProtectedData]::Protect(
        $klartext,
        (Get-OneClickFortsetzungsEntropie),
        [Security.Cryptography.DataProtectionScope]::CurrentUser
    )
    $tempPfad = Join-Path -Path $pfade.Basis -ChildPath ("Fortsetzungsstatus-{0}.tmp" -f [Guid]::NewGuid().ToString('N'))
    try {
        [IO.File]::WriteAllBytes($tempPfad, $geschuetzt)
        $tempInfo = Get-Item -LiteralPath $tempPfad -Force -ErrorAction Stop
        if (($tempInfo.Attributes -band [IO.FileAttributes]::ReparsePoint) -or $tempInfo.Length -le 0 -or $tempInfo.Length -gt 1048576) {
            throw 'Die neu erzeugte geschuetzte Fortsetzungsdatei ist ungueltig.'
        }
        Move-Item -LiteralPath $tempPfad -Destination $pfade.StatusDatei -Force -ErrorAction Stop
        Set-OneClickFortsetzungsDateischutz -Pfad ([string]$pfade.StatusDatei)
    }
    finally {
        if (Test-Path -LiteralPath $tempPfad -PathType Leaf) {
            Remove-Item -LiteralPath $tempPfad -Force -ErrorAction SilentlyContinue
        }
    }
    $script:FortsetzungsStatusDatei = [string]$pfade.StatusDatei
    $script:FortsetzungsSkriptDatei = [string]$fortsetzungsSkript
    $script:FortsetzungsAufgabenName = [string]$pfade.AufgabenName
    return [pscustomobject]@{ Status = $status; Pfade = $pfade }
}

function Read-OneClickFortsetzungsstatus {
    param([Parameter(Mandatory = $true)][string]$StatusPfad)

    $pfade = Get-OneClickFortsetzungsPfade
    $erwartet = [IO.Path]::GetFullPath([string]$pfade.StatusDatei)
    $kandidat = [IO.Path]::GetFullPath($StatusPfad)
    if (-not [string]::Equals($erwartet, $kandidat, [StringComparison]::OrdinalIgnoreCase) -or
        -not (Test-VerzeichnisketteOhneReparsePoint -Basis $pfade.Basis -Kandidat $kandidat) -or
        -not (Test-Path -LiteralPath $kandidat -PathType Leaf)) {
        throw 'Der angegebene Neustart-Fortsetzungsstatus besitzt keinen erlaubten Pfad.'
    }
    $info = Get-Item -LiteralPath $kandidat -Force -ErrorAction Stop
    if (($info.Attributes -band [IO.FileAttributes]::ReparsePoint) -or $info.Length -le 0 -or $info.Length -gt 1048576) {
        throw 'Die Neustart-Fortsetzungsdatei ist leer, zu gross oder eine Pfadumleitung.'
    }
    try {
        $klartext = [Security.Cryptography.ProtectedData]::Unprotect(
            [IO.File]::ReadAllBytes($kandidat),
            (Get-OneClickFortsetzungsEntropie),
            [Security.Cryptography.DataProtectionScope]::CurrentUser
        )
        $status = [Text.Encoding]::UTF8.GetString($klartext) | ConvertFrom-Json -ErrorAction Stop
    }
    catch {
        throw ("Der geschuetzte Neustart-Fortsetzungsstatus konnte nicht authentifiziert werden: {0}" -f $_.Exception.Message)
    }

    $aktuelleSid = Get-OneClickBenutzerSid
    $aktuellerHash = (Get-FileHash -LiteralPath $script:SelfPath -Algorithm SHA256 -ErrorAction Stop).Hash.ToUpperInvariant()
    $phase = Get-SichererText -Objekt $status -Name 'Phase'
    $abschnitt = Get-SichererText -Objekt $status -Name 'Abschnitt'
    $optionen = Get-SichereEigenschaft -Objekt $status -Name 'Optionen' -Standardwert $null
    $erstellt = [DateTimeOffset]::MinValue
    $erstelltGueltig = [DateTimeOffset]::TryParse(
        (Get-SichererText -Objekt $status -Name 'ErstelltUtc'),
        [Globalization.CultureInfo]::InvariantCulture,
        [Globalization.DateTimeStyles]::RoundtripKind,
        [ref]$erstellt
    )
    $alter = if ($erstelltGueltig) { [DateTimeOffset]::UtcNow - $erstellt.ToUniversalTime() } else { [TimeSpan]::MaxValue }
    if ([int](Get-SichereEigenschaft -Objekt $status -Name 'Schema' -Standardwert 0) -ne 2 -or
        (Get-SichererText -Objekt $status -Name 'Version') -ne $script:Version -or
        -not [string]::Equals((Get-SichererText -Objekt $status -Name 'Computer'), [string]$env:COMPUTERNAME, [StringComparison]::OrdinalIgnoreCase) -or
        (Get-SichererText -Objekt $status -Name 'BenutzerSid') -ne $aktuelleSid -or
        -not [string]::Equals((Get-SichererText -Objekt $status -Name 'SkriptPfad'), [string]$pfade.SkriptDatei, [StringComparison]::OrdinalIgnoreCase) -or
        -not [string]::Equals((Get-SichererText -Objekt $status -Name 'SkriptPfad'), [string]$script:SelfPath, [StringComparison]::OrdinalIgnoreCase) -or
        (Get-SichererText -Objekt $status -Name 'SkriptSHA256').ToUpperInvariant() -ne $aktuellerHash -or
        $phase -notin @('WindowsSystem', 'Programme') -or
        $abschnitt -notin @('WindowsSystem', 'BenutzerUpdates', 'MaschinenUpdates', 'RegistryPruefung', 'BenutzerReparatur', 'MaschinenReparatur', 'Abschluss') -or
        ($phase -eq 'WindowsSystem' -and $abschnitt -ne 'WindowsSystem') -or
        ($phase -eq 'Programme' -and $abschnitt -eq 'WindowsSystem') -or
        (Get-SichererText -Objekt $status -Name 'AufgabenName') -ne [string]$pfade.AufgabenName -or
        -not $erstelltGueltig -or $alter.TotalSeconds -lt -300 -or $alter.TotalDays -gt 30 -or
        $null -eq $optionen -or
        [bool](Get-SichereEigenschaft -Objekt $optionen -Name 'AlleMSIReparieren' -Standardwert (-not [bool]$AlleMSIReparieren)) -ne [bool]$AlleMSIReparieren -or
        [bool](Get-SichereEigenschaft -Objekt $optionen -Name 'AlleWinGetReparieren' -Standardwert (-not [bool]$AlleWinGetReparieren)) -ne [bool]$AlleWinGetReparieren -or
        [bool](Get-SichereEigenschaft -Objekt $optionen -Name 'FehlerFortsetzen' -Standardwert (-not [bool]$FehlerFortsetzen)) -ne [bool]$FehlerFortsetzen) {
        throw 'Der Neustart-Fortsetzungsstatus stimmt nicht eindeutig mit Version, Rechner, Benutzer, Skript oder Phase ueberein.'
    }
    $script:FortsetzungsStatusDatei = $kandidat
    $script:FortsetzungsSkriptDatei = Get-SichererText -Objekt $status -Name 'SkriptPfad'
    $script:FortsetzungsAufgabenName = [string]$pfade.AufgabenName
    return $status
}

function Register-OneClickFortsetzungsaufgabe {
    param(
        [Parameter(Mandatory = $true)][string]$StatusPfad,
        [Parameter(Mandatory = $true)][string]$AufgabenName,
        [Parameter(Mandatory = $true)][string]$SkriptPfad
    )

    if (-not (Test-IstAdministrator)) {
        throw 'Die automatische Neustartfortsetzung darf nur vom administrativen Hauptlauf registriert werden.'
    }
    if ($AufgabenName -notmatch '^OneClick-Komplettreparatur-Fortsetzen-[0-9a-f]{16}$') {
        throw 'Der Aufgabenname fuer die Neustartfortsetzung ist ungueltig.'
    }
    $pfade = Get-OneClickFortsetzungsPfade
    $fortsetzungsSkript = [IO.Path]::GetFullPath($SkriptPfad)
    if (-not [string]::Equals($fortsetzungsSkript, [IO.Path]::GetFullPath([string]$pfade.SkriptDatei), [StringComparison]::OrdinalIgnoreCase) -or
        -not (Test-VerzeichnisketteOhneReparsePoint -Basis ([string]$pfade.Basis) -Kandidat $fortsetzungsSkript) -or
        -not (Test-Path -LiteralPath $fortsetzungsSkript -PathType Leaf)) {
        throw 'Die Fortsetzungsaufgabe verweigert ein ungeschuetztes oder unerwartetes Skriptziel.'
    }
    Set-OneClickFortsetzungsDateischutz -Pfad $fortsetzungsSkript
    $pwsh = Find-Pwsh7
    if ([string]::IsNullOrWhiteSpace([string]$pwsh) -or -not (Test-Pwsh7 -Pfad $pwsh)) {
        throw 'Fuer die automatische Fortsetzung wurde kein verifizierter PowerShell-7-Host gefunden.'
    }
    $identitaet = [Security.Principal.WindowsIdentity]::GetCurrent()
    $benutzerName = [string]$identitaet.Name
    if ([string]::IsNullOrWhiteSpace($benutzerName)) {
        throw 'Der aktuelle Benutzername fehlt fuer die automatische Fortsetzungsaufgabe.'
    }

    $argumente = New-Object 'System.Collections.Generic.List[string]'
    # Die Fortsetzung startet sichtbar und ohne -KeinePause. Dadurch bleibt
    # ihr PowerShell-7-Fenster bis zur Abschlussbestaetigung geoeffnet.
    foreach ($wert in @('-NoLogo', '-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', $fortsetzungsSkript, '-FortsetzenNachNeustart', '-FortsetzungsStatusPfad', $StatusPfad)) {
        $argumente.Add($wert) | Out-Null
    }
    if ($AlleMSIReparieren) { $argumente.Add('-AlleMSIReparieren') | Out-Null }
    if ($AlleWinGetReparieren) { $argumente.Add('-AlleWinGetReparieren') | Out-Null }
    if ($FehlerFortsetzen) { $argumente.Add('-FehlerFortsetzen') | Out-Null }
    # -NeustartSpaeter gilt nur fuer den aktuellen Aufruf. Eine spaetere
    # automatische Fortsetzung muss bei erneutem Neustartbedarf wieder die
    # sichtbare Neustartfunktion anbieten.
    $argumentZeile = (@($argumente.ToArray() | ForEach-Object { ConvertTo-WindowsArgument -Wert $_ }) -join ' ')

    $dienst = New-Object -ComObject 'Schedule.Service'
    $dienst.Connect()
    $wurzel = $dienst.GetFolder('\')
    $definition = $dienst.NewTask(0)
    $definition.RegistrationInfo.Description = 'Setzt die pausierte OneClick-Komplettreparatur nach Windows-Neustart und Benutzeranmeldung fort.'
    $definition.Principal.UserId = $benutzerName
    $definition.Principal.LogonType = 3
    $definition.Principal.RunLevel = 1
    $definition.Settings.Enabled = $true
    $definition.Settings.Hidden = $false
    $definition.Settings.AllowDemandStart = $true
    $definition.Settings.StartWhenAvailable = $true
    $definition.Settings.DisallowStartIfOnBatteries = $false
    $definition.Settings.StopIfGoingOnBatteries = $false
    $definition.Settings.ExecutionTimeLimit = 'PT8H'
    $definition.Settings.DeleteExpiredTaskAfter = 'PT1H'
    $trigger = $definition.Triggers.Create(9)
    $trigger.UserId = $benutzerName
    $trigger.Enabled = $true
    $trigger.EndBoundary = [DateTime]::Now.AddDays(30).ToString("yyyy-MM-dd'T'HH:mm:ss", [Globalization.CultureInfo]::InvariantCulture)
    $aktion = $definition.Actions.Create(0)
    $aktion.Path = $pwsh
    $aktion.Arguments = $argumentZeile
    $aktion.WorkingDirectory = Split-Path -Path $fortsetzungsSkript -Parent
    $null = $wurzel.RegisterTaskDefinition($AufgabenName, $definition, 6, $benutzerName, $null, 3, $null)

    $kontrolle = $wurzel.GetTask($AufgabenName)
    if ($null -eq $kontrolle) {
        throw 'Die registrierte Neustart-Fortsetzungsaufgabe konnte nicht erneut geoeffnet werden.'
    }
    $kontrollDefinition = $kontrolle.Definition
    $kontrollAktion = $kontrollDefinition.Actions.Item(1)
    $kontrollTrigger = $kontrollDefinition.Triggers.Item(1)
    $erwarteteSid = Get-OneClickBenutzerSid
    $principalSid = Resolve-OneClickKontenSid -Kontenkennung ([string]$kontrollDefinition.Principal.UserId)
    $triggerSid = Resolve-OneClickKontenSid -Kontenkennung ([string]$kontrollTrigger.UserId)
    $pfadGueltig = [string]::Equals([string]$kontrollAktion.Path, $pwsh, [StringComparison]::OrdinalIgnoreCase)
    $argumenteGueltig = [string]::Equals([string]$kontrollAktion.Arguments, $argumentZeile, [StringComparison]::Ordinal)
    $arbeitsordnerGueltig = [string]::Equals([string]$kontrollAktion.WorkingDirectory, (Split-Path -Path $fortsetzungsSkript -Parent), [StringComparison]::OrdinalIgnoreCase)
    $benutzerGueltig = ($principalSid -eq $erwarteteSid -and $triggerSid -eq $erwarteteSid)
    $runLevelGueltig = ([int]$kontrollDefinition.Principal.RunLevel -eq 1)
    $strukturGueltig = ([int]$kontrollDefinition.Actions.Count -eq 1 -and [int]$kontrollDefinition.Triggers.Count -eq 1 -and [int]$kontrollTrigger.Type -eq 9 -and [bool]$kontrollTrigger.Enabled -and [int]$kontrollDefinition.Principal.LogonType -eq 3 -and [bool]$kontrollDefinition.Settings.Enabled -and -not [bool]$kontrollDefinition.Settings.Hidden)
    if (-not $pfadGueltig -or -not $argumenteGueltig -or -not $arbeitsordnerGueltig -or -not $benutzerGueltig -or -not $runLevelGueltig -or -not $strukturGueltig) {
        $diagnose = "Pfad={0}; Argumente={1}; Arbeitsordner={2}; BenutzerSID={3}; RunLevel={4}; Struktur={5}; IstPfad='{6}'; SollPfad='{7}'; PrincipalSID='{8}'; TriggerSID='{9}'; SollSID='{10}'; IstRunLevel={11}" -f $pfadGueltig, $argumenteGueltig, $arbeitsordnerGueltig, $benutzerGueltig, $runLevelGueltig, $strukturGueltig, [string]$kontrollAktion.Path, $pwsh, $principalSid, $triggerSid, $erwarteteSid, [int]$kontrollDefinition.Principal.RunLevel
        try { $wurzel.DeleteTask($AufgabenName, 0) } catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }
        throw ("Die registrierte Neustart-Fortsetzungsaufgabe bestand ihre Nachkontrolle nicht. {0}" -f $diagnose)
    }
    return [pscustomobject]@{ Name = $AufgabenName; Benutzer = $benutzerName; PowerShell = $pwsh; Argumente = $argumentZeile; Skript = $fortsetzungsSkript }
}

function Remove-OneClickFortsetzungsaufgabe {
    param([Parameter(Mandatory = $true)][string]$AufgabenName)

    if ($AufgabenName -notmatch '^OneClick-Komplettreparatur-Fortsetzen-[0-9a-f]{16}$') {
        throw 'Eine Fortsetzungsaufgabe mit ungueltigem Namen wird nicht entfernt.'
    }
    $dienst = New-Object -ComObject 'Schedule.Service'
    $dienst.Connect()
    $wurzel = $dienst.GetFolder('\')
    $vorhanden = $null
    try { $vorhanden = $wurzel.GetTask($AufgabenName) } catch { $vorhanden = $null }
    if ($null -ne $vorhanden) {
        $wurzel.DeleteTask($AufgabenName, 0)
    }
    $rest = $null
    try { $rest = $wurzel.GetTask($AufgabenName) } catch { $rest = $null }
    if ($null -ne $rest) {
        throw 'Die Neustart-Fortsetzungsaufgabe ist nach der Entfernung noch registriert.'
    }
}

function Set-OneClickNeustartpause {
    param(
        [Parameter(Mandatory = $true)][ValidateSet('WindowsSystem', 'Programme')][string]$FortsetzungsPhase,
        [Parameter(Mandatory = $true)][ValidateSet('WindowsSystem', 'BenutzerUpdates', 'MaschinenUpdates', 'RegistryPruefung', 'BenutzerReparatur', 'MaschinenReparatur', 'Abschluss')][string]$FortsetzungsAbschnitt,
        [Parameter(Mandatory = $true)][string]$Grund
    )

    if (-not (Confirm-OneClickNeustartbedarf)) {
        throw 'Eine Neustartpause ohne aktuellen Prozess- oder Windows-Nachweis wurde verweigert.'
    }
    $gespeichert = Save-OneClickFortsetzungsstatus -Phase $FortsetzungsPhase -Abschnitt $FortsetzungsAbschnitt -Grund $Grund
    try {
        $aufgabe = Register-OneClickFortsetzungsaufgabe -StatusPfad ([string]$gespeichert.Pfade.StatusDatei) -AufgabenName ([string]$gespeichert.Pfade.AufgabenName) -SkriptPfad ([string]$gespeichert.Pfade.SkriptDatei)
    }
    catch {
        if (Test-Path -LiteralPath ([string]$gespeichert.Pfade.StatusDatei) -PathType Leaf) {
            Remove-Item -LiteralPath ([string]$gespeichert.Pfade.StatusDatei) -Force -ErrorAction SilentlyContinue
        }
        if (Test-Path -LiteralPath ([string]$gespeichert.Pfade.SkriptDatei) -PathType Leaf) {
            $null = Remove-OneClickKontrolliertenLaufpfad -Pfad ([string]$gespeichert.Pfade.SkriptDatei) -Basis ([string]$gespeichert.Pfade.Basis) -ErlaubtesNamensmuster '^OneClick-Komplettreparatur-Fortsetzung-[0-9a-f]{16}\.ps1$'
        }
        throw
    }
    $script:FortsetzungsPhase = $FortsetzungsPhase
    $script:FortsetzungsAbschnitt = $FortsetzungsAbschnitt
    $script:FortsetzungsStatus = $gespeichert.Status
    $script:NeustartPauseAktiv = $true
    $script:NeustartGrund = $Grund
    $script:NeustartDialogNachAbschluss = $true
    $script:NeustartErforderlich = $true
    Add-Resultat -Bereich 'Neustart' -Aktion 'Lauf pausieren und automatische Fortsetzung registrieren' -Status 'Erfolgreich gespeichert und nachkontrolliert' -ExitCode 3010 -Details ("Phase: {0}; Abschnitt: {1}; Aufgabe: {2}; Status: {3}; Grund: {4}" -f $FortsetzungsPhase, $FortsetzungsAbschnitt, $aufgabe.Name, $gespeichert.Pfade.StatusDatei, $Grund)
    Write-Status -Text ("Reparaturlauf pausiert. Nach dem Windows-Neustart und der Anmeldung wird automatisch mit Abschnitt '{0}' fortgesetzt." -f $FortsetzungsAbschnitt) -Stufe 'OK'
}

function Suspend-OneClickBeiNeustart {
    param(
        [Parameter(Mandatory = $true)][ValidateSet('WindowsSystem', 'Programme')][string]$FortsetzungsPhase,
        [Parameter(Mandatory = $true)][ValidateSet('WindowsSystem', 'BenutzerUpdates', 'MaschinenUpdates', 'RegistryPruefung', 'BenutzerReparatur', 'MaschinenReparatur', 'Abschluss')][string]$FortsetzungsAbschnitt,
        [Parameter(Mandatory = $true)][string]$Grund
    )

    if (-not $script:NeustartErforderlich) { return $false }
    if (-not (Confirm-OneClickNeustartbedarf)) { return $false }
    Set-OneClickNeustartpause -FortsetzungsPhase $FortsetzungsPhase -FortsetzungsAbschnitt $FortsetzungsAbschnitt -Grund $Grund
    throw (New-OneClickNeustartAusnahme -Meldung ("Der Lauf wurde fuer einen erforderlichen Windows-Neustart pausiert: {0}" -f $Grund))
}

function Remove-OneClickVeralteteVorabFortsetzung {
    if ($FortsetzenNachNeustart -or -not (Test-IstAdministrator)) { return $false }

    $pfade = Get-OneClickFortsetzungsPfade
    $statusPfad = [IO.Path]::GetFullPath([string]$pfade.StatusDatei)
    $skriptPfad = [IO.Path]::GetFullPath([string]$pfade.SkriptDatei)
    if (-not (Test-Path -LiteralPath $statusPfad -PathType Leaf)) { return $false }

    $statusInfo = Get-Item -LiteralPath $statusPfad -Force -ErrorAction Stop
    if (($statusInfo.Attributes -band [IO.FileAttributes]::ReparsePoint) -or $statusInfo.Length -le 0 -or $statusInfo.Length -gt 1048576) {
        return $false
    }

    try {
        $klartext = [Security.Cryptography.ProtectedData]::Unprotect(
            [IO.File]::ReadAllBytes($statusPfad),
            (Get-OneClickFortsetzungsEntropie),
            [Security.Cryptography.DataProtectionScope]::CurrentUser
        )
        $status = [Text.Encoding]::UTF8.GetString($klartext) | ConvertFrom-Json -ErrorAction Stop
    }
    catch {
        Write-Verbose ("Ein vorhandener Fortsetzungsstatus gehoert nicht zur sicher erkennbaren Vorabpruefungs-Migration: {0}" -f $_.Exception.Message)
        return $false
    }

    $grund = Get-SichererText -Objekt $status -Name 'Grund'
    $istFehlerhafterVorabstatus = (
        [int](Get-SichereEigenschaft -Objekt $status -Name 'Schema' -Standardwert 0) -eq 2 -and
        [string]::Equals((Get-SichererText -Objekt $status -Name 'Version'), $script:Version, [StringComparison]::Ordinal) -and
        [string]::Equals((Get-SichererText -Objekt $status -Name 'Computer'), [string]$env:COMPUTERNAME, [StringComparison]::OrdinalIgnoreCase) -and
        [string]::Equals((Get-SichererText -Objekt $status -Name 'BenutzerSid'), (Get-OneClickBenutzerSid), [StringComparison]::OrdinalIgnoreCase) -and
        [string]::Equals((Get-SichererText -Objekt $status -Name 'Phase'), 'WindowsSystem', [StringComparison]::Ordinal) -and
        [string]::Equals((Get-SichererText -Objekt $status -Name 'Abschnitt'), 'WindowsSystem', [StringComparison]::Ordinal) -and
        $grund.StartsWith('Windows meldet vor der naechsten Reparaturphase:', [StringComparison]::Ordinal) -and
        [string]::Equals((Get-SichererText -Objekt $status -Name 'AufgabenName'), [string]$pfade.AufgabenName, [StringComparison]::Ordinal) -and
        [string]::Equals([IO.Path]::GetFullPath((Get-SichererText -Objekt $status -Name 'SkriptPfad')), $skriptPfad, [StringComparison]::OrdinalIgnoreCase)
    )
    if (-not $istFehlerhafterVorabstatus -or -not (Test-Path -LiteralPath $skriptPfad -PathType Leaf)) { return $false }

    $gespeicherterHash = (Get-SichererText -Objekt $status -Name 'SkriptSHA256').ToUpperInvariant()
    $kopieHash = (Get-FileHash -LiteralPath $skriptPfad -Algorithm SHA256 -ErrorAction Stop).Hash.ToUpperInvariant()
    if ([string]::IsNullOrWhiteSpace($gespeicherterHash) -or -not [string]::Equals($gespeicherterHash, $kopieHash, [StringComparison]::Ordinal)) {
        return $false
    }

    Remove-OneClickFortsetzungsaufgabe -AufgabenName ([string]$pfade.AufgabenName)
    $statusEntfernung = Remove-OneClickKontrolliertenLaufpfad -Pfad $statusPfad -Basis ([string]$pfade.Basis) -ErlaubtesNamensmuster '^Fortsetzungsstatus-[0-9a-f]{16}\.dpapi$' -NichtZaehlen
    $skriptEntfernung = Remove-OneClickKontrolliertenLaufpfad -Pfad $skriptPfad -Basis ([string]$pfade.Basis) -ErlaubtesNamensmuster '^OneClick-Komplettreparatur-Fortsetzung-[0-9a-f]{16}\.ps1$' -NichtZaehlen
    if (-not [bool]$statusEntfernung.Entfernt -or -not [bool]$skriptEntfernung.Entfernt) {
        throw 'Die veraltete Vorabpruefungs-Fortsetzung konnte nicht vollstaendig entfernt werden.'
    }

    Add-Resultat -Bereich 'Neustart' -Aktion 'Veraltete fehlerhafte Vorabfortsetzung bereinigen' -Status 'Aufgabe, Status und Skriptkopie entfernt' -ExitCode 0 -Details $grund
    Write-Status -Text 'Eine von der frueheren fehlerhaften Neustartvorpruefung hinterlassene Fortsetzungsaufgabe wurde sicher erkannt und entfernt.' -Stufe 'OK'
    return $true
}

function Complete-OneClickFortsetzung {
    if (-not $FortsetzenNachNeustart -or $null -eq $script:FortsetzungsStatus) { return }
    $aufgabenName = Get-SichererText -Objekt $script:FortsetzungsStatus -Name 'AufgabenName'
    if (-not [string]::IsNullOrWhiteSpace($aufgabenName)) {
        Remove-OneClickFortsetzungsaufgabe -AufgabenName $aufgabenName
    }
    if (-not [string]::IsNullOrWhiteSpace([string]$script:FortsetzungsStatusDatei) -and (Test-Path -LiteralPath $script:FortsetzungsStatusDatei -PathType Leaf)) {
        $pfade = Get-OneClickFortsetzungsPfade
        $null = Remove-OneClickKontrolliertenLaufpfad -Pfad $script:FortsetzungsStatusDatei -Basis $pfade.Basis -ErlaubtesNamensmuster '^Fortsetzungsstatus-[0-9a-f]{16}\.dpapi$'
    }
    if (-not [string]::IsNullOrWhiteSpace([string]$script:FortsetzungsSkriptDatei) -and (Test-Path -LiteralPath $script:FortsetzungsSkriptDatei -PathType Leaf)) {
        $pfade = Get-OneClickFortsetzungsPfade
        $null = Remove-OneClickKontrolliertenLaufpfad -Pfad $script:FortsetzungsSkriptDatei -Basis $pfade.Basis -ErlaubtesNamensmuster '^OneClick-Komplettreparatur-Fortsetzung-[0-9a-f]{16}\.ps1$'
    }
    Add-Resultat -Bereich 'Neustart' -Aktion 'Automatische Fortsetzung abschliessen' -Status 'Aufgabe und Fortsetzungsstatus entfernt und nachkontrolliert' -ExitCode 0
    Write-Status -Text 'Die automatische Neustartfortsetzung wurde erfolgreich abgeschlossen und bereinigt.' -Stufe 'OK'
}

function Show-OneClickNeustartfunktion {
    if (-not $script:NeustartPauseAktiv) { return }
    Write-KonsolentextSicher -Text ''
    Write-KonsolentextSicher -Text '============================================================' -Farbe 'Yellow'
    Write-KonsolentextSicher -Text ' Windows-Neustart erforderlich - Reparaturlauf ist pausiert' -Farbe 'Yellow'
    Write-KonsolentextSicher -Text '============================================================' -Farbe 'Yellow'
    Write-KonsolentextSicher -Text (" Grund: {0}" -f $script:NeustartGrund)
    Write-KonsolentextSicher -Text (" Fortsetzung: {0} / {1}" -f $script:FortsetzungsPhase, $script:FortsetzungsAbschnitt)
    Write-KonsolentextSicher -Text ' Nach Neustart und Anmeldung startet die Fortsetzung automatisch.' -Farbe 'Green'
    Write-KonsolentextSicher -Text ' [1] Windows jetzt in 1,00 Minute neu starten'
    Write-KonsolentextSicher -Text ' [2] Spaeter selbst neu starten (Fortsetzungsaufgabe bleibt aktiv)'

    if ($NeustartSpaeter -or -not [Environment]::UserInteractive) {
        Write-Status -Text 'Nichtinteraktiver Modus: Windows wird nicht automatisch neu gestartet. Die Fortsetzungsaufgabe bleibt registriert.' -Stufe 'INFO'
        return
    }
    $antwort = ''
    try { $antwort = (Read-Host 'Auswahl [1/2]').Trim() }
    catch {
        Write-Status -Text 'Die Neustartauswahl konnte nicht gelesen werden. Windows wird spaeter manuell neu gestartet.' -Stufe 'INFO'
        return
    }
    if ($antwort -notin @('1', 'j', 'J', 'ja', 'JA', 'Ja')) {
        Write-Status -Text 'Windows wird spaeter manuell neu gestartet. Die automatische Fortsetzung bleibt aktiv.' -Stufe 'INFO'
        return
    }
    $shutdown = Get-WindowsSystemdateiPfad -Dateiname 'shutdown.exe'
    if ([string]::IsNullOrWhiteSpace($shutdown)) {
        Write-Status -Text 'shutdown.exe wurde nicht im geschuetzten Windows-Systemverzeichnis gefunden. Bitte Windows manuell neu starten.' -Stufe 'FEHLER'
        return
    }
    $shutdownArgumente = @('/r', '/t', '60', '/d', 'p:4:1', '/c', 'OneClick-Komplettreparatur wird nach der Anmeldung automatisch fortgesetzt.')
    $shutdownArgumentZeile = (@($shutdownArgumente | ForEach-Object { ConvertTo-WindowsArgument -Wert ([string]$_) }) -join ' ')
    $prozess = Start-Process -FilePath $shutdown -ArgumentList $shutdownArgumentZeile -PassThru -Wait -WindowStyle Hidden -ErrorAction Stop
    if ([int]$prozess.ExitCode -ne 0) {
        Write-Status -Text ("Windows-Neustart konnte nicht geplant werden (Exitcode {0}). Bitte Windows manuell neu starten." -f $prozess.ExitCode) -Stufe 'FEHLER'
        return
    }
    Write-Status -Text 'Windows-Neustart ist fuer 1,00 Minute geplant. Abbruch ist mit shutdown.exe /a moeglich.' -Stufe 'OK'
}

function ConvertTo-VerknuepfungsVergleichstext {
    param([AllowEmptyString()][string]$Text)

    if ([string]::IsNullOrWhiteSpace($Text)) { return '' }
    $normalisiert = $Text.Normalize([Text.NormalizationForm]::FormD)
    $zeichen = New-Object Text.StringBuilder
    foreach ($zeichenWert in $normalisiert.ToCharArray()) {
        if ([Globalization.CharUnicodeInfo]::GetUnicodeCategory($zeichenWert) -ne [Globalization.UnicodeCategory]::NonSpacingMark -and
            [char]::IsLetterOrDigit($zeichenWert)) {
            [void]$zeichen.Append([char]::ToLowerInvariant($zeichenWert))
        }
    }
    return $zeichen.ToString()
}

function Test-DesktopVerknuepfungNichtAnwendbar {
    param(
        [AllowEmptyString()][string]$Id,
        [AllowEmptyString()][string]$Anzeigename
    )

    if (-not [string]::IsNullOrWhiteSpace($Id) -and (Test-PaketAusgeschlossen -Id $Id)) { return $true }
    $text = ("{0} {1}" -f $Id, $Anzeigename)
    return ($text -match '(?i)(runtime|redistributable|framework|development kit|developer pack|\bSDK\b|\bJDK\b|\bJRE\b|driver|firmware|codec|language pack|sprachpaket|build tools|debugging tools|command.line|\bCLI\b|extension|plugin|windows app runtime|vclibs|directx)')
}

function Get-DesktopVerknuepfungsBewertung {
    param(
        [Parameter(Mandatory = $true)][string]$Name,
        [AllowEmptyCollection()][string[]]$Vergleichswerte = @()
    )

    $normalisierterName = ConvertTo-VerknuepfungsVergleichstext -Text $Name
    if ([string]::IsNullOrWhiteSpace($normalisierterName)) { return 0 }
    $beste = 0
    foreach ($wert in @($Vergleichswerte | Select-Object -Unique)) {
        if ([string]::IsNullOrWhiteSpace($wert) -or $wert.Length -lt 3) { continue }
        if ($normalisierterName -eq $wert) { $beste = [Math]::Max($beste, 100); continue }
        if ($normalisierterName.StartsWith($wert, [StringComparison]::Ordinal) -or $wert.StartsWith($normalisierterName, [StringComparison]::Ordinal)) {
            $beste = [Math]::Max($beste, 85)
            continue
        }
        if ($normalisierterName.Contains($wert, [StringComparison]::Ordinal) -or $wert.Contains($normalisierterName, [StringComparison]::Ordinal)) {
            $beste = [Math]::Max($beste, 70)
        }
    }
    return $beste
}

function Ensure-DesktopVerknuepfungFuerProgramm {
    param(
        [AllowEmptyString()][string]$Id,
        [AllowEmptyString()][string]$Anzeigename,
        [Parameter(Mandatory = $true)][ValidateSet('user', 'machine')][string]$Scope,
        [ValidateSet('winget', 'msstore', 'msi')][string]$Quelle = 'winget',
        [AllowEmptyString()][string]$DesktopOrdner = '',
        [AllowEmptyCollection()][string[]]$StartmenueWurzeln = @(),
        [switch]$FehlerIstFatal
    )

    $aktion = if ([string]::IsNullOrWhiteSpace($Id)) { $Anzeigename } else { $Id }
    if (Test-DesktopVerknuepfungNichtAnwendbar -Id $Id -Anzeigename $Anzeigename) {
        $script:DesktopVerknuepfungenNichtAnwendbar++
        Add-Resultat -Bereich 'Desktop-Verknuepfung' -Aktion $aktion -Status 'Nicht anwendbar' -ExitCode 0 -Details 'Laufzeit-, Treiber-, Framework- oder Hilfskomponente ohne eigenstaendige Desktop-Anwendung.'
        return [pscustomobject]@{ Erfolgreich = $true; Status = 'NichtAnwendbar'; Pfad = '' }
    }

    $terminalName = if ([string]::IsNullOrWhiteSpace($Id)) { '' } else { ($Id -split '\.')[-1] }
    $vergleichswerte = New-Object 'System.Collections.Generic.List[string]'
    foreach ($wert in @($Anzeigename, $terminalName, ($Id -replace '[._+\-]+', ' '))) {
        $normalisiert = ConvertTo-VerknuepfungsVergleichstext -Text $wert
        if (-not [string]::IsNullOrWhiteSpace($normalisiert) -and $normalisiert.Length -ge 3 -and
            $normalisiert -notin @('app', 'application', 'desktop', 'client', 'setup', 'installer', 'program', 'programm')) {
            $vergleichswerte.Add($normalisiert) | Out-Null
        }
    }
    if ($vergleichswerte.Count -eq 0) {
        $script:DesktopVerknuepfungenNichtAnwendbar++
        Add-Resultat -Bereich 'Desktop-Verknuepfung' -Aktion $aktion -Status 'Nicht anwendbar' -ExitCode 0 -Details 'Kein eindeutiger Programmname fuer eine sichere Verknuepfung vorhanden.'
        return [pscustomobject]@{ Erfolgreich = $true; Status = 'NichtAnwendbar'; Pfad = '' }
    }

    $zielDesktop = $DesktopOrdner
    if ([string]::IsNullOrWhiteSpace($zielDesktop)) {
        # Auch computerweit installierte Programme erhalten die Verknuepfung
        # ausschliesslich auf dem Desktop des aktuell angemeldeten Kontos.
        $zielDesktop = [Environment]::GetFolderPath([Environment+SpecialFolder]::DesktopDirectory)
    }

    $teilErgebnis = $null
    try {
        if ([string]::IsNullOrWhiteSpace($zielDesktop) -or -not (Test-Path -LiteralPath $zielDesktop -PathType Container)) {
            throw 'Der Desktopordner des aktuellen Benutzers ist nicht verfuegbar.'
        }
        $zielDesktop = [IO.Path]::GetFullPath($zielDesktop).TrimEnd([char]92)
        $desktopInfo = Get-Item -LiteralPath $zielDesktop -Force -ErrorAction Stop
        if ($desktopInfo.Attributes -band [IO.FileAttributes]::ReparsePoint) {
            throw 'Der Desktopordner ist eine nicht zugelassene Verzeichnisumleitung.'
        }

        foreach ($vorhanden in @(Get-ChildItem -LiteralPath $zielDesktop -Filter '*.lnk' -File -Force -ErrorAction SilentlyContinue)) {
            if ($vorhanden.Length -gt 0 -and (Get-DesktopVerknuepfungsBewertung -Name $vorhanden.BaseName -Vergleichswerte $vergleichswerte.ToArray()) -ge 85) {
                $script:DesktopVerknuepfungenVorhanden++
                Write-Status -Text ("Desktop-Verknuepfung bereits vorhanden: {0}" -f $vorhanden.FullName) -Stufe 'OK'
                Add-Resultat -Bereich 'Desktop-Verknuepfung' -Aktion $aktion -Status 'Bereits vorhanden' -ExitCode 0 -Details $vorhanden.FullName
                return [pscustomobject]@{ Erfolgreich = $true; Status = 'Vorhanden'; Pfad = $vorhanden.FullName }
            }
        }

        $wurzeln = New-Object 'System.Collections.Generic.List[string]'
        if ($StartmenueWurzeln.Count -gt 0) {
            foreach ($wurzel in $StartmenueWurzeln) { if (-not [string]::IsNullOrWhiteSpace($wurzel)) { $wurzeln.Add($wurzel) | Out-Null } }
        }
        else {
            foreach ($wurzel in @(
                [Environment]::GetFolderPath([Environment+SpecialFolder]::Programs),
                [Environment]::GetFolderPath([Environment+SpecialFolder]::CommonPrograms)
            )) {
                if (-not [string]::IsNullOrWhiteSpace($wurzel)) { $wurzeln.Add($wurzel) | Out-Null }
            }
        }

        $startKandidaten = New-Object 'System.Collections.Generic.List[object]'
        $wurzelIndex = 0
        foreach ($wurzelRoh in @($wurzeln.ToArray() | Select-Object -Unique)) {
            $wurzelIndex++
            if (-not (Test-Path -LiteralPath $wurzelRoh -PathType Container)) { continue }
            $wurzel = [IO.Path]::GetFullPath($wurzelRoh).TrimEnd([char]92)
            foreach ($link in @(Get-ChildItem -LiteralPath $wurzel -Filter '*.lnk' -File -Recurse -Force -ErrorAction SilentlyContinue)) {
                if (($link.Attributes -band [IO.FileAttributes]::ReparsePoint) -or -not (Test-PfadUnterBasis -Basis $wurzel -Kandidat $link.FullName) -or
                    $link.BaseName -match '(?i)(uninstall|deinstall|remove|repair|update|updater|help|hilfe|manual|handbuch|documentation|readme|release notes|website|webseite|crash|service)') {
                    continue
                }
                $bewertung = Get-DesktopVerknuepfungsBewertung -Name $link.BaseName -Vergleichswerte $vergleichswerte.ToArray()
                if ($bewertung -ge 70) {
                    $startKandidaten.Add([pscustomobject]@{ Datei = $link; Bewertung = $bewertung; WurzelIndex = $wurzelIndex }) | Out-Null
                }
            }
        }

        $besterStart = $startKandidaten.ToArray() | Sort-Object @{ Expression = 'Bewertung'; Descending = $true }, WurzelIndex, @{ Expression = { $_.Datei.FullName.Length }; Ascending = $true } | Select-Object -First 1
        if ($null -ne $besterStart) {
            $basisName = ConvertTo-SichererDateiname -Wert $besterStart.Datei.BaseName -MaximaleLaenge 100
            $zielPfad = Join-Path -Path $zielDesktop -ChildPath ($basisName + '.lnk')
            if (Test-Path -LiteralPath $zielPfad -PathType Leaf) {
                $zielPfad = Join-Path -Path $zielDesktop -ChildPath ($basisName + ' (OneClick).lnk')
            }
            Copy-Item -LiteralPath $besterStart.Datei.FullName -Destination $zielPfad -ErrorAction Stop
            $kopie = Get-Item -LiteralPath $zielPfad -Force -ErrorAction Stop
            if ($kopie.Length -le 0 -or ($kopie.Attributes -band [IO.FileAttributes]::ReparsePoint)) {
                throw 'Die kopierte Startmenue-Verknuepfung bestand die Nachkontrolle nicht.'
            }
            $script:DesktopVerknuepfungenErstellt++
            Write-Status -Text ("Desktop-Verknuepfung aus dem Startmenue angelegt: {0}" -f $zielPfad) -Stufe 'OK'
            Add-Resultat -Bereich 'Desktop-Verknuepfung' -Aktion $aktion -Status 'Erstellt und nachkontrolliert' -ExitCode 0 -Details ("Quelle: {0}; Ziel: {1}; Installationsscope bleibt {2}." -f $besterStart.Datei.FullName, $zielPfad, $Scope)
            return [pscustomobject]@{ Erfolgreich = $true; Status = 'Erstellt'; Pfad = $zielPfad }
        }

        # Fallback nur bei eindeutigem Registry-Programm und eindeutigem
        # ausfuehrbarem Ziel. Es wird niemals irgendeine beliebige EXE geraten.
        $registryTreffer = New-Object 'System.Collections.Generic.List[object]'
        foreach ($programm in @(Get-RegistryProgramme)) {
            $programmScope = Get-SichererText -Objekt $programm -Name 'Scope'
            if ($programmScope -ne $Scope -or (Test-RegistryProgrammSicherheitsausgeschlossen -Programm $programm)) { continue }
            $programmName = Get-SichererText -Objekt $programm -Name 'DisplayName'
            $bewertung = Get-DesktopVerknuepfungsBewertung -Name $programmName -Vergleichswerte $vergleichswerte.ToArray()
            if ($bewertung -ge 85) {
                $registryTreffer.Add([pscustomobject]@{ Programm = $programm; Bewertung = $bewertung }) | Out-Null
            }
        }

        $besteRegistry = @($registryTreffer.ToArray() | Sort-Object Bewertung -Descending)
        if ($besteRegistry.Count -eq 0) {
            $script:DesktopVerknuepfungenNichtAnwendbar++
            Add-Resultat -Bereich 'Desktop-Verknuepfung' -Aktion $aktion -Status 'Nicht anwendbar' -ExitCode 0 -Details 'Keine eigenstaendige Startmenue-Verknuepfung und kein eindeutig passender Registry-Programmeintrag vorhanden.'
            return [pscustomobject]@{ Erfolgreich = $true; Status = 'NichtAnwendbar'; Pfad = '' }
        }
        $hoechsteRegistryBewertung = [int]$besteRegistry[0].Bewertung
        $gleichBesteRegistry = @($besteRegistry | Where-Object { [int]$_.Bewertung -eq $hoechsteRegistryBewertung })
        if ($gleichBesteRegistry.Count -ne 1) {
            throw 'Mehrere gleichwertige Registry-Programme verhindern eine eindeutige Desktop-Verknuepfung.'
        }

        $registryProgramm = $gleichBesteRegistry[0].Programm
        $programmName = Get-SichererText -Objekt $registryProgramm -Name 'DisplayName' -Standardwert $Anzeigename
        $exeKandidaten = New-Object 'System.Collections.Generic.List[object]'
        $iconPfad = Resolve-RegistrierterDateipfad -Wert (Get-SichererText -Objekt $registryProgramm -Name 'DisplayIcon')
        if (-not [string]::IsNullOrWhiteSpace($iconPfad) -and [IO.Path]::GetExtension($iconPfad) -eq '.exe' -and (Get-PortableDateiPruefstatus -Pfad $iconPfad) -eq 'Gueltig') {
            $exeKandidaten.Add([pscustomobject]@{ Pfad = $iconPfad; Bewertung = 110 }) | Out-Null
        }
        $installationsPfad = Get-SichererText -Objekt $registryProgramm -Name 'InstallLocation'
        if (-not [string]::IsNullOrWhiteSpace($installationsPfad)) {
            try {
                $installationsPfad = [IO.Path]::GetFullPath([Environment]::ExpandEnvironmentVariables($installationsPfad.Trim().Trim('"')))
                if (Test-Path -LiteralPath $installationsPfad -PathType Container) {
                    foreach ($exe in @(Get-ChildItem -LiteralPath $installationsPfad -Filter '*.exe' -File -Force -ErrorAction SilentlyContinue)) {
                        if ($exe.Name -match '(?i)(unins|uninstall|remove|repair|update|updater|setup|install|crash|helper|service|report|diagnostic)' -or
                            (Get-PortableDateiPruefstatus -Pfad $exe.FullName) -ne 'Gueltig') { continue }
                        $bewertung = Get-DesktopVerknuepfungsBewertung -Name $exe.BaseName -Vergleichswerte $vergleichswerte.ToArray()
                        try {
                            $produktName = [string]$exe.VersionInfo.ProductName
                            $bewertung = [Math]::Max($bewertung, (Get-DesktopVerknuepfungsBewertung -Name $produktName -Vergleichswerte $vergleichswerte.ToArray()))
                        }
                        catch { Write-Verbose ("Produktname einer EXE konnte nicht gelesen werden: {0}" -f $_.Exception.Message) }
                        if ($bewertung -ge 70) { $exeKandidaten.Add([pscustomobject]@{ Pfad = $exe.FullName; Bewertung = $bewertung }) | Out-Null }
                    }
                }
            }
            catch { Write-Verbose ("Installationspfad konnte nicht fuer die Verknuepfung ausgewertet werden: {0}" -f $_.Exception.Message) }
        }

        $exeSortiert = @($exeKandidaten.ToArray() | Sort-Object @{ Expression = 'Bewertung'; Descending = $true }, @{ Expression = 'Pfad'; Descending = $false } -Unique)
        if ($exeSortiert.Count -eq 0) { throw 'Fuer das eindeutig registrierte Programm wurde kein sicheres ausfuehrbares Verknuepfungsziel gefunden.' }
        $hoechsteExeBewertung = [int]$exeSortiert[0].Bewertung
        $gleichBesteExes = @($exeSortiert | Where-Object { [int]$_.Bewertung -eq $hoechsteExeBewertung })
        if ($gleichBesteExes.Count -ne 1) { throw 'Mehrere gleichwertige Programmdateien verhindern eine eindeutige Desktop-Verknuepfung.' }
        $zielExe = [string]$gleichBesteExes[0].Pfad

        $linkName = ConvertTo-SichererDateiname -Wert $(if ([string]::IsNullOrWhiteSpace($programmName)) { $terminalName } else { $programmName }) -MaximaleLaenge 100
        $zielPfad = Join-Path -Path $zielDesktop -ChildPath ($linkName + '.lnk')
        if (Test-Path -LiteralPath $zielPfad -PathType Leaf) { $zielPfad = Join-Path -Path $zielDesktop -ChildPath ($linkName + ' (OneClick).lnk') }
        $shell = $null
        $shortcut = $null
        try {
            $shell = New-Object -ComObject 'WScript.Shell'
            $shortcut = $shell.CreateShortcut($zielPfad)
            $shortcut.TargetPath = $zielExe
            $shortcut.WorkingDirectory = [IO.Path]::GetDirectoryName($zielExe)
            $shortcut.IconLocation = $zielExe + ',0'
            $shortcut.Description = ("OneClick-Verknuepfung fuer {0}" -f $programmName)
            $shortcut.Save()
        }
        finally {
            if ($null -ne $shortcut -and [Runtime.InteropServices.Marshal]::IsComObject($shortcut)) { [void][Runtime.InteropServices.Marshal]::FinalReleaseComObject($shortcut) }
            if ($null -ne $shell -and [Runtime.InteropServices.Marshal]::IsComObject($shell)) { [void][Runtime.InteropServices.Marshal]::FinalReleaseComObject($shell) }
        }
        $erstellt = Get-Item -LiteralPath $zielPfad -Force -ErrorAction Stop
        if ($erstellt.Length -le 0 -or ($erstellt.Attributes -band [IO.FileAttributes]::ReparsePoint)) { throw 'Die erstellte Desktop-Verknuepfung bestand die Dateinachkontrolle nicht.' }

        $script:DesktopVerknuepfungenErstellt++
        Write-Status -Text ("Desktop-Verknuepfung angelegt und nachkontrolliert: {0}" -f $zielPfad) -Stufe 'OK'
        Add-Resultat -Bereich 'Desktop-Verknuepfung' -Aktion $aktion -Status 'Erstellt und nachkontrolliert' -ExitCode 0 -Details ("Programmdatei: {0}; Ziel: {1}; Installationsscope bleibt {2}." -f $zielExe, $zielPfad, $Scope)
        return [pscustomobject]@{ Erfolgreich = $true; Status = 'Erstellt'; Pfad = $zielPfad }
    }
    catch {
        $script:DesktopVerknuepfungenFehlgeschlagen++
        $meldung = $_.Exception.Message
        Add-Warnung -Text ("Desktop-Verknuepfung fuer '{0}' konnte nicht sicher angelegt werden: {1}" -f $aktion, $meldung)
        Add-Resultat -Bereich 'Desktop-Verknuepfung' -Aktion $aktion -Status 'Fehlgeschlagen' -ExitCode -1 -Details ("Quelle: {0}; Scope: {1}; {2}" -f $Quelle, $Scope, $meldung)
        if ($FehlerIstFatal) { throw }
        $teilErgebnis = [pscustomobject]@{ Erfolgreich = $false; Status = 'Fehlgeschlagen'; Pfad = '' }
    }
    return $teilErgebnis
}

function Get-WinGetErgebniskategorie {
    param(
        [int]$ExitCode,
        [AllowEmptyString()][string]$Ausgabe = ''
    )

    $text = [string]$Ausgabe

    # Textmeldungen werden vor dem allgemeinen Erfolgscode ausgewertet. Einige
    # WinGet-Versionen melden einen leeren Suchtreffer in Sonderfällen mit Exitcode 0.
    if ($text -match '(?i)(no installed packages? found|no packages? found|kein installiertes paket gefunden|keine installierten pakete gefunden|keine pakete gefunden|kein paket gefunden|den eingabekriterien.*entspricht)') {
        return 'KeinePakete'
    }
    if ($text -match '(?i)(no applicable (upgrades?|updates?)|no available (upgrades?|updates?)|keine anwendbaren? (aktualisierungen?|upgrades?|updates?)|keine verf(?:ue|ü)gbaren? (aktualisierungen?|upgrades?|updates?)|kein anwendbares update|keine updates? verf(?:ue|ü)gbar|bereits.*aktuell)') {
        return 'KeineAktualisierung'
    }
    if ($text -match '(?i)(upgrade --all completed with failures|mindestens eine.*aktualisierung.*fehlgeschlagen)') {
        return 'TeilweiseFehlgeschlagen'
    }

    if ($ExitCode -eq 0) {
        return 'Erfolg'
    }
    if ($ExitCode -in @(1641, 3010)) {
        return 'ErfolgNeustart'
    }

    # WinGet-spezifische Installer-Rueckgabecodes.
    if ($ExitCode -in @(-1978334967, -1978334965)) {
        return 'ErfolgNeustart'
    }
    if ($ExitCode -eq -1978334966) {
        return 'NeustartVorUpdate'
    }

    if ($ExitCode -in @(
        -1978335189, # Keine anwendbare Aktualisierung
        -1978335153, # Verfuegbare Version ist nicht neuer
        -1978335104, # Kein anwendbares Store-Paket
        -1978335102  # Keine anwendbaren Store-Downloadinformationen
    )) {
        return 'KeineAktualisierung'
    }
    if ($ExitCode -eq -1978335212) {
        return 'KeinePakete'
    }
    if ($ExitCode -eq -1978335188) {
        return 'TeilweiseFehlgeschlagen'
    }

    # Diese Zustaende sind kein Skriptfehler. Das Paket wird bewusst nicht erzwungen.
    if ($ExitCode -in @(
        -1978335152, # Installierte Version unbekannt
        -1978335135, # Paket bereits installiert
        -1978335128, # Paket ist angeheftet
        -1978334963, # Andere Version bereits installiert
        -1978334962  # Hoehere Version bereits installiert
    )) {
        return 'Uebersprungen'
    }

    # Hier ist eine Benutzeraktion oder ein anderer Ausfuehrungskontext erforderlich.
    if ($ExitCode -in @(
        -1978335107, # Aktion im Administratorkontext nicht erlaubt
        -1978335090, # Installationstechnologie unterscheidet sich
        -1978334975, # Anwendung wird verwendet
        -1978334973, # Datei wird verwendet
        -1978334956  # Installer unterstuetzt kein Upgrade
    )) {
        return 'Benutzeraktion'
    }

    return 'Fehler'
}

function Get-WinGetFehlerbeschreibung {
    param(
        [int]$ExitCode,
        [AllowEmptyString()][string]$Ausgabe = ''
    )

    $bekannt = @{
        '3010' = 'Erfolgreich; Windows-Neustart erforderlich'
        '1641' = 'Erfolgreich; Windows-Neustart wurde eingeleitet'
        '0' = 'Erfolgreich'
        '-1978334956' = 'Das Installationsprogramm unterstuetzt kein direktes Upgrade'
        '-1978334961' = 'Die Installation ist durch eine Organisationsrichtlinie blockiert'
        '-1978334962' = 'Eine hoehere Programmversion ist bereits installiert'
        '-1978334963' = 'Eine andere Programmversion ist bereits installiert'
        '-1978334965' = 'Erfolgreich; ein Windows-Neustart wurde eingeleitet'
        '-1978334966' = 'Vor der Aktualisierung ist ein Windows-Neustart erforderlich'
        '-1978334967' = 'Aktualisierung abgeschlossen; Windows-Neustart zum Fertigstellen erforderlich'
        '-1978334969' = 'Fuer die Installation ist eine funktionierende Netzwerkverbindung erforderlich'
        '-1978334971' = 'Nicht genuegend freier Speicherplatz'
        '-1978334973' = 'Mindestens eine benoetigte Datei wird gerade verwendet'
        '-1978334974' = 'Eine andere Installation wird bereits ausgefuehrt'
        '-1978334975' = 'Die zu aktualisierende Anwendung wird gerade verwendet'
        '-1978335090' = 'Die neue Version verwendet eine andere Installationstechnologie'
        '-1978335102' = 'Keine anwendbaren Microsoft-Store-Downloadinformationen gefunden'
        '-1978335103' = 'Microsoft-Store-Downloadinformationen konnten nicht abgerufen werden'
        '-1978335104' = 'Kein anwendbares Microsoft-Store-Paket gefunden'
        '-1978335105' = 'Microsoft-Store-Paketkatalog konnte nicht abgerufen werden'
        '-1978335107' = 'Die Aktion ist fuer ein Benutzerpaket im Administratorkontext nicht erlaubt'
        '-1978335123' = 'Ein benoetigter Dienst ist beschaeftigt oder nicht verfuegbar'
        '-1978335128' = 'Das Paket ist angeheftet und wird deshalb nicht aktualisiert'
        '-1978335131' = 'Mindestens eine Installation ist fehlgeschlagen'
        '-1978335135' = 'Das Paket ist bereits installiert'
        '-1978335146' = 'Installationsprogramm darf nicht mit Administratorrechten ausgefuehrt werden'
        '-1978335152' = 'Installierte Version ist unbekannt; Aktualisierung wurde nicht erzwungen'
        '-1978335153' = 'Verfuegbare Version ist nicht neuer als die installierte Version'
        '-1978335157' = 'Mindestens eine Paketquelle konnte nicht geoeffnet werden'
        '-1978335163' = 'Paketquelle konnte nicht geoeffnet werden'
        '-1978335169' = 'Quelldaten sind beschaedigt oder manipuliert'
        '-1978335173' = 'Interner Fehler der Paketquellen-API'
        '-1978335174' = 'Vorgang ist durch eine Gruppenrichtlinie blockiert'
        '-1978335175' = 'Paketquelle lieferte ungueltige Daten'
        '-1978335186' = 'Downloadgroesse stimmt nicht mit dem erwarteten Wert ueberein'
        '-1978335187' = 'Sicherheitspruefung des Installationsprogramms fehlgeschlagen'
        '-1978335188' = 'Mindestens eine Aktualisierung innerhalb von upgrade --all ist fehlgeschlagen'
        '-1978335189' = 'Keine anwendbare Aktualisierung gefunden'
        '-1978335202' = 'Installation aus dem Microsoft Store fehlgeschlagen'
        '-1978335204' = 'Microsoft-Store-App ist durch eine Richtlinie blockiert'
        '-1978335205' = 'Microsoft Store ist durch eine Richtlinie blockiert'
        '-1978335206' = 'Paketquelle ist nicht sicher'
        '-1978335207' = 'Administratorrechte erforderlich'
        '-1978335209' = 'Kein passendes Paketmanifest gefunden'
        '-1978335212' = 'Keine Pakete gefunden'
        '-1978335215' = 'Hash des Installationsprogramms stimmt nicht mit dem Manifest ueberein'
        '-1978335216' = 'Kein passendes Installationsprogramm fuer dieses System'
        '-1978335224' = 'Download des Installationsprogramms fehlgeschlagen'
        '-1978335228' = 'Paketmanifest konnte nicht geoeffnet werden'
        '-1978335229' = 'WinGet-Befehl fehlgeschlagen'
        '-1978335230' = 'Ungueltige WinGet-Befehlsargumente'
        '-1978335231' = 'Interner WinGet-Fehler'
    }

    $schluessel = [string]$ExitCode
    if ($bekannt.ContainsKey($schluessel)) {
        return [string]$bekannt[$schluessel]
    }

    $bereinigt = ([string]$Ausgabe).Replace("`r", ' ').Replace("`n", ' ').Trim()
    if ($bereinigt.Length -gt 240) {
        $bereinigt = $bereinigt.Substring(0, 237) + '...'
    }
    if (-not [string]::IsNullOrWhiteSpace($bereinigt)) {
        return $bereinigt
    }
    return ('Unbekannter WinGet-Exitcode {0}' -f $ExitCode)
}

function Get-WinGetUpgradeAnalyseAusText {
    param(
        [AllowEmptyString()][string]$Text,
        [Parameter(Mandatory = $true)][ValidateSet('winget', 'msstore')][string]$Quelle,
        [Parameter(Mandatory = $true)][ValidateSet('user', 'machine')][string]$Scope
    )

    $pakete = New-Object 'System.Collections.Generic.List[object]'
    $kopfGefunden = $false
    $datenZeilen = 0
    $unsichereZeilen = 0

    if ([string]::IsNullOrWhiteSpace($Text)) {
        return [pscustomobject]@{
            KopfGefunden = $false
            DatenZeilen = 0
            UnsichereZeilen = 0
            Pakete = @()
        }
    }

    $zeilen = @($Text -split "`r?`n")
    $kopfIndex = -1
    $idStart = -1
    $versionStart = -1
    $verfuegbarStart = -1
    $quelleStart = -1

    # WinGet lokalisiert die Spaltenbezeichnungen. Die Paket-ID-Spalte heisst
    # jedoch versions- und sprachuebergreifend "ID". Die realen Spaltenstarts
    # werden deshalb aus dem Tabellenkopf gelesen, statt englische oder deutsche
    # Woerter und eine immer vorhandene Quellenspalte vorauszusetzen. Bei einem
    # Aufruf mit --source laesst WinGet 1.29 die Quellenspalte regulaer weg.
    for ($i = 0; $i -lt $zeilen.Count; $i++) {
        $kopfZeile = [string]$zeilen[$i]
        $kopfToken = @([regex]::Matches($kopfZeile, '\S+'))
        if ($kopfToken.Count -lt 4) { continue }

        $idTokenIndex = -1
        for ($tokenIndex = 1; $tokenIndex -lt $kopfToken.Count; $tokenIndex++) {
            if ($kopfToken[$tokenIndex].Value -match '^(?i:ID)$') {
                $idTokenIndex = $tokenIndex
                break
            }
        }
        if ($idTokenIndex -lt 1 -or ($kopfToken.Count - $idTokenIndex) -lt 3) { continue }

        $idStart = [int]$kopfToken[$idTokenIndex].Index
        $versionStart = [int]$kopfToken[$idTokenIndex + 1].Index
        $verfuegbarStart = [int]$kopfToken[$idTokenIndex + 2].Index
        if (($kopfToken.Count - $idTokenIndex) -ge 4) {
            $quelleStart = [int]$kopfToken[$idTokenIndex + 3].Index
        }

        if ($idStart -le 0 -or $versionStart -le $idStart -or $verfuegbarStart -le $versionStart -or
            ($quelleStart -ge 0 -and $quelleStart -le $verfuegbarStart)) {
            $idStart = -1
            $versionStart = -1
            $verfuegbarStart = -1
            $quelleStart = -1
            continue
        }

        $kopfIndex = $i
        $kopfGefunden = $true
        break
    }

    if ($kopfIndex -lt 0) {
        return [pscustomobject]@{
            KopfGefunden = $false
            DatenZeilen = 0
            UnsichereZeilen = 0
            Pakete = @()
        }
    }

    $datenBegonnen = $false

    for ($i = $kopfIndex + 1; $i -lt $zeilen.Count; $i++) {
        $zeile = ([string]$zeilen[$i]).TrimEnd()

        if ($zeile -match '^\s*-{3,}\s*$') {
            continue
        }
        if ([string]::IsNullOrWhiteSpace($zeile)) {
            if ($datenBegonnen) { break }
            continue
        }

        # Zusammenfassungen und Hinweise sind kuerzer als die erforderlichen
        # Tabellenspalten und werden deshalb nicht als Paketzeilen gezaehlt.
        if ($zeile.Length -le $verfuegbarStart) { continue }

        $nameEnde = [Math]::Min($idStart, $zeile.Length)
        $idEnde = [Math]::Min($versionStart, $zeile.Length)
        $versionEnde = [Math]::Min($verfuegbarStart, $zeile.Length)
        $zeilenQuellenTreffer = if ($quelleStart -ge 0) {
            [regex]::Match($zeile, '(?i)(?<!\S)(?<source>winget|msstore)\s*$')
        }
        else { $null }
        $verfuegbarEnde = if ($null -ne $zeilenQuellenTreffer -and $zeilenQuellenTreffer.Success) {
            [int]$zeilenQuellenTreffer.Index
        }
        else { $zeile.Length }

        $name = $zeile.Substring(0, $nameEnde).Trim()
        $id = if ($idEnde -gt $idStart) { $zeile.Substring($idStart, $idEnde - $idStart).Trim() } else { '' }
        $installiert = if ($versionEnde -gt $versionStart) { $zeile.Substring($versionStart, $versionEnde - $versionStart).Trim() } else { '' }
        $verfuegbar = if ($verfuegbarEnde -gt $verfuegbarStart) { $zeile.Substring($verfuegbarStart, $verfuegbarEnde - $verfuegbarStart).Trim() } else { '' }
        $zeilenQuelle = if ($null -ne $zeilenQuellenTreffer -and $zeilenQuellenTreffer.Success) {
            $zeilenQuellenTreffer.Groups['source'].Value.Trim().ToLowerInvariant()
        }
        elseif ($quelleStart -lt 0) {
            $Quelle
        }
        else { '' }

        if ([string]::IsNullOrWhiteSpace($name) -or [string]::IsNullOrWhiteSpace($id) -or
            [string]::IsNullOrWhiteSpace($installiert) -or [string]::IsNullOrWhiteSpace($verfuegbar)) {
            continue
        }

        # Lange lokalisierte Zusammenfassungen koennen bis in die rechnerische
        # ID-Spalte reichen. Nur eine quelltypische ID oder eine sichtbar
        # abgeschnittene ID kennzeichnet tatsaechlich eine Paketdatenzeile.
        $idSiehtPaketartigAus = (
            (Test-SichereWinGetPaketIdFuerQuelle -Id $id -Quelle $Quelle) -or
            ($id -match '(\.\.\.|…)' -and $id -notmatch '\s')
        )
        if (-not $idSiehtPaketartigAus) { continue }

        $datenBegonnen = $true
        $datenZeilen++

        if ([string]::IsNullOrWhiteSpace($name) -or
            $zeilenQuelle -ne $Quelle -or
            $id -match '(\.\.\.|…)' -or
            -not (Test-SichereWinGetPaketIdFuerQuelle -Id $id -Quelle $zeilenQuelle) -or
            -not (Test-SichererWinGetVersionswert -Wert $installiert) -or
            -not (Test-SichererWinGetVersionswert -Wert $verfuegbar)) {
            $unsichereZeilen++
            continue
        }

        $pakete.Add([pscustomobject]@{
            Name = $name
            Id = $id
            Quelle = $zeilenQuelle
            Scope = $Scope
            Installiert = $installiert
            Verfuegbar = $verfuegbar
        }) | Out-Null
    }

    return [pscustomobject]@{
        KopfGefunden = $kopfGefunden
        DatenZeilen = $datenZeilen
        UnsichereZeilen = $unsichereZeilen
        Pakete = @($pakete.ToArray() | Sort-Object Id, Quelle, Scope -Unique)
    }
}

function Get-WinGetUpgradePaketeAusText {
    param(
        [AllowEmptyString()][string]$Text,
        [Parameter(Mandatory = $true)][ValidateSet('winget', 'msstore')][string]$Quelle,
        [Parameter(Mandatory = $true)][ValidateSet('user', 'machine')][string]$Scope
    )

    $analyse = Get-WinGetUpgradeAnalyseAusText -Text $Text -Quelle $Quelle -Scope $Scope
    return @((Get-SichereEigenschaft -Objekt $analyse -Name 'Pakete' -Standardwert @()))
}

function Get-VerfuegbareWinGetUpdates {
    param(
        [Parameter(Mandatory = $true)][string]$WinGet,
        [Parameter(Mandatory = $true)][ValidateSet('winget', 'msstore')][string]$Quelle,
        [Parameter(Mandatory = $true)][ValidateSet('user', 'machine')][string]$Scope
    )

    $argumente = @(
        'upgrade',
        '--source', $Quelle,
        '--scope', $Scope,
        '--accept-source-agreements',
        '--disable-interactivity'
    )

    $beschreibung = "Verfuegbare Aktualisierungen aus {0} fuer Scope {1} ermitteln" -f $Quelle, $Scope
    $ergebnis = Invoke-Native -Datei $WinGet -Argumente $argumente -Beschreibung $beschreibung -TimeoutSekunden 300 -FehlerNurResultat -AusgabeUnterdruecken
    $kategorie = Get-WinGetErgebniskategorie -ExitCode ([int]$ergebnis.ExitCode) -Ausgabe ([string]$ergebnis.Ausgabe)

    # Nur die reine Abfrage wird bei voruebergehenden Quellen-, Dienst- oder
    # Netzwerkfehlern einmal wiederholt. Es wird bewusst kein unkontrollierter
    # "upgrade --all"-Fallback mehr gestartet.
    if ($kategorie -eq 'Fehler' -and (Test-WinGetFehlerWiederholbar -ExitCode ([int]$ergebnis.ExitCode))) {
        Write-Status -Text ("Update-Abfrage fuer Quelle '{0}', Scope '{1}' war voruebergehend gestoert. Die Quelle wird aktualisiert und die Abfrage einmal wiederholt." -f $Quelle, $Scope) -Stufe 'WARNUNG'
        $quellenUpdate = Invoke-Native -Datei $WinGet -Argumente @('source', 'update', '--name', $Quelle, '--disable-interactivity') -Beschreibung ("WinGet-Quelle {0} vor erneuter Update-Abfrage aktualisieren" -f $Quelle) -TimeoutSekunden 300 -FehlerNurResultat -AusgabeUnterdruecken
        if ($quellenUpdate.Erfolgreich -and (Test-WinGetQuelle -WinGet $WinGet -Name $Quelle)) {
            Start-Sleep -Seconds 2
            $ergebnis = Invoke-Native -Datei $WinGet -Argumente $argumente -Beschreibung ("{0} erneut" -f $beschreibung) -TimeoutSekunden 300 -FehlerNurResultat -AusgabeUnterdruecken
            $kategorie = Get-WinGetErgebniskategorie -ExitCode ([int]$ergebnis.ExitCode) -Ausgabe ([string]$ergebnis.Ausgabe)
        }
    }

    if ($kategorie -in @('KeineAktualisierung', 'KeinePakete')) {
        Write-Status -Text ("Quelle '{0}', Scope '{1}': keine anwendbaren Aktualisierungen gefunden." -f $Quelle, $Scope) -Stufe 'OK'
        Add-Resultat -Bereich 'Programme' -Aktion ("Update-Suche {0}/{1}" -f $Quelle, $Scope) -Status 'Keine Aktualisierungen' -ExitCode ([int]$ergebnis.ExitCode) -Details ([string]$ergebnis.Ausgabe)
        return [pscustomobject]@{ Ermittelt = $true; Pakete = @(); Kategorie = $kategorie; Ausgabe = [string]$ergebnis.Ausgabe }
    }

    if ($kategorie -ne 'Erfolg') {
        $script:AusgelasseneUpdateKontexte++
        $beschreibungFehler = Get-WinGetFehlerbeschreibung -ExitCode ([int]$ergebnis.ExitCode) -Ausgabe ([string]$ergebnis.Ausgabe)
        Add-Warnung -Text ("Die Update-Abfrage fuer Quelle '{0}', Scope '{1}' konnte nicht sicher ausgewertet werden und wurde ohne Sammelupdate ausgelassen: {2} (Exitcode {3})." -f $Quelle, $Scope, $beschreibungFehler, [int]$ergebnis.ExitCode)
        Add-Resultat -Bereich 'Programme' -Aktion ("Update-Suche {0}/{1}" -f $Quelle, $Scope) -Status 'Sicher ausgelassen' -ExitCode ([int]$ergebnis.ExitCode) -Details ([string]$ergebnis.Ausgabe)
        return [pscustomobject]@{ Ermittelt = $true; Pakete = @(); Kategorie = $kategorie; Ausgabe = [string]$ergebnis.Ausgabe }
    }

    $analyse = Get-WinGetUpgradeAnalyseAusText -Text ([string]$ergebnis.Ausgabe) -Quelle $Quelle -Scope $Scope
    $kopfGefunden = [bool](Get-SichereEigenschaft -Objekt $analyse -Name 'KopfGefunden' -Standardwert $false)
    $datenZeilen = [int](Get-SichereEigenschaft -Objekt $analyse -Name 'DatenZeilen' -Standardwert 0)
    $unsichereZeilen = [int](Get-SichereEigenschaft -Objekt $analyse -Name 'UnsichereZeilen' -Standardwert 0)
    $pakete = @(Get-SichereEigenschaft -Objekt $analyse -Name 'Pakete' -Standardwert @())

    if (-not $kopfGefunden) {
        $script:AusgelasseneUpdateKontexte++
        Add-Warnung -Text ("Das WinGet-Ausgabeformat fuer Quelle '{0}', Scope '{1}' wurde nicht erkannt. Dieser Kontext wird sicher ausgelassen; ein fehleranfaelliges Sammelupdate wird nicht gestartet." -f $Quelle, $Scope)
        Add-Resultat -Bereich 'Programme' -Aktion ("Update-Suche {0}/{1}" -f $Quelle, $Scope) -Status 'Ausgabeformat nicht erkannt; sicher ausgelassen' -ExitCode ([int]$ergebnis.ExitCode) -Details ([string]$ergebnis.Ausgabe)
        return [pscustomobject]@{ Ermittelt = $true; Pakete = @(); Kategorie = 'NichtAuswertbar'; Ausgabe = [string]$ergebnis.Ausgabe }
    }

    if ($unsichereZeilen -gt 0) {
        $script:UnsichereUpdateZeilen += $unsichereZeilen
        Add-Warnung -Text ("Quelle '{0}', Scope '{1}': {2} nicht eindeutig auswertbare Update-Zeile(n) wurden sicher ausgelassen. {3} eindeutig erkannte Pakete werden weiterhin einzeln aktualisiert." -f $Quelle, $Scope, $unsichereZeilen, $pakete.Count)
        Add-Resultat -Bereich 'Programme' -Aktion ("Update-Parser {0}/{1}" -f $Quelle, $Scope) -Status 'Teilweise ausgewertet' -ExitCode 0 -Details ("Datenzeilen: {0}; sicher erkannt: {1}; ausgelassen: {2}" -f $datenZeilen, $pakete.Count, $unsichereZeilen)
    }

    if ($pakete.Count -eq 0) {
        if ($datenZeilen -gt 0) {
            $script:AusgelasseneUpdateKontexte++
            Add-Warnung -Text ("Quelle '{0}', Scope '{1}': Es wurden Update-Zeilen gefunden, aber keine Paket-ID konnte zweifelsfrei verarbeitet werden. Der Kontext wurde ohne Sammelupdate ausgelassen." -f $Quelle, $Scope)
            Add-Resultat -Bereich 'Programme' -Aktion ("Update-Suche {0}/{1}" -f $Quelle, $Scope) -Status 'Keine sichere Paket-ID; ausgelassen' -ExitCode 0 -Details ([string]$ergebnis.Ausgabe)
        }
        else {
            Write-Status -Text ("Quelle '{0}', Scope '{1}': keine sicher erkennbaren Aktualisierungen vorhanden." -f $Quelle, $Scope) -Stufe 'OK'
            Add-Resultat -Bereich 'Programme' -Aktion ("Update-Suche {0}/{1}" -f $Quelle, $Scope) -Status 'Keine Aktualisierungen' -ExitCode 0 -Details ([string]$ergebnis.Ausgabe)
        }
        return [pscustomobject]@{ Ermittelt = $true; Pakete = @(); Kategorie = 'KeineSicherenPakete'; Ausgabe = [string]$ergebnis.Ausgabe }
    }

    Write-Status -Text ("Quelle '{0}', Scope '{1}': {2} aktualisierbare Pakete eindeutig ermittelt." -f $Quelle, $Scope, $pakete.Count) -Stufe 'OK'
    return [pscustomobject]@{ Ermittelt = $true; Pakete = @($pakete); Kategorie = 'Erfolg'; Ausgabe = [string]$ergebnis.Ausgabe }
}

function Test-WinGetFehlerWiederholbar {
    param([int]$ExitCode)

    return ($ExitCode -in @(
        -1978335229, # Allgemeiner Befehlsfehler
        -1978335224, # Download fehlgeschlagen
        -1978335175, # REST-Quelle lieferte ungueltige Daten
        -1978335173, # REST-API interner Fehler
        -1978335169, # Quelldatenintegritaet
        -1978335163, # Quelle konnte nicht geoeffnet werden
        -1978335157, # Nicht alle Quellen konnten geoeffnet werden
        -1978335123, # Benoetigter Dienst nicht verfuegbar
        -1978335105, # Store-Katalog nicht verfuegbar
        -1978335103, # Store-Downloadinformationen nicht verfuegbar
        -1978334974, # Andere Installation laeuft
        -1978334969  # Netzwerk nicht verfuegbar
    ))
}

function Assert-WinGetQuarantaenePfadSicher {
    if ([string]::IsNullOrWhiteSpace([string]$script:WinGetQuarantaeneOrdner) -or
        [string]::IsNullOrWhiteSpace([string]$script:WinGetQuarantaeneDatei)) {
        throw 'Der getrennte WinGet-Quarantaenepfad wurde nicht initialisiert.'
    }

    $basis = Get-OneClickDokumenteBasis
    $erwarteterOrdner = [IO.Path]::GetFullPath((Join-Path -Path $basis -ChildPath 'OneClick-ProgrammReparatur-Quarantaene')).TrimEnd([char]92)
    $ordner = [IO.Path]::GetFullPath([string]$script:WinGetQuarantaeneOrdner).TrimEnd([char]92)
    $datei = [IO.Path]::GetFullPath([string]$script:WinGetQuarantaeneDatei)
    $dateiOrdner = [IO.Path]::GetDirectoryName($datei).TrimEnd([char]92)
    $dateiName = [IO.Path]::GetFileName($datei)

    if (-not [string]::Equals($ordner, $erwarteterOrdner, [StringComparison]::OrdinalIgnoreCase) -or
        -not [string]::Equals($dateiOrdner, $ordner, [StringComparison]::OrdinalIgnoreCase) -or
        $dateiName -notin @('Hauptlauf-WinGet-Update-Quarantaene.json', 'Benutzerlauf-WinGet-Update-Quarantaene.json') -or
        -not (Test-Path -LiteralPath $ordner -PathType Container) -or
        -not (Test-VerzeichnisketteOhneReparsePoint -Basis $basis -Kandidat $ordner)) {
        throw 'Der getrennte WinGet-Quarantaenepfad ist nicht vertrauenswuerdig.'
    }
    return $true
}

function Get-WinGetUpdateQuarantaene {
    if ([string]::IsNullOrWhiteSpace([string]$script:WinGetQuarantaeneDatei)) {
        return @()
    }
    $null = Assert-WinGetQuarantaenePfadSicher
    if (-not (Test-Path -LiteralPath $script:WinGetQuarantaeneDatei -PathType Leaf)) { return @() }

    try {
        $datei = Get-Item -LiteralPath $script:WinGetQuarantaeneDatei -Force -ErrorAction Stop
        if ($datei.Attributes -band [IO.FileAttributes]::ReparsePoint) {
            throw 'Die Quarantaenedatei ist eine Pfadumleitung.'
        }
        if ($datei.Length -gt 1MB) {
            throw 'Die Quarantaenedatei ueberschreitet die zulaessige Groesse.'
        }

        $text = Get-Content -LiteralPath $script:WinGetQuarantaeneDatei -Raw -Encoding UTF8 -ErrorAction Stop
        $daten = $text | ConvertFrom-Json -ErrorAction Stop
        if ([int](Get-SichereEigenschaft -Objekt $daten -Name 'SchemaVersion' -Standardwert 0) -ne 1) {
            throw 'Die Quarantaenedatei besitzt keine unterstuetzte Schemaversion.'
        }

        $gueltigeEintraege = New-Object 'System.Collections.Generic.List[object]'
        foreach ($eintrag in @(Get-SichereEigenschaft -Objekt $daten -Name 'Entries' -Standardwert @())) {
            $id = Get-SichererText -Objekt $eintrag -Name 'Id'
            $quelle = (Get-SichererText -Objekt $eintrag -Name 'Quelle').ToLowerInvariant()
            $scope = (Get-SichererText -Objekt $eintrag -Name 'Scope').ToLowerInvariant()
            $verfuegbar = Get-SichererText -Objekt $eintrag -Name 'Verfuegbar'
            $grund = Get-SichererText -Objekt $eintrag -Name 'Grund'

            if ($quelle -notin @('winget', 'msstore') -or
                $scope -notin @('user', 'machine') -or
                -not (Test-SichereWinGetPaketIdFuerQuelle -Id $id -Quelle $quelle) -or
                -not (Test-SichererWinGetVersionswert -Wert $verfuegbar) -or
                $grund -ne 'InstallerHashAbweichung') {
                continue
            }

            $zeitpunktWert = Get-SichereEigenschaft -Objekt $eintrag -Name 'Zeitpunkt' -Standardwert $null
            $zeitpunktText = ''
            try {
                if ($zeitpunktWert -is [DateTime]) {
                    $zeitpunktText = ([DateTime]$zeitpunktWert).ToUniversalTime().ToString('o', [Globalization.CultureInfo]::InvariantCulture)
                }
                elseif ($zeitpunktWert -is [DateTimeOffset]) {
                    $zeitpunktText = ([DateTimeOffset]$zeitpunktWert).ToUniversalTime().ToString('o', [Globalization.CultureInfo]::InvariantCulture)
                }
                else {
                    $zeitpunktKandidat = [string]$zeitpunktWert
                    $zeitpunkt = [DateTimeOffset]::MinValue
                    if ($zeitpunktKandidat -match '^\d{4}-\d{2}-\d{2}T' -and
                        [DateTimeOffset]::TryParse($zeitpunktKandidat, [Globalization.CultureInfo]::InvariantCulture, [Globalization.DateTimeStyles]::RoundtripKind, [ref]$zeitpunkt)) {
                        $zeitpunktText = $zeitpunkt.ToUniversalTime().ToString('o', [Globalization.CultureInfo]::InvariantCulture)
                    }
                }
            }
            catch { $zeitpunktText = '' }

            $gueltigeEintraege.Add([pscustomobject]@{
                Id = $id
                Quelle = $quelle
                Scope = $scope
                Verfuegbar = $verfuegbar
                Grund = $grund
                Zeitpunkt = $zeitpunktText
            }) | Out-Null
        }
        return @($gueltigeEintraege.ToArray() | Sort-Object Id, Quelle, Scope, Verfuegbar -Unique)
    }
    catch {
        throw ("Die WinGet-Sicherheitsquarantaene konnte nicht vertrauenswuerdig gelesen werden: {0}" -f $_.Exception.Message)
    }
}

function Test-WinGetUpdateIstQuarantiniert {
    param(
        [Parameter(Mandatory = $true)][AllowEmptyCollection()][object[]]$Eintraege,
        [Parameter(Mandatory = $true)][string]$Id,
        [Parameter(Mandatory = $true)][ValidateSet('winget', 'msstore')][string]$Quelle,
        [Parameter(Mandatory = $true)][ValidateSet('user', 'machine')][string]$Scope,
        [Parameter(Mandatory = $true)][string]$Verfuegbar
    )

    foreach ($eintrag in $Eintraege) {
        if ((Get-SichererText -Objekt $eintrag -Name 'Id') -eq $Id -and
            (Get-SichererText -Objekt $eintrag -Name 'Quelle') -eq $Quelle -and
            (Get-SichererText -Objekt $eintrag -Name 'Scope') -eq $Scope -and
            (Get-SichererText -Objekt $eintrag -Name 'Verfuegbar') -eq $Verfuegbar) {
            return $true
        }
    }
    return $false
}

function Set-WinGetUpdateQuarantaene {
    param(
        [Parameter(Mandatory = $true)][string]$Id,
        [Parameter(Mandatory = $true)][ValidateSet('winget', 'msstore')][string]$Quelle,
        [Parameter(Mandatory = $true)][ValidateSet('user', 'machine')][string]$Scope,
        [Parameter(Mandatory = $true)][string]$Verfuegbar
    )

    if ([string]::IsNullOrWhiteSpace([string]$script:WinGetQuarantaeneDatei) -or
        -not (Test-SichereWinGetPaketIdFuerQuelle -Id $Id -Quelle $Quelle) -or
        -not (Test-SichererWinGetVersionswert -Wert $Verfuegbar)) {
        throw 'Der WinGet-Quarantaeneeintrag ist ungueltig.'
    }
    $null = Assert-WinGetQuarantaenePfadSicher
    if (Test-Path -LiteralPath $script:WinGetQuarantaeneDatei) {
        $vorhandeneDatei = Get-Item -LiteralPath $script:WinGetQuarantaeneDatei -Force -ErrorAction Stop
        if ($vorhandeneDatei.Attributes -band [IO.FileAttributes]::ReparsePoint) {
            throw 'Die vorhandene WinGet-Quarantaenedatei ist eine Pfadumleitung.'
        }
    }

    $eintraege = New-Object 'System.Collections.Generic.List[object]'
    foreach ($eintrag in @(Get-WinGetUpdateQuarantaene)) {
        if ((Get-SichererText -Objekt $eintrag -Name 'Id') -eq $Id -and
            (Get-SichererText -Objekt $eintrag -Name 'Quelle') -eq $Quelle -and
            (Get-SichererText -Objekt $eintrag -Name 'Scope') -eq $Scope) {
            continue
        }
        $eintraege.Add($eintrag) | Out-Null
    }

    $eintraege.Add([pscustomobject]@{
        Id = $Id
        Quelle = $Quelle
        Scope = $Scope
        Verfuegbar = $Verfuegbar
        Grund = 'InstallerHashAbweichung'
        Zeitpunkt = (Get-Date).ToUniversalTime().ToString('o', [Globalization.CultureInfo]::InvariantCulture)
    }) | Out-Null

    $sortiert = @($eintraege.ToArray() | Sort-Object Zeitpunkt -Descending | Select-Object -First 512)
    $json = [pscustomobject]@{ SchemaVersion = 1; Entries = $sortiert } | ConvertTo-Json -Depth 5
    $utf8 = New-Object Text.UTF8Encoding($false)
    $stream = New-Object IO.FileStream($script:WinGetQuarantaeneDatei, [IO.FileMode]::Create, [IO.FileAccess]::Write, [IO.FileShare]::None)
    try {
        $bytes = $utf8.GetBytes($json)
        $stream.Write($bytes, 0, $bytes.Length)
        $stream.Flush($true)
    }
    finally {
        $stream.Dispose()
    }

    $geschrieben = Get-Item -LiteralPath $script:WinGetQuarantaeneDatei -Force -ErrorAction Stop
    if ($geschrieben.Length -le 0 -or ($geschrieben.Attributes -band [IO.FileAttributes]::ReparsePoint)) {
        throw 'Die WinGet-Quarantaenedatei wurde nicht sicher geschrieben.'
    }
}

function Test-WinGetPaketIstQuarantiniert {
    param(
        [Parameter(Mandatory = $true)][AllowEmptyCollection()][object[]]$Eintraege,
        [Parameter(Mandatory = $true)][string]$Id,
        [Parameter(Mandatory = $true)][ValidateSet('winget', 'msstore')][string]$Quelle,
        [Parameter(Mandatory = $true)][ValidateSet('user', 'machine')][string]$Scope
    )

    foreach ($eintrag in $Eintraege) {
        if ((Get-SichererText -Objekt $eintrag -Name 'Id') -eq $Id -and
            (Get-SichererText -Objekt $eintrag -Name 'Quelle') -eq $Quelle -and
            (Get-SichererText -Objekt $eintrag -Name 'Scope') -eq $Scope) {
            return $true
        }
    }
    return $false
}

function Remove-WinGetUpdateQuarantaeneFuerPaket {
    param(
        [Parameter(Mandatory = $true)][string]$Id,
        [Parameter(Mandatory = $true)][ValidateSet('winget', 'msstore')][string]$Quelle,
        [Parameter(Mandatory = $true)][ValidateSet('user', 'machine')][string]$Scope
    )

    $null = Assert-WinGetQuarantaenePfadSicher
    $vorhanden = @(Get-WinGetUpdateQuarantaene)
    $behalten = @($vorhanden | Where-Object {
        -not ((Get-SichererText -Objekt $_ -Name 'Id') -eq $Id -and
            (Get-SichererText -Objekt $_ -Name 'Quelle') -eq $Quelle -and
            (Get-SichererText -Objekt $_ -Name 'Scope') -eq $Scope)
    })
    if ($behalten.Count -eq $vorhanden.Count) { return $false }

    $json = [pscustomobject]@{ SchemaVersion = 1; Entries = @($behalten) } | ConvertTo-Json -Depth 5
    $utf8 = New-Object Text.UTF8Encoding($false)
    $stream = New-Object IO.FileStream($script:WinGetQuarantaeneDatei, [IO.FileMode]::Create, [IO.FileAccess]::Write, [IO.FileShare]::None)
    try {
        $bytes = $utf8.GetBytes($json)
        $stream.Write($bytes, 0, $bytes.Length)
        $stream.Flush($true)
    }
    finally {
        $stream.Dispose()
    }

    $geschrieben = Get-Item -LiteralPath $script:WinGetQuarantaeneDatei -Force -ErrorAction Stop
    if ($geschrieben.Length -le 0 -or ($geschrieben.Attributes -band [IO.FileAttributes]::ReparsePoint)) {
        throw 'Die bereinigte WinGet-Quarantaenedatei wurde nicht sicher geschrieben.'
    }
    return $true
}

function Get-AppxIdentitaetenAusInstallationsdateien {
    param(
        [Parameter(Mandatory = $true)]
        [AllowEmptyCollection()]
        [IO.FileInfo[]]$Dateien
    )

    $appxDateien = @($Dateien | Where-Object {
            $_.Extension.ToLowerInvariant() -in @('.msix', '.msixbundle', '.appx', '.appxbundle')
        })
    if ($appxDateien.Count -eq 0) { return @() }

    # Ein Bundle ist stets das Hauptpaket. Falls WinGet neben einem einzelnen
    # Hauptpaket noch Abhaengigkeiten herunterlaedt, wird andernfalls nur die
    # groesste AppX-Datei als Hauptpaket ausgewertet. Dadurch kann eine
    # Framework-Abhaengigkeit nicht faelschlich als das installierte Programm
    # gelten.
    $bundle = @($appxDateien | Where-Object { $_.Extension.ToLowerInvariant() -in @('.msixbundle', '.appxbundle') } | Sort-Object Length -Descending)
    $hauptdatei = if ($bundle.Count -gt 0) { $bundle[0] } else { @($appxDateien | Sort-Object Length -Descending)[0] }
    $manifestName = if ($hauptdatei.Extension.ToLowerInvariant() -in @('.msixbundle', '.appxbundle')) {
        'AppxMetadata/AppxBundleManifest.xml'
    }
    else {
        'AppxManifest.xml'
    }

    Add-Type -AssemblyName System.IO.Compression.FileSystem -ErrorAction Stop
    $archiv = $null
    $stream = $null
    $xmlReader = $null
    try {
        $archiv = [IO.Compression.ZipFile]::OpenRead($hauptdatei.FullName)
        $eintrag = $archiv.GetEntry($manifestName)
        if ($null -eq $eintrag) {
            throw ("Das AppX-Hauptpaket '{0}' enthaelt kein erwartetes Manifest '{1}'." -f $hauptdatei.Name, $manifestName)
        }
        $stream = $eintrag.Open()
        $einstellungen = New-Object Xml.XmlReaderSettings
        $einstellungen.DtdProcessing = [Xml.DtdProcessing]::Prohibit
        $einstellungen.XmlResolver = $null
        $xmlReader = [Xml.XmlReader]::Create($stream, $einstellungen)
        $dokument = New-Object Xml.XmlDocument
        $dokument.XmlResolver = $null
        $dokument.Load($xmlReader)
        $identity = $dokument.SelectSingleNode("/*[local-name()='Package' or local-name()='Bundle']/*[local-name()='Identity']")
        if ($null -eq $identity) {
            throw ("Das AppX-Manifest in '{0}' besitzt keine Paketidentitaet." -f $hauptdatei.Name)
        }
        $name = [string]$identity.GetAttribute('Name')
        if ($name -notmatch '^[A-Za-z0-9][A-Za-z0-9.-]{2,49}$') {
            throw ("Das AppX-Manifest in '{0}' besitzt eine ungueltige Paketidentitaet." -f $hauptdatei.Name)
        }
        return @($name)
    }
    finally {
        if ($null -ne $xmlReader) { $xmlReader.Dispose() }
        if ($null -ne $stream) { $stream.Dispose() }
        if ($null -ne $archiv) { $archiv.Dispose() }
    }
}

function Resolve-WinGetAppxUpdateKontext {
    param(
        [Parameter(Mandatory = $true)][string]$Id,
        [Parameter(Mandatory = $true)][ValidateSet('winget', 'msstore')][string]$Quelle,
        [Parameter(Mandatory = $true)][ValidateSet('user', 'machine')][string]$Scope,
        [Parameter(Mandatory = $true)][bool]$IstAppx,
        [AllowEmptyCollection()][string[]]$AppxIdentitaeten = @()
    )

    if (-not $IstAppx -or $Quelle -eq 'msstore') {
        return [pscustomobject]@{ Ausfuehren = $true; Scope = $Scope; Status = 'Kein direktes AppX-Paket oder Store-Bereitstellung'; Details = '' }
    }
    if ($AppxIdentitaeten.Count -ne 1) {
        return [pscustomobject]@{
            Ausfuehren = $false
            Scope = $Scope
            Status = 'AppX-Hauptidentitaet nicht eindeutig'
            Details = ("Paket: {0}; erkannte Identitaeten: {1}" -f $Id, ($AppxIdentitaeten -join ', '))
        }
    }

    $identitaet = [string]$AppxIdentitaeten[0]
    $methodenMatrix = Get-SichereProgrammMethodenMatrix -Typ 'AppX' -Id $Id -Quelle $Quelle -Scope $Scope -AppxIdentitaet $identitaet
    if (-not [bool]$methodenMatrix.KontextGueltig) {
        return [pscustomobject]@{
            Ausfuehren = $false
            Scope = $Scope
            Status = 'AppX-Kontext durch zentrale Methoden-Matrix abgelehnt'
            Details = $methodenMatrix.Details
        }
    }
    try {
        $aktiverBenutzer = @(Get-AppxPackage -Name $identitaet -ErrorAction Stop | Where-Object { $_.Name -eq $identitaet })
    }
    catch {
        throw ("Die aktive AppX-Benutzerregistrierung fuer '{0}' ({1}) konnte nicht sicher gelesen werden: {2}" -f $Id, $identitaet, $_.Exception.Message)
    }

    $alleBenutzer = @()
    $alleBenutzerStatus = 'im reinen Benutzerscope nicht erforderlich und nicht abgefragt'
    if ($Scope -eq 'machine') {
        if (-not (Test-IstAdministrator)) {
            throw ("Die computerweite AppX-Registrierungspruefung fuer '{0}' erfordert Administratorrechte." -f $Id)
        }
        try {
            $alleBenutzer = @(Get-AppxPackage -AllUsers -Name $identitaet -ErrorAction Stop | Where-Object { $_.Name -eq $identitaet })
            $alleBenutzerStatus = 'computerweite Registrierungen erfolgreich gelesen'
        }
        catch {
            throw ("Der computerweite AppX-Registrierungsstatus fuer '{0}' ({1}) konnte nicht sicher gelesen werden: {2}" -f $Id, $identitaet, $_.Exception.Message)
        }
    }

    $registrierungen = New-Object 'System.Collections.Generic.List[string]'
    foreach ($paket in $alleBenutzer) {
        foreach ($info in @(Get-SichereEigenschaft -Objekt $paket -Name 'PackageUserInformation' -Standardwert @())) {
            $sidObjekt = Get-SichereEigenschaft -Objekt $info -Name 'UserSecurityId' -Standardwert ''
            $sid = if ($sidObjekt -is [Security.Principal.SecurityIdentifier]) {
                $sidObjekt.Value
            }
            else {
                $sidValue = Get-SichererText -Objekt $sidObjekt -Name 'Value'
                if ([string]::IsNullOrWhiteSpace($sidValue)) { $sidValue = Get-SichererText -Objekt $sidObjekt -Name 'Sid' }
                if ([string]::IsNullOrWhiteSpace($sidValue)) { $sidValue = [string]$sidObjekt }
                $sidValue
            }
            $zustand = [string](Get-SichereEigenschaft -Objekt $info -Name 'InstallState' -Standardwert 'Unbekannt')
            $registrierungen.Add(("{0}:{1}" -f $sid, $zustand)) | Out-Null
        }
    }
    $details = "AppX-Identitaet: {0}; aktiver Benutzer: {1}; AllUsers-Pruefung: {2}; alle Registrierungen: {3}; Methoden-Matrix: {4}" -f $identitaet, $aktiverBenutzer.Count, $alleBenutzerStatus, $(if ($registrierungen.Count -gt 0) { $registrierungen -join ', ' } else { 'keine gelesen' }), $methodenMatrix.Details

    if ($aktiverBenutzer.Count -eq 0) {
        return [pscustomobject]@{
            Ausfuehren = $false
            Scope = $Scope
            Status = 'Nur systembereitgestellt oder fuer andere/offline Benutzer registriert; sicher ausgelassen'
            Details = $details
        }
    }

    # AppX/MSIX wird fuer den angemeldeten Benutzer aktualisiert. Ein aus der
    # WinGet-Tabelle abgeleiteter machine-Scope wuerde dagegen provisionierte
    # Pakete und auch offline Profile veraendern. Genau dieser Unterschied wird
    # vor jeder Aenderung anhand der echten AppX-Registrierung korrigiert.
    return [pscustomobject]@{
        Ausfuehren = $true
        Scope = 'user'
        Status = $(if ($Scope -eq 'user') { 'Aktive Benutzerregistrierung bestaetigt' } else { 'AppX-Scope anhand aktiver Benutzerregistrierung auf user korrigiert' })
        Details = $details
    }
}

function Remove-KontrolliertenInstallerOrdner {
    param([AllowEmptyString()][string]$Ordner = '')

    if ([string]::IsNullOrWhiteSpace($Ordner) -or
        [string]::IsNullOrWhiteSpace([string]$script:InstallationsOrdner) -or
        -not (Test-Path -LiteralPath $Ordner -PathType Container)) { return $false }
    try {
        $voll = [IO.Path]::GetFullPath($Ordner)
        $basis = [IO.Path]::GetFullPath($script:InstallationsOrdner).TrimEnd([char]92) + [char]92
        if (-not $voll.StartsWith($basis, [StringComparison]::OrdinalIgnoreCase) -or
            -not (Test-VerzeichnisketteOhneReparsePoint -Basis $script:InstallationsOrdner -Kandidat $voll)) {
            return $false
        }
        Remove-Item -LiteralPath $voll -Recurse -Force -ErrorAction Stop
        return (-not (Test-Path -LiteralPath $voll))
    }
    catch {
        Write-Verbose ("Kontrollierter Installerordner konnte nicht entfernt werden: {0}" -f $_.Exception.Message)
        return $false
    }
}

function Test-WinGetUpdateVorab {
    param(
        [Parameter(Mandatory = $true)][string]$WinGet,
        [Parameter(Mandatory = $true)][string]$Id,
        [Parameter(Mandatory = $true)][ValidateSet('winget', 'msstore')][string]$Quelle,
        [Parameter(Mandatory = $true)][ValidateSet('user', 'machine')][string]$Scope,
        [Parameter(Mandatory = $true)][string]$Verfuegbar,
        [switch]$BehaltenFuerFallback
    )

    $methodenMatrix = Get-SichereProgrammMethodenMatrix -Typ 'WinGet' -Id $Id -Quelle $Quelle -Scope $Scope
    if (-not [bool]$methodenMatrix.OnlineAktionFreigegeben) {
        return [pscustomobject]@{
            Erfolgreich = $false
            Quarantiniert = $false
            ExitCode = -1
            IstAppx = $false
            AppxIdentitaeten = @()
            DownloadOrdner = ''
            Details = ('Die zentrale Methoden-Matrix hat den WinGet-Kontext abgelehnt: {0}' -f $methodenMatrix.Details)
        }
    }

    # Store-Pakete werden durch die verifizierte Microsoft-Store-Quelle und
    # deren signierten Bereitstellungsmechanismus geprueft. Der Downloadbefehl
    # ist fuer Store-Pakete ohne Offline-Lizenz nicht allgemein verwendbar.
    if ($Quelle -eq 'msstore') {
        return [pscustomobject]@{ Erfolgreich = $true; Quarantiniert = $false; ExitCode = 0; IstAppx = $false; AppxIdentitaeten = @(); DownloadOrdner = ''; Details = ('Verifizierte Microsoft-Store-Bereitstellung. {0}' -f $methodenMatrix.Details) }
    }

    if ([string]::IsNullOrWhiteSpace([string]$script:InstallationsOrdner) -or
        -not (Test-Path -LiteralPath $script:InstallationsOrdner -PathType Container) -or
        -not (Test-VerzeichnisketteOhneReparsePoint -Basis $script:LogOrdner -Kandidat $script:InstallationsOrdner)) {
        throw 'Der kontrollierte Ordner fuer die Update-Vorabpruefung ist nicht sicher.'
    }

    $ordner = Join-Path -Path $script:InstallationsOrdner -ChildPath ('Update-Vorabpruefung-' + [Guid]::NewGuid().ToString('N'))
    New-Item -ItemType Directory -Path $ordner -ErrorAction Stop | Out-Null
    if (-not (Test-VerzeichnisketteOhneReparsePoint -Basis $script:InstallationsOrdner -Kandidat $ordner)) {
        throw 'Der Ordner fuer die Update-Vorabpruefung ist eine unsichere Pfadumleitung.'
    }

    $downloadBehalten = $false
    try {
        $argumentListe = New-Object 'System.Collections.Generic.List[string]'
        foreach ($wert in @('download', '--id', $Id, '--exact', '--source', $Quelle, '--scope', $Scope)) {
            $argumentListe.Add($wert) | Out-Null
        }
        if ($Verfuegbar -ne 'latest') {
            $argumentListe.Add('--version') | Out-Null
            $argumentListe.Add($Verfuegbar) | Out-Null
        }
        foreach ($wert in @('--download-directory', $ordner, '--accept-source-agreements', '--accept-package-agreements', '--skip-license', '--disable-interactivity')) {
            $argumentListe.Add($wert) | Out-Null
        }
        $argumente = [string[]]$argumentListe.ToArray()
        $ergebnis = Invoke-Native -Datei $WinGet -Argumente $argumente -Beschreibung ("Update-Vorabpruefung herunterladen: {0} ({1}/{2}, {3})" -f $Id, $Quelle, $Scope, $Verfuegbar) -TimeoutSekunden 3600 -LeerlaufTimeoutSekunden 600 -InstallationsVorgang -AktivitaetsPfade @($ordner) -FehlerNurResultat -AusgabeUnterdruecken

        # Einige WinGet-Manifeste besitzen keinen expliziten Scope am
        # Installer. "upgrade --scope" kann die vorhandene Installation dann
        # korrekt zuordnen, waehrend der rein herunterladende Befehl mit
        # demselben Scope faelschlich "kein anwendbarer Installer" meldet. Nur
        # fuer die unveraenderliche Vorabpruefung wird deshalb exakt einmal
        # ohne diesen Installerfilter wiederholt; Paket-ID, Quelle und Version
        # bleiben weiterhin fest gebunden. Der spaetere Upgrade-Aufruf behaelt
        # den urspruenglich ermittelten Scope zwingend bei.
        if (-not $ergebnis.Erfolgreich -and [int]$ergebnis.ExitCode -eq -1978335216) {
            $vorhandeneDateien = @(Get-ChildItem -LiteralPath $ordner -Recurse -File -Force -ErrorAction Stop)
            if ($vorhandeneDateien.Count -gt 0) {
                throw 'Die erste Update-Vorabpruefung hinterliess trotz fehlendem anwendbarem Installer Dateien; eine mehrdeutige Wiederholung wurde verhindert.'
            }
            $ohneScope = New-Object 'System.Collections.Generic.List[string]'
            for ($argumentIndex = 0; $argumentIndex -lt $argumente.Count; $argumentIndex++) {
                if ($argumente[$argumentIndex] -eq '--scope') {
                    $argumentIndex++
                    continue
                }
                $ohneScope.Add($argumente[$argumentIndex]) | Out-Null
            }
            $argumente = [string[]]$ohneScope.ToArray()
            $ergebnis = Invoke-Native -Datei $WinGet -Argumente $argumente -Beschreibung ("Update-Vorabpruefung ohne reinen Download-Scopefilter wiederholen: {0} ({1}, {2})" -f $Id, $Quelle, $Verfuegbar) -TimeoutSekunden 3600 -LeerlaufTimeoutSekunden 600 -InstallationsVorgang -AktivitaetsPfade @($ordner) -FehlerNurResultat -AusgabeUnterdruecken
        }

        # Eine Hashabweichung wird niemals mit einer Hash-Bypassoption, mit
        # einem erzwungenen Download oder einer ungeprueften Fremdquelle
        # umgangen. Einziger automatischer
        # Ausgleichsversuch: offizielle Quelle aktualisieren, den fehlerhaften
        # Downloadordner vollstaendig entfernen und in einen frischen Ordner
        # erneut laden. Erst ein danach erfolgreicher WinGet-Hashvergleich hebt
        # den Sicherheitsbefund auf.
        $hashFehlerFestgestellt = (-not $ergebnis.Erfolgreich -and [int]$ergebnis.ExitCode -eq -1978335215)
        $ersterHashFehlerText = if ($hashFehlerFestgestellt) { [string]$ergebnis.Ausgabe } else { '' }
        if ($hashFehlerFestgestellt) {
            Write-Status -Text ("Installer-Hashabweichung bei '{0}' erkannt. Die offizielle Quelle '{1}' wird aktualisiert und ein vollstaendig frischer Kontroll-Download wird genau einmal versucht; Hash-Pruefungen werden nicht umgangen." -f $Id, $Quelle) -Stufe 'WARNUNG'
            $quellenUpdate = Invoke-Native -Datei $WinGet -Argumente @('source', 'update', '--name', $Quelle, '--disable-interactivity') -Beschreibung ("Offizielle WinGet-Quelle nach Hashabweichung aktualisieren: {0}" -f $Quelle) -TimeoutSekunden 300 -FehlerNurResultat -AusgabeUnterdruecken
            if ($quellenUpdate.Erfolgreich -and (Test-WinGetQuelle -WinGet $WinGet -Name $Quelle)) {
                $null = Remove-KontrolliertenInstallerOrdner -Ordner $ordner
                $ordner = Join-Path -Path $script:InstallationsOrdner -ChildPath ('Update-Vorabpruefung-' + [Guid]::NewGuid().ToString('N'))
                New-Item -ItemType Directory -Path $ordner -ErrorAction Stop | Out-Null
                if (-not (Test-VerzeichnisketteOhneReparsePoint -Basis $script:InstallationsOrdner -Kandidat $ordner)) {
                    throw 'Der frische Ordner fuer die wiederholte Hashpruefung ist eine unsichere Pfadumleitung.'
                }
                for ($argumentIndex = 0; $argumentIndex -lt ($argumente.Count - 1); $argumentIndex++) {
                    if ($argumente[$argumentIndex] -eq '--download-directory') {
                        $argumente[$argumentIndex + 1] = $ordner
                        break
                    }
                }
                $ergebnis = Invoke-Native -Datei $WinGet -Argumente $argumente -Beschreibung ("Frischer Kontroll-Download nach Quellenaktualisierung: {0} ({1}/{2}, {3})" -f $Id, $Quelle, $Scope, $Verfuegbar) -TimeoutSekunden 3600 -LeerlaufTimeoutSekunden 600 -InstallationsVorgang -AktivitaetsPfade @($ordner) -FehlerNurResultat -AusgabeUnterdruecken
            }
        }
        if (-not $ergebnis.Erfolgreich) {
            $hashFehler = ($hashFehlerFestgestellt -or [int]$ergebnis.ExitCode -eq -1978335215)
            if ($hashFehler -and $Verfuegbar -ne 'latest') {
                Set-WinGetUpdateQuarantaene -Id $Id -Quelle $Quelle -Scope $Scope -Verfuegbar $Verfuegbar
            }
            return [pscustomobject]@{
                Erfolgreich = $false
                Quarantiniert = ($hashFehler -and $Verfuegbar -ne 'latest')
                ExitCode = [int]$ergebnis.ExitCode
                DownloadOrdner = ''
                Details = $(if ($hashFehlerFestgestellt) { "Erste Hashabweichung:`r`n$ersterHashFehlerText`r`nErgebnis nach Aktualisierung der offiziellen Quelle und frischem Download:`r`n$([string]$ergebnis.Ausgabe)" } else { [string]$ergebnis.Ausgabe })
            }
        }

        if (-not (Test-VerzeichnisketteOhneReparsePoint -Basis $script:InstallationsOrdner -Kandidat $ordner)) {
            throw 'Der Downloadordner wurde waehrend der Update-Vorabpruefung umgeleitet.'
        }
        $umleitungen = @(Get-ChildItem -LiteralPath $ordner -Recurse -Force -ErrorAction Stop | Where-Object { $_.Attributes -band [IO.FileAttributes]::ReparsePoint })
        if ($umleitungen.Count -gt 0) {
            throw 'Die Update-Vorabpruefung enthielt mindestens eine Pfadumleitung.'
        }

        $dateien = @(Get-ChildItem -LiteralPath $ordner -Recurse -File -Force -ErrorAction Stop)
        $installer = @($dateien | Where-Object { $_.Extension.ToLowerInvariant() -in @('.exe', '.msi', '.msix', '.msixbundle', '.appx', '.appxbundle', '.zip', '.7z') })
        if ($installer.Count -eq 0) {
            throw 'WinGet meldete einen erfolgreichen Download, aber es wurde kein unterstuetztes Installationspaket gefunden.'
        }

        foreach ($datei in @($installer | Where-Object { $_.Extension.ToLowerInvariant() -in @('.exe', '.msi', '.msix', '.msixbundle', '.appx', '.appxbundle') })) {
            $signatur = Get-AuthenticodeSignature -LiteralPath $datei.FullName
            if ($signatur.Status -notin @([Management.Automation.SignatureStatus]::Valid, [Management.Automation.SignatureStatus]::NotSigned)) {
                throw ("Das vorab geladene Installationspaket '{0}' besitzt eine ungueltige Authenticode-Signatur: {1}." -f $datei.Name, $signatur.Status)
            }
        }

        $dateiInfo = Get-DownloadDateiInformationen -Ordner $ordner
        if (-not [bool](Get-SichereEigenschaft -Objekt $dateiInfo -Name 'Gueltig' -Standardwert $false)) {
            throw ("Der Vorabdownload ist nicht vollstaendig pruefbar: {0}" -f (Get-SichererText -Objekt $dateiInfo -Name 'Details'))
        }
        $appxIdentitaeten = @(Get-AppxIdentitaetenAusInstallationsdateien -Dateien $installer)
        $downloadBehalten = [bool]$BehaltenFuerFallback
        return [pscustomobject]@{
            Erfolgreich = $true
            Quarantiniert = $false
            ExitCode = 0
            IstAppx = ($appxIdentitaeten.Count -gt 0)
            AppxIdentitaeten = $appxIdentitaeten
            DownloadOrdner = $(if ($downloadBehalten) { $ordner } else { '' })
            Details = ('WinGet-Manifest-Hash bestaetigt; {0}; {1}' -f (Get-SichererText -Objekt $dateiInfo -Name 'Details'), $methodenMatrix.Details)
        }
    }
    catch {
        # Auch ein unerwarteter Paket-, Signatur- oder Dateisystemfehler darf
        # nicht die gesamte Update-/Reparaturphase beenden. Die betroffene
        # Paketversion bleibt unveraendert und wird fuer diesen Lauf isoliert;
        # bestaetigte WinGet-Hashabweichungen werden im regulaeren Fehlerpfad
        # zusaetzlich versionsgebunden und dauerhaft quarantiniert.
        return [pscustomobject]@{
            Erfolgreich = $false
            Quarantiniert = $false
            ExitCode = -1
            IstAppx = $false
            AppxIdentitaeten = @()
            DownloadOrdner = ''
            Details = ('Paketbezogene Sicherheits-Vorabpruefung wurde isoliert: {0}' -f $_.Exception.Message)
        }
    }
    finally {
        if (-not $downloadBehalten -and (Test-Path -LiteralPath $ordner -PathType Container)) {
            $null = Remove-KontrolliertenInstallerOrdner -Ordner $ordner
        }
    }
}

function Invoke-WinGetEinzelUpdate {
    param(
        [Parameter(Mandatory = $true)][string]$WinGet,
        [Parameter(Mandatory = $true)][string]$Id,
        [Parameter(Mandatory = $true)][ValidateSet('winget', 'msstore')][string]$Quelle,
        [Parameter(Mandatory = $true)][ValidateSet('user', 'machine')][string]$Scope,
        [Parameter(Mandatory = $true)][string]$Verfuegbar,
        [Parameter(Mandatory = $true)][string]$ListHilfeText
    )

    $argumente = @(
        'upgrade', '--id', $Id, '--exact', '--source', $Quelle, '--scope', $Scope,
        '--silent', '--accept-source-agreements', '--accept-package-agreements',
        '--disable-interactivity'
    )

    $ergebnis = Invoke-Native -Datei $WinGet -Argumente $argumente -Beschreibung ("Paket aktualisieren: {0} ({1}/{2})" -f $Id, $Quelle, $Scope) -TimeoutSekunden 3600 -LeerlaufTimeoutSekunden 600 -InstallationsVorgang -FehlerNurResultat -AusgabeUnterdruecken
    $kategorie = Get-WinGetErgebniskategorie -ExitCode ([int]$ergebnis.ExitCode) -Ausgabe ([string]$ergebnis.Ausgabe)

    if ($kategorie -in @('Erfolg', 'ErfolgNeustart')) {
        $neustart = ($kategorie -eq 'ErfolgNeustart' -or [bool](Get-SichereEigenschaft -Objekt $ergebnis -Name 'Neustart' -Standardwert $false))
        if ($neustart) { Add-OneClickNeustartnachweis -Quelle ("WinGet-Update {0}" -f $Id) -ExitCode ([int]$ergebnis.ExitCode) -Details ("Quelle: {0}; Scope: {1}" -f $Quelle, $Scope) }

        $nachkontrolle = if ($neustart) {
                    Wait-WinGetPaketNachkontrolle -WinGet $WinGet -Id $Id -Quelle $Quelle -Scope $Scope -ListHilfeText $ListHilfeText -TimeoutSekunden 300
                }
                else {
                    Wait-WinGetPaketNachkontrolle -WinGet $WinGet -Id $Id -Quelle $Quelle -Scope $Scope -ListHilfeText $ListHilfeText -KeineOffeneAktualisierung -TimeoutSekunden 300
                }
        if (-not [bool](Get-SichereEigenschaft -Objekt $nachkontrolle -Name 'Bestaetigt' -Standardwert $false)) {
            $script:FehlgeschlageneUpdates++
            $script:FehlgeschlageneUpdateNachkontrollen++
            $details = Get-SichererText -Objekt $nachkontrolle -Name 'Details'
            $status = Get-SichererText -Objekt $nachkontrolle -Name 'Status'
            Add-Warnung -Text ("WinGet meldete das Update fuer '{0}' als erfolgreich, der Abschluss konnte jedoch nicht bestaetigt werden: {1}." -f $Id, $status)
            Add-Resultat -Bereich 'Programme' -Aktion ("Update {0}" -f $Id) -Status 'Installer beendet, Update-Nachkontrolle fehlgeschlagen' -ExitCode ([int]$ergebnis.ExitCode) -Details ("Quelle: {0}; Scope: {1}; Nachkontrolle: {2}{3}{4}{3}{5}" -f $Quelle, $Scope, $status, [Environment]::NewLine, $details, [string]$ergebnis.Ausgabe)
            return $false
        }

        $script:NachkontrollierteUpdates++
        $script:AktualisiertePakete++
        Add-Resultat -Bereich 'Programme' -Aktion ("Update {0}" -f $Id) -Status $(if ($neustart) { 'Erfolgreich nachkontrolliert; Neustart erforderlich' } else { 'Erfolgreich nachkontrolliert und abgeschlossen' }) -ExitCode ([int]$ergebnis.ExitCode) -Details ("Quelle: {0}; Scope: {1}{2}{3}" -f $Quelle, $Scope, [Environment]::NewLine, [string]$ergebnis.Ausgabe)
        Write-Status -Text ("Update erfolgreich nachkontrolliert: {0} ({1}/{2}){3}" -f $Id, $Quelle, $Scope, $(if ($neustart) { ' (Neustart erforderlich)' } else { '' })) -Stufe 'OK'
        return $true
    }

    if ($kategorie -in @('KeineAktualisierung', 'KeinePakete')) {
        $script:BereitsAktuellePakete++
        Add-Resultat -Bereich 'Programme' -Aktion ("Update {0}" -f $Id) -Status 'Bereits aktuell oder nicht mehr anwendbar' -ExitCode ([int]$ergebnis.ExitCode) -Details ("Quelle: {0}; Scope: {1}{2}{3}" -f $Quelle, $Scope, [Environment]::NewLine, [string]$ergebnis.Ausgabe)
        Write-Status -Text ("Bereits aktuell oder zwischenzeitlich nicht mehr anwendbar: {0} ({1}/{2})" -f $Id, $Quelle, $Scope) -Stufe 'OK'
        return $true
    }

    if ($kategorie -eq 'Uebersprungen') {
        $script:UebersprungeneUpdates++
        $beschreibung = Get-WinGetFehlerbeschreibung -ExitCode ([int]$ergebnis.ExitCode) -Ausgabe ([string]$ergebnis.Ausgabe)
        Add-Resultat -Bereich 'Programme' -Aktion ("Update {0}" -f $Id) -Status 'Bewusst uebersprungen' -ExitCode ([int]$ergebnis.ExitCode) -Details ("Quelle: {0}; Scope: {1}{2}{3}" -f $Quelle, $Scope, [Environment]::NewLine, [string]$ergebnis.Ausgabe)
        Write-Status -Text ("Uebersprungen: {0} ({1}/{2}) - {3}." -f $Id, $Quelle, $Scope, $beschreibung) -Stufe 'INFO'
        return $true
    }

    if ($kategorie -eq 'Benutzeraktion') {
        $script:UebersprungeneUpdates++
        $beschreibung = Get-WinGetFehlerbeschreibung -ExitCode ([int]$ergebnis.ExitCode) -Ausgabe ([string]$ergebnis.Ausgabe)
        Add-Warnung -Text ("Paket '{0}' ({1}/{2}) benoetigt eine Benutzeraktion und wurde nicht erzwungen: {3} (Exitcode {4})." -f $Id, $Quelle, $Scope, $beschreibung, [int]$ergebnis.ExitCode)
        Add-Resultat -Bereich 'Programme' -Aktion ("Update {0}" -f $Id) -Status 'Benutzeraktion erforderlich' -ExitCode ([int]$ergebnis.ExitCode) -Details ([string]$ergebnis.Ausgabe)
        return $false
    }

    if ($kategorie -eq 'NeustartVorUpdate') {
        Add-OneClickNeustartnachweis -Quelle ("WinGet-Update vor Installation {0}" -f $Id) -ExitCode ([int]$ergebnis.ExitCode) -Details ("Quelle: {0}; Scope: {1}" -f $Quelle, $Scope)
        $script:UebersprungeneUpdates++
        $beschreibung = Get-WinGetFehlerbeschreibung -ExitCode ([int]$ergebnis.ExitCode) -Ausgabe ([string]$ergebnis.Ausgabe)
        Add-Warnung -Text ("Paket '{0}' ({1}/{2}) wird nach einem Windows-Neustart erneut aktualisierbar sein: {3}." -f $Id, $Quelle, $Scope, $beschreibung)
        Add-Resultat -Bereich 'Programme' -Aktion ("Update {0}" -f $Id) -Status 'Neustart vor Aktualisierung erforderlich' -ExitCode ([int]$ergebnis.ExitCode) -Details ([string]$ergebnis.Ausgabe)
        return $false
    }

    # Netzwerk-, Dienst- und Quellenfehler werden genau einmal wiederholt.
    # Installer-, Richtlinien- und Sicherheitsfehler werden nicht erzwungen.
    if (Test-WinGetFehlerWiederholbar -ExitCode ([int]$ergebnis.ExitCode)) {
        Write-Status -Text ("Voruebergehender Fehler bei {0} ({1}/{2}); die Quelle wird aktualisiert und das Paket einmal erneut versucht." -f $Id, $Quelle, $Scope) -Stufe 'WARNUNG'
        $quellenUpdate = Invoke-Native -Datei $WinGet -Argumente @('source', 'update', '--name', $Quelle, '--disable-interactivity') -Beschreibung ("WinGet-Quelle {0} vor Wiederholung aktualisieren" -f $Quelle) -TimeoutSekunden 300 -FehlerNurResultat -AusgabeUnterdruecken
        Start-Sleep -Seconds 5

        if ($quellenUpdate.Erfolgreich -and (Test-WinGetQuelle -WinGet $WinGet -Name $Quelle)) {
            $ergebnis = Invoke-Native -Datei $WinGet -Argumente $argumente -Beschreibung ("Paket erneut aktualisieren: {0} ({1}/{2})" -f $Id, $Quelle, $Scope) -TimeoutSekunden 3600 -LeerlaufTimeoutSekunden 600 -InstallationsVorgang -FehlerNurResultat -AusgabeUnterdruecken
            $kategorie = Get-WinGetErgebniskategorie -ExitCode ([int]$ergebnis.ExitCode) -Ausgabe ([string]$ergebnis.Ausgabe)

            if ($kategorie -in @('Erfolg', 'ErfolgNeustart')) {
                $neustart = ($kategorie -eq 'ErfolgNeustart' -or [bool](Get-SichereEigenschaft -Objekt $ergebnis -Name 'Neustart' -Standardwert $false))
                if ($neustart) { Add-OneClickNeustartnachweis -Quelle ("Wiederholtes WinGet-Update {0}" -f $Id) -ExitCode ([int]$ergebnis.ExitCode) -Details ("Quelle: {0}; Scope: {1}" -f $Quelle, $Scope) }

                $nachkontrolle = if ($neustart) {
                    Wait-WinGetPaketNachkontrolle -WinGet $WinGet -Id $Id -Quelle $Quelle -Scope $Scope -ListHilfeText $ListHilfeText -TimeoutSekunden 300
                }
                else {
                    Wait-WinGetPaketNachkontrolle -WinGet $WinGet -Id $Id -Quelle $Quelle -Scope $Scope -ListHilfeText $ListHilfeText -KeineOffeneAktualisierung -TimeoutSekunden 300
                }
                if (-not [bool](Get-SichereEigenschaft -Objekt $nachkontrolle -Name 'Bestaetigt' -Standardwert $false)) {
                    $script:FehlgeschlageneUpdates++
                    $script:FehlgeschlageneUpdateNachkontrollen++
                    $details = Get-SichererText -Objekt $nachkontrolle -Name 'Details'
                    $status = Get-SichererText -Objekt $nachkontrolle -Name 'Status'
                    Add-Warnung -Text ("WinGet meldete das Update fuer '{0}' beim zweiten Versuch als erfolgreich, der Abschluss konnte jedoch nicht bestaetigt werden: {1}." -f $Id, $status)
                    Add-Resultat -Bereich 'Programme' -Aktion ("Update {0}" -f $Id) -Status 'Zweiter Installerlauf beendet, Update-Nachkontrolle fehlgeschlagen' -ExitCode ([int]$ergebnis.ExitCode) -Details ("Quelle: {0}; Scope: {1}; Nachkontrolle: {2}{3}{4}{3}{5}" -f $Quelle, $Scope, $status, [Environment]::NewLine, $details, [string]$ergebnis.Ausgabe)
                    return $false
                }

                $script:NachkontrollierteUpdates++
                $script:AktualisiertePakete++
                Add-Resultat -Bereich 'Programme' -Aktion ("Update {0}" -f $Id) -Status $(if ($neustart) { 'Beim zweiten Versuch erfolgreich nachkontrolliert; Neustart erforderlich' } else { 'Beim zweiten Versuch erfolgreich nachkontrolliert und abgeschlossen' }) -ExitCode ([int]$ergebnis.ExitCode) -Details ("Quelle: {0}; Scope: {1}{2}{3}" -f $Quelle, $Scope, [Environment]::NewLine, [string]$ergebnis.Ausgabe)
                Write-Status -Text ("Beim zweiten Versuch aktualisiert und nachkontrolliert: {0} ({1}/{2})" -f $Id, $Quelle, $Scope) -Stufe 'OK'
                return $true
            }
            if ($kategorie -in @('KeineAktualisierung', 'KeinePakete')) {
                $script:BereitsAktuellePakete++
                Add-Resultat -Bereich 'Programme' -Aktion ("Update {0}" -f $Id) -Status 'Nach Wiederholung bereits aktuell' -ExitCode ([int]$ergebnis.ExitCode) -Details ([string]$ergebnis.Ausgabe)
                Write-Status -Text ("Nach Wiederholung bereits aktuell: {0} ({1}/{2})" -f $Id, $Quelle, $Scope) -Stufe 'OK'
                return $true
            }
            if ($kategorie -eq 'Uebersprungen') {
                $script:UebersprungeneUpdates++
                $beschreibung = Get-WinGetFehlerbeschreibung -ExitCode ([int]$ergebnis.ExitCode) -Ausgabe ([string]$ergebnis.Ausgabe)
                Add-Resultat -Bereich 'Programme' -Aktion ("Update {0}" -f $Id) -Status 'Nach Wiederholung bewusst uebersprungen' -ExitCode ([int]$ergebnis.ExitCode) -Details ([string]$ergebnis.Ausgabe)
                Write-Status -Text ("Nach Wiederholung uebersprungen: {0} ({1}/{2}) - {3}." -f $Id, $Quelle, $Scope, $beschreibung) -Stufe 'INFO'
                return $true
            }
            if ($kategorie -eq 'Benutzeraktion') {
                $script:UebersprungeneUpdates++
                $beschreibung = Get-WinGetFehlerbeschreibung -ExitCode ([int]$ergebnis.ExitCode) -Ausgabe ([string]$ergebnis.Ausgabe)
                Add-Warnung -Text ("Paket '{0}' ({1}/{2}) benoetigt nach der Wiederholung weiterhin eine Benutzeraktion: {3} (Exitcode {4})." -f $Id, $Quelle, $Scope, $beschreibung, [int]$ergebnis.ExitCode)
                Add-Resultat -Bereich 'Programme' -Aktion ("Update {0}" -f $Id) -Status 'Benutzeraktion erforderlich' -ExitCode ([int]$ergebnis.ExitCode) -Details ([string]$ergebnis.Ausgabe)
                return $false
            }
            if ($kategorie -eq 'NeustartVorUpdate') {
                Add-OneClickNeustartnachweis -Quelle ("Wiederholtes WinGet-Update vor Installation {0}" -f $Id) -ExitCode ([int]$ergebnis.ExitCode) -Details ("Quelle: {0}; Scope: {1}" -f $Quelle, $Scope)
                $script:UebersprungeneUpdates++
                Add-Warnung -Text ("Paket '{0}' ({1}/{2}) kann erst nach einem Windows-Neustart aktualisiert werden." -f $Id, $Quelle, $Scope)
                Add-Resultat -Bereich 'Programme' -Aktion ("Update {0}" -f $Id) -Status 'Neustart vor Aktualisierung erforderlich' -ExitCode ([int]$ergebnis.ExitCode) -Details ([string]$ergebnis.Ausgabe)
                return $false
            }
        }
    }

    if ([int]$ergebnis.ExitCode -eq -1978335215) {
        Set-WinGetUpdateQuarantaene -Id $Id -Quelle $Quelle -Scope $Scope -Verfuegbar $Verfuegbar
    }
    $script:FehlgeschlageneUpdates++
    $beschreibung = Get-WinGetFehlerbeschreibung -ExitCode ([int]$ergebnis.ExitCode) -Ausgabe ([string]$ergebnis.Ausgabe)
    Add-Warnung -Text ("Paket '{0}' ({1}/{2}) konnte nicht automatisch aktualisiert werden: {3} (Exitcode {4})." -f $Id, $Quelle, $Scope, $beschreibung, [int]$ergebnis.ExitCode)
    Add-Resultat -Bereich 'Programme' -Aktion ("Update {0}" -f $Id) -Status 'Fehlgeschlagen' -ExitCode ([int]$ergebnis.ExitCode) -Details ([string]$ergebnis.Ausgabe)
    return $false
}

function Update-InstallierteProgramme {
    param(
        [Parameter(Mandatory = $true)][string]$WinGet,
        [bool]$WingetQuelle,
        [bool]$MsStoreQuelle,
        [Parameter(Mandatory = $false)][ValidateNotNullOrEmpty()][ValidateSet('user', 'machine')][string[]]$Scopes = @('user', 'machine')
    )

    Write-Status -Text 'Verfuegbare Programmaktualisierungen werden getrennt nach offizieller Quelle und Installationskontext ermittelt und danach ausschliesslich paketweise installiert.' -Stufe 'SCHRITT'

    $upgradeHilfe = Invoke-Native -Datei $WinGet -Argumente @('upgrade', '--help') -Beschreibung 'WinGet-Aktualisierungsoptionen pruefen' -TimeoutSekunden 60 -FehlerNurResultat -AusgabeUnterdruecken
    if (-not $upgradeHilfe.Erfolgreich) {
        Add-Warnung -Text 'Die WinGet-Aktualisierungsfunktion konnte nicht sicher geprueft werden. Automatische Programmupdates wurden in diesem Lauf ausgelassen.'
        return
    }
    $upgradeHilfeText = [string]$upgradeHilfe.Ausgabe
    foreach ($pflichtOption in @('--id', '--exact', '--source', '--scope', '--silent', '--accept-source-agreements', '--accept-package-agreements', '--disable-interactivity')) {
        if (-not (Test-WinGetHilfeOption -HilfeText $upgradeHilfeText -Option $pflichtOption)) {
            Add-Warnung -Text ("Die installierte WinGet-Version unterstuetzt die fuer scopegebundene automatische Updates benoetigte Option nicht: {0}. Updates wurden sicher ausgelassen." -f $pflichtOption)
            return
        }
    }

    $downloadHilfe = Invoke-Native -Datei $WinGet -Argumente @('download', '--help') -Beschreibung 'WinGet-Downloadfunktion fuer Update-Vorabpruefung pruefen' -TimeoutSekunden 60 -FehlerNurResultat -AusgabeUnterdruecken
    if (-not $downloadHilfe.Erfolgreich) {
        throw 'Die WinGet-Downloadfunktion fuer die verpflichtende Update-Vorabpruefung ist nicht verfuegbar.'
    }
    $downloadHilfeText = [string]$downloadHilfe.Ausgabe
    foreach ($pflichtOption in @('--id', '--exact', '--source', '--scope', '--version', '--download-directory', '--accept-source-agreements', '--accept-package-agreements', '--disable-interactivity')) {
        if (-not (Test-WinGetHilfeOption -HilfeText $downloadHilfeText -Option $pflichtOption)) {
            throw ("Die installierte WinGet-Version unterstuetzt die verpflichtende Update-Vorabpruefung nicht: {0}." -f $pflichtOption)
        }
    }

    $listHilfe = Invoke-Native -Datei $WinGet -Argumente @('list', '--help') -Beschreibung 'WinGet-Listenfunktion fuer Update-Nachkontrolle pruefen' -TimeoutSekunden 60 -FehlerNurResultat -AusgabeUnterdruecken
    if (-not $listHilfe.Erfolgreich) {
        Add-Warnung -Text 'Die WinGet-Listenfunktion fuer die verpflichtende Update-Nachkontrolle ist nicht verfuegbar. Automatische Updates wurden sicher ausgelassen.'
        return
    }
    $listHilfeText = [string]$listHilfe.Ausgabe
    try {
        $null = New-WinGetUpdateNachkontrollArgumente -Id 'Hersteller.Pruefpaket' -Quelle 'winget' -Scope 'user' -HilfeText $listHilfeText
        $null = New-WinGetUpdateNachkontrollArgumente -Id '9NABCDEFG1234' -Quelle 'msstore' -Scope 'user' -HilfeText $listHilfeText
    }
    catch {
        Add-Warnung -Text ("Die installierte WinGet-Version erlaubt keine eindeutige Update-Nachkontrolle. Automatische Updates wurden sicher ausgelassen: {0}" -f $_.Exception.Message)
        return
    }

    $quellen = New-Object 'System.Collections.Generic.List[string]'
    if ($WingetQuelle) { $quellen.Add('winget') | Out-Null }
    if ($MsStoreQuelle) { $quellen.Add('msstore') | Out-Null }
    if ($quellen.Count -eq 0) {
        Add-Warnung -Text 'Es stand keine verifizierte offizielle WinGet-Quelle fuer Programmaktualisierungen zur Verfuegung.'
        return
    }

    $gesamtPakete = New-Object 'System.Collections.Generic.List[object]'

    foreach ($quelle in $quellen.ToArray()) {
        foreach ($scope in $Scopes) {
            $suche = Get-VerfuegbareWinGetUpdates -WinGet $WinGet -Quelle $quelle -Scope $scope
            $pakete = @(Get-SichereEigenschaft -Objekt $suche -Name 'Pakete' -Standardwert @())
            foreach ($paket in $pakete) {
                if ($null -ne $paket) {
                    $gesamtPakete.Add($paket) | Out-Null
                }
            }
        }
    }

    $eindeutigePakete = @($gesamtPakete.ToArray() | Sort-Object Id, Quelle, Scope -Unique)
    $quarantaeneEintraege = @(Get-WinGetUpdateQuarantaene)
    $anzahl = $eindeutigePakete.Count
    $index = 0
    $verarbeiteteUpdateKontexte = New-Object 'System.Collections.Generic.HashSet[string]' ([StringComparer]::OrdinalIgnoreCase)

    foreach ($paket in $eindeutigePakete) {
        $index++
        $id = Get-SichererText -Objekt $paket -Name 'Id'
        $anzeigename = Get-SichererText -Objekt $paket -Name 'Name'
        $quelle = Get-SichererText -Objekt $paket -Name 'Quelle'
        $scope = Get-SichererText -Objekt $paket -Name 'Scope'
        $verfuegbar = Get-SichererText -Objekt $paket -Name 'Verfuegbar'
        $methodenMatrix = Get-SichereProgrammMethodenMatrix -Typ 'WinGet' -Id $id -Quelle $quelle -Scope $scope -DisplayName $anzeigename
        if (-not [bool]$methodenMatrix.KontextGueltig -or
            -not (Test-SichererWinGetVersionswert -Wert $verfuegbar)) {
            $script:UebersprungeneUpdates++
            Add-Warnung -Text 'Ein Aktualisierungseintrag besass keine eindeutige Paket-ID, Quelle, Version oder Installationsscope und wurde paketweise isoliert.'
            Add-Resultat -Bereich 'Programme' -Aktion 'Updateeintrag pruefen' -Status 'Ungueltiger Paketkontext quarantiniert; weitere Pakete werden verarbeitet' -ExitCode 0 -Details ("ID: {0}; Quelle: {1}; Scope: {2}; Version: {3}; Methoden-Matrix: {4}" -f $id, $quelle, $scope, $verfuegbar, $methodenMatrix.Details)
            continue
        }

        $anteil = if ($anzahl -gt 0) { $index / [double]$anzahl } else { 1.0 }
        $prozent = 50 + [int][Math]::Floor($anteil * 12)
        $kategorieProzent = [int][Math]::Floor($anteil * 100)
        Set-Gesamtfortschritt -Prozent $prozent -Status ("Programm wird aktualisiert ({0}/{1}): {2} [{3}/{4}]" -f $index, $anzahl, $id, $quelle, $scope) -Kategorie 'Programmupdates' -KategorieProzent $kategorieProzent -Dauerhaft
        if (Test-WinGetUpdateIstQuarantiniert -Eintraege $quarantaeneEintraege -Id $id -Quelle $quelle -Scope $scope -Verfuegbar $verfuegbar) {
            $script:UebersprungeneUpdates++
            Add-Resultat -Bereich 'Programme' -Aktion ("Update $id") -Status 'Manifestversion wegen bestaetigter Hashabweichung sicher quarantiniert' -ExitCode 0 -Details ("Quelle: {0}; Scope: {1}; angebotene Version: {2}" -f $quelle, $scope, $verfuegbar)
            Write-Status -Text ("Sicher ausgelassen: {0} ({1}/{2}, {3}) bleibt bis zu einer geaenderten Manifestversion in Quarantaene." -f $id, $quelle, $scope, $verfuegbar) -Stufe 'INFO'
            continue
        }

        try {
            $vorab = Test-WinGetUpdateVorab -WinGet $WinGet -Id $id -Quelle $quelle -Scope $scope -Verfuegbar $verfuegbar
        }
        catch {
            $script:FehlgeschlageneUpdates++
            Add-Warnung -Text ("Die Update-Vorabpruefung fuer '{0}' wurde nach einer unerwarteten paketbezogenen Ausnahme isoliert; die Update- und Reparaturpruefung aller weiteren Programme wird fortgesetzt: {1}" -f $id, $_.Exception.Message)
            Add-Resultat -Bereich 'Programme' -Aktion ("Update-Vorabpruefung $id") -Status 'Paketbezogene Ausnahme isoliert; weitere Programme werden verarbeitet' -ExitCode -1 -Details ($_ | Out-String)
            continue
        }
        if (-not [bool](Get-SichereEigenschaft -Objekt $vorab -Name 'Erfolgreich' -Standardwert $false)) {
            $script:FehlgeschlageneUpdates++
            $vorabCode = [int](Get-SichereEigenschaft -Objekt $vorab -Name 'ExitCode' -Standardwert -1)
            $vorabDetails = Get-SichererText -Objekt $vorab -Name 'Details'
            $quarantiniert = [bool](Get-SichereEigenschaft -Objekt $vorab -Name 'Quarantiniert' -Standardwert $false)
            Add-Resultat -Bereich 'Programme' -Aktion ("Update-Vorabpruefung $id") -Status $(if ($quarantiniert) { 'Hashabweichung erkannt und Manifestversion quarantiniert' } else { 'Fehlgeschlagen' }) -ExitCode $vorabCode -Details $vorabDetails
            Add-Warnung -Text ("Update-Vorabpruefung fuer '{0}' fehlgeschlagen (Exitcode {1}){2}. Nur dieses Paket wird ausgelassen; die Update- und Reparaturpruefung aller weiteren Programme wird fortgesetzt." -f $id, $vorabCode, $(if ($quarantiniert) { '; Manifestversion wurde sicher und dauerhaft quarantiniert' } else { '; Paket wurde fuer diesen Lauf isoliert' }))
            Write-Status -Text ("Paketfehler isoliert; naechstes Programm wird verarbeitet: {0} ({1}/{2}, {3})." -f $id, $quelle, $scope, $verfuegbar) -Stufe 'INFO'
            continue
        }
        Add-Resultat -Bereich 'Programme' -Aktion ("Update-Vorabpruefung $id") -Status 'Bestanden' -ExitCode 0 -Details ("{0}{1}Methoden-Matrix: {2}" -f (Get-SichererText -Objekt $vorab -Name 'Details'), [Environment]::NewLine, $methodenMatrix.Details)
        if (Remove-WinGetUpdateQuarantaeneFuerPaket -Id $id -Quelle $quelle -Scope $scope) {
            $quarantaeneEintraege = @(Get-WinGetUpdateQuarantaene)
            Add-Resultat -Bereich 'Programme' -Aktion ("Update-Quarantaene $id") -Status 'Fruehere Manifestquarantaene nach erfolgreicher neuer Vorabpruefung aufgehoben' -ExitCode 0 -Details ("Quelle: {0}; Scope: {1}; erfolgreich gepruefte Version: {2}" -f $quelle, $scope, $verfuegbar)
            Write-Status -Text ("Neue Manifestversion erfolgreich geprueft; fruehere Quarantaene aufgehoben: {0} ({1}/{2}, {3})." -f $id, $quelle, $scope, $verfuegbar) -Stufe 'OK'
        }

        try {
            $appxKontext = Resolve-WinGetAppxUpdateKontext -Id $id -Quelle $quelle -Scope $scope `
                -IstAppx ([bool](Get-SichereEigenschaft -Objekt $vorab -Name 'IstAppx' -Standardwert $false)) `
                -AppxIdentitaeten @(Get-SichereEigenschaft -Objekt $vorab -Name 'AppxIdentitaeten' -Standardwert @())
        }
        catch {
            $script:UebersprungeneUpdates++
            Add-Warnung -Text ("Die AppX-/MSIX-Identitaetspruefung fuer '{0}' wurde nach einem paketbezogenen Fehler sicher isoliert; weitere Programme werden aktualisiert: {1}" -f $id, $_.Exception.Message)
            Add-Resultat -Bereich 'Programme' -Aktion ("AppX-Scopepruefung $id") -Status 'Paketfehler isoliert; Updatefolge wird fortgesetzt' -ExitCode -1 -Details ($_ | Out-String)
            continue
        }
        $appxStatus = Get-SichererText -Objekt $appxKontext -Name 'Status'
        $appxDetails = Get-SichererText -Objekt $appxKontext -Name 'Details'
        if (-not [bool](Get-SichereEigenschaft -Objekt $appxKontext -Name 'Ausfuehren' -Standardwert $false)) {
            $script:UebersprungeneUpdates++
            Add-Resultat -Bereich 'Programme' -Aktion ("Update $id") -Status $appxStatus -ExitCode 0 -Details $appxDetails
            Write-Status -Text ("Sicher ausgelassen: {0} ({1}/{2}) - {3}." -f $id, $quelle, $scope, $appxStatus) -Stufe 'INFO'
            continue
        }

        $korrigierterScope = Get-SichererText -Objekt $appxKontext -Name 'Scope' -Standardwert $scope
        if ($korrigierterScope -ne $scope) {
            Add-Resultat -Bereich 'Programme' -Aktion ("AppX-Scopepruefung $id") -Status $appxStatus -ExitCode 0 -Details $appxDetails
            Write-Status -Text ("AppX-Scope vor der Installation korrigiert: {0} ({1} -> {2})." -f $id, $scope, $korrigierterScope) -Stufe 'OK'
            $scope = $korrigierterScope
            if (Test-WinGetUpdateIstQuarantiniert -Eintraege $quarantaeneEintraege -Id $id -Quelle $quelle -Scope $scope -Verfuegbar $verfuegbar) {
                $script:UebersprungeneUpdates++
                Add-Resultat -Bereich 'Programme' -Aktion ("Update $id") -Status 'Korrigierter AppX-Scope wegen bestaetigter Hashabweichung sicher quarantiniert' -ExitCode 0 -Details ("Quelle: {0}; Scope: {1}; angebotene Version: {2}" -f $quelle, $scope, $verfuegbar)
                continue
            }
        }

        $updateKontextSchluessel = "{0}|{1}|{2}|{3}" -f $id, $quelle, $scope, $verfuegbar
        if (-not $verarbeiteteUpdateKontexte.Add($updateKontextSchluessel)) {
            $script:UebersprungeneUpdates++
            Add-Resultat -Bereich 'Programme' -Aktion ("Update $id") -Status 'Nach AppX-Scopepruefung identischer Updatekontext bereits verarbeitet' -ExitCode 0 -Details ("Quelle: {0}; Scope: {1}; Version: {2}" -f $quelle, $scope, $verfuegbar)
            continue
        }

        $fehlgeschlageneUpdatesVorher = [int]$script:FehlgeschlageneUpdates
        try {
            $updateErfolgreich = Invoke-WinGetEinzelUpdate -WinGet $WinGet -Id $id -Quelle $quelle -Scope $scope -Verfuegbar $verfuegbar -ListHilfeText $listHilfeText
        }
        catch {
            if ([int]$script:FehlgeschlageneUpdates -eq $fehlgeschlageneUpdatesVorher) { $script:FehlgeschlageneUpdates++ }
            $updateErfolgreich = $false
            Add-Warnung -Text ("Der Updateaufruf fuer '{0}' wurde nach einer unerwarteten paketbezogenen Ausnahme isoliert; alle weiteren Programme werden verarbeitet: {1}" -f $id, $_.Exception.Message)
            Add-Resultat -Bereich 'Programme' -Aktion ("Update $id") -Status 'Paketbezogene Ausnahme isoliert; Updatefolge wird fortgesetzt' -ExitCode -1 -Details ($_ | Out-String)
        }
        if ($updateErfolgreich) {
            $null = Ensure-DesktopVerknuepfungFuerProgramm -Id $id -Anzeigename $anzeigename -Scope $scope -Quelle $quelle -FehlerIstFatal:$false
        }
        if ($script:NeustartErforderlich) {
            Add-Resultat -Bereich 'Programme' -Aktion ("Updatefolge nach $id pausieren") -Status 'Keine weiteren Pakete vor dem erforderlichen Neustart verarbeitet' -ExitCode 3010 -Details ("Quelle: {0}; Scope: {1}; angebotene Version: {2}" -f $quelle, $scope, $verfuegbar)
            Write-Status -Text ("Die Updatefolge wird unmittelbar nach der Neustartanforderung von '{0}' pausiert." -f $id) -Stufe 'INFO'
            break
        }
        if (-not $updateErfolgreich) {
            Write-Status -Text ("Paketupdate fehlgeschlagen und paketweise isoliert; die Pruefung wird mit dem naechsten Programm fortgesetzt: {0} ({1}/{2}, {3})." -f $id, $quelle, $scope, $verfuegbar) -Stufe 'INFO'
        }
    }

    if ($anzahl -eq 0) {
        Write-Status -Text 'Es wurden keine eindeutig und sicher auswertbaren Programmaktualisierungen gefunden.' -Stufe 'OK'
    }

    Write-Status -Text ("Programmaktualisierung abgeschlossen. Erfolgreich: {0}; bereits aktuell: {1}; uebersprungen: {2}; fehlgeschlagen: {3}; unsichere Tabellenzeilen: {4}; ausgelassene Kontexte: {5}." -f $script:AktualisiertePakete, $script:BereitsAktuellePakete, $script:UebersprungeneUpdates, $script:FehlgeschlageneUpdates, $script:UnsichereUpdateZeilen, $script:AusgelasseneUpdateKontexte) -Stufe $(if ($script:FehlgeschlageneUpdates -gt 0 -or $script:AusgelasseneUpdateKontexte -gt 0 -or $script:UnsichereUpdateZeilen -gt 0) { 'WARNUNG' } else { 'OK' })
}

function Get-ReparaturPakete {
    param([Parameter(Mandatory = $true)][string]$InventarPfad)

    $text = Get-Content -LiteralPath $InventarPfad -Raw -Encoding UTF8 -ErrorAction Stop
    $daten = Get-JsonObjektAusText -Text $text
    if ($null -eq $daten) {
        throw 'Das WinGet-Inventar besitzt kein gueltiges JSON-Format.'
    }

    $pakete = New-Object 'System.Collections.Generic.List[object]'
    $quellen = @(Get-SichereEigenschaft -Objekt $daten -Name 'Sources' -Standardwert @())

    foreach ($quelle in $quellen) {
        $quellenName = ''
        $sourceDetails = Get-SichereEigenschaft -Objekt $quelle -Name 'SourceDetails' -Standardwert $null
        $detailsName = Get-SichererText -Objekt $sourceDetails -Name 'Name'
        if (-not [string]::IsNullOrWhiteSpace($detailsName)) {
            $quellenName = $detailsName
        }

        $quellPakete = @(Get-SichereEigenschaft -Objekt $quelle -Name 'Packages' -Standardwert @())
        foreach ($paket in $quellPakete) {
            $id = Get-SichererText -Objekt $paket -Name 'PackageIdentifier'
            if ([string]::IsNullOrWhiteSpace($id)) {
                continue
            }
            $pakete.Add([pscustomobject]@{
                Id = $id
                Quelle = $quellenName
            }) | Out-Null
        }
    }

    return @($pakete.ToArray() | Sort-Object Id, Quelle -Unique)
}

function Test-PaketAusgeschlossen {
    param([Parameter(Mandatory = $true)][string]$Id)

    $muster = @(
        '(?i)(^|\.)(driver|drivers|firmware|bios)(\.|$)',
        '(?i)((^|[._+\-])(antivirus|endpoint|securityagent|edr)([._+\-]|$)|vpn)',
        '(?i)(nvidia|amd\.software|intel\.driver|realtek)',
        '(?i)(virtualbox|vmware|hyper-v|dockerdesktop|wsl)',
        # Diese AppX-/UWP-Laufzeitpakete erscheinen regulaer mehrfach fuer
        # verschiedene Architekturen oder Frameworkversionen. Sie werden durch
        # Windows, den Store und die Komponentenreparatur gewartet. Eine
        # generische WinGet-Reparatur koennte dagegen Abhaengigkeiten oder
        # Benutzerregistrierungen ungezielt veraendern.
        '(?i)^Microsoft\.DirectX$',
        '(?i)^Microsoft\.DotNet\.Native\.(?:Framework|Runtime)(?:\.|$)',
        '(?i)^Microsoft\.UI\.Xaml(?:\.|$)',
        '(?i)^Microsoft\.VCLibs(?:\.Desktop)?(?:\.|$)',
        '(?i)^Microsoft\.WindowsAppRuntime(?:\.|$)',
        '(?i)^Microsoft\.PowerShell$',
        '(?i)^Microsoft\.AppInstaller$',
        '(?i)^Microsoft\.DesktopAppInstaller$',
        '(?i)^Microsoft\.WindowsTerminal$'
    )

    foreach ($regex in $muster) {
        if ($Id -match $regex) {
            return $true
        }
    }
    return $false
}

function Test-SichereWinGetPaketId {
    param([AllowNull()][string]$Id)

    if ([string]::IsNullOrWhiteSpace($Id) -or $Id.Length -gt 256) {
        return $false
    }

    # WinGet-Paketkennungen bestehen regulaer aus Buchstaben, Ziffern, Punkten,
    # Unterstrichen, Plus- und Minuszeichen. Die strikte Positivliste verhindert,
    # dass eine manipulierte Kennung als zusaetzliche Befehlsoption interpretiert wird.
    return ($Id -match '^[A-Za-z0-9][A-Za-z0-9._+\-]{0,255}$')
}

function Test-SichereWinGetPaketIdFuerQuelle {
    param(
        [AllowNull()][string]$Id,
        [Parameter(Mandatory = $true)][ValidateSet('winget', 'msstore')][string]$Quelle
    )

    if (-not (Test-SichereWinGetPaketId -Id $Id)) {
        return $false
    }

    if ($Quelle -eq 'winget') {
        # Community-Paketkennungen folgen dem Schema Herausgeber.Paket.
        # Die Punktanforderung verhindert, dass ein einzelnes Wort aus einem
        # Programmnamen bei einer beschaedigten Tabellenzeile als Paket-ID gilt.
        return ($Id -match '^[A-Za-z0-9][A-Za-z0-9_+\-]*(?:\.[A-Za-z0-9][A-Za-z0-9_+\-]*)+$')
    }

    # Microsoft-Store-Produktkennungen bestehen regulaer aus einer kompakten
    # alphanumerischen Kennung ohne Punkte und beginnen regulaer mit 9 oder X. Ein enger Laengenbereich verhindert
    # ebenfalls Fehlinterpretationen normaler Namenswoerter.
    return ($Id -match '^(?:9|X)[A-Z0-9]{9,19}$')
}

function Test-SichererWinGetVersionswert {
    param([AllowNull()][string]$Wert)

    if ([string]::IsNullOrWhiteSpace($Wert) -or $Wert.Length -gt 128 -or $Wert -match '[\x00-\x1F\x7F]') {
        return $false
    }

    $bereinigt = $Wert.Trim()
    if ($bereinigt -match '(?i)^(unknown|unbekannt|latest|neueste|n/a)$') {
        return $true
    }

    # WinGet kann Vergleichsmarker und Architektur-/Scope-Zusaetze mit Leerzeichen
    # ausgeben, etwa "< 19.5.0.221" oder "1.13.7 (machine-wide)". Der Wert wird
    # nur geprueft und protokolliert, niemals als Befehlsargument verwendet.
    return ($bereinigt -match '[0-9]')
}

function Get-SichereProgrammMethodenMatrix {
    param(
        [Parameter(Mandatory = $true)]
        [ValidateSet('WinGet', 'Registry', 'RegistryOnline', 'MSI', 'AppX')]
        [string]$Typ,
        [AllowEmptyString()][string]$Id = '',
        [AllowEmptyString()][string]$Quelle = '',
        [AllowEmptyString()][string]$Scope = '',
        [AllowEmptyString()][string]$DisplayName = '',
        [AllowEmptyString()][string]$Publisher = '',
        [AllowEmptyString()][string]$ProductCode = '',
        [AllowEmptyString()][string]$AppxIdentitaet = '',
        [bool]$HerausgeberBestaetigt = $false
    )

    # Diese Matrix ist das gemeinsame Sicherheitsmodell fuer Inventar,
    # Integritaetspruefung, Update, Reparatur und Neuinstallation. Eine Route
    # wird nur freigegeben, wenn die zu ihr gehoerende Windows- bzw. WinGet-
    # Identitaet eindeutig ist. Ein gleicher Anzeigename allein ist niemals
    # eine ausreichende Online-Identitaet.
    $scopeGueltig = $Scope -in @('user', 'machine')
    $winGetKontextGueltig = (
        $Quelle -in @('winget', 'msstore') -and
        $scopeGueltig -and
        (Test-SichereWinGetPaketIdFuerQuelle -Id $Id -Quelle $Quelle)
    )
    $nameGueltig = (-not [string]::IsNullOrWhiteSpace($DisplayName) -and
        $DisplayName.Length -le 240 -and $DisplayName -notmatch '[\x00-\x1F\x7F]')
    $productCodeGueltig = $ProductCode -match '^\{[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}\}$'
    $appxGueltig = $AppxIdentitaet -match '^[A-Za-z0-9][A-Za-z0-9.-]{2,49}$'

    $kontextGueltig = $false
    $onlineFreigegeben = $false
    $lokaleReparaturFreigegeben = $false
    $identitaet = ''
    $integritaet = ''
    $update = ''
    $reparatur = ''

    switch ($Typ) {
        'WinGet' {
            $kontextGueltig = $winGetKontextGueltig
            $onlineFreigegeben = $kontextGueltig
            $identitaet = 'Exakte WinGet-Paket-ID + verifizierte Standardquelle + Installationsscope'
            $integritaet = if ($Quelle -eq 'msstore') { 'Microsoft-Store-Bereitstellung und Paketsignatur' } else { 'WinGet-Manifest-SHA-256 + Authenticode-Status + kontrollierter Downloadpfad' }
            $update = 'Paketweises WinGet-Upgrade mit ID, --exact, Quelle und Scope; anschliessende Listen-Nachkontrolle'
            $reparatur = 'WinGet-Repair; nur nach Vorabpruefung In-Place-Neuinstallation im selben Scope'
        }
        'Registry' {
            $kontextGueltig = ($nameGueltig -and $scopeGueltig)
            $lokaleReparaturFreigegeben = ($kontextGueltig -and $productCodeGueltig)
            $identitaet = 'Registry-Uninstall-Eintrag + Anzeigename + Herausgeber + Scope; bei MSI zusaetzlich Produktcode'
            $integritaet = 'Installationsordner + registrierte Programmdatei/PE-Struktur + Authenticode-Status + Deinstallationspfad'
            $update = 'Nur nach eindeutiger WinGet-/Store-Zuordnung; gleicher Name allein ist gesperrt'
            $reparatur = if ($productCodeGueltig) { 'Lokale Windows-Installer-Pruefung und MSI-Reparatur ueber exakten Produktcode' } else { 'Herstellerdiagnose oder eindeutig verifizierter Paketmanager-Pfad' }
        }
        'RegistryOnline' {
            $kontextGueltig = ($nameGueltig -and -not [string]::IsNullOrWhiteSpace($Publisher) -and $winGetKontextGueltig -and $HerausgeberBestaetigt)
            $onlineFreigegeben = $kontextGueltig
            $identitaet = 'Exakter installierter Name + installierter Herausgeber + exakte Paket-ID + Manifest-Herausgeber + Quelle + Scope'
            $integritaet = if ($Quelle -eq 'msstore') { 'Microsoft-Store-Bereitstellung' } else { 'Verpflichtender WinGet-Manifest-Hash und Authenticode-Status vor jeder Aenderung' }
            $update = 'Nur die eindeutig verifizierte Paketidentitaet in der offiziellen Quelle'
            $reparatur = 'In-Place-Neuinstallation erst nach erneut bestaetigtem Installationsstatus und Vorabdownload'
        }
        'MSI' {
            $kontextGueltig = ($scopeGueltig -and $productCodeGueltig)
            $lokaleReparaturFreigegeben = $kontextGueltig
            $identitaet = 'Windows-Installer-Produktcode + Registry-Scope'
            $integritaet = 'Windows Installer ProductState + MSI-Rueckgabecode + MSI-Protokoll'
            $update = 'Kein anonymer MSI-Download; Update nur ueber eindeutig verifizierten Paketmanager-/Herstellerkanal'
            $reparatur = 'msiexec /focmus mit exaktem Produktcode und anschliessender ProductState-Nachkontrolle'
        }
        'AppX' {
            $kontextGueltig = ($winGetKontextGueltig -and $appxGueltig)
            $onlineFreigegeben = $kontextGueltig
            $identitaet = 'AppX/MSIX-Manifestidentitaet + aktive Windows-Paketregistrierung + WinGet-ID/Quelle/Scope'
            $integritaet = 'Signiertes Paketformat + Manifestidentitaet + aktive Benutzerregistrierung'
            $update = 'Microsoft Store oder WinGet mit exakter Paketidentitaet im aktiven Benutzerscope'
            $reparatur = 'Keine ungezielte AllUsers-Aenderung; nur die bestaetigte aktive Registrierung'
        }
    }

    return [pscustomobject]@{
        Typ = $Typ
        KontextGueltig = [bool]$kontextGueltig
        OnlineAktionFreigegeben = [bool]$onlineFreigegeben
        LokaleReparaturFreigegeben = [bool]$lokaleReparaturFreigegeben
        Identitaetsmethoden = $identitaet
        Integritaetsmethoden = $integritaet
        Updatemethode = $update
        Reparaturmethode = $reparatur
        Details = ('Typ: {0}; Identitaet: {1}; Integritaet: {2}; Update: {3}; Reparatur: {4}' -f $Typ, $identitaet, $integritaet, $update, $reparatur)
    }
}

function ConvertTo-HerausgeberVergleichswert {
    param([AllowNull()][AllowEmptyString()][string]$Wert)

    if ([string]::IsNullOrWhiteSpace($Wert)) { return '' }
    $teile = @($Wert.ToLowerInvariant() -split '[^\p{L}\p{Nd}]+' | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
    $rechtsformen = @('ag', 'co', 'company', 'corp', 'corporation', 'gmbh', 'inc', 'incorporated', 'limited', 'llc', 'ltd', 'plc', 'sa', 'se')
    while ($teile.Count -gt 1 -and $teile[$teile.Count - 1] -in $rechtsformen) {
        $teile = @($teile[0..($teile.Count - 2)])
    }
    return ($teile -join '')
}

function Test-HerausgeberIdentitaetUebereinstimmung {
    param(
        [AllowNull()][AllowEmptyString()][string]$InstallierterHerausgeber,
        [AllowNull()][AllowEmptyString()][string]$ManifestHerausgeber
    )

    $installiert = ConvertTo-HerausgeberVergleichswert -Wert $InstallierterHerausgeber
    $manifest = ConvertTo-HerausgeberVergleichswert -Wert $ManifestHerausgeber
    return (-not [string]::IsNullOrWhiteSpace($installiert) -and
        -not [string]::IsNullOrWhiteSpace($manifest) -and
        [string]::Equals($installiert, $manifest, [StringComparison]::OrdinalIgnoreCase))
}

function Compare-EinfachePaketversion {
    param(
        [Parameter(Mandatory = $true)][string]$Links,
        [Parameter(Mandatory = $true)][string]$Rechts
    )

    # Nur rein numerische, punktgetrennte Versionen werden geordnet. Fuer
    # Herstellerformate mit Text, Datumszusatz oder Vergleichsmarker wird kein
    # vermeintlich sicherer Vergleich erfunden.
    $linksBereinigt = $Links.Trim()
    $rechtsBereinigt = $Rechts.Trim()
    if ($linksBereinigt -notmatch '^\d+(?:\.\d+){0,15}$' -or
        $rechtsBereinigt -notmatch '^\d+(?:\.\d+){0,15}$') {
        return $null
    }

    $linksTeile = @($linksBereinigt -split '\.')
    $rechtsTeile = @($rechtsBereinigt -split '\.')
    $anzahl = [Math]::Max($linksTeile.Count, $rechtsTeile.Count)
    for ($i = 0; $i -lt $anzahl; $i++) {
        $linksWert = if ($i -lt $linksTeile.Count) { [Numerics.BigInteger]::Parse($linksTeile[$i]) } else { [Numerics.BigInteger]::Zero }
        $rechtsWert = if ($i -lt $rechtsTeile.Count) { [Numerics.BigInteger]::Parse($rechtsTeile[$i]) } else { [Numerics.BigInteger]::Zero }
        if ($linksWert -gt $rechtsWert) { return 1 }
        if ($linksWert -lt $rechtsWert) { return -1 }
    }
    return 0
}

function Get-WinGetManifestVersion {
    param(
        [Parameter(Mandatory = $true)][string]$WinGet,
        [Parameter(Mandatory = $true)][string]$Id,
        [Parameter(Mandatory = $true)][ValidateSet('winget', 'msstore')][string]$Quelle
    )

    if (-not (Test-SichereWinGetPaketIdFuerQuelle -Id $Id -Quelle $Quelle)) {
        return [pscustomobject]@{ Eindeutig = $false; Version = ''; Details = 'Ungueltige Paketkennung.' }
    }

    $ergebnis = Invoke-Native -Datei $WinGet -Argumente @(
        'show', '--id', $Id, '--exact', '--source', $Quelle,
        '--accept-source-agreements', '--disable-interactivity'
    ) -Beschreibung ("Manifestversion pruefen ({0}): {1}" -f $Quelle, $Id) -TimeoutSekunden 120 -FehlerNurResultat -AusgabeUnterdruecken
    if (-not $ergebnis.Erfolgreich) {
        return [pscustomobject]@{ Eindeutig = $false; Version = ''; Details = ("WinGet show fehlgeschlagen, Exitcode {0}." -f [int]$ergebnis.ExitCode) }
    }

    $versionen = @([regex]::Matches([string]$ergebnis.Ausgabe, '(?im)^\s*Version\s*:\s*(?<version>[^\r\n]+?)\s*$') |
        ForEach-Object { $_.Groups['version'].Value.Trim() } |
        Where-Object { Test-SichererWinGetVersionswert -Wert $_ } |
        Sort-Object -Unique)
    if ($versionen.Count -ne 1) {
        return [pscustomobject]@{ Eindeutig = $false; Version = ''; Details = ("Manifestversion nicht eindeutig lesbar; Treffer: {0}." -f $versionen.Count) }
    }
    return [pscustomobject]@{ Eindeutig = $true; Version = [string]$versionen[0]; Details = ("Manifestversion: {0}" -f $versionen[0]) }
}

function Test-MicrosoftProgrammIdentitaet {
    param(
        [Parameter(Mandatory = $true)][string]$Pfad,
        [Parameter(Mandatory = $true)][ValidateSet('PowerShell', 'WinGet')][string]$Programm
    )

    try {
        $versionInfo = [Diagnostics.FileVersionInfo]::GetVersionInfo($Pfad)
        $produkt = ([string]$versionInfo.ProductName).Trim()
        $original = ([string]$versionInfo.OriginalFilename).Trim()
        $intern = ([string]$versionInfo.InternalName).Trim()
        $firma = ([string]$versionInfo.CompanyName).Trim()
        if ($firma -ne 'Microsoft Corporation') { return $false }

        if ($Programm -eq 'PowerShell') {
            return ($produkt -eq 'PowerShell' -and $original -in @('pwsh.dll', 'pwsh.exe'))
        }
        return ($original -eq 'winget.exe' -and $intern -eq 'AppInstallerCLI' -and $produkt -eq 'Microsoft Desktop App Installer')
    }
    catch {
        return $false
    }
}

function ConvertTo-SichererDateiname {
    param(
        [Parameter(Mandatory = $true)][string]$Wert,
        [ValidateRange(8, 180)][int]$MaximaleLaenge = 100
    )

    $ergebnis = $Wert.Trim()
    foreach ($zeichen in [IO.Path]::GetInvalidFileNameChars()) {
        $ergebnis = $ergebnis.Replace([string]$zeichen, '_')
    }
    $ergebnis = [regex]::Replace($ergebnis, '[\x00-\x1F]', '_').TrimEnd([char[]]@('.', ' '))
    if ([string]::IsNullOrWhiteSpace($ergebnis)) {
        $ergebnis = 'Paket'
    }

    if ($ergebnis.Length -gt $MaximaleLaenge) {
        $ergebnis = $ergebnis.Substring(0, $MaximaleLaenge).TrimEnd([char[]]@('.', ' '))
    }

    $stamm = ($ergebnis -split '\.', 2)[0]
    if ($stamm -match '^(?i:CON|PRN|AUX|NUL|CLOCK\$|COM[1-9]|LPT[1-9])$') {
        $praefix = 'Paket_'
        $restLaenge = [Math]::Max(1, $MaximaleLaenge - $praefix.Length)
        if ($ergebnis.Length -gt $restLaenge) {
            $ergebnis = $ergebnis.Substring(0, $restLaenge).TrimEnd([char[]]@('.', ' '))
        }
        $ergebnis = $praefix + $ergebnis
    }

    if ($ergebnis.Length -gt $MaximaleLaenge) {
        $ergebnis = $ergebnis.Substring(0, $MaximaleLaenge).TrimEnd([char[]]@('.', ' '))
    }
    if ([string]::IsNullOrWhiteSpace($ergebnis)) {
        return 'Paket'
    }
    return $ergebnis
}

function Test-PfadUnterBasis {
    param(
        [Parameter(Mandatory = $true)][string]$Basis,
        [Parameter(Mandatory = $true)][string]$Kandidat
    )

    try {
        $basisVoll = [IO.Path]::GetFullPath($Basis).TrimEnd([char]92) + [char]92
        $kandidatVoll = [IO.Path]::GetFullPath($Kandidat)
        return $kandidatVoll.StartsWith($basisVoll, [StringComparison]::OrdinalIgnoreCase)
    }
    catch {
        return $false
    }
}

function Test-VerzeichnisketteOhneReparsePoint {
    param(
        [Parameter(Mandatory = $true)][string]$Basis,
        [Parameter(Mandatory = $true)][string]$Kandidat
    )

    try {
        if (-not (Test-PfadUnterBasis -Basis $Basis -Kandidat $Kandidat)) {
            return $false
        }

        $basisVoll = [IO.Path]::GetFullPath($Basis).TrimEnd([char]92)
        $kandidatVoll = [IO.Path]::GetFullPath($Kandidat)
        if (-not (Test-Path -LiteralPath $basisVoll -PathType Container)) {
            return $false
        }

        $aktuell = $basisVoll
        $zuPruefen = New-Object 'System.Collections.Generic.List[string]'
        $zuPruefen.Add($aktuell) | Out-Null
        $relativ = $kandidatVoll.Substring($basisVoll.Length).TrimStart([char]92)
        foreach ($teil in @($relativ -split '\\' | Where-Object { -not [string]::IsNullOrWhiteSpace([string]$_) })) {
            $aktuell = Join-Path -Path $aktuell -ChildPath ([string]$teil)
            $zuPruefen.Add($aktuell) | Out-Null
        }

        foreach ($pfad in $zuPruefen.ToArray()) {
            if (-not (Test-Path -LiteralPath $pfad)) {
                continue
            }
            $element = Get-Item -LiteralPath $pfad -Force -ErrorAction Stop
            if ($element.Attributes -band [IO.FileAttributes]::ReparsePoint) {
                return $false
            }
            if ($pfad -ne $kandidatVoll -and -not $element.PSIsContainer) {
                return $false
            }
        }
        return $true
    }
    catch {
        return $false
    }
}

function Remove-OneClickKontrolliertenLaufpfad {
    param(
        [Parameter(Mandatory = $true)][string]$Pfad,
        [Parameter(Mandatory = $true)][string]$Basis,
        [Parameter(Mandatory = $true)][string]$ErlaubtesNamensmuster,
        [switch]$NichtZaehlen
    )

    $basisVoll = [IO.Path]::GetFullPath($Basis).TrimEnd([char]92)
    $pfadVoll = [IO.Path]::GetFullPath($Pfad)
    $name = [IO.Path]::GetFileName($pfadVoll.TrimEnd([char]92))
    if ([string]::IsNullOrWhiteSpace($name) -or $name -notmatch $ErlaubtesNamensmuster) {
        throw ("Der Abschlussbereinigungspfad besitzt keinen erlaubten laufbezogenen Namen: {0}" -f $pfadVoll)
    }
    if (-not (Test-Path -LiteralPath $basisVoll -PathType Container) -or
        -not (Test-PfadUnterBasis -Basis $basisVoll -Kandidat $pfadVoll) -or
        -not (Test-VerzeichnisketteOhneReparsePoint -Basis $basisVoll -Kandidat $pfadVoll)) {
        throw ("Der Abschlussbereinigungspfad liegt nicht sicher unter seiner kontrollierten Basis: {0}" -f $pfadVoll)
    }

    if (-not (Test-Path -LiteralPath $pfadVoll)) {
        return [pscustomobject]@{ Pfad = $pfadVoll; Dateien = 0; Ordner = 0; Bytes = [int64]0; Entfernt = $true }
    }

    $wurzel = Get-Item -LiteralPath $pfadVoll -Force -ErrorAction Stop
    if ($wurzel.Attributes -band [IO.FileAttributes]::ReparsePoint) {
        throw ("Eine Pfadumleitung wird aus Sicherheitsgruenden nicht rekursiv bereinigt: {0}" -f $pfadVoll)
    }

    $dateien = @()
    $ordner = @()
    if ($wurzel.PSIsContainer) {
        $inhalt = @(Get-ChildItem -LiteralPath $pfadVoll -Recurse -Force -ErrorAction Stop)
        $umleitungen = @($inhalt | Where-Object { $_.Attributes -band [IO.FileAttributes]::ReparsePoint })
        if ($umleitungen.Count -gt 0) {
            throw ("Der laufbezogene Bereinigungspfad enthaelt eine unerwartete Pfadumleitung: {0}" -f $umleitungen[0].FullName)
        }
        $dateien = @($inhalt | Where-Object { -not $_.PSIsContainer })
        $ordner = @($inhalt | Where-Object { $_.PSIsContainer })
    }
    else {
        $dateien = @($wurzel)
    }
    $bytes = [int64]0
    foreach ($datei in $dateien) {
        $bytes += [int64]$datei.Length
    }
    $dateiAnzahl = [int]$dateien.Count
    $ordnerAnzahl = [int]$ordner.Count + $(if ($wurzel.PSIsContainer) { 1 } else { 0 })

    $letzterFehler = ''
    for ($versuch = 1; $versuch -le 3; $versuch++) {
        try {
            Remove-Item -LiteralPath $pfadVoll -Recurse -Force -ErrorAction Stop
        }
        catch {
            $letzterFehler = $_.Exception.Message
        }
        if (-not (Test-Path -LiteralPath $pfadVoll)) { break }
        if ($versuch -lt 3) { Start-Sleep -Milliseconds 100 }
    }
    if (Test-Path -LiteralPath $pfadVoll) {
        throw ("Der laufbezogene Restpfad wurde nach drei Versuchen nicht vollstaendig entfernt: {0}. {1}" -f $pfadVoll, $letzterFehler)
    }

    if (-not $NichtZaehlen) {
        $script:BereinigteRestdateien += $dateiAnzahl
        $script:BereinigteRestordner += $ordnerAnzahl
        $script:BereinigteRestbytes += $bytes
    }
    return [pscustomobject]@{ Pfad = $pfadVoll; Dateien = $dateiAnzahl; Ordner = $ordnerAnzahl; Bytes = $bytes; Entfernt = $true }
}

function Test-OneClickRuntimeOrdnerPfad {
    param([Parameter(Mandatory = $true)][string]$Pfad)

    try { $kandidat = [IO.Path]::GetFullPath($Pfad).TrimEnd([char]92) }
    catch { return $false }
    try { $dokumente = Get-OneClickDokumenteBasis }
    catch { return $false }
    $erlaubtePfade = @(
        (Join-Path $dokumente 'OneClick-ProgrammReparatur-Laufzeit'),
        (Join-Path $dokumente 'OneClick-ProgrammReparatur-Benutzer-Laufzeit')
    )
    return (@($erlaubtePfade | Where-Object {
        -not [string]::IsNullOrWhiteSpace([string]$_) -and
        [string]::Equals([IO.Path]::GetFullPath([string]$_).TrimEnd([char]92), $kandidat, [StringComparison]::OrdinalIgnoreCase)
    }).Count -eq 1)
}

function Get-OneClickAndereAktiveLaeufe {
    $selbstPfad = [string](Get-Variable -Name 'SelfPath' -Scope Script -ValueOnly -ErrorAction SilentlyContinue)
    $istBenutzerTeil = [bool](Get-Variable -Name 'NurBenutzerProgramme' -Scope Script -ValueOnly -ErrorAction SilentlyContinue)
    if ([string]::IsNullOrWhiteSpace($selbstPfad)) {
        throw 'Der eigene Skriptpfad fehlt fuer die sichere Erkennung paralleler OneClick-Laeufe.'
    }
    $dateiArgumentMuster = '(?i)(?:^|\s)-File\s+"?' + [regex]::Escape($selbstPfad) + '"?(?=\s|$)'
    try {
        return @(Get-CimInstance -ClassName Win32_Process -Property ProcessId, Name, CommandLine -ErrorAction Stop | Where-Object {
            [int]$_.ProcessId -ne [int]$PID -and
            [string]$_.Name -eq 'pwsh.exe' -and
            -not [string]::IsNullOrWhiteSpace([string]$_.CommandLine) -and
            ([string]$_.CommandLine -match $dateiArgumentMuster) -and
            (-not $istBenutzerTeil -or ([string]$_.CommandLine -match '(?i)(?:^|\s)-NurBenutzerProgramme(?:\s|$)'))
        })
    }
    catch {
        throw ("Andere aktive OneClick-Laeufe konnten vor der Restdatenbereinigung nicht sicher ausgeschlossen werden: {0}" -f $_.Exception.Message)
    }
}

function Remove-OneClickRuntimeOrdner {
    param(
        [Parameter(Mandatory = $true)][string]$Pfad,
        [switch]$FortsetzungBehalten,
        [switch]$PaketPruefstatusBehalten
    )

    $vollPfad = [IO.Path]::GetFullPath($Pfad).TrimEnd([char]92)
    if (-not (Test-OneClickRuntimeOrdnerPfad -Pfad $vollPfad)) {
        throw ("Ein nicht eindeutig OneClick zugeordneter Laufzeitordner wird nicht bereinigt: {0}" -f $vollPfad)
    }
    if (-not (Test-Path -LiteralPath $vollPfad -PathType Container)) {
        return [pscustomobject]@{ Pfad = $vollPfad; Entfernt = $true; FortsetzungBehalten = [bool]$FortsetzungBehalten; PaketPruefstatusBehalten = [bool]$PaketPruefstatusBehalten }
    }
    if (-not (Test-VerzeichnisketteOhneReparsePoint -Basis ([IO.Path]::GetDirectoryName($vollPfad)) -Kandidat $vollPfad)) {
        throw 'Der OneClick-Laufzeitordner oder seine Verzeichniskette ist unsicher.'
    }

    if (-not $FortsetzungBehalten -and -not $PaketPruefstatusBehalten) {
        $name = [IO.Path]::GetFileName($vollPfad)
        $muster = if ($name -eq 'OneClick-ProgrammReparatur-Laufzeit') { '^OneClick-ProgrammReparatur-Laufzeit$' } else { '^OneClick-ProgrammReparatur-Benutzer-Laufzeit$' }
        return (Remove-OneClickKontrolliertenLaufpfad -Pfad $vollPfad -Basis ([IO.Path]::GetDirectoryName($vollPfad)) -ErlaubtesNamensmuster $muster)
    }

    foreach ($element in @(Get-ChildItem -LiteralPath $vollPfad -Force -ErrorAction Stop)) {
        if ($FortsetzungBehalten -and $element.Name -eq 'Fortsetzung' -and $element.PSIsContainer) { continue }
        if ($PaketPruefstatusBehalten -and $element.Name -eq 'Paket-Pruefstatus-v1.json' -and -not $element.PSIsContainer) { continue }
        $null = Remove-OneClickKontrolliertenLaufpfad -Pfad $element.FullName -Basis $vollPfad -ErlaubtesNamensmuster '^[A-Za-z0-9][A-Za-z0-9_.-]{0,199}$'
    }
    if ($FortsetzungBehalten) {
        $fortsetzung = Join-Path $vollPfad 'Fortsetzung'
        if (-not (Test-Path -LiteralPath $fortsetzung -PathType Container)) {
            throw 'Die erforderliche Neustartfortsetzung fehlt nach der Restdatenbereinigung.'
        }
        $unerwarteteFortsetzungsdaten = @(Get-ChildItem -LiteralPath $fortsetzung -Force -ErrorAction Stop | Where-Object {
            $_.PSIsContainer -or $_.Name -notmatch '^(?:Fortsetzungsstatus-[0-9a-f]{16}\.dpapi|OneClick-Komplettreparatur-Fortsetzung-[0-9a-f]{16}\.ps1)$'
        })
        if ($unerwarteteFortsetzungsdaten.Count -gt 0) {
            throw ("Die beibehaltene Neustartfortsetzung enthaelt unerwartete Restdaten: {0}" -f $unerwarteteFortsetzungsdaten[0].Name)
        }
    }
    if ($PaketPruefstatusBehalten) {
        $statusPfad = Join-Path $vollPfad 'Paket-Pruefstatus-v1.json'
        if (Test-Path -LiteralPath $statusPfad -PathType Leaf) {
            $statusInfo = Get-Item -LiteralPath $statusPfad -Force -ErrorAction Stop
            if (($statusInfo.Attributes -band [IO.FileAttributes]::ReparsePoint) -or $statusInfo.Length -le 0 -or $statusInfo.Length -gt 4194304) {
                throw 'Der bis zum erfolgreichen Gesamtlauf beibehaltene Paket-Pruefstatus ist ungueltig.'
            }
        }
    }
    $erlaubteRestnamen = New-Object 'System.Collections.Generic.List[string]'
    if ($FortsetzungBehalten) { $erlaubteRestnamen.Add('Fortsetzung') | Out-Null }
    if ($PaketPruefstatusBehalten -and (Test-Path -LiteralPath (Join-Path $vollPfad 'Paket-Pruefstatus-v1.json') -PathType Leaf)) { $erlaubteRestnamen.Add('Paket-Pruefstatus-v1.json') | Out-Null }
    $unerwarteteLaufzeitreste = @(Get-ChildItem -LiteralPath $vollPfad -Force -ErrorAction Stop | Where-Object { $erlaubteRestnamen -notcontains $_.Name })
    if ($unerwarteteLaufzeitreste.Count -gt 0) {
        throw ("Der teilbereinigte Laufzeitordner enthaelt unerwartete Restdaten: {0}" -f $unerwarteteLaufzeitreste[0].Name)
    }
    if ($erlaubteRestnamen.Count -eq 0) {
        $name = [IO.Path]::GetFileName($vollPfad)
        $muster = if ($name -eq 'OneClick-ProgrammReparatur-Laufzeit') { '^OneClick-ProgrammReparatur-Laufzeit$' } else { '^OneClick-ProgrammReparatur-Benutzer-Laufzeit$' }
        return (Remove-OneClickKontrolliertenLaufpfad -Pfad $vollPfad -Basis ([IO.Path]::GetDirectoryName($vollPfad)) -ErlaubtesNamensmuster $muster)
    }
    return [pscustomobject]@{ Pfad = $vollPfad; Entfernt = $false; FortsetzungBehalten = [bool]$FortsetzungBehalten; PaketPruefstatusBehalten = [bool]$PaketPruefstatusBehalten }
}

function Invoke-OneClickAbschlussbereinigung {
    $script:AbschlussbereinigungAusgefuehrt = $true
    $script:AbschlussbereinigungVerifiziert = $false
    $bereinigtePfade = New-Object 'System.Collections.Generic.List[string]'
    try {
        $andereLaufprozesse = @(Get-OneClickAndereAktiveLaeufe)
        if ($andereLaufprozesse.Count -gt 0) {
            throw ("Eine restlose Bereinigung ist wegen anderer aktiver OneClick-Laeufe nicht sicher moeglich. Prozess-IDs: {0}" -f (($andereLaufprozesse.ProcessId | Sort-Object) -join ', '))
        }

        $tempBasis = [IO.Path]::GetFullPath([IO.Path]::GetTempPath()).TrimEnd([char]92)
        if (-not [string]::IsNullOrWhiteSpace([string]$script:TempOrdner)) {
            $ergebnis = Remove-OneClickKontrolliertenLaufpfad -Pfad $script:TempOrdner -Basis $tempBasis -ErlaubtesNamensmuster '^OneClick-[A-Za-z0-9_.-]+$'
            $bereinigtePfade.Add([string]$ergebnis.Pfad) | Out-Null
        }
        $tempRestMuster = '^(?:OneClick-(?:Reparatur|PS7)-[0-9a-f]{32}|Prozesswaechter-[0-9a-f]{32}\.stop(?:\.ready|\.abbruch\.txt)?)$'
        foreach ($tempRest in @(Get-ChildItem -LiteralPath $tempBasis -Force -ErrorAction Stop | Where-Object { $_.Name -match $tempRestMuster })) {
            $ergebnis = Remove-OneClickKontrolliertenLaufpfad -Pfad $tempRest.FullName -Basis $tempBasis -ErlaubtesNamensmuster $tempRestMuster
            $bereinigtePfade.Add([string]$ergebnis.Pfad) | Out-Null
        }

        # Auch bei einem bisher fehlerfreien Lauf bleibt der Paketstatus bis
        # nach Abschlussbericht, Berichtsaufbewahrung und Altlastenmigration
        # erhalten. Erst der allerletzte Erfolgsschritt darf ihn entfernen.
        $paketPruefstatusBisErfolgBehalten = (-not [string]::IsNullOrWhiteSpace([string]$script:PaketPruefstatusDatei) -and (Test-Path -LiteralPath $script:PaketPruefstatusDatei -PathType Leaf))
        if (-not [string]::IsNullOrWhiteSpace([string]$script:LogOrdner)) {
            $laufzeitErgebnis = Remove-OneClickRuntimeOrdner -Pfad $script:LogOrdner -FortsetzungBehalten:$script:NeustartPauseAktiv -PaketPruefstatusBehalten:$paketPruefstatusBisErfolgBehalten
            if ([bool]$laufzeitErgebnis.Entfernt) {
                $bereinigtePfade.Add([string]$laufzeitErgebnis.Pfad) | Out-Null
            }
        }
        $script:LogDatei = $null

        foreach ($pfad in $bereinigtePfade.ToArray()) {
            if (Test-Path -LiteralPath $pfad) {
                throw ("Die Nachkontrolle fand einen angeblich bereinigten Restpfad: {0}" -f $pfad)
            }
        }
        $verbliebeneTempReste = @(Get-ChildItem -LiteralPath $tempBasis -Force -ErrorAction Stop | Where-Object { $_.Name -match $tempRestMuster })
        if ($verbliebeneTempReste.Count -gt 0) {
            throw ("Die Nachkontrolle fand noch kontrollierte OneClick-Tempdaten: {0}" -f $verbliebeneTempReste[0].FullName)
        }
        if (-not $script:NeustartPauseAktiv -and -not $paketPruefstatusBisErfolgBehalten -and -not [string]::IsNullOrWhiteSpace([string]$script:LogOrdner) -and (Test-Path -LiteralPath $script:LogOrdner)) {
            throw ("Der OneClick-Laufzeitordner ist nach dem Abschluss noch vorhanden: {0}" -f $script:LogOrdner)
        }

        $script:AbschlussbereinigungVerifiziert = $true
        $bereinigteMegabyte = ConvertTo-LesbareBytemenge -Bytes ([double]$script:BereinigteRestbytes)
        Add-Resultat -Bereich 'Abschluss' -Aktion 'Laufbezogene Restdaten bereinigen und nachkontrollieren' -Status $(if ($script:NeustartPauseAktiv) { 'Restdaten entfernt; Neustartfortsetzung und vorhandener Paket-Pruefstatus bis zum Gesamterfolg beibehalten' } elseif ($paketPruefstatusBisErfolgBehalten) { 'Restdaten entfernt; Paket-Pruefstatus bis zur letzten erfolgreichen Abschlusspruefung beibehalten' } else { 'Alle vorhandenen Laufzeitdaten entfernt; Abwesenheit verifiziert' }) -ExitCode 0 -Details ("Dateien: {0}; Ordner: {1}; Groesse: {2}; Berichtordner wird nicht als Laufzustand eingelesen: {3}" -f $script:BereinigteRestdateien, $script:BereinigteRestordner, $bereinigteMegabyte, $script:BerichtOrdner)
        Write-Status -Text ("Abschlussbereinigung verifiziert: {0} Restdateien, {1} Restordner und {2} entfernt. Der naechste Lauf beginnt ohne alten Arbeitszustand." -f $script:BereinigteRestdateien, $script:BereinigteRestordner, $bereinigteMegabyte) -Stufe 'OK'
        return $true
    }
    catch {
        $script:Bereinigungsfehler++
        Add-Resultat -Bereich 'Abschluss' -Aktion 'Laufbezogene Restdaten bereinigen und nachkontrollieren' -Status 'Fehlgeschlagen' -ExitCode 1 -Details $_.Exception.Message
        Write-Status -Text ("Abschlussbereinigung fehlgeschlagen: {0}" -f $_.Exception.Message) -Stufe 'FEHLER'
        throw
    }
}

function Complete-OneClickPaketPruefstatusNachGesamterfolg {
    if ([int]$script:ExitCode -ne 0 -or $script:NeustartPauseAktiv) { return $false }
    if ([string]::IsNullOrWhiteSpace([string]$script:LogOrdner)) {
        throw 'Der Laufzeitordner fehlt fuer die abschliessende Paketstatusbereinigung.'
    }
    $laufzeitPfad = [IO.Path]::GetFullPath([string]$script:LogOrdner).TrimEnd([char]92)
    if (-not (Test-OneClickRuntimeOrdnerPfad -Pfad $laufzeitPfad)) {
        throw ("Der Paketstatus liegt nicht in einem eindeutig erlaubten Dokumente-Laufzeitordner: {0}" -f $laufzeitPfad)
    }

    $statusPfad = Join-Path $laufzeitPfad 'Paket-Pruefstatus-v1.json'
    if (Test-Path -LiteralPath $statusPfad -PathType Leaf) {
        $null = Remove-OneClickKontrolliertenLaufpfad -Pfad $statusPfad -Basis $laufzeitPfad -ErlaubtesNamensmuster '^Paket-Pruefstatus-v1\.json$'
    }
    if (Test-Path -LiteralPath $statusPfad) {
        throw 'Paket-Pruefstatus-v1.json ist nach dem vollstaendig erfolgreichen Abschluss noch vorhanden.'
    }

    if (Test-Path -LiteralPath $laufzeitPfad -PathType Container) {
        $unerwarteteReste = @(Get-ChildItem -LiteralPath $laufzeitPfad -Force -ErrorAction Stop)
        if ($unerwarteteReste.Count -gt 0) {
            throw ("Nach der finalen Paketstatusbereinigung sind unerwartete Laufzeitdaten vorhanden: {0}" -f $unerwarteteReste[0].Name)
        }
        $name = [IO.Path]::GetFileName($laufzeitPfad)
        $muster = if ($name -eq 'OneClick-ProgrammReparatur-Laufzeit') { '^OneClick-ProgrammReparatur-Laufzeit$' } else { '^OneClick-ProgrammReparatur-Benutzer-Laufzeit$' }
        $null = Remove-OneClickKontrolliertenLaufpfad -Pfad $laufzeitPfad -Basis ([IO.Path]::GetDirectoryName($laufzeitPfad)) -ErlaubtesNamensmuster $muster
    }
    if (Test-Path -LiteralPath $laufzeitPfad) {
        throw ("Der Laufzeitordner ist nach dem vollstaendig erfolgreichen Abschluss noch vorhanden: {0}" -f $laufzeitPfad)
    }
    $script:PaketPruefstatusDatei = $null
    return $true
}

function Test-WinGetHilfeOption {
    param(
        [AllowNull()][string]$HilfeText,
        [Parameter(Mandatory = $true)][string]$Option
    )

    if ([string]::IsNullOrWhiteSpace($HilfeText) -or $Option -notmatch '^--[A-Za-z0-9][A-Za-z0-9-]*$') {
        return $false
    }

    # Exakte Optionsgrenzen verhindern beispielsweise, dass "--source" nur deshalb
    # als vorhanden gilt, weil der Hilfetext "--accept-source-agreements" enthaelt.
    $muster = '(?<![A-Za-z0-9-])' + [regex]::Escape($Option) + '(?![A-Za-z0-9-])'
    return [regex]::IsMatch($HilfeText, $muster, [Text.RegularExpressions.RegexOptions]::IgnoreCase)
}

function New-WinGetReparaturArgumente {
    param(
        [Parameter(Mandatory = $true)][string]$Id,
        [Parameter(Mandatory = $true)][ValidateSet('winget', 'msstore')][string]$Quelle,
        [Parameter(Mandatory = $true)][ValidateSet('user', 'machine')][string]$Scope,
        [Parameter(Mandatory = $true)][string]$HilfeText
    )

    foreach ($pflichtOption in @('--id', '--exact', '--source', '--scope', '--silent', '--accept-source-agreements', '--accept-package-agreements')) {
        if (-not (Test-WinGetHilfeOption -HilfeText $HilfeText -Option $pflichtOption)) {
            throw "Die installierte WinGet-Version unterstuetzt die fuer die unbeaufsichtigte und scopegebundene Reparatur benoetigte Option nicht: $pflichtOption"
        }
    }

    $argumente = New-Object 'System.Collections.Generic.List[string]'
    foreach ($wert in @(
        'repair', '--id', $Id, '--exact', '--source', $Quelle, '--scope', $Scope,
        '--silent', '--accept-source-agreements', '--accept-package-agreements'
    )) {
        $argumente.Add($wert) | Out-Null
    }
    if (Test-WinGetHilfeOption -HilfeText $HilfeText -Option '--disable-interactivity') {
        $argumente.Add('--disable-interactivity') | Out-Null
    }
    if (Test-WinGetHilfeOption -HilfeText $HilfeText -Option '--no-progress') {
        $argumente.Add('--no-progress') | Out-Null
    }
    if (Test-WinGetHilfeOption -HilfeText $HilfeText -Option '--verbose-logs') {
        $argumente.Add('--verbose-logs') | Out-Null
    }
    return [string[]]@($argumente.ToArray())
}

function New-WinGetDownloadArgumente {
    param(
        [Parameter(Mandatory = $true)][string]$Id,
        [Parameter(Mandatory = $true)][string]$ZielOrdner,
        [Parameter(Mandatory = $true)][ValidateSet('user', 'machine')][string]$Scope,
        [Parameter(Mandatory = $true)][string]$HilfeText
    )

    foreach ($pflichtOption in @('--id', '--exact', '--source', '--scope', '--download-directory', '--accept-source-agreements', '--accept-package-agreements', '--disable-interactivity')) {
        if (-not (Test-WinGetHilfeOption -HilfeText $HilfeText -Option $pflichtOption)) {
            throw "Die installierte WinGet-Version unterstuetzt die fuer den sicheren Download benoetigte Option nicht: $pflichtOption"
        }
    }

    $argumente = New-Object 'System.Collections.Generic.List[string]'
    foreach ($wert in @(
        'download', '--id', $Id, '--exact', '--source', 'winget',
        '--scope', $Scope, '--download-directory', $ZielOrdner
    )) {
        $argumente.Add($wert) | Out-Null
    }
    foreach ($option in @('--accept-source-agreements', '--accept-package-agreements', '--skip-license', '--disable-interactivity', '--no-progress')) {
        if (Test-WinGetHilfeOption -HilfeText $HilfeText -Option $option) {
            $argumente.Add($option) | Out-Null
        }
    }
    return [string[]]@($argumente.ToArray())
}

function New-WinGetNeuinstallationsArgumente {
    param(
        [Parameter(Mandatory = $true)][string]$Id,
        [Parameter(Mandatory = $true)][ValidateSet('winget', 'msstore')][string]$Quelle,
        [Parameter(Mandatory = $true)][ValidateSet('user', 'machine')][string]$Scope,
        [Parameter(Mandatory = $true)][string]$HilfeText
    )

    foreach ($pflichtOption in @('--id', '--exact', '--source', '--scope', '--force', '--silent', '--accept-source-agreements', '--accept-package-agreements', '--disable-interactivity')) {
        if (-not (Test-WinGetHilfeOption -HilfeText $HilfeText -Option $pflichtOption)) {
            throw "Die installierte WinGet-Version unterstuetzt die fuer die unbeaufsichtigte Neuinstallation benoetigte Option nicht: $pflichtOption"
        }
    }

    if (-not (Test-SichereWinGetPaketIdFuerQuelle -Id $Id -Quelle $Quelle)) {
        throw "Die Paketkennung ist fuer die angegebene offizielle Quelle nicht gueltig: $Id ($Quelle)"
    }

    $argumente = New-Object 'System.Collections.Generic.List[string]'
    foreach ($wert in @(
        'install', '--id', $Id, '--exact', '--source', $Quelle,
        '--scope', $Scope, '--silent', '--force'
    )) {
        $argumente.Add($wert) | Out-Null
    }
    foreach ($option in @('--accept-source-agreements', '--accept-package-agreements', '--disable-interactivity', '--no-progress', '--verbose-logs')) {
        if (Test-WinGetHilfeOption -HilfeText $HilfeText -Option $option) {
            $argumente.Add($option) | Out-Null
        }
    }
    return [string[]]@($argumente.ToArray())
}

function New-WinGetListArgumente {
    param(
        [Parameter(Mandatory = $true)][string]$Id,
        [Parameter(Mandatory = $true)][ValidateSet('winget', 'msstore')][string]$Quelle,
        [Parameter(Mandatory = $true)][ValidateSet('user', 'machine')][string]$Scope,
        [Parameter(Mandatory = $true)][string]$HilfeText
    )

    foreach ($pflichtOption in @('--id', '--exact', '--source', '--scope', '--accept-source-agreements', '--disable-interactivity')) {
        if (-not (Test-WinGetHilfeOption -HilfeText $HilfeText -Option $pflichtOption)) {
            throw "Die installierte WinGet-Version unterstuetzt die fuer die eindeutige Installationspruefung benoetigte Option nicht: $pflichtOption"
        }
    }

    $argumente = New-Object 'System.Collections.Generic.List[string]'
    foreach ($wert in @(
        'list', '--id', $Id, '--exact', '--source', $Quelle,
        '--scope', $Scope, '--accept-source-agreements', '--disable-interactivity'
    )) {
        $argumente.Add($wert) | Out-Null
    }
    if (Test-WinGetHilfeOption -HilfeText $HilfeText -Option '--no-progress') {
        $argumente.Add('--no-progress') | Out-Null
    }
    return [string[]]@($argumente.ToArray())
}

function New-WinGetUpdateNachkontrollArgumente {
    param(
        [Parameter(Mandatory = $true)][string]$Id,
        [Parameter(Mandatory = $true)][ValidateSet('winget', 'msstore')][string]$Quelle,
        [Parameter(Mandatory = $true)][ValidateSet('user', 'machine')][string]$Scope,
        [Parameter(Mandatory = $true)][string]$HilfeText
    )

    foreach ($pflichtOption in @('--id', '--exact', '--source', '--scope', '--upgrade-available', '--accept-source-agreements', '--disable-interactivity')) {
        if (-not (Test-WinGetHilfeOption -HilfeText $HilfeText -Option $pflichtOption)) {
            throw "Die installierte WinGet-Version unterstuetzt die fuer die Update-Nachkontrolle benoetigte Option nicht: $pflichtOption"
        }
    }

    $argumente = New-Object 'System.Collections.Generic.List[string]'
    foreach ($wert in @(
        'list', '--id', $Id, '--exact', '--source', $Quelle, '--scope', $Scope,
        '--upgrade-available', '--accept-source-agreements', '--disable-interactivity'
    )) {
        $argumente.Add($wert) | Out-Null
    }
    if (Test-WinGetHilfeOption -HilfeText $HilfeText -Option '--no-progress') {
        $argumente.Add('--no-progress') | Out-Null
    }
    return [string[]]@($argumente.ToArray())
}

function New-WinGetListFallbackArgumente {
    param(
        [Parameter(Mandatory = $true)][string]$Id,
        [Parameter(Mandatory = $true)][ValidateSet('user', 'machine')][string]$Scope,
        [Parameter(Mandatory = $true)][string]$HilfeText
    )

    foreach ($pflichtOption in @('--id', '--exact', '--scope', '--disable-interactivity')) {
        if (-not (Test-WinGetHilfeOption -HilfeText $HilfeText -Option $pflichtOption)) {
            throw "Die installierte WinGet-Version unterstuetzt die fuer die quellenunabhaengige Installationspruefung benoetigte Option nicht: $pflichtOption"
        }
    }

    $argumente = New-Object 'System.Collections.Generic.List[string]'
    foreach ($wert in @('list', '--id', $Id, '--exact', '--scope', $Scope, '--disable-interactivity')) {
        $argumente.Add($wert) | Out-Null
    }
    if (Test-WinGetHilfeOption -HilfeText $HilfeText -Option '--no-progress') {
        $argumente.Add('--no-progress') | Out-Null
    }
    return [string[]]@($argumente.ToArray())
}

function Get-WinGetListenTrefferAnzahl {
    param(
        [AllowEmptyString()][string]$Text,
        [Parameter(Mandatory = $true)][string]$ErwarteteId,
        [AllowEmptyString()][string]$ErwarteteQuelle = ''
    )

    if ([string]::IsNullOrWhiteSpace($Text)) { return 0 }
    if (-not (Test-SichereWinGetPaketId -Id $ErwarteteId)) { return -1 }

    $erwarteteQuelleNormalisiert = ([string]$ErwarteteQuelle).Trim().ToLowerInvariant()
    if ($erwarteteQuelleNormalisiert -notin @('', 'winget', 'msstore')) { return -1 }

    $zeilen = @($Text -split "`r?`n")
    $kopfIndex = -1
    for ($i = 0; $i -lt $zeilen.Count; $i++) {
        $kopf = ([string]$zeilen[$i]).Trim()
        if ($kopf -match '(?i)^Name\s+(?:ID|Id)\s+Version\b.*\b(?:Source|Quelle)\s*$') {
            $kopfIndex = $i
            break
        }
    }

    # WinGet wird bereits mit --id und --exact auf genau die bekannte Paket-ID
    # eingeschraenkt. Fuer die Erkennung sind deshalb weder feste Spaltenpositionen
    # noch eine bestimmte Anzahl von Versionstokens erforderlich. Installierte
    # Versionsangaben koennen Leerzeichen oder Architekturzusatztexte enthalten,
    # z. B. "24.09 (x64)". Genau diese Form hatte zuvor reale Pakete wie 7-Zip
    # und Vortex faelschlich als nicht auswertbar markiert.
    $idMuster = '(?<!\S)' + [regex]::Escape($ErwarteteId) + '(?!\S)'
    $quellenMuster = '(?i)(?<!\S)(?<source>winget|msstore)\s*$'
    $treffer = 0
    $sahPaketartigeFremdzeile = $false
    $datenBegonnen = $false
    $startIndex = if ($kopfIndex -ge 0) { $kopfIndex + 1 } else { 0 }

    for ($i = $startIndex; $i -lt $zeilen.Count; $i++) {
        $zeile = ([string]$zeilen[$i]).TrimEnd()
        if ([string]::IsNullOrWhiteSpace($zeile)) {
            if ($datenBegonnen -and $kopfIndex -ge 0) { break }
            continue
        }
        if ($zeile -match '^\s*-{3,}\s*$') { continue }
        if ($zeile -match '(?i)^\s*(Name\s+(?:ID|Id)\s+Version|[0-9]+\s+(?:packages?|pakete?)\s+(?:found|gefunden))') { continue }

        $quellenTreffer = [regex]::Match($zeile, $quellenMuster)
        $zeilenQuelle = ''
        $zeilenPraefix = $zeile
        if ($quellenTreffer.Success) {
            $zeilenQuelle = $quellenTreffer.Groups['source'].Value.Trim().ToLowerInvariant()
            $zeilenPraefix = $zeile.Substring(0, $quellenTreffer.Index).TrimEnd()
        }

        if (-not [string]::IsNullOrWhiteSpace($erwarteteQuelleNormalisiert)) {
            # Bei einer bereits mit --source begrenzten Abfrage laesst WinGet 1.29
            # die redundante Quellenspalte weg. Ist sie vorhanden, muss sie exakt
            # stimmen; fehlt sie, bleibt der zuvor gesetzte Quellenfilter massgeblich.
            if ($quellenTreffer.Success -and $zeilenQuelle -ne $erwarteteQuelleNormalisiert) {
                if ($zeilenPraefix -match $idMuster) {
                    $sahPaketartigeFremdzeile = $true
                }
                continue
            }
        }

        $idTreffer = @([regex]::Matches(
            $zeilenPraefix,
            $idMuster,
            [Text.RegularExpressions.RegexOptions]::IgnoreCase
        ))

        if ($idTreffer.Count -gt 0) {
            # Die rechte Fundstelle ist die ID-Spalte. Falls der Programmname selbst
            # zufaellig die Paket-ID enthaelt, liegt die echte ID-Spalte weiter rechts.
            $kandidat = $idTreffer[-1]
            $nameTeil = $zeilenPraefix.Substring(0, $kandidat.Index).Trim()
            $restTeil = $zeilenPraefix.Substring($kandidat.Index + $kandidat.Length).Trim()

            if (-not [string]::IsNullOrWhiteSpace($nameTeil) -and
                -not [string]::IsNullOrWhiteSpace($restTeil) -and
                $restTeil -notmatch '^\.{3,}$') {
                $datenBegonnen = $true
                $treffer++
                continue
            }

            $sahPaketartigeFremdzeile = $true
            continue
        }

        # Eine Zeile, die mit einer Paketquelle endet und nach einem Tabellenkopf
        # erscheint, sieht wie eine echte Datenzeile aus. Nur wenn kein gueltiger
        # erwarteter Treffer existiert, wird dieser Zustand als mehrdeutig gemeldet.
        if ($quellenTreffer.Success -and $kopfIndex -ge 0) {
            $datenBegonnen = $true
            $sahPaketartigeFremdzeile = $true
        }
    }

    if ($treffer -gt 0) { return $treffer }
    if ($sahPaketartigeFremdzeile -or $kopfIndex -lt 0) { return -1 }
    return 0
}

function Get-WinGetListenVersionen {
    param(
        [AllowEmptyString()][string]$Text,
        [Parameter(Mandatory = $true)][string]$ErwarteteId
    )

    if ([string]::IsNullOrWhiteSpace($Text) -or -not (Test-SichereWinGetPaketId -Id $ErwarteteId)) {
        return @()
    }

    $versionen = New-Object 'System.Collections.Generic.List[string]'
    $idMuster = '(?<!\S)' + [regex]::Escape($ErwarteteId) + '(?!\S)'
    foreach ($rohzeile in @($Text -split "`r?`n")) {
        $zeile = ([string]$rohzeile).TrimEnd()
        if ([string]::IsNullOrWhiteSpace($zeile) -or $zeile -match '^\s*-{3,}\s*$') { continue }
        $zeilenPraefix = [regex]::Replace($zeile, '(?i)(?<!\S)(winget|msstore)\s*$', '').TrimEnd()
        $idTreffer = @([regex]::Matches($zeilenPraefix, $idMuster, [Text.RegularExpressions.RegexOptions]::IgnoreCase))
        if ($idTreffer.Count -eq 0) { continue }
        $kandidat = $idTreffer[-1]
        $nameTeil = $zeilenPraefix.Substring(0, $kandidat.Index).Trim()
        $versionsTeil = $zeilenPraefix.Substring($kandidat.Index + $kandidat.Length).Trim()
        if ([string]::IsNullOrWhiteSpace($nameTeil) -or
            -not (Test-SichererWinGetVersionswert -Wert $versionsTeil)) { continue }
        $versionen.Add($versionsTeil) | Out-Null
    }
    return @($versionen.ToArray())
}

function Get-WinGetListenAnzeigenamen {
    param(
        [AllowEmptyString()][string]$Text,
        [Parameter(Mandatory = $true)][string]$ErwarteteId
    )

    if ([string]::IsNullOrWhiteSpace($Text) -or -not (Test-SichereWinGetPaketId -Id $ErwarteteId)) { return @() }
    $namen = New-Object 'System.Collections.Generic.List[string]'
    $idMuster = '(?<!\S)' + [regex]::Escape($ErwarteteId) + '(?!\S)'
    foreach ($rohzeile in @($Text -split "`r?`n")) {
        $zeile = ([string]$rohzeile).TrimEnd()
        if ([string]::IsNullOrWhiteSpace($zeile) -or $zeile -match '^\s*-{3,}\s*$') { continue }
        $zeilenPraefix = [regex]::Replace($zeile, '(?i)(?<!\S)(winget|msstore)\s*$', '').TrimEnd()
        $idTreffer = @([regex]::Matches($zeilenPraefix, $idMuster, [Text.RegularExpressions.RegexOptions]::IgnoreCase))
        if ($idTreffer.Count -eq 0) { continue }
        $kandidat = $idTreffer[-1]
        $nameTeil = $zeilenPraefix.Substring(0, $kandidat.Index).Trim()
        $restTeil = $zeilenPraefix.Substring($kandidat.Index + $kandidat.Length).Trim()
        if (-not [string]::IsNullOrWhiteSpace($nameTeil) -and -not [string]::IsNullOrWhiteSpace($restTeil) -and
            $nameTeil.Length -le 240 -and $nameTeil -notmatch '[\x00-\x1F\x7F]') {
            $namen.Add($nameTeil) | Out-Null
        }
    }
    return @($namen.ToArray() | Sort-Object -Unique)
}

function Get-WinGetPaketStatusImScope {
    param(
        [Parameter(Mandatory = $true)][string]$WinGet,
        [Parameter(Mandatory = $true)][string]$Id,
        [Parameter(Mandatory = $true)][ValidateSet('winget', 'msstore')][string]$Quelle,
        [Parameter(Mandatory = $true)][ValidateSet('user', 'machine')][string]$Scope,
        [Parameter(Mandatory = $true)][string]$ListHilfeText
    )

    if (-not (Test-SichereWinGetPaketIdFuerQuelle -Id $Id -Quelle $Quelle)) {
        return [pscustomobject]@{ Eindeutig = $false; Installiert = $false; Treffer = -1; Versionen = @(); Scope = $Scope; Details = 'Ungueltige Paketkennung.' }
    }

    $anzahl = -1
    $versionen = @()
    $anzeigenamen = @()
    $primaerDetails = ''
    try {
        $argumente = New-WinGetListArgumente -Id $Id -Quelle $Quelle -Scope $Scope -HilfeText $ListHilfeText
        $ergebnis = Invoke-Native -Datei $WinGet -Argumente $argumente -Beschreibung ("Installationsstatus pruefen ({0}/{1}): {2}" -f $Quelle, $Scope, $Id) -TimeoutSekunden 120 -FehlerNurResultat -AusgabeUnterdruecken
        $ausgabe = [string]$ergebnis.Ausgabe
        $kategorie = Get-WinGetErgebniskategorie -ExitCode ([int]$ergebnis.ExitCode) -Ausgabe $ausgabe
        if ($kategorie -eq 'KeinePakete') {
            $anzahl = 0
            $primaerDetails = 'quellengebundene Abfrage: kein Treffer'
        }
        elseif ($ergebnis.Erfolgreich) {
            $anzahl = Get-WinGetListenTrefferAnzahl -Text $ausgabe -ErwarteteId $Id -ErwarteteQuelle $Quelle
            if ($anzahl -gt 0) {
                $versionen = @(Get-WinGetListenVersionen -Text $ausgabe -ErwarteteId $Id)
                $anzeigenamen = @(Get-WinGetListenAnzeigenamen -Text $ausgabe -ErwarteteId $Id)
            }
            $primaerDetails = ("quellengebundene Abfrage: Trefferwert {0}" -f $anzahl)
        }
        else { $primaerDetails = ("quellengebundene Abfrage fehlgeschlagen, Exitcode {0}" -f [int]$ergebnis.ExitCode) }
    }
    catch { $primaerDetails = ('quellengebundene Abfrage nicht verfuegbar: ' + $_.Exception.Message) }

    if ($anzahl -lt 0) {
        try {
            $fallbackArgumente = New-WinGetListFallbackArgumente -Id $Id -Scope $Scope -HilfeText $ListHilfeText
            $fallbackErgebnis = Invoke-Native -Datei $WinGet -Argumente $fallbackArgumente -Beschreibung ("Installationsstatus quellenunabhaengig pruefen ({0}): {1}" -f $Scope, $Id) -TimeoutSekunden 120 -FehlerNurResultat -AusgabeUnterdruecken
            $fallbackAusgabe = [string]$fallbackErgebnis.Ausgabe
            $fallbackKategorie = Get-WinGetErgebniskategorie -ExitCode ([int]$fallbackErgebnis.ExitCode) -Ausgabe $fallbackAusgabe
            if ($fallbackKategorie -eq 'KeinePakete') { $anzahl = 0 }
            elseif ($fallbackErgebnis.Erfolgreich) {
                $anzahl = Get-WinGetListenTrefferAnzahl -Text $fallbackAusgabe -ErwarteteId $Id -ErwarteteQuelle ''
                if ($anzahl -gt 0) {
                    $versionen = @(Get-WinGetListenVersionen -Text $fallbackAusgabe -ErwarteteId $Id)
                    $anzeigenamen = @(Get-WinGetListenAnzeigenamen -Text $fallbackAusgabe -ErwarteteId $Id)
                }
            }
            else {
                return [pscustomobject]@{ Eindeutig = $false; Installiert = $false; Treffer = -1; Versionen = @(); Scope = $Scope; Details = ("{0}; Fallback fehlgeschlagen, Exitcode {1}." -f $primaerDetails, [int]$fallbackErgebnis.ExitCode) }
            }
            $primaerDetails += ("; quellenunabhaengiger Fallback-Trefferwert {0}" -f $anzahl)
        }
        catch {
            return [pscustomobject]@{ Eindeutig = $false; Installiert = $false; Treffer = -1; Versionen = @(); Scope = $Scope; Details = ("{0}; Fallback-Ausnahme: {1}" -f $primaerDetails, $_.Exception.Message) }
        }
    }

    if ($anzahl -in @(0, 1)) {
        return [pscustomobject]@{ Eindeutig = $true; Installiert = ($anzahl -eq 1); Treffer = $anzahl; Versionen = $versionen; Anzeigename = $(if ($anzeigenamen.Count -eq 1) { [string]$anzeigenamen[0] } else { '' }); Scope = $Scope; Details = $primaerDetails }
    }
    return [pscustomobject]@{ Eindeutig = $false; Installiert = ($anzahl -gt 0); Treffer = $anzahl; Versionen = $versionen; Scope = $Scope; Details = ("Nicht eindeutiger Trefferwert {0}; Versionen: {1}. {2}" -f $anzahl, $(if ($versionen.Count -gt 0) { $versionen -join ', ' } else { 'nicht lesbar' }), $primaerDetails) }
}

function Get-DownloadDateiInformationen {
    param([Parameter(Mandatory = $true)][string]$Ordner)

    if (-not (Test-Path -LiteralPath $Ordner -PathType Container)) {
        return [pscustomobject]@{ Gueltig = $false; Anzahl = 0; InstallerAnzahl = 0; Bytes = [int64]0; PruefsummenDatei = ''; Details = 'Downloadordner fehlt.' }
    }
    if ([string]::IsNullOrWhiteSpace([string]$script:InstallationsOrdner) -or
        -not (Test-VerzeichnisketteOhneReparsePoint -Basis $script:InstallationsOrdner -Kandidat $Ordner)) {
        return [pscustomobject]@{ Gueltig = $false; Anzahl = 0; InstallerAnzahl = 0; Bytes = [int64]0; PruefsummenDatei = ''; Details = 'Downloadordner oder Verzeichniskette ist nicht sicher.' }
    }

    $reparseVerzeichnisse = @(Get-ChildItem -LiteralPath $Ordner -Directory -Recurse -Force -ErrorAction SilentlyContinue |
        Where-Object { $_.Attributes -band [IO.FileAttributes]::ReparsePoint })
    if ($reparseVerzeichnisse.Count -gt 0) {
        return [pscustomobject]@{ Gueltig = $false; Anzahl = 0; InstallerAnzahl = 0; Bytes = [int64]0; PruefsummenDatei = ''; Details = 'Der Download enthaelt mindestens eine Verzeichnisumleitung (Reparse Point).' }
    }

    $dateien = @(Get-ChildItem -LiteralPath $Ordner -File -Recurse -Force -ErrorAction SilentlyContinue |
        Where-Object {
            $_.Name -ne 'SHA256SUMS.txt' -and $_.Length -gt 0 -and
            -not ($_.Attributes -band [IO.FileAttributes]::ReparsePoint) -and
            (Test-PfadUnterBasis -Basis $Ordner -Kandidat $_.FullName)
        } | Sort-Object FullName)
    if ($dateien.Count -eq 0) {
        return [pscustomobject]@{ Gueltig = $false; Anzahl = 0; InstallerAnzahl = 0; Bytes = [int64]0; PruefsummenDatei = ''; Details = 'Keine nicht leere Download-Datei gefunden.' }
    }

    $erlaubtePaketEndungen = @(
        '.exe', '.msi', '.msix', '.msixbundle', '.appx', '.appxbundle', '.msu',
        '.zip', '.7z', '.cab', '.wixbundle', '.nupkg'
    )
    $installerDateien = @($dateien | Where-Object {
        $erlaubtePaketEndungen -contains ([string]$_.Extension).ToLowerInvariant()
    })
    $gesamtBytes = [int64](($dateien | Measure-Object -Property Length -Sum).Sum)
    if ($installerDateien.Count -eq 0) {
        return [pscustomobject]@{ Gueltig = $false; Anzahl = $dateien.Count; InstallerAnzahl = 0; Bytes = $gesamtBytes; PruefsummenDatei = ''; Details = 'Der Download enthaelt keine Datei mit einer freigegebenen Windows-Installer- oder Paketendung.' }
    }

    $signierbareEndungen = @('.exe', '.msi', '.msix', '.msixbundle', '.appx', '.appxbundle', '.msu', '.wixbundle')
    $gueltigSigniert = 0
    $nichtSigniert = 0
    foreach ($datei in @($installerDateien | Where-Object { $signierbareEndungen -contains ([string]$_.Extension).ToLowerInvariant() })) {
        try {
            $signatur = Get-AuthenticodeSignature -LiteralPath $datei.FullName -ErrorAction Stop
            if ($signatur.Status -eq [Management.Automation.SignatureStatus]::Valid) {
                $gueltigSigniert++
            }
            elseif ($signatur.Status -eq [Management.Automation.SignatureStatus]::NotSigned) {
                # Bei unsignierten Herstellerpaketen bleibt die Hashbindung an
                # das verifizierte WinGet-Manifest der verpflichtende
                # Integritaetsnachweis. Jede vorhandene ungueltige Signatur wird
                # dagegen ausnahmslos abgelehnt.
                $nichtSigniert++
            }
            else {
                return [pscustomobject]@{ Gueltig = $false; Anzahl = $dateien.Count; InstallerAnzahl = $installerDateien.Count; Bytes = $gesamtBytes; PruefsummenDatei = ''; Details = ("Installationsdatei '{0}' besitzt eine ungueltige Authenticode-Signatur: {1}." -f $datei.Name, $signatur.Status) }
            }
        }
        catch {
            return [pscustomobject]@{ Gueltig = $false; Anzahl = $dateien.Count; InstallerAnzahl = $installerDateien.Count; Bytes = $gesamtBytes; PruefsummenDatei = ''; Details = ("Authenticode-Pruefung fuer '{0}' fehlgeschlagen: {1}" -f $datei.Name, $_.Exception.Message) }
        }
    }

    $pruefsummenPfad = Join-Path -Path $Ordner -ChildPath 'SHA256SUMS.txt'
    $pruefsummen = New-Object 'System.Collections.Generic.List[string]'
    foreach ($datei in $dateien) {
        try {
            $hash = Get-FileHash -LiteralPath $datei.FullName -Algorithm SHA256 -ErrorAction Stop
            $relativ = $datei.FullName.Substring($Ordner.TrimEnd([char]92).Length).TrimStart([char]92)
            $pruefsummen.Add(('{0}  {1}' -f $hash.Hash.ToUpperInvariant(), $relativ)) | Out-Null
        }
        catch {
            return [pscustomobject]@{ Gueltig = $false; Anzahl = $dateien.Count; InstallerAnzahl = $installerDateien.Count; Bytes = $gesamtBytes; PruefsummenDatei = ''; Details = ('SHA-256 konnte nicht fuer alle Dateien berechnet werden: {0}' -f $_.Exception.Message) }
        }
    }
    try {
        $pruefsummen.ToArray() | Set-Content -LiteralPath $pruefsummenPfad -Encoding UTF8 -ErrorAction Stop
        $pruefsummenElement = Get-Item -LiteralPath $pruefsummenPfad -Force -ErrorAction Stop
        if ($pruefsummenElement.Length -le 0 -or ($pruefsummenElement.Attributes -band [IO.FileAttributes]::ReparsePoint)) {
            throw 'Die erzeugte SHA-256-Liste ist leer oder eine Pfadumleitung.'
        }
    }
    catch {
        return [pscustomobject]@{ Gueltig = $false; Anzahl = $dateien.Count; InstallerAnzahl = $installerDateien.Count; Bytes = $gesamtBytes; PruefsummenDatei = ''; Details = ('SHA-256-Liste konnte nicht sicher gespeichert werden: {0}' -f $_.Exception.Message) }
    }

    return [pscustomobject]@{
        Gueltig = $true
        Anzahl = $dateien.Count
        InstallerAnzahl = $installerDateien.Count
        Bytes = $gesamtBytes
        PruefsummenDatei = $pruefsummenPfad
        Details = ('{0} Datei(en), davon {1} Installationsdatei(en), {2}; gueltig signiert: {3}; ohne eingebettete Signatur (durch Manifest-Hash gebunden): {4}; SHA-256-Liste: {5}' -f $dateien.Count, $installerDateien.Count, (ConvertTo-LesbareBytemenge -Bytes ([double]$gesamtBytes)), $gueltigSigniert, $nichtSigniert, $pruefsummenPfad)
    }
}

function Reset-DownloadOrdnerSicher {
    param([Parameter(Mandatory = $true)][string]$Ordner)

    try {
        if ([string]::IsNullOrWhiteSpace([string]$script:InstallationsOrdner) -or
            -not (Test-PfadUnterBasis -Basis $script:InstallationsOrdner -Kandidat $Ordner) -or
            -not (Test-VerzeichnisketteOhneReparsePoint -Basis $script:InstallationsOrdner -Kandidat $Ordner)) {
            throw 'Der Zielordner liegt nicht eindeutig und ohne Pfadumleitung unterhalb des kontrollierten Installationsordners.'
        }

        if (Test-Path -LiteralPath $Ordner) {
            $vorhanden = Get-Item -LiteralPath $Ordner -Force -ErrorAction Stop
            if ($vorhanden.Attributes -band [IO.FileAttributes]::ReparsePoint) {
                throw 'Der vorhandene Zielordner ist eine Pfadumleitung und wird nicht entfernt.'
            }
            Remove-Item -LiteralPath $Ordner -Recurse -Force -ErrorAction Stop
        }
        New-Item -ItemType Directory -Path $Ordner -Force -ErrorAction Stop | Out-Null
        if (-not (Test-Path -LiteralPath $Ordner -PathType Container) -or
            -not (Test-VerzeichnisketteOhneReparsePoint -Basis $script:InstallationsOrdner -Kandidat $Ordner)) {
            throw 'Der Downloadordner wurde nach dem Erstellen nicht als sicherer Ordner erkannt.'
        }
        return $true
    }
    catch {
        Add-Warnung -Text ("Downloadordner konnte nicht sicher vorbereitet werden: {0}" -f $_.Exception.Message)
        return $false
    }
}

function Test-WinGetPaketInstalliert {
    param(
        [Parameter(Mandatory = $true)][string]$WinGet,
        [Parameter(Mandatory = $true)][string]$Id,
        [Parameter(Mandatory = $true)][ValidateSet('winget', 'msstore')][string]$Quelle,
        [Parameter(Mandatory = $true)][ValidateSet('user', 'machine')][string]$Scope,
        [Parameter(Mandatory = $true)][string]$ListHilfeText
    )

    $status = Get-WinGetPaketStatusImScope -WinGet $WinGet -Id $Id -Quelle $Quelle -Scope $Scope -ListHilfeText $ListHilfeText
    return (
        [bool](Get-SichereEigenschaft -Objekt $status -Name 'Eindeutig' -Standardwert $false) -and
        [bool](Get-SichereEigenschaft -Objekt $status -Name 'Installiert' -Standardwert $false)
    )
}

function Wait-WinGetPaketNachkontrolle {
    param(
        [Parameter(Mandatory = $true)][string]$WinGet,
        [Parameter(Mandatory = $true)][string]$Id,
        [Parameter(Mandatory = $true)][ValidateSet('winget', 'msstore')][string]$Quelle,
        [Parameter(Mandatory = $true)][ValidateSet('user', 'machine')][string]$Scope,
        [Parameter(Mandatory = $true)][string]$ListHilfeText,
        [switch]$KeineOffeneAktualisierung,
        [ValidateRange(10, 600)][int]$TimeoutSekunden = 120,
        [ValidateRange(2, 30)][int]$IntervallSekunden = 5
    )

    $stoppuhr = [Diagnostics.Stopwatch]::StartNew()
    $letzteDetails = ''
    $letzterStatus = 'NichtBestaetigt'
    try {
        do {
            $scopeStatus = Get-WinGetPaketStatusImScope -WinGet $WinGet -Id $Id -Quelle $Quelle -Scope $Scope -ListHilfeText $ListHilfeText
            $eindeutig = [bool](Get-SichereEigenschaft -Objekt $scopeStatus -Name 'Eindeutig' -Standardwert $false)
            $installiert = [bool](Get-SichereEigenschaft -Objekt $scopeStatus -Name 'Installiert' -Standardwert $false)
            $letzteDetails = Get-SichererText -Objekt $scopeStatus -Name 'Details'

            if ($eindeutig -and $installiert) {
                if (-not $KeineOffeneAktualisierung) {
                    return [pscustomobject]@{ Bestaetigt = $true; Status = 'InstalliertImErwartetenScope'; Details = $letzteDetails; Minuten = [Math]::Round($stoppuhr.Elapsed.TotalMinutes, 2) }
                }
                try {
                    $nachkontrollArgumente = New-WinGetUpdateNachkontrollArgumente -Id $Id -Quelle $Quelle -Scope $Scope -HilfeText $ListHilfeText
                    $nachkontrolle = Invoke-Native -Datei $WinGet -Argumente $nachkontrollArgumente -Beschreibung ("Update-Abschluss nachkontrollieren: {0} ({1}/{2})" -f $Id, $Quelle, $Scope) -TimeoutSekunden 120 -FehlerNurResultat -AusgabeUnterdruecken
                    $kategorie = Get-WinGetErgebniskategorie -ExitCode ([int]$nachkontrolle.ExitCode) -Ausgabe ([string]$nachkontrolle.Ausgabe)
                    if ($kategorie -in @('KeinePakete', 'KeineAktualisierung')) {
                        return [pscustomobject]@{ Bestaetigt = $true; Status = 'KeineOffeneAktualisierung'; Details = [string]$nachkontrolle.Ausgabe; Minuten = [Math]::Round($stoppuhr.Elapsed.TotalMinutes, 2) }
                    }
                    if ($nachkontrolle.Erfolgreich) {
                        $treffer = Get-WinGetListenTrefferAnzahl -Text ([string]$nachkontrolle.Ausgabe) -ErwarteteId $Id -ErwarteteQuelle $Quelle
                        if ($treffer -eq 0) {
                            return [pscustomobject]@{ Bestaetigt = $true; Status = 'KeineOffeneAktualisierung'; Details = [string]$nachkontrolle.Ausgabe; Minuten = [Math]::Round($stoppuhr.Elapsed.TotalMinutes, 2) }
                        }
                        elseif ($treffer -gt 0) { $letzterStatus = 'AktualisierungWeiterhinOffen'; $letzteDetails = [string]$nachkontrolle.Ausgabe }
                        else { $letzterStatus = 'UpdateNachkontrolleNichtEindeutig'; $letzteDetails = [string]$nachkontrolle.Ausgabe }
                    }
                    else { $letzterStatus = 'UpdateNachkontrolleFehlgeschlagen'; $letzteDetails = ("Exitcode {0}: {1}" -f [int]$nachkontrolle.ExitCode, [string]$nachkontrolle.Ausgabe) }
                }
                catch { $letzterStatus = 'UpdateNachkontrolleAusnahme'; $letzteDetails = $_.Exception.Message }
            }
            elseif ($eindeutig -and -not $installiert) { $letzterStatus = 'PaketNichtInstalliert' }
            else { $letzterStatus = 'InstallationsstatusImScopeNichtEindeutig' }

            if ($stoppuhr.Elapsed.TotalSeconds -lt $TimeoutSekunden) { Start-Sleep -Seconds $IntervallSekunden }
        }
        while ($stoppuhr.Elapsed.TotalSeconds -lt $TimeoutSekunden)
    }
    finally { $stoppuhr.Stop() }

    return [pscustomobject]@{ Bestaetigt = $false; Status = $letzterStatus; Details = $letzteDetails; Minuten = [Math]::Round($stoppuhr.Elapsed.TotalMinutes, 2) }
}

function Get-WinGetReparaturEntscheidung {
    param(
        [bool]$ProzessErfolgreich,
        [int]$ExitCode,
        [AllowEmptyString()][string]$Ausgabe = ''
    )

    $text = [string]$Ausgabe
    $nichtUnterstuetztText = $text -match '(?i)(repair.*not supported|no repair|does not support repair|keine reparatur|nicht.*reparatur|no applicable repair|repair behavior)'

    if ($ExitCode -eq -1978335107 -or $text -match '(?i)(administrator context.*user scope|administratorkontext.*benutzer)') { return 'Benutzerkontext' }
    if ($ExitCode -in @(1641, 3010, -1978334967, -1978334965)) { return 'RepariertNeustart' }
    if ($ExitCode -eq -1978334966) { return 'Neustart' }

    if ($ExitCode -in @(
        -1978335227, # Abbruchsignal
        -1978335166, # Eingabeaufforderung konnte nicht gelesen werden
        -1978335146, # Installer verbietet Erhoehung
        -1978335126, # Anwendung wurde beendet
        -1978335114, # Interaktive Authentifizierung erforderlich
        -1978335113, # Authentifizierung abgebrochen
        -1978334975, -1978334973, -1978334959, -1978334964
    )) { return 'Benutzeraktion' }

    if ($ExitCode -in @(
        -1978335222, -1978335221, # Index/Quellenkonfiguration beschaedigt
        -1978335215, -1978335206, # Hash/unsichere Quelle
        -1978335191, -1978335190, # Manifestvalidierung
        -1978335187, -1978335174, -1978335169, # Sicherheitspruefung/Richtlinie/Integritaet
        -1978335142, -1978335139, -1978335138, -1978335136, # ungueltiger Pfad/Zertifikat/Malwarescan
        -1978334961
    )) { return 'Sicherheitsblockade' }

    if ($ExitCode -in @(
        -1978335216, # kein anwendbarer Installer
        -1978335137, # Installationsort erforderlich
        -1978335125, -1978335124, # Abhaengigkeiten/Offline-Download
        -1978334972, -1978334971, -1978334970, # Abhaengigkeit/Speicher/Arbeitsspeicher
        -1978334960, -1978334958, -1978334957
    )) { return 'Voraussetzung' }

    if (Test-WinGetFehlerWiederholbar -ExitCode $ExitCode) { return 'Wiederholen' }
    if ($ExitCode -in @(-1978335111, -1978335110, -1978335109, -1978335108) -or $nichtUnterstuetztText) { return 'Fallback' }
    if ($ProzessErfolgreich) { return 'Repariert' }

    # Alle verbleibenden Reparaturfehler duerfen den abgesicherten Fallback pruefen.
    # Benutzer-, Sicherheits-, Neustart-, Quellen- und Voraussetzungscodes wurden
    # weiter oben bereits ausdruecklich ausgeschlossen.
    return 'Fallback'
}

function Invoke-DownloadUndNeuinstallation {
    param(
        [Parameter(Mandatory = $true)][string]$WinGet,
        [Parameter(Mandatory = $true)][string]$Id,
        [Parameter(Mandatory = $true)][string]$Quelle,
        [Parameter(Mandatory = $true)][ValidateSet('user', 'machine')][string]$UrspruenglicherScope,
        [Parameter(Mandatory = $true)][string]$ListHilfeText,
        [Parameter(Mandatory = $true)][string]$DownloadHilfeText,
        [Parameter(Mandatory = $true)][string]$InstallHilfeText,
        [int]$ReparaturExitCode = -1,
        [string]$ReparaturAusgabe = '',
        [AllowEmptyString()][string]$VorabDownloadOrdner = ''
    )

    if (-not (Test-SichereWinGetPaketId -Id $Id)) {
        $script:UebersprungeneNeuinstallationen++
        $script:UnbehobeneProgrammfehler++
        Add-Warnung -Text ("Die Neuinstallation wurde wegen einer ungueltigen oder unsicheren Paketkennung ausgelassen: {0}" -f $Id)
        Add-Resultat -Bereich 'Programme' -Aktion ("Neuinstallation $Id") -Status 'Aus Sicherheitsgruenden ausgelassen' -ExitCode $ReparaturExitCode -Details $ReparaturAusgabe
        return $false
    }

    if ($Quelle -ne 'winget' -or (Test-PaketAusgeschlossen -Id $Id)) {
        $script:UebersprungeneNeuinstallationen++
        $script:UnbehobeneProgrammfehler++
        Add-Resultat -Bereich 'Programme' -Aktion ("Neuinstallation $Id") -Status 'Quelle oder Paketkategorie nicht freigegeben' -ExitCode $ReparaturExitCode -Details $ReparaturAusgabe
        return $false
    }

    $methodenMatrix = Get-SichereProgrammMethodenMatrix -Typ 'WinGet' -Id $Id -Quelle $Quelle -Scope $UrspruenglicherScope
    if (-not [bool]$methodenMatrix.OnlineAktionFreigegeben) {
        $script:UebersprungeneNeuinstallationen++
        $script:UnbehobeneProgrammfehler++
        Add-Warnung -Text ("Die zentrale Methoden-Matrix hat den Neuinstallationskontext fuer '{0}' abgelehnt." -f $Id)
        Add-Resultat -Bereich 'Programme' -Aktion ("Neuinstallation $Id") -Status 'Methoden-Matrix hat Onlineaktion abgelehnt' -ExitCode $ReparaturExitCode -Details $methodenMatrix.Details
        return $false
    }

    if ([string]::IsNullOrWhiteSpace([string]$script:InstallationsOrdner) -or
        -not (Test-Path -LiteralPath $script:InstallationsOrdner -PathType Container) -or
        -not (Test-VerzeichnisketteOhneReparsePoint -Basis $script:LogOrdner -Kandidat $script:InstallationsOrdner)) {
        $script:FehlgeschlageneInstallerDownloads++
        $script:UnbehobeneProgrammfehler++
        Add-Warnung -Text ("Installationsdatei fuer '{0}' konnte nicht gespeichert werden, weil kein sicherer Installationsordner vorhanden ist." -f $Id)
        Add-Resultat -Bereich 'Programme' -Aktion ("Installer-Download $Id") -Status 'Installationsordner fehlt oder ist unsicher' -ExitCode -1 -Details ([string]$script:InstallationsOrdner)
        return $false
    }

    if (-not (Test-WinGetQuelle -WinGet $WinGet -Name $Quelle)) {
        $script:UebersprungeneNeuinstallationen++
        $script:UnbehobeneProgrammfehler++
        Add-Warnung -Text ("Die offizielle WinGet-Quelle konnte unmittelbar vor dem Fallback fuer '{0}' nicht erneut verifiziert werden. Download und Neuinstallation wurden ausgelassen." -f $Id)
        Add-Resultat -Bereich 'Programme' -Aktion ("Neuinstallation $Id") -Status 'Quelle bei Sicherheitsnachkontrolle nicht verifiziert' -ExitCode $ReparaturExitCode -Details $ReparaturAusgabe
        return $false
    }

    $scope = $UrspruenglicherScope
    $scopeStatus = Get-WinGetPaketStatusImScope -WinGet $WinGet -Id $Id -Quelle $Quelle -Scope $scope -ListHilfeText $ListHilfeText
    if (-not [bool](Get-SichereEigenschaft -Objekt $scopeStatus -Name 'Eindeutig' -Standardwert $false) -or
        -not [bool](Get-SichereEigenschaft -Objekt $scopeStatus -Name 'Installiert' -Standardwert $false)) {
        $script:UebersprungeneNeuinstallationen++
        $script:UnbehobeneProgrammfehler++
        $kontextDetails = Get-SichererText -Objekt $scopeStatus -Name 'Details'
        Add-Warnung -Text ("Paket '{0}' ist im urspruenglichen Scope '{1}' nicht mehr eindeutig installiert. Der Fallback wurde ausgelassen: {2}" -f $Id, $scope, $kontextDetails)
        Add-Resultat -Bereich 'Programme' -Aktion ("Neuinstallation $Id") -Status 'Installationskontext im Scope nicht eindeutig' -ExitCode $ReparaturExitCode -Details $kontextDetails
        return $false
    }

    # Jeder Community-Neuinstallationsfallback durchlaeuft dieselbe zentrale
    # Vorabpruefung wie ein normales Update. Dadurch gelten Manifestversion,
    # WinGet-SHA-256, Authenticode, Quarantaene und der einmalige sichere
    # Quellenaktualisierungsversuch auch fuer aus Registry-Daten abgeleitete
    # Reparaturwege. Ein direkter Download ohne diese Matrix ist nicht erlaubt.
    if ([string]::IsNullOrWhiteSpace($VorabDownloadOrdner)) {
        $manifestStatus = Get-WinGetManifestVersion -WinGet $WinGet -Id $Id -Quelle $Quelle
        if (-not [bool](Get-SichereEigenschaft -Objekt $manifestStatus -Name 'Eindeutig' -Standardwert $false)) {
            $script:UebersprungeneNeuinstallationen++
            $script:UnbehobeneProgrammfehler++
            Add-Warnung -Text ("Die exakte Manifestversion fuer '{0}' konnte vor dem Neuinstallationsfallback nicht eindeutig bestimmt werden." -f $Id)
            Add-Resultat -Bereich 'Programme' -Aktion ("Neuinstallation-Vorabpruefung $Id") -Status 'Manifestversion nicht eindeutig; sicher ausgelassen' -ExitCode $ReparaturExitCode -Details (Get-SichererText -Objekt $manifestStatus -Name 'Details')
            return $false
        }
        $manifestVersion = Get-SichererText -Objekt $manifestStatus -Name 'Version'
        if (Test-WinGetUpdateIstQuarantiniert -Eintraege @(Get-WinGetUpdateQuarantaene) -Id $Id -Quelle $Quelle -Scope $scope -Verfuegbar $manifestVersion) {
            $script:UebersprungeneNeuinstallationen++
            Add-Warnung -Text ("Der Neuinstallationsfallback fuer '{0}' bleibt wegen der bestaetigten Hashabweichung der Manifestversion '{1}' quarantiniert; die naechste Programmpruefung wird fortgesetzt." -f $Id, $manifestVersion)
            Add-Resultat -Bereich 'Programme' -Aktion ("Neuinstallation-Vorabpruefung $Id") -Status 'Manifestversion quarantiniert; weitere Programme werden geprueft' -ExitCode -1978335215 -Details $methodenMatrix.Details
            return $false
        }
        $zentraleVorabpruefung = Test-WinGetUpdateVorab -WinGet $WinGet -Id $Id -Quelle $Quelle -Scope $scope -Verfuegbar $manifestVersion -BehaltenFuerFallback
        if (-not [bool](Get-SichereEigenschaft -Objekt $zentraleVorabpruefung -Name 'Erfolgreich' -Standardwert $false)) {
            $script:FehlgeschlageneInstallerDownloads++
            $script:UnbehobeneProgrammfehler++
            $vorabCode = [int](Get-SichereEigenschaft -Objekt $zentraleVorabpruefung -Name 'ExitCode' -Standardwert -1)
            $vorabQuarantiniert = [bool](Get-SichereEigenschaft -Objekt $zentraleVorabpruefung -Name 'Quarantiniert' -Standardwert $false)
            Add-Warnung -Text ("Die zentrale Download-/Hash-Vorabpruefung fuer '{0}' ist fehlgeschlagen. Nur dieses Paket wird {1}; weitere Programme werden geprueft." -f $Id, $(if ($vorabQuarantiniert) { 'quarantiniert' } else { 'fuer diesen Lauf isoliert' }))
            Add-Resultat -Bereich 'Programme' -Aktion ("Neuinstallation-Vorabpruefung $Id") -Status $(if ($vorabQuarantiniert) { 'Hashabweichung quarantiniert; Fortsetzung aktiv' } else { 'Fehlgeschlagen; Fortsetzung aktiv' }) -ExitCode $vorabCode -Details (Get-SichererText -Objekt $zentraleVorabpruefung -Name 'Details')
            return $false
        }
        $VorabDownloadOrdner = Get-SichererText -Objekt $zentraleVorabpruefung -Name 'DownloadOrdner'
        if ([string]::IsNullOrWhiteSpace($VorabDownloadOrdner)) {
            $script:FehlgeschlageneInstallerDownloads++
            $script:UnbehobeneProgrammfehler++
            Add-Warnung -Text ("Die zentrale Vorabpruefung fuer '{0}' lieferte keinen wiederverwendbaren kontrollierten Downloadordner." -f $Id)
            return $false
        }
    }

    try {
        $null = New-WinGetDownloadArgumente -Id $Id -ZielOrdner $script:InstallationsOrdner -Scope $scope -HilfeText $DownloadHilfeText
        $installArgumente = New-WinGetNeuinstallationsArgumente -Id $Id -Quelle 'winget' -Scope $scope -HilfeText $InstallHilfeText
    }
    catch {
        $script:UebersprungeneNeuinstallationen++
        $script:UnbehobeneProgrammfehler++
        Add-Warnung -Text ("Die automatische Neuinstallation von '{0}' wurde ausgelassen, weil die installierte WinGet-Version nicht alle Sicherheits-, Scope- und Ein-Klick-Optionen bereitstellt: {1}" -f $Id, $_.Exception.Message)
        Add-Resultat -Bereich 'Programme' -Aktion ("Neuinstallation $Id") -Status 'Benoetigte WinGet-Optionen fehlen' -ExitCode -1 -Details $_.Exception.Message
        return $false
    }

    $downloadAbgeschlossen = $false
    $fehlerBereitsGezaehlt = $false
    try {
        $paketOrdner = ''
        $dateiInfo = $null
        $vorabWiederverwendet = $false
        if (-not [string]::IsNullOrWhiteSpace($VorabDownloadOrdner)) {
            $kandidat = [IO.Path]::GetFullPath($VorabDownloadOrdner)
            $basis = [IO.Path]::GetFullPath($script:InstallationsOrdner).TrimEnd([char]92) + [char]92
            if (-not $kandidat.StartsWith($basis, [StringComparison]::OrdinalIgnoreCase) -or
                -not (Test-Path -LiteralPath $kandidat -PathType Container) -or
                -not (Test-VerzeichnisketteOhneReparsePoint -Basis $script:InstallationsOrdner -Kandidat $kandidat)) {
                throw 'Der zur Wiederverwendung uebergebene Vorabdownload liegt nicht in einem sicheren kontrollierten Ordner.'
            }
            $dateiInfo = Get-DownloadDateiInformationen -Ordner $kandidat
            if (-not [bool](Get-SichereEigenschaft -Objekt $dateiInfo -Name 'Gueltig' -Standardwert $false)) {
                throw ("Der zuvor bestaetigte Vorabdownload hat sich vor dem Fallback veraendert oder ist nicht mehr pruefbar: {0}" -f (Get-SichererText -Objekt $dateiInfo -Name 'Details'))
            }
            $paketOrdner = $kandidat
            $downloadAbgeschlossen = $true
            $vorabWiederverwendet = $true
            $script:VorabDownloadsWiederverwendet++
            Write-Status -Text ("Bereits hash- und signaturgepruefter Vorabdownload wird ohne erneuten Netzwerkdownload wiederverwendet: {0}" -f $Id) -Stufe 'OK'
        }
        else {
            $sichererName = ConvertTo-SichererDateiname -Wert $Id -MaximaleLaenge 100
            $paketOrdner = Join-Path -Path $script:InstallationsOrdner -ChildPath ("{0}-{1}-{2}" -f $sichererName, $scope, (Get-Date -Format 'yyyyMMdd-HHmmssfff'))
            if (-not (Reset-DownloadOrdnerSicher -Ordner $paketOrdner)) {
                $script:FehlgeschlageneInstallerDownloads++
                $script:UnbehobeneProgrammfehler++
                $fehlerBereitsGezaehlt = $true
                Add-Resultat -Bereich 'Programme' -Aktion ("Installer-Download $Id") -Status 'Downloadordner konnte nicht vorbereitet werden' -ExitCode -1 -Details $paketOrdner
                return $false
            }

            $downloadArgumente = New-WinGetDownloadArgumente -Id $Id -ZielOrdner $paketOrdner -Scope $scope -HilfeText $DownloadHilfeText
            Write-Status -Text ("Reparatur fehlgeschlagen. Installationsdateien werden offiziell ueber WinGet heruntergeladen: {0} (Scope: {1})" -f $Id, $scope) -Stufe 'SCHRITT'
            $download = Invoke-Native -Datei $WinGet -Argumente $downloadArgumente -Beschreibung ("Installationsdatei herunterladen: $Id") -TimeoutSekunden 3600 -LeerlaufTimeoutSekunden 600 -InstallationsVorgang -AktivitaetsPfade @($paketOrdner) -FehlerNurResultat -AusgabeUnterdruecken

            if (-not $download.Erfolgreich -and (Test-WinGetFehlerWiederholbar -ExitCode ([int]$download.ExitCode))) {
                Write-Status -Text ("Voruebergehender Downloadfehler bei {0}; die offizielle Quelle wird aktualisiert und der Download einmal wiederholt." -f $Id) -Stufe 'WARNUNG'
                $quellenUpdate = Invoke-Native -Datei $WinGet -Argumente @('source', 'update', '--name', $Quelle, '--disable-interactivity') -Beschreibung ("WinGet-Quelle {0} vor erneutem Installer-Download aktualisieren" -f $Quelle) -TimeoutSekunden 300 -FehlerNurResultat -AusgabeUnterdruecken
                Start-Sleep -Seconds 3
                if ($quellenUpdate.Erfolgreich -and (Test-WinGetQuelle -WinGet $WinGet -Name $Quelle) -and (Reset-DownloadOrdnerSicher -Ordner $paketOrdner)) {
                    $download = Invoke-Native -Datei $WinGet -Argumente $downloadArgumente -Beschreibung ("Installationsdatei erneut herunterladen: $Id") -TimeoutSekunden 3600 -LeerlaufTimeoutSekunden 600 -InstallationsVorgang -AktivitaetsPfade @($paketOrdner) -FehlerNurResultat -AusgabeUnterdruecken
                }
            }

            if (-not $download.Erfolgreich) {
                $script:FehlgeschlageneInstallerDownloads++
                $script:UnbehobeneProgrammfehler++
                $fehlerBereitsGezaehlt = $true
                Add-Warnung -Text ("Die Installationsdatei fuer '{0}' konnte nicht heruntergeladen werden (Exitcode {1}). Eine Neuinstallation wurde nicht gestartet." -f $Id, [int]$download.ExitCode)
                Add-Resultat -Bereich 'Programme' -Aktion ("Installer-Download $Id") -Status 'Fehlgeschlagen' -ExitCode ([int]$download.ExitCode) -Details ([string]$download.Ausgabe)
                return $false
            }

            $dateiInfo = Get-DownloadDateiInformationen -Ordner $paketOrdner
            if (-not [bool](Get-SichereEigenschaft -Objekt $dateiInfo -Name 'Gueltig' -Standardwert $false)) {
                $script:FehlgeschlageneInstallerDownloads++
                $script:UnbehobeneProgrammfehler++
                $fehlerBereitsGezaehlt = $true
                $details = Get-SichererText -Objekt $dateiInfo -Name 'Details'
                Add-Warnung -Text ("Der Download fuer '{0}' wurde nicht als vollstaendig und pruefbar erkannt: {1}" -f $Id, $details)
                Add-Resultat -Bereich 'Programme' -Aktion ("Installer-Download $Id") -Status 'Download nicht verifizierbar' -ExitCode ([int]$download.ExitCode) -Details $details
                return $false
            }

            $downloadAbgeschlossen = $true
        }

        $script:HeruntergeladeneInstallationspakete++
        $downloadDetails = Get-SichererText -Objekt $dateiInfo -Name 'Details'
        Add-Resultat -Bereich 'Programme' -Aktion ("Installer-Download $Id") -Status $(if ($vorabWiederverwendet) { 'Verifizierter Vorabdownload wiederverwendet; kein doppelter Netzwerkdownload' } else { 'Erfolgreich; WinGet-Hashpruefung aktiv und lokale SHA-256-Liste erstellt' }) -ExitCode 0 -Details ("Scope: {0}; Ordner: {1}; {2}" -f $scope, $paketOrdner, $downloadDetails)
        Write-Status -Text ("Installationsdateien bestaetigt und mit SHA-256 protokolliert: {0}" -f $paketOrdner) -Stufe 'OK'

        if (-not (Test-WinGetQuelle -WinGet $WinGet -Name $Quelle)) {
            $script:UebersprungeneNeuinstallationen++
            $script:UnbehobeneProgrammfehler++
            $fehlerBereitsGezaehlt = $true
            Add-Warnung -Text ("Die offizielle WinGet-Quelle konnte nach dem Download fuer '{0}' nicht mehr verifiziert werden. Die Installation wurde nicht gestartet." -f $Id)
            Add-Resultat -Bereich 'Programme' -Aktion ("Neuinstallation $Id") -Status 'Quelle vor Installation nicht verifiziert' -ExitCode -1 -Details ("Installer-Archiv: {0}" -f $paketOrdner)
            return $false
        }

        if (-not (Test-WinGetPaketInstalliert -WinGet $WinGet -Id $Id -Quelle $Quelle -Scope $scope -ListHilfeText $ListHilfeText)) {
            $script:UebersprungeneNeuinstallationen++
            $script:UnbehobeneProgrammfehler++
            $fehlerBereitsGezaehlt = $true
            Add-Warnung -Text ("Paket '{0}' ist nach dem Download nicht mehr eindeutig im urspruenglichen Scope installiert. Eine unerwartete Neuinstallation als frische Installation wurde verhindert." -f $Id)
            Add-Resultat -Bereich 'Programme' -Aktion ("Neuinstallation $Id") -Status 'Paket vor Neuinstallation nicht mehr eindeutig installiert' -ExitCode -1 -Details ("Scope: {0}; Installer-Archiv: {1}" -f $scope, $paketOrdner)
            return $false
        }

        Write-Status -Text ("Programm wird im urspruenglichen Scope ueber die verifizierte WinGet-Paketkennung erneut installiert: {0} ({1})" -f $Id, $scope) -Stufe 'SCHRITT'
        $installation = Invoke-Native -Datei $WinGet -Argumente $installArgumente -Beschreibung ("Programm neu installieren: $Id") -TimeoutSekunden 3600 -LeerlaufTimeoutSekunden 600 -InstallationsVorgang -FehlerNurResultat -AusgabeUnterdruecken
        $kategorie = Get-WinGetErgebniskategorie -ExitCode ([int]$installation.ExitCode) -Ausgabe ([string]$installation.Ausgabe)

        if ($kategorie -notin @('Erfolg', 'ErfolgNeustart') -and (Test-WinGetFehlerWiederholbar -ExitCode ([int]$installation.ExitCode))) {
            Write-Status -Text ("Voruebergehender Neuinstallationsfehler bei {0}; die Quelle wird erneut verifiziert und die Installation einmal wiederholt." -f $Id) -Stufe 'WARNUNG'
            $quellenUpdate = Invoke-Native -Datei $WinGet -Argumente @('source', 'update', '--name', $Quelle, '--disable-interactivity') -Beschreibung ("WinGet-Quelle {0} vor erneuter Neuinstallation aktualisieren" -f $Quelle) -TimeoutSekunden 300 -FehlerNurResultat -AusgabeUnterdruecken
            Start-Sleep -Seconds 3
            if ($quellenUpdate.Erfolgreich -and (Test-WinGetQuelle -WinGet $WinGet -Name $Quelle)) {
                $installation = Invoke-Native -Datei $WinGet -Argumente $installArgumente -Beschreibung ("Programm erneut neu installieren: $Id") -TimeoutSekunden 3600 -LeerlaufTimeoutSekunden 600 -InstallationsVorgang -FehlerNurResultat -AusgabeUnterdruecken
                $kategorie = Get-WinGetErgebniskategorie -ExitCode ([int]$installation.ExitCode) -Ausgabe ([string]$installation.Ausgabe)
            }
        }

        if ($kategorie -in @('Erfolg', 'ErfolgNeustart')) {
            $nachInstallationsStatus = Get-WinGetPaketStatusImScope -WinGet $WinGet -Id $Id -Quelle $Quelle -Scope $scope -ListHilfeText $ListHilfeText
            if (-not [bool](Get-SichereEigenschaft -Objekt $nachInstallationsStatus -Name 'Eindeutig' -Standardwert $false) -or
                -not [bool](Get-SichereEigenschaft -Objekt $nachInstallationsStatus -Name 'Installiert' -Standardwert $false)) {
                $script:FehlgeschlageneNeuinstallationen++
                $script:UnbehobeneProgrammfehler++
                $fehlerBereitsGezaehlt = $true
                Add-Warnung -Text ("WinGet meldete fuer '{0}' einen erfolgreichen Installationslauf, das Paket konnte danach jedoch nicht eindeutig im urspruenglichen Scope '{1}' bestaetigt werden." -f $Id, $scope)
                Add-Resultat -Bereich 'Programme' -Aktion ("Neuinstallation $Id") -Status 'Nachkontrolle oder Scope-Pruefung fehlgeschlagen' -ExitCode ([int]$installation.ExitCode) -Details ("Scope: {0}; Installer-Archiv: {1}{2}{3}" -f $scope, $paketOrdner, [Environment]::NewLine, [string]$installation.Ausgabe)
                return $false
            }

            $neuinstallationNeustart = ($kategorie -eq 'ErfolgNeustart' -or [bool](Get-SichereEigenschaft -Objekt $installation -Name 'Neustart' -Standardwert $false))
            if ($neuinstallationNeustart) {
                Add-OneClickNeustartnachweis -Quelle ("WinGet-Neuinstallation {0}" -f $Id) -ExitCode ([int]$installation.ExitCode) -Details ("Quelle: {0}; Scope: {1}" -f $Quelle, $scope)
            }
            $abschlussVersionen = @(Get-SichereEigenschaft -Objekt $nachInstallationsStatus -Name 'Versionen' -Standardwert @())
            Set-PaketPruefstatusErfolgreich -Id $Id -Quelle $Quelle -Scope $scope -Versionen $abschlussVersionen -Methode 'Neuinstallation'
            $script:ErfolgreicheNeuinstallationen++
            Add-Resultat -Bereich 'Programme' -Aktion ("Neuinstallation $Id") -Status $(if ($neuinstallationNeustart) { 'Erfolgreich, im urspruenglichen Scope nachkontrolliert; Neustart erforderlich' } else { 'Erfolgreich und im urspruenglichen Scope nachkontrolliert' }) -ExitCode ([int]$installation.ExitCode) -Details ("Scope: {0}; Installer-Archiv: {1}{2}{3}" -f $scope, $paketOrdner, [Environment]::NewLine, [string]$installation.Ausgabe)
            Write-Status -Text ("Neuinstallation erfolgreich nachkontrolliert: {0} ({1}){2}" -f $Id, $scope, $(if ($neuinstallationNeustart) { ' (Neustart erforderlich)' } else { '' })) -Stufe 'OK'
            return $true
        }

        $script:FehlgeschlageneNeuinstallationen++
        $script:UnbehobeneProgrammfehler++
        $fehlerBereitsGezaehlt = $true
        $beschreibung = Get-WinGetFehlerbeschreibung -ExitCode ([int]$installation.ExitCode) -Ausgabe ([string]$installation.Ausgabe)
        Add-Warnung -Text ("Die Neuinstallation von '{0}' ist fehlgeschlagen: {1} (Exitcode {2}). Die heruntergeladenen Dateien bleiben unter '{3}' erhalten." -f $Id, $beschreibung, [int]$installation.ExitCode, $paketOrdner)
        Add-Resultat -Bereich 'Programme' -Aktion ("Neuinstallation $Id") -Status 'Fehlgeschlagen' -ExitCode ([int]$installation.ExitCode) -Details ("Scope: {0}; Installer-Archiv: {1}{2}{3}" -f $scope, $paketOrdner, [Environment]::NewLine, [string]$installation.Ausgabe)
        return $false
    }
    catch {
        if (-not $fehlerBereitsGezaehlt) {
            if ($downloadAbgeschlossen) {
                $script:FehlgeschlageneNeuinstallationen++
            }
            else {
                $script:FehlgeschlageneInstallerDownloads++
            }
            $script:UnbehobeneProgrammfehler++
        }
        Add-Warnung -Text ("Download oder Neuinstallation fuer '{0}' konnte nicht sicher abgeschlossen werden: {1}" -f $Id, $_.Exception.Message)
        Add-Resultat -Bereich 'Programme' -Aktion ("Download/Neuinstallation $Id") -Status 'Ausnahme' -ExitCode -1 -Details ($_ | Out-String)
        return $false
    }
}

function Invoke-DownloadUndNeuinstallationPaketIsoliert {
    param(
        [Parameter(Mandatory = $true)][string]$WinGet,
        [Parameter(Mandatory = $true)][string]$Id,
        [Parameter(Mandatory = $true)][ValidateSet('winget')][string]$Quelle,
        [Parameter(Mandatory = $true)][ValidateSet('user', 'machine')][string]$UrspruenglicherScope,
        [Parameter(Mandatory = $true)][string]$ListHilfeText,
        [Parameter(Mandatory = $true)][string]$DownloadHilfeText,
        [Parameter(Mandatory = $true)][string]$InstallHilfeText,
        [int]$ReparaturExitCode = -1,
        [AllowEmptyString()][string]$ReparaturAusgabe = '',
        [AllowEmptyString()][string]$VorabDownloadOrdner = ''
    )

    $unbehobeneVorher = [int]$script:UnbehobeneProgrammfehler
    try {
        return [bool](Invoke-DownloadUndNeuinstallation -WinGet $WinGet -Id $Id -Quelle $Quelle -UrspruenglicherScope $UrspruenglicherScope -ListHilfeText $ListHilfeText -DownloadHilfeText $DownloadHilfeText -InstallHilfeText $InstallHilfeText -ReparaturExitCode $ReparaturExitCode -ReparaturAusgabe $ReparaturAusgabe -VorabDownloadOrdner $VorabDownloadOrdner)
    }
    catch {
        if ([int]$script:UnbehobeneProgrammfehler -eq $unbehobeneVorher) { $script:UnbehobeneProgrammfehler++ }
        $script:UebersprungeneNeuinstallationen++
        Add-Warnung -Text ("Der Download-/Neuinstallationsfallback fuer '{0}' wurde nach einer unerwarteten paketbezogenen Ausnahme isoliert; alle weiteren Programme werden verarbeitet: {1}" -f $Id, $_.Exception.Message)
        Add-Resultat -Bereich 'Programme' -Aktion ("Download/Neuinstallation $Id") -Status 'Paketbezogene Ausnahme isoliert; Programmpruefung wird fortgesetzt' -ExitCode -1 -Details ($_ | Out-String)
        return $false
    }
}

function Invoke-MicrosoftStoreNeuinstallation {
    param(
        [Parameter(Mandatory = $true)][string]$WinGet,
        [Parameter(Mandatory = $true)][string]$Id,
        [Parameter(Mandatory = $true)][ValidateSet('user', 'machine')][string]$UrspruenglicherScope,
        [Parameter(Mandatory = $true)][string]$ListHilfeText,
        [Parameter(Mandatory = $true)][string]$InstallHilfeText,
        [int]$ReparaturExitCode = -1,
        [string]$ReparaturAusgabe = ''
    )

    $quelle = 'msstore'
    if (-not (Test-SichereWinGetPaketIdFuerQuelle -Id $Id -Quelle $quelle) -or (Test-PaketAusgeschlossen -Id $Id)) {
        $script:UebersprungeneNeuinstallationen++
        $script:UnbehobeneProgrammfehler++
        Add-Warnung -Text ("Die Microsoft-Store-Neuinstallation wurde wegen einer ungueltigen Paketkennung oder einer ausgeschlossenen Paketkategorie ausgelassen: {0}" -f $Id)
        Add-Resultat -Bereich 'Programme' -Aktion ("Store-Neuinstallation $Id") -Status 'Aus Sicherheitsgruenden ausgelassen' -ExitCode $ReparaturExitCode -Details $ReparaturAusgabe
        return $false
    }

    if (-not (Test-WinGetQuelle -WinGet $WinGet -Name $quelle)) {
        $script:UebersprungeneNeuinstallationen++
        $script:UnbehobeneProgrammfehler++
        Add-Warnung -Text ("Die offizielle Microsoft-Store-Quelle konnte unmittelbar vor der Neuinstallation von '{0}' nicht verifiziert werden." -f $Id)
        Add-Resultat -Bereich 'Programme' -Aktion ("Store-Neuinstallation $Id") -Status 'Quelle nicht verifiziert' -ExitCode $ReparaturExitCode -Details $ReparaturAusgabe
        return $false
    }

    $scope = $UrspruenglicherScope
    $scopeStatus = Get-WinGetPaketStatusImScope -WinGet $WinGet -Id $Id -Quelle $quelle -Scope $scope -ListHilfeText $ListHilfeText
    if (-not [bool](Get-SichereEigenschaft -Objekt $scopeStatus -Name 'Eindeutig' -Standardwert $false) -or
        -not [bool](Get-SichereEigenschaft -Objekt $scopeStatus -Name 'Installiert' -Standardwert $false)) {
        $script:UebersprungeneNeuinstallationen++
        $script:UnbehobeneProgrammfehler++
        $details = Get-SichererText -Objekt $scopeStatus -Name 'Details'
        Add-Warnung -Text ("Microsoft-Store-Paket '{0}' ist im urspruenglichen Scope '{1}' nicht eindeutig installiert. Die Neuinstallation wurde ausgelassen: {2}" -f $Id, $scope, $details)
        Add-Resultat -Bereich 'Programme' -Aktion ("Store-Neuinstallation $Id") -Status 'Installationskontext im Scope nicht eindeutig' -ExitCode $ReparaturExitCode -Details $details
        return $false
    }

    try {
        $installArgumente = New-WinGetNeuinstallationsArgumente -Id $Id -Quelle $quelle -Scope $scope -HilfeText $InstallHilfeText
    }
    catch {
        $script:UebersprungeneNeuinstallationen++
        $script:UnbehobeneProgrammfehler++
        Add-Warnung -Text ("Die automatische Microsoft-Store-Neuinstallation von '{0}' wurde wegen fehlender sicherer WinGet-Optionen ausgelassen: {1}" -f $Id, $_.Exception.Message)
        Add-Resultat -Bereich 'Programme' -Aktion ("Store-Neuinstallation $Id") -Status 'Benoetigte WinGet-Optionen fehlen' -ExitCode -1 -Details $_.Exception.Message
        return $false
    }

    if (-not (Test-WinGetPaketInstalliert -WinGet $WinGet -Id $Id -Quelle $quelle -Scope $scope -ListHilfeText $ListHilfeText)) {
        $script:UebersprungeneNeuinstallationen++
        $script:UnbehobeneProgrammfehler++
        Add-Warnung -Text ("Microsoft-Store-Paket '{0}' ist vor dem Neuinstallationsversuch nicht mehr eindeutig im urspruenglichen Scope installiert. Eine unerwartete Erstinstallation wurde verhindert." -f $Id)
        Add-Resultat -Bereich 'Programme' -Aktion ("Store-Neuinstallation $Id") -Status 'Paket vor Neuinstallation nicht mehr eindeutig installiert' -ExitCode -1 -Details ("Scope: {0}" -f $scope)
        return $false
    }

    Write-Status -Text ("Microsoft-Store-Paket wird im urspruenglichen Scope erneut installiert. WinGet laedt die benoetigten Paketdateien automatisch: {0} ({1})" -f $Id, $scope) -Stufe 'SCHRITT'
    $installation = Invoke-Native -Datei $WinGet -Argumente $installArgumente -Beschreibung ("Microsoft-Store-Paket neu installieren: $Id") -TimeoutSekunden 3600 -LeerlaufTimeoutSekunden 600 -InstallationsVorgang -FehlerNurResultat -AusgabeUnterdruecken
    $kategorie = Get-WinGetErgebniskategorie -ExitCode ([int]$installation.ExitCode) -Ausgabe ([string]$installation.Ausgabe)

    if ($kategorie -notin @('Erfolg', 'ErfolgNeustart') -and (Test-WinGetFehlerWiederholbar -ExitCode ([int]$installation.ExitCode))) {
        Write-Status -Text ("Voruebergehender Store-Installationsfehler bei {0}; die Microsoft-Store-Quelle wird aktualisiert und die Installation einmal wiederholt." -f $Id) -Stufe 'WARNUNG'
        $quellenUpdate = Invoke-Native -Datei $WinGet -Argumente @('source', 'update', '--name', $quelle, '--disable-interactivity') -Beschreibung 'Microsoft-Store-Quelle vor erneuter Neuinstallation aktualisieren' -TimeoutSekunden 300 -FehlerNurResultat -AusgabeUnterdruecken
        Start-Sleep -Seconds 3
        if ($quellenUpdate.Erfolgreich -and (Test-WinGetQuelle -WinGet $WinGet -Name $quelle)) {
            $installation = Invoke-Native -Datei $WinGet -Argumente $installArgumente -Beschreibung ("Microsoft-Store-Paket erneut neu installieren: $Id") -TimeoutSekunden 3600 -LeerlaufTimeoutSekunden 600 -InstallationsVorgang -FehlerNurResultat -AusgabeUnterdruecken
            $kategorie = Get-WinGetErgebniskategorie -ExitCode ([int]$installation.ExitCode) -Ausgabe ([string]$installation.Ausgabe)
        }
    }

    if ($kategorie -in @('Erfolg', 'ErfolgNeustart')) {
        $nachInstallationsStatus = Get-WinGetPaketStatusImScope -WinGet $WinGet -Id $Id -Quelle $quelle -Scope $scope -ListHilfeText $ListHilfeText
        if (-not [bool](Get-SichereEigenschaft -Objekt $nachInstallationsStatus -Name 'Eindeutig' -Standardwert $false) -or
            -not [bool](Get-SichereEigenschaft -Objekt $nachInstallationsStatus -Name 'Installiert' -Standardwert $false)) {
            $script:FehlgeschlageneNeuinstallationen++
            $script:UnbehobeneProgrammfehler++
            Add-Warnung -Text ("WinGet meldete fuer Microsoft-Store-Paket '{0}' einen erfolgreichen Installationslauf, das Paket konnte danach jedoch nicht eindeutig im urspruenglichen Scope bestaetigt werden." -f $Id)
            Add-Resultat -Bereich 'Programme' -Aktion ("Store-Neuinstallation $Id") -Status 'Nachkontrolle oder Scope-Pruefung fehlgeschlagen' -ExitCode ([int]$installation.ExitCode) -Details ("Scope: {0}{1}{2}" -f $scope, [Environment]::NewLine, [string]$installation.Ausgabe)
            return $false
        }

        $neustart = ($kategorie -eq 'ErfolgNeustart' -or [bool](Get-SichereEigenschaft -Objekt $installation -Name 'Neustart' -Standardwert $false))
        if ($neustart) { Add-OneClickNeustartnachweis -Quelle ("Microsoft-Store-Neuinstallation {0}" -f $Id) -ExitCode ([int]$installation.ExitCode) -Details ("Scope: {0}" -f $scope) }
        $abschlussVersionen = @(Get-SichereEigenschaft -Objekt $nachInstallationsStatus -Name 'Versionen' -Standardwert @())
        Set-PaketPruefstatusErfolgreich -Id $Id -Quelle $quelle -Scope $scope -Versionen $abschlussVersionen -Methode 'Neuinstallation'
        $script:ErfolgreicheNeuinstallationen++
        Add-Resultat -Bereich 'Programme' -Aktion ("Store-Neuinstallation $Id") -Status $(if ($neustart) { 'Erfolgreich und nachkontrolliert; Neustart erforderlich' } else { 'Erfolgreich und nachkontrolliert' }) -ExitCode ([int]$installation.ExitCode) -Details ("Scope: {0}{1}{2}" -f $scope, [Environment]::NewLine, [string]$installation.Ausgabe)
        Write-Status -Text ("Microsoft-Store-Neuinstallation erfolgreich nachkontrolliert: {0} ({1}){2}" -f $Id, $scope, $(if ($neustart) { ' (Neustart erforderlich)' } else { '' })) -Stufe 'OK'
        return $true
    }

    $script:FehlgeschlageneNeuinstallationen++
    $script:UnbehobeneProgrammfehler++
    $beschreibung = Get-WinGetFehlerbeschreibung -ExitCode ([int]$installation.ExitCode) -Ausgabe ([string]$installation.Ausgabe)
    Add-Warnung -Text ("Die Microsoft-Store-Neuinstallation von '{0}' ist fehlgeschlagen: {1} (Exitcode {2}). Eine Anmeldung, eine Benutzeraktion oder eine Store-Lizenz kann erforderlich sein." -f $Id, $beschreibung, [int]$installation.ExitCode)
    Add-Resultat -Bereich 'Programme' -Aktion ("Store-Neuinstallation $Id") -Status 'Fehlgeschlagen' -ExitCode ([int]$installation.ExitCode) -Details ("Scope: {0}{1}{2}" -f $scope, [Environment]::NewLine, [string]$installation.Ausgabe)
    return $false
}

function Resolve-RegistrierterDateipfad {
    param([AllowNull()][string]$Wert)

    if ([string]::IsNullOrWhiteSpace($Wert)) { return '' }

    $text = [Environment]::ExpandEnvironmentVariables($Wert.Trim())
    if ($text.StartsWith('@')) { $text = $text.Substring(1).Trim() }

    $kandidat = ''
    if ($text.StartsWith('"')) {
        $ende = $text.IndexOf('"', 1)
        if ($ende -gt 1) {
            $kandidat = $text.Substring(1, $ende - 1)
        }
    }
    elseif ($text -match '^(?<Pfad>[A-Za-z]:\\.*?\.(?:exe|dll|ico|cpl|scr|msi))(?=,|\s|$)') {
        $kandidat = $Matches['Pfad']
    }
    elseif ($text -match '^(?<Pfad>\\\\[^\\]+\\[^\\]+\\.*?\.(?:exe|dll|ico|cpl|scr|msi))(?=,|\s|$)') {
        $kandidat = $Matches['Pfad']
    }

    if ([string]::IsNullOrWhiteSpace($kandidat)) { return '' }
    if ($kandidat -match '(?i)(^|\\)msiexec(?:\.exe)?$') { return '' }

    try {
        if (-not [IO.Path]::IsPathRooted($kandidat)) { return '' }
        return [IO.Path]::GetFullPath($kandidat)
    }
    catch {
        return ''
    }
}

function Get-PortableDateiPruefstatus {
    param([Parameter(Mandatory = $true)][string]$Pfad)

    if (-not (Test-Path -LiteralPath $Pfad -PathType Leaf)) { return 'Fehlt' }

    try {
        $datei = Get-Item -LiteralPath $Pfad -Force -ErrorAction Stop
        if ($datei.Length -le 0) { return 'Ungueltig' }

        $endung = $datei.Extension.ToLowerInvariant()
        if ($endung -notin @('.exe', '.dll', '.cpl', '.scr')) {
            return 'Gueltig'
        }
        if ($datei.Length -lt 64) { return 'Ungueltig' }

        $stream = [IO.File]::Open($datei.FullName, [IO.FileMode]::Open, [IO.FileAccess]::Read, [IO.FileShare]::ReadWrite)
        try {
            $b1 = $stream.ReadByte()
            $b2 = $stream.ReadByte()
            if ($b1 -eq 0x4D -and $b2 -eq 0x5A) { return 'Gueltig' }
            return 'Ungueltig'
        }
        finally {
            $stream.Dispose()
        }
    }
    catch {
        return 'NichtLesbar'
    }
}

function Test-RegistryProgrammSicherheitsausgeschlossen {
    param([Parameter(Mandatory = $true)][object]$Programm)

    $name = Get-SichererText -Objekt $Programm -Name 'DisplayName'
    $publisher = Get-SichererText -Objekt $Programm -Name 'Publisher'
    $kombiniert = ($name + ' ' + $publisher)

    if (Test-RegistryWahr -Wert (Get-SichereEigenschaft -Objekt $Programm -Name 'SystemComponent' -Standardwert 0)) {
        return $true
    }

    $releaseType = Get-SichererText -Objekt $Programm -Name 'ReleaseType'
    if ($releaseType -match '(?i)(update|hotfix|security update)') { return $true }
    if ($name -match '(?i)(^Update for |^Security Update for |\(KB[0-9]+\)|\bKB[0-9]{5,}\b)') { return $true }

    $muster = @(
        '(?i)\b(BIOS|Firmware|Bootloader)\b',
        '(?i)\b(Antivirus|Endpoint|Security Agent|EDR|VPN)\b',
        '(?i)\b(NVIDIA|AMD Software|Intel.*Driver|Realtek.*Driver)\b',
        '(?i)\b(VirtualBox|VMware|Hyper-V|Docker Desktop|Windows Subsystem for Linux|WSL)\b',
        '(?i)^Microsoft PowerShell\b',
        '(?i)^App Installer\b',
        '(?i)^Windows Terminal\b'
    )
    foreach ($regex in $muster) {
        if ($kombiniert -match $regex) { return $true }
    }
    return $false
}

function Test-RegistryProgrammIntegritaet {
    param([Parameter(Mandatory = $true)][object]$Programm)

    $gruende = New-Object 'System.Collections.Generic.List[string]'
    $unklareHinweise = New-Object 'System.Collections.Generic.List[string]'
    $positiveHinweise = 0
    $fehlerPunkte = 0
    $name = Get-SichererText -Objekt $Programm -Name 'DisplayName'
    $productCode = Get-SichererText -Objekt $Programm -Name 'ProductCode'
    $istMsi = (
        (Test-RegistryWahr -Wert (Get-SichereEigenschaft -Objekt $Programm -Name 'WindowsInstaller' -Standardwert 0)) -or
        $productCode -match '^\{[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}\}$'
    )

    if (Test-RegistryProgrammSicherheitsausgeschlossen -Programm $Programm) {
        return [pscustomobject]@{
            DisplayName = $name
            Status = 'Sicherheitskritisch oder Systemkomponente'
            Beschaedigungsverdacht = $false
            MSIPruefbar = $false
            ProductCode = $productCode
            Scope = Get-SichererText -Objekt $Programm -Name 'Scope'
            Gruende = 'Automatische Reparatur aus Sicherheitsgruenden ausgeschlossen.'
        }
    }

    $installLocation = Get-SichererText -Objekt $Programm -Name 'InstallLocation'
    if (-not [string]::IsNullOrWhiteSpace($installLocation)) {
        try {
            $ordner = [IO.Path]::GetFullPath([Environment]::ExpandEnvironmentVariables($installLocation.Trim().Trim('"')))
            if (Test-Path -LiteralPath $ordner -PathType Container) {
                $positiveHinweise++
            }
            else {
                $fehlerPunkte += 2
                $gruende.Add(("Installationsordner fehlt: {0}" -f $ordner)) | Out-Null
            }
        }
        catch {
            $unklareHinweise.Add('Der registrierte Installationsordner ist ungueltig oder nicht eindeutig auswertbar.') | Out-Null
        }
    }

    $iconPfad = Resolve-RegistrierterDateipfad -Wert (Get-SichererText -Objekt $Programm -Name 'DisplayIcon')
    if (-not [string]::IsNullOrWhiteSpace($iconPfad)) {
        $dateiStatus = Get-PortableDateiPruefstatus -Pfad $iconPfad
        switch ($dateiStatus) {
            'Gueltig' {
                $positiveHinweise++
                if ([IO.Path]::GetExtension($iconPfad).ToLowerInvariant() -in @('.exe', '.dll', '.ocx', '.scr', '.sys')) {
                    try {
                        $installierteSignatur = Get-AuthenticodeSignature -LiteralPath $iconPfad -ErrorAction Stop
                        if ($installierteSignatur.Status -eq [Management.Automation.SignatureStatus]::Valid) {
                            $positiveHinweise++
                        }
                        elseif ($installierteSignatur.Status -eq [Management.Automation.SignatureStatus]::HashMismatch) {
                            $fehlerPunkte += 3
                            $gruende.Add(("Die eingebettete Authenticode-Signatur der registrierten Programmdatei passt nicht mehr zum Dateiinhalt: {0}" -f $iconPfad)) | Out-Null
                        }
                        elseif ($installierteSignatur.Status -ne [Management.Automation.SignatureStatus]::NotSigned) {
                            $unklareHinweise.Add(("Authenticode-Status der registrierten Programmdatei ist nicht eindeutig vertrauenswuerdig ({0}): {1}" -f $installierteSignatur.Status, $iconPfad)) | Out-Null
                        }
                    }
                    catch {
                        $unklareHinweise.Add(("Authenticode-Status der registrierten Programmdatei konnte nicht gelesen werden: {0}" -f $iconPfad)) | Out-Null
                    }
                }
            }
            'Fehlt' {
                $fehlerPunkte += 2
                $gruende.Add(("Registrierte Programmdatei fehlt: {0}" -f $iconPfad)) | Out-Null
            }
            'Ungueltig' {
                $fehlerPunkte += 3
                $gruende.Add(("Registrierte Programmdatei besitzt keine plausible Dateistruktur: {0}" -f $iconPfad)) | Out-Null
            }
            default {
                $unklareHinweise.Add(("Registrierte Programmdatei konnte nicht gelesen werden: {0}" -f $iconPfad)) | Out-Null
            }
        }
    }

    $uninstallPfad = Resolve-RegistrierterDateipfad -Wert (Get-SichererText -Objekt $Programm -Name 'UninstallString')
    if (-not [string]::IsNullOrWhiteSpace($uninstallPfad)) {
        if (Test-Path -LiteralPath $uninstallPfad -PathType Leaf) {
            $positiveHinweise++
        }
        else {
            $fehlerPunkte += 1
            $gruende.Add(("Registriertes Deinstallationsprogramm fehlt: {0}" -f $uninstallPfad)) | Out-Null
        }
    }

    # Ein automatischer Neuinstallationsversuch darf nicht durch einen einzelnen
    # moeglicherweise veralteten Registry-Pfad ausgeloest werden. Erst eine
    # unplausible Programmdatei oder mehrere voneinander unabhaengige fehlende
    # Registrierungsziele gelten als belastbarer Beschaedigungsverdacht.
    if ($fehlerPunkte -ge 3) {
        $alleGruende = @($gruende.ToArray()) + @($unklareHinweise.ToArray())
        return [pscustomobject]@{
            DisplayName = $name
            Status = 'Beschaedigungsverdacht'
            Beschaedigungsverdacht = $true
            MSIPruefbar = $istMsi
            ProductCode = $productCode
            Scope = Get-SichererText -Objekt $Programm -Name 'Scope'
            Gruende = ($alleGruende -join ' | ')
        }
    }

    if ($istMsi) {
        $hinweisText = if ($gruende.Count -gt 0 -or $unklareHinweise.Count -gt 0) {
            (@($gruende.ToArray()) + @($unklareHinweise.ToArray())) -join ' | '
        }
        else {
            'Windows Installer kann fehlende oder beschaedigte Dateien, Registry-Eintraege und Verknuepfungen pruefen und reparieren.'
        }
        return [pscustomobject]@{
            DisplayName = $name
            Status = 'MSI-Pruefung und Reparatur moeglich'
            Beschaedigungsverdacht = $false
            MSIPruefbar = $true
            ProductCode = $productCode
            Scope = Get-SichererText -Objekt $Programm -Name 'Scope'
            Gruende = $hinweisText
        }
    }

    if ($positiveHinweise -gt 0 -and $fehlerPunkte -eq 0 -and $unklareHinweise.Count -eq 0) {
        return [pscustomobject]@{
            DisplayName = $name
            Status = 'Keine offensichtliche Beschaedigung'
            Beschaedigungsverdacht = $false
            MSIPruefbar = $false
            ProductCode = $productCode
            Scope = Get-SichererText -Objekt $Programm -Name 'Scope'
            Gruende = 'Mindestens eine registrierte Programmdatei oder der Installationsordner ist vorhanden und plausibel.'
        }
    }

    $hinweise = @($gruende.ToArray()) + @($unklareHinweise.ToArray())
    if ($hinweise.Count -eq 0) {
        $hinweise = @('Keine belastbare registrierte Programmdatei und kein MSI-Produktcode vorhanden.')
    }
    return [pscustomobject]@{
        DisplayName = $name
        Status = 'Nicht vollstaendig automatisch pruefbar'
        Beschaedigungsverdacht = $false
        MSIPruefbar = $false
        ProductCode = $productCode
        Scope = Get-SichererText -Objekt $Programm -Name 'Scope'
        Gruende = ($hinweise -join ' | ')
    }
}

function Get-MSIProduktstatus {
    param([Parameter(Mandatory = $true)][string]$ProductCode)

    if ($ProductCode -notmatch '^\{[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}\}$') {
        return -1
    }

    try {
        $installer = New-Object -ComObject WindowsInstaller.Installer -ErrorAction Stop
        try {
            return [int]$installer.ProductState($ProductCode)
        }
        finally {
            try { [Runtime.InteropServices.Marshal]::FinalReleaseComObject($installer) | Out-Null } catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }
        }
    }
    catch {
        return -1
    }
}

function Wait-MSIProduktInstalliert {
    param(
        [Parameter(Mandatory = $true)][string]$ProductCode,
        [ValidateRange(5, 180)][int]$TimeoutSekunden = 30,
        [ValidateRange(1, 15)][int]$IntervallSekunden = 3
    )

    $stoppuhr = [Diagnostics.Stopwatch]::StartNew()
    $status = -1
    try {
        do {
            $status = Get-MSIProduktstatus -ProductCode $ProductCode
            if ($status -eq 5) {
                return [pscustomobject]@{ Bestaetigt = $true; Status = $status; Minuten = [Math]::Round($stoppuhr.Elapsed.TotalMinutes, 2) }
            }
            if ($stoppuhr.Elapsed.TotalSeconds -lt $TimeoutSekunden) {
                Start-Sleep -Seconds $IntervallSekunden
            }
        }
        while ($stoppuhr.Elapsed.TotalSeconds -lt $TimeoutSekunden)
    }
    finally {
        $stoppuhr.Stop()
    }

    return [pscustomobject]@{ Bestaetigt = $false; Status = $status; Minuten = [Math]::Round($stoppuhr.Elapsed.TotalMinutes, 2) }
}

function Test-MSIReparaturSollAusgefuehrtWerden {
    param(
        [bool]$MSIPruefbar,
        [bool]$Beschaedigungsverdacht,
        [bool]$Vollmodus
    )

    return ($MSIPruefbar -and ($Beschaedigungsverdacht -or $Vollmodus))
}

function Invoke-MSIIntegritaetsreparatur {
    param(
        [Parameter(Mandatory = $true)][string]$ProductCode,
        [Parameter(Mandatory = $true)][string]$DisplayName
    )

    if ($ProductCode -notmatch '^\{[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}\}$') {
        return [pscustomobject]@{ Erfolgreich = $false; ExitCode = -1; Ausgabe = 'Ungueltiger MSI-Produktcode.'; Neustart = $false }
    }

    $msiexec = Get-WindowsSystemdateiPfad -Dateiname 'msiexec.exe'
    if ([string]::IsNullOrWhiteSpace($msiexec)) {
        return [pscustomobject]@{ Erfolgreich = $false; ExitCode = -1; Ausgabe = 'msiexec.exe wurde nicht gefunden.'; Neustart = $false }
    }

    $script:MSIPruefungen++
    # /focmus: fehlende/aeltere oder per Pruefsumme abweichende Dateien,
    # Benutzer-/Computer-Registryeintraege und Verknuepfungen reparieren.
    $sichererLogName = ConvertTo-SichererDateiname -Wert $DisplayName -MaximaleLaenge 80
    $msiLog = if (-not [string]::IsNullOrWhiteSpace([string]$script:LogOrdner)) {
        Join-Path -Path $script:LogOrdner -ChildPath ("MSI-Reparatur-{0}-{1}.log" -f $sichererLogName, (Get-Date -Format 'yyyyMMdd-HHmmssfff'))
    }
    else {
        Join-Path -Path ([IO.Path]::GetTempPath()) -ChildPath ("MSI-Reparatur-{0}-{1}.log" -f $sichererLogName, (Get-Date -Format 'yyyyMMdd-HHmmssfff'))
    }
    $argumente = @('/focmus', $ProductCode, '/qn', '/norestart', '/l*v', $msiLog)
    $ergebnis = Invoke-Native -Datei $msiexec -Argumente $argumente -Beschreibung ("MSI-Integritaet pruefen und reparieren: {0}" -f $DisplayName) -TimeoutSekunden 1800 -LeerlaufTimeoutSekunden 900 -InstallationsVorgang -AktivitaetsPfade @($msiLog) -ErfolgsCodes @(0) -NeustartCodes @(1641, 3010) -FehlerNurResultat -AusgabeUnterdruecken

    if ($ergebnis.Erfolgreich) {
        $nachkontrolle = Wait-MSIProduktInstalliert -ProductCode $ProductCode -TimeoutSekunden 30
        $bestaetigt = [bool](Get-SichereEigenschaft -Objekt $nachkontrolle -Name 'Bestaetigt' -Standardwert $false)
        $produktstatus = [int](Get-SichereEigenschaft -Objekt $nachkontrolle -Name 'Status' -Standardwert -1)

        if ($bestaetigt) {
            $script:ErfolgreicheMSIReparaturen++
            $script:NachkontrollierteMSIReparaturen++
            Add-Resultat -Bereich 'Programme' -Aktion ("MSI-Pruefung/Reparatur {0}" -f $DisplayName) -Status $(if ($ergebnis.Neustart) { 'Erfolgreich nachkontrolliert; Neustart erforderlich' } else { 'Erfolgreich nachkontrolliert und abgeschlossen' }) -ExitCode ([int]$ergebnis.ExitCode) -Details ("Produktcode: {0}; Produktstatus: {1}; MSI-Protokoll: {2}" -f $ProductCode, $produktstatus, $msiLog)
        }
        elseif ($ergebnis.Neustart) {
            # Exitcode 1641/3010 bedeutet, dass Windows Installer erfolgreich war,
            # die abschliessende Zustandspruefung aber erst nach dem Neustart belastbar ist.
            $script:ErfolgreicheMSIReparaturen++
            $script:FehlgeschlageneMSINachkontrollen++
            Add-Warnung -Text ("Die MSI-Reparatur fuer '{0}' wurde erfolgreich beendet, die Produktstatus-Nachkontrolle ist jedoch erst nach dem erforderlichen Neustart abschliessend moeglich." -f $DisplayName)
            Add-Resultat -Bereich 'Programme' -Aktion ("MSI-Pruefung/Reparatur {0}" -f $DisplayName) -Status 'Erfolgreich; Neustart und erneute Nachkontrolle erforderlich' -ExitCode ([int]$ergebnis.ExitCode) -Details ("Produktcode: {0}; Produktstatus: {1}; MSI-Protokoll: {2}" -f $ProductCode, $produktstatus, $msiLog)
        }
        else {
            $script:FehlgeschlageneMSIReparaturen++
            $script:FehlgeschlageneMSINachkontrollen++
            $meldung = ("Windows Installer meldete Erfolg, der Produktstatus wurde danach jedoch nicht als vollstaendig installiert bestaetigt (Status {0})." -f $produktstatus)
            Add-Warnung -Text ("MSI-Reparatur fuer '{0}' konnte nicht abschliessend bestaetigt werden: {1}" -f $DisplayName, $meldung)
            Add-Resultat -Bereich 'Programme' -Aktion ("MSI-Pruefung/Reparatur {0}" -f $DisplayName) -Status 'Installer beendet, MSI-Nachkontrolle fehlgeschlagen' -ExitCode ([int]$ergebnis.ExitCode) -Details ("{0} Produktcode: {1}; MSI-Protokoll: {2}" -f $meldung, $ProductCode, $msiLog)
            return [pscustomobject]@{ Erfolgreich = $false; ExitCode = [int]$ergebnis.ExitCode; Ausgabe = $meldung; Neustart = $false; Timeout = $false }
        }
    }
    else {
        $script:FehlgeschlageneMSIReparaturen++
        Add-Resultat -Bereich 'Programme' -Aktion ("MSI-Pruefung/Reparatur {0}" -f $DisplayName) -Status 'Fehlgeschlagen' -ExitCode ([int]$ergebnis.ExitCode) -Details ("MSI-Protokoll: {0}{1}{2}" -f $msiLog, [Environment]::NewLine, [string]$ergebnis.Ausgabe)
    }

    return $ergebnis
}

function Get-WinGetPaketIdAusExakterNamensliste {
    param(
        [AllowNull()][string]$Text,
        [Parameter(Mandatory = $true)][string]$ErwarteterName,
        [Parameter(Mandatory = $true)][ValidateSet('winget', 'msstore')][string]$Quelle
    )

    if ([string]::IsNullOrWhiteSpace($Text) -or [string]::IsNullOrWhiteSpace($ErwarteterName)) { return '' }

    $treffer = New-Object 'System.Collections.Generic.List[string]'
    foreach ($rohZeile in @($Text -split "`r?`n")) {
        $zeile = ([string]$rohZeile).TrimEnd()
        if ([string]::IsNullOrWhiteSpace($zeile)) { continue }
        if (-not $zeile.StartsWith($ErwarteterName, [StringComparison]::OrdinalIgnoreCase)) { continue }
        if ($zeile.Length -le $ErwarteterName.Length) { continue }

        $rest = $zeile.Substring($ErwarteterName.Length)
        if ($rest -notmatch '^\s+(?<Id>[A-Za-z0-9][A-Za-z0-9._+\-]{0,255})\s+(?<Version>\S+)') { continue }
        $id = [string]$Matches['Id']
        if (-not (Test-SichereWinGetPaketIdFuerQuelle -Id $id -Quelle $Quelle)) { continue }
        $quellenTreffer = [regex]::Match($zeile, '(?i)(?<!\S)(?<source>winget|msstore)\s*$')
        if ($quellenTreffer.Success -and
            $quellenTreffer.Groups['source'].Value.Trim().ToLowerInvariant() -ne $Quelle) { continue }
        $treffer.Add($id) | Out-Null
    }

    $eindeutig = @($treffer.ToArray() | Select-Object -Unique)
    if ($eindeutig.Count -eq 1) { return [string]$eindeutig[0] }
    return ''
}

function Get-WinGetZuordnungFuerRegistryProgramm {
    param(
        [Parameter(Mandatory = $true)][string]$WinGet,
        [Parameter(Mandatory = $true)][string]$DisplayName,
        [AllowEmptyString()][string]$Publisher = '',
        [Parameter(Mandatory = $true)][ValidateSet('user', 'machine')][string]$Scope
    )

    if ([string]::IsNullOrWhiteSpace($DisplayName) -or $DisplayName.Length -gt 240 -or $DisplayName -match "[`r`n]") {
        return [pscustomobject]@{ Eindeutig = $false; Id = ''; Scope = $Scope; Details = 'Ungueltiger Programmname.' }
    }
    if ([string]::IsNullOrWhiteSpace($Publisher)) {
        return [pscustomobject]@{ Eindeutig = $false; Id = ''; Scope = $Scope; Details = 'Der installierte Registry-Eintrag besitzt keinen Herausgeber; ein gleicher Programmname allein wird nicht als sichere Online-Identitaet verwendet.' }
    }

    $argumente = @(
        'list', '--name', $DisplayName, '--exact', '--source', 'winget', '--scope', $Scope,
        '--accept-source-agreements', '--disable-interactivity'
    )
    $ergebnis = Invoke-Native -Datei $WinGet -Argumente $argumente -Beschreibung ("WinGet-Zuordnung pruefen: {0}" -f $DisplayName) -TimeoutSekunden 120 -FehlerNurResultat -AusgabeUnterdruecken
    $kategorie = Get-WinGetErgebniskategorie -ExitCode ([int]$ergebnis.ExitCode) -Ausgabe ([string]$ergebnis.Ausgabe)
    if ($kategorie -eq 'KeinePakete') {
        return [pscustomobject]@{ Eindeutig = $false; Id = ''; Scope = $Scope; Details = 'Kein exakter WinGet-Treffer.' }
    }
    if (-not $ergebnis.Erfolgreich) {
        return [pscustomobject]@{ Eindeutig = $false; Id = ''; Scope = $Scope; Details = ("WinGet-Listenabfrage fehlgeschlagen: {0}" -f [int]$ergebnis.ExitCode) }
    }

    $id = Get-WinGetPaketIdAusExakterNamensliste -Text ([string]$ergebnis.Ausgabe) -ErwarteterName $DisplayName -Quelle 'winget'
    if ([string]::IsNullOrWhiteSpace($id)) {
        return [pscustomobject]@{ Eindeutig = $false; Id = ''; Scope = $Scope; Details = 'Der exakte Name konnte keiner eindeutigen Paket-ID zugeordnet werden.' }
    }

    $manifest = Invoke-Native -Datei $WinGet -Argumente @(
        'show', '--id', $id, '--exact', '--source', 'winget',
        '--accept-source-agreements', '--disable-interactivity'
    ) -Beschreibung ("WinGet-Herausgeberidentitaet pruefen: {0}" -f $id) -TimeoutSekunden 120 -FehlerNurResultat -AusgabeUnterdruecken
    if (-not $manifest.Erfolgreich) {
        return [pscustomobject]@{ Eindeutig = $false; Id = ''; Scope = $Scope; Details = ("Die Manifest-Herausgeberidentitaet konnte nicht gelesen werden (Exitcode {0})." -f [int]$manifest.ExitCode) }
    }
    $herausgeberTreffer = [regex]::Matches([string]$manifest.Ausgabe, '(?im)^\s*(?:Publisher|Herausgeber)\s*:\s*(?<publisher>[^\r\n]+?)\s*$')
    $manifestHerausgeber = @($herausgeberTreffer | ForEach-Object { $_.Groups['publisher'].Value.Trim() } | Where-Object { -not [string]::IsNullOrWhiteSpace($_) } | Select-Object -Unique)
    if ($manifestHerausgeber.Count -ne 1 -or
        -not (Test-HerausgeberIdentitaetUebereinstimmung -InstallierterHerausgeber $Publisher -ManifestHerausgeber $manifestHerausgeber[0])) {
        return [pscustomobject]@{
            Eindeutig = $false
            Id = ''
            Scope = $Scope
            Details = ("Exakter Name gefunden, aber der Herausgeber ist nicht eindeutig identisch. Installiert: '{0}'; Manifest: '{1}'." -f $Publisher, $(if ($manifestHerausgeber.Count -eq 1) { $manifestHerausgeber[0] } else { 'nicht eindeutig lesbar' }))
        }
    }

    $methodenMatrix = Get-SichereProgrammMethodenMatrix -Typ 'RegistryOnline' -Id $id -Quelle 'winget' -Scope $Scope -DisplayName $DisplayName -Publisher $Publisher -HerausgeberBestaetigt $true
    if (-not [bool]$methodenMatrix.OnlineAktionFreigegeben) {
        return [pscustomobject]@{ Eindeutig = $false; Id = ''; Scope = $Scope; Details = ('Die zentrale Methoden-Matrix hat die Online-Zuordnung abgelehnt: {0}' -f $methodenMatrix.Details) }
    }

    return [pscustomobject]@{ Eindeutig = $true; Id = $id; Quelle = 'winget'; Scope = $Scope; ManifestHerausgeber = $manifestHerausgeber[0]; Details = ('Eindeutige Zuordnung ueber exakten Programmnamen, identischen Herausgeber, Paket-ID, Quelle und Scope. {0}' -f $methodenMatrix.Details) }
}

function Get-WinGetZuordnungFuerRegistryProgrammPaketIsoliert {
    param(
        [Parameter(Mandatory = $true)][string]$WinGet,
        [Parameter(Mandatory = $true)][string]$DisplayName,
        [AllowEmptyString()][string]$Publisher = '',
        [Parameter(Mandatory = $true)][ValidateSet('user', 'machine')][string]$Scope
    )

    try {
        return Get-WinGetZuordnungFuerRegistryProgramm -WinGet $WinGet -DisplayName $DisplayName -Publisher $Publisher -Scope $Scope
    }
    catch {
        Add-Warnung -Text ("Die sichere WinGet-Zuordnung fuer das Registry-Programm '{0}' wurde nach einer paketbezogenen Ausnahme isoliert; weitere Programme werden geprueft: {1}" -f $DisplayName, $_.Exception.Message)
        return [pscustomobject]@{ Eindeutig = $false; Id = ''; Scope = $Scope; Details = ('Paketbezogene Zuordnungsausnahme isoliert: {0}' -f $_.Exception.Message) }
    }
}

function Test-UndRepariereAlleRegistryProgramme {
    param(
        [AllowEmptyString()][string]$WinGet = '',
        [Parameter(Mandatory = $true)][string]$RegistryInventarPfad,
        [bool]$WingetQuelleVerifiziert = $false,
        [bool]$MSIVollreparatur = $false
    )

    if (-not (Test-Path -LiteralPath $RegistryInventarPfad -PathType Leaf)) {
        Add-Warnung -Text 'Die Integritaetspruefung aller installierten Programme wurde ausgelassen, weil das Registry-Inventar fehlt.'
        return
    }

    $programme = @(Import-Csv -LiteralPath $RegistryInventarPfad -Encoding UTF8 -ErrorAction Stop)
    if ($programme.Count -eq 0) {
        Add-Warnung -Text 'Das Registry-Inventar enthaelt keine Programme.'
        return
    }

    $msiModusText = if ($MSIVollreparatur) {
        'MSI-Vollreparatur ist aktiviert; alle geeigneten MSI-Pakete werden geprueft.'
    }
    else {
        'MSI-Pakete werden nur bei belastbarem Beschaedigungsverdacht repariert.'
    }
    Write-Status -Text ("Alle registrierten Programme werden geprueft. {0}" -f $msiModusText) -Stufe 'SCHRITT'

    $fallbackVerfuegbar = $false
    $listHilfeText = ''
    $downloadHilfeText = ''
    $installHilfeText = ''
    if ($WingetQuelleVerifiziert -and -not [string]::IsNullOrWhiteSpace($WinGet)) {
        $listHilfe = Invoke-Native -Datei $WinGet -Argumente @('list', '--help') -Beschreibung 'WinGet-Listenoptionen fuer Registry-Zuordnung pruefen' -TimeoutSekunden 60 -FehlerNurResultat -AusgabeUnterdruecken
        $downloadHilfe = Invoke-Native -Datei $WinGet -Argumente @('download', '--help') -Beschreibung 'WinGet-Downloadoptionen fuer Registry-Fallback pruefen' -TimeoutSekunden 60 -FehlerNurResultat -AusgabeUnterdruecken
        $installHilfe = Invoke-Native -Datei $WinGet -Argumente @('install', '--help') -Beschreibung 'WinGet-Installationsoptionen fuer Registry-Fallback pruefen' -TimeoutSekunden 60 -FehlerNurResultat -AusgabeUnterdruecken
        if ($listHilfe.Erfolgreich -and $downloadHilfe.Erfolgreich -and $installHilfe.Erfolgreich) {
            $listHilfeText = [string]$listHilfe.Ausgabe
            $downloadHilfeText = [string]$downloadHilfe.Ausgabe
            $installHilfeText = [string]$installHilfe.Ausgabe
            try {
                $null = New-WinGetListArgumente -Id 'Hersteller.Pruefpaket' -Quelle 'winget' -Scope 'user' -HilfeText $listHilfeText
                $null = New-WinGetDownloadArgumente -Id 'Hersteller.Pruefpaket' -ZielOrdner $script:InstallationsOrdner -Scope 'user' -HilfeText $downloadHilfeText
                $null = New-WinGetNeuinstallationsArgumente -Id 'Hersteller.Pruefpaket' -Quelle 'winget' -Scope 'user' -HilfeText $installHilfeText
                $fallbackVerfuegbar = $true
            }
            catch {
                $fallbackVerfuegbar = $false
                Add-Warnung -Text ("Der abgesicherte WinGet-Neuinstallationsfallback fuer Registry-Programme ist nicht verfuegbar: {0}" -f $_.Exception.Message)
            }
        }
    }

    $berichte = New-Object 'System.Collections.Generic.List[object]'
    $verarbeiteteProductCodes = [System.Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
    $productCodeErgebnisse = [System.Collections.Generic.Dictionary[string, bool]]::new([StringComparer]::OrdinalIgnoreCase)
    $index = 0

    foreach ($programm in $programme) {
        $index++
        $script:GepruefteRegistryProgramme++
        $script:RegistryRoutenGesamt++
        $script:RegistryPruefungenAusgefuehrt++
        $name = Get-SichererText -Objekt $programm -Name 'DisplayName'
        $publisher = Get-SichererText -Objekt $programm -Name 'Publisher'
        $scope = Get-SichererText -Objekt $programm -Name 'Scope' -Standardwert 'machine'
        if ($scope -notin @('user', 'machine')) { $scope = 'machine' }
        $registryMethodenMatrix = Get-SichereProgrammMethodenMatrix -Typ 'Registry' -DisplayName $name -Publisher $publisher -Scope $scope -ProductCode (Get-SichererText -Objekt $programm -Name 'ProductCode')
        $unbehobenVorher = $script:UnbehobeneProgrammfehler
        $doppelterProductCode = $false

        $anteil = $index / [double]$programme.Count
        $prozent = 65 + [int][Math]::Floor($anteil * 6)
        $kategorieProzent = [int][Math]::Floor($anteil * 100)
        Set-Gesamtfortschritt -Prozent $prozent -Status ("Programm-Integritaetspruefung {0}/{1}: {2}" -f $index, $programme.Count, $name) -Kategorie 'Programmintegritaet' -KategorieProzent $kategorieProzent

        if (-not [bool]$registryMethodenMatrix.KontextGueltig) {
            $script:NichtVollstaendigPruefbareProgramme++
            $script:ProgrammeMitManuellerPruefung++
            $script:RegistryManuelleRouten++
            Add-Warnung -Text ("Der Registry-Programmeintrag '{0}' besitzt keine eindeutige, von der zentralen Methoden-Matrix freigegebene Identitaet. Nur dieser Eintrag wird ausgelassen; die Pruefung laeuft weiter." -f $name)
            $berichte.Add([pscustomobject]@{
                DisplayName = $name
                DisplayVersion = Get-SichererText -Objekt $programm -Name 'DisplayVersion'
                Publisher = $publisher
                Scope = $scope
                ProductCode = Get-SichererText -Objekt $programm -Name 'ProductCode'
                MethodenMatrix = $registryMethodenMatrix.Details
                Pruefstatus = 'Identitaetskontext nicht eindeutig'
                Pruefdetails = $registryMethodenMatrix.Details
                Reparaturpfad = 'Manuelle Herstellerpruefung'
                PruefungAusgefuehrt = $false
                AutomatischeAktionAusgefuehrt = $false
                ManuellePruefungErforderlich = $true
                Aktion = 'Unsicheren Programmeintrag isoliert; weitere Programme werden geprueft'
                AktionErfolgreich = $false
                UnaufgeloesterBeschaedigungsverdacht = $false
                RegistryPfad = Get-SichererText -Objekt $programm -Name 'RegistryPfad'
            }) | Out-Null
            continue
        }

        try {
            $pruefung = Test-RegistryProgrammIntegritaet -Programm $programm
        }
        catch {
            $script:NichtVollstaendigPruefbareProgramme++
            $script:ProgrammeMitManuellerPruefung++
            $script:RegistryManuelleRouten++
            Add-Warnung -Text ("Die Integritaetspruefung des Registry-Programms '{0}' wurde nach einer paketbezogenen Ausnahme isoliert; alle weiteren Programme werden geprueft: {1}" -f $name, $_.Exception.Message)
            $berichte.Add([pscustomobject]@{
                DisplayName = $name
                DisplayVersion = Get-SichererText -Objekt $programm -Name 'DisplayVersion'
                Publisher = $publisher
                Scope = $scope
                ProductCode = Get-SichererText -Objekt $programm -Name 'ProductCode'
                MethodenMatrix = $registryMethodenMatrix.Details
                Pruefstatus = 'Paketbezogene Ausnahme isoliert'
                Pruefdetails = ($_ | Out-String)
                Reparaturpfad = 'Manuelle Herstellerpruefung'
                PruefungAusgefuehrt = $false
                AutomatischeAktionAusgefuehrt = $false
                ManuellePruefungErforderlich = $true
                Aktion = 'Registry-Programmeintrag isoliert; weitere Programme werden geprueft'
                AktionErfolgreich = $false
                UnaufgeloesterBeschaedigungsverdacht = $false
                RegistryPfad = Get-SichererText -Objekt $programm -Name 'RegistryPfad'
            }) | Out-Null
            continue
        }
        $status = Get-SichererText -Objekt $pruefung -Name 'Status'
        $gruende = Get-SichererText -Objekt $pruefung -Name 'Gruende'
        $beschaedigt = [bool](Get-SichereEigenschaft -Objekt $pruefung -Name 'Beschaedigungsverdacht' -Standardwert $false)
        $msiPruefbar = [bool](Get-SichereEigenschaft -Objekt $pruefung -Name 'MSIPruefbar' -Standardwert $false)
        $productCode = Get-SichererText -Objekt $pruefung -Name 'ProductCode'
        $msiMethodenMatrix = Get-SichereProgrammMethodenMatrix -Typ 'MSI' -DisplayName $name -Publisher $publisher -Scope $scope -ProductCode $productCode
        $msiSollRepariertWerden = Test-MSIReparaturSollAusgefuehrtWerden -MSIPruefbar $msiPruefbar -Beschaedigungsverdacht $beschaedigt -Vollmodus $MSIVollreparatur
        $aktion = 'Keine automatische Aktion erforderlich'
        $reparaturpfad = 'Integritaetspruefung'
        $automatischeAktionAusgefuehrt = $false
        $manuellePruefungErforderlich = $false
        $aktionsErfolg = $true
        if ($beschaedigt) { $script:ProgrammeMitBeschaedigungsverdacht++ }
        $istDoppelterMsiEintrag = ($msiSollRepariertWerden -and -not [string]::IsNullOrWhiteSpace($productCode) -and $verarbeiteteProductCodes.Contains($productCode))

        if ($istDoppelterMsiEintrag) {
            $doppelterProductCode = $true
            $aktionsErfolg = if ($productCodeErgebnisse.ContainsKey($productCode)) { [bool]$productCodeErgebnisse[$productCode] } else { $false }
            $aktion = if ($aktionsErfolg) {
                'Doppelter Registry-Eintrag; derselbe MSI-Produktcode wurde bereits erfolgreich geprueft'
            }
            else {
                'Doppelter Registry-Eintrag; die vorherige Reparatur oder manuelle Route desselben MSI-Produktcodes war nicht erfolgreich'
            }
            $reparaturpfad = 'Bereits ueber identischen MSI-Produktcode abgedeckt'
        }
        elseif ($status -eq 'Sicherheitskritisch oder Systemkomponente') {
            $script:SicherAusgeschlosseneRegistryProgramme++
            $aktion = 'Aus Sicherheitsgruenden nur inventarisiert'
            $reparaturpfad = 'Sicherheitsausnahme'
            if ($beschaedigt) {
                $aktionsErfolg = $false
                $manuellePruefungErforderlich = $true
                $script:ProgrammeMitManuellerPruefung++
                $script:RegistryManuelleRouten++
                $aktion = 'Beschaedigungsverdacht bei sicherheitskritischer Software oder Systemkomponente; keine riskante automatische Programminstallation, manuelle beziehungsweise Windows-Systempruefung erforderlich'
                $reparaturpfad = 'Sicherheitsausnahme; manuelle oder Windows-Systempruefung'
            }
        }
        elseif ($msiSollRepariertWerden -and (Test-RegistryWahr -Wert (Get-SichereEigenschaft -Objekt $programm -Name 'NoRepair' -Standardwert 0))) {
            $script:ProgrammeMitManuellerPruefung++
            $aktionsErfolg = $false
            $aktion = 'Der Hersteller hat die automatische Reparatur fuer diesen MSI-Eintrag deaktiviert; manuelle Herstellerpruefung erforderlich'
            $reparaturpfad = 'Manuelle Herstellerpruefung'
            $manuellePruefungErforderlich = $true
            $script:RegistryManuelleRouten++
        }
        elseif ($msiSollRepariertWerden -and -not [bool]$msiMethodenMatrix.LokaleReparaturFreigegeben) {
            $script:ProgrammeMitManuellerPruefung++
            $aktionsErfolg = $false
            $aktion = 'MSI-Eintrag ohne von der zentralen Methoden-Matrix freigegebenen Produktcode; manuelle Herstellerpruefung erforderlich'
            $reparaturpfad = 'Manuelle Herstellerpruefung'
            $manuellePruefungErforderlich = $true
            $script:RegistryManuelleRouten++
        }
        elseif ($msiSollRepariertWerden) {
            $automatischeAktionAusgefuehrt = $true
            $script:RegistryAutomatischeAktionen++
            $reparaturpfad = 'MSI-Reparatur'
            try {
                $msiErgebnis = Invoke-MSIIntegritaetsreparatur -ProductCode $productCode -DisplayName $name
            }
            catch {
                $msiErgebnis = [pscustomobject]@{ Erfolgreich = $false; ExitCode = -1; Ausgabe = ($_ | Out-String) }
                Add-Warnung -Text ("Die MSI-Reparatur fuer '{0}' wurde nach einer paketbezogenen Ausnahme isoliert; ein eindeutig verifizierter Fallback wird geprueft und danach mit dem naechsten Programm fortgesetzt: {1}" -f $name, $_.Exception.Message)
            }
            if ($msiErgebnis.Erfolgreich) {
                $aktion = 'MSI-Integritaet geprueft und erforderliche Reparaturen ausgefuehrt'
                $aktionsErfolg = $true
                $null = Ensure-DesktopVerknuepfungFuerProgramm -Id $name -Anzeigename $name -Scope $scope -Quelle 'msi' -FehlerIstFatal:$false
            }
            else {
                $aktion = 'MSI-Reparatur fehlgeschlagen'
                $aktionsErfolg = $false
                if ($fallbackVerfuegbar) {
                    $zuordnung = Get-WinGetZuordnungFuerRegistryProgrammPaketIsoliert -WinGet $WinGet -DisplayName $name -Publisher $publisher -Scope $scope
                    if ([bool](Get-SichereEigenschaft -Objekt $zuordnung -Name 'Eindeutig' -Standardwert $false)) {
                        $id = Get-SichererText -Objekt $zuordnung -Name 'Id'
                        $reparaturpfad = 'MSI-Reparatur -> WinGet-Neuinstallation'
                        $aktionsErfolg = Invoke-DownloadUndNeuinstallationPaketIsoliert -WinGet $WinGet -Id $id -Quelle 'winget' -UrspruenglicherScope $scope -ListHilfeText $listHilfeText -DownloadHilfeText $downloadHilfeText -InstallHilfeText $installHilfeText -ReparaturExitCode ([int]$msiErgebnis.ExitCode) -ReparaturAusgabe ([string]$msiErgebnis.Ausgabe)
                        if ($aktionsErfolg) { $null = Ensure-DesktopVerknuepfungFuerProgramm -Id $id -Anzeigename $name -Scope $scope -Quelle 'winget' -FehlerIstFatal:$false }
                        $aktion = if ($aktionsErfolg) { 'MSI-Reparatur fehlgeschlagen; ueber WinGet neu installiert' } else { 'MSI-Reparatur und WinGet-Neuinstallation fehlgeschlagen' }
                    }
                    else {
                        $script:ProgrammeMitManuellerPruefung++
                        $aktion = 'MSI-Reparatur fehlgeschlagen; keine eindeutige WinGet-Zuordnung, manuelle Herstellerpruefung erforderlich'
                        $manuellePruefungErforderlich = $true
                        $script:RegistryManuelleRouten++
                    }
                }
                else {
                    $script:ProgrammeMitManuellerPruefung++
                    $aktion = 'MSI-Reparatur fehlgeschlagen; kein sicherer automatischer Downloadweg, manuelle Herstellerpruefung erforderlich'
                    $manuellePruefungErforderlich = $true
                    $script:RegistryManuelleRouten++
                }
            }
        }
        elseif ($msiPruefbar) {
            $script:MSIOhneReparaturbedarf++
            $aktion = 'MSI-Paket erkannt; kein belastbarer Beschaedigungsverdacht, daher keine invasive Reparatur ausgefuehrt'
            $reparaturpfad = 'MSI-Pruefung; keine Reparatur erforderlich'
            $aktionsErfolg = $true
        }
        elseif ($beschaedigt) {
            $aktionsErfolg = $false
            if ($fallbackVerfuegbar) {
                $zuordnung = Get-WinGetZuordnungFuerRegistryProgrammPaketIsoliert -WinGet $WinGet -DisplayName $name -Publisher $publisher -Scope $scope
                if ([bool](Get-SichereEigenschaft -Objekt $zuordnung -Name 'Eindeutig' -Standardwert $false)) {
                    $id = Get-SichererText -Objekt $zuordnung -Name 'Id'
                    $automatischeAktionAusgefuehrt = $true
                    $script:RegistryAutomatischeAktionen++
                    $reparaturpfad = 'WinGet-Neuinstallation'
                    $aktionsErfolg = Invoke-DownloadUndNeuinstallationPaketIsoliert -WinGet $WinGet -Id $id -Quelle 'winget' -UrspruenglicherScope $scope -ListHilfeText $listHilfeText -DownloadHilfeText $downloadHilfeText -InstallHilfeText $installHilfeText -ReparaturExitCode -1 -ReparaturAusgabe $gruende
                    if ($aktionsErfolg) { $null = Ensure-DesktopVerknuepfungFuerProgramm -Id $id -Anzeigename $name -Scope $scope -Quelle 'winget' -FehlerIstFatal:$false }
                    $aktion = if ($aktionsErfolg) { 'Beschaedigungsverdacht; ueber WinGet neu installiert' } else { 'Beschaedigungsverdacht; Neuinstallation fehlgeschlagen' }
                }
                else {
                    $script:ProgrammeMitManuellerPruefung++
                    $aktion = 'Beschaedigungsverdacht; keine eindeutige WinGet-Zuordnung, manuelle Herstellerpruefung erforderlich'
                    $reparaturpfad = 'Manuelle Herstellerpruefung'
                    $manuellePruefungErforderlich = $true
                    $script:RegistryManuelleRouten++
                }
            }
            else {
                $script:ProgrammeMitManuellerPruefung++
                $aktion = 'Beschaedigungsverdacht; kein sicherer Download- und Neuinstallationsweg, manuelle Herstellerpruefung erforderlich'
                $reparaturpfad = 'Manuelle Herstellerpruefung'
                $manuellePruefungErforderlich = $true
                $script:RegistryManuelleRouten++
            }
        }
        elseif ($status -eq 'Nicht vollstaendig automatisch pruefbar') {
            $script:NichtVollstaendigPruefbareProgramme++
            $aktion = 'Inventarisiert; ohne Herstellerdiagnose nicht vollstaendig automatisch pruefbar'
            $reparaturpfad = 'Manuelle Herstellerdiagnose'
            $manuellePruefungErforderlich = $true
            $script:RegistryManuelleRouten++
        }

        if ($reparaturpfad -eq 'Integritaetspruefung' -and $status -eq 'Keine offensichtliche Beschaedigung') {
            $reparaturpfad = 'Integritaetspruefung; keine Reparatur erforderlich'
        }

        if ($msiSollRepariertWerden -and -not [string]::IsNullOrWhiteSpace($productCode) -and -not $doppelterProductCode) {
            [void]$verarbeiteteProductCodes.Add($productCode)
            $productCodeErgebnisse[$productCode] = [bool]$aktionsErfolg
        }

        $unaufgeloest = ($beschaedigt -and -not $aktionsErfolg)
        if ($unaufgeloest -and -not $doppelterProductCode) {
            $script:UnaufgeloesteRegistryProgramme++
            if ($script:UnbehobeneProgrammfehler -eq $unbehobenVorher) {
                $script:UnbehobeneProgrammfehler++
            }
            Add-Warnung -Text ("Das beschaedigte Programm '{0}' konnte nicht automatisch vollstaendig repariert werden. Route: {1}. Aktion: {2}." -f $name, $reparaturpfad, $aktion)
        }

        $berichte.Add([pscustomobject]@{
            DisplayName = $name
            DisplayVersion = Get-SichererText -Objekt $programm -Name 'DisplayVersion'
            Publisher = $publisher
            Scope = $scope
            ProductCode = $productCode
            MethodenMatrix = ("{0}; MSI-Route: {1}" -f $registryMethodenMatrix.Details, $msiMethodenMatrix.Details)
            Pruefstatus = $status
            Pruefdetails = $gruende
            Reparaturpfad = $reparaturpfad
            PruefungAusgefuehrt = $true
            AutomatischeAktionAusgefuehrt = $automatischeAktionAusgefuehrt
            ManuellePruefungErforderlich = $manuellePruefungErforderlich
            Aktion = $aktion
            AktionErfolgreich = $aktionsErfolg
            UnaufgeloesterBeschaedigungsverdacht = $unaufgeloest
            RegistryPfad = Get-SichererText -Objekt $programm -Name 'RegistryPfad'
        }) | Out-Null
        if ($script:NeustartErforderlich) {
            Add-Resultat -Bereich 'Programme' -Aktion ("Registry-Prueffolge nach {0} pausieren" -f $name) -Status 'Keine weiteren Programme vor dem erforderlichen Neustart verarbeitet' -ExitCode 3010 -Details ("Route: {0}; Aktion: {1}" -f $reparaturpfad, $aktion)
            Write-Status -Text ("Die Registry- und MSI-Prueffolge wird unmittelbar nach der Neustartanforderung von '{0}' pausiert." -f $name) -Stufe 'INFO'
            break
        }
    }

    if ($script:NeustartErforderlich) {
        $teilziel = Join-Path -Path $script:LogOrdner -ChildPath ('Programm-Integritaetspruefung-Teilbericht-vor-Neustart-' + (Get-Date -Format 'yyyyMMdd-HHmmss') + '.csv')
        $berichte.ToArray() | Export-Csv -LiteralPath $teilziel -NoTypeInformation -Encoding UTF8
        Add-Resultat -Bereich 'Programme' -Aktion 'Alle Registry-Programme pruefen' -Status 'Kontrolliert fuer Neustart pausiert' -ExitCode 3010 -Details ("Bis zur Pause geprueft: {0}/{1}; Teilbericht: {2}" -f $berichte.Count, $programme.Count, $teilziel)
        return
    }

    if ($berichte.Count -ne $programme.Count) {
        throw ("Die Programm-Routenabdeckung ist unvollstaendig: {0} Programme inventarisiert, aber {1} Routen protokolliert." -f $programme.Count, $berichte.Count)
    }

    $ziel = Join-Path -Path $script:LogOrdner -ChildPath ('Programm-Integritaetspruefung-' + (Get-Date -Format 'yyyyMMdd-HHmmss') + '.csv')
    $berichte.ToArray() | Export-Csv -LiteralPath $ziel -NoTypeInformation -Encoding UTF8
    $routenStatus = if ($script:UnaufgeloesteRegistryProgramme -gt 0) { 'Mit unaufgeloesten Beschaedigungen abgeschlossen' } else { 'Abgeschlossen' }
    $routenExitCode = if ($script:UnaufgeloesteRegistryProgramme -gt 0) { 2 } else { 0 }
    Add-Resultat -Bereich 'Programme' -Aktion 'Alle Registry-Programme pruefen' -Status $routenStatus -ExitCode $routenExitCode -Details ("Geprueft: {0}; MSI-Reparaturen: {1}; MSI ohne Reparaturbedarf: {2}; MSI-Vollmodus: {3}; Beschaedigungsverdacht: {4}; unaufgeloeste Beschaedigungen: {5}; nicht vollstaendig pruefbar: {6}; Registry-Routen: {7}/{8}; automatische Aktionen: {9}; manuelle Routen: {10}; Bericht: {11}" -f $script:GepruefteRegistryProgramme, $script:MSIPruefungen, $script:MSIOhneReparaturbedarf, $MSIVollreparatur, $script:ProgrammeMitBeschaedigungsverdacht, $script:UnaufgeloesteRegistryProgramme, $script:NichtVollstaendigPruefbareProgramme, $berichte.Count, $programme.Count, $script:RegistryAutomatischeAktionen, $script:RegistryManuelleRouten, $ziel)
    $abschlussStufe = if ($script:UnaufgeloesteRegistryProgramme -gt 0) { 'WARNUNG' } else { 'OK' }
    Write-Status -Text ("Integritaetspruefung aller registrierten Programme abgeschlossen. Bericht: {0}" -f $ziel) -Stufe $abschlussStufe
}

function Repair-InstallierteProgramme {
    param(
        [Parameter(Mandatory = $true)][string]$WinGet,
        [Parameter(Mandatory = $true)][ValidateNotNullOrEmpty()][string[]]$InventarPfade,
        [Parameter(Mandatory = $false)][ValidateNotNullOrEmpty()][ValidateSet('user', 'machine')][string[]]$Scopes = @('user', 'machine')
    )

    Write-Status -Text 'Von WinGet unterstuetzte Programmreparaturen werden im eindeutig ermittelten Installationskontext ausgefuehrt. Dokumentierte Reparaturfehler erhalten anschliessend einen abgesicherten Download- und Neuinstallationsversuch im gleichen Kontext.' -Stufe 'SCHRITT'

    $hilfe = Invoke-Native -Datei $WinGet -Argumente @('repair', '--help') -Beschreibung 'WinGet-Reparaturfunktion pruefen' -TimeoutSekunden 60 -FehlerNurResultat -AusgabeUnterdruecken
    if (-not $hilfe.Erfolgreich) {
        Add-Warnung -Text 'Diese WinGet-Version stellt keine nutzbare Reparaturfunktion bereit. Ohne einen konkreten fehlgeschlagenen Einzelreparaturversuch wird aus Sicherheitsgruenden keine Massen-Neuinstallation gestartet.'
        return
    }

    $listHilfe = Invoke-Native -Datei $WinGet -Argumente @('list', '--help') -Beschreibung 'WinGet-Listenfunktion fuer Scope-Pruefung pruefen' -TimeoutSekunden 60 -FehlerNurResultat -AusgabeUnterdruecken
    if (-not $listHilfe.Erfolgreich) {
        Add-Warnung -Text 'Der urspruengliche Installationskontext kann mit dieser WinGet-Version nicht sicher ermittelt werden. Programmreparaturen und Neuinstallationen wurden ausgelassen.'
        return
    }
    $downloadHilfe = Invoke-Native -Datei $WinGet -Argumente @('download', '--help') -Beschreibung 'WinGet-Downloadfunktion pruefen' -TimeoutSekunden 60 -FehlerNurResultat -AusgabeUnterdruecken
    $installHilfe = Invoke-Native -Datei $WinGet -Argumente @('install', '--help') -Beschreibung 'WinGet-Installationsfunktion pruefen' -TimeoutSekunden 60 -FehlerNurResultat -AusgabeUnterdruecken

    $hilfeText = [string]$hilfe.Ausgabe
    $listHilfeText = [string]$listHilfe.Ausgabe
    $downloadHilfeText = [string]$downloadHilfe.Ausgabe
    $installHilfeText = [string]$installHilfe.Ausgabe
    $communityFallbackVerfuegbar = $false
    $storeFallbackVerfuegbar = $false

    try {
        $null = New-WinGetListArgumente -Id 'Hersteller.Pruefpaket' -Quelle 'winget' -Scope 'user' -HilfeText $listHilfeText
        $null = New-WinGetReparaturArgumente -Id 'Hersteller.Pruefpaket' -Quelle 'winget' -Scope 'user' -HilfeText $hilfeText
        $null = New-WinGetReparaturArgumente -Id '9NABCDEFG1234' -Quelle 'msstore' -Scope 'user' -HilfeText $hilfeText
    }
    catch {
        Add-Warnung -Text ("Die installierte WinGet-Version stellt keine vollstaendig unbeaufsichtigte und sicher scopegebundene Reparaturfunktion bereit: {0}. WinGet-Paketreparaturen wurden ausgelassen." -f $_.Exception.Message)
        return
    }

    if ($downloadHilfe.Erfolgreich -and $installHilfe.Erfolgreich) {
        try {
            $null = New-WinGetDownloadArgumente -Id 'Hersteller.Pruefpaket' -ZielOrdner $script:InstallationsOrdner -Scope 'user' -HilfeText $downloadHilfeText
            $null = New-WinGetNeuinstallationsArgumente -Id 'Hersteller.Pruefpaket' -Quelle 'winget' -Scope 'user' -HilfeText $installHilfeText
            $communityFallbackVerfuegbar = $true
        }
        catch {
            Add-Warnung -Text ("Der Download- und Neuinstallationsfallback fuer WinGet-Communitypakete ist nicht verfuegbar: {0}" -f $_.Exception.Message)
        }
    }
    else {
        Add-Warnung -Text 'WinGet stellt nicht alle benoetigten Download- und Installationsfunktionen fuer Communitypakete bereit. Reparaturen werden trotzdem versucht.'
    }

    if ($installHilfe.Erfolgreich) {
        try {
            $null = New-WinGetNeuinstallationsArgumente -Id '9NABCDEFG1234' -Quelle 'msstore' -Scope 'user' -HilfeText $installHilfeText
            $storeFallbackVerfuegbar = $true
        }
        catch {
            Add-Warnung -Text ("Der Online-Neuinstallationsfallback fuer Microsoft-Store-Pakete ist nicht verfuegbar: {0}" -f $_.Exception.Message)
        }
    }

    $paketGrundlage = New-Object 'System.Collections.Generic.List[object]'
    foreach ($inventarPfad in $InventarPfade) {
        if ([string]::IsNullOrWhiteSpace($inventarPfad) -or -not (Test-Path -LiteralPath $inventarPfad -PathType Leaf)) { continue }
        foreach ($inventarPaket in @(Get-ReparaturPakete -InventarPfad $inventarPfad)) {
            if ($null -ne $inventarPaket) { $paketGrundlage.Add($inventarPaket) | Out-Null }
        }
    }
    $grundPakete = @($paketGrundlage.ToArray() | Sort-Object Id, Quelle -Unique)
    $paketKontexte = New-Object 'System.Collections.Generic.List[object]'
    foreach ($grundPaket in $grundPakete) {
        $grundId = Get-SichererText -Objekt $grundPaket -Name 'Id'
        $grundQuelle = Get-SichererText -Objekt $grundPaket -Name 'Quelle'
        if ([string]::IsNullOrWhiteSpace($grundId) -or $grundQuelle -notin @('winget', 'msstore')) { continue }
        if (Test-PaketAusgeschlossen -Id $grundId) {
            $script:WinGetReparaturRoutenGesamt++
            $script:WinGetReparaturRoutenAusgelassen++
            Add-Resultat -Bereich 'Programme' -Aktion ("Reparaturrouten-Pruefung $grundId") -Status 'Windows- oder sicherheitskritische Komponente; durch zustaendigen Wartungsweg geprueft' -ExitCode 0 -Details ("Quelle: {0}; generische WinGet-Reparatur absichtlich ausgeschlossen." -f $grundQuelle)
            Write-Status -Text ("Systemkomponente oder laufende Voraussetzung wird nicht generisch repariert: {0}" -f $grundId) -Stufe 'INFO'
            continue
        }
        $scopeGefunden = $false
        $scopePruefungUneindeutig = $false
        $mehrfachInstallationGefunden = $false
        foreach ($scopeKandidat in $Scopes) {
            $scopeStatus = Get-WinGetPaketStatusImScope -WinGet $WinGet -Id $grundId -Quelle $grundQuelle -Scope $scopeKandidat -ListHilfeText $listHilfeText
            if ([bool](Get-SichereEigenschaft -Objekt $scopeStatus -Name 'Eindeutig' -Standardwert $false) -and
                [bool](Get-SichereEigenschaft -Objekt $scopeStatus -Name 'Installiert' -Standardwert $false)) {
                $scopeGefunden = $true
                $paketKontexte.Add([pscustomobject]@{ Id = $grundId; Quelle = $grundQuelle; Scope = $scopeKandidat }) | Out-Null
            }
            elseif (-not [bool](Get-SichereEigenschaft -Objekt $scopeStatus -Name 'Eindeutig' -Standardwert $false) -and
                [bool](Get-SichereEigenschaft -Objekt $scopeStatus -Name 'Installiert' -Standardwert $false) -and
                [int](Get-SichereEigenschaft -Objekt $scopeStatus -Name 'Treffer' -Standardwert -1) -gt 1) {
                $mehrfachInstallationGefunden = $true
                $script:WinGetReparaturRoutenGesamt++
                $script:WinGetReparaturRoutenAusgelassen++
                $versionen = @(Get-SichereEigenschaft -Objekt $scopeStatus -Name 'Versionen' -Standardwert @())
                $mehrfachDetails = ("Scope: {0}; Treffer: {1}; Versionen: {2}; {3}" -f $scopeKandidat, [int](Get-SichereEigenschaft -Objekt $scopeStatus -Name 'Treffer' -Standardwert -1), $(if ($versionen.Count -gt 0) { $versionen -join ', ' } else { 'nicht lesbar' }), (Get-SichererText -Objekt $scopeStatus -Name 'Details'))
                Add-Resultat -Bereich 'Programme' -Aktion ("Reparaturrouten-Pruefung {0}/{1}" -f $grundId, $scopeKandidat) -Status 'Mehrere getrennte Installationen erkannt; ungezielte WinGet-Massenreparatur sicher ausgelassen' -ExitCode 0 -Details $mehrfachDetails
                Write-Status -Text ("Mehrere Installationen von {0} im Scope {1} erkannt; die einzelnen Registry-Routen werden separat geprueft." -f $grundId, $scopeKandidat) -Stufe 'INFO'
            }
            elseif (-not [bool](Get-SichereEigenschaft -Objekt $scopeStatus -Name 'Eindeutig' -Standardwert $false)) {
                $scopePruefungUneindeutig = $true
                $script:WinGetReparaturRoutenGesamt++
                $script:WinGetReparaturRoutenAusgelassen++
                Add-Warnung -Text ("Der Installationsstatus von '{0}' konnte im Scope '{1}' nicht eindeutig bestimmt werden: {2}" -f $grundId, $scopeKandidat, (Get-SichererText -Objekt $scopeStatus -Name 'Details'))
                Add-Resultat -Bereich 'Programme' -Aktion ("Reparaturrouten-Pruefung {0}/{1}" -f $grundId, $scopeKandidat) -Status 'Scope nicht eindeutig; ausgelassen' -ExitCode 0 -Details (Get-SichererText -Objekt $scopeStatus -Name 'Details')
            }
        }
        if (-not $scopeGefunden) {
            if ($mehrfachInstallationGefunden -and -not $scopePruefungUneindeutig) {
                continue
            }
            # In einem absichtlich getrennten Benutzer- oder Maschinenlauf
            # bedeutet "in diesem Scope nicht installiert" lediglich, dass
            # das Paket zum anderen Teilprozess gehoert. Erst wenn wirklich
            # beide Scopes geprueft wurden, ist das ein aufloesungsbeduerftiger
            # Inventarwiderspruch.
            if (@($Scopes | Select-Object -Unique).Count -lt 2 -and -not $scopePruefungUneindeutig) {
                continue
            }
            if (-not $scopePruefungUneindeutig) {
                $script:WinGetReparaturRoutenGesamt++
                $script:WinGetReparaturRoutenAusgelassen++
            }
            Add-Warnung -Text ("Das exportierte Paket '{0}' wurde bei der scopegebundenen Nachpruefung in keinem eindeutig installierten Scope gefunden und daher nicht repariert." -f $grundId)
            Add-Resultat -Bereich 'Programme' -Aktion ("Reparaturrouten-Pruefung $grundId") -Status 'In keinem eindeutigen Scope installiert; ausgelassen' -ExitCode 0 -Details ("Quelle: {0}" -f $grundQuelle)
        }
    }
    $pakete = @($paketKontexte.ToArray() | Sort-Object Id, Quelle, Scope -Unique)
    if ($pakete.Count -eq 0) {
        Add-Warnung -Text 'In den verifizierten WinGet-Inventaren wurden keine eindeutig scopegebundenen Pakete fuer eine Reparatur gefunden.'
        return
    }

    $index = 0
    $verarbeiteteReparaturKontexte = New-Object 'System.Collections.Generic.HashSet[string]' ([StringComparer]::OrdinalIgnoreCase)
    $quarantaeneEintraege = @(Get-WinGetUpdateQuarantaene)
    foreach ($paket in $pakete) {
        $index++
        $id = Get-SichererText -Objekt $paket -Name 'Id'
        $quelle = Get-SichererText -Objekt $paket -Name 'Quelle' -Standardwert ''
        $scope = Get-SichererText -Objekt $paket -Name 'Scope' -Standardwert ''
        $script:GepruefteWinGetPakete++
        $script:WinGetReparaturRoutenGesamt++
        $methodenMatrix = Get-SichereProgrammMethodenMatrix -Typ 'WinGet' -Id $id -Quelle $quelle -Scope $scope

        if (-not [bool]$methodenMatrix.KontextGueltig) {
            $script:UebersprungeneNeuinstallationen++
            $script:UnbehobeneProgrammfehler++
            $script:WinGetReparaturRoutenAusgelassen++
            Write-Status -Text ("Uebersprungen (Methoden-Matrix hat Paket-ID, Quelle oder Scope abgelehnt): {0}" -f $id) -Stufe 'WARNUNG'
            Add-Resultat -Bereich 'Programme' -Aktion ("Reparatur $id") -Status 'Ungueltiger Paketkontext; sicher isoliert; weitere Programme werden geprueft' -ExitCode 0 -Details $methodenMatrix.Details
            continue
        }
        if (Test-PaketAusgeschlossen -Id $id) {
            Write-Status -Text ("Uebersprungen (sicherheitskritisch oder laufende Voraussetzung): {0}" -f $id) -Stufe 'INFO'
            Add-Resultat -Bereich 'Programme' -Aktion ("Reparatur $id") -Status 'Sicher ausgeschlossen' -ExitCode 0
            $script:WinGetReparaturRoutenAusgelassen++
            continue
        }
        if (Test-WinGetPaketIstQuarantiniert -Eintraege $quarantaeneEintraege -Id $id -Quelle $quelle -Scope $scope) {
            $script:UebersprungeneNeuinstallationen++
            $script:WinGetReparaturRoutenAusgelassen++
            Add-Warnung -Text ("Paket '{0}' ({1}/{2}) bleibt wegen einer bestaetigten Installer-Hashabweichung in Quarantaene. Nur dieses Paket wird ausgelassen; alle weiteren Programmreparaturen laufen weiter." -f $id, $quelle, $scope)
            Add-Resultat -Bereich 'Programme' -Aktion ("Reparatur/Neuinstallation $id") -Status 'Wegen bestaetigter Hashabweichung quarantiniert; weitere Reparaturen werden fortgesetzt' -ExitCode -1978335215 -Details ("Quarantaenedatei: {0}" -f $script:WinGetQuarantaeneDatei)
            Write-Status -Text ("Quarantiniertes Paket sicher ausgelassen; naechstes Programm wird repariert: {0} ({1}/{2})." -f $id, $quelle, $scope) -Stufe 'INFO'
            continue
        }
        $scopeStatus = Get-WinGetPaketStatusImScope -WinGet $WinGet -Id $id -Quelle $quelle -Scope $scope -ListHilfeText $listHilfeText
        if (-not [bool](Get-SichereEigenschaft -Objekt $scopeStatus -Name 'Eindeutig' -Standardwert $false) -or
            -not [bool](Get-SichereEigenschaft -Objekt $scopeStatus -Name 'Installiert' -Standardwert $false)) {
            $script:UebersprungeneNeuinstallationen++
            $script:UnbehobeneProgrammfehler++
            $script:WinGetReparaturRoutenAusgelassen++
            $kontextDetails = Get-SichererText -Objekt $scopeStatus -Name 'Details'
            Add-Warnung -Text ("Paket '{0}' ist im Scope '{1}' nicht mehr eindeutig installiert. Reparatur und Neuinstallation wurden sicher ausgelassen: {2}" -f $id, $scope, $kontextDetails)
            Add-Resultat -Bereich 'Programme' -Aktion ("Reparatur/Neuinstallation $id") -Status 'Scope-Status nicht eindeutig' -ExitCode 0 -Details $kontextDetails
            continue
        }

        $installierteVersionen = @(Get-SichereEigenschaft -Objekt $scopeStatus -Name 'Versionen' -Standardwert @())
        $anzeigename = Get-SichererText -Objekt $scopeStatus -Name 'Anzeigename' -Standardwert $id
        if (Test-PaketPruefstatusAktuell -Id $id -Quelle $quelle -Scope $scope -Versionen $installierteVersionen) {
            $script:AktuelleReparaturPruefungenWiederverwendet++
            $script:WinGetReparaturRoutenAusgelassen++
            $details = ("Quelle, exakte Paket-ID, Scope und installierte Version wurden erneut bestaetigt. Die identische Version wurde innerhalb dieses noch nicht vollstaendig abgeschlossenen Gesamtlaufs bereits erfolgreich mutierend repariert oder neu installiert und nachkontrolliert. Versionen: {0}" -f ($installierteVersionen -join ', '))
            Add-Resultat -Bereich 'Programme' -Aktion ("Reparatur $id") -Status 'Aktueller erfolgreicher Tiefenpruefpunkt wiederverwendet; unnoetige Neuinstallation vermieden' -ExitCode 0 -Details $details
            Write-Status -Text ("Unveraendertes, kuerzlich erfolgreich nachkontrolliertes Paket ohne erneute Zwangsinstallation bestaetigt: {0} ({1}/{2})." -f $id, $quelle, $scope) -Stufe 'OK'
            $null = Ensure-DesktopVerknuepfungFuerProgramm -Id $id -Anzeigename $anzeigename -Scope $scope -Quelle $quelle -FehlerIstFatal:$false
            continue
        }

        $reparaturManifestVersion = 'latest'
        if ($quelle -eq 'winget') {
            if ($installierteVersionen.Count -eq 1) {
                $manifestStatus = Get-WinGetManifestVersion -WinGet $WinGet -Id $id -Quelle $quelle
                if ([bool](Get-SichereEigenschaft -Objekt $manifestStatus -Name 'Eindeutig' -Standardwert $false)) {
                    $manifestVersion = Get-SichererText -Objekt $manifestStatus -Name 'Version'
                    $reparaturManifestVersion = $manifestVersion
                    $versionsVergleich = Compare-EinfachePaketversion -Links ([string]$installierteVersionen[0]) -Rechts $manifestVersion
                    if ($null -ne $versionsVergleich -and [int]$versionsVergleich -gt 0) {
                        $script:WinGetReparaturRoutenAusgelassen++
                        $details = ("Installiert: {0}; WinGet-Manifest: {1}. Registry-Integritaetspruefung bleibt massgeblich; Download und Reparatur wurden vor jeder Aenderung gesperrt." -f $installierteVersionen[0], $manifestVersion)
                        Add-Resultat -Bereich 'Programme' -Aktion ("Reparatur $id") -Status 'Veraltetes Reparaturmanifest erkannt; Downgrade sicher verhindert' -ExitCode 0 -Details $details
                        Write-Status -Text ("Veraltetes Reparaturmanifest sicher ausgelassen: {0} (installiert {1}, Manifest {2})." -f $id, $installierteVersionen[0], $manifestVersion) -Stufe 'INFO'
                        continue
                    }
                }
            }
        }

        try {
            $reparaturVorab = Test-WinGetUpdateVorab -WinGet $WinGet -Id $id -Quelle $quelle -Scope $scope -Verfuegbar $reparaturManifestVersion -BehaltenFuerFallback:($quelle -eq 'winget')
        }
        catch {
            $script:FehlgeschlageneReparaturen++
            $script:WinGetReparaturRoutenAusgelassen++
            Add-Warnung -Text ("Die Reparatur-Vorabpruefung fuer '{0}' wurde nach einer unerwarteten paketbezogenen Ausnahme isoliert; alle weiteren Programme werden repariert: {1}" -f $id, $_.Exception.Message)
            Add-Resultat -Bereich 'Programme' -Aktion ("Reparatur-Vorabpruefung $id") -Status 'Paketbezogene Ausnahme isoliert; weitere Reparaturen laufen weiter' -ExitCode -1 -Details ($_ | Out-String)
            continue
        }
        if (-not [bool](Get-SichereEigenschaft -Objekt $reparaturVorab -Name 'Erfolgreich' -Standardwert $false)) {
            $script:FehlgeschlageneReparaturen++
            $script:WinGetReparaturRoutenAusgelassen++
            $vorabCode = [int](Get-SichereEigenschaft -Objekt $reparaturVorab -Name 'ExitCode' -Standardwert -1)
            $vorabDetails = Get-SichererText -Objekt $reparaturVorab -Name 'Details'
            $vorabQuarantiniert = [bool](Get-SichereEigenschaft -Objekt $reparaturVorab -Name 'Quarantiniert' -Standardwert $false)
            Add-Resultat -Bereich 'Programme' -Aktion ("Reparatur-Vorabpruefung $id") -Status $(if ($vorabQuarantiniert) { 'Hashabweichung erkannt und Manifestversion quarantiniert; weitere Reparaturen laufen weiter' } else { 'Fehlgeschlagen; paketweise isoliert; weitere Reparaturen laufen weiter' }) -ExitCode $vorabCode -Details $vorabDetails
            Add-Warnung -Text ("Die Reparatur-Vorabpruefung fuer '{0}' ist fehlgeschlagen. Das Programm wurde nicht veraendert und nur dieses Paket wurde {1}; alle weiteren Reparaturen werden fortgesetzt (Exitcode {2})." -f $id, $(if ($vorabQuarantiniert) { 'dauerhaft quarantiniert' } else { 'fuer diesen Lauf isoliert' }), $vorabCode)
            continue
        }
        Add-Resultat -Bereich 'Programme' -Aktion ("Reparatur-Vorabpruefung $id") -Status 'Bestanden' -ExitCode 0 -Details (Get-SichererText -Objekt $reparaturVorab -Name 'Details')
        $vorabDownloadOrdner = Get-SichererText -Objekt $reparaturVorab -Name 'DownloadOrdner'

        try {
            $appxKontext = Resolve-WinGetAppxUpdateKontext -Id $id -Quelle $quelle -Scope $scope `
                -IstAppx ([bool](Get-SichereEigenschaft -Objekt $reparaturVorab -Name 'IstAppx' -Standardwert $false)) `
                -AppxIdentitaeten @(Get-SichereEigenschaft -Objekt $reparaturVorab -Name 'AppxIdentitaeten' -Standardwert @())
        }
        catch {
            $script:FehlgeschlageneReparaturen++
            $script:WinGetReparaturRoutenAusgelassen++
            Add-Warnung -Text ("Die AppX-/MSIX-Identitaetspruefung fuer '{0}' wurde nach einem paketbezogenen Fehler sicher isoliert; weitere Programme werden repariert: {1}" -f $id, $_.Exception.Message)
            Add-Resultat -Bereich 'Programme' -Aktion ("AppX-Reparaturkontext $id") -Status 'Paketfehler isoliert; Reparaturfolge wird fortgesetzt' -ExitCode -1 -Details ($_ | Out-String)
            if (-not [string]::IsNullOrWhiteSpace($vorabDownloadOrdner)) { $null = Remove-KontrolliertenInstallerOrdner -Ordner $vorabDownloadOrdner }
            continue
        }
        $appxStatus = Get-SichererText -Objekt $appxKontext -Name 'Status'
        $appxDetails = Get-SichererText -Objekt $appxKontext -Name 'Details'
        if (-not [bool](Get-SichereEigenschaft -Objekt $appxKontext -Name 'Ausfuehren' -Standardwert $false)) {
            $script:WinGetReparaturRoutenAusgelassen++
            Add-Resultat -Bereich 'Programme' -Aktion ("Reparatur $id") -Status $appxStatus -ExitCode 0 -Details $appxDetails
            Write-Status -Text ("AppX-Reparatur sicher ausgelassen: {0} ({1}/{2}) - {3}." -f $id, $quelle, $scope, $appxStatus) -Stufe 'INFO'
            if (-not [string]::IsNullOrWhiteSpace($vorabDownloadOrdner)) { $null = Remove-KontrolliertenInstallerOrdner -Ordner $vorabDownloadOrdner }
            continue
        }
        $korrigierterScope = Get-SichererText -Objekt $appxKontext -Name 'Scope' -Standardwert $scope
        if ($korrigierterScope -ne $scope) {
            Add-Resultat -Bereich 'Programme' -Aktion ("AppX-Reparaturscope $id") -Status $appxStatus -ExitCode 0 -Details $appxDetails
            $scope = $korrigierterScope
            $korrigierterStatus = Get-WinGetPaketStatusImScope -WinGet $WinGet -Id $id -Quelle $quelle -Scope $scope -ListHilfeText $listHilfeText
            if (-not [bool](Get-SichereEigenschaft -Objekt $korrigierterStatus -Name 'Eindeutig' -Standardwert $false) -or
                -not [bool](Get-SichereEigenschaft -Objekt $korrigierterStatus -Name 'Installiert' -Standardwert $false)) {
                $script:WinGetReparaturRoutenAusgelassen++
                Add-Resultat -Bereich 'Programme' -Aktion ("Reparatur $id") -Status 'Korrigierter AppX-Benutzerscope nicht eindeutig in WinGet bestaetigt; sicher ausgelassen' -ExitCode 0 -Details (Get-SichererText -Objekt $korrigierterStatus -Name 'Details')
                if (-not [string]::IsNullOrWhiteSpace($vorabDownloadOrdner)) { $null = Remove-KontrolliertenInstallerOrdner -Ordner $vorabDownloadOrdner }
                continue
            }
            $installierteVersionen = @(Get-SichereEigenschaft -Objekt $korrigierterStatus -Name 'Versionen' -Standardwert @())
            $anzeigename = Get-SichererText -Objekt $korrigierterStatus -Name 'Anzeigename' -Standardwert $anzeigename
        }
        $reparaturKontextSchluessel = "{0}|{1}|{2}" -f $id, $quelle, $scope
        if (-not $verarbeiteteReparaturKontexte.Add($reparaturKontextSchluessel)) {
            $script:WinGetReparaturRoutenAusgelassen++
            Add-Resultat -Bereich 'Programme' -Aktion ("Reparatur $id") -Status 'Nach AppX-Scopepruefung identischer Reparaturkontext bereits verarbeitet' -ExitCode 0
            if (-not [string]::IsNullOrWhiteSpace($vorabDownloadOrdner)) { $null = Remove-KontrolliertenInstallerOrdner -Ordner $vorabDownloadOrdner }
            continue
        }

        $paketProzent = 72 + [int][Math]::Floor(($index / [double]$pakete.Count) * 8)
        $kategorieProzent = [int][Math]::Floor(($index / [double]$pakete.Count) * 100)
        Set-Gesamtfortschritt -Prozent $paketProzent -Status ("Programmreparatur {0}/{1}: {2} [{3}]" -f $index, $pakete.Count, $id, $scope) -Kategorie 'Programmreparaturen' -KategorieProzent $kategorieProzent
        Write-Status -Text ("Paket {0}/{1} reparieren: {2} (Scope: {3})" -f $index, $pakete.Count, $id, $scope) -Stufe 'INFO'
        try {
            $argumente = New-WinGetReparaturArgumente -Id $id -Quelle $quelle -Scope $scope -HilfeText $hilfeText
        }
        catch {
            $script:FehlgeschlageneReparaturen++
            $script:UebersprungeneNeuinstallationen++
            $script:UnbehobeneProgrammfehler++
            Add-Warnung -Text ("Reparatur und Neuinstallationsfallback fuer '{0}' wurden wegen unvollstaendiger WinGet-Optionen ausgelassen: {1}" -f $id, $_.Exception.Message)
            Add-Resultat -Bereich 'Programme' -Aktion ("Reparatur $id") -Status 'Benoetigte WinGet-Optionen fehlen' -ExitCode -1 -Details $_.Exception.Message
            $script:WinGetReparaturRoutenAusgelassen++
            if (-not [string]::IsNullOrWhiteSpace($vorabDownloadOrdner)) { $null = Remove-KontrolliertenInstallerOrdner -Ordner $vorabDownloadOrdner }
            continue
        }

        $script:WinGetReparaturRoutenAusgefuehrt++
        try {
            $ergebnis = Invoke-Native -Datei $WinGet -Argumente $argumente -Beschreibung ("Programm reparieren: {0} ({1}/{2})" -f $id, $quelle, $scope) -TimeoutSekunden 1800 -LeerlaufTimeoutSekunden 600 -InstallationsVorgang -FehlerNurResultat -AusgabeUnterdruecken
        }
        catch {
            $script:FehlgeschlageneReparaturen++
            $script:UnbehobeneProgrammfehler++
            Add-Warnung -Text ("Der Reparaturaufruf fuer '{0}' wurde nach einer unerwarteten paketbezogenen Ausnahme isoliert; alle weiteren Programme werden repariert: {1}" -f $id, $_.Exception.Message)
            Add-Resultat -Bereich 'Programme' -Aktion ("Reparatur $id") -Status 'Paketbezogene Ausnahme isoliert; Reparaturfolge wird fortgesetzt' -ExitCode -1 -Details ($_ | Out-String)
            if (-not [string]::IsNullOrWhiteSpace($vorabDownloadOrdner)) { $null = Remove-KontrolliertenInstallerOrdner -Ordner $vorabDownloadOrdner }
            continue
        }
        $entscheidung = Get-WinGetReparaturEntscheidung -ProzessErfolgreich ([bool]$ergebnis.Erfolgreich) -ExitCode ([int]$ergebnis.ExitCode) -Ausgabe ([string]$ergebnis.Ausgabe)

        if ($entscheidung -eq 'Wiederholen') {
            Write-Status -Text ("Voruebergehender Reparaturfehler bei {0}; die Quelle wird aktualisiert und die Reparatur einmal wiederholt." -f $id) -Stufe 'WARNUNG'
            $quellenUpdate = Invoke-Native -Datei $WinGet -Argumente @('source', 'update', '--name', $quelle, '--disable-interactivity') -Beschreibung ("WinGet-Quelle {0} vor erneutem Reparaturversuch aktualisieren" -f $quelle) -TimeoutSekunden 300 -FehlerNurResultat -AusgabeUnterdruecken
            Start-Sleep -Seconds 3
            if ($quellenUpdate.Erfolgreich -and (Test-WinGetQuelle -WinGet $WinGet -Name $quelle)) {
                $ergebnis = Invoke-Native -Datei $WinGet -Argumente $argumente -Beschreibung ("Programm erneut reparieren: {0} ({1}/{2})" -f $id, $quelle, $scope) -TimeoutSekunden 1800 -LeerlaufTimeoutSekunden 600 -InstallationsVorgang -FehlerNurResultat -AusgabeUnterdruecken
                $entscheidung = Get-WinGetReparaturEntscheidung -ProzessErfolgreich ([bool]$ergebnis.Erfolgreich) -ExitCode ([int]$ergebnis.ExitCode) -Ausgabe ([string]$ergebnis.Ausgabe)
            }
        }

        $text = [string]$ergebnis.Ausgabe
        if ($entscheidung -in @('Repariert', 'RepariertNeustart')) {
            if ($entscheidung -eq 'RepariertNeustart') { Add-OneClickNeustartnachweis -Quelle ("WinGet-Reparatur {0}" -f $id) -ExitCode ([int]$ergebnis.ExitCode) -Details ("Quelle: {0}; Scope: {1}" -f $quelle, $scope) }
            $nachkontrolle = Wait-WinGetPaketNachkontrolle -WinGet $WinGet -Id $id -Quelle $quelle -Scope $scope -ListHilfeText $listHilfeText -TimeoutSekunden 300
            if ([bool](Get-SichereEigenschaft -Objekt $nachkontrolle -Name 'Bestaetigt' -Standardwert $false)) {
                Set-PaketPruefstatusErfolgreich -Id $id -Quelle $quelle -Scope $scope -Versionen $installierteVersionen -Methode 'Reparatur'
                $script:RepariertePakete++
                $script:NachkontrollierteReparaturen++
                Add-Resultat -Bereich 'Programme' -Aktion ("Reparatur $id") -Status $(if ($entscheidung -eq 'RepariertNeustart') { 'Erfolgreich nachkontrolliert; Neustart erforderlich' } else { 'Erfolgreich nachkontrolliert und abgeschlossen' }) -ExitCode ([int]$ergebnis.ExitCode) -Details ("Scope: {0}{1}{2}" -f $scope, [Environment]::NewLine, $text)
                $null = Ensure-DesktopVerknuepfungFuerProgramm -Id $id -Anzeigename $anzeigename -Scope $scope -Quelle $quelle -FehlerIstFatal:$false
                if (-not [string]::IsNullOrWhiteSpace($vorabDownloadOrdner)) { $null = Remove-KontrolliertenInstallerOrdner -Ordner $vorabDownloadOrdner }
                if ($script:NeustartErforderlich) {
                    Add-Resultat -Bereich 'Programme' -Aktion ("Reparaturfolge nach $id pausieren") -Status 'Keine weiteren Pakete vor dem erforderlichen Neustart verarbeitet' -ExitCode 3010 -Details ("Quelle: {0}; Scope: {1}" -f $quelle, $scope)
                    break
                }
                continue
            }

            if ($script:NeustartErforderlich) {
                Add-Resultat -Bereich 'Programme' -Aktion ("Reparatur $id") -Status 'Installer erfolgreich; abschliessende Nachkontrolle nach Neustart ausstehend' -ExitCode 3010 -Details ("Scope: {0}{1}{2}" -f $scope, [Environment]::NewLine, $text)
                if (-not [string]::IsNullOrWhiteSpace($vorabDownloadOrdner)) { $null = Remove-KontrolliertenInstallerOrdner -Ordner $vorabDownloadOrdner }
                break
            }

            $script:FehlgeschlageneReparaturNachkontrollen++
            $script:FehlgeschlageneReparaturen++
            $script:UebersprungeneNeuinstallationen++
            $script:UnbehobeneProgrammfehler++
            $nachStatus = Get-SichererText -Objekt $nachkontrolle -Name 'Status'
            $nachDetails = Get-SichererText -Objekt $nachkontrolle -Name 'Details'
            Add-Warnung -Text ("WinGet meldete die Reparatur von '{0}' als erfolgreich, der installierte Zustand im Scope '{1}' konnte danach jedoch nicht bestaetigt werden: {2}. Eine automatische Neuinstallation wird in diesem mehrdeutigen Zustand nicht erzwungen." -f $id, $scope, $nachStatus)
            Add-Resultat -Bereich 'Programme' -Aktion ("Reparatur $id") -Status 'Installer beendet, Reparatur-Nachkontrolle fehlgeschlagen' -ExitCode ([int]$ergebnis.ExitCode) -Details ("Scope: {0}; Nachkontrolle: {1}{2}{3}{2}{4}" -f $scope, $nachStatus, [Environment]::NewLine, $nachDetails, $text)
            if (-not [string]::IsNullOrWhiteSpace($vorabDownloadOrdner)) { $null = Remove-KontrolliertenInstallerOrdner -Ordner $vorabDownloadOrdner }
            continue
        }

        if ($entscheidung -eq 'Benutzerkontext') {
            $script:FehlgeschlageneReparaturen++
            $script:UebersprungeneNeuinstallationen++
            $script:UnbehobeneProgrammfehler++
            Add-Warnung -Text ("Paket '{0}' ist im Benutzerbereich installiert und verbietet diese Aktion im Administratorkontext. Eine automatische Neuinstallation wird nicht in einen anderen Scope umgeleitet." -f $id)
            Add-Resultat -Bereich 'Programme' -Aktion ("Reparatur/Neuinstallation $id") -Status 'Benutzerkontext erforderlich; sicher ausgelassen' -ExitCode ([int]$ergebnis.ExitCode) -Details $text
            if (-not [string]::IsNullOrWhiteSpace($vorabDownloadOrdner)) { $null = Remove-KontrolliertenInstallerOrdner -Ordner $vorabDownloadOrdner }
            continue
        }
        if ($entscheidung -eq 'Neustart') {
            Add-OneClickNeustartnachweis -Quelle ("WinGet-Reparatur vor Ausfuehrung {0}" -f $id) -ExitCode ([int]$ergebnis.ExitCode) -Details ("Quelle: {0}; Scope: {1}" -f $quelle, $scope)
            $script:UebersprungeneNeuinstallationen++
            Add-Resultat -Bereich 'Programme' -Aktion ("Reparatur/Neuinstallation $id") -Status 'Neustart vor erneuter Reparatur erforderlich; kontrolliert pausiert' -ExitCode ([int]$ergebnis.ExitCode) -Details $text
            if (-not [string]::IsNullOrWhiteSpace($vorabDownloadOrdner)) { $null = Remove-KontrolliertenInstallerOrdner -Ordner $vorabDownloadOrdner }
            break
        }
        if ($entscheidung -in @('Benutzeraktion', 'Sicherheitsblockade', 'Voraussetzung', 'Wiederholen')) {
            $script:FehlgeschlageneReparaturen++
            $script:UebersprungeneNeuinstallationen++
            $script:UnbehobeneProgrammfehler++
            Add-Warnung -Text ("Der Neuinstallationsfallback fuer '{0}' wurde wegen des Reparaturzustands '{1}' nicht erzwungen (Exitcode {2})." -f $id, $entscheidung, [int]$ergebnis.ExitCode)
            Add-Resultat -Bereich 'Programme' -Aktion ("Reparatur/Neuinstallation $id") -Status ("Fallback sicher ausgelassen: {0}" -f $entscheidung) -ExitCode ([int]$ergebnis.ExitCode) -Details $text
            if (-not [string]::IsNullOrWhiteSpace($vorabDownloadOrdner)) { $null = Remove-KontrolliertenInstallerOrdner -Ordner $vorabDownloadOrdner }
            continue
        }

        if ([int]$ergebnis.ExitCode -in @(-1978335111, -1978335110, -1978335108) -or $text -match '(?i)(repair.*not supported|no repair|does not support repair|keine reparatur|nicht.*reparatur|no applicable repair|repair behavior)') {
            $script:NichtUnterstuetzteReparaturen++
            Add-Resultat -Bereich 'Programme' -Aktion ("Reparatur $id") -Status 'Nicht anwendbar oder nicht unterstuetzt; Neuinstallationsfallback wird geprueft' -ExitCode ([int]$ergebnis.ExitCode) -Details $text
        }
        else {
            $script:FehlgeschlageneReparaturen++
            Add-Resultat -Bereich 'Programme' -Aktion ("Reparatur $id") -Status 'Fehlgeschlagen; Neuinstallationsfallback wird geprueft' -ExitCode ([int]$ergebnis.ExitCode) -Details $text
        }

        if ($quelle -eq 'winget' -and $communityFallbackVerfuegbar) {
            $fallbackErfolg = Invoke-DownloadUndNeuinstallationPaketIsoliert -WinGet $WinGet -Id $id -Quelle $quelle -UrspruenglicherScope $scope -ListHilfeText $listHilfeText -DownloadHilfeText $downloadHilfeText -InstallHilfeText $installHilfeText -ReparaturExitCode ([int]$ergebnis.ExitCode) -ReparaturAusgabe $text -VorabDownloadOrdner $vorabDownloadOrdner
            if ($fallbackErfolg) { $null = Ensure-DesktopVerknuepfungFuerProgramm -Id $id -Anzeigename $anzeigename -Scope $scope -Quelle $quelle -FehlerIstFatal:$false }
        }
        elseif ($quelle -eq 'msstore' -and $storeFallbackVerfuegbar) {
            try {
                $fallbackErfolg = Invoke-MicrosoftStoreNeuinstallation -WinGet $WinGet -Id $id -UrspruenglicherScope $scope -ListHilfeText $listHilfeText -InstallHilfeText $installHilfeText -ReparaturExitCode ([int]$ergebnis.ExitCode) -ReparaturAusgabe $text
            }
            catch {
                $fallbackErfolg = $false
                $script:UebersprungeneNeuinstallationen++
                $script:UnbehobeneProgrammfehler++
                Add-Warnung -Text ("Der Microsoft-Store-Fallback fuer '{0}' wurde nach einer paketbezogenen Ausnahme isoliert; weitere Programme werden repariert: {1}" -f $id, $_.Exception.Message)
                Add-Resultat -Bereich 'Programme' -Aktion ("Store-Neuinstallation $id") -Status 'Paketbezogene Ausnahme isoliert; Reparaturfolge wird fortgesetzt' -ExitCode -1 -Details ($_ | Out-String)
            }
            if ($fallbackErfolg) { $null = Ensure-DesktopVerknuepfungFuerProgramm -Id $id -Anzeigename $anzeigename -Scope $scope -Quelle $quelle -FehlerIstFatal:$false }
        }
        else {
            $script:UebersprungeneNeuinstallationen++
            $script:UnbehobeneProgrammfehler++
            Add-Warnung -Text ("Paket '{0}' konnte nicht repariert werden und der fuer Quelle '{1}' benoetigte sichere Neuinstallationsfallback steht nicht zur Verfuegung." -f $id, $quelle)
            Add-Resultat -Bereich 'Programme' -Aktion ("Neuinstallation $id") -Status 'Fallback nicht verfuegbar' -ExitCode ([int]$ergebnis.ExitCode) -Details $text
            if (-not [string]::IsNullOrWhiteSpace($vorabDownloadOrdner)) { $null = Remove-KontrolliertenInstallerOrdner -Ordner $vorabDownloadOrdner }
        }
        if ($script:NeustartErforderlich) {
            Add-Resultat -Bereich 'Programme' -Aktion ("Neuinstallationsfolge nach $id pausieren") -Status 'Keine weiteren Pakete vor dem erforderlichen Neustart verarbeitet' -ExitCode 3010 -Details ("Quelle: {0}; Scope: {1}" -f $quelle, $scope)
            break
        }
    }
}

function ConvertFrom-DismImageHealthState {
    param([AllowNull()][AllowEmptyString()][string]$Wert)

    $bereinigt = if ($null -eq $Wert) { '' } else { $Wert.Trim() }
    $status = switch -Regex ($bereinigt) {
        '^(?:DismImage)?Healthy$|^0$' { 'Healthy'; break }
        '^(?:DismImage)?Repairable$|^1$' { 'Repairable'; break }
        '^(?:DismImage)?NonRepairable$|^2$' { 'NonRepairable'; break }
        default { '' }
    }
    return [string]$status
}

function Get-DismOnlineIntegritaetsstatus {
    $befehl = Get-Command 'Repair-WindowsImage' -CommandType Cmdlet -ErrorAction Stop
    if ($null -eq $befehl -or -not [string]::Equals([string]$befehl.ModuleName, 'Dism', [StringComparison]::OrdinalIgnoreCase)) {
        throw 'Das Microsoft-DISM-Cmdlet fuer die sprachunabhaengige Integritaetsklassifikation ist nicht verfuegbar.'
    }

    # CheckHealth wertet nur den durch die unmittelbar vorherige ScanHealth-
    # Pruefung gesetzten Zustand aus. Es repariert nichts und bezieht keine
    # Reparaturdateien. Ein isolierter, zeitbegrenzter PowerShell-Prozess gibt
    # nur den typisierten Zustand als JSON zurueck; dadurch bleibt auch diese
    # kurze DISM-Abfrage gegen echten Leerlauf abgesichert und sprachunabhaengig.
    $pruefcode = @'
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$antworten = @(Dism\Repair-WindowsImage -Online -CheckHealth -NoRestart -ErrorAction Stop)
if ($antworten.Count -ne 1) { throw "Uneindeutige DISM-Antwort: $($antworten.Count) Objekte." }
[Console]::Out.WriteLine(([pscustomobject]@{
    ImageHealthState = [string]$antworten[0].ImageHealthState
    RestartNeeded = [bool]$antworten[0].RestartNeeded
} | ConvertTo-Json -Compress))
'@
    $hostPfad = Get-AktuellerHostPfad
    $encoded = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($pruefcode))
    $dismLog = Join-Path -Path $env:SystemRoot -ChildPath 'Logs\DISM\dism.log'
    $cbsLog = Join-Path -Path $env:SystemRoot -ChildPath 'Logs\CBS\CBS.log'
    $prozessErgebnis = Invoke-ProzessMitTimeout -Datei $hostPfad -Argumente @('-NoLogo', '-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-EncodedCommand', $encoded) -TimeoutSekunden 900 -LeerlaufTimeoutSekunden 600 -AlleKindprozesseAlsAktivitaet -AktivitaetsPfade @($dismLog, $cbsLog) -FortschrittsText 'DISM-Integritaetsstatus downloadfrei klassifizieren'
    if ($prozessErgebnis.Timeout -or [int]$prozessErgebnis.ExitCode -ne 0) {
        throw ("Die downloadfreie DISM-Integritaetsklassifikation ist fehlgeschlagen (Exitcode {0}): {1}" -f $prozessErgebnis.ExitCode, (ConvertTo-BereinigteAusgabe -Text ([string]$prozessErgebnis.Ausgabe)))
    }
    $antwort = Get-JsonObjektAusText -Text (ConvertTo-BereinigteAusgabe -Text ([string]$prozessErgebnis.Ausgabe))
    if ($null -eq $antwort) { throw 'DISM lieferte keine auswertbare typisierte Integritaetsklassifikation.' }
    $rohstatus = Get-SichererText -Objekt $antwort -Name 'ImageHealthState'
    $status = ConvertFrom-DismImageHealthState -Wert $rohstatus
    if ([string]::IsNullOrWhiteSpace($status)) {
        throw "DISM meldete einen unbekannten Integritaetsstatus: '$rohstatus'."
    }
    $neustart = [bool](Get-SichereEigenschaft -Objekt $antwort -Name 'RestartNeeded' -Standardwert $false)
    Add-Resultat -Bereich 'Windows' -Aktion 'DISM-Integritaetsstatus sprachunabhaengig klassifizieren' -Status $status -ExitCode 0 -Details ("Originalstatus: {0}; Neustart erforderlich: {1}" -f $rohstatus, $neustart)
    return [pscustomobject]@{
        Status = $status
        Originalstatus = $rohstatus
        NeustartErforderlich = $neustart
    }
}

function Enable-DismWindowsUpdateReparaturquelle {
    $probleme = New-Object 'System.Collections.Generic.List[string]'
    $hinweise = New-Object 'System.Collections.Generic.List[string]'

    $windowsUpdateRichtlinie = 'HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate'
    try {
        if (Test-Path -LiteralPath $windowsUpdateRichtlinie) {
            $richtlinie = Get-ItemProperty -LiteralPath $windowsUpdateRichtlinie -ErrorAction Stop
            foreach ($wertName in @('DisableWindowsUpdateAccess', 'DoNotConnectToWindowsUpdateInternetLocations')) {
                if ([int](Get-SichereEigenschaft -Objekt $richtlinie -Name $wertName -Standardwert 0) -eq 1) {
                    $probleme.Add("Windows-Update-Richtlinie blockiert den Internetzugriff: $wertName=1") | Out-Null
                }
            }
            $wuServer = Get-SichererText -Objekt $richtlinie -Name 'WUServer'
            if (-not [string]::IsNullOrWhiteSpace($wuServer)) { $hinweise.Add("Konfigurierter organisationsinterner Updatedienst: $wuServer") | Out-Null }
        }
    }
    catch { $hinweise.Add("Windows-Update-Richtlinie konnte nicht vollstaendig gelesen werden: $($_.Exception.Message)") | Out-Null }

    $dienstDefinitionen = @(
        [pscustomobject]@{ Name = 'wuauserv'; Pflicht = $true; Beschreibung = 'Windows Update' },
        [pscustomobject]@{ Name = 'TrustedInstaller'; Pflicht = $true; Beschreibung = 'Windows Modules Installer' },
        [pscustomobject]@{ Name = 'CryptSvc'; Pflicht = $true; Beschreibung = 'Kryptografiedienste' },
        [pscustomobject]@{ Name = 'BITS'; Pflicht = $false; Beschreibung = 'Intelligenter Hintergrunduebertragungsdienst' },
        [pscustomobject]@{ Name = 'DoSvc'; Pflicht = $false; Beschreibung = 'Delivery Optimization' },
        [pscustomobject]@{ Name = 'UsoSvc'; Pflicht = $false; Beschreibung = 'Update Orchestrator' }
    )
    $bereiteDienste = New-Object 'System.Collections.Generic.List[string]'
    foreach ($definition in $dienstDefinitionen) {
        try {
            $dienst = Get-Service -Name $definition.Name -ErrorAction Stop
            if ([string]$dienst.StartType -eq 'Disabled') {
                $meldung = "$($definition.Beschreibung) ($($definition.Name)) ist deaktiviert."
                if ($definition.Pflicht) { $probleme.Add($meldung) | Out-Null } else { $hinweise.Add($meldung) | Out-Null }
                continue
            }
            if ([string]$dienst.Status -ne 'Running') {
                Start-Service -Name $definition.Name -ErrorAction Stop
                $dienst.WaitForStatus('Running', [TimeSpan]::FromSeconds(30))
                $dienst.Refresh()
            }
            if ([string]$dienst.Status -eq 'Running') {
                $bereiteDienste.Add($definition.Name) | Out-Null
            }
            else {
                $meldung = "$($definition.Beschreibung) ($($definition.Name)) erreichte den Status 'Running' nicht."
                if ($definition.Pflicht) { $probleme.Add($meldung) | Out-Null } else { $hinweise.Add($meldung) | Out-Null }
            }
        }
        catch {
            $meldung = "$($definition.Beschreibung) ($($definition.Name)) konnte nicht vorbereitet werden: $($_.Exception.Message)"
            if ($definition.Pflicht) { $probleme.Add($meldung) | Out-Null } else { $hinweise.Add($meldung) | Out-Null }
        }
    }

    $details = "Bereite Dienste: {0}. {1}" -f (($bereiteDienste.ToArray() | Sort-Object) -join ', '), (($hinweise.ToArray()) -join ' ')
    $erfolgreich = ($probleme.Count -eq 0)
    if (-not $erfolgreich) { $details += ' Blockierende Probleme: ' + ($probleme.ToArray() -join ' ') }
    Add-Resultat -Bereich 'Windows' -Aktion 'DISM-Windows-Update-Reparaturquelle vorbereiten' -Status $(if ($erfolgreich) { 'Bereit' } else { 'Blockiert' }) -ExitCode $(if ($erfolgreich) { 0 } else { 1 }) -Details $details
    return [pscustomobject]@{
        Erfolgreich = $erfolgreich
        BereiteDienste = @($bereiteDienste.ToArray())
        Hinweise = @($hinweise.ToArray())
        Probleme = @($probleme.ToArray())
        Details = $details
    }
}

function Repair-Windows {
    Write-Status -Text 'Windows-Komponenten werden bedarfsgesteuert geprueft und nur bei nachgewiesenem Schaden repariert.' -Stufe 'SCHRITT'

    $dism = Get-WindowsSystemdateiPfad -Dateiname 'dism.exe'
    $sfc = Get-WindowsSystemdateiPfad -Dateiname 'sfc.exe'
    $chkdsk = Get-WindowsSystemdateiPfad -Dateiname 'chkdsk.exe'

    $dismVorpruefungErgebnis = $null
    $dismErgebnis = $null
    $dismNachpruefungErgebnis = $null
    $sfcErgebnis = $null
    $chkdskErgebnis = $null
    $windowsFolgepruefungenFreigegeben = $false
    $dismLog = Join-Path -Path $env:SystemRoot -ChildPath 'Logs\DISM\dism.log'
    $cbsLog = Join-Path -Path $env:SystemRoot -ChildPath 'Logs\CBS\CBS.log'

    if (Test-Path -LiteralPath $dism -PathType Leaf) {
        Write-Status -Text 'DISM beginnt mit einer downloadfreien /ScanHealth-Vorpruefung. /RestoreHealth und Windows Update werden nur bei eindeutig reparierbarer Beschaedigung freigegeben.' -Stufe 'SCHRITT'
        Write-Status -Text 'DISM-Aktivitaetsanzeige aktiv: DismHost und weitere Kindprozesse sowie DISM.log und CBS.log zaehlen als Fortschritt. Ein spaeter erforderlicher Windows-Update-Download zeigt Laufzeit, Megabytes und verfuegbare Prozentwerte.' -Stufe 'INFO'
        Set-Gesamtfortschritt -Prozent 16 -Status 'DISM prueft den Windows-Komponentenspeicher downloadfrei.' -Kategorie 'Windows-Systempruefung' -KategorieProzent 10 -Dauerhaft
        $dismVorpruefungErgebnis = Invoke-Native -Datei $dism -Argumente @('/Online', '/Cleanup-Image', '/ScanHealth', '/NoRestart') -Beschreibung 'Windows-Komponentenspeicher mit DISM downloadfrei vorpruefen' -TimeoutSekunden 10800 -LeerlaufTimeoutSekunden 600 -InstallationsVorgang -AlleKindprozesseAlsAktivitaet -AktivitaetsPfade @($dismLog, $cbsLog) -ErfolgsCodes @(0) -NeustartCodes @(3010) -FehlerNichtFatal
        if ($script:NeustartErforderlich) {
            Add-Resultat -Bereich 'Windows' -Aktion 'Windows-Systemreparatur pausieren' -Status 'DISM-Vorpruefung verlangt Neustart vor weiteren Schritten' -ExitCode 3010 -Details 'Die Windows-Systemphase wird nach dem Neustart erneut sicher aufgenommen.'
            return
        }
        if ($null -ne $dismVorpruefungErgebnis -and $dismVorpruefungErgebnis.Erfolgreich) {
            $integritaetsstatus = Get-DismOnlineIntegritaetsstatus
            switch ($integritaetsstatus.Status) {
                'Healthy' {
                    Write-Status -Text 'DISM hat keinen Schaden am Windows-Komponentenspeicher festgestellt. /RestoreHealth wird ausgelassen; das Programm startet keinen Reparaturdownload.' -Stufe 'OK'
                    Add-Resultat -Bereich 'Windows' -Aktion 'DISM /RestoreHealth bedarfsgesteuert freigeben' -Status 'Nicht erforderlich; kein Reparaturdownload' -ExitCode 0 -Details 'Die downloadfreie ScanHealth-Vorpruefung und die typisierte CheckHealth-Klassifikation melden Healthy.'
                }
                'NonRepairable' {
                    Add-Warnung -Text 'DISM meldet den Windows-Komponentenspeicher als nicht reparierbar. /RestoreHealth und Reparaturdownloads werden aus Sicherheitsgruenden nicht gestartet.'
                    if ($BeiFehlerAbbrechen) { throw 'Der Windows-Komponentenspeicher ist laut DISM nicht reparierbar.' }
                    $dismErgebnis = [pscustomobject]@{ Erfolgreich = $false; ExitCode = 1; Ausgabe = 'DismImageNonRepairable'; NeustartErforderlich = $false }
                }
                'Repairable' {
                    Write-Status -Text 'DISM hat eine reparierbare Beschaedigung oder fehlende Komponentendateien festgestellt. Erst jetzt wird /RestoreHealth samt erlaubter Windows-Update-Reparaturquelle vorbereitet.' -Stufe 'WARNUNG'
                    $dismQuellenStatus = Enable-DismWindowsUpdateReparaturquelle
                    if (-not $dismQuellenStatus.Erfolgreich) {
                        Add-Warnung -Text ("DISM kann die Windows-Update-Reparaturquelle nicht sicher verwenden: {0}" -f $dismQuellenStatus.Details)
                        if ($BeiFehlerAbbrechen) { throw 'Die Windows-Update-Reparaturquelle fuer DISM ist blockiert oder nicht startbereit.' }
                        $dismErgebnis = [pscustomobject]@{ Erfolgreich = $false; ExitCode = 1; Ausgabe = $dismQuellenStatus.Details; NeustartErforderlich = $false }
                        break
                    }
                    Write-Status -Text 'DISM verwendet ohne /Source und ohne /LimitAccess die von Windows konfigurierte Reparaturquelle. Nur jetzt benoetigte Reparaturdaten duerfen ueber Windows Update heruntergeladen werden.' -Stufe 'OK'
                    Set-Gesamtfortschritt -Prozent 18 -Status 'DISM repariert den nachgewiesen beschaedigten Windows-Komponentenspeicher.' -Kategorie 'Windows-Systempruefung' -KategorieProzent 22 -Dauerhaft
                    # Microsoft nennt fuer RestoreHealth keine feste Maximaldauer. Die
                    # Gesamtgrenze bleibt grosszuegig; nur nach 10 Minuten ohne Prozess-,
                    # Kindprozess-, Download- oder Protokollfortschritt wird abgebrochen.
                    $dismErgebnis = Invoke-Native -Datei $dism -Argumente @('/Online', '/Cleanup-Image', '/RestoreHealth', '/NoRestart') -Beschreibung 'Nachgewiesen beschaedigten Windows-Komponentenspeicher mit DISM reparieren' -TimeoutSekunden 21600 -LeerlaufTimeoutSekunden 600 -InstallationsVorgang -AlleKindprozesseAlsAktivitaet -WindowsUpdateDownloadUeberwachen -AktivitaetsPfade @($dismLog, $cbsLog) -ErfolgsCodes @(0) -NeustartCodes @(3010) -FehlerNichtFatal
                    if ($script:NeustartErforderlich) {
                        Add-Resultat -Bereich 'Windows' -Aktion 'Windows-Systemreparatur pausieren' -Status 'DISM verlangt Neustart vor SFC und CHKDSK' -ExitCode 3010 -Details 'Die Windows-Systemphase wird nach dem Neustart erneut sicher aufgenommen.'
                        return
                    }
                    if ($null -ne $dismErgebnis -and $dismErgebnis.Erfolgreich) {
                        Write-Status -Text 'DISM /RestoreHealth wurde erfolgreich abgeschlossen. Die automatische downloadfreie /ScanHealth-Nachpruefung startet jetzt.' -Stufe 'SCHRITT'
                        Set-Gesamtfortschritt -Prozent 20 -Status 'DISM kontrolliert den reparierten Komponentenspeicher downloadfrei.' -Kategorie 'Windows-Systempruefung' -KategorieProzent 35 -Dauerhaft
                        $dismNachpruefungErgebnis = Invoke-Native -Datei $dism -Argumente @('/Online', '/Cleanup-Image', '/ScanHealth', '/NoRestart') -Beschreibung 'Windows-Komponentenspeicher mit DISM downloadfrei nachpruefen' -TimeoutSekunden 10800 -LeerlaufTimeoutSekunden 600 -InstallationsVorgang -AlleKindprozesseAlsAktivitaet -AktivitaetsPfade @($dismLog, $cbsLog) -ErfolgsCodes @(0) -NeustartCodes @(3010) -FehlerNichtFatal
                        if ($script:NeustartErforderlich) {
                            Add-Resultat -Bereich 'Windows' -Aktion 'Windows-Systemreparatur pausieren' -Status 'DISM-Nachpruefung verlangt Neustart vor SFC und CHKDSK' -ExitCode 3010 -Details 'Die Windows-Systemphase wird nach dem Neustart erneut sicher aufgenommen.'
                            return
                        }
                        if ($null -ne $dismNachpruefungErgebnis -and $dismNachpruefungErgebnis.Erfolgreich) {
                            $nachstatus = Get-DismOnlineIntegritaetsstatus
                            if ($nachstatus.Status -eq 'Healthy') {
                                Write-Status -Text 'Die automatische DISM /ScanHealth-Nachpruefung wurde erfolgreich und mit Status Healthy abgeschlossen.' -Stufe 'OK'
                                $windowsFolgepruefungenFreigegeben = $true
                                $downloadErkannt = [bool](Get-SichereEigenschaft -Objekt $dismErgebnis -Name 'DownloadErkannt' -Standardwert $false)
                                $freigabeDetails = 'DISM hatte zuvor Repairable gemeldet; RestoreHealth wurde erfolgreich angewendet; die anschliessende ScanHealth-/CheckHealth-Nachpruefung meldet Healthy.'
                                if ($downloadErkannt) {
                                    $downloadDauer = ConvertTo-LesbareDauer -Sekunden ([double](Get-SichereEigenschaft -Objekt $dismErgebnis -Name 'DownloadDauerSekunden' -Standardwert 0))
                                    $downloadMenge = ConvertTo-LesbareBytemenge -Bytes ([double](Get-SichereEigenschaft -Objekt $dismErgebnis -Name 'DownloadBytes' -Standardwert 0))
                                    $freigabeDetails += " Windows-Update-Reparaturdaten wurden beobachtet: $downloadMenge in $downloadDauer."
                                }
                                else {
                                    $freigabeDetails += ' Ein gesonderter Windows-Update-Download war nicht erforderlich oder wurde von Windows nicht messbar ausgewiesen; DISM bestaetigte trotzdem die erfolgreiche Anwendung der benoetigten Reparaturdaten.'
                                }
                                Add-Resultat -Bereich 'Windows' -Aktion 'SFC und CHKDSK nach DISM freigeben' -Status 'Nur nach nachgewiesener und erfolgreich nachkontrollierter DISM-Reparatur freigegeben' -ExitCode 0 -Details $freigabeDetails
                                Write-Status -Text 'DISM hat einen zuvor gefundenen Windows-Schaden erfolgreich repariert und fehlerfrei nachgeprueft. Erst jetzt werden SFC und CHKDSK als zusaetzliche Kontrollpruefungen ausgefuehrt.' -Stufe 'SCHRITT'
                            }
                            else {
                                $dismNachpruefungErgebnis.Erfolgreich = $false
                                Add-Warnung -Text ("DISM ist nach /RestoreHealth weiterhin nicht fehlerfrei: {0}." -f $nachstatus.Status)
                            }
                        }
                    }
                }
                default { throw "Unerwarteter DISM-Integritaetsstatus: $($integritaetsstatus.Status)" }
            }
        }
    }
    else {
        Add-Warnung -Text "DISM wurde nicht gefunden: $dism"
        if ($BeiFehlerAbbrechen) { throw 'DISM wurde nicht im geschuetzten Windows-Systemverzeichnis gefunden.' }
    }

    if ($windowsFolgepruefungenFreigegeben) {
        if (Test-Path -LiteralPath $sfc -PathType Leaf) {
            Set-Gesamtfortschritt -Prozent 22 -Status 'SFC kontrolliert nach erfolgreicher DISM-Reparatur die Windows-Systemdateien.' -Kategorie 'Windows-Systempruefung' -KategorieProzent 55 -Dauerhaft
            # SFC verwendet Exitcode 1 nicht nur fuer Integritaetsbefunde, sondern
            # auch fuer echte Ausfuehrungsfehler. Nur Exitcode 0 bestaetigt einen
            # abgeschlossenen /scannow-Lauf; Reparaturbefunde stehen im CBS-Log.
            $sfcErgebnis = Invoke-Native -Datei $sfc -Argumente @('/scannow') -Beschreibung 'Windows-Systemdateien nach erfolgreicher DISM-Reparatur mit SFC kontrollieren' -TimeoutSekunden 7200 -LeerlaufTimeoutSekunden 1800 -InstallationsVorgang -AlleKindprozesseAlsAktivitaet -AktivitaetsPfade @($cbsLog) -ErfolgsCodes @(0) -NeustartCodes @() -FehlerNichtFatal
        }
        else {
            Add-Warnung -Text "SFC wurde nicht gefunden: $sfc"
            if ($BeiFehlerAbbrechen) { throw 'SFC wurde nicht im geschuetzten Windows-Systemverzeichnis gefunden.' }
        }

        $systemLaufwerk = [string]$env:SystemDrive
        if (-not [string]::IsNullOrWhiteSpace($systemLaufwerk) -and (Test-Path -LiteralPath $chkdsk -PathType Leaf)) {
            Set-Gesamtfortschritt -Prozent 28 -Status 'CHKDSK kontrolliert nach erfolgreicher DISM-Reparatur das Dateisystem online.' -Kategorie 'Windows-Systempruefung' -KategorieProzent 85 -Dauerhaft
            $chkdskErgebnis = Invoke-Native -Datei $chkdsk -Argumente @($systemLaufwerk, '/scan') -Beschreibung 'Dateisystem nach erfolgreicher DISM-Reparatur mit CHKDSK kontrollieren' -TimeoutSekunden 7200 -LeerlaufTimeoutSekunden 1800 -InstallationsVorgang -AlleKindprozesseAlsAktivitaet -ErfolgsCodes @(0, 1, 2) -NeustartCodes @() -FehlerNichtFatal
        }
        else {
            Add-Warnung -Text "CHKDSK oder das Windows-Systemlaufwerk wurde nicht gefunden: $chkdsk; Laufwerk: $systemLaufwerk"
            if ($BeiFehlerAbbrechen) { throw 'CHKDSK konnte nach der DISM-Reparatur nicht sicher gestartet werden.' }
        }
    }
    else {
        Write-Status -Text 'SFC und CHKDSK werden ausgelassen, weil DISM keinen reparierbaren Windows-Schaden gefunden oder die Reparatur nicht erfolgreich bis zum Status Healthy nachgeprueft hat.' -Stufe 'INFO'
        Add-Resultat -Bereich 'Windows' -Aktion 'SFC und CHKDSK bedarfsgesteuert ausfuehren' -Status 'Ausgelassen' -ExitCode 0 -Details 'Freigabe erfolgt ausschliesslich nach Repairable, erfolgreichem RestoreHealth und abschliessendem Healthy-Status.'
    }

    if (($null -ne $dismVorpruefungErgebnis -and -not $dismVorpruefungErgebnis.Erfolgreich) -or
        ($null -ne $dismErgebnis -and -not $dismErgebnis.Erfolgreich) -or
        ($null -ne $dismNachpruefungErgebnis -and -not $dismNachpruefungErgebnis.Erfolgreich) -or
        ($null -ne $sfcErgebnis -and -not $sfcErgebnis.Erfolgreich) -or
        ($null -ne $chkdskErgebnis -and -not $chkdskErgebnis.Erfolgreich)) {
        Add-Warnung -Text 'Mindestens ein Windows-Reparaturbefehl meldete ein Problem. Details stehen im Abschlussbericht.'
        if ($BeiFehlerAbbrechen) { throw 'Mindestens eine Windows-Systempruefung oder -reparatur ist fehlgeschlagen.' }
    }
    Set-Gesamtfortschritt -Prozent 30 -Status 'Windows-Systempruefung und -reparatur abgeschlossen.' -Kategorie 'Windows-Systempruefung' -KategorieProzent 100 -Dauerhaft
}

function Export-Abschlussbericht {
    try {
        if ([string]::IsNullOrWhiteSpace([string]$script:BerichtOrdner) -or
            -not (Test-Path -LiteralPath $script:BerichtOrdner -PathType Container)) {
            throw 'Der vom Laufzeitstatus getrennte Berichtsordner ist nicht verfuegbar.'
        }
        $zeit = Get-Date -Format 'yyyyMMdd-HHmmss'
        $csv = Join-Path -Path $script:BerichtOrdner -ChildPath ("Ergebnis-$zeit.csv")
        $resultatArray = if ($script:Resultate.Count -gt 0) { @($script:Resultate.ToArray()) } else { @() }
        if ($resultatArray.Count -gt 0) {
            $resultatArray | Export-Csv -LiteralPath $csv -NoTypeInformation -Encoding UTF8
        }
        else {
            '"Zeitpunkt","Bereich","Aktion","Status","ExitCode","Details"' | Set-Content -LiteralPath $csv -Encoding UTF8
        }

        $txt = Join-Path -Path $script:BerichtOrdner -ChildPath ("Zusammenfassung-$zeit.txt")
        $inhalt = New-Object 'System.Collections.Generic.List[string]'
        $inhalt.Add('OneClick-Komplettreparatur-Release-v1.0.0 - Zusammenfassung') | Out-Null
        $inhalt.Add(('Version: {0}' -f $script:Version)) | Out-Null
        $inhalt.Add(('Zeitpunkt: {0}' -f (Get-Date))) | Out-Null
        $inhalt.Add(('PowerShell: {0}' -f $PSVersionTable.PSVersion)) | Out-Null
        $inhalt.Add(('Erfolgreich aktualisierte Pakete: {0}' -f $script:AktualisiertePakete)) | Out-Null
        $inhalt.Add(('Bereits aktuelle oder nicht mehr anwendbare Pakete: {0}' -f $script:BereitsAktuellePakete)) | Out-Null
        $inhalt.Add(('Fehlgeschlagene Paket-Aktualisierungen: {0}' -f $script:FehlgeschlageneUpdates)) | Out-Null
        $inhalt.Add(('Bewusst uebersprungene oder benutzerabhaengige Aktualisierungen: {0}' -f $script:UebersprungeneUpdates)) | Out-Null
        $inhalt.Add(('Sicher ausgelassene WinGet-Updatezeilen: {0}' -f $script:UnsichereUpdateZeilen)) | Out-Null
        $inhalt.Add(('Sicher ausgelassene Update-Kontexte: {0}' -f $script:AusgelasseneUpdateKontexte)) | Out-Null
        $inhalt.Add(('Erfolgreich nachkontrollierte Updates: {0}' -f $script:NachkontrollierteUpdates)) | Out-Null
        $inhalt.Add(('Fehlgeschlagene Update-Nachkontrollen: {0}' -f $script:FehlgeschlageneUpdateNachkontrollen)) | Out-Null
        $inhalt.Add(('Erfolgreich reparierte WinGet-Pakete: {0}' -f $script:RepariertePakete)) | Out-Null
        $inhalt.Add(('Nicht unterstuetzte Paket-Reparaturen: {0}' -f $script:NichtUnterstuetzteReparaturen)) | Out-Null
        $inhalt.Add(('Fehlgeschlagene Paket-Reparaturen: {0}' -f $script:FehlgeschlageneReparaturen)) | Out-Null
        $inhalt.Add(('Erfolgreich nachkontrollierte WinGet-Reparaturen: {0}' -f $script:NachkontrollierteReparaturen)) | Out-Null
        $inhalt.Add(('Fehlgeschlagene WinGet-Reparatur-Nachkontrollen: {0}' -f $script:FehlgeschlageneReparaturNachkontrollen)) | Out-Null
        $inhalt.Add(('Erfolgreich heruntergeladene Installationspakete: {0}' -f $script:HeruntergeladeneInstallationspakete)) | Out-Null
        $inhalt.Add(('Fehlgeschlagene Installer-Downloads: {0}' -f $script:FehlgeschlageneInstallerDownloads)) | Out-Null
        $inhalt.Add(('Erfolgreiche Neuinstallationen: {0}' -f $script:ErfolgreicheNeuinstallationen)) | Out-Null
        $inhalt.Add(('Fehlgeschlagene Neuinstallationen: {0}' -f $script:FehlgeschlageneNeuinstallationen)) | Out-Null
        $inhalt.Add(('Uebersprungene Neuinstallationen: {0}' -f $script:UebersprungeneNeuinstallationen)) | Out-Null
        $inhalt.Add(('Nach Reparatur und Neuinstallation unbehobene Programme: {0}' -f $script:UnbehobeneProgrammfehler)) | Out-Null
        $inhalt.Add(('Unaufgeloeste beschaedigte Registry-Programme: {0}' -f $script:UnaufgeloesteRegistryProgramme)) | Out-Null
        $inhalt.Add(('Gepruefte Registry-Programme: {0}' -f $script:GepruefteRegistryProgramme)) | Out-Null
        $inhalt.Add(('Programme mit Beschaedigungsverdacht: {0}' -f $script:ProgrammeMitBeschaedigungsverdacht)) | Out-Null
        $inhalt.Add(('Nicht vollstaendig automatisch pruefbare Programme: {0}' -f $script:NichtVollstaendigPruefbareProgramme)) | Out-Null
        $inhalt.Add(('Sicher ausgeschlossene Registry-Programme: {0}' -f $script:SicherAusgeschlosseneRegistryProgramme)) | Out-Null
        $inhalt.Add(('MSI-Integritaetspruefungen: {0}' -f $script:MSIPruefungen)) | Out-Null
        $inhalt.Add(('Erfolgreiche MSI-Pruefungen/Reparaturen: {0}' -f $script:ErfolgreicheMSIReparaturen)) | Out-Null
        $inhalt.Add(('Fehlgeschlagene MSI-Pruefungen/Reparaturen: {0}' -f $script:FehlgeschlageneMSIReparaturen)) | Out-Null
        $inhalt.Add(('Erfolgreich nachkontrollierte MSI-Reparaturen: {0}' -f $script:NachkontrollierteMSIReparaturen)) | Out-Null
        $inhalt.Add(('Fehlgeschlagene oder ausstehende MSI-Nachkontrollen: {0}' -f $script:FehlgeschlageneMSINachkontrollen)) | Out-Null
        $inhalt.Add(('MSI-Pakete ohne Reparaturbedarf: {0}' -f $script:MSIOhneReparaturbedarf)) | Out-Null
        $inhalt.Add(('MSI-Vollreparatur aktiviert: {0}' -f ([bool]$AlleMSIReparieren))) | Out-Null
        $inhalt.Add(('Gepruefte WinGet-Pakete: {0}' -f $script:GepruefteWinGetPakete)) | Out-Null
        $inhalt.Add(('Programme mit erforderlicher manueller Herstellerpruefung: {0}' -f $script:ProgrammeMitManuellerPruefung)) | Out-Null
        $inhalt.Add(('Ignorierte fremde parallele Installer: {0}' -f $script:FremdeInstallerIgnoriert)) | Out-Null
        $inhalt.Add(('Installations-Leerlaufabbrueche: {0}' -f $script:InstallationsLeerlaufAbbrueche)) | Out-Null
        $inhalt.Add(('Aktuelle Tiefenpruefpunkte wiederverwendet: {0}' -f $script:AktuelleReparaturPruefungenWiederverwendet)) | Out-Null
        $inhalt.Add(('Vorabdownloads ohne erneuten Netzwerkdownload wiederverwendet: {0}' -f $script:VorabDownloadsWiederverwendet)) | Out-Null
        $inhalt.Add(('Desktop-Verknuepfungen erstellt: {0}' -f $script:DesktopVerknuepfungenErstellt)) | Out-Null
        $inhalt.Add(('Desktop-Verknuepfungen bereits vorhanden: {0}' -f $script:DesktopVerknuepfungenVorhanden)) | Out-Null
        $inhalt.Add(('Desktop-Verknuepfungen nicht anwendbar: {0}' -f $script:DesktopVerknuepfungenNichtAnwendbar)) | Out-Null
        $inhalt.Add(('Fehlgeschlagene Desktop-Verknuepfungen: {0}' -f $script:DesktopVerknuepfungenFehlgeschlagen)) | Out-Null
        $inhalt.Add(('Bereinigte laufbezogene Restdateien: {0}' -f $script:BereinigteRestdateien)) | Out-Null
        $inhalt.Add(('Bereinigte laufbezogene Restordner: {0}' -f $script:BereinigteRestordner)) | Out-Null
        $inhalt.Add(('Bereinigte laufbezogene Restdaten: {0}' -f (ConvertTo-LesbareBytemenge -Bytes ([double]$script:BereinigteRestbytes)))) | Out-Null
        $inhalt.Add(('Fehler der Abschlussbereinigung: {0}' -f $script:Bereinigungsfehler)) | Out-Null
        $inhalt.Add(('Abschlussbereinigung ausgefuehrt: {0}' -f $script:AbschlussbereinigungAusgefuehrt)) | Out-Null
        $inhalt.Add(('Abschlussbereinigung verifiziert: {0}' -f $script:AbschlussbereinigungVerifiziert)) | Out-Null
        $inhalt.Add(('Verifizierter entfernter Installationsordner: {0}' -f $script:InstallationsOrdner)) | Out-Null
        $inhalt.Add(('Warnungen: {0}' -f $script:Warnungen.Count)) | Out-Null
        $inhalt.Add(('Aktive dauerhafte WinGet-Hashquarantaenen: {0}' -f @(Get-WinGetUpdateQuarantaene).Count)) | Out-Null
        $inhalt.Add(('Getrennte WinGet-Quarantaenedatei: {0}' -f $script:WinGetQuarantaeneDatei)) | Out-Null
        $inhalt.Add('Leerlaufwaechter: Programme 10,00 Minuten; MSI 15,00 Minuten; DISM RestoreHealth 10,00 Minuten; DISM ScanHealth 10,00 Minuten; SFC/CHKDSK 30,00 Minuten ohne messbaren Fortschritt') | Out-Null
        $inhalt.Add(('Neustart erforderlich: {0}' -f $script:NeustartErforderlich)) | Out-Null
        $inhalt.Add('Laufzeitprotokoll: nach dem Abschluss verifiziert geloescht') | Out-Null
        $inhalt.Add('Paket-Pruefstatus: wird nur bei Exitcode 0 nach allen Abschlusspruefungen geloescht') | Out-Null
        $inhalt.Add(('Getrennter Berichtsordner: {0}' -f $script:BerichtOrdner)) | Out-Null
        $inhalt.Add('Berichtsaufbewahrung: 3 Tage; danach automatische Uebergabe an den Windows-Papierkorb') | Out-Null
        if ($script:Warnungen.Count -gt 0) {
            $inhalt.Add('') | Out-Null
            $inhalt.Add('Warnungen:') | Out-Null
            foreach ($warnung in $script:Warnungen.ToArray()) {
                $inhalt.Add('- ' + [string]$warnung) | Out-Null
            }
        }
        $inhalt.ToArray() | Set-Content -LiteralPath $txt -Encoding UTF8

        Write-Status -Text ("Ergebnisbericht gespeichert: {0}" -f $csv) -Stufe 'OK'
        Write-Status -Text ("Zusammenfassung gespeichert: {0}" -f $txt) -Stufe 'OK'
    }
    catch {
        Write-Status -Text ('Abschlussbericht konnte nicht vollstaendig geschrieben werden: {0}' -f $_.Exception.Message) -Stufe 'FEHLER'
        throw
    }
}

function Invoke-InternerSelbsttest {
    Write-Status -Text 'Interner Laufzeit-Selbsttest wird ausgefuehrt.' -Stufe 'SCHRITT'

    $mitName = [pscustomobject]@{ DisplayName = 'Testprogramm'; DisplayVersion = '1.0'; Publisher = 'Test' }
    $ohneName = [pscustomobject]@{ DisplayVersion = '2.0' }
    $programm = ConvertTo-RegistryProgramm -Eintrag $mitName -RegistryPfad 'Testpfad'
    $keinProgramm = ConvertTo-RegistryProgramm -Eintrag $ohneName -RegistryPfad 'Testpfad'
    Assert-Selbsttest -Bedingung ($null -ne $programm -and $programm.DisplayName -eq 'Testprogramm') -Meldung 'Registry-Eintrag mit DisplayName wurde nicht korrekt verarbeitet.'
    Assert-Selbsttest -Bedingung ($null -eq $keinProgramm) -Meldung 'Registry-Eintrag ohne DisplayName wurde nicht sicher uebersprungen.'
    Assert-Selbsttest -Bedingung ((Get-SichererText -Objekt $ohneName -Name 'DisplayName') -eq '') -Meldung 'Fehlende Objekteigenschaft wurde unter StrictMode nicht sicher behandelt.'

    $testProductCode = '{12345678-1234-1234-1234-1234567890AB}'
    $msiEintrag = [pscustomobject]@{
        DisplayName = 'MSI-Testprogramm'
        WindowsInstaller = 1
        SystemComponent = 0
        NoRepair = 0
    }
    $msiProgramm = ConvertTo-RegistryProgramm -Eintrag $msiEintrag -RegistryPfad ("HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Uninstall\{0}" -f $testProductCode)
    Assert-Selbsttest -Bedingung ($null -ne $msiProgramm -and $msiProgramm.ProductCode -eq $testProductCode -and $msiProgramm.Scope -eq 'machine') -Meldung 'MSI-Produktcode oder Installationsscope wurde nicht korrekt aus dem Registry-Pfad ermittelt.'

    $msiEintragMitBefehlsCode = [pscustomobject]@{
        DisplayName = 'MSI-Testprogramm ohne GUID-Schluessel'
        WindowsInstaller = 1
        UninstallString = ('MsiExec.exe /X{0}' -f $testProductCode)
        SystemComponent = 0
        NoRepair = 0
    }
    $msiProgrammMitBefehlsCode = ConvertTo-RegistryProgramm -Eintrag $msiEintragMitBefehlsCode -RegistryPfad 'HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Uninstall\HerstellerProdukt'
    Assert-Selbsttest -Bedingung ($null -ne $msiProgrammMitBefehlsCode -and $msiProgrammMitBefehlsCode.ProductCode -eq $testProductCode) -Meldung 'MSI-Produktcode wurde nicht aus einem eindeutigen MsiExec-Registrybefehl erkannt.'

    $nichtMsiGuidEintrag = [pscustomobject]@{
        DisplayName = 'Nicht-MSI-Bundle mit GUID-Schluessel'
        WindowsInstaller = 0
        UninstallString = 'C:\Hersteller\BundleUninstall.exe /uninstall'
        SystemComponent = 0
        NoRepair = 0
    }
    $nichtMsiGuidProgramm = ConvertTo-RegistryProgramm -Eintrag $nichtMsiGuidEintrag -RegistryPfad ("HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Uninstall\{0}" -f $testProductCode)
    Assert-Selbsttest -Bedingung ($null -ne $nichtMsiGuidProgramm -and [string]::IsNullOrWhiteSpace([string]$nichtMsiGuidProgramm.ProductCode)) -Meldung 'Ein GUID-foermiger Nicht-MSI-Uninstall-Schluessel wurde faelschlich als reparierbarer MSI-Produktcode eingestuft.'

    $abweichenderProductCode = '{ABCDEFAB-1234-5678-9ABC-ABCDEFABCDEF}'
    $widerspruechlicherMsiEintrag = [pscustomobject]@{
        DisplayName = 'MSI-Eintrag mit widerspruechlichem Produktcode'
        WindowsInstaller = 1
        UninstallString = ('MsiExec.exe /X{0}' -f $abweichenderProductCode)
        SystemComponent = 0
        NoRepair = 0
    }
    $widerspruechlichesMsiProgramm = ConvertTo-RegistryProgramm -Eintrag $widerspruechlicherMsiEintrag -RegistryPfad ("HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Uninstall\{0}" -f $testProductCode)
    Assert-Selbsttest -Bedingung ($null -ne $widerspruechlichesMsiProgramm -and [string]::IsNullOrWhiteSpace([string]$widerspruechlichesMsiProgramm.ProductCode)) -Meldung 'Widerspruechliche MSI-Produktcodes aus Registryschluessel und Befehlswert wurden fuer eine automatische Reparatur freigegeben.'

    $fehlenderOrdner = Join-Path -Path ([IO.Path]::GetTempPath()) -ChildPath ('OneClick-nicht-vorhanden-' + [Guid]::NewGuid().ToString('N'))
    $defekterEintrag = [pscustomobject]@{
        DisplayName = 'Defektes Testprogramm'
        InstallLocation = $fehlenderOrdner
        DisplayIcon = (Join-Path -Path $fehlenderOrdner -ChildPath 'Defekt.exe')
        SystemComponent = 0
        WindowsInstaller = 0
    }
    $defektesProgramm = ConvertTo-RegistryProgramm -Eintrag $defekterEintrag -RegistryPfad 'HKEY_CURRENT_USER\Software\Test\Defekt'
    $defektPruefung = Test-RegistryProgrammIntegritaet -Programm $defektesProgramm
    Assert-Selbsttest -Bedingung ([bool](Get-SichereEigenschaft -Objekt $defektPruefung -Name 'Beschaedigungsverdacht' -Standardwert $false)) -Meldung 'Ein eindeutig fehlender registrierter Installationsordner wurde nicht als Beschaedigungsverdacht erkannt.'
    Assert-Selbsttest -Bedingung (-not (Test-MSIReparaturSollAusgefuehrtWerden -MSIPruefbar $true -Beschaedigungsverdacht $false -Vollmodus $false)) -Meldung 'Ein unauffaelliges MSI-Paket wuerde im sicheren Standardmodus invasiv repariert.'
    Assert-Selbsttest -Bedingung (Test-MSIReparaturSollAusgefuehrtWerden -MSIPruefbar $true -Beschaedigungsverdacht $true -Vollmodus $false) -Meldung 'Ein beschaedigtes MSI-Paket wurde nicht fuer die Reparatur freigegeben.'
    Assert-Selbsttest -Bedingung (Test-MSIReparaturSollAusgefuehrtWerden -MSIPruefbar $true -Beschaedigungsverdacht $false -Vollmodus $true) -Meldung 'Der ausdrueckliche MSI-Vollmodus wurde nicht beruecksichtigt.'

    $namensListe = @'
Name                 ID                       Version    Quelle
----------------------------------------------------------------
Beispiel Anwendung   Hersteller.Beispiel      1.0.0      winget
'@
    $zugeordneteId = Get-WinGetPaketIdAusExakterNamensliste -Text $namensListe -ErwarteterName 'Beispiel Anwendung' -Quelle 'winget'
    Assert-Selbsttest -Bedingung ($zugeordneteId -eq 'Hersteller.Beispiel') -Meldung 'Eine exakte Registry-Programmbezeichnung konnte keiner eindeutigen WinGet-Paket-ID zugeordnet werden.'
    Assert-Selbsttest -Bedingung ([string]::IsNullOrWhiteSpace((Get-WinGetPaketIdAusExakterNamensliste -Text $namensListe -ErwarteterName 'Andere Anwendung' -Quelle 'winget'))) -Meldung 'Eine nicht passende Programmbezeichnung wurde faelschlich einer WinGet-Paket-ID zugeordnet.'
    $namensListeOhneQuelle = @'
Name                 ID                       Version
------------------------------------------------------
Beispiel Anwendung   Hersteller.Beispiel      1.0.0
'@
    Assert-Selbsttest -Bedingung ((Get-WinGetPaketIdAusExakterNamensliste -Text $namensListeOhneQuelle -ErwarteterName 'Beispiel Anwendung' -Quelle 'winget') -eq 'Hersteller.Beispiel') -Meldung 'Eine mit --source begrenzte exakte Namensliste ohne redundante Quellenspalte wurde nicht zugeordnet.'

    $json = Get-JsonObjektAusText -Text ('Hinweis' + [Environment]::NewLine + '{"Name":"winget","Arg":"https://cdn.winget.microsoft.com/cache"}' + [Environment]::NewLine + 'Ende')
    Assert-Selbsttest -Bedingung ($null -ne $json -and (Get-SichererText -Objekt $json -Name 'Name') -eq 'winget') -Meldung 'JSON mit vorangestelltem Hinweis konnte nicht extrahiert werden.'

    $clixml1 = ConvertTo-BereinigteAusgabe -Text '#< CLIXML`n<Objs Version="1.1.0.1" xmlns="http://schemas.microsoft.com/powershell/2004/04"><Obj S="progress" /></Objs>'
    $clixml2 = ConvertTo-BereinigteAusgabe -Text '<Objs Version="1.1.0.1" xmlns="http://schemas.microsoft.com/powershell/2004/04"><Obj S="progress" /></Objs>'
    Assert-Selbsttest -Bedingung ($clixml1 -notmatch '<Objs' -and $clixml2 -notmatch '<Objs') -Meldung 'CLIXML-Fortschrittsdaten wurden nicht unterdrueckt.'

    $liste = New-Object 'System.Collections.Generic.List[object]'
    $liste.Add([pscustomobject]@{ A = 1 }) | Out-Null
    $array = @($liste.ToArray())
    Assert-Selbsttest -Bedingung ($array.Count -eq 1) -Meldung 'Generic.List konnte nicht sicher in ein Array umgewandelt werden.'

    $sourceOhneDetails = [pscustomobject]@{ Packages = @([pscustomobject]@{ PackageIdentifier = 'Test.Unbekannt' }) }
    $sourceName = ''
    $sourceDetails = Get-SichereEigenschaft -Objekt $sourceOhneDetails -Name 'SourceDetails' -Standardwert $null
    $detailsName = Get-SichererText -Objekt $sourceDetails -Name 'Name'
    if (-not [string]::IsNullOrWhiteSpace($detailsName)) { $sourceName = $detailsName }
    Assert-Selbsttest -Bedingung ([string]::IsNullOrWhiteSpace($sourceName)) -Meldung 'Eine Quelle ohne SourceDetails wurde faelschlich als offizielle winget-Quelle eingestuft.'

    $vertrauenArray = @((Get-SichereEigenschaft -Objekt ([pscustomobject]@{ TrustLevel = @('Trusted', 'StoreOrigin') }) -Name 'TrustLevel' -Standardwert @()) | ForEach-Object { [string]$_ })
    $vertrauenText = @((Get-SichereEigenschaft -Objekt ([pscustomobject]@{ TrustLevel = 'Trusted' }) -Name 'TrustLevel' -Standardwert @()) | ForEach-Object { [string]$_ })
    Assert-Selbsttest -Bedingung (($vertrauenArray -contains 'Trusted') -and ($vertrauenText -contains 'Trusted')) -Meldung 'TrustLevel wurde nicht fuer Array- und Textform sicher verarbeitet.'

    $nichtVertrauenswuerdig = @((Get-SichereEigenschaft -Objekt ([pscustomobject]@{ TrustLevel = @() }) -Name 'TrustLevel' -Standardwert @()) | ForEach-Object { [string]$_ }) -join '|'
    Assert-Selbsttest -Bedingung ([string]::IsNullOrWhiteSpace($nichtVertrauenswuerdig)) -Meldung 'Eine Quelle ohne Vertrauensangabe wurde nicht als unverifiziert erkannt.'

    $teilStatus = [pscustomobject]@{ Winget = $true; MsStore = $false; MindestensEine = $true }
    $teilWinget = [bool](Get-SichereEigenschaft -Objekt $teilStatus -Name 'Winget' -Standardwert $false)
    $teilStore = [bool](Get-SichereEigenschaft -Objekt $teilStatus -Name 'MsStore' -Standardwert $false)
    Assert-Selbsttest -Bedingung ($teilWinget -and -not $teilStore) -Meldung 'Teilweise verfuegbare offizielle Quellen wurden nicht unabhaengig verarbeitet.'

    $fortschritt0 = Get-FortschrittsbalkenText -Prozent 0 -Breite 10
    $fortschritt50 = Get-FortschrittsbalkenText -Prozent 50 -Breite 10
    $fortschritt100 = Get-FortschrittsbalkenText -Prozent 100 -Breite 10
    Assert-Selbsttest -Bedingung ($fortschritt0 -eq '[----------]') -Meldung 'Fortschrittsbalken fuer 0 Prozent ist fehlerhaft.'
    Assert-Selbsttest -Bedingung ($fortschritt50 -eq '[#####-----]') -Meldung 'Fortschrittsbalken fuer 50 Prozent ist fehlerhaft.'
    Assert-Selbsttest -Bedingung ($fortschritt100 -eq '[##########]') -Meldung 'Fortschrittsbalken fuer 100 Prozent ist fehlerhaft.'

    $fortschrittszeile = Get-Fortschrittszeile -Prozent 42 -Status ("Mehrzeilig`r`nmit Umbruch") -Breite 10
    Assert-Selbsttest -Bedingung ($fortschrittszeile -eq '[####------]  42%  Mehrzeilig  mit Umbruch') -Meldung 'Fortschrittsstatus wurde nicht sicher in eine einzelne Textzeile umgewandelt.'
    Assert-Selbsttest -Bedingung ($fortschrittszeile -notmatch "[`r`n]") -Meldung 'Fortschrittszeile enthaelt einen Zeilenumbruch.'
    Assert-Selbsttest -Bedingung ((Get-FortschrittsbalkenText -Prozent -50 -Breite 10) -eq '[----------]') -Meldung 'Negative Prozentwerte wurden nicht auf 0 begrenzt.'
    Assert-Selbsttest -Bedingung ((Get-FortschrittsbalkenText -Prozent 150 -Breite 10) -eq '[##########]') -Meldung 'Prozentwerte ueber 100 wurden nicht auf 100 begrenzt.'
    $zweistufig = Get-ZweistufigeFortschrittszeile -GesamtProzent 42 -Kategorie 'Programmtest' -KategorieProzent 75 -Status 'Einzelschritt'
    Assert-Selbsttest -Bedingung ($zweistufig -match '^Gesamt ' -and $zweistufig -match ' 42%' -and $zweistufig -match 'Programmtest' -and $zweistufig -match ' 75%' -and $zweistufig -match 'Einzelschritt$') -Meldung 'Gesamt- und Kategorie-Fortschritt werden nicht gemeinsam dargestellt.'
    Assert-Selbsttest -Bedingung ($zweistufig -notmatch "[`r`n]") -Meldung 'Die zweistufige Fortschrittszeile enthaelt einen Zeilenumbruch.'
    $umbruchTest = @(Split-KonsolentextFuerFenster -Text ('Fensterabhaengiger Zeilenumbruch ' * 8) -Breite 40)
    Assert-Selbsttest -Bedingung ($umbruchTest.Count -gt 1 -and @($umbruchTest | Where-Object { $_.Length -gt 40 }).Count -eq 0) -Meldung 'Der fensterabhaengige PowerShell-Zeilenumbruch begrenzt lange Zeilen nicht korrekt.'
    $minutenTest = ConvertTo-LesbareDauer -Sekunden 90
    Assert-Selbsttest -Bedingung ($minutenTest -match '^1[,.]50 Minuten$' -and $minutenTest -notmatch '(?i)Sekund') -Meldung 'Zeitangaben werden nicht einheitlich in Minuten angezeigt.'
    Assert-Selbsttest -Bedingung ((ConvertFrom-DismImageHealthState -Wert 'DismImageHealthy') -eq 'Healthy' -and (ConvertFrom-DismImageHealthState -Wert '1') -eq 'Repairable' -and (ConvertFrom-DismImageHealthState -Wert 'NonRepairable') -eq 'NonRepairable' -and [string]::IsNullOrWhiteSpace((ConvertFrom-DismImageHealthState -Wert 'Unbekannt'))) -Meldung 'DISM-Integritaetszustaende werden nicht sprachunabhaengig und eindeutig klassifiziert.'
    $zukuenftigeWinGetVersion = ConvertFrom-WinGetVersionsausgabe -Text 'v12.34.56'
    Assert-Selbsttest -Bedingung ($null -ne $zukuenftigeWinGetVersion -and $zukuenftigeWinGetVersion -eq [Version]'12.34.56') -Meldung 'Eine zukuenftige WinGet-Hauptversion wird von der Versionsauswertung nicht akzeptiert.'
    $neuesterWinGetTest = Select-NeuesteWinGetKandidat -Kandidaten @(
        [pscustomobject]@{ Pfad = 'C:\Geschuetzt\winget-alt.exe'; Version = [Version]'1.29.280'; IstBenutzerAlias = $false },
        [pscustomobject]@{ Pfad = 'C:\Alias\winget.exe'; Version = [Version]'12.34.56'; IstBenutzerAlias = $true },
        [pscustomobject]@{ Pfad = 'C:\Geschuetzt\winget-neu.exe'; Version = [Version]'12.34.56'; IstBenutzerAlias = $false }
    )
    Assert-Selbsttest -Bedingung ($null -ne $neuesterWinGetTest -and $neuesterWinGetTest.Pfad -eq 'C:\Geschuetzt\winget-neu.exe') -Meldung 'Die hoechste verifizierte WinGet-Version oder ihr geschuetzter Paketpfad wird nicht bevorzugt.'

    $skriptText = Get-Content -LiteralPath $script:SelfPath -Raw -Encoding UTF8 -ErrorAction Stop
    Assert-Selbsttest -Bedingung ($skriptText -match '\$BeiFehlerAbbrechen\s*=\s*-not\s+\[bool\]\$FehlerFortsetzen') -Meldung 'Der Gesamtlauf bricht bei einem bestaetigten Fehler nicht standardmaessig ab.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?s)function Initialize-Protokollierung\b.+?OneClick-ProgrammReparatur-Quarantaene.+?Hauptlauf-WinGet-Update-Quarantaene\.json.+?Benutzerlauf-WinGet-Update-Quarantaene\.json' -and $skriptText -match '(?m)^function Assert-WinGetQuarantaenePfadSicher\b') -Meldung 'Die dauerhafte, vom loeschbaren Laufzeitordner getrennte WinGet-Hashquarantaene fehlt.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?s)function Test-WinGetUpdateVorab\b.+?\$hashFehlerFestgestellt.+?source'', ''update''.+?Remove-KontrolliertenInstallerOrdner.+?Update-Vorabpruefung-.+?Frischer Kontroll-Download nach Quellenaktualisierung' -and $skriptText -match '(?s)function Update-InstallierteProgramme\b.+?Update-Vorabpruefung fuer.+?weitere Programme wird fortgesetzt.+?continue') -Meldung 'Die sichere Quellenaktualisierung, der frische Hash-Kontroll-Download oder die paketweise Fortsetzung nach einer Hashabweichung fehlt.'
    $selbsttestTokens = $null
    $selbsttestParseFehler = $null
    $selbsttestAst = [System.Management.Automation.Language.Parser]::ParseFile($script:SelfPath, [ref]$selbsttestTokens, [ref]$selbsttestParseFehler)
    Assert-Selbsttest -Bedingung ($selbsttestParseFehler.Count -eq 0) -Meldung 'Der Syntaxbaum fuer die Sicherheitspruefung konnte nicht fehlerfrei erstellt werden.'
    $hashBypassOptionFuerAst = '--ignore-' + 'security-hash'
    $hashBypassAufrufe = @($selbsttestAst.FindAll({
        param($knoten)
        if ($knoten -isnot [System.Management.Automation.Language.CommandAst]) { return $false }
        if ([string]$knoten.GetCommandName() -ne 'Invoke-Native') { return $false }
        $aufrufText = [string]$knoten.Extent.Text
        return (
            (
                $aufrufText -match '(?i)["''](?:download|install|update|upgrade|repair)["'']' -and
                $aufrufText -match ("(?i)[`"']{0}[`"']" -f [regex]::Escape($hashBypassOptionFuerAst))
            ) -or (
                $aufrufText -match '(?i)["'']download["'']' -and
                $aufrufText -match '(?i)["'']--force["'']'
            )
        )
    }, $true))
    Assert-Selbsttest -Bedingung ($hashBypassAufrufe.Count -eq 0) -Meldung 'Eine Installer-Hashpruefung koennte durch einen ausfuehrbaren Downloadaufruf umgangen werden.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?s)function Repair-InstallierteProgramme\b.+?Test-WinGetPaketIstQuarantiniert.+?naechstes Programm wird repariert.+?continue' -and $skriptText -notmatch 'Update-Vorabpruefung fuer ''\{0\}'' fehlgeschlagen[^\r\n]+throw') -Meldung 'Quarantinierte oder fehlerhafte Einzelpakete koennten die Reparatur der folgenden Programme noch abbrechen.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?s)function Get-SichereProgrammMethodenMatrix\b.+?WinGet.+?RegistryOnline.+?MSI.+?AppX' -and $skriptText -match '(?s)function Update-InstallierteProgramme\b.+?Get-SichereProgrammMethodenMatrix' -and $skriptText -match '(?s)function Repair-InstallierteProgramme\b.+?Get-SichereProgrammMethodenMatrix' -and $skriptText -match '(?s)function Test-UndRepariereAlleRegistryProgramme\b.+?Get-SichereProgrammMethodenMatrix') -Meldung 'Die zentrale Methoden-Matrix ist nicht verbindlich in Update, WinGet-Reparatur und Registry-/MSI-Pruefung eingebunden.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?s)function Get-WinGetZuordnungFuerRegistryProgramm\b.+?Publisher.+?show.+?Test-HerausgeberIdentitaetUebereinstimmung.+?RegistryOnline') -Meldung 'Der sichere Registry-Onlinefallback bestaetigt nicht Name, Paket-ID und Herausgeberidentitaet gemeinsam.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?s)function Invoke-DownloadUndNeuinstallation\b.+?Get-WinGetManifestVersion.+?Test-WinGetUpdateIstQuarantiniert.+?Test-WinGetUpdateVorab.+?BehaltenFuerFallback') -Meldung 'Ein Neuinstallationsfallback koennte die zentrale Manifest-, Hash- und Quarantaene-Vorabpruefung umgehen.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?s)function Update-InstallierteProgramme\b.+?try\s*\{\s*\$vorab\s*=\s*Test-WinGetUpdateVorab.+?catch.+?weitere Programme.+?continue' -and $skriptText -match '(?s)function Repair-InstallierteProgramme\b.+?try\s*\{\s*\$reparaturVorab\s*=\s*Test-WinGetUpdateVorab.+?catch.+?weitere Programme.+?continue') -Meldung 'Unerwartete paketbezogene Vorabpruefungsausnahmen koennten eine Update- oder Reparaturfolge noch abbrechen.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?m)^function Invoke-DownloadUndNeuinstallationPaketIsoliert\b' -and $skriptText -match '(?m)^function Get-WinGetZuordnungFuerRegistryProgrammPaketIsoliert\b' -and $skriptText -match '(?s)function Test-UndRepariereAlleRegistryProgramme\b.+?Get-WinGetZuordnungFuerRegistryProgrammPaketIsoliert.+?Invoke-DownloadUndNeuinstallationPaketIsoliert') -Meldung 'Registry-Zuordnungs- oder Neuinstallationsausnahmen sind nicht durchgaengig paketweise isoliert.'
    $matrixWinGetTest = Get-SichereProgrammMethodenMatrix -Typ 'WinGet' -Id 'Hersteller.Paket' -Quelle 'winget' -Scope 'user'
    $matrixRegistryOnlineTest = Get-SichereProgrammMethodenMatrix -Typ 'RegistryOnline' -Id 'Hersteller.Paket' -Quelle 'winget' -Scope 'machine' -DisplayName 'Beispiel' -Publisher 'Beispiel GmbH' -HerausgeberBestaetigt $true
    Assert-Selbsttest -Bedingung ([bool]$matrixWinGetTest.OnlineAktionFreigegeben -and [bool]$matrixRegistryOnlineTest.OnlineAktionFreigegeben) -Meldung 'Gueltige eindeutige WinGet- oder Registry-Onlinekontexte werden von der Methoden-Matrix nicht freigegeben.'
    Assert-Selbsttest -Bedingung (-not [bool](Get-SichereProgrammMethodenMatrix -Typ 'RegistryOnline' -Id 'Hersteller.Paket' -Quelle 'winget' -Scope 'machine' -DisplayName 'Beispiel' -Publisher 'Beispiel GmbH' -HerausgeberBestaetigt $false).OnlineAktionFreigegeben) -Meldung 'Die Methoden-Matrix erlaubt einen Registry-Onlinefallback ohne bestaetigten Herausgeber.'
    Assert-Selbsttest -Bedingung ((Test-HerausgeberIdentitaetUebereinstimmung -InstallierterHerausgeber 'Beispiel GmbH' -ManifestHerausgeber 'Beispiel') -and -not (Test-HerausgeberIdentitaetUebereinstimmung -InstallierterHerausgeber 'Beispiel GmbH' -ManifestHerausgeber 'Fremder Herausgeber')) -Meldung 'Die strikte Herausgeberidentitaetspruefung arbeitet nicht korrekt.'
    Assert-Selbsttest -Bedingung ($skriptText -match '\$befehl\s*\+=\s*'' -FehlerFortsetzen''' -and $skriptText -match '\$argumente\.Add\(''-FehlerFortsetzen''\)') -Meldung 'Der ausdrueckliche Diagnosemodus wird bei kontrollierten Neustarts nicht weitergegeben.'
    Assert-Selbsttest -Bedingung ($skriptText -notmatch '(?m)^\s*Write-Progress\b') -Meldung 'Die fehleranfaellige integrierte Progress-UI ist noch aktiv.'
    Assert-Selbsttest -Bedingung ($skriptText -notmatch 'Invoke-Native\s+-Datei\s+[''"]msiexec\.exe[''"]') -Meldung 'Der Windows-Installer wird noch ueber eine unsichere PATH-Aufloesung gestartet.'
    Assert-Selbsttest -Bedingung ($skriptText -match 'Get-WindowsSystemdateiPfad\s+-Dateiname\s+[''"]msiexec\.exe[''"]') -Meldung 'Der vertrauenswuerdig aufgeloeste Windows-Systempfad fuer msiexec.exe fehlt.'
    Assert-Selbsttest -Bedingung ($skriptText -match '\$sfcErgebnis\s*=\s*Invoke-Native[^\r\n]+-ErfolgsCodes\s+@\(0\)\s+-NeustartCodes') -Meldung 'SFC akzeptiert nicht ausschliesslich den bestaetigten Abschlusscode 0.'
    Assert-Selbsttest -Bedingung ($skriptText -notmatch '\$sfcErgebnis\s*=\s*Invoke-Native[^\r\n]+-ErfolgsCodes\s+@\(0,\s*1\)') -Meldung 'SFC-Exitcode 1 wuerde einen echten Ausfuehrungsfehler faelschlich als Erfolg klassifizieren.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?m)^function Get-NativeProzessAusgabeEncoding\b') -Meldung 'Die werkzeugspezifische Ausgabecodierung fuer DISM, SFC und CHKDSK fehlt.'
    Assert-Selbsttest -Bedingung ($skriptText -match 'StandardOutputEncoding\s*=\s*\$nativeAusgabeEncoding' -and $skriptText -match 'StandardErrorEncoding\s*=\s*\$nativeAusgabeEncoding') -Meldung 'Die ermittelte native Zeichencodierung wird nicht auf beide Ausgabestroeme angewendet.'
    $dismTestEncoding = Get-NativeProzessAusgabeEncoding -Datei 'C:\Windows\System32\dism.exe'
    $sfcTestEncoding = Get-NativeProzessAusgabeEncoding -Datei 'C:\Windows\System32\sfc.exe'
    $chkdskTestEncoding = Get-NativeProzessAusgabeEncoding -Datei 'C:\Windows\System32\chkdsk.exe'
    $wingetTestEncoding = Get-NativeProzessAusgabeEncoding -Datei 'C:\Program Files\WindowsApps\winget.exe'
    Assert-Selbsttest -Bedingung ($null -ne $dismTestEncoding -and $dismTestEncoding.CodePage -eq [Globalization.CultureInfo]::CurrentUICulture.TextInfo.OEMCodePage) -Meldung 'DISM wird nicht mit der lokalen OEM-Codepage gelesen.'
    Assert-Selbsttest -Bedingung ($null -ne $sfcTestEncoding -and $sfcTestEncoding.CodePage -eq [Text.Encoding]::Unicode.CodePage) -Meldung 'SFC wird nicht als UTF-16LE gelesen.'
    Assert-Selbsttest -Bedingung ($null -ne $chkdskTestEncoding -and $chkdskTestEncoding.CodePage -eq [Globalization.CultureInfo]::CurrentUICulture.TextInfo.ANSICodePage) -Meldung 'CHKDSK wird nicht mit der lokalen ANSI-Codepage gelesen.'
    Assert-Selbsttest -Bedingung ($null -eq $wingetTestEncoding) -Meldung 'Die UTF-8-Ausgabe von WinGet wuerde faelschlich umcodiert.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?m)^function Get-ProzessbaumMomentaufnahme\b') -Meldung 'Die Prozessbaumueberwachung fuer Installationen fehlt.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?m)^function Start-UnabhaengigenProzessAbbruchwaechter\b') -Meldung 'Der vom Elternprozess unabhaengige Abbruchwaechter fuer Installationen fehlt.'
    Assert-Selbsttest -Bedingung ($skriptText -match '\$script:HauptlaufAbbruchwaechter\s*=\s*Start-UnabhaengigenProzessAbbruchwaechter\s+-AlleDirektenKindprozesse') -Meldung 'Der laufweite Abbruchwaechter fuer alle direkten und indirekten Kindprozesse fehlt.'
    Assert-Selbsttest -Bedingung ($skriptText -match 'TrackAllDirectChildren' -and $skriptText -match 'OwnerStartTicks' -and $skriptText -match 'MonitorStartTicks') -Meldung 'Der laufweite Abbruchwaechter grenzt Prozesse nicht sicher auf diesen Lauf ein.'
    $waechterStartPosition = $skriptText.IndexOf('$abbruchWaechter = Start-UnabhaengigenProzessAbbruchwaechter', [StringComparison]::Ordinal)
    $installerStartPosition = $skriptText.IndexOf('$gestartet = $prozess.Start()', [StringComparison]::Ordinal)
    Assert-Selbsttest -Bedingung ($waechterStartPosition -ge 0 -and $installerStartPosition -gt $waechterStartPosition) -Meldung 'Der unabhaengige Abbruchwaechter wird nicht nachweislich vor dem Installerprozess gestartet.'
    Assert-Selbsttest -Bedingung ($skriptText -match 'TargetPath' -and $skriptText -match 'TargetName' -and $skriptText -match 'OneClickGuardianNative[\s\S]{0,2000}TerminateProcess') -Meldung 'Pfadgebundene native Prozessidentitaet oder blockierungsfreie Terminierung des Abbruchwaechters fehlt.'
    Assert-Selbsttest -Bedingung ($skriptText -match 'OneClickGuardianNative[\s\S]{0,2500}ExitProcess\(0\)') -Meldung 'Der Abbruchwaechter beendet sich nach einem harten Eigentuemertod nicht nachweislich sofort selbst.'
    Assert-Selbsttest -Bedingung ($skriptText -match 'config\.DiagnoseFile[\s\S]{0,1200}Remove-Item[\s\S]{0,800}ExitProcess\(0\)') -Meldung 'Die Kontrolldateien des Abbruchwaechters werden nach einem harten Abbruch nicht nachweislich entfernt.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?m)^function Get-ZugeordneteZusaetzlicheInstallerProzesse\b') -Meldung 'Die sichere Zuordnung nachgelagerter Installer fehlt.'
    Assert-Selbsttest -Bedingung ($skriptText -match 'Get-ProzessbaumMomentaufnahme[^\r\n]+-StartZeitUtc') -Meldung 'Die Prozessbaumueberwachung begrenzt Prozesse nicht auf den aktuellen Installationslauf.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?m)^function Wait-Pwsh7Verfuegbar\b') -Meldung 'Die begrenzte PowerShell-7-Nachkontrolle fehlt.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?m)^#requires -Version 5\.1\s*$' -and $skriptText -notmatch '(?m)^#requires -PSEdition Core\s*$') -Meldung 'Der eingebettete Doppelklick-Starter kann nicht unter der Windows-PowerShell-Dateizuordnung geladen werden.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?m)^function Start-EingebettetePowerShell7Startdatei\b' -and $skriptText -match '(?s)function Start-EingebettetePowerShell7Startdatei\b.+?Find-Pwsh7.+?Get-Pwsh7Version.+?Start-Process\s+-FilePath\s+\$pwsh\s+-Verb\s+RunAs.+?-WindowStyle\s+Normal') -Meldung 'Die eingebettete zweite Startdatei erzwingt PowerShell 7, Signatur-/Versionsnachkontrolle, UAC und ein sichtbares Fenster nicht vollstaendig.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?s)\$env:ProgramW6432.+?Join-Path\s+-Path\s+\$env:ProgramW6432\s+-ChildPath\s+''PowerShell\\7\\pwsh\.exe''') -Meldung 'Der Doppelklick-Starter findet aus einer 32-Bit-Windows-PowerShell den nativen 64-Bit-PowerShell-7-Host nicht sicher.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?m)^function Get-WinGetDiagnoseOrdner\b') -Meldung 'Die WinGet-Diagnoseprotokolle werden nicht als Aktivitaetsquelle ueberwacht.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?m)^function Get-WindowsNeustartstatus\b') -Meldung 'Die Windows-Neustartvorpruefung vor DISM fehlt.'
    Assert-Selbsttest -Bedingung (Test-OneClickNeustartErfolgt -GespeicherteWindowsStartTicks 100 -AktuelleWindowsStartTicks 101) -Meldung 'Ein tatsaechlich neuer Windows-Start wurde nicht erkannt.'
    Assert-Selbsttest -Bedingung (-not (Test-OneClickNeustartErfolgt -GespeicherteWindowsStartTicks 100 -AktuelleWindowsStartTicks 100)) -Meldung 'Ein unveraenderter Windows-Start wurde faelschlich als Neustart erkannt.'
    Assert-Selbsttest -Bedingung (-not (Test-OneClickNeustartErfolgt -GespeicherteWindowsStartTicks 0 -AktuelleWindowsStartTicks 101)) -Meldung 'Ein ungueltiger gespeicherter Startwert wurde faelschlich akzeptiert.'
    Assert-Selbsttest -Bedingung (-not (Test-OneClickNeustartnachweisVorhanden -Nachweise @() -WindowsMarkerAusstehend $false)) -Meldung 'Ein unbelegter 3010-/Neustartzustand wuerde den Normalablauf faelschlich pausieren.'
    Assert-Selbsttest -Bedingung (Test-OneClickNeustartnachweisVorhanden -Nachweise @([pscustomobject]@{ Quelle = 'Testinstaller'; ExitCode = 3010 }) -WindowsMarkerAusstehend $false) -Meldung 'Ein aktueller dokumentierter 3010-Prozessnachweis wurde faelschlich ignoriert.'
    Assert-Selbsttest -Bedingung (-not (Test-OneClickNeustartnachweisVorhanden -Nachweise @([pscustomobject]@{ Quelle = 'Textausgabe'; ExitCode = 0; Details = '3010' }) -WindowsMarkerAusstehend $false)) -Meldung 'Die bloße Zahl 3010 in einer Ausgabe wuerde faelschlich als echter Neustart-Exitcode behandelt.'
    Assert-Selbsttest -Bedingung (Test-OneClickNeustartnachweisVorhanden -Nachweise @() -WindowsMarkerAusstehend $true) -Meldung 'Ein aktueller Windows-Neustartmarker wurde faelschlich ignoriert.'
    $pendingVorhanden = @(Get-OneClickPendingFileOperationen -Eintraege @(("*1\??\{0}" -f $script:SelfPath), ''))
    Assert-Selbsttest -Bedingung ($pendingVorhanden.Count -eq 1 -and [bool]$pendingVorhanden[0].QuellePruefbar -and [bool]$pendingVorhanden[0].QuelleVorhanden -and [bool]$pendingVorhanden[0].Anwendbar) -Meldung 'Eine reale PendingFileRenameOperations-Quelldatei mit Windows-Praefix wurde nicht als anwendbar erkannt.'
    $fehlenderPendingPfad = Join-Path -Path ([IO.Path]::GetTempPath()) -ChildPath ("OneClick-nicht-vorhanden-{0}.tmp" -f [Guid]::NewGuid().ToString('N'))
    $pendingVeraltet = @(Get-OneClickPendingFileOperationen -Eintraege @(("\??\{0}" -f $fehlenderPendingPfad), ''))
    Assert-Selbsttest -Bedingung ($pendingVeraltet.Count -eq 1 -and [bool]$pendingVeraltet[0].QuellePruefbar -and -not [bool]$pendingVeraltet[0].QuelleVorhanden -and -not [bool]$pendingVeraltet[0].Anwendbar) -Meldung 'Eine nachweislich nicht mehr vorhandene lokale PendingFileRenameOperations-Quelle wuerde den Lauf faelschlich pausieren.'
    $pendingGeraetepfad = @(Get-OneClickPendingFileOperationen -Eintraege @('\Device\HarddiskVolumeOneClickTest\datei.tmp', ''))
    Assert-Selbsttest -Bedingung ($pendingGeraetepfad.Count -eq 1 -and -not [bool]$pendingGeraetepfad[0].QuellePruefbar -and [bool]$pendingGeraetepfad[0].Anwendbar) -Meldung 'Ein nicht sicher pruefbarer nativer Geraetepfad wuerde einen echten Neustartbedarf verlieren.'
    $fortsetzungsReihenfolge = @('WindowsSystem', 'BenutzerUpdates', 'MaschinenUpdates', 'RegistryPruefung', 'BenutzerReparatur', 'MaschinenReparatur', 'Abschluss')
    for ($fortsetzungsIndex = 0; $fortsetzungsIndex -lt $fortsetzungsReihenfolge.Count; $fortsetzungsIndex++) {
        Assert-Selbsttest -Bedingung ((Get-OneClickFortsetzungsabschnittRang -Abschnitt $fortsetzungsReihenfolge[$fortsetzungsIndex]) -eq $fortsetzungsIndex) -Meldung ("Fortsetzungsabschnitt besitzt einen falschen Rang: {0}" -f $fortsetzungsReihenfolge[$fortsetzungsIndex])
    }
    Assert-Selbsttest -Bedingung ($skriptText -match '(?m)^function Save-OneClickFortsetzungsstatus\b' -and $skriptText -match '(?m)^function Read-OneClickFortsetzungsstatus\b' -and $skriptText -match 'DataProtectionScope\]::CurrentUser') -Meldung 'Die benutzergebundene verschluesselte Neustartstatusspeicherung fehlt.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?m)^function Register-OneClickFortsetzungsaufgabe\b' -and $skriptText -match '\$definition\.Triggers\.Create\(9\)' -and $skriptText -match '\$definition\.Principal\.RunLevel\s*=\s*1') -Meldung 'Die erhoehte automatische Fortsetzung bei Benutzeranmeldung fehlt.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?m)^function New-OneClickGeschuetztesFortsetzungsskript\b' -and $skriptText -match 'SkriptDatei\s*=\s*Join-Path.+OneClick-Komplettreparatur-Fortsetzung-' -and $skriptText -match 'FileSystemRights\]::ReadAndExecute') -Meldung 'Die Fortsetzungsaufgabe besitzt keine geschuetzte Dokumente-Skriptkopie mit Nur-Lese-Recht fuer den normalen Benutzer.'
    Assert-Selbsttest -Bedingung ($skriptText -match '''-File'',\s*\$fortsetzungsSkript' -and $skriptText -match "DeleteExpiredTaskAfter\s*=\s*'PT1H'" -and $skriptText -match 'EndBoundary\s*=') -Meldung 'Die Fortsetzungsaufgabe verweist nicht eindeutig auf die geschuetzte Kopie oder besitzt keine Ablaufgrenze.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?s)function Set-OneClickNeustartpause\b.+?if \(-not \(Confirm-OneClickNeustartbedarf\)\).+?Register-OneClickFortsetzungsaufgabe') -Meldung 'Die Fortsetzungsaufgabe koennte ohne bestaetigten Neustartbedarf registriert werden.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?s)if \(\$FortsetzenNachNeustart\).+?Test-OneClickNeustartErfolgt.+?Remove-OneClickFortsetzungsaufgabe.+?Interner Laufzeit-Selbsttest') -Meldung 'Die Fortsetzungsaufgabe wird nach dem bestaetigten Neustart nicht vor den weiteren Arbeitsphasen entfernt.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?s)function Complete-OneClickFortsetzung\b.+?Remove-OneClickFortsetzungsaufgabe.+?Fortsetzungsstatus-[^\r\n]+\.dpapi.+?OneClick-Komplettreparatur-Fortsetzung-[^\r\n]+\.ps1.+?Fortsetzungsstatus entfernt') -Meldung 'Die abschliessende Entfernung der Neustartaufgabe, des Status oder der geschuetzten Skriptkopie fehlt.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?s)function Remove-OneClickVeralteteVorabFortsetzung\b.+?Windows meldet vor der naechsten Reparaturphase:.+?SkriptSHA256.+?Remove-OneClickFortsetzungsaufgabe.+?Remove-OneClickKontrolliertenLaufpfad' -and $skriptText -match '(?s)if \(-not \$FortsetzenNachNeustart\)\s*\{\s*\$null\s*=\s*Invoke-Phase.+?Remove-OneClickVeralteteVorabFortsetzung') -Meldung 'Die eng begrenzte Bereinigung einer von der fehlerhaften Vorabpruefung hinterlassenen Fortsetzung fehlt oder wird beim normalen Administratorstart nicht aufgerufen.'
    Assert-Selbsttest -Bedingung ($skriptText -match 'Start-Process\s+-FilePath\s+\$hostPfad\s+-Verb\s+RunAs.+-WindowStyle\s+Normal') -Meldung 'Der administrative Hauptlauf wird nicht nachweislich in einem sichtbaren Fenster gestartet.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?s)if \(-not \$istAdministratorStart -and -not \$NurBenutzerProgramme\).+?Start-SelbstAlsAdministrator.+?if \(-not \$NurBenutzerProgramme -and -not \(Test-IstAdministrator\)\).+?Stop-MitPause -Code 13') -Meldung 'Der oeffentliche Hauptlauf besitzt keine doppelte Administratorerzwingung vor den Arbeitsphasen.'
    Assert-Selbsttest -Bedingung ($skriptText -match 'Fortsetzung startet sichtbar und ohne -KeinePause') -Meldung 'Die automatische Fortsetzung koennte ihr Fortschrittsfenster vor der Benutzerbestaetigung schliessen.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?m)^function Show-OneClickNeustartfunktion\b' -and $skriptText -match "'shutdown\.exe'" -and $skriptText -match "'/r',\s*'/t',\s*'60'" -and $skriptText -match '(?s)\$shutdownArgumentZeile\s*=.+?ConvertTo-WindowsArgument.+?Start-Process\s+-FilePath\s+\$shutdown\s+-ArgumentList\s+\$shutdownArgumentZeile') -Meldung 'Die sichtbare Neustartfunktion oder die sichere Argumentquotierung fuer shutdown.exe fehlt.'
    Assert-Selbsttest -Bedingung ($script:Version -eq '1.0.0' -and $skriptText -match 'OneClick-Komplettreparatur-Release-v1\.0\.0') -Meldung 'Produktname oder Releaseversion ist inkonsistent.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?m)^function Ensure-DesktopVerknuepfungFuerProgramm\b') -Meldung 'Die automatische Desktop-Verknuepfung nach Programmaktionen fehlt.'
    Assert-Selbsttest -Bedingung (@([regex]::Matches($skriptText, 'Ensure-DesktopVerknuepfungFuerProgramm\s+-Id')).Count -ge 7) -Meldung 'Updates, Reparaturen und Neuinstallationsfallbacks sind nicht vollstaendig an die Desktop-Verknuepfungsphase gekoppelt.'
    Assert-Selbsttest -Bedingung ($skriptText -notmatch 'SpecialFolder\]::CommonDesktopDirectory') -Meldung 'Eine Programmverknuepfung koennte auf den Desktop anderer Benutzer geschrieben werden.'
    Assert-Selbsttest -Bedingung ((ConvertTo-VerknuepfungsVergleichstext -Text 'München-Werkzeug 2.0') -eq 'munchenwerkzeug20') -Meldung 'Unicode-Programmnamen werden fuer die sichere Verknuepfungszuordnung nicht stabil normalisiert.'
    Assert-Selbsttest -Bedingung (Test-DesktopVerknuepfungNichtAnwendbar -Id 'Hersteller.Runtime.SDK' -Anzeigename 'Runtime SDK') -Meldung 'Eine Laufzeitkomponente wuerde faelschlich eine Desktop-Verknuepfung erhalten.'
    Assert-Selbsttest -Bedingung (-not (Test-DesktopVerknuepfungNichtAnwendbar -Id 'Hersteller.Malprogramm' -Anzeigename 'Malprogramm')) -Meldung 'Eine eigenstaendige Anwendung wurde faelschlich von Desktop-Verknuepfungen ausgeschlossen.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?m)^function Stop-ProzessbaumSicher\b') -Meldung 'Der sichere Abbruch haengender Installer-Prozessbaeume fehlt.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?m)^function Test-IstRelevanterInstallerprozess\b') -Meldung 'Die Trennung zwischen Installer- und gestarteten Anwendungsprozessen fehlt.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?m)^function Get-WinGetPaketStatusImScope\b') -Meldung 'Die scopegetrennte WinGet-Paketpruefung fehlt.'
    $aliasBypassVariable = '$istWindowsApps' + 'Alias'
    Assert-Selbsttest -Bedingung ($skriptText -notmatch [regex]::Escape($aliasBypassVariable)) -Meldung 'Ein benutzerschreibbarer App-Ausfuehrungsalias koennte die Microsoft-Signaturpruefung noch umgehen.'
    $selbsttestHost = Get-AktuellerHostPfad
    if ($PSVersionTable.PSEdition -eq 'Core') {
        Assert-Selbsttest -Bedingung (Test-MicrosoftProgrammIdentitaet -Pfad $selbsttestHost -Programm 'PowerShell') -Meldung 'Die Produktidentitaet des aktuellen PowerShell-7-Hosts wurde nicht erkannt.'
    }
    Assert-Selbsttest -Bedingung (-not (Test-MicrosoftProgrammIdentitaet -Pfad $selbsttestHost -Programm 'WinGet')) -Meldung 'Eine beliebige Microsoft-signierte Programmdatei koennte faelschlich als WinGet akzeptiert werden.'
    $testMsiProzess = [pscustomobject]@{ Name = 'msiexec.exe'; CommandLine = 'msiexec.exe /i paket.msi /qn' }
    $testAppStart = [pscustomobject]@{ Name = 'Update.exe'; CommandLine = 'Update.exe --processStart Beispiel.exe' }
    Assert-Selbsttest -Bedingung (Test-IstRelevanterInstallerprozess -Prozess $testMsiProzess) -Meldung 'msiexec.exe wurde nicht als Installerprozess erkannt.'
    Assert-Selbsttest -Bedingung (-not (Test-IstRelevanterInstallerprozess -Prozess $testAppStart)) -Meldung 'Ein nach erfolgreicher Squirrel-Installation gestartetes Programm wurde faelschlich als Installer behandelt.'

    $testZugeordneterInstaller = [pscustomobject]@{ ProcessId = 201; ParentProcessId = 100; Name = 'setup.exe'; CommandLine = 'setup.exe /silent' }
    $testZugeordnetesKind = [pscustomobject]@{ ProcessId = 202; ParentProcessId = 201; Name = 'msiexec.exe'; CommandLine = 'msiexec.exe /i paket.msi /qn' }
    $testFremderInstaller = [pscustomobject]@{ ProcessId = 300; ParentProcessId = 999; Name = 'setup.exe'; CommandLine = 'setup.exe /silent' }
    $testZuordnung = @(Get-ZugeordneteZusaetzlicheInstallerProzesse -Kandidaten @($testZugeordneterInstaller, $testZugeordnetesKind, $testFremderInstaller) -BekannteProzessIds @(100) -RootProcessId 100)
    $testZuordnungsIds = @($testZuordnung | ForEach-Object { [int]$_.ProcessId })
    Assert-Selbsttest -Bedingung ($testZuordnung.Count -eq 2 -and $testZuordnungsIds -contains 201 -and $testZuordnungsIds -contains 202 -and $testZuordnungsIds -notcontains 300) -Meldung 'Ein fremder paralleler Installer wurde dem aktuellen Installationslauf zugeordnet oder ein echtes Installer-Kind wurde nicht erkannt.'

    $installationsAufrufMuster = '(?i)(PowerShell 7 (?:ueber WinGet )?installieren|Paket (?:erneut )?aktualisieren:|Installationsdatei (?:erneut )?herunterladen:|Programm (?:erneut )?neu installieren:|Microsoft-Store-Paket (?:erneut )?neu installieren:|MSI-Integritaet pruefen und reparieren:|Programm (?:erneut )?reparieren:)'
    $installationsAufrufZeilen = @($skriptText -split "`r?`n" | Where-Object { $_ -match 'Invoke-Native' -and $_ -match $installationsAufrufMuster })
    Assert-Selbsttest -Bedingung ($installationsAufrufZeilen.Count -ge 10) -Meldung 'Die erwarteten Installations- und Reparaturaufrufe wurden nicht vollstaendig gefunden.'
    foreach ($aufrufZeile in $installationsAufrufZeilen) {
        Assert-Selbsttest -Bedingung ($aufrufZeile -match '-InstallationsVorgang' -and $aufrufZeile -match '-TimeoutSekunden' -and $aufrufZeile -match '-LeerlaufTimeoutSekunden') -Meldung ("Installations-/Reparaturaufruf ohne vollstaendigen Zeit- und Leerlaufwaechter: {0}" -f $aufrufZeile.Trim())
    }
    $windowsSystemAufrufe = @($skriptText -split "`r?`n" | Where-Object { $_ -match 'Invoke-Native' -and $_ -match "-Beschreibung '(?:Windows-Komponentenspeicher|Nachgewiesen beschaedigten Windows-Komponentenspeicher|Windows-Systemdateien|Dateisystem (?:online|nach))" })
    Assert-Selbsttest -Bedingung ($windowsSystemAufrufe.Count -eq 5) -Meldung 'DISM-Vorpruefung, bedarfsgesteuerte Reparatur, DISM-Nachpruefung, SFC und CHKDSK wurden nicht vollstaendig gefunden.'
    foreach ($aufrufZeile in $windowsSystemAufrufe) {
        Assert-Selbsttest -Bedingung ($aufrufZeile -match '-InstallationsVorgang' -and $aufrufZeile -match '-AlleKindprozesseAlsAktivitaet' -and $aufrufZeile -match '-LeerlaufTimeoutSekunden') -Meldung ("Windows-Systemaufruf ohne vollstaendigen Prozessbaum- und Leerlaufwaechter: {0}" -f $aufrufZeile.Trim())
    }
    Assert-Selbsttest -Bedingung ($skriptText -match '(?m)^\s*\$dismErgebnis\s*=\s*Invoke-Native[^\r\n]+/RestoreHealth[^\r\n]+-TimeoutSekunden\s+21600\s+-LeerlaufTimeoutSekunden\s+600') -Meldung 'DISM RestoreHealth besitzt nicht die Sechs-Stunden-Gesamtgrenze und die geforderte Zehn-Minuten-Leerlaufgrenze.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?m)^\s*\$dismVorpruefungErgebnis\s*=\s*Invoke-Native[^\r\n]+/ScanHealth[^\r\n]+-TimeoutSekunden\s+10800\s+-LeerlaufTimeoutSekunden\s+600') -Meldung 'Die downloadfreie DISM-ScanHealth-Vorpruefung oder ihre Zehn-Minuten-Leerlaufgrenze fehlt.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?m)^\s*\$dismNachpruefungErgebnis\s*=\s*Invoke-Native[^\r\n]+/ScanHealth[^\r\n]+-TimeoutSekunden\s+10800\s+-LeerlaufTimeoutSekunden\s+600') -Meldung 'Die DISM-ScanHealth-Nachpruefung oder ihre Zehn-Minuten-Leerlaufgrenze fehlt.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?m)^function Enable-DismWindowsUpdateReparaturquelle\b' -and $skriptText -match "Name = 'wuauserv'" -and $skriptText -match "Name = 'TrustedInstaller'" -and $skriptText -match 'DisableWindowsUpdateAccess') -Meldung 'Die Dienst- und Richtlinienvorpruefung fuer die DISM-Windows-Update-Reparaturquelle fehlt.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?m)^function ConvertFrom-DismImageHealthState\b' -and $skriptText -match '(?m)^function Get-DismOnlineIntegritaetsstatus\b' -and $skriptText -match 'Dism\\Repair-WindowsImage\s+-Online\s+-CheckHealth\s+-NoRestart' -and $skriptText -match 'ImageHealthState') -Meldung 'Die sprachunabhaengige, downloadfreie DISM-Integritaetsklassifikation fehlt.'
    Assert-Selbsttest -Bedingung ($skriptText -match "FortschrittsText 'DISM-Integritaetsstatus downloadfrei klassifizieren'" -and $skriptText -match 'TimeoutSekunden\s+900\s+-LeerlaufTimeoutSekunden\s+600') -Meldung 'Die downloadfreie typisierte DISM-Klassifikation besitzt keinen Zehn-Minuten-Leerlaufwaechter.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?s)switch \(\$integritaetsstatus\.Status\).+?''Healthy''.+?kein Reparaturdownload.+?''Repairable''.+?Enable-DismWindowsUpdateReparaturquelle.+?/RestoreHealth') -Meldung 'RestoreHealth und die Windows-Update-Reparaturquelle sind nicht eindeutig auf zuvor nachgewiesene reparierbare Schaeden begrenzt.'
    Assert-Selbsttest -Bedingung ($skriptText -match '\$windowsFolgepruefungenFreigegeben\s*=\s*\$false' -and $skriptText -match '(?s)\$nachstatus\.Status\s+-eq\s+''Healthy''.+?\$windowsFolgepruefungenFreigegeben\s*=\s*\$true' -and $skriptText -match '(?s)if \(\$windowsFolgepruefungenFreigegeben\).+?\$sfcErgebnis\s*=\s*Invoke-Native.+?\$chkdskErgebnis\s*=\s*Invoke-Native.+?SFC und CHKDSK werden ausgelassen') -Meldung 'SFC und CHKDSK sind nicht ausschliesslich nach einer erfolgreich nachkontrollierten DISM-Reparatur freigegeben.'
    Assert-Selbsttest -Bedingung ($skriptText -match 'DownloadErkannt\s*=\s*\$downloadErkannt' -and $skriptText -match 'DownloadDauerSekunden\s*=\s*\$downloadDauerSekunden' -and $skriptText -match 'DownloadBytes\s*=\s*\$downloadBytes') -Meldung 'Die vom DISM-Prozess gemessenen Downloaddaten werden nicht bis zur bedingten SFC-/CHKDSK-Freigabe weitergegeben.'
    Assert-Selbsttest -Bedingung ($skriptText -match "Argumente @\('/Online', '/Cleanup-Image', '/RestoreHealth', '/NoRestart'\)" -and $skriptText -match 'ohne /Source und ohne /LimitAccess') -Meldung 'DISM ist nicht eindeutig fuer die von Windows konfigurierte Online-Reparaturquelle freigegeben.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?m)^function Get-WindowsUpdateDownloadMomentaufnahme\b') -Meldung 'Die Windows-Update-Downloadmessung fuer DISM fehlt.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?m)^\s*\$dismErgebnis\s*=\s*Invoke-Native[^\r\n]+-WindowsUpdateDownloadUeberwachen') -Meldung 'DISM RestoreHealth ist nicht an die Windows-Update-Downloadmessung gekoppelt.'
    Assert-Selbsttest -Bedingung ($skriptText -match 'return\s+\(''\{0:N2\}\s+MB''\s+-f\s+\(\$Bytes\s*/\s*1000000\)\)') -Meldung 'Downloadmengen werden nicht einheitlich in Megabytes angezeigt.'
    Assert-Selbsttest -Bedingung ($skriptText -match 'DownloadProgress:\\s\*\\\[' -and $skriptText -match 'CbsDownloadProzent') -Meldung 'Der CBS-/Windows-Update-Prozentfortschritt wird nicht ausgewertet.'
    Assert-Selbsttest -Bedingung ($skriptText -match 'DownloadBytesGeschaetzt' -and $skriptText -match 'ca\. empfangen') -Meldung 'Der abgesicherte und gekennzeichnete Megabyte-Fallback fuer Windows Update fehlt.'
    Assert-Selbsttest -Bedingung ($skriptText -match 'Prozesskette:' -and $skriptText -match 'Protokollaktivitaet:' -and $skriptText -match 'Protokollwaechter aktiv:') -Meldung 'DismHost-/Kindprozess- oder CBS-/DISM-Protokollaktivitaet wird nicht sichtbar ausgegeben.'
    Assert-Selbsttest -Bedingung ($skriptText -match 'DISM /RestoreHealth wurde erfolgreich abgeschlossen\. Die automatische downloadfreie /ScanHealth-Nachpruefung startet jetzt\.' -and $skriptText -match 'automatische DISM /ScanHealth-Nachpruefung wurde erfolgreich und mit Status Healthy abgeschlossen') -Meldung 'Start oder erfolgreicher Abschluss der automatischen DISM-Nachpruefung ist nicht sichtbar.'
    foreach ($kategorie in @('Start und Voraussetzungen', 'Windows-Systempruefung', 'Programmbasis und Quellen', 'Programmupdates', 'Programmnachkontrolle', 'Programmintegritaet', 'Programmreparaturen', 'Abschluss')) {
        Assert-Selbsttest -Bedingung ($skriptText -match ("-Kategorie\s+'{0}'" -f [regex]::Escape($kategorie))) -Meldung ("Die Fortschrittskategorie '{0}' fehlt im Hauptablauf." -f $kategorie)
    }
    Assert-Selbsttest -Bedingung ($skriptText -match 'LeerlaufTimeoutSekunden\s+600\s+-InstallationsVorgang') -Meldung 'Installationsaufrufe besitzen keinen Leerlaufwaechter.'
    Assert-Selbsttest -Bedingung ($skriptText -match 'taskkill\.exe') -Meldung 'Der Prozessbaum-Fallback ueber taskkill.exe fehlt.'
    Assert-Selbsttest -Bedingung ($skriptText -match '\$abbruchRootProzessId\s*=\s*if\s*\(\$rootBeendet\)\s*\{\s*0\s*\}') -Meldung 'Eine bereits beendete und moeglicherweise wiederverwendete Root-PID koennte beim Timeout beendet werden.'
    Assert-Selbsttest -Bedingung ($skriptText -notmatch '(?i)Progress\.View\s*=\s*["'']Classic["'']') -Meldung 'Der fehleranfaellige Classic-Progress-Renderer ist noch aktiviert.'
    $cursorMuster = '(?i)(SetCursor' + 'Position|Cursor' + 'Position\s*=)'
    Assert-Selbsttest -Bedingung ($skriptText -notmatch $cursorMuster) -Meldung 'Unsichere Cursor-Manipulation ist noch enthalten.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?m)^function Get-KonsolenbreiteSicher\b' -and $skriptText -match 'RawUI\.WindowSize\.Width' -and $skriptText -match '\[Console\]::WindowWidth' -and $skriptText -match '(?m)^function Split-KonsolentextFuerFenster\b') -Meldung 'Der an die aktuelle PowerShell-Fensterbreite gekoppelte Zeilenumbruch fehlt.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?m)^function Get-WindowsClientKompatibilitaet\b' -and $skriptText -match 'Build -lt 17763' -and $skriptText -match "Architektur -eq 'arm64'.+Build -lt 22000" -and $skriptText -match 'Get-Systemarchitektur') -Meldung 'Die Windows-10/11-, Build- oder Architekturkompatibilitaet wird nicht vollstaendig vorgeprueft.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?m)^function Get-WinGetVersion\b' -and $skriptText -match '(?m)^function Select-NeuesteWinGetKandidat\b' -and $skriptText -match 'Neueste verifizierte WinGet-Version gefunden und ausgewaehlt') -Meldung 'Zukuenftige hoehere, signierte WinGet-Versionen werden nicht nach Version ermittelt und sichtbar ausgewaehlt.'
    Assert-Selbsttest -Bedingung ($skriptText -match '\$env:SystemDrive' -and $skriptText -match '\$env:SystemRoot' -and $skriptText -match '\$env:ProgramW6432' -and $skriptText -match 'GetFolderPath') -Meldung 'Laufwerks-, Windows-, Programme- oder Benutzerpfade werden nicht hardwareunabhaengig aus Windows ermittelt.'
    $direkteWriteHostZeilen = @($skriptText -split "`r?`n" | Where-Object { $_ -match '^\s*Write-Host\b' -and $_ -notmatch '^\s*Write-Host\s+\$(?:Text|fensterZeile)\b' })
    Assert-Selbsttest -Bedingung ($direkteWriteHostZeilen.Count -eq 0) -Meldung 'Nicht abgesicherte direkte Write-Host-Ausgabe wurde gefunden.'

    $argument = ConvertTo-WindowsArgument -Wert 'C:\Program Files\PowerShell\7\pwsh.exe'
    Assert-Selbsttest -Bedingung ($argument.StartsWith('"') -and $argument.EndsWith('"')) -Meldung 'Windows-Argument mit Leerzeichen wurde nicht korrekt maskiert.'

    $uncArgument = ConvertTo-WindowsArgument -Wert '\\server\freigabe mit leerzeichen\datei.exe'
    $zitatArgument = ConvertTo-WindowsArgument -Wert 'C:\Pfad mit Leerzeichen\datei "test".exe'
    Assert-Selbsttest -Bedingung ($uncArgument -notmatch 'System\.Object\[\]' -and $zitatArgument -notmatch 'System\.Object\[\]') -Meldung 'Mehrfache Backslashes wurden als PowerShell-Array statt als Zeichenfolge maskiert.'


    Assert-Selbsttest -Bedingung ((Get-WinGetErgebniskategorie -ExitCode -1978335188) -eq 'TeilweiseFehlgeschlagen') -Meldung 'WinGet-Teilfehler 0x8A15002C wurde nicht korrekt klassifiziert.'
    Assert-Selbsttest -Bedingung ((Get-WinGetErgebniskategorie -ExitCode -1978335212) -eq 'KeinePakete') -Meldung 'WinGet-Zustand ohne Pakete wurde faelschlich als Fehler klassifiziert.'
    Assert-Selbsttest -Bedingung ((Get-WinGetErgebniskategorie -ExitCode -1978335189) -eq 'KeineAktualisierung') -Meldung 'WinGet-Zustand ohne anwendbare Aktualisierung wurde faelschlich als Fehler klassifiziert.'
    Assert-Selbsttest -Bedingung ((Get-WinGetErgebniskategorie -ExitCode -1978334967) -eq 'ErfolgNeustart') -Meldung 'Erfolgreiches WinGet-Update mit Neustartanforderung wurde nicht erkannt.'
    Assert-Selbsttest -Bedingung ((Get-WinGetErgebniskategorie -ExitCode 1641) -eq 'ErfolgNeustart') -Meldung 'Windows-Installer-Exitcode 1641 wurde nicht als erfolgreicher Neustartzustand erkannt.'
    Assert-Selbsttest -Bedingung ((Get-WinGetErgebniskategorie -ExitCode 3010) -eq 'ErfolgNeustart') -Meldung 'Windows-Installer-Exitcode 3010 wurde nicht als erfolgreicher Neustartzustand erkannt.'
    Assert-Selbsttest -Bedingung ((Get-WinGetErgebniskategorie -ExitCode -1978334966) -eq 'NeustartVorUpdate') -Meldung 'WinGet-Neustartanforderung vor einer Aktualisierung wurde nicht erkannt.'
    Assert-Selbsttest -Bedingung ((Get-WinGetErgebniskategorie -ExitCode -1978335128) -eq 'Uebersprungen') -Meldung 'Ein angeheftetes WinGet-Paket wurde faelschlich als technischer Fehler klassifiziert.'
    Assert-Selbsttest -Bedingung ((Get-WinGetErgebniskategorie -ExitCode -1978335107) -eq 'Benutzeraktion') -Meldung 'Ein Benutzerpaket im Administratorkontext wurde nicht als Benutzeraktion klassifiziert.'
    Assert-Selbsttest -Bedingung ((Get-WinGetErgebniskategorie -ExitCode 1 -Ausgabe 'Es wurde kein installiertes Paket gefunden, das den Eingabekriterien entspricht.') -eq 'KeinePakete') -Meldung 'Lokalisierte WinGet-Ausgabe ohne Paket wurde nicht sicher erkannt.'
    Assert-Selbsttest -Bedingung ((Get-WinGetErgebniskategorie -ExitCode 0 -Ausgabe 'Es wurde kein installiertes Paket gefunden, das den Eingabekriterien entspricht.') -eq 'KeinePakete') -Meldung 'WinGet-Ausgabe ohne Paket wurde bei Exitcode 0 nicht sicher erkannt.'
    Assert-Selbsttest -Bedingung ((Get-AbschlussExitCode -WarnungsAnzahl 0 -NeustartErforderlich $false) -eq 0) -Meldung 'Erfolgreicher Abschluss wurde mit einem falschen Exitcode versehen.'
    Assert-Selbsttest -Bedingung ((Get-AbschlussExitCode -WarnungsAnzahl 1 -NeustartErforderlich $false) -eq 2) -Meldung 'Warnungen wurden nicht in Exitcode 2 abgebildet.'
    Assert-Selbsttest -Bedingung ((Get-AbschlussExitCode -WarnungsAnzahl 1 -NeustartErforderlich $true) -eq 3010) -Meldung 'Der erforderliche Windows-Neustart wurde durch den allgemeinen Warnungscode verdeckt.'

    $testTabelle = @'
Name                              ID                                  Version        Verfuegbar     Quelle
--------------------------------------------------------------------------------------------------------
Beispiel Anwendung                Hersteller.Beispiel                 1.0.0          1.1.0          winget
Microsoft .NET Desktop Runtime 7  Microsoft.DotNet.DesktopRuntime.7   7.0.1          7.0.20         winget
Microsoft Store Beispiel          9NABCDEFG1234                       Unknown        Latest         msstore
'@
    $wingetTestPakete = @(Get-WinGetUpgradePaketeAusText -Text $testTabelle -Quelle 'winget' -Scope 'machine')
    $storeTestPakete = @(Get-WinGetUpgradePaketeAusText -Text $testTabelle -Quelle 'msstore' -Scope 'user')
    Assert-Selbsttest -Bedingung ($wingetTestPakete.Count -eq 2 -and @($wingetTestPakete.Id) -contains 'Hersteller.Beispiel' -and @($wingetTestPakete.Id) -contains 'Microsoft.DotNet.DesktopRuntime.7') -Meldung 'WinGet-Paket-IDs konnten nicht sicher anhand der Tabellenpositionen gelesen werden.'
    Assert-Selbsttest -Bedingung ($storeTestPakete.Count -eq 1 -and (Get-SichererText -Objekt $storeTestPakete[0] -Name 'Id') -eq '9NABCDEFG1234') -Meldung 'Microsoft-Store-Paket-ID konnte nicht aus der Tabelle gelesen werden.'
    $testTabelleOhneQuelle = @'
Name                 ID                           Version            Verfuegbar
-----------------------------------------------------------------------------------------
Advanced SystemCare  IObit.AdvancedSystemCare     < 19.5.0.221       19.5.0.221
Epic Online Services EpicGames.EpicOnlineServices 2.0.42.0           4.3.1
'@
    $paketeOhneQuellenspalte = @(Get-WinGetUpgradePaketeAusText -Text $testTabelleOhneQuelle -Quelle 'winget' -Scope 'machine')
    Assert-Selbsttest -Bedingung ($paketeOhneQuellenspalte.Count -eq 2 -and @($paketeOhneQuellenspalte.Id) -contains 'IObit.AdvancedSystemCare' -and @($paketeOhneQuellenspalte.Id) -contains 'EpicGames.EpicOnlineServices') -Meldung 'Reale WinGet-1.29-Ausgabe ohne redundante Quellenspalte oder mit Vergleichsmarker in der Version wurde nicht korrekt gelesen.'
    $testTabelleVersetzt = @'
Name                 ID                  Version      Verfuegbar   Quelle
------------------------------------------------------------------------
ÄÖÜ Anwendung        Hersteller.Unicode  1.0.0        1.1.0       winget

1 Aktualisierung verfügbar.
'@
    $versetztePakete = @(Get-WinGetUpgradePaketeAusText -Text $testTabelleVersetzt -Quelle 'winget' -Scope 'user')
    Assert-Selbsttest -Bedingung ($versetztePakete.Count -eq 1 -and (Get-SichererText -Objekt $versetztePakete[0] -Name 'Id') -eq 'Hersteller.Unicode') -Meldung 'Unicode- oder leicht versetzte WinGet-Updatezeile wurde nicht sicher erkannt.'

    Assert-Selbsttest -Bedingung (@(Get-WinGetUpgradePaketeAusText -Text 'Keine Aktualisierungen verfuegbar.' -Quelle 'winget' -Scope 'machine').Count -eq 0) -Meldung 'Text ohne Paketzeilen wurde faelschlich als Update-Liste interpretiert.'

    $verschobeneTabelle = @'
Name      ID        Version  Verfuegbar  Quelle
----------------------------------------------
Foo App Foo.App 1.0 winget
'@
    Assert-Selbsttest -Bedingung (@(Get-WinGetUpgradePaketeAusText -Text $verschobeneTabelle -Quelle 'winget' -Scope 'machine').Count -eq 0) -Meldung 'Eine unvollstaendige Tabellenzeile wurde faelschlich als Paket interpretiert.'

    $abgeschnitteneTabelle = @'
Name                    ID                  Version  Verfuegbar  Quelle
---------------------------------------------------------------------
Abgeschnittenes Paket   Hersteller.Pak...  1.0      2.0         winget
'@
    Assert-Selbsttest -Bedingung (@(Get-WinGetUpgradePaketeAusText -Text $abgeschnitteneTabelle -Quelle 'winget' -Scope 'machine').Count -eq 0) -Meldung 'Eine abgeschnittene Paket-ID wurde faelschlich fuer ein Update verwendet.'

    $gemischteTabelle = @'
Name                    ID                    Version  Verfuegbar  Quelle
-----------------------------------------------------------------------
Gueltiges Paket         Hersteller.Gueltig    1.0      2.0         winget
Abgeschnittenes Paket   Hersteller.Pak...     1.0      2.0         winget
'@
    $gemischteAnalyse = Get-WinGetUpgradeAnalyseAusText -Text $gemischteTabelle -Quelle 'winget' -Scope 'machine'
    $gemischtePakete = @(Get-SichereEigenschaft -Objekt $gemischteAnalyse -Name 'Pakete' -Standardwert @())
    Assert-Selbsttest -Bedingung ($gemischtePakete.Count -eq 1 -and (Get-SichererText -Objekt $gemischtePakete[0] -Name 'Id') -eq 'Hersteller.Gueltig') -Meldung 'Eine unsichere WinGet-Zeile hat weiterhin alle eindeutig erkannten Updates verworfen.'
    Assert-Selbsttest -Bedingung ([int](Get-SichereEigenschaft -Objekt $gemischteAnalyse -Name 'UnsichereZeilen' -Standardwert 0) -eq 1) -Meldung 'Unsichere WinGet-Updatezeile wurde nicht getrennt gezaehlt.'

    $verrutschteEinzelabstandTabelle = @'
Name                              ID                                  Version        Verfuegbar     Quelle
--------------------------------------------------------------------------------------------------------
Muenchen Werkzeug Desktop Gamma Runtime Zj1L.dX.xvu5 1.0 winget
'@
    $verrutschteAnalyse = Get-WinGetUpgradeAnalyseAusText -Text $verrutschteEinzelabstandTabelle -Quelle 'winget' -Scope 'machine'
    Assert-Selbsttest -Bedingung (@(Get-SichereEigenschaft -Objekt $verrutschteAnalyse -Name 'Pakete' -Standardwert @()).Count -eq 0) -Meldung 'Eine verrutschte Einzelabstand-Zeile wurde faelschlich als Updatepaket akzeptiert.'

    $sammelFunktionsMuster = '(?m)^\s*function\s+Invoke-WinGet' + 'SammelUpdate\b'
    Assert-Selbsttest -Bedingung ($skriptText -notmatch $sammelFunktionsMuster) -Meldung 'Der fehleranfaellige Sammelupdate-Fallback ist noch enthalten.'
    Assert-Selbsttest -Bedingung ($skriptText -notmatch '(?i)(?:''|")upgrade(?:''|")\s*,\s*(?:''|")--all(?:''|")') -Meldung 'Ein automatischer WinGet-Sammelupdate-Aufruf ist noch enthalten.'


    Assert-Selbsttest -Bedingung (Test-SichereWinGetPaketId -Id 'Microsoft.PowerToys') -Meldung 'Gueltige WinGet-Paketkennung wurde abgelehnt.'

    Assert-Selbsttest -Bedingung (Test-SichereWinGetPaketIdFuerQuelle -Id 'Microsoft.PowerToys' -Quelle 'winget') -Meldung 'Gueltige Community-Paketkennung wurde abgelehnt.'
    Assert-Selbsttest -Bedingung (-not (Test-SichereWinGetPaketIdFuerQuelle -Id 'Desktop' -Quelle 'winget')) -Meldung 'Ein einzelnes Namenswort wurde faelschlich als Community-Paketkennung akzeptiert.'
    Assert-Selbsttest -Bedingung (Test-SichereWinGetPaketIdFuerQuelle -Id '9NABCDEFG1234' -Quelle 'msstore') -Meldung 'Gueltige Microsoft-Store-Produktkennung wurde abgelehnt.'
    Assert-Selbsttest -Bedingung (Test-SichereWinGetPaketIdFuerQuelle -Id 'XP9KHM4BK9FZ7Q' -Quelle 'msstore') -Meldung 'Gueltige X-Praefix-Store-Produktkennung wurde abgelehnt.'
    Assert-Selbsttest -Bedingung (-not (Test-SichereWinGetPaketIdFuerQuelle -Id 'Werkzeug' -Quelle 'msstore')) -Meldung 'Ein kurzes Namenswort wurde faelschlich als Store-Produktkennung akzeptiert.'
    Assert-Selbsttest -Bedingung (Test-SichererWinGetVersionswert -Wert '1.2.3') -Meldung 'Gueltiger WinGet-Versionswert wurde abgelehnt.'
    Assert-Selbsttest -Bedingung (-not (Test-SichererWinGetVersionswert -Wert 'Runtime')) -Meldung 'Ein Namenswort wurde faelschlich als Versionswert akzeptiert.'
    Assert-Selbsttest -Bedingung ((Compare-EinfachePaketversion -Links '3.0.12' -Rechts '3.0') -eq 1) -Meldung 'Eine lokal neuere numerische Paketversion wurde nicht erkannt.'
    Assert-Selbsttest -Bedingung ((Compare-EinfachePaketversion -Links '3.0' -Rechts '3.0.0') -eq 0) -Meldung 'Aequivalente numerische Paketversionen wurden ungleich bewertet.'
    Assert-Selbsttest -Bedingung ($null -eq (Compare-EinfachePaketversion -Links '> 1.8.9' -Rechts '1.8.9')) -Meldung 'Ein unsicherer Versionswert mit Vergleichsmarker wurde geordnet.'
    Assert-Selbsttest -Bedingung (Test-PaketAusgeschlossen -Id 'Microsoft.UI.Xaml.2.8') -Meldung 'Windows-AppX-Framework wurde nicht aus der generischen Reparatur ausgeschlossen.'
    Assert-Selbsttest -Bedingung (Test-PaketAusgeschlossen -Id 'Microsoft.WindowsAppRuntime.1.8') -Meldung 'Windows App Runtime wurde nicht aus der generischen Reparatur ausgeschlossen.'
    Assert-Selbsttest -Bedingung (Test-PaketAusgeschlossen -Id 'Microsoft.AppInstaller') -Meldung 'Die laufende WinGet-/App-Installer-Voraussetzung wurde nicht aus der generischen Reparatur ausgeschlossen.'
    Assert-Selbsttest -Bedingung (-not (Test-PaketAusgeschlossen -Id 'Microsoft.OneDrive')) -Meldung 'OneDrive wurde durch das Teilwort edr faelschlich als Sicherheitsagent ausgeschlossen.'
    Assert-Selbsttest -Bedingung (-not (Test-PaketAusgeschlossen -Id 'Hersteller.Anwendung')) -Meldung 'Normale Anwendung wurde faelschlich aus der Reparatur ausgeschlossen.'

    Assert-Selbsttest -Bedingung (-not (Test-SichereWinGetPaketId -Id '--override')) -Meldung 'Eine als Befehlsoption nutzbare Paketkennung wurde nicht blockiert.'
    Assert-Selbsttest -Bedingung (-not (Test-SichereWinGetPaketId -Id 'Paket mit Leerzeichen')) -Meldung 'Paketkennung mit Leerzeichen wurde nicht blockiert.'
    Assert-Selbsttest -Bedingung ((ConvertTo-SichererDateiname -Wert 'Hersteller:Paket*Test' -MaximaleLaenge 40) -notmatch '[:*]') -Meldung 'Ungueltige Dateinamenzeichen wurden nicht entfernt.'

    $reparaturHilfeTest = '--id --exact --source --scope --silent --accept-source-agreements --accept-package-agreements --disable-interactivity --no-progress'
    $reparaturHilfeOhneZusatzoption = '--id --exact --source --scope --silent --accept-source-agreements --accept-package-agreements'
    $listHilfeTest = '--id --exact --source --scope --accept-source-agreements --disable-interactivity --no-progress'
    $downloadHilfeTest = '--id --exact --source --scope --download-directory --accept-source-agreements --accept-package-agreements --skip-license --disable-interactivity --no-progress'
    $installHilfeTest = '--id --exact --source --scope --silent --force --accept-source-agreements --accept-package-agreements --disable-interactivity --no-progress'
    $reparaturArgumenteTest = @(New-WinGetReparaturArgumente -Id 'Hersteller.Paket' -Quelle 'winget' -Scope 'user' -HilfeText $reparaturHilfeTest)
    $storeReparaturArgumenteTest = @(New-WinGetReparaturArgumente -Id '9NABCDEFG1234' -Quelle 'msstore' -Scope 'user' -HilfeText $reparaturHilfeTest)
    $reparaturArgumenteOhneZusatzoption = @(New-WinGetReparaturArgumente -Id 'Hersteller.Paket' -Quelle 'winget' -Scope 'user' -HilfeText $reparaturHilfeOhneZusatzoption)
    $listArgumenteTest = @(New-WinGetListArgumente -Id 'Hersteller.Paket' -Quelle 'winget' -Scope 'user' -HilfeText $listHilfeTest)
    $listFallbackArgumenteTest = @(New-WinGetListFallbackArgumente -Id 'Hersteller.Paket' -Scope 'machine' -HilfeText $listHilfeTest)
    $downloadArgumenteTest = @(New-WinGetDownloadArgumente -Id 'Hersteller.Paket' -ZielOrdner 'C:\Temp\Paket' -Scope 'user' -HilfeText $downloadHilfeTest)
    $installArgumenteTest = @(New-WinGetNeuinstallationsArgumente -Id 'Hersteller.Paket' -Quelle 'winget' -Scope 'user' -HilfeText $installHilfeTest)
    $storeInstallArgumenteTest = @(New-WinGetNeuinstallationsArgumente -Id '9NABCDEFG1234' -Quelle 'msstore' -Scope 'user' -HilfeText $installHilfeTest)
    Assert-Selbsttest -Bedingung ($reparaturArgumenteTest[0] -eq 'repair' -and $reparaturArgumenteTest -contains '--source' -and $reparaturArgumenteTest -contains '--scope' -and $reparaturArgumenteTest -contains 'user' -and $reparaturArgumenteTest -contains '--silent' -and $reparaturArgumenteTest -contains '--disable-interactivity') -Meldung 'Sicherer WinGet-Reparaturplan wurde nicht korrekt erstellt.'
    Assert-Selbsttest -Bedingung ($storeReparaturArgumenteTest[0] -eq 'repair' -and $storeReparaturArgumenteTest -contains '--source' -and $storeReparaturArgumenteTest -contains 'msstore' -and $storeReparaturArgumenteTest -contains '--scope' -and $storeReparaturArgumenteTest -contains 'user') -Meldung 'Microsoft-Store-Reparaturplan wurde nicht mit der korrekten Quelle erstellt.'
    Assert-Selbsttest -Bedingung ($reparaturArgumenteOhneZusatzoption[0] -eq 'repair' -and $reparaturArgumenteOhneZusatzoption -contains '--silent' -and $reparaturArgumenteOhneZusatzoption -notcontains '--disable-interactivity') -Meldung 'Eine WinGet-Reparatur ohne die versionsabhaengige Zusatzoption --disable-interactivity wurde faelschlich blockiert.'
    Assert-Selbsttest -Bedingung ($listArgumenteTest[0] -eq 'list' -and $listArgumenteTest -contains '--scope' -and $listArgumenteTest -contains 'user') -Meldung 'Sicherer WinGet-Listenplan wurde nicht korrekt erstellt.'
    Assert-Selbsttest -Bedingung ($listFallbackArgumenteTest[0] -eq 'list' -and $listFallbackArgumenteTest -contains '--scope' -and $listFallbackArgumenteTest -contains 'machine' -and $listFallbackArgumenteTest -notcontains '--source') -Meldung 'Quellenunabhaengiger WinGet-Listenfallback wurde nicht korrekt erstellt.'
    Assert-Selbsttest -Bedingung ($downloadArgumenteTest[0] -eq 'download' -and $downloadArgumenteTest -contains '--download-directory' -and $downloadArgumenteTest -contains '--scope' -and $downloadArgumenteTest -contains 'user' -and $downloadArgumenteTest -contains '--disable-interactivity') -Meldung 'Sicherer WinGet-Downloadplan wurde nicht korrekt erstellt.'
    Assert-Selbsttest -Bedingung ($installArgumenteTest[0] -eq 'install' -and $installArgumenteTest -contains '--source' -and $installArgumenteTest -contains 'winget' -and $installArgumenteTest -contains '--force' -and $installArgumenteTest -contains '--silent' -and $installArgumenteTest -contains '--scope' -and $installArgumenteTest -contains 'user' -and $installArgumenteTest -notcontains ('--uninstall-' + 'previous')) -Meldung 'Sicherer Community-In-Place-Neuinstallationsplan wurde nicht korrekt erstellt.'
    Assert-Selbsttest -Bedingung ($storeInstallArgumenteTest[0] -eq 'install' -and $storeInstallArgumenteTest -contains '--source' -and $storeInstallArgumenteTest -contains 'msstore' -and $storeInstallArgumenteTest -contains '--force' -and $storeInstallArgumenteTest -contains '--silent' -and $storeInstallArgumenteTest -contains '--scope' -and $storeInstallArgumenteTest -contains 'user' -and $storeInstallArgumenteTest -notcontains ('--uninstall-' + 'previous')) -Meldung 'Sicherer Microsoft-Store-Neuinstallationsplan wurde nicht korrekt erstellt.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?m)^function Invoke-MicrosoftStoreNeuinstallation\b') -Meldung 'Der Microsoft-Store-Neuinstallationsfallback fehlt.'
    $fehlendeForceOptionErkannt = $false
    try { $null = New-WinGetNeuinstallationsArgumente -Id 'Hersteller.Paket' -Quelle 'winget' -Scope 'user' -HilfeText '--id --exact --source --scope --silent --accept-source-agreements --accept-package-agreements --disable-interactivity' } catch { $fehlendeForceOptionErkannt = $true }
    Assert-Selbsttest -Bedingung $fehlendeForceOptionErkannt -Meldung 'Neuinstallation ohne WinGet-Option --force wurde nicht blockiert.'
    $ungueltigeStoreIdErkannt = $false
    try { $null = New-WinGetNeuinstallationsArgumente -Id 'Hersteller.Paket' -Quelle 'msstore' -Scope 'user' -HilfeText $installHilfeTest } catch { $ungueltigeStoreIdErkannt = $true }
    Assert-Selbsttest -Bedingung $ungueltigeStoreIdErkannt -Meldung 'Eine Community-Paketkennung wurde faelschlich fuer die Microsoft-Store-Quelle zugelassen.'

    Assert-Selbsttest -Bedingung (-not (Test-WinGetHilfeOption -HilfeText '--accept-source-agreements' -Option '--source')) -Meldung 'WinGet-Hilfeoption --source wurde faelschlich als Teil von --accept-source-agreements erkannt.'
    Assert-Selbsttest -Bedingung (Test-WinGetHilfeOption -HilfeText '  --source  Quelle' -Option '--source') -Meldung 'Exakte WinGet-Hilfeoption --source wurde nicht erkannt.'
    Assert-Selbsttest -Bedingung ((ConvertTo-SichererDateiname -Wert 'CON' -MaximaleLaenge 20) -eq 'Paket_CON') -Meldung 'Reservierter Windows-Dateiname wurde nicht abgesichert.'
    Assert-Selbsttest -Bedingung ((ConvertTo-SichererDateiname -Wert ('CON.' + ('X' * 100)) -MaximaleLaenge 20).Length -le 20) -Meldung 'Reservierter Windows-Dateiname ueberschreitet nach der Absicherung die erlaubte Laenge.'
    Assert-Selbsttest -Bedingung (Test-PfadUnterBasis -Basis 'C:\Basis' -Kandidat 'C:\Basis\Paket') -Meldung 'Gueltiger Unterordner wurde von der Pfadschutzfunktion abgelehnt.'
    Assert-Selbsttest -Bedingung (-not (Test-PfadUnterBasis -Basis 'C:\Basis' -Kandidat 'C:\Basis2\Paket')) -Meldung 'Pfad ausserhalb des kontrollierten Basisordners wurde nicht blockiert.'
    Assert-Selbsttest -Bedingung ($skriptText -match 'Installationsdateien-\$laufKennung') -Meldung 'Der Installationsordner besitzt keine eindeutige Laufkennung.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?m)^function Invoke-OneClickAbschlussbereinigung\b' -and $skriptText -match 'AbschlussbereinigungVerifiziert') -Meldung 'Die verifizierte Abschlussbereinigung laufbezogener Restdaten fehlt.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?s)function Initialize-Protokollierung\b.+?Get-OneClickDokumenteBasis.+?OneClick-ProgrammReparatur-Laufzeit.+?OneClick-Reparaturberichte' -and $skriptText -match '(?s)function Invoke-BenutzerProgrammeNichtErhoeht\b.+?Get-OneClickDokumenteBasis.+?OneClick-ProgrammReparatur-Benutzer-Laufzeit') -Meldung 'Laufzeitdaten oder Berichte sind nicht eindeutig unter Windows-Dokumente getrennt.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?m)^function Remove-OneClickVeralteteBerichte\b' -and $skriptText -match 'RecycleOption\]::SendToRecycleBin' -and $skriptText -match '(?m)^function Register-OneClickBerichtsaufbewahrungsaufgabe\b' -and $skriptText -match '\$definition\.Triggers\.Create\(2\)' -and $skriptText -match '\$definition\.Triggers\.Create\(9\)' -and $skriptText -match "Repetition\.Interval\s*=\s*'PT1H'") -Meldung 'Die automatische Drei-Tage-Berichtsaufbewahrung ueber den Windows-Papierkorb fehlt.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?m)^function Move-OneClickLegacyBerichteUndBereinigeDaten\b' -and $skriptText -match 'Join-Path \$env:ProgramData ''OneClick-ProgrammReparatur''' -and $skriptText -match 'Join-Path \$env:LOCALAPPDATA ''OneClick-ProgrammReparatur-Benutzer''') -Meldung 'Die kontrollierte Migration alter ProgramData-/LocalAppData-Reste in Windows-Dokumente fehlt.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?m)^function Complete-OneClickPaketPruefstatusNachGesamterfolg\b' -and $skriptText -match 'Paket-Pruefstatus-v1\.json ist nach dem vollstaendig erfolgreichen Abschluss noch vorhanden' -and $skriptText -notmatch '\$alter\.TotalDays\s*-le') -Meldung 'Der Paket-Pruefstatus ist noch zeitbasiert oder wird nicht erst nach dem vollstaendigen Gesamterfolg geloescht.'
    $berichtExportPosition = $skriptText.LastIndexOf('try { Export-Abschlussbericht }', [StringComparison]::Ordinal)
    $paketStatusAbschlussPosition = $skriptText.LastIndexOf('Complete-OneClickPaketPruefstatusNachGesamterfolg', [StringComparison]::Ordinal)
    Assert-Selbsttest -Bedingung ($berichtExportPosition -ge 0 -and $paketStatusAbschlussPosition -gt $berichtExportPosition) -Meldung 'Der Paket-Pruefstatus koennte vor dem Abschlussbericht geloescht werden.'
    $bereinigungsTestBasis = [IO.Path]::GetFullPath([IO.Path]::GetTempPath()).TrimEnd([char]92)
    $bereinigungsTestPfad = Join-Path -Path $bereinigungsTestBasis -ChildPath ('OneClick-Selbsttest-' + [Guid]::NewGuid().ToString('N'))
    try {
        $unterordner = Join-Path -Path $bereinigungsTestPfad -ChildPath 'Download'
        New-Item -ItemType Directory -Path $unterordner -Force -ErrorAction Stop | Out-Null
        Set-Content -LiteralPath (Join-Path -Path $unterordner -ChildPath 'Installer.test') -Value 'Selbsttest' -Encoding UTF8 -ErrorAction Stop
        $bereinigungsTest = Remove-OneClickKontrolliertenLaufpfad -Pfad $bereinigungsTestPfad -Basis $bereinigungsTestBasis -ErlaubtesNamensmuster '^OneClick-Selbsttest-[0-9a-f]{32}$' -NichtZaehlen
        Assert-Selbsttest -Bedingung ([bool]$bereinigungsTest.Entfernt -and $bereinigungsTest.Dateien -eq 1 -and $bereinigungsTest.Ordner -eq 2 -and -not (Test-Path -LiteralPath $bereinigungsTestPfad)) -Meldung 'Angelegte Selbsttest-Restdaten wurden nicht vollstaendig entfernt und nachkontrolliert.'
    }
    finally {
        if (Test-Path -LiteralPath $bereinigungsTestPfad) {
            Remove-Item -LiteralPath $bereinigungsTestPfad -Recurse -Force -ErrorAction SilentlyContinue
        }
    }
    Assert-Selbsttest -Bedingung ($skriptText -match "AbsolutePath\.TrimEnd\('/'\) -ne '/api/v2'") -Meldung 'Die PSGallery-Adresse wird nicht auf den offiziellen API-v2-Pfad begrenzt.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?m)^function Get-OffiziellePowerShellAssetPruefsumme\b') -Meldung 'Der offizielle hashes.sha256-Fallback fuer PowerShell-Releasepakete fehlt.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?m)^function Get-OffiziellePowerShellReleaseInformation\b' -and $skriptText -match 'PowerShell/PowerShell/releases/latest') -Meldung 'Die offizielle Ermittlung der neuesten stabilen PowerShell-7-Version fehlt.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?m)^function Ensure-NeuestePowerShell7\b' -and $skriptText -match '(?m)^function Start-SelbstMitAktuellerPowerShell7\b') -Meldung 'Die zwingende PowerShell-Aktualitaetspruefung mit Neustart des Hauptlaufs fehlt.'
    Assert-Selbsttest -Bedingung ($skriptText -match "Invoke-Phase -Name 'Neueste stabile PowerShell 7 pruefen und bereitstellen'[\s\S]{0,800}Start-SelbstMitAktuellerPowerShell7") -Meldung 'Die PowerShell-Aktualitaetspruefung ist nicht vor dem eigentlichen Hauptlauf eingebunden.'
    Assert-Selbsttest -Bedingung ($skriptText -notmatch '(?i)PowerShellAktualitaet(?:Bestaetigt|Ueberspringen)') -Meldung 'Die zwingende PowerShell-Aktualitaetspruefung besitzt einen umgehbaren Startschalter.'
    $windowsPruefPosition = $skriptText.LastIndexOf("Invoke-Phase -Name 'Windows-Systempruefung und -reparatur vor Programmaktionen'", [StringComparison]::Ordinal)
    $programmInventarPosition = $skriptText.LastIndexOf('$registryInventar = Invoke-Phase', [StringComparison]::Ordinal)
    $programmUpdatePosition = $skriptText.LastIndexOf("Invoke-Phase -Name 'Computerweite Programme aktualisieren'", [StringComparison]::Ordinal)
    Assert-Selbsttest -Bedingung ($windowsPruefPosition -ge 0 -and $programmInventarPosition -gt $windowsPruefPosition -and $programmUpdatePosition -gt $windowsPruefPosition) -Meldung 'Windows wird nicht nachweislich vor Programminventar, Updates und Reparaturen geprueft.'
    $ablaufMarken = @(
        "Invoke-Phase -Name 'Windows-Systempruefung und -reparatur vor Programmaktionen'",
        "Invoke-Phase -Name 'Registry-Inventar'",
        "Invoke-Phase -Name 'WinGet bereitstellen'",
        "Invoke-Phase -Name 'Benutzerprogramme im kontrollierten Benutzer-Scope aktualisieren'",
        "Invoke-Phase -Name 'Computerweite Programme aktualisieren'",
        "Invoke-Phase -Name 'Aktuelles Registry-Inventar nach Updates'",
        "Invoke-Phase -Name 'Alle Registry-Programme pruefen und reparieren'",
        "Invoke-Phase -Name 'Benutzerprogramme im kontrollierten Benutzer-Scope reparieren'",
        "Invoke-Phase -Name 'Computerweite Programme reparieren'",
        'Complete-OneClickFortsetzung',
        'Invoke-OneClickAbschlussbereinigung',
        'Stop-MitPause -Code $script:ExitCode'
    )
    $letzteAblaufPosition = -1
    foreach ($ablaufMarke in $ablaufMarken) {
        $ablaufPosition = $skriptText.IndexOf($ablaufMarke, [Math]::Max(0, $letzteAblaufPosition + 1), [StringComparison]::Ordinal)
        Assert-Selbsttest -Bedingung ($ablaufPosition -gt $letzteAblaufPosition) -Meldung ("Der vollstaendige Normalablauf erreicht eine Phase nicht oder besitzt eine falsche Reihenfolge: {0}" -f $ablaufMarke)
        $letzteAblaufPosition = $ablaufPosition
    }
    $selbstTokens = $null
    $selbstParseFehler = $null
    $selbstAst = [Management.Automation.Language.Parser]::ParseFile($script:SelfPath, [ref]$selbstTokens, [ref]$selbstParseFehler)
    Assert-Selbsttest -Bedingung ($selbstParseFehler.Count -eq 0) -Meldung 'Die Abbruchpfad-Analyse konnte das Release nicht fehlerfrei parsen.'

    $selbstFunktionsDefinitionen = @{}
    foreach ($funktionsKnoten in @($selbstAst.FindAll({ param($knoten) $knoten -is [Management.Automation.Language.FunctionDefinitionAst] }, $true))) {
        $selbstFunktionsDefinitionen[$funktionsKnoten.Name.ToLowerInvariant()] = $funktionsKnoten
    }
    $unaufgeloesteBefehle = New-Object 'System.Collections.Generic.List[string]'
    $ungueltigeLokaleParameter = New-Object 'System.Collections.Generic.List[string]'
    $allgemeineParameter = @('Verbose', 'Debug', 'ErrorAction', 'WarningAction', 'InformationAction', 'ProgressAction', 'ErrorVariable', 'WarningVariable', 'InformationVariable', 'OutVariable', 'OutBuffer', 'PipelineVariable', 'WhatIf', 'Confirm')
    foreach ($befehlsKnoten in @($selbstAst.FindAll({ param($knoten) $knoten -is [Management.Automation.Language.CommandAst] }, $true))) {
        $befehlsName = $befehlsKnoten.GetCommandName()
        if ([string]::IsNullOrWhiteSpace($befehlsName)) { continue }
        $befehlsSchluessel = $befehlsName.ToLowerInvariant()
        if (-not $selbstFunktionsDefinitionen.ContainsKey($befehlsSchluessel)) {
            if ($null -eq (Get-Command -Name $befehlsName -ErrorAction SilentlyContinue)) {
                $unaufgeloesteBefehle.Add(('{0}:{1}' -f $befehlsKnoten.Extent.StartLineNumber, $befehlsName)) | Out-Null
            }
            continue
        }

        $lokalerParameterblock = $selbstFunktionsDefinitionen[$befehlsSchluessel].Body.ParamBlock
        $deklarierteParameter = if ($null -eq $lokalerParameterblock) {
            @()
        }
        else {
            @($lokalerParameterblock.Parameters | ForEach-Object { $_.Name.VariablePath.UserPath })
        }
        foreach ($parameterKnoten in @($befehlsKnoten.CommandElements | Where-Object { $_ -is [Management.Automation.Language.CommandParameterAst] })) {
            $angegebenerParameter = $parameterKnoten.ParameterName
            if ($allgemeineParameter -contains $angegebenerParameter -or $deklarierteParameter -contains $angegebenerParameter) { continue }
            $parameterTreffer = @($deklarierteParameter | Where-Object { $_.StartsWith($angegebenerParameter, [StringComparison]::OrdinalIgnoreCase) })
            if ($parameterTreffer.Count -ne 1) {
                $ungueltigeLokaleParameter.Add(('{0}:{1} -{2}' -f $parameterKnoten.Extent.StartLineNumber, $befehlsName, $angegebenerParameter)) | Out-Null
            }
        }
    }
    Assert-Selbsttest -Bedingung ($unaufgeloesteBefehle.Count -eq 0) -Meldung ("Nicht definierte oder im Zielhost nicht aufloesbare Befehle erkannt: {0}" -f ($unaufgeloesteBefehle.ToArray() -join ', '))
    Assert-Selbsttest -Bedingung ($ungueltigeLokaleParameter.Count -eq 0) -Meldung ("Ungueltige oder mehrdeutige Parameter lokaler Funktionen erkannt: {0}" -f ($ungueltigeLokaleParameter.ToArray() -join ', '))

    $exitKnoten = @($selbstAst.FindAll({ param($knoten) $knoten -is [Management.Automation.Language.ExitStatementAst] }, $true))
    $exitTexte = @($exitKnoten | ForEach-Object { $_.Extent.Text })
    Assert-Selbsttest -Bedingung ($exitKnoten.Count -eq 5 -and $exitTexte -contains 'exit $Code' -and $exitTexte -contains 'exit $bootstrapCode' -and $exitTexte -contains 'exit $elevatedCode' -and $exitTexte -contains 'exit $benutzerCode' -and $exitTexte -contains 'exit $script:ExitCode') -Meldung 'Ein nicht freigegebener vorzeitiger Skriptausgang wurde erkannt.'
    $neustartPruefPosition = $skriptText.LastIndexOf("Invoke-Phase -Name 'Ausstehenden Windows-Neustart pruefen'", [StringComparison]::Ordinal)
    Assert-Selbsttest -Bedingung ($neustartPruefPosition -ge 0 -and $neustartPruefPosition -lt $windowsPruefPosition -and $skriptText -match 'Vor dem OneClick-Lauf vorhanden; ohne Neustartpause fortgesetzt' -and $skriptText -notmatch "Add-OneClickNeustartnachweis\s+-Quelle\s+'Windows-Neustartvorpruefung'") -Meldung 'Ein bereits vor dem OneClick-Lauf vorhandener Windows-Neustartmarker koennte den Lauf noch faelschlich pausieren.'
    Assert-Selbsttest -Bedingung ($skriptText.Contains('$befehl += '' -AlleMSIReparieren''')) -Meldung 'Der MSI-Vollmodus wird beim Administratorneustart nicht weitergegeben.'
    Assert-Selbsttest -Bedingung ($skriptText.Contains('$befehl += '' -AlleWinGetReparieren''')) -Meldung 'Der WinGet-Vollmodus wird beim Administratorneustart nicht weitergegeben.'
    Assert-Selbsttest -Bedingung ($skriptText.Contains('$argumente.Add(''-AlleWinGetReparieren'')')) -Meldung 'Der WinGet-Vollmodus wird nicht an den kontrollierten Benutzer-Scope-Broker weitergegeben.'
    Assert-Selbsttest -Bedingung ($skriptText -match "Update-InstallierteProgramme[^\r\n]+-Scopes\s+@\('user'\)" -and $skriptText -match "Update-InstallierteProgramme[^\r\n]+-Scopes\s+@\('machine'\)") -Meldung 'Benutzer- und Maschinenupdates sind nicht strikt auf den bereits installierten Scope getrennt.'
    Assert-Selbsttest -Bedingung ($skriptText -match "Repair-InstallierteProgramme[^\r\n]+-Scopes\s+@\('user'\)" -and $skriptText -match "Repair-InstallierteProgramme[^\r\n]+-Scopes\s+@\('machine'\)") -Meldung 'Benutzer- und Maschinenreparaturen sind nicht strikt auf den bereits installierten Scope getrennt.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?s)if \(-not \$istPowerShell7Start\).+?Start-EingebettetePowerShell7Startdatei.+?exit \$bootstrapCode.+?if \(-not \$istAdministratorStart -and -not \$NurBenutzerProgramme\).+?Start-SelbstAlsAdministrator') -Meldung 'Der Doppelklick-Start wechselt nicht vor dem administrativen Hauptlauf strikt zu PowerShell 7.4 oder neuer.'
    Assert-Selbsttest -Bedingung ($skriptText -match "\[Version\]'7\.4\.0'") -Meldung 'Die fuer PSResourceGet erforderliche PowerShell-Mindestversion 7.4 fehlt.'
    Assert-Selbsttest -Bedingung ($skriptText -match '(?m)^function New-AbbruchgekoppeltesProzessJob\b' -and $skriptText -match '0x00002000') -Meldung 'Das Windows-Jobobjekt fuer KILL_ON_JOB_CLOSE fehlt.'
    Assert-Selbsttest -Bedingung ($skriptText -match 'BehaltenFuerFallback' -and $skriptText -match 'VorabDownloadOrdner') -Meldung 'Der verifizierte Vorabdownload kann vom Neuinstallationsfallback nicht wiederverwendet werden.'
    Assert-Selbsttest -Bedingung ($skriptText -match '\$script:UnaufgeloesteRegistryProgramme\+\+') -Meldung 'Unaufgeloeste beschaedigte Registry-Programme werden nicht eindeutig gezaehlt.'
    Assert-Selbsttest -Bedingung ($skriptText -match 'UnaufgeloesterBeschaedigungsverdacht') -Meldung 'Der Registry-Bericht weist unaufgeloeste Beschaedigungen nicht aus.'
    Assert-Selbsttest -Bedingung ($skriptText -match '\$productCodeErgebnisse\[\$productCode\]') -Meldung 'Doppelte MSI-Registry-Eintraege uebernehmen das Ergebnis der ersten Reparatur nicht.'

    $alterPaketPruefstatus = $script:PaketPruefstatus
    $alterWinGetVollmodus = [bool]$AlleWinGetReparieren
    try {
        $script:AlleWinGetReparieren = $false
        $script:PaketPruefstatus = @{}
        $testSchluessel = Get-PaketPruefstatusSchluessel -Id 'Hersteller.Selbsttest' -Quelle 'winget' -Scope 'user'
        $script:PaketPruefstatus[$testSchluessel] = [pscustomobject]@{
            Id = 'Hersteller.Selbsttest'; Quelle = 'winget'; Scope = 'user'; Versionen = @('1.2.3')
            ZeitUtc = [DateTimeOffset]::UtcNow.ToString('o'); PruefprofilVersion = [int]$script:PaketPruefprofilVersion; Methode = 'Reparatur'
        }
        Assert-Selbsttest -Bedingung (Test-PaketPruefstatusAktuell -Id 'Hersteller.Selbsttest' -Quelle 'winget' -Scope 'user' -Versionen @('1.2.3')) -Meldung 'Ein aktueller exakter Tiefenpruefpunkt wurde nicht erkannt.'
        Assert-Selbsttest -Bedingung (-not (Test-PaketPruefstatusAktuell -Id 'Hersteller.Selbsttest' -Quelle 'winget' -Scope 'user' -Versionen @('1.2.4'))) -Meldung 'Ein Tiefenpruefpunkt wurde trotz geaenderter Version wiederverwendet.'
        $script:AlleWinGetReparieren = $true
        Assert-Selbsttest -Bedingung (-not (Test-PaketPruefstatusAktuell -Id 'Hersteller.Selbsttest' -Quelle 'winget' -Scope 'user' -Versionen @('1.2.3'))) -Meldung 'Der WinGet-Vollmodus hat einen vorhandenen Tiefenpruefpunkt nicht uebersteuert.'
    }
    finally {
        $script:PaketPruefstatus = $alterPaketPruefstatus
        $script:AlleWinGetReparieren = $alterWinGetVollmodus
    }

    $listenTabelle = @'
Name                 ID                  Version      Quelle
------------------------------------------------------------
Beispiel Anwendung   Hersteller.Paket   1.0.0        winget
'@
    $listenTabelleMitUpdate = @'
Name                 ID                  Version      Verfuegbar   Quelle
------------------------------------------------------------------------
Beispiel Anwendung   Hersteller.Paket   1.0.0        1.1.0        winget
'@
    $listenMehrdeutig = @'
Name                 ID                  Version      Quelle
------------------------------------------------------------
Beispiel Anwendung   Hersteller.Paket   1.0.0        winget
Beispiel Anwendung   Hersteller.Paket   1.0.1        winget
'@
    Assert-Selbsttest -Bedingung ((Get-WinGetListenTrefferAnzahl -Text $listenTabelle -ErwarteteId 'Hersteller.Paket' -ErwarteteQuelle 'winget') -eq 1) -Meldung 'Eindeutiger WinGet-Listentreffer wurde nicht erkannt.'
    $listenAnzeigenamen = @(Get-WinGetListenAnzeigenamen -Text $listenTabelle -ErwarteteId 'Hersteller.Paket')
    Assert-Selbsttest -Bedingung ($listenAnzeigenamen.Count -eq 1 -and $listenAnzeigenamen[0] -eq 'Beispiel Anwendung') -Meldung 'Der eindeutige WinGet-Anzeigename fuer die Desktop-Verknuepfung wurde nicht gelesen.'
    Assert-Selbsttest -Bedingung ((Get-WinGetListenTrefferAnzahl -Text $listenTabelleMitUpdate -ErwarteteId 'Hersteller.Paket' -ErwarteteQuelle 'winget') -eq 1) -Meldung 'WinGet-Listentreffer mit Update-Spalte wurde nicht erkannt.'
    Assert-Selbsttest -Bedingung ((Get-WinGetListenTrefferAnzahl -Text $listenMehrdeutig -ErwarteteId 'Hersteller.Paket' -ErwarteteQuelle 'winget') -eq 2) -Meldung 'Mehrere WinGet-Listentreffer wurden nicht erkannt.'
    $geleseneMehrfachVersionen = @(Get-WinGetListenVersionen -Text $listenMehrdeutig -ErwarteteId 'Hersteller.Paket')
    Assert-Selbsttest -Bedingung ($geleseneMehrfachVersionen.Count -eq 2 -and $geleseneMehrfachVersionen[0] -eq '1.0.0' -and $geleseneMehrfachVersionen[1] -eq '1.0.1') -Meldung 'Versionen mehrerer exakter WinGet-Listentreffer wurden nicht sicher gelesen.'
    $listenUnicodeUndHinweis = @'
Name                 ID                  Version      Quelle
------------------------------------------------------------
ÄÖÜ Werkzeug         Hersteller.Paket   1.0.0       winget

1 Paket gefunden.
'@
    $listenFalscheId = @'
Name                 ID                  Version      Quelle
------------------------------------------------------------
Beispiel Anwendung   Andere.Paket       1.0.0        winget
'@
    $listenAbgeschnitten = @'
Name                 ID                  Version      Quelle
------------------------------------------------------------
Beispiel Anwendung   Hersteller.Pak...  1.0.0        winget
'@
    Assert-Selbsttest -Bedingung ((Get-WinGetListenTrefferAnzahl -Text $listenUnicodeUndHinweis -ErwarteteId 'Hersteller.Paket' -ErwarteteQuelle 'winget') -eq 1) -Meldung 'Unicode- oder leicht versetzte WinGet-Listenzeile wurde nicht sicher erkannt.'
    Assert-Selbsttest -Bedingung ((Get-WinGetListenTrefferAnzahl -Text $listenFalscheId -ErwarteteId 'Hersteller.Paket' -ErwarteteQuelle 'winget') -eq -1) -Meldung 'Unerwartete Paket-ID wurde in einer exakten Listenabfrage nicht blockiert.'
    Assert-Selbsttest -Bedingung ((Get-WinGetListenTrefferAnzahl -Text $listenAbgeschnitten -ErwarteteId 'Hersteller.Paket' -ErwarteteQuelle 'winget') -eq -1) -Meldung 'Abgeschnittene Paket-ID wurde in einer exakten Listenabfrage nicht blockiert.'

    $listen7ZipMitArchitektur = @'
Name                       ID          Version        Verfuegbar   Quelle
----------------------------------------------------------------------------
7-Zip 24.09 (x64)          7zip.7zip  24.09 (x64)   25.00        winget
'@
    $listenVortexMitZusatz = @'
Name                       ID                Version                 Quelle
----------------------------------------------------------------------------
Vortex                     NexusMods.Vortex  1.13.7 (machine-wide)   winget
'@
    $listenOhneQuelle = @'
Name                       ID                Version
---------------------------------------------------------------
Vortex                     NexusMods.Vortex  1.13.7 (machine-wide)
'@
    $listenOhneQuelleMitErwartetemFilter = @'
Name                       ID                Version
---------------------------------------------------------------
Vortex                     NexusMods.Vortex  1.13.7 (machine-wide)
'@
    $listenMitFremdUndTreffer = @'
Name                       ID                  Version      Quelle
------------------------------------------------------------------------
Fremdes Paket              Andere.Paket       2.0.0        winget
Beispiel Anwendung         Hersteller.Paket   1.0.0        winget
'@
    Assert-Selbsttest -Bedingung ((Get-WinGetListenTrefferAnzahl -Text $listen7ZipMitArchitektur -ErwarteteId '7zip.7zip' -ErwarteteQuelle 'winget') -eq 1) -Meldung '7-Zip mit mehrteiligem Versions- oder Architekturtext wurde nicht erkannt.'
    Assert-Selbsttest -Bedingung ((Get-WinGetListenTrefferAnzahl -Text $listenVortexMitZusatz -ErwarteteId 'NexusMods.Vortex' -ErwarteteQuelle 'winget') -eq 1) -Meldung 'Vortex mit mehrteiligem Versionszusatz wurde nicht erkannt.'
    Assert-Selbsttest -Bedingung ((Get-WinGetListenTrefferAnzahl -Text $listenOhneQuelle -ErwarteteId 'NexusMods.Vortex' -ErwarteteQuelle '') -eq 1) -Meldung 'Quellenunabhaengiger Listenfallback ohne Quellenspalte wurde nicht erkannt.'
    Assert-Selbsttest -Bedingung ((Get-WinGetListenTrefferAnzahl -Text $listenOhneQuelleMitErwartetemFilter -ErwarteteId 'NexusMods.Vortex' -ErwarteteQuelle 'winget') -eq 1) -Meldung 'Eine mit --source begrenzte WinGet-1.29-Liste ohne redundante Quellenspalte wurde nicht erkannt.'
    Assert-Selbsttest -Bedingung ((Get-WinGetListenTrefferAnzahl -Text $listenMitFremdUndTreffer -ErwarteteId 'Hersteller.Paket' -ErwarteteQuelle 'winget') -eq 1) -Meldung 'Ein gueltiger exakter Listentreffer wurde durch eine zusaetzliche Fremdzeile faelschlich verworfen.'

    Assert-Selbsttest -Bedingung ((Get-WinGetReparaturEntscheidung -ProzessErfolgreich $true -ExitCode 0 -Ausgabe '') -eq 'Repariert') -Meldung 'Erfolgreiche Reparatur wurde falsch klassifiziert.'
    Assert-Selbsttest -Bedingung ((Get-WinGetReparaturEntscheidung -ProzessErfolgreich $false -ExitCode -1978335109 -Ausgabe '') -eq 'Fallback') -Meldung 'Fehlgeschlagene Reparatur wurde nicht fuer den abgesicherten Fallback freigegeben.'
    Assert-Selbsttest -Bedingung ((Get-WinGetReparaturEntscheidung -ProzessErfolgreich $false -ExitCode -1978335107 -Ausgabe '') -eq 'Benutzerkontext') -Meldung 'Benutzerkontextfehler wurde nicht sicher erkannt.'
    Assert-Selbsttest -Bedingung ((Get-WinGetReparaturEntscheidung -ProzessErfolgreich $false -ExitCode -1978335215 -Ausgabe '') -eq 'Sicherheitsblockade') -Meldung 'Hash- oder Sicherheitsfehler wurde nicht vom Neuinstallationsfallback ausgeschlossen.'
    Assert-Selbsttest -Bedingung ((Get-WinGetReparaturEntscheidung -ProzessErfolgreich $false -ExitCode -1978334967 -Ausgabe '') -eq 'RepariertNeustart') -Meldung 'Erfolgreiche Reparatur mit Neustartanforderung wurde nicht erkannt.'
    Assert-Selbsttest -Bedingung ((Get-WinGetReparaturEntscheidung -ProzessErfolgreich $false -ExitCode -1978334971 -Ausgabe '') -eq 'Voraussetzung') -Meldung 'Speichermangel wurde faelschlich fuer eine Neuinstallation freigegeben.'
    Assert-Selbsttest -Bedingung ((Get-WinGetReparaturEntscheidung -ProzessErfolgreich $false -ExitCode -123456789 -Ausgabe '') -eq 'Fallback') -Meldung 'Allgemeiner Reparaturfehler wurde nicht an den abgesicherten Neuinstallationsfallback uebergeben.'

    $verboteneWinGetReparaturBefehle = @('Install-' + 'PackageProvider', 'Install-' + 'Module -Name Microsoft.WinGet.Client')
    foreach ($verboten in $verboteneWinGetReparaturBefehle) {
        Assert-Selbsttest -Bedingung ($skriptText -notmatch [regex]::Escape($verboten)) -Meldung ("Veralteter und blockierungsanfaelliger WinGet-Reparaturweg ist noch enthalten: {0}" -f $verboten)
    }
    $hashUmgehungsOption = '--ignore-' + 'security-hash'
    $deinstallationsOption = '--uninstall-' + 'previous'
    Assert-Selbsttest -Bedingung ($skriptText -notmatch [regex]::Escape($hashUmgehungsOption)) -Meldung 'Die WinGet-Hashpruefung wird durch eine verbotene Option umgangen.'
    Assert-Selbsttest -Bedingung ($skriptText -notmatch [regex]::Escape($deinstallationsOption)) -Meldung 'Automatische Deinstallation vor der Neuinstallation ist aktiviert.'

    $updateNachkontrollHilfe = '--id --exact --source --scope --upgrade-available --accept-source-agreements --disable-interactivity --no-progress'
    $updateNachkontrollArgumente = New-WinGetUpdateNachkontrollArgumente -Id 'Hersteller.Test' -Quelle 'winget' -Scope 'machine' -HilfeText $updateNachkontrollHilfe
    Assert-Selbsttest -Bedingung ($updateNachkontrollArgumente -contains '--upgrade-available' -and $updateNachkontrollArgumente -contains '--scope' -and $updateNachkontrollArgumente -contains 'machine') -Meldung 'Die Update-Nachkontrolle wurde nicht eindeutig auf Paket-ID, Quelle und Scope begrenzt.'

    Assert-Selbsttest -Bedingung ((Get-MSIProduktstatus -ProductCode 'ungueltig') -eq -1) -Meldung 'Ein ungueltiger MSI-Produktcode wurde bei der Produktstatuspruefung nicht sicher abgelehnt.'

    Add-Resultat -Bereich 'Skript' -Aktion 'Interner Laufzeit-Selbsttest' -Status 'Erfolgreich' -ExitCode 0 -Details 'Registry-, WinGet-, MSI-, Download-, Installations-, Reparatur-, Nachkontroll-, Neustart-, Scope-, Quellen-, Hash-, Pfad- und Rueckgabecode-Logik getestet.'

    Write-Status -Text 'Interner Laufzeit-Selbsttest erfolgreich.' -Stufe 'OK'
}

function Invoke-BenutzerProgrammHauptlauf {
    $kindCode = 1
    $ergebnisVollpfad = ''
    try {
        if (Test-IstAdministrator) {
            throw 'Der interne Benutzerprogramm-Lauf darf nicht mit Administratorrechten ausgefuehrt werden.'
        }
        $lokal = Get-OneClickDokumenteBasis
        $ergebnisBasis = Join-Path -Path $lokal -ChildPath 'OneClick-ProgrammReparatur-Benutzer-Laufzeit'
        $ergebnisVollpfad = [IO.Path]::GetFullPath($BenutzerErgebnisPfad)
        $erwarteteBasis = [IO.Path]::GetFullPath($ergebnisBasis).TrimEnd([char]92) + [char]92
        if (-not $ergebnisVollpfad.StartsWith($erwarteteBasis, [StringComparison]::OrdinalIgnoreCase) -or
            [IO.Path]::GetFileName($ergebnisVollpfad) -notmatch '^Benutzerprogramm-Ergebnis-[0-9a-f]{32}\.json$' -or
            (Test-Path -LiteralPath $ergebnisVollpfad)) {
            throw 'Der interne Ergebnispfad fuer den Benutzerprogramm-Lauf ist ungueltig oder bereits belegt.'
        }
        New-Item -ItemType Directory -Path $ergebnisBasis -Force -ErrorAction Stop | Out-Null
        if (-not (Test-VerzeichnisketteOhneReparsePoint -Basis $lokal -Kandidat $ergebnisBasis)) {
            throw 'Der interne Ergebnisordner fuer den Benutzerprogramm-Lauf ist eine Pfadumleitung.'
        }

        Initialize-Protokollierung -BenutzerKontext
        Write-Status -Text 'Nicht erhoehter Teilprozess fuer Programme des aktiven Benutzers gestartet.' -Stufe 'SCHRITT'
        Write-Status -Text ("PowerShell: {0}; Administrator: {1}; Skriptversion: {2}; Phasenmodus: {3}" -f $PSVersionTable.PSVersion, (Test-IstAdministrator), $script:Version, $BenutzerPhasenmodus) -Stufe 'INFO'
        $null = Invoke-Phase -Name 'Alte Reparaturberichte nach drei Tagen in den Papierkorb verschieben (Benutzer)' -Bereich 'Abschluss' -Fatal -Aktion { Remove-OneClickVeralteteBerichte -Aufbewahrungstage 3 }
        $null = Invoke-Phase -Name 'Interner Laufzeit-Selbsttest (Benutzer)' -Bereich 'Skript' -Fatal -Aktion { Invoke-InternerSelbsttest }
        $winget = Invoke-Phase -Name 'WinGet fuer Benutzerprogramme pruefen' -Bereich 'Programme' -Fatal -Aktion { Ensure-WinGet }
        if ([string]::IsNullOrWhiteSpace([string]$winget)) {
            throw 'WinGet ist im normalen Benutzerkontext nicht verfuegbar.'
        }
        $quellenStatus = Invoke-Phase -Name 'WinGet-Quellen fuer Benutzerprogramme pruefen' -Bereich 'Programme' -Fatal -Aktion { Repair-WinGetQuellen -WinGet $winget }
        $wingetQuelleOk = [bool](Get-SichereEigenschaft -Objekt $quellenStatus -Name 'Winget' -Standardwert $false)
        $storeQuelleOk = [bool](Get-SichereEigenschaft -Objekt $quellenStatus -Name 'MsStore' -Standardwert $false)
        if (-not ($wingetQuelleOk -or $storeQuelleOk)) {
            throw 'Im Benutzerkontext konnte keine offizielle WinGet-Quelle verifiziert werden.'
        }

        $inventare = New-Object 'System.Collections.Generic.List[string]'
        if ($BenutzerPhasenmodus -in @('Komplett', 'Reparatur')) {
            if ($wingetQuelleOk) {
                $pfad = Invoke-Phase -Name 'Benutzerinventar winget exportieren' -Bereich 'Inventar' -Fatal -Aktion { Export-WinGetInventar -WinGet $winget -Quelle 'winget' }
                if (-not [string]::IsNullOrWhiteSpace([string]$pfad)) { $inventare.Add([string]$pfad) | Out-Null }
            }
            if ($storeQuelleOk) {
                $pfad = Invoke-Phase -Name 'Benutzerinventar msstore exportieren' -Bereich 'Inventar' -Fatal -Aktion { Export-WinGetInventar -WinGet $winget -Quelle 'msstore' }
                if (-not [string]::IsNullOrWhiteSpace([string]$pfad)) { $inventare.Add([string]$pfad) | Out-Null }
            }
        }

        if ($BenutzerPhasenmodus -in @('Komplett', 'Update')) {
            $null = Invoke-Phase -Name 'Benutzerprogramme aktualisieren' -Bereich 'Programme' -Fatal -Aktion {
                Update-InstallierteProgramme -WinGet $winget -WingetQuelle $wingetQuelleOk -MsStoreQuelle $storeQuelleOk -Scopes @('user')
            }
        }
        if ($BenutzerPhasenmodus -in @('Komplett', 'Reparatur') -and $inventare.Count -gt 0) {
            $null = Invoke-Phase -Name 'Benutzerprogramme reparieren' -Bereich 'Programme' -Fatal -Aktion {
                Repair-InstallierteProgramme -WinGet $winget -InventarPfade $inventare.ToArray() -Scopes @('user')
            }
        }
        $kindCode = Get-AbschlussExitCode -WarnungsAnzahl $script:Warnungen.Count -NeustartErforderlich $script:NeustartErforderlich
    }
    catch {
        $kindCode = 1
        Write-Status -Text ("Fehler im nicht erhoehten Benutzerprogramm-Lauf: {0}" -f $_.Exception.Message) -Stufe 'FEHLER'
        try { Add-Resultat -Bereich 'Skript' -Aktion 'Benutzerprogramm-Lauf' -Status 'Schwerer Fehler' -ExitCode 1 -Details ($_ | Out-String) } catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }
    }
    finally {
        $script:ExitCode = $kindCode
        if ($script:TranscriptGestartet) {
            try { Stop-Transcript | Out-Null; $script:TranscriptGestartet = $false }
            catch {
                $kindCode = 1
                $script:ExitCode = 1
                try { Add-Resultat -Bereich 'Abschluss' -Aktion 'Benutzer-Transcript vor Bereinigung schliessen' -Status 'Fehlgeschlagen' -ExitCode 1 -Details $_.Exception.Message } catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }
            }
        }
        try { $null = Invoke-OneClickAbschlussbereinigung }
        catch {
            $kindCode = 1
            $script:ExitCode = 1
        }
        if (-not [string]::IsNullOrWhiteSpace([string]$script:BerichtOrdner)) {
            try { Export-Abschlussbericht }
            catch {
                $kindCode = 1
                $script:ExitCode = 1
                try { Add-Resultat -Bereich 'Abschluss' -Aktion 'Abschlussbericht schreiben' -Status 'Fehlgeschlagen' -ExitCode 1 -Details $_.Exception.Message } catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }
            }
        }
        try { $null = Remove-OneClickVeralteteBerichte -Aufbewahrungstage 3 }
        catch {
            $kindCode = 1
            $script:ExitCode = 1
            try { Add-Resultat -Bereich 'Abschluss' -Aktion 'Drei-Tage-Berichtsaufbewahrung nachkontrollieren' -Status 'Fehlgeschlagen' -ExitCode 1 -Details $_.Exception.Message } catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }
        }
        if ($kindCode -eq 0) {
            try { $null = Complete-OneClickPaketPruefstatusNachGesamterfolg }
            catch {
                $kindCode = 1
                $script:ExitCode = 1
            }
        }
        if (-not [string]::IsNullOrWhiteSpace($ergebnisVollpfad)) {
            try {
                $ergebnisBasis = [IO.Path]::GetDirectoryName($ergebnisVollpfad)
                New-Item -ItemType Directory -Path $ergebnisBasis -Force -ErrorAction Stop | Out-Null
                if (-not (Test-VerzeichnisketteOhneReparsePoint -Basis ([IO.Path]::GetDirectoryName($ergebnisBasis)) -Kandidat $ergebnisBasis)) {
                    throw 'Der fuer die einmalige Ergebnisuebergabe neu erstellte Ordner ist unsicher.'
                }
                [pscustomobject]@{
                    Schema = 1
                    Zeit = (Get-Date).ToString('o')
                    Administrator = [bool](Test-IstAdministrator)
                    ExitCode = [int]$kindCode
                    LogDatei = [string]$script:LogDatei
                    AktualisiertePakete = [int]$script:AktualisiertePakete
                    BereitsAktuellePakete = [int]$script:BereitsAktuellePakete
                    UebersprungeneUpdates = [int]$script:UebersprungeneUpdates
                    FehlgeschlageneUpdates = [int]$script:FehlgeschlageneUpdates
                    NachkontrollierteUpdates = [int]$script:NachkontrollierteUpdates
                    RepariertePakete = [int]$script:RepariertePakete
                    FehlgeschlageneReparaturen = [int]$script:FehlgeschlageneReparaturen
                    NachkontrollierteReparaturen = [int]$script:NachkontrollierteReparaturen
                    ErfolgreicheNeuinstallationen = [int]$script:ErfolgreicheNeuinstallationen
                    FehlgeschlageneNeuinstallationen = [int]$script:FehlgeschlageneNeuinstallationen
                    UnbehobeneProgrammfehler = [int]$script:UnbehobeneProgrammfehler
                    AktuelleReparaturPruefungenWiederverwendet = [int]$script:AktuelleReparaturPruefungenWiederverwendet
                    VorabDownloadsWiederverwendet = [int]$script:VorabDownloadsWiederverwendet
                    BereinigteRestdateien = [int]$script:BereinigteRestdateien
                    BereinigteRestordner = [int]$script:BereinigteRestordner
                    BereinigteRestbytes = [int64]$script:BereinigteRestbytes
                    Bereinigungsfehler = [int]$script:Bereinigungsfehler
                    AbschlussbereinigungVerifiziert = [bool]$script:AbschlussbereinigungVerifiziert
                    Warnungen = @($script:Warnungen.ToArray())
                } | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $ergebnisVollpfad -Encoding UTF8 -ErrorAction Stop
            }
            catch {
                $kindCode = 1
            }
        }
    }
    return [int]$kindCode
}

# -----------------------------
# Startsteuerung
# -----------------------------
$istWindowsStart = Test-IstWindows
$istAdministratorStart = if ($istWindowsStart) { Test-IstAdministrator } else { $false }
$istPowerShell7Start = ($PSVersionTable.PSEdition -eq 'Core' -and ($PSVersionTable.PSVersion.Major -gt 7 -or ($PSVersionTable.PSVersion.Major -eq 7 -and $PSVersionTable.PSVersion.Minor -ge 4)))

if (-not $istWindowsStart) {
    Set-Gesamtfortschritt -Prozent 0 -Status 'Startvoraussetzungen werden geprueft.' -Kategorie 'Start und Voraussetzungen' -KategorieProzent 0 -Dauerhaft
    Write-Status -Text 'Dieses Skript funktioniert ausschliesslich unter Windows.' -Stufe 'FEHLER'
    Stop-MitPause -Code 10
}

$windowsKompatibilitaet = Get-WindowsClientKompatibilitaet
if (-not [bool]$windowsKompatibilitaet.Unterstuetzt) {
    Set-Gesamtfortschritt -Prozent 0 -Status 'Windows- und Hardwarekompatibilitaet wurde nicht bestaetigt.' -Kategorie 'Start und Voraussetzungen' -KategorieProzent 5 -Dauerhaft
    Write-Status -Text ("Dieser PC erfuellt die Voraussetzungen fuer den vollstaendigen Reparaturlauf nicht: {0}" -f $windowsKompatibilitaet.Grund) -Stufe 'FEHLER'
    Stop-MitPause -Code 14
}
Write-Status -Text ("Kompatibilitaet bestaetigt: {0} {1}, Build {2}.{3}, Architektur {4}; Laufwerke und Benutzerpfade werden aus Windows ermittelt." -f $windowsKompatibilitaet.Windows, $windowsKompatibilitaet.Version, $windowsKompatibilitaet.Build, $windowsKompatibilitaet.Revision, $windowsKompatibilitaet.Architektur) -Stufe 'OK'

if (-not $istPowerShell7Start) {
    Set-Gesamtfortschritt -Prozent 0 -Status 'Eingebettete PowerShell-7-Startdatei wird ausgefuehrt.' -Kategorie 'Start und Voraussetzungen' -KategorieProzent 10 -Dauerhaft
    Write-Status -Text ("Doppelklick-Start erkannt: {0} {1} uebergibt an PowerShell 7 mit Administratorrechten." -f $PSVersionTable.PSEdition, $PSVersionTable.PSVersion) -Stufe 'INFO'
    $bootstrapCode = Start-EingebettetePowerShell7Startdatei
    exit $bootstrapCode
}

if (-not $istAdministratorStart -and -not $NurBenutzerProgramme) {
    Set-Gesamtfortschritt -Prozent 0 -Status 'Startvoraussetzungen werden geprueft.' -Kategorie 'Start und Voraussetzungen' -KategorieProzent 10 -Dauerhaft
    Set-Gesamtfortschritt -Prozent 1 -Status 'Administratorrechte werden angefordert.' -Kategorie 'Start und Voraussetzungen' -KategorieProzent 20 -Dauerhaft
    $elevatedCode = Start-SelbstAlsAdministrator
    exit $elevatedCode
}

# Sicherheitsgurt hinter der UAC-Uebergabe: Der oeffentliche Hauptlauf darf
# selbst bei einer unerwarteten Host- oder Tokenaenderung niemals ohne den
# nachkontrollierten erhoehten Administrator-Token fortgesetzt werden.
if (-not $NurBenutzerProgramme -and -not (Test-IstAdministrator)) {
    Set-Gesamtfortschritt -Prozent 1 -Status 'Administrator-Token wird nachkontrolliert.' -Kategorie 'Start und Voraussetzungen' -KategorieProzent 25 -Dauerhaft
    Write-Status -Text 'Der oeffentliche Hauptlauf besitzt nach der UAC-Uebergabe keinen erhoehten Administrator-Token und wird sicher beendet.' -Stufe 'FEHLER'
    Stop-MitPause -Code 13
}

Set-Gesamtfortschritt -Prozent 6 -Status 'PowerShell-7-Hauptlauf wird vorbereitet.' -Kategorie 'Start und Voraussetzungen' -KategorieProzent 40 -Dauerhaft

# Ab hier laeuft die eigentliche Reparatur garantiert unter PowerShell 7.
$script:HauptlaufAbbruchwaechter = Start-UnabhaengigenProzessAbbruchwaechter -AlleDirektenKindprozesse
if ($null -eq $script:HauptlaufAbbruchwaechter) {
    Write-Status -Text 'Der laufweite Prozessabbruchschutz konnte nicht sicher gestartet werden. Der Reparaturlauf wird nicht begonnen.' -Stufe 'FEHLER'
    Stop-MitPause -Code 12
}
if ($NurBenutzerProgramme) {
    try { $benutzerCode = Invoke-BenutzerProgrammHauptlauf }
    finally {
        try { Stop-UnabhaengigenProzessAbbruchwaechter -Waechter $script:HauptlaufAbbruchwaechter }
        catch {
            $benutzerCode = 1
            Write-Status -Text ("Abschlussbereinigung des Benutzerprozesswaechters fehlgeschlagen: {0}" -f $_.Exception.Message) -Stufe 'FEHLER'
        }
        $script:HauptlaufAbbruchwaechter = $null
    }
    exit $benutzerCode
}

try {
    $Host.UI.RawUI.WindowTitle = 'OneClick-Komplettreparatur-Release-v1.0.0 - PowerShell 7'
}
catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }

try {
    Initialize-Protokollierung
    Set-Gesamtfortschritt -Prozent 6 -Status 'PowerShell-7-Hauptlauf wird initialisiert.' -Kategorie 'Start und Voraussetzungen' -KategorieProzent 45 -Dauerhaft
    Write-Status -Text 'OneClick-Komplettreparatur-Release-v1.0.0 gestartet.' -Stufe 'SCHRITT'
    Write-Status -Text ("Skriptversion: {0}" -f $script:Version) -Stufe 'INFO'
    Write-Status -Text ("PowerShell: {0}; Edition: {1}" -f $PSVersionTable.PSVersion, $PSVersionTable.PSEdition) -Stufe 'INFO'
    Write-Status -Text ("Administrator: {0}" -f (Test-IstAdministrator)) -Stufe 'INFO'
    Write-Status -Text ("MSI-Vollreparatur: {0}" -f ([bool]$AlleMSIReparieren)) -Stufe 'INFO'
    Write-Status -Text ("WinGet-Vollreparatur ohne Pruefpunkt-Wiederverwendung: {0}" -f ([bool]$AlleWinGetReparieren)) -Stufe 'INFO'
    Write-Status -Text ("Bei schwerem Phasen-/Infrastrukturfehler abbrechen: {0}; einzelne Paketfehler werden immer isoliert und die Programmpruefung laeuft weiter." -f ([bool]$BeiFehlerAbbrechen)) -Stufe 'INFO'
    Write-Status -Text 'Leerlaufwaechter: Programme 10,00 Minuten; MSI 15,00 Minuten; DISM RestoreHealth 10,00 Minuten; DISM ScanHealth 10,00 Minuten; SFC/CHKDSK 30,00 Minuten; nachgelagerte Prozesse werden mit ueberwacht.' -Stufe 'INFO'
    Write-Status -Text ("Skriptpfad: {0}" -f $script:SelfPath) -Stufe 'INFO'

    if (-not $FortsetzenNachNeustart -and -not [string]::IsNullOrWhiteSpace($FortsetzungsStatusPfad)) {
        throw 'Ein Fortsetzungsstatuspfad darf nur zusammen mit -FortsetzenNachNeustart verwendet werden.'
    }
    if (-not $FortsetzenNachNeustart) {
        $null = Invoke-Phase -Name 'Veraltete fehlerhafte Neustartvorabfortsetzung bereinigen' -Bereich 'Neustart' -Aktion { Remove-OneClickVeralteteVorabFortsetzung }
    }
    if ($FortsetzenNachNeustart) {
        if ([string]::IsNullOrWhiteSpace($FortsetzungsStatusPfad)) {
            throw 'Die automatische Neustartfortsetzung wurde ohne Statuspfad aufgerufen.'
        }
        $status = Read-OneClickFortsetzungsstatus -StatusPfad $FortsetzungsStatusPfad
        $script:FortsetzungsStatus = $status
        $script:FortsetzungsPhase = Get-SichererText -Objekt $status -Name 'Phase'
        $script:FortsetzungsAbschnitt = Get-SichererText -Objekt $status -Name 'Abschnitt'
        $gespeicherterWindowsStart = [int64](Get-SichereEigenschaft -Objekt $status -Name 'WindowsStartTicks' -Standardwert 0)
        $aktuellerWindowsStart = Get-OneClickWindowsStartTicks
        if (-not (Test-OneClickNeustartErfolgt -GespeicherteWindowsStartTicks $gespeicherterWindowsStart -AktuelleWindowsStartTicks $aktuellerWindowsStart)) {
            Add-OneClickNeustartnachweis -Quelle 'Fortsetzungsstatus ohne neuen Windows-Start' -ExitCode 3010 -Details 'Die gespeicherte und aktuelle Windows-Startzeit sind identisch.'
            $script:NeustartPauseAktiv = $true
            $script:NeustartDialogNachAbschluss = $true
            $script:NeustartGrund = 'Windows wurde seit dem Speichern der Pause noch nicht neu gestartet.'
            throw (New-OneClickNeustartAusnahme -Meldung $script:NeustartGrund)
        }
        Remove-OneClickFortsetzungsaufgabe -AufgabenName (Get-SichererText -Objekt $status -Name 'AufgabenName')
        Add-Resultat -Bereich 'Neustart' -Aktion 'Pausierten Lauf nach Anmeldung fortsetzen' -Status 'Fortsetzungsstatus authentifiziert; Windows-Neustart bestaetigt' -ExitCode 0 -Details ("Phase: {0}; Abschnitt: {1}; vorheriger Start: {2}; aktueller Start: {3}" -f $script:FortsetzungsPhase, $script:FortsetzungsAbschnitt, $gespeicherterWindowsStart, $aktuellerWindowsStart)
        Write-Status -Text ("Windows-Neustart bestaetigt. Der pausierte Lauf wird ab Abschnitt '{0}' fortgesetzt." -f $script:FortsetzungsAbschnitt) -Stufe 'OK'
    }

    Set-Gesamtfortschritt -Prozent 8 -Status 'Interner Laufzeit-Selbsttest.' -Kategorie 'Start und Voraussetzungen' -KategorieProzent 65 -Dauerhaft
    $null = Invoke-Phase -Name 'Interner Laufzeit-Selbsttest' -Bereich 'Skript' -Fatal -Aktion { Invoke-InternerSelbsttest }
    $null = Invoke-Phase -Name 'Alte Reparaturberichte nach drei Tagen in den Papierkorb verschieben' -Bereich 'Abschluss' -Fatal -Aktion { Remove-OneClickVeralteteBerichte -Aufbewahrungstage 3 }
    $null = Invoke-Phase -Name 'Automatische Drei-Tage-Berichtsaufbewahrung einrichten' -Bereich 'Abschluss' -Fatal -Aktion { Register-OneClickBerichtsaufbewahrungsaufgabe }
    Set-Gesamtfortschritt -Prozent 10 -Status 'Neueste stabile PowerShell-7-Version wird verifiziert.' -Kategorie 'Start und Voraussetzungen' -KategorieProzent 85 -Dauerhaft
    $powerShellStatus = Invoke-Phase -Name 'Neueste stabile PowerShell 7 pruefen und bereitstellen' -Bereich 'PowerShell 7' -Fatal -Aktion { Ensure-NeuestePowerShell7 }
    if ([bool](Get-SichereEigenschaft -Objekt $powerShellStatus -Name 'Aktualisiert' -Standardwert $false)) {
        $neuerPowerShellPfad = Get-SichererText -Objekt $powerShellStatus -Name 'Pfad'
        $script:ExitCode = Start-SelbstMitAktuellerPowerShell7 -Pwsh $neuerPowerShellPfad
        exit $script:ExitCode
    }
    Set-Gesamtfortschritt -Prozent 11 -Status 'Ausstehende Windows-Neustartvorgaenge werden vor DISM geprueft.' -Kategorie 'Start und Voraussetzungen' -KategorieProzent 95 -Dauerhaft
    $windowsNeustartstatus = Invoke-Phase -Name 'Ausstehenden Windows-Neustart pruefen' -Bereich 'Windows' -Fatal -Aktion { Get-WindowsNeustartstatus }
    $script:WindowsNeustartstatusBeimStart = $windowsNeustartstatus
    if ([bool](Get-SichereEigenschaft -Objekt $windowsNeustartstatus -Name 'Ausstehend' -Standardwert $false)) {
        $neustartDetails = Get-SichererText -Objekt $windowsNeustartstatus -Name 'Details' -Standardwert 'Windows meldet ausstehende Neustartvorgaenge.'
        Add-Resultat -Bereich 'Windows' -Aktion 'Neustartvorpruefung' -Status 'Vor dem OneClick-Lauf vorhanden; ohne Neustartpause fortgesetzt' -ExitCode 0 -Details $neustartDetails
        Write-Status -Text ("Windows meldet bereits vor den Reparatur- und Installationsphasen einen ausstehenden Neustartstatus. OneClick hat zu diesem Zeitpunkt noch keine Aenderung ausgefuehrt, die einen Neustart verlangt. Der vorhandene Status wird protokolliert und fuer diesen Lauf nicht als OneClick-Neustartanforderung gewertet: {0}" -f $neustartDetails) -Stufe 'INFO'
    }
    if ($script:FortsetzungsPhase -eq 'WindowsSystem') {
        Set-Gesamtfortschritt -Prozent 12 -Status 'Windows-Wiederherstellungspunkt wird erstellt.' -Kategorie 'Windows-Systempruefung' -KategorieProzent 5 -Dauerhaft
        $null = Invoke-Phase -Name 'Wiederherstellungspunkt' -Bereich 'Windows' -Aktion { New-Wiederherstellungspunkt }
        Set-Gesamtfortschritt -Prozent 15 -Status 'Windows-Systembasis wird vor allen Programmaktionen geprueft und repariert.' -Kategorie 'Windows-Systempruefung' -KategorieProzent 8 -Dauerhaft
        $null = Invoke-Phase -Name 'Windows-Systempruefung und -reparatur vor Programmaktionen' -Bereich 'Windows' -Aktion { Repair-Windows }
        $null = Suspend-OneClickBeiNeustart -FortsetzungsPhase 'WindowsSystem' -FortsetzungsAbschnitt 'WindowsSystem' -Grund 'Eine Windows-Systemreparatur verlangt vor den weiteren Pruefungen einen Neustart.'
        $script:FortsetzungsPhase = 'Programme'
        $script:FortsetzungsAbschnitt = 'BenutzerUpdates'
    }

    else {
        Add-Resultat -Bereich 'Windows' -Aktion 'Windows-Systemphase nach Neustart' -Status 'Bereits vor der Pause abgeschlossen; sicher fortgesetzt' -ExitCode 0 -Details 'Fortsetzungsphase Programme'
        Write-Status -Text 'Die vor der Pause abgeschlossene Windows-Systemphase wird nicht erneut mutierend ausgefuehrt.' -Stufe 'OK'
    }

    $fortsetzungsRang = Get-OneClickFortsetzungsabschnittRang -Abschnitt $script:FortsetzungsAbschnitt

    # Erst nach DISM, SFC und CHKDSK beginnen Inventar, Updates und
    # Programmreparaturen. Im strikten Modus beendet jeder bestaetigte
    # Windows-Fehler den Lauf, bevor ein Programmpaket veraendert wird.
    Set-Gesamtfortschritt -Prozent 32 -Status 'Installierte Programme werden nach der Windows-Pruefung inventarisiert.' -Kategorie 'Programmbasis und Quellen' -KategorieProzent 10 -Dauerhaft
    $registryInventar = Invoke-Phase -Name 'Registry-Inventar' -Bereich 'Inventar' -Aktion { Export-RegistryInventar }

    $wingetQuelleOk = $false
    $storeQuelleOk = $false
    $registryPruefungAusgefuehrt = ($fortsetzungsRang -gt (Get-OneClickFortsetzungsabschnittRang -Abschnitt 'RegistryPruefung'))

    Set-Gesamtfortschritt -Prozent 38 -Status 'WinGet wird geprueft oder repariert.' -Kategorie 'Programmbasis und Quellen' -KategorieProzent 40 -Dauerhaft
    $winget = Invoke-Phase -Name 'WinGet bereitstellen' -Bereich 'Programme' -Aktion { Ensure-WinGet }
    if (-not [string]::IsNullOrWhiteSpace([string]$winget)) {
        Set-Gesamtfortschritt -Prozent 45 -Status 'Offizielle WinGet-Quellen werden verifiziert.' -Kategorie 'Programmbasis und Quellen' -KategorieProzent 75 -Dauerhaft
        $quellenStatus = Invoke-Phase -Name 'WinGet-Quellen pruefen' -Bereich 'Programme' -Aktion { Repair-WinGetQuellen -WinGet $winget }
        $wingetQuelleOk = [bool](Get-SichereEigenschaft -Objekt $quellenStatus -Name 'Winget' -Standardwert $false)
        $storeQuelleOk = [bool](Get-SichereEigenschaft -Objekt $quellenStatus -Name 'MsStore' -Standardwert $false)

        if ($wingetQuelleOk -or $storeQuelleOk) {
            $inventare = New-Object 'System.Collections.Generic.List[string]'
            if ($fortsetzungsRang -le (Get-OneClickFortsetzungsabschnittRang -Abschnitt 'BenutzerUpdates')) {
                Set-Gesamtfortschritt -Prozent 48 -Status 'Benutzerprogramme werden vom administrativen Hauptlauf kontrolliert aktualisiert.' -Kategorie 'Programmupdates' -KategorieProzent 0 -Dauerhaft
                $benutzerUpdateErgebnis = Invoke-Phase -Name 'Benutzerprogramme im kontrollierten Benutzer-Scope aktualisieren' -Bereich 'Programme' -Fatal -Aktion { Invoke-BenutzerProgrammeNichtErhoeht -Modus 'Update' }
                $null = Merge-BenutzerProgrammErgebnis -Ergebnis $benutzerUpdateErgebnis -Phase 'Update'
                $null = Suspend-OneClickBeiNeustart -FortsetzungsPhase 'Programme' -FortsetzungsAbschnitt 'BenutzerUpdates' -Grund 'Ein Programmupdate im Benutzer-Scope verlangt einen Windows-Neustart.'
            }

            if ($fortsetzungsRang -le (Get-OneClickFortsetzungsabschnittRang -Abschnitt 'MaschinenUpdates')) {
                Set-Gesamtfortschritt -Prozent 50 -Status 'Computerweit installierte Programme werden aktualisiert.' -Kategorie 'Programmupdates' -KategorieProzent 10 -Dauerhaft
                $null = Invoke-Phase -Name 'Computerweite Programme aktualisieren' -Bereich 'Programme' -Aktion { Update-InstallierteProgramme -WinGet $winget -WingetQuelle $wingetQuelleOk -MsStoreQuelle $storeQuelleOk -Scopes @('machine') }
                $null = Suspend-OneClickBeiNeustart -FortsetzungsPhase 'Programme' -FortsetzungsAbschnitt 'MaschinenUpdates' -Grund 'Ein computerweites Programmupdate verlangt einen Windows-Neustart.'
            }

            # Erst nach allen Updates werden die beiden Inventare neu erzeugt.
            # Dadurch bewertet keine Reparaturphase einen inzwischen veralteten
            # Versions- oder Installationszustand.
            Set-Gesamtfortschritt -Prozent 63 -Status 'Aktuelle WinGet-Inventare werden nach den Updates exportiert.' -Kategorie 'Programmnachkontrolle' -KategorieProzent 20 -Dauerhaft
            if ($wingetQuelleOk) {
                $wingetInventar = Invoke-Phase -Name 'Aktuelles WinGet-Inventar winget exportieren' -Bereich 'Inventar' -Fatal -Aktion { Export-WinGetInventar -WinGet $winget -Quelle 'winget' }
                if (-not [string]::IsNullOrWhiteSpace([string]$wingetInventar)) { $inventare.Add([string]$wingetInventar) | Out-Null }
            }
            if ($storeQuelleOk) {
                $storeInventar = Invoke-Phase -Name 'Aktuelles WinGet-Inventar msstore exportieren' -Bereich 'Inventar' -Fatal -Aktion { Export-WinGetInventar -WinGet $winget -Quelle 'msstore' }
                if (-not [string]::IsNullOrWhiteSpace([string]$storeInventar)) { $inventare.Add([string]$storeInventar) | Out-Null }
            }

            Set-Gesamtfortschritt -Prozent 64 -Status 'Registry-Inventar wird nach den Updates erneuert.' -Kategorie 'Programmnachkontrolle' -KategorieProzent 60 -Dauerhaft
            $aktuellesRegistryInventar = Invoke-Phase -Name 'Aktuelles Registry-Inventar nach Updates' -Bereich 'Inventar' -Fatal -Aktion { Export-RegistryInventar }
            if ([string]::IsNullOrWhiteSpace([string]$aktuellesRegistryInventar) -or -not (Test-Path -LiteralPath $aktuellesRegistryInventar -PathType Leaf)) {
                throw 'Das nach den Updates erzeugte Registry-Inventar ist nicht verfuegbar.'
            }
            $registryInventar = $aktuellesRegistryInventar

            if ($fortsetzungsRang -le (Get-OneClickFortsetzungsabschnittRang -Abschnitt 'RegistryPruefung') -and -not [string]::IsNullOrWhiteSpace([string]$registryInventar) -and (Test-Path -LiteralPath $registryInventar -PathType Leaf)) {
                Set-Gesamtfortschritt -Prozent 65 -Status 'Alle registrierten Programme werden auf Integritaet geprueft und geeignete MSI-Pakete repariert.' -Kategorie 'Programmintegritaet' -KategorieProzent 0 -Dauerhaft
                $null = Invoke-Phase -Name 'Alle Registry-Programme pruefen und reparieren' -Bereich 'Programme' -Aktion { Test-UndRepariereAlleRegistryProgramme -WinGet $winget -RegistryInventarPfad $registryInventar -WingetQuelleVerifiziert $wingetQuelleOk -MSIVollreparatur ([bool]$AlleMSIReparieren) }
                $registryPruefungAusgefuehrt = $true
                $null = Suspend-OneClickBeiNeustart -FortsetzungsPhase 'Programme' -FortsetzungsAbschnitt 'RegistryPruefung' -Grund 'Eine Registry- oder MSI-Integritaetsreparatur verlangt einen Windows-Neustart.'
            }
            elseif ($fortsetzungsRang -le (Get-OneClickFortsetzungsabschnittRang -Abschnitt 'RegistryPruefung')) {
                Add-Warnung -Text 'Die Integritaetspruefung aller Registry-Programme wurde ausgelassen, weil kein gueltiges Registry-Inventar vorliegt.'
            }

            if ($fortsetzungsRang -le (Get-OneClickFortsetzungsabschnittRang -Abschnitt 'BenutzerReparatur')) {
                Set-Gesamtfortschritt -Prozent 72 -Status 'Benutzerprogramme werden nach der Integritaetspruefung tiefengeprueft.' -Kategorie 'Programmreparaturen' -KategorieProzent 0 -Dauerhaft
                $benutzerReparaturErgebnis = Invoke-Phase -Name 'Benutzerprogramme im kontrollierten Benutzer-Scope reparieren' -Bereich 'Programme' -Fatal -Aktion { Invoke-BenutzerProgrammeNichtErhoeht -Modus 'Reparatur' }
                $null = Merge-BenutzerProgrammErgebnis -Ergebnis $benutzerReparaturErgebnis -Phase 'Reparatur'
                $null = Suspend-OneClickBeiNeustart -FortsetzungsPhase 'Programme' -FortsetzungsAbschnitt 'BenutzerReparatur' -Grund 'Eine Programmreparatur im Benutzer-Scope verlangt einen Windows-Neustart.'
            }

            if ($fortsetzungsRang -le (Get-OneClickFortsetzungsabschnittRang -Abschnitt 'MaschinenReparatur') -and $inventare.Count -gt 0) {
                Set-Gesamtfortschritt -Prozent 72 -Status 'Von WinGet erkannte Programme werden aus den verifizierten Quellen repariert.' -Kategorie 'Programmreparaturen' -KategorieProzent 10 -Dauerhaft
                $null = Invoke-Phase -Name 'Computerweite Programme reparieren' -Bereich 'Programme' -Aktion { Repair-InstallierteProgramme -WinGet $winget -InventarPfade $inventare.ToArray() -Scopes @('machine') }
                $null = Suspend-OneClickBeiNeustart -FortsetzungsPhase 'Programme' -FortsetzungsAbschnitt 'MaschinenReparatur' -Grund 'Eine computerweite Programmreparatur verlangt einen Windows-Neustart.'
            }
            elseif ($fortsetzungsRang -le (Get-OneClickFortsetzungsabschnittRang -Abschnitt 'MaschinenReparatur')) {
                Add-Warnung -Text 'Programmreparaturen wurden ausgelassen, weil kein gueltiges Inventar einer verifizierten WinGet-Quelle erstellt werden konnte.'
            }
        }
        else {
            Add-Warnung -Text 'WinGet-Programmupdates und -reparaturen wurden ausgelassen, weil keine offizielle Quelle zweifelsfrei verifiziert werden konnte.'
            Add-Resultat -Bereich 'Programme' -Aktion 'WinGet-Programmschritte' -Status 'Aus Sicherheitsgruenden ausgelassen' -ExitCode 0 -Details 'Keine verifizierte offizielle Quelle.'
        }
    }
    else {
        Add-Resultat -Bereich 'Programme' -Aktion 'WinGet-Programmschritte' -Status 'Ausgelassen' -ExitCode 0 -Details 'WinGet war nicht verfuegbar; Windows-Reparatur wird fortgesetzt.'
    }

    if ($fortsetzungsRang -le (Get-OneClickFortsetzungsabschnittRang -Abschnitt 'RegistryPruefung') -and -not $registryPruefungAusgefuehrt -and -not [string]::IsNullOrWhiteSpace([string]$registryInventar) -and (Test-Path -LiteralPath $registryInventar -PathType Leaf)) {
        Set-Gesamtfortschritt -Prozent 65 -Status 'Alle registrierten Programme werden auf Integritaet geprueft und geeignete MSI-Pakete repariert.' -Kategorie 'Programmintegritaet' -KategorieProzent 0 -Dauerhaft
        $wingetPfadFuerRegistry = if ([string]::IsNullOrWhiteSpace([string]$winget)) { '' } else { [string]$winget }
        $null = Invoke-Phase -Name 'Alle Registry-Programme pruefen und reparieren' -Bereich 'Programme' -Aktion { Test-UndRepariereAlleRegistryProgramme -WinGet $wingetPfadFuerRegistry -RegistryInventarPfad $registryInventar -WingetQuelleVerifiziert $wingetQuelleOk -MSIVollreparatur ([bool]$AlleMSIReparieren) }
        $registryPruefungAusgefuehrt = $true
        $null = Suspend-OneClickBeiNeustart -FortsetzungsPhase 'Programme' -FortsetzungsAbschnitt 'RegistryPruefung' -Grund 'Eine Registry- oder MSI-Reparatur verlangt einen Windows-Neustart.'
    }

    $null = Suspend-OneClickBeiNeustart -FortsetzungsPhase 'Programme' -FortsetzungsAbschnitt 'Abschluss' -Grund 'Mindestens eine Programmaktualisierung oder -reparatur verlangt eine Nachkontrolle nach dem Windows-Neustart.'
    Complete-OneClickFortsetzung

    if ($script:UnbehobeneProgrammfehler -gt 0) {
        Add-Warnung -Text ("{0} Programme konnten weder durch die Reparatur noch durch den abgesicherten Download- und Neuinstallationsfallback vollstaendig behoben werden." -f $script:UnbehobeneProgrammfehler)
    }

    Write-KonsolentextSicher -Text ''
    Write-KonsolentextSicher -Text '============================================================' -Farbe 'DarkCyan'
    Write-KonsolentextSicher -Text ' OneClick-Komplettreparatur-Release-v1.0.0 abgeschlossen' -Farbe 'Green'
    Write-KonsolentextSicher -Text '============================================================' -Farbe 'DarkCyan'
    Write-KonsolentextSicher -Text (" Erfolgreich aktualisierte Pakete: {0}" -f $script:AktualisiertePakete)
    Write-KonsolentextSicher -Text (" Bereits aktuelle Pakete:          {0}" -f $script:BereitsAktuellePakete)
    Write-KonsolentextSicher -Text (" Uebersprungene Updates:           {0}" -f $script:UebersprungeneUpdates)
    Write-KonsolentextSicher -Text (" Fehlgeschlagene Updates:          {0}" -f $script:FehlgeschlageneUpdates)
    Write-KonsolentextSicher -Text (" Unsichere Updatezeilen:           {0}" -f $script:UnsichereUpdateZeilen)
    Write-KonsolentextSicher -Text (" Ausgelassene Update-Kontexte:     {0}" -f $script:AusgelasseneUpdateKontexte)
    Write-KonsolentextSicher -Text (" Nachkontrollierte Updates:        {0}" -f $script:NachkontrollierteUpdates)
    Write-KonsolentextSicher -Text (" Fehlgeschlagene Update-Checks:    {0}" -f $script:FehlgeschlageneUpdateNachkontrollen)
    Write-KonsolentextSicher -Text (" Erfolgreich reparierte Programme: {0}" -f $script:RepariertePakete)
    Write-KonsolentextSicher -Text (" Nicht unterstuetzte Reparaturen:  {0}" -f $script:NichtUnterstuetzteReparaturen)
    Write-KonsolentextSicher -Text (" Fehlgeschlagene Reparaturen:      {0}" -f $script:FehlgeschlageneReparaturen)
    Write-KonsolentextSicher -Text (" Nachkontrollierte Reparaturen:    {0}" -f $script:NachkontrollierteReparaturen)
    Write-KonsolentextSicher -Text (" Fehlgeschlagene Reparatur-Checks: {0}" -f $script:FehlgeschlageneReparaturNachkontrollen)
    Write-KonsolentextSicher -Text (" Heruntergeladene Installer:       {0}" -f $script:HeruntergeladeneInstallationspakete)
    Write-KonsolentextSicher -Text (" Fehlgeschlagene Downloads:        {0}" -f $script:FehlgeschlageneInstallerDownloads)
    Write-KonsolentextSicher -Text (" Erfolgreiche Neuinstallationen:   {0}" -f $script:ErfolgreicheNeuinstallationen)
    Write-KonsolentextSicher -Text (" Fehlgeschlagene Neuinstallationen:{0}" -f $script:FehlgeschlageneNeuinstallationen)
    Write-KonsolentextSicher -Text (" Uebersprungene Neuinstallationen: {0}" -f $script:UebersprungeneNeuinstallationen)
    Write-KonsolentextSicher -Text (" Unbehobene Programme:             {0}" -f $script:UnbehobeneProgrammfehler)
    Write-KonsolentextSicher -Text (" Unaufgeloeste Registry-Schaeden:  {0}" -f $script:UnaufgeloesteRegistryProgramme)
    Write-KonsolentextSicher -Text (" Gepruefte Registry-Programme:     {0}" -f $script:GepruefteRegistryProgramme)
    Write-KonsolentextSicher -Text (" Beschaedigungsverdacht:           {0}" -f $script:ProgrammeMitBeschaedigungsverdacht)
    Write-KonsolentextSicher -Text (" Nicht vollstaendig pruefbar:      {0}" -f $script:NichtVollstaendigPruefbareProgramme)
    Write-KonsolentextSicher -Text (" MSI-Integritaetspruefungen:       {0}" -f $script:MSIPruefungen)
    Write-KonsolentextSicher -Text (" Erfolgreiche MSI-Reparaturen:     {0}" -f $script:ErfolgreicheMSIReparaturen)
    Write-KonsolentextSicher -Text (" Fehlgeschlagene MSI-Reparaturen:  {0}" -f $script:FehlgeschlageneMSIReparaturen)
    Write-KonsolentextSicher -Text (" Nachkontrollierte MSI-Reparaturen: {0}" -f $script:NachkontrollierteMSIReparaturen)
    Write-KonsolentextSicher -Text (" Fehlgeschlagene MSI-Checks:        {0}" -f $script:FehlgeschlageneMSINachkontrollen)
    Write-KonsolentextSicher -Text (" MSI ohne Reparaturbedarf:         {0}" -f $script:MSIOhneReparaturbedarf)
    Write-KonsolentextSicher -Text (" MSI-Vollreparatur aktiviert:      {0}" -f ([bool]$AlleMSIReparieren))
    Write-KonsolentextSicher -Text (" Gepruefte WinGet-Pakete:          {0}" -f $script:GepruefteWinGetPakete)
    Write-KonsolentextSicher -Text (" Manuelle Herstellerpruefung:      {0}" -f $script:ProgrammeMitManuellerPruefung)
    Write-KonsolentextSicher -Text (" Registry-Routen geprueft:         {0}/{1}" -f $script:RegistryPruefungenAusgefuehrt, $script:RegistryRoutenGesamt)
    Write-KonsolentextSicher -Text (" Registry-Automatikaktionen:       {0}" -f $script:RegistryAutomatischeAktionen)
    Write-KonsolentextSicher -Text (" Registry-manuelle Routen:         {0}" -f $script:RegistryManuelleRouten)
    Write-KonsolentextSicher -Text (" WinGet-Reparaturrouten:           {0}" -f $script:WinGetReparaturRoutenGesamt)
    Write-KonsolentextSicher -Text (" WinGet-Routen ausgefuehrt:        {0}" -f $script:WinGetReparaturRoutenAusgefuehrt)
    Write-KonsolentextSicher -Text (" WinGet-Routen ausgelassen:        {0}" -f $script:WinGetReparaturRoutenAusgelassen)
    Write-KonsolentextSicher -Text (" Aktuelle Tiefenpruefpunkte:       {0}" -f $script:AktuelleReparaturPruefungenWiederverwendet)
    Write-KonsolentextSicher -Text (" Wiederverwendete Vorabdownloads: {0}" -f $script:VorabDownloadsWiederverwendet)
    Write-KonsolentextSicher -Text (" Leerlaufabbrueche:                {0}" -f $script:InstallationsLeerlaufAbbrueche)
    Write-KonsolentextSicher -Text (" Fremde Installer ignoriert:       {0}" -f $script:FremdeInstallerIgnoriert)
    Write-KonsolentextSicher -Text (" Desktop-Verknuepfungen erstellt:  {0}" -f $script:DesktopVerknuepfungenErstellt)
    Write-KonsolentextSicher -Text (" Desktop-Verknuepfungen vorhanden: {0}" -f $script:DesktopVerknuepfungenVorhanden)
    Write-KonsolentextSicher -Text (" Desktop-Verknuepfungen n/a:       {0}" -f $script:DesktopVerknuepfungenNichtAnwendbar)
    Write-KonsolentextSicher -Text (" Desktop-Verknuepfungen Fehler:    {0}" -f $script:DesktopVerknuepfungenFehlgeschlagen)
    Write-KonsolentextSicher -Text (" Installer-Ordner zur Bereinigung: {0}" -f $script:InstallationsOrdner)
    Write-KonsolentextSicher -Text (" Warnungen:                       {0}" -f $script:Warnungen.Count)
    Write-KonsolentextSicher -Text (" Laufzeitordner (wird bereinigt): {0}" -f $script:LogOrdner)
    Write-KonsolentextSicher -Text (" Berichtsordner (3 Tage):         {0}" -f $script:BerichtOrdner)
    Write-KonsolentextSicher -Text (" Aktive Hashquarantaenen:         {0}" -f @(Get-WinGetUpdateQuarantaene).Count)
    Write-KonsolentextSicher -Text (" Dauerhafte Quarantaenedatei:     {0}" -f $script:WinGetQuarantaeneDatei)

    if ($script:NeustartErforderlich) {
        Write-KonsolentextSicher -Text ' Ein Windows-Neustart ist erforderlich.' -Farbe 'Yellow'
    }
    elseif ($script:Warnungen.Count -eq 0) {
        Write-KonsolentextSicher -Text ' Der Lauf wurde ohne erkannte Warnungen beendet.' -Farbe 'Green'
    }
    else {
        Write-KonsolentextSicher -Text ' Der Lauf wurde mit Warnungen beendet; Details stehen im Abschlussbericht.' -Farbe 'Yellow'
    }

    $script:ExitCode = Get-AbschlussExitCode -WarnungsAnzahl $script:Warnungen.Count -NeustartErforderlich $script:NeustartErforderlich
}
catch {
    $meldung = $_.Exception.Message
    $ausnahmeCode = 0
    try {
        if ($null -ne $_.Exception.Data -and $_.Exception.Data.Contains('OneClickExitCode')) {
            $ausnahmeCode = [Convert]::ToInt32($_.Exception.Data['OneClickExitCode'], [Globalization.CultureInfo]::InvariantCulture)
        }
    }
    catch { $ausnahmeCode = 0 }
    if ($ausnahmeCode -eq 3010) {
        Add-OneClickNeustartnachweis -Quelle 'Kontrollierte Neustartausnahme' -ExitCode 3010 -Details $meldung
        try {
            if (-not $script:NeustartPauseAktiv) {
                Set-OneClickNeustartpause -FortsetzungsPhase $script:FortsetzungsPhase -FortsetzungsAbschnitt $script:FortsetzungsAbschnitt -Grund $meldung
            }
            $script:ExitCode = 3010
            Write-Status -Text ("Lauf sicher vor weiteren Aktionen pausiert: {0}" -f $meldung) -Stufe 'INFO'
            Add-Resultat -Bereich 'Skript' -Aktion 'Gesamtlauf' -Status 'Windows-Neustart erforderlich; automatische Fortsetzung aktiv' -ExitCode 3010 -Details $meldung
        }
        catch {
            $script:ExitCode = 1
            Write-Status -Text ("Neustartbedarf wurde bestaetigt, die sichere automatische Fortsetzung konnte jedoch nicht eingerichtet werden: {0}" -f $_.Exception.Message) -Stufe 'FEHLER'
            try { Add-Resultat -Bereich 'Skript' -Aktion 'Neustartfortsetzung einrichten' -Status 'Fehlgeschlagen' -ExitCode 1 -Details ($_ | Out-String) } catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }
        }
    }
    else {
        $script:ExitCode = 1
        Write-Status -Text ("Schwerer Fehler: {0}" -f $meldung) -Stufe 'FEHLER'
        try { Add-Resultat -Bereich 'Skript' -Aktion 'Gesamtlauf' -Status 'Schwerer Fehler' -ExitCode 1 -Details ($_ | Out-String) }
        catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }
    }
}
finally {
    Set-Gesamtfortschritt -Prozent 96 -Status 'Laufbezogene Restdaten, Downloads und Arbeitsordner werden entfernt und nachkontrolliert.' -Kategorie 'Abschluss' -KategorieProzent 40 -Dauerhaft
    try {
        Stop-UnabhaengigenProzessAbbruchwaechter -Waechter $script:HauptlaufAbbruchwaechter
    }
    catch {
        $script:ExitCode = 1
        try { Add-Resultat -Bereich 'Abschluss' -Aktion 'Prozesswaechter bereinigen' -Status 'Fehlgeschlagen' -ExitCode 1 -Details $_.Exception.Message } catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }
        Write-Status -Text ("Prozesswaechter konnte nicht restlos bereinigt werden: {0}" -f $_.Exception.Message) -Stufe 'FEHLER'
    }
    $script:HauptlaufAbbruchwaechter = $null
    if ($script:TranscriptGestartet) {
        try { Stop-Transcript | Out-Null; $script:TranscriptGestartet = $false }
        catch {
            $script:ExitCode = 1
            try { Add-Resultat -Bereich 'Abschluss' -Aktion 'Transcript vor Bereinigung schliessen' -Status 'Fehlgeschlagen' -ExitCode 1 -Details $_.Exception.Message } catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }
        }
    }
    try { $null = Invoke-OneClickAbschlussbereinigung }
    catch { $script:ExitCode = 1 }

    if ($script:ExitCode -eq 0) {
        try { $null = Move-OneClickLegacyBerichteUndBereinigeDaten }
        catch {
            $script:ExitCode = 1
            try { Add-Resultat -Bereich 'Abschluss' -Aktion 'Alte ProgramData-/LocalAppData-Daten migrieren und bereinigen' -Status 'Fehlgeschlagen' -ExitCode 1 -Details $_.Exception.Message } catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }
        }
    }
    try { $null = Remove-OneClickVeralteteBerichte -Aufbewahrungstage 3 }
    catch {
        $script:ExitCode = 1
        try { Add-Resultat -Bereich 'Abschluss' -Aktion 'Drei-Tage-Berichtsaufbewahrung vor Berichtserstellung nachkontrollieren' -Status 'Fehlgeschlagen' -ExitCode 1 -Details $_.Exception.Message } catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }
    }
    if (-not [string]::IsNullOrWhiteSpace([string]$script:BerichtOrdner)) {
        Set-Gesamtfortschritt -Prozent 99 -Status 'Vom Laufzustand getrennte Abschlussberichte werden geschrieben.' -Kategorie 'Abschluss' -KategorieProzent 85 -Dauerhaft
        try { Export-Abschlussbericht }
        catch {
            $script:ExitCode = 1
            try { Add-Resultat -Bereich 'Abschluss' -Aktion 'Abschlussbericht schreiben' -Status 'Fehlgeschlagen' -ExitCode 1 -Details $_.Exception.Message } catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }
        }
    }
    try { $null = Remove-OneClickVeralteteBerichte -Aufbewahrungstage 3 }
    catch {
        $script:ExitCode = 1
        try { Add-Resultat -Bereich 'Abschluss' -Aktion 'Drei-Tage-Berichtsaufbewahrung nach Berichtserstellung nachkontrollieren' -Status 'Fehlgeschlagen' -ExitCode 1 -Details $_.Exception.Message } catch { Write-Verbose ("Best-effort-Ausnahme: {0}" -f $_.Exception.Message) }
    }
    if ($script:ExitCode -eq 0) {
        try { $null = Complete-OneClickPaketPruefstatusNachGesamterfolg }
        catch { $script:ExitCode = 1 }
    }
    if ($script:ExitCode -eq 0) {
        Set-Gesamtfortschritt -Prozent 100 -Status 'Komplettreparatur erfolgreich abgeschlossen.' -Kategorie 'Abschluss' -KategorieProzent 100 -Abgeschlossen -Dauerhaft
    }
    elseif ($script:ExitCode -eq 3010) {
        Set-Gesamtfortschritt -Prozent 100 -Status 'Lauf sicher beendet; Windows-Neustart erforderlich.' -Kategorie 'Abschluss' -KategorieProzent 100 -Abgeschlossen -Dauerhaft
    }
    elseif ($script:ExitCode -eq 2) {
        Set-Gesamtfortschritt -Prozent 100 -Status 'Komplettreparatur mit Warnungen abgeschlossen.' -Kategorie 'Abschluss' -KategorieProzent 100 -Abgeschlossen -Dauerhaft
    }
    else {
        Set-Gesamtfortschritt -Prozent 100 -Status 'Komplettreparatur wurde mit einem Fehler beendet.' -Kategorie 'Abschluss' -KategorieProzent 100 -Abgeschlossen -Dauerhaft
    }
}

if ($script:NeustartDialogNachAbschluss) {
    try { Show-OneClickNeustartfunktion }
    catch {
        Write-Status -Text ("Die Neustartfunktion konnte nicht angezeigt oder ausgefuehrt werden: {0}. Bitte Windows manuell neu starten; die Fortsetzungsaufgabe bleibt registriert." -f $_.Exception.Message) -Stufe 'FEHLER'
    }
}

Stop-MitPause -Code $script:ExitCode
