import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import styled from 'styled-components/native';
import { HomeEvent, EventSeverity } from '../types';

// ─── Severity config ──────────────────────────────────────────────────────────

const SEVERITY_CONFIG: Record<EventSeverity, { color: string; bg: string; label: string }> = {
  critical: { color: '#E53935', bg: '#FDECEA', label: 'Crítico' },
  warning:  { color: '#F57C00', bg: '#FFF3E0', label: 'Alerta'  },
  info:     { color: '#1976D2', bg: '#E3F2FD', label: 'Info'    },
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface EventRowProps {
  event: HomeEvent;
  onPress: (event: HomeEvent) => void;
  isLast: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const EventRow: React.FC<EventRowProps> = ({ event, onPress, isLast }) => {
  const theme = useTheme();
  const cfg = SEVERITY_CONFIG[event.severity];

  return (
    <>
      <Wrapper activeOpacity={0.7} onPress={() => onPress(event)}>
        <Dot color={cfg.color} />
        <Body>
          <Title color={theme.colors.onBackground}>{event.title}</Title>
          {event.zone ? (
            <Zone color={theme.colors.onSurfaceVariant}>{event.zone}</Zone>
          ) : null}
        </Body>
        <Right>
          <Chip bg={cfg.bg} color={cfg.color}>{cfg.label}</Chip>
          <Time color={theme.colors.onSurfaceVariant}>
            {event.date} · {event.time}
          </Time>
        </Right>
      </Wrapper>
      {!isLast && <Divider borderColor={theme.colors.outlineVariant} />}
    </>
  );
};

// ─── Styled Components ────────────────────────────────────────────────────────

const Wrapper = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  padding: 14px 16px;
`;

const Dot = styled.View<{ color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ color }) => color};
  margin-right: 12px;
  flex-shrink: 0;
`;

const Body = styled.View`
  flex: 1;
`;

const Title = styled.Text<{ color: string }>`
  font-size: 14px;
  font-weight: 600;
  color: ${({ color }) => color};
  margin-bottom: 2px;
`;

const Zone = styled.Text<{ color: string }>`
  font-size: 12px;
  color: ${({ color }) => color};
`;

const Right = styled.View`
  align-items: flex-end;
  margin-left: 10px;
`;

const Chip = styled.Text<{ bg: string; color: string }>`
  font-size: 10px;
  font-weight: 600;
  color: ${({ color }) => color};
  background-color: ${({ bg }) => bg};
  padding: 2px 7px;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 4px;
`;

const Time = styled.Text<{ color: string }>`
  font-size: 11px;
  color: ${({ color }) => color};
`;

const Divider = styled.View<{ borderColor: string }>`
  height: 1px;
  background-color: ${({ borderColor }) => borderColor};
  margin: 0 16px;
`;
