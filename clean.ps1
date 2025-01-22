function Remove-Directories {
    param (
        [string]$Path,
        [string[]]$DirectoryNames
    )
    
    Get-ChildItem -Path $Path -Directory -Recurse | 
    Where-Object { $DirectoryNames -contains $_.Name } | 
    ForEach-Object {
        Write-Host "Removing directory: $($_.FullName)" -ForegroundColor Yellow
        Remove-Item $_.FullName -Force -Recurse
    }
}

function Remove-Files {
    param (
        [string]$Path,
        [string[]]$FilePatterns
    )
    
    foreach ($pattern in $FilePatterns) {
        Get-ChildItem -Path $Path -Filter $pattern -File -Recurse |
        ForEach-Object {
            Write-Host "Removing file: $($_.FullName)" -ForegroundColor Yellow
            Remove-Item $_.FullName -Force
        }
    }
}

# Directories to clean
$directoriesToRemove = @('bin', 'obj')

# File patterns to clean
$filePatterns = @('*.user', 'coverage.opencover.xml')

# Get current directory
$currentPath = Get-Location

Write-Host "Cleaning solution..." -ForegroundColor Green

# Remove directories
Remove-Directories -Path $currentPath -DirectoryNames $directoriesToRemove

# Remove files
Remove-Files -Path $currentPath -FilePatterns $filePatterns

Write-Host "Clean completed successfully!" -ForegroundColor Green