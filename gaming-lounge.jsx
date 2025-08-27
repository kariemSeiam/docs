<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gaming Lounge - Book Your Session</title>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://unpkg.com/lucide-static@latest/font/lucide.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background-color: #030712;
            color: white;
            overflow-x: hidden;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        
        ::-webkit-scrollbar-track {
            background: #111827;
        }
        
        ::-webkit-scrollbar-thumb {
            background: #4B5563;
            border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: #6B7280;
        }
        
        /* Animations */
        @keyframes pulse-subtle {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
        }
        
        .pulse-subtle {
            animation: pulse-subtle 2s ease-in-out infinite;
        }
        
        @keyframes slide-up {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .animate-slide-up {
            animation: slide-up 0.3s ease-out;
        }
        
        /* Glass effect */
        .glass {
            background: rgba(31, 41, 55, 0.5);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }
        
        /* Icon helper */
        .lucide {
            width: 20px;
            height: 20px;
            display: inline-block;
            vertical-align: middle;
        }
    </style>
</head>
<body>
    <div id="root"></div>
    
    <script type="text/babel">
        const { useState, useEffect, useRef, useMemo } = React;
        
        // Main Gaming Lounge Component
        const GamingLounge = () => {
            const [activeTab, setActiveTab] = useState('rooms');
            const [selectedRoom, setSelectedRoom] = useState(null);
            const [sessionActive, setSessionActive] = useState(false);
            const [sessionDuration, setSessionDuration] = useState(0);
            const [timeRemaining, setTimeRemaining] = useState(0);
            const [bookingStep, setBookingStep] = useState('select'); // select, duration, confirm
            const [services, setServices] = useState({
                drinks: false,
                wifi: false,
                music: false,
                extended: false
            });
            
            // Room data
            const rooms = [
                {
                    id: 1,
                    name: 'Alpha Station',
                    available: true,
                    currentGame: null,
                    features: {
                        ac: true,
                        smoking: false,
                        bluetooth: true
                    },
                    specs: 'RTX 4080 • 32GB RAM'
                },
                {
                    id: 2,
                    name: 'Beta Arena',
                    available: false,
                    currentGame: 'FIFA 24',
                    features: {
                        ac: true,
                        smoking: false,
                        bluetooth: true
                    },
                    specs: 'RTX 4070 • 32GB RAM'
                },
                {
                    id: 3,
                    name: 'Gamma Zone',
                    available: true,
                    currentGame: null,
                    features: {
                        ac: true,
                        smoking: true,
                        bluetooth: true
                    },
                    specs: 'RTX 4090 • 64GB RAM'
                },
                {
                    id: 4,
                    name: 'Delta Hub',
                    available: false,
                    currentGame: 'Call of Duty',
                    features: {
                        ac: true,
                        smoking: false,
                        bluetooth: true
                    },
                    specs: 'RTX 4070 Ti • 32GB RAM'
                }
            ];
            
            // Games data
            const games = [
                { id: 1, title: 'FIFA 24', category: 'Sports', players: 42, type: 'Multiplayer', cover: '⚽' },
                { id: 2, title: 'Call of Duty MW3', category: 'Shooter', players: 128, type: 'Multiplayer', cover: '🎯' },
                { id: 3, title: 'Spider-Man 2', category: 'Action', players: 1, type: 'Single', cover: '🕷️' },
                { id: 4, title: 'Mortal Kombat 1', category: 'Fighting', players: 2, type: 'Co-op', cover: '🥊' },
                { id: 5, title: 'Gran Turismo 7', category: 'Racing', players: 16, type: 'Multiplayer', cover: '🏎️' },
                { id: 6, title: 'God of War Ragnarök', category: 'Adventure', players: 1, type: 'Single', cover: '⚔️' }
            ];
            
            // Timer countdown effect
            useEffect(() => {
                if (sessionActive && timeRemaining > 0) {
                    const timer = setInterval(() => {
                        setTimeRemaining(prev => {
                            if (prev <= 1) {
                                setSessionActive(false);
                                setSelectedRoom(null);
                                return 0;
                            }
                            return prev - 1;
                        });
                    }, 1000);
                    
                    return () => clearInterval(timer);
                }
            }, [sessionActive, timeRemaining]);
            
            // Format time display
            const formatTime = (seconds) => {
                const hours = Math.floor(seconds / 3600);
                const minutes = Math.floor((seconds % 3600) / 60);
                const secs = seconds % 60;
                return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            };
            
            // Handle room booking
            const handleRoomSelect = (room) => {
                if (room.available) {
                    setSelectedRoom(room);
                    setBookingStep('duration');
                }
            };
            
            const handleDurationSelect = (hours) => {
                setSessionDuration(hours);
                setBookingStep('confirm');
            };
            
            const handleBookingConfirm = () => {
                setSessionActive(true);
                setTimeRemaining(sessionDuration * 3600);
                setBookingStep('select');
                setActiveTab('session');
                // Reset services
                setServices({
                    drinks: false,
                    wifi: false,
                    music: false,
                    extended: false
                });
            };
            
            const handleCancelBooking = () => {
                setSelectedRoom(null);
                setBookingStep('select');
                setSessionDuration(0);
            };
            
            // Status Bar Component
            const StatusBar = () => (
                <div className="fixed top-0 w-full bg-gray-900/95 backdrop-blur-sm z-50 px-4 py-2 border-b border-gray-800">
                    <div className="flex items-center justify-between max-w-6xl mx-auto">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${sessionActive ? 'bg-emerald-500' : 'bg-gray-500'}`}></div>
                                <span className="text-sm text-gray-300">
                                    {sessionActive ? `Room: ${selectedRoom?.name}` : 'No Active Session'}
                                </span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                <i className="lucide lucide-wifi text-gray-400"></i>
                                <span className="text-xs text-gray-400">5G</span>
                            </div>
                            
                            {sessionActive && (
                                <div className="flex items-center gap-2">
                                    <i className="lucide lucide-clock text-orange-400"></i>
                                    <span className="text-sm font-mono text-orange-400">{formatTime(timeRemaining)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
            
            // Room Selection Tab
            const RoomSelection = () => (
                <div className="p-4 max-w-6xl mx-auto">
                    {bookingStep === 'select' && (
                        <div className="grid grid-cols-2 gap-4 animate-slide-up">
                            {rooms.map(room => (
                                <div
                                    key={room.id}
                                    onClick={() => handleRoomSelect(room)}
                                    className={`
                                        relative p-6 rounded-xl border transition-all cursor-pointer
                                        ${room.available 
                                            ? 'bg-gray-900 border-gray-800 hover:border-purple-700 hover:shadow-lg hover:shadow-purple-900/20' 
                                            : 'bg-gray-900/50 border-gray-800/50 cursor-not-allowed opacity-60'
                                        }
                                    `}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-white mb-1">{room.name}</h3>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${room.available ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                                <span className="text-sm text-gray-400">
                                                    {room.available ? 'Available' : `Playing: ${room.currentGame}`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="text-xs text-gray-500 mb-3">{room.specs}</div>
                                    
                                    <div className="flex items-center gap-3">
                                        <div className={`flex items-center gap-1 ${room.features.ac ? 'text-blue-400' : 'text-gray-600'}`}>
                                            <i className="lucide lucide-wind text-sm"></i>
                                            <span className="text-xs">AC</span>
                                        </div>
                                        <div className={`flex items-center gap-1 ${room.features.smoking ? 'text-gray-400' : 'text-gray-600'}`}>
                                            <i className={`lucide ${room.features.smoking ? 'lucide-cigarette' : 'lucide-cigarette-off'} text-sm`}></i>
                                            <span className="text-xs">{room.features.smoking ? 'Smoking' : 'No Smoke'}</span>
                                        </div>
                                        <div className={`flex items-center gap-1 ${room.features.bluetooth ? 'text-blue-400' : 'text-gray-600'}`}>
                                            <i className="lucide lucide-bluetooth text-sm"></i>
                                            <span className="text-xs">BT</span>
                                        </div>
                                    </div>
                                    
                                    {room.available && (
                                        <button className="mt-4 w-full py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors">
                                            Book Now
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {bookingStep === 'duration' && selectedRoom && (
                        <div className="max-w-md mx-auto animate-slide-up">
                            <button
                                onClick={handleCancelBooking}
                                className="mb-4 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                            >
                                <i className="lucide lucide-arrow-left"></i>
                                Back
                            </button>
                            
                            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                                <h2 className="text-xl font-semibold mb-2">Select Duration</h2>
                                <p className="text-gray-400 mb-6">Room: {selectedRoom.name}</p>
                                
                                <div className="grid grid-cols-2 gap-3">
                                    {[1, 2, 3, 4].map(hours => (
                                        <button
                                            key={hours}
                                            onClick={() => handleDurationSelect(hours)}
                                            className="p-4 bg-gray-800 hover:bg-purple-700 rounded-lg transition-all hover:scale-105"
                                        >
                                            <div className="text-2xl font-bold text-white">{hours}h</div>
                                            <div className="text-sm text-gray-400">${hours * 10}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {bookingStep === 'confirm' && selectedRoom && (
                        <div className="max-w-md mx-auto animate-slide-up">
                            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                                <h2 className="text-xl font-semibold mb-4">Confirm Booking</h2>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-300">
                                        <span>Room:</span>
                                        <span className="font-medium">{selectedRoom.name}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-300">
                                        <span>Duration:</span>
                                        <span className="font-medium">{sessionDuration} hours</span>
                                    </div>
                                    <div className="flex justify-between text-gray-300">
                                        <span>Total:</span>
                                        <span className="font-bold text-orange-400">${sessionDuration * 10}</span>
                                    </div>
                                </div>
                                
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleCancelBooking}
                                        className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleBookingConfirm}
                                        className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors pulse-subtle"
                                    >
                                        Confirm & Start
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            );
            
            // Games Library Tab
            const GamesLibrary = () => {
                const [filter, setFilter] = useState('All');
                const categories = ['All', 'Multiplayer', 'Single', 'Co-op'];
                
                const filteredGames = filter === 'All' 
                    ? games 
                    : games.filter(game => game.type === filter);
                
                return (
                    <div className="p-4 max-w-6xl mx-auto">
                        <div className="mb-6">
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setFilter(cat)}
                                        className={`
                                            px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all
                                            ${filter === cat 
                                                ? 'bg-purple-700 text-white' 
                                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                            }
                                        `}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {filteredGames.map(game => (
                                <div key={game.id} className="bg-gray-900 rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition-all">
                                    <div className="aspect-square bg-gray-800 rounded-lg mb-3 flex items-center justify-center text-4xl">
                                        {game.cover}
                                    </div>
                                    <h3 className="font-medium text-white mb-1">{game.title}</h3>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400">{game.category}</span>
                                        <div className="flex items-center gap-1 text-emerald-400">
                                            <i className="lucide lucide-users text-xs"></i>
                                            <span>{game.players}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            };
            
            // My Session Tab
            const MySession = () => (
                <div className="p-4 max-w-6xl mx-auto">
                    {sessionActive ? (
                        <div className="space-y-6 animate-slide-up">
                            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                                <div className="text-center mb-6">
                                    <h2 className="text-3xl font-bold text-white mb-2">{formatTime(timeRemaining)}</h2>
                                    <p className="text-gray-400">Room: {selectedRoom?.name}</p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setServices({...services, drinks: !services.drinks})}
                                        className={`
                                            p-4 rounded-lg border transition-all
                                            ${services.drinks 
                                                ? 'bg-orange-500/10 border-orange-500 text-orange-400' 
                                                : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                                            }
                                        `}
                                    >
                                        <i className="lucide lucide-coffee text-2xl mb-2"></i>
                                        <div className="text-sm font-medium">Order Drinks</div>
                                    </button>
                                    
                                    <button
                                        onClick={() => setServices({...services, wifi: !services.wifi})}
                                        className={`
                                            p-4 rounded-lg border transition-all
                                            ${services.wifi 
                                                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                                                : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                                            }
                                        `}
                                    >
                                        <i className="lucide lucide-wifi text-2xl mb-2"></i>
                                        <div className="text-sm font-medium">WiFi Ticket</div>
                                    </button>
                                    
                                    <button
                                        onClick={() => setServices({...services, music: !services.music})}
                                        className={`
                                            p-4 rounded-lg border transition-all
                                            ${services.music 
                                                ? 'bg-purple-500/10 border-purple-500 text-purple-400' 
                                                : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                                            }
                                        `}
                                    >
                                        <i className="lucide lucide-music text-2xl mb-2"></i>
                                        <div className="text-sm font-medium">Music Control</div>
                                    </button>
                                    
                                    <button
                                        onClick={() => {
                                            setTimeRemaining(prev => prev + 3600);
                                            setServices({...services, extended: true});
                                        }}
                                        disabled={services.extended}
                                        className={`
                                            p-4 rounded-lg border transition-all
                                            ${services.extended 
                                                ? 'bg-gray-800/50 border-gray-700/50 text-gray-600 cursor-not-allowed' 
                                                : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                                            }
                                        `}
                                    >
                                        <i className="lucide lucide-clock-3 text-2xl mb-2"></i>
                                        <div className="text-sm font-medium">
                                            {services.extended ? 'Extended' : 'Extend Time'}
                                        </div>
                                    </button>
                                </div>
                            </div>
                            
                            {services.music && (
                                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                                    <h3 className="font-medium text-white mb-4">Music Player</h3>
                                    <div className="bg-gray-800 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <div className="text-white font-medium">Gaming Playlist</div>
                                                <div className="text-sm text-gray-400">Epic Gaming Music</div>
                                            </div>
                                            <i className="lucide lucide-play-circle text-2xl text-orange-400"></i>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <i className="lucide lucide-skip-back text-gray-400"></i>
                                            <div className="flex-1 h-1 bg-gray-700 rounded-full">
                                                <div className="w-1/3 h-full bg-orange-400 rounded-full"></div>
                                            </div>
                                            <i className="lucide lucide-skip-forward text-gray-400"></i>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                                <h3 className="font-medium text-white mb-4">Room Amenities</h3>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <i className="lucide lucide-wind text-2xl text-blue-400 mb-2"></i>
                                        <div className="text-sm text-gray-400">AC On</div>
                                    </div>
                                    <div>
                                        <i className="lucide lucide-bluetooth text-2xl text-blue-400 mb-2"></i>
                                        <div className="text-sm text-gray-400">Connected</div>
                                    </div>
                                    <div>
                                        <i className="lucide lucide-cigarette-off text-2xl text-gray-600 mb-2"></i>
                                        <div className="text-sm text-gray-400">No Smoking</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <i className="lucide lucide-gamepad-2 text-6xl text-gray-700 mb-4"></i>
                            <h2 className="text-xl font-semibold text-gray-400 mb-2">No Active Session</h2>
                            <p className="text-gray-500 mb-6">Book a room to start gaming!</p>
                            <button
                                onClick={() => setActiveTab('rooms')}
                                className="px-6 py-3 bg-purple-700 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
                            >
                                Browse Rooms
                            </button>
                        </div>
                    )}
                </div>
            );
            
            // Profile Tab
            const Profile = () => {
                const stats = {
                    hoursPlayed: 127,
                    favoriteGames: ['FIFA 24', 'Call of Duty', 'Gran Turismo 7'],
                    totalSpent: 485,
                    memberSince: 'Jan 2024'
                };
                
                return (
                    <div className="p-4 max-w-6xl mx-auto space-y-6">
                        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-purple-700 rounded-full flex items-center justify-center">
                                    <i className="lucide lucide-user text-2xl text-white"></i>
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-white">Gamer Profile</h2>
                                    <p className="text-gray-400">Member since {stats.memberSince}</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-gray-800 rounded-lg p-4">
                                    <div className="text-2xl font-bold text-white">{stats.hoursPlayed}</div>
                                    <div className="text-sm text-gray-400">Hours Played</div>
                                </div>
                                <div className="bg-gray-800 rounded-lg p-4">
                                    <div className="text-2xl font-bold text-white">${stats.totalSpent}</div>
                                    <div className="text-sm text-gray-400">Total Spent</div>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="font-medium text-white mb-3">Favorite Games</h3>
                                <div className="flex flex-wrap gap-2">
                                    {stats.favoriteGames.map(game => (
                                        <span key={game} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">
                                            {game}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                            <h3 className="font-medium text-white mb-4">Payment Methods</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <i className="lucide lucide-credit-card text-gray-400"></i>
                                        <span className="text-gray-300">•••• 4242</span>
                                    </div>
                                    <span className="text-sm text-emerald-400">Default</span>
                                </div>
                                <button className="w-full p-4 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-gray-600 transition-all">
                                    <i className="lucide lucide-plus mr-2"></i>
                                    Add Payment Method
                                </button>
                            </div>
                        </div>
                        
                        <details className="bg-gray-900 rounded-xl border border-gray-800">
                            <summary className="p-6 cursor-pointer hover:bg-gray-800/50 transition-colors">
                                <span className="font-medium text-white">Booking History</span>
                            </summary>
                            <div className="px-6 pb-6 space-y-3">
                                <div className="p-4 bg-gray-800 rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="text-white font-medium">Alpha Station</div>
                                            <div className="text-sm text-gray-400">2 hours session</div>
                                        </div>
                                        <span className="text-sm text-gray-500">Yesterday</span>
                                    </div>
                                    <div className="text-sm text-orange-400">$20</div>
                                </div>
                                <div className="p-4 bg-gray-800 rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="text-white font-medium">Gamma Zone</div>
                                            <div className="text-sm text-gray-400">3 hours session</div>
                                        </div>
                                        <span className="text-sm text-gray-500">3 days ago</span>
                                    </div>
                                    <div className="text-sm text-orange-400">$30</div>
                                </div>
                            </div>
                        </details>
                    </div>
                );
            };
            
            // Bottom Navigation
            const BottomNav = () => {
                const tabs = [
                    { id: 'rooms', label: 'Rooms', icon: 'gamepad-2' },
                    { id: 'games', label: 'Games', icon: 'library' },
                    { id: 'session', label: 'Session', icon: 'clock' },
                    { id: 'profile', label: 'Profile', icon: 'user' }
                ];
                
                return (
                    <nav className="fixed bottom-0 w-full bg-gray-900 border-t border-gray-800 z-50">
                        <div className="flex items-center justify-around h-16">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        flex flex-col items-center justify-center h-full px-6 transition-colors
                                        ${activeTab === tab.id ? 'text-orange-400' : 'text-gray-500 hover:text-gray-300'}
                                    `}
                                >
                                    <i className={`lucide lucide-${tab.icon} text-xl mb-1`}></i>
                                    <span className="text-xs">{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </nav>
                );
            };
            
            return (
                <div className="min-h-screen bg-gray-950 text-white">
                    <StatusBar />
                    
                    <div className="pt-12 pb-16">
                        {activeTab === 'rooms' && <RoomSelection />}
                        {activeTab === 'games' && <GamesLibrary />}
                        {activeTab === 'session' && <MySession />}
                        {activeTab === 'profile' && <Profile />}
                    </div>
                    
                    <BottomNav />
                </div>
            );
        };
        
        // Render the app
        ReactDOM.render(<GamingLounge />, document.getElementById('root'));
    </script>
</body>
</html>