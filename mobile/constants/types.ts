export interface Books {
  _id: string;
  title: string;
  caption: string;
  rating: number;
  image: string;
  createdAt: string;
  updatedAt: string;
  user:{
    username: string;
    profileImage: string;
  }
}
