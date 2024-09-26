import * as Yup from 'yup';

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .required('Vui lòng nhập email')
    .email('Vui lòng nhập địa chỉ email hợp lệ')
    .label('Email'),
  password: Yup.string()
    .required('Vui lòng nhập mật khẩu')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .label('Password')
});

export const signupValidationSchema = Yup.object().shape({
  fullName: Yup.string()
    .trim('Họ và tên không thể chỉ chứa khoảng trắng') // Xóa khoảng trắng đầu và cuối
    .required('Họ và tên là bắt buộc')
    .matches(/^(?!\s*$).+/, "Họ và tên không thể để trống hoặc chỉ chứa khoảng trắng") // Kiểm tra rỗng hoặc chỉ chứa khoảng trắng
    .min(3, 'Họ và tên phải có ít nhất 3 ký tự')
    .max(50, 'Họ và tên không thể vượt quá 50 ký tự')
    .label('Họ và tên'),

  email: Yup.string()
    .required('Vui lòng nhập email')
    .email('Vui lòng nhập địa chỉ email hợp lệ')
    .label('Email'),

  phone: Yup.string()
    .required('Số điện thoại là bắt buộc')
    .matches(/^[0-9]+$/, "Số điện thoại chỉ được chứa chữ số")
    .min(10, 'Số điện thoại phải có ít nhất 10 chữ số')
    .max(15, 'Số điện thoại không thể vượt quá 15 chữ số')
    .label('Số điện thoại'),

  address: Yup.string()
    .required('Địa chỉ là bắt buộc')
    .min(10, 'Địa chỉ phải có ít nhất 10 ký tự')
    .max(100, 'Địa chỉ không thể vượt quá 100 ký tự')
    .label('Địa chỉ'),

  password: Yup.string()
    .required('Mật khẩu là bắt buộc')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .matches(/[a-z]/, "Mật khẩu phải chứa ít nhất một chữ cái thường")
    .matches(/[A-Z]/, "Mật khẩu phải chứa ít nhất một chữ cái hoa")
    .matches(/\d/, "Mật khẩu phải chứa ít nhất một chữ số")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Mật khẩu phải chứa ít nhất một ký tự đặc biệt")
    .label('Mật khẩu'),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Mật khẩu xác nhận phải trùng khớp với mật khẩu')
    .required('Mật khẩu xác nhận là bắt buộc')
    .label('Mật khẩu xác nhận')
});

export const passwordResetSchema = Yup.object().shape({
  email: Yup.string()
    .required('Vui lòng nhập email')
    .email('Vui lòng nhập địa chỉ email hợp lệ')
    .label('Email'),
});
