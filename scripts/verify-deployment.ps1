# Deployment Verification Script
# Verifies deployed application health and functionality

param(
    [string]$Url,
    [string]$Target = "vercel",
    [switch]$AllChecks,
    [switch]$Health,
    [switch]$Assets,
    [switch]$Functionality,
    [switch]$Performance,
    [switch]$Accessibility,
    [switch]$Console,
    [switch]$Verbose
)

# Configuration
$Script:Config = @{
    DefaultUrl = if ($env:DEPLOY_URL) { $env:DEPLOY_URL } else { "https://antigravity-demo-rho.vercel.app" }
    TimeoutSeconds = if ($env:TIMEOUT_SECONDS) { [int]$env:TIMEOUT_SECONDS } else { 30 }
    RetryCount = if ($env:RETRY_COUNT) { [int]$env:RETRY_COUNT } else { 3 }
    RetryDelay = if ($env:RETRY_DELAY) { [int]$env:RETRY_DELAY } else { 5 }
    PerformanceBudget = @{
        FCP = if ($env:PERF_BUDGET_FCP) { [int]$env:PERF_BUDGET_FCP } else { 2000 }    # First Contentful Paint (ms)
        LCP = if ($env:PERF_BUDGET_LCP) { [int]$env:PERF_BUDGET_LCP } else { 3000 }    # Largest Contentful Paint (ms)
        TTI = if ($env:PERF_BUDGET_TTI) { [int]$env:PERF_BUDGET_TTI } else { 5000 }    # Time to Interactive (ms)
        CLS = if ($env:PERF_BUDGET_CLS) { [decimal]$env:PERF_BUDGET_CLS } else { 0.1 } # Cumulative Layout Shift
    }
}

# Utility Functions
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Write-VerboseOutput {
    param([string]$Message)
    if ($Verbose) {
        Write-ColorOutput $Message "Gray"
    }
}

function Test-UrlFormat {
    param([string]$Url)

    try {
        $uri = [System.Uri]$Url
        if ($uri.Scheme -notin @('http', 'https')) {
            throw "URL must use HTTP or HTTPS protocol"
        }
        return $true
    } catch [System.UriFormatException] {
        throw "Invalid URL format: $Url"
    } catch {
        throw $_
    }
}

function Test-Url {
    param([string]$Url)
    
    try {
        Write-VerboseOutput "Testing URL: $Url"
        
        $response = Invoke-WebRequest -Uri $Url -Method HEAD -TimeoutSec $Script:Config.TimeoutSeconds
        
        return @{
            Success = $true
            StatusCode = $response.StatusCode
            StatusDescription = $response.StatusDescription
            ResponseTime = $response.Headers.'X-Response-Time'
        }
    } catch {
        return @{
            Success = $false
            StatusCode = $_.Exception.Response.StatusCode.value__
            StatusDescription = $_.Exception.Response.StatusDescription
            Error = $_.Exception.Message
        }
    }
}

function Test-Assets {
    param([string]$BaseUrl)

    Write-ColorOutput "🔍 Testing asset loading..." "Cyan"

    $assets = @(
        "/assets/index.css",
        "/assets/index.js",
        "/vite.svg",
        "/react.svg"
    )

    $results = @()
    $failed = 0

    foreach ($asset in $assets) {
        $assetUrl = "$BaseUrl$asset"
        Write-VerboseOutput "Testing asset: $assetUrl"

        try {
            $response = Invoke-WebRequest -Uri $assetUrl -Method HEAD -TimeoutSec $Script:Config.TimeoutSeconds -ErrorAction Stop
            $results += @{
                Asset = $asset
                Status = $response.StatusCode
                Success = $true
            }
            Write-VerboseOutput "  ✅ $asset ($($response.StatusCode))" "Green"
        } catch {
            $results += @{
                Asset = $asset
                Status = $_.Exception.Response.StatusCode.value__
                Success = $false
                Error = $_.Exception.Message
            }
            Write-VerboseOutput "  ❌ $asset ($($_.Exception.Response.StatusCode.value__))"
            $failed++
        }
    }
    
    return @{
        Results = $results
        FailedCount = $failed
        TotalCount = $assets.Count
        Success = ($failed -eq 0)
    }
}

function Test-CoreFunctionality {
    param([string]$Url)
    
    Write-ColorOutput "🧪 Testing core functionality..." "Cyan"
    
    # This would ideally use a headless browser or API tests
    # For now, we'll do basic checks that can be done with HTTP
    
    $tests = @(
        @{
            Name = "Homepage Load"
            Test = { Test-Url -Url $Url }
        },
        @{
            Name = "Theme Toggle Button"
            Test = {
                try {
                    $response = Invoke-WebRequest -Uri $Url -TimeoutSec $Script:Config.TimeoutSeconds -ErrorAction Stop
                    return $response.Content -match 'theme-toggle'
                } catch {
                    return $false
                }
            }
        },
        @{
            Name = "Counter Component"
            Test = {
                try {
                    $response = Invoke-WebRequest -Uri $Url -TimeoutSec $Script:Config.TimeoutSeconds -ErrorAction Stop
                    return $response.Content -match 'counter'
                } catch {
                    return $false
                }
            }
        },
        @{
            Name = "MCP Showcase"
            Test = {
                try {
                    $response = Invoke-WebRequest -Uri $Url -TimeoutSec $Script:Config.TimeoutSeconds -ErrorAction Stop
                    return $response.Content -match 'MCP Showcase'
                } catch {
                    return $false
                }
            }
        },
        @{
            Name = "RAG Showcase"
            Test = {
                try {
                    $response = Invoke-WebRequest -Uri $Url -TimeoutSec $Script:Config.TimeoutSeconds -ErrorAction Stop
                    return $response.Content -match 'RAG Showcase'
                } catch {
                    return $false
                }
            }
        }
    )
    
    $results = @()
    $passed = 0
    
    foreach ($test in $tests) {
        Write-VerboseOutput "Testing: $($test.Name)"
        
        try {
            $result = & $test.Test
            $results += @{
                Name = $test.Name
                Passed = $result
                Success = $true
            }
            
            if ($result) {
                Write-VerboseOutput "  ✅ $($test.Name)" "Green"
                $passed++
            } else {
                Write-VerboseOutput "  ❌ $($test.Name)" "Red"
            }
            
        } catch {
            $results += @{
                Name = $test.Name
                Passed = $false
                Error = $_.Exception.Message
                Success = $false
            }
            Write-VerboseOutput "  ❌ $($test.Name) - Error: $($_.Exception.Message)" "Red"
        }
    }
    
    return @{
        Results = $results
        PassedCount = $passed
        TotalCount = $tests.Count
        Success = ($passed -eq $tests.Count)
    }
}

function Test-Performance {
    param([string]$Url)
    
    Write-ColorOutput "⚡ Testing performance metrics..." "Cyan"
    
    # Basic performance test using WebRequest timing
    $timings = @()
    $successCount = 0
    
    for ($i = 1; $i -le 3; $i++) {
        Write-VerboseOutput "Performance test run $i"
        
        $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
        
        try {
            $response = Invoke-WebRequest -Uri $Url -TimeoutSec $Script:Config.TimeoutSeconds -ErrorAction Stop
            $stopwatch.Stop()
            
            $timings += @{
                Run = $i
                ResponseTime = $stopwatch.ElapsedMilliseconds
                StatusCode = $response.StatusCode
                Success = $true
            }
            
            if ($response.StatusCode -eq 200) {
                $successCount++
            }
            
            Write-VerboseOutput "  Run $i: $($stopwatch.ElapsedMilliseconds)ms" "Gray"
            
        } catch {
            $stopwatch.Stop()
            
            $timings += @{
                Run = $i
                ResponseTime = $stopwatch.ElapsedMilliseconds
                Error = $_.Exception.Message
                Success = $false
            }
            
            Write-VerboseOutput "  Run $i: Failed" "Red"
        }
    }
    
    $avgResponseTime = ($timings | Where-Object { $_.Success } | Measure-Object -Property ResponseTime -Average).Average
    
    # Basic performance analysis
    $performanceResult = @{
        Success = ($successCount -eq 3)
        AverageResponseTime = [math]::Round($avgResponseTime, 2)
        FastestResponse = ($timings | Where-Object { $_.Success } | Measure-Object -Property ResponseTime -Minimum).Minimum
        SlowestResponse = ($timings | Where-Object { $_.Success } | Measure-Object -Property ResponseTime -Maximum).Maximum
        BudgetChecks = @{
            ResponseTime = ($avgResponseTime -lt $Script:Config.PerformanceBudget.FCP)
        }
    }
    
    Write-ColorOutput "  Average response time: $($performanceResult.AverageResponseTime)ms" "White"
    
    if ($performanceResult.BudgetChecks.ResponseTime) {
        Write-ColorOutput "  ✅ Meets performance budget" "Green"
    } else {
        Write-ColorOutput "  ⚠️  Exceeds performance budget ($($Script:Config.PerformanceBudget.FCP)ms)" "Yellow"
    }
    
    return $performanceResult
}

function Test-Accessibility {
    param([string]$Url)
    
    Write-ColorOutput "♿ Running accessibility checks..." "Cyan"
    
    # Basic accessibility checks that can be done without browser automation
    try {
        $response = Invoke-WebRequest -Uri $Url -TimeoutSec $Script:Config.TimeoutSeconds -ErrorAction Stop
        
        $checks = @(
            @{
                Name = "Title Tag"
                Test = { $response.Content -match '<title[^>]*>.*?</title>' }
                Importance = "Critical"
            },
            @{
                Name = "Lang Attribute"
                Test = { $response.Content -match '<html[^>]*lang=[''"]' }
                Importance = "Important"
            },
            @{
                Name = "Alt Text for Images"
                Test = { $response.Content -match '<img[^>]*alt=[''"]' }
                Importance = "Important"
            },
            @{
                Name = "Heading Structure"
                Test = { $response.Content -match '<h1[^>]*>.*?</h1>' }
                Importance = "Important"
            },
            @{
                Name = "ARIA Labels"
                Test = { $response.Content -match 'aria-label|aria-labelledby' }
                Importance = "Moderate"
            }
        )
        
        $results = @()
        $passed = 0
        
        foreach ($check in $checks) {
            Write-VerboseOutput "Checking: $($check.Name)"
            
            try {
                $result = & $check.Test
                $results += @{
                    Name = $check.Name
                    Passed = $result
                    Importance = $check.Importance
                    Success = $true
                }
                
                if ($result) {
                    Write-VerboseOutput "  ✅ $($check.Name)" "Green"
                    $passed++
                } else {
                    Write-VerboseOutput "  ⚠️  $($check.Name)" "Yellow"
                }
                
            } catch {
                $results += @{
                    Name = $check.Name
                    Passed = $false
                    Error = $_.Exception.Message
                    Importance = $check.Importance
                    Success = $false
                }
                Write-VerboseOutput "  ❌ $($check.Name) - Error: $($_.Exception.Message)" "Red"
            }
        }
        
        return @{
            Results = $results
            PassedCount = $passed
            TotalCount = $checks.Count
            Success = ($passed -ge ($checks.Count * 0.8)) # 80% pass rate
            Score = [math]::Round(($passed / $checks.Count) * 100, 1)
        }
        
    } catch {
        return @{
            Success = $false
            Error = $_.Exception.Message
            Results = @()
        }
    }
}

function Test-ConsoleErrors {
    param([string]$Url)
    
    Write-ColorOutput "🔍 Checking for console errors..." "Cyan"
    
    # This is a simplified check - in a real scenario you'd use browser automation
    # For now, we'll check if the page loads basic JavaScript
    
    try {
        $response = Invoke-WebRequest -Uri $Url -TimeoutSec $Script:Config.TimeoutSeconds -ErrorAction Stop

        # Check for common JavaScript error indicators in HTML
        $errorIndicators = @(
            'console\.error',
            'Uncaught',
            'ReferenceError',
            'TypeError',
            'SyntaxError'
        )
        
        $foundErrors = $false
        $errorCount = 0
        
        foreach ($indicator in $errorIndicators) {
            if ($response.Content -match $indicator) {
                $foundErrors = $true
                $errorCount++
                Write-VerboseOutput "  Found potential error indicator: $indicator" "Yellow"
            }
        }
        
        if (-not $foundErrors) {
            Write-ColorOutput "  ✅ No obvious console errors detected" "Green"
            return @{
                Success = $true
                ErrorCount = 0
                Message = "No console errors detected"
            }
        } else {
            Write-ColorOutput "  ⚠️  Found $errorCount potential error indicators" "Yellow"
            return @{
                Success = $false
                ErrorCount = $errorCount
                Message = "Potential JavaScript errors detected"
            }
        }
        
    } catch {
        return @{
            Success = $false
            Error = $_.Exception.Message
            Message = "Failed to check for console errors"
        }
    }
}

function New-VerificationReport {
    param(
        [hashtable]$Results,
        [string]$Url,
        [string]$Target
    )
    
    $report = @{
        timestamp = Get-Date -Format "o"
        url = $Url
        target = $Target
        summary = @{
            totalChecks = 0
            passedChecks = 0
            failedChecks = 0
            overallStatus = "Unknown"
        }
        results = $Results
    }
    
    # Calculate summary
    $passed = 0
    $failed = 0
    
    foreach ($key in $Results.Keys) {
        if ($Results[$key].Success -eq $true) {
            $passed++
        } elseif ($Results[$key].Success -eq $false) {
            $failed++
        }
    }
    
    $report.summary.totalChecks = $Results.Count
    $report.summary.passedChecks = $passed
    $report.summary.failedChecks = $failed
    
    if ($failed -eq 0) {
        $report.summary.overallStatus = "PASSED"
    } elseif ($failed -le ($Results.Count * 0.2)) {
        $report.summary.overallStatus = "WARNING"
    } else {
        $report.summary.overallStatus = "FAILED"
    }
    
    return $report
}

# Main Execution
try {
    # Determine which checks to run
    $runAll = $AllChecks -or (-not $Health -and -not $Assets -and -not $Functionality -and -not $Performance -and -not $Accessibility -and -not $Console)

    if ([string]::IsNullOrEmpty($Url)) {
        $Url = $Script:Config.DefaultUrl
    }

    # Validate URL format
    try {
        Test-UrlFormat -Url $Url
    } catch {
        Write-ColorOutput "❌ URL Validation Error: $_" "Red"
        exit 1
    }

    Write-ColorOutput "🔍 Starting deployment verification for: $Url" "Cyan"
    Write-ColorOutput "Target: $Target" "Cyan"
    Write-ColorOutput "Timestamp: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" "Cyan"
    Write-ColorOutput "" "White"
    
    $results = @{}
    
    # Health Check
    if ($runAll -or $Health) {
        Write-ColorOutput "🏥 Health Check" "Blue"
        $results.Health = Test-Url -Url $Url
        
        if ($results.Health.Success) {
            Write-ColorOutput "✅ Health check passed" "Green"
        } else {
            Write-ColorOutput "❌ Health check failed" "Red"
        }
        Write-ColorOutput ""
    }
    
    # Asset Loading Check
    if ($runAll -or $Assets) {
        Write-ColorOutput "📦 Asset Loading Check" "Blue"
        $results.Assets = Test-Assets -BaseUrl $Url
        
        if ($results.Assets.Success) {
            Write-ColorOutput "✅ All assets loaded successfully" "Green"
        } else {
            Write-ColorOutput "❌ $($results.Assets.FailedCount) assets failed to load" "Red"
        }
        Write-ColorOutput ""
    }
    
    # Functionality Check
    if ($runAll -or $Functionality) {
        Write-ColorOutput "⚙️  Functionality Check" "Blue"
        $results.Functionality = Test-CoreFunctionality -Url $Url
        
        if ($results.Functionality.Success) {
            Write-ColorOutput "✅ All functionality tests passed" "Green"
        } else {
            Write-ColorOutput "❌ $($results.Functionality.TotalCount - $results.Functionality.PassedCount) functionality tests failed" "Red"
        }
        Write-ColorOutput ""
    }
    
    # Performance Check
    if ($runAll -or $Performance) {
        Write-ColorOutput "⚡ Performance Check" "Blue"
        $results.Performance = Test-Performance -Url $Url
        
        if ($results.Performance.Success) {
            Write-ColorOutput "✅ Performance checks passed" "Green"
        } else {
            Write-ColorOutput "⚠️  Some performance checks failed" "Yellow"
        }
        Write-ColorOutput ""
    }
    
    # Accessibility Check
    if ($runAll -or $Accessibility) {
        Write-ColorOutput "♿ Accessibility Check" "Blue"
        $results.Accessibility = Test-Accessibility -Url $Url
        
        if ($results.Accessibility.Success) {
            Write-ColorOutput "✅ Accessibility checks passed (Score: $($results.Accessibility.Score)%)" "Green"
        } else {
            Write-ColorOutput "⚠️  Accessibility checks failed (Score: $($results.Accessibility.Score)%)" "Yellow"
        }
        Write-ColorOutput ""
    }
    
    # Console Error Check
    if ($runAll -or $Console) {
        Write-ColorOutput "🔍 Console Error Check" "Blue"
        $results.Console = Test-ConsoleErrors -Url $Url
        
        if ($results.Console.Success) {
            Write-ColorOutput "✅ No console errors detected" "Green"
        } else {
            Write-ColorOutput "⚠️  $($results.Console.ErrorCount) potential console errors detected" "Yellow"
        }
        Write-ColorOutput ""
    }
    
    # Generate Report
    $report = New-VerificationReport -Results $results -Url $Url -Target $Target
    
    # Display Summary
    Write-ColorOutput "📊 Verification Summary" "Blue"
    Write-ColorOutput "Overall Status: $($report.summary.overallStatus)" $(if ($report.summary.overallStatus -eq "PASSED") { "Green" } elseif ($report.summary.overallStatus -eq "WARNING") { "Yellow" } else { "Red" })
    Write-ColorOutput "Total Checks: $($report.summary.totalChecks)" "White"
    Write-ColorOutput "Passed: $($report.summary.passedChecks)" "Green"
    Write-ColorOutput "Failed: $($report.summary.failedChecks)" $(if ($report.summary.failedChecks -gt 0) { "Red" } else { "White" })
    
    # Save report
    $reportPath = ".deployment-verification-report.json"
    $report | ConvertTo-Json -Depth 10 | Out-File -FilePath $reportPath -Encoding UTF8
    
    Write-ColorOutput "`n📄 Detailed report saved to: $reportPath" "Gray"
    
    # Exit with appropriate code
    if ($report.summary.overallStatus -eq "PASSED") {
        exit 0
    } elseif ($report.summary.overallStatus -eq "WARNING") {
        exit 1
    } else {
        exit 2
    }
    
} catch {
    Write-ColorOutput "❌ Error: $_" "Red"
    exit 1
}
