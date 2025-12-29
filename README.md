<h1 align="center">
  🏢 Enterprise Knowledge Graph & Search Platform
</h1>
<p align="center">
  An enterprise-grade knowledge management system that enables users to
  create, search, analyze, and connect documents using rich-text editing,
  analytics dashboards, real-time updates, and knowledge graph relationships.
</p>
<hr>
<h2>
  📦 Project Setup
</h2>
<h3>
  🌀 1. Clone the Repository
</h3>
<pre>
  <code>
    git clone https://github.com/Kabileshvijay/Enterprise-Knowledge-Graph-Search-Platform.git
    cd Enterprise-Knowledge-Graph-Search-Platform
  </code>
</pre>
<hr>
<h3>
  ⚙️ 2. Backend Setup
</h3>
<pre>
  <code>
    cd backend npm install
  </code>
</pre>
<h4>
  📁 Create Backend Environment File (.env)
</h4>
<pre>
  <code>
    PORT=8080 DB_URL=jdbc:mysql://localhost:3306/enterprise_knowledge DB_USERNAME=your_db_username
    DB_PASSWORD=your_db_password JWT_SECRET=YourStrongJWTSecretKey JWT_EXPIRATION=86400000
    CLIENT_URL=http://localhost:5173
  </code>
</pre>
<h4>
  ▶️ Run Backend Server
</h4>
<pre>
  <code>
    npm start
  </code>
</pre>
<p>
  Backend runs on
  <b>
    http://localhost:8080
  </b>
</p>
<hr>
<h3>
  💻 3. Frontend Setup (Vite + React)
</h3>
<pre>
  <code>
    npm create vite@latest cd frontend npm install
  </code>
</pre>
<h4>
  📦 Install Required Dependencies
</h4>
<pre>
  <code>
    npm install react-router-dom npm install react-icons npm install @tiptap/react
    @tiptap/starter-kit @tiptap/extension-underline @tiptap/extension-image
    npm install recharts npm install sockjs-client @stomp/stompjs
  </code>
</pre>
<h4>
  📁 Create Frontend Environment File (.env)
</h4>
<pre>
  <code>
    VITE_API_BASE_URL=http://localhost:8080
  </code>
</pre>
<h4>
  ▶️ Run Frontend Development Server
</h4>
<pre>
  <code>
    npm run dev
  </code>
</pre>
<p>
  Frontend runs on
  <b>
    http://localhost:5173
  </b>
</p>
<hr>
<h3>
  📂 4. Create Uploads Folder
</h3>
<pre>
  <code>
    cd backend mkdir uploads
  </code>
</pre>
<hr>
<h2>
  🧠 Key Features
</h2>
<ul>
  <li>
    📄 Rich document creation with Tiptap editor
  </li>
  <li>
    🔍 Advanced enterprise search & filtering
  </li>
  <li>
    🧩 Knowledge graph connections between documents
  </li>
  <li>
    📊 User analytics & dashboards (Recharts)
  </li>
  <li>
    💬 Comments, likes, and saved documents
  </li>
  <li>
    ⚡ Real-time notifications using WebSockets (STOMP)
  </li>
  <li>
    🔐 JWT-based authentication & role management
  </li>
</ul>
<hr>
<h2>
  🚀 Run Project (Quick Summary)
</h2>
<ol>
  <li>
    <b>
      Backend:
    </b>
    <code>
      cd backend
    </code>
    →
    <code>
      npm start
    </code>
  </li>
  <li>
    <b>
      Frontend:
    </b>
    <code>
      cd frontend
    </code>
    →
    <code>
      npm run dev
    </code>
  </li>
</ol>
<hr>
<h2>
  🌐 Git Remote Setup
</h2>
<pre>
  <code>
    git remote add origin https://github.com/Kabileshvijay/Enterprise-Knowledge-Graph-Search-Platform.git
    git branch -M main git push -u origin main
  </code>
</pre>
<hr>
<p>
  ⭐ If you find this project useful, please give it a star on GitHub!
</p>
<hr>
