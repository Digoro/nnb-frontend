import { User } from './user';

export class Coupon {
    constructor(
        public cid: number,
        public user: User,
        public title: string,
        public price: number,
        public isUsed: boolean,
    ) { }
}