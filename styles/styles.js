import { StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: "20%",
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: Colors.primary.white, // or any background color of your choice
    },
    img: {
        width: 150, // Adjust the width according to your needs
        height: 150, // Adjust the height according to your needs
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333', // Text color
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: Colors.primary.borderColor,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        backgroundColor: Colors.primary.sub,
        color: Colors.primary.black,
        fontSize: 14
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: Colors.primary.main, 
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 15,
    },
    buttonText: {
        color: '#fff', // Text color of the button
        fontSize: 18,
        fontWeight: 'bold',
    },
    signupLink: {
        marginTop: 15,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signupText: {
        marginLeft: 5,
        color: Colors.primary.linkColor, // Link color
        fontWeight: 'bold',
    },
})
export default styles;
;
