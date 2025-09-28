import { jsx as _jsx } from "react/jsx-runtime";
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import AppLayout from './layout/AppLayout';
const App = () => {
    return (_jsx(AuthProvider, { children: _jsx(AppProvider, { children: _jsx(Router, { children: _jsx(AppLayout, {}) }) }) }));
};
export default App;
