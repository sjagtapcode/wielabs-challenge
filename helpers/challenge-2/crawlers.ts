import { JSDOMCrawler } from 'crawlee';
import { ILaunch, IWebsiteData, IJob } from '../../challenge-2/constants';
import {
  store,
  getDataFromCard,
  getLinksfromCard,
  getFoundersList,
  getLaunchesList,
  getKeyFromUrl,
} from './domScrap';

export const launchCrawler = new JSDOMCrawler({
  async requestHandler({ window, request }) {
    const { document } = window;
    const launchData: ILaunch = {
      link: request?.url,
      name: '',
      tagline: '',
      creator: '',
      company: '',
      createdAt: '',
      rowHashtags: [],
    };
    launchData.name = document.querySelector('h1')?.textContent || '';
    launchData.tagline = document.querySelector('.tagline')?.textContent || '';
    launchData.creator =
      document.querySelector('.user-image.background-image')?.nextElementSibling
        ?.textContent || '';
    const companyNode = document.querySelector('.post-company-link');
    launchData.company = companyNode?.textContent || '';
    launchData.createdAt =
      document.querySelector('time')?.getAttribute('datetime') || '';
    launchData.rowHashtags =
      Array.from(document.querySelector('.hashtags')?.childNodes || [])?.map(
        (node) => node.textContent || '',
      ) || [];

    // Store to keyvaluestore
    const companyUrl = companyNode?.getAttribute('href') || '';
    const key = companyUrl?.split('/')?.[2];
    const data: IWebsiteData | null = await store.getValue(key);
    if (!data) {
      await store.setValue(key, {
        launchDetails: [launchData],
      });
      return;
    }
    await store.setValue(key, {
      ...data,
      launchDetails: [...data?.launchDetails, launchData],
    });
  },
});

export const crawler = new JSDOMCrawler({
  async requestHandler({ window, request }) {
    const allData: IWebsiteData = {
      name: '',
      imageUrl: '',
      founded: 0,
      teamSize: 0,
      location: '',
      jobsCount: 0,
      jobs: [],
      founders: [],
      launches: [],
      launchDetails: [],
      links: {
        linkedInUrl: '',
        twitterUrl: '',
      },
    };
    const { document } = window;

    // company info
    const ycdcCard = document.querySelector('.ycdc-card');
    if (ycdcCard) {
      allData.name = ycdcCard.querySelector('.font-bold')?.textContent || '';
      allData.imageUrl =
        ycdcCard.querySelector('img')?.getAttribute('src') || '';
      allData.founded = Number(getDataFromCard(ycdcCard, 'Founded:'));
      allData.teamSize = Number(getDataFromCard(ycdcCard, 'Team Size:'));
      allData.location = getDataFromCard(ycdcCard, 'Location:') || '';
      allData.links = getLinksfromCard(ycdcCard);
    }

    // jobs count
    const links = Array.from(document?.querySelectorAll('a'));
    const jobsElement = links?.find((link) => link.textContent === 'Jobs');
    allData.jobsCount = Number(jobsElement?.nextSibling?.textContent || '');

    // founders
    allData.founders = getFoundersList(document);

    // launches
    const baseUrl = window.location.origin;
    allData.launches = getLaunchesList(document, baseUrl);

    // Store to keyvaluestore
    const key = getKeyFromUrl(request?.url);
    await store.setValue(key, allData);
  },
});

export const jobsCrawler = new JSDOMCrawler({
  async requestHandler({ window, request }) {
    const { document } = window;
    const jobsElements = Array.from(
      document.querySelectorAll('.ycdc-with-link-color'),
    );
    const jobs = jobsElements?.map((job) => {
      const jd: IJob = {
        link: '',
        role: '',
        location: '',
        salary: '',
        hike: '',
        experience: '',
      };
      const jobLink = job.querySelector('a');
      jd.link = jobLink?.getAttribute('href') || '';
      jd.role = jobLink?.textContent || '';
      const jobDetails = job.nextElementSibling;
      if (jobDetails) {
        const [location, salary, hike, experience] = Array.from(
          jobDetails?.childNodes,
        )?.map((node) => node.textContent);
        jd.location = location || '';
        jd.salary = salary || '';
        jd.hike = hike || '';
        jd.experience = experience || '';
      }
      return jd;
    });

    // Store to keyvaluestore
    const key = getKeyFromUrl(request?.url, 2);
    const data: IWebsiteData | null = await store.getValue(key);
    if (!data) {
      await store.setValue(key, {
        jobs,
      });
      return;
    }
    await store.setValue(key, {
      ...data,
      jobs,
    });
  },
});
