export const currentUser = {
  name: 'Dra. Silva Martins',
  role: 'Pesquisadora Científica',
  avatarUrl:
    'https://lh3.googleusercontent.com/aida/AEtjO1WrWg3A4xbS3lzAZ5_SNeNU4LWS8PS9r9ssqnbkaYan47HqPDD2u9AP3bJ1fQzf6HHkk_B50lIeRIiDYlQ8WNkO_ezVZF8XXk29QF6BtPizhu-oYUCXPpCtncVhHBQ1S4mTW0N3jAf7SgZWiUNXtFIKKE9kl1brjSIk8A9xpMVT2aquGqXFWKMvqHTBikrIiJhGzoS3BCHSZhUVft3Ky-sLGmnX_Vp24z-Go28q-EBfNaBNEBFkLa6vHbnI',
}

// Cada campo exibido no card de perfil.
// `icon` usa as classes do Bootstrap Icons (https://icons.getbootstrap.com/).
export const profileFields = [
  { id: 'nome', icon: 'bi-person', label: 'Nome e Sobrenome', value: 'Dra. Silva Martins' },
  { id: 'cargo', icon: 'bi-person-badge', label: 'Cargo', value: 'Pesquisadora Científica' },
  { id: 'cpf', icon: 'bi-fingerprint', label: 'CPF', value: '456.789.012-34' },
  { id: 'email', icon: 'bi-envelope-at', label: 'Email', value: 'silva.martins@laboratorio.gov.br' },
  { id: 'telefone', icon: 'bi-telephone', label: 'Telefone', value: '(61) 98765-4321' },
]
