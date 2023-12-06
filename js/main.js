
function search() {
  const storeName = document.getElementById('store-name').value;
  const category = document.getElementById('category').value;
  const priceRange = document.getElementById('price-range').value;

  const searchResults = document.getElementById('search-results');
  const resultItem = document.createElement('div');
  resultItem.innerHTML = `<strong>Loja:</strong> ${storeName}, <strong>Categoria:</strong> ${category}, <strong>Faixa de Preço:</strong> ${priceRange}`;
  searchResults.appendChild(resultItem);

  // salvar no armazenamento local
  const searches = JSON.parse(localStorage.getItem('searches')) || [];
  searches.push({ storeName, category, priceRange });
  localStorage.setItem('searches', JSON.stringify(searches));
}

function clearSearches() {
  localStorage.removeItem('searches');
  document.getElementById('search-results').innerHTML = '';
}

// Carregar buscas salvas ao carregar a página
window.onload = function () {
  const searches = JSON.parse(localStorage.getItem('searches')) || [];
  const searchResults = document.getElementById('search-results');

  searches.forEach(search => {
      const resultItem = document.createElement('div');
      resultItem.innerHTML = `<strong>Loja:</strong> ${search.storeName}, <strong>Categoria:</strong> ${search.category}, <strong>Faixa de Preço:</strong> ${search.priceRange}`;
      searchResults.appendChild(resultItem);
  });
}


let posicaoInicial;
const capturarPosicao = document.getElementById('localizacao');

const sucesso = (posicao) => {
  posicaoInicial = posicao;

  localizar(posicaoInicial.coords.latitude, posicaoInicial.coords.longitude);
};

const erro = (err) => {
  let errorMessage;
  switch (err.code) {
    case 0:
      errorMessage = 'Erro desconhecido!';
      break;
    case 1:
      errorMessage = 'Permissão negada!';
      break;
    case 2:
      errorMessage = 'Captura de posição indisponível!';
      break;
    case 3:
      errorMessage = 'Tempo de solicitação excedido';
      break;
  }
  console.log('Ocorreu um erro: ' + errorMessage);
};

capturarPosicao.addEventListener('click', () => {
  navigator.geolocation.getCurrentPosition(sucesso, erro);
});

export function localizar (lat, long) {
  const embedString = `http://maps.google.com/maps?q=${lat},${long}&z=16&output=embed`;
  
  document.getElementById('userLoc').innerHTML = "SUA LOCALIZAÇÃO:"
  document.getElementsByTagName('iframe')[0].src = embedString;
}