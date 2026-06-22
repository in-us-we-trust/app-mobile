import React from 'react';
import { useTheme, Button } from 'react-native-paper';
import styled from 'styled-components/native';
import { HomeEvent, EventSeverity } from '../types';

// ─── Severity config ──────────────────────────────────────────────────────────

const SEVERITY_CONFIG: Record<EventSeverity, { color: string; bg: string; label: string; icon: string }> = {
  critical: { color: '#E53935', bg: '#FDECEA', label: 'Crítico', icon: '⚠' },
  warning: { color: '#F57C00', bg: '#FFF3E0', label: 'Alerta', icon: '!' },
  info: { color: '#1976D2', bg: '#E3F2FD', label: 'Info', icon: 'i' },
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface FeaturedCardProps {
  event: HomeEvent;
  onPress: (event: HomeEvent) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const FeaturedCard: React.FC<FeaturedCardProps> = ({ event, onPress }) => {
  const theme = useTheme();
  const cfg = SEVERITY_CONFIG[event.severity];

  return (
    <Wrapper borderColor={theme.colors.outlineVariant} bg={theme.colors.surface}>
      <AccentBar color={cfg.color} />
      <Content>
        <TopRow>
          <SeverityBadge bg={cfg.bg} color={cfg.color}>
            <BadgeIcon color={cfg.color}>{cfg.icon}</BadgeIcon>
            <BadgeLabel color={cfg.color}>{cfg.label}</BadgeLabel>
          </SeverityBadge>
          <Tag color={theme.colors.onSurfaceVariant}>Último evento</Tag>
        </TopRow>

        <Title color={theme.colors.onBackground}>{event.title}</Title>

        {event.description ? (
          <Description color={theme.colors.onSurfaceVariant}>
            {event.description}
          </Description>
        ) : null}

        <Meta>
          {event.zone ? (
            <MetaText color={theme.colors.onSurfaceVariant}> {event.zone}</MetaText>
          ) : null}
          <MetaText color={theme.colors.onSurfaceVariant}>
            {event.date} · {event.time}
          </MetaText>
        </Meta>

        <Button
          mode="contained"
          onPress={() => onPress(event)}
          style={{ alignSelf: 'flex-start', borderRadius: 24 }}
          labelStyle={{ fontSize: 13 }}
        >
          Ver detalles
        </Button>
      </Content>
    </Wrapper>
  );
};

// ─── Styled Components ────────────────────────────────────────────────────────

const Wrapper = styled.View<{ borderColor: string; bg: string }>`
  background-color: ${({ bg }) => bg};
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 24px;
  flex-direction: row;
  border-width: 1px;
  border-color: ${({ borderColor }) => borderColor};
`;

const AccentBar = styled.View<{ color: string }>`
  width: 4px;
  background-color: ${({ color }) => color};
`;

const Content = styled.View`
  flex: 1;
  padding: 18px 16px 16px 16px;
`;

const TopRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const SeverityBadge = styled.View<{ bg: string; color: string }>`
  flex-direction: row;
  align-items: center;
  background-color: ${({ bg }) => bg};
  border-radius: 20px;
  padding: 4px 10px 4px 8px;
  border-width: 1px;
  border-color: ${({ color }) => color}44;
`;

const BadgeIcon = styled.Text<{ color: string }>`
  font-size: 11px;
  font-weight: 700;
  color: ${({ color }) => color};
  margin-right: 5px;
`;

const BadgeLabel = styled.Text<{ color: string }>`
  font-size: 11px;
  font-weight: 600;
  color: ${({ color }) => color};
`;

const Tag = styled.Text<{ color: string }>`
  font-size: 11px;
  font-weight: 500;
  color: ${({ color }) => color};
`;

const Title = styled.Text<{ color: string }>`
  font-size: 20px;
  font-weight: 700;
  color: ${({ color }) => color};
  letter-spacing: -0.3px;
  margin-bottom: 8px;
`;

const Description = styled.Text<{ color: string }>`
  font-size: 14px;
  color: ${({ color }) => color};
  line-height: 20px;
  margin-bottom: 14px;
`;

const Meta = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const MetaText = styled.Text<{ color: string }>`
  font-size: 12px;
  color: ${({ color }) => color};
`;
