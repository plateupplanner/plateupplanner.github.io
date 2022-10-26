import styled from 'styled-components';

export const InfoModal = styled.div`
  p {
    margin-bottom: 8px;
  }
  kbd {
    margin: 0px 0.1em;
    padding: 0.1em 0.6em;
    border-radius: 3px;
    border: 1px solid rgb(204, 204, 204);
    color: rgb(51, 51, 51);
    line-height: 1.4;
    font-size: 10px;
    display: inline-block;
    box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.2), inset 0px 0px 0px 2px #ffffff;
    background-color: rgb(247, 247, 247);
    text-shadow: 0 1px 0 #fff;
  }
`;

export const KeyboardShortcutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-gap: 8px;
`;
