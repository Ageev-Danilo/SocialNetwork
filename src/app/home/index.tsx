import { View, Text } from 'react-native';
import { Body } from '@/components';


export default function HomeScreen() {
    return (
        <Body>
            {Array.from({ length: 40 }, (_, i) => (
                <View key={i} style={{
                    padding: 16,
                    backgroundColor: 'white',
                    marginHorizontal: 16,
                    marginTop: 12,
                    borderRadius: 12,
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOpacity: 0.06,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 2 },
                }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#070A1C' }}>
                        Користувач #{i + 1}
                    </Text>
                    <Text style={{ color: '#999', marginTop: 4, fontSize: 13 }}>
                        Особиста інформація буде тут
                    </Text>
                </View>
            ))}
        </Body>
    );
}