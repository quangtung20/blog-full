import { EntityRepository, Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';

@EntityRepository(User)
export class AuthRepository extends Repository<User> {

}
