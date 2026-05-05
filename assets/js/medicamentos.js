(function(){
  const MEDICAMENTO_SUGGESTION_LIMIT = 30;
  let activeMedicamentoEntry = null;

  function getMedicamentoCatalog(){
    return Array.isArray(window.ArsenalCatalog?.medicamentos) ? window.ArsenalCatalog.medicamentos : [];
  }

  function getMedicamentoMatches(term = ''){
    const normalized = (term || '').trim().toLowerCase();
    const catalog = getMedicamentoCatalog()
      .map(item => ({
        nombre: (item.nombre || '').trim(),
        codigo: item.codigo || ''
      }))
      .filter(item => item.nombre);

    if (!normalized) return catalog.slice(0, MEDICAMENTO_SUGGESTION_LIMIT);
    return catalog
      .filter(item => item.nombre.toLowerCase().includes(normalized))
      .slice(0, MEDICAMENTO_SUGGESTION_LIMIT);
  }

  function populateMedicSelects(row, data = {}){
    if (!row) return;
    const intervaloSel = row.querySelector('select[name="m_intervalo"]');
    const viaSel = row.querySelector('select[name="m_via"]');
    const intervaloOpts = window.buildOptionsFromConfig('intervalo', 'Intervalo', window.DEFAULT_INTERVALO_OPTIONS);
    const viaOpts = window.buildOptionsFromConfig('via', 'Vía', window.DEFAULT_VIA_OPTIONS);
    if (intervaloSel){
      window.setSelectOptions(intervaloSel, intervaloOpts, data.intervalo || '');
    }
    if (viaSel){
      window.setSelectOptions(viaSel, viaOpts, data.via || '');
    }
  }

  function safePopulateMedicSelects(row, data = {}){
    if (!row) return;
    const intervaloSel = row.querySelector('select[name="m_intervalo"]');
    const viaSel = row.querySelector('select[name="m_via"]');
    if (intervaloSel){
      window.setSelectOptions(intervaloSel, window.DEFAULT_INTERVALO_OPTIONS, data.intervalo || '');
    }
    if (viaSel){
      window.setSelectOptions(viaSel, window.DEFAULT_VIA_OPTIONS, data.via || '');
    }
    populateMedicSelects(row, data);
  }

  function findMedicamentoByCode(code){
    if (!code) return null;
    return getMedicamentoCatalog().find(m => m.codigo === code) || null;
  }

  function findMedicamentoByName(nombre){
    if (!nombre) return null;
    const normalized = nombre.trim().toLowerCase();
    return getMedicamentoCatalog().find(m => (m.nombre || '').toLowerCase() === normalized) || null;
  }

  function setMedicamentoInputValue(input, codigo = '', nombre = ''){
    if (!input) return;
    let targetName = nombre;
    let targetCode = codigo;
    if (codigo){
      const item = findMedicamentoByCode(codigo);
      if (item){
        targetName = item.nombre || targetName;
        targetCode = item.codigo || targetCode;
      }
    } else if (nombre){
      const item = findMedicamentoByName(nombre);
      if (item){
        targetName = item.nombre || targetName;
        targetCode = item.codigo || targetCode;
      }
    }
    input.value = targetName || '';
    input.dataset.codigo = targetCode || '';
    window.updateSectionCompletionStatus?.();
  }

  function handleMedicamentoInput(event){
    const input = event.target;
    const value = input.value.trim();
    const match = findMedicamentoByName(value);
    input.dataset.codigo = match?.codigo || '';
  }

  function positionMedicamentoPanel(entry){
    if (!entry?.panel || !entry?.input) return;
    const rect = entry.input.getBoundingClientRect();
    entry.panel.style.position = 'fixed';
    entry.panel.style.top = `${rect.bottom + 8}px`;
    entry.panel.style.left = `${rect.left}px`;
    entry.panel.style.width = `${rect.width}px`;
  }

  function syncActiveMedicamentoPanelPosition(){
    if (!activeMedicamentoEntry?.panel?.classList.contains('show')) return;
    positionMedicamentoPanel(activeMedicamentoEntry);
  }

  function renderMedicamentoSuggestions(wrapper, term = ''){
    if (!wrapper) return;
    const input = wrapper.querySelector('.medicamento-input');
    if (!input) return;
    let panel = wrapper._suggestionsPanel || wrapper.querySelector('.medicamento-suggestions');
    if (!panel){
      panel = document.createElement('div');
      panel.className = 'medicamento-suggestions searchable-select-panel';
      document.body.appendChild(panel);
      wrapper._suggestionsPanel = panel;
    }
    panel.innerHTML = '';
    const matches = getMedicamentoMatches(term);
    if (!matches.length){
      const empty = document.createElement('div');
      empty.className = 'medicamento-suggestion text-muted';
      empty.textContent = 'Sin resultados';
      panel.appendChild(empty);
    } else {
      matches.forEach(item=>{
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'medicamento-suggestion';
        btn.textContent = item.nombre;
        btn.dataset.codigo = item.codigo || '';
        btn.addEventListener('mousedown', ev=>{
          ev.preventDefault();
          setMedicamentoInputValue(input, btn.dataset.codigo, btn.textContent);
          window.hideMedicamentoSuggestions(wrapper);
          activeMedicamentoEntry = null;
        });
        panel.appendChild(btn);
      });
    }
    activeMedicamentoEntry = { wrapper, input, panel };
    positionMedicamentoPanel(activeMedicamentoEntry);
    panel.classList.add('show');
    wrapper.classList.add('suggestions-open');
  }

  function ensureMedicamentoInput(row, selectedCode = '', fallbackName = ''){
    if (!row) return;
    let cell = row.querySelector('.medicamento-cell');
    if (!cell){
      cell = row.querySelector('td');
      if (!cell){
        cell = document.createElement('td');
        row.prepend(cell);
      }
      cell.classList.add('medicamento-cell');
    }

    let wrapper = cell.querySelector('.medicamento-input-wrapper');
    if (!wrapper){
      wrapper = document.createElement('div');
      wrapper.className = 'medicamento-input-wrapper';
      cell.innerHTML = '';
      cell.appendChild(wrapper);
    }

    let icon = wrapper.querySelector('.medicamento-input-icon');
    if (!icon){
      icon = document.createElement('i');
      icon.className = 'fas fa-search medicamento-input-icon';
      wrapper.appendChild(icon);
    }

    let panel = wrapper._suggestionsPanel || wrapper.querySelector('.medicamento-suggestions');
    if (!panel){
      panel = document.createElement('div');
      panel.className = 'medicamento-suggestions searchable-select-panel';
      document.body.appendChild(panel);
      wrapper._suggestionsPanel = panel;
    }

    let input = wrapper.querySelector('input[name="m_medicamento"]');
    if (!input){
      input = document.createElement('input');
      input.type = 'search';
      input.name = 'm_medicamento';
      input.className = 'form-control medicamento-input';
      input.placeholder = 'Buscar medicamento';
      input.autocomplete = 'off';
      wrapper.appendChild(input);
      input.addEventListener('input', event=>{
        handleMedicamentoInput(event);
        renderMedicamentoSuggestions(wrapper, event.target.value);
      });
      input.addEventListener('change', handleMedicamentoInput);
      input.addEventListener('focus', ()=>renderMedicamentoSuggestions(wrapper, input.value));
      input.addEventListener('blur', ()=>{
        setTimeout(()=>{
          const currentPanel = wrapper._suggestionsPanel || wrapper.querySelector('.medicamento-suggestions');
          if (!currentPanel?.matches(':hover')){
            window.hideMedicamentoSuggestions(wrapper);
            if (activeMedicamentoEntry?.wrapper === wrapper){
              activeMedicamentoEntry = null;
            }
          }
        }, 120);
      });
    }

    setMedicamentoInputValue(input, selectedCode, fallbackName);
    window.hideMedicamentoSuggestions(wrapper);
  }

  window.getMedicamentoCatalog = getMedicamentoCatalog;
  window.findMedicamentoByName = findMedicamentoByName;
  window.setMedicamentoInputValue = setMedicamentoInputValue;
  window.ensureMedicamentoInput = ensureMedicamentoInput;
  window.safePopulateMedicSelects = safePopulateMedicSelects;
  window.addEventListener('resize', syncActiveMedicamentoPanelPosition);
  window.addEventListener('scroll', syncActiveMedicamentoPanelPosition, true);
})();
