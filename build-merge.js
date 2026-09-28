// build-merge.js
// Merges client/dist and admin/dist into a single /dist folder
// client → /dist (root)
// admin  → /dist/admin

const fs = require('fs')
const path = require('path')

const ROOT = __dirname
const CLIENT_DIST = path.join(ROOT, 'client', 'dist')
const ADMIN_DIST  = path.join(ROOT, 'admin',  'dist')
const OUT_DIR     = path.join(ROOT, 'dist')
const OUT_ADMIN   = path.join(OUT_DIR, 'admin')

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath  = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

// Clean output
if (fs.existsSync(OUT_DIR)) fs.rmSync(OUT_DIR, { recursive: true, force: true })
fs.mkdirSync(OUT_DIR, { recursive: true })

// Copy client build → /dist
copyDir(CLIENT_DIST, OUT_DIR)
console.log('✅ Client build merged into /dist')

// Copy admin build → /dist/admin
copyDir(ADMIN_DIST, OUT_ADMIN)
console.log('✅ Admin build merged into /dist/admin')

console.log('🎉 Merge complete!')
