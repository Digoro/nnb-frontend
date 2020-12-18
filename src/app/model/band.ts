export class BandResult<T> {
    constructor(
        public result_code: number,
        public result_data: BandResultData<T>,
    ) { }
}

export class BandResultData<T> {
    constructor(
        public items: T,
        public paging: { next_params: { access_token: string, after: string, band_key: string, limit: string } },
    ) { }
}

export class BandAuthor {
    constructor(
        public created_at: number,
        public description: string,
        public is_muted: boolean,
        public me: boolean,
        public member_certified: boolean,
        public member_type: string,
        public name: string,
        public profile_image_url: string,
        public role: string,
        public user_key: string,
    ) { }
}

export class BandPhoto {
    constructor(
        public author: BandAuthor,
        public comment_count: number,
        public created_at: number,
        public emotion_count: number,
        public height: number,
        public is_video_thumbnail: boolean,
        public photo_album_key: string,
        public photo_key: string,
        public url: string,
        public width: number,
    ) { }
}

export class BandPost {
    constructor(
        public author: BandAuthor,
        public band_key: string,
        public comment_count: number,
        public content: string,
        public created_at: string,
        public emotion_count: string,
        public post_key: string,
        public photos: BandPhoto[],
        public comments?: BandComment[]
    ) { }
}

export class BandComment {
    constructor(
        public band_key: string,
        public post_key: string,
        public author: BandAuthor,
        public comment_key: string,
        public content: string,
        public emotion_count: string,
        public is_audio_included: boolean,
        public created_at: string,
        public photo: { height: number, width: number, url: string, thumbnail_type: string },
        public sticker?: { height: number, width: number, url: string },
    ) { }
}

export class BandDetailResult<T> {
    constructor(
        public result_code: number,
        public result_data: BandDetailResultData<T>,
    ) { }
}

export class BandDetailResultData<T> {
    constructor(
        public post: T,
    ) { }
}

export class BandPostDetail {
    constructor(
        public author: BandAuthor,
        public band_key: string,
        public comment_count: number,
        public content: string,
        public created_at: string,
        public emotion_count: string,
        public is_multilingual: boolean,
        public photo: BandPhoto[],
        public post_key: string,
        public post_read_count: number,
        public shared_count: number,
        public snippet: object,
        public video: object,
        public comments?: BandComment[]
    ) { }
}

