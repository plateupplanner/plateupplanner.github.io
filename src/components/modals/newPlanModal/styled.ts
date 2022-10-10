import styled from 'styled-components';

export const NewPlanModal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  text-align: center;

  > div {
    display: flex;
    gap: 16px;

    button:first-of-type {
      opacity: 0.8;
      background-color: transparent;

      &:hover {
        opacity: 1;
        color: ${({ theme }) => theme.colors.fontDark};
        background-color: ${({ theme }) => theme.colors.backgroundColorHover};
      }
    }
  }
`;
