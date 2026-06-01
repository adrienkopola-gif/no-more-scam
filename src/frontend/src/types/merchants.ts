import type {
  Merchant as BackendMerchant,
  MerchantEvaluation as BackendMerchantEvaluation,
  PlaqueLevelType,
} from "../backend";

export type { PlaqueLevelType };

export type MerchantCategory =
  | "tapis"
  | "épices"
  | "cuir"
  | "céramique"
  | "bijoux"
  | "poterie"
  | "textile"
  | "artisanat"
  | "autre";

export const MERCHANT_CATEGORIES: MerchantCategory[] = [
  "tapis",
  "épices",
  "cuir",
  "céramique",
  "bijoux",
  "poterie",
  "textile",
  "artisanat",
  "autre",
];

export type Merchant = BackendMerchant;
export type MerchantEvaluation = BackendMerchantEvaluation;

export interface SubmitMerchantParams {
  name: string;
  category: string;
  city: string;
  quartier: string;
  mapsLink: string;
}

export interface EvaluateMerchantParams {
  merchantId: bigint;
  comment: string | null;
}
