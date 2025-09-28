import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from 'react';
const AppContext = createContext(null);
export const useApp = () => {
    const context = useContext(AppContext);
    if (!context)
        throw new Error('useApp must be used within AppProvider');
    return context;
};
export const AppProvider = ({ children }) => {
    const [currentPage, setCurrentPage] = useState('home');
    const [selectedModel, setSelectedModel] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const value = { currentPage, setCurrentPage, selectedModel, setSelectedModel, isLoggedIn, setIsLoggedIn };
    return _jsx(AppContext.Provider, { value: value, children: children });
};
