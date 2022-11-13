import styled from 'styled-components';

export const GridContainer = styled.div`
  text-align: center;
  padding: 0 16px;

  i {
    padding-bottom: 5px;
  }

  .grid-square {
    background: ${({ theme }) => theme.emptyTile.background};
    background-size: ${({ theme }) => theme.emptyTile.backgroundSize};
    userselect: none;

    &.draw {
      filter: ${({ theme }) => theme.draw.filter};
    }
  }

  .grid-selected {
    border: 5px solid ${({ theme }) => theme.colors.brand};
  }

  .grid-image {
    display: block;
    width: 100%;
    height: 100%;
    aspect-ratio: 1;
    touch-action: pinch-zoom;
  }

  .line-empty-draw {
    background-color: ${({ theme }) => theme.colors.backgroundNoWall};
  }

  .line-empty-plan {
    background-color: ${({ theme }) => theme.colors.emptyPlan};
  }

  .line-wall-draw,
  .line-wall-plan {
    background-color: ${({ theme }) => theme.colors.black};
  }

  .line-half-draw,
  .line-half-plan {
    background-color: ${({ theme }) => theme.colors.halfWall};
  }
`;

export const DrawGrid = styled.div<{ width: number; height: number }>`
  display: grid;
  max-height: calc(100vh - 76px - 74px - 16px - 1vw);
  grid-template-columns: ${({ width }) => `repeat(${width}, 2fr 1fr) 2fr`};
  grid-template-rows: ${({ height }) => `repeat(${height}, 2fr 1fr) 2fr`};
  aspect-ratio: ${({ width, height }) =>
    `${(width * 3 + 2) / (height * 3 + 2)}`};
  margin: 0 auto;
  border: 1vw solid ${({ theme }) => theme.colors.black};
  user-select: none;
`;

export const PlanGrid = styled.div<{ width: number; height: number }>`
  display: grid;
  max-height: calc(100vh - 76px - 74px - 16px - 1vw);
  grid-template-columns: ${({ width }) => `repeat(${width}, 8fr 0.5vw) 8fr`};
  grid-template-rows: ${({ height }) => `repeat(${height}, 8fr 0.5vw) 8fr`};
  aspect-ratio: ${({ width, height }) =>
    `${(width * 9 + 8) / (height * 9 + 8)}`};
  margin: 0 auto;
  border: 1vw solid ${({ theme }) => theme.colors.black};
  user-select: none;
`;

export const Buttons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;
  padding: 16px;
`;
