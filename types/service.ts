// /types/service.ts

export type Service = {
  id: number;
  name: string;
  price: number;
  category: string;
  extraNotes?: string; // optional
};