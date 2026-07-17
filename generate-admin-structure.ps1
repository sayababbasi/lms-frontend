# ================================
#  Admin Panel Folder Generator
#  Works on Windows PowerShell
#  Developed by SAYAB
# ================================

# Root folder
$root = "admin"

# Create root directory
New-Item -ItemType Directory -Path $root -Force | Out-Null

# ---- FILES IN ROOT ----
$rootFiles = @(
    "package.json",
    "tsconfig.json",
    "next.config.js",
    "README.md"
)

foreach ($file in $rootFiles) {
    New-Item -Path "$root\$file" -ItemType File -Force | Out-Null
}

# ---- PUBLIC FOLDER ----
$publicPath = "$root\public"
New-Item -ItemType Directory -Path $publicPath -Force | Out-Null

$publicFiles = @(
    "logo.png",
    "admin-favicon.ico"
)

foreach ($file in $publicFiles) {
    New-Item -Path "$publicPath\$file" -ItemType File -Force | Out-Null
}

# ---- SRC FOLDER ----
$src = "$root\src"
New-Item -ItemType Directory -Path $src -Force | Out-Null

# ---- app/ ----
$app = "$src\app"
New-Item -ItemType Directory -Path $app -Force | Out-Null

# App root files
$appFiles = @(
    "layout.tsx"
)

foreach ($file in $appFiles) {
    New-Item -Path "$app\$file" -ItemType File -Force | Out-Null
}

# ---- Pages inside app ----
$pages = @{
    "login"          = @("page.tsx")
    "dashboard"      = @("page.tsx")
    "users"          = @("page.tsx")
    "users\add"      = @("page.tsx")
    "users\[id]"     = @("page.tsx")
    "departments"    = @("page.tsx")
    "departments\add"= @("page.tsx")
    "programs"       = @("page.tsx")
    "programs\add"   = @("page.tsx")
    "courses"        = @("page.tsx")
    "courses\add"    = @("page.tsx")
    "courses\[id]"   = @("page.tsx")
    "assignments"    = @("page.tsx")
    "assignments\create" = @("page.tsx")
    "assignments\[id]"   = @("page.tsx")
    "exams"          = @("page.tsx")
    "exams\create"   = @("page.tsx")
    "finance"        = @("page.tsx")
    "finance\fees"   = @("page.tsx")
    "timetable"      = @("page.tsx")
    "attendance"     = @("page.tsx")
    "notifications"  = @("page.tsx")
    "messaging"      = @("page.tsx")
    "library"        = @("page.tsx")
}

foreach ($folder in $pages.Keys) {
    $path = "$app\$folder"
    New-Item -ItemType Directory -Path $path -Force | Out-Null

    foreach ($file in $pages[$folder]) {
        New-Item -Path "$path\$file" -ItemType File -Force | Out-Null
    }
}

# ---- components/ ----
$components = "$src\components"
New-Item -ItemType Directory -Path $components -Force | Out-Null

# layout/
$layout = "$components\layout"
New-Item -ItemType Directory -Path $layout -Force | Out-Null

$layoutFiles = @("Sidebar.tsx", "Navbar.tsx", "Footer.tsx")
foreach ($file in $layoutFiles) {
    New-Item -Path "$layout\$file" -ItemType File -Force | Out-Null
}

# ui/
$ui = "$components\ui"
New-Item -ItemType Directory -Path $ui -Force | Out-Null

$uiFiles = @("Button.tsx", "Card.tsx", "Table.tsx", "Modal.tsx")
foreach ($file in $uiFiles) {
    New-Item -Path "$ui\$file" -ItemType File -Force | Out-Null
}

# charts/
$charts = "$components\charts"
New-Item -ItemType Directory -Path $charts -Force | Out-Null

$chartFiles = @("BarChart.tsx", "PieChart.tsx")
foreach ($file in $chartFiles) {
    New-Item -Path "$charts\$file" -ItemType File -Force | Out-Null
}

# ---- services/ ----
$services = "$src\services"
New-Item -ItemType Directory -Path $services -Force | Out-Null

$serviceFiles = @(
    "api.ts",
    "user.service.ts",
    "course.service.ts",
    "assignment.service.ts",
    "exam.service.ts",
    "finance.service.ts",
    "notification.service.ts"
)

foreach ($file in $serviceFiles) {
    New-Item -Path "$services\$file" -ItemType File -Force | Out-Null
}

# ---- context/ ----
$context = "$src\context"
New-Item -ItemType Directory -Path $context -Force | Out-Null

$contextFiles = @("AuthContext.tsx", "AdminContext.tsx")
foreach ($file in $contextFiles) {
    New-Item -Path "$context\$file" -ItemType File -Force | Out-Null
}

# ---- hooks/ ----
$hooks = "$src\hooks"
New-Item -ItemType Directory -Path $hooks -Force | Out-Null

$hookFiles = @("useAuth.ts", "useFetch.ts", "useTheme.ts")
foreach ($file in $hookFiles) {
    New-Item -Path "$hooks\$file" -ItemType File -Force | Out-Null
}

# ---- styles/ ----
$styles = "$src\styles"
New-Item -ItemType Directory -Path $styles -Force | Out-Null

$styleFiles = @("globals.css", "layout.css", "table.css", "form.css")
foreach ($file in $styleFiles) {
    New-Item -Path "$styles\$file" -ItemType File -Force | Out-Null
}

Write-Host "✅ Admin panel folder & file structure generated successfully!" -ForegroundColor Green
