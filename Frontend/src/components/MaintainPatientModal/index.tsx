import { useEffect, useState } from 'react';
import { usePatients } from '../../hooks/usePatients';
import {
    Container,
    FormError,
    MuiDatePickerContainer,
    PatientAddressContainer,
    PatientCityStateContainer,
} from './styles';
import Modal from 'react-modal';
import closeImg from '../../assets/close.svg';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { TextField, TextFieldProps } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { ptBR } from '@mui/x-date-pickers/locales/ptBR';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import ReactDOM from 'react-dom';
import { Patient } from '../../shared/types';

Modal.setAppElement('#root');

interface MaintainPatientModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    patientToEdit?: Patient;
}

type PatientSubmitForm = {
    patientName: string;
    patientBirthDate: Date | Dayjs | string;
    patientEmail: string;
    patientPostalCode: string;
    patientCity: string;
    patientState: string;
    patientStreetAddress: string;
};

export function MaintainPatientModal({
    isOpen,
    onRequestClose,
    patientToEdit,
}: MaintainPatientModalProps) {
    /* Form Schema */
    const validationSchema = Yup.object().shape({
        patientName: Yup.string()
            .required('O nome do paciente deve ser preenchido.')
            .min(3, 'O nome do paciente deve conter no mínimo 3 caracteres.')
            .max(50, 'O nome do paciente deve conter no máximo 30 caracteres.'),
        patientBirthDate: Yup.string()
            .nullable()
            .required('A Data de Nascimento deve ser preenchida.'),
        patientEmail: Yup.string()
            .required('O email deve ser preenchido.')
            .email('O email fornecido é inválido.'),
        patientPostalCode: Yup.string()
            .required('O CEP deve ser preenchido.')
            .min(8, 'O CEP deve conter no mínimo 8 caracteres.'),
        patientCity: Yup.string()
            .required('A Cidade deve ser preenchida.')
            .min(3, 'A Cidade deve conter no mínimo 3 caracteres.')
            .max(40, 'A Cidade deve conter no máximo 40 caracteres.'),
        patientState: Yup.string()
            .required('O Estado deve ser preenchido.')
            .min(2, 'O Estado deve conter no mínimo 2 caracteres.')
            .max(2, 'O Estado deve conter no máximo 2 caracteres.'),
        patientStreetAddress: Yup.string()
            .required('O Logradouro deve ser preenchido.')
            .min(3, 'O Logradouro deve conter no mínimo 10 caracteres.')
            .max(100, 'O Logradouro deve conter no máximo 100 caracteres.'),
    });

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
        setValue,
    } = useForm<PatientSubmitForm>({
        resolver: yupResolver(validationSchema),
    });

    /* Providers */
    const { createPatient, updatePatient, isLoading } = usePatients();

    /* Patient Info States */
    const [patientName, setPatientName] = useState('');
    const [patientBirthDate, setPatientBirthDate] = useState<Dayjs | null>(
        null
    );
    const [patientEmail, setPatientEmail] = useState('');
    const [patientPostalCode, setPatientPostalCode] = useState('');
    const [patientCity, setPatientCity] = useState('');
    const [patientState, setPatientState] = useState('');
    const [patientStreetAddress, setPatientStreetAddress] = useState('');

    /* Methods */
    useEffect(() => {
        if (patientToEdit) {
            setPatientName(patientToEdit.name);
            setPatientBirthDate(dayjs(patientToEdit.birthDate));
            setPatientEmail(patientToEdit.email);

            setPatientPostalCode(patientToEdit.postalCode || '');
            setPatientCity(patientToEdit.city || '');
            setPatientState(patientToEdit.state || '');
            setPatientStreetAddress(patientToEdit.streetAddress || '');

            setValue('patientName', patientToEdit.name);
            setValue('patientBirthDate', dayjs(patientToEdit.birthDate));
            setValue('patientEmail', patientToEdit.email);

            setValue('patientPostalCode', patientToEdit.postalCode || '');
            setValue('patientCity', patientToEdit.city || '');
            setValue('patientState', patientToEdit.state || '');
            setValue('patientStreetAddress', patientToEdit.streetAddress || '');
        } else {
            reset({
                patientBirthDate: '',
                patientEmail: '',
                patientName: '',

                patientPostalCode: '',
                patientCity: '',
                patientState: '',
                patientStreetAddress: '',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [patientToEdit]);

    const onSubmit = async (event: PatientSubmitForm) => {
        // event.preventDefault(); // Previne reloading ao submeter

        /* Calls Patient provider to maintain patient info (create|update) */
        if (!patientToEdit) {
            await createPatient({
                name: patientName,
                birthDate: dayjs(patientBirthDate).toISOString(),
                email: patientEmail,
                city: patientCity,
                state: patientState,
                postalCode: patientPostalCode,
                streetAddress: patientStreetAddress,
            } as Patient);
        } else {
            await updatePatient({
                ...patientToEdit,
                name: patientName,
                birthDate: dayjs(patientBirthDate).toISOString(),
                email: patientEmail,
                city: patientCity,
                state: patientState,
                postalCode: patientPostalCode,
                streetAddress: patientStreetAddress,
            } as Patient);
        }

        setPatientName('');
        setPatientBirthDate(null);
        setPatientEmail('');

        setPatientPostalCode('');
        setPatientCity('');
        setPatientState('');
        setPatientStreetAddress('');

        if (!isLoading) {
            onRequestClose();
        }
    };

    const handleOnRequestClose = () => {
        setPatientName('');
        setPatientBirthDate(null);
        setPatientEmail('');

        setPatientPostalCode('');
        setPatientCity('');
        setPatientState('');
        setPatientStreetAddress('');

        reset({
            patientBirthDate: '',
            patientEmail: '',
            patientName: '',

            patientPostalCode: '',
            patientCity: '',
            patientState: '',
            patientStreetAddress: '',
        });

        onRequestClose();
    };

    return ReactDOM.createPortal(
        <Modal
            isOpen={isOpen}
            onRequestClose={handleOnRequestClose}
            overlayClassName="react-modal-overlay"
            className="react-modal-content"
        >
            <button
                type="button"
                onClick={onRequestClose}
                className="react-modal-close"
            >
                <img src={closeImg} alt="Fechar modal" />
            </button>

            <Container onSubmit={handleSubmit(onSubmit)}>
                <h2>
                    {patientToEdit ? 'Editar Paciente' : 'Cadastrar Paciente'}
                </h2>
                <label>* Nome</label>
                <input
                    placeholder="Ex.: João da Silva"
                    {...register('patientName')}
                    value={patientName}
                    onChange={(event) => setPatientName(event.target.value)}
                />
                <FormError>{errors.patientName?.message}</FormError>
                <LocalizationProvider
                    adapterLocale={ptBR}
                    dateAdapter={AdapterDayjs}
                >
                    <MuiDatePickerContainer>
                        <label>* Data de nascimento</label>
                        <Controller
                            control={control}
                            name="patientBirthDate"
                            render={({ field }) => (
                                <DesktopDatePicker
                                    inputFormat="DD/MM/YYYY"
                                    value={patientBirthDate}
                                    minDate={dayjs(
                                        new Date().setFullYear(1920)
                                    )}
                                    maxDate={dayjs(new Date())}
                                    onChange={(date) => {
                                        if (date && date.isValid()) {
                                            field.onChange(date);
                                            setPatientBirthDate(
                                                dayjs(date?.toISOString())
                                            );
                                        }
                                    }}
                                    renderInput={(
                                        params: JSX.IntrinsicAttributes &
                                            TextFieldProps
                                    ) => (
                                        <TextField
                                            {...params}
                                            {...register('patientBirthDate')}
                                            placeholder={' Data de nascimento'}
                                            sx={{
                                                width: '100%',
                                                marginY: '1rem',
                                            }}
                                        />
                                    )}
                                />
                            )}
                        />
                    </MuiDatePickerContainer>
                </LocalizationProvider>
                <FormError>{errors.patientBirthDate?.message}</FormError>

                <label>* Email</label>
                <input
                    placeholder="Ex.: joao.silva@provedor.com"
                    value={patientEmail}
                    {...register('patientEmail')}
                    onChange={(event) => setPatientEmail(event.target.value)}
                />
                <FormError>{errors.patientEmail?.message}</FormError>

                <PatientAddressContainer>
                    <label>* CEP</label>
                    <input
                        placeholder="Ex.: 12345678"
                        value={patientPostalCode}
                        maxLength={8}
                        {...register('patientPostalCode')}
                        onChange={(event) =>
                            setPatientPostalCode(event.target.value)
                        }
                    />
                    <FormError>{errors.patientPostalCode?.message}</FormError>

                    <label>* Logradouro</label>
                    <input
                        placeholder="Ex.: Rua Marquês Silva, 123, Bairro Nova"
                        value={patientStreetAddress}
                        {...register('patientStreetAddress')}
                        onChange={(event) =>
                            setPatientStreetAddress(event.target.value)
                        }
                    />
                    <FormError>
                        {errors.patientStreetAddress?.message}
                    </FormError>

                    <PatientCityStateContainer>
                        <div>
                            <label>* Cidade</label>
                            <input
                                placeholder="Ex.: Curitiba"
                                value={patientCity}
                                {...register('patientCity')}
                                onChange={(event) =>
                                    setPatientCity(event.target.value)
                                }
                            />
                            <FormError>{errors.patientCity?.message}</FormError>
                        </div>
                        <div>
                            <label>* Estado</label>
                            <input
                                placeholder="Ex.: PR"
                                value={patientState}
                                maxLength={2}
                                {...register('patientState')}
                                onChange={(event) =>
                                    setPatientState(event.target.value)
                                }
                            />
                            <FormError>
                                {errors.patientState?.message}
                            </FormError>
                        </div>
                    </PatientCityStateContainer>
                </PatientAddressContainer>
                <button
                    type="submit"
                    disabled={isLoading}
                    style={{ opacity: isLoading ? 0.4 : 1 }}
                >
                    {patientToEdit ? 'Salvar' : 'Cadastrar'}
                </button>
            </Container>
        </Modal>,
        document.body
    );
}
