# BrainBoost Mobile App

An interactive mobile application for cognitive skill development with puzzle games and challenges built with Ionic, Angular, and Capacitor.

## 🎯 Project Overview

BrainBoost is a feature-rich mobile puzzle game that challenges users with various categories including math, memory, logic, riddles, words, and pattern recognition. The app includes streak tracking, XP systems, achievements, and detailed statistics.

## 📁 Project Structure

### Industry-Standard Architecture

```
src/app/
├── core/                          # Core module (singleton services, models)
│   ├── models/                    # Data models and interfaces
│   │   ├── puzzle.model.ts        # Puzzle/challenge models
│   │   ├── user.model.ts          # User profile & statistics models
│   │   └── index.ts               # Models barrel export
│   ├── interceptors/              # HTTP interceptors
│   ├── guards/                    # Route guards
│   └── core.module.ts             # Core module (optional)
│
├── shared/                        # Shared module (reusable components)
│   ├── components/                # Shared UI components
│   ├── directives/                # Custom directives
│   ├── pipes/                     # Custom pipes
│   ├── constants/                 # Application constants
│   │   └── app.constants.ts       # App-wide constants
│   ├── styles/                    # Shared styles
│   │   ├── variables.scss         # CSS variables, mixins
│   │   └── utilities.scss         # Utility classes
│   └── shared.module.ts           # Shared module
│
├── features/                      # Feature modules
│   ├── home/
│   ├── challenge/
│   ├── results/
│   ├── achievements/
│   ├── games/
│   └── accuracy-stats/
│
├── services/                      # Domain services
│   ├── puzzle-service/
│   ├── storage-service/
│   ├── sound-service/
│   ├── achievements-service/
│   └── category-progress-service/
│
├── app.module.ts
├── app.component.ts
└── app-routing.module.ts
```

## 🏗️ Architecture Principles

### Core Module (`/core`)
- **Singleton services**: Instantiated once and shared application-wide
- **Models & Interfaces**: Central definition of data structures
- **Guards & Interceptors**: Route protection and HTTP request/response handling

### Shared Module (`/shared`)
- **Reusable Components**: UI components used across multiple features
- **Directives & Pipes**: Custom functionality for templates
- **Constants**: All magic strings and configuration values
- **Styles**: SCSS variables, mixins, and utility classes

### Features Module (`/features`)
- **Lazy-loaded**: Each feature loads only when needed
- **Self-contained**: All necessary components, services, and templates
- **Feature-specific**: Should not be imported by other features

### Services (`/services`)
- **Domain Logic**: Business logic separated from components
- **Reusability**: Used by multiple components/features
- **Testability**: Easy to unit test in isolation

## 🎨 Styling System

### SCSS Architecture

```
styles/
├── variables.scss         # Colors, typography, spacing, breakpoints
├── utilities.scss         # Utility classes
└── (component-specific)   # Scoped styles
```

### Available SCSS Variables

#### Colors
```scss
$color-primary: #667eea
$color-secondary: #f5576c
$color-success: #30cfd0
$color-warning: #fa709a
$color-danger: #f85151
```

#### Spacing (4px base unit)
```scss
$space-xs: 0.25rem   // 4px
$space-sm: 0.5rem    // 8px
$space-md: 1rem      // 16px
$space-lg: 1.5rem    // 24px
$space-xl: 2rem      // 32px
```

#### Mixins
```scss
@include flex-center         // Flexbox centering
@include elevation($level)   // Box shadows
@include transition          // Smooth transitions
@include text-truncate       // Ellipsis text
@include respond-to($bp)     // Media queries
```

### Utility Classes

Common utilities are available globally:
- `.flex-center`, `.flex-between`, `.flex-column`
- `.p-md`, `.px-lg`, `.my-sm` (padding/margin)
- `.text-primary`, `.bg-primary` (colors)
- `.rounded-lg`, `.shadow-md` (styling)
- `.text-center`, `.text-bold` (text)

## 📦 Key Dependencies

- **@angular/**: Core Angular framework (v20)
- **@ionic/angular**: Ionic UI framework
- **@capacitor/**: Native mobile capabilities
- **rxjs**: Reactive programming
- **chart.js**: Data visualization

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm start              # Angular dev server
ionic serve           # Ionic with live reload
```

### Building

```bash
# Web build
npm run build         # Development build
npm run build:prod    # Production build

# Mobile builds
npm run build:ios     # Build & open in Xcode
npm run build:android # Build & open in Android Studio
```

## 🔍 Naming Conventions

### Files & Directories
- **kebab-case**: `home-page.component.ts`, `puzzle-service.ts`
- **Descriptive**: Clear, searchable names
- **Feature-based**: Organized by feature, not type

### Classes & Types
- **PascalCase**: `HomePage`, `PuzzleService`, `Puzzle`
- **Descriptive suffixes**: 
  - Components: `HomePageComponent`
  - Services: `PuzzleService`
  - Models: `Puzzle`, `UserProfile`
  - Interfaces: `IPuzzle`, `IUserStatistics`

### Variables & Methods
- **camelCase**: `puzzleId`, `calculateScore()`, `getUserStats()`
- **Descriptive**: Avoid abbreviations

### Constants
- **UPPER_SNAKE_CASE**: `DAILY_CHALLENGES`, `STORAGE_KEYS.USER_PROFILE`
- **Grouped**: Related constants in objects

## 📋 Configuration Files

### `tsconfig.json`
TypeScript configuration with path aliases for imports

### `angular.json`
Angular CLI configuration for builds and serve options

### `capacitor.config.ts`
Capacitor configuration for native mobile features

### `ionic.config.json`
Ionic framework configuration

## 🔐 Environment Configuration

Environment-specific settings are in `src/environments/`:
- `environment.ts` - Development
- `environment.prod.ts` - Production

## 📱 Mobile Development

### iOS
```bash
npm run build:ios
# Opens Xcode - Run on simulator or device
```

### Android
```bash
npm run build:android
# Opens Android Studio - Run on emulator or device
```

### Live Reload
Development server supports live reload on device:
```bash
ionic serve --external  # Make available on network
```

## 🧪 Testing

Run unit tests:
```bash
npm test
```

## 📚 Best Practices

1. **Import Organization**
   - Angular imports first
   - Third-party imports second
   - Local imports last

2. **Component Structure**
   ```typescript
   // Properties
   // - Inputs
   // - Outputs
   // - ViewChild references
   // - Public properties
   // - Private properties
   
   // Constructor
   constructor(...) {}
   
   // Lifecycle hooks
   // - In execution order
   
   // Public methods
   // - Sorted alphabetically
   
   // Private methods
   // - Implementation details
   ```

3. **Service Structure**
   - Constructor with dependencies injection
   - Public methods for API
   - Private methods for internal logic
   - Proper RxJS subscriptions management

4. **Template Best Practices**
   - Use trackBy in *ngFor
   - Avoid complex expressions
   - Use safe navigation operator (?.)
   - Unsubscribe from observables

## 🔄 State Management

Current approach uses:
- Component state (local)
- Service state (shared)
- Local storage (persistent)

Consider RxJS State Management patterns for complex applications.

## 📝 Commit Conventions

```
type(scope): subject

body

footer
```

**Types**: feat, fix, docs, style, refactor, perf, test, chore

Example:
```
feat(puzzle-service): add caching mechanism
fix(home-page): resolve memory leak in countdown
```

## 🚢 Publishing Checklist

- [ ] Update version in `package.json`
- [ ] Run tests: `npm test`
- [ ] Build: `npm run build:prod`
- [ ] Update `CHANGELOG.md`
- [ ] Tag release: `git tag v1.0.0`
- [ ] Update README and documentation
- [ ] Code review and testing on devices
- [ ] Deploy to app stores

## 🤝 Contributing

1. Create feature branch
2. Follow naming conventions
3. Write tests for new features
4. Update documentation
5. Create pull request

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

Your Name
- GitHub: [@yourusername](https://github.com/yourusername)
- Website: [yourwebsite.com](https://yourwebsite.com)

## 🙏 Acknowledgments

- Ionic Framework team
- Angular community
- Contributors and beta testers

---

**Last Updated**: February 2026
