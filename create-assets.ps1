# Create a minimal valid PNG file (1x1 pixel transparent PNG)
$pngHeader = [Convert]::FromBase64String("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==")
[System.IO.File]::WriteAllBytes("assets/icon.png", $pngHeader)
[System.IO.File]::WriteAllBytes("assets/splash.png", $pngHeader)
[System.IO.File]::WriteAllBytes("assets/favicon.png", $pngHeader)
[System.IO.File]::WriteAllBytes("assets/adaptive-icon.png", $pngHeader)
Write-Host "Created all PNG files"

