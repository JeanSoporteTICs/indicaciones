<?php
// index.php: Formulario sin base de datos, cálculos en front y exportación a plantilla por POST.
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Hospitalización</title>
    <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
    <link rel="shortcut icon" href="assets/favicon.svg">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="assets/css/custom.css">
</head>
<body class="peds-bg">
    <div class="app-shell d-flex flex-column min-vh-100">
        <main class="flex-fill d-flex flex-column">
            <header class="site-header text-white shadow-sm mb-4">
                <div class="header-glow"></div>
                <div class="container text-center">
                    <h1 class="h3 mb-1"><i class="fas fa-hospital me-2"></i>Indicaciones Médicas Pediátrica</h1>
                    <p class="lead mb-1">Hospital Base Valdivia</p>
                    <p class="site-tagline mb-0">Planifica y exporta indicaciones con claridad y rapidez</p>
                </div>
            </header>

            <div class="container-fluid px-3 pb-0 flex-fill">
                <div class="form-shell mx-auto w-100 layered-panel column-stack">
                    <div class="floating-pill"></div>
                    <div class="floating-pill"></div>
                    <div class="floating-pill"></div>
                    <div class="card border-0 shadow-sm mb-4">
            <div class="card-body">
                <div class="row g-3 align-items-center">
                    <div class="col-12 col-lg-4">
                        <div class="d-grid gap-2">
                            <button class="btn btn-primary btn-glow" type="button" id="loadBtn">
                                <i class="fas fa-file-import me-1"></i> Cargar
                            </button>
                            <button class="btn btn-outline-secondary" type="button" id="newBtn">
                                <i class="fas fa-file me-1"></i> Nuevo
                            </button>
                        </div>
                    </div>
                    <div class="col-12 col-lg-8">
                        <div class="d-flex flex-column flex-md-row gap-2">
                            <button class="btn btn-warning flex-fill btn-glow" id="exportBtn">
                                <i class="fas fa-file-export me-1"></i> Exportar planilla
                            </button>
                            <button class="btn btn-outline-dark flex-fill" type="button" id="openMaintainerBtn">
                                <i class="fas fa-toolbox me-1"></i> Mantenedor
                            </button>
                            <button class="btn btn-outline-danger flex-fill d-none" type="button" id="logoutBtn">
                                <i class="fas fa-door-open me-1"></i> Cerrar sesión
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <input type="file" id="excelFileInput" class="d-none" accept=".xlsx,.xls,.xlsm">
        </div>

        <form id="hospitalizacionForm" class="mb-4">
            <!-- Datos Básicos -->
            <div class="card shadow-sm mb-4 medicamentos-card">
                <div class="card-header">
                    <i class="fas fa-info-circle me-2"></i>Datos Básicos del Paciente
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-3">
                            <div class="form-group mb-3">
                                <label class="required-field">Fecha</label>
                                <input type="date" class="form-control" id="fecha" required>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group mb-3">
                                <label class="required-field">Fecha de Ingreso</label>
                                <input type="date" class="form-control" id="fechaIngreso" required>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group mb-3">
                                <label class="required-field">Fecha de Nacimiento</label>
                                <input type="date" class="form-control" id="fechaNacimiento" required>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group mb-3">
                                <label>Hora</label>
                                <input type="time" class="form-control" id="hora">
                            </div>
                        </div>
                    </div>
                    <input type="hidden" id="fechaReceta" name="fechaReceta">

                    <div class="row">
                        <div class="col-md-3">
                            <div class="form-group mb-3">
                                <label>Edad</label>
                                <input type="text" class="form-control calculated-field" id="edad" readonly>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group mb-3">
                                <label>Días Hosp.</label>
                                <input type="text" class="form-control calculated-field" id="diasHospitalizacion" readonly>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group mb-3">
                                <label class="required-field">Cama</label>
                                <select class="form-select" id="cama" required></select>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group mb-3">
                                <label class="required-field">Sexo</label>
                                <select class="form-select" id="sexo" required></select>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12">
                            <div class="form-group mb-3">
                                <label class="required-field">Nombre del Paciente</label>
                                <input type="text" class="form-control" id="nombrePaciente" required>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-4">
                            <div class="form-group mb-3">
                                <label class="required-field">RUT</label>
                                <input type="text" class="form-control" id="rut" required placeholder="12.345.678-9">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group mb-3">
                                <label class="required-field">Ficha</label>
                                <input type="text" class="form-control" id="ficha" required>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group mb-3">
                                <label class="required-field">Médico Responsable</label>
                                <input type="text" class="form-control" id="medicoResponsable" required>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group mb-3">
                                <label>Diagnóstico</label>
                                <textarea class="form-control" id="diagnostico" rows="2"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Antropométricos -->
            <div class="card">
                <div class="card-header">
                    <i class="fas fa-weight me-2"></i>Datos Antropométricos
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-3">
                            <div class="form-group mb-3">
                                <label class="required-field">Peso (kg)</label>
                                <input type="number" class="form-control" id="peso" step="0.1" required>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group mb-3">
                                <label class="required-field">Talla (cm)</label>
                                <input type="number" class="form-control" id="talla" step="0.1" required>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group mb-3">
                                <label>Peso Ideal</label>
                                <input type="text" class="form-control calculated-field" id="pesoIdeal" readonly>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group mb-3">
                                <label>SC T/M2</label>
                                <input type="text" class="form-control calculated-field" id="sctm2" readonly>
                                <small class="form-text text-muted">Superficie Corporal (Mosteller)</small>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-3">
                            <div class="form-group mb-3">
                                <label>Volumen Holliday</label>
                                <input type="text" class="form-control calculated-field" id="volumenHolliday" readonly>
                                <small class="form-text text-muted">Mantenimiento de líquidos (pediátrico)</small>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group mb-3">
                                <label>Volumen *SC</label>
                                <input type="text" class="form-control calculated-field" id="volumenSC" readonly>
                                <small class="form-text text-muted">1500 mL × SC</small>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group mb-3">
                                <label>CREA</label>
                                <input type="number" class="form-control" id="crea" step="0.01">
                                <small class="form-text text-muted">Creatinina (mg/dL)</small>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group mb-3">
                                <label>VFG</label>
                                <input type="text" class="form-control calculated-field" id="vfg" readonly>
                                <small class="form-text text-muted">Tasa de filtración glomerular</small>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-3">
                            <div class="form-group mb-3">
                                <label>60% HOLLIDAY</label>
                                <input type="text" class="form-control calculated-field" id="60Holliday" readonly>
                                <small class="form-text text-muted">0,6 × Volumen Holliday</small>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group mb-3">
                                <label>REB</label>
                                <input type="text" class="form-control calculated-field" id="reb" readonly>
                                <small class="form-text text-muted">Requerimiento Energético en Reposo</small>
                            </div>
                        </div>
                        <div class="col-md-6 d-none d-md-block"></div>
                    </div>
                </div>
            </div>

            <!-- Indiciaciones Medicas -->
            <div class="card">
                <div class="card-header">
                    <i class="fas fa-notes-medical me-2"></i>Indiciaciones Medicas
                </div>
                <div class="card-body">
                    <div class="row mb-3">
                        <div class="col-md-12">
                            <div class="checkbox-group">
                                <div class="checkbox-item">
                                    <input class="form-check-input" type="checkbox" id="reposo">
                                    <label class="form-check-label ms-2" for="reposo">Reposo</label>
                                </div>
                                <div class="checkbox-item">
                                    <input class="form-check-input" type="checkbox" id="la">
                                    <label class="form-check-label ms-2" for="la">LA</label>
                                </div>
                                <div class="checkbox-item">
                                    <input class="form-check-input" type="checkbox" id="sng">
                                    <label class="form-check-label ms-2" for="sng">SNG</label>
                                </div>
                                <div class="checkbox-item">
                                    <input class="form-check-input" type="checkbox" id="sf">
                                    <label class="form-check-label ms-2" for="sf">SF</label>
                                </div>
                                <div class="checkbox-item">
                                    <input class="form-check-input" type="checkbox" id="cvc">
                                    <label class="form-check-label ms-2" for="cvc">CVC</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-3">
                            <div class="form-group mb-3">
                                <label>Aislamiento</label>
                                <select class="form-select" id="aislamiento"></select>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group mb-3">
                                <label>DU</label>
                                <select class="form-select" id="du"></select>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group mb-3">
                                <label>VM</label>
                                <select class="form-select" id="vm"></select>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group mb-3">
                                <label>ESC</label>
                                <select class="form-select" id="esc"></select>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <div class="form-group mb-3">
                                <label>Regimen</label>
                                <input type="text" class="form-control" id="regimen" placeholder="Ingresar regimen">
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-9">
                            <div class="form-group mb-3">
                                <label>Flebos</label>
                                <select class="form-select" id="flebos"></select>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group mb-3">
                                <label>BH</label>
                                <select class="form-select" id="bh"></select>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-3">
                            <div class="form-group mb-3">
                                <label>RASS</label>
                                <select class="form-select" id="rass"></select>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group mb-3">
                                <label>BIS</label>
                                <select class="form-select" id="bis"></select>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group mb-3">
                                <label>TOF</label>
                                <select class="form-select" id="tof"></select>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group mb-3">
                                <label>AS</label>
                                <select class="form-select" id="sa"></select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Medicamentos (única) -->
            <div class="card shadow-sm mb-4 medicamentos-card">
                <div class="card-header">
                    <i class="fas fa-pills me-2"></i>Medicamentos
                </div>
                <div class="card-body">
                                        <table class="table table-bordered medicamento-table" id="medicamentos">
                        <thead>
                            <tr>
                                <th width="40%">Medicamento</th>
                                <th width="15%">Dosis</th>
                                <th width="15%">Intervalo</th>
                                <th width="15%">Vía</th>
                                <th width="10%">Volumen</th>
                                <th width="10%">Fecha Indicación</th>
                                <th width="5%">Acción</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                    <button type="button" class="btn btn-secondary btn-sm" onclick="addRowMedic()" id="addMedicRowBtn">
                        <i class="fas fa-plus me-1"></i> Agregar Fila
                    </button>
                </div>
            </div>

        </form>
            </div>
            <footer class="text-center py-2">
                <small class="text-muted">Desarrollado por JCL</small>
            </footer>
        </main>
    </div>

<div class="modal fade" id="arsenalModal" tabindex="-1" aria-labelledby="arsenalModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-xl modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="arsenalModalLabel"><i class="fas fa-capsules me-2"></i>Catálogo de Arsenal</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>
      <div class="modal-body">
        <div class="arsenal-toolbar d-flex flex-column flex-md-row gap-2 mb-3">
          <div class="input-group">
            <span class="input-group-text"><i class="fas fa-search"></i></span>
            <input type="search" class="form-control" id="arsenalSearch" placeholder="Buscar por código o nombre">
          </div>
          <button class="btn btn-success" type="button" id="arsenalAddBtn">
            <i class="fas fa-plus me-1"></i> Nuevo
          </button>
        </div>
        <div class="table-responsive">
          <table class="table table-striped align-middle" id="arsenalTable">
            <thead>
              <tr>
                <th style="width:150px">
                  <button type="button" class="btn btn-link btn-sm text-decoration-none p-0 d-inline-flex align-items-center arsenal-sort" data-sort="codigo">
                    <span class="fw-semibold me-1">Código</span>
                    <i class="fas fa-sort"></i>
                  </button>
                </th>
                <th>
                  <button type="button" class="btn btn-link btn-sm text-decoration-none p-0 d-inline-flex align-items-center arsenal-sort" data-sort="nombre">
                    <span class="fw-semibold me-1">Nombre</span>
                    <i class="fas fa-sort"></i>
                  </button>
                </th>
                <th style="width:150px">Acciones</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        <button type="button" class="btn btn-primary" id="arsenalSaveFileBtn">
          <i class="fas fa-save me-1"></i> Guardar en archivo
        </button>
      </div>
    </div>
  </div>
</div>
<div class="modal fade" id="arsenalFormModal" tabindex="-1" aria-labelledby="arsenalFormModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="arsenalFormModalLabel">Medicamento</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>
      <div class="modal-body">
        <form id="arsenalForm">
          <div class="mb-3">
            <label class="form-label">Código</label>
            <input type="text" class="form-control" id="arsenalCodigo" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Nombre</label>
            <textarea class="form-control" id="arsenalNombre" rows="2" required></textarea>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button type="button" class="btn btn-primary" id="arsenalSaveBtn">
          <i class="fas fa-save me-1"></i> Guardar
        </button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="configModal" tabindex="-1" aria-labelledby="configModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-xl modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="configModalLabel"><i class="fas fa-sliders-h me-2"></i>Listas desplegables</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>
      <div class="modal-body">
        <div class="d-flex flex-column flex-md-row gap-3 mb-3">
          <div class="flex-fill">
            <label class="form-label">Seleccione lista</label>
            <select class="form-select" id="configListSelector"></select>
          </div>
          <div class="flex-shrink-0 align-self-end">
            <button class="btn btn-success" type="button" id="configAddOptionBtn">
              <i class="fas fa-plus me-1"></i> Nuevo elemento
            </button>
          </div>
        </div>
        <div class="table-responsive">
          <table class="table table-striped align-middle" id="configOptionsTable">
            <thead>
              <tr>
                <th style="width:25%">Valor</th>
                <th>Etiqueta</th>
                <th style="width:120px">Estado</th>
                <th style="width:120px">Acciones</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        <button type="button" class="btn btn-primary" id="configSaveFileBtn">
          <i class="fas fa-save me-1"></i> Guardar en archivo
        </button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="configOptionModal" tabindex="-1" aria-labelledby="configOptionModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="configOptionModalLabel">Elemento</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>
      <div class="modal-body">
        <form id="configOptionForm">
          <div class="mb-3">
            <label class="form-label">Valor</label>
            <input type="text" class="form-control" id="configOptionValue" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Etiqueta para mostrar</label>
            <input type="text" class="form-control" id="configOptionLabel" required>
          </div>
          <div class="form-check form-switch mb-2">
            <input class="form-check-input" type="checkbox" id="configOptionDisabled">
            <label class="form-check-label" for="configOptionDisabled">Deshabilitado</label>
          </div>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="configOptionSelected">
            <label class="form-check-label" for="configOptionSelected">Seleccionado por defecto</label>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button type="button" class="btn btn-primary" id="configSaveOptionBtn">
          <i class="fas fa-save me-1"></i> Guardar
        </button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="maintainerModal" tabindex="-1" aria-labelledby="maintainerModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="maintainerModalLabel"><i class="fas fa-toolbox me-2"></i>Mantenedor</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>
      <div class="modal-body">
        <p class="text-muted small mb-3">Seleccione una opción para administrar catálogos o usuarios.</p>
        <div class="d-grid gap-2">
          <button type="button" class="btn btn-outline-dark d-none" id="maintainerUsersBtn">
            <i class="fas fa-users me-1"></i> Gestionar usuarios
          </button>
          <button type="button" class="btn btn-outline-primary" id="maintainerArsenalBtn">
            <i class="fas fa-capsules me-1"></i> Administrar arsenal
          </button>
          <button type="button" class="btn btn-outline-success" id="maintainerConfigBtn">
            <i class="fas fa-sliders-h me-1"></i> Configurar listas
          </button>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="adminAccessModal" tabindex="-1" aria-labelledby="adminAccessModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="adminAccessModalLabel">Acceso restringido</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>
      <div class="modal-body">
        <div class="alert alert-danger d-none" id="adminAccessError">Usuario o contraseña incorrectos</div>
        <form id="adminAccessForm">
          <div class="mb-3">
            <label for="adminUser" class="form-label">Usuario</label>
            <input type="text" class="form-control" id="adminUser" autocomplete="username" required>
          </div>
          <div class="mb-3">
            <label for="adminPass" class="form-label">Contraseña</label>
            <input type="password" class="form-control" id="adminPass" autocomplete="current-password" required>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button type="submit" class="btn btn-primary" id="adminAccessSubmit" form="adminAccessForm">
          <i class="fas fa-lock-open me-1"></i> Acceder
        </button>
      </div>
    </div>
  </div>
</div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="assets/js/config.js"></script>
<script src="assets/js/arsenal.js"></script>
    <script src="assets/js/app.js"></script>
</body>
</html>


