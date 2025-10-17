import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Layout = () => {
  const { isAuthenticated, user, logout, isLoading } = useAuth();

  const renderAuthLinks = () => {
    if (isLoading) {
      return <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>;
    }

    if (isAuthenticated && user) {
      return (
        <div className="flex items-center space-x-4">
          <span className="text-gray-800 hidden sm:block">ようこそ, {user.username}さん</span>
          {/* ★★★ 新規投稿ページへのリンクを追加 ★★★ */}
          <Link to="/articles/new" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium">
            新規投稿
          </Link>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            ログアウト
          </button>
        </div>
      );
    } else {
      return (
        <div className="space-x-4">
          <Link to="/login" className="text-gray-600 hover:text-blue-600">ログイン</Link>
          <Link to="/signup" className="text-gray-600 hover:text-blue-600">ユーザー登録</Link>
        </div>
      );
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-3xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
            Blog System
          </Link>
          <div>{renderAuthLinks()}</div>
        </nav>
      </header>
      <main className="container mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

