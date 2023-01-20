import { User } from 'firebase/auth'

export interface SuperUser extends User {
  profileImage: string
  searchHistory: string[]
}

export type FirestoreUser = {
  profileImage: string
  searchHistory: string[]
}
