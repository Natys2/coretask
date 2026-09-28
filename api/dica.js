export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { tarefas, financasFiltradas, estudos, treinos } = req.body;
  const apiKey = process.env.GEMINI_API_KEY; 

  if (!apiKey) {
    return res.status(500).json({ error: 'Chave de API não configurada no servidor.' });
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const prompt = `Aja como minha parceira de desenvolvimento e produtividade do CoreTask. 
    Aqui estão os meus dados atuais (apenas do histórico real e do mês atual, ignore qualquer mês futuro):
    - Tarefas: ${tarefas}
    - Finanças Filtradas: ${JSON.stringify(financasFiltradas)}
    - Estudos: ${estudos}
    - Treinos: ${treinos}

    Escreva uma análise bem direta, amigável e sem formalidades, no estilo de uma conversa entre amigos (com identidade, tom leve, descontraído, mas focado). 
    
    REGRAS DE FORMATAÇÃO E TOM:
    - Comece obrigatoriamente com a frase exata: "Oii, aqui está seu resumo no CoreTask!"
    - Não puxe saco e não pareça um consultor financeiro engessado. Fale de igual para igual.
    - Destaque o panorama comparativo de forma simples, aponte os pontos de atenção (como gastos que subiram ou falta de registros) e o que focar/controlar.
    - Organize em parágrafos simples, um abaixo do outro, em texto corrido.`;

  try {
    const respostaApi = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const resultado = await respostaApi.json();

    if (resultado?.error) {
      return res.status(200).json({ relatorio: "ERRO DA API: " + resultado.error.message });
    }

    const textoRelatorio = resultado?.candidates?.[0]?.content?.parts?.[0]?.text;

    return res.status(200).json({ relatorio: textoRelatorio || "Mantenha o foco e continue registrando seus hábitos diários!" });
  } catch (error) {
    console.error("Erro na API da Vercel:", error);
    return res.status(500).json({ error: 'Erro ao processar a requisição com a IA.' });
  }
}