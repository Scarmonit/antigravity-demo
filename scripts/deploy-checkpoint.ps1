# Deployment Checkpoint Script
# Creates and manages Git checkpoints for safe deployments

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("Create", "List", "Rollback", "Info")]
    [string]$Action,
    
    [string]$Target = "vercel",
    [string]$Checkpoint,
    [switch]$Force,
    [switch]$WhatIf
)

# Git executable resolution
$Script:GitExe = if (Get-Command git -ErrorAction SilentlyContinue) {
    "git"
} elseif (Test-Path "C:\ProgramData\chocolatey\bin\git.bat") {
    "C:\ProgramData\chocolatey\bin\git.bat"
} elseif (Test-Path "C:\Program Files\Git\bin\git.exe") {
    "C:\Program Files\Git\bin\git.exe"
} else {
    Write-Error "Git not found. Please install Git."
    exit 1
}

# Configuration
$Script:Config = @{
    TagPrefix = "deploy-checkpoint"
    MaxCheckpoints = 10
    DefaultTarget = "vercel"
    MetadataFile = ".deployment-metadata.json"
    GitCommand = $Script:GitExe
}

# Utility Functions
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Test-GitRepository {
    try {
        $null = git rev-parse --git-dir
        return $true
    } catch {
        return $false
    }
}

function Get-GitStatus {
    try {
        $status = git status --porcelain
        return @{
            IsClean = [string]::IsNullOrEmpty($status)
            Status = $status
        }
    } catch {
        throw "Failed to get Git status: $_"
    }
}

function Get-CurrentBranch {
    try {
        return git rev-parse --abbrev-ref HEAD
    } catch {
        throw "Failed to get current branch: $_"
    }
}

function Get-LastCommit {
    try {
        return git rev-parse HEAD
    } catch {
        throw "Failed to get last commit: $_"
    }
}

function Get-Timestamp {
    return Get-Date -Format "yyyyMMdd-HHmmss"
}

function New-DeploymentCheckpoint {
    param(
        [string]$Target,
        [switch]$WhatIf
    )
    
    Write-ColorOutput "🎯 Creating deployment checkpoint..." "Cyan"
    
    # Validate Git repository
    if (-not (Test-GitRepository)) {
        throw "Not a Git repository"
    }
    
    # Check Git status
    $gitStatus = Get-GitStatus
    if (-not $gitStatus.IsClean -and -not $Force) {
        Write-ColorOutput "⚠️  Working directory is not clean" "Yellow"
        Write-ColorOutput "Changed files:" "Yellow"
        Write-ColorOutput $gitStatus.Status "Yellow"
        
        if (-not $WhatIf) {
            throw "Working directory must be clean. Use -Force to override"
        }
    }
    
    # Get current state
    $branch = Get-CurrentBranch
    $commit = Get-LastCommit
    $timestamp = Get-Timestamp
    
    # Create checkpoint tag
    $tagName = "$($Script:Config.TagPrefix)-$timestamp-$Target"
    
    # Create metadata (with safe values for CI environments)
    $metadata = @{
        timestamp = $timestamp
        branch = $branch
        commit = $commit
        target = $Target
        createdAt = Get-Date -Format "o"
        user = if ($env:CI) { "ci-automation" } else { $env:USERNAME }
        hostname = if ($env:CI) { "ci-runner" } else { $env:COMPUTERNAME }
        nodeVersion = try { node --version } catch { "not-installed" }
        npmVersion = try { npm --version } catch { "not-installed" }
    }
    
    if ($WhatIf) {
        Write-ColorOutput "🔍 WHATIF: Would create checkpoint" "Blue"
        Write-ColorOutput "   Tag: $tagName" "Blue"
        Write-ColorOutput "   Branch: $branch" "Blue"
        Write-ColorOutput "   Commit: $commit" "Blue"
        Write-ColorOutput "   Target: $Target" "Blue"
        return
    }
    
    try {
        # Create annotated tag with metadata
        $tagMessage = @"
Deployment Checkpoint
Target: $Target
Branch: $branch
Commit: $commit
Created: $($metadata.createdAt)
User: $($metadata.user)
Node: $($metadata.nodeVersion)
NPM: $($metadata.npmVersion)
"@
        
        git tag -a $tagName -m $tagMessage
        
        # Save metadata to file
        $metadata | ConvertTo-Json -Depth 10 | Out-File -FilePath $Script:Config.MetadataFile -Encoding UTF8
        
        Write-ColorOutput "✅ Checkpoint created successfully!" "Green"
        Write-ColorOutput "   Tag: $tagName" "Green"
        Write-ColorOutput "   Branch: $branch" "Green"
        Write-ColorOutput "   Commit: $commit" "Green"
        
        # Cleanup old checkpoints
        Cleanup-OldCheckpoints -Target $Target
        
        return $tagName
        
    } catch {
        throw "Failed to create checkpoint: $_"
    }
}

function Get-DeploymentCheckpoints {
    param(
        [string]$Target = "*"
    )
    
    Write-ColorOutput "📋 Listing deployment checkpoints..." "Cyan"
    
    try {
        $pattern = "$($Script:Config.TagPrefix)-*-"
        if ($Target -ne "*") {
            $pattern += $Target
        }
        
        $tags = git tag -l $pattern | Sort-Object -Descending
        
        if ($tags.Count -eq 0) {
            Write-ColorOutput "No checkpoints found" "Yellow"
            return
        }
        
        Write-ColorOutput "Found $($tags.Count) checkpoint(s):" "Green"
        
        foreach ($tag in $tags) {
            try {
                $tagInfo = git show $tag --format="%ai|%s|%H" --no-patch
                $parts = $tagInfo -split "\|"
                
                $timestamp = $parts[0]
                $message = $parts[1]
                $commit = $parts[2]
                
                # Parse tag name
                $tagParts = $tag -split "-"
                $deployTime = $tagParts[2]
                $deployTarget = $tagParts[3]
                
                Write-ColorOutput "  🔖 $tag" "White"
                Write-ColorOutput "     Created: $timestamp" "Gray"
                Write-ColorOutput "     Target: $deployTarget" "Gray"
                Write-ColorOutput "     Commit: $($commit.Substring(0, 8))" "Gray"
                Write-ColorOutput "" "White"
                
            } catch {
                Write-ColorOutput "  ⚠️  Error reading tag $tag" "Red"
            }
        }
        
    } catch {
        throw "Failed to list checkpoints: $_"
    }
}

function Restore-DeploymentCheckpoint {
    param(
        [string]$Checkpoint,
        [switch]$Force,
        [switch]$WhatIf
    )
    
    Write-ColorOutput "🔄 Restoring deployment checkpoint..." "Cyan"
    
    if ([string]::IsNullOrEmpty($Checkpoint)) {
        # Get latest checkpoint
        $checkpoints = git tag -l "$($Script:Config.TagPrefix)-*" | Sort-Object -Descending
        if ($checkpoints.Count -eq 0) {
            throw "No checkpoints found"
        }
        $Checkpoint = $checkpoints[0]
        Write-ColorOutput "Using latest checkpoint: $Checkpoint" "Blue"
    }
    
    # Verify checkpoint exists
    try {
        $null = git show $Checkpoint --no-patch
    } catch {
        throw "Checkpoint '$Checkpoint' not found"
    }
    
    # Get current state
    $currentBranch = Get-CurrentBranch
    $currentCommit = Get-LastCommit
    
    Write-ColorOutput "Current state:" "Yellow"
    Write-ColorOutput "  Branch: $currentBranch" "Yellow"
    Write-ColorOutput "  Commit: $currentCommit" "Yellow"
    
    if ($WhatIf) {
        Write-ColorOutput "🔍 WHATIF: Would restore checkpoint" "Blue"
        Write-ColorOutput "   Checkpoint: $Checkpoint" "Blue"
        
        $checkpointInfo = git show $Checkpoint --format="%H" --no-patch
        Write-ColorOutput "   Target commit: $checkpointInfo" "Blue"
        return
    }
    
    try {
        # Stash current changes if any
        $gitStatus = Get-GitStatus
        $stashName = "pre-rollback-$(Get-Timestamp)"
        $stashCreated = $false

        if (-not $gitStatus.IsClean) {
            Write-ColorOutput "💾 Stashing current changes..." "Blue"
            git stash push -m $stashName
            if ($LASTEXITCODE -eq 0) {
                $stashCreated = $true
            }
        }

        # Checkout checkpoint
        Write-ColorOutput "📍 Checking out checkpoint..." "Blue"
        git checkout $Checkpoint

        Write-ColorOutput "✅ Checkpoint restored successfully!" "Green"
        Write-ColorOutput "Restored to: $Checkpoint" "Green"

        # Show restoration info
        $restoredCommit = Get-LastCommit
        Write-ColorOutput "Now at commit: $restoredCommit" "Green"

        Write-ColorOutput "`n💡 To return to previous state:" "Cyan"
        Write-ColorOutput "git checkout $currentBranch" "Cyan"
        if ($stashCreated) {
            Write-ColorOutput "git stash pop" "Cyan"
        }

    } catch {
        throw "Failed to restore checkpoint: $_"
    }
}

function Get-CheckpointInfo {
    param(
        [string]$Checkpoint
    )
    
    if ([string]::IsNullOrEmpty($Checkpoint)) {
        Write-ColorOutput "❌ Checkpoint name required" "Red"
        return
    }
    
    try {
        $tagInfo = git show $Checkpoint --format="%ai|%s|%H|%b" --no-patch
        $parts = $tagInfo -split "\|"
        
        Write-ColorOutput "📊 Checkpoint Information" "Cyan"
        Write-ColorOutput "Tag: $Checkpoint" "White"
        Write-ColorOutput "Created: $($parts[0])" "White"
        Write-ColorOutput "Message: $($parts[1])" "White"
        Write-ColorOutput "Commit: $($parts[2])" "White"
        
        if ($parts.Count -gt 3 -and -not [string]::IsNullOrEmpty($parts[3])) {
            Write-ColorOutput "Details:" "White"
            Write-ColorOutput $parts[3] "Gray"
        }
        
        # Show commit info
        $commitInfo = git show $($parts[2]) --format="%H|%an|%ae|%ad|%s" --no-patch
        $commitParts = $commitInfo -split "\|"
        
        Write-ColorOutput "`nCommit Details:" "Cyan"
        Write-ColorOutput "Hash: $($commitParts[0])" "White"
        Write-ColorOutput "Author: $($commitParts[1]) <$($commitParts[2])>" "White"
        Write-ColorOutput "Date: $($commitParts[3])" "White"
        Write-ColorOutput "Message: $($commitParts[4])" "White"
        
    } catch {
        Write-ColorOutput "❌ Failed to get checkpoint info: $_" "Red"
    }
}

function Cleanup-OldCheckpoints {
    param(
        [string]$Target
    )

    try {
        $pattern = "$($Script:Config.TagPrefix)-*-$Target"
        $tags = git tag -l $pattern | Sort-Object

        $removeCount = $tags.Count - $Script:Config.MaxCheckpoints
        if ($removeCount -gt 0) {
            $tagsToRemove = $tags[0..($removeCount - 1)]

            Write-ColorOutput "🧹 Cleaning up old checkpoints..." "Blue"

            foreach ($tag in $tagsToRemove) {
                git tag -d $tag
                Write-ColorOutput "Removed old checkpoint: $tag" "Gray"
            }
        }

    } catch {
        Write-Warning "Failed to cleanup old checkpoints: $_"
    }
}

# Main Execution
try {
    switch ($Action) {
        "Create" {
            $result = New-DeploymentCheckpoint -Target $Target -WhatIf:$WhatIf
            if ($result) {
                Write-Output $result
            }
        }
        "List" {
            Get-DeploymentCheckpoints -Target $Target
        }
        "Rollback" {
            Restore-DeploymentCheckpoint -Checkpoint $Checkpoint -Force:$Force -WhatIf:$WhatIf
        }
        "Info" {
            Get-CheckpointInfo -Checkpoint $Checkpoint
        }
    }
    
} catch {
    Write-ColorOutput "❌ Error: $_" "Red"
    exit 1
}
