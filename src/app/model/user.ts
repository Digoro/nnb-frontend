import { Gender } from './gender';
import { Location } from './location';

export class User {
    constructor(
        public uid: number,
        public email: string,
        public name: string,
        public nickName: string,
        public birth: string,
        public gender: Gender,
        public phone: string,
        public image: string,
        public location: Location,
        public score: number,
        public catch_phrase: string,
        public introduction: string,
        public password: string,
        public provider: string,
        public sid: number,
        public use_social_image: boolean
    ) { }
}

export class KakaoUser {
    constructor(
        public nid: number,
        public id: number,
        public connected_at: string,
        public properties: KakaoProperties,
        public kakao_account: KakaoAccount
    ) { }
}

export class KakaoProperties {
    constructor(
        public nickname: string,
        public profile_image: string,
        public thumbnail_image: string
    ) { }
}

export class KakaoAccount {
    constructor(
        public profile_needs_agreement: boolean,
        public profile: KakaoProfile,
        public has_email: boolean,
        public email_needs_agreement: boolean,
        public is_email_valid: boolean,
        public is_email_verified: boolean,
        public email: string,
        public has_age_range: boolean,
        public age_range_needs_agreement: boolean,
        public age_range: string,
        public has_birthday: boolean,
        public birthday_needs_agreement: boolean,
        public birthday: string,
        public birthday_type: string,
        public has_gender: boolean,
        public gender_needs_agreement: boolean,
        public gender: string,
    ) { }
}

export class KakaoProfile {
    constructor(
        public nickname: string,
        public thumbnail_image_url: string,
        public profile_image_url: string,
    ) { }
}