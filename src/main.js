import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://kdcjstahtnwsqyqpwaep.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkY2pzdGFodG53c3F5cXB3YWVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NTA0NzAsImV4cCI6MjA2NTQyNjQ3MH0.-aF8_a17YdZ3bRHCtWr84sQOG3YhPeH-tlKlJv_tbqY'
)

let currentEditId = null
let isLoggedIn = false

main()

async function main() {
  const { data: { user } } = await supabase.auth.getUser()
  isLoggedIn = !!user

  const addBtn    = document.getElementById('add-btn')
  const logoutBtn = document.getElementById('logout-btn')
  const loginLink = document.getElementById('login-link')

  addBtn.classList.remove('hidden')
  addBtn.onclick = () => {
    if (!isLoggedIn) {
      location.href = 'login/index.html'
      return
    }
    currentEditId = null
    openModal('Dodaj artykuł')
  }

  logoutBtn.onclick = async () => {
    await supabase.auth.signOut()
    location.reload()
  }

  document.getElementById('cancel-btn').onclick   = closeModal
  document.getElementById('article-form').onsubmit = handleFormSubmit

  if (isLoggedIn) {
    logoutBtn.classList.remove('hidden')
    loginLink.classList.add('hidden')
  } else {
    logoutBtn.classList.add('hidden')
    loginLink.classList.remove('hidden')
  }

  renderArticles()
}

async function renderArticles() {
  const container = document.getElementById('articles-container')
  container.innerHTML = 'Ładowanie...'

  const { data } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })

  container.innerHTML = ''
  data.forEach((art) => {
    const articleEl = document.createElement('article')
    articleEl.className = 'bg-white p-4 rounded-lg shadow mb-6'

    const crudButtons = isLoggedIn
      ? `<div class="flex gap-2 mt-4">
           <button
             onclick="editArticle(
               ${art.id},
               '${art.title.replace(/'/g, "\\'")}',
               '${(art.subtitle||'').replace(/'/g, "\\'")}',
               '${art.author.replace(/'/g, "\\'")}',
               \`${art.content.replace(/`/g, "\\`")}\`
             )"
             class="bg-blue-500 text-white px-3 py-1 rounded transition transform hover:scale-105 hover:bg-blue-600"
           >
             Edytuj
           </button>
           <button
             onclick="deleteArticle(${art.id})"
             class="bg-red-500 text-white px-3 py-1 rounded transition transform hover:scale-105 hover:bg-red-600"
           >
             Usuń
           </button>
         </div>`
      : ''

    articleEl.innerHTML = `
      <h2 class="text-2xl font-semibold mb-2">${art.title}</h2>
      <h3 class="text-lg italic text-gray-600 mb-2">${art.subtitle||''}</h3>
      <p class="text-sm text-gray-500 mb-1">Autor: ${art.author}</p>
      <p class="text-sm text-gray-400 mb-4">Data: ${new Date(art.created_at).toLocaleString()}</p>
      <div class="prose max-w-none mb-4">${art.content}</div>
      ${crudButtons}
    `
    container.appendChild(articleEl)
  })
}

async function handleFormSubmit(e) {
  e.preventDefault()
  if (!isLoggedIn) {
    location.href = 'login/index.html'
    return
  }

  const title    = document.getElementById('article-title').value
  const subtitle = document.getElementById('article-subtitle').value
  const author   = document.getElementById('article-author').value
  const content  = document.getElementById('article-content').value
  const now      = new Date().toISOString()

  const record = { title, subtitle, author, content, created_at: now }

  if (currentEditId) {
    await supabase.from('articles').update(record).eq('id', currentEditId)
  } else {
    await supabase.from('articles').insert([record])
  }

  closeModal()
  renderArticles()
}

function openModal(header) {
  document.getElementById('modal-title').textContent = header
  document.getElementById('article-form').reset()
  document.getElementById('article-modal').classList.remove('hidden')
}

function closeModal() {
  document.getElementById('article-modal').classList.add('hidden')
}

window.editArticle = (id, title, subtitle, author, content) => {
  currentEditId = id
  openModal('Edytuj artykuł')
  document.getElementById('article-title').value    = title
  document.getElementById('article-subtitle').value = subtitle
  document.getElementById('article-author').value   = author
  document.getElementById('article-content').value  = content
}

window.deleteArticle = async (id) => {
  await supabase.from('articles').delete().eq('id', id)
  renderArticles()
}
