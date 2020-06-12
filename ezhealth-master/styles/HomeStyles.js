import { StyleSheet } from 'react-native';

export const homeStyles = StyleSheet.create({
    container: {
        flex: 1,
        width:'100%',
        height: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: colors.white,
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 195,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
    },
    iconMenu: {
        paddingRight: 10,
        alignSelf: 'flex-start',
    },
    iconLogOut: {
        width: 50,
        paddingRight: 10,
        alignSelf: 'flex-end',
    },
    info: {
        flexDirection: 'row',
        paddingTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatar: {
    },
    avatarImage: {
        borderWidth: 2,
        borderColor: colors.white,
        borderRadius: 100,
        width: 140,
        height: 140,
        alignSelf: 'flex-end',
        marginRight: 30,
    },
    name: {
        paddingTop: 10,
        fontFamily: 'quicksand-bold',
        marginLeft: 0,
        justifyContent: 'center',
    },
    nameText: {
        fontFamily: 'quicksand-bold',
        fontSize: 20,
        color: colors.white,
    },
    nameSubText: {
        fontFamily: 'quicksand-regular',
        fontSize: 18,
        color: colors.white,
    },
    body: {
        width: '100%',
        flex: 1,
        justifyContent: 'flex-start',
        
    },
    bodyTitle: {
        paddingTop: 10,
        paddingLeft: 20,
        flexDirection: 'row',

    },
    titleBodyText: {
        color: colors.black,
        flex: 1,
        alignSelf: 'flex-start',
        fontFamily: 'quicksand-bold',
        fontSize: 22,
    },
    star: {
        alignSelf: 'flex-end',
        paddingRight:10,
    },
    bodyContent: {
        marginLeft: 10,
        flexDirection:'row',
        alignItems: 'center',
        height: '100%',
        paddingBottom: 10,
    },
    bodyTouch: {
        width: 45,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100 ,
    },
    bodyContentText: {
        flex: 1,
        color: colors.black,
        alignSelf:'center'
    },
    bodyContentTitle: {
        marginLeft: 20,
        fontFamily: 'quicksand-bold',
        fontSize: 18,
    },
    bodyContentSub: {
        color: colors.black,
        marginLeft: 20,
        fontFamily: 'quicksand-regular',
        fontSize: 16,
    },
    flatlistBoby: {
    },
});