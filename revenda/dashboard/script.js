// script.js
import { services } from './database.js';

function verifyToken() {
    const authToken = localStorage.getItem('authToken');

    if (authToken) {
        const requestOptions = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        };

        fetch('https://x8ki-letl-twmt.n7.xano.io/api:QeSM43R0/auth/me', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.balance !== undefined) {
                    const balanceDisplay = document.querySelector('.balance__display span');
                    const formattedBalance = formatCurrencyBRL(data.balance);
                    balanceDisplay.textContent = formattedBalance;
                }
                if (data.name !== undefined) {
                    const nameUser = document.querySelector('.name__user');
                    nameUser.textContent = data.name;
                } else {
                    console.error('Erro: Saldo não encontrado na resposta da requisição.');
                }

                if (data.id !== undefined) {
                    const userId = data.id;
                    const addOrderButton = document.getElementById('addOrder');
                    addOrderButton.addEventListener('click', () => addOrder(userId));
                }
            })
            .catch(error => {
                console.error('Erro na requisição:', error);
            });
    } else {
        redirectToLoginPage();
    }
}

function formatCurrencyBRL(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function redirectToLoginPage() {
    window.location.href = 'https://daanrox.com/revenda';
}

function renderOptions() {
    const selectElement = document.getElementById('serviceSelect');

    services.forEach(service => {
        const optionElement = document.createElement('option');
        optionElement.value = service.price;
        optionElement.textContent = service.name;
        optionElement.setAttribute('data-id', service.id);
        selectElement.appendChild(optionElement);
    });
}

function updateOrderTotal() {
  const quantityInput = document.getElementById('quantityInput');
  const totalSpan = document.getElementById('spanTotal');
  const serviceSelect = document.getElementById('serviceSelect');

  const selectedServicePrice = parseFloat(serviceSelect.value);
  const quantity = parseInt(quantityInput.value);

  if (!isNaN(selectedServicePrice) && !isNaN(quantity)) {
      const total = (selectedServicePrice * quantity) / 1000;
      totalSpan.textContent = formatCurrencyBRL(total);
  } else {
      totalSpan.textContent = formatCurrencyBRL(0);
  }
}

function openModal(mensagem) {
  const modal = document.querySelector('.modal');
  const modalContent = modal.querySelector('.modal-content');
  const modalMessage = modal.querySelector('p');
  modalMessage.textContent = mensagem;
  modal.style.display = 'block';
}

function closeModal() {
  const modal = document.querySelector('.modal');
  modal.style.display = 'none';
}

async function addOrder(userId) {
  const serviceSelect = document.getElementById('serviceSelect');
  const linkInput = document.querySelector('input[type="text"]');
  const quantityInput = document.getElementById('quantityInput');

  const idServico = serviceSelect.options[serviceSelect.selectedIndex].getAttribute('data-id');
  const link = linkInput.value;
  const quantidade = quantityInput.value;

  const authToken = localStorage.getItem('authToken');
  const requestOptions = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  };

  try {
    const response = await fetch('https://x8ki-letl-twmt.n7.xano.io/api:QeSM43R0/auth/me', requestOptions);
    const data = await response.json();

    const apiKey = data.key;
    const saldoAtual = parseFloat(document.querySelector('.balance__display span').textContent.replace(',', '.').replace('R$ ', ''));
    const totalPedido = parseFloat(document.getElementById('spanTotal').textContent.replace(',', '.'));

    if (totalPedido > saldoAtual) {
      openModal('Saldo insuficiente');
    } else {
      const queryParams = new URLSearchParams({
        key: apiKey,
        action: 'add',
        service: idServico,
        link: link,
        quantity: quantidade
      });

      try {
        const response = await fetch(`https://painelsmm.com.br/api/v2?${queryParams}`);
        const data = await response.json();

        if (data.success) {
          const novoSaldo = (saldoAtual - totalPedido).toFixed(2);
          await atualizarSaldoNoBancoDeDados(userId, novoSaldo);
          openModal('Pedido realizado!');
          const saldoDisplay = document.querySelector('.balance__display span');
          saldoDisplay.textContent = formatCurrencyBRL(novoSaldo);
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
      }
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
}

function atualizarSaldoNoBancoDeDados(userId, novoSaldo) {
    const authToken = localStorage.getItem('authToken');
    const opcoesRequisicao = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: userId,
            balance: novoSaldo
        })
    };

    fetch(`https://x8ki-letl-twmt.n7.xano.io/api:QeSM43R0/user/${userId}`, opcoesRequisicao)
        .then(response => response.json())
        .then(data => {
            const saldoDisplay = document.querySelector('.balance__display span');
            saldoDisplay.textContent = formatCurrencyBRL(novoSaldo);
        })
        .catch(error => {
            console.error('Erro na requisição:', error);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    renderOptions();

    const quantityInput = document.getElementById('quantityInput');
    quantityInput.addEventListener('input', updateOrderTotal);

    const serviceSelect = document.getElementById('serviceSelect');
    serviceSelect.addEventListener('change', updateOrderTotal);

    const botaoFecharModal = document.querySelector('.close-modal');
    botaoFecharModal.addEventListener('click', closeModal);

    verifyToken();
    updateOrderTotal();
});

