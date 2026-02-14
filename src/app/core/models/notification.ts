import {Job} from './job';

export interface Notification {
  id: string;
  job: Job;
  read: boolean;
  timestamp: Date;
}
