import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { FaAtlas, FaCalendarAlt, FaMapMarkedAlt, FaArrowRight, FaSearch } from 'react-icons/fa';

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q')?.toLowerCase() || '';
    const [results, setResults] = useState({
        pages: [],
        attractions: [],
        events: []
    });
    const [loading, setLoading] = useState(true);

    // Hardcoded Application Features
    const appFeatures = [
        { name: 'Dashboard', path: '/dashboard', description: 'User overview and quick stats.', icon: <FaAtlas /> },
        { name: 'Bills & Utilities', path: '/bills', description: 'Pay electricity, water, and gas bills.', icon: <FaAtlas /> },
        { name: 'Traffic', path: '/traffic', description: 'Real-time traffic alerts and map.', icon: <FaMapMarkedAlt /> },
        { name: 'Weather', path: '/weather', description: 'City weather updates and air quality.', icon: <FaAtlas /> },
        { name: 'Reports', path: '/reports', description: 'Report civic issues like potholes or crime.', icon: <FaAtlas /> },
        { name: 'News & Schemes', path: '/news', description: 'Latest city news and government schemes.', icon: <FaAtlas /> },
        { name: 'Attractions', path: '/attractions', description: 'Explore tourist items and museums.', icon: <FaMapMarkedAlt /> },
        { name: 'Events', path: '/events', description: 'Upcoming city events and festivals.', icon: <FaCalendarAlt /> },
        { name: 'Contacts', path: '/contacts', description: 'Emergency numbers and city officials.', icon: <FaAtlas /> },
        { name: 'Chat', path: '/chat', description: 'Smart City Admin Chat.', icon: <FaAtlas /> },
    ];

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                const [attractionsRes, eventsRes] = await Promise.all([
                    api.get('/attractions'),
                    api.get('/events')
                ]);

                const filteredPages = appFeatures.filter(page =>
                    page.name.toLowerCase().includes(query) ||
                    page.description.toLowerCase().includes(query)
                );

                const filteredAttractions = attractionsRes.data.filter(place =>
                    place.name.toLowerCase().includes(query) ||
                    place.description.toLowerCase().includes(query) ||
                    place.location.toLowerCase().includes(query)
                );

                const filteredEvents = eventsRes.data.filter(event =>
                    event.title.toLowerCase().includes(query) ||
                    event.description.toLowerCase().includes(query)
                );

                setResults({
                    pages: filteredPages,
                    attractions: filteredAttractions,
                    events: filteredEvents
                });
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchResults();
        } else {
            setResults({ pages: [], attractions: [], events: [] });
            setLoading(false);
        }
    }, [query]);

    // Helper to render section
    const renderSection = (title, items, renderItem) => {
        if (items.length === 0) return null;
        return (
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-primary mb-6 border-b border-white/10 pb-2">{title} ({items.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item, idx) => renderItem(item, idx))}
                </div>
            </section>
        );
    };

    return (
        <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-primary mb-8 flex items-center gap-3">
                <FaSearch className="text-cyan-400" />
                Search Results for "{query}"
            </h1>

            {loading ? (
                <div className="text-center py-20 text-muted animate-pulse">Searching city database...</div>
            ) : (
                <>
                    {results.pages.length === 0 && results.attractions.length === 0 && results.events.length === 0 && (
                        <div className="text-center py-20 text-muted">
                            No results found. Try different keywords.
                        </div>
                    )}

                    {/* Features Section */}
                    {renderSection('Pages & Features', results.pages, (page, idx) => (
                        <Link to={page.path} key={idx} className="block">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="card-modern h-full flex items-start gap-4 hover:border-cyan-500/50 transition-colors"
                            >
                                <div className="bg-cyan-500/20 p-3 rounded-xl text-cyan-400 text-xl">
                                    {page.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-primary text-lg mb-1">{page.name}</h3>
                                    <p className="text-sm text-secondary">{page.description}</p>
                                </div>
                            </motion.div>
                        </Link>
                    ))}

                    {/* Attractions Section */}
                    {renderSection('Attractions', results.attractions, (place) => (
                        <Link to="/attractions" key={place._id} className="block">
                            <motion.div whileHover={{ y: -5 }} className="card-modern h-full overflow-hidden p-0 group">
                                <div className="h-40 overflow-hidden">
                                    <img src={place.imageUrl || 'https://via.placeholder.com/400x300'} alt={place.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-primary mb-1">{place.name}</h3>
                                    <p className="text-xs text-secondary line-clamp-2">{place.description}</p>
                                    <span className="text-xs text-cyan-400 mt-2 block font-bold">View Details <FaArrowRight className="inline ml-1" /></span>
                                </div>
                            </motion.div>
                        </Link>
                    ))}

                    {/* Events Section */}
                    {renderSection('Events', results.events, (event) => (
                        <Link to="/events" key={event._id} className="block">
                            <motion.div whileHover={{ y: -5 }} className="card-modern h-full overflow-hidden p-0 group">
                                <div className="h-40 overflow-hidden relative">
                                    <img src={event.imageUrl || 'https://via.placeholder.com/400x300'} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-white">
                                        {new Date(event.date).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-primary mb-1">{event.title}</h3>
                                    <p className="text-xs text-secondary line-clamp-2">{event.description}</p>
                                    <span className="text-xs text-orange-400 mt-2 block font-bold">View Event <FaArrowRight className="inline ml-1" /></span>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </>
            )}
        </div>
    );
};

export default Search;
