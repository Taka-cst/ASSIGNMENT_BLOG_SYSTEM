import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import { useState } from "react";

// フォームの入力値の型を定義
type LoginFormInputs = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const { register, handleSubmit } = useForm<LoginFormInputs>();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      setError(null);
      // バックエンドは x-www-form-urlencoded 形式を期待しているため、URLSearchParams を使用
      const params = new URLSearchParams();
      params.append('username', data.email); // API仕様では username が email に相当
      params.append('password', data.password);

      const response = await api.post('/api/v1/token', params);
      
      const token = response.data.access_token;
      await login(token);
      navigate("/"); // ログイン成功後、ホームページにリダイレクト

    } catch (err) {
      console.error(err);
      setError("メールアドレスまたはパスワードが正しくありません。");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">ログイン</h2>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700">メールアドレス</label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">パスワード</label>
            <input
              type="password"
              {...register("password", { required: true })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            ログイン
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          アカウントをお持ちでないですか？{" "}
          <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            ユーザー登録
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

