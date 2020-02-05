import { Role } from "../../entities/User";

export interface Payload {
  user: {
    id: number;
    role: Role;
  };
}
