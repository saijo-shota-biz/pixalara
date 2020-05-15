export type Photo = {
  id: string;
  url: string;
  owner: {
    id: string;
    name: string;
  },
  likes_count: number,
  liked_by_user: boolean,
  comments: {
    content: string;
    author: {
      id: string;
      name: string;
    },
  }[],
}
