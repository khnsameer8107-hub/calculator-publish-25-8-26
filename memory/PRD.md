# CalcHub — Product Requirements Document

## Original Problem Statement
Build a production-ready, feature-rich MIUI-inspired multi-purpose Calculator app. Standard + scientific calculator, finance hub (GST, currency, SIP/investment, EMI), and a full converters suite (age, area, length, mass, volume, speed, temperature, time, BMI, data storage, date, discount, numeral system). Calculation history, favorites, recently used, global search, light/dark/system themes. Offline-first, no ads, no login, no monetization. Safe expression parser (no eval).

Delivered as an **Expo React Native** app (user-approved; also runs on web preview). No backend used for core features.

## Architecture
- **Frontend:** Expo Router (file-based), React Native, TypeScript.
- **State/Storage:** React Context (`ThemeContext`, `AppDataContext`) + `@/src/utils/storage` (AsyncStorage) for history, favorites, recents, theme, calc prefs. Fully offline/local.
- **Logic (UI-separated) utils:** `calc/expression.ts` (safe tokenizer + recursive-descent parser + evaluator), `calc/format.ts`, `finance/finance.ts`, `finance/currency.ts`, `convert/units.ts`, `convert/numeral.ts`, `convert/misc.ts` (bmi/discount), `date/dates.ts`.
- **Components:** CalculatorButton, DonutChart (react-native-svg), ToolCard, Selector (modal picker), DateField, Toast, and `ui.tsx` primitives (Screen, FormScreen, Card, Field, SegmentedControl, Chip, PrimaryButton, ResultCard/Row, FavoriteButton, IconBadge, EmptyState, SectionTitle).
- **Design:** MIUI orange (#FF6A00) accent, system fonts + monospace numeric display, floating glass bottom tabs, haptics on buttons, dark/light/system themes.
- **Keyboard:** react-native-keyboard-controller (`KeyboardProvider` + `KeyboardAwareScrollView`).
- **Backend:** FastAPI template left intact but unused (app is offline-first).

## User Personas
- Everyday user needing a fast, private calculator + converters without ads or accounts.
- Students/professionals using scientific + finance tools (EMI/SIP/GST).

## Core Requirements (static)
- Offline-first, no login, no ads, no data sent to servers.
- Safe math (no eval), friendly error handling, never crash.
- Responsive, accessible, MIUI-polished UI.

## Implemented (2026-08-22)
- Home dashboard: search entry, banner, quick Calculator/Scientific/History, Finance list, Converters grid, Favorites + Recently Used sections.
- Standard calculator: precedence, parentheses, %, decimal, +/-, AC, backspace, live preview, copy, keyboard input on web.
- Scientific calculator: sin/cos/tan (+inverse via 2nd), DEG/RAD, log/ln, √/∛, x²/x³/xʸ, 1/x, x!, π, e; safe error messages.
- Calculation history: list, search, delete, clear all, tap-to-reuse, copy. Persisted.
- Finance: GST (add/remove + presets), Currency (static offline rates, swap, search, labeled approximate), SIP + Lump Sum (donut), EMI (donut).
- Converters: generic unit converter (length/area/mass/volume/speed/time/data), temperature, age, BMI (metric/imperial), date (diff/add/subtract), discount (+optional tax), numeral (bin/oct/dec/hex with validation).
- Global search, favorites (persisted), recently used (persisted), Settings (theme light/dark/system, clear data), Toast feedback.
- Verified by testing agent (~98%, no blocking issues): calculations numerically correct, divide-by-zero & invalid-expression guarded.

## Backlog (prioritized)
- **P1:** Optional live exchange-rate refresh with offline fallback; PWA manifest/service worker polish for installable web build.
- **P2:** Copy-full-expression from history; memory keys (M+, M-, MR); tablet/desktop two-pane layout; percentage MIUI-style contextual mode (200+10%=220).
- **P2:** Charts for more tools; unit conversion reference tables.

## Next Tasks
- Address cosmetic react-native-web warnings (shadow*/pointerEvents) if targeting web seriously.
- Consider live currency rates behind an offline fallback (user requested static for now).
