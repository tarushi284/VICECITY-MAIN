import { FaTwitter, FaLinkedin, FaGithub, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="relative bg-black/90 backdrop-blur-xl border-t border-white/10 text-white pt-16 pb-8 overflow-hidden z-20">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="text-3xl">🏙️</span>
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                                Smart City
                            </h2>
                        </div>
                        <p className="text-gray-400 leading-relaxed">
                            Empowering citizens with real-time insights, smart services, and seamless connectivity.
                            Building the future of urban living, together.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <span className="w-8 h-1 bg-cyan-500 rounded-full"></span> Quick Links
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-cyan-400 transition-colors"></span>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard" className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-cyan-400 transition-colors"></span>
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link to="/attractions" className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-cyan-400 transition-colors"></span>
                                    Attractions
                                </Link>
                            </li>
                            <li>
                                <Link to="/events" className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-cyan-400 transition-colors"></span>
                                    Events
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <span className="w-8 h-1 bg-purple-500 rounded-full"></span> Services
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/bills" className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-purple-400 transition-colors"></span>
                                    Bill Payments
                                </Link>
                            </li>
                            <li>
                                <Link to="/reports" className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-purple-400 transition-colors"></span>
                                    Submit Report
                                </Link>
                            </li>
                            <li>
                                <Link to="/traffic" className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-purple-400 transition-colors"></span>
                                    Traffic Updates
                                </Link>
                            </li>
                            <li>
                                <Link to="/weather" className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-purple-400 transition-colors"></span>
                                    Weather Info
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <span className="w-8 h-1 bg-green-500 rounded-full"></span> Connect
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-400">
                                <FaMapMarkerAlt className="mt-1 text-green-500 shrink-0" />
                                <span>123 Innovation Drive,<br /> Smart City, SC 90210</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <FaEnvelope className="text-green-500 shrink-0" />
                                <a href="mailto:support@smartcity.com" className="hover:text-green-400 transition-colors">support@smartcity.com</a>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <FaPhone className="text-green-500 shrink-0" />
                                <a href="tel:+1234567890" className="hover:text-green-400 transition-colors">+1 (234) 567-890</a>
                            </li>
                        </ul>
                        <div className="mt-6 flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 flex items-center justify-center transition-all border border-white/10 hover:border-cyan-500/50">
                                <FaTwitter size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-blue-600/20 text-gray-400 hover:text-blue-500 flex items-center justify-center transition-all border border-white/10 hover:border-blue-600/50">
                                <FaLinkedin size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-purple-600/20 text-gray-400 hover:text-purple-500 flex items-center justify-center transition-all border border-white/10 hover:border-purple-600/50">
                                <FaGithub size={18} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 mt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Smart City Platform. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
