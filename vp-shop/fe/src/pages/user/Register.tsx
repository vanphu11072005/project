import { useForm } from "react-hook-form";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function Register() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>();
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterForm) => {
    try {
      await api.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password
      });

      // Hiển thị SweetAlert2 khi đăng ký thành công
      Swal.fire({
        icon: "success",
        title: "Đăng ký thành công 🎉",
        text: "Vui lòng đăng nhập để tiếp tục",
        timer: 2500,
        showConfirmButton: false
      });

      navigate("/login");
    } catch (err: any) {
      // Hiển thị SweetAlert2 khi có lỗi
      Swal.fire({
        icon: "error",
        title: "Đăng ký thất bại ❌",
        text: err.response?.data?.message || "Có lỗi xảy ra",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto mt-10 p-6 border rounded shadow"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

      <input
        {...register("name", { required: "Tên là bắt buộc" })}
        placeholder="Name"
        className="border p-2 w-full mb-2 rounded"
      />
      {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

      <input
        {...register("email", {
          required: "Email là bắt buộc",
          pattern: { value: /^\S+@\S+$/i, message: "Email không hợp lệ" }
        })}
        type="email"
        placeholder="Email"
        className="border p-2 w-full mb-2 rounded"
      />
      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

      <input
        {...register("password", {
          required: "Mật khẩu là bắt buộc",
          minLength: { value: 6, message: "Mật khẩu phải ít nhất 6 ký tự" }
        })}
        type="password"
        placeholder="Password"
        className="border p-2 w-full mb-2 rounded"
      />
      {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

      <input
        {...register("confirmPassword", {
          required: "Xác nhận mật khẩu là bắt buộc",
          validate: (value) =>
            value === watch("password") || "Mật khẩu xác nhận không khớp"
        })}
        type="password"
        placeholder="Confirm Password"
        className="border p-2 w-full mb-2 rounded"
      />
      {errors.confirmPassword && (
        <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white p-3 w-full rounded hover:bg-blue-700 transition"
      >
        Register
      </button>
    </form>
  );
}

export default Register;
