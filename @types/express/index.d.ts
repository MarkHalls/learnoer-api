import { UserRecord } from "../../database/models/users";

declare global {
  namespace Express {
    interface Request {
      user: UserRecord;
    }
  }
}
