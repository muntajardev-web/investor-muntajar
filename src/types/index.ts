export type {
  PaginationParams,
  PaginatedResult,
  SortOrder,
  SortParams,
} from "./common";
export type {
  RecommendationRequest,
  RecommendationResponse,
  ScoredUniversity,
  KeyFactor,
  KeyFactorCategory,
  MatchingCriteria,
} from "./recommendation";
export type {
  CreateUserProfileInput,
  UpdateUserProfileInput,
  UserProfileDTO,
} from "./profile";
export type {
  UniversityDTO,
  UniversityProgramDTO,
  UniversityFilter,
} from "./university";
export type {
  ScholarshipDTO,
  CountryInfoDTO,
  RankingDTO,
} from "./catalog";
export type {
  ApplicationDTO,
  CreateApplicationInput,
  UpdateApplicationInput,
} from "./application";
export type {
  DocumentDTO,
  UploadDocumentInput,
  PresignedUploadResult,
} from "./document";
export type { ApiResponse, ApiError } from "./api";
export type { AuthUser, AuthSession } from "./auth";
export type {
  RecommendationInput,
  FinancialCapability,
  ScholarshipPreference,
  ChanceLevel,
  UniversityProgramCandidate,
  ScoredCandidate,
  GptUniversityPayload,
  GptAnalysisResult,
  RecommendationEngineResponse,
} from "./recommendation-engine";
export {
  recommendationInputSchema,
  financialCapabilitySchema,
  scholarshipPreferenceSchema,
  chanceLevelSchema,
} from "./recommendation-engine";
