import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { SkillEntity } from 'src/skill/entity/skill.entity';

export default class SkillSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(SkillEntity);
    await repository.insert([
      {
        id: 1,
        skill: 'react',
      },
      {
        id: 2,
        skill: 'vue.js',
      },
      {
        id: 3,
        skill: 'node.js',
      },
      {
        id: 4,
        skill: 'nest.js',
      },
    ]);
  }
}
