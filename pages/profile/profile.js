// Guarda as alterações
function saveChanges() {
    const profileData = {
        name: document.getElementById('name').value,
        bio: document.getElementById('bio').value,
        location: document.getElementById('location').value,
        timezone: document.getElementById('timezone').value,
        currency: document.getElementById('currency').value,
        preferences: document.getElementById('preferences').value,
    };

    localStorage.setItem('profileData', JSON.stringify(profileData));

    // Atualiza o perfil
    updateProfileDisplay(profileData);

    // Fecha o modal
    var modal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
    modal.hide();
}
// Atualiza a interface
function updateProfileDisplay(data) {
    document.getElementById('displayName').innerText = data.name;
    document.getElementById('displayBio').innerText = data.bio;
    document.getElementById('displayLocation').innerText = data.location;
    document.getElementById('displayTimezone').innerText = data.timezone;
    document.getElementById('displayCurrency').innerText = data.currency;
    document.getElementById('displayPreferences').innerText = data.preferences;
}

// Restaura os dados ao carregar a página
window.onload = function () {
    const savedData = JSON.parse(localStorage.getItem('profileData'));
    if (savedData) {
        updateProfileDisplay(savedData);
    }
};

