import { useEffect, useState } from 'react';
import { FaMoon, FaSun } from "react-icons/fa";

interface ThemeToggleProps {
  className?: string; 
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
    const [dark, setDark] = useState(
        localStorage.getItem("theme") === "dark"
    );

    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [dark]);

    return (
        <button
            onClick={() => setDark(!dark)}
            className={`p-2 rounded-full -mx-1 bg-gray-200 dark:bg-gray-700 transition ${className}`}
        >
            {dark ? (
                <FaMoon className="text-yellow-400 w-4 h-4"/> 
            ) : (
                <FaSun className="text-yellow-400 w-4 h-4"/>
            )}
        </button>
    )
}

export default ThemeToggle;