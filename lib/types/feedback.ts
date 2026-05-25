import { IMedia } from "./media";

export interface IFeedback {
  id: number;
  tour: number;
  comment: string;
  consumer_name: string;
  consumer_image: string;
  feedback_date: string;

  media: IMedia[];
}
