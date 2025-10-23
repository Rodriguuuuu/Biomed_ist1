export default function AboutPage(){
  return (
    <article className="prose">
      <h1>Sobre &amp; Privacidade</h1>
      <p>Dados locais: todas as notas e perfis ficam apenas no teu navegador (localStorage). Não existem pedidos a servidores.</p>
      <h2>Fórmulas</h2>
      <ul>
        <li>GPA 0–20 = Soma(Nota × ECTS) / Soma(ECTS com nota)</li>
        <li>0–4 = 4 × (GPA/20); 0–100 = 5 × GPA</li>
      </ul>
      <h2>Competências</h2>
      <p>Regras por palavras‑chave inferem pesos por UC; força = max(0, (nota−10)/10). Normalização por ECTS com nota.</p>
      <h2>Acessibilidade</h2>
      <p>HTML semântico, estados de foco visíveis, link “Ir para conteúdo”, tabelas próprias e etiquetas ARIA quando necessário.</p>
      <h2>Privado por design</h2>
      <p>Coloca <code>BASIC_AUTH_ENABLED=true</code> e define utilizador/senha nas variáveis de ambiente para proteger o site em produção (Vercel, por exemplo).</p>
    </article>
  );
}
