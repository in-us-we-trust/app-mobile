import React from 'react';
import { Modal } from 'react-native';
import styled from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SuggestedContact } from '../types';

interface SuggestedContactModalProps {
  visible: boolean;
  suggestion: SuggestedContact | null;
  onAccept: () => void;
  onIgnore: () => void;
}

export function SuggestedContactModal({
  visible,
  suggestion,
  onAccept,
  onIgnore,
}: SuggestedContactModalProps) {
  const insets = useSafeAreaInsets();

  if (!suggestion) return null;

  const [main, second, ...rest] = suggestion.captures;
  const extraCount = rest.length;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent
      onRequestClose={onIgnore}
    >
      <StatusBar style="light" />
      <Container style={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16 }}>
        <CloseButton onPress={onIgnore} hitSlop={12}>
          <MaterialCommunityIcons name="close" size={20} color="#fff" />
        </CloseButton>

        <Content>
          <Badge>
            <MaterialCommunityIcons name="clock-outline" size={13} color="#B7A6FF" />
            <BadgeText>{suggestion.badgeLabel}</BadgeText>
          </Badge>

          <Title>¿Agregar esta persona{'\n'}a tus contactos?</Title>
          <Subtitle>{suggestion.subtitle}</Subtitle>

          <Grid>
            <MainTile>
              {main && <TileImage source={{ uri: main.imageUri }} />}
              {main && (
                <TimeBadge>
                  <TimeBadgeText>{main.label}</TimeBadgeText>
                </TimeBadge>
              )}
            </MainTile>

            <SideColumn>
              <SideTile>{second && <TileImage source={{ uri: second.imageUri }} />}</SideTile>
              <SideTile>
                {rest[0] && <TileImage source={{ uri: rest[0].imageUri }} />}
                {extraCount > 0 && (
                  <ExtraOverlay>
                    <ExtraOverlayText>+{extraCount}</ExtraOverlayText>
                  </ExtraOverlay>
                )}
              </SideTile>
            </SideColumn>
          </Grid>
        </Content>

        <Footer>
          <AcceptButton onPress={onAccept}>
            <MaterialCommunityIcons name="account-plus" size={18} color="#fff" />
            <AcceptButtonText>Agregar contacto</AcceptButtonText>
          </AcceptButton>
          <IgnoreButton onPress={onIgnore}>
            <IgnoreButtonText>Ignorar</IgnoreButtonText>
          </IgnoreButton>
        </Footer>
      </Container>
    </Modal>
  );
}

// ---------- Estilos ----------

const Container = styled.View`
  flex: 1;
  background-color: #15121c;
  padding-horizontal: 20px;
`;

const CloseButton = styled.Pressable`
  align-self: flex-end;
  width: 36px;
  height: 36px;
  border-radius: 18px;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.1);
  margin-bottom: 12px;
`;

const Content = styled.View`
  flex: 1;
`;

const Badge = styled.View`
  flex-direction: row;
  align-items: center;
  align-self: flex-start;
  background-color: rgba(108, 78, 245, 0.18);
  border-radius: 20px;
  padding: 6px 12px;
  margin-bottom: 20px;
  gap: 6px;
`;

const BadgeText = styled.Text`
  font-size: 12px;
  font-weight: 600;
  color: #b7a6ff;
`;

const Title = styled.Text`
  font-size: 26px;
  font-weight: 700;
  color: #fff;
  line-height: 32px;
  margin-bottom: 12px;
`;

const Subtitle = styled.Text`
  font-size: 14px;
  color: #a9a3b8;
  line-height: 20px;
  margin-bottom: 24px;
`;

const Grid = styled.View`
  flex-direction: row;
  gap: 12px;
  height: 260px;
`;

const MainTile = styled.View`
  flex: 1;
  border-radius: 16px;
  overflow: hidden;
  background-color: #221e2c;
  border-width: 1px;
  border-color: #332e40;
`;

const SideColumn = styled.View`
  flex: 1;
  gap: 12px;
`;

const SideTile = styled.View`
  flex: 1;
  border-radius: 16px;
  overflow: hidden;
  background-color: #221e2c;
  border-width: 1px;
  border-color: #332e40;
`;

const TileImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const TimeBadge = styled.View`
  position: absolute;
  bottom: 8px;
  left: 8px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 6px;
  padding: 3px 8px;
`;

const TimeBadgeText = styled.Text`
  font-size: 11px;
  font-weight: 600;
  color: #fff;
`;

const ExtraOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.55);
  align-items: center;
  justify-content: center;
`;

const ExtraOverlayText = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #fff;
`;

const Footer = styled.View`
  gap: 4px;
`;

const AcceptButton = styled.Pressable`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #6c4ef5;
  border-radius: 16px;
  padding: 15px;
  gap: 8px;
`;

const AcceptButtonText = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: #fff;
`;

const IgnoreButton = styled.Pressable`
  align-items: center;
  justify-content: center;
  padding: 14px;
`;

const IgnoreButtonText = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: #9b93ab;
`;
