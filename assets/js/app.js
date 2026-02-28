// =========================
// Clase Paciente
// =========================
class Paciente {
  constructor(){
    this._data = {
      id: null,
      fecha: '',
      fechaIngreso: '',
      fechaNacimiento: '',
      hora: '',
      edad: 0,
      diasHospitalizacion: 0,
      cama: '',
      sexo: '',
      nombrePaciente: '',
      rut: '',
      ficha: '',
      peso: 0,
      pesoIdeal: 0,
      talla: 0,
      sctm2: 0,
      medicoResponsable: '',
      diagnostico: '',
      volumenHolliday: 0,
      sesentaHolliday: 0,
      volumenSC: 0,
      crea: 0,
      vfg: 0,
      reb: 0,
      reposo: '',
      la: false,
      sng: false,
      sf: false,
      du: "",
      bh: "",
      cvc: false,
      aislamiento: '',
      regimen: '',
      vm: '',
      sa: '',
      esc: '',
      bis: '',
      tof: '',
      rass: '',
      fechaReceta: '',
      medicamentos: []      // â† solo una vez
    };
  }

  getData(){ return this._data; }
  setData(d){ this._data = { ...this._data, ...d }; }

  // =========================
  // Carga datos desde el formulario
  // =========================
  cargarDesdeFormulario(){
    const val = id => document.getElementById(id)?.value || '';
    const chk = id => document.getElementById(id)?.checked || false;

    Object.assign(this._data, {
      fecha:           val('fecha'),
      fechaIngreso:    val('fechaIngreso'),
      fechaNacimiento: val('fechaNacimiento'),
      hora:            val('hora'),
      cama:            val('cama'),
      sexo:            val('sexo'),
      nombrePaciente:  val('nombrePaciente'),
      rut:             val('rut'),
      ficha:           val('ficha'),
      peso:            parseFloat(val('peso')) || 0,
      talla:           parseFloat(val('talla')) || 0,
      medicoResponsable: val('medicoResponsable'),
      diagnostico:       val('diagnostico'),
      crea:              parseFloat(val('crea')) || 0,
      sesentaHolliday:   parseFloat(val('60Holliday')) || 0,
      reposo:   val('reposo'),
      la:       chk('la'),
      sng:      chk('sng'),
      sf:       chk('sf'),
      du:       val("du"),
      bh:       val("bh"),
      cvc:      chk('cvc'),
      aislamiento: val('aislamiento'),
      regimen:     val('regimen'),
      vm:         val('vm'),
      sa:         val('sa'),
      esc:        val('esc'),
      bis:        val('bis'),
      tof:        val('tof'),
      rass:       val('rass'),
      fechaReceta: val('fechaReceta')
    });
    this._data.fechaReceta = this._data.fecha;

    // Medicamentos: ahora viene de la tabla Ãºnica #medicamentos
    this._data.medicamentos = [];
    document.querySelectorAll('#medicamentos tbody tr').forEach(row => {
      const get = name => row.querySelector(`[name="${name}"]`)?.value || '';
      const input = row.querySelector('input[name="m_medicamento"]');
      const codigo = input?.dataset?.codigo || '';
      const nombre = input?.value || '';
      if (codigo || nombre) {
        this._data.medicamentos.push({
          codigo:      codigo,
          medicamento: nombre || '',
          dosis:       get('m_dosis'),
          intervalo:   get('m_intervalo'),
          via:         get('m_via'),
          volumen:     get('m_volumen'),
          fi:          get('m_fi')
        });
      }
    });
  }

  // =========================
  // Mostrar datos en formulario
  // =========================
  mostrarEnFormulario(){
    const set = (id,v)=>{ const el=document.getElementById(id); if (el) el.value = (v ?? ''); };
    const setChk=(id,v)=>{ const el=document.getElementById(id); if (el) el.checked = !!v; };

    set('fecha',this._data.fecha);
    set('fechaIngreso',this._data.fechaIngreso);
    set('fechaNacimiento',this._data.fechaNacimiento);
    set('hora',this._data.hora);
    set('edad',this._data.edad);
    set('diasHospitalizacion',this._data.diasHospitalizacion);
    set('cama',this._data.cama);
    set('sexo',this._data.sexo);
    set('nombrePaciente',this._data.nombrePaciente);
    set('rut',this._data.rut);
    handleRutInput();
    set('ficha',this._data.ficha);

    set('peso',this._data.peso);
    set('pesoIdeal',(this._data.pesoIdeal||0).toFixed(2));
    set('talla',this._data.talla);
    set('sctm2',(this._data.sctm2||0).toFixed(2));

    set('medicoResponsable',this._data.medicoResponsable);
    set('diagnostico',this._data.diagnostico);

    this._data.fechaReceta = this._data.fecha || this._data.fechaReceta || '';
    set('fechaReceta',this._data.fechaReceta);
    const vh = parseFloat(this._data.volumenHolliday) || 0;
    this._data.volumenHolliday = vh;
    this._data.sesentaHolliday = vh * 0.6;
    set('volumenHolliday',(this._data.volumenHolliday||0).toFixed(2));
    set('60Holliday',(this._data.sesentaHolliday||0).toFixed(2));
    set('volumenSC',(this._data.volumenSC||0).toFixed(2));
    set('crea',this._data.crea);
    set('vfg',(this._data.vfg||0).toFixed(2));
    set('reb',(typeof this._data.reb==='string') ? this._data.reb : (this._data.reb||0).toFixed(2));

    const reposoVal = typeof this._data.reposo === 'boolean'
      ? (this._data.reposo ? 'SI' : '')
      : (this._data.reposo || '');
    set('reposo', reposoVal);
    setChk('la',this._data.la);
    setChk('sng',this._data.sng);
    setChk('sf',this._data.sf);
    set("du",this._data.du);
    set("bh",this._data.bh);
    setChk('cvc',this._data.cvc);

    set('aislamiento',this._data.aislamiento);
    set('regimen',this._data.regimen);
    set('vm',this._data.vm);
    set('sa',this._data.sa);
    set('esc',this._data.esc);

    set('bis',this._data.bis);
    set('tof',this._data.tof);
    set('rass',this._data.rass);
    set('fechaReceta',this._data.fechaReceta);

    // Opcional: tambiÃ©n podrÃ­as repoblar la tabla #medicamentos desde _data.medicamentos
    const tbodyMeds = document.querySelector('#medicamentos tbody');
    if (tbodyMeds){
      tbodyMeds.innerHTML = '';
        if ((this._data.medicamentos || []).length){
          this._data.medicamentos.forEach(m => {
            const tr = document.createElement('tr');
          tr.innerHTML = `
            <td class="medicamento-cell"></td>
            <td><input type="text" class="form-control" name="m_dosis" value="${m.dosis || ''}"></td>
            <td><select class="form-select" name="m_intervalo"></select></td>
            <td><select class="form-select" name="m_via"></select></td>
            <td><input type="text" class="form-control form-control-sm" name="m_volumen" value="${m.volumen || ''}"></td>
            <td><input type="date" class="form-control" name="m_fi" value="${m.fi || ''}"></td>
            <td><button type="button" class="btn btn-danger btn-sm" onclick="removeRow(this)"><i class="fas fa-trash"></i></button></td>
          `;
          tbodyMeds.appendChild(tr);
          ensureMedicamentoInput(tr, m.codigo || '', m.medicamento || '');
          safePopulateMedicSelects(tr, m);
        });
      } else {
        // si no hay meds guardados, dejar una fila vacÃ­a
        addRowMedic();
      }
    }
  }

  // =========================
  // CÃ¡lculos
  // =========================
  calcularEdad(){
    if (!this._data.fechaNacimiento) {
      this._data.edad = '';
      return 0;
    }
    const hoy = new Date();
    const n = new Date(this._data.fechaNacimiento);
    if (Number.isNaN(n.getTime())) {
      this._data.edad = '';
      return 0;
    }

    let years = hoy.getFullYear() - n.getFullYear();
    let months = hoy.getMonth() - n.getMonth();
    let days = hoy.getDate() - n.getDate();

    if (days < 0){
      months -= 1;
      const prevMonth = new Date(hoy.getFullYear(), hoy.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0){
      years -= 1;
      months += 12;
    }
    if (years < 0) {
      years = 0;
      months = 0;
      days = 0;
    }

    const unidad = (valor, singular, plural) => `${valor} ${valor === 1 ? singular : plural}`;
    const texto = `${unidad(years, 'año', 'años')}, ${unidad(months, 'mes', 'meses')} y ${unidad(days, 'día', 'días')}`;
    this._data.edad = texto;
    return years + (months / 12) + (days / 365.25);
  }

  calcularDiasHospitalizacion(){
    if (!this._data.fechaIngreso) return 0;
    const hoy = new Date();
    const ing = new Date(this._data.fechaIngreso);
    const diff = Math.abs(hoy - ing);
    const d = Math.ceil(diff / (1000*60*60*24));
    this._data.diasHospitalizacion = d;
    return d;
  }

  calcularPesoIdeal(){
    const {sexo,talla} = this._data;
    if (!sexo || !talla) return 0;
    const sx = (sexo || '').toString().trim().toLowerCase();
    if (sx === 'm' || sx === 'masculino') {
      this._data.pesoIdeal = 50 + 0.91*(talla-152.4);
    } else if (sx === 'f' || sx === 'femenino') {
      this._data.pesoIdeal = 45.5 + 0.91*(talla-152.4);
    } else {
      this._data.pesoIdeal = 0;
    }
    return this._data.pesoIdeal;
  }

  calcularSCTM2(){
    const {peso,talla} = this._data;
    if (!peso || !talla) return 0;
    this._data.sctm2 = Math.sqrt((talla*peso)/3600);
    return this._data.sctm2;
  }

  calcularVolumenHolliday(){
    const {peso} = this._data;
    if (!peso){
      this._data.volumenHolliday = 0;
      this._data.sesentaHolliday = 0;
      return 0;
    }
    if (peso<=10) this._data.volumenHolliday = peso*100;
    else if (peso<=20) this._data.volumenHolliday = 1000 + (peso-10)*50;
    else this._data.volumenHolliday = 1500 + (peso-20)*20;
    this._data.sesentaHolliday = this._data.volumenHolliday * 0.6;
    return this._data.volumenHolliday;
  }

  calcularVolumenSC(){
    this._data.volumenSC = 1500*(this._data.sctm2 || 0);
    return this._data.volumenSC;
  }

  calcularVFG(){
    const {talla,crea} = this._data;
    if (!talla || !crea || crea === 0) return 0;
    // Fórmula solicitada: (TALLA * 0.413) / CREA
    this._data.vfg = (talla * 0.413) / crea;
    return this._data.vfg;
  }

  calcularREB(){
    const {sexo,fechaNacimiento,peso,talla} = this._data;
    if (!sexo || !fechaNacimiento || !peso || !talla) return 0;
    const e = this.calcularEdad();
    if (e>=18){
      this._data.reb = (sexo==='M')
        ? (66.5 + 13.75*peso + 5.003*talla - 6.755*e)
        : (655.1 + 9.563*peso + 1.850*talla - 4.676*e);
      return this._data.reb;
    }
    if (e<3)      this._data.reb = (peso*60)-54;
    else if(e<=10) this._data.reb = (peso*22)+504;
    else           this._data.reb = (sexo==='M') ? ((peso*17.5)+651) : ((peso*12.2)+746);
    return this._data.reb;
  }

  calcularTodo(){
    this.calcularEdad();
    this.calcularDiasHospitalizacion();
    this.calcularPesoIdeal();
    this.calcularSCTM2();
    this.calcularVolumenHolliday();
    this.calcularVolumenSC();
    this.calcularVFG();
    this.calcularREB();
  }

  // =========================
  // LocalStorage
  // =========================
  guardarLocal(){
    const pacientes = JSON.parse(localStorage.getItem('pacientes') || '{}');
    const id = this._data.id || Date.now();
    this._data.id = id;
    pacientes[id] = this._data;
    localStorage.setItem('pacientes', JSON.stringify(pacientes));
    return id;
  }

  cargarLocalPorId(id){
    const pacientes = JSON.parse(localStorage.getItem('pacientes') || '{}');
    if (pacientes[id]){ this.setData(pacientes[id]); return true; }
    return false;
  }

  buscarLocal(term){
    const pacientes = JSON.parse(localStorage.getItem('pacientes') || '{}');
    const t = term.toLowerCase();
    for (const id in pacientes){
      const p = pacientes[id];
      if (id===term || (p.nombrePaciente||'').toLowerCase().includes(t) || (p.rut||'').includes(term)) return p;
    }
    return null;
  }
}

let pacienteActual = new Paciente();
const importState = { isImported: false, fileName: '' };
const searchableSelectRegistry = new Map();

function setImportedState(flag, fileName = ''){
  importState.isImported = !!flag;
  importState.fileName = fileName || '';
}

function populateSelectsFromConfig(){
  if (!window.SelectConfig) return;
  Object.entries(window.SelectConfig).forEach(([id, options])=>{
    const select = document.getElementById(id);
    if (!select) return;
    const previousValue = select.value;
    select.innerHTML = '';
    let hasExplicitSelection = false;
    options.forEach(opt=>{
      const option = document.createElement('option');
      option.value = opt.value ?? '';
      option.textContent = opt.label ?? '';
      if (opt.disabled) option.disabled = true;
      if (opt.selected){
        option.selected = true;
        hasExplicitSelection = true;
      }
      select.appendChild(option);
    });
    if (!hasExplicitSelection && previousValue){
      select.value = previousValue;
    }
    ensureSearchableSelect(select, options);
  });
}

const DEFAULT_INTERVALO_OPTIONS = [
  { value: '4 h',  label: '4 h' },
  { value: '6 h',  label: '6 h' },
  { value: '8 h',  label: '8 h' },
  { value: '12 h', label: '12 h' },
  { value: '24 h', label: '24 h' },
  { value: '36 h', label: '36 h' }
];

const DEFAULT_VIA_OPTIONS = [
  { value: 'EV',  label: 'EV' },
  { value: 'VO',  label: 'VO' },
  { value: 'IM',  label: 'IM' },
  { value: 'SC',  label: 'SC' },
  { value: 'SL',  label: 'SL' },
  { value: 'INH', label: 'INH' },
  { value: 'OTRA', label: 'OTRA' }
];

function getMedicamentoCatalog(){
  return Array.isArray(window.ArsenalCatalog?.medicamentos) ? window.ArsenalCatalog.medicamentos : [];
}

const MEDICAMENTO_SUGGESTION_LIMIT = 30;

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

function buildOptionsFromConfig(key, placeholder, fallback){
  const cfg = Array.isArray(window.SelectConfig?.[key]) ? window.SelectConfig[key] : null;
  if (cfg){
    return cfg.map(opt=>({
      value: opt.value ?? '',
      label: opt.label ?? opt.value ?? '',
      disabled: !!opt.disabled,
      selected: !!opt.selected
    }));
  }
  const opts = [];
  opts.push({
    value: '',
    label: placeholder,
    disabled: true,
    selected: true
  });
  (fallback || []).forEach(opt=>{
    opts.push({
      value: opt.value ?? '',
      label: opt.label ?? opt.value ?? '',
      disabled: !!opt.disabled,
      selected: !!opt.selected
    });
  });
  return opts;
}

function setSelectOptions(select, options, selectedValue=''){
  if (!select || !Array.isArray(options)) return;
  select.innerHTML = '';
  options.forEach(opt=>{
    const option = document.createElement('option');
    option.value = opt.value ?? '';
    option.textContent = opt.label ?? opt.value ?? '';
    if (opt.disabled) option.disabled = true;
    if (opt.selected) option.selected = true;
    select.appendChild(option);
  });
  if (selectedValue){
    const match = Array.from(select.options).find(o=>o.value===selectedValue);
    if (match) select.value = selectedValue;
  }
}

function populateMedicSelects(row, data = {}){
  if (!row) return;
  const intervaloSel = row.querySelector('select[name="m_intervalo"]');
  const viaSel = row.querySelector('select[name="m_via"]');
  const intervaloOpts = buildOptionsFromConfig('intervalo', 'Intervalo', DEFAULT_INTERVALO_OPTIONS);
  const viaOpts = buildOptionsFromConfig('via', 'Vía', DEFAULT_VIA_OPTIONS);
  if (intervaloSel){
    setSelectOptions(intervaloSel, intervaloOpts, data.intervalo || '');
  }
  if (viaSel){
    setSelectOptions(viaSel, viaOpts, data.via || '');
  }
}

function safePopulateMedicSelects(row, data = {}){
  if (typeof populateMedicSelects === 'function'){
    populateMedicSelects(row, data);
    return;
  }
  // Fallback simple por si no está definido (no debería suceder)
  const intervaloSel = row?.querySelector('select[name="m_intervalo"]');
  const viaSel = row?.querySelector('select[name="m_via"]');
  if (intervaloSel){
    setSelectOptions(intervaloSel, DEFAULT_INTERVALO_OPTIONS, data.intervalo || '');
  }
  if (viaSel){
    setSelectOptions(viaSel, DEFAULT_VIA_OPTIONS, data.via || '');
  }
}

function renderMedicamentoSuggestions(wrapper, term = ''){
  if (!wrapper) return;
  const input = wrapper.querySelector('.medicamento-input');
  if (!input) return;
  let panel = wrapper.querySelector('.medicamento-suggestions');
  if (!panel){
    panel = document.createElement('div');
    panel.className = 'medicamento-suggestions';
    wrapper.appendChild(panel);
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
        hideMedicamentoSuggestions(wrapper);
      });
      panel.appendChild(btn);
    });
  }
  panel.classList.add('show');
}

function hideMedicamentoSuggestions(wrapper){
  if (!wrapper) return;
  const panel = wrapper.querySelector('.medicamento-suggestions');
  if (panel){
    panel.classList.remove('show');
  }
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
    entry = createSearchableSelectWrapper(select);
    searchableSelectRegistry.set(select, entry);
  }
  entry.options = normalizedOptions;
  entry.placeholder = getSearchableSelectPlaceholder(normalizedOptions);
  updateSearchableSelectInput(entry);
}

function createSearchableSelectWrapper(select){
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
  panel.className = 'medicamento-suggestions';
  wrapper.appendChild(panel);

  input.addEventListener('input', ()=>renderSearchableSelectSuggestions(select));
  input.addEventListener('focus', ()=>renderSearchableSelectSuggestions(select));
  input.addEventListener('blur', ()=>setTimeout(()=>hideMedicamentoSuggestions(wrapper),120));
  input.addEventListener('change', ()=>commitSearchableInputValue(select));

  return { wrapper, input, panel, options: [], select, placeholder: '' };
}

function getSearchableSelectPlaceholder(options){
  const placeholderOpt = options.find(opt => opt.disabled && opt.selected) ||
    options.find(opt => opt.disabled && (opt.value === '' || opt.value === null));
  return placeholderOpt ? (placeholderOpt.label || placeholderOpt.value || '') : '';
}

function renderSearchableSelectSuggestions(select){
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
    .slice(0, MEDICAMENTO_SUGGESTION_LIMIT);
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
        pickSearchableSelectOption(select, opt);
      });
      panel.appendChild(btn);
    });
  }
  panel.classList.add('show');
}

function pickSearchableSelectOption(select, option){
  const entry = searchableSelectRegistry.get(select);
  if (!entry) return;
  select.value = option.value || '';
  entry.input.value = option.label || option.value || '';
  entry.input.placeholder = entry.placeholder || entry.input.placeholder;
  select.dispatchEvent(new Event('change', { bubbles: true }));
  hideMedicamentoSuggestions(entry.wrapper);
}

function commitSearchableInputValue(select){
  const entry = searchableSelectRegistry.get(select);
  if (!entry) return;
  const value = (entry.input.value || '').toLowerCase();
  const match = entry.options.find(opt =>
    (opt.label || '').toLowerCase() === value ||
    (opt.value || '').toLowerCase() === value
  );
  if (match){
    pickSearchableSelectOption(select, match);
  } else {
    updateSearchableSelectInput(entry);
  }
}

function updateSearchableSelectInput(entry){
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
  } else {
    entry.input.value = '';
    entry.input.placeholder = entry.placeholder || entry.input.placeholder;
  }
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
}

function handleMedicamentoInput(e){
  const input = e.target;
  const val = input.value.trim();
  const match = findMedicamentoByName(val);
  input.dataset.codigo = match?.codigo || '';
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

  let panel = wrapper.querySelector('.medicamento-suggestions');
  if (!panel){
    panel = document.createElement('div');
    panel.className = 'medicamento-suggestions';
    wrapper.appendChild(panel);
  }

  let input = wrapper.querySelector('input[name="m_medicamento"]');
  if (!input){
    input = document.createElement('input');
    input.type = 'search';
    input.name = 'm_medicamento';
    input.className = 'form-control medicamento-input';
    input.placeholder = 'Buscar medicamento';
    input.setAttribute('autocomplete', 'off');
    wrapper.appendChild(input);
    input.addEventListener('input', e=>{
      handleMedicamentoInput(e);
      renderMedicamentoSuggestions(wrapper, e.target.value);
    });
    input.addEventListener('change', handleMedicamentoInput);
    input.addEventListener('focus', ()=>{
      renderMedicamentoSuggestions(wrapper, input.value);
    });
    input.addEventListener('blur', ()=>{
      setTimeout(()=>{
        const panel = wrapper.querySelector('.medicamento-suggestions');
        if (!panel?.matches(':hover')){
          hideMedicamentoSuggestions(wrapper);
        }
      }, 120);
    });
  }

  setMedicamentoInputValue(input, selectedCode, fallbackName);
  hideMedicamentoSuggestions(wrapper);
}

// =========================
// Utilidades UI
// =========================
function removeRow(btn){
  const tr = btn.closest('tr');
  tr?.parentNode.removeChild(tr);
  toggleAddMedicButton();
}

function syncFechaReceta(){
  const fecha = document.getElementById('fecha');
  const fechaReceta = document.getElementById('fechaReceta');
  if (fecha && fechaReceta){
    fechaReceta.value = fecha.value || '';
  }
}

function clearTablaRecetas(){
  const tablaRecetas = document.querySelector('#tablaRecetas tbody');
  if (tablaRecetas){
    tablaRecetas.innerHTML = '';
  }
}

function showAppModal(message, title='Aviso'){
  const modalEl = document.getElementById('appModal');
  if (!modalEl){
    alert(message);
    return;
  }
  const titleEl = document.getElementById('appModalLabel');
  const bodyEl = document.getElementById('appModalBody');
  if (titleEl) titleEl.textContent = title;
  if (bodyEl) bodyEl.innerHTML = (message || '').split('\n').map(line=>line.trim()).filter(Boolean).join('<br>');
  if (window.bootstrap?.Modal){
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
  } else {
    modalEl.classList.add('show');
    modalEl.style.display = 'block';
  }
}

function handleRutInput(){
  const input = document.getElementById('rut');
  if (!input) return;
  let value = (input.value || '').toUpperCase().replace(/[^0-9K]/g,'');
  if (!value){
    input.value = '';
    return;
  }
  if (value.length === 1){
    input.value = value;
    return;
  }
  const cuerpo = value.slice(0,-1);
  const dv = value.slice(-1);
  const formattedBody = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g,'.');
  input.value = `${formattedBody}-${dv}`;
}

function calcularYActualizar(){
  pacienteActual.cargarDesdeFormulario();
  pacienteActual.calcularTodo();
  pacienteActual.mostrarEnFormulario();
}

function guardarDatos(){
  const req = ['fecha','fechaIngreso','fechaNacimiento','cama','sexo','nombrePaciente','rut','ficha','peso','talla','medicoResponsable'];
  const miss = [];
  req.forEach(id=>{
    const el=document.getElementById(id);
    el?.classList.remove('is-invalid');
    if(!el || !el.value){
      miss.push(el?.previousElementSibling?.textContent?.replace(' *','') || id);
      el?.classList.add('is-invalid');
    }
  });
  if (miss.length){
    showAppModal('Complete los obligatorios:<br>'+miss.join('<br>'), 'Datos requeridos');
    return;
  }
  if (!importState.isImported){
    alert('Esta acción solo aplica a archivos cargados.');
    return;
  }
  pacienteActual.cargarDesdeFormulario();
  pacienteActual.calcularTodo();
  const data = pacienteActual.getData();
  readMedicamentosTo(data);
  data.archivoOriginal = importState.fileName || '';
  postDownload('export.php', data);
}

async function cargarExcelDesdeArchivo(file){
  if (!file) return;
  const formData = new FormData();
  formData.append('file', file);
  try {
    const resp = await fetch('import_excel.php', { method: 'POST', body: formData });
    if (!resp.ok){
      let msg = await resp.text();
      try {
        const err = JSON.parse(msg);
        msg = err.error || msg;
      } catch(e){}
      throw new Error(msg || ('Error '+resp.status));
    }
    const data = await resp.json();
    pacienteActual.setData(data);
    pacienteActual.mostrarEnFormulario();
    setImportedState(true, file.name || '');
    alert('Archivo importado correctamente');
  } catch(err){
    console.error(err);
    alert('No se pudo importar el archivo:\n'+err.message);
  }
}

function nuevoFormulario(){
  if(!confirm('¿Crear nuevo formulario?')) return;
  pacienteActual = new Paciente();
  document.getElementById('hospitalizacionForm').reset();



  const tablaRecetas = document.querySelector('#tablaRecetas tbody');

  if (tablaRecetas){

    tablaRecetas.innerHTML = '';

  }

  // Reiniciar tabla de medicamentos con una fila vacÃ­a
  const tbody = document.querySelector('#medicamentos tbody');
  if (tbody){
    tbody.innerHTML = '';
    addRowMedic();
  }

  const hoy = new Date();
  document.getElementById('fecha').value = hoy.toISOString().split('T')[0];
  document.getElementById('fechaIngreso').value = '';
  const fechaRecetaEl = document.getElementById('fechaReceta');
  if (fechaRecetaEl) {
    fechaRecetaEl.value = hoy.toISOString().split('T')[0];
  }
  document.getElementById('hora').value = hoy.toTimeString().substring(0,5);
  setImportedState(false);
}

// =========================
// Medicamentos (tabla Ãºnica)
// =========================
function addRowMedic() {
    const tbody = document.querySelector('#medicamentos tbody');
    if (!tbody) return;
    const currentRows = tbody.querySelectorAll('tr').length;
    if (currentRows >= 37){
      alert('Solo se permiten hasta 37 medicamentos por formulario.');
      toggleAddMedicButton(true);
      return;
    }
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td class="medicamento-cell"></td>
        <td><input type="text" class="form-control" name="m_dosis"></td>
        <td><select class="form-select" name="m_intervalo"></select></td>
        <td><select class="form-select" name="m_via"></select></td>
        <td><input type="text" class="form-control form-control-sm" name="m_volumen"></td>
        <td><input type="date" class="form-control" name="m_fi"></td>
        <td>
            <button type="button" class="btn btn-danger btn-sm" onclick="removeRow(this)">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    tbody.appendChild(tr);
    ensureMedicamentoInput(tr);
    safePopulateMedicSelects(tr);
    toggleAddMedicButton();
}

function toggleAddMedicButton(forceHide=false){
  const btn = document.getElementById('addMedicRowBtn');
  if (!btn) return;
  const tbody = document.querySelector('#medicamentos tbody');
  const count = tbody?.querySelectorAll('tr').length || 0;
  const shouldHide = forceHide || count >= 37;
  btn.classList.toggle('d-none', shouldHide);
}

function sortArsenalList(list){
  const dir = arsenalState.sortDir === 'asc' ? 1 : -1;
  return [...list].sort((a,b)=>{
    if (arsenalState.sortBy === 'codigo'){
      const numA = parseInt(a.codigo,10);
      const numB = parseInt(b.codigo,10);
      const validNums = !Number.isNaN(numA) && !Number.isNaN(numB);
      if (validNums && numA !== numB){
        return numA > numB ? dir : -dir;
      }
      return ((a.codigo || '').localeCompare(b.codigo || '')) * dir;
    }
    return ((a.nombre || '').localeCompare(b.nombre || '')) * dir;
  });
}

function applyArsenalSortOrder(){
  arsenalState.lista = sortArsenalList(arsenalState.lista);
}

function updateArsenalSortIndicators(){
  document.querySelectorAll('.arsenal-sort').forEach(btn=>{
    const sortKey = btn.dataset.sort;
    const icon = btn.querySelector('i');
    if (!icon) return;
    icon.classList.remove('fa-sort', 'fa-sort-up', 'fa-sort-down');
    if (arsenalState.sortBy === sortKey){
      icon.classList.add(arsenalState.sortDir === 'asc' ? 'fa-sort-up' : 'fa-sort-down');
    } else {
      icon.classList.add('fa-sort');
    }
  });
}

// Si quieres reutilizarla fuera de la clase:
function readMedicamentosTo(p) {
  p.medicamentos = [];
  document.querySelectorAll('#medicamentos tbody tr').forEach(row => {
    const get = name => row.querySelector(`[name="${name}"]`)?.value || '';
    const input = row.querySelector('input[name="m_medicamento"]');
    let codigo = input?.dataset?.codigo || '';
    let nombre = input?.value || '';
    if (!codigo && nombre){
      const match = findMedicamentoByName(nombre);
      if (match){
        codigo = match.codigo || '';
        nombre = match.nombre || nombre;
      }
    }
    const fi      = get('m_fi');
    const volumen = get('m_volumen');
    const dosis   = get('m_dosis');
    const intervalo = get('m_intervalo');
    const via      = get('m_via');

    if (!codigo && !nombre) return;
    const nombreMedicamento = nombre || codigo;

    p.medicamentos.push({
      codigo:      codigo,
      medicamento: nombreMedicamento,
      dosis:       dosis,
      volumen:     volumen,
      fi:          fi,
      intervalo:   intervalo,
      via:         via,
      MEDICAMENTO: nombreMedicamento,
      DOSIS:       dosis,
      VOLUMEN:     volumen,
      FI:          fi,
      CODIGO:      codigo,
      INTERVALO:   intervalo
    });
  });
}

// =========================
// Exportaciones
// =========================
function postDownload(url, payload){
  // OJO: aquÃ­ ya NO llamamos readMedicamentosTo, para no pisar nada
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = url;
  form.style.display = 'none';
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = 'payload';
  input.value = JSON.stringify(payload);
  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

// Export que usa la plantilla 11.11.25.xlsx (multi-hoja)
function exportAll(){
  pacienteActual.cargarDesdeFormulario();
  pacienteActual.calcularTodo();
  const data = pacienteActual.getData();

  // Fecha general para la planilla (si tu export.php la usa)
  if (!data.fecha){
    data.fecha = data.fechaIngreso || '';
  }

  // Medicamentos en formato que export.php espera
  readMedicamentosTo(data);

  postDownload('export.php', data);
  setImportedState(false);
}

// Si sigues usando export_tpl.php (opcional)
function exportTpl(){
  pacienteActual.cargarDesdeFormulario();
  pacienteActual.calcularTodo();
  const data = pacienteActual.getData();
  readMedicamentosTo(data);
  postDownload('export_tpl.php', data);
}

// =========================
// Listeners
// =========================
['fechaNacimiento','fechaIngreso','sexo','peso','talla','crea'].forEach(id=>{
  const el=document.getElementById(id);
  if(el) el.addEventListener('change', calcularYActualizar);
});

document.getElementById('saveBtn')?.addEventListener('click', guardarDatos);
document.getElementById('newBtn')?.addEventListener('click', nuevoFormulario);
document.getElementById('exportBtn')?.addEventListener('click', exportAll);
document.getElementById('exportTplBtn')?.addEventListener('click', exportTpl);

const excelInput = document.getElementById('excelFileInput');
document.getElementById('loadBtn')?.addEventListener('click', ()=>{
  excelInput?.click();
});
excelInput?.addEventListener('change', e=>{
  const file = e.target.files?.[0];
  if (file){
    cargarExcelDesdeArchivo(file).finally(()=>{ e.target.value=''; });
  }
});

document.addEventListener('click', e=>{
  document.querySelectorAll('.medicamento-input-wrapper').forEach(wrapper=>{
    if (!wrapper.contains(e.target)){
      hideMedicamentoSuggestions(wrapper);
    }
  });
});

// =========================
// CRUD SelectConfig
// =========================
const configState = { data: {}, currentKey: '', editingIndex: -1 };
const arsenalState = {
  lista: Array.isArray(window.ArsenalCatalog?.medicamentos)
    ? [...window.ArsenalCatalog.medicamentos]
    : [],
  filtro: '',
  sortBy: 'nombre',
  sortDir: 'asc'
};
const adminAccessState = { granted: false, pendingAction: null, pendingRoles: null, user: null, timer: null };
const ADMIN_SESSION_KEY = 'adminAccessSession';

function cloneSelectConfig(){
  const source = window.SelectConfig || {};
  return JSON.parse(JSON.stringify(source));
}

function syncConfigState(){
  configState.data = cloneSelectConfig();
  const keys = Object.keys(configState.data);
  if (!keys.includes(configState.currentKey)){
    configState.currentKey = keys[0] || '';
  }
}

function renderConfigSelector(){
  const select = document.getElementById('configListSelector');
  if (!select) return;
  const keys = Object.keys(configState.data);
  const keyLabels = { sa: 'AS' };
  select.innerHTML = '';
  if (!keys.length){
    const opt = document.createElement('option');
    opt.value = '';
    opt.textContent = 'Sin listas disponibles';
    opt.disabled = true;
    opt.selected = true;
    select.appendChild(opt);
    return;
  }
  keys.forEach(key=>{
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = keyLabels[key] || key;
    if (key === configState.currentKey) opt.selected = true;
    select.appendChild(opt);
  });
}

function renderConfigTable(){
  const tbody = document.querySelector('#configOptionsTable tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  if (!configState.currentKey || !configState.data[configState.currentKey]){
    const tr = document.createElement('tr');
    tr.innerHTML = '<td colspan="4" class="text-center text-muted">Seleccione una lista</td>';
    tbody.appendChild(tr);
    return;
  }
  configState.data[configState.currentKey].forEach((item,index)=>{
    const tr = document.createElement('tr');
    const badges = [];
    if (item.disabled) badges.push('<span class="badge bg-secondary">Inactivo</span>');
    if (item.selected) badges.push('<span class="badge bg-warning text-dark">Por defecto</span>');
    tr.innerHTML = `
      <td>${item.value ?? ''}</td>
      <td>${item.label ?? ''}</td>
      <td>${badges.join(' ')}</td>
      <td>
        <div class="btn-group btn-group-sm">
          <button class="btn btn-outline-secondary" data-action="edit"><i class="fas fa-pen"></i></button>
          <button class="btn btn-outline-danger" data-action="remove"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    `;
    tr.querySelector('[data-action="edit"]').addEventListener('click',()=>openConfigOptionModal(index));
    tr.querySelector('[data-action="remove"]').addEventListener('click',()=>deleteConfigOption(index));
    tbody.appendChild(tr);
  });
}

function persistConfigChanges(){
  window.SelectConfig = JSON.parse(JSON.stringify(configState.data));
  configState.data = cloneSelectConfig();
  populateSelectsFromConfig();
}

async function sendCatalogToServer(target, data, successMessage, errorMessage){
  try {
    const response = await fetch('save_config.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target, data })
    });
    const text = await response.text();
    let result = {};
    try { result = JSON.parse(text); } catch(e){ result = {}; }
    if (!response.ok){
      const msg = result.error || text || `Error ${response.status}`;
      throw new Error(msg);
    }
    alert(result.message || successMessage);
  } catch(err){
    console.error(err);
    alert((errorMessage || 'No se pudo guardar la información')+'\n'+err.message);
  }
}

function openConfigModal(){
  syncConfigState();
  renderConfigSelector();
  renderConfigTable();
  const modalEl = document.getElementById('configModal');
  if (modalEl){
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
  }
}

function openConfigOptionModal(index=null){
  if (!configState.currentKey) return;
  const title = document.getElementById('configOptionModalLabel');
  const valueInput = document.getElementById('configOptionValue');
  const labelInput = document.getElementById('configOptionLabel');
  const disabledInput = document.getElementById('configOptionDisabled');
  const selectedInput = document.getElementById('configOptionSelected');
  configState.editingIndex = typeof index === 'number' ? index : -1;
  if (configState.editingIndex >= 0){
    const item = configState.data[configState.currentKey][configState.editingIndex];
    title.textContent = 'Editar elemento';
    valueInput.value = item.value ?? '';
    labelInput.value = item.label ?? '';
    disabledInput.checked = !!item.disabled;
    selectedInput.checked = !!item.selected;
  } else {
    title.textContent = 'Nuevo elemento';
    valueInput.value = '';
    labelInput.value = '';
    disabledInput.checked = false;
    selectedInput.checked = false;
  }
  const modalEl = document.getElementById('configOptionModal');
  if (modalEl){
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
  }
}

function saveConfigOption(){
  if (!configState.currentKey) return;
  const value = document.getElementById('configOptionValue')?.value?.trim() || '';
  const label = document.getElementById('configOptionLabel')?.value?.trim() || '';
  const disabled = document.getElementById('configOptionDisabled')?.checked || false;
  const selected = document.getElementById('configOptionSelected')?.checked || false;
  if (!label){
    alert('Ingrese una etiqueta');
    return;
  }
  const list = configState.data[configState.currentKey] || [];
  if (selected){
    list.forEach((item, idx)=>{
      if (idx !== configState.editingIndex){
        item.selected = false;
      }
    });
  }
  const record = { value, label, disabled, selected };
  if (configState.editingIndex >= 0){
    list[configState.editingIndex] = record;
  } else {
    list.push(record);
  }
  configState.data[configState.currentKey] = list;
  persistConfigChanges();
  renderConfigTable();
  document.getElementById('configSaveOptionBtn')?.blur();
  const optionModal = document.getElementById('configOptionModal');
  bootstrap.Modal.getOrCreateInstance(optionModal).hide();
  optionModal?.addEventListener('hidden.bs.modal',()=>{
    document.getElementById('configAddOptionBtn')?.focus();
  }, { once: true });
}

function deleteConfigOption(index){
  if (!configState.currentKey) return;
  if (!confirm('Â¿Eliminar este elemento?')) return;
  const list = configState.data[configState.currentKey] || [];
  list.splice(index,1);
  configState.data[configState.currentKey] = list;
  persistConfigChanges();
  renderConfigTable();
}

async function saveConfigToServer(){
  persistConfigChanges();
  await sendCatalogToServer(
    'config',
    window.SelectConfig || {},
    'Listas guardadas en config.js',
    'No se pudieron guardar las listas'
  );
  const modalEl = document.getElementById('configModal');
  if (modalEl){
    bootstrap.Modal.getOrCreateInstance(modalEl).hide();
  }
}

async function saveArsenalToServer(){
  updateMedicamentoCache();
  await sendCatalogToServer(
    'arsenal',
    arsenalState.lista || [],
    'Catálogo guardado en arsenal.js',
    'No se pudo guardar el catálogo'
  );
  const modalEl = document.getElementById('arsenalModal');
  if (modalEl){
    bootstrap.Modal.getOrCreateInstance(modalEl).hide();
  }
}

function renderArsenalTable(){
  const tbody = document.querySelector('#arsenalTable tbody');
  if (!tbody) return;
  const term = (arsenalState.filtro || '').toLowerCase();
  tbody.innerHTML = '';
  const filtered = arsenalState.lista.filter(item => {
    if (!term) return true;
    return (item.codigo || '').toLowerCase().includes(term) || (item.nombre || '').toLowerCase().includes(term);
  });
  const sorted = sortArsenalList(filtered);
  sorted.forEach(item=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="fw-semibold">${item.codigo || ''}</td>
        <td>${item.nombre || ''}</td>
        <td>
          <div class="btn-group btn-group-sm">
            <button class="btn btn-outline-secondary" data-action="edit"><i class="fas fa-pen"></i></button>
            <button class="btn btn-outline-danger" data-action="remove"><i class="fas fa-trash"></i></button>
          </div>
        </td>
      `;
      tr.querySelector('[data-action="edit"]').addEventListener('click',()=>openArsenalForm(item));
      tr.querySelector('[data-action="remove"]').addEventListener('click',()=>removeArsenalItem(item.codigo));
      tbody.appendChild(tr);
    });
  updateArsenalSortIndicators();
}

function openArsenalForm(item=null){
  const title = document.getElementById('arsenalFormModalLabel');
  const codigo = document.getElementById('arsenalCodigo');
  const nombre = document.getElementById('arsenalNombre');
  if (item){
    if (title) title.textContent = 'Editar medicamento';
    if (codigo){
      codigo.value = item.codigo || '';
      codigo.dataset.original = item.codigo || '';
    }
    if (nombre) nombre.value = item.nombre || '';
  } else {
    if (title) title.textContent = 'Nuevo medicamento';
    if (codigo){
      codigo.value = '';
      delete codigo.dataset.original;
    }
    if (nombre) nombre.value = '';
  }
  const modalEl = document.getElementById('arsenalFormModal');
  if (modalEl){
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
  }
}

function saveArsenalForm(){
  const codigoInput = document.getElementById('arsenalCodigo');
  const nombreInput = document.getElementById('arsenalNombre');
  const codigo = (codigoInput?.value || '').trim();
  const nombre = (nombreInput?.value || '').trim();
  if (!codigo || !nombre){
    alert('Complete cï¿½digo y nombre.');
    return;
  }
  const original = codigoInput?.dataset?.original || codigo;
  const exists = arsenalState.lista.find(item => item.codigo === original);
  if (exists){
    exists.codigo = codigo;
    exists.nombre = nombre;
  } else {
    arsenalState.lista.push({ codigo, nombre });
  }
  codigoInput?.removeAttribute('data-original');
  renderArsenalTable();
  updateMedicamentoCache();
  bootstrap.Modal.getOrCreateInstance(document.getElementById('arsenalFormModal')).hide();
}

function removeArsenalItem(codigo){
  if (!confirm('ï¿½Eliminar este medicamento?')) return;
  arsenalState.lista = arsenalState.lista.filter(item => item.codigo !== codigo);
  renderArsenalTable();
  updateMedicamentoCache();
}

function updateMedicamentoCache(){
  applyArsenalSortOrder();
  window.ArsenalCatalog.medicamentos = [...arsenalState.lista];
  refreshMedicamentoInputs();
}

function refreshMedicamentoInputs(){
  document.querySelectorAll('#medicamentos input[name="m_medicamento"]').forEach(input=>{
    const current = (input.value || '').trim();
    if (!current) return;
    const match = findMedicamentoByName(current);
    if (match){
      setMedicamentoInputValue(input, match.codigo, match.nombre);
    }
  });
}

function openArsenalModal(){
  renderArsenalTable();
  const modalEl = document.getElementById('arsenalModal');
  if (modalEl){
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
  }
}

// =========================
// Control de acceso admin
// =========================
async function authenticateAdmin(username, password){
  const resp = await fetch('usuarios/usuarios_control.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'login', username, password })
  });
  const data = await resp.json();
  if (!resp.ok || !data.success){
    throw new Error(data.error || 'Credenciales incorrectas');
  }
  return data;
}

function requireAdminAccess(action, allowedRoles = ['admin']){
  const normalizedRoles = Array.isArray(allowedRoles) && allowedRoles.length
    ? allowedRoles.map(r => (r || '').toLowerCase())
    : null;
  const hasRole = () => {
    if (!normalizedRoles) return true;
    const role = (adminAccessState.user?.rol || '').toLowerCase();
    return normalizedRoles.includes(role);
  };
  if (adminAccessState.granted){
    if (!hasRole()){
      alert('No tiene permisos para esta acción.');
      return;
    }
    adminAccessState.pendingAction = null;
    adminAccessState.pendingRoles = null;
    action?.();
    return;
  }
  adminAccessState.pendingAction = action;
  adminAccessState.pendingRoles = normalizedRoles;
  openAdminAccessModal();
}

function openAdminAccessModal(){
  const modalEl = document.getElementById('adminAccessModal');
  if (!modalEl){
    alert('No se puede validar el acceso de administrador.');
    return;
  }
  document.getElementById('adminAccessError')?.classList.add('d-none');
  document.getElementById('adminAccessForm')?.reset();
  const modal = window.bootstrap?.Modal?.getOrCreateInstance(modalEl);
  if (modal){
    modal.show();
  } else {
    modalEl.classList.add('show');
    modalEl.style.display = 'block';
  }
  setTimeout(()=>document.getElementById('adminUser')?.focus(), 150);
}

async function handleAdminAccessSubmit(e){
  e?.preventDefault?.();
  const user = document.getElementById('adminUser')?.value?.trim() || '';
  const pass = document.getElementById('adminPass')?.value || '';
  const error = document.getElementById('adminAccessError');
  const submitBtn = document.getElementById('adminAccessSubmit');
  error?.classList.add('d-none');
  if (!user || !pass){
    error?.classList.remove('d-none');
    if (error) error.textContent = 'Ingrese usuario y contraseña';
    return;
  }
  submitBtn?.setAttribute('disabled', 'disabled');
  try {
    const data = await authenticateAdmin(user, pass);
    adminAccessState.granted = true;
    adminAccessState.user = data.user || null;
    const role = (adminAccessState.user?.rol || '').toLowerCase();
    const pendingRoles = adminAccessState.pendingRoles;
    if (pendingRoles && pendingRoles.length && !pendingRoles.includes(role)){
      error?.classList.remove('d-none');
      if (error) error.textContent = 'Su rol no tiene permisos para esta acción.';
      adminAccessState.granted = false;
      adminAccessState.user = null;
      adminAccessState.pendingAction = null;
      adminAccessState.pendingRoles = null;
      persistAdminSession();
      updateSessionUI();
      return;
    }
    scheduleAdminAutoLogout();
    const modalEl = document.getElementById('adminAccessModal');
    const modal = window.bootstrap?.Modal?.getOrCreateInstance(modalEl);
    if (modal){
      modal.hide();
    } else if (modalEl){
      modalEl.classList.remove('show');
      modalEl.style.display = 'none';
    }
    const action = adminAccessState.pendingAction;
    adminAccessState.pendingAction = null;
    adminAccessState.pendingRoles = null;
    persistAdminSession();
    updateSessionUI();
    action?.();
  } catch(err){
    error?.classList.remove('d-none');
    if (error) error.textContent = err.message || 'Usuario o contraseña incorrectos';
    document.getElementById('adminPass')?.focus();
  } finally {
    submitBtn?.removeAttribute('disabled');
  }
}

function persistAdminSession(){
  try {
    if (adminAccessState.granted && adminAccessState.user){
      const payload = {
        user: adminAccessState.user,
        timestamp: Date.now()
      };
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(payload));
    } else {
      localStorage.removeItem(ADMIN_SESSION_KEY);
    }
  } catch(err){
    console.warn('No se pudo guardar la sesión:', err);
  }
}

function restoreAdminSession(){
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (data?.user){
      adminAccessState.granted = true;
      adminAccessState.user = data.user;
    }
  } catch(err){
    console.warn('No se pudo restaurar la sesión:', err);
  }
  updateSessionUI();
}

function updateSessionUI(){
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn){
    logoutBtn.classList.toggle('d-none', !adminAccessState.granted);
  }
  if (adminAccessState.granted){
    scheduleAdminAutoLogout();
  }
}

function logoutAdmin(){
  adminAccessState.granted = false;
  adminAccessState.user = null;
  adminAccessState.pendingAction = null;
  adminAccessState.pendingRoles = null;
  clearTimeout(adminAccessState.timer);
  persistAdminSession();
  updateSessionUI();
  closeMaintainerMenu();
}

function scheduleAdminAutoLogout(){
  clearTimeout(adminAccessState.timer);
  const FIVE_MIN = 5 * 60 * 1000;
  adminAccessState.timer = setTimeout(()=>logoutAdmin(), FIVE_MIN);
}

function openMaintainerMenu(){
  const modalEl = document.getElementById('maintainerModal');
  if (!modalEl){
    alert('No se encontró el módulo de mantenedor.');
    return;
  }
  const role = (adminAccessState.user?.rol || '').toLowerCase();
  const usersBtn = document.getElementById('maintainerUsersBtn');
  if (usersBtn){
    usersBtn.classList.toggle('d-none', role !== 'admin');
  }
  bootstrap.Modal.getOrCreateInstance(modalEl).show();
}

function closeMaintainerMenu(){
  const modalEl = document.getElementById('maintainerModal');
  if (modalEl){
    bootstrap.Modal.getOrCreateInstance(modalEl).hide();
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  restoreAdminSession();
  updateSessionUI();
  document.getElementById('logoutBtn')?.addEventListener('click', logoutAdmin);
  document.getElementById('openMaintainerBtn')?.addEventListener('click', ()=>requireAdminAccess(openMaintainerMenu, ['admin','editor']));
  document.getElementById('arsenalAddBtn')?.addEventListener('click', ()=>openArsenalForm());
  document.getElementById('arsenalSaveBtn')?.addEventListener('click', saveArsenalForm);
  document.getElementById('arsenalSaveFileBtn')?.addEventListener('click', saveArsenalToServer);
  document.getElementById('arsenalSearch')?.addEventListener('input', e=>{
    arsenalState.filtro = e.target.value || '';
    renderArsenalTable();
  });
  document.getElementById('configAddOptionBtn')?.addEventListener('click', ()=>openConfigOptionModal());
  document.getElementById('configSaveOptionBtn')?.addEventListener('click', saveConfigOption);
  document.getElementById('configSaveFileBtn')?.addEventListener('click', saveConfigToServer);
  document.getElementById('configListSelector')?.addEventListener('change', e=>{
    configState.currentKey = e.target.value;
    renderConfigTable();
  });
  document.getElementById('adminAccessForm')?.addEventListener('submit', handleAdminAccessSubmit);
  document.getElementById('maintainerUsersBtn')?.addEventListener('click', ()=>{
    closeMaintainerMenu();
    const win = window.open('usuarios/usuarios.php', '_blank', 'noopener');
    if (!win){
      window.location.href = 'usuarios/usuarios.php';
    }
  });
  document.getElementById('maintainerArsenalBtn')?.addEventListener('click', ()=>{
    closeMaintainerMenu();
    openArsenalModal();
  });
  document.getElementById('maintainerConfigBtn')?.addEventListener('click', ()=>{
    closeMaintainerMenu();
    openConfigModal();
  });
  document.querySelectorAll('.arsenal-sort').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const sortKey = btn.dataset.sort;
      if (!sortKey) return;
      if (arsenalState.sortBy === sortKey){
        arsenalState.sortDir = arsenalState.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        arsenalState.sortBy = sortKey;
        arsenalState.sortDir = 'asc';
      }
      renderArsenalTable();
    });
  });

  populateSelectsFromConfig();
  const hoy = new Date();
  document.getElementById('fecha').value = hoy.toISOString().split('T')[0];
  document.getElementById('fechaIngreso').value = '';
  const fechaRecetaEl = document.getElementById('fechaReceta');
  if (fechaRecetaEl) {
    fechaRecetaEl.value = hoy.toISOString().split('T')[0];
  }
  document.getElementById('hora').value = hoy.toTimeString().substring(0,5);
  setImportedState(false);
  document.getElementById('fecha')?.addEventListener('change', syncFechaReceta);
  document.getElementById('fecha')?.addEventListener('input', syncFechaReceta);
  document.getElementById('rut')?.addEventListener('input', handleRutInput);
  document.getElementById('rut')?.addEventListener('blur', handleRutInput);
  document.getElementById('hospitalizacionForm')?.addEventListener('reset', ()=>{
    setTimeout(()=>{
      const tbody = document.querySelector('#medicamentos tbody');
      if (tbody){
        tbody.innerHTML = '';
        addRowMedic();
      }
      clearTablaRecetas();
    },0);
  });
  syncFechaReceta();

  const tbody = document.querySelector('#medicamentos tbody');
  if (tbody){
    if (!tbody.querySelector('tr')){
      addRowMedic();
    } else {
      tbody.querySelectorAll('tr').forEach(tr=>ensureMedicamentoInput(tr));
    }
  }
  toggleAddMedicButton();

  renderArsenalTable();
});
