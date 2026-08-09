export { emailService } from "./email.service";
export { welcomeEmail, WELCOME_TEMPLATE } from "./templates/welcome";
export {
  recommendationReadyEmail,
  RECOMMENDATION_READY_TEMPLATE,
} from "./templates/recommendation-ready";

// Register templates on import
import "./templates/welcome";
import "./templates/recommendation-ready";
