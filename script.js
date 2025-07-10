const apiKeyInput = document.getElementById('apiKey')
const gameSelect = document.getElementById('gameSelect')
const questionInput = document.getElementById('questionInput')
const askButton = document.getElementById('askButton')
const aiResponse = document.getElementById('aiResponse')
const form = document.getElementById('form')
//Importar linguagem que a IA usa para formatar o texto
const markdownToHTML = (text) => {
  const converter = new showdown.Converter()
  return converter.makeHtml(text)
}
const perguntarIA = async (question, game, apiKey) => {
  const model = "gemini-2.5-flash"
  const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
  const perguntaLOL = `
    ## Especialidade
    Você é um especialista assistente de meta para o jogo ${game}.
    
    ## Tarefa
    Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, builds e dicas.

    ## Regras
    - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
    - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo'.
    - Considere a data atual ${new Date().toLocaleDateString()}.
    - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
    - Nunca responda itens que você não tenha certeza de que existe no patch atual.

    ## Resposta
    - Economize na resposta, seja direto e responda no máximo 500 caracteres.
    - Responda em markdown.
    - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo.
    
    ## Exemplo de resposta
    Pergunta do usuário: Melhor build rengar jungle
    resposta: A build mais atual é: \n\n **Itens:**\n\n coloque os itens aqui.\n\n**Runas:**\n\nexemplos de runas\n\n

    ---
    Aqui está a pergunta do usuário: ${question}
  `
  const perguntaVALORANT = `
  ## Especialidade
    Você é um especialista assistente de meta para o jogo ${game}.
    
    ## Tarefa
    Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias e dicas.

    ## Regras
    - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
    - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo'.
    - Considere a data atual ${new Date().toLocaleDateString()}.
    - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
    - Nunca responda armas ou habilidades do agente que você não tenha certeza de que existe na versão atual.
    - Tenha em mente a função dos agentes do jogo, como Duelista, Controlador, Iniciador e Sentinela.
    - Tenha em mente os mapas atuais do jogo e as estratégias de ataque e defesa.
    - Tenha em mente que o jogo é baseado em rodadas, então as compras devem ser feitas de acordo com a economia do jogo.

    ## Resposta
    - Economize na resposta, seja direto e responda no máximo 500 caracteres.
    - Responda em markdown.
    - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo.
    
    ## Exemplo de resposta
    Pergunta do usuário: Melhor agente para jogar no mapa ascent na versão atual
    resposta: As compras mais atualizadas são: \n\n**(FILA COMPETITIVA)**\n\n**Agentes:**\n\ncoloque os melhores agentes aqui.\n\n**Armas:**\n\n coloque o nome da arma aqui.\n\n**Habilidades(Skills):**\n\ncoloque as habilidades aqui.\n\n\n\n**(FILA CASUAL)**\n\n**Agentes:**\n\ncoloque os melhores agentes aqui.\n\n**Armas:**\n\n coloque o nome da arma aqui.\n\n**Habilidades(Skills):**\n\ncoloque as habilidades aqui.\n\n

    ---
    Aqui está a pergunta do usuário: ${question}
    `
  const perguntaCSGO = `
    ## Especialidade
    Você é um especialista assistente de meta para o jogo ${game}.
    
    ## Tarefa
    Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias e dicas.

    ## Regras
    - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
    - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo'.
    - Considere a data atual ${new Date().toLocaleDateString()}.
    - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
    - Nunca responda armas ou habilidades que você não tenha certeza de que existe na versão atual.
    - Tenha em mente os mapas atuais do jogo e as estratégias de ataque e defesa.
    - Tenha em mente que o jogo é baseado em rodadas, então as compras devem ser feitas de acordo com a economia do jogo.

    ## Resposta
    - Economize na resposta, seja direto e responda no máximo 500 caracteres.
    - Responda em markdown.
    - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo.
    
    ## Exemplo de resposta
    Pergunta do usuário: Melhor agente para jogar no mapa ascent na versão atual
    resposta: As compras mais atualizadas são: \n\n**(FILA COMPETITIVA)**\n\n**Armas:**\n\n coloque o nome da arma aqui.\n\n**Habilidades(Skills):**\n\ncoloque as habilidades aqui.\n\n\n\n**(FILA CASUAL)**\n\n**Armas:**\n\n coloque o nome da arma aqui.\n\n**Habilidades(Skills):**\n\ncoloque as habilidades aqui.\n\n

    ---
    Aqui está a pergunta do usuário: ${question}
    `
  let pergunta = ''
  if(game == 'valorant'){
    pergunta = perguntaVALORANT
  }else if(game == 'lol'){
    pergunta = perguntaLOL
  }else{
    pergunta = perguntaCSGO
  }
  const contents = [{
    role: "user",
    parts: [{
      text: pergunta
    }]
  }]
  const tools = [{
    google_search: {}
  }]
  //chamada API
  const response = await fetch(geminiURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents,
      tools
    })
  })
  const data = await response.json()
  return data.candidates[0].content.parts[0].text
}
const enviarFormulario = async (event) => {
  event.preventDefault()
  const apiKey = apiKeyInput.value
  const game = gameSelect.value
  const question = questionInput.value
  if(apiKey == '' || game == '' || question == '') {
    alert('Por favor, preencha todos os campos.')
    return
  }
  askButton.disabled = true
  askButton.textContent = 'Perguntando...'
  askButton.classList.add('loading')
  try {
    const text = await perguntarIA(question, game, apiKey)
    aiResponse.querySelector('.response-content').innerHTML = markdownToHTML(text)
    aiResponse.classList.remove('hidden')
  } catch (error) {
    console.log('Erro: ', error)
  } finally {
    askButton.disabled = false
    askButton.textContent = "Perguntar"
    askButton.classList.remove('loading')
  }
}
form.addEventListener('submit', enviarFormulario)