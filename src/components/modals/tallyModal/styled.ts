import styled from 'styled-components';

export const TallyModal = styled.div`
  > div {
    display: flex;
    align-items: center;
    padding: 8px;

    &:nth-child(even) {
      background-color: ${({ theme }) => theme.colors.brand};
      border-radius: 4px;
    }

    img {
      width: 64px;
      height: 64px;
      margin-top: -16px;
      object-fit: cover;
    }

    span {
      margin-left: 16px;
      font-family: ${({ theme }) => theme.fonts.title};
      font-size: 24px;
    }
  }
`;
