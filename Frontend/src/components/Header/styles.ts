import styled from 'styled-components';

/* REM Sizing => 1rem = 16px (Desktop) */

export const Container = styled.header`
    background-color: var(--blue);
`;

export const Content = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem 8rem;

    display: flex;
    align-items: center;
    justify-content: space-between;

    button {
        font-size: 1rem;
        color: var(--blue);
        background-color: var(--background);
        border: 0;
        padding: 0 2rem;
        border-radius: 0.25rem;
        height: 2.8rem;

        transition: filter 0.2s;

        &:hover {
            filter: brightness(0.9);
            transition: filter 0.2s;
        }
    }
`;
