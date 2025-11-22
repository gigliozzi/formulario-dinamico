// Utilities: simple mustache-style template renderer with helpers
function escapeHTML(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function digitsOnly(s) {
  return String(s == null ? '' : s).replace(/\D/g, '');
}

function maskCPF(value) {
  let v = digitsOnly(value).slice(0, 11);
  if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2}).*/, '$1.$2.$3-$4');
  else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{1,3}).*/, '$1.$2.$3');
  else if (v.length > 3) v = v.replace(/(\d{3})(\d{1,3}).*/, '$1.$2');
  return v;
}

function maskCNPJ(value) {
  let v = digitsOnly(value).slice(0, 14);
  if (v.length > 12) v = v.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2}).*/, '$1.$2.$3/$4-$5');
  else if (v.length > 8) v = v.replace(/(\d{2})(\d{3})(\d{3})(\d{1,4}).*/, '$1.$2.$3/$4');
  else if (v.length > 5) v = v.replace(/(\d{2})(\d{3})(\d{1,3}).*/, '$1.$2.$3');
  else if (v.length > 2) v = v.replace(/(\d{2})(\d{1,3}).*/, '$1.$2');
  return v;
}

function isCurrencyKey(k) {
  const key = String(k || '').toLowerCase();
  if (/extenso|por_extenso/.test(key)) return false; // não mascarar "valor_extenso"
  return /(valor|preco|preço|brl|reais|montante)/.test(key);
}

function isDateKey(k) {
  const key = String(k || '').toLowerCase();
  return /(data|venc|vencimento|date)/.test(key);
}

function maskBRL(value) {
  const digits = digitsOnly(value);
  if (!digits) return '';
  const number = Number(digits) / 100;
  try {
    return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  } catch {
    // fallback manual
    const parts = number.toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return 'R$ ' + parts[0] + ',' + parts[1];
  }
}

function formatValue(key, value) {
  if (value == null) return '';
  const k = String(key || '').toLowerCase();
  if (k.includes('cnpj')) return escapeHTML(maskCNPJ(value));
  if (k.includes('cpf')) return escapeHTML(maskCPF(value));
  if (isCurrencyKey(k)) return escapeHTML(maskBRL(value));
  if (isDateKey(k) && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split('-');
    return `${d}/${m}/${y}`;
  }
  return escapeHTML(value);
}

function checkBoxMarkup(checked) {
  return `<span class="box${checked ? ' checked' : ''}"></span>`;
}

function formatDateBR(dateStr) {
  if (!dateStr) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  }
  return escapeHTML(dateStr);
}

function genParcelasRows(data) {
  const arr = Array.isArray(data?.parcelas) ? data.parcelas : [];
  if (!arr.length) return `<tr><td colspan="3" style="padding:6px; color:#64748b;">Nenhuma parcela definida.</td></tr>`;
  return arr.map((p, i) => {
    const venc = formatDateBR(p?.venc || '');
    const valor = maskBRL(p?.valor || '');
    return `<tr>
      <td style="padding:4px;">${i + 1}ª</td>
      <td style="padding:4px;">${venc}</td>
      <td style="padding:4px;">${valor}</td>
    </tr>`;
  }).join('');
}

// Renders previewHTML replacing tokens with data
function renderTemplate(html, data) {
  if (!html) return '';

  // Conditional blocks: {{#if:key|value}} ... {{/if}}
  html = html.replace(/{{\s*#if:([\w-]+)\|([\w-]+)\s*}}([\s\S]*?){{\s*\/if\s*}}/g, (m, key, val, inner) => {
    return String(data[key]) === val ? inner : '';
  });

  // Checkbox helper: {{#check:fieldId}}
  html = html.replace(/{{\s*#check:([\w-]+)\s*}}/g, (m, key) => {
    return checkBoxMarkup(!!data[key]);
  });

  // Radio helper: {{#radio:group|value}}
  html = html.replace(/{{\s*#radio:([\w-]+)\|([\w-]+)\s*}}/g, (m, group, val) => {
    return checkBoxMarkup(String(data[group]) === val);
  });

  // Parcelas rows helper: {{parcelas_rows}}
  html = html.replace(/{{\s*parcelas_rows\s*}}/g, () => genParcelasRows(data));

  // Simple tokens: {{field}}
  html = html.replace(/{{\s*([\w-]+)\s*}}/g, (m, key) => {
    return formatValue(key, data[key]);
  });

  return html;
}

function createInitialData(template) {
  const data = {};
  (template?.fields || []).forEach((f) => {
    if (f.type === 'checkboxes') {
      (f.items || []).forEach((it) => (data[it.id] = false));
    } else if (f.type === 'checkbox') {
      data[f.id] = false;
    } else if (f.type === 'radio') {
      data[f.id] = f.options && f.options.length ? f.options[0].value : '';
    } else if (f.type === 'select') {
      data[f.id] = f.options && f.options.length ? f.options[0].value : '';
    } else if (f.type === 'number') {
      data[f.id] = '';
    } else if (f.type === 'installments') {
      // array de parcelas controlado por qtd_parcelas
      data[f.id] = [];
    } else {
      data[f.id] = '';
    }
  });
  return data;
}

function templateSkeleton() {
  return {
    id: 'meu-template-id',
    name: 'Meu Template Exemplo',
    fields: [
      { id: 'campo_texto', label: 'Campo de Texto', type: 'text' },
      { id: 'opcao', label: 'Opcao', type: 'radio', options: [ { label: 'A', value: 'a' }, { label: 'B', value: 'b' } ] },
      { id: 'marcacoes', label: 'Marcacoes', type: 'checkboxes', items: [ { id: 'm1', label: 'Marcar 1' }, { id: 'm2', label: 'Marcar 2' } ] },
    ],
    previewHTML: `
      <div class="doc-title">TITULO DO DOCUMENTO</div>
      <div class="doc-paragraph">Valor: {{campo_texto}}</div>
      <div class="doc-paragraph">Opcao A: {{#radio:opcao|a}} &nbsp; Opcao B: {{#radio:opcao|b}}</div>
      <div class="doc-paragraph">Marcacoes: {{#check:m1}} M1 &nbsp; {{#check:m2}} M2</div>
    `
  };
}

const App = {
  data() {
    return {
      templates: [],
      currentTemplateId: '',
      currentTemplate: null,
      formData: {},
      renderedHTML: '',
      showTemplateEditor: false,
      templateDraft: JSON.stringify(templateSkeleton(), null, 2),
      toast: ''
    };
  },
  created() {
    this.templates = (window.MockTemplatesAPI?.list?.() || []);
    if (this.templates.length > 0) {
      this.currentTemplateId = this.templates[0].id;
      this.onTemplateChange();
    }
  },
  mounted() {
    // Deep watch form data to re-render immediately
    this.$watch(() => this.formData, () => this.updateRendered(), { deep: true });
    // Ajusta tamanho das parcelas ao alterar quantidade
    this.$watch(() => this.formData.qtd_parcelas, (val) => {
      this.ensureParcelasLength();
    });
  },
  methods: {
    onTemplateChange() {
      const tpl = window.MockTemplatesAPI.get(this.currentTemplateId);
      // normaliza: converte campos de texto com nome de data para type=date
      const normalized = JSON.parse(JSON.stringify(tpl || {}));
      if (Array.isArray(normalized.fields)) {
        normalized.fields = normalized.fields.map((f) => {
          if (f && f.type === 'text' && isDateKey(f.id)) {
            return Object.assign({}, f, { type: 'date' });
          }
          return f;
        });
      }
      this.currentTemplate = normalized;
      this.formData = createInitialData(tpl);
      this.ensureParcelasLength();
      this.updateRendered();
    },
    onTextInput(field, evt) {
      if (!field || field.type !== 'text') return;
      const id = String(field.id || '').toLowerCase();
      let v = evt.target.value || '';
      if (id.includes('cnpj')) v = maskCNPJ(v);
      else if (id.includes('cpf')) v = maskCPF(v);
      else if (isCurrencyKey(id)) v = maskBRL(v);
      else return;
      evt.target.value = v;
      this.formData[field.id] = v;
    },
    onInstallmentInput(index, key, evt) {
      if (!Array.isArray(this.formData.parcelas)) return;
      let v = evt.target.value || '';
      if (key === 'valor') v = maskBRL(v);
      this.formData.parcelas[index][key] = v;
      evt.target.value = v;
    },
    ensureParcelasLength() {
      const n = parseInt(this.formData.qtd_parcelas || 0, 10) || 0;
      if (!Array.isArray(this.formData.parcelas)) this.formData.parcelas = [];
      const arr = this.formData.parcelas;
      if (n > arr.length) {
        for (let i = arr.length; i < n; i++) arr.push({ venc: '', valor: '' });
      } else if (n < arr.length) {
        arr.splice(n);
      }
    },
    triggerImport() {
      this.$refs.importInput && this.$refs.importInput.click();
    },
    handleImport(evt) {
      const file = evt?.target?.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const tpl = JSON.parse(String(reader.result || ''));
          if (!tpl.id || !tpl.name || !tpl.previewHTML) {
            alert('Template inválido: inclua id, name e previewHTML');
            return;
          }
          window.MockTemplatesAPI.save(tpl);
          this.templates = window.MockTemplatesAPI.list();
          this.currentTemplateId = tpl.id;
          this.onTemplateChange();
          this.toast = `Template "${tpl.name}" importado`;
          setTimeout(() => (this.toast = ''), 2500);
        } catch (e) {
          alert('Erro ao importar JSON');
        } finally {
          evt.target.value = '';
        }
      };
      reader.readAsText(file);
    },
    updateRendered() {
      this.renderedHTML = renderTemplate(this.currentTemplate?.previewHTML || '', this.formData);
    },
    saveForm() {
      try {
        const key = `trf.saved.${this.currentTemplateId}`;
        const items = JSON.parse(localStorage.getItem(key) || '[]');
        items.push({ when: new Date().toISOString(), data: this.formData });
        localStorage.setItem(key, JSON.stringify(items));
        this.toast = 'Dados salvos localmente (localStorage)';
        setTimeout(() => (this.toast = ''), 3000);
      } catch (e) {
        alert('Falha ao salvar localmente');
      }
    },
    printPreview() {
      window.print();
    },
    printBlank() {
      this.formData = createInitialData(this.currentTemplate);
      this.$nextTick(() => window.print());
    },
    resetForm() {
      this.formData = createInitialData(this.currentTemplate);
    },
    openTemplateEditor() {
      this.templateDraft = JSON.stringify(templateSkeleton(), null, 2);
      this.showTemplateEditor = true;
    },
    exportWord() {
      const content = this.renderedHTML || '';
      const htmlDoc = `<!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <title>${this.currentTemplate?.name || 'documento'}</title>
        <style>
          /* Margens padrão do Word: 2,54 cm (1 polegada) em todos os lados */
          @page { size: A4; margin: 25.4mm; }
          body { font-family: Arial, sans-serif; color: #111827; margin: 25.4mm; }
          .doc-title { font-size: 16pt; font-weight: 700; text-align: center; margin-bottom: 10mm; }
          .doc-section-title { font-weight: 600; margin: 10px 0 4px; }
          .doc-small { font-size: 10pt; color: #334155; }
          .doc-paragraph { margin: 8px 0; line-height: 1.4; text-align: justify; }
          .box { display: inline-block; width: 14px; height: 14px; border: 1px solid #334155; margin-right: 6px; vertical-align: -2px; position: relative; border-radius: 2px; }
          .box.checked::after { content: "\\2713"; position: absolute; left: 1px; top: -3px; font-size: 16px; color: #111827; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #cbd5e1; padding: 4px; }
        </style>
      </head>
      <body>${content}</body>
      </html>`;
      const blob = new Blob(['\ufeff', htmlDoc], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const filename = `${(this.currentTemplate?.id || 'documento')}.doc`;
      a.download = filename;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 500);
    },
    saveNewTemplate() {
      try {
        const tpl = JSON.parse(this.templateDraft);
        if (!tpl.id || !tpl.name || !tpl.previewHTML) {
          alert('Template inválido: inclua id, name e previewHTML');
          return;
        }
        window.MockTemplatesAPI.save(tpl);
        this.templates = window.MockTemplatesAPI.list();
        this.currentTemplateId = tpl.id;
        this.onTemplateChange();
        this.showTemplateEditor = false;
      } catch (e) {
        alert('JSON inválido');
      }
    }
  }
};

Vue.createApp(App).mount('#app');
