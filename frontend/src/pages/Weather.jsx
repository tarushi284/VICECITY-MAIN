import { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaTemperatureHigh,
    FaWind,
    FaTint,
    FaSmog,
    FaSun,
    FaMoon,
    FaEye,
    FaCompress,
    FaCloudRain,
    FaCloud,
    FaCloudSun,
    FaBolt,
    FaExchangeAlt
} from 'react-icons/fa';
import { WiHumidity, WiBarometer, WiStrongWind } from 'react-icons/wi';

const Weather = () => {
    const [weather, setWeather] = useState(null);
    const [city, setCity] = useState('Jalandhar');
    const [loading, setLoading] = useState(true);
    const [showHourly, setShowHourly] = useState(true);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const { data } = await api.get(`/weather/${city}`);
                setWeather(data);
            } catch (error) {
                console.error('Error fetching weather:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchWeather();
    }, [city]);

    // Mock hourly forecast data (next 24 hours)
    const hourlyForecast = Array.from({ length: 24 }, (_, i) => ({
        time: new Date(Date.now() + i * 3600000).getHours(),
        temp: weather ? Math.round(weather.temperature + Math.random() * 6 - 3) : 20,
        icon: i % 3 === 0 ? 'cloud' : i % 3 === 1 ? 'sun' : 'rain',
        precipitation: Math.round(Math.random() * 100)
    }));

    // Mock 7-day forecast
    const weeklyForecast = Array.from({ length: 7 }, (_, i) => ({
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][(new Date().getDay() + i) % 7],
        high: weather ? Math.round(weather.temperature + Math.random() * 8) : 25,
        low: weather ? Math.round(weather.temperature - Math.random() * 5) : 15,
        condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
        precipitation: Math.round(Math.random() * 100)
    }));

    const getWeatherIcon = (condition) => {
        const icons = {
            cloud: <FaCloud className="text-4xl" />,
            sun: <FaSun className="text-4xl text-yellow-400" />,
            rain: <FaCloudRain className="text-4xl text-blue-400" />,
            cloudy: <FaCloudSun className="text-4xl" />
        };
        return icons[condition] || icons.sun;
    };

    const getAQIColor = (aqi) => {
        if (aqi <= 50) return 'bg-green-500';
        if (aqi <= 100) return 'bg-yellow-500';
        if (aqi <= 150) return 'bg-orange-500';
        if (aqi <= 200) return 'bg-red-500';
        return 'bg-purple-500';
    };

    const getAQILabel = (aqi) => {
        if (aqi <= 50) return 'Good';
        if (aqi <= 100) return 'Moderate';
        if (aqi <= 150) return 'Unhealthy for Sensitive';
        if (aqi <= 200) return 'Unhealthy';
        return 'Very Unhealthy';
    };

    if (loading) return (
        <div className="min-h-screen pt-24 flex items-center justify-center">
            <div className="text-primary text-center">
                <div className="animate-spin text-6xl mb-4"><FaCloud /></div>
                <p className="text-xl">Loading weather data...</p>
            </div>
        </div>
    );

    if (!weather) return (
        <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-primary mb-2">Weather data not available for {city}</h2>
                <p className="text-muted">Please check back later or contact admin.</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen pt-24 px-4 pb-12 max-w-7xl mx-auto">
            {/* Hero Section - Current Weather */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-modern p-8 mb-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 dark:from-blue-600/30 dark:to-cyan-600/30 border-blue-500/30"
            >
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="text-center md:text-left mb-6 md:mb-0">
                        <h1 className="text-4xl font-bold text-primary mb-2">{weather.city}</h1>
                        <p className="text-xl text-secondary capitalize mb-1">{weather.condition}</p>
                        <p className="text-sm text-muted">Last updated: {new Date(weather.updatedAt).toLocaleTimeString()}</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <FaTemperatureHigh className="text-6xl text-cyan-500" />
                        <div>
                            <div className="text-7xl font-bold text-primary">{weather.temperature}°</div>
                            <p className="text-secondary text-sm">Feels like {Math.round(weather.temperature - 2)}°</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Detailed Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card-modern p-6 text-center"
                >
                    <WiHumidity className="text-5xl text-blue-400 mx-auto mb-2" />
                    <p className="text-sm text-secondary mb-1">Humidity</p>
                    <p className="text-2xl font-bold text-primary">{weather.humidity}%</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card-modern p-6 text-center"
                >
                    <FaWind className="text-4xl text-cyan-400 mx-auto mb-2" />
                    <p className="text-sm text-secondary mb-1">Wind Speed</p>
                    <p className="text-2xl font-bold text-primary">{weather.windSpeed || 12} km/h</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card-modern p-6 text-center"
                >
                    <WiBarometer className="text-5xl text-purple-400 mx-auto mb-2" />
                    <p className="text-sm text-secondary mb-1">Pressure</p>
                    <p className="text-2xl font-bold text-primary">1013 hPa</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="card-modern p-6 text-center"
                >
                    <FaEye className="text-4xl text-green-400 mx-auto mb-2" />
                    <p className="text-sm text-secondary mb-1">Visibility</p>
                    <p className="text-2xl font-bold text-primary">10 km</p>
                </motion.div>
            </div>

            {/* Air Quality Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="card-modern p-6 mb-6"
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <FaSmog className="text-3xl text-gray-400" />
                        <h2 className="text-2xl font-bold text-primary">Air Quality Index</h2>
                    </div>
                    <div className="text-right">
                        <div className={`inline-block px-4 py-2 rounded-full ${getAQIColor(weather.aqi)} text-white font-bold`}>
                            {weather.aqi}
                        </div>
                        <p className="text-sm text-secondary mt-1">{getAQILabel(weather.aqi)}</p>
                    </div>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {['PM2.5', 'PM10', 'O₃', 'NO₂', 'SO₂', 'CO'].map((pollutant, i) => (
                        <div key={pollutant} className="bg-surface-elevated rounded-lg p-3 text-center">
                            <p className="text-xs text-secondary mb-1">{pollutant}</p>
                            <p className="text-lg font-bold text-primary">{Math.round(weather.aqi * (0.5 + Math.random() * 0.5))}</p>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Forecast Toggle with Fade Animation */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-6"
            >
                {/* Toggle Switch */}
                <div className="flex justify-center items-center gap-4 mb-6">
                    <span className={`text-sm font-semibold transition-colors ${showHourly ? 'text-cyan-500' : 'text-secondary'}`}>
                        Hourly
                    </span>
                    <button
                        onClick={() => setShowHourly(!showHourly)}
                        className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${showHourly ? 'bg-cyan-500' : 'bg-purple-500'
                            }`}
                    >
                        <div
                            className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${showHourly ? 'translate-x-0' : 'translate-x-8'
                                }`}
                        />
                    </button>
                    <span className={`text-sm font-semibold transition-colors ${!showHourly ? 'text-purple-500' : 'text-secondary'}`}>
                        7-Day
                    </span>
                </div>

                {/* Forecast Content with Fade */}
                <div className="relative">
                    <AnimatePresence mode="wait">
                        {showHourly ? (
                            <motion.div
                                key="hourly"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="card-modern p-6"
                            >
                                <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                                    <FaCloudSun className="text-cyan-500" />
                                    Hourly Forecast
                                </h2>
                                <div className="overflow-x-auto pb-2">
                                    <div className="flex gap-4 min-w-max">
                                        {hourlyForecast.slice(0, 12).map((hour, i) => (
                                            <div key={i} className="bg-surface-elevated rounded-lg p-4 text-center min-w-[80px]">
                                                <p className="text-sm text-secondary mb-2">{hour.time}:00</p>
                                                {getWeatherIcon(hour.icon)}
                                                <p className="text-xl font-bold text-primary my-2">{hour.temp}°</p>
                                                <p className="text-xs text-blue-400">{hour.precipitation}%</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="weekly"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="card-modern p-6"
                            >
                                <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                                    <FaCloud className="text-purple-500" />
                                    7-Day Forecast
                                </h2>
                                <div className="space-y-3">
                                    {weeklyForecast.map((day, i) => (
                                        <div key={i} className="flex items-center justify-between bg-surface-elevated rounded-lg p-4 hover:scale-[1.02] transition-transform">
                                            <div className="flex items-center gap-4 flex-1">
                                                <p className="text-lg font-bold text-primary w-12">{day.day}</p>
                                                <div className="flex items-center gap-2">
                                                    {getWeatherIcon(day.condition.toLowerCase())}
                                                    <p className="text-secondary">{day.condition}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <p className="text-sm text-blue-400">{day.precipitation}% rain</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg font-bold text-primary">{day.high}°</span>
                                                    <span className="text-muted">/</span>
                                                    <span className="text-lg text-secondary">{day.low}°</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Sun Times */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="grid grid-cols-2 gap-4 mt-6"
            >
                <div className="card-modern p-6 text-center">
                    <FaSun className="text-5xl text-yellow-400 mx-auto mb-3" />
                    <p className="text-sm text-secondary mb-1">Sunrise</p>
                    <p className="text-2xl font-bold text-primary">6:24 AM</p>
                </div>
                <div className="card-modern p-6 text-center">
                    <FaMoon className="text-5xl text-indigo-400 mx-auto mb-3" />
                    <p className="text-sm text-secondary mb-1">Sunset</p>
                    <p className="text-2xl font-bold text-primary">5:47 PM</p>
                </div>
            </motion.div>
        </div>
    );
};

export default Weather;
