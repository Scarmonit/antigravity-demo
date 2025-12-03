---
description: Testing workflow for Antigravity Demo
---

# Antigravity Demo - Testing Workflow

Comprehensive testing guide for the Antigravity Demo application.

## Manual Testing

### 1. Visual Verification

Start the dev server if not running:

// turbo
```bash
npx vite
```

Open http://localhost:5174 and verify:

- ✓ Page loads without console errors
- ✓ Particle background animates smoothly
- ✓ All cards render with glassmorphism effect
- ✓ Hover effects work on cards and buttons

### 2. Theme Toggle Test

1. Click the theme toggle button (☀️/🌙) in the header
2. Verify background gradient changes
3. Verify text colors adapt to theme
4. Toggle back to original theme

### 3. Counter Functionality Test

1. Click "Increment" button multiple times
2. Verify counter number increases
3. Click "Reset" button
4. Verify counter returns to 0

### 4. Responsive Design Test

Resize browser window to test breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

Verify layout adapts appropriately at each breakpoint.

### 5. MCP Integration Verification

Check the MCP Integration card shows:
- Antigravity Tools (6 tools)
- GitHub MCP (12 tools)
- Sequential Thinking (3 tools)
- Workspace Context (4 tools)

All should show green "active" status indicators.

## Automated Testing with Browser Subagent

Use Antig ravity's browser subagent to automate testing:

```
Ask Antigravity: "Test the demo app at localhost:5174 - verify theme toggle, counter increment/reset, and take screenshots"
```

## Build Verification

Test production build:

// turbo
```bash
npm run build
```

Expected output: Clean TypeScript compilation and Vite build with no errors.

Preview the production build:

// turbo
```bash
npm run preview
```

## Linting

Check code quality:

```bash
npm run lint
```

## Test Checklist

- [ ] Dev server starts without errors
- [ ] All components render correctly
- [ ] Theme toggle switches dark/light modes
- [ ] Counter increment works
- [ ] Counter reset works
- [ ] Particle animations are smooth
- [ ] Hover effects work on all interactive elements
- [ ] Responsive design works on all screen sizes
- [ ] Production build completes successfully
- [ ] No console errors or warnings
