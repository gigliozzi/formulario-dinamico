// Basic mock templates API using localStorage. Also seeds a default template.
(function () {
  const STORAGE_KEY = 'trf.templates.v1';

  function _read() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch { return []; }
  }
  function _write(items) { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }

  function ensureTemplate(tpl) {
    const items = _read();
    if (!items.find((t) => t.id === tpl.id)) {
      items.push(tpl);
      _write(items);
    }
  }

  function seedDefaults() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const defaults = [defaultProcPJTemplate()];
      _write(defaults);
    }
    // Always ensure core defaults exist
    ensureTemplate(defaultProcPJTemplate());
    ensureTemplate(defaultProcPFTemplate());
    ensureTemplate(defaultContratoProducaoMusical());
    ensureTemplate(defaultContratoProducaoMusicalV2());
  }

  function list() {
    seedDefaults();
    return _read();
  }

  function get(id) {
    return list().find((t) => t.id === id);
  }

  function save(template) {
    const items = _read();
    const idx = items.findIndex((t) => t.id === template.id);
    if (idx >= 0) items[idx] = template; else items.push(template);
    _write(items);
  }

  function remove(id) {
    const items = _read().filter((t) => t.id !== id);
    _write(items);
  }

  // Default Template: Procuração Internet Banking - PJ
  function defaultProcPJTemplate() {
    return {
      id: 'procuracao-pj',
      name: 'Procuração Internet Banking - PJ',
      fields: [
        { id: 'cooperativa', label: 'Cooperativa/Agência', type: 'select', options: [
          { label: 'UNI GOIANA', value: 'UNI GOIANA' },
          { label: 'UNICRED PROSPERAR', value: 'UNICRED PROSPERAR' },
          { label: 'UNICRED CENTRAL', value: 'UNICRED CENTRAL' }
        ]},
        { id: 'razao_social', label: 'Razão Social', type: 'text', placeholder: 'WEGEN NEGÓCIOS E SOLUÇÕES LTDA' },
        { id: 'representante_nome', label: 'Nome do Sócio/Representante/Administrador', type: 'text' },
        { id: 'representante_cpf', label: 'CPF do Sócio/Representante/Administrador', type: 'text' },
        { id: 'empresa_multisocio', label: 'A empresa possui mais de um Sócio/Representante/Administrador?', type: 'radio', options: [
          { label: 'Não', value: 'nao' },
          { label: 'Sim', value: 'sim' }
        ]},
        { id: 'procurador_nome', label: 'Nome do Procurador', type: 'text' },
        { id: 'procurador_cpf', label: 'CPF do Procurador', type: 'text' },
        { id: 'conta', label: 'Conta', type: 'text' },
        { id: 'assinatura_tipo', label: 'Tipo de assinatura', type: 'radio', options: [
          { label: 'Simples', value: 'simples' },
          { label: 'Múltipla', value: 'multipla' }
        ]},
        { id: 'qtd_assinaturas', label: 'Quantidade de assinaturas', type: 'number' },
        { id: 'permissoes', label: 'Permissões do Procurador', type: 'checkboxes', items: [
          { id: 'perm_perfil_operador', label: 'Perfil Operador' },
          { id: 'perm_autorizador', label: 'Perfil Autorizador' },
          { id: 'perm_transferencias', label: 'Permite transferências' }
        ]},
        { id: 'local', label: 'Local', type: 'text', placeholder: 'Goiânia' },
        { id: 'data', label: 'Data', type: 'date' },
        { id: 'observacoes', label: 'Observações', type: 'textarea' }
      ],
      previewHTML: `
        <div class="doc-title">PROCURAÇÃO PARTICULAR PARA INTERNET BANKING - PJ</div>

        <div class="doc-small"><strong>Cooperativa/Agência:</strong> {{cooperativa}}</div>
        <div class="doc-section-title">DADOS DA PROCURAÇÃO</div>

        <div class="doc-paragraph">
          O OUTORGANTE <strong>{{razao_social}}</strong>, representado por <strong>{{representante_nome}}</strong>,
          CPF <strong>{{representante_cpf}}</strong>, nomeia e constitui como seu procurador <strong>{{procurador_nome}}</strong>,
          CPF <strong>{{procurador_cpf}}</strong>, conferindo poderes para movimentar a conta <strong>{{conta}}</strong>
          perante a cooperativa <strong>{{cooperativa}}</strong>, exclusivamente através do Internet Banking, nos
          termos a seguir.
        </div>

        <div class="doc-paragraph">
          Tipo de assinatura: {{#radio:assinatura_tipo|simples}} Simples &nbsp;&nbsp; {{#radio:assinatura_tipo|multipla}} Múltipla
          {{#if:assinatura_tipo|multipla}}&nbsp;&nbsp; Quantidade: {{qtd_assinaturas}}{{/if}}
        </div>

        <div class="doc-section-title">PERMISSÕES DO PROCURADOR</div>
        <div class="doc-paragraph">
          {{#check:perm_perfil_operador}} Perfil Operador &nbsp;&nbsp;
          {{#check:perm_autorizador}} Perfil Autorizador &nbsp;&nbsp;
          {{#check:perm_transferencias}} Permite transferências
        </div>

        <div class="doc-section-title">DECLARAÇÕES</div>
        <div class="doc-paragraph">
          O OUTORGANTE declara que a utilização das senhas será de responsabilidade exclusiva do OUTORGADO, não
          cabendo à cooperativa qualquer responsabilidade por sua guarda e sigilo. Esta procuração é válida até que
          seja revogada expressamente.
        </div>

        <div class="doc-paragraph">
          <strong>Observações:</strong> {{observacoes}}
        </div>

        <div class="doc-paragraph" style="margin-top:16mm">
          {{local}}, {{data}}
        </div>

        <div class="doc-paragraph" style="margin-top:12mm">
          ____________________________________________<br/>
          Assinatura do Outorgante
        </div>

        <div class="doc-paragraph" style="margin-top:8mm">
          ____________________________________________<br/>
          Assinatura do Procurador
        </div>
      `
    };
  }

  // Second default template: Pessoa Física (PF)
  function defaultProcPFTemplate() {
    return {
      id: 'procuracao-pf',
      name: 'Procuração Internet Banking - PF',
      fields: [
        { id: 'cooperativa', label: 'Cooperativa/Agência', type: 'select', options: [
          { label: 'UNI GOIANA', value: 'UNI GOIANA' },
          { label: 'UNICRED PROSPERAR', value: 'UNICRED PROSPERAR' },
          { label: 'UNICRED CENTRAL', value: 'UNICRED CENTRAL' }
        ]},
        { id: 'outorgante_nome', label: 'Nome do Outorgante', type: 'text' },
        { id: 'outorgante_cpf', label: 'CPF do Outorgante', type: 'text' },
        { id: 'outorgado_nome', label: 'Nome do Procurador (Outorgado)', type: 'text' },
        { id: 'outorgado_cpf', label: 'CPF do Procurador', type: 'text' },
        { id: 'conta', label: 'Conta', type: 'text' },
        { id: 'assinatura_tipo', label: 'Tipo de assinatura', type: 'radio', options: [
          { label: 'Simples', value: 'simples' },
          { label: 'Múltipla', value: 'multipla' }
        ]},
        { id: 'qtd_assinaturas', label: 'Quantidade de assinaturas', type: 'number' },
        { id: 'permissoes', label: 'Permissões do Procurador', type: 'checkboxes', items: [
          { id: 'perm_saldos', label: 'Consultar saldos e extratos' },
          { id: 'perm_pagamentos', label: 'Efetuar pagamentos' },
          { id: 'perm_transferencias', label: 'Realizar transferências' }
        ]},
        { id: 'local', label: 'Local', type: 'text', placeholder: 'Cidade' },
        { id: 'data', label: 'Data', type: 'date' },
        { id: 'observacoes', label: 'Observações', type: 'textarea' }
      ],
      previewHTML: `
        <div class="doc-title">PROCURAÇÃO PARTICULAR PARA INTERNET BANKING - PF</div>

        <div class="doc-small"><strong>Cooperativa/Agência:</strong> {{cooperativa}}</div>

        <div class="doc-section-title">OUTORGANTE</div>
        <div class="doc-paragraph">
          Nome: <strong>{{outorgante_nome}}</strong> — CPF: <strong>{{outorgante_cpf}}</strong>
        </div>

        <div class="doc-section-title">OUTORGADO</div>
        <div class="doc-paragraph">
          Nome: <strong>{{outorgado_nome}}</strong> — CPF: <strong>{{outorgado_cpf}}</strong>
        </div>

        <div class="doc-section-title">OBJETO</div>
        <div class="doc-paragraph">
          Esta procuração confere poderes ao OUTORGADO para representação do OUTORGANTE
          perante a cooperativa <strong>{{cooperativa}}</strong>, com uso do Internet Banking para
          movimentar a conta <strong>{{conta}}</strong>, conforme permissões abaixo.
        </div>

        <div class="doc-section-title">PERMISSÕES</div>
        <div class="doc-paragraph">
          {{#check:perm_saldos}} Consultar saldos e extratos &nbsp;&nbsp;
          {{#check:perm_pagamentos}} Efetuar pagamentos &nbsp;&nbsp;
          {{#check:perm_transferencias}} Realizar transferências
        </div>

        <div class="doc-paragraph">
          Tipo de assinatura: {{#radio:assinatura_tipo|simples}} Simples &nbsp;&nbsp; {{#radio:assinatura_tipo|multipla}} Múltipla
          {{#if:assinatura_tipo|multipla}}&nbsp;&nbsp; Quantidade: {{qtd_assinaturas}}{{/if}}
        </div>

        <div class="doc-paragraph">
          <strong>Observações:</strong> {{observacoes}}
        </div>

        <div class="doc-paragraph" style="margin-top:14mm">
          {{local}}, {{data}}
        </div>

        <div class="doc-paragraph" style="margin-top:12mm">
          ____________________________________________<br/>
          Assinatura do Outorgante
        </div>

        <div class="doc-paragraph" style="margin-top:8mm">
          ____________________________________________<br/>
          Assinatura do Outorgado
        </div>
      `
    };
  }

  // New default template: Contrato de Produção Musical (baseado no modelo fornecido)
  function defaultContratoProducaoMusical() {
    return {
      id: 'contrato-producao-musical',
      name: 'Contrato de Produção Musical',
      fields: [
        { id: 'contratante_nome', label: 'Nome da empresa (Contratante)', type: 'text' },
        { id: 'contratante_cnpj', label: 'CNPJ da Contratante', type: 'text' },
        { id: 'contratante_sede', label: 'Sede (endereço) da Contratante', type: 'text' },
        { id: 'contratante_email', label: 'E-mail da Contratante', type: 'text' },
        { id: 'artistas', label: 'Dupla/Artistas', type: 'text', placeholder: 'Nome da dupla' },
        { id: 'qtd_fonogramas', label: 'Quantidade de fonogramas', type: 'number' },
        { id: 'valor_total', label: 'Valor total bruto (R$)', type: 'text', placeholder: 'R$ 0,00' },
        { id: 'valor_extenso', label: 'Valor por extenso', type: 'text' },
        { id: 'qtd_parcelas', label: 'Quantidade de parcelas', type: 'number' },
        { id: 'p1_venc', label: '1ª parcela - Vencimento', type: 'date', placeholder: '' },
        { id: 'p1_valor', label: '1ª parcela - Valor (R$)', type: 'text' },
        { id: 'p2_venc', label: '2ª parcela - Vencimento', type: 'date' },
        { id: 'p2_valor', label: '2ª parcela - Valor (R$)', type: 'text' },
        { id: 'p3_venc', label: '3ª parcela - Vencimento', type: 'date' },
        { id: 'p3_valor', label: '3ª parcela - Valor (R$)', type: 'text' },
        { id: 'local', label: 'Local', type: 'text', placeholder: 'Mairinque/SP' },
        { id: 'data', label: 'Data', type: 'date' },
        { id: 'test1_nome', label: 'Testemunha 1 - Nome', type: 'text' },
        { id: 'test1_cpf', label: 'Testemunha 1 - CPF', type: 'text' },
        { id: 'test2_nome', label: 'Testemunha 2 - Nome', type: 'text' },
        { id: 'test2_cpf', label: 'Testemunha 2 - CPF', type: 'text' },
        { id: 'contratada_resp_nome', label: 'Contratada - Representante (nome)', type: 'text' },
        { id: 'contratada_resp_cpf', label: 'Contratada - Representante (CPF)', type: 'text' }
      ],
      previewHTML: `
        <div class="doc-title">CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE PRODUÇÃO MUSICAL</div>

        <div class="doc-paragraph">
          <strong>EDUARDO PEPATO PRODUÇÕES ARTÍSTICAS LTDA – EPP</strong>, CNPJ 17.653.806/0001-81, com sede na rua
          Fagundes Varela, Lote F6K, Cond. Porta do Sol, Mairinque/SP, CEP 18.121-696, representada por seu sócio
          administrador, Zeli Aparecida Wismek Correa, brasileiro, empresária, e-mail financeiro@eduardopepato.com.br,
          neste ato denominada como <strong>Contratada</strong>.
        </div>

        <div class="doc-paragraph">
          <strong>{{contratante_nome}}</strong>, CNPJ <strong>{{contratante_cnpj}}</strong>, com sede
          <strong>{{contratante_sede}}</strong>, e-mail: <strong>{{contratante_email}}</strong>, doravante denominada como
          <strong>Contratante</strong>.
        </div>

        <div class="doc-paragraph">
          As pessoas acima qualificadas também serão nomeadas em conjunto como <strong>Partes</strong> e, individualmente,
          como <strong>Parte</strong>.
        </div>

        <div class="doc-paragraph">
          Em consideração às mútuas declarações, garantias, avenças e acordos aqui contidos, as Partes resolvem celebrar o
          presente Contrato de Prestação de Serviços Musicais (ou “Contrato”), sujeito às disposições da República Federativa
          do Brasil, conforme as Cláusulas, termos e condições adiante estabelecidos:
        </div>

        <div class="doc-section-title">I. DO OBJETO.</div>
        <div class="doc-paragraph">
          1.1. O presente Contrato tem por objeto a prestação de serviços pela Contratada para a produção musical e gravação
          de <strong>{{qtd_fonogramas}}</strong> fonogramas (ou “faixas”), a serem interpretadas e gravadas pela dupla
          <strong>{{artistas}}</strong> (doravante “Artistas”). Todas as despesas referentes à produção e gravação das faixas
          serão integralmente custeadas pela Contratante.
        </div>

        <div class="doc-paragraph">
          1.2. Para os fins deste Contrato, entende-se por produção musical os seguintes serviços:
          <br/>a) realização de audições para selecionar as obras literomusicais que serão gravadas pelos Artistas;
          <br/>b) criação de arranjos musicais específicos para cada uma das obras literomusicais a serem interpretadas pelos Artistas;
          <br/>c) produção e direção musical dos músicos contratados para executar e gravar os arranjos elaborados pela Contratada;
          <br/>d) gravação de voz e direção vocal dos Artistas;
          <br/>e) gravações e edições de áudio que a Contratada julgar necessárias para a execução completa dos serviços contratados;
          <br/>f) mixagem e masterização dos fonogramas, conforme estipulado neste Contrato.
        </div>

        <div class="doc-paragraph">
          1.3. A escolha e contratação do editor de áudio, engenheiro de som (para mixagem e masterização), estúdio de
          gravação, músicos executantes e demais profissionais necessários serão de exclusiva responsabilidade da Contratada.
          Todos os custos dessas contratações serão integralmente arcados pela Contratante, desde que previamente aprovados,
          sem implicar abatimentos nos valores devidos à Contratada, conforme a Cláusula Quarta (“Dos Valores Pagos Pelos
          Serviços Contratados”).
        </div>

        <div class="doc-section-title">II. DAS OBRIGAÇÕES DAS PARTES.</div>
        <div class="doc-paragraph">
          2.1. A Contratante se compromete a:
          <br/>a) cumprir prazos, datas e horários agendados para a gravação vocal dos Artistas;
          <br/>b) arcar com custos relativos aos profissionais envolvidos em cada fonograma;
          <br/>c) arcar com custos e autorizações de uso das obras junto a compositores/editores;
          <br/>d) entregar, com antecedência mínima de 15 dias úteis, títulos das obras, compositores/autores e editoras;
          <br/>e) eximir a Contratada de reclamações por violação de direitos autorais decorrentes do descumprimento das alíneas “b”, “c” e “d”;
          <br/>f) arcar com custos logísticos e cachês da equipe envolvida.
        </div>
        <div class="doc-paragraph">
          2.2. A Contratada se compromete a:
          <br/>a) cumprir prazos de entrega dos fonogramas;
          <br/>b) realizar com zelo a produção e os arranjos de cada obra literomusical;
          <br/>c) agendar com 10 dias úteis de antecedência o horário e local da gravação vocal dos Artistas.
        </div>
        <div class="doc-paragraph">
          2.3. Os serviços prestados não incluem a participação de Eduardo Pepato como músico acompanhante em shows, lives,
          programas de rádio/TV ou quaisquer outros eventos.
        </div>

        <div class="doc-section-title">III. DOS VALORES PAGOS PELOS SERVIÇOS CONTRATADOS.</div>
        <div class="doc-paragraph">
          3.1. Como remuneração, a Contratante pagará à Contratada o valor total bruto de <strong>{{valor_total}}</strong>
          (<em>{{valor_extenso}}</em>), pela produção musical, direção musical e gravação de <strong>{{qtd_fonogramas}}</strong>
          fonogramas, dividido em <strong>{{qtd_parcelas}}</strong> parcelas, da seguinte forma:
        </div>
        <table style="width:100%; border-collapse:collapse; font-size:10pt;" border="1">
          <tr><th style="text-align:left;padding:4px;">Parcela</th><th style="text-align:left;padding:4px;">Vencimento</th><th style="text-align:left;padding:4px;">Valor</th></tr>
          <tr><td style="padding:4px;">1ª</td><td style="padding:4px;">{{p1_venc}}</td><td style="padding:4px;">{{p1_valor}}</td></tr>
          <tr><td style="padding:4px;">2ª</td><td style="padding:4px;">{{p2_venc}}</td><td style="padding:4px;">{{p2_valor}}</td></tr>
          <tr><td style="padding:4px;">3ª</td><td style="padding:4px;">{{p3_venc}}</td><td style="padding:4px;">{{p3_valor}}</td></tr>
        </table>
        <div class="doc-paragraph">
          3.2. Todos os pagamentos deverão ser realizados via transferência bancária na conta abaixo indicada:
          <br/>Titular: <strong>Eduardo Pepato Produções Artísticas Ltda</strong> &nbsp; CNPJ/PIX: <strong>17.653.806/0001-81</strong>
          &nbsp; Banco: <strong>Itaú</strong> &nbsp; Agência: <strong>8493</strong> &nbsp; Conta Corrente: <strong>29515-1</strong>.
        </div>
        <div class="doc-paragraph">
          3.3. Em caso de atraso, multa de 2% sobre a parcela devida, conforme Cláusula 7.3.
          <br/>3.4. Rompimento contratual entre Contratante e Artistas não exime o pagamento proporcional à Contratada.
          <br/>3.5. A entrega das faixas produzidas, mixadas e masterizadas caracteriza a plena execução dos serviços.
          <br/>3.6. Para cada fonograma excedente ao estipulado, será devido à vista R$ 60.000,00, acrescido dos custos dos profissionais.
          <br/>3.7. Para uso em videofonogramas, custos logísticos deverão ser pagos com antecedência mínima de 7 dias; cachês em até 5 dias após a gravação.
        </div>

        <div class="doc-section-title">IV. DA EXECUÇÃO PÚBLICA.</div>
        <div class="doc-paragraph">
          4.1. A Contratante administrará o código ISRC de cada fonograma produzido, com base na ficha técnica.
          <br/>4.2. A Contratada coletará os dados pessoais e funções de cada profissional e os entregará em até 15 dias úteis após as gravações:
          nome completo; pseudônimo; CPF; instrumento ou função.
          <br/>4.3. É responsabilidade das Partes manter em local seguro as fichas técnicas.
          <br/>4.4. Royalties de execução pública serão recebidos diretamente pelas associações de gestão coletiva.
          <br/>4.5. Cada Parte elegerá a sua associação de gestão coletiva.
        </div>

        <div class="doc-section-title">V. DA DESISTÊNCIA OU RESOLUÇÃO CONTRATUAL.</div>
        <div class="doc-paragraph">
          5.1. Se a Contratante der causa à resolução, perderá o Sinal (1ª parcela), a título de serviços prestados e de terceiros.
          <br/>5.2. Se a resolução decorrer da Contratada, esta restituirá o Sinal e responderá pelos terceiros por si contratados.
          <br/>5.3. A cláusula resolutiva poderá ter extensão indenizatória.
          <br/>5.4. Em caso de necessidade de demanda judicial, a Parte vencida arcará com despesas.
        </div>

        <div class="doc-section-title">VI. DO PRAZO DA ENTREGA.</div>
        <div class="doc-paragraph">
          6.1. Prazo de entrega: até 60 dias úteis, contados do término das gravações de instrumentos e voz.
          <br/>6.2. Em caso fortuito/força maior ou calamidade, novas datas serão oportunamente agendadas, sem devolução de valores já pagos.
          <br/>6.3. Descumprimento do prazo acarretará multa de 2% do valor do Contrato, sem prejuízo de perdas e danos comprovados.
        </div>

        <div class="doc-section-title">VII. DAS PENALIDADES POR DESCUMPRIMENTO.</div>
        <div class="doc-paragraph">
          7.1. A Parte prejudicada notificará a outra, concedendo 15 dias corridos para sanar o descumprimento (quando sanável).
          <br/>7.2. Não sanado, multa não compensatória de 10% do valor total (Cláusula 3.1), cumulada com perdas e danos.
          <br/>7.3. Valores devidos sofrerão correção pelo IGP-M e juros de 1% a.m., pro rata die, pagos em até 7 dias úteis após notificação.
          <br/>7.4. Em cobrança judicial, honorários fixados em 10% sobre o total devido, sem confundir com sucumbência.
          <br/>7.5. Multas deverão ser liquidadas em até 7 dias úteis, via transferência ou PIX.
        </div>

        <div class="doc-section-title">VIII. DISPOSIÇÕES GERAIS.</div>
        <div class="doc-paragraph">
          8.1. Avisos e notificações: enviados para os e-mails do preâmbulo.
          <br/>8.1.1. Mudanças de endereço eletrônico/residencial devem ser comunicadas; em não o fazendo, reputam-se eficazes os avisos enviados aos endereços indicados e ao e-mail: <em>anakarina@clubedocowboy.com.br</em>.
          <br/>8.2. Proteção de Dados: tratamento nos termos da LGPD (Lei 13.709/2018).
          <br/>8.3. Confidencialidade: sigilo por 5 anos sobre informações confidenciais; exceções legais e por ordem judicial.
          <br/>8.4. Revogação de tratativas: prevalece o presente instrumento.
          <br/>8.5. Tributos: de responsabilidade do contribuinte na forma da lei.
          <br/>8.6. Autonomia das disposições: invalidez de uma cláusula não afeta as demais.
          <br/>8.7. Tolerância: não implica novação nem renúncia a direitos.
          <br/>8.8. Alterações: somente por aditamento assinado pelas Partes.
          <br/>8.9. Não caracterização de sociedade: não cria vínculo societário, associativo ou empregatício.
          <br/>8.10. Despesas: cada Parte arcará com as suas.
          <br/>8.11. Privacidade: não emitir comentários que possam resultar em prejuízo à imagem da outra Parte; multa de R$ 50.000,00 em caso de descumprimento, conforme 7.3.
          <br/>8.12. Outros contratos: direitos e obrigações anteriores não são afetados, salvo disposição expressa.
          <br/>8.13. Anticorrupção: cumprimento das leis aplicáveis; infrações sujeitas às penalidades da Cláusula 7.2 e indenizações cabíveis.
          <br/>8.14. Acompanhamento jurídico: as Partes declaram ter recebido orientação jurídica prévia.
          <br/>8.15. Juízo Digital: optam pelo Juízo 100% Digital, conforme CPC.
          <br/>8.16. Legislação e Foro: leis da República Federativa do Brasil; Foro de São Paulo/SP.
          <br/>8.17. Prazos: considerados os do calendário civil da cidade de Mairinque/SP.
          <br/>8.18. Assinaturas: poderão ser digitais/eletrônicas; PDFs terão força de original; com certificado digital terão equivalência jurídica à autenticação cartorial.
        </div>

        <div class="doc-paragraph" style="margin-top:12mm;">
          Por estarem justas e contratadas, as Partes assinam o presente Contrato na presença de 2 (duas) testemunhas.
        </div>

        <div class="doc-paragraph" style="margin-top:8mm;">
          {{local}}, {{data}}
        </div>

        <div class="doc-paragraph" style="margin-top:12mm">
          ____________________________________________<br/>
          <strong>{{contratante_nome}}</strong><br/>
          CNPJ: {{contratante_cnpj}}<br/>
          CONTRATANTE
        </div>

        <div class="doc-paragraph" style="margin-top:12mm">
          ____________________________________________<br/>
          <strong>EDUARDO PEPATO PRODUÇÕES ARTÍSTICAS LTDA.</strong><br/>
          CNPJ: 17.653.806/0001-81<br/>
          CONTRATADA<br/>
          NOME: {{contratada_resp_nome}} &nbsp;&nbsp; CPF: {{contratada_resp_cpf}}
        </div>

        <div class="doc-paragraph" style="margin-top:12mm">
          Testemunha — NOME: {{test1_nome}} &nbsp;&nbsp; CPF: {{test1_cpf}}
        </div>
        <div class="doc-paragraph" style="margin-top:8mm">
          Testemunha — NOME: {{test2_nome}} &nbsp;&nbsp; CPF: {{test2_cpf}}
        </div>

        <div class="doc-small" style="margin-top:16mm; text-align:center;">
          <em>restante desta página em branca</em>
        </div>
      `
    };
  }

  function defaultContratoProducaoMusicalV2() {
    return {
      id: 'contrato-producao-musical-v2',
      name: 'Contrato de Produção Musical (Parcelas Dinâmicas)',
      fields: [
        { id: 'contratante_nome', label: 'Nome da empresa (Contratante)', type: 'text' },
        { id: 'contratante_cnpj', label: 'CNPJ da Contratante', type: 'text' },
        { id: 'contratante_sede', label: 'Sede (endereço) da Contratante', type: 'text' },
        { id: 'contratante_email', label: 'E-mail da Contratante', type: 'text' },
        { id: 'artistas', label: 'Dupla/Artistas', type: 'text', placeholder: 'Nome da dupla' },
        { id: 'qtd_fonogramas', label: 'Quantidade de fonogramas', type: 'number' },
        { id: 'valor_total', label: 'Valor total bruto (R$)', type: 'text', placeholder: 'R$ 0,00' },
        { id: 'valor_extenso', label: 'Valor por extenso', type: 'text' },
        { id: 'qtd_parcelas', label: 'Quantidade de parcelas', type: 'number' },
        { id: 'parcelas', label: 'Parcelas', type: 'installments' },
        { id: 'local', label: 'Local', type: 'text', placeholder: 'Mairinque/SP' },
        { id: 'data', label: 'Data', type: 'date' },
        { id: 'test1_nome', label: 'Testemunha 1 - Nome', type: 'text' },
        { id: 'test1_cpf', label: 'Testemunha 1 - CPF', type: 'text' },
        { id: 'test2_nome', label: 'Testemunha 2 - Nome', type: 'text' },
        { id: 'test2_cpf', label: 'Testemunha 2 - CPF', type: 'text' },
        { id: 'contratada_resp_nome', label: 'Contratada - Representante (nome)', type: 'text' },
        { id: 'contratada_resp_cpf', label: 'Contratada - Representante (CPF)', type: 'text' }
      ],
      previewHTML: `
        <div class="doc-title">CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE PRODUÇÃO MUSICAL</div>

        <div class="doc-paragraph">
          <strong>EDUARDO PEPATO PRODUÇÕES ARTÍSTICAS LTDA – EPP</strong>, CNPJ 17.653.806/0001-81, com sede na rua
          Fagundes Varela, Lote F6K, Cond. Porta do Sol, Mairinque/SP, CEP 18.121-696, representada por seu sócio
          administrador, Zeli Aparecida Wismek Correa, brasileiro, empresária, e-mail financeiro@eduardopepato.com.br,
          neste ato denominada como <strong>Contratada</strong>.
        </div>

        <div class="doc-paragraph">
          <strong>{{contratante_nome}}</strong>, CNPJ <strong>{{contratante_cnpj}}</strong>, com sede
          <strong>{{contratante_sede}}</strong>, e-mail: <strong>{{contratante_email}}</strong>, doravante denominada como
          <strong>Contratante</strong>.
        </div>

        <div class="doc-paragraph">
          Em consideração às mútuas declarações, garantias, avenças e acordos aqui contidos, as Partes resolvem celebrar o
          presente Contrato de Prestação de Serviços Musicais (ou “Contrato”), sujeito às disposições da República Federativa
          do Brasil, conforme as Cláusulas, termos e condições adiante estabelecidos:
        </div>

        <div class="doc-section-title">I. DO OBJETO.</div>
        <div class="doc-paragraph">
          1.1. O presente Contrato tem por objeto a prestação de serviços pela Contratada para a produção musical e gravação
          de <strong>{{qtd_fonogramas}}</strong> fonogramas (ou “faixas”), a serem interpretadas e gravadas pela dupla
          <strong>{{artistas}}</strong> (doravante “Artistas”). Todas as despesas referentes à produção e gravação das faixas
          serão integralmente custeadas pela Contratante.
        </div>

        <div class="doc-section-title">III. DOS VALORES PAGOS PELOS SERVIÇOS CONTRATADOS.</div>
        <div class="doc-paragraph">
          3.1. Como remuneração, a Contratante pagará à Contratada o valor total bruto de <strong>{{valor_total}}</strong>
          (<em>{{valor_extenso}}</em>), dividido em <strong>{{qtd_parcelas}}</strong> parcelas, da seguinte forma:
        </div>
        <table style="width:100%; border-collapse:collapse; font-size:10pt;" border="1">
          <tr><th style="text-align:left;padding:4px;">Parcela</th><th style="text-align:left;padding:4px;">Vencimento</th><th style="text-align:left;padding:4px;">Valor</th></tr>
          {{parcelas_rows}}
        </table>

        <div class="doc-section-title">Demais Cláusulas (resumo)</div>
        <div class="doc-paragraph">
          As demais cláusulas seguem conforme o modelo enviado (obrigações, execução pública, prazos, penalidades, gerais,
          assinatura e foro), mantendo a mesma redação estabelecida no documento base.
        </div>

        <div class="doc-paragraph" style="margin-top:12mm;">
          {{local}}, {{data}}
        </div>

        <div class="doc-paragraph" style="margin-top:12mm">
          ____________________________________________<br/>
          <strong>{{contratante_nome}}</strong><br/>
          CNPJ: {{contratante_cnpj}}<br/>
          CONTRATANTE
        </div>

        <div class="doc-paragraph" style="margin-top:12mm">
          ____________________________________________<br/>
          <strong>EDUARDO PEPATO PRODUÇÕES ARTÍSTICAS LTDA.</strong><br/>
          CNPJ: 17.653.806/0001-81<br/>
          CONTRATADA<br/>
          NOME: {{contratada_resp_nome}} &nbsp;&nbsp; CPF: {{contratada_resp_cpf}}
        </div>

        <div class="doc-paragraph" style="margin-top:12mm">
          Testemunha — NOME: {{test1_nome}} &nbsp;&nbsp; CPF: {{test1_cpf}}
        </div>
        <div class="doc-paragraph" style="margin-top:8mm">
          Testemunha — NOME: {{test2_nome}} &nbsp;&nbsp; CPF: {{test2_cpf}}
        </div>

        <div class="doc-small" style="margin-top:16mm; text-align:center;">
          <em>restante desta página em branca</em>
        </div>
      `
    };
  }

  // Expose on window for the app
  window.MockTemplatesAPI = { list, get, save, remove };
})();
