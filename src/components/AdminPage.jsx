import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Copy, FileText, CheckCircle, Smartphone, Lock, AlertCircle, HelpCircle } from 'lucide-react';
import { compressToEncodedURIComponent } from 'lz-string';

const DEFAULT_JSON = [
    {
        "id": 1,
        "type": "welcome",
        "title": "Hello!",
        "subtitle": "Text below title",
        "icon": "✨",
        "theme": "red",
        "duration": 5000,
        desc: "First slide with greeting"
    },
    {
        "id": 2,
        "type": "stat",
        "title": "Dates",
        "value": "42",
        "description": "Number description",
        "theme": "blue",
        "duration": 6000,
        desc: "Large number with description"
    },
    {
        "id": 3,
        "type": "quiz",
        "title": "Question?",
        "options": [
            { "text": "Yes", "correct": true },
            { "text": "No", "correct": false }
        ],
        "theme": "yellow",
        "duration": 10000,
        desc: "Quiz with options"
    },
    {
        "id": 4,
        "type": "list",
        "title": "Our Tops",
        "items": [
            { "label": "Food", "value": "Pizza" },
            { "label": "Movie", "value": "Dune" }
        ],
        "theme": "purple",
        "duration": 8000,
        desc: "List of facts"
    },
    {
        "id": 5,
        "type": "photo-grid",
        "title": "Header",
        "description": "Caption",
        "images": [
            "https://img.freepik.com/free-photo/beautiful-anime-character-cartoon-scene_23-2151035165.jpg",
            "https://img.freepik.com/free-photo/anime-style-clouds_23-2151071680.jpg"
        ],
        "theme": "blue",
        "duration": 7000,
        desc: "Photo grid (2-3 photos)"
    },
    {
        "id": 6,
        "type": "quote",
        "title": "Header",
        "subtitle": "Caption",
        "theme": "black",
        "duration": 10000,
        desc: "Quote with Replay button"
    },
    {
        "id": 7,
        "type": "summary",
        "title": "Recap",
        "stats": [
            { "label": "Total", "value": "100" },
            { "label": "Pizza eaten", "value": "20" }
        ],
        "theme": "yellow",
        "duration": 10000,
        desc: "Final stats (list)"
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

            const jsonString = JSON.stringify(config);
            const encoded = compressToEncodedURIComponent(jsonString);

            if (!encoded) throw new Error("Encoding error");

            const url = `${window.location.origin}/?data=${encoded}`;
            setGeneratedLink(url);

            // Auto copy
            navigator.clipboard.writeText(url);
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
