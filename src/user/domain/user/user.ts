export interface UserProperties {
  id: number;
  nickname: string;
  gender: string;
  birth: string;
  image: string;
  birthVisible: boolean;
  genderVisible: boolean;
}

export class User {
  constructor(private userProperties: UserProperties) {}

  getId(): Readonly<number> {
    return this.userProperties.id;
  }

  getImage(): Readonly<string> {
    return this.userProperties.image;
  }

  isVisible() {
    if (this.userProperties.birthVisible === false) {
      this.userProperties.birth = undefined;
    }

    if (this.userProperties.genderVisible === false) {
      this.userProperties.gender = undefined;
    }
  }
}

// export class UserBuilder {
//   id: number;
//   nickname: string;
//   email: string;
//   gender: string;
//   birth: string;
//   image: string;
//   birthVisible: boolean;
//   genderVisible: boolean;

//   setAuthentication(id, nickname, email, gender, birth, image) {
//     this.id = id;
//     this.nickname = nickname;
//     this.email = email;
//     this.gender = gender;
//     this.birth = birth;
//     this.image = image;
//     return this;
//   }

//   setBirthVisible(birthVisible) {
//     this.birthVisible = birthVisible;
//     return this;
//   }

//   setGenderVisible(genderVisible) {
//     this.genderVisible = genderVisible;
//     return this;
//   }

//   build() {
//     return new User(
//       this.id,
//       this.nickname,
//       this.email,
//       this.gender,
//       this.birth,
//       this.image,
//       this.birthVisible,
//       this.genderVisible,
//     );
//   }
// }
