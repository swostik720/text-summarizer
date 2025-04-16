import React from 'react';
import { motion } from 'framer-motion'; // Import Framer Motion for animation

const Welcome = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-500 to-indigo-700 text-white">
            {/* Hero Section */}
            <main className="flex-1 flex items-center justify-center py-12 px-8">
                <motion.div
                    className="max-w-3xl text-center space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <motion.img
                        src="icon.jpg"
                        alt="Icon"
                        className="w-24 mx-auto mb-6"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.8 }}
                    />
                    <h1 className="text-6xl font-extrabold text-white drop-shadow-md mb-4">
                        Welcome to Text Summarizer
                    </h1>
                    <p className="text-lg text-gray-100 mt-4 leading-relaxed mb-6">
                        A powerful tool to help you summarize long articles and text in seconds. Make the most out of your time!
                    </p>
                    
                    {/* Call-to-Action Buttons */}
                    <div className="space-x-4">
                        <a
                            href="/login"
                            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg text-xl font-semibold transition-all hover:bg-blue-500"
                        >
                            Get Started
                        </a>
                    </div>
                </motion.div>
            </main>

            {/* Footer Section (optional) */}
            <footer className="py-4 text-center text-gray-300">
                <p>&copy; 2025 Text Summarizer. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Welcome;
