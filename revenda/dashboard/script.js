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
            .then(response => {
                if (!response.ok) {
                    // Se a resposta não for ok, redirecione o usuário para a página de login
                    redirectToLoginPage();
                    throw new Error('Erro na requisição: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                // Verifique se os dados do usuário estão presentes na resposta
                if (data && data.id !== undefined && data.name !== undefined && data.balance !== undefined) {
                    const balanceDisplay = document.querySelector('.balance__display span');
                    balanceDisplay.textContent = `R$ ${data.balance}`;

                    const nameUser = document.querySelector('.name__user');
                    nameUser.textContent = data.name;

                    const userId = data.id;
                    const addOrderButton = document.getElementById('addOrder');
                    addOrderButton.addEventListener('click', (event) => {
                        event.preventDefault();
                        addOrder(userId)
                    });
                } else {
                    // Dados do usuário ausentes, redirecione para a página de login
                    redirectToLoginPage();
                }
            })
            .catch(error => {
                console.error('Erro na requisição:', error);
                // Em caso de erro, redirecione para a página de login
                redirectToLoginPage();
            });
    } else {
        redirectToLoginPage();
    }
}

function logoutButton() {
    const buttonLogout = document.querySelector('.header__exit')
    buttonLogout.addEventListener('click', redirectToLoginPage)
}

function redirectToLoginPage() {
    localStorage.clear()
    window.location.href = '/revenda';
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
        totalSpan.textContent = total.toFixed(2);
    } else {
        totalSpan.textContent = '0.00';
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

    if (!userId || !idServico || !link || !quantidade) {
        alert('Por favor, preencha todos os campos antes de adicionar o pedido.');
        return;
    }

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
        const balance = parseFloat(data.balance); // Obter o saldo do usuário a partir da resposta da API

        const totalPedido = parseFloat(document.getElementById('spanTotal').textContent);
        const novoSaldo = (balance - totalPedido).toFixed(2); // Calcular o novo saldo após deduzir o valor do pedido

        if (totalPedido > balance) {
            openModal('Saldo insuficiente');
        } else {
            const apiUrl = `https://painelsmm.com.br/api/v2?key=${apiKey}&action=add&service=${idServico}&link=${encodeURIComponent(link)}&quantity=${quantidade}`;

            const requestOptionsPost = {
                method: 'POST',
                mode: 'no-cors', // Adicionar a opção 'no-cors' para evitar problemas com CORS
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };

            // Fazer a requisição POST para a API com os parâmetros necessários
            await fetch(apiUrl, requestOptionsPost);

            // Atualizar o saldo no backend
            await atualizarSaldoNoBancoDeDados(userId, parseFloat(novoSaldo));

            // Atualizar o saldo na tela
            const saldoDisplay = document.querySelector('.balance__display span');
            saldoDisplay.textContent = `R$ ${novoSaldo}`;

            // Exibir o modal de "Pedido realizado"
            openModal('Pedido realizado!');

            // Atualizar a página após o usuário clicar em "OK" no modal
            const closeModalButton = document.querySelector('.close-modal');
            closeModalButton.addEventListener('click', () => {
                closeModal();
                window.location.reload();
            });
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        openModal('Erro na requisição');
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

    // Retornar uma Promessa para que possamos aguardar a atualização ser concluída na função addOrder
    return fetch(`https://x8ki-letl-twmt.n7.xano.io/api:QeSM43R0/user/${userId}`, opcoesRequisicao)
        .then(response => response.json())
        .catch(error => {
            console.error('Erro na requisição:', error);
            throw new Error('Erro na requisição: ' + error);
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

    logoutButton();
    verifyToken();
    updateOrderTotal();
});
