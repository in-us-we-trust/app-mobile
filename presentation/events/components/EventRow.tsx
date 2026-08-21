import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Avatar, IconButton, useTheme } from 'react-native-paper';
import styled from 'styled-components/native';
import { HomeEvent, EventKind } from '../types';

// ─── Config por tipo de evento ─────────────────────────────────────────────────

const KIND_CONFIG: Record<
  EventKind,
  { icon: string; iconBg: string; iconColor: string; badgeLabel?: string; badgeColor?: string; badgeBg?: string }
> = {
  unknown_person: {
    icon: 'account',
    iconBg: '#1F2937',
    iconColor: '#FFFFFF',
    badgeLabel: 'Desconocido',
    badgeColor: '#B45309',
    badgeBg: '#FEF3C7',
  },
  recognized_person: {
    // fallback si por algún motivo no hay personName (no debería pasar)
    icon: 'account-check',
    iconBg: '#16A34A',
    iconColor: '#FFFFFF',
    badgeLabel: '✓ Reconocido',
    badgeColor: '#15803D',
    badgeBg: '#DCFCE7',
  },
  device: {
    icon: 'alert-circle-outline',
    iconBg: '#FEF3E2',
    iconColor: '#D97706',
  },
};

const AVATAR_COLORS = ['#E53935', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'];

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
}

/** Hash simple sobre el id (un uuid) para repartir los colores de forma estable. */
function getAvatarColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) % 1000000007;
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface EventRowProps {
  event: HomeEvent;
  onPress: (event: HomeEvent) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const EventRow: React.FC<EventRowProps> = ({ event, onPress }) => {
  const theme = useTheme();
  const cfg = KIND_CONFIG[event.kind];
  const isRecognized = event.kind === 'recognized_person' && !!event.personName;

  const secondaryText = isRecognized
    ? event.zone
      ? `${event.personName} · ${event.zone}`
      : event.personName
    : event.zone;

  return (
    <Wrapper activeOpacity={0.7} onPress={() => onPress(event)} borderColor={theme.colors.outlineVariant}>
      {isRecognized ? (
        <Avatar.Text
          size={44}
          label={getInitials(event.personName!)}
          style={{ backgroundColor: getAvatarColor(event.id) }}
        />
      ) : (
        <IconTile bg={cfg.iconBg}>
          <IconButton
            icon={event.kind === 'device' && event.icon ? event.icon : cfg.icon}
            size={20}
            iconColor={cfg.iconColor}
            style={{ margin: 0 }}
          />
        </IconTile>
      )}

      <Body>
        <Title color={theme.colors.onBackground}>{event.title}</Title>
        <SubRow>
          {cfg.badgeLabel && (
            <Badge bg={cfg.badgeBg!}>
              <BadgeText color={cfg.badgeColor!}>{cfg.badgeLabel}</BadgeText>
            </Badge>
          )}
          {secondaryText ? (
            <Secondary color={theme.colors.onSurfaceVariant}>{secondaryText}</Secondary>
          ) : null}
        </SubRow>
      </Body>

      <Right>
        {event.isNew && <NewDot />}
        <Time color={theme.colors.onSurfaceVariant}>{event.time}</Time>
      </Right>
    </Wrapper>
  );
};

// ─── Styled Components ────────────────────────────────────────────────────────

const Wrapper = styled(TouchableOpacity) <{ borderColor: string }>`
  flex-direction: row;
  align-items: center;
  padding: 14px;
  background-color: #fff;
  border-radius: 16px;
  margin-bottom: 10px;
  border-width: 1px;
  border-color: ${({ borderColor }) => borderColor};
`;

const IconTile = styled.View<{ bg: string }>`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background-color: ${({ bg }) => bg};
  align-items: center;
  justify-content: center;
`;

const Body = styled.View`
  flex: 1;
  margin-left: 12px;
`;

const Title = styled.Text<{ color: string }>`
  font-size: 14px;
  font-weight: 700;
  color: ${({ color }) => color};
`;

const SubRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
  gap: 6px;
`;

const Badge = styled.View<{ bg: string }>`
  background-color: ${({ bg }) => bg};
  border-radius: 8px;
  padding: 2px 6px;
`;

const BadgeText = styled.Text<{ color: string }>`
  font-size: 10px;
  font-weight: 700;
  color: ${({ color }) => color};
`;

const Secondary = styled.Text<{ color: string }>`
  font-size: 12px;
  color: ${({ color }) => color};
`;

const Right = styled.View`
  align-items: flex-end;
  margin-left: 8px;
`;

const NewDot = styled.View`
  width: 7px;
  height: 7px;
  border-radius: 3.5px;
  background-color: #ef4444;
  margin-bottom: 4px;
`;

const Time = styled.Text<{ color: string }>`
  font-size: 12px;
  color: ${({ color }) => color};
`;
