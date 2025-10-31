// Função para buscar um arquivo SVG e inseri-lo inline no HTML
const buscarSvg = (image) => {
  // Faz uma requisição para obter o conteúdo do arquivo SVG a partir do src da imagem
  fetch(image.src)
    .then((response) => response.text()) // Converte a resposta para texto
    .then((response) => {
      const span = document.createElement("span"); // Cria um elemento <span>
      span.innerHTML = response; // Define o conteúdo do <span> como o SVG retornado
      const inlineSvg = span.getElementsByTagName("svg")[0]; // Obtém o elemento <svg>
      image.parentNode.replaceChild(inlineSvg, image); // Substitui a imagem original pelo SVG inline
      return true;
    });
};

function containsLetterOrNumber(str) {
  let digitRegExp = /(?=.*[a-zA-Z0-9])/;
}

function converterObjetosEmObjetoDeArrays(objetos) {
  const novoObjeto = {};
  const chaves = new Set();

  // Percorre cada objeto de objetos
  objetos.forEach((objeto) => {
    // Percorre cada chave do objeto
    Object.keys(objeto).forEach((chave) => {
      // Se a chave não estiver no dicionário...
      if (!chaves.has(chave)) {
        // Acrescenta a chave nas chaves
        chaves.add(chave);
        // Cria um nova chave com um array vazio no novo objeto
        Object.assign(novoObjeto, { [chave]: [] });
      }
      // Adiciona o valor da chave do objeto atual
      // ao array correspondente em novoObjeto
      novoObjeto[chave].push(objeto[chave]);
    });
  });

  return novoObjeto;
}

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

// Fonte:
// https://stackoverflow.com/a/3261380
function objectFlip(obj) {
  return Object.keys(obj).reduce((ret, key) => {
    ret[obj[key]] = key;
    return ret;
  }, {});
}

function filtrarObjetoDentroDeArrayPorChaves(objetos, chavesFiltro) {
  const novoArray = [];

  // Percorre os objetos
  for (let i = 0; i < objetos.length; i++) {
    // Chama a função de filtração, passando o objeto (objetos[i])
    // e as chaves-filtro, acrescentando o resultado no novo array
    novoArray.push(filtrarObjetoPorChaves(objetos[i], chavesFiltro));
  }

  return novoArray;
}

function filtrarObjetoPorChaves(objeto, chavesFiltro) {
  const novoObjeto = {};
  let chave;
  chavesFiltro = new Set(chavesFiltro);

  // Percorre todas as chaves do objeto
  for (let i = 0; i < Object.keys(objeto).length; i++) {
    chave = Object.keys(objeto)[i];
    // Verifica se a chave está nas chaves do filro
    if (chavesFiltro.has(chave)) {
      Object.assign(novoObjeto, { [chave]: objeto[chave] });
    }
  }

  return novoObjeto;
}

function xmlStringToHtmlElement(xmlString) {
  var doc = new DOMParser().parseFromString(xmlString, "text/xml");
  return doc.firstChild;
}
