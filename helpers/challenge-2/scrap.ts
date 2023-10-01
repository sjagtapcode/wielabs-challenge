import { IWebsiteData, ILaunchSummary } from '../../challenge-2/constants';
import { crawler, jobsCrawler, launchCrawler } from './crawlers';
import { getKeyFromUrl, store } from './domScrap';

export const webScrap = async (
  websiteUrls: string[],
): Promise<IWebsiteData[]> => {
  await crawler.run(websiteUrls);
  await jobsCrawler.run([]);
  await launchCrawler.run([]);
  return await Promise.all(
    websiteUrls?.map(async (websiteUrl) => {
      const key = getKeyFromUrl(websiteUrl);
      await jobsCrawler.addRequests([websiteUrl + '/jobs']);
      const allData: IWebsiteData | null = await store.getValue(key);
      if (allData?.launches?.length) {
        const launchLinks = allData?.launches?.map(
          ({ link }: ILaunchSummary) => link,
        );
        await launchCrawler.addRequests(launchLinks);
      }
      return (await store.getValue(key)) as IWebsiteData;
    }),
  );
};
