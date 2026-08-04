import React from 'react';
import { Button, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';

type NoDeviceStateProps = {
    onLink: () => void;
};

/**
 * Estado para la lista de contactos cuando el usuario todavía no vinculó
 * ningún timbre. Los contactos dependen de las fotos y el reconocimiento del
 * dispositivo, así que sin timbre no tiene sentido dejar agregar personas.
 */
export function NoDeviceState({ onLink }: NoDeviceStateProps) {
    const theme = useTheme();

    return (
        <Wrapper>
            <IconWrapper>
                <IconBox backgroundColor={theme.colors.primaryContainer}>
                    <MaterialCommunityIcons
                        name="doorbell"
                        size={64}
                        color={theme.colors.primary}
                    />
                </IconBox>

                {/* Badge de "sin energía": refuerza que el timbre no está activo */}
                <PowerBadge backgroundColor={theme.colors.surface}>
                    <MaterialCommunityIcons name="power" size={18} color="#D97706" />
                </PowerBadge>
            </IconWrapper>

            <Title color={theme.colors.onBackground}>
                Vinculá tu timbre{'\n'}para agregar contactos
            </Title>

            <Description color={theme.colors.onSurfaceVariant}>
                Los contactos usan las fotos y el reconocimiento de tu timbre. Vinculá un
                dispositivo para empezar a agregar personas.
            </Description>

            <LinkButton
                mode="contained"
                icon="doorbell"
                onPress={onLink}
                contentStyle={{ paddingVertical: 6 }}
            >
                Vincular timbre
            </LinkButton>
        </Wrapper>
    );
}

// ---------- Estilos ----------

const Wrapper = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const IconWrapper = styled.View`
  position: relative;
  margin-bottom: 24px;
`;

const IconBox = styled.View<{ backgroundColor: string }>`
  width: 140px;
  height: 140px;
  border-radius: 28px;
  background-color: ${({ backgroundColor }) => backgroundColor};
  align-items: center;
  justify-content: center;
`;

const PowerBadge = styled.View<{ backgroundColor: string }>`
  position: absolute;
  right: -10px;
  bottom: -6px;
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: ${({ backgroundColor }) => backgroundColor};
  align-items: center;
  justify-content: center;
  elevation: 3;
  shadow-color: #000;
  shadow-opacity: 0.12;
  shadow-radius: 6px;
  shadow-offset: 0px 2px;
`;

const Title = styled.Text<{ color: string }>`
  font-size: 22px;
  font-weight: 700;
  color: ${({ color }) => color};
  text-align: center;
  line-height: 30px;
  margin-bottom: 12px;
`;

const Description = styled.Text<{ color: string }>`
  font-size: 15px;
  color: ${({ color }) => color};
  text-align: center;
  line-height: 22px;
  margin-bottom: 28px;
  padding: 0 8px;
`;

const LinkButton = styled(Button)`
  width: 100%;
  border-radius: 28px;
`;
