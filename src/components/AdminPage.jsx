import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { encodeConfig } from '../utils/encoding';
import Snowfall from './Snowfall';

const SCHEMA_DOCS = [
    {
        type: "welcome",
        desc: "Первый слайд с приветствием",
        example: `{
  "type": "welcome",
  "title": "Привет!",
  "subtitle": "Текст под заголовком",
  "theme": "red"
}`
    },
    {
        type: "stat",
        desc: "Крупная цифра с описанием",
        example: `{
  "type": "stat",
  "title": "Свидания",
  "value": "42",
  "description": "Описание цифры",
  "theme": "blue"
}`
    },
    {
        type: "quiz",
        desc: "Викторина с вариантами",
        example: `{
  "type": "quiz",
  "title": "Вопрос?",
  "options": [
    { "text": "Да", "correct": true },
    { "text": "Нет", "correct": false }
  ],
  "theme": "yellow"
}`
    },
    {
        type: "list",
        desc: "Список фактов",
        example: `{
  "type": "list",
  "title": "Наши топы",
  "items": [
    { "label": "Еда", "value": "Пицца" },
    { "label": "Фильм", "value": "Дюна" }
  ],
  "theme": "purple"
}`
    },
    {
        type: "photo-grid",
        desc: "Сетка фотографий (2-3 фото)",
        example: `{
  "type": "photo-grid",
  "title": "Заголовок",
  "description": "Подпись",
  "images": [
    "ссылка_на_фото_1",
    "ссылка_на_фото_2"
  ],
  "theme": "yellow"
}`
    },
    {
        type: "quote",
        desc: "Цитата с кнопкой Replay",
        example: `{
  "type": "quote",
  "title": "Заголовок",
  "subtitle": "Подпись",
  "theme": "black"
}`
    },
    {
        type: "summary",
        desc: "Финальная статистика (список)",
        example: `{
  "type": "summary",
  "title": "Итоги",
  "stats": [
    { "label": "Всего", "value": "100" },
    { "label": "Ели пиццу", "value": "20" }
  ],
  "theme": "purple"
}`
    }
];

function SchemaHelp({ onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-bold font-display text-gray-800">Как заполнять JSON?</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-500">✕</button>
                </div>
                <div className="p-6 overflow-y-auto space-y-8 text-left">
                    {SCHEMA_DOCS.map((doc, i) => (
                        <div key={i} className="border-b last:border-0 pb-6 last:pb-0 border-gray-100">
                            <div className="flex items-baseline gap-3 mb-2">
                                <span className="px-2 py-1 bg-accent-purple/10 text-accent-purple rounded-md font-mono text-sm font-bold">{doc.type}</span>
                                <span className="text-gray-600 font-medium">{doc.desc}</span>
                            </div>
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl text-xs overflow-x-auto font-mono">
                                {doc.example}
                            </pre>
                        </div>
                    ))}
                    <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800">
                        <strong>Подсказка:</strong> Цвета тем (theme): <code>red</code>, <code>blue</code>, <code>green</code>, <code>yellow</code>, <code>purple</code>.
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminPage() {
    const [jsonInput, setJsonInput] = useState('// Загрузка актуального шаблона...');
    const [pin, setPin] = useState('2024');
    const [generatedLink, setGeneratedLink] = useState('');
    const [error, setError] = useState('');
    const [showHelp, setShowHelp] = useState(false);

    React.useEffect(() => {
        fetch('/config.json')
            .then(res => res.json())
            .then(data => setJsonInput(JSON.stringify(data, null, 4)))
            .catch(err => {
                console.error("Config fetch error:", err);
                setJsonInput('[]');
            });
    }, []);

    const generateLink = () => {
        try {
            let parsed;
            try {
                parsed = JSON.parse(jsonInput);
            } catch (e) {
                try {
                    // eslint-disable-next-line no-new-func
                    const looseJson = new Function("return " + jsonInput)();
                    parsed = looseJson;
                    setJsonInput(JSON.stringify(parsed, null, 4));
                } catch (e2) {
                    throw new Error("Невалидный JSON или JS объект");
                }
            }

            const payload = { pin, stories: parsed };
            const encoded = encodeConfig(payload);
            if (!encoded) throw new Error("Ошибка кодирования");

            const url = `${window.location.origin}/?d=${encoded}`;
            setGeneratedLink(url);
            setError('');
            navigator.clipboard.writeText(url);
            alert('Ссылка создана и скопирована! 📋');
        } catch (e) {
            setError('Ошибка! Не удалось разобрать текст.');
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedLink);
        alert('Ссылка скопирована!');
    };

    return (
        <div className="h-full w-full bg-pastel-cream p-4 md:p-8 font-body text-text-soft overflow-y-auto relative">
            <Snowfall />
            {showHelp && <SchemaHelp onClose={() => setShowHelp(false)} />}

            <div className="max-w-3xl mx-auto z-10 relative bg-white/90 backdrop-blur-xl p-6 md:p-10 rounded-3xl shadow-2xl border border-white/50 mb-20 text-left">
                <h1 className="text-3xl md:text-4xl font-display font-black mb-2 text-center bg-gradient-to-r from-accent-purple to-accent-blue bg-clip-text text-transparent">
                    Конструктор Wrapped 🎁
                </h1>
                <p className="text-center mb-8 text-gray-500 font-medium">Создай свою историю любви</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Установи свой Пин-код для входа 🔒</label>
                        <input
                            type="text"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            maxLength="4"
                            className="w-full text-center font-display font-bold text-3xl tracking-[0.5em] text-accent-purple focus:outline-none placeholder-gray-200"
                            placeholder="0000"
                        />
                    </div>
                </div>

                <div className="mb-6 relative">
                    <div className="flex justify-between items-end mb-3">
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">Конфигурация (JSON)</label>
                        <button
                            onClick={() => setShowHelp(true)}
                            className="text-xs font-bold text-accent-blue hover:underline flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full border border-blue-100"
                        >
                            <span>ℹ️ Как заполнять?</span>
                        </button>
                    </div>
                    <div className="relative group">
                        <textarea
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                            className="w-full h-[500px] p-6 rounded-2xl border-2 border-gray-100 bg-gray-50 font-mono text-xs leading-relaxed focus:outline-none focus:border-accent-purple focus:bg-white transition-all resize-none shadow-inner text-gray-600 group-hover:border-gray-200"
                            spellCheck="false"
                        />
                        {error && (
                            <div className="absolute bottom-4 left-4 right-4 bg-red-100/90 backdrop-blur text-red-600 text-xs font-bold p-3 rounded-xl border border-red-200 animate-pulse">
                                ⚠️ {error}
                            </div>
                        )}
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.01, translateY: -2 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={generateLink}
                    className="w-full py-5 bg-gradient-to-r from-accent-purple to-accent-blue text-white font-bold rounded-2xl shadow-lg shadow-accent-purple/20 text-xl tracking-wide hover:shadow-xl transition-all relative overflow-hidden"
                >
                    <span className="relative z-10">Создай Ссылку и отправь ее </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full hover:translate-y-0 transition-transform duration-300" />
                </motion.button>

                {generatedLink && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-6 overflow-hidden"
                    >
                        <div className="bg-green-50 border border-green-200 p-4 rounded-2xl flex items-center gap-4">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl">✅</div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-green-800">Ссылка готова! Можно отправлять</p>
                                <p className="text-xs text-green-600 truncate">{generatedLink}</p>
                            </div>
                            <button onClick={copyToClipboard} className="text-xs font-bold bg-white px-3 py-2 rounded-lg border border-green-200 shadow-sm text-green-700 hover:bg-green-50">
                                Скопировать
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>

            <div className="h-20" />
        </div>
    );
}
