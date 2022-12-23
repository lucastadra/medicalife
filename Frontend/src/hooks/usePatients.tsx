import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';
import { api } from '../services/api';
import { toast } from 'react-toastify';
import { Patient } from '../shared/types';

type NewPatient = Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>;

interface PatientsProviderProps {
    children: ReactNode;
}

interface PatientsContextData {
    patients: Patient[];
    isLoading: boolean;
    createPatient: (patient: NewPatient) => Promise<void>;
    updatePatient: (patient: Patient) => Promise<void>;
    deletePatient: (patientId: string) => Promise<void>;
}

const PatientsContext = createContext<PatientsContextData>(
    {} as PatientsContextData
);

export function PatientsProvider({
    children,
}: PatientsProviderProps): JSX.Element {
    const [patients, setPatients] = useState<Patient[]>(() => {
        const storagedPatients = localStorage.getItem('@Medicalife:patients');

        if (storagedPatients) {
            return JSON.parse(storagedPatients);
        }
        return [];
    });

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        api.get('/patient').then((res) => {
            if (res.data) {
                setPatients(res.data.patients);

                localStorage.setItem(
                    '@Medicalife:patients',
                    JSON.stringify(patients)
                );
            } else {
                toast.error('Não foi possível recuperar os pacientes.');
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function createPatient(newPatient: NewPatient) {
        try {
            setIsLoading(true);
            const response = await api.post('/patient', newPatient, {
                onDownloadProgress: (event) => {
                    if (event.progress === 1) {
                        setIsLoading(false);
                    }
                },
            });

            if (response.data && response.data.success) {
                const { patient } = response.data;
                setPatients([...patients, patient]);

                localStorage.setItem(
                    '@Medicalife:patients',
                    JSON.stringify(patients)
                );

                toast.success('Paciente criado com sucesso.');
            } else {
                toast.error(
                    'Ocorreu um erro desconhecido ao registrar o paciente.'
                );
                return;
            }
        } catch (err: any) {
            setIsLoading(false);
            if (err.response.data.message) {
                toast.error(`Erro: ${err.response.data.message}`);
            } else {
                toast.error(
                    'Ocorreu um erro desconhecido ao registrar o paciente.'
                );
            }
            return;
        }
    }

    async function updatePatient(updatedPatient: Patient) {
        try {
            const response = await api.put(`/patient/${updatedPatient.id}`, {
                name: updatedPatient.name,
                email: updatedPatient.email,
                birthDate: updatedPatient.birthDate,
                postalCode: updatedPatient.postalCode,
                streetAddress: updatedPatient.streetAddress,
                city: updatedPatient.city,
                state: updatedPatient.state,
            });

            if (response.data && response.data.success) {
                const { patient } = response.data;
                const updatedPatients = patients.map(
                    (existingPatient: Patient) => {
                        return existingPatient.id === patient.id
                            ? patient
                            : existingPatient;
                    }
                );

                setPatients(updatedPatients);

                localStorage.setItem(
                    '@Medicalife:patients',
                    JSON.stringify(updatedPatients)
                );

                toast.success('Paciente atualizado com sucesso.');
            } else {
                toast.error(
                    'Ocorreu um erro desconhecido ao atualizar o paciente.'
                );
                return;
            }
        } catch (err: any) {
            toast.error(`Erro: ${err.response.data.message}`);
            return;
        }
    }

    async function deletePatient(patientId: string) {
        try {
            const response = await api.delete(`/patient/${patientId}`);

            if (response.data && response.data.success) {
                const updatedPatients = patients.filter(
                    (patient: Patient) => patient.id !== patientId
                );

                setPatients(updatedPatients);

                localStorage.setItem(
                    '@Medicalife:patients',
                    JSON.stringify(updatedPatients)
                );
                toast.success('Paciente removido com sucesso.');
            } else {
                toast.error(
                    'Ocorreu um erro desconhecido ao remover o paciente.'
                );
                return;
            }
        } catch (err: any) {
            if (err.response.data.message) {
                toast.error(`Erro: ${err.response.data.message}`);
            } else {
                toast.error(
                    'Ocorreu um erro desconhecido ao remover o paciente.'
                );
            }
            return;
        }
    }

    return (
        <PatientsContext.Provider
            value={{
                patients,
                isLoading,
                createPatient,
                updatePatient,
                deletePatient,
            }}
        >
            {children}
        </PatientsContext.Provider>
    );
}

export function usePatients() {
    const context = useContext(PatientsContext);

    return context;
}
