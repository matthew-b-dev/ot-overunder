import { DATA } from './data/data';

export type CommunityOT = {
  title: string;
  threads: { title: string; comments: number; views: number }[];
  comments: number;
  views: number;
};

export const ellipsis = (str: string) => {
  if (str.length > 10) {
    return `${str.substring(0, 30)}...`;
  } else {
    return str;
  }
};

export const popRandom = (threads: CommunityOT[], high: boolean = false) => {
  if (threads.length === 0) return DATA[0];
  let removedElement;
  if (high) {
    /* Select a random thread from the top 100 commented threads */
    const sorted = threads.sort((a, b) => b.comments - a.comments);
    removedElement = sorted.splice(Math.floor(Math.random() * 100), 1)[0];
  } else {
    /* Select a random thread from all threads */
    removedElement = threads.splice(
      Math.floor(Math.random() * threads.length),
      1
    )[0];
  }

  return removedElement;
};
