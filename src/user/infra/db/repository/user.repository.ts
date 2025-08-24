import { DataSource, Not, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';

import { IUserRepository } from 'src/user/domain/user/repository/iuser.repository';
import { StatusEnum } from 'src/common/entity/baseEntity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    readonly dataSource: DataSource,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findById(id: number) {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  async findByExternalId(externalId: string) {
    return await this.userRepository.findOne({
      where: { externalId },
    });
  }

  async findByIdWithoutDeleted(id: number) {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  async findByExternalIdWithoutDeleted(externalId: string) {
    return await this.userRepository.findOne({
      where: { externalId, status: Not(StatusEnum.DELETED) },
    });
  }

  async findByNickname(nickname: string) {
    const userEntity = await this.userRepository.findOne({
      where: { nickname },
    });

    if (!userEntity) {
      return null;
    }

    return userEntity;
  }

  async prepare() {
    const userEntity = await this.userRepository.save({ status: StatusEnum.INACTIVE });

    return userEntity.id;
  }

  async createUser(email: string, image: string, nickname: string, gender: string, birth: string) {
    return await this.userRepository.save({ email, image, nickname, gender, birth });
  }

  async updateUser(
    id: number,
    gender: string,
    genderVisible: boolean,
    birth: string,
    birthVisible: boolean,
    portfolioTitle: string,
    portfolio: string,
    image: string,
  ) {
    await this.userRepository.update(id, {
      gender,
      genderVisible,
      birth,
      birthVisible,
      portfolioTitle,
      portfolio,
      image,
    });

    return await this.findById(id);
  }

  async deleteUserById(userId: number): Promise<void> {
    await this.userRepository.delete({ id: userId });
  }

  async setUserActiveById(userId: number) {
    await this.userRepository.update(
      { id: userId }, // 조건
      {
        status: StatusEnum.ACTIVE,
      },
    );
  }

  async setUserInactiveById(userId: number) {
    await this.userRepository.update(
      { id: userId }, // 조건
      {
        status: StatusEnum.INACTIVE,
      },
    );
  }

  async softDeleteUserById(userId: number) {
    await this.userRepository.update(
      { id: userId }, // 조건
      {
        portfolio: null,
        nickname: `#${userId}`,
        status: StatusEnum.DELETED,
      },
    );
  }
}
