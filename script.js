/* ─── STATE ─── */
let currentType = null;

/* ─── HELPERS ─── */
function v(id) { return (document.getElementById(id)?.value || '').trim(); }

function fmtMoney(n) {
    return (parseFloat(n) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function fmtDate(s) {
    if (!s) return '____/____/________';
    const [y, m, d] = s.split('-');
    return `${d}/${m}/${y}`;
}

function today() {
    return new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function showToast(msg, type = '') {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = type ? `show ${type}` : 'show';
    setTimeout(() => t.className = '', 4000);
}

/* ─── STEP MANAGEMENT ─── */
function setHeaderStep(n) {
    for (let i = 1; i <= 3; i++) {
        const el = document.getElementById('hstep-' + i);
        el.classList.remove('active', 'done');
        if (i < n) el.classList.add('done');
        if (i === n) el.classList.add('active');
    }
}

function showView(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function selectType(type) {
    currentType = type;
    document.querySelectorAll('.type-card').forEach(c => c.classList.remove('selected'));
    document.getElementById('card-' + type).classList.add('selected');
    document.getElementById('btn-step1-next').disabled = false;
}

function goToStep1() {
    showView('view-type');
    document.getElementById('empty-state').style.display = 'flex';
    document.getElementById('contract-doc').style.display = 'none';
    document.getElementById('preview-bar').style.display = 'none';
    setHeaderStep(1);
}

function goToStep2() {
    if (!currentType) return;
    showView('view-form-' + currentType);
    setHeaderStep(2);
}

function goToStep2Edit() {
    showView('view-form-' + currentType);
    document.getElementById('preview-bar').style.display = 'none';
    document.getElementById('contract-doc').style.display = 'none';
    document.getElementById('empty-state').style.display = 'flex';
    setHeaderStep(2);
}

/* ─── CONTRACT BUILDERS ─── */
function buildPrestador() {
    const ct = { nome: v('ps-ct-nome'), cpf: v('ps-ct-cpf'), end: v('ps-ct-end'), cidade: v('ps-ct-cidade') };
    const pr = { nome: v('ps-pr-nome'), cpf: v('ps-pr-cpf'), end: v('ps-pr-end'), cidade: v('ps-pr-cidade') };
    const servicos = v('ps-servicos');
    const valor = v('ps-valor');
    const pag = v('ps-pagamento');
    const prazo = v('ps-prazo');
    const inicio = v('ps-inicio');
    const local = v('ps-local');
    const adicionais = v('ps-adicionais');

    if (!ct.nome || !pr.nome || !servicos || !valor || !pag || !prazo) {
        alert('Preencha todos os campos obrigatórios (*).');
        return null;
    }

    return `
    <h1>Contrato de Prestação de Serviços</h1>
    <p class="doc-date">${local || 'Local'}, ${today()}</p>
    <p>Pelo presente instrumento particular, as partes a seguir identificadas celebram o presente <strong>CONTRATO DE PRESTAÇÃO DE SERVIÇOS</strong>, que se regerá pelas cláusulas e condições abaixo estipuladas:</p>
    <div class="parties-box">
      <p><strong>CONTRATANTE:</strong> ${ct.nome}, portador(a) do CPF/CNPJ nº ${ct.cpf}, com endereço em ${ct.end}, ${ct.cidade}.</p>
      <p style="margin-top:.4rem"><strong>PRESTADOR(A):</strong> ${pr.nome}, portador(a) do CPF nº ${pr.cpf}, com endereço em ${pr.end}, ${pr.cidade}.</p>
    </div>
    <h2>Cláusula 1ª — Do Objeto</h2>
    <p>O presente contrato tem por objeto a prestação dos seguintes serviços pelo PRESTADOR ao CONTRATANTE: ${servicos}</p>
    <h2>Cláusula 2ª — Do Prazo</h2>
    <p>Os serviços serão iniciados em <strong>${fmtDate(inicio)}</strong> e deverão ser concluídos até <strong>${fmtDate(prazo)}</strong>, podendo ser prorrogados mediante acordo mútuo e aditivo contratual por escrito.</p>
    <h2>Cláusula 3ª — Da Remuneração</h2>
    <p>Pelos serviços prestados, o CONTRATANTE pagará ao PRESTADOR o valor total de <strong>${fmtMoney(valor)}</strong>, na modalidade: <strong>${pag}</strong>.</p>
    <p>O não pagamento nos prazos acordados implicará multa de 2% (dois por cento) sobre o valor em aberto, acrescida de juros moratórios de 1% (um por cento) ao mês.</p>
    <h2>Cláusula 4ª — Das Obrigações do Prestador</h2>
    <p>O PRESTADOR obriga-se a: (a) executar os serviços com diligência, competência e qualidade técnica; (b) manter sigilo sobre informações confidenciais do CONTRATANTE; (c) comunicar imediatamente qualquer impedimento que possa afetar o prazo de entrega.</p>
    <h2>Cláusula 5ª — Das Obrigações do Contratante</h2>
    <p>O CONTRATANTE obriga-se a: (a) fornecer ao PRESTADOR todas as informações e materiais necessários; (b) efetuar os pagamentos nos prazos pactuados; (c) designar interlocutor responsável para aprovações e feedback.</p>
    <h2>Cláusula 6ª — Da Propriedade Intelectual</h2>
    <p>Após a quitação integral, todos os direitos patrimoniais sobre os entregáveis serão cedidos ao CONTRATANTE, ficando vedado ao PRESTADOR utilizá-los comercialmente sem autorização prévia e por escrito.</p>
    <h2>Cláusula 7ª — Da Rescisão</h2>
    <p>O contrato poderá ser rescindido por qualquer das partes, mediante notificação escrita com antecedência mínima de 15 (quinze) dias. Em caso de rescisão imotivada pelo CONTRATANTE, será devida ao PRESTADOR remuneração proporcional aos serviços já executados.</p>
    ${adicionais ? `<h2>Cláusula 8ª — Disposições Adicionais</h2><p>${adicionais}</p>` : ''}
    <h2>Cláusula ${adicionais ? '9' : '8'}ª — Do Foro</h2>
    <p>As partes elegem o foro da comarca de <strong>${local || '_______________'}</strong> para dirimir quaisquer controvérsias, renunciando a qualquer outro, por mais privilegiado que seja.</p>
    <p>E, por estarem justas e contratadas, as partes assinam o presente instrumento em 2 (duas) vias de igual teor, na presença de 2 (duas) testemunhas.</p>
    <p><strong>${local || '_______________'}, ${today()}</strong></p>
    <div class="sig-grid">
      <div class="sig-line"><p>___________________________________</p><p><strong>${ct.nome}</strong></p><p>Contratante — CPF/CNPJ: ${ct.cpf}</p></div>
      <div class="sig-line"><p>___________________________________</p><p><strong>${pr.nome}</strong></p><p>Prestador — CPF: ${pr.cpf}</p></div>
    </div>
    <div class="sig-grid" style="margin-top:2rem">
      <div class="sig-line"><p>___________________________________</p><p>Testemunha 1</p><p>CPF: ______________________</p></div>
      <div class="sig-line"><p>___________________________________</p><p>Testemunha 2</p><p>CPF: ______________________</p></div>
    </div>
  `;
}

function buildSocios() {
    const emp = { nome: v('sc-empresa'), cnpj: v('sc-cnpj'), objeto: v('sc-objeto'), sede: v('sc-sede') };
    const s1 = { nome: v('sc-s1-nome'), cpf: v('sc-s1-cpf'), cota: v('sc-s1-cota'), cargo: v('sc-s1-cargo'), resp: v('sc-s1-resp') };
    const s2 = { nome: v('sc-s2-nome'), cpf: v('sc-s2-cpf'), cota: v('sc-s2-cota'), cargo: v('sc-s2-cargo'), resp: v('sc-s2-resp') };
    const capital = v('sc-capital');
    const lucros = v('sc-lucros');
    const periodo = v('sc-periodo');
    const vigencia = v('sc-vigencia');
    const local = v('sc-local');
    const data = v('sc-data');
    const adicionais = v('sc-adicionais');

    if (!emp.nome || !s1.nome || !s2.nome || !capital || !lucros) {
        alert('Preencha todos os campos obrigatórios (*).');
        return null;
    }

    const total = (parseFloat(s1.cota) || 0) + (parseFloat(s2.cota) || 0);
    const cap = parseFloat(capital) || 0;

    return `
    <h1>Acordo de Sócios</h1>
    <p class="doc-date">${local || 'Local'}, ${data ? fmtDate(data) : today()}</p>
    <p>Pelo presente instrumento particular, os abaixo qualificados celebram o presente <strong>ACORDO DE SÓCIOS</strong> da empresa <strong>${emp.nome}</strong>, nos termos seguintes:</p>
    <div class="parties-box">
      <p><strong>EMPRESA:</strong> ${emp.nome}${emp.cnpj ? ', CNPJ nº ' + emp.cnpj : ''}, com sede em ${emp.sede}.</p>
      <p><strong>Objeto Social:</strong> ${emp.objeto}</p>
      <p style="margin-top:.4rem"><strong>SÓCIO 1:</strong> ${s1.nome}, CPF nº ${s1.cpf}, titular de ${s1.cota}% do capital social.</p>
      <p><strong>SÓCIO 2:</strong> ${s2.nome}, CPF nº ${s2.cpf}, titular de ${s2.cota}% do capital social.</p>
      ${total !== 100 ? `<p style="color:#8b2a1f"><strong>⚠ Atenção:</strong> a soma das participações é ${total}% (o ideal é 100%).</p>` : ''}
    </div>
    <h2>Cláusula 1ª — Do Capital Social</h2>
    <p>O capital social da empresa é de <strong>${fmtMoney(capital)}</strong>, dividido entre os sócios nas seguintes proporções:</p>
    <p>a) <strong>${s1.nome}</strong>: ${s1.cota}% — equivalente a ${fmtMoney((cap * (parseFloat(s1.cota) || 0) / 100).toFixed(2))};<br>b) <strong>${s2.nome}</strong>: ${s2.cota}% — equivalente a ${fmtMoney((cap * (parseFloat(s2.cota) || 0) / 100).toFixed(2))}.</p>
    <h2>Cláusula 2ª — Das Funções e Responsabilidades</h2>
    <p><strong>${s1.nome}</strong> exercerá o cargo de <strong>${s1.cargo}</strong>, sendo responsável por: ${s1.resp}.</p>
    <p><strong>${s2.nome}</strong> exercerá o cargo de <strong>${s2.cargo}</strong>, sendo responsável por: ${s2.resp}.</p>
    <h2>Cláusula 3ª — Da Distribuição de Lucros</h2>
    <p>Os lucros auferidos pela empresa serão distribuídos de forma <strong>${lucros}</strong>, com periodicidade <strong>${periodo}</strong>, após dedução de todas as despesas, impostos e provisões legais.</p>
    <h2>Cláusula 4ª — Das Decisões Estratégicas</h2>
    <p>As decisões estratégicas da empresa — incluindo contratações acima de 5% do capital social, aquisição de ativos, alterações no objeto social e abertura de novas unidades — somente poderão ser tomadas com a aprovação de ambos os sócios, formalizada por escrito.</p>
    <h2>Cláusula 5ª — Da Saída de Sócios</h2>
    <p>Em caso de saída voluntária, o sócio retirante deverá notificar os demais com antecedência mínima de 60 (sessenta) dias. A avaliação das cotas será realizada com base no valor patrimonial apurado por balanço especial. O sócio remanescente terá direito de preferência por 30 dias.</p>
    <h2>Cláusula 6ª — Da Não-Concorrência</h2>
    <p>Durante a vigência e por 12 (doze) meses após a dissolução, os sócios comprometem-se a não participar, direta ou indiretamente, de empresas que concorram com o objeto social, salvo acordo expresso em contrário.</p>
    <h2>Cláusula 7ª — Da Vigência</h2>
    <p>O presente acordo terá vigência de <strong>${vigencia || 'prazo indeterminado'}</strong>, a partir da data de assinatura, podendo ser revisto mediante concordância de todos os sócios.</p>
    ${adicionais ? `<h2>Cláusula 8ª — Disposições Adicionais</h2><p>${adicionais}</p>` : ''}
    <h2>Cláusula ${adicionais ? '9' : '8'}ª — Do Foro</h2>
    <p>As partes elegem o foro da comarca de <strong>${local || '_______________'}</strong> para dirimir quaisquer litígios.</p>
    <p>E por estarem de pleno acordo, os sócios assinam o presente instrumento em 2 (duas) vias de igual teor.</p>
    <p><strong>${local || '_______________'}, ${data ? fmtDate(data) : today()}</strong></p>
    <div class="sig-grid">
      <div class="sig-line"><p>___________________________________</p><p><strong>${s1.nome}</strong></p><p>${s1.cargo} — CPF: ${s1.cpf}</p></div>
      <div class="sig-line"><p>___________________________________</p><p><strong>${s2.nome}</strong></p><p>${s2.cargo} — CPF: ${s2.cpf}</p></div>
    </div>
    <div class="sig-grid" style="margin-top:2rem">
      <div class="sig-line"><p>___________________________________</p><p>Testemunha 1</p><p>CPF: ______________________</p></div>
      <div class="sig-line"><p>___________________________________</p><p>Testemunha 2</p><p>CPF: ______________________</p></div>
    </div>
  `;
}

function buildLocacao() {
    const loc = { nome: v('lc-loc-nome'), cpf: v('lc-loc-cpf'), end: v('lc-loc-end'), contato: v('lc-loc-contato') };
    const ten = { nome: v('lc-ten-nome'), cpf: v('lc-ten-cpf'), end: v('lc-ten-end'), contato: v('lc-ten-contato') };
    const imovel = v('lc-imovel-end');
    const tipo = v('lc-tipo');
    const area = v('lc-area');
    const quartos = v('lc-quartos');
    const aluguel = v('lc-aluguel');
    const vencto = v('lc-vencimento');
    const encargos = v('lc-encargos');
    const inicio = v('lc-inicio');
    const duracao = v('lc-duracao');
    const reajuste = v('lc-reajuste');
    const garantia = v('lc-garantia');
    const local = v('lc-local');
    const adicionais = v('lc-adicionais');

    if (!loc.nome || !ten.nome || !imovel || !aluguel || !inicio || !duracao) {
        alert('Preencha todos os campos obrigatórios (*).');
        return null;
    }

    const encTotal = (parseFloat(aluguel) || 0) + (parseFloat(encargos) || 0);

    return `
    <h1>Contrato de Locação Residencial</h1>
    <p class="doc-date">${local || 'Local'}, ${today()}</p>
    <p>Pelo presente instrumento particular, as partes a seguir qualificadas celebram o presente <strong>CONTRATO DE LOCAÇÃO DE IMÓVEL RESIDENCIAL</strong>, que se regerá pela Lei nº 8.245/91 (Lei do Inquilinato):</p>
    <div class="parties-box">
      <p><strong>LOCADOR(A):</strong> ${loc.nome}, portador(a) do CPF/CNPJ nº ${loc.cpf}, residente em ${loc.end}. Contato: ${loc.contato}.</p>
      <p style="margin-top:.4rem"><strong>LOCATÁRIO(A):</strong> ${ten.nome}, portador(a) do CPF nº ${ten.cpf}, residente em ${ten.end}. Contato: ${ten.contato}.</p>
    </div>
    <h2>Cláusula 1ª — Do Imóvel Locado</h2>
    <p>O LOCADOR cede ao LOCATÁRIO, para fins estritamente residenciais, o imóvel do tipo <strong>${tipo || '___'}</strong>${area ? ', com ' + area + ' m²' : ''}${quartos ? ', composto de ' + quartos : ''}, localizado em: <strong>${imovel}</strong>.</p>
    <h2>Cláusula 2ª — Do Prazo</h2>
    <p>A locação terá início em <strong>${fmtDate(inicio)}</strong> e prazo de <strong>${duracao}</strong>. Findo o prazo, poderá ser renovado mediante aditivo escrito ou tacitamente pelo mesmo período.</p>
    <h2>Cláusula 3ª — Do Valor e Pagamento</h2>
    <p>O aluguel mensal é de <strong>${fmtMoney(aluguel)}</strong>${encargos ? ', acrescido de encargos estimados em ' + fmtMoney(encargos) + ', totalizando ' + fmtMoney(encTotal) + '/mês' : ''}, a ser pago até o dia <strong>${vencto || '___'}</strong> de cada mês.</p>
    <p>O não pagamento acarretará multa de 10% (dez por cento) sobre o valor em atraso e juros de 1% (um por cento) ao mês, calculados pro rata die.</p>
    <h2>Cláusula 4ª — Do Reajuste</h2>
    <p>O valor do aluguel será reajustado anualmente pela variação acumulada do índice <strong>${reajuste || '___'}</strong>, nos termos da Lei do Inquilinato.</p>
    <h2>Cláusula 5ª — Da Garantia Locatícia</h2>
    <p>A garantia da presente locação é: <strong>${garantia || '___'}</strong>. A garantia não poderá ser exigida cumulativamente com outra modalidade.</p>
    <h2>Cláusula 6ª — Das Obrigações do Locador</h2>
    <p>O LOCADOR obriga-se a: (a) entregar o imóvel em perfeitas condições de uso; (b) garantir ao LOCATÁRIO uso pacífico durante a vigência; (c) realizar reparos estruturais não decorrentes de uso inadequado.</p>
    <h2>Cláusula 7ª — Das Obrigações do Locatário</h2>
    <p>O LOCATÁRIO obriga-se a: (a) pagar pontualmente o aluguel e encargos; (b) conservar o imóvel em boas condições; (c) não realizar reformas sem autorização prévia e por escrito; (d) restituir o imóvel nas mesmas condições, salvo desgaste natural.</p>
    <h2>Cláusula 8ª — Da Rescisão Antecipada</h2>
    <p>A rescisão antecipada pelo LOCATÁRIO implicará multa proporcional ao tempo restante do contrato, nos termos do art. 4º da Lei 8.245/91.</p>
    <h2>Cláusula 9ª — Vistoria do Imóvel</h2>
    <p>As partes realizarão vistoria na entrega das chaves, lavrando termo descritivo de suas condições. O mesmo procedimento será adotado na devolução do imóvel.</p>
    ${adicionais ? `<h2>Cláusula 10ª — Disposições Adicionais</h2><p>${adicionais}</p>` : ''}
    <h2>Cláusula ${adicionais ? '11' : '10'}ª — Do Foro</h2>
    <p>As partes elegem o foro da comarca de <strong>${local || '_______________'}</strong> para dirimir quaisquer questões oriundas deste contrato.</p>
    <p>E por estarem de acordo, as partes assinam o presente instrumento em 2 (duas) vias de igual teor.</p>
    <p><strong>${local || '_______________'}, ${today()}</strong></p>
    <div class="sig-grid">
      <div class="sig-line"><p>___________________________________</p><p><strong>${loc.nome}</strong></p><p>Locador — CPF/CNPJ: ${loc.cpf}</p></div>
      <div class="sig-line"><p>___________________________________</p><p><strong>${ten.nome}</strong></p><p>Locatário — CPF: ${ten.cpf}</p></div>
    </div>
    <div class="sig-grid" style="margin-top:2rem">
      <div class="sig-line"><p>___________________________________</p><p>Testemunha 1</p><p>CPF: ______________________</p></div>
      <div class="sig-line"><p>___________________________________</p><p>Testemunha 2</p><p>CPF: ______________________</p></div>
    </div>
  `;
}

/* ─── PREVIEW ─── */
function generatePreview() {
    let html = null;
    if (currentType === 'prestador') html = buildPrestador();
    if (currentType === 'socios') html = buildSocios();
    if (currentType === 'locacao') html = buildLocacao();
    if (!html) return;

    document.getElementById('contract-doc').innerHTML = html;
    document.getElementById('contract-doc').style.display = 'block';
    document.getElementById('empty-state').style.display = 'none';
    document.getElementById('preview-bar').style.display = 'flex';
    showView('view-preview-actions');
    setHeaderStep(3);
    document.getElementById('main-panel').scrollTo({ top: 0, behavior: 'smooth' });
    showToast('✓ Contrato gerado — revise e baixe o PDF', 'gold');
}

/* ─── PDF via print ─── */
function downloadPDF() {
    const content = document.getElementById('contract-doc').innerHTML;
    if (!content) { alert('Gere a prévia primeiro.'); return; }

    const printArea = document.getElementById('print-area');
    printArea.innerHTML = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'Cormorant Garamond', 'Times New Roman', serif; font-size: 12pt; line-height: 1.85; color: #111; }
      h1 { font-size: 13pt; font-weight: 700; text-align: center; text-transform: uppercase; letter-spacing: .1em; margin-bottom: 1.5rem; border-bottom: 1.5px solid #222; padding-bottom: .75rem; }
      h2 { font-size: 11.5pt; font-weight: 700; text-transform: uppercase; margin: 1.5rem 0 .5rem; letter-spacing: .05em; }
      p { margin-bottom: .75rem; text-align: justify; }
      .doc-date { text-align: right; font-size: 10.5pt; color: #555; font-style: italic; margin-bottom: 1.25rem; }
      .parties-box { border: 1px solid #bbb; background: #f9f9f7; padding: .9rem 1.1rem; margin: .9rem 0 1.4rem; }
      .parties-box p { margin-bottom: .3rem; }
      .sig-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; margin-top: 3rem; }
      .sig-line { border-top: 1px solid #444; padding-top: .5rem; text-align: center; font-size: 10pt; }
      @page { margin: 2.5cm 3cm; }
    </style>
    ${content}
  `;

    window.print();

    setTimeout(() => { printArea.innerHTML = ''; }, 2000);
    showToast('✓ Use "Salvar como PDF" na janela de impressão', 'gold');
}