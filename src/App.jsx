import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

function App() {
    const [step, setStep] = useState('question');
    const [answers, setAnswers] = useState({ place: '', food: '' });
    const [isNinja, setIsNinja] = useState(false);
    const [coords, setCoords] = useState({ left: 0, top: 0 });
    const btnRef = useRef(null);

    const BOT_TOKEN = '8315398408:AAFPrjEH-zAWTKd-oR8ZsFB_QlacAUtB9Cs';
    const CHAT_ID = '400442018';

    const moveButton = () => {
        if (!isNinja) {
            const rect = btnRef.current.getBoundingClientRect();
            setCoords({ left: rect.left, top: rect.top });
            setIsNinja(true);
        } else {
            const maxX = window.innerWidth - 120;
            const maxY = window.innerHeight - 60;
            setCoords({
                left: Math.max(20, Math.random() * maxX),
                top: Math.max(20, Math.random() * maxY),
            });
        }
    };

    const sendToTelegram = async (place, food) => {
        const message = `🎉 Новое свидание!%0AМесто: ${place}%0AЕда: ${food}`;
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${message}`);
    };

    const saveAnswer = (key, value) => {
        const updatedAnswers = { ...answers, [key]: value };
        setAnswers(updatedAnswers);
        if (key === 'food') {
            sendToTelegram(updatedAnswers.place, value);
            setStep('final');
        } else {
            setStep('food');
        }
    };

    return (
        <div className="wrapper">
            <div className="card">
                <AnimatePresence mode="wait">
                    {step === 'question' && (
                        <motion.div key="q" exit={{ opacity: 0 }}>
                            <h1>Пойдешь со мной на свидание? 🍵</h1>
                            <div className="buttons-container">
                                <button className="yes-btn" onClick={() => setStep('place')}>Да!</button>
                                <motion.button
                                    ref={btnRef}
                                    className="no-btn"
                                    style={{ 
                                        position: isNinja ? 'fixed' : 'relative', 
                                        zIndex: 1000,
                                        left: isNinja ? coords.left : 'auto',
                                        top: isNinja ? coords.top : 'auto'
                                    }}
                                    animate={{ left: coords.left, top: coords.top }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    onMouseEnter={moveButton}
                                >
                                    Нет
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {step === 'place' && (
                        <motion.div key="p" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h1>Где бы ты хотела посидеть?</h1>
                            <div className="options">
                                <button onClick={() => { setAnswers({ ...answers, place: 'Планетарий' }); setStep('food'); }}>Планетарий</button>
                                <button onClick={() => { setAnswers({ ...answers, place: 'Аптекарский огород' }); setStep('food'); }}>Аптекарский огород</button>
                                <button onClick={() => { setAnswers({ ...answers, place: 'Ботанический сад' }); setStep('food'); }}>Ботанический сад</button>
                                <button onClick={() => { setAnswers({ ...answers, place: 'Квест' }); setStep('food'); }}>Квест</button>
                                <button onClick={() => { setAnswers({ ...answers, place: 'ТОТ САМЫЙ МУЗЕЙ ИЗ ВИДОСА' }); setStep('food'); }}>ТОТ САМЫЙ МУЗЕЙ ИЗ ВИДОСА</button>
                            </div>
                        </motion.div>
                    )}

                    {step === 'food' && (
                        <motion.div key="f" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h1>Что будем есть вечером?</h1>
                            <div className="options">
                                <button onClick={() => saveAnswer('food', 'Стейк')}>Стейк</button>
                                <button onClick={() => saveAnswer('food', 'Курица с ананасом')}>Курица с ананасом</button>
                                <button onClick={() => saveAnswer('food', 'Суп')}>Суп</button>
                                <button onClick={() => saveAnswer('food', 'Пицца')}>Пицца</button>
                                <button onClick={() => saveAnswer('food', 'Роллы')}>Роллы</button>
                                <button onClick={() => saveAnswer('food', 'Синабоны')}>Синабоны</button>
                            </div>
                        </motion.div>
                    )}

                    {step === 'final' && (
                        <motion.h1 key="final" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            Ура! Договорились! ❤️
                        </motion.h1>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default App;