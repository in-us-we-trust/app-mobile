import React from 'react';
import { useTheme, IconButton } from 'react-native-paper';
import styled from 'styled-components/native';

export const EmptyEventsState: React.FC = () => {
  const theme = useTheme();

  return (
    <Wrapper>
      <IconCircle borderColor={theme.colors.outlineVariant}>
        <IconButton icon="calendar-clock" size={40} iconColor={theme.colors.primary} />
      </IconCircle>

      <Title color={theme.colors.onBackground}>Todavía no hay eventos</Title>

      <Description color={theme.colors.onSurfaceVariant}>
        Cuando tu timbre detecte movimiento o registre un acceso, los vas a ver acá.
      </Description>

      <StatusBadge>
        <StatusDot />
        <StatusText>Sistema activo · monitoreando</StatusText>
      </StatusBadge>
    </Wrapper>
  );
};

// ─── Styled Components ────────────────────────────────────────────────────────

const Wrapper = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const IconCircle = styled.View<{ borderColor: string }>`
  width: 96px;
  height: 96px;
  border-radius: 48px;
  border-width: 2px;
  border-style: dashed;
  border-color: ${({ borderColor }) => borderColor};
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const Title = styled.Text<{ color: string }>`
  font-size: 20px;
  font-weight: 700;
  color: ${({ color }) => color};
  text-align: center;
  margin-bottom: 8px;
`;

const Description = styled.Text<{ color: string }>`
  font-size: 14px;
  color: ${({ color }) => color};
  text-align: center;
  line-height: 20px;
  margin-bottom: 20px;
  padding: 0 12px;
`;

const StatusBadge = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #dcfce7;
  border-radius: 20px;
  padding: 6px 14px;
`;

const StatusDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #16a34a;
  margin-right: 8px;
`;

const StatusText = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: #15803d;
`;
