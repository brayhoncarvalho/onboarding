Nesta documentação trataremos os principais pontos para fornecer uma compreensão abrangente sobre o fluxo de build da Everlast  Build e Everlast   Deploy.

 Visão Geral

O fluxo CI/CD da Everlast foi concebido com foco total em automação, padronização e qualidade. Ele cobre desde o build da aplicação até sua publicação em ambientes de execução, integrando ferramentas modernas de versionamento, testes, segurança, deploy e observabilidade.

Este processo é composto por duas grandes etapas:

Integração Contínua (CI): executada pelo Everlast  Build , responsável por buildar, versionar, validar e gerar os artefatos da aplicação.

Entrega Contínua (CD): executada pelo Everlast  Deploy, encarregada de orquestrar o deploy automatizado, com aprovações e validações conforme a criticidade do ambiente.

Ambas etapas foram desenhadas de forma desacoplada, porém integradas, promovendo flexibilidade e escalabilidade.



 Como é o fluxo Pipeline  Everlast

Para a implementação das práticas de Integração Contínua (CI) e Entrega Contínua (CD), a Pipeline  Everlast utiliza como motores de execução o Jenkins para o Everlast    Build e Argo para o Everlast  Deploy. O processo de CD é acionado automaticamente ao concluir o processo de CI, garantindo uma transição suave entre as etapas. 

Estas etapas garantem que o desenvolvimento de software seja um processo contínuo, eficiente e escalável, minimizando erros humanos e maximizando a qualidade do produto final.

Cada uma delas foi projetada de maneira independente, cada qual com seu motor de execução e tendo suas particularidades para a correta execução. Tais configurações podem ser acessadas e conferidas a partir destes tópicos:

Everlast Build

Everlast Deploy

🛠️ Arquitetura Modular

Cada etapa (CI e CD) foi desenhada de forma independente, com configurações e lógica próprias. Isso garante:

Maior resiliência: falhas em uma etapa não comprometem toda a cadeia

Customização controlada por projeto

Facilidade de troubleshooting e manutenção



A pipeline segue o modelo Gitflow, o que requer atenção especial aos nomes das branches. É fundamental que as branches sejam nomeadas de acordo com os padrões estabelecidos: Master, Release, Develop, Feature e Hotfix. Seguir esses padrões é essencial para maximizar a eficiência e aproveitar todos os recursos disponíveis na pipeline.
Para os repositórios IAC é possível seguir o modelo GitOps, que equaliza uma branch com ambiente designado: dev, hml e prd.



