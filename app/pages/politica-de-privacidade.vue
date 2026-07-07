<template>
  <div class="min-h-screen font-sans antialiased bg-[#0a0a0f] text-white">
    <!-- ═══ HEADER ═══ -->
    <header class="border-b border-white/5">
      <div class="max-w-3xl mx-auto px-6 sm:px-10 h-16 sm:h-20 flex items-center">
        <span class="text-xl font-bold tracking-tight text-white">Expand</span>
      </div>
    </header>

    <!-- ═══ CONTEÚDO ═══ -->
    <main class="max-w-3xl mx-auto px-6 sm:px-10 py-14 sm:py-20">
      <p class="text-xs font-semibold uppercase tracking-widest text-orange-400 mb-3">Política de Privacidade</p>
      <h1 class="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Política de Privacidade do Grupo Expand</h1>
      <p class="text-sm text-white/40 mb-12">Última atualização: 7 de julho de 2026</p>

      <div class="privacy-content space-y-10 text-white/70 leading-relaxed">

        <section>
          <p>
            Esta Política de Privacidade descreve como o <strong>Grupo Expand</strong> ("Expand", "nós",
            "nosso"), empresa-mãe responsável por produtos SaaS como o <strong>SignPRO</strong> e demais
            plataformas do grupo ("Plataforma", "Serviço"), coleta, usa, armazena, compartilha e protege
            dados pessoais de clientes que utilizam essas plataformas ("Cliente", "você") e de terceiros com
            quem o Cliente interage através delas (ex.: contatos de WhatsApp, seguidores do Instagram, leads
            de anúncios).
          </p>
          <p class="mt-3">
            Ao usar qualquer plataforma do Grupo Expand, você concorda com a coleta e o uso de informações de
            acordo com esta Política, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº
            13.709/2018) e, quando aplicável, com os Termos da Plataforma e as Políticas para Desenvolvedores
            da Meta.
          </p>
        </section>

        <section>
          <h2>1. Quem somos</h2>
          <p>
            O Grupo Expand é a empresa responsável por um portfólio de produtos SaaS voltados a pequenas e
            médias empresas, incluindo o <strong>SignPRO</strong> — sistema de gestão empresarial (CRM) que
            ajuda a organizar atendimento via WhatsApp, agendamentos, orçamentos, catálogo de produtos,
            pedidos e campanhas de marketing (incluindo anúncios no Facebook e Instagram através da Meta
            Marketing API). O Grupo Expand é o controlador dos dados descritos aqui, salvo quando indicado
            que o Cliente atua como controlador dos dados de seus próprios contatos.
          </p>
        </section>

        <section>
          <h2>2. Quais dados coletamos</h2>
          <p><strong>2.1. Dados da conta do Cliente:</strong> nome, e-mail, telefone e senha (armazenada de
            forma criptografada) usados para criar e acessar a conta na Plataforma.</p>
          <p class="mt-3"><strong>2.2. Dados operacionais inseridos pelo Cliente:</strong> leads, contatos,
            agendamentos, orçamentos, pedidos, produtos do catálogo, veículos e demais informações que o
            Cliente cadastra para operar seu negócio dentro da Plataforma.</p>
          <p class="mt-3"><strong>2.3. Dados de mensagens (WhatsApp):</strong> quando o Cliente conecta um
            número de WhatsApp Business, processamos o conteúdo das mensagens trocadas com os contatos do
            Cliente (texto, mídia, status de entrega) exclusivamente para exibi-las na central de
            atendimento e permitir a resposta pelo Cliente.</p>
          <p class="mt-3"><strong>2.4. Dados via integração com a Meta (Facebook/Instagram):</strong> quando
            o Cliente conecta uma conta de anúncios, Página do Facebook ou conta comercial do Instagram,
            acessamos — somente com a autorização e o token fornecidos pelo Cliente — dados como: nome e
            identificador da Página/conta de anúncios, campanhas, conjuntos de anúncios, criativos,
            métricas de desempenho (gasto, cliques, impressões, conversões) e, quando aplicável, mensagens
            diretas ou comentários do Instagram vinculados à automação contratada. Esses dados são usados
            unicamente para fornecer as funcionalidades de gestão de anúncios e atendimento dentro da
            Plataforma — não são vendidos, alugados nem usados para publicidade fora dela.</p>
          <p class="mt-3"><strong>2.5. Dados de uso:</strong> registros técnicos de acesso (endereço IP,
            navegador, páginas acessadas, data/hora) coletados automaticamente para segurança, suporte e
            melhoria do Serviço.</p>
          <p class="mt-3"><strong>2.6. Dados de pagamento:</strong> quando aplicável, dados de cobrança são
            processados por provedores de pagamento terceirizados; o Grupo Expand não armazena números completos
            de cartão de crédito.</p>
        </section>

        <section>
          <h2>3. Como usamos os dados</h2>
          <ul>
            <li>Viabilizar o funcionamento das funcionalidades contratadas (CRM, atendimento via WhatsApp,
              agendamento, orçamentos, catálogo, gestão de anúncios).</li>
            <li>Autenticar o acesso e manter a segurança da conta.</li>
            <li>Enviar comunicações operacionais (ex.: confirmações, avisos de sistema).</li>
            <li>Cumprir obrigações legais e regulatórias.</li>
            <li>Diagnosticar problemas técnicos e melhorar o Serviço.</li>
          </ul>
          <p class="mt-3">Não usamos dados obtidos através das APIs da Meta para fins de publicidade própria
            do Grupo Expand, nem os compartilhamos com terceiros para tais fins.</p>
        </section>

        <section>
          <h2>4. Com quem compartilhamos dados</h2>
          <p>Compartilhamos dados apenas com prestadores de serviço estritamente necessários para operar a
            Plataforma, todos sob obrigações contratuais de confidencialidade e segurança:</p>
          <ul>
            <li><strong>Meta Platforms, Inc.</strong> — ao usar recursos de WhatsApp Business, Facebook Ads
              e Instagram, dados trafegam pela infraestrutura da Meta conforme os Termos da Plataforma Meta.</li>
            <li><strong>Provedor de infraestrutura de banco de dados e autenticação</strong> (Supabase) —
              armazenamento seguro dos dados da conta e operacionais.</li>
            <li><strong>Provedor de mensageria em tempo real</strong> (Pusher) — entrega de notificações e
              atualizações ao vivo dentro do painel.</li>
            <li><strong>Provedor de API de WhatsApp Business</strong> — intermediação técnica do envio e
              recebimento de mensagens de WhatsApp.</li>
            <li><strong>Autoridades públicas</strong>, quando exigido por lei, ordem judicial ou para
              proteger direitos, segurança ou propriedade do Grupo Expand ou de terceiros.</li>
          </ul>
          <p class="mt-3">Não vendemos dados pessoais a terceiros.</p>
        </section>

        <section>
          <h2>5. Retenção de dados</h2>
          <p>
            Mantemos os dados enquanto a conta do Cliente estiver ativa e pelo tempo necessário para cumprir
            finalidades legais, contratuais ou regulatórias (ex.: obrigações fiscais). Após o encerramento
            da conta, os dados são excluídos ou anonimizados em até 90 dias, exceto quando a lei exigir
            prazo de guarda maior.
          </p>
        </section>

        <section>
          <h2>6. Exclusão de dados</h2>
          <p>
            Você pode solicitar a exclusão dos seus dados pessoais, ou dos dados de sua conta e integrações
            conectadas (incluindo tokens de acesso à Meta), a qualquer momento, das seguintes formas:
          </p>
          <ul>
            <li>Desconectando a integração diretamente em <em>Configurações → Marketing</em> (remove
              imediatamente o token de acesso armazenado);</li>
            <li>Enviando um pedido de exclusão para <a href="mailto:privacidade@expand.com.br">privacidade@expand.com.br</a>,
              informando o e-mail da conta ou a Página/conta de anúncios conectada.</li>
          </ul>
          <p class="mt-3">
            Processamos pedidos de exclusão em até 15 dias úteis e enviamos confirmação por e-mail quando
            concluído, conforme exigido pela LGPD e pelas Políticas para Desenvolvedores da Meta.
          </p>
        </section>

        <section>
          <h2>7. Seus direitos (LGPD)</h2>
          <p>Nos termos da LGPD, você pode solicitar a qualquer momento, mediante contato em
            <a href="mailto:privacidade@expand.com.br">privacidade@expand.com.br</a>:</p>
          <ul>
            <li>Confirmação da existência de tratamento e acesso aos dados;</li>
            <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
            <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade
              com a lei;</li>
            <li>Portabilidade dos dados a outro fornecedor de serviço;</li>
            <li>Eliminação dos dados tratados com consentimento (ressalvadas hipóteses legais de retenção);</li>
            <li>Revogação do consentimento e informação sobre entidades com as quais os dados foram
              compartilhados.</li>
          </ul>
        </section>

        <section>
          <h2>8. Segurança da informação</h2>
          <p>
            Adotamos medidas técnicas e organizacionais para proteger os dados contra acesso não autorizado,
            perda, alteração ou divulgação indevida, incluindo criptografia em trânsito (HTTPS/TLS), controle
            de acesso por conta e ambiente de hospedagem com práticas de segurança de mercado. Nenhum sistema
            é 100% infalível; em caso de incidente de segurança relevante, notificaremos os Clientes afetados
            e a Autoridade Nacional de Proteção de Dados (ANPD), quando aplicável.
          </p>
        </section>

        <section>
          <h2>9. Transferência internacional de dados</h2>
          <p>
            Alguns de nossos prestadores de serviço (ex.: Meta, provedores de nuvem) podem processar dados em
            servidores localizados fora do Brasil. Nesses casos, exigimos que a transferência siga
            mecanismos reconhecidos pela LGPD para garantir nível de proteção adequado.
          </p>
        </section>

        <section>
          <h2>10. Dados de crianças</h2>
          <p>
            As plataformas do Grupo Expand são destinadas a uso empresarial e não são direcionadas a menores
            de 18 anos. Não coletamos intencionalmente dados de crianças.
          </p>
        </section>

        <section>
          <h2>11. Cookies e tecnologias similares</h2>
          <p>
            Usamos armazenamento local do navegador (localStorage) para manter sua sessão autenticada e
            preferências de interface (ex.: tema visual, rascunhos de formulários). Não utilizamos cookies de
            rastreamento publicitário de terceiros.
          </p>
        </section>

        <section>
          <h2>12. Alterações a esta Política</h2>
          <p>
            Podemos atualizar esta Política periodicamente para refletir mudanças legais, técnicas ou no
            Serviço. A data da última atualização é sempre indicada no topo desta página. Alterações
            relevantes serão comunicadas aos Clientes por e-mail ou aviso na Plataforma.
          </p>
        </section>

        <section>
          <h2>13. Contato</h2>
          <p>
            Dúvidas, solicitações relativas a dados pessoais ou exclusão de dados podem ser enviadas para:
            <a href="mailto:privacidade@expand.com.br">privacidade@expand.com.br</a>
          </p>
        </section>

      </div>
    </main>

    <footer class="border-t border-white/5 py-8">
      <div class="max-w-3xl mx-auto px-6 sm:px-10 text-xs text-white/30 text-center">
        © {{ new Date().getFullYear() }} Grupo Expand. Todos os direitos reservados.
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Política de Privacidade — Grupo Expand' })
</script>

<style scoped>
.privacy-content h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.75rem;
  letter-spacing: -0.01em;
}
.privacy-content ul {
  list-style: disc;
  padding-left: 1.25rem;
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.privacy-content a {
  color: #fb923c;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.privacy-content a:hover {
  color: #fdba74;
}
.privacy-content strong {
  color: #fff;
  font-weight: 600;
}
</style>
