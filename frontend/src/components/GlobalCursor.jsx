import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const GlobalCursor = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Mouse position state
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Smooth spring animation for the trailing cursor
    const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            setIsVisible(true);
        };

        const handleMouseDown = () => setIsHovered(true);
        const handleMouseUp = () => setIsHovered(false);

        const handleMouseEnter = () => setIsHovered(true);
        const handleMouseLeave = () => setIsHovered(false);

        // Attach event listeners for hover state on interactive elements
        const attachHoverListeners = () => {
            const hoverables = document.querySelectorAll(
                'a, button, input, textarea, select, .cursor-pointer'
            );

            hoverables.forEach((el) => {
                el.addEventListener("mouseenter", handleMouseEnter);
                el.addEventListener("mouseleave", handleMouseLeave);
            });

            return () => {
                hoverables.forEach((el) => {
                    el.removeEventListener("mouseenter", handleMouseEnter);
                    el.removeEventListener("mouseleave", handleMouseLeave);
                });
            };
        };

        // Initial attach
        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);

        // Re-attach listeners when DOM changes (simple observer for SPA)
        const observer = new MutationObserver(attachHoverListeners);
        observer.observe(document.body, { childList: true, subtree: true });

        let cleanupHover = attachHoverListeners();

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
            observer.disconnect();
            cleanupHover();
        };
    }, [cursorX, cursorY]);

    // Don't render on touch devices
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
        return null;
    }

    return (
        <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
            {/* Main Dot Cursor */}
            <motion.div
                className="fixed top-0 left-0 bg-cyan-500 rounded-full mix-blend-difference pointer-events-none"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    width: isHovered ? 8 : 8,
                    height: isHovered ? 8 : 8,
                    opacity: isVisible ? 1 : 0,
                }}
            />

            {/* Trailing Ring Cursor */}
            <motion.div
                className="fixed top-0 left-0 border-2 border-cyan-500 rounded-full mix-blend-difference pointer-events-none will-change-transform"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    width: isHovered ? 48 : 32,
                    height: isHovered ? 48 : 32,
                    opacity: isVisible ? 1 : 0,
                    backgroundColor: isHovered ? "rgba(6, 182, 212, 0.1)" : "transparent",
                    borderColor: isHovered ? "rgba(6, 182, 212, 0.5)" : "rgba(6, 182, 212, 1)",
                }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 28,
                }}
            />
        </div>
    );
};

export default GlobalCursor;
