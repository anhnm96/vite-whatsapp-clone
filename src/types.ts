export interface Room {
  id: string
  name: string
  timestamp: Timestamp
  messages?: Message[]
  photoURL?: string
}

export interface User {
  id: string
  userID?: string
  name: string
  email: string
  photoURL: string
  timestamp: Date
  chats?: Room[]
}

interface Timestamp {
  nanoseconds: number
  seconds: number
}

export interface Message {
  id: string
  message: string
  name: string
  time: string
  timestamp: Timestamp
  uid: string
  imageUrl?: string
  imageName?: string
  audioUrl?: string
  audioName?: string
}
