export interface Article {
  title: string;
  content: string;
  category: string;
  tags: string[];
  thumbnail: string;
  description: string;
  status: string;
  authorId: string;
  authorName: string;
}
export interface UpdateArticle {
  slug: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  thumbnail: string;
  description: string;
  status: string;
  authorId: string;
  authorName: string;
  version: number;
}
