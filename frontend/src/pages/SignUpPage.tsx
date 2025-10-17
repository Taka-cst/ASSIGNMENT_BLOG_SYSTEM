import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useState } from "react";

// フォームの入力値の型を定義
type SignUpFormInputs = {
  username: string;
  email: string;
  password: string;
};

const SignUpPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormInputs>();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    try {
      setApiError(null);
      await api.post('/api/v1/users', data);
      navigate("/login"); // 登録成功後、ログインページにリダイレクト
    } catch (err) {
      console.error(err);
      setApiError("このメールアドレスは既に使用されています。");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">ユーザー登録</h2>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {apiError && <p className="text-red-500 text-sm text-center">{apiError}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700">ユーザー名</label>
            <input
              type="text"
              {...register("username", { required: "ユーザー名は必須です" })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">メールアドレス</label>
            <input
              type="email"
              {...register("email", { required: "メールアドレスは必須です" })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
             {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">パスワード</label>
            <input
              type="password"
              {...register("password", { required: "パスワードは必須です", minLength: { value: 8, message: "8文字以上で入力してください" } })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            登録する
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          すでにアカウントをお持ちですか？{" "}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            ログイン
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;

