// Demo data for showcasing the YouTube Transcript Extractor
import { VideoInfo, TranscriptSegment, PlaylistInfo, ChannelInfo } from '@/types'

export const demoVideoData: {
  videoInfo: VideoInfo;
  transcript: TranscriptSegment[];
} = {
  videoInfo: {
    id: 'dQw4w9WgXcQ',
    videoId: 'dQw4w9WgXcQ',
    title: 'The Art of Modern Web Development',
    author: 'TechCraft Studios',
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    duration: 847, // 14:07
    uploadDate: '2024-01-15T10:30:00Z',
    viewCount: 2847392,
    description: 'Explore the latest trends and techniques in modern web development. Learn about React, Next.js, TypeScript, and cutting-edge design patterns that are shaping the future of web applications.'
  },
  transcript: [
    {
      text: "Welcome to this comprehensive guide on modern web development. Today we'll explore the tools and techniques that are revolutionizing how we build web applications.",
      start: 0,
      duration: 6.5
    },
    {
      text: "First, let's talk about React and its ecosystem. React has fundamentally changed how we think about building user interfaces with its component-based architecture.",
      start: 6.5,
      duration: 8.2
    },
    {
      text: "Next.js takes React to the next level by providing server-side rendering, static site generation, and an incredible developer experience out of the box.",
      start: 14.7,
      duration: 7.8
    },
    {
      text: "TypeScript adds type safety to JavaScript, helping us catch errors early and write more maintainable code. It's become essential for large-scale applications.",
      start: 22.5,
      duration: 8.9
    },
    {
      text: "Modern CSS frameworks like Tailwind CSS have transformed how we approach styling, offering utility-first classes that speed up development significantly.",
      start: 31.4,
      duration: 8.1
    },
    {
      text: "Component libraries such as Radix UI and Headless UI provide accessible, unstyled components that we can customize to match our design systems.",
      start: 39.5,
      duration: 8.7
    },
    {
      text: "State management has evolved with tools like Zustand, Jotai, and the built-in React hooks providing simpler alternatives to complex solutions.",
      start: 48.2,
      duration: 7.9
    },
    {
      text: "Performance optimization techniques including code splitting, lazy loading, and image optimization are crucial for creating fast, responsive applications.",
      start: 56.1,
      duration: 8.4
    },
    {
      text: "Testing strategies have matured with tools like Jest, React Testing Library, and Playwright ensuring our applications work reliably across different scenarios.",
      start: 64.5,
      duration: 8.8
    },
    {
      text: "Deployment and hosting have been simplified with platforms like Vercel, Netlify, and GitHub Pages offering seamless integration with modern development workflows.",
      start: 73.3,
      duration: 9.2
    },
    {
      text: "API design and integration using REST, GraphQL, and modern tools like tRPC are essential skills for full-stack development in today's landscape.",
      start: 82.5,
      duration: 8.6
    },
    {
      text: "Thank you for joining me on this journey through modern web development. Keep experimenting, keep learning, and most importantly, keep building amazing things.",
      start: 91.1,
      duration: 7.9
    }
  ]
}

export const demoPlaylistData: PlaylistInfo = {
  id: 'PLrAXtmRdnEQy4VQs7zIynzSQ5SUXDzXlr',
  title: 'Complete JavaScript Course 2024',
  author: 'CodeMaster Academy',
  thumbnail: 'https://i.ytimg.com/vi/PkZNo7MFNFg/maxresdefault.jpg',
  videoCount: 24,
  description: 'Master JavaScript from beginner to advanced level with this comprehensive course covering ES6+, async programming, DOM manipulation, and modern frameworks.',
  videos: [
    {
      id: 'PkZNo7MFNFg',
      videoId: 'PkZNo7MFNFg',
      title: 'JavaScript Fundamentals - Variables and Data Types',
      author: 'CodeMaster Academy',
      thumbnail: 'https://i.ytimg.com/vi/PkZNo7MFNFg/maxresdefault.jpg',
      duration: 1247,
      uploadDate: '2024-01-10T09:00:00Z',
      viewCount: 156789,
      description: 'Learn the basics of JavaScript variables, data types, and how to work with them effectively.'
    },
    {
      id: 'W6NZfCO5SIk',
      videoId: 'W6NZfCO5SIk',
      title: 'Functions and Scope in JavaScript',
      author: 'CodeMaster Academy',
      thumbnail: 'https://i.ytimg.com/vi/W6NZfCO5SIk/maxresdefault.jpg',
      duration: 1456,
      uploadDate: '2024-01-12T09:00:00Z',
      viewCount: 142356,
      description: 'Deep dive into JavaScript functions, scope, closures, and best practices for writing clean code.'
    },
    {
      id: 'hdI2bqOjy3c',
      videoId: 'hdI2bqOjy3c',
      title: 'Arrays and Objects - Data Structures',
      author: 'CodeMaster Academy',
      thumbnail: 'https://i.ytimg.com/vi/hdI2bqOjy3c/maxresdefault.jpg',
      duration: 1678,
      uploadDate: '2024-01-14T09:00:00Z',
      viewCount: 134567,
      description: 'Master JavaScript arrays and objects with practical examples and common use cases.'
    },
    {
      id: 'dfHvb4HRrJk',
      videoId: 'dfHvb4HRrJk',
      title: 'DOM Manipulation and Events',
      author: 'CodeMaster Academy',
      thumbnail: 'https://i.ytimg.com/vi/dfHvb4HRrJk/maxresdefault.jpg',
      duration: 1834,
      uploadDate: '2024-01-16T09:00:00Z',
      viewCount: 128945,
      description: 'Learn how to interact with the DOM, handle events, and create dynamic web pages.'
    },
    {
      id: 'PoRJizFvM7s',
      videoId: 'PoRJizFvM7s',
      title: 'Asynchronous JavaScript - Promises and Async/Await',
      author: 'CodeMaster Academy',
      thumbnail: 'https://i.ytimg.com/vi/PoRJizFvM7s/maxresdefault.jpg',
      duration: 2145,
      uploadDate: '2024-01-18T09:00:00Z',
      viewCount: 145623,
      description: 'Master asynchronous programming with promises, async/await, and error handling.'
    },
    {
      id: 'Nv7UeeYeSFw',
      videoId: 'Nv7UeeYeSFw',
      title: 'ES6+ Features and Modern JavaScript',
      author: 'CodeMaster Academy',
      thumbnail: 'https://i.ytimg.com/vi/Nv7UeeYeSFw/maxresdefault.jpg',
      duration: 1923,
      uploadDate: '2024-01-20T09:00:00Z',
      viewCount: 139876,
      description: 'Explore modern JavaScript features including arrow functions, destructuring, modules, and more.'
    }
  ]
}

export const demoChannelData: ChannelInfo = {
  id: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
  name: 'TechCraft Studios',
  thumbnail: 'https://yt3.ggpht.com/ytc/AIdro_kKZhHjdJgbEaVn8VZXjhMzNjVjOQIDEeQoFgghow=s800-c-k-c0x00ffffff-no-rj',
  subscriberCount: 1247000,
  description: 'Creating high-quality content about web development, programming tutorials, and technology reviews. Join our community of developers and tech enthusiasts!',
  videos: [
    {
      id: 'dQw4w9WgXcQ',
      videoId: 'dQw4w9WgXcQ',
      title: 'The Art of Modern Web Development',
      thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      duration: 847,
      uploadDate: '2024-01-15T10:30:00Z',
      viewCount: 2847392,
      description: 'Explore the latest trends and techniques in modern web development.'
    },
    {
      id: 'oHg5SJYRHA0',
      videoId: 'oHg5SJYRHA0',
      title: 'React Hooks Deep Dive',
      thumbnail: 'https://i.ytimg.com/vi/oHg5SJYRHA0/maxresdefault.jpg',
      duration: 1456,
      uploadDate: '2024-01-12T14:20:00Z',
      viewCount: 1923456,
      description: 'Master React Hooks with practical examples and advanced patterns.'
    },
    {
      id: 'kJQP7kiw5Fk',
      videoId: 'kJQP7kiw5Fk',
      title: 'TypeScript for Beginners',
      thumbnail: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
      duration: 2134,
      uploadDate: '2024-01-08T11:45:00Z',
      viewCount: 1567890,
      description: 'Learn TypeScript from scratch and improve your JavaScript development.'
    },
    {
      id: 'LXb3EKWsInQ',
      videoId: 'LXb3EKWsInQ',
      title: 'Next.js 14 Complete Guide',
      thumbnail: 'https://i.ytimg.com/vi/LXb3EKWsInQ/maxresdefault.jpg',
      duration: 3245,
      uploadDate: '2024-01-05T16:10:00Z',
      viewCount: 2345678,
      description: 'Complete guide to Next.js 14 with App Router, Server Components, and more.'
    },
    {
      id: 'ZnBPU_7LhiM',
      videoId: 'ZnBPU_7LhiM',
      title: 'CSS Grid vs Flexbox',
      thumbnail: 'https://i.ytimg.com/vi/ZnBPU_7LhiM/maxresdefault.jpg',
      duration: 1789,
      uploadDate: '2024-01-02T13:30:00Z',
      viewCount: 987654,
      description: 'When to use CSS Grid vs Flexbox with practical examples and layouts.'
    }
  ]
}

export const demoLinks = {
  video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  playlist: 'https://www.youtube.com/playlist?list=PLrAXtmRdnEQy4VQs7zIynzSQ5SUXDzXlr',
  channel: 'https://www.youtube.com/@TechCraftStudios'
}