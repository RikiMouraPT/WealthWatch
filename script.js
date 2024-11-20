// Variáveis locais para email e password
var email = 'vitor@gmail.com';
var password = 'vitorlindo';

// Simular login e redirecionar para dashboard.html
function handleLogin(event) {
    event.preventDefault(); // Evita o comportamento padrão de envio do formulário

    const emailInput = document.getElementById('email').value;
    const passwordInput = document.getElementById('password').value;

    // Verifica se o email e password coincidem com as variáveis
    if (emailInput === email && passwordInput === password) {
        window.location.href = "pages/dashboard/dashboard.html"; // Redireciona para o dashboard
    } else {
        alert("Email ou password incorretos!");
    }
}
