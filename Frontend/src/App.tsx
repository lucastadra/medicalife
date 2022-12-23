import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { GlobalStyle } from './styles/global';
import { PatientsProvider } from './hooks/usePatients';
import { ToastContainer } from 'react-toastify';

export function App() {
    return (
        <PatientsProvider>
            <GlobalStyle />
            <Header />
            <Dashboard />
            <ToastContainer autoClose={3000} />
        </PatientsProvider>
    );
}
