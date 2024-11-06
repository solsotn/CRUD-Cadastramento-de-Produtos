// Seleciona Elementos DOM
const modal = document.querySelector('.modal-container');
const tbody = document.querySelector('tbody');
const sProduto = document.querySelector('#m-produto');
const sCodigo = document.querySelector('#m-codigo');
const sQuantidade = document.querySelector('#m-quantidade');
const btnSalvar = document.querySelector('#btnSalvar');

let itens; // Variável para armazenar itens

let id; // Variável para armazenar o item que for editado

// Abrir Modal
function openModal(edit = false, index = 0) {
  modal.classList.add('active')

  //Fechar Modal quando clicar fora
  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active')
    }
  }

  //Se a Modal for aberta para edição
  if (edit) {
    sProduto.value = itens[index].produto
    sCodigo.value = itens[index].Codigo
    sQuantidade.value = itens[index].sQuantidade
    id = index
  }

  //Se a Modal for aberta para adicionar novo item
   else {
    sProduto.value = ''
    sCodigo.value = ''
    sQuantidade.value = ''
  }
  
}

//Função para editar um item
function editItem(index) {
  openModal(true, index)
}

//Função para deletar um item

function deleteItem(index) {
  itens.splice(index, 1)
  setItensBD()
  loadItens()
}

//Função para inserir item

function insertItem(item, index) {
  let tr = document.createElement('tr')

  //Define HTML da nova linha
  tr.innerHTML = `
    <td>${item.produto}</td>
    <td>${item.codigo}</td>
    <td>${item.quantidade}</td>
    <td class="acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit' ></i></button>
    </td>
    <td class="acao">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `
  //Adiciona a nova linha ao corpo da tabela
  tbody.appendChild(tr)
}

//Clique no botão de salvar
btnSalvar.onclick = e => {
  
  //Verifica os campos vazios
  if (sProduto.value == '' || sCodigo.value == '' || sQuantidade.value == '') {
    //Se  algum campo estiver vazio, exibe mensagem de erro
    return
  }

  //Previne  o comportamento padrão do botão
  e.preventDefault();

  //Se um item está sendo editado
  if (id !== undefined) {
    itens[id].produto = sProduto.value
    itens[id].codigo = sCodigo.value
    itens[id].quantidade = sQuantidade.value
  } else {
    //Se um  item está sendo inserido
    itens.push({'produto': sProduto.value, 'codigo': sCodigo.value, 'quantidade': sQuantidade.value})
  }

  //Atualiza o banco de dados
  setItensBD()

  //Fecha Modal
  modal.classList.remove('active')

  //Regarrega itens na tabela
  loadItens()

  //Reseta  os campos
  id = undefined
}

//Função para carregar os itens do armazenamento local
function loadItens() {
  //Obtém os itens do armazenamento local
  itens = getItensBD()
  //Limpa a tabela
  tbody.innerHTML = ''
  itens.forEach((item, index) => {
    insertItem(item, index)
  })

}

//Função para obter os itens do armazenamento local
const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? []

//Função  para salvar os itens no armazenamento local
const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens))

//Carrega e exibi os itens ao iniciar
loadItens()