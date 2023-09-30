
export const zipUrl = 'https://wielabs-task.s3.ap-south-1.amazonaws.com/dump.tar.gz';
export const tempDirPath = './tmp';
export const tempFileName = 'dump.tar.gz';
export const tempFilePath = `${tempDirPath}/${tempFileName}`;
export const extractedDir = './tmp';
export const organizationsCsvFilePath = './tmp/dump/organizations.csv';
export const customersCsvFilePath = './tmp/dump/customers.csv';
export enum TABLES {
  CUSTOMERS = 'customers',
  ORGANIZATIONS = 'organizations',
}
export const BATCH_SIZE = 100;
export interface ICustomer {
  Index: number
  'Customer Id' : string
  'First Name': string
  'Last Name': string
  Company: string
  City: string
  'Phone 1': string
  'Phone 2': string
  Email: string
  'Subscription Date': Date
  Website: string
}
export interface IOrganization {
  Index: number
  'Organization Id': string
  Name: string
  Website: string
  Country: string
  Description: string
  Founded: number
  Industry: string
  'Number of employees': number
}
export type IRowData<T extends TABLES> = T extends TABLES.CUSTOMERS ? ICustomer : T extends TABLES.ORGANIZATIONS ? IOrganization : never;

