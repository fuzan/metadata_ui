# Check Node.js version
$nodeVersion = & node -v
$nodeVersionNumber = $nodeVersion -replace 'v', '' -as [version]

if ($nodeVersionNumber -lt [version]"18.0.0") {
    throw "Node.js version is lower than 18. Current version: $nodeVersion"
}

# Interactive step
Write-Host "Choose from below options:"
Write-Host "1. Run 'npm install'"
Write-Host "2. Run 'npm run production'"
$userInput = Read-Host "Enter your choice (1 or 2)"

switch ($userInput) {
    "1" {
        # Run npm install
        Write-Host "Running 'npm install'..."
        npm install
    }
    "2" {
        # Run npm run production
        Write-Host "Running 'npm run production'..."
        npm run production
    }
    default {
        Write-Host "Invalid input. Please enter 1 or 2."
        exit
    }
}

# Copy bundle.js to the target directory
$sourcePath = "./dist/bundle.js"
$destinationPath = "../../webapp/bundle.js"

if (Test-Path $sourcePath) {
    Copy-Item -Path $sourcePath -Destination $destinationPath -Force
    Write-Host "File copied to $destinationPath"
} else {
    throw "Source file $sourcePath does not exist."
}

# Display success message
Write-Host "Success: All tasks completed successfully."