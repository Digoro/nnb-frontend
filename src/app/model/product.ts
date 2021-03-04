import { Category } from './category';
import { ProductReview } from './comment';
import { PaymentResult } from './payment';
import { User } from './user';

export class Product {
    constructor(
        public id: number,
        public title: string,
        public price: number,
        public discountPrice: number,
        public point: string,
        public recommend: string,
        public description: string,
        public address: string,
        public detailAddress: string,
        public runningMinutes: number,
        public lat: number,
        public lon: number,
        public host: User,
        public notice: string,
        public checkList: string,
        public includeList: string,
        public excludeList: string,
        public refundPolicy100: number,
        public refundPolicy0: number,
        public sortOrder: number,
        public status: ProductStatus,
        public hashtags?: Hashtag[],
        public categories?: Category[],
        public likes?: number,
        public isSetLike?: boolean,
        public options?: ProductOption[],
        public createdAt?: Date,
        public updatedAt?: Date,
        public representationPhotos?: ProductRepresentationPhoto[],
        public productRequests?: ProductRequest[],
        public productReviews?: ProductReview[]
    ) { }
}

export class ProductCreateDto {
    constructor(
        public title: string,
        public point: string,
        public recommend: string,
        public description: string,
        public address: string,
        public detailAddress: string,
        public runningMinutes: number,
        public lat: number,
        public lon: number,
        public price: number,
        public discountPrice: number,
        public notice: string,
        public checkList: string,
        public includeList: string,
        public excludeList: string,
        public refundPolicy100: number,
        public refundPolicy0: number,
        public sortOrder: number,
        public status: ProductStatus,
        public hashtags: HashtagCreateDto[],
        public categories: Category[],
        public options: ProductOption[],
        public representationPhotos: ProductRepresentationPhotoCreateDto[]
    ) { }
}

export enum ProductStatus {
    ALL = 'ALL',
    CREATED = 'CREATED',
    INSPACTED = 'INSPACTED',
    ENTERED = 'ENTERED',
    UPDATED = 'UPDATED',
    DISABLED = 'DISABLED',
    COMPLETED = 'COMPLETED',
    DELETED = 'DELETED',
}

export class ProductOption {
    constructor(
        public id: number,
        public meeting: number,
        public name: string,
        public price: number,
        public description: string,
        public date: string,
        public minParticipants: number,
        public maxParticipants: number,
        public isOld: boolean
    ) { }
}

export class ProductOptionCreateDto {
    constructor(
        public name: string,
        public price: number,
        public description: string,
        public date: string,
        public minParticipants: number,
        public maxParticipants: number,
        public isOld: boolean,
        public id?: number
    ) { }
}

export class PurchasedProductOption extends ProductOption {
    constructor(
        id: number,
        meeting: number,
        name: string,
        price: number,
        description: string,
        date: string,
        minParticipants: number,
        maxParticipants: number,
        isOld: boolean,
        public pomid: number,
        public count: number,
        public PCD_PAY_REFUND_CARDRECEIPT: string,
        public PCD_REFUND_TOTAL: number,
        public isRefund: boolean
    ) { super(id, meeting, name, price, description, date, minParticipants, maxParticipants, isOld) }
}

export interface PurchasedProduct {
    payment: PaymentResult,
    options: PurchasedProductOption[]
}

export class ProductRequest {
    constructor(
        public id: number,
        public product: Product,
        public user: User,
        public numberOfPeople: number,
        public phoneNumber: string,
        public message: string,
        public isChecked: boolean,
        public checkedAt?: Date
    ) { }
}

export class ProductRequestCreateDto {
    constructor(
        public productId: number,
        public numberOfPeople: number,
        public message: string,
        public isChecked?: boolean
    ) { }
}

export class Hashtag {
    constructor(
        public id: number,
        public name: string,
        public type: HashtagType,
        public isAnalysis: boolean,
        public createdAt: Date,
        public updatedAt: Date
    ) { }
}

export class HashtagCreateDto {
    constructor(
        public type: HashtagType = HashtagType.PRODUCT,
        public isAnalysis = false,
        public name?: string,
        public id?: string
    ) { }
}

export enum HashtagType {
    PRODUCT = 'PRODUCT',
    USER = 'USER'
}

export class ProductRepresentationPhoto {
    constructor(
        public id: number,
        public product: Product,
        public photo: string,
        public sortOrder: number,
    ) { }
}

export class ProductRepresentationPhotoCreateDto {
    constructor(
        public photo: string,
        public sortOrder: number
    ) { }
}

export interface ProductSearchDto {
    page?: number;
    limit?: number;
    status?: ProductStatus;
    hostId?: number;
    categoryId?: number;
    hashtag?: string;
    analysisHashtags?: string;
    from?: string;
    to?: string;
}

export interface ProductUpdateDto {
    title?: string;
    point?: string;
    recommend?: string;
    description?: string;
    address?: string;
    detailAddress?: string;
    runningMinutes?: number;
    price?: number,
    discountPrice?: number,
    lat?: number;
    lon?: number;
    notice?: string;
    checkList?: string;
    includeList?: string;
    excludeList?: string;
    refundPolicy100?: number;
    refundPolicy0?: number;
    sortOrder?: number;
    status?: ProductStatus;
    hashtags?: HashtagCreateDto[];
    categories?: Category[];
    options?: ProductOptionCreateDto[];
    representationPhotos?: ProductRepresentationPhotoCreateDto[];
}

export interface ProductManageDto {
    sortOrder?: number;
    status?: ProductStatus;
}