export enum CompaniesCSV {
  name = 'Company Name',
  ycUrl = 'YC URL',
}

export interface ICompanies {
  name: string
  ycUrl: string
}

export interface IJob {
  link: string
  role: string
  location: string
  salary: string
  hike: string
  experience: string
}

export interface ILaunch {
  link: string,
  name: string,
  tagline: string,
  creator: string,
  company: string,
  createdAt: string,
  rowHashtags: string[],
}

export interface ILaunchSummary {
  name: string
  tagline: string
  link: string
}

export interface IWebsiteData {
  name: string
  imageUrl: string
  founded: number
  teamSize: number
  location: string
  jobsCount: number
  jobs: IJob[]
  founders: IFounder[]
  launches: ILaunchSummary[]
  launchDetails: ILaunch[]
  links: {
    linkedInUrl: string
    twitterUrl: string
  }
}

export interface IFounder {
  name: string,
  description: string,
  imageUrl: string,
  links: {
    linkedInUrl: string
    twitterUrl: string
  },
}
