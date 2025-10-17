import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Article } from '../types';
import dayjs from 'dayjs';

// 各記事をカード形式で表示するコンポーネント
const ArticleCard = ({ article }: { article: Article }) => {
  return (
    <Link to={`/articles/${article.id}`} className="block hover:shadow-xl transition-shadow duration-300">
      <div className="bg-white p-6 rounded-lg shadow-md h-full">
        <h3 className="text-xl font-semibold text-blue-700">{article.title}</h3>
        <p className="text-gray-600 mt-2">投稿者: {article.author.username}</p>
        <p className="text-gray-400 text-sm mt-1">
          投稿日: {dayjs(article.created_at).format('YYYY/MM/DD HH:mm')}
        </p>
      </div>
    </Link>
  );
};

const HomePage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api.get<Article[]>('/api/v1/articles');
        // 記事を新しい順に並び替える
        const sortedArticles = response.data.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setArticles(sortedArticles);
      } catch (err) {
        setError('記事の読み込みに失敗しました。');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">読み込み中...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8 text-gray-800">最新の記事</h2>
      {articles.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">投稿された記事はまだありません。</p>
      )}
    </div>
  );
};

export default HomePage;

