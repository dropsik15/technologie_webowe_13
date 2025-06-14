console.log('💡 login/main.js loaded')

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://kdcjstahtnwsqyqpwaep.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkY2pzdGFodG53c3F5cXB3YWVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NTA0NzAsImV4cCI6MjA2NTQyNjQ3MH0.-aF8_a17YdZ3bRHCtWr84sQOG3YhPeH-tlKlJv_tbqY'
)

const form = document.getElementById('login-form')

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const email    = form.email.value.trim()
  const password = form.password.value.trim()

  if (!email || !password) {
    return alert('Proszę podać email i hasło.')
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    alert('❌ Błąd logowania: ' + error.message)
  } else {
    window.location.href = '../index.html'
  }
})
