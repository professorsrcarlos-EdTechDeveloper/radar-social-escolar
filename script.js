const STORAGE_KEY='radarSocialEscolar2';
const hoje=new Date().toISOString().slice(0,10);
const mesAtual=hoje.slice(0,7);
const USUARIOS_SISTEMA={
  secretaria:{
    nome:'Luciene Leonardo',
    perfil:'Secretária Escolar',
    permissao:'Visualiza e atualiza o necessário: frequência, alunos, contatos, comunicados, alarmes e geração de dados administrativos.',
    acesso:'necessario',
    telas:['dashboard','frequencia','risco','acoes','familia','alarmes','comunicados','resumo','dados','relatorios','alunos'],
    dados:['frequencia','alunos','alarmes','acoes','familia','completo']
  },
  gestor:{
    nome:'Cleilson Paiva',
    perfil:'Gestor Escolar',
    permissao:'Acesso total de gestão: todos os painéis, decisões, relatórios, dados, alarmes, rede e acompanhamento geral.',
    acesso:'total',
    telas:['dashboard','frequencia','risco','acoes','familia','fluxo','plano','termometro','efetividade','conselho','orientador','rede','comunicados','resumo','alarmes','dados','relatorios','alunos'],
    dados:['frequencia','alunos','alarmes','acoes','familia','orientador','rede','completo']
  },
  coordenador:{
    nome:'Everaldo',
    perfil:'Coordenador Pedagógico',
    permissao:'Visualiza o necessário para coordenação: dashboard, frequência, risco, ações, família, termômetro, plano, comunicados, resumo e relatórios pedagógicos.',
    acesso:'necessario',
    telas:['dashboard','frequencia','risco','acoes','familia','fluxo','plano','termometro','efetividade','comunicados','resumo','alarmes','dados','relatorios','alunos'],
    dados:['frequencia','alunos','alarmes','acoes','familia','completo']
  },
  orientador:{
    nome:'Carlos Tavares',
    perfil:'Orientador Social',
    permissao:'Acesso total do orientador social: busca ativa, orientação social, rede de proteção, resumo de casos, alarmes e todos os relatórios.',
    acesso:'total',
    telas:['dashboard','frequencia','risco','acoes','familia','fluxo','plano','termometro','efetividade','conselho','orientador','rede','comunicados','resumo','alarmes','dados','relatorios','alunos'],
    dados:['frequencia','alunos','alarmes','acoes','familia','orientador','rede','completo']
  }
};
const nomes=['Ana Clara','Bruno Henrique','Camila Vitória','Daniel','Eduarda','Felipe','Gabriela','Heitor','Isadora','João Miguel','Karoline','Lucas Emanuel','Mariana','Nicolas','Paula Cristina','Rafael','Sofia','Thiago','Valentina','Wesley','Yasmin','Arthur','Bianca','Caio','Davi','Emanuelly','Fernando','Geovana','Heloísa','Igor'];
const sobrenomes=['Santos','Lima','Rocha','Pereira','Silva','Costa','Sousa','Nascimento','Fernandes','Araújo','Martins','Gomes','Oliveira','Ferreira','Nunes','Teixeira','Almeida','Moura','Barbosa','Bezerra','Cavalcante','Dantas','Freitas','Menezes','Queiroz','Ribeiro','Vieira','Correia','Batista','Moreira'];
const responsaveis=['Maria das Graças','José Carlos','Francisca Ana','Antônia Lúcia','João Batista','Raimunda Costa','Paulo Sérgio','Luciana Nascimento','Carlos Alberto','Marta Araújo','Pedro Henrique','Rosa Gomes','Sônia Oliveira','Marcos Ferreira','Eliane Nunes','Lúcia Teixeira','Adriana Almeida','Roberto Moura','Cláudia Bezerra','Francisco Cavalcante'];
const motivos=[
  'Não informado',
  'Escolar — desmotivação',
  'Escolar — dificuldade de aprendizagem',
  'Escolar — conflito com colegas',
  'Escolar — bullying',
  'Escolar — medo/vergonha',
  'Escolar — problema com professor',
  'Escolar — reprovação anterior',
  'Familiar — responsável não acompanha',
  'Familiar — mudança de residência',
  'Familiar — falta de rotina',
  'Familiar — separação familiar',
  'Familiar — trabalho doméstico',
  'Familiar — cuidado com irmãos',
  'Social — transporte',
  'Social — estrada/chuva',
  'Social — vulnerabilidade social',
  'Social — alimentação',
  'Social — saúde',
  'Social — violência',
  'Social — trabalho infantil',
  'Social — falta de documentos',
  'Consulta médica',
  'Falta justificada',
  'Sem contato'
];
let db=load();

let turmaSelecionadaAlunos='';
let alunoFichaAtualId='';

function id(){return 'id_'+Math.random().toString(36).slice(2)+Date.now().toString(36)}
function $(x){return document.getElementById(x)}
function toast(msg){$('toast').textContent=msg;$('toast').style.display='block';setTimeout(()=>$('toast').style.display='none',2400)}
function fmt(d){if(!d)return '-';let [y,m,da]=d.split('-');return `${da}/${m}/${y}`}
function aluno(idAluno){return db.alunos.find(a=>a.id===idAluno)}
function turmas(){return [...new Set(db.alunos.map(a=>a.turma))].sort((a,b)=>parseInt(a)-parseInt(b))}
function pct(a,b){return b?Math.round(a*100/b):0}
function escapeHtml(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}

function gerarAlunos(){
  const ts=['2º Ano U','3º Ano U','4º Ano U','5º Ano U','6º Ano U','7º Ano U','8º Ano U','9º Ano U'];
  const arr=[];
  ts.forEach((t,ti)=>{
    for(let i=0;i<30;i++){
      arr.push({id:id(),nome:`${nomes[i]} ${sobrenomes[(i+ti*2)%sobrenomes.length]} ${sobrenomes[(i+ti*5+6)%sobrenomes.length]}`,turma:t,responsavel:`${responsaveis[(i+ti)%responsaveis.length]} ${sobrenomes[(i+ti*3)%sobrenomes.length]}`,telefone:`(88) 9${String(9100+ti*100+i).padStart(4,'0')}-${String(1000+i+ti*53).padStart(4,'0')}`,
        contatos:[
          {referencia:'Responsável principal',nome:`${responsaveis[(i+ti)%responsaveis.length]} ${sobrenomes[(i+ti*3)%sobrenomes.length]}`,telefone:`(88) 9${String(9100+ti*100+i).padStart(4,'0')}-${String(1000+i+ti*53).padStart(4,'0')}`},
          {referencia:i%2===0?'Vó':'Tia',nome:`${responsaveis[(i+ti+4)%responsaveis.length]} ${sobrenomes[(i+ti+8)%sobrenomes.length]}`,telefone:`(88) 9${String(9400+ti*60+i).padStart(4,'0')}-${String(2000+i+ti*29).padStart(4,'0')}`}
        ]});
    }
  });
  return arr;
}
function load(){
  const s=localStorage.getItem(STORAGE_KEY);
  if(s){try{const x=JSON.parse(s); if(x.alunos?.length>=240) return x;}catch(e){}}
  const base={alunos:gerarAlunos(),frequencias:[],acoes:[],familia:[]};
  popularTeste(base);
  return base;
}
function garantirContatos(){
  if(!Array.isArray(db.orientador)) db.orientador=[];
  if(!Array.isArray(db.rede)) db.rede=[];
  if(!Array.isArray(db.alarmes)) db.alarmes=[];
  db.alunos.forEach((a,idx)=>{
    if(!Array.isArray(a.contatos)) a.contatos=[];
    if(a.telefone && !a.contatos.some(c=>c.telefone===a.telefone)){
      a.contatos.unshift({referencia:'Responsável principal',nome:a.responsavel||'Responsável',telefone:a.telefone});
    }
    if(a.contatos.length<2){
      a.contatos.push({referencia:idx%2===0?'Vó':'Tia',nome:'Contato alternativo',telefone:`(88) 9${String(9300+idx).padStart(4,'0')}-${String(3000+idx).padStart(4,'0')}`});
    }
  });
}
garantirContatos();
function save(){garantirContatos();localStorage.setItem(STORAGE_KEY,JSON.stringify(db))}

function dateAdd(base, offset){const d=new Date(base+'T12:00:00');d.setDate(d.getDate()+offset);return d.toISOString().slice(0,10)}
function popularTeste(base){
  const dataBase=hoje;
  const padraoFaltas={'2º Ano U':1,'3º Ano U':2,'4º Ano U':3,'5º Ano U':4,'6º Ano U':5,'7º Ano U':6,'8º Ano U':8,'9º Ano U':12};
  for(let off=-9;off<=0;off++){
    const data=dateAdd(dataBase,off);
    turmasBase().forEach(t=>{
      const alunos=base.alunos.filter(a=>a.turma===t);
      const faltasBase=padraoFaltas[t];
      const variacao=(Math.abs(off)%3)-1;
      const faltas=Math.max(0,Math.min(18,faltasBase+variacao));
      alunos.forEach((a,idx)=>{
        let status='Presente', motivo='Não informado';
        if(idx<faltas){status='Faltou';motivo=motivos[(idx+off+20)%motivos.length]}
        if(idx>=faltas && idx<faltas+1 && faltas>2){status='Falta justificada';motivo='Consulta médica'}
        base.frequencias.push({id:id(),data,alunoId:a.id,status,motivo,obs:''});
      });
    });
  }
  const turma9=base.alunos.filter(a=>a.turma==='9º Ano U').slice(0,10);
  turma9.forEach((a,i)=>base.acoes.unshift({id:id(),data:dateAdd(hoje,-i%4),alunoId:a.id,tipo:i%3===0?'Ligação':i%3===1?'Contato com família':'Mensagem WhatsApp',status:i%2?'Em acompanhamento':'Pendente',descricao:'Registro automático para teste: aluno do 9º ano em atenção por faltas recorrentes.'}));
  base.acoes.unshift({id:id(),data:hoje,alunoId:turma9[0].id,tipo:'Retorno confirmado',status:'Resolvido',descricao:'Responsável confirmou acompanhamento e retorno do estudante.'});
  ['2º Ano U','5º Ano U','9º Ano U'].forEach((t,ti)=>{
    base.alunos.filter(a=>a.turma===t).slice(0,5+ti).forEach((a,i)=>base.familia.unshift({id:id(),data:dateAdd(hoje,-i),alunoId:a.id,presenca:i%3===0?'Compareceu':i%3===1?'Agendado':'Não compareceu',compromisso:'Compromisso registrado para acompanhamento da frequência.'}));
  });
  // Registros de exemplo para o módulo Orientador Social e Rede de Proteção
  base.orientador = base.orientador || [];
  base.rede = base.rede || [];
  const criticos = base.alunos.filter(a=>a.turma==='9º Ano U').slice(0,6);
  criticos.forEach((a,i)=>{
    base.orientador.unshift({id:id(),data:dateAdd(hoje,-i),alunoId:a.id,tipo:i%2?'Contato com responsável':'Atendimento individual',prioridade:i<2?'Urgente':'Alta',motivo:'Faltas recorrentes',situacao:i%2?'Família contactada':'Em acompanhamento',descricao:'Atendimento de teste: aluno com faltas recorrentes e necessidade de acompanhamento socioeducativo.',plano:'Monitorar frequência por 15 dias, contatar responsável em caso de nova falta e avaliar necessidade de encaminhamento.'});
  });
  base.rede.unshift({id:id(),data:hoje,alunoId:criticos[0]?.id,tipo:'Encaminhamento ao CRAS',status:'Encaminhado',descricao:'Registro de teste: encaminhamento para avaliação de vulnerabilidade e apoio familiar.'});
  base.rede.unshift({id:id(),data:dateAdd(hoje,-1),alunoId:criticos[1]?.id,tipo:'Visita domiciliar',status:'Em acompanhamento',descricao:'Registro de teste: visita/contato domiciliar para entender motivo das faltas e atualizar contatos.'});
  base.alarmes = base.alarmes || [];
  base.alarmes.unshift({id:id(),data:hoje,alunoId:criticos[0]?.id,tipo:'Urgente',titulo:'Aluno crítico com risco de evasão',descricao:'Alarme de teste para acompanhamento imediato do 9º Ano U.',status:'novo',visualizadoEm:'',resolvidoEm:''});
  base.alarmes.unshift({id:id(),data:dateAdd(hoje,-1),alunoId:criticos[1]?.id,tipo:'Família sem retorno',titulo:'Responsável não compareceu',descricao:'Alarme de teste para família sem retorno após contato.',status:'visto',visualizadoEm:hoje,resolvidoEm:''});
  base.alarmes.unshift({id:id(),data:dateAdd(hoje,-2),alunoId:criticos[2]?.id,tipo:'Rede de proteção',titulo:'Encaminhamento concluído',descricao:'Alarme de teste já resolvido.',status:'resolvido',visualizadoEm:dateAdd(hoje,-2),resolvidoEm:dateAdd(hoje,-1)});
}
function turmasBase(){return ['2º Ano U','3º Ano U','4º Ano U','5º Ano U','6º Ano U','7º Ano U','8º Ano U','9º Ano U']}

function regsDia(d){return db.frequencias.filter(f=>f.data===d)}
function regsMes(m){return db.frequencias.filter(f=>f.data.startsWith(m))}
function faltasMesAluno(idAluno,m){return db.frequencias.filter(f=>f.alunoId===idAluno&&f.data.startsWith(m)&&f.status==='Faltou').length}
function badge(n){if(n>=8)return '<span class="badge red">Crítico</span>'; if(n>=5)return '<span class="badge orange">Atenção</span>'; if(n>=2)return '<span class="badge yellow">Monitorar</span>'; return '<span class="badge ok">Regular</span>'}

function init(){
  $('dashData').value=hoje;$('dashMes').value=mesAtual;$('freqData').value=hoje;$('riscoMes').value=mesAtual;$('acaoData').value=hoje;$('famData').value=hoje;$('relInicio').value=mesAtual+'-01';$('relFim').value=hoje;$('oriData').value=hoje;$('redeData').value=hoje;if($('dadosInicio'))$('dadosInicio').value=mesAtual+'-01';if($('dadosFim'))$('dadosFim').value=hoje;
  document.querySelectorAll('.nav').forEach(b=>b.onclick=()=>openScreen(b.dataset.screen));
  configurarLogin();
  $('dashData').onchange=renderDashboard;$('dashMes').onchange=renderDashboard;
  $('btnCarregar').onclick=renderFreq;$('btnTodos').onclick=()=>document.querySelectorAll('.status').forEach(s=>s.value='Presente');$('btnSalvarFreq').onclick=salvarFreq;
  $('btnAtualizarRisco').onclick=renderRisco;$('btnSalvarAcao').onclick=salvarAcao;$('btnSalvarFamilia').onclick=salvarFamilia;
  $('btnSalvarOrientador').onclick=salvarOrientador;
  $('btnSalvarRede').onclick=salvarRede;$('btnRel').onclick=()=>relatorio(true);$('btnPrint').onclick=()=>window.print(); if($('btnPrintConselho')) $('btnPrintConselho').onclick=()=>window.print(); $('btnAddAluno').onclick=addAluno;
  $('btnLimparAlunos').onclick=limparVisualizacaoAlunos;
  $('btnTurmas').onclick=(ev)=>{ev.stopPropagation();document.querySelector('.turma-picker').classList.toggle('open');};
  document.addEventListener('click',(ev)=>{
    const picker=document.querySelector('.turma-picker');
    if(picker && !picker.contains(ev.target)) picker.classList.remove('open');
  });
  $('btnFecharFicha').onclick=fecharFichaAluno;
  $('btnAdicionarContato').onclick=adicionarContatoAluno;
  $('buscaAluno').oninput=buscarAlunoDigitado;
  $('btnExportar').onclick=exportar;$('inputImportar').onchange=importar;$('btnReset').onclick=resetar;
  if($('btnSairSistema')) $('btnSairSistema').onclick=sairSistema;
  if($('btnGerarComunicado')) $('btnGerarComunicado').onclick=gerarComunicado;
  if($('btnCopiarComunicado')) $('btnCopiarComunicado').onclick=copiarComunicado;
  if($('btnRegistrarComunicado')) $('btnRegistrarComunicado').onclick=registrarComunicado;
  if($('btnGerarResumo')) $('btnGerarResumo').onclick=gerarResumoCaso;
  if($('btnPrintResumo')) $('btnPrintResumo').onclick=()=>window.print();
  if($('btnGerarDados')) $('btnGerarDados').onclick=gerarDadosTela;
  if($('btnImprimirDados')) $('btnImprimirDados').onclick=()=>{gerarDadosTela();window.print();};
  if($('btnExportarCSV')) $('btnExportarCSV').onclick=exportarCSV;
  if($('btnLimparDadosTela')) $('btnLimparDadosTela').onclick=()=>{$('dadosArea').innerHTML='';};
  if($('alertaUrgente')) $('alertaUrgente').onclick=abrirCentralAlarmes;
  if($('alertaFlutuante')) $('alertaFlutuante').onclick=abrirCentralAlarmes;
  if($('btnDispararAlarme')) $('btnDispararAlarme').onclick=dispararAlarmeManual;
  if($('btnBuscarAlarmes')) $('btnBuscarAlarmes').onclick=()=>renderAlarmes(true);
  if($('btnLimparBuscaAlarmes')) $('btnLimparBuscaAlarmes').onclick=limparBuscaAlarmes;
  preencherSelects();renderAll();
}
function preencherSelects(){
  const turmaAll='<option value="">Todas</option>'+turmas().map(t=>`<option>${t}</option>`).join('');
  $('riscoTurma').innerHTML=turmaAll;$('relTurma').innerHTML=turmaAll;$('freqTurma').innerHTML=turmas().map(t=>`<option>${t}</option>`).join('');
  const optAll='<option value="">Todos</option>'+db.alunos.map(a=>`<option value="${a.id}">${a.nome} — ${a.turma} — ${a.responsavel}</option>`).join('');
  $('relAluno').innerHTML=optAll;
  const opt=db.alunos.map(a=>`<option value="${a.id}">${a.nome} — ${a.turma} — Resp.: ${a.responsavel}</option>`).join('');
  $('acaoAluno').innerHTML=opt;$('famAluno').innerHTML=opt;$('oriAluno').innerHTML=opt;$('redeAluno').innerHTML=opt;if($('comAluno')) $('comAluno').innerHTML=opt;if($('resAluno')) $('resAluno').innerHTML=opt;if($('alarmeAluno')) $('alarmeAluno').innerHTML=opt;if($('dadosAluno')) $('dadosAluno').innerHTML=opt;if($('dadosTurma')) $('dadosTurma').innerHTML=turmaAll;
  if($('menuTurmas')) $('menuTurmas').innerHTML=turmas().map(t=>`<button class="turma-option" type="button" onclick="selecionarTurmaAlunos('${t}')">${t}</button>`).join('');
}
function openScreen(idS){
  if(!podeAcessarTela(idS)) return mostrarAcessoNegado(idS);
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  $(idS).classList.add('active');
  document.querySelectorAll('.nav').forEach(n=>n.classList.toggle('active',n.dataset.screen===idS));
  if(idS==='dashboard')renderDashboard();
  if(idS==='frequencia')renderFreq();
  if(idS==='risco')renderRisco();
  if(idS==='familia')renderFamilia();
  if(idS==='fluxo')renderFluxo();
  if(idS==='plano')renderPlano();
  if(idS==='termometro')renderTermometro();
  if(idS==='efetividade')renderEfetividade();
  if(idS==='conselho')renderConselho();
  if(idS==='comunicados')gerarComunicado();
  if(idS==='resumo')gerarResumoCaso();
  if(idS==='alarmes')renderAlarmes();
  if(idS==='dados')gerarDadosTela();
  if(idS==='alunos')renderAlunos();
  if(idS==='orientador')renderOrientador();
  if(idS==='rede')renderRede();
  if(idS==='relatorios')relatorio(false);

  const main = document.querySelector('.main');
  if(main) main.scrollTop = 0;
  window.scrollTo({top:0, left:0, behavior:'auto'});
  requestAnimationFrame(()=>{
    if(main) main.scrollTop = 0;
    window.scrollTo({top:0, left:0, behavior:'auto'});
  });
}
function renderAll(){preencherSelects();renderDashboard();renderFreq();renderRisco();renderAcoes();renderFamilia();renderFluxo();renderPlano();renderTermometro();renderEfetividade();renderConselho();renderOrientador();renderRede();renderAlarmes();atualizarSetorAlarmes();renderAlunos();relatorio(false);aplicarPermissoesVisuais();}

function renderDashboard(){
  const d=$('dashData').value||hoje,m=$('dashMes').value||mesAtual,r=regsDia(d),rm=regsMes(m);
  const pres=r.filter(x=>x.status==='Presente').length,falt=r.filter(x=>x.status==='Faltou').length,just=r.filter(x=>x.status==='Falta justificada').length,total=r.length;
  const faltMes=rm.filter(x=>x.status==='Faltou').length;
  const risco=db.alunos.filter(a=>faltasMesAluno(a.id,m)>=2).length, crit=db.alunos.filter(a=>faltasMesAluno(a.id,m)>=8).length;
  const acoes=db.acoes.filter(a=>a.data.startsWith(m)).length, fam=db.familia.filter(f=>f.data.startsWith(m)&&f.presenca==='Compareceu').length, atend=(db.orientador||[]).filter(o=>o.data&&o.data.startsWith(m)).length, redeAberta=(db.rede||[]).filter(r=>r.data&&r.data.startsWith(m)&&r.status!=='Resolvido').length;
  $('kpis').innerHTML=[
    ['Alunos',db.alunos.length,'base PQF'],['Presença',pct(pres,total)+'%',`${pres}/${total} lançados`],['Faltas hoje',falt,`${just} justificadas`],['Faltas mês',faltMes,'acumulado'],['Em risco',risco,'2+ faltas'],['Críticos',crit,'8+ faltas'],['Ações',acoes,'busca ativa'],['Famílias',fam,'comparecimentos'],['Atend. social',atend,'orientador'],['Rede aberta',redeAberta,'encaminhamentos']
  ].map(k=>`<div class="kpi"><span>${k[0]}</span><b>${k[1]}</b><small>${k[2]}</small></div>`).join('');
  chartTurmas(d);donut(pres,falt,just);lineChart();riscoCards(m);ranking(d);motivosChart(m);funil(m);familiaChart(m);criticos(m);
}
function chartTurmas(d){
  $('barsTurmas').innerHTML=turmas().map(t=>{
    const ids=db.alunos.filter(a=>a.turma===t).map(a=>a.id), r=regsDia(d).filter(x=>ids.includes(x.alunoId)), p=r.filter(x=>x.status==='Presente').length, per=pct(p,r.length||ids.length), cls=per<75?'ruim':per<88?'media':'';
    return `<div class="bar-row"><div class="bar-label">${t}</div><div class="bar-track"><div class="bar-fill ${cls}" style="width:${per}%"></div></div><div class="bar-value">${per}%</div></div>`;
  }).join('');
}
function donut(p,f,j){
  const total=p+f+j,p1=pct(p,total),p2=pct(f,total);
  $('donutDia').innerHTML=`<div><div class="donut" style="background:conic-gradient(#22c55e 0 ${p1}%, #ef4444 ${p1}% ${p1+p2}%, #facc15 ${p1+p2}% 100%)"><div class="donut-center"><b>${p1}%</b><span>presença</span></div></div><div class="legend"><span><i class="ld" style="background:#22c55e"></i>Presentes ${p}</span><span><i class="ld" style="background:#ef4444"></i>Faltas ${f}</span><span><i class="ld" style="background:#facc15"></i>Just. ${j}</span></div></div>`;
}
function lineChart(){
  const c=$('lineChart'),ctx=c.getContext('2d'),w=c.width,h=c.height;ctx.clearRect(0,0,w,h);ctx.fillStyle='#071322';ctx.fillRect(0,0,w,h);
  const dias=[...new Set(db.frequencias.map(f=>f.data))].sort().slice(-15), vals=dias.map(d=>{const r=regsDia(d);return pct(r.filter(x=>x.status==='Presente').length,r.length)});
  ctx.strokeStyle='#18324d';ctx.fillStyle='#9eb4cc';ctx.font='12px Arial';for(let i=0;i<=5;i++){let y=20+(h-55)*i/5;ctx.beginPath();ctx.moveTo(45,y);ctx.lineTo(w-20,y);ctx.stroke();ctx.fillText((100-i*20)+'%',8,y+4)}
  if(vals.length<2){ctx.fillText('Dados de teste já foram carregados. Reinicie caso não apareçam.',55,130);return}
  ctx.strokeStyle='#38bdf8';ctx.lineWidth=4;ctx.beginPath();vals.forEach((v,i)=>{let x=45+(w-75)*i/(vals.length-1),y=20+(h-55)*(100-v)/100;if(i)ctx.lineTo(x,y);else ctx.moveTo(x,y)});ctx.stroke();
  ctx.fillStyle='#22c55e';vals.forEach((v,i)=>{let x=45+(w-75)*i/(vals.length-1),y=20+(h-55)*(100-v)/100;ctx.beginPath();ctx.arc(x,y,5,0,7);ctx.fill()});
}
function riscoCards(m){
  const reg=db.alunos.filter(a=>faltasMesAluno(a.id,m)<2).length, ama=db.alunos.filter(a=>faltasMesAluno(a.id,m)>=2&&faltasMesAluno(a.id,m)<5).length, lar=db.alunos.filter(a=>faltasMesAluno(a.id,m)>=5&&faltasMesAluno(a.id,m)<8).length, ver=db.alunos.filter(a=>faltasMesAluno(a.id,m)>=8).length;
  $('riscoCards').innerHTML=[['Regular',reg,'ok'],['Monitorar',ama,'yellow'],['Atenção',lar,'orange'],['Crítico',ver,'red']].map(x=>`<div class="risk-card"><span class="badge ${x[2]}">${x[0]}</span><b>${x[1]}</b><span>alunos</span></div>`).join('');
}
function ranking(d){
  const arr=turmas().map(t=>{const ids=db.alunos.filter(a=>a.turma===t).map(a=>a.id),r=regsDia(d).filter(x=>ids.includes(x.alunoId)),f=r.filter(x=>x.status==='Faltou').length,per=pct(r.filter(x=>x.status==='Presente').length,r.length||ids.length);return{t,f,per}}).sort((a,b)=>b.f-a.f);
  $('rankingTurmas').innerHTML=arr.map(x=>`<div class="item"><div><strong>${x.t}</strong><small>${x.f} faltas hoje</small></div><span class="badge ${x.f>=10?'red':x.f>=5?'orange':'ok'}">${x.per}%</span></div>`).join('');
}
function motivosChart(m){
  const c={};regsMes(m).filter(f=>f.status!=='Presente').forEach(f=>c[f.motivo||'Não informado']=(c[f.motivo||'Não informado']||0)+1);const arr=Object.entries(c).sort((a,b)=>b[1]-a[1]).slice(0,7),max=Math.max(1,...arr.map(x=>x[1]));
  $('motivosChart').innerHTML=arr.map(([k,v])=>`<div class="bar-row"><div class="bar-label">${k}</div><div class="bar-track"><div class="bar-fill media" style="width:${pct(v,max)}%"></div></div><div class="bar-value">${v}</div></div>`).join('')||'<p>Sem motivos registrados.</p>';
}
function funil(m){
  const ac=db.acoes.filter(a=>a.data.startsWith(m));const tipos=['Contato com família','Mensagem WhatsApp','Ligação','Reunião','Visita domiciliar','Encaminhamento ao CRAS','Encaminhamento ao Conselho Tutelar','Retorno confirmado'];
  $('funilChart').innerHTML=tipos.map(t=>`<div class="step"><span>${t}</span><b>${ac.filter(a=>a.tipo===t).length}</b></div>`).join('');
}
function familiaChart(m){
  const c={};db.familia.filter(f=>f.data.startsWith(m)).forEach(f=>c[f.presenca]=(c[f.presenca]||0)+1);const arr=['Compareceu','Agendado','Não compareceu','Remarcado'].map(x=>[x,c[x]||0]),max=Math.max(1,...arr.map(x=>x[1]));
  $('familiaChart').innerHTML=arr.map(([k,v])=>`<div class="bar-row"><div class="bar-label">${k}</div><div class="bar-track"><div class="bar-fill" style="width:${pct(v,max)}%"></div></div><div class="bar-value">${v}</div></div>`).join('');
}
function criticos(m){
  const l=db.alunos.map(a=>({a,n:faltasMesAluno(a.id,m)})).filter(x=>x.n>=8).sort((a,b)=>b.n-a.n);
  $('tblCriticos').innerHTML=l.map(x=>{const ua=db.acoes.find(a=>a.alunoId===x.a.id);return `<tr><td><strong>${x.a.nome}</strong></td><td>${x.a.turma}</td><td>${x.a.responsavel}</td><td>${x.a.telefone}</td><td>${x.n}</td><td>${ua?fmt(ua.data)+' — '+ua.tipo:'Sem ação registrada'}</td><td>${badge(x.n)}</td></tr>`}).join('')||'<tr><td colspan="7">Nenhum aluno crítico.</td></tr>';
}

function renderFreq(){
  const d=$('freqData').value||hoje,t=$('freqTurma').value||turmas()[0];
  $('tblFreq').innerHTML=db.alunos.filter(a=>a.turma===t).map(a=>{const r=db.frequencias.find(f=>f.data===d&&f.alunoId===a.id)||{};return `<tr data-id="${a.id}"><td><strong>${a.nome}</strong><br><small>${a.turma}</small></td><td>${a.responsavel}</td><td>${a.telefone}</td><td><select class="status"><option ${r.status==='Presente'?'selected':''}>Presente</option><option ${r.status==='Faltou'?'selected':''}>Faltou</option><option ${r.status==='Falta justificada'?'selected':''}>Falta justificada</option></select></td><td><select class="motivo">${motivos.map(m=>`<option ${r.motivo===m?'selected':''}>${m}</option>`).join('')}</select></td><td><input class="obs" value="${escapeHtml(r.obs||'')}" placeholder="Observação"></td></tr>`}).join('');
}
function salvarFreq(){
  const d=$('freqData').value||hoje;document.querySelectorAll('#tblFreq tr').forEach(tr=>{const alunoId=tr.dataset.id;db.frequencias=db.frequencias.filter(f=>!(f.data===d&&f.alunoId===alunoId));db.frequencias.push({id:id(),data:d,alunoId,status:tr.querySelector('.status').value,motivo:tr.querySelector('.motivo').value,obs:tr.querySelector('.obs').value.trim()})});save();renderAll();toast('Frequência salva.');
}
function renderRisco(){
  const m=$('riscoMes').value||mesAtual,t=$('riscoTurma').value;
  const l=db.alunos.filter(a=>!t||a.turma===t).map(a=>({a,n:faltasMesAluno(a.id,m)})).filter(x=>x.n>=2).sort((a,b)=>b.n-a.n);
  $('tblRisco').innerHTML=l.map(x=>{const hist=regsMes(m).filter(f=>f.alunoId===x.a.id&&f.status!=='Presente').map(f=>`${fmt(f.data)} (${f.motivo})`).join('<br>');return `<tr><td>${badge(x.n)}</td><td><strong>${x.a.nome}</strong></td><td>${x.a.turma}</td><td>${x.a.responsavel}</td><td>${x.a.telefone}</td><td>${x.n}</td><td>${hist}</td><td><button class="btn primary" onclick="prepararAcao('${x.a.id}')">Registrar</button> <button class="btn danger" onclick="dispararAlarmeRapido('${x.a.id}','Aluno em risco por faltas recorrentes')">Alarme</button></td></tr>`}).join('')||'<tr><td colspan="8">Nenhum aluno em risco.</td></tr>';
}
function prepararAcao(idAluno){openScreen('acoes');$('acaoAluno').value=idAluno;$('acaoTipo').value='Contato com família';$('acaoStatus').value='Em acompanhamento';$('acaoDesc').focus()}
function salvarAcao(){const idAluno=$('acaoAluno').value;if(!idAluno)return toast('Selecione um aluno.');db.acoes.unshift({id:id(),data:$('acaoData').value||hoje,alunoId:idAluno,tipo:$('acaoTipo').value,status:$('acaoStatus').value,descricao:$('acaoDesc').value.trim()});$('acaoDesc').value='';save();renderAll();toast('Ação salva.')}
function renderAcoes(){$('listaAcoes').innerHTML=db.acoes.slice(0,100).map(a=>{const al=aluno(a.alunoId);return `<div class="timeline-card"><strong>${fmt(a.data)} • ${a.tipo} • ${a.status}</strong><br><small>${al?.nome||'-'} — ${al?.turma||''} — Resp.: ${al?.responsavel||''}</small><p>${escapeHtml(a.descricao||'Sem descrição.')}</p></div>`}).join('')||'<p>Nenhuma ação registrada.</p>'}
function salvarFamilia(){const idAluno=$('famAluno').value;if(!idAluno)return toast('Selecione um aluno.');db.familia.unshift({id:id(),data:$('famData').value||hoje,alunoId:idAluno,presenca:$('famStatus').value,compromisso:$('famTexto').value.trim()});$('famTexto').value='';save();renderAll();toast('Família registrada.')}
function renderFamilia(){const lista=db.familia||[];$('listaFamilia').innerHTML=lista.slice(0,100).map(f=>{const al=aluno(f.alunoId);return `<div class="timeline-card"><strong>${fmt(f.data)} • ${f.presenca}</strong><br><small>${al?.nome||'-'} — ${al?.turma||''} — Resp.: ${al?.responsavel||''}</small><p>${escapeHtml(f.compromisso||'Sem compromisso informado.')}</p></div>`}).join('')||'<p>Nenhum registro.</p>';if($('familia360Kpis')){const chamadas=lista.length, compareceram=lista.filter(f=>f.presenca==='Compareceu').length, nao=lista.filter(f=>f.presenca==='Não compareceu').length, rem=lista.filter(f=>f.presenca==='Remarcado').length, semContato=db.alunos.filter(a=>!(a.contatos||[]).length).length, prioritarias=db.alunos.filter(a=>faltasMesAluno(a.id,$('dashMes')?.value||mesAtual)>=5).length;$('familia360Kpis').innerHTML=[[ 'Famílias chamadas', chamadas, 'registros' ],[ 'Compareceram', compareceram, 'presença' ],[ 'Não compareceram', nao, 'atenção' ],[ 'Remarcadas', rem, 'agenda' ],[ 'Sem contato atualizado', semContato, 'cadastro' ],[ 'Prioritárias', prioritarias, '5+ faltas' ]].map(k=>`<div class="kpi"><span>${k[0]}</span><b>${k[1]}</b><small>${k[2]}</small></div>`).join('');}if($('familiasPrioritarias')){const m=$('dashMes')?.value||mesAtual;const listaP=db.alunos.map(a=>({a,n:faltasMesAluno(a.id,m)})).filter(x=>x.n>=5).sort((a,b)=>b.n-a.n).slice(0,15);$('familiasPrioritarias').innerHTML=listaP.map(x=>`<div class="item"><div><strong>${x.a.responsavel||'Responsável'}</strong><small>${x.a.nome} — ${x.a.turma} — ${x.a.telefone||'-'}</small></div><span class="badge ${x.n>=8?'red':'orange'}">${x.n} faltas</span></div>`).join('')||'<p>Nenhuma família prioritária no momento.</p>';}}


function faltasAnoAluno(alunoId){return db.frequencias.filter(f=>f.alunoId===alunoId && f.status==='Faltou').length}
function diaSemanaNome(data){const dias=['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];return dias[new Date(data+'T12:00:00').getDay()]}
function diaMaisFaltaAluno(alunoId){const c={};db.frequencias.filter(f=>f.alunoId===alunoId && f.status==='Faltou').forEach(f=>{const d=diaSemanaNome(f.data);c[d]=(c[d]||0)+1});const arr=Object.entries(c).sort((a,b)=>b[1]-a[1]);return arr[0]?`${arr[0][0]} (${arr[0][1]})`:'-'}
function motivoMaisFrequenteAluno(alunoId){const c={};db.frequencias.filter(f=>f.alunoId===alunoId && f.status!=='Presente').forEach(f=>{const m=f.motivo||'Não informado';c[m]=(c[m]||0)+1});const arr=Object.entries(c).sort((a,b)=>b[1]-a[1]);return arr[0]?arr[0][0]:'-'}
function temRedeAberta(alunoId){return (db.rede||[]).some(r=>r.alunoId===alunoId && r.status!=='Resolvido')}
function nivelRiscoTexto(alunoId){const f=faltasMesAluno(alunoId,$('dashMes')?.value||mesAtual);if(temRedeAberta(alunoId)||f>=10) return 'Roxo — precisa de rede externa';if(f>=8) return 'Vermelho — caso crítico';if(f>=5) return 'Laranja — risco de abandono';if(f>=2) return 'Amarelo — começou a faltar';return 'Verde — frequência regular'}
function nivelRiscoAluno(alunoId){const txt=nivelRiscoTexto(alunoId);const cls=txt.startsWith('Roxo')?'roxo':txt.startsWith('Vermelho')?'red':txt.startsWith('Laranja')?'orange':txt.startsWith('Amarelo')?'yellow':'ok';return `<span class="badge ${cls}">${txt}</span>`}
function resumoSocialAluno(alunoId){const o=(db.orientador||[]).filter(x=>x.alunoId===alunoId).length;const r=(db.rede||[]).filter(x=>x.alunoId===alunoId).length;const f=(db.familia||[]).filter(x=>x.alunoId===alunoId).length;return `${o} atend. • ${r} rede • ${f} fam.`}
function acaoSugeridaPorFaltas(n){if(n>=10) return 'Encaminhamento para rede de proteção';if(n>=8) return 'Visita domiciliar ou busca ativa';if(n>=5) return 'Reunião com família';if(n>=3) return 'Ligação para responsável';if(n>=2) return 'Mensagem ao responsável';if(n>=1) return 'Observar e monitorar';return 'Frequência regular'}
function etapaBuscaAtiva(alunoId, mes){const f=faltasMesAluno(alunoId,mes);if(f===0)return 'Sem falta';const rede=temRedeAberta(alunoId);const retorno=db.acoes.some(a=>a.alunoId===alunoId && (a.tipo==='Retorno confirmado'||a.status==='Resolvido'));const acao=db.acoes.some(a=>a.alunoId===alunoId);const contato=db.acoes.some(a=>a.alunoId===alunoId && ['Contato com família','Mensagem WhatsApp','Ligação'].includes(a.tipo));if(rede)return 'Encaminhado';if(retorno)return 'Retorno registrado';if(acao)return 'Ação realizada';if(contato)return 'Família contactada';return 'Falta identificada'}
function renderFluxo(){if(!$('fluxoKpis'))return;const m=$('dashMes')?.value||mesAtual;const faltas=regsMes(m).filter(f=>f.status==='Faltou').length;const contactados=db.acoes.filter(a=>a.data.startsWith(m)&&['Contato com família','Mensagem WhatsApp','Ligação'].includes(a.tipo)).length;const retornos=db.acoes.filter(a=>a.data.startsWith(m)&&(a.tipo==='Retorno confirmado'||a.status==='Resolvido')).length;const semResp=(db.familia||[]).filter(f=>f.data.startsWith(m)&&f.presenca==='Não compareceu').length;const encaminhados=(db.rede||[]).filter(r=>r.data.startsWith(m)&&r.status!=='Resolvido').length;const resolvidos=[...db.acoes.filter(a=>a.data.startsWith(m)&&a.status==='Resolvido'),...(db.rede||[]).filter(r=>r.data.startsWith(m)&&r.status==='Resolvido')].length;const reincidentes=db.alunos.filter(a=>faltasMesAluno(a.id,m)>=5).length;$('fluxoKpis').innerHTML=[[ 'Faltas identificadas', faltas, 'no mês' ],[ 'Responsáveis contactados', contactados, 'ações de contato' ],[ 'Alunos que retornaram', retornos, 'retorno' ],[ 'Sem resposta da família', semResp, 'ausência de retorno' ],[ 'Casos encaminhados', encaminhados, 'rede externa' ],[ 'Casos resolvidos', resolvidos, 'finalizados' ],[ 'Casos reincidentes', reincidentes, '5+ faltas' ]].map(k=>`<div class="kpi"><span>${k[0]}</span><b>${k[1]}</b><small>${k[2]}</small></div>`).join('');const lista=db.alunos.map(a=>({a,n:faltasMesAluno(a.id,m)})).filter(x=>x.n>0).sort((a,b)=>b.n-a.n).slice(0,60);$('tblFluxo').innerHTML=lista.map(x=>{const ult=db.acoes.find(a=>a.alunoId===x.a.id);return `<tr><td><strong>${x.a.nome}</strong></td><td>${x.a.turma}</td><td>${x.n}</td><td>${etapaBuscaAtiva(x.a.id,m)}</td><td>${ult?fmt(ult.data)+' — '+ult.tipo:'Sem ação'}</td><td>${acaoSugeridaPorFaltas(x.n)} <button class="btn danger" onclick="dispararAlarmeRapido('${x.a.id}','Caso prioritário no fluxo de busca ativa')">Alarme</button></td></tr>`}).join('')||'<tr><td colspan="6">Nenhum caso no mês.</td></tr>'}
function renderPlano(){if(!$('planoCards'))return;const regras=[[ '1 falta sem justificativa', 'Observar e monitorar' ],[ '2 faltas na semana', 'Mensagem ao responsável' ],[ '3 faltas', 'Ligação para responsável' ],[ '5 faltas no mês', 'Reunião com família' ],[ '8 faltas', 'Visita domiciliar ou busca ativa' ],[ '10+ faltas', 'Encaminhamento para rede de proteção' ]];$('planoCards').innerHTML=regras.map(r=>`<div class="plan-card"><b>${r[0]}</b><span>${r[1]}</span></div>`).join('');const m=$('dashMes')?.value||mesAtual;const lista=db.alunos.map(a=>({a,n:faltasMesAluno(a.id,m)})).filter(x=>x.n>0).sort((a,b)=>b.n-a.n).slice(0,80);$('tblPlano').innerHTML=lista.map(x=>`<tr><td><strong>${x.a.nome}</strong></td><td>${x.a.turma}</td><td>${x.n}</td><td>${nivelRiscoAluno(x.a.id)}</td><td>${acaoSugeridaPorFaltas(x.n)}</td><td><button class="btn primary" onclick="prepararAcao('${x.a.id}')">Executar</button></td></tr>`).join('')||'<tr><td colspan="6">Nenhum aluno com ação sugerida.</td></tr>'}
function calcTendenciaTurma(turma){const ids=db.alunos.filter(a=>a.turma===turma).map(a=>a.id);const dias=[...new Set(db.frequencias.map(f=>f.data))].sort().slice(-10);const ult=dias.slice(-5), ant=dias.slice(0,5);const conta=arr=>arr.length?arr.reduce((s,d)=>s+db.frequencias.filter(f=>f.data===d&&ids.includes(f.alunoId)&&f.status==='Faltou').length,0):0;const u=conta(ult), a=conta(ant);if(a===0&&u===0)return 'Estável';if(a===0&&u>0)return `Piora +${u}`;const vari=Math.round(((u-a)/Math.max(a,1))*100);if(vari>0)return `Piora +${vari}%`;if(vari<0)return `Melhora ${vari}%`;return 'Estável'}
function renderTermometro(){if(!$('tblTermometro'))return;const m=$('dashMes')?.value||mesAtual;$('tblTermometro').innerHTML=turmas().map(t=>{const ids=db.alunos.filter(a=>a.turma===t).map(a=>a.id);const rm=regsMes(m).filter(f=>ids.includes(f.alunoId));const p=rm.filter(f=>f.status==='Presente').length;const per=pct(p,rm.length||1);const risco=db.alunos.filter(a=>a.turma===t&&faltasMesAluno(a.id,m)>=5).length;const fam=(db.familia||[]).filter(f=>ids.includes(f.alunoId)&&f.presenca==='Compareceu').length;const acoes=(db.acoes||[]).filter(a=>ids.includes(a.alunoId)).length;const tendencia=calcTendenciaTurma(t);let sit='Estável', cls='ok';if(per<75||risco>=6){sit='Crítico';cls='red'}else if(per<88||risco>=3){sit='Atenção';cls='orange'}else if(risco>=1){sit='Monitorar';cls='yellow'};let pcl='';if(per<75)pcl='critico';else if(per<88)pcl='ruim';else if(per<95)pcl='media';return `<tr><td><strong>${t}</strong></td><td><span class="percent-pill ${pcl}">${per}%</span></td><td>${risco}</td><td>${fam}</td><td>${acoes}</td><td>${tendencia}</td><td><span class="badge ${cls}">${sit}</span></td></tr>`}).join('')}
function renderEfetividade(){if(!$('tblEfetividade'))return;const tipos=['Ligação','Reunião','Visita domiciliar','Mensagem WhatsApp','Contato com família','Encaminhamento ao CRAS','Encaminhamento ao Conselho Tutelar'];$('tblEfetividade').innerHTML=tipos.map(t=>{const casos=(db.acoes||[]).filter(a=>a.tipo===t);const resolvidos=casos.filter(a=>a.status==='Resolvido').length;const retornoIds=new Set((db.acoes||[]).filter(a=>a.tipo==='Retorno confirmado').map(a=>a.alunoId));const retornos=casos.filter(a=>retornoIds.has(a.alunoId)).length;const efet=pct(retornos+resolvidos,casos.length||1);return `<tr><td>${t}</td><td>${casos.length}</td><td>${retornos}</td><td>${resolvidos}</td><td>${efet}%</td></tr>`}).join('')}
function renderConselho(){if(!$('relatorioConselho'))return;const m=$('dashMes')?.value||mesAtual;const total=regsMes(m);const pres=total.filter(x=>x.status==='Presente').length;const falt=total.filter(x=>x.status==='Faltou').length;const topTurmas=turmas().map(t=>{const ids=db.alunos.filter(a=>a.turma===t).map(a=>a.id);return {t,f:regsMes(m).filter(x=>ids.includes(x.alunoId)&&x.status==='Faltou').length}}).sort((a,b)=>b.f-a.f).slice(0,3);const crit=db.alunos.map(a=>({a,n:faltasMesAluno(a.id,m)})).filter(x=>x.n>=8).sort((a,b)=>b.n-a.n).slice(0,8);const motivoCont={};regsMes(m).filter(f=>f.status!=='Presente').forEach(f=>{motivoCont[f.motivo||'Não informado']=(motivoCont[f.motivo||'Não informado']||0)+1});const topMot=Object.entries(motivoCont).sort((a,b)=>b[1]-a[1]).slice(0,5);const fam=(db.familia||[]).filter(f=>f.data.startsWith(m));const compareceu=fam.filter(f=>f.presenca==='Compareceu').length;const pend=(db.rede||[]).filter(r=>r.data.startsWith(m)&&r.status!=='Resolvido').length;const resol=(db.acoes||[]).filter(a=>a.data.startsWith(m)&&a.status==='Resolvido').length + (db.rede||[]).filter(r=>r.data.startsWith(m)&&r.status==='Resolvido').length;$('relatorioConselho').innerHTML=`<h3>Relatório Mensal de Busca Ativa e Gestão de Casos — Radar Social Escolar 2.0</h3><p><b>Período de referência:</b> ${m}</p><p><b>Frequência geral da escola:</b> ${pct(pres,total.length||1)}% • <b>Faltas no mês:</b> ${falt}</p><h4>Turmas com maior ausência</h4><table><tr><th>Turma</th><th>Faltas</th></tr>${topTurmas.map(x=>`<tr><td>${x.t}</td><td>${x.f}</td></tr>`).join('')}</table><h4>Alunos críticos</h4><table><tr><th>Aluno</th><th>Turma</th><th>Faltas</th><th>Risco</th></tr>${crit.map(x=>`<tr><td>${x.a.nome}</td><td>${x.a.turma}</td><td>${x.n}</td><td>${nivelRiscoTexto(x.a.id)}</td></tr>`).join('')||'<tr><td colspan="4">Sem casos críticos.</td></tr>'}</table><h4>Motivos principais das faltas</h4><table><tr><th>Motivo</th><th>Quantidade</th></tr>${topMot.map(x=>`<tr><td>${x[0]}</td><td>${x[1]}</td></tr>`).join('')||'<tr><td colspan="2">Sem registros.</td></tr>'}</table><p><b>Ações realizadas pela escola:</b> ${(db.acoes||[]).filter(a=>a.data.startsWith(m)).length}</p><p><b>Participação das famílias:</b> ${compareceu} comparecimentos de ${fam.length} registros</p><p><b>Casos resolvidos:</b> ${resol}</p><p><b>Casos pendentes/encaminhados:</b> ${pend}</p><h4>Recomendações para o próximo mês</h4><ul><li>Concentrar monitoramento nas turmas com maior ausência.</li><li>Priorizar contato com famílias dos alunos com 5 ou mais faltas.</li><li>Registrar motivo da falta sempre que possível para qualificar a intervenção.</li><li>Acionar rede de proteção nos casos persistentes ou de maior vulnerabilidade.</li></ul>`}

function salvarOrientador(){
  const alunoId=$('oriAluno').value;
  if(!alunoId)return toast('Selecione um aluno.');
  db.orientador=db.orientador||[];
  db.orientador.unshift({
    id:id(),
    data:$('oriData').value||hoje,
    alunoId,
    tipo:$('oriTipo').value,
    prioridade:$('oriPrioridade').value,
    motivo:$('oriMotivo').value,
    situacao:$('oriSituacao').value,
    descricao:$('oriDescricao').value.trim(),
    plano:$('oriPlano').value.trim()
  });
  $('oriDescricao').value='';
  $('oriPlano').value='';
  save();renderAll();toast('Atendimento social salvo.');
}
function renderOrientador(){
  const lista=db.orientador||[];
  $('listaOrientador').innerHTML=lista.slice(0,120).map(o=>{
    const al=aluno(o.alunoId);
    const classe='prioridade-'+String(o.prioridade||'baixa').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    return `<div class="timeline-card">
      <strong>${fmt(o.data)} • ${o.tipo} • ${o.situacao}</strong><br>
      <small>${al?.nome||'-'} — ${al?.turma||''} — Resp.: ${al?.responsavel||''} — ${al?.telefone||''}</small>
      <div class="tagline"><span class="badge ${classe}">${o.prioridade}</span><span class="badge blue">${o.motivo}</span></div>
      <p>${escapeHtml(o.descricao||'Sem descrição.')}</p>
      <div class="plano"><strong>Plano:</strong> ${escapeHtml(o.plano||'Sem plano informado.')}</div>
    </div>`;
  }).join('') || '<p>Nenhum atendimento social registrado.</p>';
}
function salvarRede(){
  const alunoId=$('redeAluno').value;
  if(!alunoId)return toast('Selecione um aluno.');
  db.rede=db.rede||[];
  db.rede.unshift({
    id:id(),
    data:$('redeData').value||hoje,
    alunoId,
    tipo:$('redeTipo').value,
    status:$('redeStatus').value,
    descricao:$('redeDescricao').value.trim()
  });
  $('redeDescricao').value='';
  save();renderAll();toast('Registro da rede salvo.');
}
function renderRede(){
  const lista=db.rede||[];
  $('listaRede').innerHTML=lista.slice(0,120).map(r=>{
    const al=aluno(r.alunoId);
    const cls=r.status==='Resolvido'?'ok':r.status==='Aberto'?'yellow':r.status==='Aguardando retorno'?'orange':'blue';
    return `<div class="timeline-card">
      <strong>${fmt(r.data)} • ${r.tipo}</strong><br>
      <small>${al?.nome||'-'} — ${al?.turma||''} — Resp.: ${al?.responsavel||''} — ${al?.telefone||''}</small>
      <div class="tagline"><span class="badge ${cls}">${r.status}</span></div>
      <p>${escapeHtml(r.descricao||'Sem descrição.')}</p>
    </div>`;
  }).join('') || '<p>Nenhum registro da rede de proteção.</p>';
}

function relatorio(show){const ini=$('relInicio').value||hoje,fim=$('relFim').value||hoje,t=$('relTurma').value,idA=$('relAluno').value;let r=db.frequencias.filter(f=>f.data>=ini&&f.data<=fim).filter(f=>{const a=aluno(f.alunoId);return a&&(!t||a.turma===t)&&(!idA||a.id===idA)});const p=r.filter(x=>x.status==='Presente').length,fa=r.filter(x=>x.status==='Faltou').length,j=r.filter(x=>x.status==='Falta justificada').length;const ac=db.acoes.filter(a=>a.data>=ini&&a.data<=fim&&(!idA||a.alunoId===idA));const at=(db.orientador||[]).filter(a=>a.data>=ini&&a.data<=fim&&(!idA||a.alunoId===idA));const rd=(db.rede||[]).filter(a=>a.data>=ini&&a.data<=fim&&(!idA||a.alunoId===idA));$('relatorioArea').innerHTML=`<h3>Relatório Radar Social Escolar 2.0</h3><p><b>Período:</b> ${fmt(ini)} a ${fmt(fim)} ${t?'• <b>Turma:</b> '+t:''}</p><table><tr><th>Indicador</th><th>Resultado</th></tr><tr><td>Registros</td><td>${r.length}</td></tr><tr><td>Presenças</td><td>${p}</td></tr><tr><td>Faltas</td><td>${fa}</td></tr><tr><td>Justificadas</td><td>${j}</td></tr><tr><td>Taxa de presença</td><td>${pct(p,r.length)}%</td></tr><tr><td>Ações da escola</td><td>${ac.length}</td></tr><tr><td>Atendimentos do orientador social</td><td>${at.length}</td></tr><tr><td>Registros da rede de proteção</td><td>${rd.length}</td></tr></table>`;if(show)toast('Relatório gerado.')}
function renderAlunos(){
  garantirContatos();
  const hint=$('alunosHint'), wrap=$('alunosTableWrap'), info=$('alunosTurmaInfo');
  if(!turmaSelecionadaAlunos){
    $('tblAlunos').innerHTML='';
    hint.style.display='block';
    wrap.style.display='none';
    info.style.display='none';
    return;
  }
  const lista=db.alunos.filter(a=>a.turma===turmaSelecionadaAlunos);
  hint.style.display='none';
  wrap.style.display='block';
  info.style.display='block';
  info.innerHTML=`Turma selecionada: <strong>${turmaSelecionadaAlunos}</strong> • ${lista.length} alunos cadastrados. Clique no nome do aluno para abrir a ficha e os contatos.`;
  $('tblAlunos').innerHTML=lista.map(a=>{
    const n=faltasMesAluno(a.id,$('dashMes')?.value||mesAtual);
    return `<tr>
      <td><button class="aluno-link" onclick="abrirFichaAluno('${a.id}')">${a.nome}</button></td>
      <td>${a.turma}</td>
      <td>${a.responsavel||'-'}</td>
      <td>${a.telefone||'-'}</td>
      <td>${badge(n)}</td>
    </tr>`;
  }).join('');
}
function selecionarTurmaAlunos(turma){
  const picker=document.querySelector('.turma-picker'); if(picker) picker.classList.remove('open');
  turmaSelecionadaAlunos=turma;
  $('buscaAluno').value='';
  $('fichaAlunoPanel').style.display='none';
  renderAlunos();
}
function limparVisualizacaoAlunos(){
  turmaSelecionadaAlunos='';
  alunoFichaAtualId='';
  $('buscaAluno').value='';
  $('fichaAlunoPanel').style.display='none';
  renderAlunos();
}
function buscarAlunoDigitado(){
  const termo=$('buscaAluno').value.trim().toLowerCase();
  if(!termo){renderAlunos();return}
  const lista=db.alunos.filter(a=>a.nome.toLowerCase().includes(termo) || (a.responsavel||'').toLowerCase().includes(termo) || (a.telefone||'').includes(termo));
  $('alunosHint').style.display='none';
  $('alunosTableWrap').style.display='block';
  $('alunosTurmaInfo').style.display='block';
  $('alunosTurmaInfo').innerHTML=`Pesquisa: <strong>${escapeHtml($('buscaAluno').value)}</strong> • ${lista.length} resultado(s).`;
  $('tblAlunos').innerHTML=lista.map(a=>`<tr>
    <td><button class="aluno-link" onclick="abrirFichaAluno('${a.id}')">${a.nome}</button></td>
    <td>${a.turma}</td><td>${a.responsavel||'-'}</td><td>${a.telefone||'-'}</td><td>${badge(faltasMesAluno(a.id,$('dashMes')?.value||mesAtual))}</td>
  </tr>`).join('') || '<tr><td colspan="5">Nenhum aluno encontrado.</td></tr>';
}
function abrirFichaAluno(idA){
  garantirContatos();
  const a=aluno(idA); if(!a)return;
  alunoFichaAtualId=idA;
  $('buscaAluno').value=a.nome;
  $('fichaAlunoPanel').style.display='block';
  const faltas=faltasMesAluno(a.id,$('dashMes')?.value||mesAtual);
  $('fichaAlunoConteudo').innerHTML=`
    <div class="ficha-grid">
      <div class="ficha-card"><span>Aluno</span><b>${a.nome}</b></div>
      <div class="ficha-card"><span>Turma</span><b>${a.turma}</b></div>
      <div class="ficha-card"><span>Responsável principal</span><b>${a.responsavel||'-'}</b></div>
      <div class="ficha-card"><span>Telefone principal</span><b>${a.telefone||'-'}</b></div>
    </div>
    <div class="ficha-grid">
      <div class="ficha-card"><span>Faltas no mês</span><b>${faltas}</b></div>
      <div class="ficha-card"><span>Faltas no ano</span><b>${faltasAnoAluno(a.id)}</b></div>
      <div class="ficha-card"><span>Nível de risco</span><b>${nivelRiscoAluno(a.id)}</b></div>
      <div class="ficha-card"><span>Dia que mais falta</span><b>${diaMaisFaltaAluno(a.id)}</b></div>
    </div>
    <div class="ficha-grid">
      <div class="ficha-card"><span>Motivo frequente</span><b>${motivoMaisFrequenteAluno(a.id)}</b></div>
      <div class="ficha-card"><span>Total de contatos</span><b>${a.contatos.length}</b></div>
      <div class="ficha-card"><span>Histórico social</span><b>${resumoSocialAluno(a.id)}</b></div>
      <div class="ficha-card"><span>Ação rápida</span><b><button class="btn primary" onclick="prepararAcao('${a.id}')">Registrar ação</button></b></div>
    </div>
    <h3>Contatos do aluno</h3>
    <div class="contatos-list">
      ${a.contatos.map((c,i)=>`<div class="contato-card">
        <div><strong>${escapeHtml(c.referencia||'Contato')}</strong><small>${escapeHtml(c.nome||'-')} • ${escapeHtml(c.telefone||'-')}</small></div>
        <button class="btn danger" onclick="removerContatoAluno('${a.id}',${i})">Remover</button>
      </div>`).join('')}
    </div>`;
  setTimeout(()=>$('fichaAlunoPanel').scrollIntoView({behavior:'smooth',block:'start'}),80);
}
function fecharFichaAluno(){
  alunoFichaAtualId='';
  $('fichaAlunoPanel').style.display='none';
}
function adicionarContatoAluno(){
  if(!alunoFichaAtualId)return toast('Clique primeiro no nome de um aluno.');
  const a=aluno(alunoFichaAtualId); if(!a)return;
  const referencia=$('novoContatoReferencia').value.trim();
  const nome=$('novoContatoNome').value.trim();
  const telefone=$('novoContatoTelefone').value.trim();
  if(!referencia||!telefone)return toast('Informe referência e telefone do contato.');
  a.contatos=a.contatos||[];
  a.contatos.push({referencia,nome,telefone});
  $('novoContatoReferencia').value='';$('novoContatoNome').value='';$('novoContatoTelefone').value='';
  save(); abrirFichaAluno(a.id); toast('Contato adicionado.');
}
function removerContatoAluno(idA,idx){
  const a=aluno(idA); if(!a||!Array.isArray(a.contatos))return;
  if(!confirm('Remover este contato?'))return;
  a.contatos.splice(idx,1);
  save(); abrirFichaAluno(idA); toast('Contato removido.');
}
function addAluno(){
  const n=$('cadNome').value.trim(),t=$('cadTurma').value.trim(),r=$('cadResp').value.trim(),tel=$('cadTel').value.trim();
  if(!n||!t)return toast('Informe nome e turma.');
  db.alunos.push({id:id(),nome:n,turma:t,responsavel:r,telefone:tel,contatos:tel?[{referencia:'Responsável principal',nome:r||'Responsável',telefone:tel}]:[]});
  $('cadNome').value='';$('cadTurma').value='';$('cadResp').value='';$('cadTel').value='';
  turmaSelecionadaAlunos=t;
  save();renderAll();toast('Aluno adicionado.');
}
function removerAluno(idA){if(!confirm('Remover aluno?'))return;db.alunos=db.alunos.filter(a=>a.id!==idA);save();renderAll()}

function primeiroAlunoRisco(){
  const m=$('dashMes')?.value||mesAtual;
  const item=db.alunos.map(a=>({a,n:faltasMesAluno(a.id,m)})).sort((x,y)=>y.n-x.n)[0];
  return item?.a?.id || db.alunos[0]?.id || '';
}
function comunicadoTexto(alunoId,tipo){
  const a=aluno(alunoId); if(!a)return '';
  const m=$('dashMes')?.value||mesAtual;
  const faltas=faltasMesAluno(a.id,m);
  const escola='E.M.E.F. Pedro de Queiroz Ferreira';
  if(tipo==='Alerta de faltas'){
    return `Senhor(a) responsável por ${a.nome}, identificamos que o(a) estudante apresenta ${faltas} falta(s) registrada(s) neste mês. A ${escola} solicita contato ou comparecimento para conversarmos sobre a frequência e garantir a permanência do estudante nas aulas.\\n\\nPor favor, informe se há algum motivo específico para as ausências e atualize seus contatos caso necessário.`;
  }
  if(tipo==='Convite para reunião'){
    return `Senhor(a) responsável por ${a.nome}, a ${escola} solicita seu comparecimento para uma conversa sobre frequência, acompanhamento escolar e apoio ao estudante. Sua presença é importante para construirmos juntos um plano de acompanhamento.`;
  }
  if(tipo==='Atualização de contato'){
    return `Senhor(a) responsável por ${a.nome}, pedimos que atualize os contatos da família junto à escola. Informe telefone principal e contatos alternativos, como mãe, pai, vó, tia, vizinha ou outro responsável de referência.`;
  }
  if(tipo==='Retorno positivo'){
    return `Senhor(a) responsável por ${a.nome}, registramos melhora/retorno no acompanhamento da frequência. A escola agradece a parceria da família e reforça a importância da presença diária do estudante.`;
  }
  return `Senhor(a) responsável por ${a.nome}, a ${escola} informa que o caso está em acompanhamento pela escola/orientação social. Solicitamos contato para alinharmos providências, atualização de informações e, se necessário, encaminhamento à rede de proteção.`;
}
function gerarComunicado(){
  if(!$('comAluno'))return;
  if(!$('comAluno').value) $('comAluno').value=primeiroAlunoRisco();
  const alunoId=$('comAluno').value;
  const tipo=$('comTipo').value;
  $('comTexto').value=comunicadoTexto(alunoId,tipo);
}
function copiarComunicado(){
  const txt=$('comTexto')?.value||'';
  if(!txt)return toast('Gere a mensagem primeiro.');
  navigator.clipboard?.writeText(txt).then(()=>toast('Mensagem copiada para WhatsApp.')).catch(()=>{
    $('comTexto').select();document.execCommand('copy');toast('Mensagem copiada.');
  });
}
function registrarComunicado(){
  const alunoId=$('comAluno')?.value;
  const texto=$('comTexto')?.value.trim();
  if(!alunoId||!texto)return toast('Gere a mensagem primeiro.');
  db.acoes.unshift({id:id(),data:hoje,alunoId,tipo:'Mensagem WhatsApp',status:'Em acompanhamento',descricao:texto});
  save();renderAll();toast('Comunicado registrado como ação.');
}
function gerarResumoCaso(){
  if(!$('resAluno'))return;
  if(!$('resAluno').value) $('resAluno').value=primeiroAlunoRisco();
  const a=aluno($('resAluno').value); if(!a)return;
  const m=$('dashMes')?.value||mesAtual;
  const faltas=faltasMesAluno(a.id,m);
  const ano=faltasAnoAluno(a.id);
  const acoes=(db.acoes||[]).filter(x=>x.alunoId===a.id);
  const fam=(db.familia||[]).filter(x=>x.alunoId===a.id);
  const ori=(db.orientador||[]).filter(x=>x.alunoId===a.id);
  const rede=(db.rede||[]).filter(x=>x.alunoId===a.id);
  $('resumoCasoArea').innerHTML=`
    <h3>Resumo do Caso — Radar Social Escolar 2.0</h3>
    <p><b>Aluno:</b> ${a.nome} • <b>Turma:</b> ${a.turma}</p>
    <div class="case-grid">
      <div class="case-box"><b>Responsável principal</b>${a.responsavel||'-'}<br>${a.telefone||'-'}</div>
      <div class="case-box"><b>Nível de risco</b>${nivelRiscoTexto(a.id)}</div>
      <div class="case-box"><b>Faltas no mês</b>${faltas}</div>
      <div class="case-box"><b>Faltas no ano</b>${ano}</div>
      <div class="case-box"><b>Dia que mais falta</b>${diaMaisFaltaAluno(a.id)}</div>
      <div class="case-box"><b>Motivo mais frequente</b>${motivoMaisFrequenteAluno(a.id)}</div>
    </div>
    <h4>Contatos cadastrados</h4>
    <table><tr><th>Referência</th><th>Nome</th><th>Telefone</th></tr>${(a.contatos||[]).map(c=>`<tr><td>${c.referencia||'-'}</td><td>${c.nome||'-'}</td><td>${c.telefone||'-'}</td></tr>`).join('')||'<tr><td colspan="3">Sem contatos alternativos.</td></tr>'}</table>
    <h4>Ações da escola</h4>
    <table><tr><th>Data</th><th>Ação</th><th>Status</th></tr>${acoes.map(x=>`<tr><td>${fmt(x.data)}</td><td>${x.tipo}</td><td>${x.status}</td></tr>`).join('')||'<tr><td colspan="3">Sem ações registradas.</td></tr>'}</table>
    <h4>Família</h4>
    <table><tr><th>Data</th><th>Situação</th><th>Compromisso</th></tr>${fam.map(x=>`<tr><td>${fmt(x.data)}</td><td>${x.presenca}</td><td>${escapeHtml(x.compromisso||'-')}</td></tr>`).join('')||'<tr><td colspan="3">Sem registros familiares.</td></tr>'}</table>
    <h4>Orientação Social</h4>
    <table><tr><th>Data</th><th>Atendimento</th><th>Prioridade</th><th>Situação</th></tr>${ori.map(x=>`<tr><td>${fmt(x.data)}</td><td>${x.tipo}</td><td>${x.prioridade}</td><td>${x.situacao}</td></tr>`).join('')||'<tr><td colspan="4">Sem atendimentos sociais.</td></tr>'}</table>
    <h4>Rede de Proteção</h4>
    <table><tr><th>Data</th><th>Registro</th><th>Status</th></tr>${rede.map(x=>`<tr><td>${fmt(x.data)}</td><td>${x.tipo}</td><td>${x.status}</td></tr>`).join('')||'<tr><td colspan="3">Sem encaminhamentos.</td></tr>'}</table>
    <h4>Recomendação automática</h4>
    <p>${acaoSugeridaPorFaltas(faltas)}</p>
  `;
}


function abrirCentralAlarmes(){
  marcarAlarmesComoVistos();
  openScreen('alarmes');
}
function statusAlarmeClasse(st){
  if(st==='resolvido') return 'resolvido';
  if(st==='visto') return 'visto';
  return 'novo';
}
function atualizarSetorAlarmes(){
  if(!$('setorAlarmesTopo')) return;
  const pendentes=(db.alarmes||[]).filter(a=>a.status!=='resolvido');
  const novos=pendentes.filter(a=>a.status==='novo');
  if(!pendentes.length){
    $('setorAlarmesTopo').style.display='none';
    if($('alertaFlutuante')) $('alertaFlutuante').style.display='none';
    return;
  }
  $('setorAlarmesTopo').style.display='flex';
  $('alertaContagem').textContent=String(pendentes.length);
  $('alertaTopoTexto').textContent=novos.length ? `${novos.length} novo(s) aguardando visualização` : `${pendentes.length} aguardando resolução`;
  $('alertaUrgente').classList.toggle('pulse', novos.length>0);
  if($('alertaFlutuante')){
    $('alertaFlutuante').style.display=novos.length>0 ? 'block' : 'none';
    $('alertaFlutuante').classList.toggle('pulse', novos.length>0);
    $('alertaFlutuante').textContent=`🚨 ${novos.length} alarme(s) urgente(s)`;
  }
}
function marcarAlarmesComoVistos(){
  let mudou=false;
  (db.alarmes||[]).forEach(a=>{
    if(a.status==='novo'){
      a.status='visto';
      a.visualizadoEm=hoje;
      mudou=true;
    }
  });
  if(mudou){save();}
  atualizarSetorAlarmes();
}
function dispararAlarmeManual(){
  const alunoId=$('alarmeAluno')?.value;
  const titulo=$('alarmeTitulo')?.value.trim();
  const tipo=$('alarmeTipo')?.value || 'Urgente';
  const descricao=$('alarmeDescricao')?.value.trim();
  if(!alunoId || !titulo) return toast('Selecione o aluno e informe o título do alarme.');
  db.alarmes = db.alarmes || [];
  db.alarmes.unshift({id:id(),data:hoje,alunoId,tipo,titulo,descricao,status:'novo',visualizadoEm:'',resolvidoEm:''});
  $('alarmeTitulo').value=''; $('alarmeDescricao').value='';
  save(); renderAll(); toast('Alarme disparado.');
}
function dispararAlarmeRapido(alunoId, tituloBase){
  const a=aluno(alunoId); if(!a) return;
  db.alarmes = db.alarmes || [];
  db.alarmes.unshift({id:id(),data:hoje,alunoId,tipo:'Urgente',titulo:tituloBase || `Alerta urgente para ${a.nome}`,descricao:'Alarme rápido criado a partir do monitoramento da frequência/risco.',status:'novo',visualizadoEm:'',resolvidoEm:''});
  save(); renderAll(); toast('Alarme urgente criado.');
}
function resolverAlarme(idAlarme){
  const a=(db.alarmes||[]).find(x=>x.id===idAlarme); if(!a) return;
  a.status='resolvido';
  a.visualizadoEm = a.visualizadoEm || hoje;
  a.resolvidoEm = hoje;
  save(); renderAll(); toast('Alarme resolvido.');
}
function visualizarAlarme(idAlarme){
  const a=(db.alarmes||[]).find(x=>x.id===idAlarme); if(!a) return;
  if(a.status==='novo'){
    a.status='visto';
    a.visualizadoEm=hoje;
    save();
  }
  renderAll();
}
function limparBuscaAlarmes(){
  if($('filtroAlarmeNome')) $('filtroAlarmeNome').value='';
  if($('filtroAlarmeData')) $('filtroAlarmeData').value='';
  renderAlarmes();
}
function renderAlarmes(filtrar=false){
  if(!$('tblAlarmes')) return;
  db.alarmes = db.alarmes || [];
  const nomeFiltro=($('filtroAlarmeNome')?.value||'').trim().toLowerCase();
  const dataFiltro=($('filtroAlarmeData')?.value||'').trim();
  let lista=[...db.alarmes];
  if(filtrar){
    if(nomeFiltro) lista=lista.filter(x=>(aluno(x.alunoId)?.nome||'').toLowerCase().includes(nomeFiltro));
    if(dataFiltro) lista=lista.filter(x=>x.data===dataFiltro || x.visualizadoEm===dataFiltro || x.resolvidoEm===dataFiltro);
  }
  lista.sort((a,b)=>(b.data||'').localeCompare(a.data||''));
  const total=lista.length;
  const pend=lista.filter(x=>x.status!=='resolvido').length;
  const novos=lista.filter(x=>x.status==='novo').length;
  const resolvidos=lista.filter(x=>x.status==='resolvido').length;
  if($('alarmesKpis')) $('alarmesKpis').innerHTML=[
    ['Total de alarmes',total,'histórico completo'],
    ['Pendentes',pend,'aguardando resolução'],
    ['Novos',novos,'ainda incomodando a tela'],
    ['Resolvidos',resolvidos,'finalizados']
  ].map(k=>`<div class="kpi"><span>${k[0]}</span><b>${k[1]}</b><small>${k[2]}</small></div>`).join('');
  $('tblAlarmes').innerHTML=lista.map(x=>{
    const al=aluno(x.alunoId);
    const visto=x.visualizadoEm?fmt(x.visualizadoEm):'-';
    const resol=x.resolvidoEm?fmt(x.resolvidoEm):'-';
    const dot=x.status==='novo'?'':x.status==='visto'?' dim':' off';
    return `<tr>
      <td>${fmt(x.data)}</td>
      <td><strong>${al?.nome||'-'}</strong></td>
      <td>${al?.turma||'-'}</td>
      <td>${x.titulo||'-'}</td>
      <td>${x.tipo||'-'}</td>
      <td><span class="alert-dot${dot}"></span> <span class="alarme-status ${statusAlarmeClasse(x.status)}">${x.status==='novo'?'Urgente':x.status==='visto'?'Visualizado':'Resolvido'}</span></td>
      <td>${visto}</td>
      <td>${resol}</td>
      <td>${x.status==='novo'?`<button class="btn primary" onclick="visualizarAlarme('${x.id}')">Visualizar</button>`:''} ${x.status!=='resolvido'?`<button class="btn success" onclick="resolverAlarme('${x.id}')">Resolver</button>`:''} <button class="btn outline" onclick="abrirResumoDoAlarme('${x.alunoId}','${x.id}')">Resumo</button></td>
    </tr>`;
  }).join('') || '<tr><td colspan="9">Nenhum alarme encontrado.</td></tr>';
}
function abrirResumoDoAlarme(alunoId,idAlarme){
  if(alunoId && $('resAluno')) $('resAluno').value=alunoId;
  if(idAlarme) visualizarAlarme(idAlarme);
  openScreen('resumo');
  gerarResumoCaso();
}



function usuarioAtualChave(){
  return localStorage.getItem('radarSessaoAtiva') || '';
}
function usuarioAtual(){
  const key=usuarioAtualChave();
  return USUARIOS_SISTEMA[key] || null;
}
function podeAcessarTela(tela){
  const u=usuarioAtual();
  if(!u) return false;
  return u.telas.includes(tela);
}
function podeVerDados(tipo){
  const u=usuarioAtual();
  if(!u) return false;
  return u.dados.includes(tipo);
}
function aplicarPermissoesVisuais(){
  const u=usuarioAtual();
  if(!u) return;
  document.querySelectorAll('.nav').forEach(btn=>{
    const tela=btn.dataset.screen;
    btn.classList.toggle('bloqueado', !u.telas.includes(tela));
  });
  atualizarOpcoesDadosPorPerfil();
}
function atualizarOpcoesDadosPorPerfil(){
  const sel=$('dadosTipo');
  if(!sel) return;
  const u=usuarioAtual();
  if(!u) return;
  [...sel.options].forEach(opt=>{
    opt.hidden=!u.dados.includes(opt.value);
    opt.disabled=!u.dados.includes(opt.value);
  });
  if(!u.dados.includes(sel.value)){
    sel.value=u.dados[0] || 'frequencia';
  }
}
function telaInicialDoPerfil(){
  const u=usuarioAtual();
  if(!u) return 'dashboard';
  if(u.telas.includes('dashboard')) return 'dashboard';
  return u.telas[0] || 'dashboard';
}
function mostrarAcessoNegado(tela){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  let bloqueio=$('acessoNegadoTela');
  if(!bloqueio){
    bloqueio=document.createElement('section');
    bloqueio.id='acessoNegadoTela';
    bloqueio.className='screen screen-bloqueada';
    bloqueio.innerHTML=`<div class="panel"><div class="acesso-negado-icone">🔒</div><h2>Acesso restrito</h2><p>Este módulo não faz parte da visualização necessária para o seu perfil de acesso.</p><button class="btn-sisme sisme-primary" onclick="openScreen(telaInicialDoPerfil())">Voltar ao painel permitido</button></div>`;
    document.querySelector('.main').appendChild(bloqueio);
  }
  bloqueio.classList.add('active');
}
function atualizarInfoLogin(){
  const key=$('loginUsuario')?.value || 'secretaria';
  const u=USUARIOS_SISTEMA[key];
  if($('loginPermissaoInfo')) $('loginPermissaoInfo').innerHTML=`<strong>${u.perfil} — ${u.nome}</strong><br>${u.permissao}`;
}


function aplicarLoginMobileDefinitivo(){
  const isMobile = /Android|iPhone|iPad|iPod|Mobile|SamsungBrowser|Opera Mini|IEMobile/i.test(navigator.userAgent) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 1);
  if(!isMobile) return;

  const overlay = $('loginOverlay');
  const card = document.querySelector('.login-card');
  if(!overlay || !card) return;

  const vv = window.visualViewport;
  const rawWidth = vv && vv.width ? vv.width : Math.min(window.innerWidth || 360, screen.width || 360);
  const safeWidth = Math.max(280, Math.min(340, Math.floor(rawWidth - 16)));
  const safeLeft = vv && typeof vv.offsetLeft === 'number' ? Math.max(0, Math.floor(vv.offsetLeft + 8)) : 8;
  const safeTop = vv && typeof vv.offsetTop === 'number' ? Math.max(0, Math.floor(vv.offsetTop + 8)) : 8;

  overlay.style.setProperty('display','block','important');
  overlay.style.setProperty('position','fixed','important');
  overlay.style.setProperty('left','0','important');
  overlay.style.setProperty('top','0','important');
  overlay.style.setProperty('right','auto','important');
  overlay.style.setProperty('bottom','auto','important');
  overlay.style.setProperty('width','100%','important');
  overlay.style.setProperty('min-width','0','important');
  overlay.style.setProperty('max-width','none','important');
  overlay.style.setProperty('height','100dvh','important');
  overlay.style.setProperty('overflow-y','auto','important');
  overlay.style.setProperty('overflow-x','hidden','important');
  overlay.style.setProperty('padding','8px','important');
  overlay.style.setProperty('box-sizing','border-box','important');
  overlay.style.setProperty('place-items','unset','important');
  overlay.style.setProperty('align-items','unset','important');
  overlay.style.setProperty('justify-items','unset','important');

  card.style.setProperty('display','block','important');
  card.style.setProperty('position','fixed','important');
  card.style.setProperty('left',safeLeft+'px','important');
  card.style.setProperty('top',safeTop+'px','important');
  card.style.setProperty('right','auto','important');
  card.style.setProperty('bottom','auto','important');
  card.style.setProperty('transform','none','important');
  card.style.setProperty('width',safeWidth+'px','important');
  card.style.setProperty('max-width',safeWidth+'px','important');
  card.style.setProperty('min-width','0','important');
  card.style.setProperty('margin','0','important');
  card.style.setProperty('padding','14px','important');
  card.style.setProperty('box-sizing','border-box','important');
  card.style.setProperty('overflow','visible','important');
  card.style.setProperty('border-radius','16px','important');

  const logo = document.querySelector('.login-logo');
  const info = $('loginPermissaoInfo');
  if(logo) logo.style.setProperty('display','none','important');
  if(info) info.style.setProperty('display','none','important');

  card.querySelectorAll('select,input,button').forEach(el=>{
    el.style.setProperty('width','100%','important');
    el.style.setProperty('max-width','100%','important');
    el.style.setProperty('box-sizing','border-box','important');
  });
}

function configurarLogin(){
  const sessao=localStorage.getItem('radarSessaoAtiva');
  if(sessao && USUARIOS_SISTEMA[sessao]){
    aplicarUsuario(sessao);
  }else{
    document.body.classList.remove('logado');
    if($('loginOverlay')) $('loginOverlay').style.display='block';
    window.scrollTo(0,0);
  }
  atualizarInfoLogin();
  if($('loginUsuario')) $('loginUsuario').onchange=atualizarInfoLogin;
  if($('btnEntrarSistema')) $('btnEntrarSistema').onclick=entrarSistema;
  if($('loginSenha')) $('loginSenha').addEventListener('keydown',e=>{if(e.key==='Enter')entrarSistema();});
}
function entrarSistema(){
  const user=$('loginUsuario')?.value||'secretaria';
  const senha=$('loginSenha')?.value||'';
  if(senha!=='1234') return toast('Senha incorreta. Use 1234 na versão de teste.');
  localStorage.setItem('radarSessaoAtiva',user);
  aplicarUsuario(user);
  window.scrollTo(0,0); toast('Acesso liberado: '+USUARIOS_SISTEMA[user].perfil);
}
function aplicarUsuario(user){
  const u=USUARIOS_SISTEMA[user]||USUARIOS_SISTEMA.secretaria;
  document.body.classList.add('logado');
  if($('loginOverlay')) $('loginOverlay').style.display='none';
  window.scrollTo(0,0);
  if($('usuarioAtivoTopo')) $('usuarioAtivoTopo').textContent=`${u.perfil} — ${u.nome}`;
  if($('permissaoTopo')) $('permissaoTopo').textContent=u.acesso==='total'?'Acesso total':'Visualização necessária';
  aplicarPermissoesVisuais();
}
function sairSistema(){
  localStorage.removeItem('radarSessaoAtiva');
  if($('loginSenha')) $('loginSenha').value='';
  document.body.classList.remove('logado'); if($('loginOverlay')) $('loginOverlay').style.display='block';
}
function linhaCSV(vals){
  return vals.map(v=>`"${String(v??'').replaceAll('"','""')}"`).join(';');
}
function dadosFiltrados(tipo){
  const ini=$('dadosInicio')?.value||'0000-01-01', fim=$('dadosFim')?.value||'9999-12-31';
  const turma=$('dadosTurma')?.value||'', alunoId=$('dadosAluno')?.value||'';
  const filtraAluno=aId=>{
    const a=aluno(aId); if(!a)return false;
    if(alunoId && aId!==alunoId)return false;
    if(turma && a.turma!==turma)return false;
    return true;
  };
  if(tipo==='frequencia') return db.frequencias.filter(f=>f.data>=ini&&f.data<=fim&&filtraAluno(f.alunoId));
  if(tipo==='alunos') return db.alunos.filter(a=>(!turma||a.turma===turma)&&(!alunoId||a.id===alunoId));
  if(tipo==='alarmes') return (db.alarmes||[]).filter(a=>(a.data>=ini&&a.data<=fim)&&filtraAluno(a.alunoId));
  if(tipo==='acoes') return (db.acoes||[]).filter(a=>(a.data>=ini&&a.data<=fim)&&filtraAluno(a.alunoId));
  if(tipo==='familia') return (db.familia||[]).filter(a=>(a.data>=ini&&a.data<=fim)&&filtraAluno(a.alunoId));
  if(tipo==='orientador') return (db.orientador||[]).filter(a=>(a.data>=ini&&a.data<=fim)&&filtraAluno(a.alunoId));
  if(tipo==='rede') return (db.rede||[]).filter(a=>(a.data>=ini&&a.data<=fim)&&filtraAluno(a.alunoId));
  return [];
}

function indicadoresDadosGerais(){
  const ini=$('dadosInicio')?.value||'0000-01-01';
  const fim=$('dadosFim')?.value||'9999-12-31';
  const turma=$('dadosTurma')?.value||'';
  const alunoId=$('dadosAluno')?.value||'';
  const filtraAluno=aId=>{
    const a=aluno(aId); if(!a)return false;
    if(alunoId && aId!==alunoId)return false;
    if(turma && a.turma!==turma)return false;
    return true;
  };
  const freqs=db.frequencias.filter(f=>f.data>=ini&&f.data<=fim&&filtraAluno(f.alunoId));
  const presentes=freqs.filter(f=>f.status==='Presente').length;
  const faltas=freqs.filter(f=>f.status==='Faltou').length;
  const justificadas=freqs.filter(f=>f.status==='Falta justificada').length;
  const alunosBase=db.alunos.filter(a=>(!turma||a.turma===turma)&&(!alunoId||a.id===alunoId));
  const acoes=(db.acoes||[]).filter(a=>a.data>=ini&&a.data<=fim&&filtraAluno(a.alunoId));
  const familia=(db.familia||[]).filter(a=>a.data>=ini&&a.data<=fim&&filtraAluno(a.alunoId));
  const orientador=(db.orientador||[]).filter(a=>a.data>=ini&&a.data<=fim&&filtraAluno(a.alunoId));
  const rede=(db.rede||[]).filter(a=>a.data>=ini&&a.data<=fim&&filtraAluno(a.alunoId));
  const alarmes=(db.alarmes||[]).filter(a=>a.data>=ini&&a.data<=fim&&filtraAluno(a.alunoId));
  const taxa=pct(presentes,freqs.length||1);
  const risco=alunosBase.filter(a=>faltasMesAluno(a.id,$('dashMes')?.value||mesAtual)>=5).length;
  const resolvidos=[...acoes.filter(a=>a.status==='Resolvido'),...rede.filter(r=>r.status==='Resolvido'),...alarmes.filter(a=>a.status==='resolvido')].length;
  const pendentes=[...rede.filter(r=>r.status!=='Resolvido'),...alarmes.filter(a=>a.status!=='resolvido')].length;
  return {ini,fim,turma,alunoId,freqs,presentes,faltas,justificadas,alunosBase,acoes,familia,orientador,rede,alarmes,taxa,risco,resolvidos,pendentes};
}
function classificarPerfilPercentual(percentual){
  if(percentual>=95) return {nivel:'Excelente',classe:'perfil-excelente',resumo:'frequência muito satisfatória e rotina escolar estável'};
  if(percentual>=90) return {nivel:'Bom',classe:'perfil-bom',resumo:'boa presença, com necessidade de manutenção preventiva'};
  if(percentual>=80) return {nivel:'Atenção preventiva',classe:'perfil-atencao',resumo:'presença razoável, exigindo acompanhamento antes de virar problema crítico'};
  if(percentual>=70) return {nivel:'Alerta',classe:'perfil-alerta',resumo:'queda relevante de presença, com necessidade de intervenção organizada'};
  return {nivel:'Crítico',classe:'perfil-critico',resumo:'risco elevado de evasão ou abandono, exigindo ação imediata e documentação do caso'};
}
function textoDetalhadoPorPerfil(percentual, contexto){
  const c=classificarPerfilPercentual(percentual);
  const u=usuarioAtual() || USUARIOS_SISTEMA.secretaria;
  const perfil=u.perfil;
  let foco='';
  if(perfil==='Gestor Escolar'){
    foco=`Como gestor, o foco deve ser a tomada de decisão: verificar turmas mais vulneráveis, cobrar registro das ações, acompanhar casos pendentes, avaliar se a família respondeu e definir encaminhamentos quando a escola já tentou contato.`;
  }else if(perfil==='Orientador Social'){
    foco=`Como orientador social, o foco deve ser transformar os dados em acompanhamento de caso: escuta, contato familiar, identificação de vulnerabilidade, plano de acompanhamento, visita/encaminhamento quando necessário e registro do retorno.`;
  }else if(perfil==='Coordenador Pedagógico'){
    foco=`Como coordenador pedagógico, o foco deve ser relacionar frequência com aprendizagem: identificar alunos que faltam em dias importantes, cruzar risco de falta com desempenho, orientar intervenção pedagógica e acompanhar turmas com tendência de piora.`;
  }else{
    foco=`Como secretária escolar, o foco deve ser manter os registros atualizados: frequência, contatos, responsáveis, justificativas, comunicados, alarmes visualizados e dados prontos para consulta da direção e equipe escolar.`;
  }
  let diagnostico='';
  let recomendacoes='';
  if(percentual>=95){
    diagnostico=`O resultado está em nível excelente. A presença está alta e indica boa adesão à rotina escolar. Mesmo assim, é importante manter a conferência dos registros para evitar perda de dados e continuar observando alunos que aparecem isoladamente em risco.`;
    recomendacoes=`Manter rotina de monitoramento semanal, registrar justificativas quando ocorrerem, valorizar turmas com boa presença e continuar usando os alarmes apenas para situações realmente prioritárias.`;
  }else if(percentual>=90){
    diagnostico=`O resultado é bom. A escola mantém controle geral da frequência, mas já existem sinais que devem ser acompanhados para não evoluírem para evasão ou abandono.`;
    recomendacoes=`Acompanhar os alunos reincidentes, reforçar comunicação com responsáveis, verificar motivos mais frequentes de ausência e usar o plano de ação automático para evitar crescimento das faltas.`;
  }else if(percentual>=80){
    diagnostico=`O resultado exige atenção preventiva. A frequência ainda não está em situação crítica, mas apresenta volume de faltas suficiente para impactar aprendizagem, rotina e resultados da escola.`;
    recomendacoes=`Priorizar estudantes com 3 ou mais faltas, registrar contato com a família, identificar motivo escolar/familiar/social e criar acompanhamento por turma nas próximas semanas.`;
  }else if(percentual>=70){
    diagnostico=`O resultado está em alerta. Há risco concreto de prejuízo escolar e necessidade de atuação conjunta entre secretaria, coordenação, gestão, orientação social e família.`;
    recomendacoes=`Realizar reunião com responsáveis, abrir alarmes para casos reincidentes, documentar todas as ações, verificar vulnerabilidade social e preparar encaminhamento quando a família não responder.`;
  }else{
    diagnostico=`O resultado é crítico. A frequência aponta risco elevado de evasão/abandono ou situação social que impede a permanência do aluno. A escola precisa comprovar identificação, contato, intervenção e encaminhamento.`;
    recomendacoes=`Acionar busca ativa imediata, registrar atendimento social, atualizar contatos alternativos, envolver família, avaliar rede de proteção e gerar resumo do caso para acompanhamento institucional.`;
  }
  return `<div class="texto-perfil-box ${c.classe}">
    <h4>Perfil do resultado: ${c.nivel} — ${percentual}%</h4>
    <p><strong>Leitura automática:</strong> ${diagnostico}</p>
    <p><strong>Texto para ${perfil}:</strong> ${foco}</p>
    <p><strong>Recomendação prática:</strong> ${recomendacoes}</p>
  </div>`;
}
function dashboardsDadosHTML(ind){
  const taxa=ind.taxa;
  const efetividade=pct(ind.resolvidos,(ind.acoes.length+ind.rede.length+ind.alarmes.length)||1);
  const participacaoFamilia=pct(ind.familia.filter(f=>f.presenca==='Compareceu').length,ind.familia.length||1);
  const classeBarra=taxa<70?'critico':taxa<85?'atencao':'';
  const classeEf=efetividade<35?'critico':efetividade<60?'atencao':'';
  const classeFam=participacaoFamilia<35?'critico':participacaoFamilia<60?'atencao':'';
  return `
    <div class="dados-dashboard-grid">
      <div class="dados-dash-card"><span>Dashboard 1 — Frequência</span><b>${taxa}%</b><small>${ind.presentes} presenças, ${ind.faltas} faltas e ${ind.justificadas} justificadas</small></div>
      <div class="dados-dash-card"><span>Dashboard 2 — Gestão de Casos</span><b>${ind.risco}</b><small>aluno(s) em risco no filtro atual</small></div>
      <div class="dados-dash-card"><span>Dashboard 3 — Resolução</span><b>${efetividade}%</b><small>${ind.resolvidos} resolvido(s), ${ind.pendentes} pendente(s)</small></div>
    </div>
    <div class="dados-mini-bars">
      <div class="dados-mini-row"><span>Frequência</span><div class="dados-mini-track"><div class="dados-mini-fill ${classeBarra}" style="width:${Math.min(taxa,100)}%"></div></div><b>${taxa}%</b></div>
      <div class="dados-mini-row"><span>Efetividade das ações</span><div class="dados-mini-track"><div class="dados-mini-fill ${classeEf}" style="width:${Math.min(efetividade,100)}%"></div></div><b>${efetividade}%</b></div>
      <div class="dados-mini-row"><span>Família presente</span><div class="dados-mini-track"><div class="dados-mini-fill ${classeFam}" style="width:${Math.min(participacaoFamilia,100)}%"></div></div><b>${participacaoFamilia}%</b></div>
    </div>
    ${textoDetalhadoPorPerfil(taxa,ind)}
  `;
}

function gerarDadosTela(){
  if(!$('dadosArea'))return;
  atualizarOpcoesDadosPorPerfil();
  const tipo=$('dadosTipo')?.value||'frequencia';
  if(!podeVerDados(tipo)){ $('dadosArea').innerHTML='<h3>Acesso restrito</h3><p>Este tipo de dado não está liberado para o seu perfil.</p>'; return; }
  if(tipo==='completo') return gerarResumoGeralDados();
  const dados=dadosFiltrados(tipo);
  const titulo=$('dadosTipo').options[$('dadosTipo').selectedIndex].text;
  const ind=indicadoresDadosGerais();
  let html=`<h3>${titulo} — Radar Social Escolar 3.4</h3><div class="perfil-alerta"><b>Perfil:</b> ${$('usuarioAtivoTopo')?.textContent||'-'}<br><b>Permissão:</b> ${usuarioAtual()?.permissao||'-'}</div><p><b>Data:</b> ${fmt(hoje)}</p>${dashboardsDadosHTML(ind)}`;
  if(tipo==='alunos'){
    html+=`<table><tr><th>Aluno</th><th>Turma</th><th>Responsável</th><th>Telefone</th><th>Contatos</th></tr>${dados.map(a=>`<tr><td>${a.nome}</td><td>${a.turma}</td><td>${a.responsavel||'-'}</td><td>${a.telefone||'-'}</td><td>${(a.contatos||[]).length}</td></tr>`).join('')||'<tr><td colspan="5">Sem dados.</td></tr>'}</table>`;
  }else{
    html+=`<table><tr><th>Data</th><th>Aluno</th><th>Turma</th><th>Tipo/Status</th><th>Descrição</th></tr>${dados.map(x=>{const a=aluno(x.alunoId);return `<tr><td>${fmt(x.data)}</td><td>${a?.nome||'-'}</td><td>${a?.turma||'-'}</td><td>${x.status||x.tipo||x.presenca||x.situacao||x.prioridade||x.status||'-'}</td><td>${escapeHtml(x.descricao||x.compromisso||x.titulo||x.motivo||x.obs||'-')}</td></tr>`}).join('')||'<tr><td colspan="5">Sem dados.</td></tr>'}</table>`;
  }
  $('dadosArea').innerHTML=html;
}
function gerarResumoGeralDados(){
  const m=$('dashMes')?.value||mesAtual;
  const regs=regsMes(m), pres=regs.filter(f=>f.status==='Presente').length, falt=regs.filter(f=>f.status==='Faltou').length;
  const alarmes=(db.alarmes||[]), pend=alarmes.filter(a=>a.status!=='resolvido').length;
  const ind=indicadoresDadosGerais();
  $('dadosArea').innerHTML=`<h3>Resumo Geral — Radar Social Escolar 3.4</h3>
  <p><b>Gerado por:</b> ${$('usuarioAtivoTopo')?.textContent||'-'} • <b>Mês:</b> ${m}</p>
  ${dashboardsDadosHTML(ind)}
  <table><tr><th>Indicador</th><th>Resultado</th></tr>
  <tr><td>Alunos cadastrados</td><td>${db.alunos.length}</td></tr>
  <tr><td>Registros de frequência</td><td>${regs.length}</td></tr>
  <tr><td>Taxa de presença</td><td>${pct(pres,regs.length||1)}%</td></tr>
  <tr><td>Faltas no mês</td><td>${falt}</td></tr>
  <tr><td>Ações da escola</td><td>${(db.acoes||[]).length}</td></tr>
  <tr><td>Registros familiares</td><td>${(db.familia||[]).length}</td></tr>
  <tr><td>Atendimentos do orientador social</td><td>${(db.orientador||[]).length}</td></tr>
  <tr><td>Rede de proteção</td><td>${(db.rede||[]).length}</td></tr>
  <tr><td>Alarmes pendentes</td><td>${pend}</td></tr></table>`;
}
function exportarCSV(){
  atualizarOpcoesDadosPorPerfil();
  const tipo=$('dadosTipo')?.value||'frequencia';
  if(!podeVerDados(tipo)) return toast('Seu perfil não tem acesso a este tipo de dado.');
  const dados= tipo==='completo' ? [] : dadosFiltrados(tipo);
  let csv='';
  if(tipo==='completo'){
    gerarResumoGeralDados();
    csv='Indicador;Resultado\n'+[
      ['Alunos cadastrados',db.alunos.length],
      ['Ações da escola',(db.acoes||[]).length],
      ['Atendimentos orientador',(db.orientador||[]).length],
      ['Alarmes',(db.alarmes||[]).length]
    ].map(linhaCSV).join('\n');
  }else if(tipo==='alunos'){
    csv=[linhaCSV(['Aluno','Turma','Responsável','Telefone','Contatos'])].concat(dados.map(a=>linhaCSV([a.nome,a.turma,a.responsavel,a.telefone,(a.contatos||[]).length]))).join('\n');
  }else{
    csv=[linhaCSV(['Data','Aluno','Turma','Tipo/Status','Descrição'])].concat(dados.map(x=>{const a=aluno(x.alunoId);return linhaCSV([fmt(x.data),a?.nome||'',a?.turma||'',x.status||x.tipo||x.presenca||x.situacao||x.prioridade||'',x.descricao||x.compromisso||x.titulo||x.motivo||x.obs||''])})).join('\n');
  }
  const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`radar-social-3-4-${tipo}-${hoje}.csv`;a.click();URL.revokeObjectURL(a.href);
}

function exportar(){const blob=new Blob([JSON.stringify(db,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='backup-radar-social-escolar-3-4.json';a.click();URL.revokeObjectURL(a.href)}
function importar(e){const file=e.target.files[0];if(!file)return;const fr=new FileReader();fr.onload=()=>{try{db=JSON.parse(fr.result);save();renderAll();toast('Backup importado.')}catch(err){toast('Arquivo inválido.')}};fr.readAsText(file)}
function resetar(){if(!confirm('Reiniciar dados de teste do Radar Social Escolar 2.0? O 9º ano ficará em atenção, uma turma com poucas faltas e outras em nível médio.'))return;localStorage.removeItem(STORAGE_KEY);db={alunos:gerarAlunos(),frequencias:[],acoes:[],familia:[]};popularTeste(db);save();renderAll();toast('Dados de teste reiniciados.')}
init();