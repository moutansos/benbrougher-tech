[CmdletBinding()]
param (
    [Parameter(Mandatory)]
    [string]
    $slug,

    [Parameter(Mandatory)]
    [string]
    $title,

    [Parameter(Mandatory)]
    [string]
    $description,

    [Parameter(Mandatory)]
    [bool]
    $ImagesDirectory
)

$postText = @"
---
tilte: $($title)
pubDate: '$((Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ss.000Z'))'
description: $($description)
layout: '../../layouts/BlogPost.astro'
---

> Markdown Content Here
"@

Set-Content -Path "$PSScriptRoot/../src/pages/posts/$($slug).md" -Value $postText


if($ImagesDirectory) {
    New-Item -Path "$PSScriptRoot/../public/content/blog/$($slug)" -ItemType Directory -Force
    New-Item -Path "$PSScriptRoot/../public/content/blog/$($slug)/.gitkeep" -ItemType File -Force
}
