import styled from 'styled-components';

/* REM Sizing => 1rem = 16px (Desktop) */

export const Container = styled.form`
    h2 {
        color: var(--text-title);
        font-size: 1.4rem;
        margin-bottom: 1rem;
    }
    input {
        width: 100%;
        padding: 0 1.5rem;
        height: 2.4rem;
        border-radius: 0.25rem;
        background: #e7e9ee;
        border: 1px solid #d7d7d7;

        font-weight: 400;
        font-size: 0.8rem;

        &::placeholder {
            color: var(--placeholder-text);
            font-size: 0.8rem;
        }

        & + input {
            /* margin-top: 1rem; */
        }
    }

    button[type='submit'] {
        width: 100%;
        padding: 0 1.5rem;
        height: 2.8rem;
        background-color: var(--blue);
        color: #fff;
        border-radius: 0.25rem;
        border: 0;
        font-size: 1rem;
        margin-top: 1rem;
        font-weight: 600;

        transition: filter 0.2s;

        &:hover {
            filter: brightness(0.9);
        }
    }

    label {
        display: inline-block;
        margin-top: 0.8rem;
        font-size: 0.8rem;
    }
`;

export const FormError = styled.div`
    color: var(--red);
    /* margin: 0.2rem 0rem 0.8rem; */
    font-size: 0.8rem;
`;

export const MuiDatePickerContainer = styled.div`
    div {
        margin: 0 !important;
    }
`;

export const PatientAddressContainer = styled.div`
    label {
        display: inline-block;
        margin-top: 0.8rem;
        font-size: 0.8rem;
    }
`;

export const PatientCityStateContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    div {
        max-width: 45%;
    }
`;
