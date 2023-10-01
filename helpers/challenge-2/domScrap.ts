import { KeyValueStore } from 'crawlee';

// Open a named key-value store
export const store = await KeyValueStore.open('ycombinator');

export const getKeyFromUrl = (url: string, position = 1) => {
  const urlParts = url?.split('/');
  return urlParts?.[urlParts?.length - position];
};

export const getDataFromCard = (card: Element, tag: string) => {
  const elements = Array.from(card?.querySelectorAll('span'))?.filter(
    (ele) => ele?.textContent?.includes(tag),
  );
  if (elements?.length > 0) {
    return elements?.[0]?.nextSibling?.textContent;
  }
  return undefined;
};

export const getLinksfromCard = (
  card: Element,
): {
  linkedInUrl: string;
  twitterUrl: string;
} => {
  const linkedInUrl =
    card?.querySelector('a[title="LinkedIn profile"]')?.getAttribute('href') ||
    '';
  const twitterUrl =
    card?.querySelector('a[title="Twitter account"]')?.getAttribute('href') ||
    '';
  return {
    linkedInUrl,
    twitterUrl,
  };
};

export const getFoundersList = (document: Document) => {
  const h3Headers = Array.from(document.querySelectorAll('h3'));
  const foundersHeader = h3Headers?.find(
    (header) => header.textContent === 'Active Founders',
  );
  const foundersListNodes = Array.from(
    foundersHeader?.parentElement?.nextSibling?.childNodes || [],
  );
  const founderList = foundersListNodes?.map((founder) => {
    const founderDetails = founder?.childNodes;
    const founderLeft = founderDetails?.[0]?.childNodes;
    const name = founderLeft?.[0]?.textContent || '';
    const description = founderLeft?.[1]?.textContent || '';
    const founderCard = founderDetails?.[1]?.childNodes?.[0]?.childNodes;
    const imageUrl =
      document.querySelector(`img[alt="${name}"]`)?.getAttribute('src') || '';
    const socialUrlNodes = Array.from(
      founderCard?.[1]?.childNodes?.[2]?.childNodes,
    );
    const links = {
      linkedInUrl: '',
      twitterUrl: '',
    };
    socialUrlNodes?.find((node) => {
      const href = (node as Element)?.getAttribute('href');
      if (href?.startsWith('https://twitter.com')) {
        links.twitterUrl = href;
      } else if (href?.startsWith('https://linkedin.com')) {
        links.linkedInUrl = href;
      }
    });
    return {
      name,
      description,
      imageUrl,
      links,
    };
  });
  return founderList;
};

export const getLaunchesList = (document: Document, baseUrl: string) => {
  const launchesList = Array.from(document.querySelectorAll('.company-launch'));
  return launchesList?.map((launch) => {
    const link = launch.querySelector('a')?.getAttribute('href') || '';
    return {
      name: launch?.querySelector('h3')?.textContent || '',
      tagline: launch?.childNodes?.[1]?.textContent || '',
      link: baseUrl + link,
    };
  });
};
