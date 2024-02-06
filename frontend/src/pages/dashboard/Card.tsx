// Card.tsx
import React, { FC } from 'react';
import './Card.css';

interface CardProps {
  title: string;
  number: number;
}

const Card: FC<CardProps> = ({ title, number }) => {
  return (
    <div className="card">
      <div className="card-title">{title}</div>
      <div className="card-number">{number}</div>
    </div>
  );
}

export default Card;