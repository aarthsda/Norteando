# Norteando 🌿

**Um espaço digital para descobrir, explorar e valorizar a pluralidade cultural, territorial e ambiental da Amazônia.**

> **Estado do projeto:** protótipo educativo de frontend estático. A interface funciona com HTML, CSS e JavaScript puro. O **Norteando AI** utiliza um modelo **Gemma 4** executado localmente pelo **Ollama**, sem backend próprio. O conteúdo apresentado é demonstrativo e não constitui um acervo documental validado.

## Sumário

1. [Visão geral](#visão-geral)
2. [Funcionalidades](#funcionalidades)
3. [Tecnologias e arquitetura](#tecnologias-e-arquitetura)
4. [Estrutura de arquivos](#estrutura-de-arquivos)
5. [Pré-requisitos](#pré-requisitos)
6. [Como executar](#como-executar)
7. [Integração com Gemma 4 e Ollama](#integração-com-gemma-4-e-ollama)
8. [Como funciona a API de IA](#como-funciona-a-api-de-ia)
9. [Configuração do CORS](#configuração-do-cors)
10. [Diagnóstico e solução de problemas](#diagnóstico-e-solução-de-problemas)
11. [Conteúdo, acessibilidade e privacidade](#conteúdo-acessibilidade-e-privacidade)
12. [Limitações e evolução](#limitações-e-evolução)

## Visão geral

O **Norteando** é uma proposta de plataforma de descoberta e educação sobre a Amazônia. O projeto reúne conteúdos introdutórios sobre culturas, saberes, memórias, rios, florestas, comunidades e cidades. A experiência inclui navegação por categorias e uma interface de conversa com IA para aprofundar perguntas.

### Objetivos

- Apresentar a Amazônia como uma região **plural**, sem reduzir seus povos e territórios a uma narrativa única.
- Oferecer uma experiência visual editorial e responsiva, adequada a computadores e celulares.
- Organizar conteúdos exploratórios em acervo e territórios.
- Permitir perguntas em português brasileiro a um modelo local de linguagem.
- Demonstrar uma arquitetura leve, sem dependência de React, Angular, banco de dados ou servidor de aplicação próprio.

### Público-alvo

Estudantes, educadores, pessoas interessadas na Amazônia e participantes de demonstrações ou hackathons. **Não** é, neste estágio, um sistema oficial de documentação de territórios ou conhecimentos tradicionais.

## Funcionalidades

| Área | Recursos | Situação |
| --- | --- | --- |
| Início | Apresentação do projeto, conteúdos em destaque e navegação por seções | Implementado no protótipo |
| Acervo | Registros introdutórios, busca, categorias e detalhes em janelas de diálogo | Implementado em página independente |
| Territórios | Perspectivas sobre rios, florestas, várzeas, extrativismo, cidades e comunidades; busca, filtros e detalhes | Implementado em página independente |
| Norteando AI | Conversa com Gemma 4 via Ollama, respostas progressivas, histórico local, configurações e interrupção de geração | Implementado no frontend; depende de Ollama funcionando |
| Curadoria documental | Fontes específicas por registro, autoria e validação com comunidades | Pendente |
| Contas, sincronização e backend | Autenticação, persistência remota, API própria | Não implementados |

**Observação sobre a navegação:** o `index.html` contém seções internas acessadas por fragmentos como `#inicio`, `#acervo`, `#territorios` e `#ia`. Também foram criadas páginas independentes (`acervo.html`, `territorios.html` e `ai.html`). São **duas formas de navegação coexistentes**: não presumir que todos os links do `index.html` já redirecionam às páginas independentes. A integração de navegação pode ser unificada posteriormente.

## Tecnologias e arquitetura

| Camada | Tecnologia | Papel |
| --- | --- | --- |
| Estrutura | HTML5 | Semântica e páginas |
| Estilos | CSS3 | Layout, responsividade, identidade visual |
| Interação | JavaScript (vanilla) | Navegação, filtros, modais e chat |
| Armazenamento local | `localStorage` | Preferências e histórico do chat no navegador |
| Servidor estático de desenvolvimento | `python3 -m http.server` | Disponibilizar arquivos via `http://localhost` |
| Runtime de IA | Ollama | Carregar o modelo e disponibilizar a API HTTP |
| Modelo | `gemma4:e2b` | Modelo configurado por padrão no `ai.js` |
| Comunicação | `fetch`, JSON e streaming NDJSON | Requisições do navegador ao Ollama |
| Fontes | Google Fonts | Tipografia; depende de conexão à internet para carregamento remoto |

### Fluxo de execução

```text
Navegador (http://localhost:8000)
    │
    ├── index.html / acervo.html / territorios.html
    │       └── conteúdo e interações no próprio navegador
    │
    └── ai.html + ai.js
            │ fetch HTTP
            ▼
       Ollama (http://localhost:11434)
            │
            ▼
       Gemma 4 (gemma4:e2b)
            │
            └── resposta em streaming → navegador
```

**Não existe backend Django, Django Ninja, FastAPI ou Node.js nesta versão.** O Ollama é um serviço separado responsável pela inferência de IA; o servidor Python sugerido serve **apenas arquivos estáticos**.

## Estrutura de arquivos

Estrutura **recomendada** para reunir os arquivos desenvolvidos nesta etapa:

```text
norteando/
├── index.html           # Página principal com seções internas
├── style.css            # Estilos globais e da página principal
├── app.js               # Comportamentos da página principal
├── acervo.html          # Página independente do acervo
├── acervo.css           # Estilos do acervo, se usado pela versão do HTML
├── territorios.html     # Página independente dos territórios
├── territorios.css      # Estilos dos territórios
├── ai.html              # Interface independente do Norteando AI
├── ai.css               # Estilos específicos do chat
├── ai.js                # Integração direta com Ollama
├── assets/              # Recursos estáticos locais, quando houver
└── README.md            # Documentação do projeto
```

**Importante:** a estrutura acima é a organização pretendida, **não uma afirmação de que todos os arquivos já estejam presentes na sua pasta**. Nos materiais examinados, `acervo.html` foi disponibilizado separadamente; seu CSS deve ser mantido com o nome e caminho efetivamente referenciados na versão em uso. O `territorios.html` analisado referencia `./territorios.css`. O `ai.html` referencia `style.css`, `ai.css` e `ai.js`. O `index.html` referencia `style.css` e `app.js`.

Se houver arquivos antigos em `js/` ou versões anteriores de `app.js`, verifique quais são efetivamente importados pelo HTML antes de excluir ou alterar qualquer coisa.

## Pré-requisitos

- Linux, macOS ou Windows com navegador moderno (Firefox, Chromium ou equivalente).
- **Python 3** para o servidor estático local (ou servidor HTTP estático equivalente).
- **Ollama** instalado para o Norteando AI.
- Modelo **`gemma4:e2b`** instalado ou outro modelo compatível cujo nome seja configurado na interface.
- Memória e armazenamento suficientes para o modelo selecionado; desempenho depende do hardware.

A parte editorial do site funciona sem Ollama. **O chat exige o serviço e o modelo disponíveis.**

## Como executar

### 1. Abrir a pasta do projeto

No ambiente Linux usado durante o desenvolvimento:

```bash
cd ~/norteando-prototipo/norteando
```

Ajuste o caminho se você salvou o projeto em outra pasta.

### 2. Iniciar o servidor estático

```bash
python3 -m http.server 8000
```

Deixe esse terminal aberto e acesse:

- Página principal: http://localhost:8000/index.html
- Acervo: http://localhost:8000/acervo.html
- Territórios: http://localhost:8000/territorios.html
- Chat: http://localhost:8000/ai.html

O endereço de cada página só funcionará se o respectivo arquivo estiver presente na pasta servida.

**Evite abrir com `file:///.../index.html`.** Arquivos locais podem receber origem `null`, o que dificulta ou impede a comunicação com o Ollama por CORS. A origem recomendada é `http://localhost:8000`.

### 3. Iniciar o Ollama

Em instalações com serviço systemd, verifique:

```bash
systemctl status ollama
```

Se o Ollama não estiver rodando como serviço, uma alternativa é iniciar manualmente:

```bash
ollama serve
```

**Não inicie `ollama serve` manualmente se o serviço já estiver ocupando a porta 11434.**

### 4. Instalar e verificar o Gemma 4

```bash
ollama pull gemma4:e2b
ollama list
```

Verifique se o nome listado corresponde exatamente ao valor configurado na interface. Para testar a inferência, não apenas a instalação:

```bash
ollama run gemma4:e2b "Explique em duas frases a importância dos rios amazônicos."
```

A tag `gemma4:e2b` foi usada durante o desenvolvimento e aparece no código como valor padrão; a disponibilidade dessa tag depende do catálogo e da instalação local do Ollama.

## Integração com Gemma 4 e Ollama

A integração é feita **diretamente no navegador**, pelo arquivo `ai.js`.

### Configuração padrão

```javascript
const defaults = {
  url: 'http://localhost:11434',
  model: 'gemma4:e2b',
  conversations: [],
  active: null
};
```

Esses valores são carregados inicialmente e podem ser alterados nas **configurações do Norteando AI**. O estado persistido no navegador utiliza a chave:

```text
norteando.ai.v1
```

A interface permite informar:

- **URL do Ollama:** normalmente `http://localhost:11434`.
- **Modelo Ollama:** normalmente `gemma4:e2b`.

### Verificação de disponibilidade

Ao iniciar, o frontend consulta:

```http
GET http://localhost:11434/api/tags
```

A resposta lista os modelos instalados. O código procura uma correspondência exata para a tag configurada. **Esse teste confirma o acesso à listagem, não garante que a geração de texto funcione.**

Teste pelo terminal:

```bash
curl http://localhost:11434/api/tags
```

### Envio de mensagens

O chat envia requisições para:

```http
POST http://localhost:11434/api/chat
Content-Type: application/json
```

Exemplo simplificado de corpo enviado:

```json
{
  "model": "gemma4:e2b",
  "stream": true,
  "messages": [
    {
      "role": "system",
      "content": "Você é o Norteando AI, assistente educativo sobre a Amazônia. Responda em português brasileiro com rigor e respeito aos povos e comunidades."
    },
    {
      "role": "user",
      "content": "Qual a importância dos rios na Amazônia?"
    }
  ]
}
```

O **prompt de sistema real**, definido em `ai.js`, acrescenta instruções para **não inventar fontes, citações, depoimentos, autorizações ou conhecimentos restritos**, distinguir fatos de incertezas e informar quando não há fontes verificadas.

O frontend envia o histórico da conversa ativa como mensagens de papéis `user` e `assistant`, precedidas pelo prompt de sistema. Isso mantém contexto conversacional enquanto o histórico estiver disponível no navegador, sujeito aos limites de contexto do modelo.

### Streaming de respostas

Com `"stream": true`, o Ollama devolve uma sequência de objetos JSON separados por linhas (**NDJSON**). O `ai.js` usa:

- `fetch()` para iniciar a requisição.
- `response.body.getReader()` para consumir o fluxo.
- `TextDecoder` para converter bytes em texto.
- Separação por `\n` e `JSON.parse()` para interpretar cada evento.
- `message.content` para atualizar progressivamente a resposta na interface.
- `done` para reconhecer o término.
- `AbortController` para interromper a geração pelo botão correspondente.

A implementação exibe texto progressivamente; **não é uma API de recuperação de documentos (RAG)**, não realiza pesquisa automática em fontes verificadas e não garante citações bibliográficas.

### Testar a API sem o frontend

```bash
curl http://localhost:11434/api/chat \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "gemma4:e2b",
    "stream": false,
    "messages": [
      {"role": "user", "content": "Diga olá em português."}
    ]
  }'
```

Se esse comando funcionar, o modelo está respondendo via API. O próximo passo é verificar o acesso **a partir do navegador**, que também depende de CORS.

## Configuração do CORS

O navegador aplica a **Same-Origin Policy**. A página em `http://localhost:8000` e a API em `http://localhost:11434` usam **portas diferentes**, portanto têm origens diferentes. O Ollama precisa permitir explicitamente a origem do frontend.

### Linux com Ollama gerenciado pelo systemd

Crie o diretório de configuração:

```bash
sudo mkdir -p /etc/systemd/system/ollama.service.d
```

Edite:

```bash
sudo nano /etc/systemd/system/ollama.service.d/override.conf
```

Inclua a configuração abaixo na seção `[Service]`, preservando outras configurações existentes:

```ini
[Service]
Environment="OLLAMA_ORIGINS=http://localhost:8000,http://127.0.0.1:8000"
```

Aplique as alterações:

```bash
sudo systemctl daemon-reload
sudo systemctl restart ollama
```

Confirme que a variável foi carregada:

```bash
systemctl show ollama -p Environment --value --no-pager | tr ' ' '\n' | grep OLLAMA_ORIGINS
```

Inspecione a configuração completa, se necessário:

```bash
systemctl cat ollama
```

### Ollama iniciado manualmente

Se **não** estiver usando o serviço systemd:

```bash
OLLAMA_ORIGINS=http://localhost:8000,http://127.0.0.1:8000 ollama serve
```

### Teste de CORS

```bash
curl -i http://localhost:11434/api/tags \
  -H 'Origin: http://localhost:8000'
```

Procure o cabeçalho `Access-Control-Allow-Origin` com a origem autorizada. No console do navegador, **com a página aberta por `http://localhost:8000`**, execute:

```javascript
fetch('http://localhost:11434/api/tags')
  .then(r => r.json())
  .then(data => console.log('Ollama conectado:', data))
  .catch(err => console.error('Falha:', err));
```

**Segurança:** não use `OLLAMA_ORIGINS=*` como configuração padrão. Evite permitir a origem `null` de páginas `file://`. Não exponha a API do Ollama diretamente à internet. Em produção, adote uma camada intermediária com autenticação, controles de acesso e limites de uso.

## Diagnóstico e solução de problemas

| Sintoma | Causa provável | Verificação ou correção |
| --- | --- | --- |
| `Promise { <state>: "pending" }` | A operação assíncrona ainda não concluiu | Aguarde o `console.log` ou o `catch`; isso, isoladamente, não é erro |
| `Cross-Origin Request Blocked` | Origem não autorizada | Abra por `localhost:8000`, configure `OLLAMA_ORIGINS` e reinicie o Ollama |
| `403 Forbidden` e ausência de `Access-Control-Allow-Origin` | CORS rejeitado pelo serviço | Confira a origem exata e a configuração do serviço |
| `NetworkError` ou `Failed to fetch` | Falha de rede, serviço indisponível ou CORS | Teste `curl http://localhost:11434/api/tags` e veja o console |
| `localhost:114` | Porta incorreta | Use **`localhost:11434`** |
| Modelo não encontrado | Tag divergente ou modelo ausente | Execute `ollama list` e ajuste o campo de modelo |
| `ollama serve` acusa porta ocupada | Serviço já ativo | Use o serviço existente; não execute uma segunda instância |
| Site abre, mas sem estilos | Arquivo CSS ausente ou caminho incorreto | Confira os `<link rel="stylesheet">` e o painel Network |
| Página parece antiga após correção | Cache do navegador | Atualize com **Ctrl + Shift + R** |
| Histórico desapareceu | `localStorage` foi apagado, outra origem foi usada ou modo privado | Verifique o armazenamento da origem atual |
| Resposta demora | Carregamento inicial do modelo ou hardware limitado | Teste `ollama run`, confira recursos e aguarde a primeira inferência |

### Diagnóstico rápido

```bash
# Servidor do Ollama responde?
curl http://localhost:11434/api/tags

# Modelo instalado?
ollama list

# Serviço ativo (se houver systemd)?
systemctl status ollama

# Variável de CORS aplicada?
systemctl show ollama -p Environment --value --no-pager | tr ' ' '\n' | grep OLLAMA_ORIGINS
```

### Verificar o estado salvo no navegador

```javascript
JSON.parse(localStorage.getItem('norteando.ai.v1'))
```

Se o resultado for `null`, significa que ainda não há estado salvo **nessa origem**. Isso não prova que o Ollama esteja desconectado: o `ai.js` usa valores padrão enquanto não há configuração persistida.

## Conteúdo, acessibilidade e privacidade

### Conteúdo e responsabilidade cultural

O acervo e os territórios contêm **textos introdutórios demonstrativos**, não um cadastro oficial nem uma base documental com fontes verificadas para cada entrada. Antes de publicação pública, recomenda-se:

- Registrar autoria, fonte, data, contexto e revisão de cada conteúdo.
- Distinguir conhecimento público de conhecimento restrito ou sensível.
- Respeitar os direitos, a autonomia e a autorização das comunidades quando houver materiais, imagens, depoimentos ou conhecimentos específicos.
- Evitar generalizações sobre povos indígenas, quilombolas, ribeirinhos e outras populações amazônicas.
- Revisar respostas geradas pela IA: modelos de linguagem podem produzir erros ou afirmações sem base documental.

Fotografias externas e fontes hospedadas por terceiros podem depender de conexão à internet. Imagens ilustrativas **não devem ser apresentadas como registros documentais** de comunidades ou lugares específicos sem verificação.

### Acessibilidade

O HTML utiliza recursos como elementos semânticos, rótulos, navegação por teclado, mensagens de status e `<dialog>` em algumas interfaces. Isso **não equivale a uma auditoria WCAG concluída**. Ainda é necessário testar leitores de tela, contraste, foco, navegação móvel e comportamento dos diálogos.

### Dados e privacidade

- As conversas e preferências do Norteando AI são salvas no `localStorage` do navegador, sob a chave `norteando.ai.v1`.
- Não há contas, sincronização entre dispositivos nem banco de dados do projeto.
- As mensagens são enviadas à API do **Ollama configurada**. Com o endereço padrão `localhost`, a inferência ocorre na máquina que executa o navegador e o Ollama.
- Se a URL do Ollama for alterada para um servidor remoto, o conteúdo das conversas será enviado a esse servidor.
- O armazenamento local não é criptografado pelo aplicativo e não deve ser usado para informações sensíveis.
- A limpeza de histórico da interface remove as conversas salvas por este protótipo no navegador atual; não equivale a apagar dados mantidos por serviços externos.

## Limitações e evolução

### Limitações atuais

1. Não há backend próprio, autenticação, banco de dados ou painel de administração.
2. Conteúdos de acervo e territórios são demonstrativos e não possuem curadoria documental completa.
3. A IA depende de um Ollama acessível e de um modelo instalado; não há fallback remoto implementado.
4. Não há busca semântica, embeddings, RAG ou indexação das páginas para consulta pelo Gemma 4.
5. O chat não consulta automaticamente o acervo nem garante que suas respostas estejam fundamentadas nos registros exibidos.
6. O histórico está restrito ao armazenamento local do navegador.
7. Há navegação por seções no `index.html` e páginas independentes que ainda podem precisar de unificação.
8. Não há testes automatizados ou validação visual completa documentados para todas as telas.

### Próximos passos sugeridos

**Curto prazo:** unificar links e identidade visual; garantir que cada HTML carregue o CSS correto; testar responsividade, filtros, modais e chat no Firefox e Chromium; revisar textos e imagens.

**Médio prazo:** estruturar registros com metadados (título, categoria, território, autoria, fontes, data, licenças e revisão); criar uma camada de curadoria; adicionar referências verificáveis e acessibilidade testada.

**Longo prazo:** considerar uma API própria (por exemplo, Django Ninja, caso o projeto volte a exigir backend), uma base de dados documental, pesquisa por conteúdo e **RAG com fontes verificadas**. Nesse cenário, o Gemma 4 poderia responder com base em registros selecionados do Norteando, com indicação explícita das fontes recuperadas.

## Desenvolvimento e execução responsável

Este README descreve o protótipo e os arquivos inspecionados durante o desenvolvimento. **Não declara que a integração com Gemma 4 tenha passado por um teste completo de inferência no navegador.** A instalação do modelo e a resposta de `/api/tags` são verificações distintas de uma resposta bem-sucedida de `/api/chat`.

**Norteando — Amazônia plural, conhecimento vivo.**
