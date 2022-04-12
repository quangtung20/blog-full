import { Payment } from "src/database/entities/payment.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Payment)
export class PaymentRepository extends Repository<Payment> {

}