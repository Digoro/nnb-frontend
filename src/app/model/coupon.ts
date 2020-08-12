import { User } from './user';

export class Coupon {
    constructor(
        public couponId: number,
        public user: User,
        public title: string,
        public price: number,
        public isUsed: boolean,
    ) { }
}