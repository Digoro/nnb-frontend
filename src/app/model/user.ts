import { Product } from 'src/app/model/product';
import { Coupon } from './coupon';
import { Location } from './location';
import { ProductRequest } from './product';

export class User {
    constructor(
        public id: number,
        public email: string,
        public password: string,
        public name: string,
        public phoneNumber: string,
        public provider: string,
        public thirdpartyId: string,
        public point: number,
        public birthday: string,
        public nickname: string,
        public gender: Gender,
        public profilePhoto: string,
        public location: Location,
        public catchphrase: string,
        public introduction: string,
        public role: Role,
        public products?: Product[],
        public coupons?: Coupon[],
        public productLikes?: any[],
        public followingLikes?: any[],
        public followedLikes?: any[],
        public productRequests?: ProductRequest[],
        public productReviews?: Comment[]
    ) { }
}

export enum Role {
    ADMIN = 'admin',
    EDITOR = 'editor',
    USER = 'user',
}

export enum Gender {
    MALE = "male",
    FEMALE = "female",
    OTHER = "other"
}