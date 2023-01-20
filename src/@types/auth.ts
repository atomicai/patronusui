import { User } from 'firebase/auth'

export interface SuperUser extends User {
  bookLover: boolean
}
