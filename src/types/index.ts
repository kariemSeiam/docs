export interface TranscriptSegment {
  text: string
  start: number
  duration: number
}

export interface VideoInfo {
  id: string
  videoId: string
  title: string
  author: string
  thumbnail: string
  duration: number
  uploadDate: string
  viewCount: number
  description: string
}

export interface PlaylistVideo {
  id: string
  videoId: string
  title: string
  author: string
  thumbnail: string
  duration: number
  uploadDate: string
  viewCount: number
  description: string
  index?: number
}

export interface ChannelVideo {
  id: string
  videoId: string
  title: string
  thumbnail: string
  duration: number
  uploadDate: string
  viewCount: number
  description: string
}

export interface ChannelInfo {
  id: string
  name: string
  thumbnail: string
  subscriberCount: number
  description: string
  videos: ChannelVideo[]
}

export interface PlaylistInfo {
  id: string
  title: string
  author: string
  thumbnail: string
  videoCount: number
  description: string
  videos: VideoInfo[]
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