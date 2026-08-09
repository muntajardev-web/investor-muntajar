/**
 * Feature modules — domain boundaries for Muntajar.
 *
 * Each feature owns its schemas, server actions, and query keys.
 * UI components will live under features/<name>/components/ (future).
 */

export * as recommendationsFeature from "./recommendations";
export * as profilesFeature from "./profiles";
export * as universitiesFeature from "./universities";
export * as applicationsFeature from "./applications";
export * as documentsFeature from "./documents";
export * as authFeature from "./auth";
