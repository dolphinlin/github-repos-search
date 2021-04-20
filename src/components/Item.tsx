import { memo } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 8px;
  background-color: #eee;
  width: 500px;
  justify-content: center;
  align-items: center;
`;

export interface Props {
  name: string;
  owner: string;
  url: string;
  starsCount: number;
}
const Item = (props: Props) => {
  return (
    <Container className="item">
      <div className="title">{props.name}</div>
      <div className="stars">Stars: {props.starsCount}</div>
    </Container>
  );
};

export default memo(Item);
