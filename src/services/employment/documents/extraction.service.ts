/**
 * @deprecated Prefer `runDocumentAgent` from document-agent.service.ts
 * Thin compatibility wrapper for older imports.
 */
export {
  runDocumentAgent as extractDocumentData,
  needsHumanReview,
  DOCUMENT_AGENT_CONFIDENCE_THRESHOLD,
} from "./document-agent.service";
export type {
  DocumentAgentResult as ExtractedDocumentData,
  DocumentAgentResult,
} from "./document-agent.types";
