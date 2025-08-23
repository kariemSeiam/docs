export interface TranscriptSegment {
  text: string
  start: number
  duration: number
}

export interface VideoInfo {
  id: string
  title: string
  author: string
  thumbnail: string
  duration: number
  uploadDate: string
  viewCount: number
  description?: string
}

export interface PlaylistVideo {
  id: string
  title: string
  author: string
  thumbnail: string
  duration: number
  index: number
}

export interface ChannelVideo {
  id: string
  title: string
  thumbnail: string
  duration: number
  uploadDate: string
  viewCount: number
}

export interface ChannelInfo {
  id: string
  name: string
  avatar: string
  subscriberCount: number
  videoCount: number
  description?: string
}

export interface PlaylistInfo {
  id: string
  title: string
  author: string
  thumbnail: string
  videoCount: number
  description?: string
  videos: PlaylistVideo[]
}

export type ContentType = 'video' | 'playlist' | 'channel'

export interface DateFilter {
  from: Date | undefined
  to: Date | undefined
}

export interface FilterOptions {
  dateRange?: DateFilter
  searchQuery?: string
  sortBy?: 'date' | 'views' | 'duration'
  sortOrder?: 'asc' | 'desc'
}