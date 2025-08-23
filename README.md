# YouTube Transcript Extractor

A powerful, free web application for extracting transcripts from YouTube videos, playlists, and channels. Built with Next.js 14, TypeScript, and a beautiful UI inspired by modern design principles.

## Features

- **🎥 Video Transcript Extraction**: Extract transcripts from any YouTube video with a single click
- **📋 Playlist Support**: Load entire playlists and select which videos to extract transcripts from
- **📺 Channel Support**: Browse channel videos and extract transcripts (coming soon)
- **🔍 Search & Filter**: Search within transcripts and filter by date ranges
- **💾 Download & Copy**: Export transcripts as text files or copy to clipboard
- **🎨 Beautiful UI**: Modern, responsive design with smooth animations
- **🚀 High Performance**: Optimized for speed with efficient data loading
- **🌓 Dark Mode Ready**: Supports both light and dark themes

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **YouTube APIs**: youtube-transcript, ytdl-core, ytpl

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/youtube-transcript-extractor.git
cd youtube-transcript-extractor
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Extracting Video Transcripts

1. Copy any YouTube video URL
2. Paste it in the input field
3. Click "Extract" or press Enter
4. View, search, copy, or download the transcript

### Working with Playlists

1. Copy a YouTube playlist URL
2. Paste it in the input field
3. Select the videos you want to extract transcripts from
4. Click "Extract Transcripts" for bulk processing

### Search and Filter

- Use the search bar to find specific content within transcripts
- Filter videos by upload date (coming soon)
- Sort by views, duration, or date

## API Routes

- `POST /api/youtube/transcript` - Extract transcript from a video
- `POST /api/youtube/playlist` - Get playlist information
- `POST /api/youtube/channel` - Get channel information (in development)

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Main page
├── components/         # React components
│   └── ui/            # Reusable UI components
├── lib/               # Utility functions
├── types/             # TypeScript types
└── styles/            # Global styles
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Built with inspiration from Mintlify's documentation design
- Uses various open-source libraries and tools
- YouTube transcript extraction powered by community packages

---

Made with ❤️ for the YouTube community