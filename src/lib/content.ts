import { supabase } from "./supabase";

type ContentMap = Record<string, string>;

export async function getPageContent(page: string): Promise<ContentMap> {
  const { data } = await supabase.from("page_content").select("section, content").eq("page", page);
  const map: ContentMap = {};
  if (data) {
    for (const row of data) {
      map[row.section as string] = row.content as string;
    }
  }
  return map;
}

export async function getAllContent(): Promise<
  { page: string; section: string; content: string; id: number }[]
> {
  const { data } = await supabase.from("page_content").select("*").order("page").order("section");
  return (data ?? []) as any;
}

export async function saveContent(id: number, content: string) {
  return supabase
    .from("page_content")
    .update({ content, updated_at: new Date().toISOString() })
    .eq("id", id);
}

export type PortfolioItem = {
  id: number;
  name: string;
  sector: string;
  stage: string;
  year: number;
  logo_url?: string;
};

export async function getPortfolio(): Promise<PortfolioItem[]> {
  const { data } = await supabase.from("portfolio").select("*").order("id");
  return (data ?? []) as any;
}

export async function savePortfolioItem(item: {
  name: string;
  sector: string;
  stage: string;
  year: number;
}) {
  return supabase.from("portfolio").insert(item).select().single();
}

export async function updatePortfolioItem(
  id: number,
  item: { name: string; sector: string; stage: string; year: number },
) {
  return supabase.from("portfolio").update(item).eq("id", id);
}

export async function deletePortfolioItem(id: number) {
  return supabase.from("portfolio").delete().eq("id", id);
}
