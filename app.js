/* Norteando — interações em JavaScript puro. Nenhum dado cultural privado é enviado à IA. */
(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const store = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
  const save = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ } };
  const html = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const text = (s) => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const recordInfo = {
    rios: ['Natureza e território','Os rios que desenham a vida amazônica','Os rios estruturam deslocamentos, trocas, alimentação e relações com o território.','A bacia amazônica reúne uma extensa rede de rios e afluentes. As dinâmicas de cheia e vazante influenciam a circulação, a pesca e o cotidiano de muitas populações. As experiências, entretanto, variam conforme o lugar e a comunidade.','Agência Nacional de Águas e Saneamento Básico','https://www.gov.br/ana/pt-br'],
    mandioca: ['Saberes e sabores','Mandioca: alimento, história e conhecimento','A mandioca está presente em diferentes preparações e tradições alimentares amazônicas.','O cultivo, o processamento e o consumo da mandioca envolvem técnicas diversas, desenvolvidas e transmitidas ao longo de gerações. Algumas variedades exigem processamento cuidadoso para reduzir substâncias naturalmente tóxicas. Não existe uma única forma amazônica de preparar a mandioca.','Embrapa','https://www.embrapa.br/'],
    artesanato: ['Arte e expressão','Trançados, fibras e memória','O trabalho com fibras vegetais pode expressar técnica, criação e pertencimento.','Cestarias e trançados são produzidos por diferentes grupos e artesãos, com materiais, formas e sentidos próprios. A atribuição de autoria e o respeito aos direitos culturais são essenciais ao apresentar essas obras.','IPHAN','https://www.gov.br/iphan/pt-br'],
    biodiversidade: ['Natureza','A floresta e sua biodiversidade','A Amazônia abriga uma extraordinária variedade de ecossistemas e espécies.','Florestas, rios, áreas alagadas e outros ambientes formam mosaicos ecológicos. A conservação da biodiversidade está ligada à proteção de habitats e ao reconhecimento de quem vive e cuida desses territórios.','Instituto Nacional de Pesquisas da Amazônia','https://www.gov.br/inpa/pt-br'],
    musica: ['Cultura','Música e expressões populares','A diversidade cultural amazônica também se manifesta na música e na dança.','As expressões musicais variam entre estados, cidades e comunidades. No Pará, por exemplo, o carimbó é reconhecido como patrimônio cultural imaterial brasileiro. Cada tradição tem contextos históricos e sociais que merecem ser conhecidos.','IPHAN — Carimbó','https://www.gov.br/iphan/pt-br'],
    plantas: ['Saberes e natureza','Plantas e conhecimentos botânicos','A riqueza vegetal da região envolve pesquisa científica e conhecimentos locais.','O estudo das plantas amazônicas reúne botânica, ecologia e conhecimentos de diferentes comunidades. Conhecimentos tradicionais específicos não devem ser reproduzidos ou utilizados para treinamento de IA sem autorização adequada.','Jardim Botânico do Rio de Janeiro','https://www.gov.br/jbrj/pt-br'],
    comunidades: ['Territórios','Comunidades e caminhos das águas','As relações com os rios moldam diferentes formas de viver na Amazônia.','Existem inúmeras experiências ribeirinhas e urbanas na região. Mobilidade, acesso a serviços, trabalho e cultura se organizam de formas diversas. É importante não tratar essas populações como um grupo homogêneo.','IBGE','https://www.ibge.gov.br/'],
    linguas: ['Cultura e territórios','A diversidade de línguas amazônicas','A Amazônia é marcada por uma rica diversidade linguística.','Diferentes povos indígenas preservam e revitalizam línguas próprias. Políticas de educação, documentação e valorização linguística devem reconhecer o protagonismo e os direitos de seus falantes.','Museu Paraense Emílio Goeldi','https://www.gov.br/museugoeldi/pt-br']
  };
  const territoryInfo = {
    acre: ['Acre','No oeste da Amazônia brasileira, o Acre reúne paisagens florestais, áreas urbanas, reservas extrativistas e territórios indígenas.','Conheça fontes públicas sobre história regional, diversidade cultural e conservação ambiental.'],
    amazonas: ['Amazonas','O Amazonas possui uma extensa rede hidrográfica e múltiplos contextos sociais, culturais e ambientais. Manaus é sua capital.','O Rio Negro e o Solimões são referências importantes para compreender a geografia e as conexões regionais.'],
    para: ['Pará','O Pará articula grandes cidades, rios, ilhas e uma diversidade de expressões culturais. Belém é sua capital.','O carimbó e outras manifestações culturais revelam trajetórias históricas próprias, que merecem ser apresentadas com fontes e autoria.']
  };
  let activeRecord = null, filter = 'todos', controller = null, busy = false;
  let settings = store('norteando.settings', {url:'http://localhost:11434', model:'gemma4:e2b'});
  let conversations = store('norteando.conversations', []);
  let currentId = store('norteando.currentConversation', null);
  const notify = (message) => { const el = $('#toast'); el.textContent = message; el.hidden = false; clearTimeout(notify.timer); notify.timer = setTimeout(() => el.hidden = true, 3600); };
  const closeMenu = () => { $('#mobile-nav').hidden = true; $('.menu-toggle').setAttribute('aria-expanded','false'); };
  function navigate(route, scroll = true) {
    if (!['inicio','acervo','territorios','ia'].includes(route)) route = 'inicio';
    $$('.page').forEach(p => { const visible = p.dataset.page === route; p.hidden = !visible; p.classList.toggle('is-visible', visible); });
    $$('[data-route]').forEach(a => { const active = a.dataset.route === route; a.classList.toggle('is-active', active); if (a.matches('.nav-link')) active ? a.setAttribute('aria-current','page') : a.removeAttribute('aria-current'); });
    $('#rodape').hidden = route === 'ia'; closeMenu();
    if (scroll) window.scrollTo({top:0,behavior:'instant'});
    document.title = `${({inicio:'Início',acervo:'Acervo cultural',territorios:'Territórios',ia:'Norteando AI'})[route]} — Norteando`;
  }
  function syncRoute() { navigate(location.hash.slice(1).split('/')[0] || 'inicio'); }
  window.addEventListener('hashchange', syncRoute);
  $('.menu-toggle').addEventListener('click', () => { const menu = $('#mobile-nav'); menu.hidden = !menu.hidden; $('.menu-toggle').setAttribute('aria-expanded', String(!menu.hidden)); });
  document.addEventListener('click', e => { const a = e.target.closest('[data-route]'); if (a && a.dataset.route === location.hash.slice(1)) navigate(a.dataset.route); });
  function filterCatalog() {
    const query = text($('#catalog-search').value.trim());
    const grid = $('#catalog-grid');
    const cards = $$('.catalog-card', grid);
    const sort = $('#catalog-sort').value;
    cards.sort((a,b) => sort === 'featured' ? 0 : (sort === 'az' ? 1 : -1) * a.dataset.title.localeCompare(b.dataset.title, 'pt-BR'));
    cards.forEach(c => grid.append(c));
    let count = 0;
    cards.forEach(c => { const match = (filter === 'todos' || c.dataset.category.split(' ').includes(filter)) && text(c.textContent + ' ' + c.dataset.title).includes(query); c.hidden = !match; if (match) count++; });
    $('#catalog-count').textContent = `${count} ${count === 1 ? 'conteúdo' : 'conteúdos'}`;
    $('#catalog-empty').hidden = count !== 0;
  }
  $('#catalog-search').addEventListener('input', filterCatalog);
  $('#catalog-sort').addEventListener('change', filterCatalog);
  $$('[data-filter]').forEach(button => button.addEventListener('click', () => { filter = button.dataset.filter; $$('[data-filter]').forEach(b => { const on = b === button; b.classList.toggle('is-active',on); b.setAttribute('aria-pressed',String(on)); }); filterCatalog(); }));
  $('#clear-filters').addEventListener('click', () => { $('#catalog-search').value = ''; $('[data-filter="todos"]').click(); });
  document.addEventListener('keydown', e => { if (e.key === '/' && !/INPUT|TEXTAREA/.test(document.activeElement.tagName) && !document.querySelector('dialog[open]')) { e.preventDefault(); location.hash = 'acervo'; $('#catalog-search').focus(); } });
  function showDialog(dialog) { if (!dialog.open) dialog.showModal(); }
  function openRecord(id) {
    const d = recordInfo[id]; if (!d) return;
    activeRecord = id;
    $('#record-dialog-category').textContent = d[0]; $('#record-dialog-title').textContent = d[1]; $('#record-dialog-lead').textContent = d[2];
    $('#record-dialog-article').replaceChildren(...d[3].split('\n').map(t => { const p = document.createElement('p'); p.textContent = t; return p; }));
    const source = document.createElement('a'); source.href = d[5]; source.target = '_blank'; source.rel = 'noopener noreferrer'; source.textContent = `${d[4]} ↗`;
    $('#record-dialog-sources').replaceChildren(source);
    const card = $(`[data-open-record="${id}"] .catalog-card-image`) || $(`[data-open-record="${id}"] .feature-image`);
    $('#record-dialog-image').style.backgroundImage = card ? getComputedStyle(card).backgroundImage : '';
    showDialog($('#record-dialog'));
  }
  document.addEventListener('click', e => { const record = e.target.closest('[data-open-record]'); if (record) { e.preventDefault(); openRecord(record.dataset.openRecord); } });
  $('#record-dialog-close').addEventListener('click', () => $('#record-dialog').close());
  $$('[data-territory]').forEach(b => b.addEventListener('click', () => { const d = territoryInfo[b.dataset.territory]; if (!d) return; $('#territory-dialog-title').textContent = d[0]; const el = $('#territory-dialog-content'); el.replaceChildren(...d.slice(1).map(t => { const p = document.createElement('p'); p.textContent = t; return p; })); showDialog($('#territory-dialog')); }));
  $('#territory-dialog-close').addEventListener('click', () => $('#territory-dialog').close());
  $('#territory-dialog [data-route]').addEventListener('click', () => $('#territory-dialog').close());
  $$('dialog').forEach(d => d.addEventListener('click', e => { if (e.target === d) d.close(); }));
  function newConversation() { const c = {id: crypto.randomUUID(), title:'Nova conversa', messages:[], created:Date.now()}; conversations.unshift(c); currentId = c.id; persist(); renderConversation(); renderHistory(); return c; }
  function current() { return conversations.find(c => c.id === currentId); }
  function persist() { save('norteando.conversations', conversations.slice(0,30)); save('norteando.currentConversation',currentId); }
  function renderHistory() {
    const list = $('#conversation-list'); list.replaceChildren();
    if (!conversations.length) { const p = document.createElement('p'); p.className = 'sidebar-empty'; p.textContent = 'Suas conversas aparecerão aqui.'; list.append(p); return; }
    conversations.forEach(c => { const b = document.createElement('button'); b.type = 'button'; b.textContent = c.title; b.title = c.title; b.setAttribute('aria-current',String(c.id === currentId)); if (c.id === currentId) b.style.fontWeight = '800'; b.addEventListener('click', () => { if (busy) return notify('Aguarde ou interrompa a resposta atual.'); currentId = c.id; persist(); renderConversation(); renderHistory(); }); list.append(b); });
  }
  function addMessage(role, content) { const item = document.createElement('div'); item.className = `chat-message ${role}`; item.textContent = content; $('#chat-messages').append(item); $('#ai-chat-scroll').scrollTop = $('#ai-chat-scroll').scrollHeight; return item; }
  function renderConversation() { const c = current(); $('#chat-messages').replaceChildren(); $('#ai-welcome').hidden = !!c?.messages.length; c?.messages.forEach(m => addMessage(m.role,m.content)); }
  function setBusy(value) { busy = value; $('#send-message').disabled = value; $('#stop-generation').hidden = !value; $('#chat-input').disabled = value; }
  const errorMessage = err => err.name === 'AbortError' ? 'Geração interrompida.' : err instanceof TypeError ? 'Não foi possível acessar o Ollama. Verifique se ele está ligado e se a origem do site está autorizada no CORS.' : err.message;
  function endpoint(path) { const url = new URL(settings.url); if (!['http:','https:'].includes(url.protocol)) throw new Error('Use uma URL HTTP ou HTTPS válida para o Ollama.'); return url.toString().replace(/\/$/,'') + path; }
  async function checkModel() {
    const dot = $('#model-status-dot'), label = $('#model-status-label'); label.textContent = 'Verificando Ollama...'; dot.style.background = '#cda56a';
    try {
      const r = await fetch(endpoint('/api/tags'), {signal:AbortSignal.timeout(6000)}); if (!r.ok) throw new Error(`Ollama respondeu HTTP ${r.status}`);
      const data = await r.json(); const installed = (data.models || []).some(m => m.name === settings.model || m.model === settings.model);
      label.textContent = installed ? 'Gemma 4 disponível' : 'Modelo não encontrado'; dot.style.background = installed ? '#4b9d70' : '#bd7853';
      $('#active-model-label').textContent = `${settings.model} • ${installed ? 'disponível' : 'não instalado'}`;
      return installed;
    } catch { label.textContent = 'Ollama indisponível'; dot.style.background = '#b95050'; $('#active-model-label').textContent = `${settings.model} • desconectado`; return false; }
  }
  async function sendMessage(raw) {
    const prompt = raw.trim(); if (!prompt || busy) return;
    if (!settings.model.trim()) { showDialog($('#ai-settings')); notify('Informe o modelo instalado.'); return; }
    let c = current() || newConversation();
    const previous = c.messages.slice(-12).map(m => ({role:m.role,content:m.content}));
    c.messages.push({role:'user',content:prompt}); if (c.messages.length === 1) c.title = prompt.slice(0,55);
    $('#ai-welcome').hidden = true; addMessage('user',prompt); $('#chat-input').value = ''; $('#ai-error').hidden = true;
    renderHistory(); persist(); setBusy(true); controller = new AbortController();
    const bubble = addMessage('assistant','Preparando resposta...'); let answer = '', completed = false;
    try {
      const response = await fetch(endpoint('/api/chat'), {method:'POST',headers:{'Content-Type':'application/json'},signal:controller.signal,body:JSON.stringify({model:settings.model,stream:true,messages:[{role:'system',content:'Você é o Norteando AI, assistente educativo em português brasileiro sobre a Amazônia. Respeite a diversidade cultural, não invente tradições, comunidades, fontes, citações ou consentimento. Diferencie fatos estabelecidos de incertezas. Não afirme ter consultado o acervo da plataforma, pois você não tem acesso a ele. Responda de forma clara e contextualizada.'},...previous,{role:'user',content:prompt}],options:{temperature:0.5,num_predict:900}})});
      if (!response.ok) { const body = await response.text(); throw new Error(`Ollama HTTP ${response.status}: ${body.slice(0,220)}`); }
      if (!response.body) throw new Error('O navegador não disponibilizou a resposta em streaming.');
      const reader = response.body.getReader(), decoder = new TextDecoder(); let buffer = '';
      while (true) {
        const {done,value} = await reader.read(); if (done) break; buffer += decoder.decode(value,{stream:true});
        const lines = buffer.split('\n'); buffer = lines.pop() || '';
        for (const line of lines) { if (!line.trim()) continue; let data; try { data = JSON.parse(line); } catch { continue; }
          if (data.error) throw new Error(data.error);
          if (data.message?.content) { answer += data.message.content; bubble.textContent = answer; $('#ai-chat-scroll').scrollTop = $('#ai-chat-scroll').scrollHeight; }
          if (data.done) completed = true;
        }
      }
      if (!answer) throw new Error('O modelo não retornou texto.');
      c.messages.push({role:'assistant',content:answer}); persist();
      if (!completed) notify('A conexão terminou antes da confirmação de conclusão.');
    } catch (err) {
      const message = errorMessage(err); bubble.textContent = answer || `Não foi possível obter uma resposta. ${message}`;
      if (answer) { c.messages.push({role:'assistant',content:answer + '\n\n[Resposta parcial — geração interrompida]'}); persist(); }
      $('#ai-error').textContent = message; $('#ai-error').hidden = false;
    } finally { setBusy(false); controller = null; $('#chat-input').focus(); }
  }
  $('#chat-form').addEventListener('submit', e => { e.preventDefault(); sendMessage($('#chat-input').value); });
  $('#chat-input').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); $('#chat-form').requestSubmit(); } });
  $('#stop-generation').addEventListener('click', () => controller?.abort());
  $('#new-chat').addEventListener('click', () => { if (busy) return notify('Interrompa a geração antes de iniciar outra conversa.'); newConversation(); $('#chat-input').focus(); });
  $$('[data-prompt]').forEach(b => b.addEventListener('click', () => sendMessage(b.dataset.prompt)));
  $('#ask-about-record').addEventListener('click', () => { if (!activeRecord) return; const d = recordInfo[activeRecord]; $('#record-dialog').close(); location.hash = 'ia'; $('#chat-input').value = `Explique mais sobre "${d[1]}" na Amazônia. Apresente contexto e indique que fontes devo consultar.`; $('#chat-input').focus(); });
  $('#ai-settings-open').addEventListener('click', () => showDialog($('#ai-settings')));
  $('#save-ai-settings').addEventListener('click', async () => { const url = $('#ollama-url').value.trim(), model = $('#ollama-model').value.trim(); if (!model) return $('#settings-feedback').textContent = 'Informe o identificador exato do modelo.'; try { const parsed = new URL(url); if (!['http:','https:'].includes(parsed.protocol) || parsed.username || parsed.password) throw Error(); } catch { return $('#settings-feedback').textContent = 'Informe uma URL HTTP(S) válida.'; }
    settings = {url,model}; save('norteando.settings',settings); $('#settings-feedback').textContent = 'Configurações salvas. Verificando...'; const ok = await checkModel(); $('#settings-feedback').textContent = ok ? 'Modelo encontrado. Você já pode conversar.' : 'Configuração salva, mas o modelo não está acessível. Confira o Ollama e o CORS.';
  });
  $('#ollama-url').value = settings.url; $('#ollama-model').value = settings.model;
  $('#current-year').textContent = new Date().getFullYear();
  syncRoute(); filterCatalog(); renderHistory(); renderConversation(); checkModel();
})();
