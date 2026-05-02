import { Outlet } from "react-router-dom";
import ParticlesBackground from "./ParticlesBackground";

const AuthLayout = () => {
    return (
        <div className="min-h-screen relative overflow-hidden">
            <ParticlesBackground />
            <div className="relative z-10 w-full h-full">
                <Outlet />
            </div>
        </div>
    );
}

export default AuthLayout;
