import { Product } from "./product";
import { User } from "./user";

export class ProductReview {
    constructor(
        public id: number,
        public user: User,
        public product: Product,
        public score: number,
        public comment: string,
        public createAt: Date,
        public updatedAt: Date,
        public photo?: string,
        public parent?: ProductReview,
        public children?: ProductReview[],
        public canDelete = false
    ) { }
}

export class ProductReviewCreateDto {
    constructor(
        public productId: number,
        public score: number,
        public comment: string,
        public photo?: string,
        public parentId?: number
    ) { }
}