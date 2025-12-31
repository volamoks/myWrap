import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Copy, FileText, CheckCircle, Smartphone, Lock, AlertCircle, HelpCircle } from 'lucide-react';
import { encodeConfig } from '../utils/encoding';

const DEFAULT_JSON = [
    {
        "id": 1,
        "type": "welcome",
        "title": "2025",
        "subtitle": "Ready? Then swipe",
        "icon": "✨",
        "theme": "red",
        "duration": 5000
    },
    {
        "id": 2,
        "type": "stat",
        "title": "1464",
        "value": "1464",
        "description": "Hours we've been together. Let's move on",
        "theme": "blue",
        "duration": 6000
    },
    {
        "id": 3,
        "type": "stat",
        "title": "We went on",
        "value": "42",
        "description": "Dates. Even more await us ahead",
        "theme": "green",
        "duration": 6000
    },
    {
        "id": 4,
        "type": "quiz",
        "title": "We sent so many cat stickers. Guess how many?",
        "options": [
            { "text": "150", "correct": false },
            { "text": "342", "correct": true },
            { "text": "89", "correct": false }
        ],
        "theme": "yellow",
        "duration": 10000
    },
    {
        "id": 5,
        "type": "list",
        "title": "Our moments",
        "items": [
            { "label": "Trips", "value": "12" },
            { "label": "Movies", "value": "48" },
            { "label": "Songs", "value": "156" }
        ],
        "theme": "purple",
        "duration": 8000
    },
    {
        "id": 6,
        "type": "quiz",
        "title": "Most frequent phrase. Guess?",
        "options": [
            { "text": "I love you", "correct": false },
            { "text": "What shall we eat?", "correct": true },
            { "text": "Where are the keys?", "correct": false }
        ],
        "theme": "red",
        "duration": 10000
    },
    {
        "id": 7,
        "type": "photo-grid",
        "title": "How it started...",
        "description": "First steps",
        "images": [
            "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&auto=format&fit=crop"
        ],
        "theme": "blue",
        "duration": 7000
    },
    {
        "id": 8,
        "type": "photo-grid",
        "title": "How it's going...",
        "description": "And this is just the beginning",
        "images": [
            "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1523307730650-5945347f3911?w=800&auto=format&fit=crop"
        ],
        "theme": "green",
        "duration": 7000
    },
    {
        "id": 9,
        "type": "list",
        "title": "Top Vibes",
        "items": [
            { "label": "Late night talks", "value": "∞" },
            { "label": "Top share moment", "value": "quiet walks" },
            { "label": "Our top activity", "value": "holding hands" }
        ],
        "theme": "purple",
        "duration": 8000
    },
    {
        "id": 10,
        "type": "summary",
        "stats": [
            { "label": "Dates", "value": "42" },
            { "label": "Hours together", "value": "1464" },
            { "label": "Cats", "value": "342" }
        ],
        "theme": "yellow",
        "duration": 10000
    },
    {
        "id": 11,
        "type": "quote",
        "title": "I don’t know what 2026 will bring.",
        "subtitle": "But I like the idea of discovering it with you.",
        "theme": "black",
        "duration": 10000
    }
];

export default function AdminPage() {
    const [jsonInput, setJsonInput] = useState('// Loading current template...');
    const [pin, setPin] = useState('2025');
    const [generatedLink, setGeneratedLink] = useState('');
    const [error, setError] = useState(null);
    const [copySuccess, setCopySuccess] = useState('');

    useEffect(() => {
        setJsonInput(JSON.stringify(DEFAULT_JSON, null, 2));
    }, []);

    const handleGenerate = () => {
        try {
            setError(null);
            // Parse JSON to validate
            const parsed = JSON.parse(jsonInput);
            if (!Array.isArray(parsed)) throw new Error("JSON must be an array of slides");

            const config = {
                pin: pin,
                stories: parsed
            };

            const encoded = encodeConfig(config);

            if (!encoded) throw new Error("Encoding error");

            // Robust URL generation that handles subpaths (e.g., GitHub Pages)
            const url = new URL(window.location.href.split('?')[0]);
            url.searchParams.set('d', encoded);
            const finalUrl = url.toString();

            setGeneratedLink(finalUrl);

            // Auto copy
            navigator.clipboard.writeText(finalUrl);
            alert('Link created and copied! 📋');

        } catch (err) {
            setError('Error! Could not parse text.');
            console.error(err);
        }
    };

    const copyToClipboard = () => {
        if (!generatedLink) return;
        navigator.clipboard.writeText(generatedLink);
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
        alert('Link copied!');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans text-gray-800">
            <div className="max-w-4xl mx-auto">
                <header className="mb-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2 tracking-tight">
                        Wrapped Builder 🎁
                    </h1>
                    <p className="text-center mb-8 text-gray-500 font-medium">Create your love story</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Config */}
                    <div className="flex flex-col gap-6">

                        {/* PIN Configuration */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Set your PIN code 🔒</label>
                            <input
                                type="text"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                className="w-full text-3xl font-black tracking-[0.5em] text-center border-b-2 border-gray-200 focus:border-black outline-none py-2 transition-colors"
                                maxLength={4}
                            />
                        </div>

                        {/* JSON Editor */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex-grow flex flex-col">
                            <div className="flex justify-between items-center mb-4">
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">Configuration (JSON)</label>
                                <a
                                    href="https://jsonlint.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                                >
                                    <HelpCircle size={12} />
                                    <span>ℹ️ How to fill?</span>
                                </a>
                            </div>

                            <textarea
                                value={jsonInput}
                                onChange={(e) => setJsonInput(e.target.value)}
                                className="w-full h-96 font-mono text-sm bg-gray-50 p-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none transition-all"
                                spellCheck="false"
                            />
                            <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                                <strong>Hint:</strong> Theme colors (theme): <code>red</code>, <code>blue</code>, <code>green</code>, <code>yellow</code>, <code>purple</code>.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Actions & Preview */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                            <h2 className="text-xl font-bold font-display text-gray-800 mb-4">How it works?</h2>
                            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                                <li>Edit the JSON on the left (add your photos/texts).</li>
                                <li>Set a PIN code (for the start screen).</li>
                                <li>Click <b>"Generate Link"</b>.</li>
                                <li>Send the link to your special someone! 💌</li>
                            </ol>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleGenerate}
                            className="w-full py-5 bg-black text-white rounded-xl font-bold uppercase tracking-widest shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 text-lg"
                        >
                            <Save size={20} />
                            <span className="relative z-10">Create Link & Send</span>
                        </motion.button>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2"
                            >
                                <AlertCircle size={16} />
                                {error}
                            </motion.div>
                        )}

                        {generatedLink && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-green-50 p-6 rounded-2xl border border-green-100"
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <CheckCircle className="text-green-600" size={20} />
                                    <p className="text-sm font-bold text-green-800">Link ready! You can send it</p>
                                </div>

                                <div
                                    className="bg-white p-3 rounded-lg border border-green-200 text-xs text-gray-500 break-all cursor-pointer hover:bg-gray-50 transition-colors relative group"
                                    onClick={copyToClipboard}
                                >
                                    {generatedLink.slice(0, 100)}...
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                        <Copy size={16} className="text-black" />
                                    </div>
                                </div>

                                <button
                                    onClick={copyToClipboard}
                                    className="mt-4 w-full py-3 bg-green-600 text-white rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    {copySuccess ? <CheckCircle size={16} /> : <Copy size={16} />}
                                    {copySuccess || 'Copy'}
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
