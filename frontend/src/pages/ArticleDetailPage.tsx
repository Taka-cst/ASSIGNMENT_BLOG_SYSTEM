import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Link をインポート
import api from '../services/api';
import { Article, Comment as CommentType } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useForm, SubmitHandler } from 'react-hook-form';
import dayjs from 'dayjs';

type CommentFormInputs = {
  content: string;
};

// コメント投稿フォームコンポーネント (変更なし)
const CommentForm = ({ articleId, onCommentPosted }: { articleId: number, onCommentPosted: (newComment: CommentType) => void }) => {
  const { register, handleSubmit, reset } = useForm<CommentFormInputs>();
  const { isAuthenticated } = useAuth();

  const onSubmit: SubmitHandler<CommentFormInputs> = async (data) => {
    if (!data.content.trim()) return;
    try {
      const response = await api.post(`/api/v1/articles/${articleId}/comments`, data);
      onCommentPosted(response.data);
      reset(); // フォームをリセット
    } catch (error) {
      console.error("コメントの投稿に失敗しました。", error);
    }
  };

  if (!isAuthenticated) {
    return <p className="text-center text-gray-500 mt-8">コメントを投稿するにはログインが必要です。</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">コメントを投稿する</h3>
      <textarea
        {...register("content", { required: true })}
        rows={4}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="素敵なコメントをお待ちしています..."
      />
      <button type="submit" className="mt-4 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">
        投稿
      </button>
    </form>
  );
};

// メインの詳細ページコンポーネント
const ArticleDetailPage = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchArticle = async () => {
    try {
      const response = await api.get<Article>(`/api/v1/articles/${articleId}`);
      setArticle(response.data);
    } catch (error) {
      console.error("記事の読み込みに失敗しました。", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [articleId]);

  const handleCommentPosted = (newComment: CommentType) => {
    setArticle(prevArticle => prevArticle ? { ...prevArticle, comments: [...prevArticle.comments, newComment] } : null);
  };
  
  const handleDelete = async () => {
    if (article && window.confirm("この記事を本当に削除しますか？")) {
      try {
        await api.delete(`/api/v1/articles/${article.id}`);
        navigate('/'); // 削除後、ホームページにリダイレクト
      } catch (error) {
        console.error("記事の削除に失敗しました。", error);
        alert("記事の削除に失敗しました。");
      }
    }
  };

  if (loading) return <p className="text-center">読み込み中...</p>;
  if (!article) return <p className="text-center">記事が見つかりません。</p>;

  // 記事の投稿者かどうかを判定
  const isAuthor = user?.id === article.author.id;

  return (
    <div>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold mb-4 text-gray-900">{article.title}</h1>
        <div className="text-sm text-gray-500 mb-6">
          <span>投稿者: {article.author.username}</span> | 
          <span> 投稿日: {dayjs(article.created_at).format('YYYY/MM/DD')}</span>
        </div>
        
        {isAuthor && (
          <div className="flex space-x-2 mb-6">
            {/* ★★★ 編集ページへのリンクを追加 ★★★ */}
            <Link 
              to={`/articles/${article.id}/edit`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              編集
            </Link>
            <button 
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
            >
              削除
            </button>
          </div>
        )}

        <div className="prose max-w-none text-gray-800 whitespace-pre-wrap">{article.content}</div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">コメント ({article.comments.length})</h2>
        <div className="space-y-4">
          {article.comments.map((comment) => (
            <div key={comment.id} className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-700">{comment.content}</p>
              <p className="text-xs text-gray-500 mt-2">
                {comment.author.username} - {dayjs(comment.created_at).format('YYYY/MM/DD HH:mm')}
              </p>
            </div>
          ))}
        </div>
        <CommentForm articleId={article.id} onCommentPosted={handleCommentPosted} />
      </div>
    </div>
  );
};

export default ArticleDetailPage;

