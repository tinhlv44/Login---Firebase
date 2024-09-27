import { MyContextControllerProvider } from "./store";
import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Router from "./routers/Router";
import { auth, db } from "./firebaseConfig"; // Import auth và db từ firebaseConfig
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore"; // Import các hàm từ Firestore
import { MenuProvider } from "react-native-popup-menu";

const App = () => {
    const admin = {
        fullName: "Admin",
        email: "admin@gmail.com",
        password: "Admin@44",
        phone: "0913131732",
        address: "Bình Dương",
        role: "admin"
    };

    useEffect(() => {
        const checkAndCreateAdmin = async () => {
            try {
                // Trỏ tới tài liệu của admin trong collection "USERS"
                const adminDocRef = doc(db, "USERS", admin.email);
                
                // Lấy dữ liệu của tài liệu admin
                const docSnap = await getDoc(adminDocRef);

                // Nếu tài liệu không tồn tại, đăng ký và thêm vào Firestore
                if (!docSnap.exists()) {
                    // Đăng ký tài khoản admin trên Firebase Authentication
                    await createUserWithEmailAndPassword(auth, admin.email, admin.password);

                    // Lưu thông tin admin vào Firestore
                    await setDoc(adminDocRef, admin);

                    console.log("Đã tạo 1 tài khoản admin");
                }
            } catch (error) {
                console.error("Lỗi khi tạo tài khoản admin:", error);
            }
        };

        checkAndCreateAdmin();
    }, []);

    return (
        <MenuProvider>

            <Router />
        </MenuProvider>
        // <MyContextControllerProvider>
        //     <NavigationContainer>
        //     </NavigationContainer>
        // </MyContextControllerProvider>
    );
};

export default App;
