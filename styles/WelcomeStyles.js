import { StyleSheet } from 'react-native';

export const welcomeStyles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        paddingTop: 100,
        paddingBottom: 80,
        flex: 1,
        backgroundColor: '#fffafc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    divider: {
        backgroundColor: colors.black,
        height: 2,
        flex: 1,
    },
    title: {
        fontFamily: 'quicksand-bold',
        fontSize: 38,
        color: colors.green,
        paddingHorizontal: 38,
    },

    logo: {
        width: 320,
        height: 240,
        opacity: 1,
        marginBottom: 30,
        borderRadius: 200,
    },
    textRegister: {
        color: colors.white,
        fontSize: 18,
        fontFamily: 'quicksand-bold',
    
    },
    register: {
        marginTop: 140,
        paddingVertical: 12,
        paddingHorizontal: 115,
        backgroundColor: colors.black,
        borderRadius: 50,
    },
    text: {
        marginTop: 10,
        fontFamily: 'quicksand-bold',
    },
    registerModal: {
        
    }
});