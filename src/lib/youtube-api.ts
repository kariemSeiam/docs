// Client-side YouTube API functions
// Note: For production, consider using a proxy server to hide API calls

export async function fetchVideoTranscript(videoId: string) {
  // For GitHub Pages deployment, we'll use a CORS proxy
  // In production, you should use your own backend
  const corsProxy = 'https://cors-anywhere.herokuapp.com/'
  
  try {
    // This is a simplified version - in production you'd want to use a proper backend
    const response = await fetch(`${corsProxy}https://www.youtube.com/watch?v=${videoId}`)
    const html = await response.text()
    
    // Extract basic video info from the page
    const titleMatch = html.match(/<title>(.*?)<\/title>/)
    const title = titleMatch ? titleMatch[1].replace(' - YouTube', '') : 'Unknown Title'
    
    // Return mock data for demo purposes
    // In production, you'd parse the actual transcript from the page
    return {
      videoInfo: {
        id: videoId,
        title: title,
        author: 'YouTube Channel',
        thumbnail: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
        duration: 300,
        uploadDate: new Date().toISOString(),
        viewCount: 1000000,
        description: 'Video description'
      },
      transcript: [
        { text: 'This is a demo transcript segment.', start: 0, duration: 5 },
        { text: 'In a real implementation, this would contain the actual video transcript.', start: 5, duration: 5 },
        { text: 'YouTube transcripts can be extracted using various methods.', start: 10, duration: 5 },
        { text: 'For production use, consider implementing a proper backend service.', start: 15, duration: 5 },
      ]
    }
  } catch (error) {
    console.error('Error fetching video transcript:', error)
    throw new Error('Failed to fetch video transcript')
  }
}

export async function fetchPlaylistInfo(playlistId: string) {
  // Return mock data for demo purposes
  return {
    id: playlistId,
    title: 'Demo Playlist',
    author: 'YouTube Channel',
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    videoCount: 5,
    description: 'This is a demo playlist',
    videos: [
      {
        id: 'dQw4w9WgXcQ',
        title: 'Demo Video 1',
        author: 'Channel 1',
        thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg',
        duration: 212,
        index: 1
      },
      {
        id: 'jNQXAC9IVRw',
        title: 'Demo Video 2',
        author: 'Channel 2',
        thumbnail: 'https://i.ytimg.com/vi/jNQXAC9IVRw/default.jpg',
        duration: 315,
        index: 2
      },
      {
        id: '9bZkp7q19f0',
        title: 'Demo Video 3',
        author: 'Channel 3',
        thumbnail: 'https://i.ytimg.com/vi/9bZkp7q19f0/default.jpg',
        duration: 256,
        index: 3
      }
    ]
  }
}