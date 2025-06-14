import{c as g}from"./index-BHP-Yw2y.js";const c=g("https://kdcjstahtnwsqyqpwaep.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkY2pzdGFodG53c3F5cXB3YWVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NTA0NzAsImV4cCI6MjA2NTQyNjQ3MH0.-aF8_a17YdZ3bRHCtWr84sQOG3YhPeH-tlKlJv_tbqY");let o=null,i=!1;h();async function h(){const{data:{user:t}}=await c.auth.getUser();i=!!t;const l=document.getElementById("add-btn"),e=document.getElementById("logout-btn"),n=document.getElementById("login-link");l.classList.remove("hidden"),l.onclick=()=>{if(!i){location.href="login/index.html";return}o=null,r("Dodaj artykuł")},e.onclick=async()=>{await c.auth.signOut(),location.reload()},document.getElementById("cancel-btn").onclick=m,document.getElementById("article-form").onsubmit=y,i?(e.classList.remove("hidden"),n.classList.add("hidden")):(e.classList.add("hidden"),n.classList.remove("hidden")),d()}async function d(){const t=document.getElementById("articles-container");t.innerHTML="Ładowanie...";const{data:l}=await c.from("articles").select("*").order("created_at",{ascending:!1});t.innerHTML="",l.forEach(e=>{const n=document.createElement("article");n.className="bg-white p-4 rounded-lg shadow mb-6";const a=i?`<div class="flex gap-2 mt-4">
           <button
             onclick="editArticle(
               ${e.id},
               '${e.title.replace(/'/g,"\\'")}',
               '${(e.subtitle||"").replace(/'/g,"\\'")}',
               '${e.author.replace(/'/g,"\\'")}',
               \`${e.content.replace(/`/g,"\\`")}\`
             )"
             class="bg-blue-500 text-white px-3 py-1 rounded transition transform hover:scale-105 hover:bg-blue-600"
           >
             Edytuj
           </button>
           <button
             onclick="deleteArticle(${e.id})"
             class="bg-red-500 text-white px-3 py-1 rounded transition transform hover:scale-105 hover:bg-red-600"
           >
             Usuń
           </button>
         </div>`:"";n.innerHTML=`
      <h2 class="text-2xl font-semibold mb-2">${e.title}</h2>
      <h3 class="text-lg italic text-gray-600 mb-2">${e.subtitle||""}</h3>
      <p class="text-sm text-gray-500 mb-1">Autor: ${e.author}</p>
      <p class="text-sm text-gray-400 mb-4">Data: ${new Date(e.created_at).toLocaleString()}</p>
      <div class="prose max-w-none mb-4">${e.content}</div>
      ${a}
    `,t.appendChild(n)})}async function y(t){if(t.preventDefault(),!i){location.href="login/index.html";return}const l=document.getElementById("article-title").value,e=document.getElementById("article-subtitle").value,n=document.getElementById("article-author").value,a=document.getElementById("article-content").value,u=new Date().toISOString(),s={title:l,subtitle:e,author:n,content:a,created_at:u};o?await c.from("articles").update(s).eq("id",o):await c.from("articles").insert([s]),m(),d()}function r(t){document.getElementById("modal-title").textContent=t,document.getElementById("article-form").reset(),document.getElementById("article-modal").classList.remove("hidden")}function m(){document.getElementById("article-modal").classList.add("hidden")}window.editArticle=(t,l,e,n,a)=>{o=t,r("Edytuj artykuł"),document.getElementById("article-title").value=l,document.getElementById("article-subtitle").value=e,document.getElementById("article-author").value=n,document.getElementById("article-content").value=a};window.deleteArticle=async t=>{await c.from("articles").delete().eq("id",t),d()};
