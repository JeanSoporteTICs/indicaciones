(function(){
  const searchableSelectRegistry = new Map();
  let activeSearchableSelectEntry = null;
  const SEARCHABLE_SELECT_LIMIT = 30;

  function hideSuggestions(wrapper){
    if (!wrapper) return;
    const panel = wrapper._suggestionsPanel || wrapper.querySelector('.medicamento-suggestions');
    if (panel){
      panel.classList.remove('show');
    }
    wrapper.classList.remove('suggestions-open');
    if (activeSearchableSelectEntry?.wrapper === wrapper){
      activeSearchableSelectEntry = null;
    }
  }

  function positionPanel(entry){
    if (!entry?.panel || !entry?.input) return;
    const rect = entry.input.getBoundingClientRect();
    entry.panel.style.position = 'fixed';
    entry.panel.style.top = `${rect.bottom + 6}px`;
    entry.panel.style.left = `${rect.left}px`;
    entry.panel.style.width = `${rect.width}px`;
  }

  function syncActivePanelPosition(){
    if (!activeSearchableSelectEntry?.panel?.classList.contains('show')) return;
    positionPanel(activeSearchableSelectEntry);
  }

  function getPlaceholder(options){
    const placeholderOpt = options.find(opt => opt.disabled && opt.selected) ||
      options.find(opt => opt.disabled && (opt.value === '' || opt.value === null));
    return placeholderOpt ? (placeholderOpt.label || placeholderOpt.value || '') : '';
  }

  function updateInput(entry){
    const selectValue = entry.select.value;
    if ((!selectValue || selectValue === '') && entry.placeholder){
      entry.input.value = '';
      entry.input.placeholder = entry.placeholder;
      return;
    }
    const current = entry.options.find(opt => opt.value === selectValue);
    if (current){
      entry.input.value = current.label || current.value || '';
      entry.input.placeholder = entry.placeholder || entry.input.placeholder;
      return;
    }
    entry.input.value = '';
    entry.input.placeholder = entry.placeholder || entry.input.placeholder;
  }

  function pickOption(select, option){
    const entry = searchableSelectRegistry.get(select);
    if (!entry) return;
    select.value = option.value || '';
    entry.input.value = option.label || option.value || '';
    entry.input.placeholder = entry.placeholder || entry.input.placeholder;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    hideSuggestions(entry.wrapper);
  }

  function renderSuggestions(select){
    const entry = searchableSelectRegistry.get(select);
    if (!entry) return;
    const term = (entry.input.value || '').toLowerCase();
    const panel = entry.panel;
    panel.innerHTML = '';
    const matches = entry.options
      .filter(opt=>{
        if (opt.disabled) return false;
        if (!term) return true;
        return (opt.label || '').toLowerCase().includes(term) || (opt.value || '').toLowerCase().includes(term);
      })
      .slice(0, SEARCHABLE_SELECT_LIMIT);
    if (!matches.length){
      const empty = document.createElement('div');
      empty.className = 'medicamento-suggestion-empty';
      empty.textContent = 'Sin resultados';
      panel.appendChild(empty);
    } else {
      matches.forEach(opt=>{
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'medicamento-suggestion';
        btn.textContent = opt.label || opt.value || '(sin etiqueta)';
        btn.dataset.value = opt.value || '';
        btn.addEventListener('mousedown', ev=>{
          ev.preventDefault();
          pickOption(select, opt);
        });
        panel.appendChild(btn);
      });
    }
    activeSearchableSelectEntry = entry;
    positionPanel(entry);
    panel.classList.add('show');
    entry.wrapper.classList.add('suggestions-open');
  }

  function commitInputValue(select){
    const entry = searchableSelectRegistry.get(select);
    if (!entry) return;
    const value = (entry.input.value || '').toLowerCase();
    const match = entry.options.find(opt =>
      (opt.label || '').toLowerCase() === value ||
      (opt.value || '').toLowerCase() === value
    );
    if (match){
      pickOption(select, match);
      return;
    }
    updateInput(entry);
  }

  function createWrapper(select){
    select.classList.add('d-none');
    const wrapper = document.createElement('div');
    wrapper.className = 'medicamento-input-wrapper searchable-select';
    select.insertAdjacentElement('afterend', wrapper);

    const icon = document.createElement('i');
    icon.className = 'fas fa-search medicamento-input-icon';
    wrapper.appendChild(icon);

    const input = document.createElement('input');
    input.type = 'search';
    input.className = 'form-control medicamento-input';
    input.placeholder = select.dataset.placeholder || 'Buscar opción';
    input.autocomplete = 'off';
    wrapper.appendChild(input);

    const panel = document.createElement('div');
    panel.className = 'medicamento-suggestions searchable-select-panel';
    document.body.appendChild(panel);
    wrapper._suggestionsPanel = panel;

    input.addEventListener('input', ()=>renderSuggestions(select));
    input.addEventListener('focus', ()=>renderSuggestions(select));
    input.addEventListener('blur', ()=>setTimeout(()=>hideSuggestions(wrapper), 120));
    input.addEventListener('change', ()=>commitInputValue(select));

    return { wrapper, input, panel, options: [], select, placeholder: '' };
  }

  function ensureSearchableSelect(select, configOptions){
    if (!select || !Array.isArray(configOptions)) return;
    const normalizedOptions = configOptions.map(opt=>({
      value: opt.value ?? '',
      label: opt.label ?? opt.value ?? '',
      disabled: !!opt.disabled,
      selected: !!opt.selected
    }));
    let entry = searchableSelectRegistry.get(select);
    if (!entry){
      entry = createWrapper(select);
      searchableSelectRegistry.set(select, entry);
    }
    entry.options = normalizedOptions;
    entry.placeholder = getPlaceholder(normalizedOptions);
    updateInput(entry);
  }

  function syncSearchableSelectValue(target){
    const select = typeof target === 'string' ? document.getElementById(target) : target;
    if (!select) return;
    const entry = searchableSelectRegistry.get(select);
    if (!entry) return;
    updateInput(entry);
  }

  window.ensureSearchableSelect = ensureSearchableSelect;
  window.hideMedicamentoSuggestions = hideSuggestions;
  window.syncActiveSearchableSelectPanelPosition = syncActivePanelPosition;
  window.syncSearchableSelectValue = syncSearchableSelectValue;
})();
