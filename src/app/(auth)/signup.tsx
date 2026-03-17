import { Button, Input } from '@/shared/ui';
import { View, Text } from 'react-native';

export default function Signup() {
    return (
        <View>
            <Text>Приєднуйся до World IT</Text>
            <View>
                <Text>Електронна пошта</Text>
                <Input type="email" holder="you@example.com" />
                <Text>Пароль</Text>
                <Input type="pwd" holder="Введи пароль" />
                <Text>Підтверди пароль</Text>
                <Input type="pwd" holder="Повтори пароль" />
            </View>
            <Button type="fill" text="Створити акаунт" />
        </View>
    );
}
