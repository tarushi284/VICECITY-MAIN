import { useEffect, useMemo, useState, memo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useTheme } from "../context/ThemeContext";

const ParticlesBackground = () => {
    // ... component logic remains same
    const [init, setInit] = useState(false);
    const { isDark } = useTheme();

    // this should be run only once per application lifetime
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const options = useMemo(
        () => ({
            background: {
                color: {
                    value: "transparent",
                },
            },
            fpsLimit: 120,
            interactivity: {
                events: {
                    onClick: {
                        enable: true,
                        mode: "push",
                    },
                    onHover: {
                        enable: true,
                        mode: "grab",
                    },
                },
                modes: {
                    push: {
                        quantity: 6,
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4,
                    },
                    grab: {
                        distance: 200,
                        links: {
                            opacity: 0.5
                        }
                    },
                },
            },
            particles: {
                color: {
                    value: isDark
                        ? ["#06b6d4", "#3b82f6", "#a855f7"] // Cyan, Blue, Purple (Neon/Dark)
                        : ["#0891b2", "#2563eb", "#7c3aed"], // Darker Cyan, Blue, Purple (Light)
                },
                links: {
                    color: isDark ? "#ffffff" : "#000000",
                    distance: 150,
                    enable: true,
                    opacity: 0.2, // Reduced opacity for cleaner look with colored particles
                    width: 1,
                },
                move: {
                    direction: "none",
                    enable: true,
                    outModes: {
                        default: "bounce",
                    },
                    random: false,
                    speed: 1,
                    straight: false,
                },
                number: {
                    density: {
                        enable: true,
                        area: 800,
                    },
                    value: 80,
                },
                opacity: {
                    value: 0.8,
                },
                shape: {
                    type: "circle",
                },
                size: {
                    value: { min: 1, max: 3 },
                },
            },
            detectRetina: true,
        }),
        [isDark],
    );

    if (init) {
        return (
            <Particles
                id="tsparticles"
                particlesLoaded={null}
                options={options}
                className="absolute inset-0"
            />
        );
    }

    return <></>;
};

export default memo(ParticlesBackground);
