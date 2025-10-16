データベース設計書 (v1.0)

1. 設計方針

正規化: 第3正規形を基準とし、データの冗長性を排除する。

命名規則:

テーブル名: 複数形の snake_case (例: articles)

カラム名: snake_case (例: user_id)

主キー: id

外部キー: {参照先テーブル単数形}_id (例: user_id)

タイムスタンプ: 全てのテーブルに作成日時 (created_at) を持たせる。更新日時 (updated_at) は必要なテーブルにのみ追加する。日時はUTCで保存する。

2. ER図

erDiagram
    users {
        int id PK
        varchar(50) username
        varchar(255) email
        varchar(255) hashed_password
        timestamp created_at
    }

    articles {
        int id PK
        varchar(255) title
        text content
        timestamp created_at
        timestamp updated_at
        int author_id FK
    }

    comments {
        int id PK
        text content
        timestamp created_at
        int author_id FK
        int article_id FK
    }

    users ||--o{ articles : "authors"
    users ||--o{ comments : "authors"
    articles ||--o{ comments : "contains"


3. テーブル定義

users テーブル

論理名: ユーザー

物理名: users

説明: システムを利用するユーザー情報を格納する。

論理名

物理名

データ型

制約

説明

ユーザーID

id

SERIAL

PRIMARY KEY

一意の識別子

ユーザー名

username

VARCHAR(50)

NOT NULL, UNIQUE

表示用のユーザー名

Eメール

email

VARCHAR(255)

NOT NULL, UNIQUE

ログインIDとして使用。一意性を保証

ハッシュ化パスワード

hashed_password

VARCHAR(255)

NOT NULL

安全性を考慮し、ハッシュ化したパスワードを保存

作成日時

created_at

TIMESTAMP

NOT NULL, DEFAULT now()

ユーザー登録日時

インデックス:

idx_users_email: email カラム (ログイン時の検索高速化のため)

articles テーブル

論理名: 記事

物理名: articles

説明: ユーザーによって投稿された記事データを格納する。

論理名

物理名

データ型

制約

説明

記事ID

id

SERIAL

PRIMARY KEY

一意の識別子

タイトル

title

VARCHAR(255)

NOT NULL

記事のタイトル

本文

content

TEXT

NOT NULL

記事の本文

投稿者ID

author_id

INTEGER

NOT NULL, FOREIGN KEY (users.id)

記事を投稿したユーザーのID

作成日時

created_at

TIMESTAMP

NOT NULL, DEFAULT now()

記事の初回投稿日時

更新日時

updated_at

TIMESTAMP

NOT NULL, DEFAULT now()

記事の最終更新日時

インデックス:

idx_articles_author_id: author_id カラム (特定ユーザーの記事一覧表示の高速化のため)

comments テーブル

論理名: コメント

物理名: comments

説明: 各記事に対して投稿されたコメントを格納する。

論理名

物理名

データ型

制約

説明

コメントID

id

SERIAL

PRIMARY KEY

一意の識別子

本文

content

TEXT

NOT NULL

コメントの本文

投稿者ID

author_id

INTEGER

NOT NULL, FOREIGN KEY (users.id)

コメントを投稿したユーザーのID

記事ID

article_id

INTEGER

NOT NULL, FOREIGN KEY (articles.id)

コメント対象の記事ID

作成日時

created_at

TIMESTAMP

NOT NULL, DEFAULT now()

コメントの投稿日時

インデックス:

idx_comments_article_id: article_id カラム (特定記事のコメント一覧表示の高速化のため)

idx_comments_author_id: author_id カラム