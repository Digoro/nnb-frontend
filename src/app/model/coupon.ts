import { User } from './user';

export class Coupon {
    constructor(
        public id: number,
        public user: User,
        public name: string,
        public contents: string,
        public price: number,
        public isUsed: boolean,
        public expireDuration: Date,
        public createdAt: Date,
        public updatedAt: Date
    ) { }
}

export interface CouponSearchDto {
    page: number,
    limit: number,
    userId: number,
    expireDuration: Date,
    isUsed: boolean
}