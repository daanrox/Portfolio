function redirectToRevendaPage() {
    window.location.href = '/';
  }
  const sairButton = document.querySelector('.header__exit');
  sairButton.addEventListener('click', redirectToRevendaPage);


function login(event) {
    event.preventDefault();
  
    const emailValue = document.querySelector('input[type="email"]').value;
    const senhaValue = document.querySelector('input[type="password"]').value;
  
    const data = {
      email: emailValue,
      password: senhaValue
    };
  
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  
    fetch('https://x8ki-letl-twmt.n7.xano.io/api:QeSM43R0/auth/login', requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.authToken) {
          localStorage.setItem('authToken', data.authToken);
  
          window.location.href = '/revenda/dashboard';
        } else {
          console.error('Erro: authToken não encontrado na resposta da requisição.');
        }
      })
      .catch(error => {
        console.error('Erro na requisição:', error);
      });
  }
  
  const loginButton = document.querySelector('.login__form button');
  loginButton.addEventListener('click', login);