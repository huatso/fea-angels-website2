export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  content: string;
  url?: string;
};

export const posts: Post[] = [
  {
    slug: "como-funciona-investimento-anjo",
    title: "Como funciona o investimento anjo no Brasil",
    excerpt:
      "Um panorama prático sobre instrumentos jurídicos, processo de due diligence e o papel do investidor-anjo no ecossistema de startups brasileiro.",
    date: "10 de maio de 2026",
    author: "FEA Angels",
    category: "Educação",
    readTime: "7 min de leitura",
    content: `O investimento anjo é a porta de entrada do venture capital no Brasil. Ele ocorre nas fases mais iniciais de uma startup — muitas vezes quando há apenas uma ideia, um MVP ou os primeiros clientes — e o investidor assume um risco elevado em troca de uma participação societária ou de direitos futuros de conversão.

No Brasil, o marco regulatório principal é a Lei Complementar 155/2016, que criou o contrato de participação e conferiu proteção patrimonial ao investidor-anjo. Isso significa que, em caso de falência da startup, o patrimônio pessoal do anjo não pode ser atingido pelas dívidas da empresa — uma mudança importante que profissionalizou o mercado.

## O que é um investidor-anjo

O investidor-anjo é, em geral, um empreendedor ou executivo de sucesso que, além de capital, aporta experiência, rede de contatos e mentoria. É diferente do investidor de venture capital: o anjo investe dinheiro próprio, em cheques menores, e costuma se envolver operacionalmente com a startup.

No contexto da FEA Angels, nossos associados são ex-fundadores, CFOs, diretores de grandes corporações e profissionais de alta gestão — todos com experiência prática para contribuir além do capital.

## Principais instrumentos jurídicos

Existem três formas principais de estruturar um investimento anjo no Brasil:

O mútuo conversível é um empréstimo que se converte em participação societária em uma rodada futura. É o instrumento mais simples e rápido de fechar, mas exige negociação cuidadosa dos termos de conversão (cap, desconto e prazo).

O contrato de participação, criado pela LC 155/2016, é o instrumento mais adequado para anjos no Brasil. Ele garante remuneração proporcional aos lucros e proteção patrimonial, sem que o investidor se torne sócio formalmente — o que simplifica a gestão societária para o fundador.

O SAFE (Simple Agreement for Future Equity), adaptado do modelo americano da Y Combinator, é crescentemente usado em startups com trações mais avançadas. Funciona de forma similar ao mútuo conversível, mas sem juros e com cláusulas mais padronizadas.

## Como a FEA Angels estrutura os deals

Na FEA Angels, os investimentos são estruturados em sindicato: múltiplos associados investem juntos em uma startup, diluindo o risco individual e somando expertise diversa ao cap table da empresa.

O processo começa com a submissão da startup pelo nosso formulário. O comitê de avaliação analisa o material enviado e prepara um relatório de due diligence. Startups aprovadas são convidadas para o Pitch Night, onde apresentam ao vivo para os investidores. Após o pitch, os interessados em co-investir se coordenam para fechar o deal.

## Por onde começar

Se você é um empreendedor buscando investimento, o passo inicial é estruturar bem seu pitch deck e ter clareza sobre os indicadores básicos do negócio: MRR (ou receita recorrente), CAC, LTV, churn e burn rate. Esses números são os primeiros que um anjo vai pedir.

Se você é um potencial investidor, a melhor forma de começar é participar de uma rede como a FEA Angels: você co-investe ao lado de profissionais experientes, tem acesso a dealflow curado e aprende o processo na prática antes de investir de forma independente.

O ecossistema de investimento anjo no Brasil ainda é relativamente novo e tem crescido rapidamente. O momento é oportuno para quem quer se posicionar como investidor ou empreendedor nesse mercado.`,
  },
  {
    slug: "5-erros-comuns-no-pitch",
    title: "5 erros comuns no pitch para anjos",
    excerpt:
      "Do TAM superestimado ao valuation sem âncora: os erros que mais reprovam startups nos nossos comitês de avaliação.",
    date: "28 de abril de 2026",
    author: "FEA Angels",
    category: "Startups",
    readTime: "5 min de leitura",
    content: `Depois de avaliar mais de 500 startups nos últimos anos, nosso comitê mapeou os padrões que mais reprovam empresas — não por falta de potencial, mas por falhas de comunicação e preparo que podem ser corrigidas. Este post destrincha os cinco mais recorrentes.

## 1. TAM/SAM/SOM superestimado

O erro clássico: "nosso mercado endereçável é de R$ 500 bilhões". Investidores anjo sabem que números gigantes calculados de cima para baixo (top-down) não dizem nada sobre o que a startup pode capturar de forma realista.

O que funciona é o raciocínio bottom-up: quantos clientes você consegue atingir nos próximos 12 meses? Qual o ticket médio? Multiplique e você tem um número crível. Um TAM menor, bem fundamentado, transmite muito mais credibilidade do que bilhões sem metodologia.

## 2. Ausência de tração demonstrável

"Nossa plataforma está quase pronta" ou "vamos lançar em breve" são frases que esfriama qualquer conversa com investidor. Anjos investem em hipóteses já testadas, não em promessas.

Tração não precisa ser receita. Pode ser número de usuários ativos, lista de espera qualificada, LOIs assinados com clientes, NPS alto ou taxa de retenção que surpreende. O que importa é evidência de que o problema é real e que as pessoas pagam (ou vão pagar) para resolvê-lo.

## 3. Time incompleto ou sem complementaridade

Investidores anjo investem primeiro no time. Uma startup com produto mediano e time excepcional costuma ir mais longe do que o contrário.

Os alertas são: time formado apenas por pessoas técnicas sem ninguém focado em crescimento, cofundadores que se conhecem há poucas semanas, ou ausência de qualquer experiência prévia no setor que a startup quer disrupar. Se o time tem gaps, seja honesto sobre como planeja preenchê-los com o capital da rodada.

## 4. Valuation desancorado

Startups em estágio pré-seed pedindo valuation de R$ 20 milhões sem receita são comuns — e quase sempre rejeitadas. O valuation precisa de uma âncora: múltiplo sobre receita recorrente, comparáveis de mercado recentes ou ao menos uma tese clara sobre por que aquele número faz sentido.

Uma dica prática: calcule quanto dinheiro você precisa e qual participação você está disposto a ceder. Daí deriva-se o valuation. Não o contrário.

## 5. CAC e LTV desconhecidos

Startups que vendem há meses mas não sabem quanto custou adquirir cada cliente (CAC) ou qual a receita esperada por cliente ao longo do tempo (LTV) transmitem um sinal claro: a gestão do negócio não é orientada a dados.

Mesmo com poucos clientes, é possível estimar esses indicadores. Divida o gasto total com marketing e vendas pelo número de novos clientes no período. Calcule a receita média mensal por cliente e multiplique pela taxa de retenção esperada. São cálculos simples que mostram maturidade analítica.

## Conclusão

A maioria desses erros não é sobre o negócio em si — é sobre como o fundador comunica e entende o próprio negócio. A boa notícia é que todos são corrigíveis. Se você está se preparando para uma rodada, revise seu pitch com esses pontos em mente e chegue ao Pitch Night com respostas prontas para cada um deles.`,
  },
  {
    slug: "tese-fea-angels-2026",
    title: "A tese da FEA Angels em 2026",
    excerpt:
      "Quais setores, estágios e perfis de time estamos priorizando neste ano — e o que buscamos em cada oportunidade de investimento.",
    date: "12 de março de 2026",
    author: "FEA Angels",
    category: "FEA Angels",
    readTime: "4 min de leitura",
    content: `A cada ano revisamos nossa tese de investimento com base no que aprendemos com o portfólio, nas tendências do ecossistema brasileiro e nas conversas com nossos associados. Este é o direcionamento da FEA Angels para 2026.

## Setores prioritários

SaaS B2B continua sendo nosso maior interesse. Empresas que vendem software para outras empresas em mercados fragmentados — onde há muita ineficiência e baixa digitalização — têm demonstrado os melhores retornos no nosso portfólio. Buscamos em especial negócios com contratos recorrentes e low churn.

Fintechs de infraestrutura são nossa segunda prioridade. Não estamos interessados em mais carteiras digitais ou bancos neodigitais, mas sim em empresas que resolvem problemas de plumbing financeiro: conciliação, automação fiscal, crédito embarcado (embedded finance) e infraestrutura de pagamentos para verticais específicas.

Healthtechs com dados proprietários completam nosso trio prioritário. Com a digitalização do prontuário eletrônico avançando, surgem oportunidades em diagnóstico assistido por IA, gestão de clínicas e plataformas de saúde preventiva. O diferencial que buscamos é propriedade sobre os dados — algo difícil de replicar.

## Estágio e ticket

Nosso foco principal são rodadas Pré-seed e Seed. Nesse estágio, investimos tipicamente entre R$ 150 mil e R$ 800 mil por startup, estruturados em sindicato com 3 a 8 co-investidores da rede.

Em casos excepcionais — startups com tração forte, time sênior e oportunidade clara de liderança de mercado — participamos de rodadas Série A como investidores menores, ao lado de fundos de VC.

## O que buscamos no time

Acima de qualquer métrica, investimos em fundadores. O perfil que mais nos interessa: alguém que conhece profundamente o problema que resolve (idealmente por ter vivido como operador no setor), tem obsessão por métricas e consegue recrutar pessoas melhores do que ele mesmo.

Vínculo com a FEA-USP não é obrigatório, mas é um critério de priorização. Nossa rede de mentores e investidores tem forte expertise em finanças, gestão e tecnologia — o que cria uma sinergia natural com fundadores com formação em administração, economia e engenharia.

## Como nos enviar sua startup

O processo começa pelo formulário de submissão no nosso site. Nosso comitê avalia em até três semanas. Startups selecionadas são convidadas para o próximo Pitch Night.

Se você acha que sua empresa tem fit com nossa tese, não espere ter tudo perfeito — submeta agora e evolua o pitch com o feedback do comitê.`,
  },
  {
    slug: "como-montar-pitch-deck",
    title: "Como montar um pitch deck que converte investidores anjo",
    excerpt:
      "Um guia prático sobre estrutura, narrativa e os slides que mais importam — baseado em centenas de pitches avaliados pela nossa rede.",
    date: "5 de fevereiro de 2026",
    author: "FEA Angels",
    category: "Startups",
    readTime: "6 min de leitura",
    content: `Um pitch deck não é uma apresentação de empresa. É um documento de vendas. Seu objetivo é fazer o investidor querer saber mais — não explicar cada detalhe do negócio. Com essa premissa em mente, veja como estruturar um deck que abre conversas.

## O tamanho certo

Decks com mais de 15 slides são lidos pela metade. O ideal é entre 10 e 13 slides, cada um respondendo a uma pergunta específica que o investidor vai fazer mentalmente. Se um slide não responde a uma dessas perguntas, ele provavelmente não precisa estar lá.

## A estrutura que funciona

O slide de problema vem primeiro. Descreva o problema com dados reais, não com adjetivos. "O processo de conciliação fiscal em PMEs leva 40 horas por mês e custa em média R$ 3.000 em horas de contador" é muito mais eficaz do que "o mercado contábil é ineficiente e está pronto para ser disruptado".

O slide de solução deve ser visual e específico. Mostre o produto, não descreva. Uma captura de tela do dashboard real vale mais do que qualquer bullet point sobre "plataforma intuitiva e escalável".

O slide de mercado deve usar o raciocínio bottom-up descrito no nosso post sobre erros comuns. Mostre o mercado que você pode realisticamente capturar nos próximos 3 anos, não o TAM astronômico.

O slide de tração é o mais importante do deck. Coloque aqui o número que melhor conta sua história: crescimento de MRR mês a mês, NPS, número de contratos assinados, lista de espera com nomes conhecidos. Se você não tem tração ainda, seja honesto sobre onde está e o que fará com o capital para chegar lá.

O slide de time precisa responder a uma pergunta: por que esse time vai ganhar esse mercado? Liste experiências relevantes, não apenas formação acadêmica. Se um cofundador trabalhou 5 anos no setor, isso é mais relevante do que o MBA.

## O que não colocar

Evite slides com texto longo — se você precisa de mais de 5 bullets, crie dois slides. Evite projeções financeiras para 5 anos em planilhas detalhadas: ninguém acredita e elas distraem da narrativa. Evite logos de clientes sem contexto — "já trabalhamos com X, Y e Z" sem revelar nada sobre receita ou engajamento não diz nada.

## A narrativa importa tanto quanto os dados

Os melhores pitches que vimos na FEA Angels têm uma coisa em comum: uma história clara de por que esse problema existe, por que essa equipe é a certa para resolvê-lo e por que agora é o momento certo. Os dados suportam a narrativa — não o contrário.

Se você conseguir fazer o investidor sentir urgência em participar dessa jornada, o deck cumpriu seu papel.`,
  },
];
