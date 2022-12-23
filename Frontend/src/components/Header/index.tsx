import { useState } from 'react';
import logoImg from '../../assets/medicalife.svg';
import { MaintainPatientModal } from '../MaintainPatientModal';
import { Container, Content } from './styles';

export function Header() {
    /* Modal */
    const [openModal, setOpenModal] = useState(false);

    const onCloseModal = () => {
        setOpenModal(false);
    };

    return (
        <>
            <Container>
                <Content>
                    <img src={logoImg} alt="dt money" />
                    <button
                        onClick={() => {
                            setOpenModal(true);
                        }}
                    >
                        Novo Paciente
                    </button>
                </Content>
            </Container>
            <MaintainPatientModal
                isOpen={openModal}
                onRequestClose={onCloseModal}
                patientToEdit={undefined}
            />
        </>
    );
}
