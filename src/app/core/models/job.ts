export interface Job{
  id: number;
  name: string;
  type: string;
  publication_date: string;
  short_name: string;
  model_type: string;
  contents: string; // HTML content
  locations: { name: string }[];
  categories: { name: string }[];
  levels: { name: string; short_name: string }[];
  tags: { name: string; short_name: string }[];
  refs: { landing_page: string };
  company: {
    id: number;
    short_name: string;
    name: string;
  };
}
