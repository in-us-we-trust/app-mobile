import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { EventSeverity } from '../types';

const SEVERITY_CONFIG: Record<
  EventSeverity,
  { bg: string; border: string; color: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }
> = {
  critical: { bg: '#FDECEA', border: '#F5C6C2', color: '#C62828', icon: 'alert-circle-outline' },
  warning: { bg: '#FFF3E0', border: '#FFE0B2', color: '#B45309', icon: 'alert-outline' },
  info: { bg: '#DCFCE7', border: '#BBF7D0', color: '#15803D', icon: 'check-circle-outline' },
};

interface EventStatusBannerProps {
  severity: EventSeverity;
  title: string;
  description?: string;
}

export const EventStatusBanner: React.FC<EventStatusBannerProps> = ({
  severity,
  title,
  description,
}) => {
  const cfg = SEVERITY_CONFIG[severity];

  return (
    <Wrapper bg={cfg.bg} border={cfg.border}>
      <MaterialCommunityIcons name={cfg.icon} size={20} color={cfg.color} />
      <Texts>
        <Title color={cfg.color}>{title}</Title>
        {description ? <Description color={cfg.color}>{description}</Description> : null}
      </Texts>
    </Wrapper>
  );
};

// ─── Styled Components ────────────────────────────────────────────────────────

const Wrapper = styled.View<{ bg: string; border: string }>`
  flex-direction: row;
  align-items: flex-start;
  gap: 10px;
  background-color: ${({ bg }) => bg};
  border-width: 1px;
  border-color: ${({ border }) => border};
  border-radius: 12px;
  padding: 12px 14px;
`;

const Texts = styled.View`
  flex: 1;
`;

const Title = styled.Text<{ color: string }>`
  font-size: 14px;
  font-weight: 700;
  color: ${({ color }) => color};
`;

const Description = styled.Text<{ color: string }>`
  font-size: 13px;
  color: ${({ color }) => color};
  margin-top: 2px;
  line-height: 18px;
`;
