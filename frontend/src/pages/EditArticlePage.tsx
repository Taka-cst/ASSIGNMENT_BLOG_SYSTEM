import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Article } from '../types';

type ArticleFormInputs = {
  title: string;
  content: string;
};

const EditArticlePage = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ArticleFormInputs>();
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticleForEdit = async () => {
      try {
        const response = await api.get<Article>(`/api/v1/articles/${articleId}`);
        // フォームに既存のデータをセット
        reset(response.data);
      } catch (error) {
        console.error("記事の読み込みに失敗しました。", error);
        setApiError("記事の読み込みに失敗しました。");
      } finally {
        setLoading(false);
      }
    };
    fetchArticleForEdit();
  }, [articleId, reset]);

  const onSubmit: SubmitHandler<ArticleFormInputs> = async (data) => {
    try {
      setApiError(null);
      // APIにPUTリクエストを送信して記事を更新
      await api.put(`/api/v1/articles/${articleId}`, data);
      // 更新後、編集した記事の詳細ページにリダイレクト
      navigate(`/articles/${articleId}`);
    } catch (err) {
      console.error(err);
      setApiError("記事の更新に失敗しました。権限を確認してください。");
    }
  };
  
  if (loading) {
    return <p className="text-center text-gray-500">フォームを読み込み中...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">記事を編集</h2>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {apiError && <p className="text-red-500 text-sm">{apiError}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700">タイトル</label>
            <input
              type="text"
              {...register("title", { required: "タイトルは必須です" })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">本文</label>
            <textarea
              rows={10}
              {...register("content", { required: "本文は必須です" })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            更新する
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditArticlePage;
