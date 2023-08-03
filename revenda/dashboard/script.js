
function verifyToken() {
  // Obter o token do localStorage
  const authToken = localStorage.getItem('authToken');

  if (authToken) {
    // Configurar as opções da requisição GET
    const requestOptions = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    };

    // Fazer a requisição GET para a rota de verificação do token
    fetch('https://x8ki-letl-twmt.n7.xano.io/api:QeSM43R0/auth/me', requestOptions)
      .then(response => {
        if (response.ok) {
          // O token é válido, permanecer na página dashboard
          console.log('Token válido.');
        } else {
          // O token é inválido ou a requisição falhou, redirecionar para a página de login
          redirectToLoginPage();
        }
      })
      .catch(error => {
        // A requisição falhou, redirecionar para a página de login
        redirectToLoginPage();
      });
  } else {
    // Não há token, redirecionar para a página de login
    redirectToLoginPage();
  }
}

// Função para redirecionar o usuário para a página de login
function redirectToLoginPage() {
  window.location.href = 'https://daanrox.com/revenda';
}

// Função para realizar o logout
function logout() {
  // Remover o token do localStorage
  localStorage.removeItem('authToken');

  // Redirecionar o usuário para a página de login
  redirectToLoginPage();
}

// Verificar o token válido quando a página é carregada
verifyToken();

// Adicionar um evento de clique ao botão "Logout"
const logoutButton = document.querySelector('.header__exit');
logoutButton.addEventListener('click', logout);