import { motion, AnimatePresence } from 'framer-motion';
import { useContext, useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../api/axios';
import { FaSearch, FaTemperatureHigh, FaTrafficLight, FaArrowRight, FaMapMarkerAlt, FaCalendarAlt, FaAtlas } from 'react-icons/fa';
import Footer from '../components/Footer';

const Home = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        weather: null,
        trafficCount: 0,
    });
    const [trending, setTrending] = useState([]);
    const [events, setEvents] = useState([]);
    const [allAttractions, setAllAttractions] = useState([]);
    const [allEvents, setAllEvents] = useState([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState({ pages: [], attractions: [], events: [] });
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);

    // Hardcoded Application Features
    const appFeatures = [
        { name: 'Dashboard', path: '/dashboard', description: 'User overview', icon: <FaAtlas /> },
        { name: 'Bills & Utilities', path: '/bills', description: 'Pay bills', icon: <FaAtlas /> },
        { name: 'Traffic', path: '/traffic', description: 'Traffic alerts', icon: <FaTrafficLight /> },
        { name: 'Weather', path: '/weather', description: 'City weather', icon: <FaTemperatureHigh /> },
        { name: 'Reports', path: '/reports', description: 'Report issues', icon: <FaAtlas /> },
        { name: 'News', path: '/news', description: 'City news', icon: <FaAtlas /> },
        { name: 'Attractions', path: '/attractions', description: 'Tourist spots', icon: <FaMapMarkerAlt /> },
        { name: 'Events', path: '/events', description: 'City events', icon: <FaCalendarAlt /> },
        { name: 'Chat', path: '/chat', description: 'Admin chat', icon: <FaAtlas /> },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Parallel Fetching
                const [weatherRes, trafficRes, attractionsRes, eventsRes] = await Promise.all([
                    api.get('/weather/SmartCity'),
                    api.get('/traffic'),
                    api.get('/attractions'),
                    api.get('/events')
                ]);

                setStats({
                    weather: weatherRes.data,
                    trafficCount: trafficRes.data.filter(t => t.active !== false).length,
                });

                // Set Data for Landing Page Sections
                setTrending(attractionsRes.data.slice(0, 3));
                setEvents(eventsRes.data.slice(0, 3));

                // Set All Data for Search
                setAllAttractions(attractionsRes.data);
                setAllEvents(eventsRes.data);

            } catch (error) {
                console.error('Error fetching home data:', error);
            }
        };

        fetchData();
    }, []);

    // Filter Suggestions Effect
    useEffect(() => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) {
            setSuggestions({ pages: [], attractions: [], events: [] });
            return;
        }

        const filteredPages = appFeatures.filter(page =>
            page.name.toLowerCase().includes(query) ||
            page.description.toLowerCase().includes(query)
        );

        const filteredAttractions = allAttractions.filter(place =>
            place.name.toLowerCase().includes(query) ||
            place.description.toLowerCase().includes(query)
        );

        const filteredEvents = allEvents.filter(event =>
            event.title.toLowerCase().includes(query) ||
            event.description.toLowerCase().includes(query)
        );

        setSuggestions({
            pages: filteredPages,
            attractions: filteredAttractions,
            events: filteredEvents
        });
    }, [searchQuery, allAttractions, allEvents]);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${searchQuery}`);
            setShowSuggestions(false);
        }
    };

    return (
        <div className="min-h-screen text-primary font-sans relative selection:bg-cyan-500 selection:text-white">
            {/* FIXED BACKGROUND LAYER */}
            <div className="fixed inset-0 z-[-1] pointer-events-none">
                <div className="absolute inset-0 bg-black/40 dark:bg-black/60 z-10 transition-colors duration-500"></div>
                <img src="/city-light.png" alt="City Skyline Day" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-100 dark:opacity-0" />
                <img src="/dark-city-v2.png" alt="City Skyline Night" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-0 dark:opacity-100" />
            </div>

            {/* HERO SECTION */}
            <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-20 pb-20 md:py-0">
                <div className="relative z-30 container mx-auto px-4 text-center mt-auto md:mt-0">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl sm:text-6xl md:text-8xl font-extrabold text-white mb-6 drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] tracking-tight leading-tight"
                    >
                        Virtually Perfect <br className="hidden md:block" />
                        <span className="block md:inline">Visibly Smart</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-lg md:text-2xl text-white/90 font-medium mb-8 md:mb-10 max-w-3xl mx-auto drop-shadow-md px-4"
                    >
                        Your smart guide to local attractions, real-time events, and city insights.
                    </motion.p>

                    {/* SEARCH BAR CONTAINER */}
                    <div ref={searchRef} className="max-w-2xl mx-auto relative group px-2 md:px-0">
                        <motion.form
                            onSubmit={handleSearchSubmit}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="relative"
                        >
                            <div className="absolute inset-y-0 left-2 md:left-0 pl-6 flex items-center pointer-events-none">
                                <FaSearch className="text-white/70 group-focus-within:text-cyan-400 transition-colors z-10" />
                            </div>
                            <input
                                type="text"
                                name="search"
                                autoComplete="off"
                                placeholder="Find events, museums, services..."
                                className="w-full pl-12 md:pl-14 pr-24 md:pr-32 py-4 md:py-5 bg-white/10 backdrop-blur-xl border border-white/30 rounded-full text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-black/60 transition-all duration-300 shadow-2xl text-base md:text-lg font-medium"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={() => setShowSuggestions(true)}
                            />
                            <button
                                type="submit"
                                className="absolute right-3 top-2 bottom-2 md:right-2 md:top-2 md:bottom-2 bg-cyan-500 hover:bg-cyan-400 text-white px-4 md:px-8 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-cyan-500/30 active:scale-95 text-sm md:text-base"
                            >
                                Search
                            </button>
                        </motion.form>

                        {/* LIVE SUGGESTIONS DROPDOWN */}
                        <AnimatePresence>
                            {showSuggestions && searchQuery && (suggestions.pages.length > 0 || suggestions.attractions.length > 0 || suggestions.events.length > 0) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-full left-0 right-0 mt-2 bg-slate-900/90 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent mx-2 md:mx-0 text-left"
                                >
                                    {/* Pages */}
                                    {suggestions.pages.length > 0 && (
                                        <div className="p-2">
                                            <h3 className="text-xs font-bold text-muted uppercase px-4 py-2">Features</h3>
                                            {suggestions.pages.map((item, idx) => (
                                                <Link
                                                    key={idx}
                                                    to={item.path}
                                                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors rounded-xl"
                                                >
                                                    <div className="text-cyan-400 bg-cyan-400/10 p-2 rounded-lg">{item.icon}</div>
                                                    <div>
                                                        <div className="font-bold text-primary">{item.name}</div>
                                                        <div className="text-xs text-secondary">{item.description}</div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}

                                    {/* Attractions */}
                                    {suggestions.attractions.length > 0 && (
                                        <div className="p-2 border-t border-white/5">
                                            <h3 className="text-xs font-bold text-muted uppercase px-4 py-2">Attractions</h3>
                                            {suggestions.attractions.slice(0, 3).map((item, idx) => (
                                                <Link
                                                    key={idx}
                                                    to="/attractions" // Could link to detail if ID supported
                                                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors rounded-xl"
                                                >
                                                    <div className="text-green-400 bg-green-400/10 p-2 rounded-lg"><FaMapMarkerAlt /></div>
                                                    <div>
                                                        <div className="font-bold text-primary">{item.name}</div>
                                                        <div className="text-xs text-secondary line-clamp-1">{item.location}</div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}

                                    {/* Events */}
                                    {suggestions.events.length > 0 && (
                                        <div className="p-2 border-t border-white/5">
                                            <h3 className="text-xs font-bold text-muted uppercase px-4 py-2">Events</h3>
                                            {suggestions.events.slice(0, 3).map((item, idx) => (
                                                <Link
                                                    key={idx}
                                                    to="/events"
                                                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors rounded-xl"
                                                >
                                                    <div className="text-orange-400 bg-orange-400/10 p-2 rounded-lg"><FaCalendarAlt /></div>
                                                    <div>
                                                        <div className="font-bold text-primary">{item.title}</div>
                                                        <div className="text-xs text-secondary line-clamp-1">{new Date(item.date).toLocaleDateString()}</div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}

                                    <Link to={`/search?q=${searchQuery}`} className="block text-center py-3 bg-white/5 hover:bg-white/10 text-cyan-400 text-sm font-bold transition-colors m-2 rounded-xl">
                                        View all results for "{searchQuery}"
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Quick Stats Floating Bar */}
                <div className="relative mt-10 md:absolute md:bottom-10 md:mt-0 left-0 right-0 z-20 flex flex-col md:flex-row flex-wrap justify-center items-center gap-3 md:gap-4 px-4 w-full">
                    {stats.weather && (
                        <div className="w-full md:w-auto glass-strong px-6 py-3 flex items-center justify-between md:justify-center gap-3 shadow-2xl rounded-2xl md:rounded-full text-white bg-black/30 backdrop-blur-md border border-white/10 hover:scale-105 transition-transform cursor-default">
                            <div className="flex items-center gap-3">
                                <FaTemperatureHigh className="text-yellow-400 text-xl" />
                                <span className="text-lg font-bold">{stats.weather.temperature}°C</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-white/50">|</span>
                                <span className={`text-sm font-bold px-2 py-0.5 rounded ${stats.weather.aqi > 100 ? "bg-red-500/20 text-red-300" : "bg-green-500/20 text-green-300"}`}>
                                    AQI: {stats.weather.aqi}
                                </span>
                            </div>
                        </div>
                    )}
                    <div className="w-full md:w-auto glass-strong px-6 py-3 flex items-center justify-between md:justify-center gap-3 shadow-2xl rounded-2xl md:rounded-full text-white bg-black/30 backdrop-blur-md border border-white/10 hover:scale-105 transition-transform">
                        <div className="flex items-center gap-3">
                            <FaTrafficLight className="text-red-500 text-xl" />
                            <span className="text-lg font-bold">{stats.trafficCount}</span>
                            <span className="text-sm text-white/80">Active Alerts</span>
                        </div>
                        <Link to="/traffic" className="text-xs bg-cyan-500/20 text-cyan-300 px-3 py-1.5 rounded-lg hover:bg-cyan-500/40 transition-colors ml-2 font-semibold">
                            Map
                        </Link>
                    </div>
                </div>
            </section>

            {/* CONTENT SECTIONS CONTAINER */}
            <div className="relative z-10 min-h-screen transition-colors duration-500">
                {/* Trending Now */}
                <section className="py-12 md:py-20 container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4 md:gap-0">
                        <div>
                            <span className="text-cyan-400 font-bold uppercase tracking-wider text-sm drop-shadow-md">Discover</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mt-1 drop-shadow-lg">Trending Now</h2>
                        </div>
                        <Link to="/attractions" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2 font-bold group drop-shadow-md self-end md:self-auto">
                            View All <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {trending.length > 0 ? trending.map((place, index) => (
                            <motion.div
                                key={place._id || index}
                                whileHover={{ y: -10 }}
                                className="card-modern group p-0 overflow-hidden h-full flex flex-col"
                            >
                                <div className="h-48 md:h-56 overflow-hidden relative">
                                    <img src={place.imageUrl || 'https://via.placeholder.com/400x300'} alt={place.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute top-4 right-4 bg-green-500/90 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm shadow-lg">Open</div>
                                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                        <p className="text-white text-sm line-clamp-1">{place.location || 'City Center'}</p>
                                    </div>
                                </div>
                                <div className="p-5 md:p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold mb-2 text-primary group-hover:text-cyan-500 transition-colors">{place.name}</h3>
                                    <p className="text-secondary text-sm mb-4 line-clamp-2 flex-1">{place.description}</p>
                                    <Link to="/attractions" className="mt-auto block w-full py-3 text-center rounded-xl bg-surface-elevated hover:bg-cyan-500 hover:text-white transition-all duration-300 font-bold text-sm border border-transparent hover:border-cyan-400">
                                        View Details
                                    </Link>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="col-span-1 md:col-span-3 text-center text-muted py-10">Loading attractions...</div>
                        )}
                    </div>
                </section>


                {/* Upcoming Events */}
                <section className="py-12 md:py-20 container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4 md:gap-0">
                        <div>
                            <span className="text-orange-400 font-bold uppercase tracking-wider text-sm drop-shadow-md">Happening Soon</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mt-1 drop-shadow-lg">Upcoming Events</h2>
                        </div>
                        <Link to="/events" className="text-orange-400 hover:text-orange-300 flex items-center gap-2 font-bold group drop-shadow-md self-end md:self-auto">
                            View Calendar <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {events.length > 0 ? events.map((event, index) => (
                            <div key={event._id || index} className="relative group rounded-3xl overflow-hidden aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] cursor-pointer shadow-xl">
                                <img src={event.imageUrl || `https://source.unsplash.com/random/400x500/?event,${index}`} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 md:p-6 flex flex-col justify-end">
                                    <div className="bg-black/40 backdrop-blur-md w-fit px-3 py-1 rounded-lg text-white font-bold text-xs mb-3 border border-white/20 shadow-lg">
                                        {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-white mb-2 leading-tight group-hover:text-cyan-400 transition-colors">{event.title}</h3>
                                    <p className="text-gray-300 text-xs md:text-sm line-clamp-2 mb-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:transform md:translate-y-4 md:group-hover:translate-y-0 transition-all duration-300">{event.description}</p>
                                    <Link to="/events" className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl shadow-lg transition-all duration-300 text-center text-sm font-bold opacity-100 md:opacity-0 md:group-hover:opacity-100 md:transform md:translate-y-4 md:group-hover:translate-y-0 delay-75">
                                        Get Tickets
                                    </Link>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-1 sm:col-span-2 lg:col-span-4 text-center text-muted">No upcoming events found.</div>
                        )}
                    </div>
                </section>

                {/* Footer Component */}
                <Footer />
            </div>
        </div>
    );
};

export default Home;
