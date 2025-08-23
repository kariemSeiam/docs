'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { extractVideoId, extractPlaylistId, extractChannelId, formatDuration, formatDate, formatNumber } from '@/lib/utils'
import { extractVideoTranscript, extractPlaylistInfo, extractChannelInfo } from '@/lib/youtube-ultimate-extractor'
import { VideoInfo, TranscriptSegment, PlaylistInfo, ChannelInfo, ContentType } from '@/types'
import { Download, Copy, Search, Play, Clock, Eye, Calendar, User, List, Hash, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function Home() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [contentType, setContentType] = useState<ContentType | null>(null)
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([])
  const [playlistInfo, setPlaylistInfo] = useState<PlaylistInfo | null>(null)
  const [channelInfo, setChannelInfo] = useState<ChannelInfo | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [extractionStatus, setExtractionStatus] = useState<string>('')
  
  const { toast } = useToast()

  const handleExtract = async () => {
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a YouTube URL",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setExtractionStatus('Initializing extraction...')
    
    try {
      // Reset previous results
      setVideoInfo(null)
      setTranscript([])
      setPlaylistInfo(null)
      setChannelInfo(null)
      setContentType(null)

      // Determine content type and extract ID
      const videoId = extractVideoId(url)
      const playlistId = extractPlaylistId(url)
      const channelId = extractChannelId(url)

      if (videoId) {
        setContentType('video')
        setExtractionStatus('Connecting to YouTube APIs...')
        
        const { videoInfo: info, transcript: segments } = await extractVideoTranscript(videoId)
        
        setExtractionStatus('Processing video data...')
        setVideoInfo(info)
        setTranscript(segments)
        
        toast({
          title: "Success!",
          description: `Extracted transcript with ${segments.length} segments`,
        })
      } else if (playlistId) {
        setContentType('playlist')
        setExtractionStatus('Fetching playlist information...')
        
        const playlist = await extractPlaylistInfo(playlistId)
        setPlaylistInfo(playlist)
        
        toast({
          title: "Success!",
          description: `Found playlist with ${playlist.videos.length} videos`,
        })
      } else if (channelId) {
        setContentType('channel')
        setExtractionStatus('Loading channel data...')
        
        const channel = await extractChannelInfo(channelId)
        setChannelInfo(channel)
        
        toast({
          title: "Success!",
          description: `Loaded channel information`,
        })
      } else {
        throw new Error('Invalid YouTube URL. Please check the URL and try again.')
      }

    } catch (error) {
      console.error('Extraction error:', error)
      toast({
        title: "Extraction Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setExtractionStatus('')
    }
  }

  const handleCopyTranscript = () => {
    if (transcript.length === 0) return
    
    const text = transcript.map(segment => segment.text).join(' ')
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Transcript copied to clipboard",
    })
  }

  const handleDownloadTranscript = () => {
    if (transcript.length === 0) return
    
    const content = transcript.map(segment => 
      `[${formatDuration(segment.start)}] ${segment.text}`
    ).join('\n\n')
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${videoInfo?.title || 'transcript'}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast({
      title: "Downloaded!",
      description: "Transcript saved to your device",
    })
  }

  const filteredTranscript = transcript.filter(segment =>
    segment.text.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            YouTube Transcript Extractor
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Extract transcripts from videos, playlists, and channels with advanced AI-powered processing
          </p>
        </div>

        {/* Input Section */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Enter YouTube URL
            </CardTitle>
            <CardDescription>
              Paste a video, playlist, or channel URL to extract transcripts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
                disabled={loading}
              />
              <Button 
                onClick={handleExtract} 
                disabled={loading}
                className="min-w-[120px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Extracting
                  </>
                ) : (
                  'Extract'
                )}
              </Button>
            </div>
            
            {loading && extractionStatus && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm font-medium">{extractionStatus}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
          </div>
        )}

        {/* Video Results */}
        {contentType === 'video' && videoInfo && (
          <div className="space-y-6">
            {/* Video Info Card */}
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <img
                    src={videoInfo.thumbnail}
                    alt={videoInfo.title}
                    className="w-32 h-24 object-cover rounded-lg shadow-md"
                  />
                  <div className="flex-1 min-w-0">
                    <CardTitle className="line-clamp-2 mb-2">{videoInfo.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4 flex-wrap">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {videoInfo.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDuration(videoInfo.duration)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {formatNumber(videoInfo.viewCount)} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(videoInfo.uploadDate)}
                      </span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Transcript Section */}
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Hash className="h-5 w-5" />
                      Transcript
                      <Badge variant="secondary" className="ml-2">
                        {transcript.length} segments
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      AI-powered transcript extraction with intelligent fallbacks
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopyTranscript}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownloadTranscript}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Search */}
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      placeholder="Search transcript..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Transcript Content */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredTranscript.map((segment, index) => (
                    <div
                      key={index}
                      className="flex gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Badge variant="outline" className="shrink-0 font-mono text-xs">
                        {formatDuration(segment.start)}
                      </Badge>
                      <p className="text-sm leading-relaxed">{segment.text}</p>
                    </div>
                  ))}
                </div>

                {filteredTranscript.length === 0 && searchQuery && (
                  <div className="text-center py-8 text-slate-500">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                         <p>No results found for &quot;{searchQuery}&quot;</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Playlist Results */}
        {contentType === 'playlist' && playlistInfo && (
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5" />
                {playlistInfo.title}
                <Badge variant="secondary" className="ml-2">
                  {playlistInfo.videoCount} videos
                </Badge>
              </CardTitle>
              <CardDescription>
                By {playlistInfo.author}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {playlistInfo.videos.map((video) => (
                  <div
                    key={video.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-20 h-15 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium line-clamp-1">{video.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
                        {video.author}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        <span>{formatDuration(video.duration)}</span>
                        <span>•</span>
                        <span>{formatNumber(video.viewCount)} views</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Channel Results */}
        {contentType === 'channel' && channelInfo && (
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {channelInfo.name}
              </CardTitle>
              <CardDescription>
                {formatNumber(channelInfo.subscriberCount)} subscribers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                {channelInfo.description}
              </p>
              <div className="text-center py-8 text-slate-500">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Channel information loaded successfully</p>
                <p className="text-xs mt-1">Video extraction coming soon</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}