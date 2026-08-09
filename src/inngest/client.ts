import { Inngest } from "inngest";
import { env } from "@/config";

export const inngest = new Inngest({
  id: "muntajar",
  eventKey: env.INNGEST_EVENT_KEY || undefined,
});

export type EmploymentDocumentUploadedEvent = {
  name: "employment/document.uploaded";
  data: {
    documentId: string;
    userId: string;
    kind: string;
    s3Key: string;
    mimeType: string;
    fileName: string;
  };
};

export type EmploymentDocumentApprovedEvent = {
  name: "employment/document.extraction.approved";
  data: {
    documentId: string;
    userId: string;
  };
};

export type InngestEvents = {
  "employment/document.uploaded": EmploymentDocumentUploadedEvent;
  "employment/document.extraction.approved": EmploymentDocumentApprovedEvent;
};
