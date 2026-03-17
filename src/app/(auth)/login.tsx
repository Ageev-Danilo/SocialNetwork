import { View, Text } from 'react-native';
import { Button, Input } from '@/shared/ui';

import { BASE } from '@/shared/consts';


export default function Login() {
    return (
        <View style={[BASE.column, {backgroundColor: 'white', paddingVertical: 44, paddingHorizontal: 16, borderRadius: 20, gap: 24}]}>
            <View></View>
            <Text>Раді тебе знову бачити!</Text>
            <View>
                <Text>Електронна пошта</Text>
                <Input type='email' holder='you@example.com' />
                <Text>Пароль</Text>
                <Input type='pwd' holder='Введи пароль' />
            </View>
            <Button type='fill' text='Увійти' />
        </View>
    );
}