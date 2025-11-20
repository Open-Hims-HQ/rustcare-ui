# Accessibility Testing Documentation

## Overview

RustCare implements comprehensive accessibility testing to ensure WCAG AAA compliance for healthcare applications. This document outlines the accessibility testing strategy, tools, and test cases.

## Testing Strategy

### Three-Layer Approach

1. **Unit Tests** - Component-level accessibility with Vitest + jest-axe
2. **Integration Tests** - Page-level accessibility scans with axe-core
3. **E2E Tests** - Full user journeys with Playwright + axe-playwright

## Test Suites

### 1. WCAG Compliance Tests
**Location**: `tests/accessibility/wcag.test.tsx`

Comprehensive WCAG 2.1 Level AAA compliance testing covering:

#### 1. Perceivable (A - AAA)
- **1.1.1 Non-text Content**: Alt text, ARIA labels, decorative icons
- **1.3.1 Info and Relationships**: Semantic HTML, heading hierarchy, form labels
- **1.4.1 Use of Color**: Not color-only, multiple indicators
- **1.4.3 Contrast (Minimum)**: 4.5:1 for normal text (AA)
- **1.4.6 Contrast (Enhanced)**: 7:1 for small text (AAA)

#### 2. Operable (A - AAA)
- **2.1.1 Keyboard**: Full keyboard accessibility
- **2.1.3 Keyboard (No Exception)**: Keyboard shortcuts for all actions
- **2.4.1 Bypass Blocks**: Skip to main content links
- **2.4.2 Page Titled**: Descriptive page titles
- **2.4.6 Headings and Labels**: Clear, descriptive labels
- **2.4.7 Focus Visible**: Visible focus indicators
- **2.5.3 Label in Name**: Accessible names match visible labels

#### 3. Understandable (A - AAA)
- **3.1.1 Language of Page**: `lang` attribute specified
- **3.2.1 On Focus**: No context changes on focus
- **3.2.2 On Input**: No context changes on input
- **3.3.1 Error Identification**: Clear error messages with ARIA
- **3.3.2 Labels or Instructions**: Form instructions provided

#### 4. Robust (A - AAA)
- **4.1.1 Parsing**: Valid HTML structure
- **4.1.2 Name, Role, Value**: Proper ARIA attributes
- **4.1.3 Status Messages**: Live regions for dynamic content

### 2. Automated Axe Tests
**Location**: `tests/accessibility/axe.test.tsx`

Automated accessibility scanning with axe-core:

- **Basic Components**: Buttons, forms, links, headings
- **Interactive Components**: Dropdowns, checkboxes, radio buttons
- **ARIA Components**: Dialogs, alerts, status messages, menus
- **Images and Media**: Alt text, decorative images
- **Tables**: Headers, captions, scope attributes
- **Landmarks**: Navigation, main, footer
- **Color and Contrast**: Contrast verification
- **Focus Management**: Keyboard navigation, focus indicators
- **Screen Reader**: ARIA live regions, hidden content

### 3. E2E Accessibility Tests
**Location**: `tests/e2e/accessibility.spec.ts`

End-to-end accessibility testing with Playwright:

#### Page Structure
- Accessible page titles
- Language attributes
- Skip links
- Heading hierarchy
- Landmarks

#### Navigation
- Keyboard-only navigation
- Visible focus indicators
- Navigation landmarks

#### Forms
- Accessible inputs with labels
- Error announcements
- Autocomplete attributes

#### Interactive Elements
- Button activation with keyboard
- Accessible labels
- Focus traps in modals

#### Images and Media
- Alt text requirements
- Descriptive alt text

#### Tables
- Table headers
- Table captions

#### Color and Contrast
- Sufficient color contrast
- Not color-only indicators

#### Responsive Design
- Mobile viewport (375x667)
- Tablet viewport (768x1024)
- Desktop viewport (1920x1080)

#### Keyboard Navigation
- Tab navigation throughout page
- Enter/Space on buttons
- Logical tab order

#### Screen Reader Compatibility
- ARIA landmarks
- Live regions
- Hidden decorative elements

#### Integration Tests
- Admin dashboard accessibility
- Finance pages accessibility
- Insurance pages accessibility

## Tools and Libraries

### Required Packages
```json
{
  "devDependencies": {
    "axe-core": "^4.9.0",
    "jest-axe": "^8.0.0",
    "axe-playwright": "^1.6.0",
    "@testing-library/jest-dom": "^6.9.0",
    "@testing-library/react": "^16.3.0",
    "@playwright/test": "^1.47.0",
    "vitest": "^4.0.4"
  }
}
```

### Test Runners
- **Vitest**: Unit and integration tests
- **Playwright**: End-to-end tests

### Accessibility Scanners
- **axe-core**: Engine for automated testing
- **jest-axe**: Vitest integration with axe-core
- **axe-playwright**: Playwright integration with axe-core

## Running Tests

### Run All Accessibility Tests
```bash
npm test
```

### Run Only WCAG Tests
```bash
npm test tests/accessibility/wcag.test.tsx
```

### Run Only Axe Tests
```bash
npm test tests/accessibility/axe.test.tsx
```

### Run E2E Accessibility Tests
```bash
npm run test:e2e tests/e2e/accessibility.spec.ts
```

### Run E2E Tests with UI
```bash
npm run test:e2e:ui
```

### Run Accessibility Tests in CI
```bash
# Generate coverage report
npm run test:coverage

# Generate HTML reports
npm test -- --reporter=html

# E2E reports
npm run test:e2e -- --reporter=html
```

## Coverage Goals

### WCAG Compliance
- ✅ **100%** WCAG 2.1 Level A compliance
- ✅ **100%** WCAG 2.1 Level AA compliance
- 🎯 **>95%** WCAG 2.1 Level AAA compliance

### Test Coverage
- ✅ **90%** component accessibility coverage
- ✅ **85%** page accessibility coverage
- ✅ **80%** E2E accessibility coverage

## Continuous Integration

### Pre-commit Hooks
Run accessibility tests before committing:
```bash
npm test -- --watch=false
```

### Pull Request Checks
Require all accessibility tests to pass before merging

### Automated Reports
- HTML reports in CI artifacts
- Accessibility audit summaries
- Violation tracking over time

## Accessibility Features Tested

### Visual
- [x] Color contrast ratios
- [x] Focus indicators
- [x] High contrast mode
- [x] Font size options
- [x] Reduce motion support

### Keyboard
- [x] Tab navigation
- [x] Focus management
- [x] Keyboard shortcuts
- [x] Skip links
- [x] Escape to close modals

### Screen Reader
- [x] ARIA labels
- [x] ARIA roles
- [x] ARIA live regions
- [x] Semantic HTML
- [x] Heading hierarchy
- [x] Hidden decorative content

### Forms
- [x] Label associations
- [x] Error announcements
- [x] Required fields
- [x] Autocomplete attributes
- [x] Field descriptions

### Navigation
- [x] Landmarks
- [x] Skip links
- [x] Multiple navigation regions
- [x] Breadcrumbs

## Test Maintenance

### When to Update Tests

1. **New Components**: Add tests for all new UI components
2. **WCAG Updates**: Keep up with WCAG 2.2, 2.3 releases
3. **New Features**: Test accessibility of all new features
4. **Bug Fixes**: Re-test after accessibility bug fixes
5. **Design Changes**: Verify accessibility after UI updates

### Monitoring

- Track accessibility violations over time
- Set up alerts for new violations
- Regular manual audits (quarterly)
- User feedback integration
- Assistive technology testing

## Healthcare-Specific Considerations

### HIPAA Compliance
- ✅ Data privacy in tests
- ✅ No PHI in test data
- ✅ Secure test environments

### Medical Accuracy
- ✅ Correct terminology
- ✅ Clear instructions
- ✅ Error prevention

### Emergency Accessibility
- ✅ Critical functions accessible
- ✅ Quick access features
- ✅ Voice command support

## Resources

### WCAG Guidelines
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WCAG AAA Checklist](https://www.w3.org/WAI/WCAG21/quickref/?levels=aaa)

### Tools Documentation
- [axe-core](https://github.com/dequelabs/axe-core)
- [jest-axe](https://github.com/nickcolley/jest-axe)
- [axe-playwright](https://github.com/abhinaba-ghosh/axe-playwright)
- [Playwright Accessibility](https://playwright.dev/docs/accessibility-testing)

### Testing Libraries
- [Testing Library](https://testing-library.com/)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)

## Success Criteria

### Accessibility Tests Pass
✅ All automated tests pass  
✅ No axe violations  
✅ Full keyboard navigation works  
✅ Screen reader compatibility verified  

### Manual Verification
✅ Tested with NVDA  
✅ Tested with JAWS  
✅ Tested with VoiceOver  
✅ Tested with keyboard only  

### Compliance
✅ WCAG AAA compliant  
✅ HIPAA compliant  
✅ ADA Section 508 compliant  

## Reporting Issues

### Bug Report Template
1. Component/page affected
2. Accessibility issue description
3. WCAG criteria violated
4. Steps to reproduce
5. Expected behavior
6. Actual behavior
7. Assistive technology used
8. Browser/OS details

### Severity Levels
- **Critical**: Blocks core functionality
- **High**: Significant barrier to use
- **Medium**: Creates friction
- **Low**: Minor inconvenience

## Conclusion

This comprehensive accessibility testing suite ensures RustCare meets the highest standards of accessibility for healthcare applications, providing equal access to all users including those with disabilities.










