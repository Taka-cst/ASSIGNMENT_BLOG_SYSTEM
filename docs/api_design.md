# API設計書 (v1.0)

## 1. 基本設計

- **ベースURL**: `/api/v1`
- **認証方式**: JWT (JSON Web Token)
  - 認証が必要なエンドポイントには、HTTPリクエストヘッダーに `Authorization: Bearer <access_token>` を付与する。
- **データ形式**: JSON (application/json)

## 2. 共通エラーレスポンス

| Status Code | Code | メッセージ | 説明 |
|---|---|---|---|
| 400 | INVALID_INPUT | Invalid input data | リクエストボディやパラメータが不正 |
| 401 | NOT_AUTHENTICATED | Not authenticated | 認証トークンがない、または無効 |
| 403 | PERMISSION_DENIED | Permission denied | 権限がない操作（例：他人の記事編集） |
| 404 | RESOURCE_NOT_FOUND | Resource not found | 指定されたリソースが存在しない |
| 500 | INTERNAL_ERROR | Internal server error | サーバー内部で予期せぬエラーが発生 |

### エラーレスポンス例 (400 Bad Request)

```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    }
  ]
}
```

## 3. エンドポイント仕様

### 3.1. 認証 (Auth)

#### `POST /api/v1/token`

**概要**: ログインし、アクセストークンを取得する。

**リクエスト** (Body, application/x-www-form-urlencoded):
- `username` (string, required): 登録済みのメールアドレス
- `password` (string, required): パスワード

**レスポンス** (200 OK):
```json
{
  "access_token": "eyJhbGciOiJI...",
  "token_type": "bearer"
}
```

**レスポンス** (401 Unauthorized): 認証情報が間違っている場合

---

### 3.2. ユーザー (Users)

#### `POST /api/v1/users`

**概要**: 新規ユーザーを登録する。

**リクエスト** (Body):
```json
{
  "username": "testuser",
  "email": "user@example.com",
  "password": "password123"
}
```

**レスポンス** (201 Created):
```json
{
  "id": 1,
  "username": "testuser",
  "email": "user@example.com"
}
```

**レスポンス** (400 Bad Request): メールアドレスの形式が不正、または既に登録済みの場合

#### `GET /api/v1/users/me`

**概要**: 現在ログイン中のユーザー情報を取得する。

**認証**: 必要

**レスポンス** (200 OK):
```json
{
  "id": 1,
  "username": "testuser",
  "email": "user@example.com"
}
```

---

### 3.3. 記事 (Articles)

#### `GET /api/v1/articles`

**概要**: 記事の一覧を取得する。

**レスポンス** (200 OK):
```json
[
  {
    "id": 1,
    "title": "最初の投稿",
    "created_at": "2025-10-16T12:00:00Z",
    "author": { "id": 1, "username": "testuser" }
  }
]
```

#### `POST /api/v1/articles`

**概要**: 新しい記事を投稿する。

**認証**: 必要

**リクエスト** (Body):
```json
{
  "title": "新しい記事",
  "content": "記事の本文です。"
}
```

**レスポンス** (201 Created): 作成された記事オブジェクト（詳細）

#### `GET /api/v1/articles/{article_id}`

**概要**: 指定したIDの記事を1件取得する。

**レスポンス** (200 OK):
```json
{
  "id": 1,
  "title": "最初の投稿",
  "content": "これは最初の投稿です。",
  "created_at": "2025-10-16T12:00:00Z",
  "updated_at": "2025-10-16T12:05:00Z",
  "author": { "id": 1, "username": "testuser" },
  "comments": [
    {
      "id": 1,
      "content": "良い記事ですね！",
      "created_at": "2025-10-16T14:00:00Z",
      "author": { "id": 2, "username": "anotheruser" }
    }
  ]
}
```

**レスポンス** (404 Not Found): 記事が存在しない場合

#### `PUT /api/v1/articles/{article_id}`

**概要**: 記事を更新する。

**認証**: 必要 (投稿者本人のみ)

**リクエスト** (Body):
```json
{
  "title": "更新されたタイトル",
  "content": "更新された本文です。"
}
```

**レスポンス** (200 OK): 更新された記事オブジェクト

**レスポンス** (403 Forbidden): 権限がない場合

**レスポンス** (404 Not Found): 記事が存在しない場合

#### `DELETE /api/v1/articles/{article_id}`

**概要**: 記事を削除する。

**認証**: 必要 (投稿者本人のみ)

**レスポンス** (204 No Content)

**レスポンス** (403 Forbidden): 権限がない場合

**レスポンス** (404 Not Found): 記事が存在しない場合

---

### 3.4. コメント (Comments)

#### `POST /api/v1/articles/{article_id}/comments`

**概要**: 記事にコメントを投稿する。

**認証**: 必要

**リクエスト** (Body):
```json
{
  "content": "コメントを投稿します。"
}
```

**レスポンス** (201 Created): 作成されたコメントオブジェクト

**レスポンス** (404 Not Found): 記事が存在しない場合