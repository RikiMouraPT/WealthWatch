// Lista de contas válidas
const accounts = [
    { email: 'vitor@gmail.com', password: 'vitorlindo' },
    { email: 'ricardo@gmail.com', password: 'ricardolindo' }
];

// Função para validar login e redirecionar
function handleLogin(event) {
    event.preventDefault(); // Evita o comportamento padrão de envio do formulário

    const emailInput = document.getElementById('email').value;
    const passwordInput = document.getElementById('password').value;

    // Verifica se o email e password correspondem a alguma conta na lista
    const validAccount = accounts.find(account => account.email === emailInput && account.password === passwordInput);

    if (validAccount) {
        // Redireciona para o dashboard
        window.location.href = "pages/dashboard/dashboard.html";
    } else {
        alert("Email ou password incorretos!");
    }
}
