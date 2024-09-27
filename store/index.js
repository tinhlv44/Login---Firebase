import { createContext, useContext, useMemo, useReducer } from 'react'
import { auth, db } from '../firebaseConfig'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { Alert } from 'react-native'
import { collection, query, where, getDocs } from 'firebase/firestore'

const MyContext = createContext()
MyContext.displayName = 'MyAppContext'

// Định nghĩa reducer
const reducer = (state, action) => {
    switch (action.type) {
        case "USER_LOGIN":
            return { ...state, userLogin: action.value, uid: action.uid } // Lưu uid khi login
        case "LOGOUT":
            return { ...state, userLogin: null, uid: null } // Xoá uid khi logout
        default:
            return state
    }
}

// Định nghĩa MyContextControllerProvider
const MyContextControllerProvider = ({ children }) => {
    // Khởi tạo state
    const initialState = {
        userLogin: null,
        uid: null,  // Thêm uid vào state
        services: [],
    }
    const [controller, dispatch] = useReducer(reducer, initialState)

    // Phân biệt useMemo useEffect
    const value = useMemo(() => [controller, dispatch], [controller, dispatch])

    return (
        <MyContext.Provider value={value}>
            {children}
        </MyContext.Provider>
    )
}

// Định nghĩa useMyContextController
const useMyContextController = () => {
    const context = useContext(MyContext)
    if (context == null) throw new Error('useMyContextController must be inside MyContextControllerProvider')
    return context
}

// Định nghĩa các action
const login = async (dispatch, email, password) => {
    try {
        // Đăng nhập với Firebase Auth
        const response = await signInWithEmailAndPassword(auth, email, password)
        const uid = response.user.uid // Lấy uid của người dùng

        // Lấy tài liệu từ collection "USERS" nơi email khớp với tài khoản
        const q = query(collection(db, "USERS"), where("email", "==", email))
        const querySnapshot = await getDocs(q)

        // Kiểm tra nếu tìm thấy người dùng
        if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data()
            dispatch({ type: "USER_LOGIN", value: userData, uid }) // Lưu uid và userData
        } else {
            Alert.alert('Thông báo', 'Không tìm thấy thông tin người dùng.')
        }
    } catch (e) {
        Alert.alert('Thông báo', 'Sai email hoặc password')
        console.log("Lỗi khi đăng nhập:", e)
    }
}

const logout = async (dispatch) => {
    try {
        await signOut(auth)
        dispatch({ type: "LOGOUT" })
    } catch (e) {
        Alert.alert('Thông báo', 'Đăng xuất thất bại.')
    }
}

export {
    MyContextControllerProvider,
    useMyContextController,
    login,
    logout
}
