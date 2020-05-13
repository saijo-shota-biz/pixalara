export type Photo = {
  id: string;
  url: string;
  owner: {
    id: string;
    name: string;
  },
  comments: {
    content: string;
    author: {
      id: string;
      name: string;
    },
  }[],
}
