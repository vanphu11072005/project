import { useForm } from "react-hook-form";
import api from "../../api/api";
import { useAppDispatch } from "../../hooks";
import { loginSuccess } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import "../../styles/Login.css";

interface LoginForm {
  email: string;
  password: string;
}

function Login() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginForm>();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await api.post("/auth/login", data);

      if (res.data.user.role === "admin") {
        setError("email", {
          message: "Tài khoản admin không thể đăng nhập ở đây",
        });
        return;
      }

      dispatch(loginSuccess({ user: res.data.user, token: res.data.token }));
      navigate("/");
    } catch (err: any) {
      const message = err.response?.data?.message || "Đăng nhập thất bại";
      if (message.includes("mật khẩu")) {
        setError("password", { message });
      } else {
        setError("email", { message });
      }
    }
  };

  return (
    <div className="h-screen font-sans login bg-cover">
      <div className="container mx-auto h-full flex flex-1 justify-center items-center">
        <div className="w-full max-w-lg">
          <div className="leading-loose">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="max-w-sm m-4 p-10 bg-white bg-opacity-25 rounded shadow-xl"
            >
              <p className="text-white font-medium text-center text-lg font-bold">
                LOGIN
              </p>

              <div>
                <label className="block text-sm text-white">E-mail</label>
                <input
                  {...register("email", { required: "Email là bắt buộc" })}
                  type="email"
                  placeholder="Digite o e-mail"
                  className="w-full px-5 py-1 text-gray-700 bg-gray-300 rounded focus:outline-none focus:bg-white"
                />
                {errors.email && (
                  <span className="text-red-400 text-sm">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="mt-2">
                <label className="block text-sm text-white">Senha</label>
                <input
                  {...register("password", { required: "Mật khẩu là bắt buộc" })}
                  type="password"
                  placeholder="Digite a sua senha"
                  className="w-full px-5 py-1 text-gray-700 bg-gray-300 rounded focus:outline-none focus:bg-white"
                />
                {errors.password && (
                  <span className="text-red-400 text-sm">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <div className="mt-4 items-center flex justify-between">
                <button
                  type="submit"
                  className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 hover:bg-gray-800 rounded"
                >
                  Entrar
                </button>
                <a
                  className="inline-block right-0 align-baseline font-bold text-sm text-white hover:text-red-400"
                  href="#"
                >
                  Esqueceu a senha?
                </a>
              </div>

              <div className="text-center">
                <a className="inline-block right-0 align-baseline font-light text-sm text-white hover:text-red-400">
                  Criar uma conta
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
