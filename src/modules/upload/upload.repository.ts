import { Image } from "src/database/entities/image.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Image)
export class UploadRepository extends Repository<Image>{

}