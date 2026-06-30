export type Member = {
  name: string;
  role: string;
  bio: string;
  initials: string;
  photo_url?: string;
  category: "conselho" | "diretoria" | "estagiarios";
};
