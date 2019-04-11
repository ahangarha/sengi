export interface AppData {
    client_id: string;
    client_secret: string;
    id: string;
    name: string;
    redirect_uri: string;
    website: string;
}

export interface TokenData {
    access_token: string;
    token_type: string;
    scope: string;
    created_at: number;

    //TODO: Pleroma support this
    me: string;
    expires_in: number;
    refresh_token: string;
}

export interface Account {
    id: number;
    username: string;
    acct: string;
    display_name: string;
    locked: string;
    created_at: string;
    followers_count: number;
    following_count: number;
    statuses_count: number;
    note: string;
    url: string;
    avatar: string;
    avatar_static: string;
    header: string;
    header_static: string;
    emojis: Emoji[];
    moved: boolean;
    fields: Field[];
    bot: boolean;
    source: AccountInfo;
}

export interface AccountInfo {
    privacy: string;
    sensitive: boolean;
    note: string;
    fields: Field[];
}

export interface Emoji {
    shortcode: string;
    static_url: string;
    url: string;
    visible_in_picker: boolean;
}

export interface Field {
    name: string;
    value: string;
    verified_at: string;
}

export interface Application {
    name: string;
    website: string;
}

export interface Attachment {
    id: string;
    type: 'image' | 'video' | 'gifv';
    url: string;
    remote_url: string;
    preview_url: string;
    text_url: string;
    meta: any;
    description: string;
}

export interface Card {
    url: string;
    title: string;
    description: string;
    image: string;
}

export interface Context {
    ancestors: Status[];
    descendants: Status[];
}

export interface Error {
    error: string;
}

export interface Instance {
    uri: string;
    title: string;
    description: string;
    email: string;
    version: string;
    urls: string[];
    contact_account: Account;
    max_toot_chars: number;
}

export interface Mention {
    url: string;
    username: string;
    acct: string;
    id: string;
}

export interface Notification {
    id: string;
    type: 'mention' | 'reblog' | 'favourite' | 'follow';
    created_at: string;
    account: Account;
    status?: Status;
}

export interface Relationship {
    id: number;
    following: boolean;
    followed_by: boolean;
    blocking: boolean;
    muting: boolean;
    requested: boolean;
}

export interface Report {
    id: string;
    action_taken: boolean;
}

export interface Results {
    accounts: Account[];
    statuses: Status[];
    hashtags: string[];
}

export interface Status {
    id: string;
    uri: string;
    url: string;
    account: Account;
    in_reply_to_id: string;
    in_reply_to_account_id: number;
    reblog: Status;
    content: string;
    created_at: string;
    reblogs_count: number;
    replies_count: number;
    favourites_count: string;
    reblogged: boolean;
    favourited: boolean;
    sensitive: boolean;
    spoiler_text: string;
    visibility: 'public' | 'unlisted' | 'private' | 'direct';
    media_attachments: Attachment[];
    mentions: Mention[];
    tags: Tag[];
    application: Application;
    emojis: any[];
    language: string;
    pinned: boolean;
}
export interface Tag {
    name: string;
    url: string;
}

