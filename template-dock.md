Esta documentação tem como objetivo padronizar e orientar o uso do arquivo dock.yaml, que serve como contrato de configuração entre as aplicações e a Everlast Pipeline.

✅ Este arquivo deve ser mantido na raiz do repositório e atualizado conforme a evolução da aplicação e suas necessidades de build, deploy e testes.

📊 Propósito do dock.yaml

Centralizar as informações que controlam o ciclo de vida CI/CD da aplicação

Declarar parâmetros essenciais como linguagem, build, deployment e testes

Integrar com ferramentas internas como Harness, Sonar, Nexus, Trivy, etc.

Permitir padronização e reaproveitamento de configurações por múltiplos projetos

🔧 Alinhamento com Arquitetura: Um Pilar da Sustentabilidade

Embora o dock.yaml ofereça flexibilidade, sua correta configuração está diretamente ligada ao sucesso da entrega da aplicação. Para isso, é imprescindível o alinhamento com o time de arquitetura:

🔎 Por que esse alinhamento importa?

Garante o uso de padrões corporativos validados

Permite reuso de modelos prontos para build e deploy

Facilita troubleshooting entre times (Dev, QA, Infra, Sec)

Aumenta a eficiência e evita divergências na pipeline

⚠️ Evite criar configurações isoladas que fogem dos padrões compartilhados. O alinhamento com arquitetura é o primeiro passo para evitar que sua aplicação "quebre o pipeline".

🔹 Dicas de Boas Práticas

Sempre preencha version, mesmo que opcional.

Utilize channel para integrar notificacões com o Slack.

Ative updatepom: true para automatizar versão de artefato Java.

Defina cloudProvider, cloudCrRepo e deploymentStrategy explicitamente, mesmo quando houver valor padrão.

Para testes automatizados, declare a estrutura completa do bloco QA Automation.

📂 Estrutura Geral

A estrutura do dock.yaml é composta por:

Metadados da aplicação (name, squad, tribe, version...)

Configurações de build e linguagem

Parâmetros para deployment e cloud

Bloco de automação de testes (opcional)

Configuração de IaC e linter (opcional)

Definição de ambientes (dev, qa, hml, prd...)

⭐ Muitos desses campos possuem auto-discovery, mas recomendamos sempre declarar os valores explicitamente para evitar ambiguidades e garantir previsibilidade.

name: 
squad: 
tribe: 
tower:
version: ""
artifactName:
language: 
buildType:
languageVersion: 
cloudProvider: ""
cloudCrRepo: ""
appSrcFolder: ""
appTestFolder: ""
updatepom:
channel:
pipelineType: ""
nexusUploadJar: 
packageSuffix: ""
package:
  type: ""

### QA Automation Block ###
automationRepo:
automationBuildType:
automationLanguage:
automationLanguageVersion:
testType:
testFramework:
testSuite:
testReRunSuite:
testReRunCounter:
languageTestOptions:

linter:
  iac: true/false
iac:
  run: true/false
  provider: ""  
harnessGen:
deploymentType: 
deploymentStrategy: 
argoAutoSync:
frontEndPathStatics: 
frontEndBucketName:
envs:
  dev:
    stackNameCloudformation:
    autoApproveDeploy:
    autoSkipDeploy:
    canaryListPercentageByEnv:
    accountName: 
    accountId: 
    clusterName: 
    clusterNamespace: 
  hml:
    stackNameCloudformation:
    autoApproveDeploy:
    autoSkipDeploy:
    accountName: 
    accountId: 
    clusterName: 
    clusterNamespace:
    region:
  qa:
    stackNameCloudformation:
    autoApproveDeploy:
    autoSkipDeploy:
    accountName: 
    accountId: 
    clusterName: 
    clusterNamespace: 
  prd:
    stackNameCloudformation:
    autoApproveDeploy:
    autoSkipDeploy:
    accountName:
    accountId:
    clusterName:
    clusterNamespace:
    region:
    



Parâmetro

Descrição

Obrigatório?

name

Deve ser o nome do projeto ou do microserviço.



squad

Definir o nome da squad responsável pelo produto.



tribe

Definir o nome da tribo responsável pelo produto.



tower

Definir o nome da torre responsável pelo produto.





version

Versão da aplicação



artifactName

Nome do artefato da aplicação (Somente Pipeline Lib)

 

language

Caso queira definir o tipo de linguagem específica para ser buildado. Confira as linguagens suportadas pela pipeline



buildType

Tipo de Build da aplicação. Confira os buildTypes suportados pela pipeline.



languageVersion

Defina o número da versão de acordo com o BuildType e Language definidos anteriormente. Confira as languageVersions suportadas pela pipeline.



cloudProvider

Aponta o local de push da Image ou de deploy (Azure, Huawei ou AWS)



cloudCrRepo

Aponta o repositório de armazenamento das imagens do container



deploymentType

Define o tipo de deployment a ser usado pelo motor de CD, são: Kubernetes, ServerlessAwsLambda, FrontendAwsCloudFront ou mip.
  CAMPO CASE SENSITIVE



deploymentStrategy

Define a estratégia de CD. Os valores podem ser: rolling, canary,argo ou mip.
Caso não seja especificado, o valor padrão é rolling.



argoAutoSync

Usado para casos especificos de aplicações que queiram permitir maior controle sobre o comportamento de sincronização automática das aplicações no ArgoCD. Uso - argoAutoSync: "disabled" 



frontEndPathStatics

Indica o caminho  que a pipeline  fará o sync para o bucket que está ligado ao cloudfront. Neste exemplo a pipeline colocará todos os estáticos na raiz do bucket, sem a necessidade de alguma pasta que o anteceda.



frontEndBucketName

Define o nome específico do bucket a ser utilizado para a entrega dos arquivos estáticos da aplicação. Caso não seja informado, a pipeline criará automaticamente um bucket para a aplicação, adicionando o nome do environment ao final. Exemplo: aplicacao-xpto-api-dev.



canaryListPercentageByEnv

Caso o parametro deploymentStrategy seja selecionado para canary, poderá ser passado uma lista de valores para os estágios desejados para implantação, podendo variar de 1 a N valores.  Caso não passado a pipeline usará estágios default que serão: 25,50,90



pipelineType

Define o tipo de pipeline: DEFAULT (padrão para aplicações), LIB, LIB_POM, HELM, LAMBDA, CUSTOM, REGRESSION (fluxo para automações de testes).





Local da pasta “Source” da aplicação



appTestFolder

Local da pasta de testes da aplicação

 

updatepom

Identifica a versão gerada do pom.xml e adiciona-o no repositório (se estiver como True)



channel

Channel do Slack para notificação.



automationRepo

Nome do repo no github da automação de teste



automationBuildType

Tipo de Build da automação



automationLanguage

Linguagem da automação



automationLanguageVersion

Versão da linguagem de automação



testTypes

ACCEPTANCE para testes de aceite ou CUSTOM para personalizados



testFramework

Configuração do maven para execução de projetos de automação teste usando TESTNG ou CUCUMBER (default)



testSuite

Determina o nome da suíte de execução





testReRunSuite

Determina o nome da suíte de reexecução 





testReRunCounter

Determina a quantidade de reexecuções 



nexusUploadJar

Boolean que determina a obrigatoriedade de fazer o upload do artefato para o nexus no package



packageSuffix

Possível colocar um sufixo no nome do jar que é gerado pelo CI no package



package.type

Define o tipo de package: docker, serverless_framework, sam, packagepom, s3, chart.



languageTestOptions

Parâmetros adicionais na hora de rodar testes,  a principio implantando para esteiras Java com testes com Maven.



languageBuildOptions

Argumentos adicionais passados para a ferramenta de build (ex: Maven, Gradle, NPM, Go build). 
Exemplo de uso para Lambda em Go:  "-tags lambda"

        

languageBuildFlags

Refere-se a modificadores de comportamento da linha de comando (CLI flags). 
Exemplo de uso para aplicação em Go: "CGO_ENABLED=0 GOOS=linux GOARCH=amd64"

        

languageMainFilePath

O caminho relativo para o arquivo de entrada principal da aplicação ou do script de build. 
Exemplo de uso para aplicação em Go customizada:  "./cmd/http/lambda.go"

        

linter

Aceita o parâmetro iac que pode ser true ou false. O valor padrão é false.



iac

Precisa do parâmetro run que pode ser true ou false para efetuar ou não o deploy de infra. O valor padrão é false.
Precisa do parâmetro provider, para determinar qual iac provider será utilizado. O valor padrão é cloudformation.



harnessGen

Versão do motor de deploy do Harness, aceita os valores: first ou next. Caso não seja especificado o valor padrão é first.



envs [dev, qa, hml, prd]

 OBRIGATÓRIO PARA USO DO CD. 

Especificar o nome das contas AWS, id das contas AWS, nome do cluster na conta e o namespace que deverá ser implantado a aplicação.
Para Azure, é necessário informar a cloud, o grupo de recurso, o nome do cluster e o namespace da aplicação.

 

multiEnvironment

(Multienv) Indica se o enviromment em questão vai ter multiplos deploys. (true)



specificFileValue

(Multienv) Indica o value.yaml que será ultilizado para a entrega daquele deploy em especifico localizado na pasta overrides.



autoApproveDeploy

Pula o estágio de confirmação de deploy e realiza deploy 



autoSkipDeploy

Pula estágio de confirmação de deploy e deploy



chartSequence

Sequência de Helm Charts MIP a serem implantados. (Exclusivo do fluxo MIP)



region

Define a região da AWS onde os recursos serão provisionados pela pipeline. Esse parâmetro garante que a execução do CloudFormation, SAM ou outros serviços AWS ocorra em uma região específica, de acordo com o ambiente ou necessidade do time. Caso não seja informado, a pipeline utilizará a região padrão configurada.



stackNameCloudformation

Define o nome da stack do CloudFormation para pipelines do tipo serverless ou IaC que utilizam SAM/CloudFormation. Esse parâmetro indica se uma stack já existente no ambiente será reutilizada ou se uma nova stack, com um nome diferente, será criada para cada environment. Caso não seja informado, a pipeline definirá o nome da stack automaticamente com base no nome do repositório.



Para os parâmetros não obrigatórios, a pipeline possui AutoDiscovery e valores padrão para construção da aplicação.

*¹ O parâmetro “version”, apesar de ser não obrigatório, o seu preenchimento é altamente recomendado, pois em caso de múltiplas versões o AutoDiscovery priorizará e apontará a versão “0.1.0”  

*² O parâmetro cloudProvider aponta o AWS como valor padrão, por consequência, os parâmetros “cloudCrRepo” e “deploymentStrategy” se tornam opcionais. Porém, caso no cloudProvider seja apontado o valor “azure”, os dois passarão a ser obrigatórios

*⁴ Obrigatório caso o parâmetro “testFramework“ seja “TESTNG”.

*⁵ Para que a suíte seja identificada na pipeline o caminho do arquivo deve estar configurado no pom.xml do projeto. 

Ex: <suiteXmlFile>src/test/resources/Suites/${suiteXmlFile}.xml</suiteXmlFile>
 https://github.com/dock-tech/odin-mjolnir-qa/blob/master/pom.xml 

*6  O autoSkipDeploy está disponível apenas para os deploys que permitem o SKIP, no caso branch release/xyz o SKIP é permitido para o deploy Dev e QA, no caso branch hotfix e bugfix o SKIP é permitido para o Deploy Dev, QA e HML.

*7 Não há suporte a PreDeployment(iac run: true) com “MultiEnviroment: true” no fluxo Kubernetes.

Parâmetro cloudProvider

O parâmetro cloudProvider define em qual provedor de nuvem a imagem Docker será publicada ou a qual provedor um ambiente específico pertence.

Esse parâmetro pode ser utilizado em dois níveis de configuração dentro do dock.yaml.

1. Nível Global

Quando definido no nível global, o parâmetro indica para quais provedores de nuvem a imagem Docker deverá ser publicada durante o processo de build e push.

Exemplo:

cloudProvider: Azure

Neste caso, a imagem será publicada no provedor informado.

Também é possível definir múltiplos provedores utilizando uma lista:

cloudProvider: [Huawei, Azure, AWS]

Nesse cenário, a pipeline realizará o push da imagem para todos os provedores especificados.

Caso o parâmetro não seja declarado no nível global, a pipeline assumirá AWS como provedor padrão, mantendo o comportamento atual para garantir compatibilidade com pipelines existentes.

2. Nível de Ambiente (env)

O parâmetro também pode ser utilizado dentro de um bloco de ambiente para indicar a qual provedor de nuvem pertencem as configurações daquele ambiente.

Isso é útil quando o pipeline precisa identificar em qual cloud estão os clusters, contas ou recursos utilizados pelo deployment.

Exemplo:

env:
  prod:
    cloudProvider: Azure
    clusterName: "AZ1D-VNEXT-AKS-DEV"
    resourceGroup: "RG_vNext_AKS_Dev"
    clusterNamespace: "pipeline-dev"

Nesse caso, o valor de cloudProvider indica que as configurações desse ambiente pertencem à Azure Cloud.

Formatos Aceitos

O parâmetro aceita dois formatos de configuração:

Valor único

cloudProvider: Azure

Lista de provedores

cloudProvider: [Huawei, Azure, AWS]



🔍 Exemplos Recomendados

A seguir, apresentamos exemplos de preenchimento do dock.yaml, destacando cenários de configuração mais comuns:

📄 Exemplo: Aplicação Java com Maven

Abaixo está o exemplo do projeto pierpro, que constrói uma aplicação Java na versão 15, utilizando o Maven como gerenciador de build. Por ter uma versão superior à 0.1.0, o campo version foi explicitamente declarado.

Como o deploy é realizado na Azure, foi necessário apontar o repositório de imagens (cloudCrRepo) e a estratégia de CD (deploymentStrategy). Além disso, o projeto realiza testes de aceite, sendo essencial configurar o bloco de automação de testes.

Este exemplo serve como referência sólida para novos projetos:

V2

name: pipeline-example-java-poc
squad: ape
tribe: APE
version: "1.0"
buildType: maven
language: java
languageVersion: "17"
deploymentStrategy: argo
deploymentType: Kubernetes

iac:
  run: true
  provider: "cloudformation"
envs:
  dev:
    accountName: "ape-devops-dev"
    accountId: "455239834639"
    clusterName: "devopstools-dev"
    clusterNamespace: "pipeline-example"
    autoApproveDeploy: true
  qa:
    autoSkipDeploy: true
  hml:
    accountName: "ape-devops-dev"
    accountId: "455239834639"
    clusterName: "devopstools-dev"
    clusterNamespace: "pipeline-example"
  
  prd:
    accountName: "ape-devops-prd"
    accountId: "111066175892"
    clusterName: "devopstools-prd"
    clusterNamespace: "pipeline-example"
    region: "sa-east-1"

Recomendamos que novos projetos utilizem este modelo como ponto de partida e, sempre que possível, revisem suas configurações com o time de arquitetura.

V2 (Multideploy por envs)

name: pipeline-example-java-poc
squad: ape
tribe: APE
buildType: maven
language: java
languageVersion: "17"
cloudProvider: Azure
deploymentStrategy: argo
deploymentType: Kubernetes
iac:
  run: false
  provider: "cloudformation"
envs:
  dev:
    multiEnvironment: true
    autoApproveDeploy: true    
    env1:
      cloudProvider: "Aws"
      accountName: "muxipay-hml"
      accountId: "640568149311"
      clusterName: "muxipay-hml"
      clusterNamespace: "pipeline-env1"
      specificFileValue: "values-env1.yaml"
      region: "us-east-2"
    env2:
      cloudProvider: "Aws"
      accountName: "muxipay-hml"
      accountId: "640568149311"
      clusterName: "muxipay-hml"
      clusterNamespace: "pipeline-env2"
      specificFileValue: "values-env2.yaml"
      region: "us-east-1"
  hml:
    autoSkipDeploy: true
    cloudProvider: "Azure"
    clusterName: "AZ1D-VNEXT-AKS-DEV"
    resourceGroup: "RG_vNext_AKS_Dev"
    clusterNamespace: "pipeline-dev"


* Para utilizar o “MultiEnviroment: true” é necessário desativar o PreDeployment(iac: run: false).



📌 Conclusão

O dock.yaml é a espinha dorsal da configuração de sua aplicação dentro da Everlast Pipeline. Mantenha-o claro, atualizado e validado com os times de arquitetura, plataforma e QA.

Em caso de dúvidas ou necessidade de suporte, abra um chamado com o time APE ou consulte os modelos oficiais na nossa documentação centralizada.