export interface Workshop {
  title: string;
  description: string;
  location: string;
  link: string;
  time: string;
  thumbnail: string;
  speaker: string;
  eventType: string;
  detail: string;
  status: string;
  userId: string;
}

export interface UpdateWorkshop extends Workshop {
  slug: string;
  version: number;
}
