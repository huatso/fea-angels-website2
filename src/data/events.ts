export type Event = {
  title: string;
  date: string;
  location: string;
  description: string;
  status: "upcoming" | "past";
  url?: string;
  lumaEventId?: string;
};

export const events: Event[] = [
  {
    title: "5º Pitch Night FEA Angels",
    date: "26 de maio de 2026",
    location: "FEA-USP · Auditório Eugênio Gudin",
    description: "Cinco startups selecionadas apresentam suas teses para nossa comunidade de anjos.",
    status: "past",
  },
  {
    title: "6º Pitch Night FEA Angels",
    date: "11 de junho de 2026",
    location: "FEA-USP · Av. Prof. Luciano Gualberto, 908",
    description: "Cinco startups selecionadas apresentam suas teses para nossa comunidade de anjos.",
    status: "upcoming",
    url: "https://lu.ma/0o8lzypb",
    lumaEventId: "evt-3sxEwL7tc0NPlEM",
  },
  {
    title: "4º Pitch Night FEA Angels",
    date: "20 de novembro de 2025",
    location: "FEA-USP",
    description: "Quatro startups apresentadas, duas captações em andamento.",
    status: "past",
  },
  {
    title: "Workshop: Term Sheets para fundadores",
    date: "8 de outubro de 2025",
    location: "FEA-USP",
    description: "Imersão jurídica e financeira sobre as cláusulas essenciais.",
    status: "past",
  },
];
