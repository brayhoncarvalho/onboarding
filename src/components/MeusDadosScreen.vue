<script setup lang="ts">
import AuthHeader from './AuthHeader.vue'

const emit = defineEmits<{
  (e: 'voltar'): void
  (e: 'navigate', action: 'sair' | 'emprestimos'): void
}>()

const usuario = {
  nome: 'Brayhon Oliveira Carvalho',
  cpf: '412.456.508-90',
  dataNascimento: '29/05/2000',
  email: 'brayhon.carvalho@email.com',
  celular: '(63) 95448-9531',
  canalPreferido: 'WhatsApp',
}

const endereco = {
  cep: '77001-000',
  logradouro: 'Rua das Palmeiras, 452',
  bairro: 'Plano Diretor Norte',
  cidade: 'Palmas',
  uf: 'TO',
  tipoResidencia: 'Própria',
}

const emprego = {
  renda: 'R$ 8.500,00',
  profissao: 'Analista de Sistemas',
  situacao: 'Empregado CLT',
}
</script>

<template>
  <div class="md-screen">
    <AuthHeader back-label="Voltar" @voltar="emit('voltar')" @navigate="(a) => emit('navigate', a)" />

    <main class="md-main">
      <div class="md-inner">
        <div class="md-page-header">
          <div class="md-avatar" aria-hidden="true">BC</div>
          <div>
            <h1 class="md-title">{{ usuario.nome }}</h1>
            <p class="md-subtitle">Dados do cadastro</p>
          </div>
        </div>

        <!-- Dados Pessoais -->
        <section class="md-section" aria-labelledby="sec-pessoal">
          <h2 id="sec-pessoal" class="md-section__title">Dados Pessoais</h2>
          <div class="md-card">
            <div class="md-row">
              <span class="md-row__label">Nome completo</span>
              <span class="md-row__value">{{ usuario.nome }}</span>
            </div>
            <hr class="md-row__divider" />
            <div class="md-row">
              <span class="md-row__label">CPF</span>
              <span class="md-row__value">{{ usuario.cpf }}</span>
            </div>
            <hr class="md-row__divider" />
            <div class="md-row">
              <span class="md-row__label">Data de Nascimento</span>
              <span class="md-row__value">{{ usuario.dataNascimento }}</span>
            </div>
          </div>
        </section>

        <!-- Contato -->
        <section class="md-section" aria-labelledby="sec-contato">
          <h2 id="sec-contato" class="md-section__title">Contato</h2>
          <div class="md-card">
            <div class="md-row">
              <span class="md-row__label">E-mail</span>
              <span class="md-row__value">{{ usuario.email }}</span>
            </div>
            <hr class="md-row__divider" />
            <div class="md-row">
              <span class="md-row__label">Celular</span>
              <span class="md-row__value">{{ usuario.celular }}</span>
            </div>
            <hr class="md-row__divider" />
            <div class="md-row">
              <span class="md-row__label">Canal preferido</span>
              <span class="md-row__value">{{ usuario.canalPreferido }}</span>
            </div>
          </div>
        </section>

        <!-- Endereço -->
        <section class="md-section" aria-labelledby="sec-endereco">
          <h2 id="sec-endereco" class="md-section__title">Endereço</h2>
          <div class="md-card">
            <div class="md-row">
              <span class="md-row__label">Logradouro</span>
              <span class="md-row__value">{{ endereco.logradouro }}</span>
            </div>
            <hr class="md-row__divider" />
            <div class="md-row">
              <span class="md-row__label">Bairro</span>
              <span class="md-row__value">{{ endereco.bairro }}</span>
            </div>
            <hr class="md-row__divider" />
            <div class="md-row">
              <span class="md-row__label">Cidade / UF</span>
              <span class="md-row__value">{{ endereco.cidade }} – {{ endereco.uf }}</span>
            </div>
            <hr class="md-row__divider" />
            <div class="md-row">
              <span class="md-row__label">CEP</span>
              <span class="md-row__value">{{ endereco.cep }}</span>
            </div>
            <hr class="md-row__divider" />
            <div class="md-row">
              <span class="md-row__label">Tipo de residência</span>
              <span class="md-row__value">{{ endereco.tipoResidencia }}</span>
            </div>
          </div>
        </section>

        <!-- Dados Profissionais -->
        <section class="md-section" aria-labelledby="sec-profissional">
          <h2 id="sec-profissional" class="md-section__title">Dados Profissionais</h2>
          <div class="md-card">
            <div class="md-row">
              <span class="md-row__label">Profissão</span>
              <span class="md-row__value">{{ emprego.profissao }}</span>
            </div>
            <hr class="md-row__divider" />
            <div class="md-row">
              <span class="md-row__label">Situação</span>
              <span class="md-row__value">{{ emprego.situacao }}</span>
            </div>
            <hr class="md-row__divider" />
            <div class="md-row">
              <span class="md-row__label">Renda bruta</span>
              <span class="md-row__value md-row__value--hl">{{ emprego.renda }}</span>
            </div>
          </div>
        </section>

        <p class="md-notice">
          Para alterar seus dados, entre em contato com o suporte da Dock.
        </p>
      </div>
    </main>
  </div>
</template>

<style scoped>
.md-screen { min-height: 100vh; background: #fafcfc; display: flex; flex-direction: column; }
.md-main { flex: 1; padding: 32px 20px 64px; }
.md-inner { max-width: 600px; margin: 0 auto; display: flex; flex-direction: column; gap: 28px; }

.md-page-header { display: flex; align-items: center; gap: 16px; }
.md-avatar { width: 52px; height: 52px; border-radius: 50%; background: #063b3e; color: #ffffff; font-family: "Bricolage Grotesque", sans-serif; font-size: 18px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
.md-title { font-family: "Bricolage Grotesque", sans-serif; font-size: 26px; font-weight: 700; color: #0b2528; margin: 0 0 2px; }
.md-subtitle { font-family: "Instrument Sans", sans-serif; font-size: 16px; color: #5b6b6c; margin: 0; }

.md-section {}
.md-section__title { font-family: "Bricolage Grotesque", sans-serif; font-size: 16px; font-weight: 700; color: #607374; text-transform: uppercase; letter-spacing: 0.07em; margin: 0 0 10px; }

.md-card { background: #ffffff; border: 1px solid #e3edec; border-radius: 16px; box-shadow: 0 4px 16px rgba(6,59,62,0.04); overflow: hidden; }
.md-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; gap: 12px; }
.md-row__label { font-family: "Instrument Sans", sans-serif; font-size: 16px; font-weight: 500; color: #5b6b6c; flex-shrink: 0; }
.md-row__value { font-family: "Instrument Sans", sans-serif; font-size: 16px; color: #0b2528; text-align: right; word-break: break-word; }
.md-row__value--hl { font-family: "Bricolage Grotesque", sans-serif; font-weight: 700; color: #063b3e; }
.md-row__divider { border: none; border-top: 1px solid #f0f6f5; margin: 0; }

.md-notice { font-family: "Instrument Sans", sans-serif; font-size: 16px; color: #607374; text-align: center; line-height: 1.5; }

@media (min-width: 640px) { .md-main { padding: 40px 32px 80px; } .md-title { font-size: 30px; } }
</style>
