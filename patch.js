*** Begin Patch
*** Update File: assets/js/app.js
@@
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
+
+function handleRutInput(){
+  const input = document.getElementById('rut');
+  if (!input) return;
+  let value = (input.value || '').toUpperCase();
+  value = value.replace(/[^0-9Kk]/g,'');
+  const rutRegex = /^([0-9]{1,3})([0-9]{3})([0-9]{3})([0-9K])$/;
+  const rutRegexShort = /^([0-9]+)([0-9K])$/;
+  if (rutRegex.test(value)){
+    const [,g1,g2,g3,g4] = value.match(rutRegex);
+    input.value = ${parseInt(g1,10).toLocaleString('es-CL')} .replace(/,/,'.').-;
+  } else if (rutRegexShort.test(value)){
+    const [,body,dv] = value.match(rutRegexShort);
+    const formattedBody = parseInt(body,10).toLocaleString('es-CL').replace(/,/g,'.');
+    input.value = ${formattedBody}-;
+  } else {
+    input.value = value;
+  }
+}
@@
   document.getElementById('fechaReceta').value = hoy.toISOString().split('T')[0];
   document.getElementById('hora').value = hoy.toTimeString().substring(0,5);
   setImportedState(false);
   document.getElementById('fecha')?.addEventListener('change', syncFechaReceta);
-  document.getElementById('fecha')?.addEventListener('input', syncFechaReceta);
+  document.getElementById('fecha')?.addEventListener('input', syncFechaReceta);
+  document.getElementById('rut')?.addEventListener('input', handleRutInput);
+  document.getElementById('rut')?.addEventListener('blur', handleRutInput);
*** End Patch

