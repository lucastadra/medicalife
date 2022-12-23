import { Patient } from '../shared/types';

export const formatAddress = (patient: Patient) => {
    if (
        patient.city !== '' &&
        patient.state !== '' &&
        patient.streetAddress !== ''
    ) {
        return (
            patient.streetAddress + ', ' + patient.city + ' - ' + patient.state
        );
    }

    if (patient.streetAddress !== '') return patient.streetAddress;

    return 'N/A';
};
