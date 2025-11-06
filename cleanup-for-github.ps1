# Cleanup script for GitHub push
# Run this before committing to GitHub

Write-Host "🧹 Cleaning up project for GitHub..." -ForegroundColor Green

# Remove external repos
Write-Host "`n📦 Removing external repositories..." -ForegroundColor Yellow
Remove-Item -Path "fasal-mitra" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "fasal-frontend" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "plant-disease" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "fasal-mitra-repo" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "plant-disease-repo" -Recurse -Force -ErrorAction SilentlyContinue

# Remove ZIP files
Write-Host "`n📦 Removing ZIP files..." -ForegroundColor Yellow
Remove-Item -Path "*.zip" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "Fasal-Mitra-main.zip" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "Fasal-mitra-frontend-main.zip" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "Plant-Disease-Detection-and-Solution-main.zip" -Force -ErrorAction SilentlyContinue

# Remove old source code
Write-Host "`n📦 Removing old source code..." -ForegroundColor Yellow
Remove-Item -Path "../src" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "../code.zip" -Force -ErrorAction SilentlyContinue

# Remove temporary documentation
Write-Host "`n📄 Removing temporary documentation..." -ForegroundColor Yellow
$tempDocs = @(
    "*-GUIDE.md",
    "*-SUMMARY.md",
    "*-FIXED.md",
    "*-APPLIED.md",
    "*-TROUBLESHOOTING.md",
    "*-INTEGRATION.md",
    "WHATS-NEW.md",
    "CHANGES-MADE.md",
    "TESTING-GUIDE.md",
    "LANGUAGES.md",
    "LOCATION-*.md",
    "LANGUAGE-*.md",
    "IMAGE-*.md",
    "FERTILIZER-*.md",
    "BACKEND-*.md",
    "COMPLETE-*.md",
    "FINAL-*.md",
    "QUICK-*.md",
    "SUCCESS-*.md",
    "SOLUTION-*.md",
    "FIXES-*.md",
    "DISEASE-*.md",
    "FARM-*.md",
    "AGRICULTURE-*.md",
    "FASAL-*.md"
)

foreach ($pattern in $tempDocs) {
    Get-ChildItem -Path . -Filter $pattern -ErrorAction SilentlyContinue | Remove-Item -Force
}

# Remove test script
Write-Host "`n🧪 Removing test scripts..." -ForegroundColor Yellow
Remove-Item -Path "test-gemini-api.js" -Force -ErrorAction SilentlyContinue

# Remove screenshots (optional - keep if you want)
Write-Host "`n📸 Removing screenshots..." -ForegroundColor Yellow
Remove-Item -Path "Screenshot*.png" -Force -ErrorAction SilentlyContinue

# Create uploads folder with .gitkeep
Write-Host "`n📁 Creating uploads folder..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "public/uploads" -Force | Out-Null
New-Item -ItemType File -Path "public/uploads/.gitkeep" -Force | Out-Null

# Summary
Write-Host "`n✅ Cleanup complete!" -ForegroundColor Green
Write-Host "`nRemoved:" -ForegroundColor Cyan
Write-Host "  - External repositories" -ForegroundColor White
Write-Host "  - ZIP files" -ForegroundColor White
Write-Host "  - Old source code" -ForegroundColor White
Write-Host "  - Temporary documentation" -ForegroundColor White
Write-Host "  - Test scripts" -ForegroundColor White
Write-Host "  - Screenshots" -ForegroundColor White

Write-Host "`nKept:" -ForegroundColor Cyan
Write-Host "  - Source code: app, components, lib" -ForegroundColor White
Write-Host "  - Configuration files" -ForegroundColor White
Write-Host "  - README.md" -ForegroundColor White
Write-Host "  - LICENSE" -ForegroundColor White
Write-Host "  - CONTRIBUTING.md" -ForegroundColor White
Write-Host "  - .gitignore" -ForegroundColor White

Write-Host "`n📋 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Review changes: git status" -ForegroundColor White
Write-Host "  2. Stage files: git add ." -ForegroundColor White
Write-Host "  3. Commit: git commit -m 'Initial commit'" -ForegroundColor White
Write-Host "  4. Add remote: git remote add origin https://github.com/YOUR_USERNAME/crop-doctor-ai.git" -ForegroundColor White
Write-Host "  5. Push: git push -u origin main" -ForegroundColor White

Write-Host "`n🎉 Ready for GitHub!" -ForegroundColor Green
