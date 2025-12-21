# Dependency Audit Report
**Date:** 2025-12-21
**Project:** HomeLLM
**Type:** React + Vite Application

---

## Executive Summary

This audit identified **4 security vulnerabilities** (3 moderate, 1 high), **5 outdated packages**, and **2 unnecessary dependencies**. All security issues have fixes available. Implementing the recommendations below will improve security, reduce bundle size, and keep dependencies current.

---

## 🚨 Security Vulnerabilities (PRIORITY)

### Critical Findings

| Package | Severity | Issue | CVE/Advisory |
|---------|----------|-------|--------------|
| **glob** | HIGH | Command injection via CLI `-c/--cmd` flag | [GHSA-5j98-mcp5-4vw2](https://github.com/advisories/GHSA-5j98-mcp5-4vw2) |
| **vite** | MODERATE | `server.fs.deny` bypass via backslash on Windows | [GHSA-93m4-6634-74q7](https://github.com/advisories/GHSA-93m4-6634-74q7) |
| **esbuild** | MODERATE | Development server request interception | [GHSA-67mh-4wv8-2f99](https://github.com/advisories/GHSA-67mh-4wv8-2f99) |
| **body-parser** | MODERATE | DoS when URL encoding is used | [GHSA-wqch-xfxh-vrr4](https://github.com/advisories/GHSA-wqch-xfxh-vrr4) |

**Action Required:** Run `npm audit fix` to automatically resolve these vulnerabilities.

---

## 📦 Outdated Packages

### Dependencies

| Package | Current | Latest Stable | Recommendation |
|---------|---------|---------------|----------------|
| **lucide-react** | 0.294.0 | 0.562.0 | Update to latest (268 versions behind) |
| **react** | 18.2.0 | 18.3.1 / 19.2.3 | Update to 18.3.1 first, then consider React 19 |
| **react-dom** | 18.2.0 | 18.3.1 / 19.2.3 | Update to 18.3.1 first, then consider React 19 |
| **express** | 5.1.0 | 5.2.1 | Update to 5.2.1 |

### DevDependencies
All devDependencies are reasonably current. No critical updates needed.

---

## 🗑️ Unnecessary Dependencies (Bloat Reduction)

### Remove TypeScript Type Definitions

**Issue:** Project contains NO TypeScript files (`.ts`, `.tsx`), but includes React type definitions.

**Current:**
```json
"@types/react": "^18.2.43",
"@types/react-dom": "^18.2.17"
```

**Impact:**
- Unnecessary disk space (~5-10 MB in node_modules)
- Slower `npm install` times
- No benefit since project uses only `.js` and `.jsx` files

**Recommendation:** Remove both packages unless you plan to migrate to TypeScript.

---

## ✅ Dependencies to Keep

The following packages are **correctly included** and should remain:

- **express** & **cors** - Used in `server.js` for local development server
- **vite** - Build tool and dev server
- **@vitejs/plugin-react** - Required for JSX transformation
- **tailwindcss**, **postcss**, **autoprefixer** - Styling framework
- All other dependencies are actively used

---

## 📋 Recommended Action Plan

### Step 1: Fix Security Vulnerabilities (IMMEDIATE)
```bash
npm audit fix
```

### Step 2: Remove Unnecessary Packages
```bash
npm uninstall @types/react @types/react-dom
```

### Step 3: Update Outdated Packages

**Safe Updates (Low Risk):**
```bash
npm install lucide-react@latest
npm install express@latest
```

**React Updates (Requires Testing):**
```bash
# Update to latest React 18.x (safe)
npm install react@^18.3.1 react-dom@^18.3.1

# OR upgrade to React 19 (requires migration testing)
npm install react@latest react-dom@latest
```

**Note:** React 19 includes breaking changes. Review the [React 19 upgrade guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide) before upgrading.

### Step 4: Verify Everything Works
```bash
npm install
npm run build
npm run dev
```

---

## 📊 Impact Summary

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Security Vulnerabilities | 4 | 0 | -100% |
| Outdated Packages | 5 | 0-1* | -80-100% |
| Unnecessary Dependencies | 2 | 0 | -100% |
| Estimated node_modules Reduction | - | ~5-10 MB | - |

\* *React 19 upgrade optional depending on testing results*

---

## 🔄 Ongoing Maintenance

**Recommended Practices:**

1. **Weekly:** Check for security vulnerabilities
   ```bash
   npm audit
   ```

2. **Monthly:** Check for outdated packages
   ```bash
   npm outdated
   ```

3. **Quarterly:** Update dependencies
   ```bash
   npm update
   ```

4. **Consider:** Set up automated dependency updates with Dependabot or Renovate

---

## Updated package.json

Here's the recommended `package.json` after implementing all changes:

```json
{
  "name": "homellm",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^5.2.1",
    "lucide-react": "^0.562.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "vite": "^5.0.8"
  }
}
```

**Changes:**
- ✅ Removed `@types/react` and `@types/react-dom`
- ✅ Updated `express` to 5.2.1
- ✅ Updated `lucide-react` to 0.562.0
- ✅ Updated `react` and `react-dom` to 18.3.1

---

**End of Report**
