import React, { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';

interface EventCaptureProps {
  /** URL de la captura del timbre. null cuando el evento no tiene imagen. */
  uri: string | null;
}

/**
 * Captura del timbre. Cae al placeholder tanto si el backend no mandó imagen
 * como si la URL falla al cargar (link vencido, sin conexión, etc.).
 */
export const EventCapture: React.FC<EventCaptureProps> = ({ uri }) => {
  const [failed, setFailed] = useState(false);

  if (!uri || failed) {
    return (
      <Placeholder>
        <MaterialCommunityIcons name="image-off-outline" size={28} color="#6B7280" />
        <PlaceholderText>Sin captura disponible</PlaceholderText>
      </Placeholder>
    );
  }

  return (
    <Wrapper>
      <Capture source={{ uri }} resizeMode="cover" onError={() => setFailed(true)} />
    </Wrapper>
  );
};

// ─── Styled Components ────────────────────────────────────────────────────────

const Wrapper = styled.View`
  width: 100%;
  height: 240px;
  background-color: #1f2430;
`;

const Capture = styled.Image`
  width: 100%;
  height: 100%;
`;

const Placeholder = styled.View`
  width: 100%;
  height: 240px;
  background-color: #1f2430;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const PlaceholderText = styled.Text`
  font-size: 13px;
  color: #9ca3af;
`;
