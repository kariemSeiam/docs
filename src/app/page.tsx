'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { ThemeToggle } from '@/components/theme-toggle'
import { extractVideoId, extractPlaylistId, extractChannelId, formatDuration, formatDate, formatNumber } from '@/lib/utils'
import { extractVideoTranscript, extractPlaylistInfo, extractChannelInfo } from '@/lib/youtube-ultimate-extractor'
import { VideoInfo, TranscriptSegment, PlaylistInfo, ChannelInfo, ContentType } from '@/types'
import { demoVideoData, demoPlaylistData, demoChannelData, demoLinks } from '@/lib/demo-data'
import { 
  Download, 
  Copy, 
  Search, 
  Play, 
  Clock, 
  Eye, 
  Calendar, 
  User, 
  List, 
  Hash, 
  CheckCircle, 
  Loader2,
  Youtube,
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react'

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
  const [showDemo, setShowDemo] = useState(false)
  
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

  const handleDemo = (type: 'video' | 'playlist' | 'channel') => {
    setLoading(false)
    setExtractionStatus('')
    setShowDemo(true)
    
    // Reset all states first
    setVideoInfo(null)
    setTranscript([])
    setPlaylistInfo(null)
    setChannelInfo(null)
    setContentType(null)
    
    // Set demo data based on type
    if (type === 'video') {
      setContentType('video')
      setVideoInfo(demoVideoData.videoInfo)
      setTranscript(demoVideoData.transcript)
      setUrl(demoLinks.video)
    } else if (type === 'playlist') {
      setContentType('playlist')
      setPlaylistInfo(demoPlaylistData)
      setUrl(demoLinks.playlist)
    } else if (type === 'channel') {
      setContentType('channel')
      setChannelInfo(demoChannelData)
      setUrl(demoLinks.channel)
    }
    
    toast({
      title: "Demo Loaded",
      description: `Showing ${type} demo data`,
    })
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950 transition-all duration-500">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <Youtube className="h-8 w-8 text-red-500" />
                <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Transcript Extractor
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Extract • Analyze • Download
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ThemeToggle />
            </motion.div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Extract YouTube Transcripts
            <span className="block text-2xl md:text-3xl text-blue-600 dark:text-blue-400 mt-2">
              Videos • Playlists • Channels
            </span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Advanced AI-powered extraction with intelligent fallbacks and beautiful, responsive design
          </p>
        </motion.div>

        {/* Demo Showcase */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                Try Demo Examples
              </CardTitle>
              <CardDescription>
                See the tool in action with sample content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  onClick={() => handleDemo('video')}
                  className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-950 border-blue-200 dark:border-blue-800 transition-all duration-300"
                >
                  <Play className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <div className="text-center">
                    <div className="font-medium">Video Demo</div>
                    <div className="text-xs text-slate-500">Web Development Tutorial</div>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleDemo('playlist')}
                  className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-green-50 dark:hover:bg-green-950 border-green-200 dark:border-green-800 transition-all duration-300"
                >
                  <List className="h-6 w-6 text-green-600 dark:text-green-400" />
                  <div className="text-center">
                    <div className="font-medium">Playlist Demo</div>
                    <div className="text-xs text-slate-500">JavaScript Course</div>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleDemo('channel')}
                  className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-purple-50 dark:hover:bg-purple-950 border-purple-200 dark:border-purple-800 transition-all duration-300"
                >
                  <User className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  <div className="text-center">
                    <div className="font-medium">Channel Demo</div>
                    <div className="text-xs text-slate-500">TechCraft Studios</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Input Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Youtube className="h-5 w-5 text-red-500" />
                Enter YouTube URL
              </CardTitle>
              <CardDescription>
                Paste any YouTube video, playlist, or channel URL
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="pr-12 h-12 text-base border-2 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300"
                    disabled={loading}
                    onKeyDown={(e) => e.key === 'Enter' && !loading && handleExtract()}
                  />
                  {url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setUrl('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900"
                    >
                      ×
                    </Button>
                  )}
                </div>
                <Button 
                  onClick={handleExtract} 
                  disabled={loading || !url.trim()}
                  className="h-12 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Extracting
                    </>
                  ) : (
                    <>
                      Extract
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
              
              {loading && extractionStatus && (
                <motion.div 
                  className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 text-blue-700 dark:text-blue-300">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="font-medium">{extractionStatus}</span>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Loading Skeleton */}
        {loading && (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="w-32 h-24 rounded-lg" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <Skeleton className="h-8 w-48 mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Results */}
        <AnimatePresence mode="wait">
          {!loading && (contentType === 'video' && videoInfo) && (
            <motion.div
              key="video-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Video Info Card */}
              <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-80 relative">
                      <img
                        src={videoInfo.thumbnail}
                        alt={videoInfo.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <Badge className="bg-black/70 text-white border-0">
                          {formatDuration(videoInfo.duration)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex-1 p-6">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 line-clamp-2">
                        {videoInfo.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-4 flex-wrap">
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {videoInfo.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {formatNumber(videoInfo.viewCount)} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(videoInfo.uploadDate)}
                        </span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Button variant="outline" size="sm" onClick={handleCopyTranscript}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleDownloadTranscript}>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a href={`https://youtube.com/watch?v=${videoInfo.videoId}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Watch
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Transcript Card */}
              <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
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
                        {showDemo ? 'Demo transcript content' : 'AI-powered transcript extraction'}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Search */}
                  <div className="mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <Input
                        placeholder="Search transcript..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 border-2 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300"
                      />
                    </div>
                  </div>
                  
                                     {/* Transcript Content */}
                   <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                    <AnimatePresence>
                      {filteredTranscript.map((segment, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="flex gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300 group"
                        >
                          <Badge variant="outline" className="shrink-0 font-mono text-xs group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30">
                            {formatDuration(segment.start)}
                          </Badge>
                          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                            {segment.text}
                          </p>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {filteredTranscript.length === 0 && searchQuery && (
                    <motion.div 
                      className="text-center py-12 text-slate-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">No results found</p>
                      <p className="text-sm">Try different search terms</p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Playlist Results */}
          {!loading && (contentType === 'playlist' && playlistInfo) && (
            <motion.div
              key="playlist-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <List className="h-5 w-5 text-green-600 dark:text-green-400" />
                    {playlistInfo.title}
                    <Badge variant="secondary" className="ml-2">
                      {playlistInfo.videoCount} videos
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    By {playlistInfo.author} • {showDemo ? 'Demo playlist content' : 'Live playlist data'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {playlistInfo.videos.map((video, index) => (
                      <motion.div
                        key={video.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300 group cursor-pointer"
                        onClick={() => setUrl(`https://www.youtube.com/watch?v=${video.videoId}`)}
                      >
                        <div className="relative">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-24 h-16 object-cover rounded group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300 rounded" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium line-clamp-2 text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                            {video.title}
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1 mt-1">
                            {video.author}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDuration(video.duration)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {formatNumber(video.viewCount)}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-blue-500 transition-colors duration-300" />
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Channel Results */}
          {!loading && (contentType === 'channel' && channelInfo) && (
            <motion.div
              key="channel-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <img
                      src={channelInfo.thumbnail}
                      alt={channelInfo.name}
                      className="w-20 h-20 rounded-full border-4 border-white dark:border-slate-700 shadow-lg"
                    />
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        {channelInfo.name}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {formatNumber(channelInfo.subscriberCount)} subscribers • {showDemo ? 'Demo channel content' : 'Live channel data'}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                    {channelInfo.description}
                  </p>
                  
                  {channelInfo.videos.length > 0 ? (
                    <div className="grid gap-4">
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Play className="h-4 w-4" />
                        Recent Videos
                      </h4>
                      {channelInfo.videos.map((video, index) => (
                        <motion.div
                          key={video.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300 group cursor-pointer"
                          onClick={() => setUrl(`https://www.youtube.com/watch?v=${video.videoId}`)}
                        >
                          <div className="relative">
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="w-24 h-16 object-cover rounded group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300 rounded" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium line-clamp-2 text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                              {video.title}
                            </h5>
                            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDuration(video.duration)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {formatNumber(video.viewCount)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(video.uploadDate)}
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-purple-500 transition-colors duration-300" />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">Channel Loaded</p>
                      <p className="text-sm">Video extraction available soon</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}