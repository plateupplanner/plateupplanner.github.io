import styled from 'styled-components';
import InfoModal from '../../components/modals/infoModal/InfoModal';

export const HomeSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
`;

export const InfoModalButton = styled(InfoModal)`
  position: absolute;
  top: 16px;
  right: 16px;
`;

export const SizeInput = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 84px;
  margin: 112px 0 64px 0;

  &::after {
    content: 'X';
    position: absolute;
    bottom: 12px;
    left: 50%;
    font-size: 2.4rem;
    font-family: ${({ theme }) => theme.fonts.title};
    font-weight: 400;
    transform: translateX(-50%);
  }

  .mantine-InputWrapper-root {
    max-width: 84px;

    .mantine-InputWrapper-label {
      width: 100%;
      text-align: center;
      margin-bottom: 8px;
      font-size: 2.8rem;
    }

    input {
      height: 56px;
      font-size: 2.8rem;
    }
  }
`;

export const SizeWarning = styled.div`
  background-color: ${({ theme }) => theme.colors.warningBackgroundColor};
  color: ${({ theme }) => theme.colors.white};
  width: 500px;
  padding: 16px;
  border-radius: 8px;
  font-size: 1.6rem;
  margin-bottom: 16px;
  text-align: center;
`;
