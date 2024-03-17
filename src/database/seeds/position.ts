import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { PositionEntity } from 'src/position/entity/position.entity';

export default class PositionSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(PositionEntity);
    await repository.insert([
      {
        id: 1,
        position: '프론트엔드',
      },
      {
        id: 2,
        position: '백엔드',
      },
      {
        id: 3,
        position: '안드로이드',
      },
      {
        id: 4,
        position: 'iOS',
      },
    ]);
  }
}
