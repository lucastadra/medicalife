import { createGlobalStyle } from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';

/* REM Sizing => 1rem = 16px */

export const GlobalStyle = createGlobalStyle`
    :root {
        --background: #F0F2F5;
        --shape: #FFFFFF;

        --blue: #00969B;
        --light-blue: #1daeb3;

        --red: #E52E4D;

        --green: #33CC95;

        --grey: #B0B0B0;

        --regular-text: #545454;

        --placeholder-text: #8f8f8f
    }

    * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        color: var(--regular-text);
    }

    html {
        @media (max-width: 1080px) { /* Telas até 1080px */
            font-size: 93.75%; /* 16px * 0,9375 = 15px */
        }

        @media (max-width: 720px) { /* Telas até 720px */
            font-size: 87.5%; /* 16px * 0,9375 = 14px */
        }
    }

    body {
        background-color: var(--background);
        -webkit-font-smoothing: antialiased;
    }

    body, input, textarea, button {
        font-family: 'Poppins', sans-serif;
        font-weight: 400;
    }

    h1, h2, h3, h4, h5, h6, strong {
        font-weight: 600;
    }

    button {
        cursor: pointer;
    }

    [disabled] {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .react-modal-overlay {
        background-color: rgba(0, 0, 0, 0.5);
        position: fixed;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;

        display:flex;
        align-items: center;
        justify-content: center;
    }

    .react-modal-content {
        width: 100%;
        max-width: 576px;
        background-color: var(--background);
        padding: 3rem;
        position: relative;
        border-radius: 0.25rem;
    }

    .react-modal-close {
        position: absolute;
        right: 1.5rem;
        top: 1.5rem;
        border: 0;
        background: transparent;

        transition: filter 0.2s;

        &:hover {
            transition: filter 0.2s;

            filter: brightness(0.8);
        }
    }
`;
