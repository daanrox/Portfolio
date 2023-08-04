// script_dashboard.js
import { services } from './database.js';
// Função para verificar se o token é válido
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
        .then(response => response.json())
        .then(data => {
          // Verificar se o objeto de resposta contém a chave "balance"
          if (data.balance !== undefined) {
            // Atualizar o elemento <span> com o saldo formatado em moeda BRL
            const balanceDisplay = document.querySelector('.balance__display span');
            const formattedBalance = formatCurrencyBRL(data.balance);
            balanceDisplay.textContent = formattedBalance;
          } if(data.name !== undefined) {
            const nameUser = document.querySelector('.name__user');
            nameUser.textContent = data.name;
           } else {
            console.error('Erro: Saldo não encontrado na resposta da requisição.');
          }
        })
        .catch(error => {
          console.error('Erro na requisição:', error);
        });
    } else {
      // Não há token, redirecionar para a página de login
      redirectToLoginPage();
    }
  }
  
  // Função para formatar o valor numérico em moeda BRL
  function formatCurrencyBRL(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }
  
  // Função para redirecionar o usuário para a página de login
  function redirectToLoginPage() {
    window.location.href = 'https://daanrox.com/revenda';
  }
  
  // Verificar o token válido quando a página é carregada
  verifyToken();
  

  // Renderizar os options no select.

  function renderOptions() {
    const selectElement = document.getElementById('serviceSelect');

    // Loop through the 'services' array and create an option for each object
    services.forEach(service => {
        const optionElement = document.createElement('option');
        optionElement.value = service.price;
        optionElement.textContent = service.name;
        optionElement.setAttribute('data-id', service.id);

        // Append the option to the select element
        selectElement.appendChild(optionElement);
    });
}

// Call the function to render options when the DOM is ready
document.addEventListener('DOMContentLoaded', renderOptions);




function updateOrderTotal() {
    const quantityInput = document.getElementById('quantityInput');
    const totalSpan = document.getElementById('spanTotal');
    const serviceSelect = document.getElementById('serviceSelect');

    const selectedServicePrice = parseFloat(serviceSelect.value);
    const quantity = parseInt(quantityInput.value);

    if (!isNaN(selectedServicePrice) && !isNaN(quantity)) {
        const total = (selectedServicePrice * quantity) / 1000; // Dividindo por 1000 para obter o valor para uma unidade
        totalSpan.textContent = total.toFixed(2);
    } else {
        totalSpan.textContent = '';
    }
}
// Call the function to render options when the DOM is ready
document.addEventListener('DOMContentLoaded', renderOptions);

// Add event listeners to update the order total when the quantity or service is changed
const quantityInput = document.getElementById('quantityInput');
quantityInput.addEventListener('input', updateOrderTotal);

const serviceSelect = document.getElementById('serviceSelect');
serviceSelect.addEventListener('change', updateOrderTotal);

// Optionally, you may want to call 'updateOrderTotal' initially to show the total even if the user hasn't typed anything yet
updateOrderTotal();