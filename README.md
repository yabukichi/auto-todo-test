# Todo App

Node.js v23を使用したシンプルなTODOアプリケーションです。

## 機能

- TODOの作成・追加
- TODOの一覧表示
- TODOの完了/未完了切り替え
- TODOの編集（インライン編集）
- TODOの削除
- レスポンシブデザイン

## 技術スタック

- **Backend**: Node.js v23, Express.js
- **Database**: SQLite3
- **Frontend**: HTML, CSS, JavaScript (バニラJS)

## セットアップと起動方法

### 前提条件
- Node.js v23以上がインストールされていること

### インストール
```bash
# 依存関係のインストール
npm install
```

### 起動方法
```bash
# 本番環境での起動
npm start

# 開発環境での起動（自動リロード）
npm run dev
```

アプリケーションは `http://localhost:3000` でアクセス可能です。

## ファイル構成と仕様

### サーバーサイド

#### `server.js`
- **役割**: Express.jsを使用したメインサーバーファイル
- **機能**:
  - 静的ファイル（HTML/CSS/JS）の配信
  - RESTful API エンドポイントの提供
  - ポート3000でサーバー起動

**API エンドポイント**:
- `GET /api/todos` - 全TODO取得
- `POST /api/todos` - 新規TODO作成
- `PUT /api/todos/:id` - TODO更新（テキスト/完了状態）
- `DELETE /api/todos/:id` - TODO削除

#### `database.js`
- **役割**: SQLiteデータベースの設定と接続管理
- **機能**:
  - SQLiteデータベースファイル（todos.db）の作成・接続
  - todosテーブルの初期化
  - データベース操作のエクスポート

**テーブル構造（todos）**:
- `id`: INTEGER PRIMARY KEY AUTOINCREMENT
- `text`: TEXT NOT NULL
- `completed`: BOOLEAN DEFAULT 0
- `created_at`: DATETIME DEFAULT CURRENT_TIMESTAMP

#### `package.json`
- **役割**: プロジェクトの設定とメタデータ
- **主要スクリプト**:
  - `start`: 本番環境でのサーバー起動
  - `dev`: 開発環境でのサーバー起動（--watchフラグ付き）
- **依存関係**:
  - `express`: ^5.1.0
  - `sqlite3`: ^5.1.7

### フロントエンド（public/）

#### `index.html`
- **役割**: メインHTMLページ
- **構成**:
  - TODO入力フォーム
  - TODO一覧表示エリア
  - レスポンシブデザイン対応のビューポート設定

#### `style.css`
- **役割**: アプリケーションのスタイルシート
- **特徴**:
  - モダンなUI/UXデザイン
  - レスポンシブレイアウト
  - ホバーエフェクトとトランジション
  - 完了済みTODOの視覚的区別

**主要CSSクラス**:
- `.todo-item`: 個別のTODOアイテム
- `.todo-item.completed`: 完了済みTODO
- `.edit-input`: 編集時の入力フィールド

#### `script.js`
- **役割**: フロントエンドのメインJavaScriptファイル
- **構成**: TodoAppクラスベースの設計

**TodoAppクラスの主要メソッド**:
- `loadTodos()`: サーバーからTODO一覧を取得
- `addTodo()`: 新しいTODOを追加
- `toggleTodo(id, completed)`: TODO完了状態を切り替え
- `updateTodo(id, text)`: TODOテキストを更新
- `deleteTodo(id)`: TODOを削除
- `editTodo(li, todo)`: インライン編集機能
- `renderTodos()`: TODO一覧をDOM に描画

**主要機能**:
- 非同期API通信（fetch API使用）
- DOM操作とイベントハンドリング
- インライン編集（ダブルクリック不要）
- XSS対策（HTMLエスケープ）

## データベース

SQLiteデータベース（`todos.db`）が自動的に作成されます。
テーブル構造は起動時に自動的に初期化されます。

## 開発者向け情報

### Node.js v23の活用
- `--watch`フラグを使用した開発時の自動リロード機能
- 最新のECMAScript機能のサポート

### セキュリティ考慮事項
- SQLインジェクション対策（パラメータ化クエリ使用）
- XSS対策（HTMLエスケープ）
- 入力値検証

