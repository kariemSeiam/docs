'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Youtube, 
  Download, 
  Copy, 
  Search, 
  Clock,
  Eye,
  ListVideo,
  Video,
  Users,
  Loader2,
  CheckCircle,
  FileText,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { extractVideoTranscript, extractPlaylistInfo } from '@/lib/youtube-master-extractor'
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
  const [loadingMessage, setLoadingMessage] = useState('')
  const [contentType, setContentType] = useState<ContentType>('video')
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)
  const [playlistInfo, setPlaylistInfo] = useState<PlaylistInfo | null>(null)
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([])
  const [selectedVideos, setSelectedVideos] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  
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
        title: 'URL Required',
        description: 'Please enter a YouTube URL',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    setLoadingMessage('Processing...')
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

        setLoadingMessage('Extracting video data...')
        const data = await extractVideoTranscript(videoId)
        setVideoInfo(data.videoInfo)
        setTranscript(data.transcript)
        
        toast({
          title: 'Success',
          description: `Extracted ${data.transcript.length} transcript segments`
        })
      } else if (contentType === 'playlist') {
        const playlistId = extractPlaylistId(url)
        if (!playlistId) {
          throw new Error('Invalid YouTube playlist URL')
        }

        setLoadingMessage('Loading playlist...')
        const data = await extractPlaylistInfo(playlistId)
        setPlaylistInfo(data)
        setSelectedVideos(new Set(data.videos.map((v: PlaylistVideo) => v.id)))
        
        toast({
          title: 'Playlist Loaded',
          description: `Found ${data.videos.length} videos`
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to process URL',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
      setLoadingMessage('')
    }
  }

  const handleDownloadTranscript = useCallback(() => {
    if (!transcript.length) return

    const content = transcript.map(seg => `${formatDuration(Math.floor(seg.start))}: ${seg.text}`).join('\n\n')
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${videoInfo?.title || 'transcript'}.txt`
    a.click()
    URL.revokeObjectURL(url)
    
    toast({
      title: 'Downloaded',
      description: 'Transcript saved to your device'
    })
  }, [transcript, videoInfo, toast])

  const handleCopyTranscript = useCallback(() => {
    if (!transcript.length) return

    const content = transcript.map(seg => seg.text).join(' ')
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Youtube className="w-8 h-8 text-red-500" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              YouTube Transcript
            </h1>
          </div>
          <p className="text-muted-foreground text-sm md:text-base">
            Extract transcripts from videos and playlists
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Input
                    value={url}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="Paste YouTube URL here..."
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
                  className="w-full sm:w-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {loadingMessage}
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
          <div className="space-y-4 mb-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/3" />
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

        {/* Video Results */}
        {videoInfo && transcript.length > 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Video Info */}
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <img 
                    src={videoInfo.thumbnail} 
                    alt={videoInfo.title}
                    className="w-full md:w-48 h-32 md:h-28 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-lg mb-2 line-clamp-2">{videoInfo.title}</h2>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {videoInfo.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDuration(videoInfo.duration)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {formatNumber(videoInfo.viewCount)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyTranscript}
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadTranscript}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a 
                          href={`https://youtube.com/watch?v=${videoInfo.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Watch
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transcript */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg">Transcript</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {filteredTranscript.length} segments
                    </p>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search transcript..."
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto space-y-3">
                  <AnimatePresence>
                    {filteredTranscript.map((segment, index) => (
                      <motion.div
                        key={`${segment.start}-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.02 }}
                        className="flex gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <span className="text-xs font-mono text-muted-foreground whitespace-nowrap mt-0.5 min-w-[3rem]">
                          {formatDuration(Math.floor(segment.start))}
                        </span>
                        <p className="flex-1 text-sm leading-relaxed">
                          {segment.text}
                        </p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Playlist Results */}
        {playlistInfo && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Playlist Info */}
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <img 
                    src={playlistInfo.thumbnail} 
                    alt={playlistInfo.title}
                    className="w-full md:w-48 h-32 md:h-28 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h2 className="font-semibold text-lg mb-2">{playlistInfo.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {playlistInfo.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <ListVideo className="w-3 h-3" />
                        {playlistInfo.videoCount} videos
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
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
                        Clear
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Videos List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Videos</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {selectedVideos.size} of {playlistInfo.videos.length} selected
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {playlistInfo.videos.map((video) => (
                    <div
                      key={video.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
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
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img 
                            src={video.thumbnail} 
                            alt={video.title}
                            className="w-20 h-12 object-cover rounded"
                          />
                          {selectedVideos.has(video.id) && (
                            <div className="absolute inset-0 bg-primary/20 rounded flex items-center justify-center">
                              <CheckCircle className="w-5 h-5 text-primary" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-1">{video.title}</h4>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <span>#{video.index}</span>
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
                      onClick={() => {
                        toast({
                          title: 'Coming Soon',
                          description: 'Bulk extraction will be available soon'
                        })
                      }}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Extract {selectedVideos.size} Transcripts
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