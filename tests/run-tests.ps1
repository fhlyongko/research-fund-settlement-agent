$ErrorActionPreference = "Stop"

node --check assets/app.js
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

node tests/app.test.js
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

node tests/validate-content.js
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Output "All local checks passed."
