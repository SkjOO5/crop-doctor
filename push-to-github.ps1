# Automated GitHub Push Script for Crop Doctor AI

Write-Host "🚀 GitHub Push Helper for Crop Doctor AI" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "❌ Git not initialized. Run: git init" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Git repository is ready!" -ForegroundColor Green
Write-Host ""

# Get GitHub username
Write-Host "📝 Please enter your GitHub username:" -ForegroundColor Cyan
$username = Read-Host "Username"

if ([string]::IsNullOrWhiteSpace($username)) {
    Write-Host "❌ Username cannot be empty!" -ForegroundColor Red
    exit 1
}

# Get repository name
Write-Host ""
Write-Host "📝 Enter repository name (default: crop-doctor-ai):" -ForegroundColor Cyan
$repoName = Read-Host "Repository name"

if ([string]::IsNullOrWhiteSpace($repoName)) {
    $repoName = "crop-doctor-ai"
}

Write-Host ""
Write-Host "🔗 Repository URL: https://github.com/$username/$repoName" -ForegroundColor Yellow
Write-Host ""

# Check if remote already exists
$existingRemote = git remote get-url origin 2>$null
if ($existingRemote) {
    Write-Host "⚠️  Remote 'origin' already exists: $existingRemote" -ForegroundColor Yellow
    Write-Host "Removing old remote..." -ForegroundColor Cyan
    git remote remove origin
    Write-Host "✅ Removed old remote" -ForegroundColor Green
}

# Add remote
Write-Host ""
Write-Host "🔗 Adding GitHub remote..." -ForegroundColor Cyan
git remote add origin "https://github.com/$username/$repoName.git"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Remote added successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to add remote" -ForegroundColor Red
    exit 1
}

# Set branch to main
Write-Host ""
Write-Host "🌿 Setting branch to main..." -ForegroundColor Cyan
git branch -M main

# Show what will be pushed
Write-Host ""
Write-Host "📦 Files ready to push:" -ForegroundColor Cyan
git log --oneline -1
Write-Host ""

# Important notice
Write-Host "⚠️  IMPORTANT: Make sure you've created the repository on GitHub first!" -ForegroundColor Yellow
Write-Host "   Go to: https://github.com/new" -ForegroundColor Yellow
Write-Host "   Repository name: $repoName" -ForegroundColor Yellow
Write-Host "   Make it Public" -ForegroundColor Yellow
Write-Host "   DON'T initialize with README" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Enter when ready to push..." -ForegroundColor Cyan
Read-Host

# Push to GitHub
Write-Host ""
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Cyan
Write-Host "   You'll be asked for your GitHub credentials:" -ForegroundColor Yellow
Write-Host "   - Username: $username" -ForegroundColor Yellow
Write-Host "   - Password: Use a Personal Access Token (NOT your password!)" -ForegroundColor Yellow
Write-Host ""
Write-Host "   Get token from: https://github.com/settings/tokens" -ForegroundColor Yellow
Write-Host "   Select scope: 'repo' (full control)" -ForegroundColor Yellow
Write-Host ""

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 SUCCESS! Your project is now on GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔗 View your repository:" -ForegroundColor Cyan
    Write-Host "   https://github.com/$username/$repoName" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor Yellow
    Write-Host "   1. Add topics: agriculture, ai, crop-disease, nextjs, typescript" -ForegroundColor White
    Write-Host "   2. Add description: AI-powered crop disease detection for Indian farmers" -ForegroundColor White
    Write-Host "   3. Share with the world! 🌾" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Push failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "   1. Repository doesn't exist on GitHub - create it first" -ForegroundColor White
    Write-Host "   2. Wrong credentials - use Personal Access Token, not password" -ForegroundColor White
    Write-Host "   3. No internet connection" -ForegroundColor White
    Write-Host ""
}
