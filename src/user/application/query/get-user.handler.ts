import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from 'src/user/infra/db/entity/user.entity';
import { Repository } from 'typeorm';

import { GetUserQuery } from './get-user.query';
import { PartyUserEntity } from 'src/party/infra/db/entity/party/party_user.entity';
import { StatusEnum } from 'src/common/entity/baseEntity';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(PartyUserEntity) private partyuserRepository: Repository<PartyUserEntity>,
  ) {}

  async execute(query: GetUserQuery) {
    const { userId } = query;

    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.userPersonalities', 'userPersonality')
      .leftJoin('userPersonality.personalityOption', 'personalityOption')
      .leftJoin('personalityOption.personalityQuestion', 'personalityQuestion')
      .leftJoin('user.userCareers', 'userCareers')
      .leftJoin('userCareers.position', 'position')
      .leftJoin('user.userLocations', 'userLocations')
      .leftJoin('userLocations.location', 'location')
      .select([
        'user',
        'userPersonality.id',
        'personalityOption.id',
        'personalityOption.content',
        'personalityQuestion',
        'userCareers.id',
        'userCareers.years',
        'userCareers.careerType',
        'position',
        'userLocations.id',
        'location',
      ])
      .where('user.id = :id', { id: userId })
      .andWhere('user.status != :deleted', { deleted: StatusEnum.DELETED })
      .getOne();

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }

    // // 개인 성향 데이터를 1 : N : N 형태로 재구성
    // const formattedPersonalities = user.userPersonalities.reduce((acc, userPersonality) => {
    //   const questionContent = userPersonality.personalityOption.personalityQuestion.content;
    //   const optionContent = userPersonality.personalityOption.content;

    //   // 동일한 질문이 이미 acc에 존재하는지 확인
    //   let questionEntry = acc.find((entry) => entry.question === questionContent);

    //   if (!questionEntry) {
    //     // acc에 없는 질문이면 새로 추가하고 options 배열 생성
    //     questionEntry = { question: questionContent, options: [] };
    //     acc.push(questionEntry);
    //   }

    //   // options에 옵션 텍스트만 추가
    //   questionEntry.options.push(optionContent);

    //   return acc;
    // }, []);

    // 결과를 응답 형식에 맞춰 반환
    return {
      ...user,
      // userPersonalities: formattedPersonalities,
    };
  }
}
