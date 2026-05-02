import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FaCheck, FaTimes, FaMapMarkerAlt } from 'react-icons/fa';

const Reports = () => {
    const [reports, setReports] = useState([]);
    const [type, setType] = useState('infrastructure');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [severity, setSeverity] = useState('medium');
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [viewState, setViewState] = useState({
        longitude: 75.5762,
        latitude: 31.3260,
        zoom: 12
    });

    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const { data } = await api.get('/reports');
            setReports(data);
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (type === 'traffic' && (!latitude || !longitude)) {
            alert('Please select a location on the map for traffic reports.');
            return;
        }

        try {
            const reportData = {
                type,
                description,
                location,
                ...(type === 'traffic' && {
                    severity,
                    latitude,
                    longitude
                })
            };

            await api.post('/reports', reportData);
            fetchReports();
            setDescription('');
            setLocation('');
            setLatitude(null);
            setLongitude(null);
            alert('Report submitted successfully!');
        } catch (error) {
            console.error('Error submitting report:', error);
            alert(error.response?.data?.message || 'Failed to submit report');
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.put(`/reports/${id}`, { status });
            fetchReports();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const onMapClick = (e) => {
        setLatitude(e.lngLat.lat);
        setLongitude(e.lngLat.lng);
    };

    return (
        <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-primary mb-8">Report an Issue</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Submission Form */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-1 card-modern h-fit"
                >
                    <h2 className="text-xl font-bold text-cyan-500 mb-4">New Report</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-secondary mb-1">Type</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full input-modern"
                            >
                                <option value="infrastructure">Infrastructure</option>
                                <option value="crime">Crime</option>
                                <option value="cleanliness">Cleanliness</option>
                                <option value="traffic">Traffic</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        {type === 'traffic' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-secondary mb-1">Severity</label>
                                    <select
                                        value={severity}
                                        onChange={(e) => setSeverity(e.target.value)}
                                        className="w-full input-modern"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="critical">Critical</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-secondary mb-1">Pick Location on Map</label>
                                    <div className="h-48 rounded-lg overflow-hidden border border-white/10">
                                        <Map
                                            {...viewState}
                                            onMove={evt => setViewState(evt.viewState)}
                                            mapStyle="mapbox://styles/mapbox/streets-v11"
                                            mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
                                            onClick={onMapClick}
                                            cursor="crosshair"
                                        >
                                            {latitude && longitude && (
                                                <Marker longitude={longitude} latitude={latitude} color="red" />
                                            )}
                                        </Map>
                                    </div>
                                    {latitude && longitude && (
                                        <p className="text-xs text-green-500 mt-1">
                                            Selected: {latitude.toFixed(4)}, {longitude.toFixed(4)}
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        <div>
                            <label className="block text-secondary mb-1">Location Name</label>
                            <input
                                type="text"
                                required
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="input-modern"
                                placeholder="e.g., Main Street, Near Park"
                            />
                        </div>
                        <div>
                            <label className="block text-secondary mb-1">Description</label>
                            <textarea
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="input-modern h-32"
                                placeholder="Describe the issue in detail..."
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full btn-primary font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-cyan-500/25"
                        >
                            Submit Report
                        </button>
                    </form>
                </motion.div>

                {/* Reports List */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold text-primary mb-4">Recent Reports</h2>
                    <div className="lg:h-[800px] overflow-y-auto scrollbar-none space-y-4 pr-2">
                        {reports.map((report, index) => (
                            <motion.div
                                key={report._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="card-modern flex flex-col sm:flex-row justify-between items-start gap-4"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${report.type === 'crime' ? 'bg-red-900/20 text-red-400' :
                                            report.type === 'traffic' ? 'bg-orange-900/20 text-orange-400' :
                                                report.type === 'infrastructure' ? 'bg-yellow-900/20 text-yellow-400' :
                                                    'bg-blue-900/20 text-blue-400'
                                            }`}>
                                            {report.type}
                                        </span>
                                        {report.severity && (
                                            <span className="px-2 py-1 rounded text-xs font-bold uppercase bg-gray-700/50 text-gray-300">
                                                Severity: {report.severity}
                                            </span>
                                        )}
                                        <span className="text-muted text-sm">{new Date(report.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-primary mb-1 flex items-center gap-2">
                                        {report.location}
                                        {report.latitude && report.longitude && <FaMapMarkerAlt className="text-gray-500 text-xs" />}
                                    </h3>
                                    <p className="text-secondary mb-2">{report.description}</p>
                                    <p className="text-xs text-muted">Reported by: {report.user?.name || 'Unknown'}</p>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${report.status === 'resolved' || report.status === 'approved' ? 'bg-green-900/20 text-green-400' :
                                        report.status === 'rejected' ? 'bg-red-900/20 text-red-400' :
                                            report.status === 'investigating' ? 'bg-orange-900/20 text-orange-400' :
                                                'bg-gray-700/20 text-gray-400'
                                        }`}>
                                        {report.status}
                                    </span>

                                    {user?.role === 'admin' && report.status === 'pending' && (
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                onClick={() => handleUpdateStatus(report._id, 'approved')}
                                                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm flex items-center gap-1 transition-colors"
                                                title="Approve"
                                            >
                                                <FaCheck /> Approve
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(report._id, 'rejected')}
                                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm flex items-center gap-1 transition-colors"
                                                title="Reject"
                                            >
                                                <FaTimes /> Reject
                                            </button>
                                        </div>
                                    )}
                                    {user?.role === 'admin' && report.status !== 'pending' && report.status !== 'resolved' && report.status !== 'rejected' && (
                                        <button
                                            onClick={() => handleUpdateStatus(report._id, 'resolved')}
                                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                                        >
                                            Mark Resolved
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                        {reports.length === 0 && (
                            <div className="text-center text-muted py-10">No reports found.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
