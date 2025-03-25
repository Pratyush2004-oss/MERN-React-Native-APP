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

export interface User {
  email: string;
  username: string;
  profileImage: string;
  createdAt:string
}
