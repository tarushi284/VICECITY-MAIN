import { useState, useEffect, useContext, useRef } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaTrash, FaMapMarkerAlt, FaExclamationTriangle, FaList, FaMap, FaLayerGroup } from 'react-icons/fa';
import Map, { Marker, Popup, NavigationControl, FullscreenControl, Layer, Source } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const Traffic = () => {
    const [alerts, setAlerts] = useState([]);
    const { user } = useContext(AuthContext);
    const [selectedAlert, setSelectedAlert] = useState(null);
    const [viewMode, setViewMode] = useState('both'); // 'map', 'list', 'both'
    const [showTrafficLayer, setShowTrafficLayer] = useState(true);
    const [viewState, setViewState] = useState({
        longitude: 75.5762,
        latitude: 31.3260,
        zoom: 12
    });
    const mapRef = useRef();

    useEffect(() => {
        fetchTraffic();
    }, []);

    const fetchTraffic = async () => {
        try {
            const { data } = await api.get('/traffic');
            setAlerts(data);

            // Set map center to first alert if available
            if (data.length > 0 && data[0].latitude && data[0].longitude) {
                setViewState(prev => ({
                    ...prev,
                    longitude: data[0].longitude,
                    latitude: data[0].latitude
                }));
            }
        } catch (error) {
            console.error('Error fetching traffic:', error);
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical': return 'bg-red-500/10 border-red-500/50 text-red-500';
            case 'high': return 'bg-orange-500/10 border-orange-500/50 text-orange-500';
            case 'medium': return 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500';
            default: return 'bg-blue-500/10 border-blue-500/50 text-blue-500';
        }
    };

    const getMarkerColor = (severity) => {
        switch (severity) {
            case 'critical': return '#DC2626'; // Red
            case 'high': return '#EA580C'; // Orange
            case 'medium': return '#EAB308'; // Yellow
            default: return '#3B82F6'; // Blue
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this alert?')) {
            try {
                await api.delete(`/traffic/${id}`);
                setAlerts(alerts.filter(alert => alert._id !== id));
                if (selectedAlert?._id === id) {
                    setSelectedAlert(null);
                }
            } catch (error) {
                console.error('Error deleting alert:', error);
                alert('Failed to delete alert');
            }
        }
    };

    const handleResolve = async (id) => {
        try {
            await api.put(`/traffic/${id}`);
            setAlerts(alerts.filter(alert => alert._id !== id));
            if (selectedAlert?._id === id) {
                setSelectedAlert(null);
            }
        } catch (error) {
            console.error('Error resolving alert:', error);
        }
    };

    const onMarkerClick = (alert) => {
        setSelectedAlert(alert);
        setViewState(prev => ({
            ...prev,
            longitude: alert.longitude,
            latitude: alert.latitude,
            zoom: 14
        }));
    };

    const onListItemClick = (alert) => {
        if (alert.latitude && alert.longitude) {
            setViewState(prev => ({
                ...prev,
                longitude: alert.longitude,
                latitude: alert.latitude,
                zoom: 14
            }));
            setSelectedAlert(alert);
            if (viewMode === 'list') {
                setViewMode('both');
            }
        }
    };

    return (
        <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-primary">Traffic Updates</h1>

                {/* View Mode Toggle */}
                <div className="flex gap-2 bg-surface-elevated p-1 rounded-lg border border-white/10">
                    <button
                        onClick={() => setViewMode('map')}
                        className={`px-4 py-2 rounded-md transition-all flex items-center gap-2 font-medium ${viewMode === 'map'
                            ? 'bg-cyan-600 text-white shadow-lg'
                            : 'text-gray-400 hover:text-primary hover:bg-white/5'
                            }`}
                    >
                        <FaMap /> Map
                    </button>
                    <button
                        onClick={() => setViewMode('both')}
                        className={`px-4 py-2 rounded-md transition-all flex items-center gap-2 font-medium ${viewMode === 'both'
                            ? 'bg-cyan-600 text-white shadow-lg'
                            : 'text-gray-400 hover:text-primary hover:bg-white/5'
                            }`}
                    >
                        <FaMapMarkerAlt /> Both
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`px-4 py-2 rounded-md transition-all flex items-center gap-2 font-medium ${viewMode === 'list'
                            ? 'bg-cyan-600 text-white shadow-lg'
                            : 'text-gray-400 hover:text-primary hover:bg-white/5'
                            }`}
                    >
                        <FaList /> List
                    </button>
                </div>
            </div>

            {/* Legend */}
            <div className="mb-6 card-modern">
                <h3 className="text-primary font-semibold mb-2 flex items-center gap-2">
                    <FaExclamationTriangle /> Traffic Severity Legend
                </h3>
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-red-600"></div>
                        <span className="text-secondary text-sm">Critical</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-orange-600"></div>
                        <span className="text-secondary text-sm">High</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-yellow-600"></div>
                        <span className="text-secondary text-sm">Medium</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                        <span className="text-secondary text-sm">Low</span>
                    </div>
                </div>
            </div>

            <div className={`grid gap-6 ${viewMode === 'both' ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
                {/* Map View */}
                {(viewMode === 'map' || viewMode === 'both') && (
                    <div className="card-modern h-fit">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                                <FaMapMarkerAlt className="text-cyan-400" /> Traffic Map
                            </h2>
                            <button
                                onClick={() => setShowTrafficLayer(!showTrafficLayer)}
                                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${showTrafficLayer
                                    ? 'bg-cyan-600 text-white hover:bg-cyan-700'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                                title="Toggle Traffic Layer"
                            >
                                <FaLayerGroup /> {showTrafficLayer ? 'Hide' : 'Show'} Traffic
                            </button>
                        </div>
                        <div className="rounded-xl overflow-hidden border border-white/10" style={{ height: '600px' }}>
                            <Map
                                ref={mapRef}
                                {...viewState}
                                onMove={evt => setViewState(evt.viewState)}
                                mapStyle="mapbox://styles/mapbox/navigation-night-v1"
                                mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
                            >
                                <NavigationControl position="top-right" />
                                <FullscreenControl position="top-right" />

                                {/* Traffic Layer */}
                                {showTrafficLayer && (
                                    <Source
                                        id="mapbox-traffic"
                                        type="vector"
                                        url="mapbox://mapbox.mapbox-traffic-v1"
                                    >
                                        <Layer
                                            id="traffic-layer"
                                            type="line"
                                            source-layer="traffic"
                                            paint={{
                                                'line-width': 3,
                                                'line-color': [
                                                    'case',
                                                    ['==', ['get', 'congestion'], 'low'], '#4ade80',
                                                    ['==', ['get', 'congestion'], 'moderate'], '#facc15',
                                                    ['==', ['get', 'congestion'], 'heavy'], '#fb923c',
                                                    ['==', ['get', 'congestion'], 'severe'], '#ef4444',
                                                    '#3b82f6'
                                                ]
                                            }}
                                        />
                                    </Source>
                                )}

                                {/* Traffic Alert Markers */}
                                {alerts.map((alert) => (
                                    alert.latitude && alert.longitude && (
                                        <Marker
                                            key={alert._id}
                                            longitude={alert.longitude}
                                            latitude={alert.latitude}
                                            anchor="center"
                                            onClick={(e) => {
                                                e.originalEvent.stopPropagation();
                                                onMarkerClick(alert);
                                            }}
                                        >
                                            <div className="relative">
                                                {/* Pulsing ring for critical alerts */}
                                                {alert.severity === 'critical' && (
                                                    <div
                                                        className="absolute inset-0 rounded-full animate-ping"
                                                        style={{
                                                            backgroundColor: getMarkerColor(alert.severity),
                                                            opacity: 0.75,
                                                            width: '32px',
                                                            height: '32px',
                                                            left: '-4px',
                                                            top: '-4px'
                                                        }}
                                                    />
                                                )}
                                                {/* Main marker */}
                                                <div
                                                    className="cursor-pointer hover:scale-125 transition-all duration-200 relative z-10"
                                                    style={{
                                                        width: '28px',
                                                        height: '28px',
                                                        borderRadius: '50%',
                                                        backgroundColor: getMarkerColor(alert.severity),
                                                        border: '4px solid white',
                                                        boxShadow: `0 4px 12px ${getMarkerColor(alert.severity)}80, 0 0 20px ${getMarkerColor(alert.severity)}40`
                                                    }}
                                                >
                                                    <div
                                                        className="absolute inset-0 rounded-full"
                                                        style={{
                                                            background: `radial-gradient(circle at 30% 30%, ${getMarkerColor(alert.severity)}ff, ${getMarkerColor(alert.severity)}cc)`
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </Marker>
                                    )
                                ))}

                                {/* Info Popup */}
                                {selectedAlert && selectedAlert.latitude && selectedAlert.longitude && (
                                    <Popup
                                        longitude={selectedAlert.longitude}
                                        latitude={selectedAlert.latitude}
                                        anchor="bottom"
                                        onClose={() => setSelectedAlert(null)}
                                        closeButton={true}
                                        closeOnClick={false}
                                        className="traffic-popup"
                                    >
                                        <div className="p-4 max-w-sm bg-surface rounded-lg border border-white/10 shadow-xl">
                                            <div className="flex items-start gap-3 mb-3">
                                                <div
                                                    className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                                                    style={{
                                                        backgroundColor: getMarkerColor(selectedAlert.severity),
                                                        boxShadow: `0 0 10px ${getMarkerColor(selectedAlert.severity)}`
                                                    }}
                                                />
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-lg mb-1 text-primary">
                                                        {selectedAlert.location}
                                                    </h3>
                                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold uppercase ${selectedAlert.severity === 'critical' ? 'bg-red-600 text-white' :
                                                        selectedAlert.severity === 'high' ? 'bg-orange-600 text-white' :
                                                            selectedAlert.severity === 'medium' ? 'bg-yellow-600 text-white' :
                                                                'bg-blue-600 text-white'
                                                        }`}>
                                                        {selectedAlert.severity}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-secondary mb-3 leading-relaxed">
                                                {selectedAlert.description}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-muted border-t border-white/10 pt-2">
                                                <FaExclamationTriangle className="text-yellow-500" />
                                                <span>
                                                    Reported: {new Date(selectedAlert.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </Popup>
                                )}
                            </Map>
                        </div>
                    </div>
                )}

                {/* List View */}
                {(viewMode === 'list' || viewMode === 'both') && (
                    <div className={`space-y-4 ${viewMode === 'both' ? 'h-[670px] overflow-y-auto pr-2 scrollbar-none' : ''}`}>
                        <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                            <FaList className="text-cyan-400" /> Active Alerts ({alerts.length})
                        </h2>
                        {alerts.map((alert, index) => (
                            <motion.div
                                key={alert._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`card-modern border-l-4 ${getSeverityColor(alert.severity).replace('bg-', 'border-l-')} cursor-pointer hover:scale-[1.02]`}
                                onClick={() => onListItemClick(alert)}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                                        <FaMapMarkerAlt /> {alert.location}
                                    </h3>
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getSeverityColor(alert.severity)}`}>
                                            {alert.severity}
                                        </span>
                                        {user?.role === 'admin' && (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleResolve(alert._id);
                                                    }}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full transition-colors text-xs"
                                                    title="Mark as Resolved"
                                                >
                                                    Resolve
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(alert._id);
                                                    }}
                                                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
                                                    title="Delete"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <p className="text-lg text-secondary mb-2">{alert.description}</p>
                                {alert.latitude && alert.longitude && (
                                    <p className="text-sm text-muted mb-2">
                                        📍 Coordinates: {alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}
                                    </p>
                                )}
                                <p className="text-xs text-muted">
                                    Reported: {new Date(alert.createdAt).toLocaleString()}
                                </p>
                            </motion.div>
                        ))}
                        {alerts.length === 0 && (
                            <div className="text-center text-muted py-10 card-modern">
                                <FaMapMarkerAlt className="mx-auto text-4xl mb-4 opacity-50" />
                                <p>No traffic alerts at the moment. Drive safely!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Traffic;