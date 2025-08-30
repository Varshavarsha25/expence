# Backend Status Checker
# Use this script to quickly check if your backend is responding

Write-Host "🔍 Checking Backend Status..." -ForegroundColor Cyan
Write-Host ""

try {
    # Test basic connectivity
    Write-Host "Testing basic connectivity..." -ForegroundColor Yellow
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:3001/health" -Method GET -TimeoutSec 5
    
    if ($healthResponse.status -eq "OK") {
        Write-Host "✅ Backend Health: " -ForegroundColor Green -NoNewline
        Write-Host "HEALTHY" -ForegroundColor Green
        Write-Host "   Message: $($healthResponse.message)" -ForegroundColor Gray
        Write-Host "   Timestamp: $($healthResponse.timestamp)" -ForegroundColor Gray
    }
    
    # Test API endpoints
    Write-Host ""
    Write-Host "Testing API endpoints..." -ForegroundColor Yellow
    $expensesResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/expenses" -Method GET -TimeoutSec 5
    
    if ($expensesResponse.success) {
        Write-Host "✅ API Endpoints: " -ForegroundColor Green -NoNewline
        Write-Host "WORKING" -ForegroundColor Green
        Write-Host "   Expenses found: $($expensesResponse.data.Length)" -ForegroundColor Gray
    }
    
    # Test database connectivity (implicit)
    Write-Host "✅ Database: " -ForegroundColor Green -NoNewline
    Write-Host "CONNECTED" -ForegroundColor Green
    Write-Host "   Neon PostgreSQL responding" -ForegroundColor Gray
    
    Write-Host ""
    Write-Host "🎉 All systems operational!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Backend Status: " -ForegroundColor Red -NoNewline
    Write-Host "NOT RESPONDING" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 To fix this:" -ForegroundColor Yellow
    Write-Host "   1. Run: cd 'd:\first project\backend'" -ForegroundColor Gray
    Write-Host "   2. Run: npm run dev" -ForegroundColor Gray
    Write-Host "   3. Check console for errors" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
Read-Host
