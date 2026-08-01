Add-Type -AssemblyName System.Windows.Forms

$dialog = New-Object System.Windows.Forms.FolderBrowserDialog
$dialog.Description = "Selecciona la carpeta del proyecto"
$dialog.RootFolder = 'MyComputer'
$dialog.ShowNewFolderButton = $true

if ($dialog.ShowDialog() -eq 'OK') {
    Write-Output $dialog.SelectedPath
} else {
    Write-Output ''
}
