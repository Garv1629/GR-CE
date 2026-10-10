$brain = 'C:\Users\GARV\.gemini\antigravity-ide\brain\c8a9fa04-2f39-4040-b587-65d310435ebe'
$target = 'E:\New folder (2)\assets\generated'

$map = @(
    @{ src = 'hero_architecture_1791609980723.jpg'; sub = 'hero'; name = 'hero-architecture-desktop.jpg' },
    @{ src = 'hero_arch_mobile_1791609998743.jpg'; sub = 'hero'; name = 'hero-architecture-mobile.jpg' },
    @{ src = 'arch_exterior_geom_1791610019337.jpg'; sub = 'architecture'; name = 'architecture-exterior-editorial.jpg' },
    @{ src = 'interior_living_sculpt_1791610041702.jpg'; sub = 'interiors'; name = 'interior-sculptural-living.jpg' },
    @{ src = 'hosp_lounge_sanctuary_1791610063496.jpg'; sub = 'hospitality'; name = 'hospitality-editorial.jpg' },
    @{ src = 'material_stone_timber_1791610085935.jpg'; sub = 'materials'; name = 'material-stone-texture.jpg' },
    @{ src = 'studio_atelier_atmosphere_1791610109599.jpg'; sub = 'studio'; name = 'studio-atmosphere-concept.jpg' },
    @{ src = 'arch_light_staircase_1791610133490.jpg'; sub = 'architecture'; name = 'architecture-light-staircase.jpg' }
)

foreach ($item in $map) {
    $srcFile = Join-Path $brain $item.src
    $destFolder = Join-Path $target $item.sub
    if (-not (Test-Path $destFolder)) {
        New-Item -ItemType Directory -Path $destFolder -Force | Out-Null
    }
    $destFile = Join-Path $destFolder $item.name
    if (Test-Path $srcFile) {
        Copy-Item -Path $srcFile -Destination $destFile -Force
        $len = (Get-Item $destFile).Length
        Write-Host "COPIED: $($item.name) ($len bytes)"
    } else {
        Write-Host "MISSING: $srcFile"
    }
}
