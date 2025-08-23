'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Youtube, 
  Download, 
  Copy, 
  Search, 
  Filter,
  Calendar,
  Clock,
  Eye,
  ListVideo,
  Video,
  Users,
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckCircle,
  AlertCircle,
  FileText,
  PlayCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import { 
  extractVideoId, 
  extractPlaylistId, 
  extractChannelId,
  formatDuration,
  formatDate,
  formatNumber 
} from '@/lib/utils'
import { fetchVideoTranscript, fetchPlaylistInfo } from '@/lib/youtube-api'
import type { 
  TranscriptSegment, 
  VideoInfo, 
  PlaylistInfo, 
  ContentType,
  PlaylistVideo
} from '@/types'

export default function Home() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [contentType, setContentType] = useState<ContentType>('video')
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)
  const [playlistInfo, setPlaylistInfo] = useState<PlaylistInfo | null>(null)
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([])
  const [selectedVideos, setSelectedVideos] = useState<Set<string>>(new Set())
  const [expandedTranscripts, setExpandedTranscripts] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState<{ from?: Date; to?: Date }>({})
  
  const { toast } = useToast()

  const detectContentType = useCallback((inputUrl: string): ContentType => {
    if (extractPlaylistId(inputUrl)) return 'playlist'
    if (extractChannelId(inputUrl)) return 'channel'
    return 'video'
  }, [])

  const handleUrlChange = useCallback((value: string) => {
    setUrl(value)
    const type = detectContentType(value)
    setContentType(type)
  }, [detectContentType])



  const handleSubmit = async () => {
    if (!url.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a YouTube URL',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    setVideoInfo(null)
    setPlaylistInfo(null)
    setTranscript([])
    setSelectedVideos(new Set())

    try {
      if (contentType === 'video') {
        const videoId = extractVideoId(url)
        if (!videoId) {
          throw new Error('Invalid YouTube video URL')
        }

        const data = await fetchVideoTranscript(videoId)
        setVideoInfo(data.videoInfo)
        setTranscript(data.transcript)
        
        toast({
          title: 'Success',
          description: 'Transcript loaded successfully'
        })
      } else if (contentType === 'playlist') {
        const playlistId = extractPlaylistId(url)
        if (!playlistId) {
          throw new Error('Invalid YouTube playlist URL')
        }

        const data = await fetchPlaylistInfo(playlistId)
        setPlaylistInfo(data)
        
        // Auto-select all videos
        setSelectedVideos(new Set(data.videos.map((v: PlaylistVideo) => v.id)))
        
        toast({
          title: 'Success',
          description: `Loaded ${data.videos.length} videos from playlist`
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load content',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadTranscript = useCallback(() => {
    if (!transcript.length) return

    const content = transcript.map(seg => seg.text).join('\n\n')
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${videoInfo?.title || 'transcript'}.txt`
    a.click()
    URL.revokeObjectURL(url)
    
    toast({
      title: 'Downloaded',
      description: 'Transcript downloaded successfully'
    })
  }, [transcript, videoInfo, toast])

  const handleCopyTranscript = useCallback(() => {
    if (!transcript.length) return

    const content = transcript.map(seg => seg.text).join('\n\n')
    navigator.clipboard.writeText(content)
    
    toast({
      title: 'Copied',
      description: 'Transcript copied to clipboard'
    })
  }, [transcript, toast])

  const filteredTranscript = useMemo(() => {
    if (!searchQuery) return transcript
    
    return transcript.filter(seg => 
      seg.text.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [transcript, searchQuery])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Youtube className="w-10 h-10 text-red-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              YouTube Transcript Extractor
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Extract transcripts from videos, playlists, and channels instantly
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Enter YouTube URL</CardTitle>
              <CardDescription>
                Paste a video, playlist, or channel URL to extract transcripts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Input
                    value={url}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="pr-10"
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {contentType === 'video' && <Video className="w-4 h-4 text-muted-foreground" />}
                    {contentType === 'playlist' && <ListVideo className="w-4 h-4 text-muted-foreground" />}
                    {contentType === 'channel' && <Users className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </div>
                <Button 
                  onClick={handleSubmit} 
                  disabled={loading}
                  size="lg"
                  className="min-w-[120px]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Extract
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Video Info and Transcript */}
        {videoInfo && transcript.length > 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Video Info Card */}
            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <img 
                    src={videoInfo.thumbnail} 
                    alt={videoInfo.title}
                    className="w-40 h-24 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <CardTitle className="mb-2">{videoInfo.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {videoInfo.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDuration(videoInfo.duration)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {formatNumber(videoInfo.viewCount)} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(videoInfo.uploadDate)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyTranscript}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadTranscript}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Transcript Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Transcript</CardTitle>
                    <CardDescription>
                      {filteredTranscript.length} segments found
                    </CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search transcript..."
                      className="pl-10 w-[300px]"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="max-h-[600px] overflow-y-auto space-y-4 pr-4">
                  <AnimatePresence>
                    {filteredTranscript.map((segment, index) => (
                      <motion.div
                        key={`${segment.start}-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.01 }}
                        className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <span className="text-sm font-mono text-muted-foreground whitespace-nowrap">
                            {formatDuration(Math.floor(segment.start))}
                          </span>
                          <p className="flex-1 text-sm leading-relaxed">
                            {segment.text}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Playlist Info */}
        {playlistInfo && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Playlist Info Card */}
            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <img 
                    src={playlistInfo.thumbnail} 
                    alt={playlistInfo.title}
                    className="w-40 h-24 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <CardTitle className="mb-2">{playlistInfo.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {playlistInfo.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <ListVideo className="w-4 h-4" />
                        {playlistInfo.videoCount} videos
                      </span>
                    </div>
                    {playlistInfo.description && (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {playlistInfo.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-2">
                      {selectedVideos.size} of {playlistInfo.videos.length} selected
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedVideos(new Set(playlistInfo.videos.map(v => v.id)))}
                      >
                        Select All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedVideos(new Set())}
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Videos List */}
            <Card>
              <CardHeader>
                <CardTitle>Videos in Playlist</CardTitle>
                <CardDescription>
                  Select videos to extract transcripts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-4">
                  {playlistInfo.videos.map((video) => (
                    <div
                      key={video.id}
                      className={`p-4 rounded-lg border transition-all cursor-pointer ${
                        selectedVideos.has(video.id) 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => {
                        const newSelected = new Set(selectedVideos)
                        if (newSelected.has(video.id)) {
                          newSelected.delete(video.id)
                        } else {
                          newSelected.add(video.id)
                        }
                        setSelectedVideos(newSelected)
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img 
                            src={video.thumbnail} 
                            alt={video.title}
                            className="w-24 h-16 object-cover rounded"
                          />
                          {selectedVideos.has(video.id) && (
                            <div className="absolute inset-0 bg-primary/20 rounded flex items-center justify-center">
                              <CheckCircle className="w-8 h-8 text-primary" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium line-clamp-1">{video.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span>#{video.index}</span>
                            <span>{video.author}</span>
                            <span>{formatDuration(video.duration)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {selectedVideos.size > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <Button 
                      className="w-full"
                      onClick={async () => {
                        // Here you would implement bulk transcript extraction
                        toast({
                          title: 'Feature Coming Soon',
                          description: 'Bulk transcript extraction will be available soon',
                        })
                      }}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Extract Transcripts for {selectedVideos.size} Videos
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}