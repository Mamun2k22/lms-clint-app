export type Course = {
  _id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  price: number;
  slug: string;
};

export type Module = {
  _id: string;
  courseId: string;
  title: string;
  moduleNo: number;
};

export type Lecture = {
  _id: string;
  moduleId: string;
  title: string;
  videoUrl: string;
  pdfs: { name: string; url: string; _id?: string }[];
  order: number;
};
