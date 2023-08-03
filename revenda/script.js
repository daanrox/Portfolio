function redirectToRevendaPage() {
    window.location.href = 'https://daanrox.com/';
  }
  const sairButton = document.querySelector('.header__exit');
  sairButton.addEventListener('click', redirectToRevendaPage);


// Função para fazer a requisição POST ao fazer login
function login(event) {
    event.preventDefault(); // Evita o envio do formulário padrão
  
    // Capturar os valores dos inputs de email e senha
    const emailValue = document.querySelector('input[type="email"]').value;
    const senhaValue = document.querySelector('input[type="password"]').value;
  
    // Criar o objeto com os dados a serem enviados no corpo da requisição
    const data = {
      email: emailValue,
      password: senhaValue
    };
  
    // Configurar as opções da requisição
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  
    // Fazer a requisição POST para a rota de login
    fetch('https://x8ki-letl-twmt.n7.xano.io/api:QeSM43R0/auth/login', requestOptions)
      .then(response => response.json())
      .then(data => {
        // Verificar se a resposta contém o authToken
        if (data.authToken) {
          // Salvar o authToken no localStorage
          localStorage.setItem('authToken', data.authToken);
  
          // Redirecionar o usuário para a página /dashboard
          window.location.href = 'https://daanrox.com/dashboard';
        } else {
          console.error('Erro: authToken não encontrado na resposta da requisição.');
        }
      })
      .catch(error => {
        // Caso ocorra algum erro na requisição, você pode tratá-lo aqui.
        console.error('Erro na requisição:', error);
      });
  }
  
  // Adicionando um evento de clique ao botão "Login"
  const loginButton = document.querySelector('.login__form button');
  loginButton.addEventListener('click', login);