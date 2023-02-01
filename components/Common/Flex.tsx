import styled from 'styled-components';

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;

  width: 100%;
  height: max-content;
  gap: 12px;

  flex-wrap: nowrap;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  width: max-content;
  height: 100%;
  gap: 12px;
`;

export const RowDivider = styled.div`
  width: 100%;
  height: 0px;
  border: 1px solid #ffffff;
`;

export const ColumnDivider = styled.div`
  width: 0px;
  height: 100%;
  border: 1px solid #ffffff;
`;
