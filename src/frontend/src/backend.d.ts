import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export type PostId = bigint;
export interface Reclamation {
    id: bigint;
    city: string;
    whatTheySell: string;
    description: string;
    author: Principal;
    timestamp: bigint;
    helpfulCount: bigint;
    location: string;
}
export interface ProductPriceRange {
    fes: RegionPrice;
    casablanca: RegionPrice;
    marrakech: RegionPrice;
}
export interface Merchant {
    id: bigint;
    photoBlob?: ExternalBlob;
    plaqueLevel: PlaqueLevelType;
    city: string;
    code: string;
    name: string;
    mapsLink: string;
    submittedBy: Principal;
    positiveEvaluations: bigint;
    timestamp: bigint;
    category: string;
    reclamationCount: bigint;
    quartier: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface Tip {
    id: bigint;
    content: string;
    author: Principal;
    timestamp: Time;
    helpfulCount: bigint;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface RegionPrice {
    max: bigint;
    min: bigint;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface Post {
    id: PostId;
    scamVotes: Array<Principal>;
    titre: string;
    categorie: string;
    content: string;
    imageBlob?: ExternalBlob;
    ville: string;
    author: Principal;
    experience: string;
    fairDealVotes: Array<Principal>;
    timestamp: Time;
}
export interface TraditionalProduct {
    seasonalVariationPercent: bigint;
    name: string;
    description: string;
    negotiationTips: string;
    category: string;
    priceRanges: ProductPriceRange;
}
export interface PremiumProduct {
    id: bigint;
    title: string;
    imageBlob?: ExternalBlob;
    description: string;
    priceTag: string;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface MerchantEvaluation {
    id: bigint;
    evaluator: Principal;
    merchantId: bigint;
    comment?: string;
    timestamp: bigint;
}
export interface UserProfile {
    status: UserStatus;
    country: string;
    username: string;
    quizScore: bigint;
    name: string;
    earnedBadges: Array<string>;
    tipsGiven: bigint;
    email?: string;
    firstPostCreated: boolean;
    scamsReported: bigint;
    points: bigint;
}
export interface Comment {
    id: bigint;
    content: string;
    author: Principal;
    timestamp: bigint;
    postId: bigint;
}
export enum PlaqueLevelType {
    revoked = "revoked",
    pending = "pending",
    gold = "gold",
    argent = "argent"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum UserStatus {
    premium = "premium",
    free = "free"
}
export interface backendInterface {
    addComment(postId: bigint, content: string): Promise<bigint>;
    addPremiumProduct(product: PremiumProduct): Promise<void>;
    adminUploadMerchantPhoto(merchantId: bigint, blob: ExternalBlob): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminValidateReclamation(merchantId: bigint): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createPost(content: string, ville: string, titre: string, experience: string, categorie: string, imageBlob: ExternalBlob | null): Promise<PostId>;
    createReclamation(description: string, whatTheySell: string, city: string, location: string): Promise<Reclamation>;
    createTip(content: string): Promise<bigint>;
    deletePost(postId: PostId): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    evaluateMerchant(merchantId: bigint, comment: string | null): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    filterTraditionalProducts(category: string | null, minPrice: bigint | null, maxPrice: bigint | null, region: string | null): Promise<Array<TraditionalProduct>>;
    getAllPosts(): Promise<Array<Post>>;
    getAllPremiumProducts(): Promise<Array<PremiumProduct>>;
    getAllReclamations(): Promise<Array<Reclamation>>;
    getAllTips(): Promise<Array<Tip>>;
    getAllTraditionalProducts(): Promise<Array<TraditionalProduct>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getComments(postId: bigint): Promise<Array<Comment>>;
    getCountry(user: Principal): Promise<string>;
    getMerchant(id: bigint): Promise<Merchant | null>;
    getMerchantEvaluations(merchantId: bigint): Promise<Array<MerchantEvaluation>>;
    getMerchants(): Promise<Array<Merchant>>;
    getPost(postId: PostId): Promise<Post | null>;
    getPremiumProduct(id: bigint): Promise<PremiumProduct | null>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getTraditionalProductById(id: bigint): Promise<TraditionalProduct | null>;
    getTraditionalProductsByCategory(category: string): Promise<Array<TraditionalProduct>>;
    getTraditionalProductsByRegion(region: string): Promise<Array<TraditionalProduct>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUsername(user: Principal): Promise<string>;
    initializeTraditionalProducts(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchMerchantByCode(code: string): Promise<Merchant | null>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    submitMerchant(name: string, category: string, city: string, quartier: string, mapsLink: string): Promise<{
        __kind__: "ok";
        ok: Merchant;
    } | {
        __kind__: "err";
        err: string;
    }>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateCountry(newCountry: string): Promise<void>;
    updateEmail(email: string): Promise<void>;
    updatePost(postId: PostId, newTitre: string, newContent: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateUsername(newUsername: string): Promise<void>;
    voteFairDeal(postId: bigint): Promise<void>;
    voteReclamationHelpful(id: bigint): Promise<Reclamation | null>;
    voteScam(postId: bigint): Promise<void>;
}
