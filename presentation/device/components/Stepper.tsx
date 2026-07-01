import styled from 'styled-components/native';
import { Text, useTheme } from 'react-native-paper';
import { View } from 'react-native';

interface StepperProps {
    current: number;
    total: number;
    label?: string;
}

const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
`;

const StepText = styled(Text)`
  font-weight: bold;
  font-size: 12px;
  letter-spacing: 1px;
`;

const LabelText = styled(Text)`
  font-size: 12px;
  letter-spacing: 1px;
`;

const BarsContainer = styled.View`
  flex-direction: row;
  gap: 4px;
  margin-top: 8px;
  padding: 0px 24px;
`;

const Bar = styled.View<{ active: boolean; activeColor: string; inactiveColor: string }>`
  flex: 1;
  height: 3px;
  border-radius: 2px;
  background-color: ${({ active, activeColor, inactiveColor }) =>
        active ? activeColor : inactiveColor};
`;

export default function Stepper({ current, total, label }: StepperProps) {
    const theme = useTheme();

    return (
        <View>
            <Container>
                <StepText style={{ color: theme.colors.primary }}>
                    PASO {current + 1} DE {total}
                </StepText>
                {label && (
                    <LabelText style={{ color: theme.colors.onSurfaceVariant }}>
                        {label.toUpperCase()}
                    </LabelText>
                )}
            </Container>

            <BarsContainer>
                {Array.from({ length: total }).map((_, index) => (
                    <Bar
                        key={index}
                        active={index <= current}
                        activeColor={theme.colors.primary}
                        inactiveColor={theme.colors.outlineVariant}
                    />
                ))}
            </BarsContainer>
        </View>
    );
}