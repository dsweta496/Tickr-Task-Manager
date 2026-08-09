import React, { useEffect, useState } from "react";

const ScrollToTop = () => {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowButton(window.scrollY > 300);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    if (!showButton) {
        return null;
    }

    return (
        <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="
                fixed
                bottom-6
                right-6
                z-50
                w-11
                h-11
                rounded-full
                bg-tickr-primary
                text-white
                shadow-lg
                flex
                items-center
                justify-center
                text-xl
                hover:bg-gray-800
                hover:shadow-xl
                transition
                duration-200
                cursor-pointer
            "
        >
            ↑
        </button>
    );
};

export default ScrollToTop;