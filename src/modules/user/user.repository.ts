import { User } from "../../database/entities/user.entity";
import { EntityRepository } from "typeorm";
import { AuthRepository } from "../auth/auth.repository";

@EntityRepository(User)
export class UserRepository extends AuthRepository {

}